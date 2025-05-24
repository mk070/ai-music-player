// routes/songsRoutes.js
const express = require('express');
const {
  getSongs,
  getSong,
  uploadSong,
  updateSong,
  deleteSong,
  getUserSongs,
  toggleLikeSong,
  getTrendingSongs,
  getSongsByMood,
  getSongStats
} = require('../controllers/songController');

const { uploadSongWithCover } = require('../services/cloudinary');
const { protect } = require('../middlewares/authMiddleware');
const advancedResults = require('../middlewares/advancedResults');
const Song = require('../models/Song');
const multer = require('multer');
const router = express.Router();


// Pre-upload logging middleware
const preUploadLogger = (req, res, next) => {
  console.log('=== PRE-UPLOAD MIDDLEWARE ===');
  console.log('Request method:', req.method);
  console.log('Request URL:', req.url);
  console.log('Content-Type:', req.get('Content-Type'));
  console.log('Content-Length:', req.get('Content-Length'));
  console.log('Raw headers:', req.rawHeaders);
  console.log('=== END PRE-UPLOAD ===');
  next();
};

// Enhanced multer error handler
const handleMulterErrors = (err, req, res, next) => {
  console.log('=== MULTER ERROR HANDLER ===');
  console.log('Error type:', err.constructor.name);
  console.log('Error message:', err.message);
  console.log('Error code:', err.code);
  console.log('Error stack:', err.stack);
  
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      error: 'File too large. Maximum size is 25MB.'
    });
  }
  
  if (err.code === 'UNEXPECTED_FIELD') {
    return res.status(400).json({
      success: false,
      error: `Unexpected field: ${err.field}. Expected 'song' and/or 'cover'.`
    });
  }
  
  if (err.message.includes('Unexpected end of form')) {
    return res.status(400).json({
      success: false,
      error: 'Form data was incomplete or corrupted during upload.'
    });
  }
  
  return res.status(400).json({
    success: false,
    error: err.message || 'File upload error'
  });
};

// Post-upload logging middleware
const postUploadLogger = (req, res, next) => {
  console.log('=== POST-UPLOAD MIDDLEWARE ===');
  console.log('Files received:', req.files ? Object.keys(req.files) : 'No files');
  
  if (req.files) {
    Object.keys(req.files).forEach(fieldname => {
      const files = req.files[fieldname];
      files.forEach((file, index) => {
        console.log(`File ${fieldname}[${index}]:`, {
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          fieldname: file.fieldname,
          encoding: file.encoding,
          bufferLength: file.buffer ? file.buffer.length : 'No buffer'
        });
      });
    });
  }
  
  console.log('Body fields:', Object.keys(req.body));
  console.log('Body content:', req.body);
  console.log('=== END POST-UPLOAD ===');
  next();
};

// Public routes
router.route('/').get(advancedResults(Song, 'user', 'name avatar'), getSongs);
router.route('/trending').get(getTrendingSongs);
router.route('/mood/:mood').get(getSongsByMood);
router.route('/:id').get(getSong);
router.route('/user/:userId').get(getUserSongs);

// Protected routes
router.use(protect);

// Song management routes
router.route('/')
  .post(
    preUploadLogger,
    uploadSongWithCover.fields([
      { name: 'song', maxCount: 1 },
      { name: 'cover', maxCount: 1 }
    ]),
    handleMulterErrors,
    postUploadLogger,
    uploadSong
  );


// router.route('/:id')
//   .put(
//     (req, res, next) => {
//       console.log('🔥 Incoming PUT /song with headers:', req.headers);
//       next();
//     },
//     uploadSongWithCover.fields([
//       { name: 'coverImage', maxCount: 1 }
//     ]),
//     multerErrorHandler, // Catch any multer/busboy issues
//     updateSong
//   )
//   .delete(deleteSong);

// Song interaction routes
router.route('/:id/like').put(toggleLikeSong);

// User stats routes
router.route('/stats/user').get(getSongStats);

module.exports = router;