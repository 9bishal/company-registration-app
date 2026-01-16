const multer = require('multer');
const path = require('path');

// Configure multer for memory storage (since we're uploading to Cloudinary)
const storage = multer.memoryStorage();

// File filter for images
const fileFilter = (req, file, cb) => {
  // Allowed mime types
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`));
  }
};

// Create multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

module.exports = upload;
