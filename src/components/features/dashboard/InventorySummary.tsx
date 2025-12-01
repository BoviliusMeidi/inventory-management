import DashboardStat from "@/components/ui/DashboardStat";
import { InventoryStats } from "@/lib/types";

export default function InventorySummary({ data }: { data: InventoryStats }) {
  return (
    <div className="bg-white shadow-md p-6 rounded-xl w-full md:w-1/3">
      <h1 className="text-lg pb-4">Inventory Summary</h1>
      <div className="flex flex-row justify-around items-center divide-x divide-gray-100">
        <DashboardStat title="Quantity in Hand" value={data.quantityInHand} icon="/quantity.svg" />
        <DashboardStat title="To be received" value={data.toBeReceived} icon="/location.svg" />
      </div>
    </div>
  );
}