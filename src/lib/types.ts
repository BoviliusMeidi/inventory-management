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

/**
 * Represents a single product item within a purchase order.
 */
export type OrderItem = {
  /** The ID of the product being ordered. */
  product_id: string;
  /** The name of the product. */
  product_name: string;
  /** The number of units of the product ordered. */
  quantity: number;
  /** The unit cost price at the time of the order. */
  cost_per_item: number;
};

/**
 * Statistical data related to purchase orders.
 */
export type OrderStatsData = {
  /** The number of orders currently with 'Pending' status. */
  pending_count: number;
  /** The number of orders currently with 'Shipped' status. */
  shipped_count: number;
  /** The total monetary value of all 'Pending' orders. */
  pending_value: number;
  /** The number of orders completed in the last 30 days. */
  completed_30d_count: number;
};

/**
 * Represents the form state for a single item when creating/editing an order.
 * @remarks Values are strings to handle HTML input elements.
 */
export type OrderItemState = {
  product_id: string;
  product_name: string;
  product_type: string;
  quantity: string;
  cost_per_item: string;
};

// -----------------------------------------------------------------------------------------------------------------------------
// SALES
// -----------------------------------------------------------------------------------------------------------------------------

/**
 * Represents a sales transaction to a customer (Penjualan).
 */
export interface Sale {
  /** The unique identifier for the sale. */
  id: number;
  /** The unique invoice or transaction code for the sale. */
  invoice_code: string;
  /** The total amount the customer paid for the sale. */
  total_amount: number;
  /** The calculated total profit generated from this sale. */
  total_profit: number;
  /** The method used for payment (e.g., 'Cash', 'Card', 'Transfer'). */
  payment_method: string;
  /** The status of the payment (e.g., 'Paid', 'Pending'). */
  payment_status: string;
  /** The ISO date string when the sale was finalized. */
  sale_date: string;
  /** A minimal customer object containing only the name, or null. */
  customer: { name: string } | null;
  /** The list of products included in the sale. */
  items: {
    quantity: number;
    price_at_sale: number;
    product: {
      product_name: string;
      product_type: string;
      product_category: string;
    } | null;
  }[];
}

/**
 * Represents a single product item within a sales transaction.
 */
export type SaleItem = {
  /** The ID of the product being sold. */
  product_id: string;
  /** The name of the product. */
  product_name: string;
  /** The number of units of the product sold. */
  quantity: number;
  /** The unit selling price at the time of the sale. */
  sell_price: number;
};

/**
 * Statistical data related to sales performance.
 */
export type SalesStatsData = {
  /** The cumulative total revenue (all sales). */
  total_revenue: number;
  /** The cumulative total profit (all sales). */
  total_profit: number;
  /** The total number of completed sales transactions. */
  total_transactions: number;
  /** The total revenue generated specifically today. */
  today_revenue: number;
};

/**
 * Represents the form state for a single item when creating/editing a sale.
 * @remarks Values are strings to handle HTML input elements.
 */
export type SaleItemState = {
  product_id: string;
  quantity: string;
};

// -----------------------------------------------------------------------------------------------------------------------------
// CUSTOMERS
// -----------------------------------------------------------------------------------------------------------------------------

/**
 * Represents a customer record in the system.
 */
export interface Customer {
  /** The unique identifier for the customer. */
  id: string;
  /** The full name of the customer. */
  name: string;
  /** The physical address of the customer. */
  address: string;
  /** The primary contact number for the customer. */
  contact_number: string;
}

/**
 * A minimal representation of a customer, typically used in dropdowns or selection lists.
 */
export type CustomerOption = {
  /** The unique identifier for the customer. */
  id: string;
  /** The full name of the customer. */
  name: string;
  /** The primary contact number for the customer. */
  contact_number: number;
};

// -----------------------------------------------------------------------------------------------------------------------------
// FINANCIAL & REPORTING
// -----------------------------------------------------------------------------------------------------------------------------

/**
 * Summary of financial performance metrics.
 * Used for displaying high-level financial cards or report headers.
 */
export interface FinancialSummary {
  /** Total gross income from sales. */
  totalRevenue: number;
  /** Total expenses or Cost of Goods Sold (COGS). */
  totalCost: number;
  /** Net profit calculated as (Revenue - Cost). */
  grossProfit: number;
  /** Profit margin percentage (0-100). */
  marginPercent: number;
  /**
   * Total number of transactions in the selected period.
   * @remarks Optional because not all summary cards require this metric.
   */
  totalTransactions?: number;
}

/**
 * Represents a single data point for financial visualization charts (Line/Bar).
 */
export interface ProfitChartData {
  /** The date label for the X-axis (e.g., "2023-12-01"). */
  date: string;
  /** Revenue amount for this specific date/period. */
  revenue: number;
  /** Profit amount for this specific date/period. */
  profit: number;
}

/**
 * Performance metrics broken down by product category.
 */
export interface CategoryData {
  /** The name of the product category. */
  category: string;
  /** Total sales volume or revenue for this category. */
  sales: number;
  /** Total profit generated by this category. */
  profit: number;
}

/**
 * The main payload structure for the Financial Report API response.
 */
