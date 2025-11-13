"use client";

import { useEffect, useState } from "react";
import { getPaginatedSuppliersByUser, Supplier } from "@/lib/actions/suppliers";
const PAGE_SIZE = 10;

export default function SupplierTable() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getPaginatedSuppliersByUser(page, PAGE_SIZE);
        setSuppliers(res.data);
        setTotalPages(Math.ceil(res.total / PAGE_SIZE));
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [page]);

  return (
    <div className="pt-2">
      <table className="min-w-full bg-white text-left">
        <thead>
          <tr>
            <th className="py-2 px-4">Supplier ID</th>
            <th className="py-2 px-4">Supplier Name</th>
            <th className="py-2 px-4">Contact Number</th>
            <th className="py-2 px-4">Purchase Link</th>
          </tr>
        </thead>
        <tbody className="border-t border-gray-300">
          {suppliers.map((supplier) => (
            <tr key={supplier.id} className="hover:bg-gray-100 cursor-pointer">
              <td className="py-2 px-4">{supplier.id}</td>
              <td className="py-2 px-4">{supplier.supplier_name}</td>
              <td className="py-2 px-4">+ {supplier.contact_number}</td>
              <td className="py-2 px-4">
                <a>{supplier.purchase_link}</a>
              </td>
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
