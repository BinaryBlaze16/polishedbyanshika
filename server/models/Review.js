const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  orderItemId: { type: mongoose.Schema.Types.ObjectId, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, maxlength: 120 },
  comment: { type: String, required: true, maxlength: 2000 },
  images: [{ type: String }],
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  isVerifiedPurchase: { type: Boolean, default: true },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedAt: { type: Date },
}, { timestamps: true });

// One review per order item — enforce uniqueness at order item level
reviewSchema.index({ user: 1, order: 1, orderItemId: 1 }, { unique: true });
// Fast product review queries
reviewSchema.index({ product: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model('Review', reviewSchema);

