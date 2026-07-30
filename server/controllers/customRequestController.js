const asyncHandler = require('express-async-handler');
const CustomRequest = require('../models/CustomRequest');
const { uploadImageToCloudinary } = require('../utils/cloudinaryUpload');

const submitCustomRequest = asyncHandler(async (req, res) => {
  const requestData = {
    user: req.user?._id,
    customerName: req.body.customerName || req.user?.name || req.body.name || 'Anonymous User',
    customerEmail: req.body.customerEmail || req.user?.email || req.body.email || 'no-email@example.com',
    customerPhone: req.body.customerPhone || req.body.phone || req.user?.phone,
    whatsappNumber: req.body.whatsappNumber || req.body.phone || req.user?.phone,
    nailShape: req.body.nailShape || req.body.shape || 'Almond',
    nailLength: req.body.nailLength || req.body.length || 'Medium',
    description: req.body.description || '',
    budgetRange: req.body.budgetRange || req.body.budget || '1500-2000',
    inspirationLinks: req.body.inspirationLinks 
      ? (Array.isArray(req.body.inspirationLinks) ? req.body.inspirationLinks : [req.body.inspirationLinks]) 
      : (req.body.link ? [req.body.link] : [])
  };

  // Parse size guide specs if provided
  if (req.body.customSizeInMm) {
    try {
      requestData.customSizeInMm = typeof req.body.customSizeInMm === 'string' 
        ? JSON.parse(req.body.customSizeInMm) 
        : req.body.customSizeInMm;
    } catch (e) {
      console.error("Error parsing customSizeInMm:", e);
    }
  } else if (req.body.size && typeof req.body.size === 'object') {
    requestData.customSizeInMm = req.body.size;
  }

  if (req.files && req.files.length > 0) {
    const referenceImages = [];
    for (const file of req.files) {
      const result = await uploadImageToCloudinary(file.buffer, 'custom-requests');
      referenceImages.push({
        url: result.url,
        public_id: result.public_id
      });
    }
    requestData.referenceImages = referenceImages;
  }

  const customRequest = await CustomRequest.create(requestData);
  res.status(201).json({ success: true, data: customRequest });
});

const getMyCustomRequests = asyncHandler(async (req, res) => {
  const requests = await CustomRequest.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, data: requests });
});

module.exports = {
  submitCustomRequest,
  getMyCustomRequests
};
