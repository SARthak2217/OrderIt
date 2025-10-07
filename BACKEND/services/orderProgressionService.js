import Order from '../models/Order.js';

class OrderProgressionService {
  constructor() {
    this.activeTimers = new Map();
    this.isRunning = false;
  }

  // Start the service
  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    console.log('Order Progression Service started');
    
    // Check for pending orders every 15 seconds during testing
    this.checkPendingOrders();
    this.intervalId = setInterval(() => {
      this.checkPendingOrders();
    }, 15000); // Check every 15 seconds for faster testing
  }

  // Stop the service
  stop() {
    if (!this.isRunning) return;
    this.isRunning = false;
    
    // Clear main interval
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    
    // Clear all order timers
    this.activeTimers.forEach(timer => clearTimeout(timer));
    this.activeTimers.clear();
    
    console.log('Order Progression Service stopped');
  }

  // Check for orders that need status updates
  async checkPendingOrders() {
    try {
      const ordersToUpdate = await Order.find({
        nextStatusUpdate: { $lte: new Date() },
        orderStatus: { $nin: ['Delivered', 'Cancelled'] },
        autoProgressEnabled: true
      });

      for (const order of ordersToUpdate) {
        await this.progressOrder(order);
      }
    } catch (error) {
      console.error('Error checking pending orders:', error);
    }
  }

  // Progress a specific order
  async progressOrder(order) {
    try {
      console.log(`Progressing order ${order._id} from ${order.orderStatus}`);
      await order.progressStatus();
      console.log(`Order ${order._id} progressed to ${order.orderStatus}`);
      
      // Schedule next update if needed
      if (order.nextStatusUpdate) {
        this.scheduleOrderUpdate(order);
      }
    } catch (error) {
      console.error(`Error progressing order ${order._id}:`, error);
    }
  }

  // Schedule automatic progression for a new order
  async scheduleOrderProgression(orderId, initialDelay = 30 * 1000) { // 30 seconds for testing
    try {
      const order = await Order.findById(orderId);
      if (!order || !order.autoProgressEnabled) return;

      // Set initial next update time
      order.nextStatusUpdate = new Date(Date.now() + initialDelay);
      await order.save();

      console.log(`Scheduled progression for order ${orderId} in ${initialDelay / 1000} seconds`);
      
      // Schedule the update
      this.scheduleOrderUpdate(order);
    } catch (error) {
      console.error(`Error scheduling progression for order ${orderId}:`, error);
    }
  }

  // Schedule next update for an order
  scheduleOrderUpdate(order) {
    const orderId = order._id.toString();
    
    // Clear existing timer if any
    if (this.activeTimers.has(orderId)) {
      clearTimeout(this.activeTimers.get(orderId));
    }

    if (!order.nextStatusUpdate) return;

    const delay = order.nextStatusUpdate.getTime() - Date.now();
    if (delay <= 0) {
      // Update immediately if time has passed
      this.progressOrder(order);
      return;
    }

    const timer = setTimeout(async () => {
      await this.progressOrder(order);
      this.activeTimers.delete(orderId);
    }, delay);

    this.activeTimers.set(orderId, timer);
  }

  // Get order status for real-time updates
  async getOrderStatus(orderId) {
    try {
      const order = await Order.findById(orderId).select('orderStatus statusHistory nextStatusUpdate');
      return order;
    } catch (error) {
      console.error(`Error getting order status for ${orderId}:`, error);
      return null;
    }
  }

  // Manually trigger order progression (for testing)
  async manualProgressOrder(orderId) {
    try {
      const order = await Order.findById(orderId);
      if (!order) {
        throw new Error('Order not found');
      }
      
      await this.progressOrder(order);
      return order;
    } catch (error) {
      console.error(`Error manually progressing order ${orderId}:`, error);
      throw error;
    }
  }
}

// Create singleton instance
const orderProgressionService = new OrderProgressionService();

export default orderProgressionService;
