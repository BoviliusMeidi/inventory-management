"use server";

import { createClientServer } from "@/lib/supabase/server";
import { ChartData, DashboardCardStats } from "@/lib/types";

export async function getDashboardStats(period: string = "monthly") {
  const supabase = await createClientServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: salesStats, error: salesError } = await supabase
    .rpc("get_dashboard_card_stats", { p_user_id: user.id })
    .single<DashboardCardStats>();

  if (salesError) {
    console.error("Error fetching dashboard card stats:", salesError.message);
  }

  const totalRevenue = salesStats?.total_revenue || 0;
  const totalProfit = salesStats?.total_profit || 0;
  const totalCost = salesStats?.total_cost || 0;
  const totalQuantitySold = salesStats?.total_qty_sold || 0;

  const { data: productsData } = await supabase
    .from("products")
    .select(
      "id, product_name, amount_stock, product_category, product_image, sell_price"
    );

  const quantityInHand =
    productsData?.reduce((sum, p) => sum + p.amount_stock, 0) || 0;
  const uniqueCategories = new Set(productsData?.map((p) => p.product_category))
    .size;

  const { data: orders } = await supabase
    .from("orders")
    .select("id, total_cost, status, created_at");

  const totalPurchaseOrders =
    orders?.reduce((sum, p) => sum + p.total_cost, 0) || 0;
  const shippedOrders =
    orders?.filter((p) => p.status === "Shipped").length || 0;
  const pendingOrders =
    orders?.filter((p) => p.status === "Pending").length || 0;
  const totalOrders = orders?.length || 0;

  const { data: incomingItems } = await supabase
    .from("order_items")
    .select(
      `
      quantity,
      order:orders!inner(status)
    `
    )
    .in("orders.status", ["Pending", "Shipped"]);

  const toBeReceived =
    incomingItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const { count: supplierCount } = await supabase
    .from("suppliers")
    .select("*", { count: "exact", head: true });

  const { data: salesItems } = await supabase
    .from("sales_items")
    .select("product_id, quantity, sale:sales!inner(user_id)")
    .eq("sale.user_id", user.id);

  const productSalesMap = new Map<string, number>();
  salesItems?.forEach((item) => {
    const pid = String(item.product_id);
    const qty = Number(item.quantity);
    productSalesMap.set(pid, (productSalesMap.get(pid) || 0) + qty);
  });

  const bestSelling =
    productsData
      ?.map((p) => ({
        id: String(p.id),
        name: p.product_name,
        remainingStock: p.amount_stock,
        price: p.sell_price,
        soldQuantity: productSalesMap.get(String(p.id)) || 0,
      }))
      .filter((p) => p.soldQuantity > 0)
      .sort((a, b) => b.soldQuantity - a.soldQuantity)
      .slice(0, 5) || [];

  const lowStock =
    productsData
      ?.filter((p) => p.amount_stock < 10)
      .sort((a, b) => a.amount_stock - b.amount_stock)
      .map((p) => ({
        id: String(p.id),
        name: p.product_name,
        remainingStock: p.amount_stock,
        image: p.product_image,
      })) || [];

  const { data: chartData, error: chartError } = await supabase.rpc(
    "get_dashboard_chart_data",
    {
      p_user_id: user.id,
      p_period: period,
    }
  );

  if (chartError) {
    console.error("Error fetching chart data:", chartError.message);
  }

  return {
    sales: {
      revenue: totalRevenue,
      profit: totalProfit,
      cost: totalCost,
      quantitySold: totalQuantitySold,
    },
    inventory: {
      quantityInHand: quantityInHand,
      toBeReceived: toBeReceived,
    },
    purchase: {
      cost: totalPurchaseOrders,
      purchase: totalOrders,
      shipped: shippedOrders,
      pending: pendingOrders,
    },
    products: {
      suppliers: supplierCount || 0,
      categories: uniqueCategories,
    },
    bestSelling,
    lowStock,
    charts: (chartData as ChartData[]) || [],
  };
}
