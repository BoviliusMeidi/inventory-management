import { createClientServer } from "@/lib/supabase/server";
import SettingsClientWrapper from "@/components/features/settings/SettingsClientWrapper";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const supabase = await createClientServer();

  const {
    data: { user: authUser },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !authUser) {
    redirect("/login");
  }

  const { data: userProfile, error: profileError } = await supabase
    .from("users")
    .select("*")
    .eq("id", authUser.id) 
    .single();

  if (profileError) {
    console.error("Error fetching profile:", profileError);
  }

  const userData = {
    id: authUser.id,
    email: authUser.email,
    ...userProfile,
  };

  return (
    <div className="flex flex-col gap-3 mx-3 md:mx-0 md:mr-3">
      <SettingsClientWrapper user={userData} />
    </div>
  );
}