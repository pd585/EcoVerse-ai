/**
 * API-related type definitions.
 * @module types/api
 */

import type { AppError } from './common';

/** Supported HTTP methods */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/** Standardized API response envelope */
export interface ApiResponse<T> {
  readonly success: boolean;
  readonly data: T;
  readonly meta?: ApiMeta;
}

/** API response metadata */
export interface ApiMeta {
  readonly requestId: string;
  readonly timestamp: string;
  readonly duration?: number;
}

/** API error response */
export interface ApiErrorResponse {
  readonly success: false;
  readonly error: AppError;
  readonly meta?: ApiMeta;
}

/** Request configuration for the API client */
export interface RequestConfig {
  readonly method: HttpMethod;
  readonly path: string;
  readonly body?: Record<string, unknown>;
  readonly params?: Record<string, string | number | boolean>;
  readonly headers?: Record<string, string>;
  readonly signal?: AbortSignal;
  readonly timeout?: number;
}

/** API client options */
export interface ApiClientOptions {
  readonly baseUrl: string;
  readonly defaultHeaders?: Record<string, string>;
  readonly timeout?: number;
  readonly retryCount?: number;
  readonly retryDelay?: number;
}
