/**
 * Mock Encounter Data
 *
 * Generates 150 realistic patient encounters for testing and development.
 * All data is fictional - no real PHI is used.
 */

import {
  Encounter,
  EncounterDetail,
  EncounterType,
  EncounterStatus,
  Assessment,
} from '@/types/encounters';

// Sample initials for mock patients (fictional)
const PATIENT_INITIALS = [
  'J.D.',
  'M.S.',
  'A.R.',
  'K.L.',
  'T.B.',
  'S.W.',
  'R.M.',
  'L.K.',
  'P.H.',
  'C.N.',
  'E.F.',
  'D.G.',
  'B.T.',
  'N.P.',
  'W.C.',
  'H.J.',
  'F.A.',
  'G.O.',
  'V.I.',
  'Q.U.',
];

const ENCOUNTER_TYPES: EncounterType[] = [
  'therapy_session',
  'initial_assessment',
  'follow_up',
  'crisis_intervention',
  'group_session',
  'medication_review',
];

const ENCOUNTER_STATUSES: EncounterStatus[] = [
  'completed',
  'completed',
  'completed', // Weight toward completed
  'scheduled',
  'cancelled',
  'no_show',
  'in_progress',
];

const DURATIONS = [30, 45, 50, 60, 90]; // Common session lengths in minutes

// Sample clinical notes (fictional, generic content)
const SAMPLE_NOTES = [
  'Patient reported improved sleep patterns this week. Continued focus on cognitive restructuring techniques for anxiety management. Homework assigned: daily thought journal.',
  'Discussed workplace stressors and their impact on mood. Introduced grounding techniques for acute anxiety episodes. Patient receptive to trying mindfulness exercises.',
  'Follow-up on medication adjustment from last session. Patient notes decreased side effects. Mood appears more stable. Will continue current treatment plan.',
  'Initial assessment completed. Patient presents with symptoms consistent with generalized anxiety disorder. Discussed treatment options and established initial goals.',
  'Crisis session - patient experienced panic attack yesterday. Reviewed coping strategies and safety plan. Scheduled additional check-in for later this week.',
  'Group therapy session focused on interpersonal effectiveness skills. Patient participated actively in role-playing exercises.',
  'Patient showed significant improvement in anxiety management techniques. PHQ-9 score decreased from previous session. Continuing current approach.',
  'Explored family dynamics and their relationship to current symptoms. Patient gained insight into recurring patterns.',
  'Reviewed progress on treatment goals. Patient has been consistent with homework assignments. Discussed potential timeline for reducing session frequency.',
  'Addressed recent setback in progress. Normalized temporary regression and reinforced commitment to treatment plan.',
  'Patient expressed frustration with slow progress. Validated feelings and reviewed concrete improvements since treatment began.',
  'Introduced exposure hierarchy for social anxiety. Patient identified initial targets for gradual exposure practice.',
  'Medication review session. Current regimen appears effective. No changes recommended at this time.',
  'Discussed strategies for managing upcoming stressful life event. Developed specific coping plan.',
  'Patient reports using coping skills successfully during difficult situation this week. Reinforced positive behavioral changes.',
];

// Sample assessments
const ASSESSMENT_TEMPLATES: Array<{ name: string; scoreRange: [number, number] }> = [
  { name: 'GAD-7', scoreRange: [0, 21] },
  { name: 'PHQ-9', scoreRange: [0, 27] },
  { name: 'PCL-5', scoreRange: [0, 80] },
  { name: 'BDI-II', scoreRange: [0, 63] },
  { name: 'BAI', scoreRange: [0, 63] },
];

/**
 * Seeded random number generator for consistent mock data
 */
function seededRandom(seed: number): () => number {
  return function () {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
}

const random = seededRandom(42); // Fixed seed for reproducibility

function randomElement<T>(array: T[]): T {
  return array[Math.floor(random() * array.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(random() * (max - min + 1)) + min;
}

/**
 * Generate a date within the last 6 months
 */
function generateDate(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(randomInt(8, 18), randomInt(0, 3) * 15, 0, 0);
  return date.toISOString();
}

/**
 * Generate random assessments for an encounter
 */
function generateAssessments(): Assessment[] {
  const numAssessments = randomInt(0, 3);
  const assessments: Assessment[] = [];
  const usedAssessments = new Set<string>();

  for (let i = 0; i < numAssessments; i++) {
    const template = randomElement(ASSESSMENT_TEMPLATES);
    if (!usedAssessments.has(template.name)) {
      usedAssessments.add(template.name);
      assessments.push({
        name: template.name,
        score: randomInt(template.scoreRange[0], template.scoreRange[1]),
      });
    }
  }

  return assessments;
}

/**
 * Generate a single mock encounter
 */
function generateEncounter(index: number): EncounterDetail {
  const patientIndex = index % PATIENT_INITIALS.length;
  const daysAgo = Math.floor(index / 2); // Roughly 2 encounters per day going back

  return {
    id: `enc_${String(index + 1).padStart(5, '0')}`,
    patientId: `pat_${String((patientIndex * 7 + 100) % 1000).padStart(5, '0')}`,
    patientInitials: PATIENT_INITIALS[patientIndex],
    encounterDate: generateDate(daysAgo),
    encounterType: randomElement(ENCOUNTER_TYPES),
    duration: randomElement(DURATIONS),
    status: randomElement(ENCOUNTER_STATUSES),
    notes: randomElement(SAMPLE_NOTES),
    assessments: generateAssessments(),
  };
}

/**
 * All mock encounters (150 records)
 * Sorted by date descending (most recent first)
 */
export const mockEncounters: EncounterDetail[] = Array.from(
  { length: 150 },
  (_, i) => generateEncounter(i)
).sort(
  (a, b) =>
    new Date(b.encounterDate).getTime() - new Date(a.encounterDate).getTime()
);

/**
 * Get encounters for list view (without full details)
 */
export function getEncountersList(): Encounter[] {
  return mockEncounters.map(({ assessments, ...encounter }) => encounter);
}

/**
 * Get a single encounter by ID
 */
export function getEncounterById(id: string): EncounterDetail | undefined {
  return mockEncounters.find((enc) => enc.id === id);
}

/**
 * Get paginated encounters
 */
export function getPaginatedEncounters(
  page: number = 1,
  pageSize: number = 20
): {
  encounters: Encounter[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    hasMore: boolean;
  };
} {
  const allEncounters = getEncountersList();
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const encounters = allEncounters.slice(startIndex, endIndex);

  return {
    encounters,
    pagination: {
      page,
      pageSize,
      total: allEncounters.length,
      hasMore: endIndex < allEncounters.length,
    },
  };
}
