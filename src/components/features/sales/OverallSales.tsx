import StatCard from "@/components/ui/StatCard";
import { formatCurrencyShort } from "@/lib/utils/formatters";

interface OverallSalesProps {
  totalRevenue: number;
  totalProfit: number;
  totalTransactions: number;
  todayRevenue: number;
}

export default function OverallSales({
  totalRevenue,
  totalProfit,
  totalTransactions,
  todayRevenue,
}: OverallSalesProps) {
  return (
    <div className="bg-white shadow-md p-4 rounded-md">
      <h1 className="sm:text-lg tracking-wide pb-2">Overall Sales</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-3">
        <StatCard
          title="Total Revenue"
          titleColor="text-blue-600"
          value={formatCurrencyShort(totalRevenue)}
          description="Gross revenue all time"
        />
        <StatCard
          title="Total Profit"
          titleColor="text-green-600"
          value={formatCurrencyShort(totalProfit)}
          description="Net profit all time"
        />
        <StatCard
          title="Transactions"
          titleColor="text-yellow-600"
          value={totalTransactions}
          description="Total sales count"
        />
        <StatCard
          title="Today's Performance"
          titleColor="text-indigo-600"
          value={formatCurrencyShort(todayRevenue)}
          description="Revenue Today"
        />
      </div>
    </div>
  );
}
