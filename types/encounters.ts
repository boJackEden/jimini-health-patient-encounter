/**
 * Encounter Types
 *
 * PHI/PII Note: These types use patient initials rather than full names
 * to minimize PHI exposure. Full patient data should never be stored
 * or transmitted in these structures.
 */

export type EncounterType =
  | 'therapy_session'
  | 'initial_assessment'
  | 'follow_up'
  | 'crisis_intervention'
  | 'group_session'
  | 'medication_review';

export type EncounterStatus =
  | 'scheduled'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export interface Assessment {
  name: string;
  score: number;
}

/**
 * Encounter list item - minimal data for list display
 */
export interface Encounter {
  id: string;
  patientId: string;
  patientInitials: string;
  encounterDate: string; // ISO 8601 format
  encounterType: EncounterType;
  duration: number; // minutes
  status: EncounterStatus;
  notes: string;
}

/**
 * Full encounter detail - includes assessments
 */
export interface EncounterDetail extends Encounter {
  assessments: Assessment[];
}

/**
 * Pagination metadata from API
 */
export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}

/**
 * API response for encounter list
 */
export interface EncountersListResponse {
  encounters: Encounter[];
  pagination: Pagination;
}

/**
 * API response for single encounter
 */
export interface EncounterDetailResponse extends EncounterDetail {}

/**
 * Query parameters for fetching encounters
 */
export interface EncountersQueryParams {
  page?: number;
  pageSize?: number;
  status?: EncounterStatus;
  encounterType?: EncounterType;
}
