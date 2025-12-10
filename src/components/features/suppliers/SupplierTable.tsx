"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getPaginatedSuppliersByUser } from "@/lib/actions/suppliers";
import Pagination, { PAGE_SIZE } from "@/components/ui/Pagination";
import { usePagination } from "@/lib/hooks/use-pagination";
import SupplierRow from "@/components/features/suppliers/SupplierRow";
import { Supplier } from "@/lib/types";

interface SupplierTableProps {
  refreshKey: number;
  onOrderChange: () => void;
}

export default function SupplierTable({
  refreshKey,
  onOrderChange,
}: SupplierTableProps) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const { currentPage, handlePageChange } = usePagination();

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getPaginatedSuppliersByUser(
          currentPage,
          PAGE_SIZE,
          searchQuery
        );
        setSuppliers(res.data);
        setTotalPages(Math.ceil(res.total / PAGE_SIZE));
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [currentPage, refreshKey, searchQuery]);

  return (
    <div className="pt-2 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white text-left">
          <thead className="text-sm sm:text-base">
            <tr>
              <th className="py-2 px-4">Supplier Name</th>
              <th className="py-2 px-4">Address</th>
              <th className="py-2 px-4">Contact Number</th>
              <th className="py-2 px-4">Purchase Link</th>
              <th className="py-2 px-4">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm sm:text-base border-t border-gray-300">
            {suppliers.map((supplier) => (
              <SupplierRow
                key={supplier.id}
                onOrderChange={onOrderChange}
                supplier={supplier}
              />
            ))}
            {suppliers.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="py-8 text-center text-gray-500 italic"
                >
                  No suppliers found.
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
  );
}
