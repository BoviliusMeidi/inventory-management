"use client";

import { useState } from "react";
import { Product } from "@/lib/actions/products";
import ProductOverviewTab from "@/components/features/product/ProductOverviewTab";

type StockStats = {
  pendingStock: number;
  shippedStock: number;
};

interface TabsProps {
  product: Product;
  isEditing: boolean;
  stockStats: StockStats | null;
  newImageFile: File | null;
  setNewImageFile: (file: File | null) => void;
  newImagePreviewUrl: string | null;
  setNewImagePreviewUrl: (url: string | null) => void;
}

export default function Tabs({
  product,
  isEditing,
  stockStats,
  newImageFile,
  setNewImageFile,
  newImagePreviewUrl,
  setNewImagePreviewUrl,
}: TabsProps) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div>
      <div className="flex flex-row items-center justify-between sm:justify-start gap-8 mt-3 border-b border-gray-300">
        {["overview", "purchases", "history"].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            disabled={isEditing}
            className={`cursor-pointer pb-2 text-sm sm:text-lg tracking-wide capitalize ${
              activeTab === tab
                ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
                : "text-gray-500"
            } ${isEditing ? "cursor-not-allowed opacity-50" : ""}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {activeTab === "overview" && (
          <ProductOverviewTab
            product={product}
            isEditing={isEditing}
            stockStats={stockStats}
            newImageFile={newImageFile}
            setNewImageFile={setNewImageFile}
            newImagePreviewUrl={newImagePreviewUrl}
            setNewImagePreviewUrl={setNewImagePreviewUrl}
          />
        )}
        {activeTab === "purchases" && (
          <ProductOverviewTab
            product={product}
            isEditing={isEditing}
            stockStats={stockStats}
            newImageFile={newImageFile}
            setNewImageFile={setNewImageFile}
            newImagePreviewUrl={newImagePreviewUrl}
            setNewImagePreviewUrl={setNewImagePreviewUrl}
          />
        )}
        {activeTab === "history" && (
          <ProductOverviewTab
            product={product}
            isEditing={isEditing}
            stockStats={stockStats}
            newImageFile={newImageFile}
            setNewImageFile={setNewImageFile}
            newImagePreviewUrl={newImagePreviewUrl}
            setNewImagePreviewUrl={setNewImagePreviewUrl}
          />
        )}
      </div>
    </div>
  );
}
