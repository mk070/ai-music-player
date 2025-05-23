const express = require('express');
const router = express.Router();
const {
  getMemories,
  getMemory,
  createMemory,
  updateMemory,
  deleteMemory,
  likeMemory,
  unlikeMemory,
  addComment,
  removeComment,
  getMemoryLikes,
  getMemoryComments,
  getMemoriesByUser,
  getPublicMemories,
  searchMemories,
  getMemoriesByMood,
  getMemoriesByLocation,
  getMemoriesInRadius
} = require('../controllers/memoryController');
const { protect } = require('../middlewares/authMiddleware');

// Public routes
router.get('/public', getPublicMemories);
router.get('/search', searchMemories);
router.get('/mood', getMemoriesByMood);
router.get('/location', getMemoriesByLocation);
router.get('/radius/:zipcode/:distance', getMemoriesInRadius);
router.get('/:id', getMemory);
router.get('/user/:userId', getMemoriesByUser);
router.get('/:id/likes', getMemoryLikes);
router.get('/:id/comments', getMemoryComments);

// Protected routes
router.use(protect);

router
  .route('/')
  .get(getMemories)
  .post(createMemory);

router
  .route('/:id')
  .put(updateMemory)
  .delete(deleteMemory);

router
  .route('/:id/like')
  .post(likeMemory)
  .delete(unlikeMemory);

router
  .route('/:id/comments')
  .post(addComment);

router
  .route('/:id/comments/:commentId')
  .delete(removeComment);

module.exports = router;
