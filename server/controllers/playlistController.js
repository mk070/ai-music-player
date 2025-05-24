// controllers/playlistsController.js
const Playlist = require('../models/Playlist');
const Song = require('../models/Song');
const { uploadBufferToCloudinary, deleteFromCloudinary } = require('../services/cloudinary');
const asyncHandler = require('express-async-handler');

// @desc    Get all playlists
// @route   GET /api/playlists
// @access  Public
const getPlaylists = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  let query = { isPublic: true };

  // Search functionality
  if (req.query.search) {
    query.$text = { $search: req.query.search };
  }

  // Filter by category
  if (req.query.category) {
    query.category = req.query.category;
  }

  // Filter by user
  if (req.query.user) {
    query.user = req.query.user;
  }

  // Sort options
  let sortOptions = {};
  switch (req.query.sort) {
    case 'popular':
      sortOptions = { playCount: -1, followers: -1 };
      break;
    case 'newest':
      sortOptions = { createdAt: -1 };
      break;
    case 'updated':
      sortOptions = { updatedAt: -1 };
      break;
    case 'alphabetical':
      sortOptions = { name: 1 };
      break;
    default:
      sortOptions = { createdAt: -1 };
  }

  const playlists = await Playlist.find(query)
    .populate('user', 'name avatar')
    .populate('songs.song', 'title artist duration coverImage')
    .sort(sortOptions)
    .skip(skip)
    .limit(limit);

  const total = await Playlist.countDocuments(query);

  res.status(200).json({
    success: true,
    count: playlists.length,
    total,
    pagination: {
      page,
      pages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1
    },
    data: playlists
  });
});

// @desc    Get single playlist
// @route   GET /api/playlists/:id
// @access  Public
const getPlaylist = asyncHandler(async (req, res) => {
  const playlist = await Playlist.findById(req.params.id)
    .populate('user', 'name avatar')
    .populate('songs.song', 'title artist album genre duration url coverImage user playCount likes')
    .populate('collaborators.user', 'name avatar')
    .populate('likes', 'name avatar')
    .populate('followers', 'name avatar');

  if (!playlist) {
    return res.status(404).json({
      success: false,
      error: 'Playlist not found'
    });
  }

  // Check if playlist is private and user doesn't have access
  if (!playlist.isPublic && req.user?.id !== playlist.user._id.toString()) {
    // Check if user is a collaborator
    const isCollaborator = playlist.collaborators.some(
      collab => collab.user._id.toString() === req.user?.id
    );

    if (!isCollaborator && req.user?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied to private playlist'
      });
    }
  }

  // Increment play count
  playlist.playCount += 1;
  await playlist.save();

  res.status(200).json({
    success: true,
    data: playlist
  });
});

// @desc    Create playlist
// @route   POST /api/playlists
// @access  Private
const createPlaylist = asyncHandler(async (req, res) => {
  const { 
    name, 
    description, 
    isPublic, 
    isCollaborative, 
    tags, 
    category 
  } = req.body;

  if (!name) {
    return res.status(400).json({
      success: false,
      error: 'Please provide a playlist name'
    });
  }

  try {
    let coverImageData = { url: '', publicId: '' };

    // Upload cover image if provided
    if (req.files && req.files.coverImage && req.files.coverImage[0]) {
      const coverImageResult = await uploadBufferToCloudinary(req.files.coverImage[0].buffer, {
        folder: 'music-player/playlist-covers',
        resource_type: 'image',
        transformation: [
          { width: 400, height: 400, crop: 'fill' },
          { quality: 'auto' }
        ]
      });

      coverImageData = {
        url: coverImageResult.secure_url,
        publicId: coverImageResult.public_id
      };
    }

    const playlistData = {
      name,
      description,
      coverImage: coverImageData,
      user: req.user.id,
      isPublic: isPublic !== 'false',
      isCollaborative: isCollaborative === 'true',
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      category: category || 'Personal'
    };

    const playlist = await Playlist.create(playlistData);

    // Populate user data
    await playlist.populate('user', 'name avatar');

    res.status(201).json({
      success: true,
      data: playlist
    });

  } catch (error) {
    console.error('Playlist creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create playlist'
    });
  }
});

