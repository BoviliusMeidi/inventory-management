"use server";

import { createClientServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import {
  FormState,
  OrderItem,
  OrderItemState,
  OrderStatsData,
} from "@/lib/types";

export async function insertOrder(
  previousState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await createClientServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, message: "Not authenticated" };

  console.log(formData.get("supplier_id"));

  const supplier_id = Number(formData.get("supplier_id"));
  const status = formData.get("status") as string;
  const expected_delivery_date = formData.get(
    "expected_delivery_date"
  ) as string;
  const itemsJSON = formData.get("items") as string;

  let items: OrderItem[];
  try {
    items = JSON.parse(itemsJSON).map((item: OrderItemState) => ({
      product_id: parseInt(item.product_id, 10),
      quantity: parseInt(item.quantity, 10),
      cost_per_item: parseFloat(item.cost_per_item),
    }));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err: unknown) {
    return { success: false, message: "Invalid order items." };
  }

  const total_cost = items.reduce(
    (acc, item) => acc + item.quantity * item.cost_per_item,
    0
  );

  console.log(supplier_id);

  const { data: newOrderId, error } = await supabase.rpc(
    "create_new_purchase_order",
    {
      p_supplier_id: supplier_id,
      p_status: status,
      p_expected_delivery_date: expected_delivery_date || null,
      p_total_cost: total_cost,
      p_user_id: user.id,
      p_items: items,
    }
  );

  if (error) {
    console.error("RPC Error:", error.message);
    return {
      success: false,
      message: `Failed to create order: ${error.message}`,
    };
  }

  revalidatePath("/orders");
  revalidatePath("/inventory");
  return {
    success: true,
    message: `Order #${newOrderId} created successfully!`,
  };
}

export async function updateOrder(
  previousState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const supabase = await createClientServer();

  const id = Number(formData.get("order_id"));
  const newStatus = formData.get("status") as string;
  const newDate = formData.get("expected_delivery_date") as string;

  if (!id || !newStatus) {
    return { success: false, message: "Invalid data." };
  }

  if (newStatus === "Completed") {
    const { error: rpcError } = await supabase.rpc("complete_purchase_order", {
      p_order_id: id,
    });

    if (rpcError) {
      console.error("RPC Error (complete_purchase_order):", rpcError.message);
      return { success: false, message: rpcError.message };
    }
  } else {
    const { error } = await supabase
      .from("orders")
      .update({
        status: newStatus,
        expected_delivery_date: newDate || null,
      })
      .eq("id", id);
    if (error) {
      console.error("Update Error:", error.message);
      return { success: false, message: error.message };
    }
  }

  revalidatePath("/orders");
  revalidatePath("/inventory");
  return { success: true, message: "Order updated successfully!" };
}

export async function deleteOrder(orderId: number): Promise<FormState> {
  const supabase = await createClientServer();

  const { data: order, error: fetchError } = await supabase
    .from("orders")
    .select("status")
    .eq("id", orderId)
    .single();

  if (fetchError) {
    return { success: false, message: "Could not find the order." };
  }

  if (order.status === "Completed") {
    return { success: false, message: "Cannot delete a completed order." };
  }

  const { error: deleteError } = await supabase
    .from("orders")
    .delete()
    .eq("id", orderId);

  if (deleteError) {
    console.error("Delete Error:", deleteError.message);
    return { success: false, message: deleteError.message };
  }

  revalidatePath("/orders");
  return { success: true, message: "Order deleted successfully." };
}

export async function getOverallOrderStats(): Promise<OrderStatsData | null> {
  const supabase = await createClientServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .rpc("get_overall_order_stats", {
      p_user_id: user.id,
    })
    .single();

  if (error) {
    console.error("Error fetching order stats (RPC):", error.message);
    return null;
  }

  return data as OrderStatsData;
}

export async function getPaginatedOrders(
  page: number,
  pageSize: number,
  filter: string | null,
  searchQuery?: string
) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const supabase = await createClientServer();

  let query = supabase
    .from("orders")
    .select(
      `
      id,
      po_code,
      status,
      total_cost,
      expected_delivery_date,
      supplier:suppliers ( supplier_name ),
      items:order_items (
        quantity,
        cost_per_item,
        product:products ( product_name, product_type, product_category )
      )
    `,
      { count: "exact" }
    )
    .range(from, to)
    .order("expected_delivery_date", { ascending: false });

  if (filter === "All") {
  } else if (filter) {
    query = query.eq("status", filter);
  } else {
    query = query.in("status", ["Pending", "Shipped"]);
  }

  if (searchQuery) {
    query = query.ilike("po_code", `%${searchQuery}%`);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error("Error fetching orders:", error.message);
    throw error;
  }

  return { data, total: count ?? 0 };
}
