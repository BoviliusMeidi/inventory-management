"use client";

import { useEffect, useState } from "react";
import { getPaginatedProductsByUser, Product } from "@/lib/actions/products";
import Pagination, { PAGE_SIZE } from "@/components/ui/Pagination";
import { usePagination } from "@/lib/hooks/use-pagination";
import ProductRow from "./ProductRow";

export default function ProductTable({
  selectedFilter,
}: {
  selectedFilter: string | null;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const { currentPage, handlePageChange } = usePagination();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getPaginatedProductsByUser(
          currentPage,
          PAGE_SIZE,
          selectedFilter
        );
        setProducts(res.data);
        setTotalPages(Math.ceil(res.total / PAGE_SIZE));
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [currentPage, selectedFilter]);

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
