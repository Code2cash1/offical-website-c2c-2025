import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BookMeeting() {
  const [showPopup, setShowPopup] = useState(false);
  const [isBooked, setIsBooked] = useState(false);

  useEffect(() => {
    const meetingStatus = sessionStorage.getItem('meetingBooked');
    if (meetingStatus) {
      setIsBooked(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      sessionStorage.setItem('meetingBooked', 'true');
      setIsBooked(true);
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        window.location.href = '/';
      }, 2000);
    } catch (error) {
      console.error('Error booking meeting:', error);
    }
  };

  return (
    <motion.div 
      className="py-24 relative"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
    >
      <div className="container mx-auto px-4">
        <motion.div 
          className="max-w-3xl mx-auto bg-slate-950 rounded-2xl p-8 shadow-2xl hover:shadow-xl hover:shadow-white/50 duration-300"
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
        >
          <motion.h2 
            className="text-4xl font-bold text-white text-center mb-8"
            initial={{ y: -20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >Book a Meeting</motion.h2>
          
          {isBooked ? (
            <motion.div 
              className="text-center text-white"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-4" />
              <h3 className="text-xl font-semibold">Your request has been sent!</h3>
              <p className="text-gray-400">We'll connect with you soon. Thank you!</p>
            </motion.div>
          ) : (
            <motion.form 
              className="space-y-6" 
              onSubmit={handleSubmit}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.7 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-medium mb-2">Your Name</label>
                  <input type="text" placeholder="Your Name" required className="w-full px-4 py-3 bg-transparent border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-purple-500 outline-none shadow-lg" />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Your Email</label>
                  <input type="email" placeholder="Your Email" required className="w-full px-4 py-3 bg-transparent border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-purple-500 outline-none shadow-lg" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-medium mb-2">Meeting Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-white" />
                    <input type="date" required className="w-full pl-12 py-3 bg-transparent border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-purple-500 outline-none shadow-lg cursor-pointer" />
                  </div>
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Meeting Time</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-white" />
                    <select required className="w-full pl-12 py-3 bg-slate-950 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-purple-500 outline-none shadow-lg">
                      <option value="">Select Time</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="14:00">1:00 PM</option>
                      <option value="16:00">4:00 PM</option>
                      <option value="18:00">6:00 PM</option>
                      <option value="20:00">8:00 PM</option>
                    </select>
                  </div>
                </div>
              </div>

              <motion.button 
                type="submit" 
                className="w-full py-4 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-700 transform hover:-translate-y-1 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Schedule Meeting
              </motion.button>
            </motion.form>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {showPopup && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          >
            <motion.div className="bg-white p-8 rounded-lg shadow-lg text-center" initial={{ y: -50 }} animate={{ y: 0 }}>
              <CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-4" />
              <h3 className="text-xl font-semibold">Your request has been sent!</h3>
              <p className="text-gray-600">We'll connect with you soon.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}