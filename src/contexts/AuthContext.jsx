import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = 'http://localhost:5000/api';

  // Token bilan API so'rovlari
  const apiRequest = async (url, options = {}) => {
    const token = localStorage.getItem('swiftchat_token');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (options.body) {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(`${API_URL}${url}`, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Server xatosi');
      }

      return data;
    } catch (error) {
      throw error;
    }
  };

  const login = async (credentials) => {
    try {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: credentials,
      });

      if (data.success) {
        setUser(data.data.user);
        setIsAuthenticated(true);
        localStorage.setItem('swiftchat_token', data.data.token);
        localStorage.setItem('swiftchat_user', JSON.stringify(data.data.user));
        return { success: true };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Login xatosi' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const data = await apiRequest('/auth/register', {
        method: 'POST',
        body: userData,
      });

      if (data.success) {
        setUser(data.data.user);
        setIsAuthenticated(true);
        localStorage.setItem('swiftchat_token', data.data.token);
        localStorage.setItem('swiftchat_user', JSON.stringify(data.data.user));
        return { success: true };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Ro\'yxatdan o\'tish xatosi' 
      };
    }
  };

  const logout = async () => {
    try {
      await apiRequest('/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('swiftchat_token');
      localStorage.removeItem('swiftchat_user');
    }
  };

  const checkAuth = async () => {
    const token = localStorage.getItem('swiftchat_token');
    const savedUser = localStorage.getItem('swiftchat_user');

    if (!token || !savedUser) {
      setIsLoading(false);
      return;
    }

    try {
      const data = await apiRequest('/auth/me');
      if (data.success) {
        setUser(data.data.user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('swiftchat_token');
      localStorage.removeItem('swiftchat_user');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    apiRequest
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};