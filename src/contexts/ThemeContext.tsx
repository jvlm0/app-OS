// src/contexts/ThemeContext.tsx

import { darkColors, lightBlueColors, lightColors, type AppColors, type ThemeName } from '@/theme/colors';
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

interface ThemeContextType {
  colors: AppColors;
  themeName: ThemeName;
  isDark: boolean;
  /** Define um tema específico pelo nome. */
  setTheme: (name: ThemeName) => void;
  /** Alterna entre light ↔ dark (ignora lightBlue). */
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themeMap: Record<ThemeName, AppColors> = {
  light:     lightColors,
  dark:      darkColors,
  lightBlue: lightBlueColors,
};

// ─── Tema padrão ao iniciar o app ─────────────────────────────────────────────
const DEFAULT_THEME: ThemeName = 'light';

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [themeName, setThemeName] = useState<ThemeName>(DEFAULT_THEME);

  const colors = themeMap[themeName];
  const isDark = themeName === 'dark';

  const setTheme = useCallback((name: ThemeName) => setThemeName(name), []);

  const toggleTheme = useCallback(() => {
    setThemeName(prev => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const value = useMemo(
    () => ({ colors, themeName, isDark, setTheme, toggleTheme }),
    [colors, themeName, isDark, setTheme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
