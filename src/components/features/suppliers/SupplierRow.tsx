"use client";

import { useState } from "react";
import Link from "next/link";
import { Supplier } from "@/lib/actions/suppliers";
import {
  formatDisplayPhoneNumber,
  formatPurchaseLink,
  formatToLocalPhone,
} from "@/lib/utils/formatters";
import { copyToClipboard } from "@/lib/utils/clipboard";

interface SupplierRowProps {
  supplier: Supplier;
}

export default function SupplierRow({ supplier }: SupplierRowProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyPhone = async () => {
    const localPhone = formatToLocalPhone(supplier.contact_number);
    const success = await copyToClipboard(localPhone);

    if (success) {
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } else {
      alert("Failed to copy phone number.");
    }
  };

  return (
    <tr className="hover:bg-gray-100">
      <td className="py-2 px-4">{supplier.supplier_name}</td>
      <td className="py-2 px-4">{supplier.address}</td>
      <td className="py-2 px-4 cursor-pointer" onClick={handleCopyPhone}>
        {isCopied ? (
          <span className="text-green-600 font-semibold">Copied!</span>
        ) : (
          formatDisplayPhoneNumber(supplier.contact_number)
        )}
      </td>
      <td className="py-2 px-4">
        <Link
          href={formatPurchaseLink(supplier.purchase_link)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {supplier.purchase_link}
        </Link>
      </td>
    </tr>
  );
}
