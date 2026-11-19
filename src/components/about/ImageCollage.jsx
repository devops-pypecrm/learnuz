import React from 'react';
import { motion } from 'framer-motion';

export default function ImageCollage() {
  const images = [
    {
      src: 'https://img.magnific.com/premium-photo/group-business-man-people-with-laptop_862994-614942.jpg',
      alt: 'Graduation Ceremony',
      className: 'w-[65%] aspect-[4/3] z-10 top-0 left-0 shadow-2xl',
      delay: 0.1,
    },
    {
      src: 'https://images.pexels.com/photos/37954917/pexels-photo-37954917/free-photo-of-group-of-business-students-outdoors-socializing.jpeg?cs=tinysrgb&dpr=1&w=500',
      alt: 'Students Group Discussion',
      className: 'w-[60%] aspect-[4/3] z-20 top-[25%] right-0 shadow-2xl',
      delay: 0.3,
    },
    {
      src: 'https://www.globemoving.net/api/media/file/Best-International-Schools-in-Mumbai-Banner-2.png/',
      alt: 'Student Counselling Session',
      className: 'w-[50%] aspect-square z-30 bottom-0 left-[10%] shadow-xl',
      delay: 0.5,
    },
    {
      src: 'https://img.magnific.com/premium-photo/young-indian-girl-happy-background-portrait_53876-1151608.jpg?semt=ais_hybrid&w=740&q=80',
      alt: 'Campus Life',
      className: 'w-[45%] aspect-[3/4] z-0 top-[10%] left-[30%] opacity-80 filter blur-[1px] hidden sm:block',
      delay: 0.2,
    }
  ];

  return (
    <div className="relative w-full h-[350px] sm:h-[450px] md:h-[500px] lg:h-[550px] mx-auto max-w-[600px] flex items-center justify-center">
      {/* Decorative background blobs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '2s' }}></div>

      {images.map((img, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, delay: img.delay, ease: 'easeOut' }}
          whileHover={{ scale: 1.03, zIndex: 40, transition: { duration: 0.3 } }}
          className={`absolute rounded-3xl overflow-hidden border-4 border-white shadow-slate-900/10 ${img.className}`}
        >
          <img
            src={img.src}
            alt={img.alt}
            className="w-full h-full object-cover rounded-2xl transform hover:scale-105 transition-transform duration-700"
            loading="lazy"
          />
        </motion.div>
      ))}

      {/* Floating Badge in collage */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
        whileInView={{ opacity: 1, scale: 1, rotate: -5 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.7, type: 'spring' }}
        whileHover={{ rotate: 0, scale: 1.05 }}
        className="absolute bottom-[10%] right-[5%] sm:right-[10%] z-30 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-2xl border border-white/20 uppercase tracking-widest cursor-default select-none"
      >
        🎯 Global Education
      </motion.div>
    </div>
  );
}
