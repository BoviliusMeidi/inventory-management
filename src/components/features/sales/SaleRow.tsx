"use client";

import { useState, useTransition } from "react";
import { updateSale, deleteSale } from "@/lib/actions/sales";
import { formatCurrency } from "@/lib/utils/formatters";
import { Button } from "@/components/ui/Button";
import { EditIcon, DeleteIcon, SaveIcon, CloseIcon } from "@/components/icons";
import { Sale } from "@/lib/types";

interface SaleRowProps {
  sale: Sale;
  onOrderChange: () => void;
  onViewItems: () => void;
}

export default function SaleRow({
  sale,
  onOrderChange,
  onViewItems,
}: SaleRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  const isPaid = sale.payment_status === "Paid";

  const [editData, setEditData] = useState({
    payment_status: sale.payment_status || "Paid",
    payment_method: sale.payment_method,
    sale_date: sale.sale_date
      ? new Date(sale.sale_date).toISOString().split("T")[0]
      : "",
  });

  const handleSave = () => {
    const formData = new FormData();
    formData.append("sale_id", String(sale.id));
    formData.append("payment_status", editData.payment_status);
    formData.append("payment_method", editData.payment_method);
    formData.append("sale_date", editData.sale_date);

    startTransition(async () => {
      const result = await updateSale(null, formData);
      if (result.success) {
        setIsEditing(false);
        onOrderChange();
        alert("Sale updated successfully!");
      } else {
        alert(result.message);
      }
    });
  };

  const handleDelete = () => {
    if (
      !confirm(
        "Are you sure? Deleting this sale will RESTORE the stock to inventory."
      )
    )
      return;

    startTransition(async () => {
      const result = await deleteSale(sale.id);
      if (result.success) {
        alert(result.message);
        onOrderChange();
      } else {
        alert(result.message);
      }
    });
  };

  const getStatusColor = (status: string) => {
    if (status === "Paid")
      return "text-green-600 bg-green-50 px-2 py-1 rounded-md";
    if (status === "Debt") return "text-red-600 bg-red-50 px-2 py-1 rounded-md";
    return "text-gray-600";
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="py-3 px-4 font-medium text-gray-900 hidden md:table-cell">
        {sale.invoice_code}
      </td>
      <td className="py-3 px-4">{sale.customer?.name}</td>
      <td className="py-3 px-4 hidden md:table-cell">
        {isEditing ? (
          <input
            type="date"
            value={editData.sale_date}
            onChange={(e) =>
              setEditData({ ...editData, sale_date: e.target.value })
            }
            className="border rounded p-1 w-full text-sm"
            disabled={isPending}
          />
        ) : (
          new Date(sale.sale_date).toLocaleDateString("id-ID")
        )}
      </td>

      <td className="py-3 px-4">
        <button
          onClick={onViewItems}
          className="text-blue-600 hover:underline cursor-pointer font-medium"
        >
          {sale.items.length} Item(s)
        </button>
      </td>

      <td className="py-3 px-4 ">{formatCurrency(sale.total_amount)}</td>

      <td className="py-3 px-4 hidden lg:table-cell">
        {isEditing ? (
          <select
            value={editData.payment_method}
            onChange={(e) =>
              setEditData({ ...editData, payment_method: e.target.value })
            }
            className="border rounded p-1 w-full text-sm bg-white"
            disabled={isPending}
          >
            <option value="Cash">Cash</option>
            <option value="Transfer">Transfer</option>
            <option value="QRIS">QRIS</option>
          </select>
        ) : (
          sale.payment_method
        )}
      </td>

      <td className="py-3 px-4 font-medium">
        {isEditing ? (
          <select
            value={editData.payment_status}
            onChange={(e) =>
              setEditData({ ...editData, payment_status: e.target.value })
            }
            className="border rounded p-1 w-full text-sm bg-white"
            disabled={isPending}
          >
            <option value="Paid">Paid</option>
            <option value="Debt">Debt</option>
          </select>
        ) : (
          <span className={getStatusColor(sale.payment_status || "Paid")}>
            {sale.payment_status || "Paid"}
          </span>
        )}
      </td>

      <td className="py-2 px-4">
        {isEditing ? (
          <div className="flex gap-2">
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={isPending}
              className="text-xs p-1"
            >
              <SaveIcon className="w-4 h-4" />
            </Button>
            <Button
              variant="secondary"
              onClick={() => setIsEditing(false)}
              disabled={isPending}
              className="text-xs p-1"
            >
              <CloseIcon className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => setIsEditing(true)}
              className={`flex items-center gap-1 text-xs ${
                isPaid ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isPaid}
              title={isPaid ? "Cannot edit paid transaction" : "Edit"}
            >
              <EditIcon className="w-4 h-4 text-gray-900" />
            </Button>
            <Button
              variant="secondary"
              onClick={handleDelete}
              disabled={isPaid}
              className={`flex items-center gap-1 text-xs text-red-500 ${
                isPaid ? "opacity-50 cursor-not-allowed" : ""
              }`}
              title={isPaid ? "Cannot delete paid transaction" : "Delete"}
            >
              <DeleteIcon className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        )}
      </td>
    </tr>
  );
}
