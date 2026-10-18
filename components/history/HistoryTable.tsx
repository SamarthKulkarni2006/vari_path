"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  Trash2,
  Calendar,
  AlertCircle,
  X,
  Check,
  Columns
} from "lucide-react";
import { HistoryEntry, Verdict } from "@/types/variant";
import { setLatestResult } from "@/lib/storage";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export type SortField = "date" | "probability";
export type SortOrder = "asc" | "desc";

export interface HistoryTableProps {
  entries: HistoryEntry[];
  onDelete: (id: string) => void;
  onCompare?: (entryA: HistoryEntry, entryB: HistoryEntry) => void;
}

export const HistoryTable: React.FC<HistoryTableProps> = ({
  entries,
  onDelete,
  onCompare
}) => {
  const router = useRouter();
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);

  const handleView = (entry: HistoryEntry) => {
    setLatestResult(entry.result);
    router.push("/results");
  };

  const handleToggleCompare = (id: string) => {
    setSelectedForCompare((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 2) {
        // Keep the latest 2
        return [prev[1], id];
      }
      return [...prev, id];
    });
  };

  const handleTriggerCompare = () => {
    if (selectedForCompare.length === 2 && onCompare) {
      const a = entries.find((e) => e.id === selectedForCompare[0]);
      const b = entries.find((e) => e.id === selectedForCompare[1]);
      if (a && b) {
        onCompare(a, b);
      }
    }
  };

  const getVerdictVariant = (v: Verdict) => {
    if (v === "Pathogenic") return "pathogenic";
    if (v === "Benign") return "benign";
    return "uncertain";
  };

  const getProbabilityBarColor = (v: Verdict) => {
    if (v === "Pathogenic") return "bg-[#DC2626]";
    if (v === "Benign") return "bg-[#16A34A]";
    return "bg-[#D97706]";
  };

  return (
    <div className="space-y-3">
      {/* Compare Banner if 2 selected */}
      {selectedForCompare.length === 2 && onCompare && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center justify-between gap-3 text-xs animate-fade-in">
          <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-medium">
            <Columns className="w-4 h-4" />
            <span>2 variants selected for comparative analysis</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="primary"
              onClick={handleTriggerCompare}
            >
              Compare Side-by-Side
            </Button>
            <button
              onClick={() => setSelectedForCompare([])}
              className="text-slate-500 hover:text-slate-700 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Desktop Table View */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 font-semibold select-none">
              <th scope="col" className="py-3 px-3 w-10 text-center">
                Compare
              </th>
              <th scope="col" className="py-3 px-3 w-12 text-center">
                #
              </th>
              <th scope="col" className="py-3 px-4">
                Date / Time
              </th>
              <th scope="col" className="py-3 px-4">
                Gene
              </th>
              <th scope="col" className="py-3 px-4">
                Variant (HGVS)
              </th>
              <th scope="col" className="py-3 px-4">
                Verdict
              </th>
              <th scope="col" className="py-3 px-4 w-44">
                Probability
              </th>
              <th scope="col" className="py-3 px-4 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {entries.map((entry, idx) => {
              const formattedDate = new Date(entry.analyzedAt).toLocaleString(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                }
              );

              const isConfirmingDelete = deleteConfirmId === entry.id;
              const isSelected = selectedForCompare.includes(entry.id);

              return (
                <tr
                  key={entry.id}
                  className={clsx(
                    "hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors",
                    isSelected && "bg-emerald-50/40 dark:bg-emerald-950/20"
                  )}
                >
                  {/* Compare Checkbox */}
                  <td className="py-3 px-3 text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleCompare(entry.id)}
                      aria-label={`Select ${entry.hgvs} for comparison`}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                  </td>

                  {/* Index */}
                  <td className="py-3 px-3 text-center text-slate-400 font-mono">
                    {idx + 1}
                  </td>

                  {/* Date */}
                  <td className="py-3 px-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formattedDate}</span>
                    </div>
                  </td>

                  {/* Gene */}
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                    {entry.gene}
                  </td>

                  {/* HGVS */}
                  <td className="py-3 px-4 font-mono font-medium text-slate-800 dark:text-slate-200">
                    {entry.hgvs}
                  </td>

                  {/* Verdict Badge */}
                  <td className="py-3 px-4">
                    <Badge variant={getVerdictVariant(entry.verdict)} size="sm">
                      {entry.verdict}
                    </Badge>
                  </td>

                  {/* Probability + Inline Bar */}
                  <td className="py-3 px-4">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                        <span>{entry.probability.toFixed(1)}%</span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          risk
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={clsx(
                            "h-full rounded-full transition-all duration-300",
                            getProbabilityBarColor(entry.verdict)
                          )}
                          style={{
                            width: `${Math.min(100, Math.max(5, entry.probability))}%`
                          }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* View */}
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleView(entry)}
                        leftIcon={<Eye className="w-3.5 h-3.5 text-emerald-600" />}
                        className="py-1 px-2.5 text-xs"
                      >
                        View
                      </Button>

                      {/* Delete with inline confirmation */}
                      {isConfirmingDelete ? (
                        <div className="inline-flex items-center gap-1 bg-red-50 dark:bg-red-950/60 p-0.5 rounded-lg border border-red-200 dark:border-red-800 animate-fade-in">
                          <button
                            type="button"
                            onClick={() => {
                              onDelete(entry.id);
                              setDeleteConfirmId(null);
                            }}
                            className="p-1 text-red-700 hover:text-red-900 font-bold focus:outline-none"
                            title="Confirm delete"
                          >
                            <Check className="w-3.5 h-3.5 text-red-600" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(null)}
                            className="p-1 text-slate-500 hover:text-slate-700 focus:outline-none"
                            title="Cancel delete"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(entry.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-1 focus:ring-red-400"
                          title="Delete entry"
                          aria-label={`Delete entry ${entry.hgvs}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