// @desc    Update playlist
// @route   PUT /api/playlists/:id
// @access  Private
const updatePlaylist = asyncHandler(async (req, res) => {
  let playlist = await Playlist.findById(req.params.id);

  if (!playlist) {
    return res.status(404).json({
      success: false,
      error: 'Playlist not found'
    });
  }

  // Check ownership or collaboration permissions
  const isOwner = playlist.user.toString() === req.user.id;
  const isCollaborator = playlist.collaborators.some(
    collab => collab.user.toString() === req.user.id && 
    ['edit', 'admin'].includes(collab.permissions)
  );

  if (!isOwner && !isCollaborator && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to update this playlist'
    });
  }

  // Update cover image if provided
  if (req.files && req.files.coverImage && req.files.coverImage[0]) {
    try {
      // Delete old cover image if exists
      if (playlist.coverImage.publicId) {
        await deleteFromCloudinary(playlist.coverImage.publicId, 'image');
      }

      // Upload new cover image
      const coverImageResult = await uploadBufferToCloudinary(req.files.coverImage[0].buffer, {
        folder: 'music-player/playlist-covers',
        resource_type: 'image',
        transformation: [
          { width: 400, height: 400, crop: 'fill' },
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
  if (req.body.isPublic) req.body.isPublic = req.body.isPublic !== 'false';
  if (req.body.isCollaborative) req.body.isCollaborative = req.body.isCollaborative === 'true';

  playlist = await Playlist.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).populate('user', 'name avatar');

  res.status(200).json({
    success: true,
    data: playlist
  });
});

// @desc    Delete playlist
// @route   DELETE /api/playlists/:id
// @access  Private
const deletePlaylist = asyncHandler(async (req, res) => {
  const playlist = await Playlist.findById(req.params.id);

  if (!playlist) {
    return res.status(404).json({
      success: false,
      error: 'Playlist not found'
    });
  }

  // Check ownership
  if (playlist.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to delete this playlist'
    });
  }

  try {
    // Delete cover image if exists
    if (playlist.coverImage.publicId) {
      await deleteFromCloudinary(playlist.coverImage.publicId, 'image');
    }

    await playlist.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Playlist deleted successfully'
    });

  } catch (error) {
    console.error('Playlist deletion error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete playlist'
    });
  }
});

// @desc    Add song to playlist
// @route   POST /api/playlists/:id/songs
// @access  Private
const addSongToPlaylist = asyncHandler(async (req, res) => {
  const { songId } = req.body;

  if (!songId) {
    return res.status(400).json({
      success: false,
      error: 'Please provide a song ID'
    });
  }

  const playlist = await Playlist.findById(req.params.id);
  const song = await Song.findById(songId);

  if (!playlist) {
    return res.status(404).json({
      success: false,
      error: 'Playlist not found'
    });
  }

  if (!song) {
    return res.status(404).json({
      success: false,
      error: 'Song not found'
    });
  }

  // Check permissions
  const isOwner = playlist.user.toString() === req.user.id;
  const isCollaborator = playlist.collaborators.some(
    collab => collab.user.toString() === req.user.id && 
    ['edit', 'admin'].includes(collab.permissions)
  );

  if (!isOwner && !isCollaborator && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to modify this playlist'
    });
  }

  // Check if song already exists in playlist
  const songExists = playlist.songs.some(
    item => item.song.toString() === songId
  );

  if (songExists) {
    return res.status(400).json({
      success: false,
      error: 'Song already exists in playlist'
    });
  }

  // Add song to playlist
  playlist.songs.push({
    song: songId,
    addedAt: new Date()
  });

  await playlist.save();

  // Populate and return updated playlist
  await playlist.populate('songs.song', 'title artist duration coverImage');

  res.status(200).json({
    success: true,
    message: 'Song added to playlist successfully',
    data: playlist
  });
});

