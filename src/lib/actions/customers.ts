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

export async function insertCustomer(
  previousState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await createClientServer();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, message: "User not authenticated." };
  }

  const customer_name = formData.get("customer_name") as string;
  const address = formData.get("address") as string;
  const contact_number_str = formData.get("contact_number") as string;
  const sanitized_contact = sanitizePhoneNumber(contact_number_str);

  if (!customer_name || !address || !sanitized_contact) {
    return {
      success: false,
      message: "Customer name, address, and contact are required.",
    };
  }

  const contact_number = parseInt(sanitized_contact, 10);
  if (isNaN(contact_number)) {
    return { success: false, message: "Invalid contact number format." };
  }

  const { error } = await supabase.from("customers").insert({
    name: customer_name,
    address: address,
    contact_number: contact_number,
    user_id: user.id,
  });

  if (error) {
    console.error("Failed to insert customer:", error.message);
    return {
      success: false,
      message: `Failed to insert customer: ${error.message}`,
    };
  }

  revalidatePath("/customers");
  return { success: true, message: "Customer added successfully!" };
}

export async function updateCustomer(
  previousState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const supabase = await createClientServer();
  const id = formData.get("id") as string;
  const customer_name = formData.get("customer_name") as string;
  const address = formData.get("address") as string;
  const contact_raw = formData.get("contact_number") as string;

  const contact_sanitized = sanitizePhoneNumber(contact_raw);
  const contact_number = parseInt(contact_sanitized, 10);

  if (!id || !customer_name || isNaN(contact_number)) {
    return { success: false, message: "Invalid data." };
  }

  const { error } = await supabase
    .from("customers")
    .update({
      name: customer_name,
      address,
      contact_number,
    })
    .eq("id", id);

  if (error) {
    console.error("Update Customer Error:", error.message);
    return { success: false, message: error.message };
  }

  revalidatePath("/customers");
  return { success: true, message: "Customer updated successfully." };
}

export async function deleteCustomer(id: string): Promise<FormState> {
  const supabase = await createClientServer();

  const { error } = await supabase.from("customers").delete().eq("id", id);

  if (error) {
    console.error("Delete Customer Error:", error.message);
    return { success: false, message: error.message };
  }

  revalidatePath("/customers");
  return { success: true, message: "Customer deleted successfully." };
}
