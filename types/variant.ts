export type Verdict = "Pathogenic" | "Benign" | "Uncertain";

export interface VariantQuery {
  gene: string;
  wildType: string;
  mutant: string;
  position: number;
}

export interface BiochemicalFeatures {
  blosum62Score: number;
  blosumLabel: string;
  hydropathyDelta: number;
  hydropathyLabel: string;
  chargeBefore: "Positive" | "Negative" | "Neutral";
  chargeAfter: "Positive" | "Negative" | "Neutral";
  chargeLabel: string;
  molecularWeightDelta: number;
  relativePosition: number; // 0 to 1
}

export interface FeatureContribution {
  feature: string;
  impact: number; // positive = pushes toward Pathogenic, negative = pushes toward Benign
}

export interface RedFlag {
  title: string;
  value: string;
  severity: "high" | "medium" | "low";
  description: string;
}

export interface AnalysisResult {
  id: string;
  query: VariantQuery;
  hgvs: string;
  verdict: Verdict;
  probability: number; // 0 to 100 (probability of pathogenic)
  features: BiochemicalFeatures;
  redFlags: RedFlag[];
  contributions: FeatureContribution[];
  clinicalNote: string;
  modelVersion: string;
  analyzedAt: string;
}

export interface HistoryEntry {
  id: string;
  gene: string;
  hgvs: string;
  verdict: Verdict;
  probability: number;
  analyzedAt: string;
  result: AnalysisResult;
}
