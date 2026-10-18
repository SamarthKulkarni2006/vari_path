"use client";

import React, { useState } from "react";
import clsx from "clsx";
import { Dna, RotateCcw, AlertCircle, AlertTriangle, ArrowRight } from "lucide-react";
import { AMINO_ACIDS } from "@/lib/aminoAcids";
import { FormErrors, FormValues, validateAll, validateGene, validateMutant, validatePosition, validateSame, validateWildType } from "@/lib/validation";
import { useAnalysis } from "@/hooks/useAnalysis";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { ExampleChips, ExampleVariant } from "./ExampleChips";
import { LoadingStepper } from "./LoadingStepper";

export const VariantForm: React.FC = () => {
  const { analyze, loading, error, clearError } = useAnalysis();

  const [values, setValues] = useState<FormValues>({
    gene: "",
    wildType: "",
    mutant: "",
    position: ""
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleFieldBlur = (field: keyof FormValues) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    let err: string | null = null;

    if (field === "gene") err = validateGene(values.gene);
    if (field === "wildType") {
      err = validateWildType(values.wildType);
      if (!err && values.mutant) {
        const sameErr = validateSame(values.wildType, values.mutant);
        if (sameErr) setErrors((prev) => ({ ...prev, mutant: sameErr }));
      }
    }
    if (field === "mutant") {
      err = validateMutant(values.mutant);
      if (!err && values.wildType) {
        err = validateSame(values.wildType, values.mutant);
      }
    }
    if (field === "position") err = validatePosition(values.position);

    setErrors((prev) => ({
      ...prev,
      [field]: err ?? undefined
    }));
  };

  const handleFieldChange = (field: keyof FormValues, val: string) => {
    let formattedVal = val;
    if (field === "gene") {
      formattedVal = val.toUpperCase().trimStart();
    }

    setValues((prev) => ({ ...prev, [field]: formattedVal }));

    // If there was an error, re-validate dynamically
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const handleExampleSelect = (example: ExampleVariant) => {
    setValues({
      gene: example.gene,
      wildType: example.wildType,
      mutant: example.mutant,
      position: String(example.position)
    });
    setErrors({});
    setTouched({
      gene: true,
      wildType: true,
      mutant: true,
      position: true
    });
    clearError();
  };

  const handleReset = () => {
    setValues({
      gene: "",
      wildType: "",
      mutant: "",
      position: ""
    });
    setErrors({});
    setTouched({});
    clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all as touched
    setTouched({
      gene: true,
      wildType: true,
      mutant: true,
      position: true
    });

    const validationErrors = validateAll(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; // Do NOT call API
    }

    // Call API with sanitized payload
    await analyze({
      gene: values.gene.trim().toUpperCase(),
      wildType: values.wildType.trim().toUpperCase(),
      mutant: values.mutant.trim().toUpperCase(),
      position: Number(values.position)
    });
  };

  return (
    <Card className="glass-form relative overflow-hidden border-slate-200 dark:border-slate-800 shadow-md">
      {/* Loading Stepper Overlay */}
      <LoadingStepper isLoading={loading} />

      {/* Dismissible API Error Banner */}
      {error && (
        <div
          role="alert"
          className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-800 dark:text-red-200 flex items-start justify-between gap-3"
        >
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold">Analysis Failed</h4>
              <p className="text-xs text-red-700 dark:text-red-300 mt-0.5">{error}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={handleSubmit}
            >
              Retry
            </Button>
            <button
              type="button"
              onClick={clearError}
              className="text-xs text-red-600 dark:text-red-400 hover:underline p-1 font-medium"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Example Chips */}
      <div className="mb-6 pb-5 border-b border-slate-100 dark:border-slate-800">
        <ExampleChips onSelect={handleExampleSelect} disabled={loading} />
      </div>

      <form onSubmit={handleSubmit} noValidate className="variant-entry-form space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* 1. Gene Symbol */}
          <div>
            <label
              htmlFor="field-gene"
              className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1"
            >
              Gene Symbol <span className="text-red-500">*</span>
            </label>
            <input
              id="field-gene"
              name="gene"
              type="text"
              autoCapitalize="characters"
              placeholder="e.g. TP53"
              disabled={loading}
              value={values.gene}
              onChange={(e) => handleFieldChange("gene", e.target.value)}
              onBlur={() => handleFieldBlur("gene")}
              aria-invalid={!!errors.gene}
              aria-describedby={errors.gene ? "err-gene" : "desc-gene"}
              className={clsx(
                "w-full px-3.5 py-2 text-sm rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition-colors focus:outline-none focus:ring-2",
                errors.gene
                  ? "border-red-500 focus:ring-red-500"
                  : "border-slate-300 dark:border-slate-700 focus:ring-emerald-500 focus:border-emerald-500",
                "disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:cursor-not-allowed"
              )}
            />
            {errors.gene ? (
              <p
                id="err-gene"
                role="alert"
                className="mt-1.5 text-xs text-red-600 dark:text-red-400 flex items-center gap-1 font-medium"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.gene}</span>
              </p>
            ) : (
              <p
                id="desc-gene"
                className="mt-1 text-[11px] text-slate-500 dark:text-slate-400"
              >
                HGNC symbol (e.g. TP53, BRCA1, EGFR, KRAS)
              </p>
            )}
          </div>

          {/* 4. Residue Index */}
          <div>
            <label
              htmlFor="field-position"
              className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1"
            >
              Residue Index (Position) <span className="text-red-500">*</span>
            </label>
            <input
              id="field-position"
              name="position"
              type="text"
              inputMode="numeric"
              placeholder="e.g. 248"
              disabled={loading}
              value={values.position}
              onChange={(e) => handleFieldChange("position", e.target.value)}
              onBlur={() => handleFieldBlur("position")}
              aria-invalid={!!errors.position}
              aria-describedby={errors.position ? "err-position" : "desc-position"}
              className={clsx(
                "w-full px-3.5 py-2 text-sm rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition-colors focus:outline-none focus:ring-2",
                errors.position
                  ? "border-red-500 focus:ring-red-500"
                  : "border-slate-300 dark:border-slate-700 focus:ring-emerald-500 focus:border-emerald-500",
                "disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:cursor-not-allowed"
              )}
            />
            {errors.position ? (
              <p
                id="err-position"
                role="alert"
                className="mt-1.5 text-xs text-red-600 dark:text-red-400 flex items-center gap-1 font-medium"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.position}</span>
              </p>
            ) : (
              <p
                id="desc-position"
                className="mt-1 text-[11px] text-slate-500 dark:text-slate-400"
              >
                1-based codon coordinate (1 to 35,000)
              </p>
            )}
          </div>

          {/* 2. Wild-Type Residue */}
          <div>
            <label
              htmlFor="field-wildType"
              className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1"
            >
              Wild-Type Residue <span className="text-red-500">*</span>
            </label>
            <select
              id="field-wildType"
              name="wildType"
              disabled={loading}
              value={values.wildType}
              onChange={(e) => handleFieldChange("wildType", e.target.value)}
              onBlur={() => handleFieldBlur("wildType")}
              aria-invalid={!!errors.wildType}
              aria-describedby={errors.wildType ? "err-wildType" : "desc-wildType"}
              className={clsx(
                "w-full px-3.5 py-2 text-sm rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition-colors focus:outline-none focus:ring-2",
                errors.wildType
                  ? "border-red-500 focus:ring-red-500"
                  : "border-slate-300 dark:border-slate-700 focus:ring-emerald-500 focus:border-emerald-500",
                "disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:cursor-not-allowed"
              )}
            >
              <option value="">Select wild-type amino acid...</option>
              {AMINO_ACIDS.map((aa) => (
                <option key={aa.code} value={aa.code}>
                  {aa.code}: {aa.name} ({aa.threeLetter})
                </option>
              ))}
            </select>
            {errors.wildType ? (
              <p
                id="err-wildType"
                role="alert"
                className="mt-1.5 text-xs text-red-600 dark:text-red-400 flex items-center gap-1 font-medium"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.wildType}</span>
              </p>
            ) : (
              <p
                id="desc-wildType"
                className="mt-1 text-[11px] text-slate-500 dark:text-slate-400"
              >
                Reference amino acid in canonical transcript
              </p>
            )}
          </div>

          {/* 3. Mutant Residue */}
          <div>
            <label
              htmlFor="field-mutant"
              className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1"
            >
              Mutant Residue <span className="text-red-500">*</span>
            </label>
            <select
              id="field-mutant"
              name="mutant"
              disabled={loading}
              value={values.mutant}
              onChange={(e) => handleFieldChange("mutant", e.target.value)}
              onBlur={() => handleFieldBlur("mutant")}
              aria-invalid={!!errors.mutant}
              aria-describedby={errors.mutant ? "err-mutant" : "desc-mutant"}
              className={clsx(
                "w-full px-3.5 py-2 text-sm rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition-colors focus:outline-none focus:ring-2",
                errors.mutant
                  ? "border-red-500 focus:ring-red-500"
                  : "border-slate-300 dark:border-slate-700 focus:ring-emerald-500 focus:border-emerald-500",
                "disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:cursor-not-allowed"
              )}
            >
              <option value="">Select mutant amino acid...</option>
              {AMINO_ACIDS.map((aa) => (
                <option key={aa.code} value={aa.code}>
                  {aa.code}: {aa.name} ({aa.threeLetter})
                </option>
              ))}
            </select>
            {errors.mutant ? (
              <p
                id="err-mutant"
                role="alert"
                className="mt-1.5 text-xs text-red-600 dark:text-red-400 flex items-center gap-1 font-medium"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.mutant}</span>
              </p>
            ) : (
              <p
                id="desc-mutant"
                className="mt-1 text-[11px] text-slate-500 dark:text-slate-400"
              >
                Substituted alternative amino acid
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 flex flex-col sm:flex-row items-center gap-3">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            leftIcon={<Dna className="w-5 h-5" />}
            rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
            className="variant-submit w-full sm:w-auto px-6 font-semibold"
          >
            {loading ? "Analyzing Variant..." : "Analyze Variant"}
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="lg"
            disabled={loading}
            onClick={handleReset}
            leftIcon={<RotateCcw className="w-4 h-4" />}
            className="w-full sm:w-auto"
          >
            Reset
          </Button>
        </div>

        {/* Disclaimer inside card */}
        <div className="pt-2">
          <Disclaimer compact />
        </div>
      </form>
    </Card>
  );
};
