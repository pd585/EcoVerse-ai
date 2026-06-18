/**
 * Safe LocalStorage Utilities
 * Provides robust try/catch parsing, corruption recovery, and default fallbacks to prevent crashes.
 */

export function safeGetStorageItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;

  try {
    const value = localStorage.getItem(key);
    if (value === null) {
      return defaultValue;
    }

    // If defaultValue is a number, parse as number
    if (typeof defaultValue === 'number') {
      const num = Number(value);
      if (isNaN(num)) {
        throw new Error(`Value for key "${key}" is not a valid number: "${value}"`);
      }
      return num as unknown as T;
    }

    // If defaultValue is boolean, check for string boolean values
    if (typeof defaultValue === 'boolean') {
      return (value === 'true') as unknown as T;
    }

    // Try parsing as JSON for objects/arrays
    try {
      return JSON.parse(value) as T;
    } catch {
      // If JSON parsing fails but defaultValue is string, return raw value
      if (typeof defaultValue === 'string') {
        return value as unknown as T;
      }
      throw new Error(`Failed to parse key "${key}" as JSON`);
    }
  } catch (err) {
    console.error(`[StorageSafety] LocalStorage corruption detected on key "${key}". Resetting to default fallback. Error:`, err);
    // Corruption recovery: remove the malformed key to restore stability
    try {
      localStorage.removeItem(key);
    } catch (_) {}
    return defaultValue;
  }
}

export function safeSetStorageItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, serialized);
  } catch (err) {
    console.error(`[StorageSafety] Failed to write key "${key}" to LocalStorage:`, err);
  }
}
