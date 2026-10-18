"use client";

import { Moon, Sun } from "lucide-react";
import clsx from "clsx";

interface ThemeToggleProps {
  className?: string;
  isDark: boolean;
  onToggle: () => void;
}

export function ThemeToggle({ className, isDark, onToggle }: ThemeToggleProps) {
  return (
    <button
      type="button"
      className={clsx(
        "flex h-8 w-16 cursor-pointer items-center rounded-full border p-1 transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2",
        isDark ? "border-slate-700 bg-slate-900" : "border-sky-200 bg-white/90",
        className
      )}
      onClick={onToggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span className="flex w-full items-center justify-between">
        <span
          className={clsx(
            "flex h-6 w-6 items-center justify-center rounded-full transition-transform duration-300",
            isDark ? "translate-x-0 bg-slate-800" : "translate-x-8 bg-sky-100"
          )}
        >
          {isDark ? (
            <Moon className="h-4 w-4 text-white" strokeWidth={1.5} />
          ) : (
            <Sun className="h-4 w-4 text-sky-800" strokeWidth={1.5} />
          )}
        </span>
        <span
          className={clsx(
            "flex h-6 w-6 items-center justify-center rounded-full",
            isDark ? "bg-transparent" : "-translate-x-8"
          )}
          aria-hidden="true"
        >
          {isDark ? (
            <Sun className="h-4 w-4 text-slate-400" strokeWidth={1.5} />
          ) : (
            <Moon className="h-4 w-4 text-slate-800" strokeWidth={1.5} />
          )}
        </span>
      </span>
    </button>
  );
}
