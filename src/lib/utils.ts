/**
 * Utility helpers shared across the application.
 * @module lib/utils
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind class names intelligently using clsx + tailwind-merge.
 * Resolves conflicts (e.g., `p-2 p-4` → `p-4`) and handles conditional classes.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
