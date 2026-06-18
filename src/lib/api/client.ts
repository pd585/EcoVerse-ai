/**
 * API client factory.
 * Creates typed HTTP clients for backend communication.
 * @module lib/api/client
 */

import type { ApiResponse, ApiErrorResponse, RequestConfig, ApiClientOptions } from '@/types';

/**
 * Creates a configured API client instance.
 *
 * @param options - Client configuration
 * @returns Object with typed request methods
 */
export function createApiClient(options: ApiClientOptions) {
  const { baseUrl, defaultHeaders = {}, timeout = 30_000 } = options;

  /**
   * Execute an API request.
   * @param config - Request configuration
   * @returns Typed API response
   */
  async function request<T>(config: RequestConfig): Promise<ApiResponse<T>> {
    const { method, path, body, params, headers, signal, timeout: reqTimeout } = config;

    const url = new URL(path, baseUrl);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, String(value));
      });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), reqTimeout ?? timeout);

    try {
      const response = await fetch(url.toString(), {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...defaultHeaders,
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: signal ?? controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorBody = (await response.json()) as ApiErrorResponse;
        throw new ApiClientError(
          errorBody.error?.message ?? 'Request failed',
          response.status,
          errorBody
        );
      }

      return (await response.json()) as ApiResponse<T>;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  return {
    get: <T>(path: string, params?: Record<string, string | number | boolean>) =>
      request<T>({ method: 'GET', path, params }),

    post: <T>(path: string, body?: Record<string, unknown>) =>
      request<T>({ method: 'POST', path, body }),

    put: <T>(path: string, body?: Record<string, unknown>) =>
      request<T>({ method: 'PUT', path, body }),

    patch: <T>(path: string, body?: Record<string, unknown>) =>
      request<T>({ method: 'PATCH', path, body }),

    delete: <T>(path: string) =>
      request<T>({ method: 'DELETE', path }),
  };
}

/**
 * Custom error class for API client errors.
 */
export class ApiClientError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly response: ApiErrorResponse
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}
