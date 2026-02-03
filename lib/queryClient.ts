/**
 * React Query Client Configuration
 *
 * Configures TanStack Query with:
 * - Retry logic with exponential backoff
 * - Appropriate stale times for encounter data
 * - Error handling configuration
 */

import { QueryClient } from '@tanstack/react-query';
import { ApiError } from '@/services/api';

/**
 * Determine if an error should trigger a retry
 * - Don't retry 4xx errors (client errors)
 * - Do retry 5xx errors (server errors) and network errors
 */
function shouldRetry(failureCount: number, error: unknown): boolean {
  // Max 3 retries
  if (failureCount >= 3) return false;

  // Don't retry client errors (4xx)
  if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
    return false;
  }

  // Retry server errors and network issues
  return true;
}

/**
 * Calculate retry delay with exponential backoff
 * Base delay: 1s, 2s, 4s
 */
function getRetryDelay(attemptIndex: number): number {
  return Math.min(1000 * 2 ** attemptIndex, 30000);
}

/**
 * Create and configure the query client
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data is considered fresh for 30 seconds
        staleTime: 30 * 1000,

        // Keep unused data in cache for 5 minutes
        gcTime: 5 * 60 * 1000,

        // Retry configuration
        retry: shouldRetry,
        retryDelay: getRetryDelay,

        // Refetch on window focus (good for stale data)
        refetchOnWindowFocus: true,

        // Don't refetch on mount if data is fresh
        refetchOnMount: true,

        // Network mode - always try to fetch
        networkMode: 'always',
      },
      mutations: {
        // Retry mutations once
        retry: 1,
        retryDelay: 1000,
      },
    },
  });
}

// Singleton query client instance
let queryClient: QueryClient | null = null;

/**
 * Get or create the query client singleton
 */
export function getQueryClient(): QueryClient {
  if (!queryClient) {
    queryClient = createQueryClient();
  }
  return queryClient;
}

export default getQueryClient;
