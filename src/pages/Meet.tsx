import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BookMeeting() {
  const [showPopup, setShowPopup] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
    preferredDate: '',
    preferredTime: ''
  });

  useEffect(() => {
    const meetingStatus = sessionStorage.getItem('meetingBooked');
    if (meetingStatus) {
      setIsBooked(true);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:5000/api/meetings/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        sessionStorage.setItem('meetingBooked', 'true');
        setIsBooked(true);
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          window.location.href = '/';
        }, 2000);
      } else {
        const error = await response.json();
        alert('Error booking meeting: ' + (error.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error booking meeting:', error);
      alert('Error booking meeting. Please try again.');
    } finally {
      setIsSubmitting(false);
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
                  <input 
                    type="text" 
                    name="name"
                    placeholder="Your Name" 
                    value={formData.name}
                    onChange={handleInputChange}
                    required 
                    className="w-full px-4 py-3 bg-transparent border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-purple-500 outline-none shadow-lg" 
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Your Email</label>
                  <input 
                    type="email" 
                    name="email"
                    placeholder="Your Email" 
                    value={formData.email}
                    onChange={handleInputChange}
                    required 
                    className="w-full px-4 py-3 bg-transparent border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-purple-500 outline-none shadow-lg" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-medium mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    name="phone"
                    placeholder="Your Phone Number" 
                    value={formData.phone}
                    onChange={handleInputChange}
                    required 
                    className="w-full px-4 py-3 bg-transparent border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-purple-500 outline-none shadow-lg" 
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Company</label>
                  <input 
                    type="text" 
                    name="company"
                    placeholder="Your Company" 
                    value={formData.company}
                    onChange={handleInputChange}
                    required 
                    className="w-full px-4 py-3 bg-transparent border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-purple-500 outline-none shadow-lg" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Message</label>
                <textarea 
                  name="message"
                  placeholder="Tell us about your project or requirements" 
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  required 
                  className="w-full px-4 py-3 bg-transparent border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-purple-500 outline-none shadow-lg resize-none" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-medium mb-2">Preferred Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-white" />
                    <input 
                      type="date" 
                      name="preferredDate"
                      value={formData.preferredDate}
                      onChange={handleInputChange}
                      required 
                      className="w-full pl-12 py-3 bg-transparent border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-purple-500 outline-none shadow-lg cursor-pointer" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Preferred Time</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-white" />
                    <select 
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleInputChange}
                      required 
                      className="w-full pl-12 py-3 bg-slate-950 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-purple-500 outline-none shadow-lg"
                    >
                      <option value="">Select Time</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="1:00 PM">1:00 PM</option>
                      <option value="4:00 PM">4:00 PM</option>
                      <option value="6:00 PM">6:00 PM</option>
                      <option value="8:00 PM">8:00 PM</option>
                    </select>
                  </div>
                </div>
              </div>

              <motion.button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-4 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-700 transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? 'Scheduling...' : 'Schedule Meeting'}
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