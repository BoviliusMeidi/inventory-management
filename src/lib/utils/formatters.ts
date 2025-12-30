/**
 * Formats a number or string into Indonesian Rupiah currency format.
 * Returns "Rp 0" if the input is invalid or NaN.
 *
 * @param amount - The value to format (number or string).
 * @returns The formatted currency string (e.g., "Rp 150.000").
 *
 * @example
 * formatCurrency(150000); // "Rp 150.000"
 */
export function formatCurrency(amount: number | string): string {
  const numericAmount =
    typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(numericAmount)) {
    return "Rp 0";
  }

  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return formatter.format(numericAmount);
}

/**
 * Formats a large number into a compact Indonesian Rupiah string.
 * Useful for dashboards or charts where space is limited.
 *
 * @param amount - The value to format.
 * @returns The compact currency string (e.g., "Rp 1,5 jt" or similar depending on locale implementation).
 */
export function formatCurrencyShort(amount: number | string): string {
  const numericAmount =
    typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(numericAmount)) {
    return "Rp 0";
  }

  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    notation: "compact",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return formatter.format(numericAmount);
}

/**
 * Sanitizes a phone number string for database storage.
 * Removes symbols and standardizes the prefix to '62' (Indonesia).
 *
 * @param phone - The raw phone number string.
 * @returns The sanitized number string (only digits).
 *
 * @example
 * sanitizePhoneNumber("0812-3456"); // "628123456"
 * sanitizePhoneNumber("+62 812");   // "62812"
 */
export function sanitizePhoneNumber(phone: string): string {
  if (!phone) return "";

  const cleaned = phone.replace(/[()\s-]/g, "");

  if (cleaned.startsWith("+")) {
    return cleaned.substring(1);
  }

  if (cleaned.startsWith("08")) {
    return "62" + cleaned.substring(1);
  }

  if (cleaned.startsWith("8") && cleaned.length > 8) {
    return "62" + cleaned;
  }

  return cleaned;
}

/**
 * Formats a stored phone number for UI display with international prefixes.
 * Handles specific formatting for Indonesia (+62) and US (+1).
 *
 * @param phone - The raw phone number from the database.
 * @returns The formatted display string.
 *
 * @example
 * formatDisplayPhoneNumber("628123456"); // "+62 8123456"
 */
export function formatDisplayPhoneNumber(
  phone: string | number | null
): string {
  const phoneStr = String(phone || "");

  if (phoneStr.startsWith("62")) {
    return `+62 ${phoneStr.substring(2)}`;
  }

  if (phoneStr.startsWith("1") && phoneStr.length === 11) {
    return `+1 (${phoneStr.substring(1, 4)}) ${phoneStr.substring(
      4,
      7
    )}-${phoneStr.substring(7)}`;
  }

  return `+${phoneStr}`;
}

/**
 * Ensures a URL string has a valid protocol prefix.
 * Defaults to "https://" if no protocol is present.
 *
 * @param url - The raw URL string.
 * @returns A valid absolute URL or "#" if input is null.
 */
export function formatPurchaseLink(url: string | null): string {
  if (!url) return "#";

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return `https://${url}`;
}

/**
 * Converts an international phone number format back to the local Indonesian format.
 * Useful for populating edit forms where users expect to see "08..." instead of "628...".
 *
 * @param phone - The international phone number (e.g., "62812...").
 * @returns The local phone number string (e.g., "0812...").
 */
export function formatToLocalPhone(phone: string | number | null): string {
  const phoneStr = String(phone || "");

  if (phoneStr.startsWith("62")) {
    return "0" + phoneStr.substring(2);
  }

  return phoneStr;
}

/**
 * Formats a raw numeric string input into a human-readable number with separators.
 * Strips non-digit characters before formatting.
 *
 * @param value - The raw input string.
 * @returns The formatted number string (e.g., "1.000").
 */
export function formatNumber(value: string): string {
  const rawValue = value.replace(/\D/g, "");
  if (rawValue === "") return "";
  return new Intl.NumberFormat("id-ID").format(Number(rawValue));
}

