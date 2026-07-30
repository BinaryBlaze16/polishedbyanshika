const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const CustomRequest = require('../models/CustomRequest');
const Review = require('../models/Review');
const Address = require('../models/Address');
const { sendOrderStatusUpdateEmail, sendEmail } = require('../utils/sendEmail');

const getDashboardStats = asyncHandler(async (req, res) => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Parallel DB queries for maximum speed
  const [
    totalOrders,
    pendingOrders,
    processingOrders,
    shippedOrders,
    outForDeliveryOrders,
    deliveredOrders,
    cancelledOrders,
    totalCustomers,
    totalProducts,
    activeProducts,
    outOfStockProducts,
    lowStockProducts,
    totalReviews,
    allPaidOrders,
    todayPaidOrders,
    monthPaidOrders,
    recentOrders,
    revenueByMonth,
    dailyOrders,
    orderStatusDistribution,
    customerGrowth,
    topProducts,
    avgRatingAgg
  ] = await Promise.all([
    Order.countDocuments(),
    Order.countDocuments({ orderStatus: 'Pending' }),
    Order.countDocuments({ orderStatus: 'Preparing' }),
    Order.countDocuments({ orderStatus: 'Shipped' }),
    Order.countDocuments({ orderStatus: 'Out For Delivery' }),
    Order.countDocuments({ orderStatus: 'Delivered' }),
    Order.countDocuments({ orderStatus: 'Cancelled' }),
    User.countDocuments({ role: 'customer' }),
    Product.countDocuments(),
    Product.countDocuments({ isActive: true }),
    Product.countDocuments({ stock: { $lte: 0 } }),
    Product.countDocuments({ stock: { $gt: 0, $lte: 5 } }),
    Review.countDocuments(),
    Order.aggregate([
      { $match: { $or: [{ "paymentDetails.isPaid": true }, { orderStatus: 'Delivered' }] } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]),
    Order.aggregate([
      { 
        $match: { 
          $or: [{ "paymentDetails.isPaid": true }, { orderStatus: 'Delivered' }],
          createdAt: { $gte: startOfToday }
        } 
      },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]),
    Order.aggregate([
      { 
        $match: { 
          $or: [{ "paymentDetails.isPaid": true }, { orderStatus: 'Delivered' }],
          createdAt: { $gte: startOfMonth }
        } 
      },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]),
    Order.find().sort({ createdAt: -1 }).limit(10).populate('user', 'name email'),
    Order.aggregate([
      { 
        $match: { 
          $or: [{ "paymentDetails.isPaid": true }, { orderStatus: 'Delivered' }],
          createdAt: { $gte: sixMonthsAgo }
        } 
      },
      {
        $group: {
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          revenue: { $sum: "$totalPrice" },
          orders: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]),
    Order.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { 
            day: { $dayOfMonth: "$createdAt" }, 
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" }
          },
          count: { $sum: 1 },
          revenue: { $sum: "$totalPrice" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
    ]),
    Order.aggregate([
      { $group: { _id: "$orderStatus", count: { $sum: 1 } } }
    ]),
    User.aggregate([
      { $match: { role: 'customer', createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]),
    Order.aggregate([
      { $unwind: "$orderItems" },
      { $group: { _id: "$orderItems.product", totalSold: { $sum: "$orderItems.qty" }, revenue: { $sum: { $multiply: ["$orderItems.price", "$orderItems.qty"] } } } },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          name: { $ifNull: ["$product.name", "Nail Set"] },
          totalSold: 1,
          revenue: 1,
          price: "$product.price"
        }
      }
    ]),
    Review.aggregate([
      { $group: { _id: null, avg: { $avg: "$rating" } } }
    ])
  ]);

  const totalRevenue = allPaidOrders.length > 0 ? allPaidOrders[0].total : 0;
  const todayRevenue = todayPaidOrders.length > 0 ? todayPaidOrders[0].total : 0;
  const monthlyRevenue = monthPaidOrders.length > 0 ? monthPaidOrders[0].total : 0;
  const avgRating = avgRatingAgg.length > 0 ? Number(avgRatingAgg[0].avg.toFixed(1)) : 0;

  res.json({
    success: true,
    data: {
      totalRevenue,
      todayRevenue,
      monthlyRevenue,
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      outForDeliveryOrders,
      deliveredOrders,
      cancelledOrders,
      totalCustomers,
      totalProducts,
      activeProducts,
      outOfStockProducts,
      lowStockProducts,
      totalReviews,
      avgRating,
      recentOrders,
      revenueByMonth,
      dailyOrders,
      orderStatusDistribution,
      customerGrowth,
      topProducts
    }
  });
});

const getAllOrders = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 50;

  let filter = {};
  if (req.query.status) filter.orderStatus = req.query.status;
  if (req.query.paymentMethod) filter.paymentMethod = req.query.paymentMethod;
  if (req.query.startDate && req.query.endDate) {
    filter.createdAt = {
      $gte: new Date(req.query.startDate),
      $lte: new Date(req.query.endDate)
    };
  }

  if (req.query.search) {
    const users = await User.find({ name: { $regex: req.query.search, $options: 'i' } });
    const userIds = users.map(u => u._id);
    filter.$or = [
      { orderNumber: { $regex: req.query.search, $options: 'i' } },
      { user: { $in: userIds } }
    ];
  }

  const count = await Order.countDocuments(filter);
  const orders = await Order.find(filter)
    .populate('user', 'name email phone')
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

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, orderStatus, trackingNumber, courierPartner, note } = req.body;
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const finalStatus = orderStatus || status;
  if (finalStatus) {
    order.orderStatus = finalStatus;
  }
  if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;
  if (courierPartner !== undefined) order.courierPartner = courierPartner;
  
  order.statusHistory.push({ 
    status: finalStatus || order.orderStatus, 
    note: note || `Order marked as ${finalStatus || order.orderStatus}` 
  });

  if (finalStatus === 'Delivered') {
    order.deliveredAt = new Date();
  }

  await order.save();
  await sendOrderStatusUpdateEmail(order, order.user);

  res.json({ success: true, data: order, order });
});

