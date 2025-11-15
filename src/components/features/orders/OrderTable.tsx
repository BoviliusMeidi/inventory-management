"use client";

import { useEffect, useState } from "react";
import { getPaginatedOrders, Order } from "@/lib/actions/orders";
import Pagination, { PAGE_SIZE } from "@/components/ui/Pagination";
import { usePagination } from "@/lib/hooks/use-pagination";
import OrderRow from "@/components/features/orders/OrderRow";

export default function OrderTable({
  selectedFilter,
  refreshKey,
  onOrderChange
}: {
  selectedFilter: string | null;
  refreshKey: number;
  onOrderChange: () => void;
}) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const { currentPage, handlePageChange } = usePagination();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getPaginatedOrders(
          currentPage,
          PAGE_SIZE,
          selectedFilter
        );
        setOrders(res.data as unknown as Order[]);
        setTotalPages(Math.ceil(res.total / PAGE_SIZE));
      } catch (err: unknown) {
        console.error(err);
      }
    };
    fetchData();
  }, [currentPage, selectedFilter, refreshKey]);

  return (
    <div className="pt-2 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white text-left text-sm sm:text-base">
          <thead>
            <tr>
              <th className="py-2 px-2 md:px-4">ID</th>
              <th className="py-2 px-2 md:px-4">Supplier</th>
              <th className="py-2 px-2 md:px-4 hidden md:table-cell">
                Total Cost
              </th>
              <th className="py-2 px-2 md:px-4 hidden lg:table-cell">Items</th>
              <th className="py-2 px-2 md:px-4 hidden md:table-cell">
                Expected
              </th>
              <th className="py-2 px-2 md:px-4">Status</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="border-t border-gray-300">
            {orders.map((order) => (
              <OrderRow key={order.id} order={order} onOrderChange={onOrderChange}/>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}