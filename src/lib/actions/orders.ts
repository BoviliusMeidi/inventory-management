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