// models/Playlist.js
const mongoose = require('mongoose');

const PlaylistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a playlist name'],
    trim: true,
    maxlength: [100, 'Playlist name cannot be more than 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  coverImage: {
    url: {
      type: String,
      default: ''
    },
    publicId: {
      type: String,
      default: ''
    }
  },
  songs: [{
    song: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Song',
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  isCollaborative: {
    type: Boolean,
    default: false
  },
  collaborators: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    permissions: {
      type: String,
      enum: ['view', 'edit', 'admin'],
      default: 'view'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [{
    type: String,
    trim: true
  }],
  category: {
    type: String,
    enum: [
      'Personal', 'Party', 'Workout', 'Study', 'Relaxation', 
      'Road Trip', 'Romance', 'Throwback', 'Discover', 'Other'
    ],
    default: 'Personal'
  },
  totalDuration: {
    type: Number,
    default: 0
  },
  playCount: {
    type: Number,
    default: 0
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes
PlaylistSchema.index({ user: 1, name: 1 });
PlaylistSchema.index({ isPublic: 1 });
PlaylistSchema.index({ tags: 1 });
PlaylistSchema.index({ category: 1 });

// Text index for search
PlaylistSchema.index({
  name: 'text',
  description: 'text',
  tags: 'text'
});

// Virtual for song count
PlaylistSchema.virtual('songCount').get(function() {
  return this.songs.length;
});

// Calculate total duration before save
PlaylistSchema.pre('save', async function(next) {
  if (this.isModified('songs')) {
    try {
      const playlist = await this.constructor.findById(this._id).populate('songs.song', 'duration');
      if (playlist) {
        this.totalDuration = playlist.songs.reduce((total, item) => {
          return total + (item.song.duration || 0);
        }, 0);
      }
      this.updatedAt = Date.now();
    } catch (error) {
      console.error('Error calculating playlist duration:', error);
    }
  }
  next();
});

// Static method to get user's playlist stats
PlaylistSchema.statics.getUserPlaylistStats = async function(userId) {
  const stats = await this.aggregate([
    { $match: { user: userId } },
    {
      $group: {
        _id: '$user',
        totalPlaylists: { $sum: 1 },
        totalSongs: { $sum: { $size: '$songs' } },
        totalDuration: { $sum: '$totalDuration' },
        publicPlaylists: {
          $sum: { $cond: ['$isPublic', 1, 0] }
        },
        collaborativePlaylists: {
          $sum: { $cond: ['$isCollaborative', 1, 0] }
        }
      }
    }
  ]);

  return stats[0] || {
    totalPlaylists: 0,
    totalSongs: 0,
    totalDuration: 0,
    publicPlaylists: 0,
    collaborativePlaylists: 0
  };
};

module.exports = mongoose.model('Playlist', PlaylistSchema);