const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const Setting = require('../models/Setting');
const Address = require('../models/Address');
const { uploadImageToCloudinary } = require('../utils/cloudinaryUpload');
const { sendOrderConfirmationEmail } = require('../utils/sendEmail');

const createOrder = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    couponCode
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  let itemsPrice = 0;
  const formattedItems = [];
  
  for (const item of orderItems) {
    const productId = item.product?._id || item.product;
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404);
      throw new Error(`Product not found`);
    }
    const itemPrice = (product.discountPrice && product.discountPrice > 0) ? product.discountPrice : product.price;
    const quantity = Number(item.quantity || item.qty || 1);
    itemsPrice += itemPrice * quantity;

    formattedItems.push({
      product: product._id,
      name: product.name,
      qty: quantity,
      price: itemPrice,
      image: product.images?.[0]?.url || product.images?.[0] || '',
      selectedShape: item.shape || item.selectedShape,
      selectedLength: item.length || item.selectedLength,
      selectedSize: item.size || item.selectedSize,
      customSizeInMm: item.customSizes || item.customSizeInMm
    });
  }

  let discount = 0;
  let appliedCoupon = null;

  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
    if (coupon) {
      const isExpired = coupon.expiresAt && new Date(coupon.expiresAt) < new Date();
      if (!isExpired && itemsPrice >= coupon.minOrderValue) {
        if (coupon.discountType === 'percentage') {
          discount = (itemsPrice * coupon.discountValue) / 100;
          if (coupon.maxDiscount) {
            discount = Math.min(discount, coupon.maxDiscount);
          }
        } else {
          discount = coupon.discountValue;
        }
        appliedCoupon = {
          code: coupon.code,
          discountAmount: discount
        };
      }
    }
  }

  const settings = await Setting.find();
  const getSetting = (key) => settings.find(s => s.key === key)?.value;
  
  const freeShippingAbove = Number(getSetting('freeShippingAbove') || 1000);
  const standardShippingCharge = Number(getSetting('shippingCharge') || 100);

  const shippingPrice = (itemsPrice - discount) >= freeShippingAbove ? 0 : standardShippingCharge;
  const totalPrice = itemsPrice - discount + shippingPrice;

  const orderNumber = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;

  // Auto-save address if user has 0 saved addresses or explicitly requested saveToProfile
  if (req.user && shippingAddress) {
    try {
      const existingAddressCount = await Address.countDocuments({ user: req.user._id });
      if (existingAddressCount === 0 || req.body.saveToProfile) {
        const fullAddrStr = (shippingAddress.addressLine1 || '') + (shippingAddress.houseNumber || '');
        const duplicate = await Address.findOne({
          user: req.user._id,
          pincode: shippingAddress.pincode,
          city: shippingAddress.city
        });
        
        if (!duplicate) {
          await Address.create({
            user: req.user._id,
            fullName: shippingAddress.fullName || `${shippingAddress.firstName || ''} ${shippingAddress.lastName || ''}`.trim() || req.user.name,
            phone: shippingAddress.phone || req.user.phone || '',
            addressType: shippingAddress.addressType || 'Home',
            houseNumber: shippingAddress.houseNumber || shippingAddress.addressLine1 || 'N/A',
            street: shippingAddress.street || shippingAddress.addressLine2 || shippingAddress.addressLine1 || 'N/A',
            landmark: shippingAddress.landmark || '',
            city: shippingAddress.city || '',
            state: shippingAddress.state || '',
            pincode: shippingAddress.pincode || '',
            country: shippingAddress.country || 'India',
            isDefault: existingAddressCount === 0
          });
        }
      }
    } catch (addrErr) {
      console.error('Auto address save error:', addrErr.message);
    }
  }

  const order = await Order.create({
    orderNumber,
    user: req.user._id,
    orderItems: formattedItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    discountAmount: discount,
    totalPrice,
    couponApplied: appliedCoupon
  });

  if (order) {
    // send email
    await sendOrderConfirmationEmail(order, req.user);
    res.status(201).json({ success: true, data: order, order: order });
  } else {
    res.status(400);
    throw new Error('Invalid order data');
  }
});

const getMyOrders = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;

  const count = await Order.countDocuments({ user: req.user._id });
  const orders = await Order.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .skip(limit * (page - 1))
    .limit(limit);

  res.json({
    success: true,
    data: orders,
    orders: orders,
    page,
    pages: Math.ceil(count / limit),
    total: count
  });
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (order) {
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to view this order');
    }
    res.json({ success: true, data: order, order: order });
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

const submitPaymentProof = asyncHandler(async (req, res) => {
  const { utrNumber } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  let screenshotUrl = null;
  if (req.file) {
    const result = await uploadImageToCloudinary(req.file.buffer, 'payments');
    screenshotUrl = result.url;
  }

  order.paymentDetails = {
    utrNumber,
    paymentScreenshotUrl: screenshotUrl,
    isPaid: false,
    paidAt: new Date()
  };
  
  await order.save();
  res.json({ success: true, data: order, order: order });
});

const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  if (order.status !== 'Pending') {
    res.status(400);
    throw new Error('Can only cancel pending orders');
  }

  order.status = 'Cancelled';
  order.statusHistory.push({ status: 'Cancelled', note: 'Cancelled by user' });
  await order.save();
  
  res.json({ success: true, data: order, order: order });
});

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  submitPaymentProof,
  cancelOrder
};
