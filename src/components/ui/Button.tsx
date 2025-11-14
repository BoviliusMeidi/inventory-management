"use client";
import * as React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, variant = "primary", ...props }, ref) => {
    const baseStyles = "cursor-pointer rounded-md py-2 px-4";
    const disabledStyles = "disabled:opacity-50 disabled:cursor-not-allowed";
    const variantStyles =
      variant === "primary"
        ? "bg-blue-600 text-white"
        : "border border-gray-400 hover:underline";
    const mergedClasses = [baseStyles, disabledStyles, variantStyles, className]
      .filter(Boolean)
      .join(" ");

    return (
      <button className={mergedClasses} ref={ref} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
