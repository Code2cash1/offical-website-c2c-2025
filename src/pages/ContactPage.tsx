import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

export default function ContactPage() {
  const [messageSent, setMessageSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/contacts/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessageSent(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        const error = await response.json();
        alert('Error sending message: ' + (error.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Error sending message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen bg-black pt-32 pb-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Get in Touch</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Let's discuss how we can help transform your business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Email</h3>
                  <p className="text-gray-400">code2cash1@gmail.com</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center">
                  <Phone className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Phone</h3>
                  <p className="text-gray-400">+91 7061838495</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Address</h3>
                  <p className="text-gray-400">Kankarbagh, Patna, India</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border hover:bg-transparent border-white/10 hover:shadow-xl hover:shadow-white/50"
            >
              {messageSent ? (
                <div className="text-center">
                  <h3 className="text-xl text-white font-semibold">Your message has been sent!</h3>
                  <p className="text-gray-400">We will get back to you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 h">
                  <div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white/5 rounded-lg border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 hover:shadow-xl "
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white/5 rounded-lg border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 hover:shadow-xl "
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="subject"
                      placeholder="Subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white/5 rounded-lg border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 hover:shadow-xl "
                    />
                  </div>
                  <div>
                    <textarea
                      rows={4}
                      name="message"
                      placeholder="Your Message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white/5 rounded-lg border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 hover:shadow-xl "
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-8 py-4 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
