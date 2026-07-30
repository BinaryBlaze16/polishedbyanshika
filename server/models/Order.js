const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: String,
  qty: Number,
  price: Number,
  image: String,
  selectedShape: String,
  selectedLength: String,
  selectedSize: String,
  customSizeInMm: {
    thumb: Number,
    index: Number,
    middle: Number,
    ring: Number,
    pinky: Number
  }
});

const statusHistorySchema = new mongoose.Schema({
  status: String,
  updatedAt: { type: Date, default: Date.now },
  note: String
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  orderNumber: { type: String, unique: true },
  orderItems: [orderItemSchema],
  shippingAddress: {
    fullName: String,
    phone: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    pincode: String
  },
  paymentMethod: {
    type: String,
    enum: ['UPI_MANUAL', 'COD', 'RAZORPAY'],
    default: 'UPI_MANUAL'
  },
  paymentDetails: {
    utrNumber: String,
    paymentScreenshotUrl: String,
    isPaid: { type: Boolean, default: false },
    paidAt: Date
  },
  itemsPrice: Number,
  shippingPrice: Number,
  discountAmount: Number,
  totalPrice: Number,
  couponApplied: {
    code: String,
    discountAmount: Number
  },
  orderStatus: {
    type: String,
    enum: ['Pending', 'Accepted', 'Preparing', 'Packed', 'Shipped', 'Out For Delivery', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  statusHistory: [statusHistorySchema],
  trackingNumber: String,
  courierPartner: String,
  deliveredAt: Date,
  notes: String
}, { timestamps: true });

orderSchema.pre('save', function(next) {
  if (!this.orderNumber) {
    this.orderNumber = `PBA-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
