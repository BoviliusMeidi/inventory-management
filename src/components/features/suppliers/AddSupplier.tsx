"use client";

import { useState, useActionState, useEffect, useRef } from "react";
import { insertSupplier } from "@/lib/actions/suppliers";
import { Button } from "@/components/ui/Button";
import LabeledInput from "@/components/ui/LabeledInput";
import Modal from "@/components/ui/Modal";

const initialState: { success: boolean; message: string } = {
  success: false,
  message: "",
};

const AddSupplier = () => {
  const [showForm, setShowForm] = useState(false);

  const [state, formAction, isPending] = useActionState(
    insertSupplier,
    initialState
  );

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message) {
      alert(state.message);
      if (state.success) {
        setShowForm(false);
        formRef.current?.reset();
      }
    }
  }, [state]);

  const handleDiscard = () => {
    formRef.current?.reset();
    setShowForm(false);
  };

  return (
    <div className="">
      <Button
        onClick={() => setShowForm(true)}
        className="text-xs sm:text-base"
      >
        Add Supplier
      </Button>
      <Modal
        isOpen={showForm}
        onClose={handleDiscard}
        title="New Supplier"
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
              form="supplier-form"
              disabled={isPending}
              className="text-xs sm:text-base"
            >
              {isPending ? "Adding..." : "Add Supplier"}
            </Button>
          </>
        }
      >
        <form
          id="supplier-form"
          ref={formRef}
          action={formAction}
          className="flex flex-col gap-5"
        >
          <LabeledInput
            id="supplier_name"
            name="supplier_name"
            label="Supplier Name"
            type="text"
            placeholder="e.g., PT. Stok Abadi"
            required
          />

          <LabeledInput
            id="address"
            name="address"
            label="Address Supplier"
            type="text"
            placeholder="e.g., Jl. Stok Abadi"
            required
          />

          <LabeledInput
            id="contact_number"
            name="contact_number"
            label="Contact Number"
            type="number"
            placeholder="e.g., 081234567890"
            required
          />

          <LabeledInput
            id="purchase_link"
            name="purchase_link"
            label="Purchase Link"
            type="text"
            placeholder="e.g., https://tokopedia.com/..."
          />
        </form>
      </Modal>
    </div>
  );
};

export default AddSupplier;
