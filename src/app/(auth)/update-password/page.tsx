"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createClientBrowser } from "@/lib/supabase/client";

export default function UpdatePasswordPage() {
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
    return (
      <div className="flex h-screen items-center justify-center flex-col">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
        <p className="text-gray-700 text-lg font-medium">
          Redirecting to login...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-row items-center justify-around h-screen">
      <Image
        src="/logo-BM.svg"
        width={300}
        height={200}
        alt="Logo BM"
        className="hidden sm:block"
      />
      <div className="flex flex-col items-center justify-center h-screen gap-4 p-8">
        <h1 className="font-bold text-2xl sm:text-4xl">Update Password</h1>

        <form
          onSubmit={handleUpdatePassword}
          className="flex flex-col gap-4 w-full sm:w-100"
        >
          <label htmlFor="password" className="text-gray-800 font-semibold">
            New Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            className="border border-gray-600 rounded-md p-2 focus:ring-1 focus:ring-gray-600"
            placeholder="Enter your new password"
            required
          />

          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          {success && <p className="text-green-600">{success}</p>}

          <button
            type="submit"
            className="cursor-pointer rounded-md p-2 bg-blue-600 text-white"
          >
            {isPending ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
