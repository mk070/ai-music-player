const express = require('express');
const router = express.Router();
const {
  getTrendingSongs,
  getTopArtists,
  getRecentFavorites,
} = require('../controllers/dashboardController');
const { protect } = require('../middlewares/authMiddleware');

// Public routes
router.get('/trending', getTrendingSongs);
router.get('/top-artists', getTopArtists);

// Protected route (requires authentication)
router.get('/recent-favorites', protect, getRecentFavorites);

module.exports = router;
