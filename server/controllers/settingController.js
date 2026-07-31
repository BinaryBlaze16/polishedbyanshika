const asyncHandler = require('express-async-handler');
const Setting = require('../models/Setting');

const getPublicSettings = asyncHandler(async (req, res) => {
  const settings = await Setting.find({ isPublic: true });
  const formattedSettings = {};
  settings.forEach(s => {
    formattedSettings[s.key] = s.value;
  });

  // Dynamic fallbacks from process.env
  if (!formattedSettings.businessUpi) {
    formattedSettings.businessUpi = process.env.BUSINESS_UPI || 'srivastavaanant39@oksbi';
  }
  if (!formattedSettings.businessName) {
    formattedSettings.businessName = process.env.BUSINESS_NAME || 'PolishedByAnshika';
  }
  if (!formattedSettings.businessWhatsapp) {
    formattedSettings.businessWhatsapp = process.env.BUSINESS_WHATSAPP || '+916394802184';
  }

  res.json({ success: true, data: formattedSettings });
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
