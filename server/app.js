const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const fileupload = require('express-fileupload');
const errorHandler = require('./middlewares/errorMiddleware');

// Create Express app
const app = express();

// Increase the request size limit for file uploads (50MB)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ 
  limit: '50mb',
  extended: true,
  parameterLimit: 50000
}));

// File uploading with increased limits
app.use(fileupload({
  limits: { 
    fileSize: 50 * 1024 * 1024, // 50MB max file size
    files: 2 // Max 2 files (song + cover)
  },
  abortOnLimit: true,
  responseOnLimit: 'File size is too large. Maximum allowed size is 50MB.',
  useTempFiles: false,
  tempFileDir: '/tmp/'
}));

// Increase the timeout for all requests to 10 minutes (600000ms)
app.use((req, res, next) => {
  req.setTimeout(600000, () => {
    res.status(408).json({ 
      success: false, 
      error: 'Request timeout. Please try again with a smaller file or check your connection.' 
    });
  });
  next();
});

// Enable CORS
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount routers
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/playlists', require('./routes/playlistRoutes'));
app.use('/api/songs', require('./routes/SongsRoutes'));
app.use('/api/memories', require('./routes/memoryRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// Error handler middleware
app.use(errorHandler);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, '../', 'client', 'build', 'index.html'))
  );
}

app.get('/',(req,res)=>{
  res.send('Welcome to the music player')
})

module.exports = app;
