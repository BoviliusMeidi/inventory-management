"use client";

import { useEffect, useState } from "react";
import { getPaginatedSales } from "@/lib/actions/sales";
import Pagination, { PAGE_SIZE } from "@/components/ui/Pagination";
import { usePagination } from "@/lib/hooks/use-pagination";
import SaleRow from "@/components/features/sales/SaleRow";
import SaleItemsModal from "@/components/features/sales/SaleItemsModal";
import { Sale } from "@/lib/types";

interface SaleTableProps {
  refreshKey?: number;
  statusFilter: string | null;
  methodFilter: string | null;
  onOrderChange: () => void;
}

export default function SaleTable({
  refreshKey,
  statusFilter,
  methodFilter,
  onOrderChange,
}: SaleTableProps) {
  const [sales, setSales] = useState<Sale[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const { currentPage, handlePageChange } = usePagination();
  const [viewingSaleItems, setViewingSaleItems] = useState<Sale | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getPaginatedSales(
          currentPage,
          PAGE_SIZE,
          statusFilter,
          methodFilter
        );
        setSales(res.data as unknown as Sale[]);
        setTotalPages(Math.ceil(res.total / PAGE_SIZE));
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [currentPage, refreshKey, statusFilter, methodFilter]);

  return (
    <>
      <SaleItemsModal
        sale={viewingSaleItems}
        onClose={() => setViewingSaleItems(null)}
      />
      <div className="pt-2 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white text-left text-sm sm:text-base">
            <thead>
              <tr>
                <th className="py-2 px-4 hidden md:table-cell">Invoice</th>
                <th className="py-2 px-4">Customer</th>
                <th className="py-2 px-4 hidden md:table-cell">Date</th>
                <th className="py-2 px-4">Items</th>
                <th className="py-2 px-4">Total</th>
                <th className="py-2 px-4 hidden lg:table-cell">Payment</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="border-t border-gray-200">
              {sales.map((sale) => (
                <SaleRow
                  key={sale.id}
                  sale={sale}
                  onViewItems={() => setViewingSaleItems(sale)}
                  onOrderChange={onOrderChange}
                />
              ))}
              {sales.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="py-8 text-center text-gray-500 italic"
                  >
                    No sales found matching filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </>
  );
}
