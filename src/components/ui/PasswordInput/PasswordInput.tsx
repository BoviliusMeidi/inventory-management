"use client";

import { useState } from "react";
import Image from "next/image";
import Eye from "./eye.svg";
import EyeSlash from "./eye-slash.svg";

interface PasswordInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  hint?: string;
}

export default function PasswordInput({
  name,
  label = "Password",
  placeholder,
  hint,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="text-gray-800 font-semibold">
        {label}
      </label>
      <div className="relative">
        <input
          id={name}
          name={name}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          className="border border-gray-600 outline-none rounded-md p-2 focus:ring-1 focus:ring-gray-600 w-full"
        />
        <button
          type="button"
          onClick={() => setShowPassword((p) => !p)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
        >
          <Image
            src={showPassword ? EyeSlash : Eye}
            alt={showPassword ? "Hide password" : "Show password"}
            width={20}
            height={20}
            className="opacity-70 hover:opacity-100 transition-opacity"
          />
        </button>
      </div>
      {hint && (
        <p className="text-gray-600 text-xs sm:text-base mt-1">{hint}</p>
      )}
    </div>
  );
}
