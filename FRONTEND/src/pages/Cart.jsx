import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

// Icons
import { 
  ShoppingCartIcon,
  TrashIcon,
  MinusIcon,
  PlusIcon,
  ArrowLeftIcon,
  TagIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Cart = () => {
  const navigate = useNavigate();
  const { 
    items, 
    totalItems, 
    totalAmount, 
    discountAmount, 
    finalAmount, 
    appliedCoupons,
    loading,
    updateCartItem,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
    loadCart
  } = useCart();
  
  const { isAuthenticated } = useAuth();
  const [couponCode, setCouponCode] = useState('');
  const [applyCouponLoading, setApplyCouponLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    }
  }, [isAuthenticated]);

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    await updateCartItem(productId, newQuantity);
  };

  const handleRemoveItem = async (productId) => {
    await removeFromCart(productId);
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      await clearCart();
    }
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    
    setApplyCouponLoading(true);
    const result = await applyCoupon(couponCode.trim());
    if (result.success) {
      setCouponCode('');
    }
    setApplyCouponLoading(false);
  };

  const handleRemoveCoupon = async (couponCode) => {
    await removeCoupon(couponCode);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <ShoppingCartIcon className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Please Login to View Cart
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              You need to be logged in to access your shopping cart.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Login to Continue
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading && items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-400 mt-4">Loading cart...</p>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <ShoppingCartIcon className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Your Cart is Empty
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Shopping Cart</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
          <div className="flex space-x-4">
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Continue Shopping
            </Link>
            {items.length > 0 && (
              <button
                onClick={handleClearCart}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30"
              >
                <TrashIcon className="w-4 h-4 mr-2" />
                Clear Cart
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
                >
                  <div className="flex items-center space-x-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.product.images?.[0]?.url || 'https://via.placeholder.com/100x100?text=No+Image'}
                        alt={item.product.name}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {item.product.brand}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                          ₹{item.product.price?.toLocaleString()}
                        </span>
                        {item.product.originalPrice && item.product.originalPrice > item.product.price && (
                          <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                            ₹{item.product.originalPrice?.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                        disabled={item.quantity <= 1 || loading}
                        className="p-1 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <MinusIcon className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-medium text-gray-900 dark:text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                        disabled={loading}
                        className="p-1 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <PlusIcon className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Item Total & Remove */}
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        ₹{(item.product.price * item.quantity).toLocaleString()}
                      </p>
                      <button
                        onClick={() => handleRemoveItem(item.product._id)}
                        disabled={loading}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Order Summary</h2>
              
              {/* Coupon Section */}
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                  <TagIcon className="w-4 h-4 mr-2" />
                  Apply Coupon
                </h3>
                <form onSubmit={handleApplyCoupon} className="flex space-x-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  />
                  <button
                    type="submit"
                    disabled={applyCouponLoading || !couponCode.trim()}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {applyCouponLoading ? 'Applying...' : 'Apply'}
                  </button>
                </form>

                {/* Applied Coupons */}
                {appliedCoupons && appliedCoupons.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {appliedCoupons.map((coupon) => (
                      <div
                        key={coupon.code}
                        className="flex items-center justify-between p-2 bg-green-100 dark:bg-green-900/20 rounded-md"
                      >
                        <div className="flex items-center">
                          <TagIcon className="w-4 h-4 text-green-600 dark:text-green-400 mr-2" />
                          <span className="text-sm font-medium text-green-800 dark:text-green-200">
                            {coupon.code}
                          </span>
                        </div>
                        <button
                          onClick={() => handleRemoveCoupon(coupon.code)}
                          className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal ({totalItems} items)</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ₹{totalAmount?.toLocaleString()}
                  </span>
                </div>
                
                {discountAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-green-600 dark:text-green-400">Discount</span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      -₹{discountAmount?.toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                  <span className="font-medium text-green-600 dark:text-green-400">Free</span>
                </div>
                
                <hr className="border-gray-200 dark:border-gray-600" />
                
                <div className="flex justify-between text-lg">
                  <span className="font-bold text-gray-900 dark:text-white">Total</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    ₹{finalAmount?.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout
              </button>

              <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
                Secure checkout powered by OrderIt
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
