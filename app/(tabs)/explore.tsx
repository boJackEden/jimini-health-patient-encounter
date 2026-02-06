import { ScrollView, StyleSheet, Switch, View } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAppSettings } from '@/contexts/AppSettingsContext';

type ThemeColors = (typeof Colors)['light'] | (typeof Colors)['dark'];

interface SettingsRowProps {
  label: string;
  description?: string;
  colors: ThemeColors;
  children: React.ReactNode;
}

function SettingsRow({ label, description, colors, children }: SettingsRowProps) {
  return (
    <View style={[styles.settingsRow, { borderBottomColor: colors.border }]}>
      <View style={styles.settingsRowText}>
        <ThemedText style={styles.settingsLabel}>{label}</ThemedText>
        {description && (
          <ThemedText style={[styles.settingsDescription, { color: colors.textSecondary }]}>
            {description}
          </ThemedText>
        )}
      </View>
      {children}
    </View>
  );
}

export default function SettingsScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { isOfflineMode, setOfflineMode } = useAppSettings();

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Settings
          </ThemedText>
        </View>

        {/* Debug Section */}
        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            Debug Options
          </ThemedText>

          <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <SettingsRow
              label="Simulate Offline Mode"
              description="Test how the app handles network failures"
              colors={colors}
            >
              <Switch
                value={isOfflineMode}
                onValueChange={setOfflineMode}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#FFFFFF"
              />
            </SettingsRow>
          </View>

          {isOfflineMode && (
            <View style={[styles.warningCard, { backgroundColor: colors.error + '15' }]}>
              <IconSymbol name="exclamationmark.triangle" size={20} color={colors.error} />
              <ThemedText style={[styles.warningText, { color: colors.error }]}>
                Offline mode is active. API requests will fail.
              </ThemedText>
            </View>
          )}
        </View>

        {/* Info Section */}
        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            About
          </ThemedText>

          <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.infoRow}>
              <ThemedText style={[styles.infoLabel, { color: colors.textSecondary }]}>
                Version
              </ThemedText>
              <ThemedText style={styles.infoValue}>1.0.0</ThemedText>
            </View>
            <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
              <ThemedText style={[styles.infoLabel, { color: colors.textSecondary }]}>
                Build
              </ThemedText>
              <ThemedText style={styles.infoValue}>Take-home Assignment</ThemedText>
            </View>
          </View>
        </View>
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
  header: {
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.lg,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  sectionCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderBottomWidth: 1,
  },
  settingsRowText: {
    flex: 1,
    marginRight: Spacing.md,
  },
  settingsLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingsDescription: {
    fontSize: 13,
    marginTop: 2,
  },
  warningCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.sm,
    gap: Spacing.sm,
  },
  warningText: {
    fontSize: 14,
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  infoLabel: {
    fontSize: 15,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '500',
  },
});
