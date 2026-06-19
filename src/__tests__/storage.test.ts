import { describe, it, expect, beforeEach, vi } from 'vitest';
import { safeGetStorageItem, safeSetStorageItem } from '@/lib/storage-safety';

const store: Record<string, string> = {};
const mockLocalStorage = {
  getItem: vi.fn((key: string) => store[key] ?? null),
  setItem: vi.fn((key: string, value: string) => {
    store[key] = String(value);
  }),
  removeItem: vi.fn((key: string) => {
    delete store[key];
  }),
  clear: vi.fn(() => {
    for (const key in store) {
      delete store[key];
    }
  }),
};

vi.stubGlobal('localStorage', mockLocalStorage);

describe('Storage Safety Utility Tests', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    vi.restoreAllMocks();
  });

  it('should return default value if key does not exist', () => {
    const val = safeGetStorageItem('non-existent-key', 'default-str');
    expect(val).toBe('default-str');
  });

  it('should return number correctly when default is number', () => {
    mockLocalStorage.setItem('num-key', '42');
    const val = safeGetStorageItem('num-key', 0);
    expect(val).toBe(42);
  });

  it('should trigger corruption recovery and return fallback if number is invalid', () => {
    mockLocalStorage.setItem('invalid-num-key', 'not-a-number');
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const val = safeGetStorageItem('invalid-num-key', 100);
    expect(val).toBe(100);
    expect(mockLocalStorage.getItem('invalid-num-key')).toBeNull(); // Key should be removed
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should parse boolean values correctly', () => {
    mockLocalStorage.setItem('bool-key-true', 'true');
    mockLocalStorage.setItem('bool-key-false', 'false');
    expect(safeGetStorageItem('bool-key-true', false)).toBe(true);
    expect(safeGetStorageItem('bool-key-false', true)).toBe(false);
  });

  it('should parse JSON objects/arrays correctly', () => {
    const obj = { name: 'EcoVerse', active: true };
    mockLocalStorage.setItem('obj-key', JSON.stringify(obj));
    const val = safeGetStorageItem('obj-key', { name: '', active: false });
    expect(val).toEqual(obj);
  });

  it('should return raw string if JSON parsing fails and default is string', () => {
    mockLocalStorage.setItem('corrupted-json', 'raw-unparsed-string');
    const val = safeGetStorageItem('corrupted-json', 'default-fallback');
    expect(val).toBe('raw-unparsed-string');
  });

  it('should trigger corruption recovery if JSON parsing fails and default is object', () => {
    mockLocalStorage.setItem('corrupted-obj', 'invalid-json-string{[');
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const val = safeGetStorageItem('corrupted-obj', { some: 'fields' });
    expect(val).toEqual({ some: 'fields' });
    expect(mockLocalStorage.getItem('corrupted-obj')).toBeNull();
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should set storage item correctly for string value', () => {
    safeSetStorageItem('test-set-str', 'hello');
    expect(mockLocalStorage.getItem('test-set-str')).toBe('hello');
  });

  it('should set storage item correctly for object value (serialized to JSON)', () => {
    const obj = { val: [1, 2, 3] };
    safeSetStorageItem('test-set-obj', obj);
    expect(mockLocalStorage.getItem('test-set-obj')).toBe(JSON.stringify(obj));
  });

  it('should handle setItem errors gracefully', () => {
    vi.spyOn(mockLocalStorage, 'setItem').mockImplementation(() => {
      throw new Error('Quota exceeded');
    });
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    safeSetStorageItem('failed-key', 'value');
    expect(consoleSpy).toHaveBeenCalled();
  });
});
