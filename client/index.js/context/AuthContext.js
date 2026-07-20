import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user profile if token is available
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const res = await API.get('/auth/profile');
          if (res.data && res.data.success) {
            setUser(res.data.user);
          } else {
            // Invalid token
            logout();
          }
        } catch (err) {
          console.error('Error loading user profile:', err);
          logout();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  // Login handler
  const login = async (email, password) => {
    setError(null);
    try {
      const res = await API.post('/auth/login', { email, password });
      if (res.data && res.data.success) {
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true, user: res.data.user };
      }
    } catch (err) {
      const msg = err.response && err.response.data && err.response.data.message
        ? err.response.data.message
        : 'Login failed. Please check your credentials.';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  // Register handler
  const register = async (name, email, password) => {
    setError(null);
    try {
      const res = await API.post('/auth/register', { name, email, password });
      if (res.data && res.data.success) {
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true, user: res.data.user };
      }
    } catch (err) {
      const msg = err.response && err.response.data && err.response.data.message
        ? err.response.data.message
        : 'Registration failed.';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setError(null);
  };

  // Update profile handler
  const updateProfile = async (profileData) => {
    setError(null);
    try {
      const res = await API.put('/auth/profile', profileData);
      if (res.data && res.data.success) {
        setUser(res.data.user);
        return { success: true, user: res.data.user };
      }
    } catch (err) {
      const msg = err.response && err.response.data && err.response.data.message
        ? err.response.data.message
        : 'Profile update failed.';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
        setError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
