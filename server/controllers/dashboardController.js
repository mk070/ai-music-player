const asyncHandler = require('express-async-handler');

// @desc    Get trending songs
// @route   GET /api/dashboard/trending
// @access  Public
const getTrendingSongs = asyncHandler(async (req, res) => {
  try {
    const Song = require('../models/Song');
    
    // Get trending songs (most played, most recent, etc.)
    const trendingSongs = await Song.find({ isPublic: true })
      .sort({ playCount: -1, createdAt: -1 }) // Sort by play count (descending) and then by creation date
      .limit(10) // Limit to 10 trending songs
      .select('title artist url coverImage duration playCount') // Only select necessary fields
      .lean(); // Convert to plain JavaScript object
    
    // Format the response to match the frontend expectations
    const formattedSongs = trendingSongs.map((song, index) => ({
      id: song._id,
      title: song.title,
      artist: song.artist,
      duration: formatDuration(song.duration || 0), // Format duration from seconds to MM:SS
      plays: formatPlayCount(song.playCount || 0),
      cover: song.coverImage?.url || '/api/placeholder/60/60',
      url: song.url // Include the audio URL for playback
    }));

    res.status(200).json(formattedSongs);
  } catch (error) {
    console.error('Error fetching trending songs:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error',
      message: error.message 
    });
  }
});

// Helper function to format duration in seconds to MM:SS
function formatDuration(seconds) {
  if (!seconds) return '00:00';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Helper function to format play count with spaces as thousand separators
function formatPlayCount(count) {
  if (!count) return '0';
  return count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

// @desc    Get top artists
// @route   GET /api/dashboard/top-artists
// @access  Public
const getTopArtists = asyncHandler(async (req, res) => {
  try {
    const Song = require('../models/Song');
    
    // Aggregate to get top artists based on play count
    const topArtists = await Song.aggregate([
      { $match: { isPublic: true } },
      {
        $group: {
          _id: '$artist',
          plays: { $sum: '$playCount' },
          songCount: { $sum: 1 },
          // Get the first cover image for the artist
          cover: { $first: '$coverImage.url' }
        }
      },
      { $sort: { plays: -1 } },
      { $limit: 10 },
      {
        $project: {
          _id: 0,
          id: '$_id',
          name: '$_id',
          plays: { $toString: '$plays' },
          followers: { $toString: { $multiply: ['$songCount', 1000] } }, // Simulate followers
          cover: { $ifNull: ['$cover', '/api/placeholder/56/56'] }
        }
      }
    ]);

    // Format the numbers with K/M suffixes
    const formattedArtists = topArtists.map(artist => ({
      ...artist,
      plays: formatNumber(artist.plays),
      followers: formatNumber(artist.followers)
    }));

    res.status(200).json(formattedArtists);
  } catch (error) {
    console.error('Error fetching top artists:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error',
      message: error.message 
    });
  }
});

// @desc    Get recent favorites
// @route   GET /api/dashboard/recent-favorites
// @access  Private
const getRecentFavorites = asyncHandler(async (req, res) => {
  try {
    const Song = require('../models/Song');
    
    // Get recent public songs that have been favorited (liked) by users
    const recentFavorites = await Song.aggregate([
      { $match: { isPublic: true, likes: { $exists: true, $not: { $size: 0 } } } },
      { $sort: { createdAt: -1 } },
      { $limit: 3 },
      {
        $project: {
          _id: 0,
          id: '$_id',
          title: 1,
          description: { $concat: ['By ', '$artist', ' • ', '$genre'] },
          cover: { $ifNull: ['$coverImage.url', '/api/placeholder/180/180'] }
        }
      }
    ]);

    // If no favorites with likes, return recently added songs as fallback
    if (recentFavorites.length === 0) {
      const recentSongs = await Song.find({ isPublic: true })
        .sort({ createdAt: -1 })
        .limit(3)
        .select('title artist genre coverImage.url')
        .lean();
      
      recentSongs.forEach((song, index) => {
        recentFavorites.push({
          id: song._id,
          title: song.title,
          description: `By ${song.artist} • ${song.genre || 'Various'}`,
          cover: song.coverImage?.url || '/api/placeholder/180/180'
        });
      });
    }

    res.status(200).json(recentFavorites);
  } catch (error) {
    console.error('Error fetching recent favorites:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error',
      message: error.message 
    });
  }
});

// Helper function to format numbers with K/M suffixes
function formatNumber(numStr) {
  const num = parseInt(numStr, 10);
  if (isNaN(num)) return '0';
  
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

module.exports = {
  getTrendingSongs,
  getTopArtists,
  getRecentFavorites,
};
