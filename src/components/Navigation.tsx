import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';


const links = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/services', label: 'Services' },
  { path: '/projects', label: 'Projects' },
  { path: '/technologies', label: 'Technologies' },
  { path: '/careers', label: 'Careers' },
  { path: '/team', label: 'Team' },
  { path: '/contact', label: 'Contact' }
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed w-full z-[61] bg-black/50 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-2 group cursor-pointer z-[62]">
            
                        <img src="src/assets/logo.png" alt="Logo" className="h-64 w-auto brightness-0 invert" />
                       
            
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 z-[62]">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative text-sm font-medium transition-colors duration-300 cursor-pointer ${
                  location.pathname === link.path ? 'text-purple-500' : 'text-white hover:text-purple-500'
                }`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-purple-500 transform origin-left transition-transform duration-300 ${
                  location.pathname === link.path ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`} />
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white cursor-pointer z-[62]"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="w-6 h-6 flex flex-col justify-around">
              <span className={`w-full h-0.5 bg-white transform transition-transform duration-300 ${isOpen ? 'rotate-45 translate-y-2.5' : ''}`} />
              <span className={`w-full h-0.5 bg-white transition-opacity duration-300 ${isOpen ? 'opacity-0' : ''}`} />
              <span className={`w-full h-0.5 bg-white transform transition-transform duration-300 ${isOpen ? '-rotate-45 -translate-y-2.5' : ''}`} />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden fixed top-20 left-0 right-0 bg-black backdrop-blur-sm transition-all duration-300 ${isOpen ? 'max-h-[calc(100vh-5rem)] opacity-100' : 'max-h-0 opacity-0'} overflow-y-auto`}>
          <div className="py-4 space-y-4">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-4 py-2 text-sm font-medium transition-colors duration-300 cursor-pointer ${
                  location.pathname === link.path ? 'text-purple-500 bg-white/5' : 'text-white hover:text-purple-500'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}