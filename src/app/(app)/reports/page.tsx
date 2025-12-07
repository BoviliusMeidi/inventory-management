import { getReportData } from "@/lib/actions/reports";
import ProfitChart from "@/components/features/reports/ProfitChart";
import ReportsHeader from "@/components/features/reports/ReportsHeader";
import StatsOverview from "@/components/features/reports/StatsOverview";
import CategoryPerformanceTable from "@/components/features/reports/CategoryPerformanceTable";

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ start?: string; end?: string }>;
}) {
  const params = await searchParams;
  const end = params.end || new Date().toISOString().split("T")[0];
  const start =
    params.start ||
    new Date(new Date().setDate(new Date().getDate() - 30))
      .toISOString()
      .split("T")[0];

  const data = await getReportData(start, end);

  if (!data) return <div className="p-8 text-center">Loading data...</div>;

  return (
    <div className="flex flex-col gap-3 md:mr-3">
      <div className="flex flex-col gap-3">
        <ReportsHeader />
        <StatsOverview summary={data.summary} />
      </div>
      <ProfitChart data={data.chartData} />
      <CategoryPerformanceTable data={data.categoryPerformance} />
    </div>
  );
}
