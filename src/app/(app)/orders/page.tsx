import OrderClientWrapper from "@/components/features/orders/OrderClientWrapper";
import { getAllProductsForSelect } from "@/lib/actions/products";
import { getAllSuppliers } from "@/lib/actions/suppliers";
import OverallOrders from "@/components/features/orders/OverallOrders";
import { getOverallOrderStats } from "@/lib/actions/orders";

export default async function OrdersPage() {
  const [products, suppliers, stats] = await Promise.all([
    getAllProductsForSelect(),
    getAllSuppliers(),
    getOverallOrderStats(),
  ]);

  const orderStats = stats || {
    pending_count: 0,
    shipped_count: 0,
    pending_value: 0,
    completed_30d_count: 0,
  };

  return (
    <div className="flex flex-col gap-3 mx-3 md:mx-0 md:mr-3">
      <OverallOrders
        pendingCount={orderStats.pending_count}
        shippedCount={orderStats.shipped_count}
        pendingValue={orderStats.pending_value}
        completed30dCount={orderStats.completed_30d_count}
      />
      <OrderClientWrapper products={products} suppliers={suppliers} />
    </div>
  );
}
