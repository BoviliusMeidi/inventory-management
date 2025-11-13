"use client";

import { useActionState } from "react";
import Image from "next/image";
import { resetPasswordEmail } from "../../../lib/actions/auth";

const initialState = {
  error: "",
  success: "",
};

export default function ForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState(resetPasswordEmail, initialState);

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
        <Image
          src="/logo-BM.svg"
          width={60}
          height={30}
          alt="Logo BM"
          className="block w-24 sm:hidden"
        />
        <h1 className="font-bold text-2xl sm:text-4xl">Forgot Password</h1>
        <p className="opacity-70 text-center">
          Enter your registered email and we&apos;ll send you a password reset
          link.
        </p>

        <form
          action={formAction}
          className="flex flex-col gap-4 w-full sm:w-100"
        >
          <div className="flex flex-col">
            <label htmlFor="email" className="text-gray-800 font-semibold">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              className="border border-gray-600 outline-none rounded-md p-2 focus:ring-1 focus:ring-gray-600 focus:outline-none"
              placeholder="Enter your email"
              required
            />
          </div>

          {state?.error && <p className="text-red-500">{state?.error}</p>}
          {state?.success && <p className="text-green-600">{state?.success}</p>}

          <button
            type="submit"
            className="cursor-pointer rounded-md p-2 bg-blue-600 text-white"
            disabled={isPending}
          >
            {isPending ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="flex gap-2">
          <p className="opacity-70">Remember your password?</p>
          <a href="/login" className="text-blue-700">
            Log in
          </a>
        </div>
      </div>
    </div>
  );
}
