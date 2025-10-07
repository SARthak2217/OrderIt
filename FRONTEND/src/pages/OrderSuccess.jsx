import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import toast from 'react-hot-toast';

// Icons
import {
  CheckCircleIcon,
  TruckIcon,
  ShoppingCartIcon,
  DocumentTextIcon,
  MapPinIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';

const OrderSuccess = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
      
      // Set up polling for real-time order status updates
      const interval = setInterval(() => {
        fetchOrder();
      }, 10000); // Poll every 10 seconds for faster testing

      return () => clearInterval(interval);
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const { data } = await api.get(`/orders/${orderId}`);
      setOrder(data.order);
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Order Not Found
          </h1>
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Delivery Partner Assigned':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400';
      case 'Shipped':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Delivered':
        return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
      case 'Cancelled':
        return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const getPaymentMethodName = (method) => {
    switch (method) {
      case 'razorpay':
        return 'Online Payment';
      case 'cod':
        return 'Cash on Delivery';
      default:
        return method.charAt(0).toUpperCase() + method.slice(1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
            <CheckCircleIcon className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Thank you for your order. We'll send you a confirmation email shortly.
          </p>
          <div className="inline-flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-lg px-4 py-2 shadow-sm border border-gray-200 dark:border-gray-700">
            <DocumentTextIcon className="h-5 w-5 text-gray-500" />
            <span className="font-medium text-gray-900 dark:text-white">Order ID:</span>
            <span className="font-mono text-blue-600 dark:text-blue-400">{order._id}</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Order Status
                </h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                  {order.orderStatus}
                </span>
              </div>

              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <TruckIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {order.trackingId}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Tracking ID
                  </p>
                </div>
              </div>

              {order.estimatedDelivery && (
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Estimated Delivery:</strong>{' '}
                    {new Date(order.estimatedDelivery).toLocaleDateString('en-IN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}

              {/* Delivery Partner Info */}
              {order.deliveryPartner && order.orderStatus !== 'Processing' && (
                <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <div className="flex items-center space-x-2 mb-3">
                    <TruckIcon className="h-5 w-5 text-orange-600" />
                    <h3 className="font-medium text-orange-800 dark:text-orange-300">
                      Delivery Partner Details
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Partner Name</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {order.deliveryPartner.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Phone Number</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {order.deliveryPartner.phone}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Vehicle Number</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {order.deliveryPartner.vehicleNumber}
                      </p>
                    </div>
                  </div>
                  {order.deliveryPartner.assignedAt && (
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Assigned on {new Date(order.deliveryPartner.assignedAt).toLocaleString('en-IN')}
                    </div>
                  )}
                </div>
              )}
            </motion.div>

            {/* Order Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Order Items
              </h2>

              <div className="space-y-4">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <img
                      src={item.image || '/placeholder.jpg'}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Price: ₹{item.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900 dark:text-white">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Shipping Address */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <MapPinIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Shipping Address
                </h2>
              </div>

              <div className="text-gray-600 dark:text-gray-400">
                <p className="font-medium text-gray-900 dark:text-white mb-1">
                  {order.shippingInfo.name}
                </p>
                <p>{order.shippingInfo.address}</p>
                {order.shippingInfo.landmark && (
                  <p>Near {order.shippingInfo.landmark}</p>
                )}
                <p>
                  {order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.pincode}
                </p>
                <p className="mt-2">Phone: {order.shippingInfo.phone}</p>
              </div>
            </motion.div>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 h-fit"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Order Summary
            </h2>

            {/* Payment Method */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <CreditCardIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {getPaymentMethodName(order.paymentInfo.method)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                  {order.paymentInfo.status}
                </p>
              </div>
            </div>

            {/* Applied Coupons */}
            {order.appliedCoupons?.length > 0 && (
              <div className="mb-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Applied Coupons</h3>
                {order.appliedCoupons.map((coupon, index) => (
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
                <span className="text-gray-900 dark:text-white">₹{order.itemsPrice?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                <span className="text-gray-900 dark:text-white">
                  {order.shippingPrice > 0 ? `₹${order.shippingPrice?.toFixed(2)}` : 'FREE'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Tax</span>
                <span className="text-gray-900 dark:text-white">₹{order.taxPrice?.toFixed(2)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Discount</span>
                  <span className="text-green-600 dark:text-green-400">
                    -₹{order.discountAmount?.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                <span className="font-semibold text-gray-900 dark:text-white">Total Paid</span>
                <span className="font-semibold text-gray-900 dark:text-white text-lg">
                  ₹{order.totalPrice?.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-3">
              <Link
                to="/orders"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-center block"
              >
                View All Orders
              </Link>
              <Link
                to="/"
                className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors text-center block"
              >
                <ShoppingCartIcon className="inline-block h-5 w-5 mr-2" />
                Continue Shopping
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
