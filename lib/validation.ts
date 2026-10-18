import { getAminoAcid } from "./aminoAcids";

export interface FormValues {
  gene: string;
  wildType: string;
  mutant: string;
  position: string | number;
}

export type FormErrors = {
  gene?: string;
  wildType?: string;
  mutant?: string;
  position?: string;
};

export function validateGene(gene: string): string | null {
  if (!gene || gene.trim() === "") {
    return "Gene symbol is required (e.g. TP53).";
  }
  const trimmed = gene.trim();
  if (trimmed.length < 2 || trimmed.length > 15) {
    return "Gene symbol must be between 2 and 15 characters.";
  }
  if (!/^[a-zA-Z0-9]+$/.test(trimmed)) {
    return "Gene symbol can only contain letters and numbers (no spaces or punctuation).";
  }
  return null;
}

export function validateWildType(wt: string): string | null {
  if (!wt || wt.trim() === "") {
    return "Wild-type residue is required.";
  }
  const clean = wt.trim().toUpperCase();
  if (!getAminoAcid(clean)) {
    return `"${wt}" is not one of the 20 standard amino acids.`;
  }
  return null;
}

export function validateMutant(mut: string): string | null {
  if (!mut || mut.trim() === "") {
    return "Mutant residue is required.";
  }
  const clean = mut.trim().toUpperCase();
  if (!getAminoAcid(clean)) {
    return `"${mut}" is not one of the 20 standard amino acids.`;
  }
  return null;
}

export function validateSame(wt: string, mut: string): string | null {
  if (wt && mut && wt.trim().toUpperCase() === mut.trim().toUpperCase()) {
    return "Mutant residue must differ from wild-type residue for a missense variant.";
  }
  return null;
}

export function validatePosition(pos: string | number): string | null {
  if (pos === undefined || pos === null || String(pos).trim() === "") {
    return "Residue index is required.";
  }
  const str = String(pos).trim();
  const num = Number(str);

  if (isNaN(num)) {
    return "Residue index must be a numeric integer.";
  }
  if (!Number.isInteger(num)) {
    return "Residue index must be a whole integer (no decimals).";
  }
  if (num < 1 || num > 35000) {
    return "Residue index must be between 1 and 35000.";
  }
  return null;
}

export function validateAll(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  const geneErr = validateGene(values.gene);
  if (geneErr) errors.gene = geneErr;

  const wtErr = validateWildType(values.wildType);
  if (wtErr) errors.wildType = wtErr;

  const mutErr = validateMutant(values.mutant);
  if (mutErr) errors.mutant = mutErr;

  const sameErr = validateSame(values.wildType, values.mutant);
  if (sameErr && !errors.mutant) {
    errors.mutant = sameErr;
  }

  const posErr = validatePosition(values.position);
  if (posErr) errors.position = posErr;

  return errors;
}
