/**
 * App Settings Context
 *
 * Provides global app settings for debugging.
 * - Offline mode simulation for testing error states
 */

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { setOfflineMode as setNetworkOfflineMode } from '@/lib/networkState';

interface AppSettings {
  isOfflineMode: boolean;
}

interface AppSettingsContextType extends AppSettings {
  setOfflineMode: (enabled: boolean) => void;
  toggleOfflineMode: () => void;
}

const defaultSettings: AppSettings = {
  isOfflineMode: false,
};

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined);

export function AppSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  // Sync offline mode state with the network module
  useEffect(() => {
    setNetworkOfflineMode(settings.isOfflineMode);
  }, [settings.isOfflineMode]);

  const setOfflineMode = useCallback((enabled: boolean) => {
    setSettings((prev) => ({ ...prev, isOfflineMode: enabled }));
  }, []);

  const toggleOfflineMode = useCallback(() => {
    setSettings((prev) => ({ ...prev, isOfflineMode: !prev.isOfflineMode }));
  }, []);

  const value = useMemo(
    () => ({
      ...settings,
      setOfflineMode,
      toggleOfflineMode,
    }),
    [settings, setOfflineMode, toggleOfflineMode]
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
