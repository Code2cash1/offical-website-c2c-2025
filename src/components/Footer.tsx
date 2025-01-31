import React from 'react';
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <h3 className="text-2xl font-bold text-white mb-6">Code2Cash</h3>
            <p className="mb-6">
              Transforming ideas into digital reality through innovative technology solutions.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-500 transition-colors"><Facebook /></a>
              <a href="#" className="hover:text-blue-500 transition-colors"><Twitter /></a>
              <a href="#" className="hover:text-blue-500 transition-colors"><Linkedin /></a>
              <a href="#" className="hover:text-blue-500 transition-colors"><Instagram /></a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li><a href="#" className="hover:text-blue-500 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Services</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Projects</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Team</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Services</h4>
            <ul className="space-y-4">
              <li><a href="#" className="hover:text-blue-500 transition-colors">Web Development</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Mobile Apps</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Cloud Solutions</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">UI/UX Design</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                info@code2cash.com
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                +1 (555) 123-4567
              </li>
              <li className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                123 Tech Street, Digital City
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p>&copy; {new Date().getFullYear()} Code2Cash. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}