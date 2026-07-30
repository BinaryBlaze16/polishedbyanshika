const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');
const Product = require('../models/Product');

const createReview = asyncHandler(async (req, res) => {
  const { product, rating, comment, title } = req.body;

  const alreadyReviewed = await Review.findOne({ user: req.user._id, product });
  if (alreadyReviewed) {
    res.status(400);
    throw new Error('Product already reviewed');
  }

  const review = await Review.create({
    user: req.user._id,
    product,
    rating: Number(rating),
    title,
    comment,
    isApproved: false // Requires admin approval
  });

  res.status(201).json({ success: true, data: review, message: 'Review submitted for approval' });
});

const getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId, isApproved: true })
    .populate('user', 'name avatar')
    .sort({ createdAt: -1 });
    
  res.json({ success: true, data: reviews });
});

const updateProductRating = async (productId) => {
  const reviews = await Review.find({ product: productId, isApproved: true });
  const product = await Product.findById(productId);
  if (product) {
    product.numReviews = reviews.length;
    product.rating = reviews.length > 0 
      ? reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length
      : 0;
    await product.save();
  }
};

const getAllReviewsAdmin = asyncHandler(async (req, res) => {
  const reviews = await Review.find()
    .populate('user', 'name email avatar')
    .populate('product', 'name slug images price')
    .sort({ createdAt: -1 });

  res.json({ success: true, data: reviews, reviews });
});

const approveReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  review.isApproved = true;
  await review.save();
  
  await updateProductRating(review.product);

  res.json({ success: true, data: review });
});

const rejectReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  review.isApproved = false;
  await review.save();
  
  await updateProductRating(review.product);

  res.json({ success: true, data: review });
});

const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  const productId = review.product;
  await review.deleteOne();
  
  await updateProductRating(productId);

  res.json({ success: true, message: 'Review deleted' });
});

module.exports = {
  createReview,
  getProductReviews,
  getAllReviewsAdmin,
  approveReview,
  rejectReview,
  deleteReview
};
