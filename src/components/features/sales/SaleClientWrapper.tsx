"use client";

import { useState } from "react";
import AddSale from "./AddSale";
import SaleTable from "./SaleTable";
import FilterDropdown, { DropdownOption } from "@/components/ui/FilterDropdown";
import { FilterIcon } from "@/components/icons";
import { ProductOption, CustomerOption } from "@/lib/types";
import { PAYMENT_METHODS, PAYMENT_STATUSES } from "@/lib/constants";

const statusOptions: DropdownOption[] = [
  { label: "All Status", value: null },
  ...PAYMENT_STATUSES,
];

const methodOptions: DropdownOption[] = [
  { label: "All Methods", value: null },
  ...PAYMENT_METHODS,
];

export default function SaleClientWrapper({
  products,
  customers,
}: {
  products: ProductOption[];
  customers: CustomerOption[];
}) {
  const [refreshKey, setRefreshKey] = useState(0);
  const triggerRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [methodFilter, setMethodFilter] = useState<string | null>(null);

  return (
    <div className="bg-white shadow-md p-4 rounded-md">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <h1 className="text-lg tracking-wide">Sales Transactions</h1>

        <div className="flex flex-wrap gap-3 items-center">
          <AddSale
            products={products}
            customers={customers}
            onSaleChange={triggerRefresh}
          />
          <FilterDropdown
            label="Status"
            icon={<FilterIcon className="w-4 h-4 text-gray-600" />}
            options={statusOptions}
            onSelectFilter={setStatusFilter}
          />
          <FilterDropdown
            label="Method"
            icon={<FilterIcon className="w-4 h-4 text-gray-600" />}
            options={methodOptions}
            onSelectFilter={setMethodFilter}
          />
        </div>
      </div>
      <SaleTable
        refreshKey={refreshKey}
        statusFilter={statusFilter}
        methodFilter={methodFilter}
        onOrderChange={triggerRefresh}
      />
    </div>
  );
}
