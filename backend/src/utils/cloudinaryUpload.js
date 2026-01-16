const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload file to Cloudinary
 * @param {Buffer} fileBuffer - File buffer to upload
 * @param {string} fileName - File name for storage
 * @param {string} folder - Cloudinary folder path
 * @returns {Promise<Object>} - Upload result with secure URL
 */
const uploadToCloudinary = (fileBuffer, fileName, folder = 'company-registration') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: 'auto',
        public_id: fileName.replace(/\.[^/.]+$/, '') // Remove extension
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve({
            success: true,
            url: result.secure_url,
            publicId: result.public_id,
            size: result.bytes
          });
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
};

/**
 * Delete file from Cloudinary
 * @param {string} publicId - Public ID of file to delete
 * @returns {Promise<Object>} - Deletion result
 */
const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return {
      success: result.result === 'ok',
      message: result.result === 'ok' ? 'File deleted successfully' : 'Failed to delete file'
    };
  } catch (error) {
    console.error('Cloudinary deletion error:', error);
    throw error;
  }
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
  cloudinary
};
