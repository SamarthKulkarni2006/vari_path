"use client";

import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from "recharts";
import {
  BarChart2,
  Info,
  Award,
  CheckCircle,
  TrendingUp,
  Cpu,
  Layers,
  ArrowRight
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Disclaimer } from "@/components/ui/Disclaimer";

const ROC_DATA = [
  { fpr: 0.0, tpr: 0.0, baseline: 0.0 },
  { fpr: 0.02, tpr: 0.42, baseline: 0.02 },
  { fpr: 0.05, tpr: 0.71, baseline: 0.05 },
  { fpr: 0.1, tpr: 0.86, baseline: 0.1 },
  { fpr: 0.15, tpr: 0.92, baseline: 0.15 },
  { fpr: 0.25, tpr: 0.95, baseline: 0.25 },
  { fpr: 0.4, tpr: 0.97, baseline: 0.4 },
  { fpr: 0.6, tpr: 0.985, baseline: 0.6 },
  { fpr: 0.8, tpr: 0.995, baseline: 0.8 },
  { fpr: 1.0, tpr: 1.0, baseline: 1.0 }
];

const MODEL_BENCHMARKS = [
  {
    name: "Logistic Regression",
    type: "Linear Baseline",
    acc: "81.2%",
    prec: "79.5%",
    rec: "82.0%",
    f1: "0.807",
    auc: "0.884",
    selected: false
  },
  {
    name: "Support Vector Classifier (RBF)",
    type: "Kernel Margin",
    acc: "84.9%",
    prec: "83.5%",
    rec: "85.2%",
    f1: "0.843",
    auc: "0.912",
    selected: false
  },
  {
    name: "Random Forest Classifier",
    type: "Ensemble Bagging",
    acc: "87.4%",
    prec: "86.2%",
    rec: "88.0%",
    f1: "0.871",
    auc: "0.935",
    selected: false
  },
  {
    name: "XGBoost (Gradient Boosted Trees)",
    type: "Active Classifier",
    acc: "91.8%",
    prec: "91.0%",
    rec: "92.5%",
    f1: "0.917",
    auc: "0.968",
    selected: true
  }
];

