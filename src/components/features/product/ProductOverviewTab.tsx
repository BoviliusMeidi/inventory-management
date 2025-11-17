"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/actions/products";
import InfoRow from "@/components/ui/InfoRow";
import LabeledInput from "@/components/ui/LabeledInput";
import ImageDropzone from "@/components/ui/ImageDropzone";
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

interface ProductOverviewTabProps {
  product: Product;
  isEditing: boolean;
  stockStats: StockStats | null;
  newImageFile: File | null;
  setNewImageFile: (file: File | null) => void;
  newImagePreviewUrl: string | null;
  setNewImagePreviewUrl: (url: string | null) => void;
}

export default function ProductOverviewTab({
  product,
  isEditing,
  stockStats,
  setNewImageFile,
  newImagePreviewUrl,
  setNewImagePreviewUrl,
}: ProductOverviewTabProps) {
  const [isCopied, setIsCopied] = useState(false);
  const pending = stockStats?.pendingStock ?? 0;
  const shipped = stockStats?.shippedStock ?? 0;

  const handleCopyPhone = async () => {
    if (!product.supplier?.contact_number) return;
    const localPhone = formatToLocalPhone(product.supplier.contact_number);
    const success = await copyToClipboard(localPhone);

    if (success) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } else {
      alert("Failed to copy phone number.");
    }
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

  return (
    <div className="p-4 flex flex-col md:flex-row justify-between gap-8">
      <div className="w-full md:w-2/3 flex flex-col gap-4">
        <div>
          <h2 className="font-bold tracking-wide text-base sm:text-lg pb-3">
            Product Details
          </h2>
          <div className="text-sm sm:text-base flex flex-col gap-3">
            {isEditing ? (
              <LabeledInput
                label="Product Name"
                id="product_name"
                name="product_name"
                defaultValue={product.product_name}
              />
            ) : (
              <InfoRow label="Product Name" value={product.product_name} />
            )}

            {isEditing ? (
              <LabeledInput
                label="Product Type"
                id="product_type"
                name="product_type"
                defaultValue={product.product_type}
              />
            ) : (
              <InfoRow label="Product Type" value={product.product_type} />
            )}

            {isEditing ? (
              <LabeledInput
                label="Product Category"
                id="product_category"
                name="product_category"
                defaultValue={product.product_category}
              />
            ) : (
              <InfoRow
                label="Product Category"
                value={product.product_category}
              />
            )}

            {isEditing ? (
              <LabeledInput
                label="Price Buy"
                id="buy_price"
                name="buy_price"
                type="number"
                defaultValue={product.buy_price}
              />
            ) : (
              <InfoRow
                label="Price Buy"
                value={formatCurrency(product.buy_price)}
              />
            )}

            {isEditing ? (
              <LabeledInput
                label="Price Sell"
                id="sell_price"
                name="sell_price"
                type="number"
                defaultValue={product.sell_price}
              />
            ) : (
              <InfoRow
                label="Price Sell"
                value={formatCurrency(product.sell_price)}
              />
            )}
          </div>
        </div>
        <div>
          <h2 className="font-bold tracking-wide text-base sm:text-lg py-3">
            Supplier Details
          </h2>
          <div className="text-sm sm:text-base flex flex-col gap-3">
            <InfoRow
              label="Supplier Name"
              value={product.supplier?.supplier_name}
            />
            <InfoRow
              label="Contact Number"
              value={
                <span className="cursor-pointer" onClick={handleCopyPhone}>
                  {isCopied ? (
                    <span className="text-green-600 font-semibold">
                      Copied!
                    </span>
                  ) : (
                    formatDisplayPhoneNumber(
                      product.supplier?.contact_number ?? null
                    )
                  )}
                </span>
              }
            />
            <InfoRow
              label="Link Supplier"
              value={
                <Link
                  href={formatPurchaseLink(
                    product.supplier?.purchase_link ?? null
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {product.supplier?.purchase_link}
                </Link>
              }
            />
          </div>
        </div>
      </div>
      <div className="w-full md:w-1/3">
        <div className="text-sm sm:text-base flex flex-col gap-3">
          {isEditing ? (
            <ImageDropzone
              name="image_file"
              previewUrl={
                newImagePreviewUrl || product.product_image || "/product.svg"
              }
              onChange={handleFileChange}
            />
          ) : (
            <div className="border-2 border-dashed rounded-lg p-4 mx-auto mb-6 flex items-center justify-center">
              <Image
                src={
                  product.product_image && product.product_image.trim() !== ""
                    ? product.product_image
                    : "/product.svg"
                }
                width={150}
                height={150}
                alt={product.product_name}
                className="object-cover"
              />
            </div>
          )}
          <InfoRow label="Current Stock" value={product.amount_stock} />
          <InfoRow label="Pending" value={pending} />
          <InfoRow label="Shipped" value={shipped} />
          <InfoRow label="Total Incoming" value={pending + shipped} />
          <InfoRow
            label="Available (After)"
            value={product.amount_stock + pending + shipped}
          />
        </div>
      </div>
    </div>
  );
}
