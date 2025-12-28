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
