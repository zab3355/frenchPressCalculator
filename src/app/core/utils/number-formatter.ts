/**
 * Number formatting utility for French Press calculator.
 * Centralizes decimal formatting logic to eliminate duplication across components.
 */

/**
 * Formats a number to a fixed number of decimal places.
 * Returns '0.00' if the value is null, undefined, or NaN.
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string representation of the number
 */
export function formatDecimal(value: number | null | undefined, decimals: number = 2): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '0.00';
  }
  const factor = Math.pow(10, decimals);
  return (Math.round((value + Number.EPSILON) * factor) / factor).toFixed(decimals);
}

/**
 * Formats a metric value (cups, liters, grams) to display format.
 * Handles null/undefined/NaN gracefully.
 * @param value - The metric value to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string representation
 */
export function formatMetricValue(value: number | null | undefined, decimals: number = 2): string {
  return formatDecimal(value, decimals);
}
