const express = require('express');
const Meeting = require('../models/Meeting');
const auth = require('../middleware/auth');

const router = express.Router();

// Submit meeting request
router.post('/request', async (req, res) => {
  try {
    const { name, email, phone, company, message, preferredDate, preferredTime } = req.body;
    
    const meeting = new Meeting({
      name,
      email,
      phone,
      company,
      message,
      preferredDate,
      preferredTime
    });

    await meeting.save();
    res.status(201).json({ message: 'Meeting request submitted successfully', meeting });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all meeting requests (admin only)
router.get('/requests', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder || 'desc';

    const query = {};
    if (status) query.status = status;

    const meetings = await Meeting.find(query)
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Meeting.countDocuments(query);

    res.json({
      meetings,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get meeting by ID (admin only)
router.get('/request/:id', auth, async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) {
      return res.status(404).json({ message: 'Meeting request not found' });
    }
    res.json(meeting);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update meeting status (admin only)
router.patch('/request/:id/status', auth, async (req, res) => {
  try {
    const { status, adminNotes, scheduledDate, scheduledTime } = req.body;
    const meeting = await Meeting.findById(req.params.id);
    
    if (!meeting) {
      return res.status(404).json({ message: 'Meeting request not found' });
    }

    meeting.status = status;
    if (adminNotes) meeting.adminNotes = adminNotes;
    if (scheduledDate) meeting.scheduledDate = scheduledDate;
    if (scheduledTime) meeting.scheduledTime = scheduledTime;
    
    await meeting.save();

    res.json({ message: 'Meeting status updated', meeting });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete meeting request (admin only)
router.delete('/request/:id', auth, async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndDelete(req.params.id);
    if (!meeting) {
      return res.status(404).json({ message: 'Meeting request not found' });
    }
    res.json({ message: 'Meeting request deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get meeting statistics (admin only)
router.get('/stats', auth, async (req, res) => {
  try {
    const total = await Meeting.countDocuments();
    const pending = await Meeting.countDocuments({ status: 'pending' });
    const approved = await Meeting.countDocuments({ status: 'approved' });
    const rejected = await Meeting.countDocuments({ status: 'rejected' });
    const completed = await Meeting.countDocuments({ status: 'completed' });

    res.json({
      total,
      pending,
      approved,
      rejected,
      completed
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
