"use client";

import { useState, useTransition } from "react";
import {
  Customer,
  updateCustomer,
  deleteCustomer
} from "@/lib/actions/customers";
import {
  formatDisplayPhoneNumber,
  formatToLocalPhone,
} from "@/lib/utils/formatters";
import { copyToClipboard } from "@/lib/utils/clipboard";
import { Button } from "@/components/ui/Button";
import { EditIcon, DeleteIcon, SaveIcon, CloseIcon } from "@/components/icons";

interface CustomerRowProps {
  customer: Customer;
  onOrderChange: () => void;
}

export default function CustomerRow({
  customer,
  onOrderChange,
}: CustomerRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const [isPending, startTransition] = useTransition();

  const [editData, setEditData] = useState({
    name: customer.name,
    address: customer.address,
    contact_number: formatToLocalPhone(customer.contact_number),
  });

  const handleCopyPhone = async () => {
    if (isEditing) return;

    const localPhone = formatToLocalPhone(customer.contact_number);
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
    formData.append("id", customer.id);
    formData.append("customer_name", editData.name);
    formData.append("address", editData.address);
    formData.append("contact_number", editData.contact_number);

    startTransition(async () => {
      const result = await updateCustomer(null, formData);
      if (result.success) {
        setIsEditing(false);
        alert("Customer updated!");
        onOrderChange();
      } else {
        alert(result.message);
      }
    });
  };

  const handleDelete = () => {
    if (!confirm("Are you sure? This will delete the customer.")) return;

    startTransition(async () => {
      const result = await deleteCustomer(customer.id);
      if (result.success) {
        alert("Customer deleted!");
        onOrderChange();
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
            value={editData.name}
            onChange={(e) =>
              setEditData({ ...editData, name: e.target.value })
            }
            className="border rounded p-1 w-full"
            disabled={isPending}
          />
        ) : (
          customer.name
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
          customer.address
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
              : formatDisplayPhoneNumber(customer.contact_number)}
          </span>
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
