const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const Category = require('../models/Category');
const { uploadImageToCloudinary } = require('../utils/cloudinaryUpload');

const getProducts = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.limit) || 12;
  const page = Number(req.query.page) || 1;
  
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: 'i' } },
          { tags: { $regex: req.query.search, $options: 'i' } },
        ]
      }
    : {};

  let categoryFilter = {};
  if (req.query.category) {
    const category = await Category.findOne({ slug: req.query.category });
    if (category) {
      categoryFilter = { category: category._id };
    }
  }

  const priceFilter = {};
  if (req.query.minPrice) priceFilter.$gte = Number(req.query.minPrice);
  if (req.query.maxPrice) priceFilter.$lte = Number(req.query.maxPrice);
  const priceQuery = Object.keys(priceFilter).length > 0 ? { price: priceFilter } : {};

  const shapeFilter = req.query.shapes ? { shapes: { $in: req.query.shapes.split(',') } } : {};
  const lengthFilter = req.query.lengths ? { lengths: { $in: req.query.lengths.split(',') } } : {};
  const isFeaturedFilter = req.query.isFeatured === 'true' ? { isFeatured: true } : {};

  const filter = { 
    ...keyword, 
    ...categoryFilter, 
    ...priceQuery,
    ...shapeFilter,
    ...lengthFilter,
    ...isFeaturedFilter,
    isActive: true 
  };

  let sortQuery = { createdAt: -1 };
  if (req.query.sortBy) {
    if (req.query.sortBy === 'price-asc') sortQuery = { price: 1 };
    else if (req.query.sortBy === 'price-desc') sortQuery = { price: -1 };
    else if (req.query.sortBy === 'popular') sortQuery = { soldCount: -1 };
  }

  const count = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .populate('category', 'name slug')
    .sort(sortQuery)
    .skip(pageSize * (page - 1))
    .limit(pageSize)
    .lean();

  res.json({
    success: true,
    data: products,
    products: products,
    page,
    pages: Math.ceil(count / pageSize),
    total: count
  });
});

const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true })
    .populate('category', 'name slug')
    .lean();

  if (product) {
    res.json({ success: true, data: product, product });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category', 'name slug');
  if (product) {
    res.json({ success: true, data: product, product });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isActive: true, isFeatured: true })
    .populate('category', 'name slug')
    .limit(8)
    .lean();
  res.json({ success: true, data: products, products });
});

const getRelatedProducts = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const related = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
    isActive: true
  })
    .limit(4)
    .lean();

  res.json({ success: true, data: related, products: related });
});

const createProduct = asyncHandler(async (req, res) => {
  const productData = { ...req.body };
  
  if (req.files && req.files.length > 0) {
    const images = [];
    for (const file of req.files) {
      const result = await uploadImageToCloudinary(file.buffer, 'products');
      images.push({ url: result.url, public_id: result.public_id });
    }
    productData.images = images;
  } else if (!productData.images || productData.images.length === 0) {
    productData.images = [{
      url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600',
      public_id: 'default_nail_art'
    }];
  }

  if (typeof productData.shapes === 'string') {
    productData.shapes = productData.shapes.split(',').map(s => s.trim());
  }
  if (typeof productData.lengths === 'string') {
    productData.lengths = productData.lengths.split(',').map(l => l.trim());
  }

  const product = await Product.create(productData);
  res.status(201).json({ success: true, data: product, product });
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const updateData = { ...req.body };
  
  if (req.files && req.files.length > 0) {
    const images = [...(product.images || [])];
    for (const file of req.files) {
      const result = await uploadImageToCloudinary(file.buffer, 'products');
      images.push({ url: result.url, public_id: result.public_id });
    }
    updateData.images = images;
  }

  if (typeof updateData.shapes === 'string') {
    updateData.shapes = updateData.shapes.split(',').map(s => s.trim());
  }
  if (typeof updateData.lengths === 'string') {
    updateData.lengths = updateData.lengths.split(',').map(l => l.trim());
  }

  const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
  res.json({ success: true, data: updatedProduct, product: updatedProduct });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    product.isActive = false;
    await product.save();
    res.json({ success: true, message: 'Product deleted (soft)' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

const toggleProductVisibility = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    product.isActive = !product.isActive;
    await product.save();
    res.json({ success: true, data: product, product });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

module.exports = {
  getProducts,
  getProductBySlug,
  getProductById,
  getFeaturedProducts,
  getRelatedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductVisibility
};
