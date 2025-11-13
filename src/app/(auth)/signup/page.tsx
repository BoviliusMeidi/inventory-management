"use client";

import { AuthFormCard } from "@/components/features/auth/AuthFormCard";
import { AuthHeader } from "@/components/features/auth/AuthHeader";
import { AuthFooter } from "@/components/features/auth/AuthFooter";
import SignUpForm from "@/components/features/auth/SignUpForm";

export default function SignUpPage() {
  return (
    <AuthFormCard
      header={
        <AuthHeader
          title="Create an account"
          subtitle="Start your 30-day free trial."
        />
      }
      footer={
        <AuthFooter
          description="Already have an account?"
          linkText="Log In"
          linkHref="/login"
        />
      }
    >
      <SignUpForm />
    </AuthFormCard>
  );
}
