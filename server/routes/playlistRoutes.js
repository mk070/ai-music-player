const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const playlistController = require('../controllers/playlistController');

// Apply protect middleware to all routes
router.use(protect);

// Public routes
router.get('/public', playlistController.getPublicPlaylists);
router.get('/search', playlistController.searchPlaylists);
router.get('/user/:userId', playlistController.getPlaylistsByUser);

// Protected routes
router
  .route('/')
  .get(playlistController.getPlaylists)
  .post(playlistController.createPlaylist);

// Single playlist routes
router
  .route('/:id')
  .get(playlistController.getPlaylist)
  .put(playlistController.updatePlaylist)
  .delete(playlistController.deletePlaylist);

// Song management routes
router
  .route('/:id/songs')
  .put(playlistController.addSongToPlaylist);

router
  .route('/:id/songs/:songId')
  .delete(playlistController.removeSongFromPlaylist);

// Like/Unlike routes
router
  .route('/:id/like')
  .put(playlistController.likePlaylist);

router
  .route('/:id/unlike')
  .put(playlistController.unlikePlaylist);

module.exports = router;
