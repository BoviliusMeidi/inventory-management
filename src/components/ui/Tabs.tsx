"use client";

import { useState } from "react";
import { Product } from "@/lib/actions/products";
import ProductOverviewTab from "../features/product/ProductOverviewTab";

interface TabsProps {
  product: Product;
}

export default function Tabs({ product }: TabsProps) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div>
      <div className="flex flex-row items-center justify-between sm:justify-start gap-8 mt-3 border-b border-gray-300">
        {["overview", "purchases", "history"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`cursor-pointer pb-2 text-sm sm:text-lg tracking-wide capitalize ${
              activeTab === tab
                ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
                : "text-gray-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {activeTab === "overview" && <ProductOverviewTab product={product} />}
        {activeTab === "purchases" && <ProductOverviewTab product={product} />}
        {activeTab === "history" && <ProductOverviewTab product={product} />}
      </div>
    </div>
  );
}
