// -----------------------------------------------------------------------------------------------------------------------------
// COMMON
// -----------------------------------------------------------------------------------------------------------------------------

/**
 * Represents the outcome of a form submission or server action.
 */
export type FormState = {
  /** Indicates whether the form submission was successful. */
  success: boolean;
  /** A feedback message to be displayed to the user. */
  message: string;
};

// -----------------------------------------------------------------------------------------------------------------------------
// USERS
// -----------------------------------------------------------------------------------------------------------------------------

/**
 * Represents a registered user in the system.
 */
export interface User {
  /** The unique identifier for the user (UUID). */
  id: string;
  /** The user's email address. */
  email: string;
  /** The user's full display name. */
  name: string;
  /** The public URL of the user's profile picture. */
  profile_picture: string | null;
  /** Timestamp when the user was created (ISO string). */
  created_at?: string;
  /** Timestamp when the user was last updated (ISO string). */
  updated_at?: string;
}

// -----------------------------------------------------------------------------------------------------------------------------
// SUPPLIERS
// -----------------------------------------------------------------------------------------------------------------------------

/**
 * Represents a full supplier record in the system.
 */
export interface Supplier {
  /** The unique identifier for the supplier (UUID). */
  id: string;
  /** The business name of the supplier. */
  supplier_name: string;
  /** The physical address of the supplier. */
  address: string;
  /** The primary contact number for the supplier. */
  contact_number: number;
  /** A link used for making purchases (e.g., website URL). */
  purchase_link: string;
  /** The ID of the user who created/owns this supplier record. */
  user_id: string;
}

/**
 * A minimal representation of a supplier, typically used in dropdowns or selection lists.
 */
export type SupplierOption = {
  /** The unique identifier for the supplier. */
  id: string;
  /** The name of the supplier. */
  supplier_name: string;
  /** The primary contact number. */
  contact_number: number;
};

// -----------------------------------------------------------------------------------------------------------------------------
// PRODUCTS
// -----------------------------------------------------------------------------------------------------------------------------

/**
 * Represents a product available in the inventory.
 */
export interface Product {
  /** The unique identifier for the product. */
  id: number;
  /** The name of the product. */
  product_name: string;
  /** The type or variation of the product (e.g., size, model). */
  product_type: string;
  /** The category the product belongs to. */
  product_category: string;
  /** The current quantity of the product in stock. */
  amount_stock: number;
  /** The cost price (COGS - how much the item was bought for). */
  buy_price: number;
  /** The selling price (how much the item is sold for). */
  sell_price: number;
  /** URL or path to the stored product image. */
  product_image: string;
  /** Optional file object for a new product image (used during creation/update). */
  image_file?: File;
  /** The ID of the user who created/owns this product record. */
  user_id: string;
  /** The ID of the primary supplier for this product. */
  supplier_id: number;
  /** Optional full supplier object, often included via relation fetching. */
  supplier?: Supplier;
}

/**
 * A subset of product details, typically for display tables or selection inputs.
 */
export type ProductOption = {
  /** The unique identifier for the product. */
  id: string;
  /** The name of the product. */
  product_name: string;
  /** The type or variation of the product. */
  product_type: string;
  /** The cost price of the product. */
  buy_price: number;
  /** The selling price of the product. */
  sell_price: number;
  /** The current quantity in stock. */
  amount_stock: number;
  /** The ID of the primary supplier. */
  supplier_id: number;
};

// -----------------------------------------------------------------------------------------------------------------------------
// ORDERS
// -----------------------------------------------------------------------------------------------------------------------------

/**
 * Represents a purchase order made to a supplier (Pembelian).
 */
export interface Order {
  /** The unique identifier for the order. */
  id: number;
  /** The unique transaction code for the order. */
  po_code: string;
  /** The current status of the order (e.g., 'Pending', 'Shipped', 'Completed'). */
  status: string;
  /** The total monetary cost of the entire order. */
  total_cost: number;
  /** The ISO date string when the delivery is expected. */
  expected_delivery_date: string;
  /** A minimal supplier object containing only the name, or null. */
  supplier: { supplier_name: string } | null;
  /** The list of products included in the order. */
  items: {
    quantity: number;
    cost_per_item: number;
    product: {
      product_name: string;
      product_type: string;
      product_category: string;
    } | null;
  }[];
}
