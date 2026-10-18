"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { VariantQuery } from "@/types/variant";
import { analyzeVariant } from "@/lib/api";
import { addToHistory, setLatestResult } from "@/lib/storage";

export function useAnalysis() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const analyze = useCallback(
    async (query: VariantQuery) => {
      // Prevent double submissions
      if (loading) return;

      setLoading(true);
      setError(null);

      try {
        const result = await analyzeVariant(query);
        setLatestResult(result);
        addToHistory(result);
        router.push("/results");
      } catch (err) {
        console.error("Analysis failed:", err);
        setError(
          err instanceof Error
            ? err.message
            : "An unexpected error occurred while analyzing the variant. Please try again."
        );
      } finally {
        setLoading(false);
      }
    },
    [loading, router]
  );

  return {
    analyze,
    loading,
    error,
    clearError
  };
}
