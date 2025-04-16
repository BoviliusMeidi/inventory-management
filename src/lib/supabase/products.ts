"use server";

import { createClient } from "@/app/utils/supabase/server";
import { Supplier } from "./suppliers";

export interface Product {
  id: string;
  product_name: string;
  product_type: string;
  product_category: string;
  amount_stock: number;
  buy_price: number;
  sell_price: number;
  product_image: string;
  image_file?: File;
  user_id: string;
  supplier_id: number;
  supplier?: Supplier;
}

export type ProductInsert = Omit<Product, "id" | "product_image" | "user_id">;

const lowStock = 10;

export const uploadProductImage = async (
  file: File
): Promise<string | null> => {
  const supabase = await createClient();

  const fileName = `${Date.now()}_${file.name}`;
  const filePath = `products/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("images")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (uploadError) {
    console.error("Image upload failed:", uploadError.message);
    return null;
  }

  const { data } = supabase.storage.from("images").getPublicUrl(filePath);
  return data.publicUrl;
};

export const insertProduct = async (product: ProductInsert) => {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("User not authenticated");
  }

  let imageUrl = "";

  if (product.image_file) {
    const uploadedUrl = await uploadProductImage(product.image_file);
    if (!uploadedUrl) {
      throw new Error("Image upload failed");
    }
    imageUrl = uploadedUrl;
  }

  const { error } = await supabase.from("products").insert({
    product_name: product.product_name,
    product_type: product.product_type,
    product_category: product.product_category,
    amount_stock: product.amount_stock,
    buy_price: product.buy_price,
    sell_price: product.sell_price,
    product_image: imageUrl,
    user_id: user.id,
    supplier_id: product.supplier_id,
  });

  if (error) {
    console.error("Failed to insert product:", error.message);
    throw new Error("Failed to insert product");
  }
};

export async function getTotalProducts() {
  const supabase = await createClient();
  const { error, count } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("Error fetching total products: ", error.message);
    return null;
  } else {
    return { count };
  }
}

export async function getTotalCategoryProducts() {
  const supabase = await createClient();
  const { data: categories, error } = await supabase
    .from("products")
    .select("product_category");

  const uniqueCategories = Array.from(
    new Set(categories?.map((p) => p.product_category))
  );
  const totalCategories = uniqueCategories.length;

  if (error) {
    console.error("Error fetching total category products: ", error.message);
    return null;
  } else {
    return { totalCategories };
  }
}

export async function getTotalLowStockProducts() {
  const supabase = await createClient();
  const { count: lowStockCount, error: errorLow } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .gt("amount_stock", 0)
    .lt("amount_stock", lowStock);
  const { count: noStockCount, error: errorNo } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("amount_stock", 0);

  if (errorLow || errorNo) {
    console.error("Error fetching stock products: ", errorLow?.message);
    console.error("Error fetching stock products: ", errorNo?.message);
    return null;
  } else {
    return { lowStockCount, noStockCount };
  }
}

export const getProductById = async (id: string): Promise<Product | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      supplier:suppliers (
        id,
        supplier_name,
        contact_number,
        purchase_link
      )
    `
    )
    .match({ id: id })
    .single();

  if (error) {
    console.error("Error fetching product:", error.message);
    return null;
  }

  return data;
};

export async function getPaginatedProductsByUser(
  page: number,
  pageSize: number,
  filter: string | null
) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select(
      `
    *,
    supplier:suppliers (
      id,
      supplier_name
    )
  `,
      { count: "exact" }
    )
    .range(from, to)
    .order("amount_stock");

  if (filter === "In-Stock") {
    query = query.gt("amount_stock", 9);
  } else if (filter === "Low Stock") {
    query = query.gt("amount_stock", 0).lt("amount_stock", 10);
  } else if (filter === "Out of Stock") {
    query = query.eq("amount_stock", 0);
  }

  const { data, error, count } = await query;

  if (error) throw error;

  return { data, total: count ?? 0 };
}
