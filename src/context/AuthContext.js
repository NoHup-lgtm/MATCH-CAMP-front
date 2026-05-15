import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMe()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await api.login(email, password);
    if (data.session_token) await api.saveToken(data.session_token);
    const me = await api.getMe();
    setUser(me);
    return me;
  }, []);

  const register = useCallback(async (email, password, displayName) => {
    const data = await api.register(email, password, displayName);
    if (data.session_token) await api.saveToken(data.session_token);
    const me = await api.getMe();
    setUser(me);
    return me;
  }, []);

  const logout = useCallback(async () => {
    await api.logout().catch(() => {});
    await api.clearToken();
    setUser(null);
  }, []);

  const refreshMe = useCallback(async () => {
    const me = await api.getMe();
    setUser(me);
    return me;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshMe }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
