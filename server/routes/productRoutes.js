const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductBySlug,
  getProductById,
  getFeaturedProducts,
  getRelatedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductVisibility
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');
const { uploadMultiple } = require('../middleware/uploadMiddleware');

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id', getProductById);
router.get('/:id/related', getRelatedProducts);

router.post('/', protect, admin, uploadMultiple('images', 5), createProduct);
router.put('/:id', protect, admin, uploadMultiple('images', 5), updateProduct);
router.delete('/:id', protect, admin, deleteProduct);
router.patch('/:id/toggle', protect, admin, toggleProductVisibility);

module.exports = router;
