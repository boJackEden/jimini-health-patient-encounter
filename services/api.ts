/**
 * API Service
 *
 * Abstracted API client for encounter data. Currently uses mock data
 * with simulated network conditions. In production, this would connect
 * to a real backend API.
 *
 * Features:
 * - Simulated network latency (realistic delays)
 * - Error simulation for testing error states
 * - PHI-safe logging
 * - Retry-friendly design
 */

import {
  EncountersListResponse,
  EncounterDetailResponse,
  EncountersQueryParams,
} from '@/types/encounters';
import {
  getPaginatedEncounters,
  getEncounterById,
} from '@/data/mockEncounters';
import { getIsOfflineMode, OfflineError } from '@/lib/networkState';
import logger from '@/utils/logger';

// Configuration for simulated network behavior
interface ApiConfig {
  /** Base delay in milliseconds */
  baseDelay: number;
  /** Random additional delay (0 to this value) */
  jitterMs: number;
  /** Probability of simulated failure (0-1), set to 0 for no failures */
  failureRate: number;
}

const defaultConfig: ApiConfig = {
  baseDelay: 300,
  jitterMs: 200,
  failureRate: 0, // Set to 0.1 (10%) to test error handling
};

let config = { ...defaultConfig };

/**
 * Configure API behavior (useful for testing)
 */
export function configureApi(newConfig: Partial<ApiConfig>): void {
  config = { ...config, ...newConfig };
}

/**
 * Reset API config to defaults
 */
export function resetApiConfig(): void {
  config = { ...defaultConfig };
}

/**
 * Simulate network delay
 */
async function simulateNetworkDelay(): Promise<void> {
  const delay = config.baseDelay + Math.random() * config.jitterMs;
  await new Promise((resolve) => setTimeout(resolve, delay));
}

/**
 * Check if offline mode is enabled and throw if so
 */
function checkOfflineMode(): void {
  if (getIsOfflineMode()) {
    throw new OfflineError();
  }
}

/**
 * Simulate potential network failure
 */
function maybeThrowError(): void {
  if (config.failureRate > 0 && Math.random() < config.failureRate) {
    throw new ApiError('Network request failed', 'NETWORK_ERROR', 500);
  }
}

/**
 * Custom API error class
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Fetch paginated list of encounters
 *
 * GET /api/encounters
 */
export async function fetchEncounters(
  params: EncountersQueryParams = {}
): Promise<EncountersListResponse> {
  const { page = 1, pageSize = 20 } = params;

  logger.apiRequest('GET', '/api/encounters', { page, pageSize });

  try {
    checkOfflineMode();
    await simulateNetworkDelay();
    maybeThrowError();

    const result = getPaginatedEncounters(page, pageSize);

    logger.apiResponse('GET', '/api/encounters', 200, {
      count: result.encounters.length,
      pagination: result.pagination,
    });

    return result;
  } catch (error) {
    logger.error('Failed to fetch encounters', error, { page, pageSize });
    throw error;
  }
}

/**
 * Fetch a single encounter by ID
 *
 * GET /api/encounters/:id
 */
export async function fetchEncounterById(
  id: string
): Promise<EncounterDetailResponse> {
  logger.apiRequest('GET', `/api/encounters/${id}`);

  try {
    checkOfflineMode();
    await simulateNetworkDelay();
    maybeThrowError();

    const encounter = getEncounterById(id);

    if (!encounter) {
      throw new ApiError('Encounter not found', 'NOT_FOUND', 404);
    }

    logger.apiResponse('GET', `/api/encounters/${id}`, 200, {
      id: encounter.id,
      encounterType: encounter.encounterType,
      status: encounter.status,
    });

    return encounter;
  } catch (error) {
    logger.error('Failed to fetch encounter', error, { encounterId: id });
    throw error;
  }
}

/**
 * API client object for convenient access
 */
export const api = {
  encounters: {
    list: fetchEncounters,
    getById: fetchEncounterById,
  },
  configure: configureApi,
  resetConfig: resetApiConfig,
};

export default api;
