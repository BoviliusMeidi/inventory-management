"use client";

import { useEffect, useState } from "react";
import { getPaginatedProductsByUser, Product } from "@/lib/supabase/products";
import { useRouter } from "next/navigation";
const PAGE_SIZE = 10;

export default function ProductTable({ selectedFilter }: { selectedFilter: string | null }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getPaginatedProductsByUser(page, PAGE_SIZE, selectedFilter);
        setProducts(res.data);
        setTotalPages(Math.ceil(res.total / PAGE_SIZE));
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [page, selectedFilter]);

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: "Out of Stock", color: "text-red-500" };
    if (stock < 10) return { label: "Low Stock", color: "text-yellow-500" };
    return { label: "In-Stock", color: "text-green-500" };
  };

  return (
    <div className="pt-2">
      <table className="min-w-full bg-white text-left">
        <thead>
          <tr>
            <th className="py-2 px-4">Supplier Name</th>
            <th className="py-2 px-4">Product Name</th>
            <th className="py-2 px-4">Product Type</th>
            <th className="py-2 px-4">Buying Price</th>
            <th className="py-2 px-4">Selling Price</th>
            <th className="py-2 px-4">Stock</th>
            <th className="py-2 px-4">Availability</th>
          </tr>
        </thead>
        <tbody className="border-t border-gray-300">
          {products.map((product) => (
           <tr
           key={product.id}
           onClick={() => router.push(`/product/${product.id}`)}
           className="hover:bg-gray-100 cursor-pointer"
         >
           <td className="py-2 px-4">{product.supplier?.supplier_name}</td>
           <td className="py-2 px-4">{product.product_name}</td>
           <td className="py-2 px-4">{product.product_type}</td>
           <td className="py-2 px-4">Rp{product.buy_price.toLocaleString("id-ID")}</td>
           <td className="py-2 px-4">Rp{product.sell_price.toLocaleString("id-ID")}</td>
           <td className="py-2 px-4">{product.amount_stock}</td>
           <td className={`py-2 px-4 ${getStockStatus(product.amount_stock).color}`}>{getStockStatus(product.amount_stock).label}</td>
         </tr>
          ))}
        </tbody>
      </table>

      <div className="flex flex-row justify-between pt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="cursor-pointer px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="cursor-pointer px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
