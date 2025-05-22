const mongoose = require('mongoose');

const FavoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  song: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Song',
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  },
  // Additional metadata can be added here
  // For example: playCount, lastPlayed, rating, etc.
  playCount: {
    type: Number,
    default: 0
  },
  lastPlayed: {
    type: Date
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  tags: [{
    type: String,
    trim: true
  }],
  note: {
    type: String,
    maxlength: [500, 'Note cannot be more than 500 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Prevent duplicate favorites
FavoriteSchema.index({ user: 1, song: 1 }, { unique: true });

// Static method to get favorite stats for a user
FavoriteSchema.statics.getFavoriteStats = async function(userId) {
  const stats = await this.aggregate([
    {
      $match: { user: mongoose.Types.ObjectId(userId) }
    },
    {
      $lookup: {
        from: 'songs',
        localField: 'song',
        foreignField: '_id',
        as: 'songData'
      }
    },
    { $unwind: '$songData' },
    {
      $group: {
        _id: '$user',
        totalFavorites: { $sum: 1 },
        totalDuration: { $sum: '$songData.duration' },
        byGenre: { 
          $push: {
            genre: '$songData.genre',
            count: 1,
            duration: '$songData.duration'
          }
        },
        byArtist: {
          $push: {
            artist: '$songData.artist',
            count: 1,
            duration: '$songData.duration'
          }
        }
      }
    },
    {
      $project: {
        totalFavorites: 1,
        totalDuration: 1,
        topGenres: {
          $slice: [
            {
              $reduce: {
                input: '$byGenre',
                initialValue: [],
                in: {
                  $let: {
                    vars: {
                      existing: {
                        $filter: {
                          input: '$$value',
                          as: 'g',
                          cond: { $eq: ['$$g.genre', '$$this.genre'] }
                        }
                      }
                    },
                    in: {
                      $cond: [
                        { $gt: [{ $size: '$$existing' }, 0] },
                        {
                          $map: {
                            input: '$$value',
                            as: 'g',
                            in: {
                              $cond: [
                                { $eq: ['$$g.genre', '$$this.genre'] },
                                {
                                  genre: '$$g.genre',
                                  count: { $add: ['$$g.count', 1] },
                                  duration: { $add: ['$$g.duration', '$$this.duration'] }
                                },
                                '$$g'
                              ]
                            }
                          }
                        },
                        {
                          $concatArrays: [
                            '$$value',
                            [{
                              genre: '$$this.genre',
                              count: 1,
                              duration: '$$this.duration'
                            }]
                          ]
                        }
                      ]
                    }
                  }
                }
              }
            },
            5
          ]
        },
        topArtists: {
          $slice: [
            {
              $reduce: {
                input: '$byArtist',
                initialValue: [],
                in: {
                  $let: {
                    vars: {
                      existing: {
                        $filter: {
                          input: '$$value',
                          as: 'a',
                          cond: { $eq: ['$$a.artist', '$$this.artist'] }
                        }
                      }
                    },
                    in: {
                      $cond: [
                        { $gt: [{ $size: '$$existing' }, 0] },
                        {
                          $map: {
                            input: '$$value',
                            as: 'a',
                            in: {
                              $cond: [
                                { $eq: ['$$a.artist', '$$this.artist'] },
                                {
                                  artist: '$$a.artist',
                                  count: { $add: ['$$a.count', 1] },
                                  duration: { $add: ['$$a.duration', '$$this.duration'] }
                                },
                                '$$a'
                              ]
                            }
                          }
                        },
                        {
                          $concatArrays: [
                            '$$value',
                            [{
                              artist: '$$this.artist',
                              count: 1,
                              duration: '$$this.duration'
                            }]
                          ]
                        }
                      ]
                    }
                  }
                }
              }
            },
            5
          ]
        }
      }
    },
    {
      $sort: {
        'topGenres.count': -1,
        'topArtists.count': -1
      }
    }
  ]);

  return stats[0] || {
    totalFavorites: 0,
    totalDuration: 0,
    topGenres: [],
    topArtists: []
  };
};

// Call getFavoriteStats after save
FavoriteSchema.post('save', async function() {
  await this.constructor.getFavoriteStats(this.user);
});

// Call getFavoriteStats before remove
FavoriteSchema.post('remove', async function() {
  await this.constructor.getFavoriteStats(this.user);
});

module.exports = mongoose.model('Favorite', FavoriteSchema);
