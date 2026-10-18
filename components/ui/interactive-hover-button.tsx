"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  scrollTargetId?: string;
}

const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  InteractiveHoverButtonProps
>(
  (
    {
      text = "Button",
      className,
      scrollTargetId,
      onClick,
      type = "button",
      ...props
    },
    ref,
  ) => {
    const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
      onClick?.(event);
      if (event.defaultPrevented || !scrollTargetId) return;

      document.getElementById(scrollTargetId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    };

    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "group relative inline-flex h-14 w-56 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-[#74b9dc] bg-[#e7f6ff] px-6 text-center text-base font-semibold text-[#12344d] shadow-[0_8px_22px_rgba(22,113,158,0.16)] transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(22,113,158,0.25)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/60 dark:border-sky-300/40 dark:bg-[#102b40] dark:text-sky-50",
          className,
        )}
        onClick={handleClick}
        {...props}
      >
        <span className="relative z-20 inline-flex items-center gap-2 transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
          {text}
        </span>
        <span className="absolute inset-0 z-20 flex -translate-x-8 items-center justify-center gap-2 text-white opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
          <span>{text}</span>
          <ArrowRight aria-hidden="true" className="h-5 w-5" />
        </span>
        <span
          aria-hidden="true"
          className="absolute left-[20%] top-[40%] z-10 h-2 w-2 scale-0 rounded-full bg-[#087eae] opacity-0 transition-all duration-500 ease-out group-hover:left-0 group-hover:top-0 group-hover:h-full group-hover:w-full group-hover:scale-110 group-hover:rounded-full group-hover:bg-[#087eae] group-hover:opacity-100 group-focus-visible:left-0 group-focus-visible:top-0 group-focus-visible:h-full group-focus-visible:w-full group-focus-visible:scale-110 group-focus-visible:opacity-100 dark:bg-[#1689b8] dark:group-hover:bg-[#087eae]"
        />
      </button>
    );
  },
);

InteractiveHoverButton.displayName = "InteractiveHoverButton";

export { InteractiveHoverButton };
