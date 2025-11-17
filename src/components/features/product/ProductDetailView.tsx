"use client";

import { useState, useActionState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation"; // 1. Impor useRouter
import { Product, updateProduct, deleteProduct } from "@/lib/actions/products";
import { Button } from "@/components/ui/Button";
import Tabs from "@/components/ui/Tabs";
import {
  EditIcon,
  DownloadIcon,
  DeleteIcon,
  SaveIcon,
  CloseIcon,
} from "@/components/icons";

type StockStats = {
  pendingStock: number;
  shippedStock: number;
};

const initialState: { success: boolean; message: string } = {
  success: false,
  message: "",
};

export default function ProductDetailView({
  product,
  stockStats,
}: {
  product: Product;
  stockStats: StockStats | null;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [newImagePreviewUrl, setNewImagePreviewUrl] = useState<string | null>(
    null
  );

  const [updateState, formAction, isPending] = useActionState(
    updateProduct,
    initialState
  );

  const [isDeleting, startDeleteTransition] = useTransition();

  useEffect(() => {
    if (updateState.message) {
      alert(updateState.message);
      if (updateState.success) {
        setIsEditing(false);
        router.refresh();
      }
    }
  }, [updateState, router]);

  const handleDownload = () => {
    const sanitize = (value: unknown): string => {
      let str = String(value ?? "");
      str = str.replace(/"/g, '""');
      return `"${str}"`;
    };

    const sanitizeNumberAsText = (value: unknown): string => {
      const str = String(value ?? "");
      return `="${str}"`;
    };

    const headers = [
      "Product Name",
      "Product Type",
      "Product Category",
      "Cost (Buy Price)",
      "Sell Price",
      "Current Stock",
      "Pending Stock",
      "Shipped Stock",
      "Supplier Name",
      "Supplier Contact",
      "Supplier Link",
    ];

    const data = [
      sanitize(product.product_name),
      sanitize(product.product_type),
      sanitize(product.product_category),
      sanitize(product.buy_price),
      sanitize(product.sell_price),
      sanitize(product.amount_stock),
      sanitize(stockStats?.pendingStock ?? 0),
      sanitize(stockStats?.shippedStock ?? 0),
      sanitize(product.supplier?.supplier_name),
      sanitizeNumberAsText(product.supplier?.contact_number),
      sanitize(product.supplier?.purchase_link),
    ];

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += headers.join(",") + "\n";
    csvContent += data.join(",");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${product.product_name}_details.csv`);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsEditing(true);
    setNewImagePreviewUrl(product.product_image || null);
    setNewImageFile(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setNewImageFile(null);
    setNewImagePreviewUrl(null);
  };

  const handleDelete = () => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    const productId = product.id;
    if (isNaN(productId)) {
      alert("Error: Invalid Product ID.");
      return;
    }

    startDeleteTransition(async () => {
      const result = await deleteProduct(productId);
      if (result.success) {
        alert(result.message);
        router.push("/inventory");
        router.refresh();
      } else {
        alert(result.message);
      }
    });
  };

  return (
    <form
      action={formAction}
      className="bg-white shadow-md p-4 rounded-md mr-3"
    >
      <input type="hidden" name="id" value={product.id} />

      <div className="flex flex-row justify-between items-center gap-3">
        <h1 className="text-lg sm:text-2xl font-bold ...">
          {product.product_name}
        </h1>

        <div className="flex flex-row gap-4 tracking-wide flex-shrink-0">
          {isEditing ? (
            <>
              <Button
                type="submit"
                variant="primary"
                disabled={isPending}
                className="flex items-center gap-3 text-xs sm:text-base"
              >
                <SaveIcon className="w-5 h-5" />
                <p className="hidden sm:block">
                  {isPending ? "Saving..." : "Save"}
                </p>
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={handleCancelEdit}
                disabled={isPending}
                className="flex items-center gap-3 text-xs sm:text-base"
              >
                <CloseIcon className="w-5 h-5" />
                <p className="hidden sm:block">Cancel</p>
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                variant="secondary"
                onClick={handleEdit}
                className="flex items-center gap-3 text-xs sm:text-base"
              >
                <EditIcon className="w-5 h-5" />
                <p className="hidden sm:block">Edit</p>
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={handleDownload}
                className="flex items-center gap-3 text-xs sm:text-base"
              >
                <DownloadIcon className="w-5 h-5" />
                <p className="hidden sm:block">Download</p>
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-3 text-xs sm:text-base text-red-500"
              >
                <DeleteIcon className="w-5 h-5" />
                <p className="hidden sm:block">
                  {isDeleting ? "..." : "Delete"}
                </p>
              </Button>
            </>
          )}
        </div>
      </div>

      <Tabs
        product={product}
        isEditing={isEditing}
        stockStats={stockStats}
        newImageFile={newImageFile}
        setNewImageFile={setNewImageFile}
        newImagePreviewUrl={newImagePreviewUrl}
        setNewImagePreviewUrl={setNewImagePreviewUrl}
      />
    </form>
  );
}
