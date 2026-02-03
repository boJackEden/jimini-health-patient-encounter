import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { EncounterCard } from '@/components/encounters/EncounterCard';
import { Encounter } from '@/types/encounters';

// Mock useColorScheme hook
jest.mock('@/hooks/use-color-scheme', () => ({
  useColorScheme: () => 'light',
}));

const mockEncounter: Encounter = {
  id: 'enc_00001',
  patientId: 'pat_00001',
  patientInitials: 'JD',
  encounterDate: '2024-01-15T10:00:00Z',
  encounterType: 'therapy_session',
  duration: 60,
  status: 'completed',
  notes: 'Patient session notes',
};

describe('EncounterCard', () => {
  describe('rendering', () => {
    it('renders patient initials', () => {
      const { getByText } = render(<EncounterCard encounter={mockEncounter} />);
      expect(getByText('JD')).toBeTruthy();
    });

    it('renders encounter type label', () => {
      const { getByText } = render(<EncounterCard encounter={mockEncounter} />);
      expect(getByText('Therapy Session')).toBeTruthy();
    });

    it('renders duration', () => {
      const { getByText } = render(<EncounterCard encounter={mockEncounter} />);
      expect(getByText('60 min')).toBeTruthy();
    });

    it('renders status badge', () => {
      const { getByText } = render(<EncounterCard encounter={mockEncounter} />);
      expect(getByText('Completed')).toBeTruthy();
    });

    it('formats date correctly', () => {
      const { getByText } = render(<EncounterCard encounter={mockEncounter} />);
      // Date formatting may vary by locale, check for partial match
      expect(getByText(/Jan/)).toBeTruthy();
      expect(getByText(/15/)).toBeTruthy();
    });
  });

  describe('encounter types', () => {
    const encounterTypes = [
      { type: 'therapy_session', label: 'Therapy Session' },
      { type: 'initial_assessment', label: 'Initial Assessment' },
      { type: 'follow_up', label: 'Follow-up' },
      { type: 'crisis_intervention', label: 'Crisis Intervention' },
      { type: 'group_session', label: 'Group Session' },
      { type: 'medication_review', label: 'Medication Review' },
    ] as const;

    encounterTypes.forEach(({ type, label }) => {
      it(`renders "${label}" for type "${type}"`, () => {
        const encounter = { ...mockEncounter, encounterType: type };
        const { getByText } = render(<EncounterCard encounter={encounter} />);
        expect(getByText(label)).toBeTruthy();
      });
    });
  });

  describe('status badges', () => {
    const statuses = [
      { status: 'scheduled', label: 'Scheduled' },
      { status: 'in_progress', label: 'In Progress' },
      { status: 'completed', label: 'Completed' },
      { status: 'cancelled', label: 'Cancelled' },
      { status: 'no_show', label: 'No Show' },
    ] as const;

    statuses.forEach(({ status, label }) => {
      it(`renders "${label}" for status "${status}"`, () => {
        const encounter = { ...mockEncounter, status };
        const { getByText } = render(<EncounterCard encounter={encounter} />);
        expect(getByText(label)).toBeTruthy();
      });
    });
  });

  describe('interactions', () => {
    it('calls onPress when card is pressed', () => {
      const onPress = jest.fn();
      const { getByText } = render(
        <EncounterCard encounter={mockEncounter} onPress={onPress} />
      );

      fireEvent.press(getByText('JD'));
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('does not throw when onPress is not provided', () => {
      const { getByText } = render(<EncounterCard encounter={mockEncounter} />);

      expect(() => fireEvent.press(getByText('JD'))).not.toThrow();
    });
  });

  describe('data display', () => {
    it('does not render patient ID (PHI protection)', () => {
      const { queryByText } = render(
        <EncounterCard encounter={mockEncounter} />
      );
      expect(queryByText('pat_00001')).toBeNull();
    });

    it('does not render notes content (PHI protection)', () => {
      const { queryByText } = render(
        <EncounterCard encounter={mockEncounter} />
      );
      expect(queryByText('Patient session notes')).toBeNull();
    });

    it('renders encounter ID is not displayed to user', () => {
      const { queryByText } = render(
        <EncounterCard encounter={mockEncounter} />
      );
      // Encounter ID should not be visible in the UI
      expect(queryByText('enc_00001')).toBeNull();
    });
  });

  describe('different durations', () => {
    it('renders short duration correctly', () => {
      const encounter = { ...mockEncounter, duration: 15 };
      const { getByText } = render(<EncounterCard encounter={encounter} />);
      expect(getByText('15 min')).toBeTruthy();
    });

    it('renders long duration correctly', () => {
      const encounter = { ...mockEncounter, duration: 120 };
      const { getByText } = render(<EncounterCard encounter={encounter} />);
      expect(getByText('120 min')).toBeTruthy();
    });
  });
});
