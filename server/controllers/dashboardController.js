const asyncHandler = require('express-async-handler');

// @desc    Get trending songs
// @route   GET /api/dashboard/trending
// @access  Public
const getTrendingSongs = asyncHandler(async (req, res) => {
  try {
    // In a real app, this would be fetched from your database
    const trendingSongs = [
      { id: 1, title: "I'm Good (Blue)", artist: "David Guetta & Bebe Rexha", duration: "03:29", plays: "8 078 651", cover: "/api/placeholder/60/60" },
      { id: 2, title: "Under the Influence", artist: "Chris Brown", duration: "03:04", plays: "2 341 221", cover: "/api/placeholder/60/60" },
      { id: 3, title: "Forget Me", artist: "Lewis Capaldi", duration: "03:24", plays: "2 212 882", cover: "/api/placeholder/60/60" },
      { id: 4, title: "Bad Habit", artist: "Steve Lacy", duration: "03:32", plays: "1 934 291", cover: "/api/placeholder/60/60" },
      { id: 5, title: "DON'T YOU WORRY", artist: "Black Eyed Peas, Shakira & David Guetta", duration: "03:42", plays: "1 956 239", cover: "/api/placeholder/60/60" },
    ];

    res.status(200).json(trendingSongs);
  } catch (error) {
    console.error('Error fetching trending songs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get top artists
// @route   GET /api/dashboard/top-artists
// @access  Public
const getTopArtists = asyncHandler(async (req, res) => {
  try {
    // In a real app, this would be fetched from your database
    const topArtists = [
      { id: 1, name: "Muse", followers: "142291", plays: "19M", cover: "/api/placeholder/56/56" },
      { id: 2, name: "Bring Me the Horizon", followers: "52081", plays: "58M", cover: "/api/placeholder/56/56" },
      { id: 3, name: "Ed Sheeran", followers: "49435", plays: "998K", cover: "/api/placeholder/56/56" },
    ];

    res.status(200).json(topArtists);
  } catch (error) {
    console.error('Error fetching top artists:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get recent favorites
// @route   GET /api/dashboard/recent-favorites
// @access  Private
const getRecentFavorites = asyncHandler(async (req, res) => {
  try {
    // In a real app, this would be fetched from your database based on the user's favorites
    const recentFavorites = [
      { id: 1, title: "Family tourism", description: "The more, the merrier. Suitable for children", cover: "/api/placeholder/180/180" },
      { id: 2, title: "Bright Hits", description: "The most popular and striking music news", cover: "/api/placeholder/180/180" },
      { id: 3, title: "Freeze", description: "Chilled beats for summer nights", cover: "/api/placeholder/180/180" },
      { id: 4, title: "Summer Vibes", description: "Perfect soundtrack for sunny days", cover: "/api/placeholder/180/180" },
    ];

    res.status(200).json(recentFavorites);
  } catch (error) {
    console.error('Error fetching recent favorites:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = {
  getTrendingSongs,
  getTopArtists,
  getRecentFavorites,
};
