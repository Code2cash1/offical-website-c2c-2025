import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import About from '../components/About';
import Services from '../components/Services';
import Technologies from '../components/Technologies';
import Team from '../components/Team';
import BookMeeting from '../components/BookMeeting';
import Vision from '../components/Vision';
import Footer from '../components/Footer';
import DotNavigation from '../components/DotNavigation';
import Careers from '../components/Careers';

export default function HomePage() {
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
            ${(x - 0.5) * multiplier * 30}px,
            ${(y - 0.5) * multiplier * 30}px
          )
          rotate(${(x - 0.5) * multiplier * 5}deg)
        `;
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden" ref={containerRef}>
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl -top-48 -left-48 animate-blob" />
        <div className="absolute w-[500px] h-[500px] bg-pink-500/20 rounded-full blur-3xl top-full -translate-y-1/2 left-full -translate-x-1/2 animate-blob animation-delay-2000" />
        <div className="absolute w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-3xl top-1/2 -translate-y-1/2 -right-48 animate-blob animation-delay-4000" />
      </div>

      {/* Content */}
      <div className="relative min-h-screen flex items-center">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto pt-32"
          >
            <div className="text-center mb-16">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-7xl md:text-9xl font-bold mb-8"
              >
                <span className="bg-gradient-to-r from-white via-purple-500 to-white bg-clip-text text-transparent">
                  Code2Cash
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto"
              >
                Transform your digital dreams into reality with cutting-edge solutions
              </motion.p>
<DotNavigation/>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-wrap justify-center gap-6"
              >
                <button className="group relative px-8 py-4 bg-white/10 backdrop-blur-lg rounded-full overflow-hidden">
                  <span className="relative z-10 flex items-center gap-2 text-white font-semibold">
                    Get Started
                    <ArrowRight className="transform group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>

                <button className="group px-8 py-4 bg-white/5 backdrop-blur-lg text-white rounded-full font-semibold
                                 border border-white/10 hover:border-purple-500/50 transition-all duration-300">
                  View Projects
                </button>
              </motion.div>
            </div>

            <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 * (i + 4) }}
                  className="group relative p-8 bg-white/5 backdrop-blur-lg rounded-2xl overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative z-10">
                    <h3 className="text-xl font-semibold text-white mb-4">Feature {i}</h3>
                    <p className="text-gray-400">
                      Experience the future of digital transformation with our cutting-edge solutions.
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
        
      </div>
     <About/>
     <Services/>
     <Technologies/>
    <Team/>
    <BookMeeting/>
    <Vision/>
    <Careers/>
    <Footer/>

    </div>
  );
}