const verifyPayment = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (!order.paymentDetails) {
    order.paymentDetails = {};
  }
  order.paymentDetails.isPaid = true;
  order.paymentDetails.paidAt = new Date();
  order.orderStatus = 'Accepted';
  order.statusHistory.push({ status: 'Accepted', note: 'Payment verified by Admin' });

  await order.save();
  await sendOrderStatusUpdateEmail(order, order.user);

  res.json({ success: true, data: order, order });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 50;

  const filter = {};
  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } }
    ];
  }

  const count = await User.countDocuments(filter);
  const users = await User.find(filter)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(limit * (page - 1))
    .limit(limit);

  res.json({
    success: true,
    data: users,
    users: users,
    page,
    pages: Math.ceil(count / limit),
    total: count
  });
});

const getUserDetails = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const [addresses, orders] = await Promise.all([
    Address.find({ user: user._id }),
    Order.find({ user: user._id }).sort({ createdAt: -1 })
  ]);

  const totalOrders = orders.length;
  const lifetimeSpend = orders
    .filter(o => o.paymentDetails?.isPaid || o.orderStatus === 'Delivered')
    .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  res.json({
    success: true,
    data: {
      user,
      addresses,
      totalOrders,
      lifetimeSpend,
      orders
    }
  });
});

const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.isActive = !user.isActive;
  await user.save();
  res.json({ success: true, data: user, user });
});

const getAllCustomRequests = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 50;

  const count = await CustomRequest.countDocuments();
  const requests = await CustomRequest.find()
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .skip(limit * (page - 1))
    .limit(limit);

  res.json({
    success: true,
    data: requests,
    requests: requests,
    page,
    pages: Math.ceil(count / limit),
    total: count
  });
});

const updateCustomRequestStatus = asyncHandler(async (req, res) => {
  const { status, adminNotes, quotedPrice } = req.body;
  const request = await CustomRequest.findById(req.params.id).populate('user');

  if (!request) {
    res.status(404);
    throw new Error('Request not found');
  }

  request.status = status || request.status;
  if (adminNotes) request.adminNotes = adminNotes;
  if (quotedPrice) request.quotedPrice = quotedPrice;

  await request.save();

  if (request.user?.email) {
    const html = `
      <h1>Update on your Custom Request</h1>
      <p>Hi ${request.user.name}, the status of your custom request has been updated.</p>
      <p><strong>Status:</strong> ${request.status}</p>
      ${quotedPrice ? `<p><strong>Quoted Price:</strong> ₹${quotedPrice}</p>` : ''}
      ${adminNotes ? `<p><strong>Note from Admin:</strong> ${adminNotes}</p>` : ''}
    `;
    await sendEmail({ to: request.user.email, subject: 'Custom Request Update', html });
  }

  res.json({ success: true, data: request, request });
});

module.exports = {
  getDashboardStats,
  getAllOrders,
  updateOrderStatus,
  verifyPayment,
  getAllUsers,
  getUserDetails,
  toggleUserStatus,
  getAllCustomRequests,
  updateCustomRequestStatus
};
