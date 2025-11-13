import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProductById, Product } from "@/lib/actions/products";

// Info Row Component
const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value?: string | number;
}) => (
  <div className="flex flex-row justify-between items-center tracking-wide font-semibold">
    <h3 className="text-gray-500">{label}</h3>
    <p className="text-gray-800">{value}</p>
  </div>
);

const Tabs = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetch = async () => {
      if (typeof id === "string") {
        const data = await getProductById(id);
        setProduct(data);
      }
    };

    fetch();
  }, [id]);

  return (
    <div>
      {/* Tab Headers */}
      <div className="flex flex-row gap-8 mt-3 border-b border-gray-300">
        {["overview", "purchases", "history"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`cursor-pointer pb-2 text-lg tracking-wide capitalize ${
              activeTab === tab
                ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
                : "text-gray-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === "overview" && (
          <div className="p-4 flex flex-row justify-between">
            {/* Left Section */}
            <div className="w-1/3 flex flex-col gap-4">
              <div>
                <h2 className="font-bold tracking-wide text-lg pb-3">
                  Product Details
                </h2>
                <div className="flex flex-col gap-3">
                  <InfoRow label="Product Name" value={product?.product_name} />
                  <InfoRow label="Product Type" value={product?.product_type} />
                  <InfoRow
                    label="Product Category"
                    value={product?.product_category}
                  />
                  <InfoRow label="Price Buy" value={product?.buy_price} />
                  <InfoRow label="Price Sell" value={product?.sell_price} />
                </div>
              </div>
              <div>
                <h2 className="font-bold tracking-wide text-lg py-3">
                  Supplier Details
                </h2>
                <div className="flex flex-col gap-3">
                  <InfoRow
                    label="Supplier Name"
                    value={product?.supplier?.supplier_name}
                  />
                  <InfoRow
                    label="Contact Number"
                    value={product?.supplier?.contact_number}
                  />
                  <InfoRow
                    label="Link Supplier"
                    value={product?.supplier?.purchase_link}
                  />
                </div>
              </div>
            </div>
            {/* Right Section */}
            <div className="w-1/4">
              <div className="flex flex-col gap-3">
                <div
                  className="border-2 border-dashed rounded-lg p-4 mx-auto mb-6
                            flex flex-col items-center justify-center cursor-pointer transition-all"
                >
                  <Image
                    src={
                      product?.product_image &&
                      product.product_image.trim() !== ""
                        ? product.product_image
                        : "/product.svg"
                    }
                    width={100}
                    height={100}
                    alt="Product Image"
                  />
                </div>
                <InfoRow label="Opening Stock" value="40" />
                <InfoRow label="Remaining Stock" value="40" />
                <InfoRow label="On the way" value="40" />
              </div>
            </div>
          </div>
        )}

        {/* Other Tabs */}
        {activeTab === "purchases" && (
          <div className="tab-content">Purchases Content</div>
        )}
        {activeTab === "history" && (
          <div className="tab-content">History Content</div>
        )}
      </div>
    </div>
  );
};

export default Tabs;
