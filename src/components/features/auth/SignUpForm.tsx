"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { signup } from "@/lib/actions/auth";
import PasswordInput from "@/components/ui/PasswordInput/PasswordInput";
import InputField from "@/components/ui/InputField";
import RedirectingSpinner from "@/components/ui/RedirectingSpinner";
import { Button } from "@/components/ui/Button";

const initialState = { success: "", error: "" };

export default function SignUpForm() {
  const [state, formAction, isPending] = useActionState(signup, initialState);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      setIsRedirecting(true);
      setTimeout(() => router.push("/login"), 1500);
    }
  }, [router, state.success]);

  if (isRedirecting) {
    return <RedirectingSpinner text="Redirecting to login..." />;
  }

  return (
    <form action={formAction} className="flex flex-col gap-4 w-full sm:w-100">
      <InputField
        id="name"
        name="display_name"
        label="Name"
        placeholder="Enter your name"
        required
      />
      <InputField
        id="email"
        name="email"
        type="email"
        label="Email"
        placeholder="Enter your email"
        required
      />
      <PasswordInput
        name="password"
        placeholder="Enter your password"
        hint="*Must be at least 8 characters."
      />
      {state.error && (
        <div className="text-red-500">
          <p>{state.error}</p>
        </div>
      )}

      <Button
        type="submit"
        disabled={isPending}
      >
        {isPending ? "Signing Up..." : "Sign Up"}
      </Button>
    </form>
  );
}
