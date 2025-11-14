import * as React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

interface LabeledInputProps extends InputProps {
  label: string;
  id: string;
}

export default function LabeledInput({
  label,
  id,
  className,
  ...props
}: LabeledInputProps) {
  return (
    <div className="text-sm sm:text-base flex items-center justify-between gap-2">
      <label htmlFor={id} className=" text-gray-800 w-1/3 font-semibold">
        {label}
      </label>
      <input
        id={id}
        className={`border rounded-md p-2 w-2/3 no-spinner ${className}`}
        {...props}
      />
    </div>
  );
}