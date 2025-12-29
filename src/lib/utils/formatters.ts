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
