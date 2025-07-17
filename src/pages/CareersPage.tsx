import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {  ChevronRight, MapPin,  Clock, Upload, CheckCircle } from "lucide-react";
import Modal from "react-modal";
import { useDropzone } from "react-dropzone";

Modal.setAppElement("#root");

// Will be fetched from API

export default function CareersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [appliedJobs, setAppliedJobs] = useState(new Set(JSON.parse(sessionStorage.getItem("appliedJobs") || "[]")));
  const [currentPosition, setCurrentPosition] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: ""
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/jobs/active');
      if (response.ok) {
        const data = await response.json();
        setPositions(data);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setResumeFile(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false
  });

  const handleApplyNowClick = (jobTitle: string) => {
    if (!appliedJobs.has(jobTitle)) {
      setCurrentPosition(jobTitle);
      setIsModalOpen(true);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setFormData({ name: "", phone: "", email: "" });
    setResumeFile(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('email', formData.email);
      submitData.append('phone', formData.phone);
      submitData.append('position', currentPosition);
      submitData.append('experience', 'Entry Level'); // Default for now
      if (resumeFile) {
        submitData.append('resume', resumeFile);
      }

      const response = await fetch('http://localhost:5000/api/careers/apply', {
        method: 'POST',
        body: submitData,
      });

      if (response.ok) {
        const updatedJobs = new Set(appliedJobs);
        updatedJobs.add(currentPosition);
        setAppliedJobs(updatedJobs);
        sessionStorage.setItem("appliedJobs", JSON.stringify([...updatedJobs]));
        setIsModalOpen(false);
        setIsSuccessPopupOpen(true);
        setTimeout(() => setIsSuccessPopupOpen(false), 3000);
        setFormData({ name: "", phone: "", email: "" });
        setResumeFile(null);
      } else {
        const error = await response.json();
        alert('Error submitting application: ' + (error.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Error submitting application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-32 pb-24 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-32 pb-24 text-white ">
      <div className="container mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }} 
          className="text-4xl font-bold text-center mb-6"
        >
          Join Our Team
        </motion.h2>

        {positions.length === 0 ? (
          <div className="text-center text-gray-400 mt-12">
            <p className="text-xl">No job openings available at the moment.</p>
            <p className="text-sm mt-2">Please check back later for new opportunities.</p>
          </div>
        ) : (
          <div className="grid gap-6 max-w-4xl mx-auto  " >
          {positions.map((position: any, index) => (
            <motion.div 
            key={position._id} 
            initial={{ opacity: 0, x: -50 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.8, delay: index * 0.07 }} 
            whileHover={{
              scale: 1.01,
              boxShadow: '0 4px 15px ', // Softer shadow
              backgroundColor: 'transparent', // Subtle background shift
              borderColor: 'rgba(255, 255, 255, 0.2)', 
            }}
            className="group relative bg-transparent  rounded-xl p-8 border hover:shadow-xl hover:bg-transparent border-white/10 transition-all duration-200 "
          >
        
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-semibold mb-4">{position.title}</h3>
                  <div className="flex flex-wrap gap-4 text-gray-400">
                    <div className="flex items-center gap-2"><Clock className="w-4 h-4" /><span>{position.type}</span></div>
                    <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /><span>{position.location}</span></div>
                    {position.experience && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{position.experience}</span>
                      </div>
                    )}
                    {position.salary && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{position.salary}</span>
                      </div>
                    )}
                  </div>
                  {position.description && (
                    <p className="text-gray-300 mt-2 text-sm">{position.description.substring(0, 150)}...</p>
                  )}
                </div>
                <button 
                  onClick={() => handleApplyNowClick(position.title)} 
                  className={`px-6 py-3 rounded-full transition-colors duration-300 flex items-center gap-2 ${appliedJobs.has(position.title) ? "bg-green-500 text-white" : "bg-purple-500 text-white hover:bg-purple-600"}`}
                >
                  {appliedJobs.has(position.title) ? "Applied" : "Apply Now"} {appliedJobs.has(position.title) ? <CheckCircle className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        )}

        <Modal 
          isOpen={isModalOpen} 
          onRequestClose={handleModalClose} 
          className="bg-white/5 backdrop-blur-lg rounded-xl p-8 max-w-md mx-auto shadow-2xl transform scale-95 transition-all duration-300"
          overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-transparent hover:shadow-[0_0_25px_rgba(255,255,255,0.5)] transition-shadow duration-300 rounded-xl p-8 shadow-lg"
          >
            <motion.h3
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-semibold text-center mb-6 text-white"
            >
              Apply Now
            </motion.h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                type="text" 
                name="name"
                placeholder="Name" 
                value={formData.name}
                onChange={handleInputChange}
                className="bg-white/10 rounded-2xl px-4 py-3 text-white w-full placeholder:text-gray-400" 
                required 
              />
              <input 
                type="email" 
                name="email"
                placeholder="Email" 
                value={formData.email}
                onChange={handleInputChange}
                className="bg-white/10 rounded-2xl px-4 py-3 text-white w-full placeholder:text-gray-400" 
                required 
              />
              <input 
                type="tel" 
                name="phone"
                placeholder="Phone Number" 
                value={formData.phone}
                onChange={handleInputChange}
                className="bg-white/10 rounded-2xl px-4 py-3 text-white w-full placeholder:text-gray-400" 
                required 
              />
              <div {...getRootProps()} className="border border-dashed border-gray-400 rounded-lg p-4 text-center cursor-pointer bg-white/10 hover:bg-white/20 transition-colors duration-300">
                <input {...getInputProps()} />
                {resumeFile ? <p className="text-white">{resumeFile.name}</p> : <p className="text-gray-400"><Upload className="inline w-6 h-6" /> Drag & drop your resume or click to upload</p>}
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-purple-500 text-white rounded-2xl px-6 py-3 font-medium hover:bg-purple-700 duration-500 w-full disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </motion.div>
        </Modal>

        {isSuccessPopupOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed inset-0 flex items-center justify-center bg-black/50">
            <div className="bg-green-500 text-white p-4 rounded-lg shadow-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5" /> Your application has been sent! We'll connect soon.
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );}
