import React from 'react';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black pt-32 pb-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative perspective-1000">
              <motion.div
                initial={{ rotateY: 45 }}
                animate={{ rotateY: 0 }}
                transition={{ duration: 1 }}
                className="relative z-10"
              >
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                  alt="Team collaboration"
                  className="rounded-lg shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-pink-500/20 rounded-lg" />
              </motion.div>
              <div className="absolute inset-0 transform translate-x-4 translate-y-4 bg-purple-500/20 rounded-lg blur-lg" />
            </div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-4xl font-bold text-white mb-6">About Us</h2>
              <p className="text-gray-300 text-lg mb-6">
                At Code2Cash, we transform innovative ideas into powerful digital solutions. 
                Our team of expert developers, designers, and strategists work together to 
                create exceptional digital experiences that drive business growth.
              </p>
              <p className="text-gray-300 text-lg">
                With years of industry experience and a passion for technology, we help 
                businesses navigate the digital landscape and achieve their goals through 
                cutting-edge solutions and strategic thinking.
              </p>
            </motion.div>
          </div>
        </motion.div>
       
      </div>
      
    </div>
  );
 
}
<Footer/>