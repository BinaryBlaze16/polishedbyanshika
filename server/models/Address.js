const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  addressType: {
    type: String,
    enum: ['Home', 'Office', 'Parents', 'Other'],
    default: 'Home'
  },
  houseNumber: {
    type: String,
    required: [true, 'House/Flat/Building number is required'],
    trim: true
  },
  street: {
    type: String,
    required: [true, 'Street/Area/Locality is required'],
    trim: true
  },
  landmark: {
    type: String,
    trim: true,
    default: ''
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true
  },
  pincode: {
    type: String,
    required: [true, 'PIN Code is required'],
    trim: true
  },
  country: {
    type: String,
    default: 'India',
    trim: true
  },
  isDefault: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Address', addressSchema);
