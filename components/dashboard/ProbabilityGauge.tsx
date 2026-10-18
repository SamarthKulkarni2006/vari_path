"use client";

import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { Verdict } from "@/types/variant";

export interface ProbabilityGaugeProps {
  probability: number; // 0 to 100
  verdict: Verdict;
  className?: string;
}

export const ProbabilityGauge: React.FC<ProbabilityGaugeProps> = ({
  probability,
  verdict,
  className
}) => {
  const [animatedProb, setAnimatedProb] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 800; // 800ms animation
    const target = Math.min(100, Math.max(0, probability));

    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setAnimatedProb(target * easeOut);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [probability]);

  // Color mapping
  const strokeColor =
    verdict === "Pathogenic"
      ? "#DC2626"
      : verdict === "Benign"
      ? "#16A34A"
      : "#D97706";

  // SVG Semicircle parameters
  const radius = 75;
  const circumference = Math.PI * radius; // ~235.6
  const strokeDashoffset = circumference * (1 - animatedProb / 100);

  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center p-4 select-none",
        className
      )}
      role="progressbar"
      aria-valuenow={Math.round(probability * 10) / 10}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Pathogenicity probability: ${probability.toFixed(1)} percent`}
    >
      {/* Semicircle SVG */}
      <div className="relative w-56 h-32 flex items-end justify-center">
        <svg
          viewBox="0 0 200 115"
          className="w-full h-full overflow-visible"
        >
          <defs>
            <linearGradient id="gaugeTrack" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#86EFAC" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#FDE68A" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FCA5A5" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Background Track */}
          <path
            d="M 25 105 A 75 75 0 0 1 175 105"
            fill="none"
            stroke="currentColor"
            className="text-slate-200 dark:text-slate-700"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Animated Value Arc */}
          <path
            d="M 25 105 A 75 75 0 0 1 175 105"
            fill="none"
            stroke={strokeColor}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-75"
          />
        </svg>

        {/* Center Percentage Display */}
        <div className="absolute inset-x-0 bottom-2 text-center pointer-events-none">
          <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {animatedProb.toFixed(1)}%
          </span>
          <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 -mt-1">
            Pathogenic Risk
          </span>
        </div>
      </div>

      {/* Axis Extremes */}
      <div className="w-56 flex justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400 px-2 mt-1">
        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">0% Benign</span>
        <span className="text-slate-400">50%</span>
        <span className="text-red-600 dark:text-red-400 font-semibold">100% Pathogenic</span>
      </div>

      {/* 3-Zone Reference Bar with Indicator */}
      <div className="w-full max-w-xs mt-4">
        <div className="relative pt-3 pb-1">
          {/* Marker pin */}
          <div
            className="absolute top-0 -translate-x-1/2 flex flex-col items-center transition-all duration-100"
            style={{ left: `${Math.min(98, Math.max(2, animatedProb))}%` }}
          >
            <div
              className="w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-900 shadow-md"
              style={{ backgroundColor: strokeColor }}
            />
            <div
              className="w-0.5 h-2 -mt-0.5"
              style={{ backgroundColor: strokeColor }}
            />
          </div>

          {/* 3-Zone Bar */}
          <div className="h-2.5 w-full rounded-full overflow-hidden flex shadow-inner">
            <div
              className="h-full bg-emerald-500/80 transition-opacity"
              style={{ width: "30%" }}
              title="Benign Zone (0 - 30%)"
            />
            <div
              className="h-full bg-amber-500/80 transition-opacity"
              style={{ width: "40%" }}
              title="Uncertain Zone (30 - 70%)"
            />
            <div
              className="h-full bg-red-500/80 transition-opacity"
              style={{ width: "30%" }}
              title="Pathogenic Zone (70 - 100%)"
            />
          </div>
        </div>

        {/* Zone Labels */}
        <div className="flex justify-between text-[10px] text-slate-400 px-0.5 mt-0.5 font-medium">
          <span className="text-emerald-600 dark:text-emerald-400">Benign (&le;30%)</span>
          <span className="text-amber-600 dark:text-amber-400">Uncertain</span>
          <span className="text-red-600 dark:text-red-400">Pathogenic (&ge;70%)</span>
        </div>
      </div>
    </div>
  );
};
