import {
  getTotalProducts,
  getTotalCategoryProducts,
  getTotalInventoryValue,
  getTotalLowStockProducts,
} from "@/lib/actions/products";
import { getAllSuppliers } from "@/lib/actions/suppliers";
import InventoryClientWrapper from "@/components/features/inventory/InventoryClientWrapper";
import OverallInventory from "@/components/features/inventory/OverallInventory";

export default async function InventoryPage() {
  const [totalResult, categoryResult, valueResult, stockResult, suppliers] =
    await Promise.all([
      getTotalProducts(),
      getTotalCategoryProducts(),
      getTotalInventoryValue(),
      getTotalLowStockProducts(),
      getAllSuppliers(),
    ]);

  const data = {
    totalCategories: categoryResult?.totalCategories ?? 0,
    totalProducts: totalResult?.count ?? 0,
    totalValue: valueResult?.totalValue ?? 0,
    lowStockCount: stockResult?.lowStockCount ?? 0,
    noStockCount: stockResult?.noStockCount ?? 0,
  };

  return (
    <div className="flex flex-col gap-3">
      <OverallInventory
        totalCategories={data.totalCategories}
        totalProducts={data.totalProducts}
        totalInventoryValue={data.totalValue}
        lowStockCount={data.lowStockCount}
        noStockCount={data.noStockCount}
      />
      <InventoryClientWrapper suppliers={suppliers}/>
    </div>
  );
}
