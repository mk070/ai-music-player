// controllers/songsController.js
const Song = require('../models/Song');
const User = require('../models/User');
const { 
  uploadBufferToCloudinary, 
  deleteFromCloudinary, 
} = require('../services/cloudinary');
const asyncHandler = require('express-async-handler');
const path = require('path');

// @desc    Get all songs
// @route   GET /api/songs
// @access  Public
const getSongs = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  let query = { isPublic: true };

  // Search functionality
  if (req.query.search) {
    query.$text = { $search: req.query.search };
  }

  // Filter by genre
  if (req.query.genre) {
    query.genre = req.query.genre;
  }

  // Filter by mood
  if (req.query.mood) {
    query.mood = req.query.mood;
  }

  // Filter by user
  if (req.query.user) {
    query.user = req.query.user;
  }

  // Sort options
  let sortOptions = {};
  switch (req.query.sort) {
    case 'popular':
      sortOptions = { playCount: -1, likes: -1 };
      break;
    case 'newest':
      sortOptions = { createdAt: -1 };
      break;
    case 'oldest':
      sortOptions = { createdAt: 1 };
      break;
    case 'alphabetical':
      sortOptions = { title: 1 };
      break;
    default:
      sortOptions = { createdAt: -1 };
  }

  const songs = await Song.find(query)
    .populate('user', 'name avatar')
    .sort(sortOptions)
    .skip(skip)
    .limit(limit);

  const total = await Song.countDocuments(query);

  res.status(200).json({
    success: true,
    count: songs.length,
    total,
    pagination: {
      page,
      pages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1
    },
    data: songs
  });
});

// @desc    Get single song
// @route   GET /api/songs/:id
// @access  Public
const getSong = asyncHandler(async (req, res) => {
  const song = await Song.findById(req.params.id)
    .populate('user', 'name avatar')
    .populate('likes', 'name avatar');

  if (!song) {
    return res.status(404).json({
      success: false,
      error: 'Song not found'
    });
  }

  // Increment play count
  song.playCount += 1;
  await song.save();

  res.status(200).json({
    success: true,
    data: song
  });
});

