const asyncHandler = require('express-async-handler');
const Setting = require('../models/Setting');

const getPublicSettings = asyncHandler(async (req, res) => {
  // Fetch all settings stored in MongoDB
  const settings = await Setting.find({});
  const formattedSettings = {};
  settings.forEach(s => {
    if (s.key && s.value !== undefined) {
      formattedSettings[s.key] = s.value;
    }
  });

  // Dynamic fallbacks from process.env if not set in DB
  if (!formattedSettings.businessUpi) {
    formattedSettings.businessUpi = process.env.BUSINESS_UPI || 'srivastavaanant39@oksbi';
  }
  if (!formattedSettings.businessName) {
    formattedSettings.businessName = process.env.BUSINESS_NAME || 'PolishedByAnshika';
  }
  if (!formattedSettings.businessWhatsapp) {
    formattedSettings.businessWhatsapp = process.env.BUSINESS_WHATSAPP || '+916394802184';
  }
  if (!formattedSettings.businessInstagram) {
    formattedSettings.businessInstagram = process.env.BUSINESS_INSTAGRAM || '@polished_by_anshika';
  }
  if (!formattedSettings.businessEmail) {
    formattedSettings.businessEmail = process.env.BUSINESS_EMAIL || 'polishedbyanshika@gmail.com';
  }
  if (!formattedSettings.shippingCharge) {
    formattedSettings.shippingCharge = process.env.SHIPPING_CHARGE || '50';
  }
  if (!formattedSettings.freeShippingAbove) {
    formattedSettings.freeShippingAbove = process.env.FREE_SHIPPING_ABOVE || '999';
  }

  res.json({ success: true, data: formattedSettings, businessUpi: formattedSettings.businessUpi });
});

const getAllSettings = asyncHandler(async (req, res) => {
  const settings = await Setting.find();
  res.json({ success: true, data: settings });
});

const updateSetting = asyncHandler(async (req, res) => {
  const { key, value } = req.body;
  const setting = await Setting.findOneAndUpdate(
    { key },
    { value, isPublic: true },
    { new: true, upsert: true }
  );
  res.json({ success: true, data: setting });
});

// Utility to preseed default settings if they don't exist
const seedSettings = async () => {
  const defaults = [
    { key: 'businessName', value: process.env.BUSINESS_NAME || 'PolishedByAnshika', type: 'string', isPublic: true },
    { key: 'businessWhatsapp', value: process.env.BUSINESS_WHATSAPP || '+916394802184', type: 'string', isPublic: true },
    { key: 'businessInstagram', value: process.env.BUSINESS_INSTAGRAM || '@polished_by_anshika', type: 'string', isPublic: true },
    { key: 'businessEmail', value: process.env.BUSINESS_EMAIL || 'polishedbyanshika@gmail.com', type: 'string', isPublic: true },
    { key: 'businessUpi', value: process.env.BUSINESS_UPI || 'srivastavaanant39@oksbi', type: 'string', isPublic: true },
    { key: 'shippingCharge', value: process.env.SHIPPING_CHARGE || '50', type: 'number', isPublic: true },
    { key: 'freeShippingAbove', value: process.env.FREE_SHIPPING_ABOVE || '999', type: 'number', isPublic: true }
  ];

  for (const s of defaults) {
    await Setting.findOneAndUpdate({ key: s.key }, s, { upsert: true });
  }
};

module.exports = {
  getPublicSettings,
  getAllSettings,
  updateSetting,
  seedSettings
};
