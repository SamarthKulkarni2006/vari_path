"use client";

import { useEffect, useState, useCallback } from "react";
import { HistoryEntry, AnalysisResult } from "@/types/variant";
import {
  getHistory,
  addToHistory,
  removeFromHistory,
  clearHistory
} from "@/lib/storage";

export function useHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshHistory = useCallback(() => {
    setHistory(getHistory());
  }, []);

  useEffect(() => {
    // Initial fetch on mount (SSR safe)
    refreshHistory();
    setLoading(false);

    // Sync across browser tabs and same-window custom events
    const handleStorageUpdate = (e: StorageEvent | Event) => {
      if ("key" in e && e.key && e.key !== "varipath.history") return;
      refreshHistory();
    };

    window.addEventListener("storage", handleStorageUpdate);
    window.addEventListener("local-storage-update", handleStorageUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageUpdate);
      window.removeEventListener("local-storage-update", handleStorageUpdate);
    };
  }, [refreshHistory]);

  const add = useCallback((result: AnalysisResult) => {
    const updated = addToHistory(result);
    setHistory(updated);
    return updated;
  }, []);

  const remove = useCallback((id: string) => {
    const updated = removeFromHistory(id);
    setHistory(updated);
    return updated;
  }, []);

  const clear = useCallback(() => {
    clearHistory();
    setHistory([]);
  }, []);

  return {
    history,
    add,
    remove,
    clear,
    loading
  };
}
