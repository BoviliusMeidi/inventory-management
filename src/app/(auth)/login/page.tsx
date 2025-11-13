"use client";

import { AuthFormCard } from "@/components/features/auth/AuthFormCard";
import { AuthHeader } from "@/components/features/auth/AuthHeader";
import { AuthFooter } from "@/components/features/auth/AuthFooter";
import LoginForm from "@/components/features/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthFormCard
      header={
        <AuthHeader
          title="Log in to your account"
          subtitle="Welcome back! Please enter your details."
        />
      }
      footer={
        <AuthFooter
          description="Don't have an account?"
          linkText="Sign Up"
          linkHref="/signup"
        />
      }
    >
      <LoginForm />
    </AuthFormCard>
  );
}
