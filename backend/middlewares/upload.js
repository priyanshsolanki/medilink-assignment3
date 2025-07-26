const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Proper dynamic storage configuration
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isRawMime = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ].includes(file.mimetype);

    return {
      folder: 'records',
      resource_type: isRawMime ? 'raw' : 'image',
      public_id: `record_${Date.now()}`,
    };
  }
});

// Multer setup
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = /\/(jpeg|jpg|png|pdf|msword|vnd.openxmlformats-officedocument.wordprocessingml.document)$/;
    const isAllowed = allowedTypes.test(file.mimetype);
    cb(isAllowed ? null : new Error('Unsupported file type'), isAllowed);
  }
});

module.exports = upload;
