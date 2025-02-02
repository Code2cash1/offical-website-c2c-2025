import React from 'react';

const technologies = [
  { name: 'React', icon: 'https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/react/react.png' },
  { name: 'Node.js', icon: 'https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/nodejs/nodejs.png' },
  { name: 'Python', icon: 'https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/python/python.png' },
  { name: 'TypeScript', icon: 'https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/typescript/typescript.png' },
  { name: 'AWS', icon: 'https://raw.githubusercontent.com/github/explore/fbceb94436312b6dacde68d122a5b9c7d11f9524/topics/aws/aws.png' },
  { name: 'Docker', icon: 'https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/docker/docker.png' }
];

export default function Technologies() {
  return (
    <div className=" py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-white text-center mb-16">Technologies We Work With</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 ">
          {technologies.map((tech, index) => (
            <div 
              key={index}
              className="flex flex-col items-center group hover:shadow-xl hover:shadow-white/50"
            >
              <img 
                src={tech.icon} 
                alt={tech.name}
                className="w-24 h-24 mb-4 transform group-hover:scale-110 transition-transform duration-300 "
              />
              <span className="text-gray-300 group-hover:text-blue-500 transition-colors duration-300">
                {tech.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}