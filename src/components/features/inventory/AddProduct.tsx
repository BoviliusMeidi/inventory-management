"use client";

import { useState, useActionState, useEffect, useRef } from "react";
import { insertProduct } from "@/lib/actions/products";
import { Button } from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import LabeledInput from "@/components/ui/LabeledInput";
import LabeledSelect from "@/components/ui/LabeledSelect";
import ImageDropzone from "@/components/ui/ImageDropzone";
import SearchableSelect from "@/components/ui/SearchableSelect";
import { formatDisplayPhoneNumber } from "@/lib/utils/formatters";

const initialState: { success: boolean; message: string } = {
  success: false,
  message: "",
};

type SupplierOption = {
  id: string;
  supplier_name: string;
  contact_number : number;
};

const AddProduct = ({ suppliers }: { suppliers: SupplierOption[] }) => {
  const [showForm, setShowForm] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [state, formAction, isPending] = useActionState(
    insertProduct,
    initialState
  );
  const [, setSelectedSupplierId] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const supplierOptions = suppliers.map((supplier) => ({
    id: supplier.id,
    main_text: supplier.supplier_name,
    secondary_text: String(formatDisplayPhoneNumber(supplier.contact_number))
  }));

  useEffect(() => {
    if (state.message) {
      alert(state.message);
      if (state.success) {
        setShowForm(false);
        setPreviewUrl(null);
        formRef.current?.reset();
      }
    }
  }, [state]);

  const handleDiscard = () => {
    setPreviewUrl(null);
    formRef.current?.reset();
    setShowForm(false);
  };

  const handleFileChange = (file: File | null) => {
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  return (
    <>
      <Button
        onClick={() => setShowForm(true)}
        className="flex items-center text-xs sm:text-base"
      >
        Add Product
      </Button>
      <Modal
        isOpen={showForm}
        onClose={handleDiscard}
        title="New Product"
        footer={
          <>
            <Button
              type="button"
              variant="secondary"
              onClick={handleDiscard}
              className="text-xs sm:text-base"
            >
              Discard
            </Button>
            <Button
              type="submit"
              form="product-form"
              disabled={isPending}
              className="text-xs sm:text-base"
            >
              {isPending ? "Adding..." : "Add Product"}
            </Button>
          </>
        }
      >
        <form
          id="product-form"
          ref={formRef}
          action={formAction}
          className="flex flex-col gap-5"
        >
          <ImageDropzone
            name="image_file"
            previewUrl={previewUrl}
            onChange={handleFileChange}
          />
          <SearchableSelect
            label="Supplier"
            name="supplier_id"
            options={supplierOptions}
            onSelect={setSelectedSupplierId}
            required
          />
          <LabeledInput
            label="Product Name"
            id="name"
            name="product_name"
            type="text"
            placeholder="e.g., Long Sleeve Shirt"
            required
          />
          <LabeledInput
            label="Product Type"
            id="type"
            name="product_type"
            type="text"
            placeholder="e.g., Men's Apparel"
            required
          />
          <LabeledSelect
            label="Product Category"
            id="category"
            name="product_category"
            defaultValue=""
            required
          >
            <option value="" disabled>
              Select product category
            </option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="home">Home & Furniture</option>
            <option value="beauty">Beauty & Health</option>
            <option value="sports">Sports & Outdoors</option>
          </LabeledSelect>
          <LabeledInput
            label="Qty"
            id="amountStock"
            name="amount_stock"
            type="number"
            placeholder="e.g., 50"
            min={0}
            required
          />
          <LabeledInput
            label="Cost"
            id="priceBuy"
            name="buy_price"
            type="number"
            placeholder="e.g., 75000"
            min={0}
            required
          />
          <LabeledInput
            label="Price"
            id="priceSell"
            name="sell_price"
            type="number"
            placeholder="e.g., 149000"
            min={0}
            required
          />
        </form>
      </Modal>
    </>
  );
};

export default AddProduct;
