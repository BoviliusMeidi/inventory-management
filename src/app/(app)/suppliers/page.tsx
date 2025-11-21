"use client";
import SupplierTable from "@/components/features/suppliers/SupplierTable";
import AddSupplier from "@/components/features/suppliers/AddSupplier";
import { useState } from "react";

export default function SuppliersPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="bg-white shadow-md p-4 rounded-md">
        <div className="flex flex-row justify-between items-center gap-3">
          <h1 className="text-lg pb-2 tracking-wide">Suppliers</h1>
          <div className="flex flex-row gap-4 tracking-wide">
            <AddSupplier onOrderChange={triggerRefresh} />
          </div>
        </div>
        <div className="pt-2">
          <SupplierTable
            refreshKey={refreshKey}
            onOrderChange={triggerRefresh}
          />
        </div>
      </div>
    </div>
  );
}
