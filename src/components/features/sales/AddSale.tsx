"use client";

import {
  useState,
  useActionState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { insertSale } from "@/lib/actions/sales";
import { Button } from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import LabeledInput from "@/components/ui/LabeledInput";
import LabeledSelect from "@/components/ui/LabeledSelect";
import SearchableSelect from "@/components/ui/SearchableSelect";
import {
  formatCurrency,
  formatDisplayPhoneNumber,
} from "@/lib/utils/formatters";
import { DeleteIcon } from "@/components/icons";
import {
  FormState,
  ProductOption,
  CustomerOption,
  SaleItem,
} from "@/lib/types";
import { PAYMENT_METHODS, PAYMENT_STATUSES } from "@/lib/constants";

const initialState: FormState = { success: false, message: "" };

interface AddSaleProps {
  products: ProductOption[];
  customers: CustomerOption[];
  onSaleChange: () => void;
}

export default function AddSale({
  products = [],
  customers = [],
  onSaleChange,
}: AddSaleProps) {
  const [showForm, setShowForm] = useState(false);
  const [state, formAction, isPending] = useActionState(
    insertSale,
    initialState
  );
  const formRef = useRef<HTMLFormElement>(null);

  const [items, setItems] = useState<SaleItem[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    "1"
  );
  const [saleDate, setSaleDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [paymentStatus, setPaymentStatus] = useState("Paid");

  const [tempProductId, setTempProductId] = useState<string | null>(null);
  const [tempQty, setTempQty] = useState("1");
  const [tempPrice, setTempPrice] = useState("0");

  const processedStateRef = useRef(initialState);
  const [itemFormKey, setItemFormKey] = useState(0);

  const isHeaderLocked = items.length > 0;

  const isItemFormDisabled =
    !selectedCustomerId || !saleDate || !paymentMethod || !paymentStatus;

  const customerOptions = (customers || []).map((c) => ({
    id: String(c.id),
    main_text: c.name,
    secondary_text: String(formatDisplayPhoneNumber(c.contact_number)),
  }));

  const productOptions = (products || []).map((p) => ({
    id: String(p.id),
    main_text: p.product_name,
    secondary_text: `Type: ${p.product_type} | Stok: ${
      p.amount_stock
    } | ${formatCurrency(p.sell_price)}`,
  }));

  const totalAmount = items.reduce(
    (acc, item) => acc + item.quantity * item.sell_price,
    0
  );

  const handleDiscard = useCallback(() => {
    formRef.current?.reset();
    setItems([]);
    setPaymentStatus("Paid");
    setPaymentMethod("Cash");
    setSelectedCustomerId("1");
    setSaleDate(new Date().toISOString().split("T")[0]);

    setTempProductId(null);
    setTempQty("1");
    setTempPrice("0");
    setItemFormKey((prev) => prev + 1);

    setShowForm(false);
  }, []);

  useEffect(() => {
    if (state !== processedStateRef.current && state.message) {
      alert(state.message);
      processedStateRef.current = state;
      if (state.success) {
        handleDiscard();
        onSaleChange();
      }
    }
  }, [state, onSaleChange, handleDiscard]);

  const handleProductSelect = (productId: string | null) => {
    setTempProductId(productId);

    if (productId) {
      const product = products.find((p) => String(p.id) === productId);
      if (product) {
        setTempPrice(String(product.sell_price));
      }
    } else {
      setTempPrice("0");
    }
  };

  const handleAddItem = () => {
    if (!tempProductId) return alert("Select a product");
    const qty = parseInt(tempQty);
    const price = parseFloat(tempPrice);

    const product = products.find((p) => String(p.id) === tempProductId);

    if (!product || qty <= 0) return alert("Invalid product or quantity");
    if (qty > product.amount_stock)
      return alert(`Stok tidak cukup! Sisa: ${product.amount_stock}`);

    if (isNaN(price) || price < 0) return alert("Invalid price");

    setItems([
      ...items,
      {
        product_id: String(product.id),
        product_name: product.product_name,
        quantity: qty,
        sell_price: price,
      },
    ]);

    setTempProductId(null);
    setTempQty("1");
    setTempPrice("0");
    setItemFormKey((prev) => prev + 1);
  };

  const handleRemoveItem = (indexToRemove: number) => {
    setItems((prevItems) =>
      prevItems.filter((_, index) => index !== indexToRemove)
    );
  };

  return (
    <>
      <Button
        onClick={() => setShowForm(true)}
        className="text-xs sm:text-base"
      >
        Add Sale
      </Button>

      <Modal
        isOpen={showForm}
        onClose={handleDiscard}
        title="New Sales Transaction"
        footer={
          <>
            <Button type="button" variant="secondary" onClick={handleDiscard}>
              Cancel
            </Button>
            <Button
              type="submit"
              form="sale-form"
              disabled={isPending || items.length === 0}
            >
              {isPending
                ? "Processing..."
                : `Charge ${formatCurrency(totalAmount)}`}
            </Button>
          </>
        }
      >
        <form
          id="sale-form"
          ref={formRef}
          action={formAction}
          className="flex flex-col gap-5"
        >
          <input type="hidden" name="items" value={JSON.stringify(items)} />
          <SearchableSelect
            label="Customer"
            name="customer_id"
            options={customerOptions}
            onSelect={setSelectedCustomerId}
            value={selectedCustomerId}
            placeholder="Select Customer..."
            disabled={isHeaderLocked}
            required
          />
          <LabeledInput
            label="Date"
            id="sale_date"
            name="sale_date"
            type="date"
            value={saleDate}
            readOnly={isHeaderLocked}
            onChange={(e) => setSaleDate(e.target.value)}
            className={
              isHeaderLocked
                ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                : ""
            }
            required
          />
          <LabeledSelect
            label="Payment Method"
            id="payment_method"
            name="payment_method"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className={
              isHeaderLocked
                ? "bg-gray-100 text-gray-500 cursor-not-allowed pointer-events-none"
                : ""
            }
            required
          >
            {PAYMENT_METHODS.map((method) => (
              <option key={method.value} value={method.value}>
                {method.label}
              </option>
            ))}
          </LabeledSelect>

          <LabeledSelect
            label="Payment Status"
            id="payment_status"
            name="payment_status"
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            className={
              isHeaderLocked
                ? "bg-gray-100 text-gray-500 cursor-not-allowed pointer-events-none"
                : ""
            }
            required
          >
            {PAYMENT_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </LabeledSelect>

          {isHeaderLocked && (
            <p className="text-xs text-center text-gray-500 -mt-2">
              (Remove all items to change customer or date)
            </p>
          )}

          <div className="border-t pt-4">
            <h3 className="font-semibold text-lg mb-2">Sale Items</h3>
            <div
              className={`flex flex-col gap-2 p-2 border rounded-md bg-gray-50 ${
                isItemFormDisabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <SearchableSelect
                label="Product"
                name="temp_product"
                options={productOptions}
                onSelect={handleProductSelect}
                value={tempProductId}
                placeholder={
                  isItemFormDisabled
                    ? "Fill header details first..."
                    : "Search Product..."
                }
                key={itemFormKey}
                disabled={isItemFormDisabled}
              />
              <LabeledInput
                label="Price"
                id="temp_price"
                type="number"
                min={0}
                value={tempPrice}
                onChange={(e) => setTempPrice(e.target.value)}
                disabled={isItemFormDisabled}
              />
              <LabeledInput
                label="Quantity"
                id="temp_qty"
                type="number"
                min={1}
                value={tempQty}
                onChange={(e) => setTempQty(e.target.value)}
                disabled={isItemFormDisabled}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={handleAddItem}
                disabled={isItemFormDisabled}
              >
                Add Item
              </Button>
            </div>
          </div>

          <ul className="space-y-2">
            {items.map((item, idx) => (
              <li
                key={idx}
                className="flex justify-between items-center p-2 border rounded-md"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{item.product_name}</span>
                  <span className="text-xs text-gray-500">
                    Qty: {item.quantity} x {formatCurrency(item.sell_price)}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-semibold">
                    {formatCurrency(item.sell_price * item.quantity)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <DeleteIcon className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
            {items.length === 0 && (
              <li className="text-center text-gray-400 text-sm py-4 italic">
                No items added yet.
              </li>
            )}
          </ul>

          <div className="flex justify-between text-lg font-bold border-t pt-2">
            <span>Total</span>
            <span>{formatCurrency(totalAmount)}</span>
          </div>
        </form>
      </Modal>
    </>
  );
}
