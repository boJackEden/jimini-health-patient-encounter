import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useEncounter } from '@/hooks/useEncounters';
import { EncounterStatus, EncounterType } from '@/types/encounters';

const ENCOUNTER_TYPE_LABELS: Record<EncounterType, string> = {
  therapy_session: 'Therapy Session',
  initial_assessment: 'Initial Assessment',
  follow_up: 'Follow-up',
  crisis_intervention: 'Crisis Intervention',
  group_session: 'Group Session',
  medication_review: 'Medication Review',
};

const STATUS_LABELS: Record<EncounterStatus, string> = {
  scheduled: 'Scheduled',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
  no_show: 'No Show',
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
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
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

export default function EncounterDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const { data: encounter, isLoading, isError, error, refetch } = useEncounter(id);

  if (isLoading) {
    return (
      <ThemedView style={styles.centerContainer}>
        <Stack.Screen options={{ title: 'Loading...' }} />
        <ActivityIndicator size="large" color={colors.primary} />
        <ThemedText style={[styles.loadingText, { color: colors.textSecondary }]}>
          Loading encounter...
        </ThemedText>
      </ThemedView>
    );
  }

  if (isError || !encounter) {
    return (
      <ThemedView style={styles.centerContainer}>
        <Stack.Screen options={{ title: 'Error' }} />
        <IconSymbol
          name="exclamationmark.triangle"
          size={64}
          color={colors.error}
        />
        <ThemedText style={[styles.errorTitle, { color: colors.text }]}>
          Failed to Load
        </ThemedText>
        <ThemedText style={[styles.errorMessage, { color: colors.textSecondary }]}>
          {error?.message || 'Encounter not found'}
        </ThemedText>
        <View style={styles.errorActions}>
          <Pressable
            onPress={() => refetch()}
            style={({ pressed }) => [
              styles.retryButton,
              { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 },
            ]}
          >
            <IconSymbol name="arrow.clockwise" size={18} color={colors.card} />
            <ThemedText style={[styles.retryText, { color: colors.card }]}>
              Try Again
            </ThemedText>
          </Pressable>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.backButton,
              { borderColor: colors.border, opacity: pressed ? 0.8 : 1 },
            ]}
          >
            <ThemedText style={[styles.backButtonText, { color: colors.text }]}>
              Go Back
            </ThemedText>
          </Pressable>
        </View>
      </ThemedView>
    );
  }

  const statusColor = getStatusColor(encounter.status, colors);

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: ENCOUNTER_TYPE_LABELS[encounter.encounterType],
          headerBackTitle: 'Encounters',
        }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header section with patient initials */}
        <View style={[styles.headerCard, { backgroundColor: colors.card }]}>
          <View style={[styles.initialsCircle, { backgroundColor: colors.primary }]}>
            <ThemedText style={[styles.initials, { color: colors.card }]}>
              {encounter.patientInitials}
            </ThemedText>
          </View>
          <View style={styles.headerInfo}>
            <ThemedText style={[styles.encounterType, { color: colors.text }]}>
              {ENCOUNTER_TYPE_LABELS[encounter.encounterType]}
            </ThemedText>
            <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
              <ThemedText style={styles.statusText}>
                {STATUS_LABELS[encounter.status]}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Details section */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
            Details
          </ThemedText>

          <View style={styles.detailRow}>
            <ThemedText style={[styles.detailLabel, { color: colors.textSecondary }]}>
              Date
            </ThemedText>
            <ThemedText style={[styles.detailValue, { color: colors.text }]}>
              {formatDate(encounter.encounterDate)}
            </ThemedText>
          </View>

          <View style={styles.detailRow}>
            <ThemedText style={[styles.detailLabel, { color: colors.textSecondary }]}>
              Time
            </ThemedText>
            <ThemedText style={[styles.detailValue, { color: colors.text }]}>
              {formatTime(encounter.encounterDate)}
            </ThemedText>
          </View>

          <View style={styles.detailRow}>
            <ThemedText style={[styles.detailLabel, { color: colors.textSecondary }]}>
              Duration
            </ThemedText>
            <ThemedText style={[styles.detailValue, { color: colors.text }]}>
              {encounter.duration} minutes
            </ThemedText>
          </View>
        </View>

        {/* Notes section */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
            Clinical Notes
          </ThemedText>
          <ThemedText style={[styles.notes, { color: colors.text }]}>
            {encounter.notes}
          </ThemedText>
        </View>

        {/* Assessments section */}
        {encounter.assessments && encounter.assessments.length > 0 && (
          <View style={[styles.section, { backgroundColor: colors.card }]}>
            <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
              Assessments
            </ThemedText>
            {encounter.assessments.map((assessment, index) => (
              <View
                key={`${assessment.name}-${index}`}
                style={[
                  styles.assessmentRow,
                  index < encounter.assessments.length - 1 && {
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                  },
                ]}
              >
                <ThemedText style={[styles.assessmentName, { color: colors.text }]}>
                  {assessment.name}
                </ThemedText>
                <View style={[styles.scoreBadge, { backgroundColor: colors.primary + '20' }]}>
                  <ThemedText style={[styles.scoreText, { color: colors.primary }]}>
                    {assessment.score}
                  </ThemedText>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: Spacing.md,
  },
  errorMessage: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  errorActions: {
    gap: Spacing.sm,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
    gap: Spacing.sm,
  },
  retryText: {
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: 12,
    marginBottom: Spacing.md,
  },
  initialsCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    fontSize: 24,
    fontWeight: '700',
  },
  headerInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  encounterType: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  section: {
    padding: Spacing.lg,
    borderRadius: 12,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  detailLabel: {
    fontSize: 15,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '500',
  },
  notes: {
    fontSize: 15,
    lineHeight: 22,
  },
  assessmentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  assessmentName: {
    fontSize: 15,
    flex: 1,
  },
  scoreBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 6,
    minWidth: 40,
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
