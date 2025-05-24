const express = require('express');
const router = express.Router();
const {
  getTrendingSongs,
  getTopArtists,
  getRecentFavorites,
} = require('../controllers/dashboardController');
const { protect } = require('../middlewares/authMiddleware');

// Middleware to conditionally apply authentication
const conditionalProtect = (req, res, next) => {
  if (process.env.NODE_ENV === 'production' || process.env.ENABLE_AUTH === 'true') {
    return protect(req, res, next);
  }
  next();
};

// Public routes
router.get('/trending', getTrendingSongs);
router.get('/top-artists', getTopArtists);

// Protected route (requires authentication in production)
router.get('/recent-favorites', conditionalProtect, getRecentFavorites);

module.exports = router;
