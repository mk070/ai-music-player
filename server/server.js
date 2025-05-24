const colors = require('colors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config({ path: './.env' });

// Import app after env vars are loaded
const app = require('./app');

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...'.red.bold);
  console.log(err.name, err.message);
  process.exit(1);
});

// Connect to MongoDB
connectDB();

const port = process.env.PORT || 5000;

// Create HTTP server with increased timeouts
const server = require('http').createServer(app);

// Increase the server timeout to 10 minutes (600000ms)
server.timeout = 600000;

// Handle server timeouts
server.on('timeout', (socket) => {
  console.error('Server timeout - closing connection'.red.bold);
  socket.end('HTTP/1.1 408 Request Timeout\r\n\r\n');
});

// Handle server errors
server.on('error', (error) => {
  console.error('Server error:'.red.bold, error);
});

// Start the server
server.listen(port, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${port}`.yellow.bold
  );
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...'.red.bold);
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle SIGTERM for graceful shutdown (e.g., Heroku)
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully'.yellow.bold);
  server.close(() => {
    console.log('💥 Process terminated!'.red.bold);
  });
});