/**
 * Extracts the "YYYY-MM-DD" date part from an ISO date string.
 * This format is required for HTML <input type="date"> values.
 *
 * @param dateString - The ISO date string (e.g., "2023-12-25T10:00:00Z").
 * @returns The date string formatted as "YYYY-MM-DD".
 */
export function formatDateForInput(
  dateString: string | null | undefined
): string {
  if (!dateString) return "";
  return dateString.split("T")[0];
}

/**
 * Determines the label and text color class based on stock quantity.
 *
 * @param stock - The current stock amount.
 * @returns An object containing the display label and Tailwind CSS color class.
 *
 * @example
 * getStockStatus(5); // { label: "Low Stock", color: "text-yellow-500" }
 */
export function getStockStatus(stock: number): {
  label: string;
  color: string;
} {
  if (stock === 0) return { label: "Out of Stock", color: "text-red-500" };
  if (stock < 10) return { label: "Low Stock", color: "text-yellow-500" };
  return { label: "In-Stock", color: "text-green-500" };
}

/**
 * Returns the appropriate Tailwind CSS text color class based on the order status.
 *
 * @param status - The status string (e.g., "Completed", "Shipped").
 * @returns The Tailwind CSS class string.
 */
export function getOrderStatus(status: string): string {
  if (status === "Completed") return "text-green-600";
  if (status === "Shipped") return "text-blue-600";
  return "text-yellow-600";
}

/**
 * Converts an internal entity type string into a human-readable display label.
 * Useful for generating dynamic UI headers, titles, or breadcrumbs.
 *
 * @param type - The internal type identifier (e.g., "sale", "order", "product").
 * @returns The formatted label string (e.g., "Invoice", "Purchase Order"), or the original string if no match is found.
 *
 * @example
 * getTypeLabel("sale"); // Returns "Invoice"
 * getTypeLabel("order"); // Returns "Purchase Order"
 */
export function getTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    product: "Product",
    supplier: "Supplier",
    customer: "Customer",
    sale: "Invoice",
    order: "Purchase Order",
  };

  return labels[type] || type;
}

/**
 * Returns the appropriate Tailwind CSS class names for a status badge based on the provided status string.
 * This ensures consistent coloring for status indicators across the entire application.
 *
 * @param status - The status string (e.g., "Completed", "Pending", "Shipped", "Cancelled").
 * @returns A string of Tailwind CSS classes for background and text color.
 *
 * @example
 * getStatusColor("Completed"); // Returns "bg-green-100 text-green-700"
 * getStatusColor("Pending");   // Returns "bg-orange-100 text-orange-700"
 */
export function getStatusColor(status: string): string {
  const styles: Record<string, string> = {
    Completed: "bg-green-100 text-green-700",
    Paid: "bg-green-100 text-green-700",
    Pending: "bg-orange-100 text-orange-700",
    Shipped: "bg-blue-100 text-blue-700",
    Processing: "bg-blue-100 text-blue-700",
    Cancelled: "bg-red-100 text-red-700",
    Failed: "bg-red-100 text-red-700",
  };

  // Default style (gray) if status is not found in the map
  return styles[status] || "bg-gray-100 text-gray-600";
}

/**
 * Formats a date string or object into a standardized human-readable string.
 * Uses the "en-GB" locale (Day Month Year) which is commonly used in international business.
 *
 * @param date - The input date (ISO string, Date object, null, or undefined).
 * @param includeTime - Whether to append the time (HH:mm) to the date string. Default is false.
 * @returns The formatted string (e.g., "10 Dec 2025"), or "-" if the date is invalid/missing.
 *
 * @example
 * formatDate("2025-12-10T10:00:00"); // Returns "10 Dec 2025"
 * formatDate(new Date(), true);      // Returns "10 Dec 2025, 14:30"
 */
export function formatDate(
  date: string | Date | null | undefined,
  includeTime: boolean = false
): string {
  if (!date) return "-";

  const d = new Date(date);

  if (isNaN(d.getTime())) return "Invalid Date";

  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };

  if (includeTime) {
    options.hour = "2-digit";
    options.minute = "2-digit";
    options.hour12 = false;
  }

  return new Intl.DateTimeFormat("en-GB", options).format(d);
}
