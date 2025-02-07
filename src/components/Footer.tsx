import { Linkedin, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">Code2Cash</h3>
            <p className="mb-4">
              Transforming ideas into digital reality through innovative technology solutions.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.linkedin.com/company/code2cash/" target="_blank" rel="noopener noreferrer" className="hover:text-purple-800 transition-colors"><Linkedin /></a>
              <a href="https://www.instagram.com/code2cash_co/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-900  transition-colors"><Instagram /></a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li id='about'><Link to="/about" className="hover:text-purple-800 transition-colors">About Us</Link></li>
              <li id='services'><Link to="/services" className="hover:text-purple-800 transition-colors">Services</Link></li>
              <li id='technologies'><Link to="/technologies" className="hover:text-purple-800 transition-colors">Technologies</Link></li>
              <li id='team'><Link to="/team" className="hover:text-purple-800 transition-colors">Team</Link></li>
              <li id='career'><Link to="/careers" className="hover:text-purple-800 transition-colors">Career</Link></li>
              <li id='contact'><Link to="/contact" className="hover:text-purple-800 transition-colors">Contact Us</Link></li>
            </ul>
          </div>          
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                <a href="mailto:info@code2cash.com" className="hover:text-purple-800 transition-colors">info@code2cash.com</a>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                <a href="tel:+911234567890" className="hover:text-purple-800 transition-colors">+91 1234567890</a>
              </li>
              <li className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer" className="hover:text-purple-800 transition-colors">Kankarbagh, Patna, India</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-4 text-center">
          <p>© {new Date().getFullYear()} Code2Cash. All rights reserved.</p>
        </div>
        
      </div>
    </footer>
  );
}