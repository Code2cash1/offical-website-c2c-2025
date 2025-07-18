const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://localhost:5173', 
    'http://localhost:5174',
    'https://code2cash.vercel.app',
    'https://offical-website-c2c-2025.vercel.app',
    'https://offical-website-c2c-2025-git-main-code2cash1s-projects.vercel.app',
    'https://offical-website-c2c-2025-code2cash1s-projects.vercel.app'
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/code2cash';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Backend is running!', timestamp: new Date().toISOString() });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend API is healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    mongodb: process.env.MONGODB_URI ? 'configured' : 'missing'
  });
});

app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API routes are working!',
    timestamp: new Date().toISOString()
  });
});

// Routes
try {
  console.log('Loading routes...');
  
  const authRoutes = require('./routes/auth');
  app.use('/api/auth', authRoutes);
  console.log('Auth routes loaded');
  
  const careersRoutes = require('./routes/careers');
  app.use('/api/careers', careersRoutes);
  console.log('Careers routes loaded');
  
  const meetingsRoutes = require('./routes/meetings');
  app.use('/api/meetings', meetingsRoutes);
  console.log('Meetings routes loaded');
  
  const contactsRoutes = require('./routes/contacts');
  app.use('/api/contacts', contactsRoutes);
  console.log('Contacts routes loaded');
  
  const adminRoutes = require('./routes/admin');
  app.use('/api/admin', adminRoutes);
  console.log('Admin routes loaded');
  
  const jobsRoutes = require('./routes/jobs');
  app.use('/api/jobs', jobsRoutes);
  console.log('Jobs routes loaded');
  
  console.log('All routes loaded successfully');
} catch (error) {
  console.error('Error loading routes:', error);
  console.error('Error stack:', error.stack);
}

// Upload folder for static files
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
