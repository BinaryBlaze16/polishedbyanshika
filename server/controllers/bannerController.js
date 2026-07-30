const asyncHandler = require('express-async-handler');
const Banner = require('../models/Banner');
const { uploadImageToCloudinary } = require('../utils/cloudinaryUpload');

const getActiveBanners = asyncHandler(async (req, res) => {
  const banners = await Banner.find({ isActive: true }).sort('order');
  res.json({ success: true, data: banners });
});

const getAllBanners = asyncHandler(async (req, res) => {
  const banners = await Banner.find().sort('order');
  res.json({ success: true, data: banners });
});

const createBanner = asyncHandler(async (req, res) => {
  const bannerData = { ...req.body };

  if (req.file) {
    const result = await uploadImageToCloudinary(req.file.buffer, 'banners');
    bannerData.image = {
      url: result.url,
      public_id: result.public_id
    };
  } else if (bannerData.imageUrl) {
    bannerData.image = {
      url: bannerData.imageUrl,
      public_id: bannerData.imagePublicId || 'custom_banner'
    };
  } else {
    res.status(400);
    throw new Error('Image is required');
  }

  const banner = await Banner.create(bannerData);
  res.status(201).json({ success: true, data: banner });
});

const updateBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id);
  if (!banner) {
    res.status(404);
    throw new Error('Banner not found');
  }

  const updateData = { ...req.body };
  
  if (req.file) {
    const result = await uploadImageToCloudinary(req.file.buffer, 'banners');
    updateData.image = {
      url: result.url,
      public_id: result.public_id
    };
  } else if (updateData.imageUrl) {
    updateData.image = {
      url: updateData.imageUrl,
      public_id: updateData.imagePublicId || banner.image?.public_id || 'custom_banner'
    };
  }

  const updatedBanner = await Banner.findByIdAndUpdate(req.params.id, updateData, { new: true });
  res.json({ success: true, data: updatedBanner });
});

const deleteBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findByIdAndDelete(req.params.id);
  if (banner) {
    res.json({ success: true, message: 'Banner removed' });
  } else {
    res.status(404);
    throw new Error('Banner not found');
  }
});

module.exports = {
  getActiveBanners,
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner
};
