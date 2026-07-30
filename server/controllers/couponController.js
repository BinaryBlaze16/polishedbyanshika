const asyncHandler = require('express-async-handler');
const Coupon = require('../models/Coupon');

const validateCoupon = asyncHandler(async (req, res) => {
  const { code, orderAmount } = req.body;

  const coupon = await Coupon.findOne({ code: code.toUpperCase() });

  if (!coupon) {
    res.status(404);
    throw new Error('Invalid coupon code');
  }

  if (!coupon.isActive) {
    res.status(400);
    throw new Error('Coupon is no longer active');
  }

  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    res.status(400);
    throw new Error('Coupon has expired');
  }

  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    res.status(400);
    throw new Error('Coupon usage limit reached');
  }

  if (coupon.minOrderValue && orderAmount < coupon.minOrderValue) {
    res.status(400);
    throw new Error(`Minimum order amount of ₹${coupon.minOrderValue} required`);
  }

  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = (orderAmount * coupon.discountValue) / 100;
    if (coupon.maxDiscount) {
      discount = Math.min(discount, coupon.maxDiscount);
    }
  } else {
    discount = coupon.discountValue;
  }

  res.json({
    success: true,
    data: {
      code: coupon.code,
      discountType: coupon.discountType,
      discountAmount: coupon.discountAmount,
      calculatedDiscount: discount
    }
  });
});

const createCoupon = asyncHandler(async (req, res) => {
  const reqData = { ...req.body, code: req.body.code.toUpperCase() };
  const couponExists = await Coupon.findOne({ code: reqData.code });
  if (couponExists) {
    res.status(400);
    throw new Error('Coupon code already exists');
  }

  const coupon = await Coupon.create(reqData);
  res.status(201).json({ success: true, data: coupon });
});

const getAllCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  res.json({ success: true, data: coupons });
});

const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (coupon) {
    res.json({ success: true, data: coupon });
  } else {
    res.status(404);
    throw new Error('Coupon not found');
  }
});

const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  if (coupon) {
    res.json({ success: true, message: 'Coupon deleted' });
  } else {
    res.status(404);
    throw new Error('Coupon not found');
  }
});

module.exports = {
  validateCoupon,
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon
};
