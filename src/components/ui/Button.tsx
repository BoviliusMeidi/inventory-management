"use client";

import * as React from "react";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => {
    const baseStyles = "cursor-pointer rounded-md p-2 bg-blue-600 text-white ";
    const disabledStyles = "disabled:opacity-50 disabled:cursor-not-allowed";
    const mergedClasses = [baseStyles, disabledStyles, className]
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
