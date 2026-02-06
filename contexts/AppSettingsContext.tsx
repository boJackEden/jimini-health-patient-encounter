/**
 * App Settings Context
 *
 * Provides global app settings for debugging and user preferences.
 * - Theme override (light/dark/system)
 * - Offline mode simulation for testing error states
 */

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { setOfflineMode as setNetworkOfflineMode } from '@/lib/networkState';

type ThemeMode = 'system' | 'light' | 'dark';

interface AppSettings {
  themeMode: ThemeMode;
  isOfflineMode: boolean;
}

interface AppSettingsContextType extends AppSettings {
  setThemeMode: (mode: ThemeMode) => void;
  setOfflineMode: (enabled: boolean) => void;
  toggleOfflineMode: () => void;
}

const defaultSettings: AppSettings = {
  themeMode: 'system',
  isOfflineMode: false,
};

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined);

export function AppSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  // Sync offline mode state with the network module
  useEffect(() => {
    setNetworkOfflineMode(settings.isOfflineMode);
  }, [settings.isOfflineMode]);

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setSettings((prev) => ({ ...prev, themeMode: mode }));
  }, []);

  const setOfflineMode = useCallback((enabled: boolean) => {
    setSettings((prev) => ({ ...prev, isOfflineMode: enabled }));
  }, []);

  const toggleOfflineMode = useCallback(() => {
    setSettings((prev) => ({ ...prev, isOfflineMode: !prev.isOfflineMode }));
  }, []);

  const value = useMemo(
    () => ({
      ...settings,
      setThemeMode,
      setOfflineMode,
      toggleOfflineMode,
    }),
    [settings, setThemeMode, setOfflineMode, toggleOfflineMode]
  );

  return (
    <AppSettingsContext.Provider value={value}>
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings(): AppSettingsContextType {
  const context = useContext(AppSettingsContext);
  if (!context) {
    throw new Error('useAppSettings must be used within an AppSettingsProvider');
  }
  return context;
}

/**
 * Hook to get the effective color scheme based on settings
 * Returns the theme mode override, or undefined to use system default
 */
export function useThemeOverride(): 'light' | 'dark' | undefined {
  const { themeMode } = useAppSettings();
  if (themeMode === 'system') {
    return undefined;
  }
  return themeMode;
}
