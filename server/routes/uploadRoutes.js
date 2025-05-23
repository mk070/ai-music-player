const express = require('express');
const router = express.Router();
const { 
  uploadSong, 
  uploadImage, 
  deleteFile 
} = require('../controllers/uploadController');
const { protect } = require('../middlewares/authMiddleware');
const { uploadFields, uploadSingle } = require('../utils/multer');

// Apply protect middleware to all routes
router.use(protect);

// @route   POST /api/upload/song
// @desc    Upload a song file with optional cover image
// @access  Private
router.post(
  '/song',
  uploadFields([
    { name: 'song', maxCount: 1 },
    { name: 'cover', maxCount: 1 }
  ]),
  uploadSong
);

// @route   POST /api/upload/image
// @desc    Upload an image file
// @access  Private
router.post(
  '/image',
  uploadSingle('image'),
  uploadImage
);

// @route   DELETE /api/upload
// @desc    Delete a file from Cloudinary
// @access  Private
router.delete('/', deleteFile);

module.exports = router;
