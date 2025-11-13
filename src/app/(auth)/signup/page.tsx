"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { signup } from "@/lib/actions/auth";

const initialState = { success: "", error: "" };

export default function SignUpPage() {
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
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <Image
          src="/logo-BM.svg"
          width={60}
          height={30}
          alt="Logo BM"
          className="block w-24 sm:hidden"
        />
        <h1 className="font-bold text-2xl sm:text-4xl">Create an account</h1>
        <p className="opacity-70">Start your 30-day free trial.</p>
        <form
          action={formAction}
          className="flex flex-col gap-4 w-full sm:w-100"
        >
          <div className="flex flex-col">
            <label htmlFor="name" className="text-gray-800 font-semibold">
              Name
            </label>
            <input
              id="name"
              type="username"
              name="display_name"
              className="border border-gray-600 outline-none rounded-md p-2 focus:ring-1 focus:ring-gray-600 focus:outline-none"
              placeholder="Enter your name"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="name" className="text-gray-800 font-semibold">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              className="border border-gray-600 outline-none rounded-md p-2 focus:ring-1 focus:ring-gray-600 focus:outline-none"
              placeholder="Enter your email"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password" className="text-gray-800 font-semibold">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              className="border border-gray-600 outline-none rounded-md p-2 focus:ring-1 focus:ring-gray-600 focus:outline-none"
              placeholder="Enter your password"
            />
            <p className="text-gray-600 text-xs sm:text-base">
              *Must be at least 8 characters.
            </p>
          </div>
          {/* Display error message */}
          {state.error && (
            <div className="text-red-500">
              <p>{state.error}</p>
            </div>
          )}
          <button
            type="submit"
            disabled={isPending}
            className="cursor-pointer rounded-md p-1 bg-blue-600 text-white"
          >
            {isPending ? "Signing up..." : "Sign Up"}
          </button>
        </form>
        <div className="flex gap-2">
          <p className="opacity-70">Already have an account?</p>
          <p>
            <a href="/login" className="text-blue-700">
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
