"use server";

import { createClient } from "@/lib/supabase/server";

export interface Supplier {
  id: string;
  supplier_name: string;
  contact_number: number;
  purchase_link: string;
  user_id: string;
}

export type SupplierInsert = Omit<Supplier, "id" | "user_id">;

export const insertSupplier = async (supplier: SupplierInsert) => {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("User not authenticated");
  }

  const { error } = await supabase.from("suppliers").insert({
    supplier_name: supplier.supplier_name,
    contact_number: supplier.contact_number,
    purchase_link: supplier.purchase_link,
    user_id: user.id,
  });

  if (error) {
    console.error("Failed to insert supplier:", error.message);
    throw new Error("Failed to insert supplier");
  }
};

export async function getPaginatedSuppliersByUser(
  page: number,
  pageSize: number
) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const supabase = await createClient();

  const query = supabase
    .from("suppliers")
    .select("*", { count: "exact" })
    .range(from, to)
    .order("id");

  const { data, error, count } = await query;

  if (error) throw error;

  return { data, total: count ?? 0 };
}
