const express = require('express');
const router = express.Router();
const multer = require('multer');
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
  deleteReview
} = require('../controllers/reviewController');
const { protect, admin } = require('../middleware/authMiddleware');

// multer — memory storage for Cloudinary upload (max 5 files, 5MB each)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only JPG, PNG, WEBP images are allowed'));
  }
});

// ─── Public ───────────────────────────────────────────────────────────────────
router.get('/product/:productId', getProductReviews);

// ─── Customer (protected) ─────────────────────────────────────────────────────
router.post('/', protect, upload.array('images', 5), createReview);
router.put('/:id', protect, upload.array('images', 5), updateReview);
router.delete('/my/:id', protect, deleteMyReview);
router.get('/my', protect, getMyReviews);
router.get('/check/:orderId/:orderItemId', protect, checkReviewEligibility);

// ─── Admin ────────────────────────────────────────────────────────────────────
router.get('/admin/all', protect, admin, getAllReviewsAdmin);
router.put('/:id/approve', protect, admin, approveReview);
router.put('/:id/reject', protect, admin, rejectReview);
router.delete('/:id', protect, admin, deleteReview);

module.exports = router;

