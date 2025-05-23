const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

// Public routes - no authentication required
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgotpassword', authController.forgotPassword);
router.put('/resetpassword/:resettoken', authController.resetPassword);

// Protected routes - require authentication
router.get('/me', protect, authController.getMe);
router.put('/updatedetails', protect, authController.updateDetails);
router.put('/updatepassword', protect, authController.updatePassword);
router.get('/logout', protect, authController.logout);

module.exports = router;
