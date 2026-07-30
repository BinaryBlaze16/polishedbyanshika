const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

dotenv.config();

const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { generalLimiter } = require('./middleware/rateLimiter');

// Routes
const authRoutes = require('./routes/authRoutes');
const addressRoutes = require('./routes/addressRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const couponRoutes = require('./routes/couponRoutes');
const customRequestRoutes = require('./routes/customRequestRoutes');
const bannerRoutes = require('./routes/bannerRoutes');
const settingRoutes = require('./routes/settingRoutes');

// ─── Environment Variables Validation ───────────────────────────────────────
const requiredEnvVars = [
  'NODE_ENV',
  'PORT',
  'MONGODB_URI',
  'JWT_SECRET',
  'JWT_EXPIRE',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'BUSINESS_NAME',
  'BUSINESS_WHATSAPP',
  'CLIENT_URL',
];

const missingEnvVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.warn(`\n⚠️  WARNING: Missing environment variables: ${missingEnvVars.join(', ')}`);
  if (process.env.NODE_ENV === 'production') {
    console.error(`❌ Critical environment variables are missing in production! Please check your Railway settings.\n`);
  }
} else {
  console.log(`\n✅ Environment Check Passed: All required environment variables are set.`);
}

// ─── Connect to Database ─────────────────────────────────────────────────────
connectDB();

const app = express();

// ─── Express Proxy Setup (Required for Railway / Vercel / Reverse Proxies) ──
app.set('trust proxy', 1);

// ─── Security Middleware ─────────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// ─── CORS Configuration ──────────────────────────────────────────────────────
const rawClientUrls = process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',') : [];
const clientUrls = rawClientUrls
  .map((url) => url.trim().replace(/\/+$/, ''))
  .filter(Boolean);

const allowedOrigins = [
  ...clientUrls,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (Postman, mobile apps, server-to-server)
    if (!origin) return callback(null, true);

    const normalizedOrigin = origin.trim().replace(/\/+$/, '');

    // Allow configured CLIENT_URL, any *.vercel.app deployment, or local dev
    if (
      allowedOrigins.includes(normalizedOrigin) ||
      normalizedOrigin.endsWith('.vercel.app') ||
      normalizedOrigin.startsWith('http://localhost:') ||
      normalizedOrigin.startsWith('http://127.0.0.1:')
    ) {
      return callback(null, true);
    }

    console.warn(`⚠️ CORS blocked request from origin: ${origin}`);
    return callback(null, false);
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// ─── Body Parser ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Rate Limiting ───────────────────────────────────────────────────────────
app.use('/api/', generalLimiter);

// ─── Health Check ────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '💅 PolishedByAnshika API is running!',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ──────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/custom-requests', customRequestRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/settings', settingRoutes);

// ─── Error Handling ──────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Start Server ────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`💅 PolishedByAnshika Server Running`);
  console.log(`🌍 Environment     : ${process.env.NODE_ENV || 'development'}`);
  console.log(`🚀 Listening Port   : ${PORT}`);
  console.log(`🔗 Allowed Origins  : ${allowedOrigins.length > 0 ? allowedOrigins.join(', ') : 'None specified'}`);
  console.log(`==================================================\n`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = app;
