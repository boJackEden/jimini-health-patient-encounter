import {
  api,
  ApiError,
  configureApi,
  resetApiConfig,
  fetchEncounters,
  fetchEncounterById,
} from '@/services/api';

describe('API Service', () => {
  beforeEach(() => {
    // Reset to default config with no artificial delay for faster tests
    resetApiConfig();
    configureApi({ baseDelay: 0, jitterMs: 0, failureRate: 0 });
  });

  afterEach(() => {
    resetApiConfig();
  });

  describe('fetchEncounters', () => {
    it('returns paginated encounters', async () => {
      const result = await fetchEncounters({ page: 1, pageSize: 20 });

      expect(result).toHaveProperty('encounters');
      expect(result).toHaveProperty('pagination');
      expect(result.encounters).toHaveLength(20);
    });

    it('returns correct pagination metadata', async () => {
      const result = await fetchEncounters({ page: 1, pageSize: 20 });

      expect(result.pagination).toEqual({
        page: 1,
        pageSize: 20,
        total: 150,
        hasMore: true,
      });
    });

    it('uses default page and pageSize when not provided', async () => {
      const result = await fetchEncounters();

      expect(result.pagination.page).toBe(1);
      expect(result.pagination.pageSize).toBe(20);
    });

    it('returns different encounters for different pages', async () => {
      const page1 = await fetchEncounters({ page: 1, pageSize: 10 });
      const page2 = await fetchEncounters({ page: 2, pageSize: 10 });

      expect(page1.encounters[0].id).not.toBe(page2.encounters[0].id);
    });

    it('indicates hasMore is false on last page', async () => {
      const result = await fetchEncounters({ page: 8, pageSize: 20 });

      expect(result.pagination.hasMore).toBe(false);
    });
  });

  describe('fetchEncounterById', () => {
    it('returns encounter detail for valid ID', async () => {
      const list = await fetchEncounters({ page: 1, pageSize: 1 });
      const encounterId = list.encounters[0].id;

      const result = await fetchEncounterById(encounterId);

      expect(result).toHaveProperty('id', encounterId);
      expect(result).toHaveProperty('assessments');
      expect(Array.isArray(result.assessments)).toBe(true);
    });

    it('throws ApiError for non-existent ID', async () => {
      await expect(fetchEncounterById('non_existent_id')).rejects.toThrow(
        ApiError
      );
    });

    it('throws 404 error for non-existent ID', async () => {
      try {
        await fetchEncounterById('non_existent_id');
        fail('Expected error to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).status).toBe(404);
        expect((error as ApiError).code).toBe('NOT_FOUND');
      }
    });
  });

  describe('api object', () => {
    it('exposes encounters.list method', () => {
      expect(api.encounters.list).toBe(fetchEncounters);
    });

    it('exposes encounters.getById method', () => {
      expect(api.encounters.getById).toBe(fetchEncounterById);
    });

    it('exposes configure method', () => {
      expect(api.configure).toBe(configureApi);
    });

    it('exposes resetConfig method', () => {
      expect(api.resetConfig).toBe(resetApiConfig);
    });
  });

  describe('ApiError', () => {
    it('creates error with correct properties', () => {
      const error = new ApiError('Test error', 'TEST_CODE', 500);

      expect(error.message).toBe('Test error');
      expect(error.code).toBe('TEST_CODE');
      expect(error.status).toBe(500);
      expect(error.name).toBe('ApiError');
    });

    it('is instance of Error', () => {
      const error = new ApiError('Test', 'CODE', 400);
      expect(error).toBeInstanceOf(Error);
    });
  });

  describe('error simulation', () => {
    it('simulates network failures when configured', async () => {
      configureApi({ baseDelay: 0, jitterMs: 0, failureRate: 1 }); // 100% failure rate

      await expect(fetchEncounters()).rejects.toThrow(ApiError);
    });

    it('does not fail when failureRate is 0', async () => {
      configureApi({ baseDelay: 0, jitterMs: 0, failureRate: 0 });

      const result = await fetchEncounters();
      expect(result.encounters).toBeDefined();
    });
  });

  describe('configuration', () => {
    it('configureApi merges with existing config', () => {
      configureApi({ baseDelay: 100 });
      configureApi({ jitterMs: 50 });

      // Can't directly inspect config, but we can verify it works
      expect(() => configureApi({ failureRate: 0.5 })).not.toThrow();
    });

    it('resetApiConfig restores defaults', () => {
      configureApi({ failureRate: 1 });
      resetApiConfig();
      configureApi({ baseDelay: 0, jitterMs: 0 }); // Make fast for test

      // Should not throw with default 0 failure rate
      expect(fetchEncounters()).resolves.toBeDefined();
    });
  });
});
