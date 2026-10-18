import { AnalysisResult, FeatureContribution, RedFlag, VariantQuery, Verdict } from "@/types/variant";
import { buildHgvs, getAminoAcid, toThreeLetter } from "./aminoAcids";
import { BENIGN_MOCK, PATHOGENIC_MOCK } from "./mockData";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

// Standard BLOSUM62 matrix lookup for amino acid pairs
const BLOSUM62: Record<string, Record<string, number>> = {
  A: { A: 4, R: -1, N: -2, D: -2, C: 0, Q: -1, E: -1, G: 0, H: -2, I: -1, L: -1, K: -1, M: -1, F: -2, P: -1, S: 1, T: 0, W: -3, Y: -2, V: 0 },
  R: { A: -1, R: 5, N: 0, D: -2, C: -3, Q: 1, E: 0, G: -2, H: 0, I: -3, L: -2, K: 2, M: -1, F: -3, P: -2, S: -1, T: -1, W: -3, Y: -2, V: -3 },
  N: { A: -2, R: 0, N: 6, D: 1, C: -3, Q: 0, E: 0, G: 0, H: 1, I: -3, L: -3, K: 0, M: -2, F: -3, P: -2, S: 1, T: 0, W: -4, Y: -2, V: -3 },
  D: { A: -2, R: -2, N: 1, D: 6, C: -3, Q: 0, E: 2, G: -1, H: -1, I: -3, L: -4, K: -1, M: -3, F: -3, P: -1, S: 0, T: -1, W: -4, Y: -3, V: -3 },
  C: { A: 0, R: -3, N: -3, D: -3, C: 9, Q: -3, E: -4, G: -3, H: -3, I: -1, L: -1, K: -3, M: -1, F: -2, P: -3, S: -1, T: -1, W: -2, Y: -2, V: -1 },
  Q: { A: -1, R: 1, N: 0, D: 0, C: -3, Q: 5, E: 2, G: -2, H: 0, I: -3, L: -2, K: 1, M: 0, F: -3, P: -1, S: 0, T: -1, W: -2, Y: -1, V: -2 },
  E: { A: -1, R: 0, N: 0, D: 2, C: -4, Q: 2, E: 5, G: -2, H: 0, I: -3, L: -3, K: 1, M: -2, F: -3, P: -1, S: 0, T: -1, W: -3, Y: -2, V: -2 },
  G: { A: 0, R: -2, N: 0, D: -1, C: -3, Q: -2, E: -2, G: 6, H: -2, I: -4, L: -4, K: -2, M: -3, F: -3, P: -2, S: 0, T: -2, W: -2, Y: -3, V: -3 },
  H: { A: -2, R: 0, N: 1, D: -1, C: -3, Q: 0, E: 0, G: -2, H: 8, I: -3, L: -3, K: -1, M: -2, F: -1, P: -2, S: -1, T: -2, W: -2, Y: 2, V: -3 },
  I: { A: -1, R: -3, N: -3, D: -3, C: -1, Q: -3, E: -3, G: -4, H: -3, I: 4, L: 2, K: -3, M: 1, F: 0, P: -3, S: -2, T: -1, W: -3, Y: -1, V: 3 },
  L: { A: -1, R: -2, N: -3, D: -4, C: -1, Q: -2, E: -3, G: -4, H: -3, I: 2, L: 4, K: -2, M: 2, F: 0, P: -3, S: -2, T: -1, W: -2, Y: -1, V: 1 },
  K: { A: -1, R: 2, N: 0, D: -1, C: -3, Q: 1, E: 1, G: -2, H: -1, I: -3, L: -2, K: 5, M: -1, F: -3, P: -1, S: 0, T: -1, W: -3, Y: -2, V: -2 },
  M: { A: -1, R: -1, N: -2, D: -3, C: -1, Q: 0, E: -2, G: -3, H: -2, I: 1, L: 2, K: -1, M: 5, F: 0, P: -2, S: -1, T: -1, W: -1, Y: -1, V: 1 },
  F: { A: -2, R: -3, N: -3, D: -3, C: -2, Q: -3, E: -3, G: -3, H: -1, I: 0, L: 0, K: -3, M: 0, F: 6, P: -4, S: -2, T: -2, W: 1, Y: 3, V: -1 },
  P: { A: -1, R: -2, N: -2, D: -1, C: -3, Q: -1, E: -1, G: -2, H: -2, I: -3, L: -3, K: -1, M: -2, F: -4, P: 7, S: -1, T: -1, W: -4, Y: -3, V: -2 },
  S: { A: 1, R: -1, N: 1, D: 0, C: -1, Q: 0, E: 0, G: 0, H: -1, I: -2, L: -2, K: 0, M: -1, F: -2, P: -1, S: 4, T: 1, W: -3, Y: -2, V: -2 },
  T: { A: 0, R: -1, N: 0, D: -1, C: -1, Q: -1, E: -1, G: -2, H: -2, I: -1, L: -1, K: -1, M: -1, F: -2, P: -1, S: 1, T: 5, W: -2, Y: -2, V: 0 },
  W: { A: -3, R: -3, N: -4, D: -4, C: -2, Q: -2, E: -3, G: -2, H: -2, I: -3, L: -2, K: -3, M: -1, F: 1, P: -4, S: -3, T: -2, W: 11, Y: 2, V: -3 },
  Y: { A: -2, R: -2, N: -2, D: -3, C: -2, Q: -1, E: -2, G: -3, H: 2, I: -1, L: -1, K: -2, M: -1, F: 3, P: -3, S: -2, T: -2, W: 2, Y: 7, V: -1 },
  V: { A: 0, R: -3, N: -3, D: -3, C: -1, Q: -2, E: -2, G: -3, H: -3, I: 3, L: 1, K: -2, M: 1, F: -1, P: -2, S: -2, T: 0, W: -3, Y: -1, V: 4 }
};

