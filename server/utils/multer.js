const multer = require('multer');
const path = require('path');
const ErrorResponse = require('./errorResponse');

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// Check file type
function checkFileType(file, cb) {
  // Allowed extensions
  const filetypes = /jpeg|jpg|png|gif|mp3|wav|m4a|aac|flac/;
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime type
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new ErrorResponse('Error: Audio/Image files only!', 400), false);
  }
}

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 50 }, // 50MB max file size
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// Middleware for single file upload
const uploadSingle = (fieldName) => (req, res, next) => {
  const uploadItem = upload.single(fieldName);
  uploadItem(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading
      return next(new ErrorResponse(err.message, 400));
    } else if (err) {
      // An unknown error occurred
      return next(err);
    }
    next();
  });
};

// Middleware for multiple file uploads
const uploadMultiple = (fieldName, maxCount) => (req, res, next) => {
  const uploadItems = upload.array(fieldName, maxCount);
  uploadItems(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading
      return next(new ErrorResponse(err.message, 400));
    } else if (err) {
      // An unknown error occurred
      return next(err);
    }
    next();
  });
};

// Middleware for multiple fields
const uploadFields = (fields) => (req, res, next) => {
  const uploadItems = upload.fields(fields);
  uploadItems(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading
      return next(new ErrorResponse(err.message, 400));
    } else if (err) {
      // An unknown error occurred
      return next(err);
    }
    next();
  });
};

module.exports = {
  upload,
  uploadSingle,
  uploadMultiple,
  uploadFields,
};
