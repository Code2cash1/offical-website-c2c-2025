import React, { useEffect, useRef } from 'react';
import { Code2, ArrowRight, Sparkles } from 'lucide-react';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || !cardsRef.current) return;

      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - left) / width;
      const y = (e.clientY - top) / height;

      const cards = cardsRef.current.children;
      Array.from(cards).forEach((card, index) => {
        const multiplier = (index + 1) * 2;
        (card as HTMLElement).style.transform = `
          translate(
            ${(x - 0.5) * multiplier * 20}px,
            ${(y - 0.5) * multiplier * 20}px
          )
          rotate(${(x - 0.5) * multiplier * 10}deg)
          scale(${1 + (x - 0.5) * multiplier * 0.1})
        `;
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div id="hero" className="min-h-screen bg-gray-900 relative overflow-hidden" ref={containerRef}>
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,0,255,0.1),rgba(0,0,0,0))]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(255,0,255,0.1),rgba(0,0,0,0))]" />
      </div>

      <div className="container mx-auto px-4 py-32 relative">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="mb-8 relative">
              <Code2 className="w-24 h-24 text-purple-500" />
              <Sparkles className="absolute -right-4 -top-4 w-8 h-8 text-purple-300 animate-pulse" />
            </div>

            <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 relative">
              <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                Code2Cash
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl">
              Transform your digital dreams into reality with our innovative solutions
            </p>

            <div className="flex gap-6 flex-wrap justify-center">
              <button className="group px-8 py-4 bg-purple-500 text-white rounded-full font-semibold 
                               hover:bg-purple-600 transform hover:-translate-y-1 transition-all duration-300
                               shadow-lg hover:shadow-purple-500/25 flex items-center gap-2">
                Get Started
                <ArrowRight className="transform group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              <button className="px-8 py-4 bg-gray-800 text-white rounded-full font-semibold 
                               hover:bg-gray-750 transform hover:-translate-y-1 transition-all duration-300
                               border border-purple-500/30">
                View Projects
              </button>
            </div>
          </div>

          <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {[
              { title: 'Feature 1', description: 'Unleash the power of our cutting-edge solutions.' },
              { title: 'Feature 2', description: 'Revolutionize your digital landscape.' },
              { title: 'Feature 3', description: 'Embrace the future of digital transformation.' },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl transform transition-all duration-500
                         hover:shadow-2xl hover:shadow-purple-500/10 border border-purple-500/10"
              >
                <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}