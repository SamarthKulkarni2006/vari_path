"""Create a small, reproducible missense-variant dataset from ClinVar CSV data.

Run from the project folder with:
    python scripts/process_clinvar.py

The source CSV is read-only. The processed output is written to
data/clinvar_processed.csv.
"""

import csv
import re
from collections import Counter
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[1]
INPUT_FILE = PROJECT_ROOT / "data" / "clinvar_labeled.csv"
OUTPUT_FILE = PROJECT_ROOT / "data" / "clinvar_processed.csv"

# The parenthesized p. change in ClinVar's Name field gives the canonical
# protein substitution. Stop-gain forms such as p.Gln1826Ter do not match.
PROTEIN_CHANGE = re.compile(r"\(p\.([A-Z][a-z]{2})(\d+)([A-Z][a-z]{2})\)")

THREE_TO_ONE = {
    "Ala": "A", "Arg": "R", "Asn": "N", "Asp": "D", "Cys": "C",
    "Gln": "Q", "Glu": "E", "Gly": "G", "His": "H", "Ile": "I",
    "Leu": "L", "Lys": "K", "Met": "M", "Phe": "F", "Pro": "P",
    "Ser": "S", "Thr": "T", "Trp": "W", "Tyr": "Y", "Val": "V",
}
ALLOWED_GENES = {"TP53", "BRCA1"}
ALLOWED_LABELS = {"pathogenic", "benign"}


def main() -> None:
    with INPUT_FILE.open("r", encoding="utf-8-sig", newline="") as source:
        source_rows = list(csv.DictReader(source))

    processed_rows = []
    skipped = Counter()

    for row in source_rows:
        if row["Variant type"].strip().lower() != "single nucleotide variant":
            skipped["not an SNV"] += 1
            continue

        gene = row["Gene(s)"].strip()
        if gene not in ALLOWED_GENES:
            skipped["gene missing, other, or ambiguous"] += 1
            continue

        label = row["label"].strip().lower()
        if label not in ALLOWED_LABELS:
            skipped["label not benign/pathogenic"] += 1
            continue

        match = PROTEIN_CHANGE.search(row["Name"])
        if not match:
            skipped["no simple canonical amino-acid substitution"] += 1
            continue

        reference_three, position, alternate_three = match.groups()
        if reference_three not in THREE_TO_ONE or alternate_three not in THREE_TO_ONE:
            skipped["unknown amino-acid code"] += 1
            continue

        processed_rows.append({
            "accession": row["Accession"].strip(),
            "variant_name": row["Name"].strip(),
            "gene": gene,
            "wild_type": THREE_TO_ONE[reference_three],
            "position": position,
            "mutant": THREE_TO_ONE[alternate_three],
            "label": label,
            "germline_classification": row["Germline classification"].strip(),
        })

    fieldnames = [
        "accession", "variant_name", "gene", "wild_type", "position",
        "mutant", "label", "germline_classification",
    ]
    with OUTPUT_FILE.open("w", encoding="utf-8", newline="") as output:
        writer = csv.DictWriter(output, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(processed_rows)

    print(f"Source rows: {len(source_rows)}")
    print(f"Processed rows: {len(processed_rows)}")
    print(f"Skipped rows: {sum(skipped.values())}")
    print("Skipped by reason:")
    for reason, count in sorted(skipped.items()):
        print(f"  {reason}: {count}")
    print("Rows by gene:", dict(Counter(row["gene"] for row in processed_rows)))
    print("Rows by label:", dict(Counter(row["label"] for row in processed_rows)))
    print(f"Output: {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
