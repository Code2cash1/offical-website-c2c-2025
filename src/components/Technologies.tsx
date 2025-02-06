const technologies = [
  { name: 'React', icon: 'https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/react/react.png' },
  { name: 'Node.js', icon: 'https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/nodejs/nodejs.png' },
  { name: 'Python', icon: 'https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/python/python.png' },
  { name: 'TypeScript', icon: 'https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/typescript/typescript.png' },
  { name: 'AWS', icon: 'https://raw.githubusercontent.com/github/explore/fbceb94436312b6dacde68d122a5b9c7d11f9524/topics/aws/aws.png' },
  { name: 'Docker', icon: 'https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/docker/docker.png' },
  { name: 'Next.js', icon: 'https://raw.githubusercontent.com/github/explore/28b02bbc9ad9f7a503c43775aebeb515dc2da5fc/topics/nextjs/nextjs.png' },
  { name: 'SQL', icon: 'https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/sql/sql.png' },
  { name: 'MongoDB', icon: 'https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/mongodb/mongodb.png' }
];

export default function Technologies() {
  return (
    <div className="py-24 overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-white text-center mb-16">Technologies We Work With</h2>
        
        <div className="flex overflow-hidden">
          <div className="flex animate-infinite-scroll">
            {[...technologies, ...technologies].map((tech, index) => (
              <div 
                key={index}
                className="flex flex-col items-center justify-center w-48 h-48 group hover:shadow-xl hover:shadow-white/50 mx-8 p-4 rounded-lg"
              >
                <img 
                  src={tech.icon} 
                  alt={tech.name}
                  className="w-24 h-24 object-contain mb-4 transform group-hover:scale-110 transition-transform duration-300"
                />
                <span className="text-gray-300 text-lg text-center group-hover:text-blue-500 transition-colors duration-300">
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .animate-infinite-scroll {
          animation: scroll 40s linear infinite;
          display: flex;
        }
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-infinite-scroll:hover {
          animation-play-state: paused;
        }

      `}} />
    </div>
  );
}