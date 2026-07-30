const asyncHandler = require('express-async-handler');
const Address = require('../models/Address');
const User = require('../models/User');

// @desc    Get all saved addresses for logged-in user
// @route   GET /api/addresses
// @access  Private
const getAddresses = asyncHandler(async (req, res) => {
  const addresses = await Address.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: -1 });
  res.json({
    success: true,
    count: addresses.length,
    data: addresses
  });
});

// @desc    Create a new shipping address
// @route   POST /api/addresses
// @access  Private
const createAddress = asyncHandler(async (req, res) => {
  const {
    fullName,
    phone,
    addressType,
    houseNumber,
    street,
    landmark,
    city,
    state,
    pincode,
    country,
    isDefault
  } = req.body;

  if (!fullName || !phone || !houseNumber || !street || !city || !state || !pincode) {
    res.status(400);
    throw new Error('Please fill in all required address fields');
  }

  const existingCount = await Address.countDocuments({ user: req.user._id });
  const shouldBeDefault = isDefault || existingCount === 0;

  if (shouldBeDefault) {
    await Address.updateMany({ user: req.user._id }, { isDefault: false });
  }

  const address = await Address.create({
    user: req.user._id,
    fullName,
    phone,
    addressType: addressType || 'Home',
    houseNumber,
    street,
    landmark: landmark || '',
    city,
    state,
    pincode,
    country: country || 'India',
    isDefault: shouldBeDefault
  });

  // If user doesn't have phone, set it from this address
  if (!req.user.phone) {
    await User.findByIdAndUpdate(req.user._id, { phone });
  }

  res.status(201).json({
    success: true,
    message: 'Address added successfully',
    data: address
  });
});

// @desc    Update an existing address
// @route   PUT /api/addresses/:id
// @access  Private
const updateAddress = asyncHandler(async (req, res) => {
  const address = await Address.findById(req.params.id);

  if (!address) {
    res.status(404);
    throw new Error('Address not found');
  }

  if (address.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this address');
  }

  const { isDefault } = req.body;

  if (isDefault) {
    await Address.updateMany({ user: req.user._id }, { isDefault: false });
  }

  const updatedAddress = await Address.findByIdAndUpdate(
    req.params.id,
    { ...req.body },
    { new: true, runValidators: true }
  );

  res.json({
    success: true,
    message: 'Address updated successfully',
    data: updatedAddress
  });
});

// @desc    Delete an address
// @route   DELETE /api/addresses/:id
// @access  Private
const deleteAddress = asyncHandler(async (req, res) => {
  const address = await Address.findById(req.params.id);

  if (!address) {
    res.status(404);
    throw new Error('Address not found');
  }

  if (address.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this address');
  }

  const wasDefault = address.isDefault;
  await address.deleteOne();

  // If deleted address was default, promote the most recent remaining address to default
  if (wasDefault) {
    const nextDefault = await Address.findOne({ user: req.user._id }).sort({ createdAt: -1 });
    if (nextDefault) {
      nextDefault.isDefault = true;
      await nextDefault.save();
    }
  }

  res.json({
    success: true,
    message: 'Address deleted successfully'
  });
});

// @desc    Set an address as default
// @route   PUT /api/addresses/:id/default
// @access  Private
const setDefaultAddress = asyncHandler(async (req, res) => {
  const address = await Address.findById(req.params.id);

  if (!address) {
    res.status(404);
    throw new Error('Address not found');
  }

  if (address.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to modify this address');
  }

  await Address.updateMany({ user: req.user._id }, { isDefault: false });

  address.isDefault = true;
  await address.save();

  res.json({
    success: true,
    message: 'Default address updated',
    data: address
  });
});

module.exports = {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
};
