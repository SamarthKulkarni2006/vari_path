"use client";

import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  Cell
} from "recharts";
import { FeatureContribution } from "@/types/variant";
import { HelpCircle } from "lucide-react";

export interface FeatureContributionChartProps {
  contributions: FeatureContribution[];
}

export const FeatureContributionChart: React.FC<FeatureContributionChartProps> = ({
  contributions
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sort by absolute impact descending
  const sortedData = [...contributions].sort(
    (a, b) => Math.abs(b.impact) - Math.abs(a.impact)
  );

  const topDriver = sortedData[0];
  let caption = "Biochemical feature impacts are balanced across functional metrics.";
  if (topDriver) {
    const direction = topDriver.impact >= 0 ? "Pathogenic" : "Benign";
    const sign = topDriver.impact > 0 ? "+" : "";
    caption = `${topDriver.feature} was the strongest driver toward ${direction} (${sign}${topDriver.impact.toFixed(2)} impact).`;
  }

  // Format data for chart
  const chartData = sortedData.map((item) => ({
    feature: item.feature,
    impact: item.impact,
    color: item.impact >= 0 ? "#DC2626" : "#16A34A"
  }));

  return (
    <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
      {/* Title & Explainer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Why did the model say this?</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Shapley-style local feature contributions (Positive = pushes toward Pathogenic; Negative = pushes toward Benign)
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-[#DC2626]" />
            <span className="text-slate-700 dark:text-slate-300">Pushes Pathogenic</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-[#16A34A]" />
            <span className="text-slate-700 dark:text-slate-300">Pushes Benign</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 w-full">
        {!mounted ? (
          <div className="h-full w-full bg-slate-50 dark:bg-slate-800/40 rounded-lg animate-pulse flex items-center justify-center text-xs text-slate-400">
            Loading Explainability Chart...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 30, bottom: 10 }}
            >
              <XAxis
                type="number"
                domain={[-0.45, 0.45]}
                tickLine={false}
                stroke="#94a3b8"
                fontSize={11}
                tickFormatter={(val) => (val > 0 ? `+${val}` : `${val}`)}
              />
              <YAxis
                type="category"
                dataKey="feature"
                tickLine={false}
                stroke="#64748b"
                fontSize={12}
                width={130}
              />
              <Tooltip
                formatter={(value: any) => [
                  `${Number(value) > 0 ? "+" : ""}${Number(value).toFixed(2)}`,
                  "Impact Score"
                ]}
                contentStyle={{
                  borderRadius: "8px",
                  fontSize: "12px",
                  backgroundColor: "#0F172A",
                  color: "#FFFFFF",
                  border: "none"
                }}
              />
              <ReferenceLine x={0} stroke="#cbd5e1" strokeWidth={1.5} />
              <Bar dataKey="impact" radius={[4, 4, 4, 4]} barSize={20}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Dynamic Summary Caption */}
      <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2">
        <HelpCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <span className="font-medium">
          <strong>Key Insight:</strong> {caption}
        </span>
      </div>
    </div>
  );
};
