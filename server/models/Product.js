const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true },
  description: { type: String },
  shortDescription: { type: String },
  price: { type: Number, required: true },
  discountPrice: { type: Number },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  images: [{
    url: String,
    public_id: String
  }],
  shapes: [{ type: String, enum: ['Square', 'Almond', 'Coffin', 'Stiletto', 'Oval', 'Round'] }],
  lengths: [{ type: String, enum: ['Short', 'Medium', 'Long', 'Extra Long'] }],
  stock: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  ratings: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  tags: [{ type: String }],
  prepKit: [{ type: String }],
  careInstructions: { type: String }
}, { timestamps: true });

productSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
