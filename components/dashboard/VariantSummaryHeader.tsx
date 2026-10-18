"use client";

import React from "react";
import Link from "next/link";
import { Printer, PlusCircle, Calendar, Cpu, Dna, ArrowRight } from "lucide-react";
import { AnalysisResult } from "@/types/variant";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export interface VariantSummaryHeaderProps {
  result: AnalysisResult;
}

export const VariantSummaryHeader: React.FC<VariantSummaryHeaderProps> = ({ result }) => {
  const { query, hgvs, modelVersion, analyzedAt } = result;

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const formattedDate = new Date(analyzedAt).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="brand" size="sm">
            Clinical Genomics Report
          </Badge>
          <span className="text-xs text-slate-400">ID: {result.id.slice(0, 8)}</span>
        </div>

        {/* Large HGVS title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <span>{hgvs}</span>
        </h1>

        {/* Metadata Chips */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs font-semibold">
            <Dna className="w-3.5 h-3.5 text-emerald-600" />
            <span>Gene: {query.gene}</span>
          </div>

          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs">
            <span>Position: {query.position}</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs font-mono font-medium">
            <span>{query.wildType}</span>
            <ArrowRight className="w-3 h-3 text-slate-400" />
            <span className="font-bold text-slate-900 dark:text-white">{query.mutant}</span>
          </div>

          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs">
            <Cpu className="w-3.5 h-3.5 text-slate-400" />
            <span>{modelVersion}</span>
          </div>

          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs text-slate-500 dark:text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons (hidden during print) */}
      <div className="flex items-center gap-2.5 shrink-0 no-print">
        <Link href="/">
          <Button
            variant="secondary"
            size="md"
            leftIcon={<PlusCircle className="w-4 h-4 text-emerald-600" />}
          >
            New Analysis
          </Button>
        </Link>

        <Button
          variant="primary"
          size="md"
          onClick={handlePrint}
          leftIcon={<Printer className="w-4 h-4" />}
        >
          Print / Save PDF
        </Button>
      </div>
    </div>
  );
};
