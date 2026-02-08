import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

const NotFoundPage = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
      <Helmet key="not-found" defer={false}>
        <title>Página no encontrada | MinimalStore</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      {/* Fondo decorativo con el número gigante */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-[10rem] sm:text-[14rem] md:text-[18rem] font-serif font-bold text-gray-50 leading-none select-none absolute z-0 pointer-events-none"
      >
        404
      </motion.div>
      
      <div className="relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl md:text-4xl font-medium mb-4"
        >
          Página no encontrada
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-gray-500 mb-8 max-w-md mx-auto"
        >
          Lo sentimos, no pudimos encontrar la página que buscas. Puede que haya sido eliminada o que la dirección sea incorrecta.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Link 
            to="/" 
            className="inline-block bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-all hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Volver al Inicio
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;