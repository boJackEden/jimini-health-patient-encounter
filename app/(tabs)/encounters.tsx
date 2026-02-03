import { useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';

import { EncounterCard } from '@/components/encounters/EncounterCard';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  useEncountersInfinite,
  flattenEncounterPages,
} from '@/hooks/useEncounters';
import { Encounter } from '@/types/encounters';

export default function EncountersScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useEncountersInfinite();

  const { encounters, total } = flattenEncounterPages(data);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleEncounterPress = useCallback((encounter: Encounter) => {
    // TODO: Navigate to encounter detail
    console.log('Encounter pressed:', encounter.id);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Encounter }) => (
      <EncounterCard
        encounter={item}
        onPress={() => handleEncounterPress(item)}
      />
    ),
    [handleEncounterPress]
  );

  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  }, [isFetchingNextPage, colors.primary]);

  const renderEmpty = useCallback(() => {
    if (isLoading) return null;
    return (
      <View style={styles.emptyContainer}>
        <IconSymbol
          name="list.bullet.clipboard"
          size={64}
          color={colors.textSecondary}
        />
        <ThemedText style={[styles.emptyTitle, { color: colors.text }]}>
          No Encounters
        </ThemedText>
        <ThemedText style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
          Patient encounters will appear here
        </ThemedText>
      </View>
    );
  }, [isLoading, colors]);

  // Loading state
  if (isLoading) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <ThemedText style={[styles.loadingText, { color: colors.textSecondary }]}>
          Loading encounters...
        </ThemedText>
      </ThemedView>
    );
  }

  // Error state
  if (isError) {
    return (
      <ThemedView style={styles.centerContainer}>
        <IconSymbol
          name="exclamationmark.triangle"
          size={64}
          color={colors.error}
        />
        <ThemedText style={[styles.errorTitle, { color: colors.text }]}>
          Failed to Load
        </ThemedText>
        <ThemedText style={[styles.errorMessage, { color: colors.textSecondary }]}>
          {error?.message || 'An unexpected error occurred'}
        </ThemedText>
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
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <ThemedText type="title" style={styles.title}>
          Encounters
        </ThemedText>
        <ThemedText style={[styles.count, { color: colors.textSecondary }]}>
          {total} total
        </ThemedText>
      </View>

      <FlatList
        data={encounters}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching && !isFetchingNextPage}
            onRefresh={refetch}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
  },
  title: {
    marginBottom: Spacing.xs,
  },
  count: {
    fontSize: 14,
  },
  listContent: {
    paddingVertical: Spacing.sm,
    flexGrow: 1,
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
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
    gap: Spacing.sm,
  },
  retryText: {
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: Spacing.md,
  },
  emptySubtitle: {
    fontSize: 14,
    marginTop: Spacing.sm,
  },
});
