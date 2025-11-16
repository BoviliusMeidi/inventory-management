"use client";

import { Order } from "@/lib/actions/orders";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils/formatters";

interface OrderItemsModalProps {
  order: Order | null;
  onClose: () => void;
}

export default function OrderItemsModal({ order, onClose }: OrderItemsModalProps) {
  if (!order) return null;

  return (
    <Modal
      isOpen={!!order}
      onClose={onClose}
      title={`Items for Order #${order.id}`}
      footer={
        <Button type="button" variant="secondary" onClick={onClose}>
          Close
        </Button>
      }
    >
      <ul className="flex flex-col gap-3 max-h-10/12 overflow-y-auto">
        {order.items.map((item, index) => (
          <li
            key={index}
            className="border-b pb-3"
          >
            <div className="flex justify-between font-medium">
              <span>{item.product?.product_name ?? "Product not found"}</span>
              <span className="text-gray-600">Qty: {item.quantity}</span>
            </div>
            <div className="text-sm text-gray-500">
              {item.product?.product_type} ({item.product?.product_category})
            </div>
            <div className="text-sm text-gray-500">
              Cost: {formatCurrency(item.cost_per_item)}
            </div>
          </li>
        ))}
      </ul>
    </Modal>
  );
}