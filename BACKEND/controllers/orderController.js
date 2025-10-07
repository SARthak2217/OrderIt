import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import orderProgressionService from '../services/orderProgressionService.js';

// Create new order
export const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingInfo,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      appliedCoupons
    } = req.body;

    // Validate stock for all items
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.name} not found`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`
        });
      }
    }

    const order = await Order.create({
      user: req.user.id,
      orderItems,
      shippingInfo,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      appliedCoupons
    });

    // Update product stock
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      product.stock -= item.quantity;
      await product.save();
    }

    // Clear user cart
    await Cart.findOneAndUpdate(
      { user: req.user.id },
      { 
        items: [], 
        appliedCoupons: [], 
        discountAmount: 0 
      }
    );

    // Schedule automatic order progression if payment is successful
    console.log('💳 Payment Info:', paymentInfo);
    if (paymentInfo && (paymentInfo.status === 'succeeded' || paymentInfo.status === 'paid' || paymentInfo.method === 'razorpay')) {
      await orderProgressionService.scheduleOrderProgression(order._id);
      console.log(`✅ Scheduled automatic progression for order ${order._id}`);
    } else {
      console.log(`❌ Auto-progression not scheduled. Payment status: ${paymentInfo?.status}, Method: ${paymentInfo?.method}`);
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get user orders
export const getMyOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query = { user: req.user.id };
    if (status) query.orderStatus = status;

    const skip = (Number(page) - 1) * Number(limit);

    const orders = await Order.find(query)
      .populate('orderItems.product', 'name images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      orders,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page: Number(page),
        limit: Number(limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single order
export const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('orderItems.product', 'name images');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns the order or is admin
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update order status (Admin only)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.orderStatus === 'Delivered') {
      return res.status(400).json({
        success: false,
        message: 'This order has already been delivered'
      });
    }

    order.orderStatus = status;

    if (status === 'Delivered') {
      order.deliveredAt = new Date();
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get all orders (Admin only)
export const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, startDate, endDate } = req.query;

    const query = {};
    if (status) query.orderStatus = status;
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .populate('orderItems.product', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Order.countDocuments(query);
    const totalAmount = await Order.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    res.status(200).json({
      success: true,
      orders,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page: Number(page),
        limit: Number(limit)
      },
      totalAmount: totalAmount[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete order (Admin only)
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Only allow deletion of cancelled orders
    if (order.orderStatus !== 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Only cancelled orders can be deleted'
      });
    }

    await Order.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get order statistics (Admin only)
export const getOrderStats = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalPrice' }
        }
      }
    ]);

    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        ordersByStatus: stats,
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Test manual order progression (for testing purposes)
export const testOrderProgression = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await orderProgressionService.manualProgressOrder(orderId);
    
    res.status(200).json({
      success: true,
      message: `Order progressed to ${order.orderStatus}`,
      order: {
        id: order._id,
        status: order.orderStatus,
        statusHistory: order.statusHistory,
        nextStatusUpdate: order.nextStatusUpdate
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Check progression service status and orders
export const getProgressionStatus = async (req, res) => {
  try {
    // Get orders that are currently in progress
    const activeOrders = await Order.find({
      orderStatus: { $nin: ['Delivered', 'Cancelled'] },
      autoProgressEnabled: true
    }).select('_id orderStatus nextStatusUpdate statusHistory createdAt').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      serviceRunning: true,
      activeOrders: activeOrders.length,
      orders: activeOrders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Force create a test order for progression testing
export const createTestOrder = async (req, res) => {
  try {
    const testOrder = await Order.create({
      user: req.user?.id || '507f1f77bcf86cd799439011', // dummy user ID for testing
      orderItems: [{
        name: 'Test Product',
        quantity: 1,
        price: 100,
        product: '507f1f77bcf86cd799439011' // dummy product ID
      }],
      shippingInfo: {
        name: 'Test User',
        phone: '1234567890',
        address: 'Test Address',
        city: 'Test City',
        state: 'Test State',
        pincode: '123456'
      },
      paymentInfo: {
        id: 'test_payment_' + Date.now(),
        status: 'succeeded',
        method: 'razorpay'
      },
      itemsPrice: 100,
      taxPrice: 10,
      shippingPrice: 0,
      totalPrice: 110,
      orderStatus: 'Processing',
      autoProgressEnabled: true
    });

    // Schedule progression
    await orderProgressionService.scheduleOrderProgression(testOrder._id);
    
    res.status(201).json({
      success: true,
      message: 'Test order created with auto-progression',
      order: testOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
