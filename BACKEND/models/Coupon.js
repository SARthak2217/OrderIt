import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Please provide coupon code'],
    unique: true,
    uppercase: true,
    trim: true,
    minLength: [3, 'Coupon code must be at least 3 characters'],
    maxLength: [20, 'Coupon code cannot exceed 20 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide coupon description'],
    maxLength: [200, 'Description cannot exceed 200 characters']
  },
  type: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true
  },
  value: {
    type: Number,
    required: [true, 'Please provide coupon value'],
    min: [0, 'Coupon value cannot be negative']
  },
  minimumAmount: {
    type: Number,
    default: 0,
    min: [0, 'Minimum amount cannot be negative']
  },
  maximumDiscount: {
    type: Number, // Only for percentage coupons
    min: [0, 'Maximum discount cannot be negative']
  },
  usageLimit: {
    type: Number,
    default: null // null means unlimited
  },
  usedCount: {
    type: Number,
    default: 0
  },
  validFrom: {
    type: Date,
    required: true,
    default: Date.now
  },
  validUntil: {
    type: Date,
    required: true
  },
  applicableCategories: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Category'
  }], // Empty array means applicable to all categories
  applicableProducts: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Product'
  }], // Empty array means applicable to all products
  userRestrictions: {
    newUsersOnly: {
      type: Boolean,
      default: false
    },
    maxUsagePerUser: {
      type: Number,
      default: 1
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Check if coupon is valid
couponSchema.methods.isValid = function() {
  const now = new Date();
  return (
    this.isActive &&
    this.validFrom <= now &&
    this.validUntil >= now &&
    (this.usageLimit === null || this.usedCount < this.usageLimit)
  );
};

// Calculate discount amount
couponSchema.methods.calculateDiscount = function(amount) {
  if (!this.isValid() || amount < this.minimumAmount) {
    return 0;
  }

  let discount = 0;
  if (this.type === 'percentage') {
    discount = (amount * this.value) / 100;
    if (this.maximumDiscount && discount > this.maximumDiscount) {
      discount = this.maximumDiscount;
    }
  } else {
    discount = this.value;
  }

  return Math.min(discount, amount);
};

export default mongoose.model('Coupon', couponSchema);
