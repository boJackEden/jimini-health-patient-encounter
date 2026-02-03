/**
 * Encounter Query Hooks
 *
 * Custom React Query hooks for fetching encounter data.
 * Provides caching, pagination, and error handling out of the box.
 */

import {
  useQuery,
  useInfiniteQuery,
  UseQueryResult,
  InfiniteData,
} from '@tanstack/react-query';
import { api } from '@/services/api';
import {
  Encounter,
  EncounterDetail,
  EncountersListResponse,
  EncountersQueryParams,
} from '@/types/encounters';

/**
 * Query key factory for encounters
 * Provides consistent cache keys across the app
 */
export const encounterKeys = {
  all: ['encounters'] as const,
  lists: () => [...encounterKeys.all, 'list'] as const,
  list: (params: EncountersQueryParams) =>
    [...encounterKeys.lists(), params] as const,
  details: () => [...encounterKeys.all, 'detail'] as const,
  detail: (id: string) => [...encounterKeys.details(), id] as const,
};

/**
 * Hook for fetching paginated encounters with infinite scroll support
 *
 * Usage:
 * ```tsx
 * const {
 *   data,
 *   fetchNextPage,
 *   hasNextPage,
 *   isFetchingNextPage,
 *   isLoading,
 *   isError,
 *   error,
 *   refetch,
 * } = useEncountersInfinite();
 *
 * // Get flattened list of all loaded encounters
 * const encounters = data?.pages.flatMap(page => page.encounters) ?? [];
 * ```
 */
export function useEncountersInfinite(
  params: Omit<EncountersQueryParams, 'page'> = {}
) {
  return useInfiniteQuery({
    queryKey: encounterKeys.list(params),
    queryFn: ({ pageParam = 1 }) =>
      api.encounters.list({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasMore ? lastPage.pagination.page + 1 : undefined,
  });
}

/**
 * Hook for fetching a single page of encounters
 *
 * Usage:
 * ```tsx
 * const { data, isLoading, isError } = useEncounters({ page: 1, pageSize: 20 });
 * ```
 */
export function useEncounters(
  params: EncountersQueryParams = {}
): UseQueryResult<EncountersListResponse, Error> {
  return useQuery({
    queryKey: encounterKeys.list(params),
    queryFn: () => api.encounters.list(params),
  });
}

/**
 * Hook for fetching a single encounter by ID
 *
 * Usage:
 * ```tsx
 * const { data: encounter, isLoading, isError } = useEncounter('enc_00001');
 * ```
 */
export function useEncounter(
  id: string | undefined
): UseQueryResult<EncounterDetail, Error> {
  return useQuery({
    queryKey: encounterKeys.detail(id!),
    queryFn: () => api.encounters.getById(id!),
    enabled: !!id, // Only fetch when ID is provided
  });
}

/**
 * Helper type for flattened encounters from infinite query
 */
export type FlattenedEncounters = {
  encounters: Encounter[];
  total: number;
  hasMore: boolean;
};

/**
 * Helper function to flatten infinite query pages into a single array
 */
export function flattenEncounterPages(
  data: InfiniteData<EncountersListResponse> | undefined
): FlattenedEncounters {
  if (!data?.pages.length) {
    return { encounters: [], total: 0, hasMore: false };
  }

  const encounters = data.pages.flatMap((page) => page.encounters);
  const lastPage = data.pages[data.pages.length - 1];

  return {
    encounters,
    total: lastPage.pagination.total,
    hasMore: lastPage.pagination.hasMore,
  };
}