// @desc    Remove song from playlist
// @route   DELETE /api/playlists/:id/songs/:songId
// @access  Private
const removeSongFromPlaylist = asyncHandler(async (req, res) => {
  const { songId } = req.params;

  const playlist = await Playlist.findById(req.params.id);

  if (!playlist) {
    return res.status(404).json({
      success: false,
      error: 'Playlist not found'
    });
  }

  // Check permissions
  const isOwner = playlist.user.toString() === req.user.id;
  const isCollaborator = playlist.collaborators.some(
    collab => collab.user.toString() === req.user.id && 
    ['edit', 'admin'].includes(collab.permissions)
  );

  if (!isOwner && !isCollaborator && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to modify this playlist'
    });
  }

  // Find and remove song from playlist
  const songIndex = playlist.songs.findIndex(
    item => item.song.toString() === songId
  );

  if (songIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Song not found in playlist'
    });
  }

  playlist.songs.splice(songIndex, 1);
  await playlist.save();

  res.status(200).json({
    success: true,
    message: 'Song removed from playlist successfully',
    data: playlist
  });
});

// @desc    Reorder songs in playlist
// @route   PUT /api/playlists/:id/reorder
// @access  Private
const reorderPlaylistSongs = asyncHandler(async (req, res) => {
  const { songOrder } = req.body; // Array of song IDs in new order

  if (!Array.isArray(songOrder)) {
    return res.status(400).json({
      success: false,
      error: 'Please provide song order as an array'
    });
  }

  const playlist = await Playlist.findById(req.params.id);

  if (!playlist) {
    return res.status(404).json({
      success: false,
      error: 'Playlist not found'
    });
  }

  // Check permissions
  const isOwner = playlist.user.toString() === req.user.id;
  const isCollaborator = playlist.collaborators.some(
    collab => collab.user.toString() === req.user.id && 
    ['edit', 'admin'].includes(collab.permissions)
  );

  if (!isOwner && !isCollaborator && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to modify this playlist'
    });
  }

  // Reorder songs based on provided order
  const reorderedSongs = [];
  for (const songId of songOrder) {
    const songItem = playlist.songs.find(
      item => item.song.toString() === songId
    );
    if (songItem) {
      reorderedSongs.push(songItem);
    }
  }

  playlist.songs = reorderedSongs;
  await playlist.save();

  res.status(200).json({
    success: true,
    message: 'Playlist songs reordered successfully',
    data: playlist
  });
});

// @desc    Get user's playlists
// @route   GET /api/playlists/user/:userId
// @access  Public
const getUserPlaylists = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  let query = { user: req.params.userId };

  // If not the owner or admin, only show public playlists
  if (req.user?.id !== req.params.userId && req.user?.role !== 'admin') {
    query.isPublic = true;
  }

  const playlists = await Playlist.find(query)
    .populate('user', 'name avatar')
    .populate('songs.song', 'title artist duration')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Playlist.countDocuments(query);

  res.status(200).json({
    success: true,
    count: playlists.length,
    total,
    pagination: {
      page,
      pages: Math.ceil(total / limit)
    },
    data: playlists
  });
});

// @desc    Like/Unlike playlist
// @route   PUT /api/playlists/:id/like
// @access  Private
const toggleLikePlaylist = asyncHandler(async (req, res) => {
  const playlist = await Playlist.findById(req.params.id);

  if (!playlist) {
    return res.status(404).json({
      success: false,
      error: 'Playlist not found'
    });
  }

  const likeIndex = playlist.likes.indexOf(req.user.id);

  if (likeIndex > -1) {
    // Unlike playlist
    playlist.likes.splice(likeIndex, 1);
  } else {
    // Like playlist
    playlist.likes.push(req.user.id);
  }

  await playlist.save();

  res.status(200).json({
    success: true,
    liked: likeIndex === -1,
    likesCount: playlist.likes.length,
    data: playlist
  });
});

