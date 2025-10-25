import { createClient } from "@/app/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Page() {
  // Membuat koneksi ke Supabase (server-side)
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    redirect("/dashboard");
  } else {
    redirect("/login");
  }
}
