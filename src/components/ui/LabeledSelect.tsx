import * as React from "react";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

interface LabeledSelectProps extends SelectProps {
  label: string;
  id: string;
}

export default function LabeledSelect({
  label,
  id,
  className,
  children,
  ...props
}: LabeledSelectProps) {
  return (
    <div className="text-sm sm:text-base flex items-center justify-between gap-2">
      <label htmlFor={id} className="text-gray-800 w-1/3 font-semibold">
        {label}
      </label>
      <select
        id={id}
        className={`border rounded-md p-2 w-2/3 bg-white cursor-pointer ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}