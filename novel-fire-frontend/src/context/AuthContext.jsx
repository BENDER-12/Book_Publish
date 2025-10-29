/**
 * Authentication Context
 * 
 * Provides authentication state and methods throughout the application.
 * Manages user login, registration, logout, and persistent sessions.
 * 
 * Features:
 * - JWT token management
 * - Persistent authentication via localStorage
 * - Loading states during auth operations
 * - Error handling for auth failures
 * - Automatic token refresh
 */

import { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../api/auth';

// Create authentication context
const AuthContext = createContext();

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload,
      };
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: null,
        pendingVerification: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        error: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

// Initial state
const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: true,
  error: null,
  pendingVerification: null,
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing token on app load (hydrate auth state)
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      const parsedUser = JSON.parse(user);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          token,
          user: {
            _id: parsedUser._id,
            name: parsedUser.name,
            email: parsedUser.email,
            role: parsedUser.role,
          },
        },
      });
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
      return;
    }
    // In either case, end hydration loading
    dispatch({ type: 'SET_LOADING', payload: false });
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      
      const data = await authAPI.login(credentials);
      
      // Store in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
      }));
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          token: data.token,
          user: {
            _id: data._id,
            name: data.name,
            email: data.email,
            role: data.role,
          },
        },
      });
      
      return data;
    } catch (error) {
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: error.response?.data?.message || 'Login failed',
      });
      throw error;
    }
  };

  // Register function (Step 1: Send OTP)
  const register = async (userData) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      
      const data = await authAPI.register(userData);
      
      // Don't store token yet - user needs to verify OTP first
      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: {
          userId: data.userId,
          email: data.email,
          requiresVerification: data.requiresVerification,
        },
      });
      
      return data;
    } catch (error) {
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: error.response?.data?.message || 'Registration failed',
      });
      throw error;
    }
  };

  // Verify OTP function
  const verifyOTP = async (userId, otp) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      
      const data = await authAPI.verifyOTP(userId, otp);
      
      // Store in localStorage after successful verification
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
      }));
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          token: data.token,
          user: {
            _id: data._id,
            name: data.name,
            email: data.email,
            role: data.role,
          },
        },
      });
      
      return data;
    } catch (error) {
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: error.response?.data?.message || 'OTP verification failed',
      });
      throw error;
    }
  };

  // Resend OTP function
  const resendOTP = async (userId) => {
    try {
      const data = await authAPI.resendOTP(userId);
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  // Update user function
  const updateUser = (userData) => {
    const updatedUser = { ...state.user, ...userData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    dispatch({ type: 'UPDATE_USER', payload: updatedUser });
  };

  const value = {
    ...state,
    login,
    register,
    verifyOTP,
    resendOTP,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};