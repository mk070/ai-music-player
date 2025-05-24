const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

// Public routes - no authentication required
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgotpassword', authController.forgotPassword);
router.put('/resetpassword/:resettoken', authController.resetPassword);

// Middleware to conditionally apply authentication
const conditionalProtect = (req, res, next) => {
  if (process.env.NODE_ENV === 'production' || process.env.ENABLE_AUTH === 'true') {
    return protect(req, res, next);
  }
  next();
};

// Protected routes - require authentication in production
router.get('/me', conditionalProtect, authController.getMe);
router.put('/updatedetails', conditionalProtect, authController.updateDetails);
router.put('/updatepassword', conditionalProtect, authController.updatePassword);
router.get('/logout', conditionalProtect, authController.logout);

module.exports = router;
