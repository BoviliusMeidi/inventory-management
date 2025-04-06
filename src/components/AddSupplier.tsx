"use client";

import { useState } from "react";

const AddSupplier = () => {
  const [showForm, setShowForm] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div className="">
      {/* Add Product Button */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="cursor-pointer rounded-md py-2 px-4 bg-blue-600 text-white"
      >
        Add Supplier
      </button>

      {/* Product Form */}
      {showForm && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div className="w-1/3 p-4 border border-gray-300 rounded-md bg-white shadow-lg">
            <h2 className="text-xl font-semibold mb-4">New Supplier</h2>
            <form className="flex flex-col gap-5">
              <div
                className={`border-2 border-dashed rounded-lg p-3 w-full max-w-xs mx-auto 
                            flex flex-col items-center justify-center cursor-pointer transition-all 
                            ${
                              isDragging
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-300 bg-gray-100"
                            }`}
                onDragEnter={() => setIsDragging(true)}
                onDragLeave={() => setIsDragging(false)}
              >
                <p className="text-gray-600 text-center">Drag Image here</p>
                <span className="text-gray-400 my-1">or</span>
                <label className="text-blue-600 px-4 cursor-pointer hover:text-blue-400">
                  Browse Image
                  <input type="file" className="hidden" />
                </label>
              </div>
              <div className="flex items-center justify-between">
                <label htmlFor="">Supplier Name</label>
                <input
                  type="text"
                  placeholder="Enter supplier name"
                  className="border rounded-md p-2 w-2/3"
                />
              </div>
              <div className="flex items-center justify-between">
                <label htmlFor="">Product Name</label>
                <input
                  type="text"
                  placeholder="Enter product name"
                  className="border rounded-md p-2 w-2/3"
                />
              </div>
              <div className="flex items-center justify-between">
                <label htmlFor="">Product Type</label>
                <input
                  type="text"
                  placeholder="Enter product type"
                  className="border rounded-md p-2 w-2/3"
                />
              </div>
              <div className="flex items-center justify-between">
                <label htmlFor="">Product Category</label>
                <select
                  id="category"
                  className="border rounded-md p-2 w-2/3 bg-white cursor-pointer"
                >
                  <option value="" disabled selected>
                    Select product category
                  </option>
                  <option value="electronics">Electronics</option>
                  <option value="clothing">Clothing</option>
                  <option value="home">Home & Furniture</option>
                  <option value="beauty">Beauty & Health</option>
                  <option value="sports">Sports & Outdoors</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <label htmlFor="">Contact Number</label>
                <input
                  type="number"
                  placeholder="Enter supplier contact"
                  className="border rounded-md p-2 w-2/3"
                />
              </div>
              <div className="flex items-center justify-between">
                <label htmlFor="">Purchase Link</label>
                <input
                  type="text"
                  placeholder="Enter purchase link"
                  className="border rounded-md p-2 w-2/3"
                />
              </div>
              <div className="flex items-center justify-between">
                <label htmlFor="">Price Buy</label>
                <input
                  type="number"
                  placeholder="Enter price buy product"
                  className="border rounded-md p-2 w-2/3"
                />
              </div>
              <div className="flex justify-end items-center mt-4 gap-4">
                <button
                  onClick={() => setShowForm(false)}
                  className="cursor-pointer border rounded-md border-gray-400 py-2 px-4 hover:underline"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="cursor-pointer bg-blue-600 text-white py-2 px-4 rounded-md"
                >
                  Add Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddSupplier;
