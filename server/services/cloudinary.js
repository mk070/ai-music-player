// cloudinary-service.js
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Constants for folder structure
const FOLDERS = {
  SONGS: 'user_uploads/songs',
  COVERS: 'user_uploads/covers',
  PLAYLISTS: 'user_uploads/playlists'
};

// Allowed file types
const ALLOWED_AUDIO_FORMATS = ['mp3', 'wav', 'flac', 'm4a', 'aac'];
const ALLOWED_IMAGE_FORMATS = ['jpg', 'jpeg', 'png', 'webp'];

/**
 * Generate folder path for user-specific uploads
 */
const getUserFolder = (userId, type) => {
  return `${FOLDERS[type.toUpperCase()]}/user_${userId}`;
};

/**
 * Generate unique public_id with timestamp and sanitized filename
 */
const generatePublicId = (userId, filename, type) => {
  const timestamp = Date.now();
  const sanitizedFilename = filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase();
  
  const folder = getUserFolder(userId, type);
  return `${folder}/${timestamp}_${sanitizedFilename}`;
};

/**
 * Multer storage configuration for songs
 */
const songStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: (req, file) => getUserFolder(req.body.userId || req.user?.id, 'songs'),
    public_id: (req, file) => {
      const timestamp = Date.now();
      const sanitizedName = file.originalname
        .replace(/\.[^/.]+$/, '') // Remove extension
        .replace(/[^a-zA-Z0-9.-]/g, '_')
        .toLowerCase();
      return `${timestamp}_${sanitizedName}`;
    },
    resource_type: 'video', // Use 'video' for audio files
    format: (req, file) => {
      const ext = file.originalname.split('.').pop().toLowerCase();
      return ALLOWED_AUDIO_FORMATS.includes(ext) ? ext : 'mp3';
    },
    context: (req, file) => ({
      userId: req.body.userId || req.user?.id,
      songTitle: req.body.title || file.originalname,
      artist: req.body.artist || 'Unknown Artist',
      album: req.body.album || '',
      genre: req.body.genre || '',
      duration: req.body.duration || '',
      uploadedAt: new Date().toISOString()
    })
  }
});

/**
 * Multer storage configuration for cover images
 */
const coverStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: (req, file) => getUserFolder(req.body.userId || req.user?.id, 'covers'),
    public_id: (req, file) => {
      const timestamp = Date.now();
      const sanitizedName = file.originalname
        .replace(/\.[^/.]+$/, '')
        .replace(/[^a-zA-Z0-9.-]/g, '_')
        .toLowerCase();
      return `${timestamp}_${sanitizedName}`;
    },
    resource_type: 'image',
    format: 'jpg',
    transformation: [
      { width: 500, height: 500, crop: 'fill', quality: 'auto' },
      { fetch_format: 'auto' }
    ],
    context: (req, file) => ({
      userId: req.body.userId || req.user?.id,
      songId: req.body.songId || '',
      uploadedAt: new Date().toISOString()
    })
  }
});

// Multer instances
const uploadSong = multer({
  storage: songStorage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const ext = file.originalname.split('.').pop().toLowerCase();
    if (ALLOWED_AUDIO_FORMATS.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid audio format. Allowed: ${ALLOWED_AUDIO_FORMATS.join(', ')}`));
    }
  }
});

const uploadCover = multer({
  storage: coverStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const ext = file.originalname.split('.').pop().toLowerCase();
    if (ALLOWED_IMAGE_FORMATS.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid image format. Allowed: ${ALLOWED_IMAGE_FORMATS.join(', ')}`));
    }
  }
});

/**
 * Upload song with optional cover
 */
