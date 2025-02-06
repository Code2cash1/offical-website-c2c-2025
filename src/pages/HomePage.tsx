import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, } from 'lucide-react';
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

  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.scroll-animate');
      elements.forEach(element => {
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
          element.classList.add('animate-in');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    { image: 'https://th.bing.com/th/id/OIP.RCBY1PGej90jKzEa4_XW_QHaEI?rs=1&pid=ImgDetMain', title: 'Landing Pages', desc: 'Eye-catching landing pages that convert visitors into customers' },
    { image: 'https://cdn.dribbble.com/users/669353/screenshots/17169995/media/57acb32dbaf5f43c2db1015826e0b363.jpg?compress=1&resize=400x300&vertical=top', title: 'E-Commerce Solutions', desc: 'Full-featured online stores with secure payment integration' },
    { image: 'https://i.pinimg.com/originals/3d/7f/cb/3d7fcbdce6f622476d0942b97b04ff39.jpg', title: 'Web Applications', desc: 'Custom web apps with powerful functionality' },
    { image: 'https://cdn.dribbble.com/users/2523680/screenshots/18599696/frame_29_4x.jpg', title: 'Enterprise Solutions', desc: 'Scalable applications for large organizations' },
    { image: 'https://cdn.dribbble.com/users/5485041/screenshots/13683022/media/68a54d246dc19cf99d6b8f81a4ad7c56.png', title: 'Social Platforms', desc: 'Community and social networking applications' },
    { image: 'https://cdn.dribbble.com/users/357415/screenshots/6110435/hostox_ui_4x.png?compress=1&resize=400x300', title: 'Business Management', desc: 'Complete business management systems' },
    { image: 'https://cdn.dribbble.com/userupload/14319660/file/original-ccb5b31ddd9281bc528d258df3013114.png?resize=1000x750&vertical=center', title: 'Real Estate Platforms', desc: 'Property listing and management solutions' },
    { image: 'https://mir-s3-cdn-cf.behance.net/projects/max_808/fb6c60145780203.Y3JvcCwxNDAwLDEwOTUsMCwxMDM.png', title: 'Marketplace Development', desc: 'Multi-vendor marketplace platforms' },
    { image: 'https://www.enableds.com/wp-content/uploads/2020/03/PWAs-for-2020.png', title: 'Progressive Web Apps', desc: 'Mobile-first web applications' },
  ];

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
            className="max-w-6xl mx-auto pt-32 scroll-animate"
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

            <motion.div 
              className="overflow-hidden py-8 w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <motion.div 
                className="flex gap-8"
                animate={{ x: [0, -2880] }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 40,
                    ease: "linear",
                  },
                }}
              >
                {[...features, ...features].map((feature, i) => (
                  <motion.div
                    key={i}
                    className="flex-shrink-0 w-60 bg-white/5 backdrop-blur-lg rounded-2xl hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-purple-500/50"
                  >
                    <img src={feature.image} alt={feature.title} className="w-full h-32 object-cover rounded-t-2xl" />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                      <p className="text-gray-400 text-xs">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      <div className="scroll-animate">
        <About/>
      </div>
      <div className="scroll-animate">
        <Services/>
      </div>
      <div className="scroll-animate">
        <Technologies/>
      </div>
      <div className="scroll-animate">
        <Team/>
      </div>
      <div className="scroll-animate">
        <BookMeeting/>
      </div>
      <div className="scroll-animate">
        <Vision/>
      </div>
      <div className="scroll-animate">
        <Careers/>
      </div>
      <div className="scroll-animate">
        <Footer/>
      </div>
    </div>
  );
}