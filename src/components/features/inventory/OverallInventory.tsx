import StatCard from "@/components/ui/StatCard";
import StatCardDouble from "@/components/ui/StatCardDouble";
import { formatCurrencyShort } from "@/lib/utils/formatters";

interface OverallInventoryProps {
  totalCategories: number;
  totalProducts: number;
  totalInventoryValue: number;
  lowStockCount: number;
  noStockCount: number;
}

export default function OverallInventory({
  totalCategories,
  totalProducts,
  totalInventoryValue,
  lowStockCount,
  noStockCount,
}: OverallInventoryProps) {
  return (
    <div className="bg-white shadow-md p-4 rounded-md">
      <h1 className="sm:text-lg tracking-wide pb-2">Overall Inventory</h1>
      <div className="flex flex-row justify-between gap-6">
        <StatCard
          title="Categories"
          titleColor="text-blue-600"
          value={totalCategories}
          description="Total Categories"
        />
        <StatCardDouble
          title="Products"
          titleColor="text-yellow-700"
          valueA={totalProducts}
          descriptionA="Total Products"
          valueB={formatCurrencyShort(totalInventoryValue)}
          descriptionB="Total Value"
        />
        <StatCardDouble
          title="Stocks Warning"
          titleColor="text-red-400"
          valueA={lowStockCount}
          descriptionA="Low Stock"
          valueB={noStockCount}
          descriptionB="Not in Stock"
        />
      </div>
    </div>
  );
}
