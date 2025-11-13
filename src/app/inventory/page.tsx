"use client";
import Layout from "../../components/Layout";
import AddProduct from "../../components/AddProduct";
import ProductTable from "../../components/ProductTable";
import {
  getTotalProducts,
  getTotalCategoryProducts,
  getTotalLowStockProducts,
} from "@/lib/actions/products";
import { useEffect, useState } from "react";

export default function InventoryPage() {
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [count, setCount] = useState<number | null>(null);
  const [countCategory, setCountCategory] = useState<number | null>(null);
  const [countLowStock, setCountLowStock] = useState<number | null>(null);
  const [countNoStock, setCountNoStock] = useState<number | null>(null);

  useEffect(() => {
    async function dataOverallProducts() {
      const resultTotal = await getTotalProducts();
      const resultCategory = await getTotalCategoryProducts();
      const resultStock = await getTotalLowStockProducts();
      if (resultTotal && resultCategory && resultStock) {
        setCount(resultTotal.count);
        setCountCategory(resultCategory.totalCategories);
        setCountLowStock(resultStock.lowStockCount);
        setCountNoStock(resultStock.noStockCount);
      }
    }
    dataOverallProducts();
  }, []);

  return (
    <Layout>
      <div className="flex flex-col gap-3 mr-3">
        {/* Overall Inventory -- Block 1 */}
        <div className="bg-white shadow-md p-4 rounded-md">
          <h1 className="text-lg pb-2 tracking-wide">Overall Inventory</h1>
          <div className="flex flex-row justify-between gap-3 mt-3 font-semibold">
            <div className="flex flex-col gap-1">
              <h3 className="text-blue-600">Categories</h3>
              <div className="flex flex-row justify-between">
                <p>{countCategory}</p>
              </div>
              <div className="flex flex-row justify-between gap-8 font-medium opacity-65">
                <p>Total Categories</p>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-yellow-700">Products</h3>
              <div className="flex flex-row justify-between">
                <p>{count}</p>
              </div>
              <div className="flex flex-row justify-between gap-8 font-medium opacity-65">
                <p>Total Products</p>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-indigo-600">Top Selling</h3>
              <div className="flex flex-row justify-between">
                <p>14</p>
                <p>Rp14</p>
              </div>
              <div className="flex flex-row justify-between gap-8 font-medium opacity-65">
                <p>Last 7 days</p>
                <p>Costs</p>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-red-400">Stocks Warning</h3>
              <div className="flex flex-row justify-between">
                <p>{countLowStock}</p>
                <p>{countNoStock}</p>
              </div>
              <div className="flex flex-row justify-between gap-8 font-medium opacity-65">
                <p>Low Stock</p>
                <p>Not in Stock</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white shadow-md p-4 rounded-md">
          {/* Products -- Block 2 */}
          <div className="flex flex-row justify-between items-center gap-3">
            <h1 className="text-lg pb-2 tracking-wide">Products</h1>
            {/* Button -- Add , Filter, Download */}
            <div className="flex flex-row gap-4 tracking-wide">
              <AddProduct />
              <button className="cursor-pointer rounded-md py-2 px-4 border border-gray-500 flex items-center gap-3 relative group">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 10H15M2.5 5H17.5M7.5 15H12.5"
                    stroke="#5D6679"
                    strokeWidth="1.67"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Filters
                <div className="absolute top-8 -left-6 mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-lg opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 pointer-events-none">
                  <ul className="flex flex-col p-2">
                    {["In-Stock", "Out of Stock", "Low Stock", "All"].map(
                      (filter) => (
                        <li
                          key={filter}
                          className="py-1 px-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() =>
                            setSelectedFilter(filter === "All" ? null : filter)
                          }
                        >
                          {filter}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </button>
            </div>
          </div>
          {/* Data Products -- Block 3 */}
          <div className="pt-2">
            <ProductTable selectedFilter={selectedFilter} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
