"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { Dna, ArrowLeft, ShieldAlert, Sparkles, CheckCircle2, AlertTriangle, HelpCircle } from "lucide-react";
import { AnalysisResult } from "@/types/variant";
import { getLatestResult } from "@/lib/storage";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { VariantSummaryHeader } from "@/components/dashboard/VariantSummaryHeader";
import { VerdictBadge } from "@/components/dashboard/VerdictBadge";
import { ProbabilityGauge } from "@/components/dashboard/ProbabilityGauge";
import { RedFlagsSection } from "@/components/dashboard/RedFlagsSection";
import { FeatureContributionChart } from "@/components/dashboard/FeatureContributionChart";
import { ClinicalNoteBox } from "@/components/dashboard/ClinicalNoteBox";

export default function ResultsPage() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Read from localStorage safely after mount
    const latest = getLatestResult();
    setResult(latest);
    setLoading(false);
  }, []);

  // Loading Skeleton
  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-xl w-full" />
        <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-xl w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-36 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="h-36 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="h-36 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        </div>
        <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-xl w-full" />
      </div>
    );
  }

  // Empty State (no analysis has been performed yet)
  if (!result) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-5 animate-fade-in">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-[#059669] flex items-center justify-center border border-emerald-200 dark:border-emerald-800 shadow-sm">
          <Dna className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            No Variant Analysis Found
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Please enter a missense genetic variant on the analysis form to view the complete clinical risk dashboard.
          </p>
        </div>
        <Link href="/">
          <Button
            variant="primary"
            size="md"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Analyze a Variant
          </Button>
        </Link>
      </div>
    );
  }

  const { verdict, probability, features, redFlags, contributions, clinicalNote } = result;

  // Background tint based on verdict
  const heroTint =
    verdict === "Pathogenic"
      ? "bg-gradient-to-br from-red-50/80 via-white to-red-50/30 dark:from-red-950/20 dark:via-slate-900 dark:to-red-950/10 border-red-200 dark:border-red-900/60"
      : verdict === "Benign"
      ? "bg-gradient-to-br from-emerald-50/80 via-white to-emerald-50/30 dark:from-emerald-950/20 dark:via-slate-900 dark:to-emerald-950/10 border-emerald-200 dark:border-emerald-900/60"
      : "bg-gradient-to-br from-amber-50/80 via-white to-amber-50/30 dark:from-amber-950/20 dark:via-slate-900 dark:to-amber-950/10 border-amber-200 dark:border-amber-900/60";

  return (
    <div className="space-y-7">
      {/* A) Variant Summary Header */}
      <section className="animate-fade-in stagger-1">
        <VariantSummaryHeader result={result} />
      </section>

      {/* B) Hero Risk Card (2 Columns) */}
      <section className="animate-fade-in stagger-2 print-avoid-break">
        <Card className={clsx("border shadow-sm p-6", heroTint)}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Left Column: Verdict Badge & Clinical Summary */}
            <div className="md:col-span-7 space-y-4">
              <VerdictBadge verdict={verdict} probability={probability} />

              <div className="space-y-1.5">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {verdict === "Pathogenic"
                    ? "Predicted High Risk of Deleterious Functional Impact"
                    : verdict === "Benign"
                    ? "Predicted Low Risk / Functionally Tolerated"
                    : "Variant of Uncertain Clinical Significance"}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {verdict === "Pathogenic"
                    ? "The machine learning classifier identified strong biophysical destabilization signals and evolutionary constraint violation. Classified under ACMG/AMP clinical risk triage guidelines."
                    : verdict === "Benign"
                    ? "Physicochemical properties, hydropathy, and charge neutrality remain conserved. The alteration is projected to preserve baseline protein functional integrity."
                    : "Biochemical attributes exhibit conflicting signals. Additional functional essays and clinical segregation data are required before assigning definitive classification."}
                </p>
              </div>

              {/* Quick Summary Highlights */}
              <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Calibrated XGBoost Model</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>5 Physicochemical Vectors</span>
                </div>
              </div>
            </div>

            {/* Right Column: Probability Gauge */}
            <div className="md:col-span-5 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-slate-200/80 dark:border-slate-800/80 pt-4 md:pt-0">
              <ProbabilityGauge probability={probability} verdict={verdict} />
            </div>
          </div>
        </Card>
      </section>

      {/* C) Biochemical Red Flags Section */}
      <section className="animate-fade-in stagger-3 print-avoid-break">
        <RedFlagsSection features={features} redFlags={redFlags} />
      </section>

      {/* D) Feature Contribution Chart */}
      <section className="animate-fade-in stagger-4 print-avoid-break">
        <FeatureContributionChart contributions={contributions} />
      </section>

      {/* E) Clinical Note Box & Disclaimer */}
      <section className="animate-fade-in stagger-5 print-avoid-break">
        <ClinicalNoteBox clinicalNote={clinicalNote} verdict={verdict} />
      </section>
    </div>
  );
}
