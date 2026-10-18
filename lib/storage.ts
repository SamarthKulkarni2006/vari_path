import { AnalysisResult, HistoryEntry } from "@/types/variant";

const HISTORY_KEY = "varipath.history";
const LATEST_KEY = "varipath.latestResult";

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function getHistory(): HistoryEntry[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Failed to read history from localStorage:", err);
    return [];
  }
}

export function addToHistory(result: AnalysisResult): HistoryEntry[] {
  if (!isBrowser()) return [];
  try {
    const current = getHistory();
    const newEntry: HistoryEntry = {
      id: result.id,
      gene: result.query.gene.trim().toUpperCase(),
      hgvs: result.hgvs,
      verdict: result.verdict,
      probability: result.probability,
      analyzedAt: result.analyzedAt,
      result
    };

    // If the same gene + position + mutant exists, remove old one and put new one first
    const filtered = current.filter((entry) => {
      const match =
        entry.gene.toUpperCase() === newEntry.gene &&
        entry.result?.query?.position === result.query.position &&
        entry.result?.query?.mutant?.toUpperCase() === result.query.mutant.toUpperCase();
      return !match;
    });

    const updated = [newEntry, ...filtered].slice(0, 50);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    // Trigger storage event for same-tab listeners
    window.dispatchEvent(new Event("local-storage-update"));
    return updated;
  } catch (err) {
    console.error("Failed to add entry to history:", err);
    return getHistory();
  }
}

export function removeFromHistory(id: string): HistoryEntry[] {
  if (!isBrowser()) return [];
  try {
    const current = getHistory();
    const updated = current.filter((item) => item.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("local-storage-update"));
    return updated;
  } catch (err) {
    console.error("Failed to remove item from history:", err);
    return getHistory();
  }
}

export function clearHistory(): void {
  if (!isBrowser()) return;
  try {
    localStorage.removeItem(HISTORY_KEY);
    window.dispatchEvent(new Event("local-storage-update"));
  } catch (err) {
    console.error("Failed to clear history:", err);
  }
}

export function getLatestResult(): AnalysisResult | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(LATEST_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AnalysisResult;
  } catch (err) {
    console.error("Failed to read latest result from localStorage:", err);
    return null;
  }
}

export function setLatestResult(result: AnalysisResult): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(LATEST_KEY, JSON.stringify(result));
    window.dispatchEvent(new Event("local-storage-update"));
  } catch (err) {
    console.error("Failed to save latest result to localStorage:", err);
  }
}
