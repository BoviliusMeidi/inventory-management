"use server";

import { createClientServer } from "@/lib/supabase/server";
import { HistoryItem, PurchaseQueryRow, SaleQueryRow } from "@/lib/types";

export async function getProductHistory(
  productId: number
): Promise<HistoryItem[]> {
  const supabase = await createClientServer();

  const { data: purchaseData } = await supabase
    .from("order_items")
    .select(
      `
      quantity,
      cost_per_item,
      order:orders (
        id,
        po_code,
        created_at,
        status,
        supplier:suppliers (supplier_name)
      )
    `
    )
    .eq("product_id", productId);

  const { data: salesData } = await supabase
    .from("sales_items")
    .select(
      `
      quantity,
      price_at_sale,
      sale:sales (
        id,
        sale_date,
        invoice_code,
        customer:customers (name)
      )
    `
    )
    .eq("product_id", productId);

  const purchases: HistoryItem[] = (
    (purchaseData as unknown as PurchaseQueryRow[]) || []
  )
    .map((item) => {
      if (!item.order) return null;

      return {
        id: item.order.po_code || `PO-${item.order.id}`,
        date: item.order.created_at,
        type: "purchase",
        quantity: item.quantity,
        price_per_unit: item.cost_per_item,
        total_price: item.quantity * item.cost_per_item,
        status: item.order.status,
        party_name: item.order.supplier?.supplier_name || "Unknown Supplier",
      };
    })
    .filter((item): item is HistoryItem => item !== null);

  const sales: HistoryItem[] = ((salesData as unknown as SaleQueryRow[]) || [])
    .map((item) => {
      if (!item.sale) return null;

      return {
        id: item.sale.invoice_code || `SALE-${item.sale.id}`,
        date: item.sale.sale_date,
        type: "sale",
        quantity: item.quantity,
        price_per_unit: item.price_at_sale,
        total_price: item.quantity * item.price_at_sale,
        status: "Completed",
        party_name: item.sale.customer?.name || "General Customer",
      };
    })
    .filter((item): item is HistoryItem => item !== null);

  const history = [...purchases, ...sales].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return history;
}
