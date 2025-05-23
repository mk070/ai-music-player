const ErrorResponse = require('../utils/errorResponse');
const Playlist = require('../models/Playlist');
const User = require('../models/User');

// @desc    Get all playlists
// @route   GET /api/playlists
// @access  Private
exports.getPlaylists = async (req, res, next) => {
  try {
    const playlists = await Playlist.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate('songs', 'title artist duration coverImage');

    res.status(200).json({
      success: true,
      count: playlists.length,
      data: playlists
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single playlist
// @route   GET /api/playlists/:id
// @access  Public
exports.getPlaylist = async (req, res, next) => {
  try {
    const playlist = await Playlist.findById(req.params.id)
      .populate('user', 'name avatar')
      .populate('songs', 'title artist album duration coverImage url');

    if (!playlist) {
      return next(ErrorResponse.notFound(`Playlist not found with id of ${req.params.id}`));
    }

    // Check if playlist is public or user is the owner
    if (!playlist.isPublic && playlist.user._id.toString() !== req.user.id) {
      return next(ErrorResponse.unauthorized('Not authorized to access this playlist'));
    }

    res.status(200).json({
      success: true,
      data: playlist
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new playlist
// @route   POST /api/playlists
// @access  Private
exports.createPlaylist = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;

    const playlist = await Playlist.create(req.body);

    res.status(201).json({
      success: true,
      data: playlist
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update playlist
// @route   PUT /api/playlists/:id
// @access  Private
exports.updatePlaylist = async (req, res, next) => {
  try {
    let playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return next(ErrorResponse.notFound(`Playlist not found with id of ${req.params.id}`));
    }

    // Make sure user is playlist owner
    if (playlist.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(ErrorResponse.unauthorized('Not authorized to update this playlist'));
    }

    // Update playlist
    playlist = await Playlist.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: playlist
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete playlist
// @route   DELETE /api/playlists/:id
// @access  Private
exports.deletePlaylist = async (req, res, next) => {
  try {
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return next(ErrorResponse.notFound(`Playlist not found with id of ${req.params.id}`));
    }

    // Make sure user is playlist owner or admin
    if (playlist.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(ErrorResponse.unauthorized('Not authorized to delete this playlist'));
    }

    await playlist.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add song to playlist
// @route   PUT /api/playlists/:id/songs
// @access  Private
exports.addSongToPlaylist = async (req, res, next) => {
  try {
    const { songId } = req.body;

    let playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return next(ErrorResponse.notFound(`Playlist not found with id of ${req.params.id}`));
    }

    // Make sure user is playlist owner
    if (playlist.user.toString() !== req.user.id) {
      return next(ErrorResponse.unauthorized('Not authorized to update this playlist'));
    }

    // Check if song already in playlist
    if (playlist.songs.includes(songId)) {
      return next(ErrorResponse.badRequest('Song already in playlist'));
    }

    // Add song to playlist
    playlist.songs.push(songId);
    await playlist.save();

    res.status(200).json({
      success: true,
      data: playlist
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Remove song from playlist
// @route   DELETE /api/playlists/:id/songs/:songId
// @access  Private
exports.removeSongFromPlaylist = async (req, res, next) => {
  try {
    let playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return next(ErrorResponse.notFound(`Playlist not found with id of ${req.params.id}`));
    }

    // Make sure user is playlist owner
    if (playlist.user.toString() !== req.user.id) {
      return next(ErrorResponse.unauthorized('Not authorized to update this playlist'));
    }

    // Check if song exists in playlist
    const songIndex = playlist.songs.findIndex(
      song => song.toString() === req.params.songId
    );

    if (songIndex === -1) {
      return next(ErrorResponse.badRequest('Song not found in playlist'));
    }

    // Remove song from playlist
    playlist.songs.splice(songIndex, 1);
    await playlist.save();

    res.status(200).json({
      success: true,
      data: playlist
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Like a playlist
// @route   PUT /api/playlists/:id/like
// @access  Private
exports.likePlaylist = async (req, res, next) => {
  try {
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return next(ErrorResponse.notFound(`Playlist not found with id of ${req.params.id}`));
    }

    // Check if the playlist has already been liked
    if (playlist.likes.includes(req.user.id)) {
      return next(ErrorResponse.badRequest('Playlist already liked'));
    }

    playlist.likes.push(req.user.id);
    await playlist.save();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Unlike a playlist
// @route   PUT /api/playlists/:id/unlike
// @access  Private
exports.unlikePlaylist = async (req, res, next) => {
  try {
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return next(ErrorResponse.notFound(`Playlist not found with id of ${req.params.id}`));
    }

    // Check if the playlist has been liked
    if (!playlist.likes.includes(req.user.id)) {
      return next(ErrorResponse.badRequest('Playlist has not been liked'));
    }

    // Remove the like
    playlist.likes = playlist.likes.filter(
      like => like.toString() !== req.user.id
    );
    
    await playlist.save();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get playlists by user
// @route   GET /api/playlists/user/:userId
// @access  Public
exports.getPlaylistsByUser = async (req, res, next) => {
  try {
    const query = { user: req.params.userId };
    
    // If not the owner, only show public playlists
    if (req.params.userId !== req.user.id) {
      query.isPublic = true;
    }

    const playlists = await Playlist.find(query)
      .sort({ createdAt: -1 })
      .populate('songs', 'title artist duration coverImage');

    res.status(200).json({
      success: true,
      count: playlists.length,
      data: playlists
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get public playlists
// @route   GET /api/playlists/public
// @access  Public
exports.getPublicPlaylists = async (req, res, next) => {
  try {
    const playlists = await Playlist.find({ isPublic: true })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      count: playlists.length,
      data: playlists
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Search playlists
// @route   GET /api/playlists/search
// @access  Public
exports.searchPlaylists = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q) {
      return next(ErrorResponse.badRequest('Please provide a search query'));
    }

    const playlists = await Playlist.find({
      $text: { $search: q },
      $or: [
        { isPublic: true },
        { user: req.user.id }
      ]
    })
      .populate('user', 'name avatar')
      .sort({ score: { $meta: 'textScore' } });

    res.status(200).json({
      success: true,
      count: playlists.length,
      data: playlists
    });
  } catch (err) {
    next(err);
  }
};
