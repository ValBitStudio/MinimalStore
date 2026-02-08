import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScroll } from '../../hooks/useScroll';

const BackToTopButton = () => {
  const { scrollY } = useScroll();
  const [progress, setProgress] = useState(0);
  const isVisible = scrollY > 300;

  // Calcular el porcentaje de scroll
  useEffect(() => {
    const calculateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setProgress(Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)));
      }
    };
    window.addEventListener('scroll', calculateProgress);
    return () => window.removeEventListener('scroll', calculateProgress);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Configuración del círculo SVG
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 group"
          aria-label="Volver arriba"
        >
          <div className="relative w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-lg group-hover:bg-gray-50 transition-colors">
            {/* Anillo de Progreso */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 transform" viewBox="0 0 48 48">
              <circle 
                cx="24" cy="24" r={radius} 
                fill="none" 
                stroke="#e5e7eb" 
                strokeWidth="3" 
              />
              <circle 
                cx="24" cy="24" r={radius} 
                fill="none" 
                stroke="black" 
                strokeWidth="3" 
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-100 ease-out"
              />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-black relative z-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
            </svg>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default BackToTopButton;