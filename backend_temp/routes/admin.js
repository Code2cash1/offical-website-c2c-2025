const express = require('express');
const JobApplication = require('../models/JobApplication');
const Job = require('../models/Job');
const Meeting = require('../models/Meeting');
const Contact = require('../models/Contact');
const auth = require('../middleware/auth');

const router = express.Router();

// Get dashboard overview (admin only)
router.get('/dashboard', auth, async (req, res) => {
  try {
    // Job Application statistics
    const careerStats = {
      total: await JobApplication.countDocuments(),
      pending: await JobApplication.countDocuments({ status: 'pending' }),
      reviewed: await JobApplication.countDocuments({ status: 'reviewed' }),
      shortlisted: await JobApplication.countDocuments({ status: 'shortlisted' }),
      hired: await JobApplication.countDocuments({ status: 'hired' }),
      rejected: await JobApplication.countDocuments({ status: 'rejected' })
    };

    // Job statistics
    const jobStats = {
      total: await Job.countDocuments(),
      active: await Job.countDocuments({ isActive: true }),
      inactive: await Job.countDocuments({ isActive: false })
    };

    // Meeting statistics
    const meetingStats = {
      total: await Meeting.countDocuments(),
      pending: await Meeting.countDocuments({ status: 'pending' }),
      approved: await Meeting.countDocuments({ status: 'approved' }),
      rejected: await Meeting.countDocuments({ status: 'rejected' }),
      completed: await Meeting.countDocuments({ status: 'completed' })
    };

    // Contact statistics
    const contactStats = {
      total: await Contact.countDocuments(),
      unread: await Contact.countDocuments({ status: 'unread' }),
      read: await Contact.countDocuments({ status: 'read' }),
      replied: await Contact.countDocuments({ status: 'replied' }),
      highPriority: await Contact.countDocuments({ priority: 'high' })
    };

    // Recent activities
    const recentApplications = await JobApplication.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('jobId', 'title')
      .select('fullName email jobTitle status createdAt');

    const recentMeetings = await Meeting.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email company status preferredDate createdAt');

    const recentMessages = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email subject status priority createdAt');

    res.json({
      stats: {
        careers: careerStats,
        jobs: jobStats,
        meetings: meetingStats,
        contacts: contactStats
      },
      recentActivities: {
        applications: recentApplications,
        meetings: recentMeetings,
        messages: recentMessages
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
