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
