import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
    case 'REGISTER_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case 'LOGIN_FAIL':
    case 'REGISTER_FAIL':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null
      };
    case 'LOAD_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false
      };
    case 'CLEAR_LOADING':
      return {
        ...state,
        loading: false
      };
    case 'UPDATE_PROFILE':
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
    default:
      return state;
  }
};

// Set up axios defaults
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
axios.defaults.baseURL = API_BASE_URL;

// Add token to requests if available
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle unauthorized responses
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user from token on app start
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('/auth/profile');
          dispatch({ type: 'LOAD_USER', payload: response.data.user });
        } catch (error) {
          localStorage.removeItem('token');
          dispatch({ type: 'CLEAR_LOADING' });
        }
      } else {
        dispatch({ type: 'CLEAR_LOADING' });
      }
    };

    loadUser();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      console.log('🔐 Login attempt started:', { email });
      console.log('🌍 API Base URL:', API_BASE_URL);
      
      dispatch({ type: 'LOGIN_START' });
      
      const response = await axios.post('/auth/login', {
        email,
        password
      });

      console.log('✅ Login response received:', response.data);

      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user } });
      
      toast.success(`Welcome back, ${user.name}!`);
      return { success: true };
    } catch (error) {
      console.error('❌ Login error:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config
      });
      
      const message = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'LOGIN_FAIL', payload: message });
      toast.error(message);
      return { success: false, message };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      dispatch({ type: 'REGISTER_START' });
      
      const response = await axios.post('/auth/register', userData);
      
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      dispatch({ type: 'REGISTER_SUCCESS', payload: { user } });
      
      toast.success(`Welcome to OrderIt, ${user.name}!`);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      dispatch({ type: 'REGISTER_FAIL', payload: message });
      toast.error(message);
      return { success: false, message };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await axios.post('/auth/logout');
    } catch (error) {
      // Continue with logout even if API call fails
    }
    
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
    toast.success('Logged out successfully');
  };

  // Update profile function
  const updateProfile = async (profileData) => {
    try {
      const response = await axios.put('/auth/profile', profileData);
      
      dispatch({ type: 'UPDATE_PROFILE', payload: response.data.user });
      toast.success('Profile updated successfully');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Add address function
  const addAddress = async (addressData) => {
    try {
      const response = await axios.post('/auth/address', addressData);
      
      dispatch({ 
        type: 'UPDATE_PROFILE', 
        payload: { addresses: response.data.addresses } 
      });
      toast.success('Address added successfully');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add address';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Update address function
  const updateAddress = async (addressId, addressData) => {
    try {
      const response = await axios.put(`/auth/address/${addressId}`, addressData);
      
      dispatch({ 
        type: 'UPDATE_PROFILE', 
        payload: { addresses: response.data.addresses } 
      });
      toast.success('Address updated successfully');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update address';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Delete address function
  const deleteAddress = async (addressId) => {
    try {
      const response = await axios.delete(`/auth/address/${addressId}`);
      
      dispatch({ 
        type: 'UPDATE_PROFILE', 
        payload: { addresses: response.data.addresses } 
      });
      toast.success('Address deleted successfully');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete address';
      toast.error(message);
      return { success: false, message };
    }
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    addAddress,
    updateAddress,
    deleteAddress
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
