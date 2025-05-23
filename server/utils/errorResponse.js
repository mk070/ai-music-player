class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    // Capture the stack trace, excluding the constructor call from it
    Error.captureStackTrace(this, this.constructor);
  }

  // Static method to create a new error response
  static create(message, statusCode) {
    return new ErrorResponse(message, statusCode);
  }

  // Bad Request Error (400)
  static badRequest(message = 'Bad Request') {
    return new ErrorResponse(message, 400);
  }

  // Unauthorized Error (401)
  static unauthorized(message = 'Unauthorized') {
    return new ErrorResponse(message, 401);
  }

  // Forbidden Error (403)
  static forbidden(message = 'Forbidden') {
    return new ErrorResponse(message, 403);
  }

  // Not Found Error (404)
  static notFound(message = 'Resource not found') {
    return new ErrorResponse(message, 404);
  }

  // Method Not Allowed (405)
  static methodNotAllowed(message = 'Method not allowed') {
    return new ErrorResponse(message, 405);
  }

  // Conflict Error (409)
  static conflict(message = 'Conflict') {
    return new ErrorResponse(message, 409);
  }

  // Validation Error (422)
  static validationError(message = 'Validation failed') {
    return new ErrorResponse(message, 422);
  }

  // Too Many Requests (429)
  static tooManyRequests(message = 'Too many requests, please try again later') {
    return new ErrorResponse(message, 429);
  }

  // Internal Server Error (500)
  static serverError(message = 'Internal Server Error') {
    return new ErrorResponse(message, 500);
  }

  // Service Unavailable (503)
  static serviceUnavailable(message = 'Service Unavailable') {
    return new ErrorResponse(message, 503);
  }
}

module.exports = ErrorResponse;
