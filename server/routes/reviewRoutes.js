const express = require('express');
const router = express.Router();
const {
  createReview,
  updateReview,
  deleteMyReview,
  getMyReviews,
  checkReviewEligibility,
  getProductReviews,
  getAllReviewsAdmin,
  approveReview,
  rejectReview,
  deleteReview,
} = require('../controllers/reviewController');
const { protect, admin } = require('../middleware/authMiddleware');
const { uploadMultiple } = require('../middleware/uploadMiddleware');

// ─── Public ───────────────────────────────────────────────────────────────────
router.get('/product/:productId', getProductReviews);

// ─── Customer (protected) ─────────────────────────────────────────────────────
// Restricted to max 4 images (5MB each, JPEG/PNG/WEBP only)
router.post('/', protect, uploadMultiple('images', 4), createReview);
router.put('/:id', protect, uploadMultiple('images', 4), updateReview);
router.delete('/my/:id', protect, deleteMyReview);
router.get('/my', protect, getMyReviews);
router.get('/check/:orderId/:orderItemId', protect, checkReviewEligibility);

// ─── Admin ────────────────────────────────────────────────────────────────────
router.get('/admin/all', protect, admin, getAllReviewsAdmin);
router.put('/:id/approve', protect, admin, approveReview);
router.put('/:id/reject', protect, admin, rejectReview);
router.delete('/:id', protect, admin, deleteReview);

module.exports = router;
