const express = require('express');
const router = express.Router();
const {
  getPublicSettings,
  getAllSettings,
  updateSetting
} = require('../controllers/settingController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/public', getPublicSettings);
router.get('/', protect, admin, getAllSettings);
router.put('/', protect, admin, updateSetting);

module.exports = router;