// @desc    Follow/Unfollow playlist
// @route   PUT /api/playlists/:id/follow
// @access  Private
const toggleFollowPlaylist = asyncHandler(async (req, res) => {
  const playlist = await Playlist.findById(req.params.id);

  if (!playlist) {
    return res.status(404).json({
      success: false,
      error: 'Playlist not found'
    });
  }

  // Can't follow own playlist
  if (playlist.user.toString() === req.user.id) {
    return res.status(400).json({
      success: false,
      error: 'Cannot follow your own playlist'
    });
  }

  const followIndex = playlist.followers.indexOf(req.user.id);

  if (followIndex > -1) {
    // Unfollow playlist
    playlist.followers.splice(followIndex, 1);
  } else {
    // Follow playlist
    playlist.followers.push(req.user.id);
  }

  await playlist.save();

  res.status(200).json({
    success: true,
    following: followIndex === -1,
    followersCount: playlist.followers.length,
    data: playlist
  });
});

// @desc    Add collaborator to playlist
// @route   POST /api/playlists/:id/collaborators
// @access  Private
const addCollaborator = asyncHandler(async (req, res) => {
  const { userId, permissions = 'view' } = req.body;

  if (!userId) {
    return res.status(400).json({
      success: false,
      error: 'Please provide a user ID'
    });
  }

  const playlist = await Playlist.findById(req.params.id);

  if (!playlist) {
    return res.status(404).json({
      success: false,
      error: 'Playlist not found'
    });
  }

  // Check ownership
  if (playlist.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to add collaborators'
    });
  }

  // Check if user is already a collaborator
  const existingCollaborator = playlist.collaborators.find(
    collab => collab.user.toString() === userId
  );

  if (existingCollaborator) {
    return res.status(400).json({
      success: false,
      error: 'User is already a collaborator'
    });
  }

  // Add collaborator
  playlist.collaborators.push({
    user: userId,
    permissions,
    addedAt: new Date()
  });

  await playlist.save();

  // Populate and return updated playlist
  await playlist.populate('collaborators.user', 'name avatar');

  res.status(200).json({
    success: true,
    message: 'Collaborator added successfully',
    data: playlist
  });
});

// @desc    Remove collaborator from playlist
// @route   DELETE /api/playlists/:id/collaborators/:userId
// @access  Private
const removeCollaborator = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const playlist = await Playlist.findById(req.params.id);

  if (!playlist) {
    return res.status(404).json({
      success: false,
      error: 'Playlist not found'
    });
  }

  // Check ownership
  if (playlist.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to remove collaborators'
    });
  }

  // Find and remove collaborator
  const collaboratorIndex = playlist.collaborators.findIndex(
    collab => collab.user.toString() === userId
  );

  if (collaboratorIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Collaborator not found'
    });
  }

  playlist.collaborators.splice(collaboratorIndex, 1);
  await playlist.save();

  res.status(200).json({
    success: true,
    message: 'Collaborator removed successfully',
    data: playlist
  });
});

// @desc    Get trending playlists
// @route   GET /api/playlists/trending
// @access  Public
const getTrendingPlaylists = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;

  const playlists = await Playlist.find({ isPublic: true })
    .populate('user', 'name avatar')
    .populate('songs.song', 'title artist')
    .sort({ playCount: -1, 'followers.length': -1, createdAt: -1 })
    .limit(limit);

  res.status(200).json({
    success: true,
    count: playlists.length,
    data: playlists
  });
});

// @desc    Get playlist statistics
// @route   GET /api/playlists/stats
// @access  Private
const getPlaylistStats = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const stats = await Playlist.getUserPlaylistStats(userId);

  res.status(200).json({
    success: true,
    data: stats
  });
});

module.exports = {
  getPlaylists,
  getPlaylist,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
  reorderPlaylistSongs,
  getUserPlaylists,
  toggleLikePlaylist,
  toggleFollowPlaylist,
  addCollaborator,
  removeCollaborator,
  getTrendingPlaylists,
  getPlaylistStats
};