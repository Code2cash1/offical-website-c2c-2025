const mongoose = require('mongoose');
const Job = require('./models/Job');
const Admin = require('./models/Admin');
const dotenv = require('dotenv');

dotenv.config();

// Sample job data
const sampleJobs = [
  {
    title: "Frontend Developer Intern",
    type: "Part-time",
    location: "Remote",
    description: "We are looking for a passionate Frontend Developer Intern to join our team and help build amazing user interfaces using React, TypeScript, and modern web technologies.",
    requirements: [
      "Knowledge of React and TypeScript",
      "Understanding of HTML, CSS, and JavaScript",
      "Familiarity with Git and version control",
      "Good communication skills",
      "Eager to learn and grow"
    ],
    experience: "Entry Level",
    salary: "₹15,000 - ₹25,000",
    isActive: true
  },
  {
    title: "UI/UX Designer",
    type: "Part-time",
    location: "Remote",
    description: "Join our design team to create intuitive and beautiful user experiences. You'll work on web and mobile applications, creating wireframes, prototypes, and high-fidelity designs.",
    requirements: [
      "Proficiency in Figma or Adobe Creative Suite",
      "Understanding of user-centered design principles",
      "Experience with wireframing and prototyping",
      "Knowledge of responsive design",
      "Portfolio showcasing design projects"
    ],
    experience: "1-2 years",
    salary: "₹20,000 - ₹35,000",
    isActive: true
  },
  {
    title: "Backend Developer",
    type: "Part-time",
    location: "Remote",
    description: "We're seeking a skilled Backend Developer to build and maintain server-side applications using Node.js, Express, and MongoDB. You'll work on APIs, database design, and system architecture.",
    requirements: [
      "Strong experience with Node.js and Express",
      "Knowledge of MongoDB and database design",
      "Understanding of RESTful APIs",
      "Experience with authentication and authorization",
      "Familiarity with cloud platforms (AWS, Azure, or GCP)"
    ],
    experience: "2-3 years",
    salary: "₹25,000 - ₹40,000",
    isActive: true
  },
  {
    title: "MERN Stack Developer Intern",
    type: "Full-time",
    location: "Remote",
    description: "Perfect opportunity for freshers to learn and grow in full-stack development. You'll work with MongoDB, Express.js, React, and Node.js to build complete web applications.",
    requirements: [
      "Basic knowledge of JavaScript and React",
      "Understanding of Node.js and Express",
      "Familiarity with MongoDB",
      "Good problem-solving skills",
      "Commitment to learning and growth"
    ],
    experience: "Fresher",
    salary: "₹12,000 - ₹20,000",
    isActive: true
  }
];

async function seedJobs() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find admin user
    const admin = await Admin.findOne({ username: 'admin' });
    if (!admin) {
      console.log('Admin user not found. Please create admin user first.');
      return;
    }

    // Clear existing jobs
    await Job.deleteMany({});
    console.log('Cleared existing jobs');

    // Add admin ID to jobs
    const jobsWithAdmin = sampleJobs.map(job => ({
      ...job,
      postedBy: admin._id
    }));

    // Insert sample jobs
    await Job.insertMany(jobsWithAdmin);
    console.log('Sample jobs inserted successfully');

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding jobs:', error);
    mongoose.connection.close();
  }
}

seedJobs();
