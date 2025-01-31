import React from 'react';
import { motion } from 'framer-motion';
import { Code, Palette, Globe, Database, FileCode, Cloud, Cpu, Shield } from 'lucide-react';

const services = [
  {
    icon: <Code className="w-8 h-8" />,
    title: "Custom Development",
    description: "Tailored software solutions built with cutting-edge technologies"
  },
  {
    icon: <Palette className="w-8 h-8" />,
    title: "UI/UX Design",
    description: "Beautiful and intuitive interfaces that users love"
  },
  {
    icon: <Globe className="w-8 h-8" />,
    title: "Web Development",
    description: "Responsive and scalable web applications"
  },
  {
    icon: <FileCode className="w-8 h-8" />,
    title: "Mobile Development",
    description: "Native and cross-platform mobile applications"
  },
  {
    icon: <Database className="w-8 h-8" />,
    title: "Database Solutions",
    description: "Efficient and secure data management systems"
  },
  {
    icon: <Cloud className="w-8 h-8" />,
    title: "Cloud Services",
    description: "Scalable cloud infrastructure and deployment"
  },
  {
    icon: <Cpu className="w-8 h-8" />,
    title: "AI & Machine Learning",
    description: "Intelligent solutions powered by advanced algorithms"
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Cybersecurity",
    description: "Robust security measures to protect your digital assets"
  }
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-black pt-32 pb-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-6">Our Services</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Comprehensive solutions to drive your business forward
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20, rotateY: 90 }}
              animate={{ opacity: 1, y: 0, rotateY: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, rotateY: 10 }}
              className="group relative perspective-1000"
            >
              <div className="relative transform transition-transform duration-500">
                <div className="bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-white/10">
                  <div className="text-purple-500 mb-6 transform group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">{service.title}</h3>
                  <p className="text-gray-400">{service.description}</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}