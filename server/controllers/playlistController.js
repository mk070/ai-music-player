const Playlist = require('../models/Playlist');
const User = require('../models/User');

// @desc    Get user playlists
// @route   GET /api/playlists
// @access  Private
exports.getPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(playlists);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Create a playlist
// @route   POST /api/playlists
// @access  Private
exports.createPlaylist = async (req, res) => {
  try {
    const { name, description, isPublic } = req.body;

    const newPlaylist = new Playlist({
      name,
      description,
      isPublic: isPublic || false,
      user: req.user.id,
    });

    const playlist = await newPlaylist.save();
    res.json(playlist);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update playlist
// @route   PUT /api/playlists/:id
// @access  Private
exports.updatePlaylist = async (req, res) => {
  try {
    const { name, description, isPublic, songs } = req.body;

    let playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    // Check user
    if (playlist.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    playlist = await Playlist.findByIdAndUpdate(
      req.params.id,
      { $set: { name, description, isPublic, songs } },
      { new: true }
    );

    res.json(playlist);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete playlist
// @route   DELETE /api/playlists/:id
// @access  Private
exports.deletePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    // Check user
    if (playlist.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await playlist.remove();

    res.json({ message: 'Playlist removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Add song to playlist
// @route   PUT /api/playlists/song/:id
// @access  Private
exports.addSongToPlaylist = async (req, res) => {
  try {
    const { songId } = req.body;

    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    // Check user
    if (playlist.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    // Add song if not already in playlist
    if (!playlist.songs.includes(songId)) {
      playlist.songs.push(songId);
      await playlist.save();
    }

    res.json(playlist);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Remove song from playlist
// @route   PUT /api/playlists/song/:id/:songId
// @access  Private
exports.removeSongFromPlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    // Check user
    if (playlist.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    // Remove song
    playlist.songs = playlist.songs.filter(
      (song) => song.toString() !== req.params.songId
    );

    await playlist.save();

    res.json(playlist);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
