/**
 * Common utility types used across the EcoVerse AI platform.
 * @module types/common
 */

/** Branded type for unique identifiers */
export type ID = string & { readonly __brand: 'ID' };

/** ISO 8601 timestamp string */
export type Timestamp = string & { readonly __brand: 'Timestamp' };

/** Makes a type nullable */
export type Nullable<T> = T | null;

/** Represents the state of an async operation */
export type AsyncState<T> = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: AppError };

/** Paginated response wrapper */
export interface PaginatedResponse<T> {
  readonly data: readonly T[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
  readonly hasMore: boolean;
}

/** Standardized application error */
export interface AppError {
  readonly code: string;
  readonly message: string;
  readonly details?: Record<string, unknown>;
}

/** Component base props with accessibility support */
export interface BaseComponentProps {
  readonly className?: string;
  readonly id?: string;
  readonly 'aria-label'?: string;
  readonly 'aria-describedby'?: string;
  readonly testId?: string;
}

/** Generic callback function type */
export type Callback<T = void> = (value: T) => void;

/** Deep partial utility type */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/** Extract element type from array */
export type ElementOf<T extends readonly unknown[]> = T extends readonly (infer E)[] ? E : never;
