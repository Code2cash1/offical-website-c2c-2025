import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
export default function About() {
  const controls = useAnimation();
  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) {
      controls.start({
        y: 0,
        opacity: 1,
        transition: {
          duration: 0.6,
          ease: 'easeOut'
        }
      });
    } else {
      controls.start({
        y: 50,
        opacity: 0
      });
    }
  }, [controls, inView]);

  return (
    <div id='about' className="py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            className="relative"
            ref={ref}
            initial={{ y: 50, opacity: 0 }}
            animate={controls}
          >
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
              alt="Team collaboration"
              className="rounded-lg shadow-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-lg" />
          </motion.div>
          
          <motion.div
            ref={ref}
            initial={{ y: 50, opacity: 0 }}
            animate={controls}
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
      </div>
    </div>
  );
}