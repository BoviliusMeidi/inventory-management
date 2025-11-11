"use client";

import Image from "next/image";
import { useState } from "react";
import { login } from "@/app/auth/api/action";

export default function LoginPage() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const response = await login(formData);

    if (response.error) {
      setErrorMessage(response.error);
    } else {
      window.location.href = "/dashboard";
    }
  };
  return (
    <div className="flex flex-row items-center justify-around h-screen">
      <Image
        src="/logo-BM.svg"
        width={300}
        height={200}
        alt="Logo BM"
        className="hidden sm:block"
      />
      <div className="flex flex-col items-center justify-center h-screen gap-4 sm:gap-4 p-8">
        <Image
          src="/logo-BM.svg"
          width={60}
          height={30}
          alt="Logo BM"
          className="block w-24 sm:hidden"
        />
        <h1 className="font-bold text-2xl sm:text-4xl">
          Log in to your account
        </h1>
        <p className="opacity-70">Welcome back! Please enter your details.</p>
        <form
          onSubmit={handleLogin}
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
          </div>
          <div className="flex flex-row justify-between gap-4">
            <label className="flex items-center gap-2 text-xs sm:text-base">
              <input type="checkbox" className="accent-blue-600" />
              Remember for 30 days
            </label>
            <a href="" className="text-red-700 text-sm sm:text-base">
              Forgot Password
            </a>
          </div>
          {errorMessage && (
            <div className="text-red-500">
              <p>{errorMessage}</p>
            </div>
          )}
          <button className="cursor-pointer rounded-md p-1 bg-blue-600 text-white">
            Sign In
          </button>
          <button className="cursor-pointer border border-gray-400 outline-none rounded-md p-1 focus:ring-1 focus:ring-gray-600 focus:outline-none flex justify-center items-center gap-2">
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
              width={20}
              height={20}
              alt="google-logo"
            />
            Sign In with Google
          </button>
        </form>
        <div className="flex gap-2">
          <p className="opacity-70">Don&apos;t have an account?</p>
          <p>
            <a href="/signup" className="text-blue-700">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
