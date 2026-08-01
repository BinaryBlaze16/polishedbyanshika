const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { uploadImageToCloudinary } = require('../utils/cloudinaryUpload');

// ─── Helper: Recalculate product rating from Approved reviews only ────────────
const updateProductRating = async (productId) => {
  const reviews = await Review.find({ product: productId, status: 'Approved' });
  const product = await Product.findById(productId);
  if (product) {
    product.numReviews = reviews.length;
    product.ratings = reviews.length > 0
      ? parseFloat((reviews.reduce((acc, r) => r.rating + acc, 0) / reviews.length).toFixed(1))
      : 0;
    await product.save();
  }
};

// ─── Customer: Submit a new review ───────────────────────────────────────────
const createReview = asyncHandler(async (req, res) => {
  const { productId, orderId, orderItemId, rating, title, comment } = req.body;

  if (!productId || !orderId || !orderItemId || !rating || !comment) {
    res.status(400);
    throw new Error('productId, orderId, orderItemId, rating, and comment are required');
  }

  // 1. Verify order belongs to this user and is Delivered
  const order = await Order.findOne({
    _id: orderId,
    user: req.user._id,
    orderStatus: 'Delivered'
  });

  if (!order) {
    res.status(403);
    throw new Error('You can only review products from delivered orders');
  }

  // 2. Verify the specific item is in this order and matches the product
  const orderItem = order.orderItems.find(
    item => item._id.toString() === orderItemId.toString() &&
            item.product.toString() === productId.toString()
  );

  if (!orderItem) {
    res.status(403);
    throw new Error('This product was not found in the specified order');
  }

  // 3. Check for duplicate review on this specific order item
  const existing = await Review.findOne({
    user: req.user._id,
    order: orderId,
    orderItemId: orderItemId
  });

  if (existing) {
    res.status(400);
    throw new Error('You have already reviewed this item. You can edit your existing review instead.');
  }

  // 4. Upload images to Cloudinary if provided
  let imageUrls = [];
  if (req.files && req.files.length > 0) {
    const uploadPromises = req.files.slice(0, 5).map(file =>
      uploadImageToCloudinary(file.buffer, 'reviews')
    );
    const results = await Promise.all(uploadPromises);
    imageUrls = results.map(r => r.url);
  }

  const review = await Review.create({
    user: req.user._id,
    product: productId,
    order: orderId,
    orderItemId,
    rating: Number(rating),
    title: title?.trim(),
    comment: comment.trim(),
    images: imageUrls,
    status: 'Pending',
    isVerifiedPurchase: true
  });

  res.status(201).json({
    success: true,
    data: review,
    message: 'Review submitted successfully! It will appear publicly after admin approval.'
  });
});

// ─── Customer: Edit own review (resets to Pending) ───────────────────────────
const updateReview = asyncHandler(async (req, res) => {
  const { rating, title, comment } = req.body;

  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  // Only owner can edit
  if (review.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to edit this review');
  }

  // Upload new images if provided
  let imageUrls = review.images;
  if (req.files && req.files.length > 0) {
    const uploadPromises = req.files.slice(0, 5).map(file =>
      uploadImageToCloudinary(file.buffer, 'reviews')
    );
    const results = await Promise.all(uploadPromises);
    imageUrls = results.map(r => r.url);
  }

  review.rating = rating ? Number(rating) : review.rating;
  review.title = title !== undefined ? title?.trim() : review.title;
  review.comment = comment ? comment.trim() : review.comment;
  review.images = imageUrls;
  // Editing always resets to Pending for re-moderation
  review.status = 'Pending';
  review.approvedBy = undefined;
  review.approvedAt = undefined;

  await review.save();
  await updateProductRating(review.product);

  res.json({
    success: true,
    data: review,
    message: 'Review updated. It will reappear publicly after admin re-approval.'
  });
});

// ─── Customer: Delete own review ─────────────────────────────────────────────
const deleteMyReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  if (review.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this review');
  }

  const productId = review.product;
  await review.deleteOne();
  await updateProductRating(productId);

  res.json({ success: true, message: 'Review deleted successfully' });
});

// ─── Customer: Get own reviews ────────────────────────────────────────────────
const getMyReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ user: req.user._id })
    .populate('product', 'name slug images')
    .populate('order', 'orderNumber')
    .sort({ createdAt: -1 });

  res.json({ success: true, data: reviews });
});

// ─── Customer: Check if a specific order item is already reviewed ─────────────
const checkReviewEligibility = asyncHandler(async (req, res) => {
  const { orderId, orderItemId } = req.params;

  const review = await Review.findOne({
    user: req.user._id,
    order: orderId,
    orderItemId: orderItemId
  });

  res.json({
    success: true,
    hasReview: !!review,
    review: review || null
  });
});

// ─── Public: Get approved reviews for a product ───────────────────────────────
const getProductReviews = asyncHandler(async (req, res) => {
  const { sort = 'latest', star } = req.query;

  const filter = { product: req.params.productId, status: 'Approved' };
  if (star) filter.rating = Number(star);

  let sortQuery = { createdAt: -1 }; // latest
  if (sort === 'highest') sortQuery = { rating: -1, createdAt: -1 };
  if (sort === 'lowest') sortQuery = { rating: 1, createdAt: -1 };

  const reviews = await Review.find(filter)
    .populate('user', 'name')
    .sort(sortQuery);

  // Star distribution
  const allApproved = await Review.find({ product: req.params.productId, status: 'Approved' });
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  allApproved.forEach(r => { distribution[r.rating] = (distribution[r.rating] || 0) + 1; });

  res.json({
    success: true,
    data: reviews,
    total: reviews.length,
    distribution
  });
});

// ─── Admin: Get all reviews ───────────────────────────────────────────────────
const getAllReviewsAdmin = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = {};
  if (status && status !== 'All') filter.status = status;

  const reviews = await Review.find(filter)
    .populate('user', 'name email')
    .populate('product', 'name slug images price')
    .populate('order', 'orderNumber')
    .sort({ createdAt: -1 });

  const pending = await Review.countDocuments({ status: 'Pending' });

  res.json({ success: true, data: reviews, reviews, pendingCount: pending });
});

// ─── Admin: Approve review ────────────────────────────────────────────────────
const approveReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) { res.status(404); throw new Error('Review not found'); }

  review.status = 'Approved';
  review.approvedBy = req.user._id;
  review.approvedAt = new Date();
  await review.save();
  await updateProductRating(review.product);

  res.json({ success: true, data: review, message: 'Review approved and published' });
});

// ─── Admin: Reject review ─────────────────────────────────────────────────────
const rejectReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) { res.status(404); throw new Error('Review not found'); }

  review.status = 'Rejected';
  review.approvedBy = undefined;
  review.approvedAt = undefined;
  await review.save();
  await updateProductRating(review.product);

  res.json({ success: true, data: review, message: 'Review rejected' });
});

// ─── Admin: Delete any review ─────────────────────────────────────────────────
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) { res.status(404); throw new Error('Review not found'); }

  const productId = review.product;
  await review.deleteOne();
  await updateProductRating(productId);

  res.json({ success: true, message: 'Review permanently deleted' });
});

module.exports = {
  createReview,
  updateReview,
  deleteMyReview,
  getMyReviews,
  checkReviewEligibility,
  getProductReviews,
  getAllReviewsAdmin,
  approveReview,
  rejectReview,
  deleteReview
};