export interface ReportData {
  /** High-level financial summary. */
  summary: FinancialSummary;
  /** Array of data points for the main financial chart. */
  chartData: ProfitChartData[];
  /** Array of performance metrics per category. */
  categoryPerformance: CategoryData[];
}

// ---------------------------------------------------------------------------------------------------------------------------------------------------
// DASHBOARD TYPES
// ---------------------------------------------------------------------------------------------------------------------------------------------------

/**
 * High-level sales metrics for the dashboard summary card.
 */
export type SalesStats = {
  /** Total revenue from sales. */
  revenue: number;
  /** Total profit generated. */
  profit: number;
  /** Total cost incurred. */
  cost: number;
  /** Total number of individual items sold. */
  quantitySold: number;
};

/**
 * Snapshot of the current inventory status.
 */
export type InventoryStats = {
  /** Total quantity of items currently physically in stock. */
  quantityInHand: number;
  /** Total quantity of items ordered from suppliers but not yet received. */
  toBeReceived: number;
};

/**
 * Summary of procurement and supply chain activities.
 */
export type PurchaseStats = {
  /** Total monetary value of purchases. */
  cost: number;
  /** Total number of purchase transactions/orders. */
  purchase: number;
  /** Number of orders that have been shipped by suppliers. */
  shipped: number;
  /** Number of orders currently pending processing. */
  pending: number;
};

/**
 * General statistics regarding product diversity.
 */
export type ProductStats = {
  /** Total number of active suppliers. */
  suppliers: number;
  /** Total number of distinct product categories. */
  categories: number;
};

// -----------------------------------------------------------------------------------------------------------------------------
// Lists of Product
// -----------------------------------------------------------------------------------------------------------------------------

/**
 * Represents a product in the "Best Selling" dashboard widget.
 */
export type TopProduct = {
  /** The unique identifier for the product. */
  id: string;
  /** The name of the product. */
  name: string;
  /** Total number of units sold. */
  soldQuantity: number;
  /** Current remaining stock level. */
  remainingStock: number;
  /** The selling price per unit. */
  price: number;
};

/**
 * Represents a product in the "Low Stock Alert" dashboard widget.
 */
export type LowStockProduct = {
  /** The unique identifier for the product. */
  id: string;
  /** The name of the product. */
  name: string;
  /** Current critical stock level. */
  remainingStock: number;
  /** URL to the product thumbnail image. */
  image: string;
};

// -----------------------------------------------------------------------------------------------------------------------------
// Charts
// -----------------------------------------------------------------------------------------------------------------------------

/**
 * Combined dataset for the main Dashboard visualization graph.
 * Compares Sales, Purchases, and Order statuses over time.
 */
export type ChartData = {
  /** The time period label (e.g., "Mon", "Week 1"). */
  name: string;
  /** Value representing sales performance. */
  sales: number;
  /** Value representing purchase/procurement costs. */
  purchase: number;
  /** Count or value of orders placed. */
  ordered: number;
  /** Count or value of orders successfully delivered. */
  delivered: number;
};

// -----------------------------------------------------------------------------------------------------------------------------
// Dashboard Database Responses
// -----------------------------------------------------------------------------------------------------------------------------

/**
 * Raw database response format for calculating summary statistics.
 * Typically returned from Supabase RPC calls or aggregate queries.
 */
export type DashboardCardStats = {
  total_revenue: number;
  total_profit: number;
  total_cost: number;
  total_qty_sold: number;
};

// -----------------------------------------------------------------------------------------------------------------------------
// Main Dashboard Data
// -----------------------------------------------------------------------------------------------------------------------------

/**
 * The main container interface for the entire Dashboard page's data.
 * Used as the return type for the main data fetching function.
 */
export type DashboardData = {
  /** Sales summary statistics. */
  sales: SalesStats;
  /** Inventory status summary. */
  inventory: InventoryStats;
  /** Purchase/Procurement summary. */
  purchase: PurchaseStats;
  /** Product catalog statistics. */
  products: ProductStats;
  /** List of top-performing products. */
  bestSelling: TopProduct[];
  /** List of products requiring restocking. */
  lowStock: LowStockProduct[];
  /** Data points for the main dashboard chart. */
  charts: ChartData[];
};

// -----------------------------------------------------------------------------------------------------------------------------
// Stock
// -----------------------------------------------------------------------------------------------------------------------------

/**
 * Represents a critical stock alert for a specific product,
 * typically used for notification dropdowns when inventory is low.
 */
export interface StockAlert {
  /** The unique identifier of the product. */
  id: string;
  /** The display name of the product. */
  product_name: string;
  /** The current remaining quantity in stock. */
  amount_stock: number;
  /** The public URL of the product image (if available). */
  product_image: string | null;
}

/**
 * Summarized statistics regarding the incoming inventory for a specific product.
 * Used to track stock that has been ordered (purchase orders) but not yet fully received into the main inventory.
 */
export type StockStats = {
  /** The total quantity of units currently in 'Pending' status (ordered but not yet processed/shipped). */
  pendingStock: number;
  /** The total quantity of units currently in 'Shipped' status (in transit to the warehouse). */
  shippedStock: number;
};
