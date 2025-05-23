const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const cloudinary = require('../utils/cloudinary');
const Song = require('../models/Song');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');

// @desc    Upload a song
// @route   POST /api/upload/song
// @access  Private
exports.uploadSong = asyncHandler(async (req, res, next) => {
  try {
    if (!req.files || !req.files.song) {
      return next(new ErrorResponse('No file uploaded', 400));
    }

    const songFile = req.files.song;
    const { title, artist, genre } = req.body;

    // Validate file type
    const fileExt = path.extname(songFile.name).toLowerCase();
    if (!['.mp3', '.wav', '.ogg'].includes(fileExt)) {
      return next(new ErrorResponse('Invalid file type. Only MP3, WAV, and OGG files are allowed.', 400));
    }

    // Generate unique filename
    const fileName = `${uuidv4()}${fileExt}`;
    const uploadPath = path.join(__dirname, '../uploads/songs', fileName);

    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(path.join(__dirname, '../uploads/songs'))) {
      fs.mkdirSync(path.join(__dirname, '../uploads/songs'), { recursive: true });
    }

    // Save file locally
    await songFile.mv(uploadPath);

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(uploadPath, {
      resource_type: 'video',
      folder: 'music-player/songs',
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    });

    fs.unlinkSync(uploadPath);

    // Save to database
    const song = new Song({
      title: title || path.basename(songFile.originalname, path.extname(songFile.originalname)),
      artist: artist || 'Unknown Artist',
      genre: genre || 'Other',
      album: album || 'Unknown Album',
      duration: duration || 0,
      url: result.secure_url,
      publicId: result.public_id,
      coverImage: coverImage,
      user: req.user.id,
    });

    await song.save();

    res.status(201).json({
      success: true,
      data: song,
    });
  } catch (err) {
    // Clean up any uploaded files if error occurs
    if (req.files.cover && fs.existsSync(req.files.cover.path)) {
      fs.unlinkSync(req.files.cover.path);
    }
    if (req.files.song && fs.existsSync(req.files.song.path)) {
      fs.unlinkSync(req.files.song.path);
    }
    return next(new ErrorResponse('File upload failed', 500));
  }
});

// @desc    Upload an image
// @route   POST /api/upload/image
// @access  Private
exports.uploadImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new ErrorResponse('No file uploaded', 400));
  }

  const imageFile = req.file;
  const { folder = 'misc' } = req.body;

  try {
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(imageFile.path, {
      folder: `music-player/${folder}`,
      resource_type: 'image',
      use_filename: true,
      unique_filename: true,
      overwrite: true,
    });

    // Remove temp file
    fs.unlinkSync(imageFile.path);

    res.status(201).json({
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
      },
    });
  } catch (err) {
    // Clean up temp file if error occurs
    if (fs.existsSync(imageFile.path)) {
      fs.unlinkSync(imageFile.path);
    }
    return next(new ErrorResponse('Image upload failed', 500));
  }
});

// @desc    Delete a file from Cloudinary
// @route   DELETE /api/upload
// @access  Private
exports.deleteFile = asyncHandler(async (req, res, next) => {
  const { publicId, resourceType = 'image' } = req.body;

  if (!publicId) {
    return next(new ErrorResponse('Please provide a public ID', 400));
  }

  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    return next(new ErrorResponse('Failed to delete file', 500));
  }
});
