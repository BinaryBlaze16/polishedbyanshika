const express = require('express');
const router = express.Router();
const {
  submitCustomRequest,
  getMyCustomRequests,
} = require('../controllers/customRequestController');
const { protect } = require('../middleware/authMiddleware');
const { uploadMultiple } = require('../middleware/uploadMiddleware');

// Restricted to max 4 reference images (5MB each, JPEG/PNG/WEBP only)
router.post('/', protect, uploadMultiple('referenceImages', 4), submitCustomRequest);
router.get('/myrequests', protect, getMyCustomRequests);

module.exports = router;
