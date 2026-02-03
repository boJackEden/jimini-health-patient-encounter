import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Encounter, EncounterStatus, EncounterType } from '@/types/encounters';

interface EncounterCardProps {
  encounter: Encounter;
  onPress?: () => void;
}

const STATUS_LABELS: Record<EncounterStatus, string> = {
  scheduled: 'Scheduled',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
  no_show: 'No Show',
};

const TYPE_LABELS: Record<EncounterType, string> = {
  therapy_session: 'Therapy Session',
  initial_assessment: 'Initial Assessment',
  follow_up: 'Follow-up',
  crisis_intervention: 'Crisis Intervention',
  group_session: 'Group Session',
  medication_review: 'Medication Review',
};

type ThemeColors = (typeof Colors)['light'] | (typeof Colors)['dark'];

function getStatusColor(status: EncounterStatus, colors: ThemeColors): string {
  switch (status) {
    case 'completed':
      return colors.statusCompleted;
    case 'scheduled':
      return colors.statusScheduled;
    case 'in_progress':
      return colors.statusInProgress;
    case 'cancelled':
      return colors.statusCancelled;
    case 'no_show':
      return colors.statusNoShow;
    default:
      return colors.textSecondary;
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function EncounterCard({ encounter, onPress }: EncounterCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const statusColor = getStatusColor(encounter.status, colors);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.initialsContainer}>
          <View
            style={[styles.initialsCircle, { backgroundColor: colors.primaryLight }]}
          >
            <ThemedText style={[styles.initials, { color: colors.text }]}>
              {encounter.patientInitials}
            </ThemedText>
          </View>
        </View>
        <View style={styles.headerInfo}>
          <ThemedText style={styles.date}>
            {formatDate(encounter.encounterDate)}
          </ThemedText>
          <ThemedText
            style={[styles.time, { color: colors.textSecondary }]}
          >
            {formatTime(encounter.encounterDate)}
          </ThemedText>
        </View>
        <View
          style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}
        >
          <ThemedText style={[styles.statusText, { color: statusColor }]}>
            {STATUS_LABELS[encounter.status]}
          </ThemedText>
        </View>
      </View>

      <View style={styles.body}>
        <ThemedText type="defaultSemiBold" style={styles.type}>
          {TYPE_LABELS[encounter.encounterType]}
        </ThemedText>
        <ThemedText style={[styles.duration, { color: colors.textSecondary }]}>
          {encounter.duration} min
        </ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  initialsContainer: {
    marginRight: Spacing.sm,
  },
  initialsCircle: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontSize: 14,
    fontWeight: '600',
  },
  headerInfo: {
    flex: 1,
  },
  date: {
    fontSize: 14,
    fontWeight: '500',
  },
  time: {
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  body: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  type: {
    fontSize: 15,
  },
  duration: {
    fontSize: 13,
  },
});
