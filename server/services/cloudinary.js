// config/cloudinary.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage configuration for audio files
const audioStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'music-player/audio',
    resource_type: 'video', // For audio files
    allowed_formats: ['mp3', 'wav', 'flac', 'm4a', 'aac'],
    transformation: [
      { quality: 'auto' },
      { fetch_format: 'auto' }
    ]
  },
});

// Storage configuration for cover images
const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'music-player/covers',
    resource_type: 'image',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [
      { width: 500, height: 500, crop: 'fill' },
      { quality: 'auto' },
      { fetch_format: 'auto' }
    ]
  },
});

// Multer upload instances
const uploadAudio = multer({
  storage: audioStorage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB limit for audio files
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Please upload only audio files'), false);
    }
  },
});

const uploadImage = multer({
  storage: imageStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit for images
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Please upload only image files'), false);
    }
  },
});

// Combined upload for song with cover
const uploadSongWithCover = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB total limit
    fieldSize: 10 * 1024 * 1024, // 10MB field size
    fields: 20, // Maximum number of non-file fields
    files: 10, // Maximum number of files
  },
  fileFilter: (req, file, cb) => {
    console.log('=== FILE FILTER ===');
    console.log('Processing file:', {
      fieldname: file.fieldname,
      originalname: file.originalname,
      encoding: file.encoding,
      mimetype: file.mimetype,
      size: file.size || 'Unknown size'
    });
    
    try {
      if (file.fieldname === 'song') {
        if (file.mimetype.startsWith('audio/')) {
          console.log('✅ Song file accepted');
          cb(null, true);
        } else {
          console.log('❌ Song file rejected - invalid mimetype:', file.mimetype);
          cb(new Error(`Invalid audio file type: ${file.mimetype}. Expected audio/* format.`), false);
        }
      } else if (file.fieldname === 'cover') {
        if (file.mimetype.startsWith('image/')) {
          console.log('✅ Cover image accepted');
          cb(null, true);
        } else {
          console.log('❌ Cover image rejected - invalid mimetype:', file.mimetype);
          cb(new Error(`Invalid image file type: ${file.mimetype}. Expected image/* format.`), false);
        }
      } else {
        console.log('❌ Unexpected fieldname:', file.fieldname);
        cb(new Error(`Unexpected field: ${file.fieldname}. Only 'song' and 'cover' are allowed.`), false);
      }
    } catch (error) {
      console.log('❌ File filter error:', error);
      cb(error, false);
    }
    
    console.log('=== END FILE FILTER ===');
  },
});


// Helper function to upload buffer to Cloudinary
const uploadBufferToCloudinary = (buffer, options) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    ).end(buffer);
  });
};

// Helper function to delete file from Cloudinary
const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    });
    return result;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
};

// Helper function to get file info from Cloudinary
const getFileInfo = async (publicId, resourceType = 'image') => {
  try {
    const result = await cloudinary.api.resource(publicId, {
      resource_type: resourceType
    });
    return result;
  } catch (error) {
    console.error('Error getting file info from Cloudinary:', error);
    throw error;
  }
};

module.exports = {
  cloudinary,
  uploadAudio,
  uploadImage,
  uploadSongWithCover,
  uploadBufferToCloudinary,
  deleteFromCloudinary,
  getFileInfo
};