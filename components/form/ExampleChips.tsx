"use client";

import React from "react";
import clsx from "clsx";
import { Sparkles, ShieldAlert, ShieldCheck } from "lucide-react";

export interface ExampleVariant {
  label: string;
  badge: "Pathogenic" | "Benign";
  gene: string;
  wildType: string;
  mutant: string;
  position: number;
}

const EXAMPLES: ExampleVariant[] = [
  {
    label: "TP53 R248W",
    badge: "Pathogenic",
    gene: "TP53",
    wildType: "R",
    mutant: "W",
    position: 248
  },
  {
    label: "BRCA1 I1234V",
    badge: "Benign",
    gene: "BRCA1",
    wildType: "I",
    mutant: "V",
    position: 1234
  }
];

export interface ExampleChipsProps {
  onSelect: (example: ExampleVariant) => void;
  disabled?: boolean;
}

export const ExampleChips: React.FC<ExampleChipsProps> = ({
  onSelect,
  disabled = false
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2 pt-1">
      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 mr-1">
        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        <span>Try an example:</span>
      </div>

      {EXAMPLES.map((ex) => {
        const isPath = ex.badge === "Pathogenic";
        return (
          <button
            key={ex.label}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(ex)}
            className={clsx(
              "group inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed",
              isPath
                ? "bg-red-50/70 hover:bg-red-100 text-red-800 border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-900"
                : "bg-emerald-50/70 hover:bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-900"
            )}
          >
            {isPath ? (
              <ShieldAlert className="w-3.5 h-3.5 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform" />
            ) : (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
            )}
            <span className="font-semibold">{ex.label}</span>
            <span className="text-[10px] opacity-75">({ex.badge} example)</span>
          </button>
        );
      })}
    </div>
  );
};
