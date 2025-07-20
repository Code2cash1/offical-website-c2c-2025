const FormData = require('form-data');
const fs = require('fs');
const https = require('https');
const http = require('http');

async function testJobApplication() {
  try {
    // Create a test file
    const testFile = Buffer.from('This is a test resume file');
    fs.writeFileSync('test-resume.pdf', testFile);

    // Get a job ID first
    const jobsResponse = await fetch('http://localhost:5000/api/jobs/active');
    const jobs = await jobsResponse.json();
    
    if (jobs.length === 0) {
      console.log('No jobs available');
      return;
    }

    const jobId = jobs[0]._id;
    console.log('Using job ID:', jobId);

    // Create form data
    const form = new FormData();
    form.append('jobId', jobId);
    form.append('fullName', 'Test User');
    form.append('email', 'test@example.com');
    form.append('phone', '1234567890');
    form.append('experience', '1-3');
    form.append('coverLetter', 'This is a test cover letter');
    form.append('resume', fs.createReadStream('test-resume.pdf'), {
      filename: 'test-resume.pdf',
      contentType: 'application/pdf'
    });

    // Submit application
    const response = await fetch('http://localhost:5000/api/job-applications/apply', {
      method: 'POST',
      body: form,
      headers: form.getHeaders()
    });

    const result = await response.text();
    console.log('Response status:', response.status);
    console.log('Response:', result);

    // Clean up
    fs.unlinkSync('test-resume.pdf');

  } catch (error) {
    console.error('Test failed:', error);
  }
}

testJobApplication();