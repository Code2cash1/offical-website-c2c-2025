import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Briefcase, ChevronRight, MapPin, DollarSign, Clock, Upload, CheckCircle } from "lucide-react";
import Modal from "react-modal";
import { useDropzone } from "react-dropzone";

Modal.setAppElement("#root");

const positions = [
  { title: "Senior Frontend Developer", type: "Full-time", location: "Remote", salary: "$80k - $120k", experience: "5+ years" },
  { title: "UI/UX Designer", type: "Full-time", location: "Hybrid", salary: "$70k - $100k", experience: "3+ years" },
  { title: "DevOps Engineer", type: "Full-time", location: "Remote", salary: "$90k - $130k", experience: "4+ years" },
  { title: "Project Manager", type: "Full-time", location: "On-site", salary: "$85k - $125k", experience: "6+ years" }
];

const CareersComponent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [appliedJobs, setAppliedJobs] = useState(new Set(JSON.parse(sessionStorage.getItem("appliedJobs") || "[]")));

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
      setIsModalOpen(true);
    }
  };

  const handleModalClose = () => setIsModalOpen(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>, jobTitle: string) => {
    event.preventDefault();
    const updatedJobs = new Set(appliedJobs);
    updatedJobs.add(jobTitle);
    setAppliedJobs(updatedJobs);
    sessionStorage.setItem("appliedJobs", JSON.stringify([...updatedJobs]));
    setIsModalOpen(false);
    setIsSuccessPopupOpen(true);
    setTimeout(() => setIsSuccessPopupOpen(false), 3000);
  };

  return (
    <div id="careers" className="min-h-screen bg-black pt-32 pb-24 text-white">
      <div className="container mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }} 
          className="text-4xl font-bold text-center mb-6"
        >
          Join Our Team
        </motion.h2>

        <div className="grid gap-6 max-w-4xl mx-auto">
          {positions.map((position, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, x: -50 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.8, delay: index * 0.1 }} 
              whileHover={{ scale: 1.02, boxShadow: '0 0 25px rgba(255,255,255,0.5)' }}
              className="group relative bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-white/10 shadow-xl hover:bg-transparent cursor-pointer"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-semibold mb-4">{position.title}</h3>
                  <div className="flex flex-wrap gap-4 text-gray-400">
                    <div className="flex items-center gap-2"><Clock className="w-4 h-4" /><span>{position.type}</span></div>
                    <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /><span>{position.location}</span></div>
                    <div className="flex items-center gap-2"><DollarSign className="w-4 h-4" /><span>{position.salary}</span></div>
                    <div className="flex items-center gap-2"><Briefcase className="w-4 h-4" /><span>{position.experience}</span></div>
                  </div>
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
            className="bg-transparent hover:shadow-xl hover:shadow-white/50 transition-shadow duration-300 rounded-xl p-8 shadow-lg"
          >
            <motion.h3
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-semibold text-center mb-6 text-white"
            >
              Apply Now
            </motion.h3>
            <form onSubmit={(e) => handleSubmit(e, positions.find(p => !appliedJobs.has(p.title))?.title || "")} className="space-y-4">
              <input type="text" placeholder="Name" className="bg-white/10 rounded-2xl px-4 py-3 text-white w-full placeholder:text-gray-400" required />
              <input type="tel" placeholder="Phone Number" className="bg-white/10 rounded-2xl px-4 py-3 text-white w-full placeholder:text-gray-400" required />
              <div {...getRootProps()} className="border border-dashed border-gray-400 rounded-lg p-4 text-center cursor-pointer bg-white/10 hover:bg-white/20 transition-colors duration-300">
                <input {...getInputProps()} />
                {resumeFile ? <p className="text-white">{resumeFile.name}</p> : <p className="text-gray-400"><Upload className="inline w-6 h-6" /> Drag & drop your resume or click to upload</p>}
              </div>
              <button type="submit" className="bg-purple-500 text-white rounded-2xl px-6 py-3 font-medium hover:bg-purple-700 duration-500 w-full">Submit Application</button>
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
  );
};

export default CareersComponent;
