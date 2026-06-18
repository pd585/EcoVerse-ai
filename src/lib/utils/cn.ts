/**
 * ClassName merge utility.
 * Combines class names conditionally, useful with Tailwind CSS.
 * @module lib/utils/cn
 */

/**
 * Merges class name values, filtering out falsy values.
 * A lightweight alternative to clsx/classnames for Tailwind usage.
 *
 * @param classes - Class names or conditional class expressions
 * @returns Merged class string
 *
 * @example
 * ```ts
 * cn('base', isActive && 'active', className) // => 'base active custom'
 * ```
 */
export function cn(
  ...classes: (string | boolean | undefined | null)[]
): string {
  return classes.filter(Boolean).join(' ');
}
