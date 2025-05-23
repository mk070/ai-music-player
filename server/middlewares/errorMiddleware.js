const ErrorResponse = require('../utils/errorResponse');

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console for dev
  console.error(err.stack);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = ErrorResponse.notFound(message);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Duplicate field value: ${field}. Please use another value.`;
    error = ErrorResponse.badRequest(message);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = ErrorResponse.validationError(message);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = ErrorResponse.unauthorized('Not authorized, token failed');
  }

  // JWT expired
  if (err.name === 'TokenExpiredError') {
    error = ErrorResponse.unauthorized('Session expired, please log in again');
  }

  // Handle custom errors
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message || 'Server Error'
    });
  }

  // Log the full error in development
  if (process.env.NODE_ENV === 'development') {
    console.error(err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Server Error',
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }

  // For production, don't leak error details
  res.status(500).json({
    success: false,
    error: 'Internal Server Error'
  });
};

module.exports = errorHandler;
