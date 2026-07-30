const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateProfile,
  updatePassword,
  addAddress,
  updateAddress,
  deleteAddress
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { uploadSingle } = require('../middleware/uploadMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.get('/me', protect, getMe);
router.put('/profile', protect, uploadSingle('avatar'), updateProfile);
router.put('/password', protect, updatePassword);
router.post('/addresses', protect, addAddress);
router.post('/address', protect, addAddress);
router.put('/addresses/:id', protect, updateAddress);
router.put('/address/:id', protect, updateAddress);
router.delete('/addresses/:id', protect, deleteAddress);
router.delete('/address/:id', protect, deleteAddress);

module.exports = router;
