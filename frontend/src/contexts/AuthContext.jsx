import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(Cookies.get('authToken'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Axios instance with auth header  
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  });

  // Add auth header to all requests if token exists
  api.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Handle token expiration
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        logout();
      }
      return Promise.reject(error);
    }
  );

  // Error will persist until manually cleared or login attempt

  // Verify token on app load
  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const response = await api.get('/auth/verify');
          if (response.data.success) {
            setUser(response.data.data.user);
          } else {
            Cookies.remove('authToken');
            setToken(null);
          }
        } catch (error) {
          Cookies.remove('authToken');
          setToken(null);
        }
      }
      setLoading(false);
    };

    verifyToken();
  }, [token]);

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data.success) {
        const { user: userData, token: userToken } = response.data.data;
        
        setUser(userData);
        setToken(userToken);
        // Store token in secure cookie (7 days expiration)
        Cookies.set('authToken', userToken, { 
          expires: 7, 
          secure: process.env.NODE_ENV === 'production', 
          sameSite: 'strict' 
        });
        
        return { success: true };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (name, email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/auth/register', { name, email, password });
      
      if (response.data.success) {
        const { user: userData, token: userToken } = response.data.data;
        
        setUser(userData);
        setToken(userToken);
        // Store token in secure cookie (7 days expiration)
        Cookies.set('authToken', userToken, { 
          expires: 7, 
          secure: process.env.NODE_ENV === 'production', 
          sameSite: 'strict' 
        });
        
        return { success: true };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                           error.response?.data?.errors?.join(', ') || 
                           'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Call logout endpoint if user is logged in
      if (token) {
        await api.post('/auth/logout');
      }
    } catch (error) {
      // API call failed, but we'll still clear local state
    } finally {
      // Clear local state regardless of API call result
      setUser(null);
      setToken(null);
      Cookies.remove('authToken');
    }
  };

  // Update profile function
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.put('/auth/profile', profileData);
      
      if (response.data.success) {
        setUser(response.data.data.user);
        return { success: true };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                           error.response?.data?.errors?.join(', ') || 
                           'Profile update failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Get fresh user data
  const refreshUser = async () => {
    try {
      const response = await api.get('/auth/profile');
      if (response.data.success) {
        setUser(response.data.data.user);
      }
    } catch (error) {
      // Failed to refresh user data, user state remains unchanged
    }
  };

  const value = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    refreshUser,
    api,
    isAuthenticated: !!token && !!user,
    clearError: () => setError(null)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};