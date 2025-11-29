"use client";

import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils/formatters";
import { Sale } from "@/lib/types";

interface SaleItemsModalProps {
  sale: Sale | null;
  onClose: () => void;
}

export default function SaleItemsModal({ sale, onClose }: SaleItemsModalProps) {
  if (!sale) return null;

  return (
    <Modal
      isOpen={!!sale}
      onClose={onClose}
      title={`Items for Invoice ${sale.invoice_code}`}
      footer={
        <Button type="button" variant="secondary" onClick={onClose}>
          Close
        </Button>
      }
    >
      <ul className="flex flex-col gap-3 max-h-60 overflow-y-auto px-1">
        {sale.items.map((item, index) => (
          <li key={index} className="border-b pb-3 last:border-0">
            <div className="flex justify-between font-medium">
              <span>{item.product?.product_name ?? "Product not found"}</span>
              <span className="text-gray-600">Qty: {item.quantity}</span>
            </div>
            <div className="text-sm text-gray-500">
              {item.product?.product_type} ({item.product?.product_category})
            </div>
            <div className="flex justify-between text-sm mt-1">
               <span className="text-gray-500">
                 @ {formatCurrency(item.price_at_sale)}
               </span>
               <span className="font-semibold text-gray-800">
                 {formatCurrency(item.price_at_sale * item.quantity)}
               </span>
            </div>
          </li>
        ))}
      </ul>
    </Modal>
  );
}