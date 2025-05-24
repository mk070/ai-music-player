const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const fileupload = require('express-fileupload');
const errorHandler = require('./middlewares/errorMiddleware');

// Create Express app
const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File uploading
app.use(fileupload());

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
app.use('/api/songs', require('./routes/songsRoutes'));
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
