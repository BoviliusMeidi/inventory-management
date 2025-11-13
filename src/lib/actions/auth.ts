"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return { error: "Invalid email or password." };
  }

  revalidatePath("/dashboard", "layout");
  redirect("/dashboard");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();
  const dataForm = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    display_name: formData.get("display_name") as string,
  };

  const { data: existingUser } = await supabase
    .from("users")
    .select("email")
    .match({ email: dataForm.email })
    .single();

  if (existingUser) {
    return {
      error:
        "Email is already registered. Please use another email for sign up.",
    };
  }

  const { data, error } = await supabase.auth.signUp(dataForm);

  if (error) {
    return { error: error.message };
  } else {
    const { error } = await supabase.from("users").insert([
      {
        id: data.user?.id,
        name: dataForm.display_name,
        email: data.user?.email,
      },
    ]);
    if (error) {
      return {
        error: "Something Wrong in Database, please contact developer.",
      };
    }
  }

  revalidatePath("/dashboard", "layout");
  redirect("/login");
}

export async function logout() {
  const supabase = await createClient();

  await supabase.auth.signOut();

  revalidatePath("/dashboard", "layout");
  redirect("/login");
}

export async function resetPasswordEmail(
  prevState: { error: string; success: string },
  formData: FormData
) {
  const supabase = await createClient();
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
