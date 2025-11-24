"use server";

import { createClientServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { sanitizePhoneNumber } from "@/lib/utils/formatters";

export interface Customer {
  id: string;
  name: string;
  address: string;
  contact_number: number;
  user_id: string;
}

type FormState = {
  success: boolean;
  message: string;
};

export async function getAllCustomers() {
  const supabase = await createClientServer();

  const { data, error } = await supabase
    .from("customers")
    .select("id, name, address, contact_number")
    .order("name");

  if (error) {
    console.error("Error fetching all customers:", error.message);
    return [];
  }

  return data;
}
