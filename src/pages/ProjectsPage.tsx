import React from 'react';
import { motion } from 'framer-motion';

const projects = [
  {
    title: 'E-Commerce Platform',
    description: 'A modern e-commerce solution with real-time inventory management',
    image: 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80&w=1000',
    category: 'Web Development'
  },
  {
    title: 'Mobile Banking App',
    description: 'Secure and intuitive mobile banking application',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1000',
    category: 'Mobile Development'
  },
  {
    title: 'AI Analytics Dashboard',
    description: 'Real-time analytics platform powered by artificial intelligence',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000',
    category: 'Data Analytics'
  },
  {
    title: 'Smart Home System',
    description: 'IoT-based home automation system with voice control',
    image: 'https://www.enableds.com/wp-content/uploads/2020/03/PWAs-for-2020.png',
    category: 'IoT'
  }
];

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-black pt-32 pb-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-white mb-6">Our Projects</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Discover our portfolio of innovative solutions that drive business growth
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="group relative h-[400px] overflow-hidden rounded-2xl hover:shadow-xl hover:shadow-white/50"
            >
              <div className="absolute inset- ">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              <div className="absolute inset-0 p-8 flex flex-col justify-end transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:shadow-xl hover:shadow-white/50">
                  <span className="text-sm font-medium text-purple-400">{project.category}</span>
                  <h3 className="text-2xl font-bold text-white mt-2 mb-4">{project.title}</h3>
                  <p className="text-gray-300">{project.description}</p>
                  <button className="mt-6 px-6 py-2 bg-white/10 backdrop-blur-lg rounded-full text-white font-medium
                                   hover:bg-purple-700 transition-colors duration-300 ">
                    View Project
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}