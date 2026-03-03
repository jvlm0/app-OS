// src/contexts/ThemeContext.tsx

import { darkColors, lightColors, type AppColors } from '@/theme/colors';
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';

interface ThemeContextType {
  colors: AppColors;
  isDark: boolean;
  /** Alterna entre claro e escuro, sobrescrevendo o tema do sistema. */
  toggleTheme: () => void;
  /** Remove a sobrescrita e volta a seguir o tema do sistema. */
  resetToSystem: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemScheme = useColorScheme();
  const [override, setOverride] = useState<'light' | 'dark' | null>(null);

  const scheme = override ?? systemScheme ?? 'light';
  const isDark = scheme === 'dark';
  const colors = isDark ? darkColors : lightColors;

  const toggleTheme = useCallback(() => {
    setOverride(prev => {
      if (prev === null) return isDark ? 'light' : 'dark';
      return prev === 'dark' ? 'light' : 'dark';
    });
  }, [isDark]);

  const resetToSystem = useCallback(() => setOverride(null), []);

  const value = useMemo(
    () => ({ colors, isDark, toggleTheme, resetToSystem }),
    [colors, isDark, toggleTheme, resetToSystem],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
