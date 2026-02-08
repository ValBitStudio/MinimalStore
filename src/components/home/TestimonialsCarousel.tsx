import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const testimonials = [
  {
    id: 1,
    name: "Sofía Martínez",
    role: "Cliente Verificado",
    content: "La calidad de la ropa es excepcional. El algodón se siente increíblemente suave.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Carlos Ruiz",
    role: "Cliente Frecuente",
    content: "El servicio al cliente fue muy atento y el envío llegó antes de lo esperado.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Ana López",
    role: "Diseñadora de Moda",
    content: "Piezas básicas pero con un toque de elegancia que es difícil de encontrar.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop"
  }
];

const TestimonialsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <div className="absolute bottom-8 right-4 md:bottom-12 md:right-12 z-20 w-full max-w-[300px] md:max-w-sm pointer-events-none">
      <AnimatePresence mode='wait'>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 50, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="bg-black/40 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-2xl text-white flex items-start gap-4 pointer-events-auto"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden border border-white/30 flex-shrink-0 mt-1">
            <img 
              src={testimonials[currentIndex].avatar} 
              alt={testimonials[currentIndex].name} 
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-bold text-sm truncate">{testimonials[currentIndex].name}</h4>
              <div className="flex text-yellow-400 text-[10px]">★★★★★</div>
            </div>
            <p className="text-xs text-white/90 leading-relaxed line-clamp-3">
              "{testimonials[currentIndex].content}"
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default TestimonialsCarousel;