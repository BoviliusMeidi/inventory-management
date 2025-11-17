import { getProductById, getProductStockStats } from "@/lib/actions/products";
import ProductDetailView from "@/components/features/product/ProductDetailView";
import { redirect } from "next/navigation";

interface ProductPageProps {
  params: { id: string };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  const product = await getProductById(resolvedParams.id);

  if (!product) {
    return redirect("/inventory");
  }

  const stockStats = await getProductStockStats(product.id as number);

  return <ProductDetailView product={product} stockStats={stockStats} />;
}
