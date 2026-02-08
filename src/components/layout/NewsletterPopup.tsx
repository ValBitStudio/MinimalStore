import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NewsletterPopup = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Verificar si ya se mostró el popup anteriormente
    const hasSeenPopup = localStorage.getItem('newsletter_popup_seen');

    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 5000); // Aparece a los 5 segundos

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Guardar en localStorage para no volver a mostrar
    localStorage.setItem('newsletter_popup_seen', 'true');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleClose();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 z-[80] backdrop-blur-sm"
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white p-8 rounded-2xl shadow-2xl z-[90] text-center"
          >
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 text-gray-400 hover:text-black transition-colors"
              aria-label="Cerrar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="mb-6">
              <h2 className="text-2xl font-serif font-bold mb-2">Únete al Club</h2>
              <p className="text-gray-600 text-sm">
                Suscríbete a nuestra newsletter y obtén un <span className="font-bold text-black">10% de descuento</span> en tu primera compra.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                required
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-black transition-colors text-sm"
              />
              <button
                type="submit"
                className="w-full bg-black text-white font-medium py-3 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Suscribirme
              </button>
            </form>
            
            <button 
              onClick={handleClose}
              className="mt-4 text-xs text-gray-400 hover:text-gray-600 underline"
            >
              No gracias, prefiero pagar precio completo
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NewsletterPopup;