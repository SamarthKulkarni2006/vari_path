"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import clsx from "clsx";
import {
  History,
  Download,
  Trash2,
  Search,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Activity,
  ShieldAlert,
  ShieldCheck,
  Percent,
  PlusCircle,
  X,
  AlertTriangle
} from "lucide-react";
import { HistoryEntry, Verdict } from "@/types/variant";
import { useHistory } from "@/hooks/useHistory";
import { showToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { HistoryTable } from "@/components/history/HistoryTable";
import { HistoryEmptyState } from "@/components/history/HistoryEmptyState";

export default function HistoryPage() {
  const { history, remove, clear, loading } = useHistory();

  const [searchQuery, setSearchQuery] = useState("");
  const [verdictFilter, setVerdictFilter] = useState<string>("All");
  const [sortField, setSortField] = useState<"date" | "probability">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [compareEntries, setCompareEntries] = useState<{
    a: HistoryEntry;
    b: HistoryEntry;
  } | null>(null);

  // Compute summary metrics
  const totalCount = history.length;
  const pathogenicCount = history.filter((h) => h.verdict === "Pathogenic").length;
  const benignCount = history.filter((h) => h.verdict === "Benign").length;
  const avgProb =
    totalCount > 0
      ? (history.reduce((acc, h) => acc + h.probability, 0) / totalCount).toFixed(1)
      : "0.0";

  // Filter and Sort entries
  const visibleEntries = useMemo(() => {
    let result = [...history];

    // Filter by search query (gene or hgvs)
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (h) =>
          h.gene.toLowerCase().includes(q) ||
          h.hgvs.toLowerCase().includes(q)
      );
    }

    // Filter by verdict
    if (verdictFilter !== "All") {
      result = result.filter((h) => h.verdict === verdictFilter);
    }

    // Sort
    result.sort((a, b) => {
      if (sortField === "probability") {
        return sortOrder === "asc"
          ? a.probability - b.probability
          : b.probability - a.probability;
      }
      // Default: date
      const dateA = new Date(a.analyzedAt).getTime();
      const dateB = new Date(b.analyzedAt).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    return result;
  }, [history, searchQuery, verdictFilter, sortField, sortOrder]);

  const toggleSort = (field: "date" | "probability") => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const handleExportCSV = () => {
    if (visibleEntries.length === 0) return;

    const headers = ["Index", "Gene", "HGVS", "Verdict", "Probability (%)", "Analyzed At"];
    const rows = visibleEntries.map((e, idx) => [
      idx + 1,
      `"${e.gene}"`,
      `"${e.hgvs}"`,
      `"${e.verdict}"`,
      e.probability.toFixed(1),
      `"${new Date(e.analyzedAt).toISOString()}"`
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `varipath_history_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("CSV exported successfully", "success");
  };

  const handleClearAll = () => {
    clear();
    setShowClearConfirm(false);
    showToast("History cleared", "info");
  };

  const handleDeleteOne = (id: string) => {
    remove(id);
    showToast("Variant removed from history", "info");
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        </div>
        <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2.5">
            <History className="w-6 h-6 text-emerald-600" />
            <span>Analysis History Log</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Browser-persisted record of past variant evaluations and physicochemical deltas
          </p>
        </div>

        {totalCount > 0 && (
          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleExportCSV}
              leftIcon={<Download className="w-4 h-4 text-emerald-600" />}
            >
              Export CSV
            </Button>

            <Button
              variant="danger"
              size="sm"
              onClick={() => setShowClearConfirm(true)}
              leftIcon={<Trash2 className="w-4 h-4" />}
            >
              Clear All History
            </Button>
          </div>
        )}
      </div>

      {/* Clear Confirmation Dialog */}
      {showClearConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          className="p-4 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 flex items-center justify-between gap-4 animate-fade-in"
        >
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-red-900 dark:text-red-200">
                Are you sure you want to clear all history?
              </p>
              <p className="text-xs text-red-700 dark:text-red-300">
                This will purge all {totalCount} cached predictions from local storage.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="danger"
              size="sm"
              onClick={handleClearAll}
            >
              Yes, Clear All
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowClearConfirm(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Summary Strip (4 KPI Tiles) */}
      {totalCount > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Total Runs
              </span>
              <Activity className="w-4 h-4 text-slate-400" />
            </div>
            <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
              {totalCount}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Pathogenic
              </span>
              <ShieldAlert className="w-4 h-4 text-[#DC2626]" />
            </div>
            <div className="mt-2 text-2xl font-black text-[#DC2626]">
              {pathogenicCount}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Benign
              </span>
              <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
            </div>
            <div className="mt-2 text-2xl font-black text-[#16A34A]">
              {benignCount}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Avg Probability
              </span>
              <Percent className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
              {avgProb}%
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {totalCount === 0 ? (
        <Card>
          <HistoryEmptyState />
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Search, Filter & Sort Controls */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Search Box */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by gene (e.g. TP53) or HGVS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Verdict Filter Dropdown & Sort Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={verdictFilter}
                  onChange={(e) => setVerdictFilter(e.target.value)}
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="All">All Verdicts</option>
                  <option value="Pathogenic">Pathogenic</option>
                  <option value="Benign">Benign</option>
                  <option value="Uncertain">Uncertain</option>
                </select>
              </div>

              {/* Sort by Date */}
              <button
                onClick={() => toggleSort("date")}
                className={clsx(
                  "inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors",
                  sortField === "date"
                    ? "bg-emerald-50 border-emerald-300 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                    : "border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                )}
              >
                <span>Date</span>
                {sortField === "date" ? (
                  sortOrder === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                ) : (
                  <ArrowUpDown className="w-3 h-3 opacity-50" />
                )}
              </button>

              {/* Sort by Probability */}
              <button
                onClick={() => toggleSort("probability")}
                className={clsx(
                  "inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors",
                  sortField === "probability"
                    ? "bg-emerald-50 border-emerald-300 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                    : "border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                )}
              >
                <span>Probability</span>
                {sortField === "probability" ? (
                  sortOrder === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                ) : (
                  <ArrowUpDown className="w-3 h-3 opacity-50" />
                )}
              </button>
            </div>
          </div>

          {/* Table */}
          {visibleEntries.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              No matching analyses found for current filter.
            </div>
          ) : (
            <HistoryTable
              entries={visibleEntries}
              onDelete={handleDeleteOne}
              onCompare={(a, b) => setCompareEntries({ a, b })}
            />
          )}
        </div>
      )}

      {/* Compare Side-by-Side Modal */}
      {compareEntries && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
        >
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Side-by-Side Variant Comparison
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Direct physicochemical disparity between two candidate missense substitutions
                </p>
              </div>
              <button
                onClick={() => setCompareEntries(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Comparison Grid */}
            <div className="grid grid-cols-2 gap-4">
              {[compareEntries.a, compareEntries.b].map((entry, idx) => (
                <div
                  key={entry.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Variant {idx === 0 ? "A" : "B"}
                    </span>
                    <span
                      className={clsx(
                        "px-2 py-0.5 rounded-full text-[10px] font-bold",
                        entry.verdict === "Pathogenic"
                          ? "bg-red-100 text-red-800"
                          : entry.verdict === "Benign"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      )}
                    >
                      {entry.verdict}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {entry.hgvs}
                    </h4>
                    <span className="text-xs text-slate-500">
                      Probability: <strong>{entry.probability.toFixed(1)}%</strong>
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex justify-between">
                      <span className="text-slate-400">BLOSUM62:</span>
                      <span className="font-mono">{entry.result.features.blosum62Score}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Δ Hydropathy:</span>
                      <span className="font-mono">
                        {entry.result.features.hydropathyDelta > 0 ? "+" : ""}
                        {entry.result.features.hydropathyDelta}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Charge:</span>
                      <span>
                        {entry.result.features.chargeBefore} → {entry.result.features.chargeAfter}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Δ Mol Weight:</span>
                      <span className="font-mono">
                        {entry.result.features.molecularWeightDelta} Da
                      </span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link href="/results">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setCompareEntries(null);
                        }}
                        className="w-full text-xs"
                      >
                        Inspect in Dashboard
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
