import React from "react";
import clsx from "clsx";
import { Lightbulb, Stethoscope, ArrowRight } from "lucide-react";
import { Verdict } from "@/types/variant";
import { Disclaimer } from "@/components/ui/Disclaimer";

export interface ClinicalNoteBoxProps {
  clinicalNote: string;
  verdict: Verdict;
}

export const ClinicalNoteBox: React.FC<ClinicalNoteBoxProps> = ({
  clinicalNote,
  verdict
}) => {
  const isPathogenic = verdict === "Pathogenic";
  const isBenign = verdict === "Benign";

  const borderColor = isPathogenic
    ? "border-l-[#DC2626]"
    : isBenign
    ? "border-l-[#16A34A]"
    : "border-l-[#D97706]";

  const nextStep = isPathogenic
    ? "Confirmatory functional assay / specialist review"
    : isBenign
    ? "Routine follow-up per clinical guidelines"
    : "Additional evidence required";

  const nextStepBadge = isPathogenic
    ? "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 border-red-200 dark:border-red-800"
    : isBenign
    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
    : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800";

  return (
    <div className="space-y-4">
      <div
        className={clsx(
          "p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs border-l-4 space-y-3",
          borderColor
        )}
      >
        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
          <div className="p-1 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
            <Lightbulb className="w-4 h-4" />
          </div>
          <span>Clinical Note</span>
        </div>

        <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-normal">
          {clinicalNote}
        </p>

        {/* Recommended next step */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <Stethoscope className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="font-semibold">Recommended next step:</span>
          </div>

          <div
            className={clsx(
              "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border",
              nextStepBadge
            )}
          >
            <span>{nextStep}</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* Embedded Disclaimer */}
      <Disclaimer />
    </div>
  );
};
