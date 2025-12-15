"use client";

import { useState, useActionState, useEffect, useRef } from "react";
import { insertOrder } from "@/lib/actions/orders";
import { Button } from "@/components/ui/Button";
import LabeledInput from "@/components/ui/LabeledInput";
import LabeledSelect from "@/components/ui/LabeledSelect";
import { Product, FormState } from "@/lib/types";
import { ORDER_STATUSES } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils/formatters";

const initialState: FormState = { success: false, message: "" };

interface ProductPurchaseTabProps {
  product: Product;
}

export default function ProductPurchaseTab({
  product,
}: ProductPurchaseTabProps) {
  const [state, formAction, isPending] = useActionState(
    insertOrder,
    initialState
  );
  const formRef = useRef<HTMLFormElement>(null);

  const [quantity, setQuantity] = useState("1");
  const [cost, setCost] = useState(String(product.buy_price));
  const [expectedDate, setExpectedDate] = useState("");
  const [status, setStatus] = useState("Pending");

  useEffect(() => {
    if (state.success) {
      alert("Purchase Order created successfully!");
      formRef.current?.reset();
      setQuantity("1");
      setCost(String(product.buy_price));
      setExpectedDate("");
      setStatus("Pending");
    }
  }, [state, product.buy_price]);

  const itemsPayload = JSON.stringify([
    {
      product_id: product.id,
      product_name: product.product_name,
      quantity: parseInt(quantity || "0", 10),
      cost_per_item: parseFloat(cost || "0"),
    },
  ]);

  if (!product.supplier) {
    return (
      <div className="p-6 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-200">
        <h3 className="font-bold">Missing Supplier</h3>
        <p className="text-sm mt-1">
          This product is not linked to any supplier. Please edit the product
          details to assign a supplier before creating a purchase order.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="mb-6 border-b pb-4">
        <h2 className="text-lg font-bold text-gray-900">Restock Product</h2>
        <p className="text-sm text-gray-500">
          Create a new purchase order specifically for{" "}
          <span className="font-semibold text-gray-900">
            {product.product_name}
          </span>
        </p>
      </div>

      <form ref={formRef} action={formAction} className="flex flex-col gap-6">
        <input type="hidden" name="supplier_id" value={product.supplier.id} />
        <input type="hidden" name="items" value={itemsPayload} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Supplier
            </label>
            <div className="p-2.5 bg-gray-100 border border-gray-300 rounded-md text-gray-600 text-sm">
              {product.supplier.supplier_name}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Total Estimated Cost
            </label>
            <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-md text-blue-700 font-bold text-sm">
              {formatCurrency(
                parseInt(quantity || "0") * parseFloat(cost || "0")
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <LabeledInput
            label="Expected Delivery Date"
            id="expected_delivery_date"
            name="expected_delivery_date"
            type="date"
            value={expectedDate}
            onChange={(e) => setExpectedDate(e.target.value)}
            required
          />

          <LabeledSelect
            label="Order Status"
            id="status"
            name="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            {ORDER_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </LabeledSelect>
        </div>

        <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
          <h3 className="font-medium text-gray-900 mb-4 text-sm uppercase tracking-wide">
            Item Configuration
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LabeledInput
              label="Quantity to Order"
              id="quantity"
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
            <LabeledInput
              label="Cost per Item"
              id="cost"
              type="number"
              min={0}
              step="0.01"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              required
            />
          </div>
        </div>

        {state.message && (
          <div
            className={`p-3 text-sm rounded-md ${
              state.success
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {state.message}
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Processing..." : "Create Order"}
          </Button>
        </div>
      </form>
    </div>
  );
}
