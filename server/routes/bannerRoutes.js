const express = require('express');
const router = express.Router();
const {
  getActiveBanners,
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner
} = require('../controllers/bannerController');
const { protect, admin } = require('../middleware/authMiddleware');
const { uploadSingle } = require('../middleware/uploadMiddleware');

router.get('/active', getActiveBanners);
router.get('/', protect, admin, getAllBanners);
router.post('/', protect, admin, uploadSingle('image'), createBanner);
router.put('/:id', protect, admin, uploadSingle('image'), updateBanner);
router.delete('/:id', protect, admin, deleteBanner);

module.exports = router;
