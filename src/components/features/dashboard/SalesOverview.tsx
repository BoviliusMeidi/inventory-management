import DashboardStat from "@/components/ui/DashboardStat";
import { formatCurrency } from "@/lib/utils/formatters";
import { SalesStats } from "@/lib/types";

export default function SalesOverview({ data }: { data: SalesStats }) {
  return (
    <div className="bg-white shadow-md p-6 rounded-xl w-full md:w-2/3">
      <h1 className="text-lg pb-4">Sales Overview</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0 md:divide-x md:divide-gray-200">
        <DashboardStat
          title="Revenue"
          value={formatCurrency(data.revenue)}
          icon="/revenue.svg"
          color="text-blue-600"
        />
        <DashboardStat
          title="Profit"
          value={formatCurrency(data.profit)}
          icon="/profit.svg"
          color="text-green-600"
        />
        <DashboardStat
          title="Cost"
          value={formatCurrency(data.cost)}
          icon="/cost.svg"
          color="text-red-600"
        />
        <DashboardStat
          title="Quantity Sold"
          value={data.quantitySold}
          icon="/quantity.svg"
          color="text-yellow-600"
        />
      </div>
    </div>
  );
}
