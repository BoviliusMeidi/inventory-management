"use client";

import { useEffect, useState } from "react";
import { createClientBrowser } from "@/lib/supabase/client";
import PasswordInput from "@/components/ui/PasswordInput/PasswordInput";
import RedirectingSpinner from "@/components/ui/RedirectingSpinner";
import { Button } from "@/components/ui/Button";

export default function UpdatePasswordForm() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isRedirecting, setIsRiderecting] = useState(false);

  useEffect(() => {
    const verifyRecovery = async () => {
      const supabase = createClientBrowser();
      const params = new URLSearchParams(window.location.search);
      const token_hash = params.get("token_hash");

      window.history.replaceState({}, document.title, "/update-password");

      if (!token_hash) {
        setErrorMessage("Invalid or missing token.");
        return;
      }

      const { error } = await supabase.auth.verifyOtp({
        token_hash,
        type: "recovery",
      });

      if (error) {
        console.error("Verify Otp error:", error);
        setErrorMessage("Your reset link is invalid or expired.");
      }
    };

    verifyRecovery();
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setErrorMessage(null);
    setSuccess(null);

    const supabase = createClientBrowser();
    const formData = new FormData(e.target as HTMLFormElement);
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setErrorMessage(error.message);
    } else {
      setSuccess("Password updated successfully!");
      setIsRiderecting(true);
      setTimeout(() => {
        supabase.auth.signOut();
        window.location.href = "/login";
      }, 1500);
    }

    setIsPending(false);
  };

  if (isRedirecting) {
    return <RedirectingSpinner text="Redirecting to login..." />;
  }

  return (
    <form
      onSubmit={handleUpdatePassword}
      className="flex flex-col gap-4 w-full sm:w-100"
    >
      <PasswordInput
        name="password"
        label="New Password"
        placeholder="Enter your new password"
      />
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {success && <p className="text-green-600">{success}</p>}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Updating..." : "Update Password"}
      </Button>
    </form>
  );
}
