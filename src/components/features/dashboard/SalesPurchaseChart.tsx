"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { ChartData } from "@/lib/types";

export default function SalesPurchaseChart({ data }: { data: ChartData[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPeriod = searchParams.get("period") || "monthly";

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPeriod = e.target.value;
    router.push(`?period=${newPeriod}`, { scroll: false });
  };

  return (
    <div className="bg-white shadow-md p-6 rounded-xl w-full lg:w-2/3">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg">Sales & Purchase</h2>
        <select 
          value={currentPeriod}
          onChange={handlePeriodChange}
          className="border rounded-md p-1 text-sm text-gray-500 outline-none cursor-pointer bg-transparent"
        >
          <option value="weekly">Weekly (Last 4 Weeks)</option>
          <option value="monthly">Monthly (This Year)</option>
          <option value="yearly">Yearly (Last 3 Years)</option>
        </select>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: -25, bottom: 5 }}
            barGap={8}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "#6B7280", fontSize: 12 }} 
              dy={10}
              interval={0} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "#6B7280", fontSize: 12 }} 
              tickFormatter={(value) => {
                if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
                return value;
              }}
            />
            <Tooltip
              cursor={{ fill: "transparent" }}
              contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
              formatter={(value: number) => `Rp ${value.toLocaleString("id-ID")}`}
            />
            <Legend iconType="circle" wrapperStyle={{ paddingTop: "20px" }} />
            <Bar dataKey="purchase" name="Purchase" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={12} />
            <Bar dataKey="sales" name="Sales" fill="#22C55E" radius={[4, 4, 0, 0]} barSize={12} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}