"use client";

import { useActionState, useEffect, useRef } from "react";
import { updatePasswordSettings } from "@/lib/actions/auth";
import { Button } from "@/components/ui/Button";
import { FormState } from "@/lib/types";
import PasswordInput from "@/components/ui/PasswordInput";

const initialState: FormState = { success: false, message: "" };

export function SecuritySettings() {
  const [state, formAction, isPending] = useActionState(
    updatePasswordSettings,
    initialState
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state?.success]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="flex flex-col gap-5 animate-in fade-in duration-300"
    >
      <div className="p-4 bg-yellow-50 text-yellow-800 text-sm rounded-md mb-2 border border-yellow-200">
        Secure your account by using a strong password.
      </div>

      {!state?.success && state?.message && (
        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-200">
          {state.message}
        </div>
      )}

      {state?.success && state?.message && (
        <div className="p-3 bg-green-50 text-green-600 text-sm rounded-md border border-green-200">
          {state.message}
        </div>
      )}

      <PasswordInput label="Current Password" name="current_password" placeholder="Enter your current password" />
      <PasswordInput label="New Password" name="new_password" placeholder="Enter your new password" />
      <PasswordInput label="Confirm Password" name="confirm_password" placeholder="Enter your confirm password" />

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Updating..." : "Update Password"}
        </Button>
      </div>
    </form>
  );
}