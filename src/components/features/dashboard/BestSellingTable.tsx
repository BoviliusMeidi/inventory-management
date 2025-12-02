"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils/formatters";
import { TopProduct } from "@/lib/types";

export default function BestSellingTable({
  products,
}: {
  products: TopProduct[];
}) {
  const [showModal, setShowModal] = useState(false);

  const widgetProducts = products.slice(0, 5);

  return (
    <>
      <div className="bg-white shadow-md p-6 rounded-xl w-full md:w-2/3">
        <div className="flex flex-row justify-between items-center mb-4">
          <h1 className="text-lg">Best Selling Product</h1>
          <button
            onClick={() => setShowModal(true)}
            className="text-blue-600 text-sm hover:underline cursor-pointer"
          >
            See All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white text-left">
            <thead className="text-sm sm:text-base">
              <tr>
                <th className="py-2 px-4 font-semibold text-gray-900">
                  Product
                </th>
                <th className="py-2 px-4 font-semibold text-gray-900">Sold</th>
                <th className="py-2 px-4 font-semibold text-gray-900">Stock</th>
                <th className="py-2 px-4 font-semibold text-gray-900">Price</th>
              </tr>
            </thead>
            <tbody className="text-sm sm:text-base border-t border-gray-300">
              {widgetProducts.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-100 transition-colors"
                >
                  <td className="py-2 px-4">
                    <Link
                      href={`/product/${product.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {product.name}
                    </Link>
                  </td>
                  <td className="py-2 px-4 ">{product.soldQuantity}</td>
                  <td className="py-2 px-4 ">{product.remainingStock}</td>
                  <td className="py-2 px-4 font-medium">
                    {formatCurrency(product.price)}
                  </td>
                </tr>
              ))}

              {widgetProducts.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="py-6 text-center text-gray-500 italic"
                  >
                    No sales data available yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="All Best Selling Products"
        footer={
          <Button
            type="button"
            variant="secondary"
            onClick={() => setShowModal(false)}
          >
            Close
          </Button>
        }
      >
        <div className="overflow-x-auto max-h-[60vh]">
          <table className="min-w-full bg-white text-left">
            <thead className="text-sm sm:text-base sticky top-0 bg-white shadow-sm">
              <tr>
                <th className="py-2 px-4 font-semibold text-gray-900">
                  Product
                </th>
                <th className="py-2 px-4 font-semibold text-gray-900">Sold</th>
                <th className="py-2 px-4 font-semibold text-gray-900">Stock</th>
                <th className="py-2 px-4 font-semibold text-gray-900">Price</th>
              </tr>
            </thead>
            <tbody className="text-sm sm:text-base border-t border-gray-300">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-100 transition-colors"
                >
                  <td className="py-2 px-4 text-gray-800">
                    <Link
                      href={`/product/${product.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {product.name}
                    </Link>
                  </td>
                  <td className="py-2 px-4 text-gray-600">
                    {product.soldQuantity}
                  </td>
                  <td className="py-2 px-4 text-gray-600">
                    {product.remainingStock}
                  </td>
                  <td className="py-2 px-4 font-medium text-gray-900">
                    {formatCurrency(product.price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>
    </>
  );
}
