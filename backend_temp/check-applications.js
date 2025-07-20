const mongoose = require('mongoose');
const JobApplication = require('./models/JobApplication');
const Job = require('./models/Job');
const dotenv = require('dotenv');

dotenv.config();

async function checkApplications() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get all job applications
    const applications = await JobApplication.find().populate('jobId', 'title');
    console.log(`Found ${applications.length} job applications:`);
    
    applications.forEach((app, index) => {
      console.log(`\n${index + 1}. Application ID: ${app._id}`);
      console.log(`   Job: ${app.jobTitle}`);
      console.log(`   Applicant: ${app.fullName}`);
      console.log(`   Email: ${app.email}`);
      console.log(`   Status: ${app.status}`);
      console.log(`   Resume URL: ${app.resumeUrl}`);
      console.log(`   Applied: ${app.createdAt}`);
    });

    mongoose.connection.close();
  } catch (error) {
    console.error('Error checking applications:', error);
    mongoose.connection.close();
  }
}

checkApplications();