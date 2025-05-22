const mongoose = require('mongoose');

const SongSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a song title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  artist: {
    type: String,
    required: [true, 'Please add an artist name'],
    trim: true,
    maxlength: [100, 'Artist name cannot be more than 100 characters']
  },
  album: {
    type: String,
    trim: true,
    maxlength: [100, 'Album name cannot be more than 100 characters']
  },
  genre: {
    type: String,
    required: [true, 'Please add a genre'],
    enum: [
      'Pop', 'Rock', 'Hip Hop', 'Rap', 'R&B', 'Electronic', 'Jazz', 
      'Classical', 'Country', 'Blues', 'Reggae', 'Metal', 'Folk', 
      'Soul', 'Funk', 'Disco', 'Punk', 'Other'
    ]
  },
  duration: {
    type: Number, // Duration in seconds
    required: true
  },
  url: {
    type: String,
    required: true
  },
  cloudinaryId: {
    type: String,
    required: true
  },
  coverImage: {
    type: String,
    default: 'default-cover.jpg'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  playCount: {
    type: Number,
    default: 0
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent user from submitting more than one song with the same title and artist
SongSchema.index({ title: 1, artist: 1, user: 1 }, { unique: true });

// Static method to get average song duration by user
SongSchema.statics.getAverageDuration = async function(userId) {
  const obj = await this.aggregate([
    {
      $match: { user: userId }
    },
    {
      $group: {
        _id: '$user',
        averageDuration: { $avg: '$duration' }
      }
    }
  ]);

  try {
    await this.model('User').findByIdAndUpdate(userId, {
      averageSongDuration: obj[0] ? Math.ceil(obj[0].averageDuration / 10) * 10 : 0
    });
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageDuration after save
SongSchema.post('save', function() {
  this.constructor.getAverageDuration(this.user);
});

// Call getAverageDuration before remove
SongSchema.pre('remove', function() {
  this.constructor.getAverageDuration(this.user);
});

module.exports = mongoose.model('Song', SongSchema);
