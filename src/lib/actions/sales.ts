"use server";

import { revalidatePath } from "next/cache";
import { createClientServer } from "@/lib/supabase/server";
import { FormState, SaleItemState, SalesStatsData } from "@/lib/types";

export async function insertSale(
  previousState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await createClientServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, message: "Not authenticated" };

  const customer_id = Number(formData.get("customer_id")) || 1;
  const payment_method = formData.get("payment_method") as string;
  const payment_status = formData.get("payment_status") as string;
  const sale_date = formData.get("sale_date") as string;
  const notes = formData.get("notes") as string;
  const itemsJSON = formData.get("items") as string;

  let items: { product_id: number; quantity: number }[];
  try {
    items = JSON.parse(itemsJSON).map((item: SaleItemState) => ({
      product_id: parseInt(item.product_id, 10),
      quantity: parseInt(item.quantity, 10),
    }));
    if (items.length === 0)
      return { success: false, message: "Cart is empty." };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return { success: false, message: "Invalid items data." };
  }

  const { error } = await supabase.rpc("create_new_sale", {
    p_user_id: user.id,
    p_customer_id: customer_id,
    p_payment_method: payment_method,
    p_payment_status: payment_status,
    p_sale_date: sale_date || new Date().toISOString(),
    p_notes: notes,
    p_items: items,
  });

  if (error) {
    console.error("Sale RPC Error:", error.message);
    return { success: false, message: error.message };
  }

  revalidatePath("/sales");
  revalidatePath("/inventory");
  return { success: true, message: "Sale recorded successfully!" };
}

export async function updateSale(
  previousState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const supabase = await createClientServer();
  const id = Number(formData.get("sale_id"));
  const payment_status = formData.get("payment_status") as string;
  const payment_method = formData.get("payment_method") as string;
  const sale_date = formData.get("sale_date") as string;

  if (!id) {
    return { success: false, message: "Invalid Sale ID." };
  }

  const { error } = await supabase
    .from("sales")
    .update({
      payment_status,
      payment_method,
      sale_date: sale_date || null,
    })
    .eq("id", id);

  if (error) {
    console.error("Update Sale Error:", error.message);
    return { success: false, message: error.message };
  }

  revalidatePath("/sales");
  return { success: true, message: "Sale updated successfully." };
}

export async function deleteSale(saleId: number): Promise<FormState> {
  const supabase = await createClientServer();

  const { data: sales, error: fetchError } = await supabase
    .from("sales")
    .select("payment_status")
    .eq("id", saleId)
    .single();

  if (fetchError) {
    return { success: false, message: "Could not find the sales." };
  }

  if (sales.payment_status === "Paid") {
    return { success: false, message: "Cannot delete a paid sales." };
  }

  const { error: deleteError } = await supabase
    .from("sales")
    .delete()
    .eq("id", saleId);

  if (deleteError) {
    console.error("Delete Error:", deleteError.message);
    return { success: false, message: deleteError.message };
  }

  revalidatePath("/sales");
  revalidatePath("/inventory");
  return { success: true, message: "Sale deleted and stock restored." };
}

export async function getPaginatedSales(
  page: number,
  pageSize: number,
  statusFilter: string | null,
  methodFilter: string | null,
  searchQuery?: string
) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const supabase = await createClientServer();

  let query = supabase
    .from("sales")
    .select(
      `
      id, invoice_code, total_amount, payment_method, payment_status, sale_date,
      customer:customers ( name ),
      items:sales_items (
        quantity, price_at_sale,
        product:products ( product_name, product_type, product_category )
      )
    `,
      { count: "exact" }
    )
    .range(from, to)
    .order("invoice_code", { ascending: false });

  if (statusFilter) {
    query = query.eq("payment_status", statusFilter);
  }

  if (methodFilter) {
    query = query.eq("payment_method", methodFilter);
  }

  if (searchQuery) {
    query = query.ilike("invoice_code", `%${searchQuery}%`);
  }

  const { data, error, count } = await query;
  if (error) throw error;

  return { data, total: count ?? 0 };
}

export async function getOverallSalesStats(): Promise<SalesStatsData | null> {
  const supabase = await createClientServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .rpc("get_overall_sales_stats", {
      p_user_id: user.id,
    })
    .single<SalesStatsData>();

  if (error) {
    console.error("Error fetching sales stats (RPC):", error.message);
    return null;
  }

  return data;
}
