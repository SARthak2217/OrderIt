import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.js';

// Razorpay instance will be initialized lazily
let razorpay = null;

// Function to initialize Razorpay
const initRazorpay = () => {
  if (!razorpay && process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_SECRET) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET
    });
    console.log('✅ Razorpay initialized with Key ID:', process.env.RAZORPAY_KEY_ID);
  }
  return razorpay;
};

// Debug endpoint to check Razorpay configuration
export const checkPaymentConfig = async (req, res) => {
  const razorpayInstance = initRazorpay();
  res.status(200).json({
    success: true,
    razorpayConfigured: !!razorpayInstance,
    keyId: process.env.RAZORPAY_KEY_ID || 'Not set',
    secretSet: !!process.env.RAZORPAY_SECRET
  });
};

// Create Razorpay order
export const createRazorpayOrder = async (req, res) => {
  try {
    const razorpayInstance = initRazorpay();
    
    if (!razorpayInstance) {
      return res.status(500).json({
        success: false,
        message: 'Payment service is not configured. Please contact support.'
      });
    }

    const { amount, currency = 'INR' } = req.body;

    const options = {
      amount: Math.round(amount * 100), // Convert to paisa
      currency,
      receipt: `order_${Date.now()}`,
      payment_capture: 1
    };

    const order = await razorpayInstance.orders.create(options);

    res.status(200).json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Verify Razorpay payment
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    console.log('Payment verification request:', {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature: razorpay_signature ? 'Present' : 'Missing'
    });

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing required payment parameters'
      });
    }

    // Generate expected signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest('hex');

    console.log('Signature verification:', {
      body,
      expectedSignature,
      receivedSignature: razorpay_signature,
      secretPresent: !!process.env.RAZORPAY_SECRET
    });

    if (expectedSignature !== razorpay_signature) {
      console.error('Signature mismatch!');
      return res.status(400).json({
        success: false,
        message: 'Payment signature verification failed'
      });
    }

    console.log('✅ Payment verification successful');

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      verified: true
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get payment details
export const getPaymentDetails = async (req, res) => {
  try {
    const razorpayInstance = initRazorpay();
    
    if (!razorpayInstance) {
      return res.status(500).json({
        success: false,
        message: 'Payment service not configured'
      });
    }

    const { paymentId } = req.params;
    const payment = await razorpayInstance.payments.fetch(paymentId);

    res.status(200).json({
      success: true,
      payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
