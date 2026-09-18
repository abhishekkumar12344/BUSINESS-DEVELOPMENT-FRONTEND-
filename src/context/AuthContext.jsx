import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import api, { readError } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('nisha_token');
    if (!token) {
      setChecking(false);
      return;
    }
    api
      .get('/auth/me')
      .then(({ data }) => setUser(data.user))
      .catch(() => localStorage.removeItem('nisha_token'))
      .finally(() => setChecking(false));
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('nisha_token', data.token);
      setUser(data.user);
      return { ok: true, user: data.user };
    } catch (error) {
      return { ok: false, message: readError(error, 'Email or password is incorrect.') };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      /* the session is ending either way */
    }
    localStorage.removeItem('nisha_token');
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      setUser,
      checking,
      login,
      logout,
      isSuperAdmin: user?.role === 'SUPER_ADMIN',
      can: (...roles) => (user ? roles.includes(user.role) : false)
    }),
    [user, checking, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
