/**
 * Data formatting utilities.
 * @module lib/utils/formatters
 */

/**
 * Formats a number as a carbon weight with appropriate units.
 * @param kg - Weight in kilograms
 * @returns Formatted string (e.g., "1.2 tonnes", "450 kg")
 */
export function formatCarbonWeight(kg: number): string {
  if (kg >= 1000) {
    return `${(kg / 1000).toFixed(1)} tonnes`;
  }
  return `${Math.round(kg)} kg`;
}

/**
 * Formats a number as a percentage.
 * @param value - The decimal value (0-1 or 0-100)
 * @param decimals - Number of decimal places
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number, decimals = 0): string {
  const pct = value > 1 ? value : value * 100;
  return `${pct.toFixed(decimals)}%`;
}

/**
 * Formats a date timestamp to a human-readable relative string.
 * @param timestamp - ISO 8601 date string
 * @returns Relative time string (e.g., "2 hours ago")
 */
export function formatRelativeTime(timestamp: string): string {
  const now = Date.now();
  const then = new Date(timestamp).getTime();
  const diffMs = now - then;

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'just now';
}

/**
 * Formats a large number with compact notation.
 * @param value - The number to format
 * @returns Compact string (e.g., "1.2K", "3.5M")
 */
export function formatCompactNumber(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toString();
}
