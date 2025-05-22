const mongoose = require('mongoose');

const PlaylistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a playlist name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  coverImage: {
    type: String,
    default: 'default-playlist.jpg'
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  songs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Song'
    }
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  tags: [{
    type: String,
    trim: true
  }],
  duration: {
    type: Number, // Total duration in seconds
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Calculate and update playlist duration before saving
PlaylistSchema.pre('save', async function(next) {
  if (this.isModified('songs')) {
    const Song = mongoose.model('Song');
    try {
      const songs = await Song.find({ _id: { $in: this.songs } }).select('duration');
      this.duration = songs.reduce((total, song) => total + (song.duration || 0), 0);
    } catch (err) {
      console.error('Error calculating playlist duration:', err);
      this.duration = 0;
    }
    this.updatedAt = Date.now();
  }
  next();
});

// Cascade delete songs when a playlist is deleted
PlaylistSchema.pre('remove', async function(next) {
  console.log(`Songs being removed from playlist ${this._id}`);
  next();
});

// Reverse populate with virtuals
PlaylistSchema.virtual('songCount').get(function() {
  return this.songs ? this.songs.length : 0;
});

// Static method to get total playtime by user
PlaylistSchema.statics.getTotalPlaytime = async function(userId) {
  const obj = await this.aggregate([
    {
      $match: { user: userId }
    },
    {
      $group: {
        _id: '$user',
        totalDuration: { $sum: '$duration' }
      }
    }
  ]);

  try {
    await this.model('User').findByIdAndUpdate(userId, {
      totalPlaytime: obj[0] ? obj[0].totalDuration : 0
    });
  } catch (err) {
    console.error(err);
  }
};

// Call getTotalPlaytime after save
PlaylistSchema.post('save', function() {
  this.constructor.getTotalPlaytime(this.user);
});

// Call getTotalPlaytime before remove
PlaylistSchema.pre('remove', function() {
  this.constructor.getTotalPlaytime(this.user);
});

module.exports = mongoose.model('Playlist', PlaylistSchema);
