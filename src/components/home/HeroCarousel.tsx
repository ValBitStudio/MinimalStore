import React, { useState, useEffect } from 'react';
import { motion as Motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';

interface Slide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  link: string;
}

const slides: Slide[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop',
    title: 'Esenciales de Verano',
    subtitle: 'Descubre la nueva colección.',
    link: '/products'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop',
    title: 'Abrigos de Temporada',
    subtitle: 'Calidez y estilo en cada prenda.',
    link: '/products'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop',
    title: 'Accesorios Minimalistas',
    subtitle: 'El toque final perfecto.',
    link: '/products'
  }
];

const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 250]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gray-900">
      <AnimatePresence>
        <Motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(_, { offset }) => {
            if (offset.x > 50) {
              prevSlide();
            } else if (offset.x < -50) {
              nextSlide();
            }
          }}
        >
          {/* Imagen de Fondo */}
          <div className="absolute inset-0 overflow-hidden">
            <Motion.img 
              src={slides[currentIndex].image}
              alt={slides[currentIndex].title}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ y }}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.7 }}
              loading="eager" // Optimización LCP: Carga inmediata, no lazy
            />
            <div className="absolute inset-0 bg-black/30" /> {/* Overlay oscuro */}
          </div>

          {/* Contenido de Texto */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
            <Motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0, transition: { duration: 0.2 } }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-5xl md:text-7xl font-light mb-4 tracking-tight"
            >
              {slides[currentIndex].title}
            </Motion.h1>
            <Motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0, transition: { duration: 0.2 } }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-xl mb-8 font-light max-w-lg"
            >
              {slides[currentIndex].subtitle}
            </Motion.p>
            <Motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0, transition: { duration: 0.2 } }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Link 
                to={slides[currentIndex].link} 
                className="bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors"
              >
                Ver Colección
              </Link>
            </Motion.div>
          </div>
        </Motion.div>
      </AnimatePresence>

      {/* Indicadores de Progreso */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className="relative h-1 w-12 md:w-16 bg-white/20 rounded-full overflow-hidden transition-colors hover:bg-white/40"
            aria-label={`Ir a la diapositiva ${index + 1}`}
          >
            {index === currentIndex && (
              <Motion.div
                className="absolute top-0 left-0 h-full bg-white"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 5, ease: "linear" }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Botones de Navegación (Opcional, ocultos en móvil para limpieza) */}
      <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white hidden md:block">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
      <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white hidden md:block">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>

    </div>
  );
};

export default HeroCarousel;