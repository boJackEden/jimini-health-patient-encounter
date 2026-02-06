import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { AppSettingsProvider, useAppSettings } from '@/contexts/AppSettingsContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getQueryClient } from '@/lib/queryClient';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutNav() {
  const systemColorScheme = useColorScheme();
  const { themeMode } = useAppSettings();

  // Use theme override if set, otherwise use system
  const colorScheme = themeMode === 'system' ? systemColorScheme : themeMode;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="encounter/[id]" options={{ headerBackTitle: 'Back' }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const queryClient = getQueryClient();

  return (
    <AppSettingsProvider>
      <QueryClientProvider client={queryClient}>
        <RootLayoutNav />
      </QueryClientProvider>
    </AppSettingsProvider>
  );
}
