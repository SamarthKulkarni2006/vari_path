import React from "react";
import clsx from "clsx";

export interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  className,
  label = "Loading..."
}) => {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-5 h-5 border-2",
    lg: "w-8 h-8 border-3"
  };

  return (
    <span
      role="status"
      aria-label={label}
      className={clsx(
        "inline-block rounded-full border-current border-t-transparent animate-spin",
        sizeClasses[size],
        className
      )}
    >
      <span className="sr-only">{label}</span>
    </span>
  );
};
