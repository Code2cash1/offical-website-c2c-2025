import React from 'react';
import { Code, Palette, Globe, Database, File as Mobile, Cloud } from 'lucide-react';

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
    icon: <Mobile className="w-8 h-8" />,
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
  }
];

export default function Services() {
  return (
    <div className="py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-white text-center mb-16">Our Services</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="p-8 bg-transparent rounded-lg transform hover:-translate-y-2 hover:scale-105 transition-all
                         duration-300 hover:shadow-xl hover:shadow-white/50"
            >
              <div className="text-purple-500 mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-4">{service.title}</h3>
              <p className="text-gray-400">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}