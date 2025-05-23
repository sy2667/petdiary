// src/theme/ThemeContext.tsx
import React, { createContext, useEffect, useState } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextProps {
  mode: ThemeMode;
  theme: 'light' | 'dark';
  setMode: (mode: ThemeMode) => void;
}

export const ThemeContext = createContext<ThemeContextProps>({
  mode: 'system',
  theme: 'light',
  setMode: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setModeState] = useState<ThemeMode>('system');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const loadTheme = async () => {
      const stored = await AsyncStorage.getItem('themeMode');
      const initial = (stored as ThemeMode) || 'system';
      applyTheme(initial);
    };
    loadTheme();
  }, []);

  const applyTheme = (newMode: ThemeMode) => {
    setModeState(newMode);
    AsyncStorage.setItem('themeMode', newMode);

    if (newMode === 'system') {
      const systemTheme = Appearance.getColorScheme() || 'light';
      setTheme(systemTheme);
    } else {
      setTheme(newMode);
    }
  };

  return (
    <ThemeContext.Provider value={{ mode, theme, setMode: applyTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
