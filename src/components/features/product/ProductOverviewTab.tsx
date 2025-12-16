"use client";

import { useState, useActionState, useEffect, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { updateProduct, deleteProduct } from "@/lib/actions/products";
import { Product } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import InfoRow from "@/components/ui/InfoRow";
import LabeledInput from "@/components/ui/LabeledInput";
import ImageDropzone from "@/components/ui/ImageDropzone";
import { EditIcon, DeleteIcon, SaveIcon, CloseIcon } from "@/components/icons";
import {
  formatCurrency,
  formatDisplayPhoneNumber,
  formatPurchaseLink,
  formatToLocalPhone,
} from "@/lib/utils/formatters";
import { copyToClipboard } from "@/lib/utils/clipboard";

type StockStats = {
  pendingStock: number;
  shippedStock: number;
};

const initialState: { success: boolean; message: string } = {
  success: false,
  message: "",
};

export default function ProductOverviewTab({
  product,
  stockStats,
}: {
  product: Product;
  stockStats: StockStats | null;
}) {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [, setNewImageFile] = useState<File | null>(null);
  const [newImagePreviewUrl, setNewImagePreviewUrl] = useState<string | null>(
    null
  );
  const [isCopied, setIsCopied] = useState(false);

  const [updateState, formAction, isPending] = useActionState(
    updateProduct,
    initialState
  );
  const [isDeleting, startDeleteTransition] = useTransition();

  const pending = stockStats?.pendingStock ?? 0;
  const shipped = stockStats?.shippedStock ?? 0;

  useEffect(() => {
    if (updateState.message) {
      alert(updateState.message);
      if (updateState.success) {
        setIsEditing(false);
        setNewImageFile(null);
        setNewImagePreviewUrl(null);
        router.refresh();
      }
    }
  }, [updateState, router]);

  const handleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
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
    startDeleteTransition(async () => {
      const result = await deleteProduct(product.id);
      alert(result.message);
      if (result.success) {
        router.push("/inventory");
      }
    });
  };

  const handleFileChange = (file: File | null) => {
    if (file) {
      setNewImageFile(file);
      setNewImagePreviewUrl(URL.createObjectURL(file));
    } else {
      setNewImageFile(null);
      setNewImagePreviewUrl(product.product_image);
    }
  };

  const handleCopyPhone = async () => {
    if (!product.supplier?.contact_number) return;
    const localPhone = formatToLocalPhone(product.supplier.contact_number);
    if (await copyToClipboard(localPhone)) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const Container = isEditing ? "form" : "div";

  return (
    <Container
      action={isEditing ? formAction : undefined}
      className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
    >
      {isEditing && <input type="hidden" name="id" value={product.id} />}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b pb-4 gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Product Overview</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage details and stock information for{" "}
            <span className="font-semibold text-gray-900">
              {product.product_name}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button
                type="submit"
                variant="primary"
                disabled={isPending}
                className="flex items-center gap-2"
              >
                <SaveIcon className="w-4 h-4" /> Save
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={handleCancelEdit}
                disabled={isPending}
                className="flex items-center gap-2"
              >
                <CloseIcon className="w-4 h-4" /> Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                variant="secondary"
                onClick={handleEdit}
                className="flex items-center gap-2"
              >
                <EditIcon className="w-4 h-4" /> Edit
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-2 text-red-600 hover:bg-red-50 hover:border-red-200"
              >
                <DeleteIcon className="w-4 h-4" /> Delete
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-2/3 flex flex-col gap-6">
          <div>
            <h3 className="font-bold text-gray-900 mb-4">
              Product Information
            </h3>
            <div className="flex flex-col gap-3">
              {isEditing ? (
                <>
                  <LabeledInput
                    id="product_name"
                    label="Product Name"
                    name="product_name"
                    defaultValue={product.product_name}
                  />
                  <LabeledInput
                    id="product_type"
                    label="Type"
                    name="product_type"
                    defaultValue={product.product_type}
                  />
                  <LabeledInput
                    id="product_category"
                    label="Category"
                    name="product_category"
                    defaultValue={product.product_category}
                  />
                  <LabeledInput
                    id="buy_price"
                    label="Buy Price"
                    name="buy_price"
                    type="number"
                    defaultValue={product.buy_price}
                  />
                  <LabeledInput
                    id="sell_price"
                    label="Sell Price"
                    name="sell_price"
                    type="number"
                    defaultValue={product.sell_price}
                  />
                </>
              ) : (
                <>
                  <InfoRow label="Product Name" value={product.product_name} />
                  <InfoRow label="Type" value={product.product_type} />
                  <InfoRow label="Category" value={product.product_category} />
                  <InfoRow
                    label="Buy Price"
                    value={formatCurrency(product.buy_price)}
                  />
                  <InfoRow
                    label="Sell Price"
                    value={formatCurrency(product.sell_price)}
                  />
                </>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-4">
              Supplier Information
            </h3>
            <div className="flex flex-col gap-3">
              <InfoRow label="Name" value={product.supplier?.supplier_name} />
              <InfoRow
                label="Contact"
                value={
                  <span
                    className="cursor-pointer hover:text-blue-600"
                    onClick={handleCopyPhone}
                  >
                    {isCopied
                      ? "Copied!"
                      : formatDisplayPhoneNumber(
                          product.supplier?.contact_number ?? null
                        )}
                  </span>
                }
              />
              <InfoRow
                label="Link"
                value={
                  <Link
                    href={formatPurchaseLink(
                      product.supplier?.purchase_link ?? null
                    )}
                    target="_blank"
                    className="text-blue-600 hover:underline"
                  >
                    {product.supplier?.purchase_link}
                  </Link>
                }
              />
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/3 flex flex-col gap-6">
          <div>
            {isEditing ? (
              <ImageDropzone
                name="image_file"
                previewUrl={
                  newImagePreviewUrl || product.product_image || "/product.svg"
                }
                onChange={handleFileChange}
              />
            ) : (
              <div className="border rounded-lg p-4 flex justify-center bg-gray-50">
                <Image
                  src={
                    product.product_image && product.product_image.trim() !== ""
                      ? product.product_image
                      : "/product.svg"
                  }
                  width={200}
                  height={200}
                  alt={product.product_name}
                  className="object-contain h-48 w-full"
                />
              </div>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-sm text-gray-900 mb-3 uppercase">
              Inventory Status
            </h4>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Current Stock</span>
                <span className="font-medium">{product.amount_stock}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pending</span>
                <span className="font-medium text-orange-600">+{pending}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipped</span>
                <span className="font-medium text-blue-600">+{shipped}</span>
              </div>
              <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                <span>Projected</span>
                <span>{product.amount_stock + pending + shipped}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
