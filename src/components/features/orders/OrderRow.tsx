// components/features/orders/OrderRow.tsx
"use client";

import { useState, useTransition } from "react";
import { Order, updateOrder } from "@/lib/actions/orders";
import { formatCurrency, getOrderStatus } from "@/lib/utils/formatters";
import { Button } from "@/components/ui/Button";
import { EditIcon, CloseIcon } from "@/components/icons";

interface OrderRowProps {
  order: Order;
  onOrderChange: () => void;
}

export default function OrderRow({ order, onOrderChange }: OrderRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const isCompleted = order.status === "Completed";

  const [editData, setEditData] = useState({
    status: order.status,
    date: order.expected_delivery_date
      ? new Date(order.expected_delivery_date).toISOString().split("T")[0]
      : "",
  });

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("order_id", String(order.id));
    formData.append("status", editData.status);
    formData.append("expected_delivery_date", editData.date);

    startTransition(async () => {
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

  return (
    <tr className="hover:bg-gray-100">
      <td className="py-2 px-2 md:px-4 font-medium">#{order.id}</td>
      <td className="py-2 px-2 md:px-4">
        {order.supplier?.supplier_name ?? "N/A"}
      </td>
      <td className="py-2 px-2 md:px-4 hidden md:table-cell">
        {formatCurrency(order.total_cost)}
      </td>
      <td className="py-2 px-2 md:px-4 hidden lg:table-cell">
        {order.items.length} Product(s)
      </td>

      <td className="py-2 px-2 md:px-4 hidden md:table-cell">
        {isEditing ? (
          <input
            type="date"
            value={editData.date}
            onChange={(e) => setEditData({ ...editData, date: e.target.value })}
            className="border rounded-md p-1 w-full"
            disabled={isPending}
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
            className="border rounded-md p-1 w-full"
            disabled={isPending}
          >
            <option value="Pending">Pending</option>
            <option value="Shipped">Shipped</option>
            <option value="Completed">Completed (Update Stock)</option>
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
              disabled={isPending}
              className="text-xs p-1"
            >
              {isPending ? "..." : "Save"}
            </Button>
            <Button
              variant="secondary"
              onClick={() => setIsEditing(false)}
              disabled={isPending}
            >
              <CloseIcon className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <Button
            variant="secondary"
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1 text-xs"
            disabled={isCompleted}
          >
            <EditIcon className="w-4 h-4" />
            Edit
          </Button>
        )}
      </td>
    </tr>
  );
}
