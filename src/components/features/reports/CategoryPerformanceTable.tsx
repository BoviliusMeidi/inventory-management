import { formatCurrency } from "@/lib/utils/formatters";
import { CategoryData } from "@/lib/types";

interface CategoryPerformanceTableProps {
  data: CategoryData[];
}

export default function CategoryPerformanceTable({
  data,
}: CategoryPerformanceTableProps) {
  return (
    <div className="bg-white shadow-md p-6 rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-800">Profit by Category</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white text-left">
          <thead className="text-sm sm:text-base">
            <tr>
              <th className="py-2 px-2 md:px-4 font-semibold text-gray-900">
                Category
              </th>
              <th className="py-2 px-2 md:px-4 font-semibold text-gray-900">
                Sales Volume
              </th>
              <th className="py-2 px-2 md:px-4 font-semibold text-gray-900">
                Total Profit
              </th>
            </tr>
          </thead>

          {/* Body Style disamakan dengan ProductTable */}
          <tbody className="text-sm sm:text-base border-t border-gray-300">
            {data.map((cat) => (
              <tr
                key={cat.category}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="py-2 px-2 md:px-4 font-medium text-gray-900">
                  {cat.category}
                </td>
                <td className="py-2 px-2 md:px-4 text-gray-600">
                  {formatCurrency(cat.sales)}
                </td>
                <td className="py-2 px-2 md:px-4 text-green-600 font-bold">
                  {formatCurrency(cat.profit)}
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="py-8 text-center text-gray-400 italic"
                >
                  No data available for this period.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}