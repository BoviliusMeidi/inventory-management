"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClientServer } from "@/lib/supabase/server";

export async function login(
  prevState: { success: string; error: string },
  formData: FormData
) {
  const supabase = await createClientServer();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { success: "", error: "Invalid email or password." };
  }

  revalidatePath("/dashboard", "layout");
  redirect("/dashboard");
}

export async function signup(
  prevState: { success: string; error: string },
  formData: FormData
) {
  const supabase = await createClientServer();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const display_name = formData.get("display_name") as string;

  if (!email || !password || !display_name) {
    return { success: "", error: "All fields are required." };
  }

  const { data: existingUser } = await supabase
    .from("users")
    .select("email")
    .eq("email", email)
    .maybeSingle();

  if (existingUser) {
    return {
      success: "",
      error: "Email is already registered. Please use another email.",
    };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { success: "", error: error.message };
  }

  const { error: dbError } = await supabase.from("users").insert([
    {
      id: data.user?.id,
      name: display_name,
      email: data.user?.email,
    },
  ]);

  if (dbError) {
    return { success: "", error: "Error saving user to database." };
  }

  return {
    success: "Account created successfully! Please check your email to verify.",
    error: "",
  };
}

export async function logout() {
  const supabase = await createClientServer();

  await supabase.auth.signOut();

  revalidatePath("/dashboard", "layout");
  redirect("/login");
}

export async function resetPasswordEmail(
  prevState: { error: string; success: string },
  formData: FormData
) {
  const supabase = await createClientServer();
  const email = formData.get("email");

  if (typeof email !== "string" || !email) {
    return {
      success: "",
      error: "Email is required.",
    };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    console.error("Supabase reset error:", error);
    return {
      success: "",
      error: error.message,
    };
  }

  return {
    success: "Password reset link sent! Check your email inbox.",
    error: "",
  };
}

export async function updatePasswordEmail(
  prevState: { success: string; error: string },
  formData: FormData
) {
  const supabase = await createClientServer();

  const rawParams = formData.get("searchParams");
  const paramsString =
    typeof rawParams === "string" ? rawParams : String(rawParams ?? "");
  const params = new URLSearchParams(paramsString);

  console.log("paramsString:", paramsString);
  console.log("params:", params);
  const token_hash = params.get("token_hash");
  const type = params.get("type");

  if (!token_hash || type !== "recovery") {
    return {
      success: "",
      error: "Invalid or missing token.",
    };
  }

  const { error: verifyError } = await supabase.auth.verifyOtp({
    token_hash,
    type: "recovery",
  });

  if (verifyError) {
    return {
      success: "",
      error: "Invalid or expired reset link.",
    };
  }

  const password = formData.get("password") as string;
  if (!password) {
    return {
      success: "",
      error: "Password is required.",
    };
  }

  const { error: updateError } = await supabase.auth.updateUser({ password });

  if (updateError) {
    return {
      success: "",
      error: updateError.message,
    };
  }

  return {
    success: "Password updated successfully! Please log in again.",
    error: "",
  };
}
