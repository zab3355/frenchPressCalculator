/** Returns '0.00' for null/undefined/NaN input. */
export function formatDecimal(value: number | null | undefined, decimals: number = 2): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '0.00';
  }
  const factor = Math.pow(10, decimals);
  return (Math.round((value + Number.EPSILON) * factor) / factor).toFixed(decimals);
}

export function formatMetricValue(value: number | null | undefined, decimals: number = 2): string {
  return formatDecimal(value, decimals);
}