const uploadSongWithCover = async (songFile, coverFile, metadata) => {
  try {
    const { userId, title, artist, album, genre, duration } = metadata;
    
    if (!userId || !songFile) {
      throw new Error('User ID and song file are required');
    }

    // Upload song
    const songPublicId = generatePublicId(userId, songFile.originalname, 'songs');
    const songResult = await cloudinary.uploader.upload(songFile.path || songFile.buffer, {
      public_id: songPublicId,
      resource_type: 'video',
      context: {
        userId,
        title: title || songFile.originalname,
        artist: artist || 'Unknown Artist',
        album: album || '',
        genre: genre || '',
        duration: duration || '',
        uploadedAt: new Date().toISOString()
      },
      tags: [`user_${userId}`, 'song', genre || 'untagged'].filter(Boolean)
    });

    let coverResult = null;
    
    // Upload cover if provided
    if (coverFile) {
      const coverPublicId = generatePublicId(userId, coverFile.originalname, 'covers');
      coverResult = await cloudinary.uploader.upload(coverFile.path || coverFile.buffer, {
        public_id: coverPublicId,
        resource_type: 'image',
        transformation: [
          { width: 500, height: 500, crop: 'fill', quality: 'auto' }
        ],
        context: {
          userId,
          songId: songResult.public_id,
          uploadedAt: new Date().toISOString()
        },
        tags: [`user_${userId}`, 'cover', `song_${songResult.public_id}`]
      });
    }

    return {
      song: {
        id: songResult.public_id,
        url: songResult.secure_url,
        duration: songResult.duration,
        format: songResult.format,
        bytes: songResult.bytes,
        metadata: songResult.context
      },
      cover: coverResult ? {
        id: coverResult.public_id,
        url: coverResult.secure_url,
        width: coverResult.width,
        height: coverResult.height,
        format: coverResult.format,
        bytes: coverResult.bytes
      } : null
    };
  } catch (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }
};

/**
 * Get all songs for a user
 */
const getUserSongs = async (userId, options = {}) => {
  try {
    const { maxResults = 100, nextCursor } = options;
    
    const result = await cloudinary.search
      .expression(`folder:${getUserFolder(userId, 'songs')} AND resource_type:video`)
      .sort_by([['uploaded_at', 'desc']])
      .with_field('context')
      .with_field('tags')
      .max_results(maxResults)
      .next_cursor(nextCursor)
      .execute();

    return {
      songs: result.resources.map(resource => ({
        id: resource.public_id,
        url: resource.secure_url,
        filename: resource.filename,
        format: resource.format,
        duration: resource.duration,
        bytes: resource.bytes,
        uploadedAt: resource.uploaded_at,
        metadata: resource.context || {},
        tags: resource.tags || []
      })),
      nextCursor: result.next_cursor,
      totalCount: result.total_count
    };
  } catch (error) {
    throw new Error(`Failed to get user songs: ${error.message}`);
  }
};

/**
 * Get all covers for a user
 */
const getUserCovers = async (userId, options = {}) => {
  try {
    const { maxResults = 100, nextCursor } = options;
    
    const result = await cloudinary.search
      .expression(`folder:${getUserFolder(userId, 'covers')} AND resource_type:image`)
      .sort_by([['uploaded_at', 'desc']])
      .with_field('context')
      .with_field('tags')
      .max_results(maxResults)
      .next_cursor(nextCursor)
      .execute();

    return {
      covers: result.resources.map(resource => ({
        id: resource.public_id,
        url: resource.secure_url,
        width: resource.width,
        height: resource.height,
        format: resource.format,
        bytes: resource.bytes,
        uploadedAt: resource.uploaded_at,
        metadata: resource.context || {},
        tags: resource.tags || []
      })),
      nextCursor: result.next_cursor,
      totalCount: result.total_count
    };
  } catch (error) {
    throw new Error(`Failed to get user covers: ${error.message}`);
  }
};

/**
 * Search songs by title, artist, or genre
 */
const searchSongs = async (userId, query, options = {}) => {
  try {
    const { maxResults = 50 } = options;
    
    // Build search expression
    let searchExpression = `folder:${getUserFolder(userId, 'songs')} AND resource_type:video`;
    
    if (query) {
      // Search in filename and context
      searchExpression += ` AND (filename:*${query}* OR context.title:*${query}* OR context.artist:*${query}* OR context.genre:*${query}*)`;
    }

    const result = await cloudinary.search
      .expression(searchExpression)
      .sort_by([['uploaded_at', 'desc']])
      .with_field('context')
      .with_field('tags')
      .max_results(maxResults)
      .execute();

    return result.resources.map(resource => ({
      id: resource.public_id,
      url: resource.secure_url,
      filename: resource.filename,
      format: resource.format,
      duration: resource.duration,
      bytes: resource.bytes,
      uploadedAt: resource.uploaded_at,
      metadata: resource.context || {},
      tags: resource.tags || []
    }));
  } catch (error) {
    throw new Error(`Search failed: ${error.message}`);
  }
};