export default function AnalyticsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2">
          <Badge variant="brand" size="sm">
            Clinical Benchmark Suite
          </Badge>
          <span className="text-xs text-slate-400">ClinVar Validation Set</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2.5 mt-1">
          <BarChart2 className="w-6 h-6 text-emerald-600" />
          <span>Model Performance & Validation Analytics</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Validation metrics computed across 4,000 clinically reviewed missense substitutions
        </p>
      </div>

      {/* Mandatory Notice */}
      <div
        role="alert"
        className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-blue-900 dark:text-blue-200 flex items-start gap-3"
      >
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed">
          <strong>Backend Integration Notice:</strong> Metrics shown are placeholder values until the backend model is connected. These represent prospective benchmark targets trained on ClinVar missense variants.
        </div>
      </div>

      {/* Model Comparison Table Card */}
      <Card
        title="Classifier Benchmark & Model Selection"
        subtitle="Evaluated on 5-fold cross-validation with stratified holdout test split"
      >
        <div className="overflow-x-auto -mx-5 -mb-5">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                <th className="py-3 px-4">Architecture</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Accuracy</th>
                <th className="py-3 px-4">Precision</th>
                <th className="py-3 px-4">Recall</th>
                <th className="py-3 px-4">F1 Score</th>
                <th className="py-3 px-4">ROC-AUC</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {MODEL_BENCHMARKS.map((model) => (
                <tr
                  key={model.name}
                  className={
                    model.selected
                      ? "bg-emerald-50/50 dark:bg-emerald-950/20 font-medium"
                      : "hover:bg-slate-50/60 dark:hover:bg-slate-800/40"
                  }
                >
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                    {model.name}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">{model.type}</td>
                  <td className="py-3.5 px-4 font-mono">{model.acc}</td>
                  <td className="py-3.5 px-4 font-mono">{model.prec}</td>
                  <td className="py-3.5 px-4 font-mono">{model.rec}</td>
                  <td className="py-3.5 px-4 font-mono">{model.f1}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                    {model.auc}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {model.selected ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#059669] text-white shadow-xs">
                        <Award className="w-3 h-3" />
                        <span>Selected</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400">Baseline</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Grid: 2x2 Confusion Matrix + ROC Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* 2x2 Confusion Matrix */}
        <div className="lg:col-span-5">
          <Card
            title="Confusion Matrix (XGBoost)"
            subtitle="ClinVar Holdout Evaluation (N = 4,000)"
          >
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-center">
                {/* True Positive */}
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-red-700 dark:text-red-300 block">
                    True Pathogenic (TP)
                  </span>
                  <span className="text-2xl font-black text-red-900 dark:text-red-100 mt-1 block">
                    1,850
                  </span>
                  <span className="text-[10px] text-red-600/80">Correctly Flagged</span>
                </div>

                {/* False Positive */}
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700 dark:text-amber-300 block">
                    False Pathogenic (FP)
                  </span>
                  <span className="text-2xl font-black text-amber-900 dark:text-amber-100 mt-1 block">
                    180
                  </span>
                  <span className="text-[10px] text-amber-600/80">Type I Error</span>
                </div>

                {/* False Negative */}
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700 dark:text-amber-300 block">
                    False Benign (FN)
                  </span>
                  <span className="text-2xl font-black text-amber-900 dark:text-amber-100 mt-1 block">
                    150
                  </span>
                  <span className="text-[10px] text-amber-600/80">Type II Error</span>
                </div>

                {/* True Negative */}
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 dark:text-emerald-300 block">
                    True Benign (TN)
                  </span>
                  <span className="text-2xl font-black text-emerald-900 dark:text-emerald-100 mt-1 block">
                    1,820
                  </span>
                  <span className="text-[10px] text-emerald-600/80">Correctly Preserved</span>
                </div>
              </div>

              {/* Diagnostic Ratios */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex justify-between">
                  <span>Sensitivity (TPR):</span>
                  <strong className="text-slate-900 dark:text-white">92.5%</strong>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex justify-between">
                  <span>Specificity (TNR):</span>
                  <strong className="text-slate-900 dark:text-white">91.0%</strong>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* ROC Curve Chart */}
        <div className="lg:col-span-7">
          <Card
            title="ROC Characteristics Curve"
            subtitle="Receiver Operating Characteristic · AUC = 0.968"
          >
            <div className="h-64 w-full">
              {!mounted ? (
                <div className="h-full w-full bg-slate-50 dark:bg-slate-800 rounded-lg animate-pulse" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={ROC_DATA}
                    margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                    <XAxis
                      dataKey="fpr"
                      type="number"
                      domain={[0, 1]}
                      tickLine={false}
                      stroke="#94a3b8"
                      fontSize={11}
                      label={{ value: "False Positive Rate (1 - Specificity)", position: "insideBottom", offset: -5, fontSize: 11 }}
                    />
                    <YAxis
                      dataKey="tpr"
                      type="number"
                      domain={[0, 1]}
                      tickLine={false}
                      stroke="#94a3b8"
                      fontSize={11}
                      label={{ value: "True Positive Rate (Sensitivity)", angle: -90, position: "insideLeft", fontSize: 11 }}
                    />
                    <Tooltip
                      formatter={(val: any) => [Number(val).toFixed(3), "Rate"]}
                      contentStyle={{
                        borderRadius: "8px",
                        fontSize: "12px",
                        backgroundColor: "#0F172A",
                        color: "#FFFFFF"
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                    <Line
                      type="monotone"
                      dataKey="tpr"
                      name="XGBoost Classifier (AUC = 0.968)"
                      stroke="#059669"
                      strokeWidth={2.5}
                      dot={{ r: 3 }}
                    />
                    <Line
                      type="linear"
                      dataKey="baseline"
                      name="Random Baseline (AUC = 0.500)"
                      stroke="#94a3b8"
                      strokeDasharray="4 4"
                      strokeWidth={1.5}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Clinical Disclaimer */}
      <Disclaimer />
    </div>
  );
}
