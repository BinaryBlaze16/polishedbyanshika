const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = require('../config/db');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Banner = require('../models/Banner');
const Setting = require('../models/Setting');

// ─── Admin Account ────────────────────────────────────────────────────────────
const adminUser = {
  name: 'Anshika',
  email: 'admin@polishedbyanshika.com',
  password: 'Anshika@#6394802184',
  phone: '+916394802184',
  role: 'admin',
};

// ─── Categories ───────────────────────────────────────────────────────────────
const categories = [
  { name: 'Bridal', slug: 'bridal', description: 'Stunning bridal nail sets for your special day', image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400' },
  { name: 'Minimalist', slug: 'minimalist', description: 'Clean, simple, and elegant nail designs', image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400' },
  { name: 'Y2K Trendy', slug: 'y2k-trendy', description: 'Bold and trendy nail sets inspired by Y2K aesthetics', image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400' },
  { name: 'Festive', slug: 'festive', description: 'Celebrate every occasion with festive nail art', image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400' },
  { name: 'Daily Wear', slug: 'daily-wear', description: 'Comfortable and stylish everyday nail sets', image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400' },
  { name: 'French', slug: 'french', description: 'Classic and modern French tip nail designs', image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400' },
];

// ─── Demo Products ────────────────────────────────────────────────────────────
const demoProducts = [
  {
    name: 'Rose Petal Bridal Set',
    description: 'A stunning bridal set featuring delicate 3D rose petals with pearl accents on a soft nude base. Perfect for weddings, engagements, and sangeets. Each nail is hand-crafted with love.',
    shortDescription: 'Delicate 3D roses on nude base — perfect for brides',
    price: 899,
    discountPrice: 749,
    categoryName: 'Bridal',
    shapes: ['Almond', 'Coffin', 'Oval'],
    lengths: ['Medium', 'Long', 'Extra Long'],
    stock: 15,
    isFeatured: true,
    tags: ['bridal', 'wedding', 'roses', 'nude', 'pearl'],
    prepKit: ['Nail Glue', 'Jelly Gel Adhesive Tabs', 'Cuticle Pusher', 'Buffer Block', 'Alcohol Prep Pad'],
    careInstructions: 'Avoid prolonged exposure to water. Store in the provided box when not in use. Use nail glue for long-lasting wear (up to 2-3 weeks).',
    images: [
      { url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600', public_id: 'demo_rose_1' },
      { url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600', public_id: 'demo_rose_2' },
    ],
  },
  {
    name: 'Midnight Velvet Gothic',
    description: 'Deep black velvet base with gold foil accents and subtle shimmer. Edgy, bold, and absolutely mesmerizing. Coffin shape brings out the drama.',
    shortDescription: 'Black velvet with gold foil — bold & dramatic',
    price: 799,
    discountPrice: 649,
    categoryName: 'Y2K Trendy',
    shapes: ['Coffin', 'Stiletto'],
    lengths: ['Long', 'Extra Long'],
    stock: 20,
    isFeatured: true,
    tags: ['gothic', 'black', 'gold', 'velvet', 'edgy', 'y2k'],
    prepKit: ['Nail Glue', 'Jelly Gel Adhesive Tabs', 'Cuticle Pusher', 'Buffer Block', 'Alcohol Prep Pad'],
    careInstructions: 'Store in cool, dry place. Avoid nail polish remover on press-ons.',
    images: [
      { url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600', public_id: 'demo_velvet_1' },
    ],
  },
  {
    name: 'Peach Blossom Spring',
    description: 'Soft peach tones with hand-painted cherry blossom details. Light, airy, and perfect for spring/summer. A fan favourite among daily wear collections.',
    shortDescription: 'Peach base with hand-painted cherry blossoms',
    price: 699,
    discountPrice: null,
    categoryName: 'Daily Wear',
    shapes: ['Square', 'Almond', 'Oval', 'Round'],
    lengths: ['Short', 'Medium', 'Long'],
    stock: 25,
    isFeatured: true,
    tags: ['peach', 'floral', 'spring', 'daily', 'soft'],
    prepKit: ['Nail Glue', 'Jelly Gel Adhesive Tabs', 'Cuticle Pusher', 'Buffer Block', 'Alcohol Prep Pad'],
    careInstructions: 'Gentle on hands. Safe for daily wear up to 2 weeks with glue.',
    images: [
      { url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600', public_id: 'demo_peach_1' },
    ],
  },
  {
    name: 'Glazed Donut Hailey',
    description: 'The iconic glazed donut nail look made popular by Hailey Bieber. High-shine chrome finish on a sheer white/pink base. Timeless, chic, and ultra-viral.',
    shortDescription: 'Viral glazed donut chrome nails — Hailey Bieber inspired',
    price: 849,
    discountPrice: 699,
    categoryName: 'Minimalist',
    shapes: ['Oval', 'Almond', 'Square'],
    lengths: ['Short', 'Medium'],
    stock: 30,
    isFeatured: true,
    tags: ['glazed', 'chrome', 'minimalist', 'viral', 'hailey', 'sheer'],
    prepKit: ['Nail Glue', 'Jelly Gel Adhesive Tabs', 'Cuticle Pusher', 'Buffer Block', 'Alcohol Prep Pad'],
    careInstructions: 'Chrome finish is delicate — avoid harsh chemicals.',
    images: [
      { url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600', public_id: 'demo_glazed_1' },
    ],
  },
  {
    name: 'Festive Diwali Glow',
    description: 'Rich burgundy and gold intricate mehndi-inspired patterns. 3D golden beads and glitter accents. Perfect for Diwali, Navratri, and Indian festive occasions.',
    shortDescription: 'Burgundy & gold mehndi patterns for Indian festivals',
    price: 949,
    discountPrice: 799,
    categoryName: 'Festive',
    shapes: ['Almond', 'Coffin', 'Oval'],
    lengths: ['Medium', 'Long'],
    stock: 18,
    isFeatured: false,
    tags: ['diwali', 'festive', 'gold', 'mehndi', 'burgundy', 'indian'],
    prepKit: ['Nail Glue', 'Jelly Gel Adhesive Tabs', 'Cuticle Pusher', 'Buffer Block', 'Alcohol Prep Pad'],
    careInstructions: 'Handle 3D embellishments with care. Best applied 1 day before the event.',
    images: [
      { url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600', public_id: 'demo_diwali_1' },
    ],
  },
  {
    name: 'French Kiss Classic',
    description: 'The timeless French manicure reimagined. Ultra-thin white tips on a sheer pink base with a modern twist — extra glossy and perfectly shaped.',
    shortDescription: 'Modern French tips — ultra glossy & timeless',
    price: 599,
    discountPrice: null,
    categoryName: 'French',
    shapes: ['Square', 'Oval', 'Round', 'Almond'],
    lengths: ['Short', 'Medium'],
    stock: 40,
    isFeatured: false,
    tags: ['french', 'classic', 'white tips', 'clean', 'office-friendly'],
    prepKit: ['Nail Glue', 'Jelly Gel Adhesive Tabs', 'Cuticle Pusher', 'Buffer Block', 'Alcohol Prep Pad'],
    careInstructions: 'Perfect for office and formal settings. Up to 3 weeks with glue.',
    images: [
      { url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600', public_id: 'demo_french_1' },
    ],
  },
  {
    name: 'Barbie Pink Barbiecore',
    description: 'Hot pink and fuchsia explosion with glitter, rhinestones, and 3D bow accents. Embrace your inner Barbie! Unapologetically bold and fabulous.',
    shortDescription: 'Hot pink rhinestone bows — full Barbiecore energy',
    price: 799,
    discountPrice: 649,
    categoryName: 'Y2K Trendy',
    shapes: ['Coffin', 'Stiletto', 'Almond'],
    lengths: ['Long', 'Extra Long'],
    stock: 22,
    isFeatured: true,
    tags: ['barbie', 'pink', 'rhinestone', 'bow', 'y2k', 'glitter', 'trendy'],
    prepKit: ['Nail Glue', 'Jelly Gel Adhesive Tabs', 'Cuticle Pusher', 'Buffer Block', 'Alcohol Prep Pad'],
    careInstructions: 'Rhinestones and 3D accents may snag on fine fabrics. Store carefully.',
    images: [
      { url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600', public_id: 'demo_barbie_1' },
    ],
  },
  {
    name: 'Sahara Sand Nude',
    description: 'Warm nude tones inspired by the Sahara desert. Subtle shimmer, clean lines, and an earthy palette. The go-to everyday set for a polished look.',
    shortDescription: 'Warm earthy nude with subtle shimmer — everyday glam',
    price: 649,
    discountPrice: null,
    categoryName: 'Daily Wear',
    shapes: ['Square', 'Oval', 'Round', 'Almond'],
    lengths: ['Short', 'Medium', 'Long'],
    stock: 35,
    isFeatured: false,
    tags: ['nude', 'neutral', 'earthy', 'shimmer', 'daily', 'office'],
    prepKit: ['Nail Glue', 'Jelly Gel Adhesive Tabs', 'Cuticle Pusher', 'Buffer Block', 'Alcohol Prep Pad'],
    careInstructions: 'Safe for all activities. Re-apply if one pops off — extra adhesive tabs included.',
    images: [
      { url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600', public_id: 'demo_nude_1' },
    ],
  },
];

// ─── Default Settings ─────────────────────────────────────────────────────────
const defaultSettings = [
  { key: 'businessName', value: 'PolishedByAnshika', description: 'Business display name' },
  { key: 'businessWhatsapp', value: '+916394802184', description: 'WhatsApp contact number' },
  { key: 'businessInstagram', value: '@polished_by_anshika', description: 'Instagram handle' },
  { key: 'businessUpi', value: 'polishedbyanshika@upi', description: 'UPI ID for payments' },
  { key: 'shippingCharge', value: 50, description: 'Flat shipping charge in INR' },
  { key: 'freeShippingAbove', value: 999, description: 'Free shipping above this order value' },
  { key: 'businessEmail', value: 'polishedbyanshika@gmail.com', description: 'Business email' },
  { key: 'returnPolicy', value: 'Due to hygiene reasons, custom press-on nails are non-refundable. In case of manufacturing defects, exchange within 48 hours of delivery.', description: 'Return/exchange policy' },
  { key: 'deliveryTimeline', value: '3-5 business days preparation + 4-7 business days shipping', description: 'Estimated delivery timeline' },
];

// ─── Hero Banners ─────────────────────────────────────────────────────────────
const banners = [
  {
    title: 'Wear Art. Live Beautiful.',
    subtitle: 'Handcrafted press-on nail sets — because every look deserves the perfect finish.',
    image: { url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=1200', public_id: 'banner_hero_1' },
    link: '/shop',
    isActive: true,
    order: 1,
    type: 'hero',
  },
  {
    title: 'Custom Nail Art — Your Design, Our Magic',
    subtitle: 'Submit your inspiration and we\'ll craft the set of your dreams.',
    image: { url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=1200', public_id: 'banner_hero_2' },
    link: '/custom-order',
    isActive: true,
    order: 2,
    type: 'hero',
  },
];

// ─── Seed Function ────────────────────────────────────────────────────────────
const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('\n🌱 Starting database seed...\n');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Banner.deleteMany({});
    await Setting.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const admin = await User.create(adminUser);
    console.log(`✅ Admin created: ${admin.email} (${admin.name})`);
    console.log(`   Password: Anshika@#6394802184`);

    // Create categories one by one so pre-save hooks (slug gen) fire
    const createdCategories = [];
    for (const cat of categories) {
      const created = await Category.create(cat);
      createdCategories.push(created);
    }
    console.log(`✅ ${createdCategories.length} categories created`);

    // Create a category map for easy lookup
    const categoryMap = {};
    createdCategories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });

    // Create products one by one so pre-save hooks (slug gen) fire
    const createdProducts = [];
    for (const p of demoProducts) {
      const productData = {
        ...p,
        category: categoryMap[p.categoryName],
        categoryName: undefined,
      };
      const created = await Product.create(productData);
      createdProducts.push(created);
    }
    console.log(`✅ ${createdProducts.length} demo products created`);

    // Create banners
    await Banner.insertMany(banners);
    console.log(`✅ ${banners.length} banners created`);

    // Create settings
    for (const setting of defaultSettings) {
      await Setting.findOneAndUpdate(
        { key: setting.key },
        setting,
        { upsert: true, new: true }
      );
    }
    console.log(`✅ ${defaultSettings.length} settings configured`);

    console.log('\n🎉 Database seeded successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('💅 Admin Login:');
    console.log('   Email    : admin@polishedbyanshika.com');
    console.log('   Password : Anshika@#6394802184');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();
