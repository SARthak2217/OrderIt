import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import api from '../services/api';

// Icons
import {
  CreditCardIcon,
  TruckIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
  CurrencyRupeeIcon
} from '@heroicons/react/24/outline';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalAmount, discountAmount, finalAmount, appliedCoupons, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Form state
  const [shippingInfo, setShippingInfo] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    landmark: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('razorpay');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!items || items.length === 0) {
      navigate('/cart');
      return;
    }
  }, [isAuthenticated, items, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const required = ['name', 'phone', 'address', 'city', 'state', 'pincode'];
    for (const field of required) {
      if (!shippingInfo[field].trim()) {
        toast.error(`Please enter ${field.charAt(0).toUpperCase() + field.slice(1)}`);
        return false;
      }
    }

    if (!/^\d{10}$/.test(shippingInfo.phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return false;
    }

    if (!/^\d{6}$/.test(shippingInfo.pincode)) {
      toast.error('Please enter a valid 6-digit pincode');
      return false;
    }

    return true;
  };

  const calculatePricing = () => {
    const itemsPrice = totalAmount;
    const shippingPrice = itemsPrice > 500 ? 0 : 50; // Free shipping above ₹500
    const taxPrice = Math.round(itemsPrice * 0.18); // 18% GST
    const totalPrice = itemsPrice + shippingPrice + taxPrice - discountAmount;

    return {
      itemsPrice,
      shippingPrice,
      taxPrice,
      discountAmount,
      totalPrice
    };
  };

  const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calculatePricing();

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      // Check if script is already loaded
      if (window.Razorpay) {
        console.log('Razorpay script already loaded');
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        console.log('Razorpay script loaded successfully');
        resolve(true);
      };
      script.onerror = (error) => {
        console.error('Failed to load Razorpay script:', error);
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!validateForm()) return;

    setPaymentLoading(true);

    try {
      if (paymentMethod === 'razorpay') {
        console.log('Starting Razorpay payment...');
        console.log('Razorpay Key:', process.env.REACT_APP_RAZORPAY_KEY_ID);
        
        const scriptLoaded = await loadRazorpayScript();
        
        if (!scriptLoaded) {
          toast.error('Failed to load payment gateway. Please try again.');
          setPaymentLoading(false);
          return;
        }

        // Create Razorpay order
        console.log('Creating Razorpay order with amount:', totalPrice);
        const { data: orderData } = await api.post('/payment/razorpay/create-order', {
          amount: totalPrice
        });
        
        console.log('Razorpay order created:', orderData);

        const options = {
          key: 'rzp_test_RAi5uQX3MTrzfi', // Hardcoded for testing
          amount: orderData.order.amount,
          currency: 'INR',
          name: 'OrderIt',
          description: 'Order Payment',
          order_id: orderData.order.id,
          handler: async function (response) {
            try {
              console.log('Payment successful:', response);
              
              // Verify payment
              console.log('Starting payment verification...');
              const verificationResponse = await api.post('/payment/razorpay/verify', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              });
              
              console.log('Payment verification response:', verificationResponse.data);

              if (verificationResponse.data.success) {
                console.log('Payment verified successfully, creating order...');
                
                // Create order
                await createOrder({
                  id: response.razorpay_payment_id,
                  status: 'paid',
                  method: 'razorpay',
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature
                });
              } else {
                throw new Error(verificationResponse.data.message || 'Payment verification failed');
              }

            } catch (error) {
              console.error('Payment verification failed:', error);
              console.error('Error details:', error.response?.data);
              toast.error(`Payment verification failed: ${error.response?.data?.message || error.message}`);
              setPaymentLoading(false);
            }
          },
          modal: {
            ondismiss: function() {
              console.log('Payment modal dismissed');
              setPaymentLoading(false);
              toast.error('Payment cancelled');
            }
          },
          prefill: {
            name: shippingInfo.name,
            email: user?.email || '',
            contact: shippingInfo.phone
          },
          theme: {
            color: '#2563eb'
          },
          retry: {
            enabled: true,
            max_count: 3
          }
        };

        console.log('Opening Razorpay with options:', options);
        const razorpay = new window.Razorpay(options);
        
        razorpay.on('payment.failed', function (response) {
          console.error('Payment failed:', response.error);
          toast.error(`Payment failed: ${response.error.description || 'Unknown error'}`);
          setPaymentLoading(false);
        });
        
        razorpay.open();

      } else {
        // Cash on Delivery
        await createOrder({
          id: `cod_${Date.now()}`,
          status: 'pending',
          method: 'cod'
        });
      }

    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.response?.data?.message || 'Payment failed. Please try again.');
    }

    setPaymentLoading(false);
  };

  const createOrder = async (paymentInfo) => {
    try {
      setLoading(true);

      const orderItems = items.map(item => ({
        product: item.product._id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        image: item.product.images[0] || '/placeholder.jpg'
      }));

      const orderData = {
        orderItems,
        shippingInfo,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        discountAmount,
        totalPrice,
        appliedCoupons: appliedCoupons.map(coupon => ({
          code: coupon.code,
          discount: coupon.discount,
          type: coupon.type
        }))
      };

      const { data } = await api.post('/orders', orderData);
      
      toast.success('Order placed successfully!');
      clearCart();
      navigate(`/order-success/${data.order._id}`);

    } catch (error) {
      console.error('Order creation error:', error);
      toast.error(error.response?.data?.message || 'Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/cart')}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Checkout</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Complete your order</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <TruckIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Shipping Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={shippingInfo.name}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <PhoneIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={shippingInfo.phone}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Address *
                  </label>
                  <div className="relative">
                    <MapPinIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <textarea
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                      placeholder="Enter your complete address"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter your city"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={shippingInfo.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter your state"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={shippingInfo.pincode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter pincode"
                    maxLength={6}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    value={shippingInfo.landmark}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter landmark"
                  />
                </div>
              </div>
            </motion.div>

            {/* Payment Method */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <CreditCardIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Payment Method
                </h2>
              </div>

              <div className="space-y-4">
                <label className="flex items-center p-4 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="razorpay"
                    checked={paymentMethod === 'razorpay'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-5 w-5 text-blue-600"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Online Payment</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Pay securely using UPI, Cards, NetBanking
                        </p>
                      </div>
                      <ShieldCheckIcon className="h-6 w-6 text-green-500" />
                    </div>
                  </div>
                </label>

                <label className="flex items-center p-4 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-5 w-5 text-blue-600"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Cash on Delivery</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Pay when your order is delivered
                        </p>
                      </div>
                      <CurrencyRupeeIcon className="h-6 w-6 text-orange-500" />
                    </div>
                  </div>
                </label>
              </div>
            </motion.div>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 h-fit"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Order Summary
            </h2>

            {/* Order Items */}
            <div className="space-y-4 mb-6">
              {items?.map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <img
                    src={item.product.images?.[0] || '/placeholder.jpg'}
                    alt={item.product.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {item.product.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    ₹{(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* Applied Coupons */}
            {appliedCoupons?.length > 0 && (
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Applied Coupons</h3>
                {appliedCoupons.map((coupon, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-green-600 dark:text-green-400">{coupon.code}</span>
                    <span className="text-green-600 dark:text-green-400">
                      -₹{coupon.discount?.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Price Breakdown */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Items Price</span>
                <span className="text-gray-900 dark:text-white">₹{itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                <span className="text-gray-900 dark:text-white">
                  {shippingPrice > 0 ? `₹${shippingPrice.toFixed(2)}` : 'FREE'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Tax (GST 18%)</span>
                <span className="text-gray-900 dark:text-white">₹{taxPrice.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Discount</span>
                  <span className="text-green-600 dark:text-green-400">
                    -₹{discountAmount.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                <span className="font-semibold text-gray-900 dark:text-white">Total</span>
                <span className="font-semibold text-gray-900 dark:text-white text-lg">
                  ₹{totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              onClick={handlePayment}
              disabled={loading || paymentLoading}
              className="w-full mt-6 bg-blue-600 text-white py-4 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {paymentLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                `Place Order - ₹${totalPrice.toFixed(2)}`
              )}
            </button>

            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
              By placing this order, you agree to our terms and conditions
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
