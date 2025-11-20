"use server";

import { createClientServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface Order {
  id: number;
  status: string;
  total_cost: number;
  expected_delivery_date: string;
  supplier: { supplier_name: string } | null;
  items: {
    quantity: number;
    cost_per_item: number;
    product: {
      product_name: string;
      product_type: string;
      product_category: string;
    } | null;
  }[];
}

type RawOrderItem = {
  product_id: string;
  product_name: string;
  product_type: string;
  quantity: string;
  cost_per_item: string;
};

type OrderItem = {
  product_id: number;
  quantity: number;
  cost_per_item: number;
};

type OrderStatsData = {
  pending_count: number;
  shipped_count: number;
  pending_value: number;
  completed_30d_count: number;
};

type FormState = {
  success: boolean;
  message: string;
};

export async function insertPurchaseOrder(
  previousState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await createClientServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, message: "Not authenticated" };

  const supplier_id = Number(formData.get("supplier_id"));
  const status = formData.get("status") as string;
  const expected_delivery_date = formData.get(
    "expected_delivery_date"
  ) as string;
  const itemsJSON = formData.get("items") as string;

  let items: OrderItem[];
  try {
    items = JSON.parse(itemsJSON).map((item: RawOrderItem) => ({
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
