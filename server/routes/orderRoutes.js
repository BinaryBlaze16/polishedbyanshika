const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  submitPaymentProof,
  cancelOrder
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { uploadSingle } = require('../middleware/uploadMiddleware');

router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.post('/:id/payment-proof', protect, uploadSingle('screenshot'), submitPaymentProof);
router.put('/:id/cancel', protect, cancelOrder);

module.exports = router;
