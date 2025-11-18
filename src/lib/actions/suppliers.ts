"use server";

import { createClientServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { sanitizePhoneNumber } from "../utils/formatters";

export interface Supplier {
  id: string;
  supplier_name: string;
  address: string;
  contact_number: number;
  purchase_link: string;
  user_id: string;
}

type FormState = {
  success: boolean;
  message: string;
};

export async function getAllSuppliers() {
  const supabase = await createClientServer();

  const { data, error } = await supabase
    .from("suppliers")
    .select("id, supplier_name, contact_number")
    .order("supplier_name");

  if (error) {
    console.error("Error fetching all suppliers:", error.message);
    return [];
  }

  return data;
}

export const insertSupplier = async (
  previousState: FormState,
  formData: FormData
): Promise<FormState> => {
  const supabase = await createClientServer();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, message: "User not authenticated." };
  }

  const supplier_name = formData.get("supplier_name") as string;
  const address = formData.get("address") as string;
  const contact_number_str = formData.get("contact_number") as string;
  const purchase_link = formData.get("purchase_link") as string;

  const sanitized_contact = sanitizePhoneNumber(contact_number_str);

  if (!supplier_name || !sanitized_contact) {
    return {
      success: false,
      message: "Supplier name and contact are required.",
    };
  }

  const contact_number = parseInt(sanitized_contact, 10);
  if (isNaN(contact_number)) {
    return { success: false, message: "Invalid contact number format." };
  }

  const { error } = await supabase.from("suppliers").insert({
    supplier_name: supplier_name,
    address: address,
    contact_number: contact_number,
    purchase_link: purchase_link,
    user_id: user.id,
  });

  if (error) {
    console.error("Failed to insert supplier:", error.message);
    return {
      success: false,
      message: `Failed to insert supplier: ${error.message}`,
    };
  }

  revalidatePath("/suppliers");
  return { success: true, message: "Supplier added successfully!" };
};

export async function updateSupplier(
  previousState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const supabase = await createClientServer();
  const id = formData.get("id") as string;
  const supplier_name = formData.get("supplier_name") as string;
  const contact_raw = formData.get("contact_number") as string;
  const purchase_link = formData.get("purchase_link") as string;

  const contact_sanitized = sanitizePhoneNumber(contact_raw);
  const contact_number = parseInt(contact_sanitized, 10);

  if (!id || !supplier_name || isNaN(contact_number)) {
    return { success: false, message: "Invalid data." };
  }

  const { error } = await supabase
    .from("suppliers")
    .update({
      supplier_name,
      contact_number,
      purchase_link,
    })
    .eq("id", id);

  if (error) {
    console.error("Update Supplier Error:", error.message);
    return { success: false, message: error.message };
  }

  revalidatePath("/suppliers");
  return { success: true, message: "Supplier updated successfully." };
}

export async function deleteSupplier(id: string): Promise<FormState> {
  const supabase = await createClientServer();

  const { error } = await supabase.from("suppliers").delete().eq("id", id);

  if (error) {
    console.error("Delete Supplier Error:", error.message);
    return { success: false, message: error.message };
  }

  revalidatePath("/suppliers");
  return { success: true, message: "Supplier deleted successfully." };
}

export async function getPaginatedSuppliersByUser(
  page: number,
  pageSize: number
) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const supabase = await createClientServer();

  const query = supabase
    .from("suppliers")
    .select("*", { count: "exact" })
    .range(from, to)
    .order("id");

  const { data, error, count } = await query;

  if (error) throw error;

  return { data, total: count ?? 0 };
}
