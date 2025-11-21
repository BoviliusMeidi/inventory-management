"use client";

import { useState, useTransition } from "react";
import { Order, updateOrder, deleteOrder } from "@/lib/actions/orders";
import {
  formatCurrency,
  formatDateForInput,
  getOrderStatus,
} from "@/lib/utils/formatters";
import { Button } from "@/components/ui/Button";
import { EditIcon, CloseIcon, DeleteIcon, SaveIcon } from "@/components/icons";

interface OrderRowProps {
  order: Order;
  onOrderChange: () => void;
  onViewItems: () => void;
}

export default function OrderRow({
  order,
  onOrderChange,
  onViewItems,
}: OrderRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const isCompleted = order.status === "Completed";

  const [isSaving, startSaveTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();

  const [editData, setEditData] = useState({
    status: order.status,
    date: formatDateForInput(order.expected_delivery_date),
  });

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("order_id", String(order.id));
    formData.append("status", editData.status);
    formData.append("expected_delivery_date", editData.date);

    startSaveTransition(async () => {
      const result = await updateOrder(null, formData);
      if (result.success) {
        setIsEditing(false);
        alert("Order updated!");
        onOrderChange();
      } else {
        alert(result.message);
      }
    });
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this order? This action cannot be undone."
      )
    ) {
      return;
    }

    startDeleteTransition(async () => {
      const result = await deleteOrder(order.id);
      if (result.success) {
        alert(result.message);
        onOrderChange();
      } else {
        alert(result.message);
      }
    });
  };

  return (
    <tr className="hover:bg-gray-100">
      <td className="py-2 px-2 md:px-4 hidden md:table-cell font-medium">
        #{order.id}
      </td>
      <td className="py-2 px-2 md:px-4">
        {order.supplier?.supplier_name ?? "N/A"}
      </td>
      <td className="py-2 px-2 md:px-4 hidden md:table-cell">
        {formatCurrency(order.total_cost)}
      </td>
      <td className="py-2 px-2 md:px-4">
        <button
          onClick={onViewItems}
          className="text-xs sm:text-base text-blue-600 hover:underline cursor-pointer"
        >
          {order.items.length} Product(s)
        </button>
      </td>

      <td className="py-2 px-2 md:px-4 hidden md:table-cell">
        {isEditing ? (
          <input
            type="date"
            value={editData.date}
            onChange={(e) => setEditData({ ...editData, date: e.target.value })}
            className="border rounded-md p-1 w-fit"
            disabled={isSaving || isDeleting}
          />
        ) : order.expected_delivery_date ? (
          new Date(order.expected_delivery_date).toLocaleDateString("id-ID")
        ) : (
          "N/A"
        )}
      </td>

      <td className="py-2 px-2 md:px-4 font-semibold">
        {isEditing ? (
          <select
            value={editData.status}
            onChange={(e) =>
              setEditData({ ...editData, status: e.target.value })
            }
            className="border rounded-md p-1 w-fit"
            disabled={isSaving || isDeleting}
          >
            <option value="Pending">Pending</option>
            <option value="Shipped">Shipped</option>
            <option value="Completed">Completed</option>
          </select>
        ) : (
          <span className={getOrderStatus(order.status)}>{order.status}</span>
        )}
      </td>

      <td className="py-2 px-4">
        {isEditing ? (
          <div className="flex gap-2">
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={isSaving || isDeleting}
              className="text-xs p-1"
            >
              {isSaving ? "..." : <SaveIcon className="w-4 h-4 text-white" />}
            </Button>
            <Button
              variant="secondary"
              onClick={() => setIsEditing(false)}
              disabled={isSaving || isDeleting}
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
              className="flex items-center gap-1 text-xs"
              disabled={isCompleted}
            >
              <EditIcon className="w-4 h-4 text-gray-900" />
            </Button>
            <Button
              variant="secondary"
              onClick={handleDelete}
              className="flex items-center gap-1 text-xs text-red-500"
              disabled={isCompleted || isDeleting}
            >
              {isDeleting ? (
                "..."
              ) : (
                <DeleteIcon className="w-4 h-4 text-red-500" />
              )}
            </Button>
          </div>
        )}
      </td>
    </tr>
  );
}