/**
 * Get song by ID
 */
const getSongById = async (songId) => {
  try {
    const result = await cloudinary.api.resource(songId, {
      resource_type: 'video',
      context: true,
      tags: true
    });

    return {
      id: result.public_id,
      url: result.secure_url,
      filename: result.filename,
      format: result.format,
      duration: result.duration,
      bytes: result.bytes,
      uploadedAt: result.uploaded_at,
      metadata: result.context || {},
      tags: result.tags || []
    };
  } catch (error) {
    throw new Error(`Song not found: ${error.message}`);
  }
};

/**
 * Update song metadata
 */
const updateSongMetadata = async (songId, metadata) => {
  try {
    const result = await cloudinary.api.update(songId, {
      resource_type: 'video',
      context: {
        ...metadata,
        updatedAt: new Date().toISOString()
      }
    });

    return {
      id: result.public_id,
      metadata: result.context
    };
  } catch (error) {
    throw new Error(`Failed to update metadata: ${error.message}`);
  }
};

/**
 * Delete song and associated cover
 */
const deleteSong = async (songId, deleteCover = true) => {
  try {
    // Delete the song
    const songResult = await cloudinary.api.delete_resources([songId], {
      resource_type: 'video'
    });

    let coverResult = null;
    
    if (deleteCover) {
      // Find and delete associated cover
      try {
        const covers = await cloudinary.search
          .expression(`tags:song_${songId} AND resource_type:image`)
          .execute();
        
        if (covers.resources.length > 0) {
          const coverIds = covers.resources.map(cover => cover.public_id);
          coverResult = await cloudinary.api.delete_resources(coverIds, {
            resource_type: 'image'
          });
        }
      } catch (coverError) {
        console.warn('Failed to delete associated cover:', coverError.message);
      }
    }

    return {
      songDeleted: songResult.deleted[songId] === 'deleted',
      coverDeleted: coverResult ? Object.keys(coverResult.deleted).length > 0 : false
    };
  } catch (error) {
    throw new Error(`Failed to delete song: ${error.message}`);
  }
};

/**
 * Delete cover by ID
 */
const deleteCover = async (coverId) => {
  try {
    const result = await cloudinary.api.delete_resources([coverId], {
      resource_type: 'image'
    });

    return {
      deleted: result.deleted[coverId] === 'deleted'
    };
  } catch (error) {
    throw new Error(`Failed to delete cover: ${error.message}`);
  }
};

/**
 * Delete all user files
 */
const deleteAllUserFiles = async (userId) => {
  try {
    const songFolder = getUserFolder(userId, 'songs');
    const coverFolder = getUserFolder(userId, 'covers');

    // Delete all songs
    const songsResult = await cloudinary.api.delete_resources_by_prefix(songFolder, {
      resource_type: 'video'
    });

    // Delete all covers
    const coversResult = await cloudinary.api.delete_resources_by_prefix(coverFolder, {
      resource_type: 'image'
    });

    // Delete empty folders
    try {
      await cloudinary.api.delete_folder(songFolder);
      await cloudinary.api.delete_folder(coverFolder);
    } catch (folderError) {
      // Folders might not be empty or might not exist
      console.warn('Could not delete folders:', folderError.message);
    }

    return {
      songsDeleted: Object.keys(songsResult.deleted).length,
      coversDeleted: Object.keys(coversResult.deleted).length
    };
  } catch (error) {
    throw new Error(`Failed to delete user files: ${error.message}`);
  }
};

/**
 * Get storage usage for user
 */
