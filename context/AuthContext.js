'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '@/lib/api';
import jwtDecode from 'jwt-decode';


const AuthContext = createContext({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  refreshProfile: async () => {},
  isAuthenticated: false,
  isAdmin: false,
  isApplicant: false,
});


export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    try {
      const tokens = JSON.parse(localStorage.getItem('tokens') || '{}');
      if (tokens.access) {
        const decoded = jwtDecode(tokens.access);
        if (decoded.exp * 1000 > Date.now()) {
          const res = await authAPI.getProfile();
          setUser(res.data);
        } else {
          localStorage.removeItem('tokens');
          localStorage.removeItem('user');
        }
      }
    } catch (err) {
      localStorage.removeItem('tokens');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    const { access, refresh } = res.data;
    localStorage.setItem('tokens', JSON.stringify({ access, refresh }));
    const userData = res.data.user;
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const register = async (data) => {
    const res = await authAPI.register(data);
    const { access, refresh } = res.data.tokens;
    localStorage.setItem('tokens', JSON.stringify({ access, refresh }));
    const userData = res.data.user;
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = async () => {
    try {
      const tokens = JSON.parse(localStorage.getItem('tokens') || '{}');
      if (tokens.refresh) {
        await authAPI.logout({ refresh: tokens.refresh });
      }
    } catch (err) {
      // Ignore logout errors
    }
    localStorage.removeItem('tokens');
    localStorage.removeItem('user');
    setUser(null);
  };

  const refreshProfile = async () => {
    try {
      const res = await authAPI.getProfile();
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
    } catch (err) {
      // Handle error
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refreshProfile,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isApplicant: user?.role === 'applicant',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);