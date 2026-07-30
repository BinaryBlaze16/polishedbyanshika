const express = require('express');
const router = express.Router();
const {
  createReview,
  getProductReviews,
  getAllReviewsAdmin,
  approveReview,
  rejectReview,
  deleteReview
} = require('../controllers/reviewController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, createReview);
router.get('/product/:productId', getProductReviews);

// Admin review management
router.get('/admin/all', protect, admin, getAllReviewsAdmin);
router.put('/:id/approve', protect, admin, approveReview);
router.put('/:id/reject', protect, admin, rejectReview);
router.delete('/:id', protect, admin, deleteReview);

module.exports = router;
