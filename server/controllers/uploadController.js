const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const cloudinary = require('../utils/cloudinary');
const Song = require('../models/Song');

// @desc    Upload a song
// @route   POST /api/upload/song
// @access  Private
exports.uploadSong = async (req, res) => {
  try {
    if (!req.files || !req.files.song) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const songFile = req.files.song;
    const { title, artist, genre } = req.body;

    // Validate file type
    const fileExt = path.extname(songFile.name).toLowerCase();
    if (!['.mp3', '.wav', '.ogg'].includes(fileExt)) {
      return res.status(400).json({ message: 'Invalid file type. Only MP3, WAV, and OGG files are allowed.' });
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

    // Remove local file
    fs.unlinkSync(uploadPath);

    // Save to database
    const song = new Song({
      title: title || path.basename(songFile.name, fileExt),
      artist: artist || 'Unknown',
      genre: genre || 'Other',
      duration: 0, // You might want to extract this from the file metadata
      url: result.secure_url,
      cloudinaryId: result.public_id,
      user: req.user.id,
    });

    await song.save();

    res.status(201).json(song);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during file upload' });
  }
};

// @desc    Upload an image
// @route   POST /api/upload/image
// @access  Private
exports.uploadImage = async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    const imageFile = req.files.image;
    
    // Validate file type
    const fileExt = path.extname(imageFile.name).toLowerCase();
    if (!['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(fileExt)) {
      return res.status(400).json({ message: 'Invalid image format' });
    }

    // Generate unique filename
    const fileName = `${uuidv4()}${fileExt}`;
    const uploadPath = path.join(__dirname, '../uploads/images', fileName);

    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(path.join(__dirname, '../uploads/images'))) {
      fs.mkdirSync(path.join(__dirname, '../uploads/images'), { recursive: true });
    }

    // Save file locally
    await imageFile.mv(uploadPath);

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(uploadPath, {
      folder: 'music-player/images',
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    });

    // Remove local file
    fs.unlinkSync(uploadPath);

    res.json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during image upload' });
  }
};

// @desc    Delete a file from Cloudinary
// @route   DELETE /api/upload
// @access  Private
exports.deleteFile = async (req, res) => {
  try {
    const { publicId, resourceType = 'image' } = req.body;

    if (!publicId) {
      return res.status(400).json({ message: 'Public ID is required' });
    }

    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    res.json({ message: 'File deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during file deletion' });
  }
};
