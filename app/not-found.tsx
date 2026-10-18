import React from "react";
import Link from "next/link";
import { Dna, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center py-20 px-4 space-y-5 animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-800 shadow-sm">
        <Dna className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-[#059669]">
          404 · Locus Not Found
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Page Not Available
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          The requested genomic route does not exist or has been relocated.
        </p>
      </div>

      <Link href="/">
        <Button
          variant="primary"
          size="md"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Return to Variant Analyzer
        </Button>
      </Link>
    </div>
  );
}
