"use server";

import { createClientServer } from "@/lib/supabase/server";
import {
  formatCurrency,
  formatDisplayPhoneNumber,
} from "@/lib/utils/formatters";

export type SearchResult = {
  id: string | number;
  title: string;
  subtitle: string;
  type: "product" | "supplier" | "customer" | "sale" | "order";
  url: string;
};

export async function globalSearch(query: string): Promise<SearchResult[]> {
  if (!query || query.length < 2) return [];

  const supabase = await createClientServer();
  const limitPerCategory = 3;
  const results: SearchResult[] = [];

  const productsPromise = supabase
    .from("products")
    .select("id, product_name, product_category, product_type")
    .ilike("product_name", `%${query}%`)
    .limit(limitPerCategory);

  const suppliersPromise = supabase
    .from("suppliers")
    .select("id, supplier_name, contact_number")
    .ilike("supplier_name", `%${query}%`)
    .limit(limitPerCategory);

  const customersPromise = supabase
    .from("customers")
    .select("id, name, contact_number")
    .ilike("name", `%${query}%`)
    .limit(limitPerCategory);

  const salesPromise = supabase
    .from("sales")
    .select("id, invoice_code, total_amount")
    .ilike("invoice_code", `%${query}%`)
    .limit(limitPerCategory);

  const ordersPromise = supabase
    .from("orders")
    .select("id, po_code, status, total_cost")
    .ilike("po_code", `%${query}%`)
    .limit(limitPerCategory);

  const [products, suppliers, customers, sales, orders] = await Promise.all([
    productsPromise,
    suppliersPromise,
    customersPromise,
    salesPromise,
    ordersPromise,
  ]);

  products.data?.forEach((p) => {
    results.push({
      id: p.id,
      title: p.product_name,
      subtitle: `${p.product_type} • ${p.product_category}`,
      type: "product",
      url: `/product/${p.id}`,
    });
  });

  suppliers.data?.forEach((s) => {
    results.push({
      id: s.id,
      title: s.supplier_name,
      subtitle: `${formatDisplayPhoneNumber(s.contact_number)}`,
      type: "supplier",
      url: `/suppliers?search=${s.supplier_name}`,
    });
  });

  customers.data?.forEach((c) => {
    results.push({
      id: c.id,
      title: c.name,
      subtitle: `${formatDisplayPhoneNumber(c.contact_number)}`,
      type: "customer",
      url: `/customers?search=${c.name}`,
    });
  });

  sales.data?.forEach((s) => {
    results.push({
      id: s.id,
      title: s.invoice_code,
      subtitle: `Total: ${formatCurrency(s.total_amount)}`,
      type: "sale",
      url: `/sales?search=${s.invoice_code}`,
    });
  });

  orders.data?.forEach((o) => {
    results.push({
      id: o.id,
      title: o.po_code,
      subtitle: `${o.status} • Total: ${formatCurrency(o.total_cost)}`,
      type: "order",
      url: `/orders?search=${o.po_code}`,
    });
  });

  return results;
}
