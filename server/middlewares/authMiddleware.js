const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Development user for testing
exports.getDevUser = async () => {
  return await User.findOne({ email: 'dev@example.com' }) || 
    new User({ 
      id:1,
      name: 'Dev User', 
      email: 'dev@example.com',
      password: 'devpassword',
      role: 'admin'
    }).save();
};

// Protect routes
exports.protect = async (req, res, next) => {
  // Skip authentication in development
  if (process.env.NODE_ENV === 'development') {
    try {
      req.user = await exports.getDevUser();
      return next();
    } catch (error) {
      console.error('Error getting dev user:', error);
      return res.status(500).json({ message: 'Development server error' });
    }
  }

  // Production authentication
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      req.user = await User.findById(decoded.user.id).select('-password');

      return next();
    } catch (error) {
      console.error('Authentication error:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};
