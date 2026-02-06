import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type ThemeColors = (typeof Colors)['light'] | (typeof Colors)['dark'];

interface FeatureCardProps {
  icon: React.ComponentProps<typeof IconSymbol>['name'];
  title: string;
  description: string;
  onPress?: () => void;
  colors: ThemeColors;
}

function FeatureCard({ icon, title, description, onPress, colors }: FeatureCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.featureCard,
        { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.8 : 1 },
      ]}
    >
      <View style={[styles.iconContainer, { backgroundColor: colors.primaryLight }]}>
        <IconSymbol name={icon} size={24} color={colors.primary} />
      </View>
      <View style={styles.featureContent}>
        <ThemedText style={styles.featureTitle}>{title}</ThemedText>
        <ThemedText style={[styles.featureDescription, { color: colors.textSecondary }]}>
          {description}
        </ThemedText>
      </View>
      {onPress && (
        <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
      )}
    </Pressable>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

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
            Jimini Health
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>
            Patient Encounter Management
          </ThemedText>
        </View>

        {/* Welcome message */}
        <View style={[styles.welcomeCard, { backgroundColor: colors.primary }]}>
          <ThemedText style={styles.welcomeTitle}>Welcome</ThemedText>
          <ThemedText style={styles.welcomeText}>
            Track and manage patient encounters with a focus on privacy and efficiency.
          </ThemedText>
        </View>

        {/* Features section */}
        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            Features
          </ThemedText>

          <FeatureCard
            icon="list.bullet.clipboard"
            title="Patient Encounters"
            description="View and manage all patient sessions with infinite scroll"
            onPress={() => router.push('/encounters')}
            colors={colors}
          />

          <FeatureCard
            icon="chevron.right"
            title="Encounter Details"
            description="Tap any encounter to view full details and assessments"
            colors={colors}
          />

          <FeatureCard
            icon="arrow.clockwise"
            title="Real-time Updates"
            description="Pull to refresh with smart caching via React Query"
            colors={colors}
          />
        </View>

        {/* Tech highlights */}
        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            Technical Highlights
          </ThemedText>

          <View style={[styles.techCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <TechItem label="Framework" value="React Native + Expo" colors={colors} />
            <TechItem label="State Management" value="TanStack Query v5" colors={colors} />
            <TechItem label="Navigation" value="Expo Router" colors={colors} />
            <TechItem label="PHI Compliance" value="Redacted Logging" colors={colors} />
            <TechItem label="Testing" value="Jest + RTL" colors={colors} />
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

interface TechItemProps {
  label: string;
  value: string;
  colors: ThemeColors;
}

function TechItem({ label, value, colors }: TechItemProps) {
  return (
    <View style={styles.techItem}>
      <ThemedText style={[styles.techLabel, { color: colors.textSecondary }]}>
        {label}
      </ThemedText>
      <ThemedText style={styles.techValue}>{value}</ThemedText>
    </View>
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
  subtitle: {
    fontSize: 16,
    marginTop: Spacing.xs,
  },
  welcomeCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: Spacing.xs,
  },
  welcomeText: {
    fontSize: 15,
    color: '#FFFFFF',
    opacity: 0.9,
    lineHeight: 22,
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
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.sm,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  featureDescription: {
    fontSize: 13,
    marginTop: 2,
  },
  techCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  techItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  techLabel: {
    fontSize: 14,
  },
  techValue: {
    fontSize: 14,
    fontWeight: '500',
  },
});
