import React from 'react';
import { Target, Rocket, Users } from 'lucide-react';

export default function Vision() {
  return (
    <div className=" py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-white text-center mb-16">Our Vision</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center p-8 bg-transparent rounded-lg transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-white/50">
            <Target className="w-12 h-12 text-blue-500 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-white mb-4">Mission</h3>
            <p className="text-gray-400">
              To empower businesses through innovative technology solutions that drive growth and success.
            </p>
          </div>
          
          <div className="text-center p-8 bg-transparent rounded-lg transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-white/50">
            <Rocket className="w-12 h-12 text-purple-500 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-white mb-4">Innovation</h3>
            <p className="text-gray-400">
              Pushing boundaries and exploring new technologies to create cutting-edge solutions.
            </p>
          </div>
          
          <div className="text-center p-8 bg-transparent rounded-lg transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-white/50">
            <Users className="w-12 h-12 text-green-500 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-white mb-4">Community</h3>
            <p className="text-gray-400">
              Building lasting relationships and fostering a collaborative tech community.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}