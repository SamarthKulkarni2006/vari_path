import React from "react";
import clsx from "clsx";
import { Info } from "lucide-react";

export interface DisclaimerProps {
  className?: string;
  compact?: boolean;
}

export const Disclaimer: React.FC<DisclaimerProps> = ({
  className,
  compact = false
}) => {
  return (
    <div
      role="note"
      className={clsx(
        "flex items-start gap-2.5 rounded-lg border border-slate-200 bg-slate-50/80 text-slate-600 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400",
        compact ? "p-2.5 text-[11px] leading-relaxed" : "p-3 text-xs leading-relaxed",
        className
      )}
    >
      <Info className={clsx("shrink-0 text-slate-400 mt-0.5", compact ? "w-3.5 h-3.5" : "w-4 h-4")} />
      <span>
        <strong>Clinical Disclaimer:</strong> Statistical risk tool for research and clinical triage; not an autonomous clinical diagnostic verdict. Always correlate with primary genomic sequencing, patient phenotype, and established clinical guidelines.
      </span>
    </div>
  );
};
