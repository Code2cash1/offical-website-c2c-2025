const express = require('express');
const Career = require('../models/Career');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Submit career application
router.post('/apply', upload.single('resume'), async (req, res) => {
  try {
    const { name, email, phone, position, experience } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'Resume PDF is required' });
    }

    const career = new Career({
      name,
      email,
      phone,
      position,
      experience,
      resumeUrl: req.file.path,
      resumeOriginalName: req.file.originalname
    });

    await career.save();
    res.status(201).json({ message: 'Application submitted successfully', career });
  } catch (error) {
    if (error.code === 11000) {
      if (error.keyPattern.email) {
        return res.status(400).json({ message: 'Application already exists for this email address' });
      }
      if (error.keyPattern.phone) {
        return res.status(400).json({ message: 'Application already exists for this phone number' });
      }
      return res.status(400).json({ message: 'Application already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all applications (admin only)
router.get('/applications', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder || 'desc';

    const query = {};
    if (status) query.status = status;

    const applications = await Career.find(query)
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Career.countDocuments(query);

    res.json({
      applications,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get application by ID (admin only)
router.get('/application/:id', auth, async (req, res) => {
  try {
    const application = await Career.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update application status (admin only)
router.patch('/application/:id/status', auth, async (req, res) => {
  try {
    const { status, notes } = req.body;
    const application = await Career.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = status;
    if (notes) application.notes = notes;
    await application.save();

    res.json({ message: 'Application status updated', application });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete application (admin only)
router.delete('/application/:id', auth, async (req, res) => {
  try {
    const application = await Career.findByIdAndDelete(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get application statistics (admin only)
router.get('/stats', auth, async (req, res) => {
  try {
    const total = await Career.countDocuments();
    const pending = await Career.countDocuments({ status: 'pending' });
    const reviewed = await Career.countDocuments({ status: 'reviewed' });
    const shortlisted = await Career.countDocuments({ status: 'shortlisted' });
    const rejected = await Career.countDocuments({ status: 'rejected' });
    const hired = await Career.countDocuments({ status: 'hired' });

    res.json({
      total,
      pending,
      reviewed,
      shortlisted,
      rejected,
      hired
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
