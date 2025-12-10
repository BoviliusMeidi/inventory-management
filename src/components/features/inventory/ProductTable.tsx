"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getPaginatedProductsByUser } from "@/lib/actions/products";
import Pagination, { PAGE_SIZE } from "@/components/ui/Pagination";
import { usePagination } from "@/lib/hooks/use-pagination";
import ProductRow from "@/components/features/inventory/ProductRow";
import { Product } from "@/lib/types";

interface ProductTableProps {
  selectedFilter: string | null;
  refreshKey: number;
}

export default function ProductTable({
  selectedFilter,
  refreshKey,
}: ProductTableProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const { currentPage, handlePageChange } = usePagination();

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getPaginatedProductsByUser(
          currentPage,
          PAGE_SIZE,
          selectedFilter,
          searchQuery
        );
        setProducts(res.data);
        setTotalPages(Math.ceil(res.total / PAGE_SIZE));
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [currentPage, selectedFilter, refreshKey, searchQuery]);

  return (
    <div className="pt-2 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white text-left">
          <thead className="text-sm sm:text-base">
            <tr>
              <th className="py-2 px-2 md:px-4 hidden md:table-cell">
                Supplier
              </th>
              <th className="py-2 px-2 md:px-4">Product</th>
              <th className="py-2 px-2 md:px-4 hidden lg:table-cell">Type</th>
              <th className="py-2 px-2 md:px-4 hidden lg:table-cell">Cost</th>
              <th className="py-2 px-2 md:px-4 hidden md:table-cell">Price</th>
              <th className="py-2 px-2 md:px-4">Qty</th>
              <th className="py-2 px-2 md:px-4">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm sm:text-base border-t border-gray-300">
            {products.map((product) => (
              <ProductRow key={product.id} product={product} />
            ))}
            {products.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="py-8 text-center text-gray-500 italic"
                >
                  No products found.
                </td>
              </tr>
            )}
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
