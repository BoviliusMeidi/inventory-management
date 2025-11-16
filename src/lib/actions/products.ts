"use server";

import { createClientServer } from "@/lib/supabase/server";
import { Supplier } from "@/lib/actions/suppliers";
import { revalidatePath } from "next/cache";

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

type FormState = {
  success: boolean;
  message: string;
};

const lowStock = 10;

export const uploadProductImage = async (
  file: File
): Promise<string | null> => {
  const supabase = await createClientServer();

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

export const insertProduct = async (
  previousState: FormState,
  formData: FormData
): Promise<FormState> => {
  const supabase = await createClientServer();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, message: "User not authenticated." };
  }

  const name = formData.get("product_name") as string;
  const type = formData.get("product_type") as string;
  const category = formData.get("product_category") as string;
  const amountStockStr = formData.get("amount_stock") as string;
  const priceBuyStr = formData.get("buy_price") as string;
  const priceSellStr = formData.get("sell_price") as string;
  const supplierIDStr = formData.get("supplier_id") as string;
  const imageFile = formData.get("image_file") as File;

  if (
    !name ||
    !type ||
    !category ||
    !amountStockStr ||
    !priceBuyStr ||
    !priceSellStr ||
    !supplierIDStr
  ) {
    return { success: false, message: "All fields are required." };
  }

  const amount_stock = parseFloat(amountStockStr);
  const buy_price = parseFloat(priceBuyStr);
  const sell_price = parseFloat(priceSellStr);
  const supplier_id = parseInt(supplierIDStr, 10);

  if (
    isNaN(amount_stock) ||
    isNaN(buy_price) ||
    isNaN(sell_price) ||
    isNaN(supplier_id)
  ) {
    return { success: false, message: "Invalid number format." };
  }

  let imageUrl = "";
  if (imageFile && imageFile.size > 0) {
    const uploadedUrl = await uploadProductImage(imageFile);
    if (!uploadedUrl) {
      return { success: false, message: "Image upload failed." };
    }
    imageUrl = uploadedUrl;
  }

  const { error } = await supabase.from("products").insert({
    product_name: name,
    product_type: type,
    product_category: category,
    amount_stock: amount_stock,
    buy_price: buy_price,
    sell_price: sell_price,
    product_image: imageUrl,
    user_id: user.id,
    supplier_id: supplier_id,
  });

  if (error) {
    console.error("Failed to insert product:", error.message);
    return { success: false, message: "Failed to insert product." };
  }

  revalidatePath("/inventory");
  return { success: true, message: "Product added successfully!" };
};

export async function getTotalProducts() {
  const supabase = await createClientServer();
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
  const supabase = await createClientServer();
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
  const supabase = await createClientServer();
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

export async function getTotalInventoryValue() {
  const supabase = await createClientServer();
  const { data, error } = await supabase
    .from("products")
    .select("buy_price, amount_stock");

  if (error) {
    console.error("Error fetching inventory value data: ", error.message);
    return null;
  }

  const totalValue = data.reduce((acc, product) => {
    const buyPrice = product.buy_price || 0;
    const stock = product.amount_stock || 0;
    return acc + buyPrice * stock;
  }, 0);

  return { totalValue };
}

export const getProductById = async (id: string): Promise<Product | null> => {
  const numericId = parseInt(id, 10);

  if (isNaN(numericId)) {
    console.error("Invalid product ID:", id);
    return null;
  }

  const supabase = await createClientServer();
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
    .match({ id: numericId })
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
  const supabase = await createClientServer();

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

export async function getAllProductsForSelect() {
  const supabase = await createClientServer();

  const { data, error } = await supabase
    .from("products")
    .select("id, product_name, product_type, buy_price, supplier_id")
    .order("product_name");

  if (error) {
    console.error("Error fetching all products:", error.message);
    return [];
  }

  return data;
}
