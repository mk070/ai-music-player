const Memory = require('../models/Memory');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const geocoder = require('../utils/geocoder');

// @desc    Get public memories
// @route   GET /api/memories/public
// @access  Public
exports.getPublicMemories = asyncHandler(async (req, res, next) => {
  const memories = await Memory.find({ isPublic: true })
    .sort({ date: -1 })
    .populate('user', 'name avatar')
    .populate('song', 'title artist coverImage');

  res.status(200).json({
    success: true,
    count: memories.length,
    data: memories
  });
});

// @desc    Search memories
// @route   GET /api/memories/search
// @access  Public
exports.searchMemories = asyncHandler(async (req, res, next) => {
  const { q } = req.query;

  if (!q) {
    return next(new ErrorResponse('Please provide a search query', 400));
  }

  const memories = await Memory.find({
    $or: [
      { title: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
      { 'location.address': { $regex: q, $options: 'i' } }
    ],
    $or: [
      { isPublic: true },
      { user: req.user?.id || null }
    ]
  })
    .populate('user', 'name avatar')
    .populate('song', 'title artist coverImage');

  res.status(200).json({
    success: true,
    count: memories.length,
    data: memories
  });
});

// @desc    Get memories by mood
// @route   GET /api/memories/mood
// @access  Public
exports.getMemoriesByMood = asyncHandler(async (req, res, next) => {
  const { mood } = req.query;

  if (!mood) {
    return next(new ErrorResponse('Please provide a mood', 400));
  }

  const memories = await Memory.find({
    mood,
    $or: [
      { isPublic: true },
      { user: req.user?.id || null }
    ]
  })
    .populate('user', 'name avatar')
    .populate('song', 'title artist coverImage');

  res.status(200).json({
    success: true,
    count: memories.length,
    data: memories
  });
});

// @desc    Get memories by location
// @route   GET /api/memories/location
// @access  Public
exports.getMemoriesByLocation = asyncHandler(async (req, res, next) => {
  const { lat, lng, maxDistance = 10000 } = req.query; // maxDistance in meters

  if (!lat || !lng) {
    return next(new ErrorResponse('Please provide latitude and longitude', 400));
  }

  const memories = await Memory.find({
    'location.coordinates': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [parseFloat(lng), parseFloat(lat)]
        },
        $maxDistance: parseFloat(maxDistance)
      }
    },
    $or: [
      { isPublic: true },
      { user: req.user?.id || null }
    ]
  })
    .populate('user', 'name avatar')
    .populate('song', 'title artist coverImage');

  res.status(200).json({
    success: true,
    count: memories.length,
    data: memories
  });
});

// @desc    Get memories within radius
// @route   GET /api/memories/radius/:zipcode/:distance
// @access  Public
exports.getMemoriesInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calc radius using radians
  // Divide distance by radius of Earth
  // Earth Radius = 3,963 mi / 6,378 km
  const radius = distance / 3963;

  const memories = await Memory.find({
    'location.coordinates': {
      $geoWithin: { $centerSphere: [[lng, lat], radius] }
    },
    $or: [
      { isPublic: true },
      { user: req.user?.id || null }
    ]
  })
    .populate('user', 'name avatar')
    .populate('song', 'title artist coverImage');

  res.status(200).json({
    success: true,
    count: memories.length,
    data: memories
  });
});

// @desc    Get all memories
// @route   GET /api/memories
// @access  Private
exports.getMemories = asyncHandler(async (req, res, next) => {
  const memories = await Memory.find({ user: req.user.id })
    .sort({ date: -1 })
    .populate('song', 'title artist coverImage');

  res.status(200).json({
    success: true,
    count: memories.length,
    data: memories
  });
});

// @desc    Get single memory
// @route   GET /api/memories/:id
// @access  Private
exports.getMemory = asyncHandler(async (req, res, next) => {
  const memory = await Memory.findById(req.params.id)
    .populate('song', 'title artist coverImage')
    .populate('user', 'name avatar');

  if (!memory) {
    return next(
      new ErrorResponse(`Memory not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user owns the memory
  if (memory.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse('Not authorized to access this memory', 401)
    );
  }

  res.status(200).json({
    success: true,
    data: memory
  });
});

// @desc    Create new memory
// @route   POST /api/memories
// @access  Private
exports.createMemory = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;

  const memory = await Memory.create(req.body);

  res.status(201).json({
    success: true,
    data: memory
  });
});

// @desc    Update memory
// @route   PUT /api/memories/:id
// @access  Private
exports.updateMemory = asyncHandler(async (req, res, next) => {
  let memory = await Memory.findById(req.params.id);

  if (!memory) {
    return next(
      new ErrorResponse(`Memory not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user owns the memory
  if (memory.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse('Not authorized to update this memory', 401)
    );
  }

  memory = await Memory.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: memory
  });
});

