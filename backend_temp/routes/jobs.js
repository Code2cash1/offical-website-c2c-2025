const express = require('express');
const Job = require('../models/Job');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all active jobs (public)
router.get('/active', async (req, res) => {
  try {
    const jobs = await Job.find({ isActive: true })
      .sort({ createdAt: -1 });
    
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all jobs (admin only)
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder || 'desc';

    const jobs = await Job.find()
      .populate('postedBy', 'username fullName')
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Job.countDocuments();

    res.json({
      jobs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new job (admin only)
router.post('/', auth, async (req, res) => {
  try {
    const { title, type, location, description, requirements, salary, experience } = req.body;
    
    const job = new Job({
      title,
      type,
      location,
      description,
      requirements,
      salary,
      experience,
      postedBy: req.admin.id
    });

    await job.save();
    
    const populatedJob = await Job.findById(job._id).populate('postedBy', 'username fullName');
    
    res.status(201).json({ message: 'Job created successfully', job: populatedJob });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update job (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, type, location, description, requirements, salary, experience, isActive } = req.body;
    
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    job.title = title || job.title;
    job.type = type || job.type;
    job.location = location || job.location;
    job.description = description || job.description;
    job.requirements = requirements || job.requirements;
    job.salary = salary || job.salary;
    job.experience = experience || job.experience;
    job.isActive = isActive !== undefined ? isActive : job.isActive;

    await job.save();
    
    const populatedJob = await Job.findById(job._id).populate('postedBy', 'username fullName');
    
    res.json({ message: 'Job updated successfully', job: populatedJob });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete job (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get job statistics (admin only)
router.get('/stats', auth, async (req, res) => {
  try {
    const total = await Job.countDocuments();
    const active = await Job.countDocuments({ isActive: true });
    const inactive = await Job.countDocuments({ isActive: false });
    
    const byType = await Job.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    res.json({
      total,
      active,
      inactive,
      byType
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
