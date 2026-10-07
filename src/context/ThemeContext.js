import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api.js';
import { useAuth } from './AuthContext.js';
import { useThemeEffect } from './ToastContext.js';

const ThemeContext = createContext(null);

export const ACCENTS = [
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Violet', value: '#8b5cf6' },
  { name: 'Sky', value: '#0ea5e9' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Rose', value: '#f43f5e' },
];

const LOCAL_KEY = 'taskflow.theme';

export function ThemeProvider({ children }) {
  const { settings, setSettings } = useAuth();
  const [theme, setTheme] = useState(() => localStorage.getItem(LOCAL_KEY) || 'system');
  const [accent, setAccent] = useState(ACCENTS[0].value);

  // Keep local state in sync with whatever the server returned.
  useEffect(() => {
    if (settings?.theme) setTheme(settings.theme);
    if (settings?.accentColor) setAccent(settings.accentColor);
  }, [settings]);

  useThemeEffect(theme);

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', accent);
  }, [accent]);

  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, theme);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      accent,
      accents: ACCENTS,
      /** Update locally and persist for signed-in users. */
      async update(patch) {
        if (patch.theme) setTheme(patch.theme);
        if (patch.accentColor) setAccent(patch.accentColor);
        if (!settings) return;
        try {
          const saved = await api('/settings', { method: 'PATCH', body: patch });
          setSettings(saved);
        } catch {
          /* keep the local change even if persistence fails */
        }
      },
    }),
    [theme, accent, settings, setSettings]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used inside a ThemeProvider');
  return context;
}
