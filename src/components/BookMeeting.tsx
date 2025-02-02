import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BookMeeting() {
  const [showPopup, setShowPopup] = useState(false);
  const [isBooked, setIsBooked] = useState(false);

  useEffect(() => {
    // Check session storage to see if the meeting is already booked
    const meetingStatus = sessionStorage.getItem('meetingBooked');
    if (meetingStatus) {
      setIsBooked(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Set meeting as booked in session storage
    sessionStorage.setItem('meetingBooked', 'true');
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
      window.location.href = '/'; // Redirect to home after 2 seconds
    }, 2000);
  };

  return (
    <div id='contact' className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-slate-950 rounded-2xl p-8 shadow-2xl hover:shadow-xl hover:shadow-white/50 duration-300">
          <h2 className="text-4xl font-bold text-white text-center mb-8">Book a Meeting</h2>
          
          {isBooked ? (
            <div className="text-center text-white">
              <CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-4" />
              <h3 className="text-xl font-semibold">Your request has been sent!</h3>
              <p className="text-gray-600">We'll connect with you soon. Thank you!</p>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-medium mb-2">Your Name</label>
                  <input type="text" placeholder="Your Name" required className="w-full px-4 py-3 bg-transparent text-white rounded-lg focus:ring-2 outline-none shadow-lg" />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Your Email</label>
                  <input type="email" placeholder="Your Email" required className="w-full px-4 py-3 bg-transparent text-white rounded-lg focus:ring-2 outline-none shadow-lg" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-medium mb-2">Meeting Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-white" />
                    <input type="date" required className="w-full pl-12 py-3 bg-transparent text-white rounded-lg focus:ring-2 outline-none shadow-lg cursor-pointer" />
                  </div>
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Meeting Time</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-white" />
                    <select required className="w-full pl-12 py-3 bg-slate-950 text-white rounded-lg focus:ring-2 outline-none shadow-lg">
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

              <button type="submit" className="w-full py-4 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-700 transform hover:-translate-y-1 transition-all duration-300">
                Schedule Meeting
              </button>
            </form>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showPopup && !isBooked && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          >
            <motion.div className="bg-white p-8 rounded-lg shadow-lg text-center" initial={{ y: -50 }} animate={{ y: 0 }}>
              <CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-4" />
              <h3 className="text-xl font-semibold">Your request has been sent!</h3>
              <p className="text-gray-600">We'll connect with you soon.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
