"use client";

import { useState } from "react";
import { insertSupplier } from "@/lib/actions/suppliers";

const AddSupplier = () => {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    supplier_name: "",
    contact_number: "",
    purchase_link: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await insertSupplier({
        supplier_name: form.supplier_name,
        contact_number: parseInt(form.contact_number),
        purchase_link: form.purchase_link,
      });

      alert("Supplier added successfully!");
      setShowForm(false);
      setForm({
        supplier_name: "",
        contact_number: "",
        purchase_link: "",
      });
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
    <div className="">
      {/* Add Supplier Button */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="cursor-pointer rounded-md py-2 px-4 bg-blue-600 text-white"
      >
        Add Supplier
      </button>

      {/* Supplier Form */}
      {showForm && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div className="w-1/3 p-4 border border-gray-300 rounded-md bg-white shadow-lg">
            <h2 className="text-xl font-semibold mb-4">New Supplier</h2>
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              <div className="flex items-center justify-between">
                <label htmlFor="supplier_name">Supplier Name</label>
                <input
                  id="supplier_name"
                  type="text"
                  placeholder="Enter supplier name"
                  className="border rounded-md p-2 w-2/3"
                  value={form.supplier_name}
                  onChange={(e) =>
                    setForm({ ...form, supplier_name: e.target.value })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <label htmlFor="contact_number">Contact Number</label>
                <input
                  id="contact_number"
                  type="number"
                  placeholder="Enter supplier contact"
                  className="border rounded-md p-2 w-2/3 no-spinner"
                  value={form.contact_number}
                  onChange={(e) =>
                    setForm({ ...form, contact_number: e.target.value })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <label htmlFor="purchase_link">Purchase Link</label>
                <input
                  id="purchase_link"
                  type="text"
                  placeholder="Enter purchase link"
                  className="border rounded-md p-2 w-2/3"
                  value={form.purchase_link}
                  onChange={(e) =>
                    setForm({ ...form, purchase_link: e.target.value })
                  }
                />
              </div>
              <div className="flex justify-end items-center mt-4 gap-4">
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
                    {isSubmitting ? "Adding..." : "Add Supplier"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddSupplier;
