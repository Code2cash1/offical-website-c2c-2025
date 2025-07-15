import { motion } from 'framer-motion';
import bashar from '../assets/bashar.jpg';
import output from '../assets/output.png';

const team = [
  { name: 'Syed Imran Hassan', role: 'Founder & Managing Director', image: output },
  { name: 'Bashar Ali', role: 'Founder & Business Development Head', image: bashar },
 
];

export default function TeamPage() {
  return (
    <div id='team' className="min-h-screen bg-black pt-32 pb-24">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-6">Our Team</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">Meet our talented team of professionals</p>
        </motion.div>

        {/* Grid Layout for larger screens */}
        <div className="hidden md:flex justify-center items-center gap-8">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="group relative hover:shadow-xl hover:shadow-white/50 w-[300px]"
            >
              <div className="relative overflow-hidden rounded-xl">
                <img src={member.image} alt={member.name} className="w-full h-[300px] object-cover transform group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-lg font-semibold text-white">{member.name}</h3>
                  <p className="text-sm text-gray-300">{member.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Scrollable Layout for smaller screens */}
        <div className="md:hidden relative overflow-hidden">
          <div className="flex overflow-x-scroll scrollbar-hide auto-scroll-container">
            <div className="flex animate-scroll">
              {[...team, ...team].map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative flex-none w-72 mx-2 shadow-lg shadow-white/20 hover:shadow-xl hover:shadow-white/50 active:shadow-xl active:shadow-white/50 rounded-xl"
                  draggable="false"
                >
                  <div className="relative overflow-hidden rounded-xl w-full">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-72 object-cover transform group-hover:scale-110 transition-transform duration-500"
                      draggable="false"
                    />
                    <div 
                      className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-300"
                    >
                      <div 
                        className="absolute inset-0 flex flex-col justify-end p-4"
                      >
                        <h3 className="text-lg font-semibold text-white">{member.name}</h3>
                        <p className="text-sm text-gray-300">{member.role}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <style>
          {`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
            .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
            .auto-scroll-container {
              cursor: grab;
            }
            .auto-scroll-container:active {
              cursor: grabbing;
            }
            .animate-scroll {
              animation: scroll 40s linear infinite;
            }
            .animate-scroll:hover {
              animation-play-state: paused;
            }
            @keyframes scroll {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-50%);
              }
            }
          `}
        </style>
      </div>
    </div>
  );
}