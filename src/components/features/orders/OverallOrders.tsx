import StatCard from "@/components/ui/StatCard";
import StatCardDouble from "@/components/ui/StatCardDouble";
import { formatCurrencyShort } from "@/lib/utils/formatters";

interface OverallOrdersProps {
  pendingCount: number;
  shippedCount: number;
  pendingValue: number;
  completed30dCount: number;
}

export default function OverallOrders({
  pendingCount,
  shippedCount,
  pendingValue,
  completed30dCount,
}: OverallOrdersProps) {
  return (
    <div className="bg-white shadow-md p-4 rounded-md">
      <h1 className="sm:text-lg tracking-wide pb-2">Overall Orders</h1>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mt-3">
        <StatCard
          title="Value Pending"
          titleColor="text-yellow-700"
          value={formatCurrencyShort(pendingValue)}
          description="Total cost of pending orders"
        />
        <StatCard
          title="Completed (30d)"
          titleColor="text-green-600"
          value={completed30dCount}
          description="Orders received this month"
        />
        <StatCardDouble
          title="Actionable Orders"
          titleColor="text-red-400"
          valueA={pendingCount}
          descriptionA="Pending"
          valueB={shippedCount}
          descriptionB="Shipped"
        />
      </div>
    </div>
  );
}