"use client";

import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { CheckCircle2, Loader2, Circle } from "lucide-react";

export interface LoadingStepperProps {
  isLoading: boolean;
}

const STEPS = [
  "Variant Ingestion",
  "Feature Extraction",
  "Vector Normalization",
  "Model Inference",
  "Explainability",
  "Clinical Report"
];

export const LoadingStepper: React.FC<LoadingStepperProps> = ({ isLoading }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setCurrentStepIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="absolute inset-0 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs flex flex-col items-center justify-center p-6 rounded-xl animate-fade-in"
    >
      <div className="max-w-md w-full bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <Loader2 className="w-5 h-5 text-[#059669] animate-spin" />
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
            Processing Variant Analysis Pipeline...
          </h4>
        </div>

        <div className="space-y-2.5">
          {STEPS.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div
                key={step}
                className={clsx(
                  "flex items-center gap-3 text-xs transition-all duration-200",
                  isCompleted
                    ? "text-emerald-600 dark:text-emerald-400 font-medium"
                    : isCurrent
                    ? "text-slate-900 dark:text-white font-semibold scale-102"
                    : "text-slate-400 dark:text-slate-500"
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-[#059669] animate-spin shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0" />
                )}
                <span>{step}</span>
                {isCurrent && (
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase tracking-wider ml-auto font-bold animate-pulse">
                    Computing...
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <p className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 text-[11px] text-slate-500 dark:text-slate-400 text-center">
          Extracting physicochemical deltas, BLOSUM matrix score & XGBoost inference
        </p>
      </div>
    </div>
  );
};
