"use client";

import { useState } from "react";
import { insertProduct } from "@/lib/supabase/products";

const AddProduct = () => {
  const [showForm, setShowForm] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    name: "",
    type: "",
    category: "",
    amountStock: "",
    priceBuy: "",
    priceSell: "",
    supplierID: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await insertProduct({
        product_name: form.name,
        product_type: form.type,
        product_category: form.category,
        amount_stock: parseFloat(form.amountStock),
        buy_price: parseFloat(form.priceBuy),
        sell_price: parseFloat(form.priceSell),
        image_file: imageFile || undefined,
        supplier_id: parseInt(form.supplierID),
      });

      alert("Product added successfully!");
      setShowForm(false);
      setForm({
        name: "",
        type: "",
        category: "",
        amountStock: "",
        priceBuy: "",
        priceSell: "",
        supplierID: "",
      });
      setImageFile(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("An unexpected error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Add Product Button */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="cursor-pointer rounded-md py-2 px-4 bg-blue-600 text-white"
      >
        Add Product
      </button>

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex justify-center items-start bg-black/30 overflow-y-auto">
          <div className="flex flex-col justify-start w-full max-w-md mx-auto p-6 mt-10 mb-10 bg-white border border-gray-300 rounded-md shadow-lg">
            <h2 className="text-xl font-semibold mb-4">New Product</h2>
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              {/* Image Upload */}
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
                {previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewUrl}
                    alt="Selected"
                    className="w-full h-auto rounded-md mb-3"
                  />
                ) : (
                  <>
                    <p className="text-gray-600 text-center">Drag Image here</p>
                    <span className="text-gray-400 my-1">or</span>
                  </>
                )}
                <label className="text-blue-600 px-4 cursor-pointer hover:text-blue-400">
                  {previewUrl ? "Change Image" : "Browse Image"}
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setImageFile(file);
                        setPreviewUrl(URL.createObjectURL(file));
                      }
                    }}
                  />
                </label>
              </div>

              <div className="flex items-center justify-between">
                <label htmlFor="supplierID">Supplier ID</label>
                <input
                  id="supplierID"
                  type="number"
                  placeholder="Enter supplier ID"
                  className="border rounded-md p-2 w-2/3 no-spinner"
                  min={0}
                  value={form.supplierID}
                  onChange={(e) =>
                    setForm({ ...form, supplierID: e.target.value })
                  }
                />
              </div>

              {/* Product Name */}
              <div className="flex items-center justify-between">
                <label htmlFor="name">Product Name</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter product name"
                  className="border rounded-md p-2 w-2/3"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              {/* Product Type */}
              <div className="flex items-center justify-between">
                <label htmlFor="type">Product Type</label>
                <input
                  id="type"
                  type="text"
                  placeholder="Enter product type"
                  className="border rounded-md p-2 w-2/3"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                />
              </div>

              {/* Product Category */}
              <div className="flex items-center justify-between">
                <label htmlFor="category">Product Category</label>
                <select
                  id="category"
                  className="border rounded-md p-2 w-2/3 bg-white cursor-pointer"
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                >
                  <option value="" disabled>
                    Select product category
                  </option>
                  <option value="electronics">Electronics</option>
                  <option value="clothing">Clothing</option>
                  <option value="home">Home & Furniture</option>
                  <option value="beauty">Beauty & Health</option>
                  <option value="sports">Sports & Outdoors</option>
                </select>
              </div>

              {/* Price Buy */}
              <div className="flex items-center justify-between">
                <label htmlFor="amountStock">Amount Stock</label>
                <input
                  id="amountStock"
                  type="number"
                  placeholder="Enter amount stock"
                  className="border rounded-md p-2 w-2/3 no-spinner"
                  min={0}
                  value={form.amountStock}
                  onChange={(e) =>
                    setForm({ ...form, amountStock: e.target.value })
                  }
                />
              </div>

              {/* Price Buy */}
              <div className="flex items-center justify-between">
                <label htmlFor="priceBuy">Price Buy</label>
                <input
                  id="priceBuy"
                  type="number"
                  placeholder="Enter price buy product"
                  className="border rounded-md p-2 w-2/3 no-spinner"
                  min={0}
                  value={form.priceBuy}
                  onChange={(e) =>
                    setForm({ ...form, priceBuy: e.target.value })
                  }
                />
              </div>

              {/* Price Sell */}
              <div className="flex items-center justify-between">
                <label htmlFor="priceSell">Price Sell</label>
                <input
                  id="priceSell"
                  type="number"
                  placeholder="Enter price sell product"
                  className="border rounded-md p-2 w-2/3 no-spinner"
                  min={0}
                  value={form.priceSell}
                  onChange={(e) =>
                    setForm({ ...form, priceSell: e.target.value })
                  }
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end items-center mt-4 gap-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="cursor-pointer border rounded-md border-gray-400 py-2 px-4 hover:underline"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="cursor-pointer bg-blue-600 text-white py-2 px-4 rounded-md disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Adding..." : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProduct;
