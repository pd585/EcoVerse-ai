/**
 * Lazy loading wrapper with Suspense boundary.
 * Provides a consistent loading fallback for code-split components.
 * @module components/shared/LazyLoader
 */

import { Suspense, type ReactNode } from 'react';
import { Loader } from '@/components/ui';

export interface LazyLoaderProps {
  /** The lazily-loaded component(s) */
  readonly children: ReactNode;
  /** Custom fallback to show while loading */
  readonly fallback?: ReactNode;
  /** Label for the loading indicator */
  readonly loadingLabel?: string;
}

/**
 * Wraps lazily-loaded components with a Suspense boundary
 * and accessible loading indicator.
 */
export function LazyLoader({
  children,
  fallback,
  loadingLabel = 'Loading content...',
}: LazyLoaderProps) {
  return (
    <Suspense
      fallback={
        fallback ?? <Loader size={48} label={loadingLabel} />
      }
    >
      {children}
    </Suspense>
  );
}
