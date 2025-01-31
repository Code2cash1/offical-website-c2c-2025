import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter } from 'lucide-react';
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
    image: output,
    social: {
      github: '#',
      linkedin: '#',
      twitter: '#'
    }
  },
  {
    name: 'Bashar Ali',
    role: 'Founder & Business Development Head',
    image: bashar,
    social: {
      github: '#',
      linkedin: '#',
      twitter: '#'
    }
  },
  {
    name: 'Reshav Aanand',
    role: 'Technical Lead & Full Stack Developer',
    image: reshav,
    social: {
      github: '#',
      linkedin: '#',
      twitter: '#'
    }
  },
  {
    name: 'Guru prokash',
    role: 'Web Developer',
    image: guru,
    social: {
      github: '#',
      linkedin: '#',
      twitter: '#'
    }
  },
  {
    name: 'Md Zafir Hasan',
    role: 'Frontend Developer',
    image: zafir,
    social: {
      github: '#',
      linkedin: '#',
      twitter: '#'
    }
  },
  {
    name: 'Md  Altamash Malik',
    role: 'web Developer',
    image: altamash,
    social: {
      github: '#',
      linkedin: '#',
      twitter: '#'
    }
  },
  {
    name: 'Sajid Ali',
    role: 'Full stack Developer',
    image: sajid,
    social: {
      github: '#',
      linkedin: '#',
      twitter: '#'
    }
  }, 
  {
    name: 'Faraz Ahmed',
    role: 'UI/UX Designer',
    image: output,
    social: {
      github: '#',
      linkedin: '#',
      twitter: '#'
    }
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

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
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
                <div className="relative overflow-hidden rounded-xl">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full aspect-square object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="text-lg font-semibold text-white">{member.name}</h3>
                    <p className="text-sm text-gray-300">{member.role}</p>
                    
                    <div className="flex space-x-3 mt-3">
                      <a href={member.social.github} className="text-white hover:text-purple-500 transition-colors">
                        <Github className="w-5 h-5" />
                      </a>
                      <a href={member.social.linkedin} className="text-white hover:text-purple-500 transition-colors">
                        <Linkedin className="w-5 h-5" />
                      </a>
                      <a href={member.social.twitter} className="text-white hover:text-purple-500 transition-colors">
                        <Twitter className="w-5 h-5" />
                      </a>
                    </div>
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
