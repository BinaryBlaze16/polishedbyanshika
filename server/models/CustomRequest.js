const mongoose = require('mongoose');

const customRequestSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: String,
  whatsappNumber: String,
  nailShape: String,
  nailLength: String,
  customSizeInMm: {
    thumb: Number,
    index: Number,
    middle: Number,
    ring: Number,
    pinky: Number
  },
  referenceImages: [{
    url: String,
    public_id: String
  }],
  description: String,
  inspirationLinks: [{ type: String }],
  budgetRange: String,
  occasion: String,
  status: {
    type: String,
    enum: ['Pending', 'Reviewing', 'Quoted', 'Accepted', 'Rejected', 'Completed'],
    default: 'Pending'
  },
  adminNotes: String,
  quotedPrice: Number,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('CustomRequest', customRequestSchema);
