import { motion } from 'framer-motion';
import bashar from '../assets/bashar.jpg';
import output from '../assets/output.png';
import guru from '../assets/guru.png';
import reshav from '../assets/reshav.jpeg';
import zafir from '../assets/zafir.png';
import altamash from '../assets/altamash.png';
import sajid from '../assets/sajid.png';


const team = [
  {
    name: 'Syed Imran Hassan',
    role: 'Founder & Managing Director',
    image: output
  },
  {
    name: 'Bashar Ali',
    role: 'Founder & Business Development Head',
    image: bashar
  },
  {
    name: 'Reshav Aanand',
    role: 'Technical Lead & Full Stack Developer',
    image: reshav
  },
  {
    name: 'Guru prokash',
    role: 'Web Developer',
    image: guru
  },
  {
    name: 'Md Zafir Hasan',
    role: 'Frontend Developer',
    image: zafir
  },
  {
    name: 'Md  Altamash Malik',
    role: 'web Developer',
    image: altamash
  },
  {
    name: 'Sajid Ali',
    role: 'Full stack Developer',
    image: sajid
  }, 
  {
    name: 'Faraz Ahmed',
    role: 'UI/UX Designer',
    image: output
  }
];

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-black pt-32 pb-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-6">Our Team</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Meet our talented team of professionals
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20, rotateY: 90 }}
              animate={{ opacity: 1, y: 0, rotateY: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, rotateY: 10 }}
              className="group relative perspective-1000"
            >
              <div className="relative transform transition-transform duration-500">
                <div className="relative overflow-hidden rounded-xl h-[300px]">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
    
  );
  
}