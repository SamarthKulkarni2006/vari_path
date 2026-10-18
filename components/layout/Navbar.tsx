"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Dna, Menu, X, BarChart2 } from "lucide-react";
import { useHistory } from "@/hooks/useHistory";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { history, loading } = useHistory();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize dark mode from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("varipath.theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (saved === "dark" || (!saved && prefersDark)) {
        setIsDarkMode(true);
        document.documentElement.classList.add("dark");
      } else {
        setIsDarkMode(false);
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);

  const toggleDarkMode = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("varipath.theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("varipath.theme", "light");
    }
  };

  const navLinks = [
    { label: "Analyze", href: "/" },
    { label: "Results", href: "/results" },
    {
      label: "History",
      href: "/history",
      badgeCount: !loading && history.length > 0 ? history.length : null
    },
    { label: "Analytics", href: "/analytics", icon: BarChart2 }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-transparent backdrop-blur-md border-b border-sky-200/60 dark:border-sky-900/60 transition-colors">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-lg p-1"
        >
          <div className="brand-mark group-hover:scale-105 transition-transform">
            <Dna className="h-5 w-5" strokeWidth={2.2} />
          </div>
          <div>
            <div className="flex items-center">
              <span className="brand-wordmark" aria-label="VariPath">
                <span>Vari</span><em>Path</em>
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 hidden sm:block -mt-0.5">
              Clinical Genomics Risk Prediction
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2" aria-label="Main Navigation">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "relative px-3.5 py-1.5 text-sm font-medium rounded-lg transition-colors inline-flex items-center gap-1.5",
                  isActive
                    ? "text-sky-800 bg-sky-100/90 font-semibold"
                    : "text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-sky-100 hover:bg-sky-100/70 dark:hover:bg-sky-950/70"
                )}
              >
                {item.icon && <item.icon className="w-4 h-4 opacity-75" />}
                <span>{item.label}</span>
                {item.badgeCount !== null && (
                  <span className="ml-0.5 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-sky-700 text-white">
                    {item.badgeCount}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="h-4 w-px bg-sky-200 mx-1" />

          {/* Dark Mode Toggle */}
          <ThemeToggle isDark={isDarkMode} onToggle={toggleDarkMode} />
        </nav>

        {/* Mobile controls */}
        <div className="flex md:hidden items-center gap-1">
          <ThemeToggle isDark={isDarkMode} onToggle={toggleDarkMode} />

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:bg-sky-100/70 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-sky-200/70 bg-sky-50/95 dark:border-[#17354d] dark:bg-[#081726] backdrop-blur-md px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={clsx(
                  "flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  isActive
                    ? "text-sky-800 bg-sky-100"
                    : "text-slate-700 hover:bg-sky-100/70"
                )}
              >
                <div className="flex items-center gap-2">
                  {item.icon && <item.icon className="w-4 h-4" />}
                  <span>{item.label}</span>
                </div>
                {item.badgeCount !== null && (
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-sky-700 text-white">
                    {item.badgeCount}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
