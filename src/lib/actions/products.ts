"use server";

import { createClientServer } from "@/lib/supabase/server";
import { Product, FormState } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { LOW_STOCK_THRESHOLD } from "@/lib/constants";

export async function uploadProductImage(file: File): Promise<string | null> {
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
}

export async function insertProduct(
  previousState: FormState,
  formData: FormData
): Promise<FormState> {
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
}

export async function updateProduct(
  previousState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const supabase = await createClientServer();

  const id = Number(formData.get("id"));
  if (isNaN(id)) return { success: false, message: "Invalid Product ID." };

  const { data: oldProduct, error: fetchError } = await supabase
    .from("products")
    .select("product_image")
    .eq("id", id)
    .single();

  if (fetchError) {
    return { success: false, message: "Product not found." };
  }

  const product_name = formData.get("product_name") as string;
  const product_type = formData.get("product_type") as string;
  const product_category = formData.get("product_category") as string;
  const buy_price = parseFloat(formData.get("buy_price") as string);
  const sell_price = parseFloat(formData.get("sell_price") as string);
  const imageFile = formData.get("image_file") as File | null;

  let imageUrl = "";
  if (imageFile && imageFile instanceof File && imageFile.size > 0) {
    const uploadedUrl = await uploadProductImage(imageFile);
    if (!uploadedUrl) {
      return { success: false, message: "Image upload failed." };
    }
    imageUrl = uploadedUrl;
  } else {
    imageUrl = oldProduct.product_image;
  }

  if (!product_name || !product_type || !product_category) {
    return { success: false, message: "Please fill all required fields." };
  }

  const { error } = await supabase
    .from("products")
    .update({
      product_name,
      product_type,
      product_category,
      buy_price,
      sell_price,
      product_image: imageUrl,
    })
    .eq("id", id);

  if (error) {
    console.error("Update Product Error:", error.message);
    return { success: false, message: `Update failed: ${error.message}` };
  }

  if (oldProduct.product_image) {
    await deleteProductImage(oldProduct.product_image);
  }

  revalidatePath(`/product/${id}`);
  revalidatePath("/inventory");
  return { success: true, message: "Product updated successfully." };
}

export async function deleteProductImage(imageUrl: string): Promise<boolean> {
  const supabase = await createClientServer();
  const BUCKET_NAME = "images";

  if (!imageUrl || imageUrl.endsWith("/product.svg")) {
    return true;
  }

  try {
    const path = imageUrl.split(`/${BUCKET_NAME}/`)[1];

    if (!path) {
      console.error("Invalid image URL path for deletion:", imageUrl);
      return false;
    }
    const { error } = await supabase.storage.from(BUCKET_NAME).remove([path]);

    if (error) {
      console.error("Error deleting product image:", error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.error("Error parsing image URL:", e);
    return false;
  }
}

export async function deleteProduct(productId: number): Promise<FormState> {
  const supabase = await createClientServer();

  const { data: product, error: fetchError } = await supabase
    .from("products")
    .select("product_image")
    .eq("id", productId)
    .single();

  if (fetchError || !product) {
    return { success: false, message: "Could not find the product." };
  }

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (error) {
    console.error("Delete Product Error:", error.message);
    return { success: false, message: `Delete failed: ${error.message}` };
  }

  if (product.product_image) {
    await deleteProductImage(product.product_image);
  }

  revalidatePath("/inventory");
  return { success: true, message: "Product deleted." };
}

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
    .lt("amount_stock", LOW_STOCK_THRESHOLD);
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

export async function getProductById(id: string): Promise<Product | null> {
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

  if (!data) {
    return redirect("/inventory");
  }

  if (error) {
    console.error("Error fetching product:", error.message);
    return null;
  }

  return data;
}

export async function getProductStockStats(productId: number) {
  const supabase = await createClientServer();

  const { data, error } = await supabase
    .from("order_items")
    .select(
      `
      quantity,
      order_data:orders ( status )
    `
    )
    .eq("product_id", productId);

  if (error) {
    console.error("Error fetching product stock stats:", error.message);
    return { pendingStock: 0, shippedStock: 0 };
  }

  let pendingStock = 0;
  let shippedStock = 0;

  data.forEach((item) => {
    const order = item.order_data as unknown as { status: string } | null;
    const status = order?.status;
    if (status === "Pending") {
      pendingStock += item.quantity;
    } else if (status === "Shipped") {
      shippedStock += item.quantity;
    }
  });

  return { pendingStock, shippedStock };
}

export async function getPaginatedProductsByUser(
  page: number,
  pageSize: number,
  filter: string | null,
  searchQuery?: string
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

  if (searchQuery) {
    query = query.ilike("product_name", `%${searchQuery}%`);
  }

  const { data, error, count } = await query;

  if (error) throw error;

  return { data, total: count ?? 0 };
}

export async function getAllProductsForSelect() {
  const supabase = await createClientServer();

  const { data, error } = await supabase
    .from("products")
    .select(
      "id, product_name, product_type, buy_price, sell_price, amount_stock, supplier_id"
    )
    .order("product_name");

  if (error) {
    console.error("Error fetching all products:", error.message);
    return [];
  }

  return data;
}
