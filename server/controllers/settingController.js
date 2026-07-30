const asyncHandler = require('express-async-handler');
const Setting = require('../models/Setting');

const getPublicSettings = asyncHandler(async (req, res) => {
  const settings = await Setting.find({ isPublic: true });
  const formattedSettings = {};
  settings.forEach(s => {
    formattedSettings[s.key] = s.value;
  });
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
    { value },
    { new: true, upsert: true }
  );
  res.json({ success: true, data: setting });
});

// Utility to preseed default settings if they don't exist
const seedSettings = async () => {
  const defaults = [
    { key: 'businessName', value: 'PolishedByAnshika', type: 'string', isPublic: true },
    { key: 'businessWhatsapp', value: '+910000000000', type: 'string', isPublic: true },
    { key: 'businessInstagram', value: 'https://instagram.com/', type: 'string', isPublic: true },
    { key: 'businessUpi', value: 'upi@id', type: 'string', isPublic: false },
    { key: 'shippingCharge', value: '100', type: 'number', isPublic: true },
    { key: 'freeShippingAbove', value: '1000', type: 'number', isPublic: true }
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
