import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import CategoryGrid from '../components/home/CategoryGrid';
import FeaturesSection from '../components/home/FeaturesSection';
import ProductCard from '../features/products/components/ProductCard';
import HeroCarousel from '../components/home/HeroCarousel';
import TestimonialsCarousel from '../components/home/TestimonialsCarousel';
import { PRODUCTS } from '../data/products';

const HomePage = () => {
  // Configuración de animación para las secciones
  const sectionAnimation = {
    initial: { opacity: 0, y: 50 },
    whileInView: { opacity: 1, y: 0 },
    // Optimización: once: true para que la animación solo ocurra la primera vez
    viewport: { once: true, amount: 0.3 }, 
    transition: { duration: 0.8, ease: "easeOut" }
  } as const;

  return (
    <div>
      <Helmet key="home" defer={false}>
        <title key="title-home">MinimalStore | Moda Minimalista y Atemporal</title>
        <meta name="description" content="Descubre nuestra colección de esenciales modernos diseñados para durar." />
      </Helmet>
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <HeroCarousel />
        <TestimonialsCarousel />
      </div>
      
      {/* Envolvemos los componentes en motion.div para aplicar la animación */}
      <motion.div {...sectionAnimation}>
        <CategoryGrid />
      </motion.div>
      
      <motion.div {...sectionAnimation}>
        <FeaturesSection />
      </motion.div>

      {/* Categorías Destacadas (Bento Grid) */}
      <motion.section className="py-16 container mx-auto px-4" {...sectionAnimation}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[300px]">
        
        {/* 1. Más Vendidos (Large - 2 cols) */}
        <Link to="/products?sort=desc" className="md:col-span-2 relative group overflow-hidden rounded-2xl">
          <img 
            src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop" 
            alt="Más Vendidos" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
          <div className="absolute bottom-8 left-8 text-white">
            <span className="text-xs font-bold tracking-widest uppercase mb-2 block">Tendencia</span>
            <h3 className="text-3xl font-serif font-bold mb-2">Más Vendidos</h3>
            <p className="text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
              Ver colección <span className="text-lg">→</span>
            </p>
          </div>
        </Link>

        {/* 2. Ofertas (Tall - 2 rows) */}
        <Link to="/products?discount=true" className="md:row-span-2 relative group overflow-hidden rounded-2xl">
          <img 
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop" 
            alt="Ofertas" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
          <div className="absolute bottom-8 left-8 text-white">
            <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest mb-3 inline-block rounded-sm">Sale</span>
            <h3 className="text-3xl font-serif font-bold mb-2">Ofertas</h3>
            <p className="text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
              Hasta 50% OFF <span className="text-lg">→</span>
            </p>
          </div>
        </Link>

        {/* 3. Accesorios (Standard) */}
        <Link to="/products?category=Accesorios" className="relative group overflow-hidden rounded-2xl">
          <img 
            src="https://images.unsplash.com/photo-1523206489230-c012c64b2b48?q=80&w=1000&auto=format&fit=crop" 
            alt="Accesorios" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
          <div className="absolute bottom-6 left-6 text-white">
            <h3 className="text-xl font-bold mb-1">Accesorios</h3>
            <p className="text-xs font-medium opacity-90">Detalles únicos</p>
          </div>
        </Link>

        {/* 4. Nueva Temporada (Standard) */}
        <Link to="/products?isNew=true" className="relative group overflow-hidden rounded-2xl">
          <img 
            src="https://images.unsplash.com/photo-1485230405346-71acb9518d9c?q=80&w=2094&auto=format&fit=crop" 
            alt="Nueva Temporada" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
          <div className="absolute bottom-6 left-6 text-white">
            <h3 className="text-xl font-bold mb-1">Nueva Temporada</h3>
            <p className="text-xs font-medium opacity-90">Lo último en moda</p>
          </div>
        </Link>
      </div>
    </motion.section>

      {/* Novedades Section */}
      <motion.section className="py-24 container mx-auto px-4" {...sectionAnimation}>
        <div className="flex flex-col items-center text-center mb-16">
        <span className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-3">Recién Llegados</span>
        <h2 className="text-3xl md:text-4xl font-serif font-medium mb-4">Novedades de Temporada</h2>
        <p className="text-gray-500 max-w-lg mx-auto">
          Explora nuestras últimas adiciones. Piezas versátiles y duraderas diseñadas para complementar tu estilo de vida minimalista.
        </p>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 md:gap-x-8 mb-12">
        {PRODUCTS.slice(0, 4).map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>

      <div className="text-center">
        <Link 
          to="/products" 
          className="group inline-flex items-center gap-2 text-sm font-medium border-b border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-all"
        >
          Ver toda la colección
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 transition-transform group-hover:translate-x-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
          </svg>
        </Link>
      </div>
    </motion.section>
    </div>
  );
};

export default HomePage;