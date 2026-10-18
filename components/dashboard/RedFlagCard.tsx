"use client";

import React, { useState } from "react";
import clsx from "clsx";
import { Flag, Info, HelpCircle } from "lucide-react";

export interface RedFlagCardProps {
  title: string;
  value: string;
  label: string;
  description: string;
  severity: "high" | "medium" | "low";
  icon: React.ReactNode;
  tooltipText: string;
}

export const RedFlagCard: React.FC<RedFlagCardProps> = ({
  title,
  value,
  label,
  description,
  severity,
  icon,
  tooltipText
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const severityStyles = {
    high: {
      badge: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900",
      flagColor: "text-red-600",
      cardBorder: "hover:border-red-300 dark:hover:border-red-800"
    },
    medium: {
      badge: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900",
      flagColor: "text-amber-600",
      cardBorder: "hover:border-amber-300 dark:hover:border-amber-800"
    },
    low: {
      badge: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900",
      flagColor: "text-emerald-600",
      cardBorder: "hover:border-emerald-300 dark:hover:border-emerald-800"
    }
  };

  const currentSev = severityStyles[severity];

  return (
    <div
      className={clsx(
        "relative p-4 sm:p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between transition-all",
        currentSev.cardBorder
      )}
    >
      <div>
        {/* Header row: Title + Tooltip + Severity Flag */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {icon}
            </span>
            <div className="relative">
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {title}
                </h3>
                <button
                  type="button"
                  aria-label={`About ${title}`}
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  onClick={() => setShowTooltip(!showTooltip)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Tooltip Popup */}
              {showTooltip && (
                <div
                  role="tooltip"
                  className="absolute left-0 bottom-full mb-1.5 z-30 w-56 p-2 text-[11px] leading-tight text-white bg-slate-900 dark:bg-slate-800 rounded-lg shadow-lg border border-slate-700 animate-fade-in pointer-events-none"
                >
                  {tooltipText}
                </div>
              )}
            </div>
          </div>

          {/* Severity chip */}
          <span
            className={clsx(
              "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shrink-0",
              currentSev.badge
            )}
          >
            <Flag className={clsx("w-3 h-3", currentSev.flagColor)} />
            <span>{severity}</span>
          </span>
        </div>

        {/* Big Value + Label */}
        <div className="my-2">
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {value}
          </div>
          <span className="inline-block mt-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
            {label}
          </span>
        </div>
      </div>

      {/* One-line explanation */}
      <p className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 leading-snug">
        {description}
      </p>
    </div>
  );
};
