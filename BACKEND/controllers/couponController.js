import Coupon from '../models/Coupon.js';

// Get all coupons (Admin only)
export const getAllCoupons = async (req, res) => {
  try {
    const { page = 1, limit = 20, isActive } = req.query;

    const query = {};
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const skip = (Number(page) - 1) * Number(limit);

    const coupons = await Coupon.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Coupon.countDocuments(query);

    res.status(200).json({
      success: true,
      coupons,
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

// Get single coupon (Admin only)
export const getCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('applicableCategories', 'name')
      .populate('applicableProducts', 'name price');

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    res.status(200).json({
      success: true,
      coupon
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create coupon (Admin only)
export const createCoupon = async (req, res) => {
  try {
    const couponData = {
      ...req.body,
      createdBy: req.user.id
    };

    const coupon = await Coupon.create(couponData);

    res.status(201).json({
      success: true,
      message: 'Coupon created successfully',
      coupon
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Update coupon (Admin only)
export const updateCoupon = async (req, res) => {
  try {
    let coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Coupon updated successfully',
      coupon
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete coupon (Admin only)
export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    await Coupon.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Coupon deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Validate coupon
export const validateCoupon = async (req, res) => {
  try {
    const { code, cartAmount } = req.body;

    if (!code || !cartAmount) {
      return res.status(400).json({
        success: false,
        message: 'Coupon code and cart amount are required'
      });
    }

    const coupon = await Coupon.findOne({ 
      code: code.toUpperCase(),
      isActive: true 
    });

    if (!coupon || !coupon.isValid()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired coupon'
      });
    }

    // Check minimum amount
    if (cartAmount < coupon.minimumAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount of ₹${coupon.minimumAmount} required`,
        valid: false
      });
    }

    // Calculate discount
    const discount = coupon.calculateDiscount(cartAmount);

    res.status(200).json({
      success: true,
      message: 'Coupon is valid',
      valid: true,
      coupon: {
        id: coupon._id,
        code: coupon.code,
        description: coupon.description,
        type: coupon.type,
        value: coupon.value,
        minimumAmount: coupon.minimumAmount,
        maximumDiscount: coupon.maximumDiscount
      },
      discount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get active coupons (Public)
export const getActiveCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({
      isActive: true,
      validFrom: { $lte: new Date() },
      validUntil: { $gte: new Date() }
    }).select('code description type value minimumAmount maximumDiscount validUntil');

    res.status(200).json({
      success: true,
      coupons
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
