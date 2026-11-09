const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');

dotenv.config();

const connectDB = require('./config/db');

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
    console.error(`❌ Critical environment variables missing in production! Please check your deployment settings.\n`);
  }
} else {
  console.log(`\n✅ Environment Check Passed: All required environment variables are set.`);
}

// ─── Connect to Database ─────────────────────────────────────────────────────
connectDB();

const app = express();

// ─── Proxy Setup (Crucial for Reverse Proxies / AWS ALB / Nginx / Cloudflare) ─
app.set('trust proxy', 1);

// ─── 1. Security HTTP Headers (Helmet) ──────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// ─── 2. CORS Hardening ──────────────────────────────────────────────────────
const allowedOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map((url) => url.trim().replace(/\/+$/, ''))
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (Postman, server-to-server, health check probes)
    if (!origin) return callback(null, true);

    const normalizedOrigin = origin.trim().replace(/\/+$/, '');

    // Allow explicitly defined client domains
    if (allowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    }

    // Allow localhost/dev ports during local development only
    if (
      process.env.NODE_ENV !== 'production' &&
      (normalizedOrigin.startsWith('http://localhost:') || normalizedOrigin.startsWith('http://127.0.0.1:'))
    ) {
      return callback(null, true);
    }

    return callback(new Error(`CORS policy violation: Origin ${origin} not allowed.`), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// ─── 3. Response Compression ────────────────────────────────────────────────
app.use(compression());

// ─── 4. Payload Limits ──────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── 5. Rate Limiting ───────────────────────────────────────────────────────
// Global API Limiter: 100 requests per 15 minutes per IP
const globalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
});
app.use('/api/', globalApiLimiter);

// Strict Auth Limiter: 10 requests per 15 minutes for login/register endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP, please try again after 15 minutes.',
  },
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// ─── Health & Diagnostic Checks ─────────────────────────────────────────────
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

// ─── 6. Centralized Error Handling ──────────────────────────────────────────
// 404 Handler
app.use((req, res, next) => {
  const error = new Error(`Resource not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// Production-Safe Error Handler
app.use((err, req, res, next) => {
  const isProduction = process.env.NODE_ENV === 'production';
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';

  // Handle Mongoose, Multer & JWT specific errors cleanly
  if (err.name === 'MulterError') {
    statusCode = 400;
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'Image size must be less than 5MB.';
    } else if (err.code === 'LIMIT_FILE_COUNT') {
      message = 'Too many files uploaded. Maximum allowed limit exceeded.';
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      message = `Unexpected upload field: '${err.field}'.`;
    } else {
      message = `Upload error: ${err.message}`;
    }
  } else if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400;
    message = 'Resource not found';
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map((val) => val.message).join(', ');
  } else if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `Duplicate value entered for ${field}`;
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token. Authorization denied.';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Session expired. Please log in again.';
  }

  // In development, log the full stack trace for debugging
  // In production, log only an audit message for 500 errors and avoid leaking stack traces
  if (!isProduction) {
    console.error('💥 [Dev Error Stack]:', err.stack);
  } else if (statusCode === 500) {
    console.error(`💥 [500 Internal Error]: ${err.message}`);
  }

  res.status(statusCode).json({
    success: false,
    message: isProduction && statusCode === 500 ? 'Internal Server Error' : message,
    ...(isProduction ? {} : { stack: err.stack }),
  });
});

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
