"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

import SalesOverview from "@/components/features/dashboard/SalesOverview";
import InventorySummary from "@/components/features/dashboard/InventorySummary";
import PurchaseOverview from "@/components/features/dashboard/PurchaseOverview";
import ProductSummary from "@/components/features/dashboard/ProductSummary";
import BestSellingTable from "@/components/features/dashboard/BestSellingTable";
import LowStockList from "@/components/features/dashboard/LowStockList";
import SalesPurchaseChart from "@/components/features/dashboard/SalesPurchaseChart";
import OrderSummaryChart from "@/components/features/dashboard/OrderSummaryChart";
import { DashboardData } from "@/lib/types";

export default function DashboardClientWrapper({
  data,
}: {
  data: DashboardData;
}) {
  const router = useRouter();

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const channel = supabase
      .channel("dashboard-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "sales" },
        () => {
          router.refresh();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "sales_items" },
        () => {
          router.refresh();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => {
          router.refresh();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        () => {
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  return (
    <div className="flex flex-col gap-3 md:mr-3">
      <div className="flex flex-col md:flex-row gap-3">
        <SalesOverview data={data.sales} />
        <InventorySummary data={data.inventory} />
      </div>
      <div className="flex flex-col md:flex-row gap-3">
        <PurchaseOverview data={data.purchase} />
        <ProductSummary data={data.products} />
      </div>
      <div className="flex flex-col md:flex-row gap-3">
        <SalesPurchaseChart data={data.charts} />
        <OrderSummaryChart data={data.charts} />
      </div>
      <div className="flex flex-col md:flex-row gap-3">
        <BestSellingTable products={data.bestSelling} />
        <LowStockList products={data.lowStock} />
      </div>
    </div>
  );
}
