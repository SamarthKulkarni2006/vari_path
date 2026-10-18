export type AminoAcidCharge = "Positive" | "Negative" | "Neutral";

export interface AminoAcid {
  code: string;        // 1-letter code, e.g. 'A'
  threeLetter: string; // 3-letter code, e.g. 'Ala'
  name: string;        // Full name, e.g. 'Alanine'
  hydropathy: number;  // Kyte-Doolittle scale
  charge: AminoAcidCharge; // At pH 7.0: Positive for R and K, Negative for D and E, Neutral for others
  molecularWeight: number; // in g/mol (Daltons)
}

export const AMINO_ACIDS: AminoAcid[] = [
  { code: "A", threeLetter: "Ala", name: "Alanine", hydropathy: 1.8, charge: "Neutral", molecularWeight: 89.09 },
  { code: "R", threeLetter: "Arg", name: "Arginine", hydropathy: -4.5, charge: "Positive", molecularWeight: 174.20 },
  { code: "N", threeLetter: "Asn", name: "Asparagine", hydropathy: -3.5, charge: "Neutral", molecularWeight: 132.12 },
  { code: "D", threeLetter: "Asp", name: "Aspartate", hydropathy: -3.5, charge: "Negative", molecularWeight: 133.10 },
  { code: "C", threeLetter: "Cys", name: "Cysteine", hydropathy: 2.5, charge: "Neutral", molecularWeight: 121.16 },
  { code: "E", threeLetter: "Glu", name: "Glutamate", hydropathy: -3.5, charge: "Negative", molecularWeight: 147.13 },
  { code: "Q", threeLetter: "Gln", name: "Glutamine", hydropathy: -3.5, charge: "Neutral", molecularWeight: 146.15 },
  { code: "G", threeLetter: "Gly", name: "Glycine", hydropathy: -0.4, charge: "Neutral", molecularWeight: 75.07 },
  { code: "H", threeLetter: "His", name: "Histidine", hydropathy: -3.2, charge: "Neutral", molecularWeight: 155.16 },
  { code: "I", threeLetter: "Ile", name: "Isoleucine", hydropathy: 4.5, charge: "Neutral", molecularWeight: 131.17 },
  { code: "L", threeLetter: "Leu", name: "Leucine", hydropathy: 3.8, charge: "Neutral", molecularWeight: 131.17 },
  { code: "K", threeLetter: "Lys", name: "Lysine", hydropathy: -3.9, charge: "Positive", molecularWeight: 146.19 },
  { code: "M", threeLetter: "Met", name: "Methionine", hydropathy: 1.9, charge: "Neutral", molecularWeight: 149.21 },
  { code: "F", threeLetter: "Phe", name: "Phenylalanine", hydropathy: 2.8, charge: "Neutral", molecularWeight: 165.19 },
  { code: "P", threeLetter: "Pro", name: "Proline", hydropathy: -1.6, charge: "Neutral", molecularWeight: 115.13 },
  { code: "S", threeLetter: "Ser", name: "Serine", hydropathy: -0.8, charge: "Neutral", molecularWeight: 105.09 },
  { code: "T", threeLetter: "Thr", name: "Threonine", hydropathy: -0.7, charge: "Neutral", molecularWeight: 119.12 },
  { code: "W", threeLetter: "Trp", name: "Tryptophan", hydropathy: -0.9, charge: "Neutral", molecularWeight: 204.23 },
  { code: "Y", threeLetter: "Tyr", name: "Tyrosine", hydropathy: -1.3, charge: "Neutral", molecularWeight: 181.19 },
  { code: "V", threeLetter: "Val", name: "Valine", hydropathy: 4.2, charge: "Neutral", molecularWeight: 117.15 }
];

const AA_MAP = new Map<string, AminoAcid>(
  AMINO_ACIDS.map((aa) => [aa.code.toUpperCase(), aa])
);

export function getAminoAcid(letter: string): AminoAcid | undefined {
  if (!letter) return undefined;
  return AA_MAP.get(letter.trim().toUpperCase());
}

export function toThreeLetter(letter: string): string {
  const aa = getAminoAcid(letter);
  return aa ? aa.threeLetter : letter.toUpperCase();
}

export function buildHgvs(gene: string, wt: string, pos: number, mut: string): string {
  const wt3 = toThreeLetter(wt);
  const mut3 = toThreeLetter(mut);
  const cleanGene = gene.trim().toUpperCase();
  return `${cleanGene} p.${wt3}${pos}${mut3}`;
}
