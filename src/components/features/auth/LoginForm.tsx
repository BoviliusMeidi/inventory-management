"use client";

import { useActionState } from "react";
import { login } from "@/lib/actions/auth";
import PasswordInput from "@/components/ui/PasswordInput/PasswordInput";
import InputField from "@/components/ui/InputField";
import { Button } from "@/components/ui/Button";

const initialState = { success: "", error: "" };

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4 w-full sm:w-100">
      <InputField
        id="email"
        name="email"
        type="email"
        label="Email"
        placeholder="Enter your email"
        required
      />
      <PasswordInput name="password" placeholder="Enter your password" />
      <div className="flex flex-row justify-between gap-4">
        <label className="flex items-center gap-2 text-xs sm:text-base">
          <input type="checkbox" className="accent-blue-600" />
          Remember for 30 days
        </label>
        <a
          href="/forgot-password"
          className="text-red-700 text-sm sm:text-base"
        >
          Forgot Password
        </a>
      </div>
      {state.error && (
        <div className="text-red-500">
          <p>{state.error}</p>
        </div>
      )}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Signing In..." : "Sign In"}
      </Button>
    </form>
  );
}
