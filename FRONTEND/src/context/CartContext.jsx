import React, { createContext, useContext, useReducer, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const CartContext = createContext();

const initialState = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
  discountAmount: 0,
  finalAmount: 0,
  appliedCoupons: [],
  loading: false,
  error: null
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'SET_CART':
      return {
        ...state,
        ...action.payload,
        loading: false,
        error: null
      };
    case 'ADD_ITEM':
      return {
        ...state,
        items: action.payload.items,
        totalItems: action.payload.totalItems,
        totalAmount: action.payload.totalAmount,
        finalAmount: action.payload.finalAmount
      };
    case 'UPDATE_ITEM':
      return {
        ...state,
        items: action.payload.items,
        totalItems: action.payload.totalItems,
        totalAmount: action.payload.totalAmount,
        finalAmount: action.payload.finalAmount
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: action.payload.items,
        totalItems: action.payload.totalItems,
        totalAmount: action.payload.totalAmount,
        finalAmount: action.payload.finalAmount
      };
    case 'CLEAR_CART':
      return {
        ...initialState,
        loading: false
      };
    case 'APPLY_COUPON':
      return {
        ...state,
        appliedCoupons: action.payload.appliedCoupons,
        discountAmount: action.payload.discountAmount,
        finalAmount: action.payload.finalAmount
      };
    case 'REMOVE_COUPON':
      return {
        ...state,
        appliedCoupons: action.payload.appliedCoupons,
        discountAmount: action.payload.discountAmount,
        finalAmount: action.payload.finalAmount
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { isAuthenticated } = useAuth();

  // Load cart when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    }
  }, [isAuthenticated]);

  const loadCart = async () => {
    try {
      const response = await api.get('/cart');
      
      if (response.data.success) {
        const cart = response.data.cart;
        dispatch({
          type: 'SET_CART',
          payload: {
            items: cart.items || [],
            totalItems: cart.totalItems || 0,
            totalAmount: cart.totalAmount || 0,
            discountAmount: cart.discountAmount || 0,
            finalAmount: cart.finalAmount || 0,
            appliedCoupons: cart.appliedCoupons || []
          }
        });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to load cart' });
    }
  };

  // Add item to cart
  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return { success: false };
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await api.post('/cart/add', {
        productId,
        quantity
      });

      if (response.data.success) {
        const cart = response.data.cart;
        dispatch({
          type: 'ADD_ITEM',
          payload: {
            items: cart.items,
            totalItems: cart.totalItems,
            totalAmount: cart.totalAmount,
            finalAmount: cart.finalAmount
          }
        });
        
        toast.success('Item added to cart');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add item to cart';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      return { success: false, message };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Update item quantity in cart
  const updateCartItem = async (productId, quantity) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await api.put(`/cart/update/${productId}`, {
        quantity
      });

      if (response.data.success) {
        const cart = response.data.cart;
        dispatch({
          type: 'UPDATE_ITEM',
          payload: {
            items: cart.items,
            totalItems: cart.totalItems,
            totalAmount: cart.totalAmount,
            finalAmount: cart.finalAmount
          }
        });
        
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update cart item';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      return { success: false, message };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await api.delete(`/cart/remove/${productId}`);

      if (response.data.success) {
        const cart = response.data.cart;
        dispatch({
          type: 'REMOVE_ITEM',
          payload: {
            items: cart.items,
            totalItems: cart.totalItems,
            totalAmount: cart.totalAmount,
            finalAmount: cart.finalAmount
          }
        });
        
        toast.success('Item removed from cart');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to remove item from cart';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      return { success: false, message };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    try {
      const response = await api.delete('/cart/clear');

      if (response.data.success) {
        dispatch({ type: 'CLEAR_CART' });
        toast.success('Cart cleared');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to clear cart';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Apply coupon to cart
  const applyCoupon = async (couponCode) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await api.post('/cart/coupon/apply', {
        couponCode
      });

      if (response.data.success) {
        const cart = response.data.cart;
        dispatch({
          type: 'APPLY_COUPON',
          payload: {
            appliedCoupons: cart.appliedCoupons,
            discountAmount: cart.discountAmount,
            finalAmount: cart.finalAmount
          }
        });
        
        toast.success('Coupon applied successfully');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to apply coupon';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      return { success: false, message };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Remove coupon from cart
  const removeCoupon = async (couponCode) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await api.post('/cart/coupon/remove', {
        couponCode
      });

      if (response.data.success) {
        const cart = response.data.cart;
        dispatch({
          type: 'REMOVE_COUPON',
          payload: {
            appliedCoupons: cart.appliedCoupons,
            discountAmount: cart.discountAmount,
            finalAmount: cart.finalAmount
          }
        });
        
        toast.success('Coupon removed');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to remove coupon';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      return { success: false, message };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Get cart item count for specific product
  const getItemQuantity = (productId) => {
    const item = state.items.find(item => item.product?._id === productId);
    return item ? item.quantity : 0;
  };

  // Check if product is in cart
  const isInCart = (productId) => {
    return state.items.some(item => item.product?._id === productId);
  };

  const value = {
    ...state,
    loadCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
    getItemQuantity,
    isInCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
