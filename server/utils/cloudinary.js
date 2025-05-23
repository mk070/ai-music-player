const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer for file uploads
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'music-player',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp3', 'wav', 'ogg'],
    resource_type: 'auto',
  },
});

// File filter for multer
const fileFilter = (req, file, cb) => {
  // Accept images and audio files
  const filetypes = /jpeg|jpg|png|gif|webp|mp3|wav|ogg/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Error: Only image and audio files are allowed!'));
  }
};

// Initialize multer with options
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max file size
  },
});

// Helper function to delete a file from Cloudinary
const deleteFile = async (publicId, resourceType = 'image') => {
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
      invalidate: true,
    });
    return true;
  } catch (error) {
    console.error('Error deleting file from Cloudinary:', error);
    return false;
  }
};

// Helper function to upload a file to Cloudinary
const uploadFile = async (filePath, options = {}) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: options.folder || 'music-player/uploads',
      resource_type: options.resourceType || 'auto',
      ...options,
    });
    return result;
  } catch (error) {
    console.error('Error uploading file to Cloudinary:', error);
    throw error;
  }
};

// Helper function to handle multiple file uploads
const uploadFiles = async (files, options = {}) => {
  try {
    const uploadPromises = files.map((file) =>
      uploadFile(file.path, { ...options, public_id: file.filename })
    );
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error('Error uploading multiple files to Cloudinary:', error);
    throw error;
  }
};

module.exports = {
  cloudinary,
  upload,
  deleteFile,
  uploadFile,
  uploadFiles,
};
