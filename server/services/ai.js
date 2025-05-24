const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

// AI Service for generating recommendations and insights
class AIService {
  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY;
    this.spotifyClientId = process.env.SPOTIFY_CLIENT_ID;
    this.spotifyClientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    this.spotifyToken = null;
  }

  // Initialize Spotify token
  async initSpotifyToken() {
    try {
      const authOptions = {
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${this.spotifyClientId}:${this.spotifyClientSecret}`).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: 'grant_type=client_credentials'
      };

      const response = await axios(authOptions);
      this.spotifyToken = response.data.access_token;
      return this.spotifyToken;
    } catch (error) {
      console.error('Error getting Spotify token:', error);
      throw error;
    }
  }

  // Get song recommendations based on mood or genre
  async getSongRecommendations(mood, genre, limit = 10) {
    try {
      if (!this.spotifyToken) {
        await this.initSpotifyToken();
      }

      const seedGenres = genre ? genre.toLowerCase() : 'pop';
      const seedTracks = this.getSeedTracksForMood(mood);

      const response = await axios.get('https://api.spotify.com/v1/recommendations', {
        headers: {
          'Authorization': `Bearer ${this.spotifyToken}`
        },
        params: {
          limit,
          seed_genres: seedGenres,
          seed_tracks: seedTracks.join(','),
          target_valence: this.getValenceForMood(mood)
        }
      });

      return response.data.tracks.map(track => ({
        id: track.id || uuidv4(),
        title: track.name,
        artist: track.artists.map(a => a.name).join(', '),
        album: track.album.name,
        duration: Math.floor(track.duration_ms / 1000), // Convert to seconds
        coverImage: track.album.images[0]?.url || '',
        previewUrl: track.preview_url || '',
        externalUrl: track.external_urls.spotify,
        source: 'spotify'
      }));
    } catch (error) {
      console.error('Error getting song recommendations:', error);
      // Fallback to default recommendations if API fails
      return this.getFallbackRecommendations(mood, limit);
    }
  }

  // Generate memory insights using OpenAI
  async generateMemoryInsights(memoryData) {
    try {
      const prompt = this.createMemoryAnalysisPrompt(memoryData);
      
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a music and memory analysis assistant. Provide insights about the memory based on the provided data.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${this.openaiApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error generating memory insights:', error);
      return 'Unable to generate insights at this time.';
    }
  }

  // Helper methods
  getSeedTracksForMood(mood) {
    // These are example track IDs that can be replaced with actual track IDs
    const moodTracks = {
      happy: ['0C8ZW7ezQVs4URX5aX7Kqx', '3ZFTkvIE7kyPt6Nu3PEa7V'], // Happy tracks
      sad: ['1qEmFfgcLObUf59mhCIL9R', '3EEd6ldsPat620GVYMEhOP'], // Sad tracks
      energetic: ['7m7F7sq3BMdtKsLHjlbSQp', '5Q0Nhx0PgTJeUdHHSHzH3b'], // Energetic tracks
      chill: ['5aAx2yezTd8zXrkmtKl66Z', '2takcwOaAZWiXQijPHIx7B'], // Chill tracks
      nostalgic: ['6tG8N9qwQRIXFwdZLQDTge', '3BQHpFgAp4l80e1XslIjNI'] // Nostalgic tracks
    };

    return moodTracks[mood.toLowerCase()] || moodTracks.happy;
  }

  getValenceForMood(mood) {
    const moodValence = {
      happy: 0.9,
      sad: 0.2,
      energetic: 0.8,
      chill: 0.5,
      nostalgic: 0.6
    };

    return moodValence[mood.toLowerCase()] || 0.7;
  }

  getFallbackRecommendations(mood, limit) {
    // Fallback recommendations if API calls fail
    const recommendations = {
      happy: [
        { title: 'Happy', artist: 'Pharrell Williams', duration: 233 },
        { title: 'Can\'t Stop The Feeling', artist: 'Justin Timberlake', duration: 236 }
      ],
      sad: [
        { title: 'Someone Like You', artist: 'Adele', duration: 284 },
        { title: 'All I Want', artist: 'Kodaline', duration: 312 }
      ],
      energetic: [
        { title: 'Uptown Funk', artist: 'Mark Ronson ft. Bruno Mars', duration: 271 },
        { title: 'Shape of You', artist: 'Ed Sheeran', duration: 233 }
      ],
      chill: [
        { title: 'Blinding Lights', artist: 'The Weeknd', duration: 200 },
        { title: 'Watermelon Sugar', artist: 'Harry Styles', duration: 174 }
      ],
      nostalgic: [
        { title: 'Bohemian Rhapsody', artist: 'Queen', duration: 354 },
        { title: 'Billie Jean', artist: 'Michael Jackson', duration: 294 }
      ]
    };

    return (recommendations[mood.toLowerCase()] || recommendations.happy)
      .slice(0, limit)
      .map(song => ({
        ...song,
        id: uuidv4(),
        coverImage: '',
        previewUrl: '',
        externalUrl: '',
        source: 'fallback'
      }));
  }

  createMemoryAnalysisPrompt(memoryData) {
    return `Analyze this music memory and provide insights:
    
Title: ${memoryData.title}
Date: ${memoryData.date}
Mood: ${memoryData.mood}
Location: ${memoryData.location?.address || 'Not specified'}
Songs: ${memoryData.songs?.map(s => `${s.title} by ${s.artist}`).join(', ') || 'None'}
Description: ${memoryData.description || 'No description provided'}

Based on this information, please provide insights about:
1. The emotional tone of this memory
2. How the music relates to the described experience
3. Any interesting patterns or observations
4. Suggestions for similar music or memories
5. A creative interpretation of how this memory might sound`;
  }
}

module.exports = new AIService();
