"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  Supplier,
  updateSupplier,
  deleteSupplier,
} from "@/lib/actions/suppliers";
import {
  formatDisplayPhoneNumber,
  formatPurchaseLink,
  formatToLocalPhone,
} from "@/lib/utils/formatters";
import { copyToClipboard } from "@/lib/utils/clipboard";
import { Button } from "@/components/ui/Button";
import { EditIcon, DeleteIcon, SaveIcon, CloseIcon } from "@/components/icons";
import { useRouter } from "next/navigation";

interface SupplierRowProps {
  supplier: Supplier;
}

export default function SupplierRow({ supplier }: SupplierRowProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const [isPending, startTransition] = useTransition();

  const [editData, setEditData] = useState({
    supplier_name: supplier.supplier_name,
    address: supplier.address,
    contact_number: formatToLocalPhone(supplier.contact_number),
    purchase_link: supplier.purchase_link,
  });

  const handleCopyPhone = async () => {
    if (isEditing) return;

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

  const handleSave = () => {
    const formData = new FormData();
    formData.append("id", supplier.id);
    formData.append("supplier_name", editData.supplier_name);
    formData.append("contact_number", editData.contact_number);
    formData.append("purchase_link", editData.purchase_link);

    startTransition(async () => {
      const result = await updateSupplier(null, formData);
      if (result.success) {
        setIsEditing(false);
        alert("Supplier updated!");
        router.refresh();
        window.location.reload();
      } else {
        alert(result.message);
      }
    });
  };

  const handleDelete = () => {
    if (!confirm("Are you sure? This will delete the supplier.")) return;

    startTransition(async () => {
      const result = await deleteSupplier(supplier.id);
      if (result.success) {
        alert("Supplier deleted!");
        router.refresh();
        window.location.reload();
      } else {
        alert(result.message);
      }
    });
  };

  return (
    <tr className="hover:bg-gray-100">
      <td className="py-2 px-4">
        {isEditing ? (
          <input
            type="text"
            value={editData.supplier_name}
            onChange={(e) =>
              setEditData({ ...editData, supplier_name: e.target.value })
            }
            className="border rounded p-1 w-full"
            disabled={isPending}
          />
        ) : (
          supplier.supplier_name
        )}
      </td>
      <td className="py-2 px-4">
        {isEditing ? (
          <input
            type="text"
            value={editData.address}
            onChange={(e) =>
              setEditData({ ...editData, address: e.target.value })
            }
            className="border rounded p-1 w-full"
            disabled={isPending}
          />
        ) : (
          supplier.address
        )}
      </td>
      <td className="py-2 px-4 cursor-pointer" onClick={handleCopyPhone}>
        {isEditing ? (
          <input
            type="number"
            value={editData.contact_number}
            onChange={(e) =>
              setEditData({ ...editData, contact_number: e.target.value })
            }
            className="border rounded p-1 w-full no-spinner"
            disabled={isPending}
          />
        ) : (
          <span
            className={`cursor-pointer ${
              isCopied ? "text-green-600 font-bold" : ""
            }`}
          >
            {isCopied
              ? "Copied!"
              : formatDisplayPhoneNumber(supplier.contact_number)}
          </span>
        )}
      </td>
      <td className="py-2 px-4">
        {isEditing ? (
          <input
            type="text"
            value={editData.purchase_link}
            onChange={(e) =>
              setEditData({ ...editData, purchase_link: e.target.value })
            }
            className="border rounded p-1 w-full"
            disabled={isPending}
          />
        ) : (
          <Link
            href={formatPurchaseLink(supplier.purchase_link)}
            target="_blank"
            className="text-blue-600 hover:underline"
          >
            {supplier.purchase_link}
          </Link>
        )}
      </td>
      <td className="py-2 px-4">
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button
                type="button"
                variant="primary"
                onClick={handleSave}
                disabled={isPending}
                className="p-1 text-xs"
              >
                <SaveIcon className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsEditing(false)}
                disabled={isPending}
                className="p-1 text-xs"
              >
                <CloseIcon className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsEditing(true)}
                className="p-1 text-xs"
              >
                <EditIcon className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={handleDelete}
                className="p-1 text-xs text-red-500"
              >
                <DeleteIcon className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}
