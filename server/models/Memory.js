const mongoose = require('mongoose');

const MemorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  date: {
    type: Date,
    required: [true, 'Please add a date for this memory']
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      index: '2dsphere',
      required: [true, 'Please add coordinates']
    },
    address: {
      type: String,
      required: [true, 'Please add an address']
    },
    placeId: String
  },
  mood: {
    type: String,
    enum: [
      'Happy', 'Excited', 'Grateful', 'Content', 'Hopeful',
      'Loved', 'Proud', 'Joyful', 'Peaceful', 'Optimistic',
      'Neutral', 'Tired', 'Bored', 'Anxious', 'Stressed',
      'Sad', 'Angry', 'Frustrated', 'Overwhelmed', 'Lonely'
    ],
    default: 'Neutral'
  },
  coverImage: {
    type: String,
    default: 'default-memory.jpg'
  },
  images: [{
    url: String,
    publicId: String,
    caption: String
  }],
  songs: [{
    song: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Song',
      required: true
    },
    note: {
      type: String,
      maxlength: [200, 'Note cannot be more than 200 characters']
    }
  }],
  friends: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: String,
    avatar: String
  }],
  tags: [{
    type: String,
    trim: true
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublic: {
    type: Boolean,
    default: true
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
  toObject: { virtuals: true },
  timestamps: true
});

// Update the updatedAt field before saving
MemorySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create a compound index for geospatial queries and text search
MemorySchema.index({
  title: 'text',
  description: 'text',
  'location.address': 'text',
  tags: 'text',
  'friends.name': 'text'
}, {
  weights: {
    title: 10,
    tags: 5,
    description: 3,
    'location.address': 2,
    'friends.name': 1
  },
  name: 'memory_text_search'
});

// Static method to get memories within a radius
MemorySchema.statics.getMemoriesInRadius = async function(zipcode, distance, userId) {
  // TODO: Implement geocoding to get lat/lng from zipcode
  // This is a placeholder implementation
  const loc = await this.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [0, 0] // Replace with actual coordinates
        },
        distanceField: 'distance',
        maxDistance: distance * 1609.34, // Convert miles to meters
        spherical: true,
        query: {
          $or: [
            { isPublic: true },
            { user: mongoose.Types.ObjectId(userId) }
          ]
        }
      }
    },
    {
      $sort: { distance: 1 }
    },
    {
      $limit: 100
    }
  ]);

  return loc;
};

// Cascade delete memories when a user is deleted
MemorySchema.pre('remove', async function(next) {
  console.log(`Memory being removed: ${this._id}`);
  // TODO: Remove associated images from storage if needed
  next();
});

// Reverse populate with virtuals
MemorySchema.virtual('songCount').get(function() {
  return this.songs ? this.songs.length : 0;
});

// Add a text index for search
MemorySchema.index({ 
  title: 'text', 
  description: 'text',
  tags: 'text',
  'friends.name': 'text'
});

// Method to get memories by mood for a user
MemorySchema.statics.getMemoriesByMood = async function(userId) {
  return this.aggregate([
    {
      $match: {
        $or: [
          { isPublic: true },
          { user: mongoose.Types.ObjectId(userId) }
        ]
      }
    },
    {
      $group: {
        _id: '$mood',
        count: { $sum: 1 },
        memories: {
          $push: {
            id: '$_id',
            title: '$title',
            date: '$date',
            coverImage: '$coverImage'
          }
        }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);
};

// Method to get memories by location for a user
MemorySchema.statics.getMemoriesByLocation = async function(userId) {
  return this.aggregate([
    {
      $match: {
        $or: [
          { isPublic: true },
          { user: mongoose.Types.ObjectId(userId) }
        ],
        'location.address': { $exists: true, $ne: '' }
      }
    },
    {
      $group: {
        _id: '$location.address',
        coordinates: { $first: '$location.coordinates' },
        count: { $sum: 1 },
        memories: {
          $push: {
            id: '$_id',
            title: '$title',
            date: '$date',
            coverImage: '$coverImage'
          }
        }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);
};

module.exports = mongoose.model('Memory', MemorySchema);
