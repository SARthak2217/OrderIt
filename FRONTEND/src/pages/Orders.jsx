import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

// Icons
import {
  ShoppingBagIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EyeIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const Orders = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
    page: 1,
    limit: 10
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchOrders();

    // Set up polling for real-time order updates
    const interval = setInterval(() => {
      fetchOrders(pagination.page);
    }, 10000); // Poll every 10 seconds for faster testing

    return () => clearInterval(interval);
  }, [isAuthenticated, navigate, pagination.page]);

  const fetchOrders = async (page = 1) => {
    try {
      const { data } = await api.get(`/orders/my-orders?page=${page}&limit=10`);
      setOrders(data.orders);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Processing':
        return <ClockIcon className="h-5 w-5 text-yellow-600" />;
      case 'Shipped':
        return <TruckIcon className="h-5 w-5 text-blue-600" />;
      case 'Delivered':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case 'Cancelled':
        return <XCircleIcon className="h-5 w-5 text-red-600" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFirstProductImage = (orderItems) => {
    return orderItems?.[0]?.image || '/placeholder.jpg';
  };

  const getItemsCount = (orderItems) => {
    return orderItems?.reduce((total, item) => total + item.quantity, 0) || 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Orders</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Track and manage your orders
          </p>
        </div>

        {orders.length === 0 ? (
          // Empty State
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
              <ShoppingBagIcon className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No orders yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              You haven't placed any orders. Start shopping to see your orders here.
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Start Shopping
            </Link>
          </motion.div>
        ) : (
          // Orders List
          <div className="space-y-4">
            {orders.map((order, index) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={getFirstProductImage(order.orderItems)}
                        alt="Order"
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            Order #{order._id?.slice(-8)}
                          </h3>
                          {order.trackingId && (
                            <span className="text-sm text-blue-600 dark:text-blue-400 font-mono">
                              {order.trackingId}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(order.createdAt)}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {getItemsCount(order.orderItems)} items • ₹{order.totalPrice?.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(order.orderStatus)}
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                          {order.orderStatus}
                        </span>
                        {(order.orderStatus === 'Processing' || order.orderStatus === 'Delivery Partner Assigned' || order.orderStatus === 'Shipped') && (
                          <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-xs text-green-600 dark:text-green-400">Live</span>
                          </div>
                        )}
                      </div>
                      <Link
                        to={`/order-success/${order._id}`}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        title="View Details"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </Link>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="mb-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {order.orderItems?.slice(0, 4).map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <img
                            src={item.image || '/placeholder.jpg'}
                            alt={item.name}
                            className="w-8 h-8 object-cover rounded"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Qty: {item.quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                      {order.orderItems?.length > 4 && (
                        <div className="flex items-center justify-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            +{order.orderItems.length - 4} more
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order Progress */}
                  {order.orderStatus !== 'Cancelled' && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-500 dark:text-gray-400">Order Progress</span>
                        {order.estimatedDelivery && (
                          <span className="text-gray-500 dark:text-gray-400">
                            Est. Delivery: {new Date(order.estimatedDelivery).toLocaleDateString('en-IN')}
                          </span>
                        )}
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            order.orderStatus === 'Processing' ? 'w-1/4 bg-yellow-500' :
                            order.orderStatus === 'Delivery Partner Assigned' ? 'w-2/4 bg-orange-500' :
                            order.orderStatus === 'Shipped' ? 'w-3/4 bg-blue-500' :
                            order.orderStatus === 'Delivered' ? 'w-full bg-green-500' :
                            'w-0'
                          }`}
                        ></div>
                      </div>
                      
                      {/* Progress Steps */}
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                        <span className={order.orderStatus === 'Processing' ? 'text-yellow-600 font-medium' : ''}>
                          Processing
                        </span>
                        <span className={order.orderStatus === 'Delivery Partner Assigned' ? 'text-orange-600 font-medium' : ''}>
                          Partner Assigned
                        </span>
                        <span className={order.orderStatus === 'Shipped' ? 'text-blue-600 font-medium' : ''}>
                          Shipped
                        </span>
                        <span className={order.orderStatus === 'Delivered' ? 'text-green-600 font-medium' : ''}>
                          Delivered
                        </span>
                      </div>

                      {/* Delivery Partner Info */}
                      {order.deliveryPartner && order.orderStatus !== 'Processing' && (
                        <div className="mt-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                          <div className="flex items-center space-x-2 mb-2">
                            <TruckIcon className="h-4 w-4 text-orange-600" />
                            <span className="text-sm font-medium text-orange-800 dark:text-orange-300">
                              Delivery Partner Assigned
                            </span>
                          </div>
                          <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                            <div className="flex justify-between">
                              <span>Partner:</span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {order.deliveryPartner.name}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Phone:</span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {order.deliveryPartner.phone}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Vehicle:</span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {order.deliveryPartner.vehicleNumber}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Shipping Address */}
                  <div className="flex items-start justify-between text-sm">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 mb-1">Shipping to:</p>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {order.shippingInfo?.name}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400">
                        {order.shippingInfo?.city}, {order.shippingInfo?.state}
                      </p>
                    </div>
                    <Link
                      to={`/order-success/${order._id}`}
                      className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    >
                      View Details
                      <ChevronRightIcon className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-center space-x-4 mt-8">
            <button
              onClick={() => fetchOrders(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              onClick={() => fetchOrders(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
