const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const JobApplication = require('../models/JobApplication');
const Job = require('../models/Job');
const auth = require('../middleware/auth');

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, 'resume-' + Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and image files are allowed!'), false);
    }
  }
});

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File size too large. Maximum size is 5MB.' });
    }
    return res.status(400).json({ message: 'File upload error: ' + err.message });
  } else if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
};

// Apply for a job (public)
router.post('/apply', upload.single('resume'), handleMulterError, async (req, res) => {
  try {
    console.log('Job application request received');
    console.log('Request body:', req.body);
    console.log('File:', req.file);

    const { jobId, fullName, email, phone, experience, coverLetter } = req.body;
    
    // Validate required fields
    if (!jobId || !fullName || !email || !phone || !experience || !coverLetter) {
      console.log('Missing required fields');
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!req.file) {
      console.log('No file uploaded');
      return res.status(400).json({ message: 'Resume file is required' });
    }

    console.log('Looking for job with ID:', jobId);
    
    // Validate jobId format
    if (!jobId || !jobId.match(/^[0-9a-fA-F]{24}$/)) {
      console.log('Invalid job ID format:', jobId);
      return res.status(400).json({ message: 'Invalid job ID format' });
    }
    
    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      console.log('Job not found with ID:', jobId);
      return res.status(404).json({ message: 'Job not found' });
    }

    console.log('Job found:', job.title);

    // Check if user already applied for this job
    const existingApplication = await JobApplication.findOne({ jobId, email });
    if (existingApplication) {
      console.log('User already applied for this job');
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    console.log('Creating new application');

    const application = new JobApplication({
      jobId,
      jobTitle: job.title,
      fullName,
      email,
      phone,
      experience,
      coverLetter,
      resumeUrl: req.file.path
    });

    await application.save();
    
    console.log('Application saved successfully');
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(201).json({ 
      message: 'Application submitted successfully',
      applicationId: application._id
    });
  } catch (error) {
    console.error('Error submitting job application:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get all job applications (admin only)
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const jobId = req.query.jobId;

    let query = {};
    if (status) query.status = status;
    if (jobId) query.jobId = jobId;

    const applications = await JobApplication.find(query)
      .populate('jobId', 'title type location')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await JobApplication.countDocuments(query);

    res.json({
      applications,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching job applications:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific job application (admin only)
router.get('/:id', auth, async (req, res) => {
  try {
    const application = await JobApplication.findById(req.params.id)
      .populate('jobId', 'title type location description');
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json(application);
  } catch (error) {
    console.error('Error fetching job application:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update application status (admin only)
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const application = await JobApplication.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json({ message: 'Status updated successfully', application });
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add notes to application (admin only)
router.patch('/:id/notes', auth, async (req, res) => {
  try {
    const { notes } = req.body;

    const application = await JobApplication.findByIdAndUpdate(
      req.params.id,
      { notes },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json({ message: 'Notes updated successfully', application });
  } catch (error) {
    console.error('Error updating application notes:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete application (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const application = await JobApplication.findByIdAndDelete(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    console.error('Error deleting application:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Download resume (admin only)
router.get('/:id/resume', auth, async (req, res) => {
  try {
    const application = await JobApplication.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Use the absolute path directly since resumeUrl is already absolute
    const filePath = application.resumeUrl;
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error('Resume file not found at:', filePath);
      return res.status(404).json({ message: 'Resume file not found' });
    }

    res.download(filePath);
  } catch (error) {
    console.error('Error downloading resume:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// View resume in browser (admin only)
router.get('/:id/resume/view', async (req, res) => {
  // Check token from query parameter or header
  const token = req.query.token || req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  // Verify token
  try {
    const jwt = require('jsonwebtoken');
    jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
  try {
    const application = await JobApplication.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Use the absolute path directly since resumeUrl is already absolute
    const filePath = application.resumeUrl;
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error('Resume file not found at:', filePath);
      return res.status(404).json({ message: 'Resume file not found' });
    }

    // Set headers for PDF viewing
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="resume.pdf"');
    
    // Send file
    res.sendFile(path.resolve(filePath));
  } catch (error) {
    console.error('Error viewing resume:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