// @desc    Upload song
// @route   POST /api/songs
// @access  Private
const uploadSong = asyncHandler(async (req, res) => {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substr(2, 9);
  
  try {
    console.log(`\n=== UPLOAD REQUEST STARTED [${requestId}] ===`);
    console.log('Timestamp:', new Date().toISOString());
    console.log('User ID:', req.user?.id || 'No user');
    console.log('Request headers:', {
      'content-type': req.get('content-type'),
      'content-length': req.get('content-length'),
      'user-agent': req.get('user-agent')
    });
    
    // Log all request data
    console.log('\n--- REQUEST ANALYSIS ---');
    console.log('req.body keys:', Object.keys(req.body || {}));
    console.log('req.files exists:', !!req.files);
    console.log('req.files keys:', req.files ? Object.keys(req.files) : 'No files');
    
    if (req.body && Object.keys(req.body).length > 0) {
      console.log('Body content:', JSON.stringify(req.body, null, 2));
    }
    
    // Detailed file analysis
    console.log('\n--- FILE ANALYSIS ---');
    if (!req.files || Object.keys(req.files).length === 0) {
      console.log('❌ No files found in request');
      return res.status(400).json({
        success: false,
        error: 'No files were uploaded',
        debug: {
          requestId,
          hasFiles: !!req.files,
          fileKeys: req.files ? Object.keys(req.files) : [],
          bodyKeys: Object.keys(req.body || {})
        }
      });
    }
    
    // Extract files
    const songFile = req.files?.song?.[0];
    const coverFile = req.files?.cover?.[0];
    
    console.log('Song file exists:', !!songFile);
    console.log('Cover file exists:', !!coverFile);
    
    if (!songFile) {
      console.log('❌ No song file found');
      console.log('Available file fields:', Object.keys(req.files));
      return res.status(400).json({
        success: false,
        error: 'No song file was uploaded',
        debug: {
          requestId,
          availableFields: Object.keys(req.files),
          expectedField: 'song'
        }
      });
    }
    
    if (!songFile.buffer || songFile.buffer.length === 0) {
      console.log('❌ Song file has no buffer or empty buffer');
      return res.status(400).json({
        success: false,
        error: 'Song file is empty or corrupted',
        debug: {
          requestId,
          hasBuffer: !!songFile.buffer,
          bufferLength: songFile.buffer ? songFile.buffer.length : 0
        }
      });
    }
    
    // Log file details
    console.log('\n--- SONG FILE DETAILS ---');
    console.log('Original name:', songFile.originalname);
    console.log('MIME type:', songFile.mimetype);
    console.log('File size:', songFile.size, 'bytes');
    console.log('Buffer length:', songFile.buffer.length, 'bytes');
    console.log('Encoding:', songFile.encoding);
    console.log('Field name:', songFile.fieldname);
    
    if (coverFile) {
      console.log('\n--- COVER FILE DETAILS ---');
      console.log('Original name:', coverFile.originalname);
      console.log('MIME type:', coverFile.mimetype);
      console.log('File size:', coverFile.size, 'bytes');
      console.log('Buffer length:', coverFile.buffer ? coverFile.buffer.length : 0, 'bytes');
      console.log('Encoding:', coverFile.encoding);
      console.log('Field name:', coverFile.fieldname);
    }
    
    // Validate required fields
    console.log('\n--- FIELD VALIDATION ---');
    const { title, artist, album, genre, tags, mood, memory, useAI, isPublic } = req.body;
    
    const requiredFields = { title, artist, genre };
    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => !value)
      .map(([key]) => key);
    
    if (missingFields.length > 0) {
      console.log('❌ Missing required fields:', missingFields);
      return res.status(400).json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`,
        debug: {
          requestId,
          missingFields,
          receivedFields: Object.keys(req.body)
        }
      });
    }
    
    console.log('✅ All required fields present');
    console.log('Field values:', { title, artist, album, genre, tags, mood, memory, useAI, isPublic });
    
    // Test Cloudinary upload function exists
    if (typeof uploadBufferToCloudinary !== 'function') {
      throw new Error('uploadBufferToCloudinary function is not available');
    }
    
    // Upload audio file to Cloudinary
    console.log('\n--- CLOUDINARY AUDIO UPLOAD ---');
    console.log('Starting audio upload...');
    console.log('Upload options:', {
      folder: 'music-player/audio',
      resource_type: 'video',
      quality: 'auto',
      filename_override: songFile.originalname,
    });
    
    const audioUploadStart = Date.now();
    const audioResult = await uploadBufferToCloudinary(songFile.buffer, {
      folder: 'music-player/audio',
      resource_type: 'video',
      quality: 'auto',
      filename_override: songFile.originalname,
      context: `title=${title}|artist=${artist}|album=${album || ''}`
    });
    const audioUploadTime = Date.now() - audioUploadStart;
    
    console.log('✅ Audio upload successful in', audioUploadTime, 'ms');
    console.log('Audio URL:', audioResult.secure_url);
    console.log('Audio public ID:', audioResult.public_id);
    console.log('Audio duration:', audioResult.duration || 'Unknown');

    let coverImageResult = null;
    
    // Upload cover image if provided
    if (coverFile && coverFile.buffer && coverFile.buffer.length > 0) {
      console.log('\n--- CLOUDINARY COVER UPLOAD ---');
      console.log('Starting cover image upload...');
      
      const coverUploadStart = Date.now();
      coverImageResult = await uploadBufferToCloudinary(coverFile.buffer, {
        folder: 'music-player/covers',
        resource_type: 'image',
        transformation: [
          { width: 500, height: 500, crop: 'fill' },
          { quality: 'auto' }
        ]
      });
      const coverUploadTime = Date.now() - coverUploadStart;
      
      console.log('✅ Cover image upload successful in', coverUploadTime, 'ms');
      console.log('Cover URL:', coverImageResult.secure_url);
      console.log('Cover public ID:', coverImageResult.public_id);
    } else {
      console.log('⏭️ No cover image to upload');
    }

    // Create song object
    console.log('\n--- DATABASE SAVE ---');
    const songData = {
      title,
      artist,
      album,
      genre,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      mood,
      memory,
      useAI: useAI === 'true',
      duration: audioResult.duration || 0,
      url: audioResult.secure_url,
      publicId: audioResult.public_id,
      user: req.user.id,
      isPublic: isPublic !== 'false',
      coverImage: coverImageResult ? {
        url: coverImageResult.secure_url,
        publicId: coverImageResult.public_id
      } : { url: '', publicId: '' }
    };
    
    console.log('Song data to save:', JSON.stringify(songData, null, 2));
    
    const dbSaveStart = Date.now();
    const createdSong = await Song.create(songData);
    const dbSaveTime = Date.now() - dbSaveStart;
    
    console.log('✅ Song saved to database in', dbSaveTime, 'ms');
    console.log('Created song ID:', createdSong._id);

    // Populate user data
    await createdSong.populate('user', 'name avatar');
    
    const totalTime = Date.now() - startTime;
    console.log(`\n=== UPLOAD REQUEST COMPLETED [${requestId}] ===`);
    console.log('Total processing time:', totalTime, 'ms');
    console.log('Success: true');

    res.status(201).json({
      success: true,
      data: createdSong,
      debug: {
        requestId,
        processingTime: totalTime,
        audioUploadTime,
        coverUploadTime: coverImageResult ? 'N/A' : 'No cover uploaded',
        dbSaveTime
      }
    });

  } catch (error) {
    const totalTime = Date.now() - startTime;
    console.error(`\n=== UPLOAD REQUEST FAILED [${requestId}] ===`);
    console.error('Total time before error:', totalTime, 'ms');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    if (error.code) {
      console.error('Error code:', error.code);
    }
    
    if (error.response) {
      console.error('Error response:', error.response);
    }
    
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to upload song',
      debug: {
        requestId,
        errorType: error.name,
        processingTime: totalTime,
        timestamp: new Date().toISOString()
      }
    });
  }
});


// @desc    Update song
// @route   PUT /api/songs/:id
// @access  Private
const updateSong = asyncHandler(async (req, res) => {
  let song = await Song.findById(req.params.id);

  if (!song) {
    return res.status(404).json({
      success: false,
      error: 'Song not found'
    });
  }

  // Check ownership
  if (song.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to update this song'
    });
  }

  // Update cover image if provided
  if (req.files && req.files.coverImage && req.files.coverImage[0]) {
    try {
      // Delete old cover image if exists
      if (song.coverImage.publicId) {
        await deleteFromCloudinary(song.coverImage.publicId, 'image');
      }

      // Upload new cover image
      const coverImageResult = await uploadBufferToCloudinary(req.files.coverImage[0].buffer, {
        folder: 'music-player/covers',
        resource_type: 'image',
        transformation: [
          { width: 500, height: 500, crop: 'fill' },
          { quality: 'auto' }
        ]
      });

      req.body.coverImage = {
        url: coverImageResult.secure_url,
        publicId: coverImageResult.public_id
      };
    } catch (error) {
      console.error('Cover image update error:', error);
    }
  }

  // Process tags if provided
  if (req.body.tags && typeof req.body.tags === 'string') {
    req.body.tags = req.body.tags.split(',').map(tag => tag.trim());
  }

  // Convert boolean strings
  if (req.body.useAI) req.body.useAI = req.body.useAI === 'true';
  if (req.body.isPublic) req.body.isPublic = req.body.isPublic !== 'false';

  song = await Song.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).populate('user', 'name avatar');

  res.status(200).json({
    success: true,
    data: song
  });
});

// @desc    Delete song
// @route   DELETE /api/songs/:id
// @access  Private
const deleteSong = asyncHandler(async (req, res) => {
  const song = await Song.findById(req.params.id);

  if (!song) {
    return res.status(404).json({
      success: false,
      error: 'Song not found'
    });
  }

  // Check ownership
  if (song.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to delete this song'
    });
  }

  try {
    // Delete audio file from Cloudinary
    await deleteFromCloudinary(song.publicId, 'video');

    // Delete cover image if exists
    if (song.coverImage.publicId) {
      await deleteFromCloudinary(song.coverImage.publicId, 'image');
    }

    await song.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Song deleted successfully'
    });

  } catch (error) {
    console.error('Song deletion error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete song'
    });
  }
});

// @desc    Get user's songs
// @route   GET /api/songs/user/:userId
// @access  Public
const getUserSongs = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  let query = { user: req.params.userId };

  // If not the owner or admin, only show public songs
  if (req.user?.id !== req.params.userId && req.user?.role !== 'admin') {
    query.isPublic = true;
  }

  const songs = await Song.find(query)
    .populate('user', 'name avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Song.countDocuments(query);

  res.status(200).json({
    success: true,
    count: songs.length,
    total,
    pagination: {
      page,
      pages: Math.ceil(total / limit)
    },
    data: songs
  });
});

// @desc    Like/Unlike song
// @route   PUT /api/songs/:id/like
// @access  Private
const toggleLikeSong = asyncHandler(async (req, res) => {
  const song = await Song.findById(req.params.id);

  if (!song) {
    return res.status(404).json({
      success: false,
      error: 'Song not found'
    });
  }

  const likeIndex = song.likes.indexOf(req.user.id);

  if (likeIndex > -1) {
    // Unlike song
    song.likes.splice(likeIndex, 1);
  } else {
    // Like song
    song.likes.push(req.user.id);
  }

  await song.save();

  res.status(200).json({
    success: true,
    liked: likeIndex === -1,
    likesCount: song.likes.length,
    data: song
  });
});

// @desc    Get trending songs
// @route   GET /api/songs/trending
// @access  Public
const getTrendingSongs = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;

  // Get songs sorted by recent play count and likes
  const songs = await Song.find({ isPublic: true })
    .populate('user', 'name avatar')
    .sort({ playCount: -1, 'likes.length': -1, createdAt: -1 })
    .limit(limit);

  res.status(200).json({
    success: true,
    count: songs.length,
    data: songs
  });
});

// @desc    Get songs by mood
// @route   GET /api/songs/mood/:mood
// @access  Public
const getSongsByMood = asyncHandler(async (req, res) => {
  const { mood } = req.params;
  const limit = parseInt(req.query.limit) || 20;

  const songs = await Song.find({ 
    mood: mood,
    isPublic: true 
  })
    .populate('user', 'name avatar')
    .sort({ playCount: -1 })
    .limit(limit);

  res.status(200).json({
    success: true,
    count: songs.length,
    data: songs
  });
});

// @desc    Get song statistics
// @route   GET /api/songs/stats
// @access  Private
const getSongStats = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const stats = await Song.aggregate([
    { $match: { user: userId } },
    {
      $group: {
        _id: null,
        totalSongs: { $sum: 1 },
        totalPlays: { $sum: '$playCount' },
        totalLikes: { $sum: { $size: '$likes' } },
        totalDuration: { $sum: '$duration' },
        genreBreakdown: {
          $push: '$genre'
        }
      }
    }
  ]);

  // Count genres
  let genreCounts = {};
  if (stats[0]?.genreBreakdown) {
    stats[0].genreBreakdown.forEach(genre => {
      genreCounts[genre] = (genreCounts[genre] || 0) + 1;
    });
  }

  res.status(200).json({
    success: true,
    data: {
      ...stats[0],
      genreCounts
    }
  });
});

// Additional debug middleware to catch any unhandled errors
const debugErrorHandler = (err, req, res, next) => {
  console.error('=== UNHANDLED ERROR IN UPLOAD ROUTE ===');
  console.error('Error:', err);
  console.error('Request method:', req.method);
  console.error('Request URL:', req.url);
  console.error('Request headers:', req.headers);
  console.error('=== END UNHANDLED ERROR ===');
  
  if (!res.headersSent) {
    res.status(500).json({
      success: false,
      error: 'Internal server error during upload',
      debug: {
        errorType: err.name,
        timestamp: new Date().toISOString()
      }
    });
  }
};

// Add this to your route setup

module.exports = {
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
};