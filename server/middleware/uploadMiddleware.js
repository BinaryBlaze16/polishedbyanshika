const multer = require('multer');
const path = require('path');

// ─── 1. Storage Configuration (Pure In-Memory Streaming) ─────────────────────
// Uses memory storage so buffers stream directly to Cloudinary without leaving
// temporary or orphaned files on disk.
const storage = multer.memoryStorage();

// ─── 2. Strict File Type Whitelist ───────────────────────────────────────────
// Allows ONLY image/jpeg, image/png, and image/webp.
// Explicitly rejects SVGs, PDFs, executables, scripts, and any non-whitelisted types.
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp']);
const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype.toLowerCase();

  // Explicit safety block against SVGs (can contain stored XSS scripts)
  if (ext === '.svg' || mimetype.includes('svg') || ext === '.pdf' || ext === '.html' || ext === '.js') {
    return cb(new Error('Disallowed file format. SVG, PDF, and script files are strictly blocked for security.'), false);
  }

  if (ALLOWED_MIME_TYPES.has(mimetype) && ALLOWED_EXTENSIONS.has(ext)) {
    return cb(null, true);
  }

  return cb(new Error('Invalid file type. Only JPEG, PNG, and WEBP images are allowed.'), false);
};

// ─── 3. Multer Core Instance with 5MB Limit ─────────────────────────────────
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file limit
  },
});

// ─── 4. Error Interceptor Middleware ─────────────────────────────────────────
// Intercepts Multer limits and validation errors to return clean 400 Bad Request JSON
const formatMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    let message = 'File upload error.';
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'Image size must be less than 5MB.';
    } else if (err.code === 'LIMIT_FILE_COUNT') {
      message = 'Too many files uploaded. Maximum allowed limit exceeded.';
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      message = `Unexpected upload field: '${err.field}'. Please verify your form payload.`;
    }
    return res.status(400).json({ success: false, message });
  }

  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message || 'File upload failed validation.',
    });
  }

  next();
};

// ─── 5. Exported Middleware Wrappers ─────────────────────────────────────────
const uploadSingle = (fieldName) => {
  const singleHandler = upload.single(fieldName);
  return (req, res, next) => {
    singleHandler(req, res, (err) => {
      formatMulterError(err, req, res, next);
    });
  };
};

const uploadMultiple = (fieldName, maxCount = 4) => {
  const arrayHandler = upload.array(fieldName, maxCount);
  return (req, res, next) => {
    arrayHandler(req, res, (err) => {
      formatMulterError(err, req, res, next);
    });
  };
};

module.exports = {
  upload,
  uploadSingle,
  uploadMultiple,
};
