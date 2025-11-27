"use client";

import { useState } from "react";
import AddOrder from "@/components/features/orders/AddOrder";
import OrderTable from "@/components/features/orders/OrderTable";
import FilterDropdown, { DropdownOption } from "@/components/ui/FilterDropdown";
import { FilterIcon } from "@/components/icons";
import { ProductOption, SupplierOption } from "@/lib/types";
import { ORDER_STATUSES } from "@/lib/constants";

const filterOptions: DropdownOption[] = [
  { label: "All", value: "All" },
  ...ORDER_STATUSES,
];

export default function OrderClientWrapper({
  products,
  suppliers,
}: {
  products: ProductOption[];
  suppliers: SupplierOption[];
}) {
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const triggerRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return (
    <div className="bg-white shadow-md p-4 rounded-md">
      <div className="flex flex-row justify-between items-center">
        <h1 className="sm:text-lg tracking-wide">Orders</h1>
        <div className="flex flex-row gap-4 tracking-wide">
          <AddOrder
            products={products}
            suppliers={suppliers}
            onOrderChange={triggerRefresh}
          />
          <FilterDropdown
            label="Filters"
            icon={<FilterIcon className="w-4 h-4 text-gray-600" />}
            options={filterOptions}
            onSelectFilter={setSelectedFilter}
          />
        </div>
      </div>
      <OrderTable
        selectedFilter={selectedFilter}
        refreshKey={refreshKey}
        onOrderChange={triggerRefresh}
      />
    </div>
  );
}
