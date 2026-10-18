import React from "react";
import Link from "next/link";
import { History, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const HistoryEmptyState: React.FC = () => {
  return (
    <div className="text-center py-16 px-4 max-w-md mx-auto space-y-4 animate-fade-in">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center border border-slate-200 dark:border-slate-700">
        <History className="w-8 h-8" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          No variants analyzed yet
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
          Analyses conducted on the platform are logged automatically in your browser session. Analyze your first variant to populate this log.
        </p>
      </div>
      <Link href="/">
        <Button
          variant="primary"
          size="md"
          rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
        >
          Analyze a Variant
        </Button>
      </Link>
    </div>
  );
};
