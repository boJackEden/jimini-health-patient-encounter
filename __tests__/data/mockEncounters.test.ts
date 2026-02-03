import {
  mockEncounters,
  getEncountersList,
  getEncounterById,
  getPaginatedEncounters,
} from '@/data/mockEncounters';

describe('mockEncounters', () => {
  describe('data generation', () => {
    it('generates 150 mock encounters', () => {
      expect(mockEncounters).toHaveLength(150);
    });

    it('all encounters have required fields', () => {
      mockEncounters.forEach((encounter) => {
        expect(encounter).toHaveProperty('id');
        expect(encounter).toHaveProperty('patientId');
        expect(encounter).toHaveProperty('patientInitials');
        expect(encounter).toHaveProperty('encounterDate');
        expect(encounter).toHaveProperty('encounterType');
        expect(encounter).toHaveProperty('duration');
        expect(encounter).toHaveProperty('status');
        expect(encounter).toHaveProperty('notes');
      });
    });

    it('generates unique encounter IDs', () => {
      const ids = mockEncounters.map((e) => e.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(mockEncounters.length);
    });

    it('generates valid encounter types', () => {
      const validTypes = [
        'therapy_session',
        'initial_assessment',
        'follow_up',
        'crisis_intervention',
        'group_session',
        'medication_review',
      ];
      mockEncounters.forEach((encounter) => {
        expect(validTypes).toContain(encounter.encounterType);
      });
    });

    it('generates valid status values', () => {
      const validStatuses = [
        'scheduled',
        'in_progress',
        'completed',
        'cancelled',
        'no_show',
      ];
      mockEncounters.forEach((encounter) => {
        expect(validStatuses).toContain(encounter.status);
      });
    });

    it('generates patient initials in correct format', () => {
      mockEncounters.forEach((encounter) => {
        // Format: "X.Y." (two uppercase letters with periods)
        expect(encounter.patientInitials).toMatch(/^[A-Z]\.[A-Z]\.$/);
      });
    });
  });

  describe('getEncountersList', () => {
    it('returns all encounters', () => {
      const list = getEncountersList();
      expect(list).toHaveLength(150);
    });
  });

  describe('getEncounterById', () => {
    it('returns encounter when ID exists', () => {
      const firstEncounter = mockEncounters[0];
      const result = getEncounterById(firstEncounter.id);
      expect(result).toBeDefined();
      expect(result?.id).toBe(firstEncounter.id);
    });

    it('returns encounter detail with assessments', () => {
      const firstEncounter = mockEncounters[0];
      const result = getEncounterById(firstEncounter.id);
      expect(result).toHaveProperty('assessments');
      expect(Array.isArray(result?.assessments)).toBe(true);
    });

    it('returns undefined for non-existent ID', () => {
      const result = getEncounterById('non_existent_id');
      expect(result).toBeUndefined();
    });
  });

  describe('getPaginatedEncounters', () => {
    it('returns correct page size', () => {
      const result = getPaginatedEncounters(1, 20);
      expect(result.encounters).toHaveLength(20);
    });

    it('returns correct pagination metadata', () => {
      const result = getPaginatedEncounters(1, 20);
      expect(result.pagination).toEqual({
        page: 1,
        pageSize: 20,
        total: 150,
        hasMore: true,
      });
    });

    it('returns hasMore false on last page', () => {
      const result = getPaginatedEncounters(8, 20);
      expect(result.pagination.hasMore).toBe(false);
    });

    it('returns correct items for page 2', () => {
      const page1 = getPaginatedEncounters(1, 20);
      const page2 = getPaginatedEncounters(2, 20);

      // Pages should have different encounters
      expect(page1.encounters[0].id).not.toBe(page2.encounters[0].id);
    });

    it('handles custom page sizes', () => {
      const result = getPaginatedEncounters(1, 10);
      expect(result.encounters).toHaveLength(10);
      expect(result.pagination.pageSize).toBe(10);
    });

    it('returns empty array for page beyond data', () => {
      const result = getPaginatedEncounters(100, 20);
      expect(result.encounters).toHaveLength(0);
      expect(result.pagination.hasMore).toBe(false);
    });
  });
});