const getUserStorageUsage = async (userId) => {
  try {
    const [songs, covers] = await Promise.all([
      getUserSongs(userId, { maxResults: 500 }),
      getUserCovers(userId, { maxResults: 500 })
    ]);

    const songBytes = songs.songs.reduce((total, song) => total + (song.bytes || 0), 0);
    const coverBytes = covers.covers.reduce((total, cover) => total + (cover.bytes || 0), 0);

    return {
      totalBytes: songBytes + coverBytes,
      songBytes,
      coverBytes,
      songCount: songs.songs.length,
      coverCount: covers.covers.length,
      totalSizeFormatted: formatBytes(songBytes + coverBytes)
    };
  } catch (error) {
    throw new Error(`Failed to get storage usage: ${error.message}`);
  }
};

/**
 * Format bytes to human readable string
 */
const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Create playlist cover from multiple songs
 */
const createPlaylistCover = async (userId, songIds, playlistName) => {
  try {
    // Get up to 4 song covers for collage
    const covers = [];
    for (const songId of songIds.slice(0, 4)) {
      try {
        const coverSearch = await cloudinary.search
          .expression(`tags:song_${songId} AND resource_type:image`)
          .max_results(1)
          .execute();
        
        if (coverSearch.resources.length > 0) {
          covers.push(coverSearch.resources[0].secure_url);
        }
      } catch (err) {
        console.warn(`No cover found for song ${songId}`);
      }
    }

    if (covers.length === 0) {
      throw new Error('No covers found for playlist');
    }

    // Create collage transformation
    let transformation;
    if (covers.length === 1) {
      transformation = [
        { width: 400, height: 400, crop: 'fill' },
        { overlay: 'text:Arial_40:' + encodeURIComponent(playlistName), 
          gravity: 'south', y: 20, color: 'white' }
      ];
    } else if (covers.length === 2) {
      transformation = [
        { width: 200, height: 400, crop: 'fill' },
        { overlay: covers[1].split('/').pop().split('.')[0], 
          width: 200, height: 400, crop: 'fill', x: 200 },
        { width: 400, height: 400 }
      ];
    } else {
      // Create 2x2 grid for 3-4 covers
      transformation = [
        { width: 200, height: 200, crop: 'fill' },
        { overlay: covers[1].split('/').pop().split('.')[0], 
          width: 200, height: 200, crop: 'fill', x: 200 },
        { overlay: covers[2].split('/').pop().split('.')[0], 
          width: 200, height: 200, crop: 'fill', y: 200 },
        { overlay: covers[3] ? covers[3].split('/').pop().split('.')[0] : covers[0].split('/').pop().split('.')[0], 
          width: 200, height: 200, crop: 'fill', x: 200, y: 200 },
        { width: 400, height: 400 }
      ];
    }

    const playlistCoverResult = await cloudinary.uploader.upload(covers[0], {
      public_id: generatePublicId(userId, `playlist_${playlistName}`, 'covers'),
      transformation,
      context: {
        userId,
        playlistName,
        songIds: songIds.join(','),
        createdAt: new Date().toISOString()
      },
      tags: [`user_${userId}`, 'playlist_cover']
    });

    return {
      id: playlistCoverResult.public_id,
      url: playlistCoverResult.secure_url,
      width: playlistCoverResult.width,
      height: playlistCoverResult.height
    };
  } catch (error) {
    throw new Error(`Failed to create playlist cover: ${error.message}`);
  }
};

module.exports = {
  // Core Cloudinary instance
  cloudinary,
  
  // Multer instances
  uploadSong,
  uploadCover,
  
  // Main functions
  uploadSongWithCover,
  getUserSongs,
  getUserCovers,
  searchSongs,
  getSongById,
  updateSongMetadata,
  deleteSong,
  deleteCover,
  deleteAllUserFiles,
  getUserStorageUsage,
  createPlaylistCover,
  
  // Utility functions
  generatePublicId,
  getUserFolder,
  formatBytes,
  
  // Constants
  FOLDERS,
  ALLOWED_AUDIO_FORMATS,
  ALLOWED_IMAGE_FORMATS
};