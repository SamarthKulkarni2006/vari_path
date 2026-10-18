"use client";

import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

export interface ToastMessage {
  id: string;
  text: string;
  type?: ToastType;
}

// Global dispatcher helper
export function showToast(text: string, type: ToastType = "success") {
  if (typeof window === "undefined") return;
  const event = new CustomEvent<ToastMessage>("varipath-toast", {
    detail: {
      id: Math.random().toString(36).substring(2, 9),
      text,
      type
    }
  });
  window.dispatchEvent(event);
}

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handleToast = (e: Event) => {
      const customEvent = e as CustomEvent<ToastMessage>;
      const toast = customEvent.detail;
      setToasts((prev) => [...prev, toast]);

      // Auto-dismiss after 3 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 3000);
    };

    window.addEventListener("varipath-toast", handleToast);
    return () => {
      window.removeEventListener("varipath-toast", handleToast);
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((toast) => {
        const type = toast.type || "success";
        const icon =
          type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          ) : type === "error" ? (
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
          ) : (
            <Info className="w-5 h-5 text-blue-500 shrink-0" />
          );

        return (
          <div
            key={toast.id}
            role="status"
            className={clsx(
              "pointer-events-auto flex items-center justify-between p-3.5 bg-white dark:bg-slate-900 border rounded-xl shadow-lg transition-all transform animate-fade-in text-sm font-medium",
              type === "success" && "border-emerald-200 dark:border-emerald-800 text-slate-800 dark:text-slate-100",
              type === "error" && "border-red-200 dark:border-red-800 text-red-800 dark:text-red-200",
              type === "info" && "border-blue-200 dark:border-blue-800 text-slate-800 dark:text-slate-100"
            )}
          >
            <div className="flex items-center gap-2.5">
              {icon}
              <span>{toast.text}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-400"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
