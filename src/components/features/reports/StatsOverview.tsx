import StatCard from "@/components/ui/StatCard";
import { formatCurrency } from "@/lib/utils/formatters";
import { FinancialSummary } from "@/lib/types";

interface StatsOverviewProps {
  summary: FinancialSummary;
}

export default function StatsOverview({ summary }: StatsOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-white shadow-md p-6 rounded-xl w-full">
      <StatCard
        title="Gross Revenue"
        value={formatCurrency(summary.totalRevenue)}
        description="Total sales in period"
        titleColor="text-blue-600"
      />
      <StatCard
        title="COGS"
        value={formatCurrency(summary.totalCost)}
        description="Cost of Goods Sold"
        titleColor="text-red-500"
      />
      <StatCard
        title="Net Profit"
        value={formatCurrency(summary.grossProfit)}
        description="Revenue - Cost"
        titleColor="text-green-600"
      />
      <StatCard
        title="Profit Margin"
        value={`${summary.marginPercent.toFixed(1)}%`}
        description="Profitability ratio"
        titleColor="text-purple-600"
      />
    </div>
  );
}
