"use client";

import { useActionState } from "react";
import { resetPasswordEmail } from "../../../lib/actions/auth";
import InputField from "@/components/ui/InputField";
import { Button } from "@/components/ui/Button";

const initialState = {
  error: "",
  success: "",
};

export default function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(
    resetPasswordEmail,
    initialState
  );

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

      {state?.error && <p className="text-red-500">{state?.error}</p>}
      {state?.success && <p className="text-green-600">{state?.success}</p>}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Sending..." : "Send Reset Link"}
      </Button>
    </form>
  );
}