// @desc    Delete memory
// @route   DELETE /api/memories/:id
// @access  Private
exports.deleteMemory = asyncHandler(async (req, res, next) => {
  const memory = await Memory.findById(req.params.id);

  if (!memory) {
    return next(
      new ErrorResponse(`Memory not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user owns the memory
  if (memory.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse('Not authorized to delete this memory', 401)
    );
  }

  await memory.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get memories by song
// @route   GET /api/memories/song/:songId
// @access  Private
exports.getMemoriesBySong = asyncHandler(async (req, res, next) => {
  const memories = await Memory.find({
    song: req.params.songId,
    $or: [
      { user: req.user.id },
      { isPublic: true }
    ]
  })
    .sort({ date: -1 })
    .populate('user', 'name avatar');

  res.status(200).json({
    success: true,
    count: memories.length,
    data: memories
  });
});

// @desc    Get memory likes
// @route   GET /api/memories/:id/likes
// @access  Public
exports.getMemoryLikes = asyncHandler(async (req, res, next) => {
  const memory = await Memory.findById(req.params.id).select('likes');
  
  if (!memory) {
    return next(
      new ErrorResponse(`Memory not found with id of ${req.params.id}`, 404)
    );
  }

  const likes = await User.find({ _id: { $in: memory.likes } })
    .select('name avatar');

  res.status(200).json({
    success: true,
    count: likes.length,
    data: likes
  });
});

// @desc    Add comment to memory
// @route   POST /api/memories/:id/comments
// @access  Private
exports.addComment = asyncHandler(async (req, res, next) => {
  const { text } = req.body;

  if (!text) {
    return next(new ErrorResponse('Please add a comment', 400));
  }

  const memory = await Memory.findById(req.params.id);

  if (!memory) {
    return next(
      new ErrorResponse(`Memory not found with id of ${req.params.id}`, 404)
    );
  }

  const newComment = {
    user: req.user.id,
    text,
    name: req.user.name,
    avatar: req.user.avatar
  };

  memory.comments.unshift(newComment);
  await memory.save();

  res.status(200).json({
    success: true,
    data: memory.comments[0]
  });
});

// @desc    Get memory comments
// @route   GET /api/memories/:id/comments
// @access  Public
exports.getMemoryComments = asyncHandler(async (req, res, next) => {
  const memory = await Memory.findById(req.params.id)
    .select('comments')
    .populate('comments.user', 'name avatar');
  
  if (!memory) {
    return next(
      new ErrorResponse(`Memory not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    count: memory.comments.length,
    data: memory.comments
  });
});

// @desc    Remove comment from memory
// @route   DELETE /api/memories/:id/comments/:commentId
// @access  Private
exports.removeComment = asyncHandler(async (req, res, next) => {
  const memory = await Memory.findById(req.params.id);
  
  if (!memory) {
    return next(
      new ErrorResponse(`Memory not found with id of ${req.params.id}`, 404)
    );
  }

  // Find comment
  const comment = memory.comments.find(
    comment => comment._id.toString() === req.params.commentId
  );

  if (!comment) {
    return next(
      new ErrorResponse(`Comment not found with id of ${req.params.commentId}`, 404)
    );
  }

  // Make sure user is comment owner or admin
  if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse('Not authorized to delete this comment', 401)
    );
  }

  // Get remove index
  const removeIndex = memory.comments
    .map(comment => comment._id.toString())
    .indexOf(req.params.commentId);

  memory.comments.splice(removeIndex, 1);
  await memory.save();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get memories by user
// @route   GET /api/memories/user/:userId
// @access  Public
exports.getMemoriesByUser = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  
  const memories = await Memory.find({
    user: userId,
    $or: [
      { isPublic: true },
      { user: req.user?.id || null }
    ]
  })
    .sort({ date: -1 })
    .populate('user', 'name avatar')
    .populate('song', 'title artist coverImage');

  res.status(200).json({
    success: true,
    count: memories.length,
    data: memories
  });
});

// @desc    Toggle memory like
// @route   PUT /api/memories/:id/like
// @access  Private
exports.likeMemory = asyncHandler(async (req, res, next) => {
  const memory = await Memory.findById(req.params.id);

  if (!memory) {
    return next(
      new ErrorResponse(`Memory not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if the memory has already been liked
  if (memory.likes.includes(req.user.id)) {
    return next(new ErrorResponse('Memory already liked', 400));
  }

  memory.likes.push(req.user.id);
  await memory.save();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Remove memory like
// @route   PUT /api/memories/:id/unlike
// @access  Private
exports.unlikeMemory = asyncHandler(async (req, res, next) => {
  const memory = await Memory.findById(req.params.id);

  if (!memory) {
    return next(
      new ErrorResponse(`Memory not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if the memory has been liked
  if (!memory.likes.includes(req.user.id)) {
    return next(new ErrorResponse('Memory has not been liked', 400));
  }

  // Remove the like
  memory.likes = memory.likes.filter(
    like => like.toString() !== req.user.id
  );
  
  await memory.save();

  res.status(200).json({
    success: true,
    data: {}
  });
});
