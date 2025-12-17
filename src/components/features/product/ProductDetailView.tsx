"use client";

import { useState } from "react";
import Tabs from "@/components/ui/Tabs"; // Pastikan import Tabs yang baru
import { Product, StockStats } from "@/lib/types";

export default function ProductDetailView({
  product,
  stockStats,
}: {
  product: Product;
  stockStats: StockStats | null;
}) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="bg-white shadow-md p-4 rounded-md mr-3">
      <div className="flex flex-row justify-between items-center gap-3">
        <h1 className="text-lg sm:text-2xl font-bold text-gray-800 my-2">
          {product.product_name}
        </h1>
      </div>
      <Tabs
        product={product}
        stockStats={stockStats}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
}
