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
  if (!req.files || !req.files.song) {
    return res.status(400).json({
      success: false,
      error: 'Please provide an audio file with key "song"'
    });
  }

  const { title, artist, album, genre, tags, mood, memory, useAI, isPublic } = req.body;

  // Validate required fields
  if (!title || !artist || !genre) {
    return res.status(400).json({
      success: false,
      error: 'Please provide title, artist, and genre'
    });
  }

  try {
    // Upload audio file to Cloudinary
    const audioResult = await uploadBufferToCloudinary(req.files.song[0].buffer, {
      folder: 'music-player/audio',
      resource_type: 'video',
      quality: 'auto'
    });

    let coverImageResult = null;
    
    // Check for both 'cover' and 'coverImage' fields
    const coverFile = req.files.cover ? req.files.cover[0] : (req.files.coverImage ? req.files.coverImage[0] : null);

    // Upload cover image if provided
    if (coverFile) {
      coverImageResult = await uploadBufferToCloudinary(coverFile.buffer, {
        folder: 'music-player/covers',
        resource_type: 'image',
        transformation: [
          { width: 500, height: 500, crop: 'fill' },
          { quality: 'auto' }
        ]
      });
    }

    // Create song object
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

    const song = await Song.create(songData);

    // Populate user data
    await song.populate('user', 'name avatar');

    res.status(201).json({
      success: true,
      data: song
    });

  } catch (error) {
    console.error('Song upload error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload song'
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