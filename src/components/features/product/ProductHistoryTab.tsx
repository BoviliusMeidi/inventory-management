"use client";

import { useEffect, useState } from "react";
import { getProductHistory } from "@/lib/actions/history";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils/formatters";
import { Product, HistoryItem } from "@/lib/types";

export default function ProductHistoryTab({ product }: { product: Product }) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getProductHistory(product.id);
        setHistory(data);
      } catch (error) {
        console.error("Failed to fetch history:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [product.id]);

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500 animate-pulse bg-gray-50 rounded-lg">
        Loading history data...
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 border border-dashed border-gray-300 rounded-lg">
        No transaction history found for this product.
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
      <div className="mb-6 border-b pb-4">
        <h2 className="text-lg font-bold text-gray-900">Transaction History</h2>
        <p className="text-sm text-gray-500 mt-1">
          Track all purchase orders (Restock) and sales activity for{" "}
          <span className="font-semibold text-gray-900">
            {product.product_name}
          </span>
        </p>
      </div>

      <div className="overflow-hidden border border-gray-200 rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-3 font-semibold">Date</th>
                <th className="px-6 py-3 font-semibold">Activity</th>
                <th className="px-6 py-3 font-semibold">Party</th>
                <th className="px-6 py-3 font-semibold text-right">Qty</th>
                <th className="px-6 py-3 font-semibold text-right">
                  Unit Price
                </th>
                <th className="px-6 py-3 font-semibold text-right">Total</th>
                <th className="px-6 py-3 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {history.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-3 text-gray-600 whitespace-nowrap">
                    {formatDate(item.date, true)}
                  </td>

                  <td className="px-6 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                        item.type === "sale"
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {item.type === "sale" ? "Sold" : "Restock"}
                    </span>
                    <div className="text-[10px] text-gray-400 mt-1">
                      {item.id}
                    </div>
                  </td>

                  <td className="px-6 py-3 font-medium text-gray-800">
                    {item.party_name}
                  </td>

                  <td
                    className={`px-6 py-3 text-right font-medium ${
                      item.type === "sale" ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {item.type === "sale" ? "-" : "+"}
                    {item.quantity}
                  </td>

                  <td className="px-6 py-3 text-right text-gray-600">
                    {formatCurrency(item.price_per_unit)}
                  </td>

                  <td className="px-6 py-3 text-right font-bold text-gray-900">
                    {formatCurrency(item.total_price)}
                  </td>

                  <td className="px-6 py-3 text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}