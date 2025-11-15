"use client";

import { useState, useRef, useEffect } from "react";
import AddProduct from "@/components/features/inventory/AddProduct";
import ProductTable from "@/components/features/inventory/ProductTable";
import FilterDropdown, { DropdownOption } from "@/components/ui/FilterDropdown";
import { FilterIcon } from "@/components/icons/FilterIcon";

type SupplierOption = {
  id: string;
  supplier_name: string;
  contact_number: number;
};

const filterOptions: DropdownOption[] = [
  { label: "All", value: null },
  { label: "In Stock", value: "In-Stock" },
  { label: "Out of Stock", value: "Out of Stock" },
  { label: "Low Stock", value: "Low Stock" },
];

export default function InventoryClientWrapper({
  suppliers,
}: {
  suppliers: SupplierOption[];
}) {
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen(false);
      }
    }

    if (isFilterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFilterOpen]);

  return (
    <div className="bg-white shadow-md p-4 rounded-md">
      <div className="flex flex-row justify-between items-center">
        <h1 className="sm:text-lg tracking-wide">Products</h1>
        <div className="flex flex-row gap-4 tracking-wide">
          <AddProduct suppliers={suppliers}/>
          <FilterDropdown
            label="Filters"
            icon={<FilterIcon className="w-4 h-4 text-gray-600" />}
            options={filterOptions}
            onSelectFilter={setSelectedFilter}
          />
        </div>
      </div>
      <ProductTable selectedFilter={selectedFilter} />
    </div>
  );
}