function getBlosum62(wt: string, mut: string): number {
  const w = wt.toUpperCase();
  const m = mut.toUpperCase();
  return BLOSUM62[w]?.[m] ?? -1;
}

const CONSERVATIVE_PAIRS = new Set([
  "I-V", "V-I", "L-I", "I-L", "K-R", "R-K",
  "D-E", "E-D", "S-T", "T-S", "F-Y", "Y-F"
]);

function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "var-" + Math.random().toString(36).substring(2, 11);
}

export async function analyzeVariant(query: VariantQuery): Promise<AnalysisResult> {
  // TODO(BACKEND): replace this body with fetch(`${API_BASE_URL}/predict`, { method: "POST", body: JSON.stringify(query) })

  // Simulate network latency (about 900ms)
  await new Promise((resolve) => setTimeout(resolve, 900));

  const cleanGene = query.gene.trim().toUpperCase();
  const cleanWt = query.wildType.trim().toUpperCase();
  const cleanMut = query.mutant.trim().toUpperCase();
  const pos = Number(query.position);
  const now = new Date().toISOString();
  const pairKey = `${cleanWt}-${cleanMut}`;

  // Case 1: TP53 R248W -> PATHOGENIC_MOCK
  if (cleanGene === "TP53" && cleanWt === "R" && cleanMut === "W" && pos === 248) {
    return {
      ...PATHOGENIC_MOCK,
      id: generateId(),
      analyzedAt: now
    };
  }

  // Case 2: Conservative substitutions -> BENIGN_MOCK with updated details
  if (CONSERVATIVE_PAIRS.has(pairKey)) {
    const hgvs = buildHgvs(cleanGene, cleanWt, pos, cleanMut);
    const wtAA = getAminoAcid(cleanWt);
    const mutAA = getAminoAcid(cleanMut);
    const mwDelta = wtAA && mutAA ? +(mutAA.molecularWeight - wtAA.molecularWeight).toFixed(2) : -14.03;
    const hydroDelta = wtAA && mutAA ? +(mutAA.hydropathy - wtAA.hydropathy).toFixed(1) : 0.3;

    return {
      ...BENIGN_MOCK,
      id: generateId(),
      query: {
        gene: cleanGene,
        wildType: cleanWt,
        mutant: cleanMut,
        position: pos
      },
      hgvs,
      features: {
        ...BENIGN_MOCK.features,
        molecularWeightDelta: mwDelta,
        hydropathyDelta: hydroDelta
      },
      analyzedAt: now
    };
  }

  // Case 3: Dynamic evaluation based on biochemical features
  const wtAA = getAminoAcid(cleanWt);
  const mutAA = getAminoAcid(cleanMut);

  const wtHydro = wtAA ? wtAA.hydropathy : 0;
  const mutHydro = mutAA ? mutAA.hydropathy : 0;
  const hydroDelta = +(mutHydro - wtHydro).toFixed(1);

  const wtCharge = wtAA ? wtAA.charge : "Neutral";
  const mutCharge = mutAA ? mutAA.charge : "Neutral";

  const wtWeight = wtAA ? wtAA.molecularWeight : 120;
  const mutWeight = mutAA ? mutAA.molecularWeight : 120;
  const mwDelta = +(mutWeight - wtWeight).toFixed(2);

  const blosum = getBlosum62(cleanWt, cleanMut);

  let chargeLabel = "No Charge Change";
  let chargeDeltaScore = 0;
  if (wtCharge !== mutCharge) {
    if (
      (wtCharge === "Positive" && mutCharge === "Negative") ||
      (wtCharge === "Negative" && mutCharge === "Positive")
    ) {
      chargeLabel = "Charge Inversion";
      chargeDeltaScore = 32;
    } else if (wtCharge === "Positive" && mutCharge === "Neutral") {
      chargeLabel = "Charge Loss (Cationic)";
      chargeDeltaScore = 20;
    } else if (wtCharge === "Negative" && mutCharge === "Neutral") {
      chargeLabel = "Charge Loss (Anionic)";
      chargeDeltaScore = 20;
    } else {
      chargeLabel = `Charge Gain (${mutCharge})`;
      chargeDeltaScore = 20;
    }
  }

  let blosumLabel = "Tolerated Substitution";
  if (blosum <= -3) blosumLabel = "Rare Swap";
  else if (blosum < 0) blosumLabel = "Non-Conservative Substitution";
  else if (blosum >= 2) blosumLabel = "Conservative Substitution";

  let hydropathyLabel = "Minimal Shift";
  const absHydro = Math.abs(hydroDelta);
  if (absHydro >= 3.0) hydropathyLabel = hydroDelta > 0 ? "Severe Hydrophobic Shift" : "Severe Hydrophilic Shift";
  else if (absHydro >= 1.5) hydropathyLabel = hydroDelta > 0 ? "Moderate Hydrophobic Shift" : "Moderate Hydrophilic Shift";

  // Calculate dynamic probability (0 to 100)
  // Base 45% + BLOSUM impact (-4 to +11 -> +/- 25) + Hydropathy impact (+/- 20) + Charge (+/- 25) + MW
  let baseProb = 48;
  baseProb += -blosum * 5.2; // negative blosum increases pathogenic probability
  baseProb += absHydro * 4.5;
  baseProb += chargeDeltaScore;
  baseProb += (Math.abs(mwDelta) / 80) * 8;

  // Add deterministic position factor
  const pseudoPosition = ((pos * 31) % 100) / 100;
  baseProb += (pseudoPosition - 0.5) * 8;

  // Clamp probability between 3.5% and 97.5%
  let calculatedProb = Math.min(97.5, Math.max(3.5, baseProb));
  calculatedProb = +(calculatedProb).toFixed(1);

  // Verdict criteria: Pathogenic if >= 70, Benign if <= 30, otherwise Uncertain
  let verdict: Verdict = "Uncertain";
  if (calculatedProb >= 70.0) {
    verdict = "Pathogenic";
  } else if (calculatedProb <= 30.0) {
    verdict = "Benign";
  } else {
    verdict = "Uncertain";
  }

  // Red flags determination
  const redFlags: RedFlag[] = [
    {
      title: "BLOSUM62 Substitution Score",
      value: (blosum > 0 ? `+${blosum}.0` : `${blosum}.0`),
      severity: blosum <= -2 ? "high" : blosum < 1 ? "medium" : "low",
      description:
        blosum < 0
          ? "Unfavorable evolutionary substitution frequency across ortholog alignments."
          : "Favorable evolutionary substitution frequency indicating functional compatibility."
    },
    {
      title: "Δ Hydropathy (Kyte-Doolittle)",
      value: (hydroDelta > 0 ? `+${hydroDelta}` : `${hydroDelta}`),
      severity: absHydro >= 3.0 ? "high" : absHydro >= 1.5 ? "medium" : "low",
      description:
        absHydro >= 1.5
          ? "Substantial alteration in local residue hydrophobicity perturbing fold stability."
          : "Mild hydropathic alteration within normal solvent tolerance boundaries."
    },
    {
      title: "Electrostatic Charge Change",
      value: `${wtCharge} (${wtCharge === "Positive" ? "+" : wtCharge === "Negative" ? "-" : "0"}) → ${mutCharge} (${mutCharge === "Positive" ? "+" : mutCharge === "Negative" ? "-" : "0"})`,
      severity: chargeDeltaScore >= 30 ? "high" : chargeDeltaScore > 0 ? "medium" : "low",
      description:
        chargeDeltaScore > 0
          ? "Sidechain electrostatic shift likely altering regional tertiary charge distribution."
          : "Net electrostatic neutrality maintained across the substituted locus."
    }
  ];

  // Feature contributions calculation (normalized to sum reasonably)
  const isPath = calculatedProb >= 50;
  const sign = isPath ? 1 : -1;
  const blosumImpact = +(-blosum * 0.08).toFixed(2);
  const hydroImpact = +(absHydro * 0.07 * sign).toFixed(2);
  const chargeImpact = +(chargeDeltaScore > 0 ? 0.21 * sign : -0.16).toFixed(2);
  const mwImpact = +((Math.abs(mwDelta) / 100) * 0.12 * sign).toFixed(2);
  const posImpact = +(0.04 * sign).toFixed(2);

  const contributions: FeatureContribution[] = [
    { feature: "BLOSUM62 Score", impact: blosumImpact },
    { feature: "Hydropathy Shift", impact: hydroImpact },
    { feature: "Charge Change", impact: chargeImpact },
    { feature: "Molecular Weight", impact: mwImpact },
    { feature: "Relative Position", impact: posImpact }
  ].sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));

  // Clinical note tailored to verdict
  let clinicalNote = "";
  if (verdict === "Pathogenic") {
    clinicalNote = `Marked biochemical disruption detected (${blosumLabel.toLowerCase()}, ${hydropathyLabel.toLowerCase()}). High likelihood of destabilizing protein fold or functional domain. Confirmatory functional assay recommended.`;
  } else if (verdict === "Benign") {
    clinicalNote = `Substitution is conservative with minimal biochemical disruption. Preserved charge and hydropathy suggest functional retention. Routine clinical follow-up advised.`;
  } else {
    clinicalNote = `Moderate biochemical alterations observed. Variant displays borderline functional metrics. Additional clinical evidence or family co-segregation studies required for definitive classification.`;
  }

  const hgvs = buildHgvs(cleanGene, cleanWt, pos, cleanMut);
  const relativePosition = +Math.min(1.0, Math.max(0.05, (pos % 500 + 40) / 600)).toFixed(2);

  return {
    id: generateId(),
    query: {
      gene: cleanGene,
      wildType: cleanWt,
      mutant: cleanMut,
      position: pos
    },
    hgvs,
    verdict,
    probability: calculatedProb,
    features: {
      blosum62Score: blosum,
      blosumLabel,
      hydropathyDelta: hydroDelta,
      hydropathyLabel,
      chargeBefore: wtCharge,
      chargeAfter: mutCharge,
      chargeLabel,
      molecularWeightDelta: mwDelta,
      relativePosition
    },
    redFlags,
    contributions,
    clinicalNote,
    modelVersion: "XGBoost v0.1-mock",
    analyzedAt: now
  };
}
