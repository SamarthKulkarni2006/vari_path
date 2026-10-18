import { AnalysisResult } from "@/types/variant";

export const PATHOGENIC_MOCK: AnalysisResult = {
  id: "mock-tp53-r248w",
  query: {
    gene: "TP53",
    wildType: "R",
    mutant: "W",
    position: 248
  },
  hgvs: "TP53 p.Arg248Trp",
  verdict: "Pathogenic",
  probability: 91.4,
  features: {
    blosum62Score: -3,
    blosumLabel: "Rare Swap",
    hydropathyDelta: 3.6,
    hydropathyLabel: "Severe Hydrophobic Shift",
    chargeBefore: "Positive",
    chargeAfter: "Neutral",
    chargeLabel: "Charge Loss",
    molecularWeightDelta: 30.02,
    relativePosition: 0.63
  },
  redFlags: [
    {
      title: "BLOSUM62 Substitution Score",
      value: "-3.0",
      severity: "high",
      description: "Infrequent evolutionary substitution across homologous proteins, indicating high evolutionary constraint."
    },
    {
      title: "Δ Hydropathy (Kyte-Doolittle)",
      value: "+3.6",
      severity: "high",
      description: "Severe increase in local residue hydrophobicity likely disrupting solvent interaction and packing."
    },
    {
      title: "Electrostatic Charge Change",
      value: "Positive (+) → Neutral (0)",
      severity: "medium",
      description: "Loss of basic cationic sidechain destabilizes critical salt-bridge and DNA phosphate backbone contact."
    }
  ],
  contributions: [
    { feature: "BLOSUM62 Score", impact: 0.31 },
    { feature: "Hydropathy Shift", impact: 0.27 },
    { feature: "Charge Change", impact: 0.22 },
    { feature: "Molecular Weight", impact: 0.08 },
    { feature: "Relative Position", impact: 0.04 }
  ],
  clinicalNote: "High likelihood of destabilizing protein DNA-binding interface. Confirmatory functional assay recommended.",
  modelVersion: "XGBoost v0.1-mock",
  analyzedAt: "2026-10-16T12:00:00.000Z"
};

export const BENIGN_MOCK: AnalysisResult = {
  id: "mock-brca1-i1234v",
  query: {
    gene: "BRCA1",
    wildType: "I",
    mutant: "V",
    position: 1234
  },
  hgvs: "BRCA1 p.Ile1234Val",
  verdict: "Benign",
  probability: 8.7,
  features: {
    blosum62Score: 3,
    blosumLabel: "Conservative Substitution",
    hydropathyDelta: 0.3,
    hydropathyLabel: "Minimal Shift",
    chargeBefore: "Neutral",
    chargeAfter: "Neutral",
    chargeLabel: "No Charge Change",
    molecularWeightDelta: -14.03,
    relativePosition: 0.66
  },
  redFlags: [
    {
      title: "BLOSUM62 Substitution Score",
      value: "+3.0",
      severity: "low",
      description: "Frequently tolerated substitution preserving protein core architecture and steric properties."
    },
    {
      title: "Δ Hydropathy (Kyte-Doolittle)",
      value: "-0.3",
      severity: "low",
      description: "Minimal hydropathic fluctuation well within normal aliphatic hydrophobic tolerance."
    },
    {
      title: "Electrostatic Charge Change",
      value: "Neutral (0) → Neutral (0)",
      severity: "low",
      description: "Isoelectric profile conserved; no disruption to electrostatic binding surfaces."
    }
  ],
  contributions: [
    { feature: "BLOSUM62 Score", impact: -0.34 },
    { feature: "Hydropathy Shift", impact: -0.28 },
    { feature: "Charge Change", impact: -0.18 },
    { feature: "Molecular Weight", impact: -0.06 },
    { feature: "Relative Position", impact: -0.02 }
  ],
  clinicalNote: "Substitution is conservative with minimal biochemical disruption. Unlikely to affect protein function.",
  modelVersion: "XGBoost v0.1-mock",
  analyzedAt: "2026-10-16T12:00:00.000Z"
};
