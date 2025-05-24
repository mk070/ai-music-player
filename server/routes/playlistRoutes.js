// routes/playlistsRoutes.js
const express = require('express');
const {
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
} = require('../controllers/playlistController');

const { uploadCover } = require('../services/cloudinary');
const { protect } = require('../middlewares/authMiddleware');
const advancedResults = require('../middlewares/advancedResults');
const Playlist = require('../models/Playlist');

const router = express.Router();

// Public routes
router.route('/').get(advancedResults(Playlist, [
  { path: 'user', select: 'name avatar' },
  { path: 'songs.song', select: 'title artist duration coverImage' }
]), getPlaylists);

router.route('/trending').get(getTrendingPlaylists);
router.route('/:id').get(getPlaylist);
router.route('/user/:userId').get(getUserPlaylists);

// Protected routes
router.use(protect);

// Playlist management routes
router.route('/')
  .post(uploadCover.fields([
    { name: 'coverImage', maxCount: 1 }
  ]), createPlaylist);

router.route('/:id')
  .put(uploadCover.fields([
    { name: 'coverImage', maxCount: 1 }
  ]), updatePlaylist)
  .delete(deletePlaylist);

// Song management within playlist routes
router.route('/:id/songs')
  .post(addSongToPlaylist);

router.route('/:id/songs/:songId')
  .delete(removeSongFromPlaylist);

router.route('/:id/reorder')
  .put(reorderPlaylistSongs);

// Playlist interaction routes
router.route('/:id/like').put(toggleLikePlaylist);
router.route('/:id/follow').put(toggleFollowPlaylist);

// Collaboration routes
router.route('/:id/collaborators')
  .post(addCollaborator);

router.route('/:id/collaborators/:userId')
  .delete(removeCollaborator);

// User stats routes
router.route('/stats/user').get(getPlaylistStats);

module.exports = router;