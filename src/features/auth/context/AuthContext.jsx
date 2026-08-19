import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

const USER_STORAGE_KEY = 'app_user';
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to extract user safely regardless of backend envelope shape
  const extractUser = (responseData) => {
    if (!responseData) return null;
    const payload = responseData.result || responseData.data || responseData;
    return payload.user || payload;
  };

  // Safe boot check with defensive parsing
  useEffect(() => {
    try {
      const storedUser = authService.getUser();
      if (storedUser && authService.isAuthenticated()) {
        setUser(storedUser);
      } else {
        // Clear stale/expired sessions
        authService.logout();
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to parse auth session on boot:', error);
      authService.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await authService.login(email, password);
      const userObj = extractUser(response);
      setUser(userObj);
      return userObj;
    } finally {
      setLoading(false);
    }
  };

  const driverLogin = async (credentials) => {
    setLoading(true);
    try {
      const response = await authService.driverLogin(credentials);
      const userObj = extractUser(response);
      setUser(userObj);
      return userObj;
    } finally {
      setLoading(false);
    }
  };

  const driverLoginAlt = async (credentials) => {
    setLoading(true);
    try {
      const response = await authService.driverLoginAlt(credentials);
      const userObj = extractUser(response);
      setUser(userObj);
      return userObj;
    } finally {
      setLoading(false);
    }
  };

  // Allows manual state refresh after updating driver/staff details dynamically
  const updateUserProfile = useCallback((updatedFields) => {
    setUser((prevUser) => {
      const newUser = { ...prevUser, ...updatedFields };
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
      return newUser;
    });
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user && authService.isAuthenticated(),
    login,
    driverLogin,
    driverLoginAlt,
    updateUserProfile,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
