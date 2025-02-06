import React from 'react';

const sections = [
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'team', label: 'Team' },
  { id: 'vision', label: 'vision' }
];

export default function DotNavigation() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 space-y-4">
      {sections.map((section) => (
        <div
          key={section.id}
          className="group relative flex items-center cursor-pointer"
          onClick={() => scrollToSection(section.id)}
        >
          <div className="w-3 h-3 bg-purple-500 rounded-full transform transition-all duration-300 group-hover:scale-150" />
          <span className="absolute right-full mr-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            {section.label}
          </span>
        </div>
      ))}
    </div>
  );
}