import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api, getToken, setToken } from '../lib/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(Boolean(getToken()));

  useEffect(() => {
    if (!getToken()) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    api('/auth/me')
      .then((data) => {
        if (!cancelled) {
          setUser(data.user);
          setSettings(data.settings);
        }
      })
      .catch(() => {
        setToken(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      settings,
      setSettings,
      loading,
      async login(email, password) {
        const data = await api('/auth/login', { method: 'POST', body: { email, password } });
        setToken(data.token);
        setUser(data.user);
        setSettings(data.settings);
        return data.user;
      },
      async register(payload) {
        const data = await api('/auth/register', { method: 'POST', body: payload });
        setToken(data.token);
        setUser(data.user);
        setSettings(data.settings);
        return data.user;
      },
      logout() {
        setToken(null);
        setUser(null);
        setSettings(null);
      },
      async refreshProfile() {
        const data = await api('/auth/me');
        setUser(data.user);
        setSettings(data.settings);
      },
    }),
    [user, settings, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return context;
}
