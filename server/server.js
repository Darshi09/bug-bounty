import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/database.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import bugRoutes from './routes/bugRoutes.js';
import submissionRoutes from './routes/submissionRoutes.js';
import userRoutes from './routes/userRoutes.js';
import approvalRoutes from './routes/approvalRoutes.js';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize Express app
const app = express();

// Middleware - increase limit for base64 file uploads (images/videos in submissions)
const bodyLimit = '50mb';
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: bodyLimit }));
app.use(express.urlencoded({ extended: true, limit: bodyLimit }));

// Log body limit on startup
console.log(`Body size limit set to: ${bodyLimit}`);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bugs', bugRoutes);
app.use('/api/bugs', submissionRoutes);
app.use('/api/submissions', approvalRoutes);
app.use('/api/users', userRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running'
  });
});

// Error handling middleware - must be after routes
app.use((err, req, res, next) => {
  // Handle payload too large errors
  if (err.type === 'entity.too.large' || err.statusCode === 413 || err.status === 413 || err.name === 'PayloadTooLargeError') {
    return res.status(413).json({
      success: false,
      message: 'Request payload too large. Try a smaller file or use a link instead.'
    });
  }
  
  // Log other errors
  console.error('Error:', err.name, err.message);
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }
  
  res.status(err.statusCode || err.status || 500).json({
    success: false,
    message: err.message || 'Something went wrong!'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
