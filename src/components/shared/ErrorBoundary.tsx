/**
 * Error boundary component for graceful error handling.
 * @module components/shared/ErrorBoundary
 */

'use client';

import { Component, type ReactNode, type ErrorInfo } from 'react';

export interface ErrorBoundaryProps {
  /** Content to render when no error has occurred */
  readonly children: ReactNode;
  /** Custom fallback UI when an error is caught */
  readonly fallback?: ReactNode;
  /** Callback invoked when an error is caught */
  readonly onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * React error boundary that catches rendering errors
 * and displays a fallback UI instead of crashing the app.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.props.onError?.(error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div role="alert" aria-live="assertive">
            <h2>Something went wrong</h2>
            <p>An unexpected error occurred. Please try refreshing the page.</p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              Try Again
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
