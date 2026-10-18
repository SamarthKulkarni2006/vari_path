import React from "react";
import clsx from "clsx";
import { ShieldAlert, ShieldCheck, HelpCircle } from "lucide-react";
import { Verdict } from "@/types/variant";

export interface VerdictBadgeProps {
  verdict: Verdict;
  probability: number;
  className?: string;
}

export const VerdictBadge: React.FC<VerdictBadgeProps> = ({
  verdict,
  probability,
  className
}) => {
  const isPathogenic = verdict === "Pathogenic";
  const isBenign = verdict === "Benign";

  const config = isPathogenic
    ? {
        text: `Pathogenic · ${probability.toFixed(1)}% Probability`,
        styles:
          "bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5] dark:bg-red-950/40 dark:text-red-300 dark:border-red-800",
        Icon: ShieldAlert,
        glow: "shadow-red-500/10"
      }
    : isBenign
    ? {
        text: `Benign · ${probability.toFixed(1)}% Probability`,
        styles:
          "bg-[#F0FDF4] text-[#16A34A] border-[#86EFAC] dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
        Icon: ShieldCheck,
        glow: "shadow-emerald-500/10"
      }
    : {
        text: `Uncertain Significance · ${probability.toFixed(1)}% Probability`,
        styles:
          "bg-[#FFFBEB] text-[#D97706] border-[#FDE68A] dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
        Icon: HelpCircle,
        glow: "shadow-amber-500/10"
      };

  const { Icon } = config;

  return (
    <div
      role="status"
      className={clsx(
        "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-sm font-bold shadow-sm tracking-wide",
        config.styles,
        config.glow,
        className
      )}
    >
      <Icon className="w-4 h-4 shrink-0" />
      <span>{config.text}</span>
    </div>
  );
};
