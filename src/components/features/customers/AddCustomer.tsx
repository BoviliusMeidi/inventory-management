"use client";

import {
  useState,
  useActionState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { insertCustomer } from "@/lib/actions/customers";
import { Button } from "@/components/ui/Button";
import LabeledInput from "@/components/ui/LabeledInput";
import Modal from "@/components/ui/Modal";

const initialState: { success: boolean; message: string } = {
  success: false,
  message: "",
};

export default function AddCustomer ({ onOrderChange }: { onOrderChange: () => void }){
  const [showForm, setShowForm] = useState(false);
  const processedStateRef = useRef(initialState);

  const [state, formAction, isPending] = useActionState(
    insertCustomer,
    initialState
  );

  const formRef = useRef<HTMLFormElement>(null);

  const handleDiscard = useCallback(() => {
    formRef.current?.reset();
    setShowForm(false);
  }, []);
  useEffect(() => {
    if (state !== processedStateRef.current && state.message) {
      alert(state.message);
      processedStateRef.current = state;
      if (state.success) {
        handleDiscard();
        onOrderChange();
      }
    }
  }, [state, onOrderChange, handleDiscard]);

  return (
    <div className="">
      <Button
        onClick={() => setShowForm(true)}
        className="text-xs sm:text-base"
      >
        Add Customer
      </Button>
      <Modal
        isOpen={showForm}
        onClose={handleDiscard}
        title="New Customer"
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
              {isPending ? "Adding..." : "Add Customer"}
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
            id="customer_name"
            name="customer_name"
            label="Customer Name"
            type="text"
            placeholder="e.g., Andi Budaya"
            required
          />

          <LabeledInput
            id="address"
            name="address"
            label="Address Customer"
            type="text"
            placeholder="e.g., Jl. Abadi Jaya"
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
        </form>
      </Modal>
    </div>
  );
};
