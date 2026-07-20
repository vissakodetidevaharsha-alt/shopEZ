import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api';
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from token or stored user on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const role = (decoded.role || (decoded.isAdmin ? 'admin' : 'user')).toString().toLowerCase();
        setUser({ token, ...decoded, role });
      } catch (err) {
        console.error('Invalid token');
        localStorage.removeItem('token');
      }
    } else {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (_) {}
      }
    }
    setLoading(false);
  }, []);

const login = async (email, password) => {
  const { data } = await API.post('/auth/login', { email, password });

  if (data.success) {
    localStorage.setItem('token', data.token);

    const decoded = jwtDecode(data.token);

    const role = (
      data.user?.role ||
      decoded.role ||
      (decoded.isAdmin ? 'admin' : 'user')
    )
      .toString()
      .toLowerCase();

    const userInfo = {
      ...(data.user || {}),
      ...decoded,
      token: data.token,
      role,
      name: data.user?.name || decoded.name || '',
      email: data.user?.email || decoded.email || email,
    };

    localStorage.setItem('user', JSON.stringify(userInfo));
    setUser(userInfo);
  }

  return data;
};

  const register = async (name, email, password) => {
  const { data } = await API.post("/auth/register", {
    name,
    email,
    password,
  });

  if (data.success) {
    localStorage.setItem("token", data.token);

    const decoded = jwtDecode(data.token);

    const role = (
      data.user?.role ||
      decoded.role ||
      (decoded.isAdmin ? "admin" : "user")
    )
      .toString()
      .toLowerCase();

    const userInfo = {
      ...(data.user || {}),
      ...decoded,
      token: data.token,
      role,
      name: data.user?.name || decoded.name || name,
      email: data.user?.email || decoded.email || email,
    };

    localStorage.setItem("user", JSON.stringify(userInfo));
    setUser(userInfo);
  }

  return data;
};

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  setUser(null);
};

return (
  <AuthContext.Provider value={{ user, loading, login, register, logout }}>
    {children}
  </AuthContext.Provider>
);
};
