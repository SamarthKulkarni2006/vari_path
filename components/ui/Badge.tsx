import React from "react";
import clsx from "clsx";

export type BadgeVariant = "pathogenic" | "benign" | "uncertain" | "neutral" | "brand";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: "sm" | "md";
  icon?: React.ReactNode;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "neutral",
  size = "md",
  icon,
  dot = false,
  className,
  ...props
}) => {
  const variantStyles: Record<BadgeVariant, string> = {
    pathogenic:
      "bg-[#FEF2F2] text-[#B91C1C] border border-[#FCA5A5] dark:bg-red-950/40 dark:text-red-300 dark:border-red-800",
    benign:
      "bg-[#F0FDF4] text-[#15803D] border border-[#86EFAC] dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
    uncertain:
      "bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A] dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
    neutral:
      "bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
    brand:
      "bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
  };

  const dotColors: Record<BadgeVariant, string> = {
    pathogenic: "bg-[#DC2626]",
    benign: "bg-[#16A34A]",
    uncertain: "bg-[#D97706]",
    neutral: "bg-slate-400",
    brand: "bg-[#059669]"
  };

  const sizeStyles = {
    sm: "text-[11px] font-semibold px-2 py-0.5 gap-1 rounded-md",
    md: "text-xs font-semibold px-2.5 py-1 gap-1.5 rounded-full"
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center tracking-wide shrink-0 transition-colors",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={clsx("w-1.5 h-1.5 rounded-full shrink-0", dotColors[variant])}
          aria-hidden="true"
        />
      )}
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
