const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllOrders,
  updateOrderStatus,
  verifyPayment,
  getAllUsers,
  getUserDetails,
  toggleUserStatus,
  deleteUser,
  getAllCustomRequests,
  updateCustomRequestStatus
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect, admin);

router.get('/dashboard', getDashboardStats);

router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.put('/orders/:id/verify-payment', verifyPayment);

router.get('/users', getAllUsers);
router.get('/users/:id', getUserDetails);
router.patch('/users/:id/toggle-status', toggleUserStatus);
router.delete('/users/:id', deleteUser);

router.get('/custom-requests', getAllCustomRequests);
router.put('/custom-requests/:id', updateCustomRequestStatus);

module.exports = router;
