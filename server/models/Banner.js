const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: String,
  image: {
    url: String,
    public_id: String
  },
  link: String,
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  type: { type: String, enum: ['hero', 'promotional', 'category'] }
}, { timestamps: true });

module.exports = mongoose.model('Banner', bannerSchema);
