const express = require('express');
const router = express.Router();
const {
  submitCustomRequest,
  getMyCustomRequests
} = require('../controllers/customRequestController');
const { protect } = require('../middleware/authMiddleware');
const { uploadMultiple } = require('../middleware/uploadMiddleware');

router.post('/', protect, uploadMultiple('referenceImages', 3), submitCustomRequest);
router.get('/myrequests', protect, getMyCustomRequests);

module.exports = router;
