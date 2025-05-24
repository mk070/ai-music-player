const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middlewares/authMiddleware');
const {
  getSongs,
  getSong,
  uploadSong,
  updateSong,
  deleteSong,
  toggleLikeSong,
  getLikedSongs,
  getSongsByUser,
  getSongsByGenre,
  getSongsByMood,
  incrementPlayCount,
  searchSongs
} = require('../controllers/songController');

// Configure multer for file uploads
const storage = multer.memoryStorage();

// Create separate upload handlers for different file types
const uploadAudio = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Please upload only audio files'), false);
    }
  }
}).single('song');

const uploadCover = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit for cover images
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Please upload only image files for cover'), false);
    }
  }
}).single('cover');

// Handle file uploads
const handleUpload = (req, res, next) => {
  // First handle the audio file
  uploadAudio(req, res, (audioErr) => {
    if (audioErr) {
      console.error('Audio upload error:', audioErr);
      return res.status(400).json({ 
        success: false, 
        error: audioErr.message || 'Error uploading audio file' 
      });
    }
    
    // Then handle the cover image (if any)
    if (req.file) {
      req.audioFile = req.file; // Store audio file
      req.file = null; // Clear the file for the next upload
    }
    
    uploadCover(req, res, (coverErr) => {
      if (coverErr) {
        console.error('Cover upload error:', coverErr);
        // Continue even if cover upload fails, as it's optional
      }
      
      if (req.file) {
        req.coverFile = req.file; // Store cover file
      }
      
      next();
    });
  });
};



/**
 * @route   GET /api/songs
 * @desc    Get all songs with optional filtering and pagination
 * @access  Public
 */
router.get('/', getSongs);

/**
 * @route   GET /api/songs/search
 * @desc    Search songs with filters (uses the same handler as getSongs)
 * @access  Public
 */
router.get('/search', getSongs);

/**
 * @route   GET /api/songs/:id
 * @desc    Get single song by ID
 * @access  Public
 */
router.get('/:id', getSong);

/**
 * @route   POST /api/songs
 * @desc    Upload a new song
 * @access  Private
 */
router.post('/', protect, (req, res, next) => {
  console.log('Upload endpoint hit');
  console.log('Request body:', req.body);
  
  // Handle the file uploads
  handleUpload(req, res, (err) => {
    if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({ 
        success: false, 
        error: err.message || 'Error processing upload' 
      });
    }
    
    // Log the uploaded files for debugging
    console.log('Uploaded files:', {
      audioFile: req.audioFile ? req.audioFile.originalname : 'None',
      coverFile: req.coverFile ? req.coverFile.originalname : 'None'
    });
    
    // Move files to the expected locations
    if (req.audioFile) {
      req.files = req.files || {};
      req.files.song = [req.audioFile];
    }
    
    if (req.coverFile) {
      req.files.cover = [req.coverFile];
    }
    
    // Proceed to the uploadSong controller
    uploadSong(req, res, next);
  });
});

/**
 * @route   PUT /api/songs/:id
 * @desc    Update song details
 * @access  Private
 */
router.put('/:id', protect, upload.none(), updateSong);

/**
 * @route   DELETE /api/songs/:id
 * @desc    Delete a song
 * @access  Private
 */
router.delete('/:id', protect, deleteSong);

/**
 * @route   PUT /api/songs/:id/like
 * @desc    Toggle like/unlike a song
 * @access  Private
 */
router.put('/:id/like', protect, toggleLikeSong);

/**
 * @route   GET /api/songs/user/:userId
 * @desc    Get songs by user
 * @access  Public
 */
// router.get('/user/:userId', getSongsByUser);

// /**
//  * @route   GET /api/songs/genre/:genre
//  * @desc    Get songs by genre
//  * @access  Public
//  */
// router.get('/genre/:genre', getSongsByGenre);

// /**
//  * @route   GET /api/songs/mood/:mood
//  * @desc    Get songs by mood
//  * @access  Public
//  */
// router.get('/mood/:mood', getSongsByMood);

// /**
//  * @route   GET /api/songs/liked
//  * @desc    Get user's liked songs
//  * @access  Private
//  */
// router.get('/liked', protect, getLikedSongs);

// Error handling middleware
router.use((error, req, res, next) => {
  console.error('Songs API Error:', error);
  
  // Multer errors
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      error: 'File too large'
    });
  }
  
  if (error.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      success: false,
      error: 'Unexpected file field'
    });
  }

  // Cloudinary errors
  if (error.message.includes('Invalid image file')) {
    return res.status(400).json({
      success: false,
      error: 'Invalid image format'
    });
  }

  // Generic error
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

/**
 * @route GET /api/music/health
 * @desc Health check endpoint
 * @access Public
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Music API is healthy',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
router.use((error, req, res, next) => {
  console.error('Music API Error:', error);
  
  // Multer errors
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      error: 'File too large'
    });
  }
  
  if (error.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      success: false,
      error: 'Unexpected file field'
    });
  }

  // Cloudinary errors
  if (error.message.includes('Invalid image file')) {
    return res.status(400).json({
      success: false,
      error: 'Invalid image format'
    });
  }

  // Generic error
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

module.exports = router;