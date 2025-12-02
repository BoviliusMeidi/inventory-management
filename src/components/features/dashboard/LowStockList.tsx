"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link"; // 1. ⭐️ Impor Link
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { LowStockProduct } from "@/lib/types";

export default function LowStockList({
  products,
}: {
  products: LowStockProduct[];
}) {
  const [showModal, setShowModal] = useState(false);
  const widgetProducts = products.slice(0, 3);

  return (
    <>
      <div className="bg-white shadow-md p-6 rounded-xl w-full md:w-1/3">
        <div className="flex flex-row justify-between items-center mb-4">
          <h1 className="text-lg">Low Quantity Stock</h1>
          <button
            onClick={() => setShowModal(true)}
            className="text-blue-600 text-sm hover:underline cursor-pointer"
          >
            See All
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {widgetProducts.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="flex flex-row justify-between items-center p-2 hover:bg-gray-50 rounded-lg transition cursor-pointer group"
            >
              <div className="flex flex-row gap-4 items-center">
                <div className="w-12 h-12 relative bg-gray-100 rounded-md overflow-hidden border border-gray-200">
                  <Image
                    src={product.image || "/product.svg"}
                    fill
                    className="object-cover"
                    alt={product.name}
                  />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900 text-sm line-clamp-1 w-24 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h2>
                  <p className="text-gray-500 text-xs">
                    Remaining:{" "}
                    <span className="font-medium text-gray-800">
                      {product.remainingStock}
                    </span>
                  </p>
                </div>
              </div>
              {product.remainingStock === 0 ? (
                <span className="rounded-full bg-red-100 px-2 py-1 text-xs text-red-600 font-medium">
                  Sold
                </span>
              ) : (
                <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-700 font-medium">
                  Low
                </span>
              )}
            </Link>
          ))}

          {widgetProducts.length === 0 && (
            <p className="text-gray-400 text-center text-sm py-4">
              Safe stock levels.
            </p>
          )}
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Low Stock Items (< 10)"
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
        <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-2">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="flex flex-row justify-between items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition cursor-pointer group"
            >
              <div className="flex flex-row gap-4 items-center">
                <div className="w-12 h-12 relative bg-gray-100 rounded-md overflow-hidden border border-gray-200">
                  <Image
                    src={product.image || "/product.svg"}
                    fill
                    className="object-cover"
                    alt={product.name}
                  />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Stock:{" "}
                    <span className="text-red-600 font-bold">
                      {product.remainingStock}
                    </span>
                  </p>
                </div>
              </div>

              <div className="text-right">
                {product.remainingStock === 0 ? (
                  <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full">
                    Out of Stock
                  </span>
                ) : (
                  <span className="text-xs font-bold text-yellow-700 bg-yellow-100 px-2 py-1 rounded-full">
                    Low Stock
                  </span>
                )}
              </div>
            </Link>
          ))}

          {products.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              No items are currently low on stock.
            </p>
          )}
        </div>
      </Modal>
    </>
  );
}