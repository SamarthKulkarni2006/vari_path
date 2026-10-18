import React from "react";
import { Badge } from "@/components/ui/Badge";
import { GraduationCap, ShieldAlert } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xs py-6 transition-colors">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2 text-center md:text-left">
            <GraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              <strong>VariPath</strong> · VTU 2022 Scheme · BCS586 Mini Project
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <Badge variant="neutral" size="sm">
              Frontend demo with mock data
            </Badge>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-center gap-2 text-[11px] text-slate-400 text-center">
          <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-amber-500/80" />
          <span>
            Statistical risk tool for research and clinical triage; not an autonomous clinical diagnostic verdict.
          </span>
        </div>
      </div>
    </footer>
  );
};
