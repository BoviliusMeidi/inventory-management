"use client";

import { AuthFormCard } from "@/components/features/auth/AuthFormCard";
import { AuthHeader } from "@/components/features/auth/AuthHeader";
import { AuthFooter } from "@/components/features/auth/AuthFooter";
import ForgotPasswordForm from "@/components/features/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <AuthFormCard
      header={
        <AuthHeader
          title="Forgot Password"
          subtitle="Enter your registered email and we'll send you a password reset
          link."
        />
      }
      footer={
        <AuthFooter
          description="Remember your password?"
          linkText="Log In"
          linkHref="/login"
        />
      }
    >
      <ForgotPasswordForm />
    </AuthFormCard>
  );
}
