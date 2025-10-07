import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  orderItems: [{
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1']
    },
    price: {
      type: Number,
      required: true
    },
    image: {
      type: String,
      required: true
    }
  }],
  shippingInfo: {
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true
    },
    landmark: String
  },
  paymentInfo: {
    id: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true
    },
    method: {
      type: String,
      enum: ['razorpay', 'cod'],
      required: true
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String
  },
  itemsPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  discountAmount: {
    type: Number,
    default: 0.0
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  appliedCoupons: [{
    code: String,
    discount: Number,
    type: {
      type: String,
      enum: ['percentage', 'fixed']
    }
  }],
  orderStatus: {
    type: String,
    enum: ['Processing', 'Delivery Partner Assigned', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Processing'
  },
  deliveredAt: Date,
  trackingId: String,
  estimatedDelivery: Date,
  orderNotes: String,
  statusHistory: [{
    status: {
      type: String,
      enum: ['Processing', 'Delivery Partner Assigned', 'Shipped', 'Delivered', 'Cancelled']
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String
  }],
  autoProgressEnabled: {
    type: Boolean,
    default: true
  },
  nextStatusUpdate: Date,
  deliveryPartner: {
    name: String,
    phone: String,
    vehicleNumber: String,
    assignedAt: Date
  }
}, {
  timestamps: true
});

// Generate tracking ID before saving
orderSchema.pre('save', function(next) {
  if (this.isNew && !this.trackingId) {
    this.trackingId = 'OI' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
  }
  
  // Add to status history when status changes
  if (this.isModified('orderStatus')) {
    this.statusHistory.push({
      status: this.orderStatus,
      timestamp: new Date(),
      note: `Status updated to ${this.orderStatus}`
    });
  }
  
  next();
});

// Method to progress order status automatically
orderSchema.methods.progressStatus = function() {
  const statusFlow = ['Processing', 'Delivery Partner Assigned', 'Shipped', 'Delivered'];
  const currentIndex = statusFlow.indexOf(this.orderStatus);
  
  if (currentIndex < statusFlow.length - 1 && this.autoProgressEnabled) {
    this.orderStatus = statusFlow[currentIndex + 1];
    
    // Assign delivery partner when status becomes "Delivery Partner Assigned"
    if (this.orderStatus === 'Delivery Partner Assigned') {
      this.assignDeliveryPartner();
    }
    
    // Set next update time (30 seconds for testing, can be adjusted)
    if (currentIndex + 2 < statusFlow.length) {
      this.nextStatusUpdate = new Date(Date.now() + 30 * 1000); // 30 seconds
    }
    
    if (this.orderStatus === 'Delivered') {
      this.deliveredAt = new Date();
      this.nextStatusUpdate = null;
    }
    
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to assign a random delivery partner
orderSchema.methods.assignDeliveryPartner = function() {
  const partners = [
    { name: 'Rajesh Kumar', phone: '+91 98765 43210', vehicle: 'MH 12 AB 1234' },
    { name: 'Priya Sharma', phone: '+91 87654 32109', vehicle: 'DL 08 CD 5678' },
    { name: 'Amit Singh', phone: '+91 76543 21098', vehicle: 'KA 03 EF 9012' },
    { name: 'Sneha Patel', phone: '+91 65432 10987', vehicle: 'GJ 01 GH 3456' },
    { name: 'Ravi Verma', phone: '+91 54321 09876', vehicle: 'UP 16 IJ 7890' },
    { name: 'Kavya Reddy', phone: '+91 43210 98765', vehicle: 'TN 09 KL 2345' },
    { name: 'Suresh Gupta', phone: '+91 32109 87654', vehicle: 'RJ 14 MN 6789' },
    { name: 'Pooja Jain', phone: '+91 21098 76543', vehicle: 'WB 06 OP 0123' }
  ];
  
  const randomPartner = partners[Math.floor(Math.random() * partners.length)];
  
  this.deliveryPartner = {
    name: randomPartner.name,
    phone: randomPartner.phone,
    vehicleNumber: randomPartner.vehicle,
    assignedAt: new Date()
  };
};

export default mongoose.model('Order', orderSchema);
