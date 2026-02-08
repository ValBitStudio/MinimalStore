import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuickViewStore } from '../../../store/quickViewStore';
import { useCartStore } from '../../../store/cartStore';
import { useToastStore } from '../../../store/toastStore';

const QuickViewModal = () => {
  const { isOpen, selectedProduct, closeQuickView } = useQuickViewStore();
  const addItem = useCartStore((state) => state.addItem);
  const addToast = useToastStore((state) => state.addToast);

  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  // Resetear selección cuando cambia el producto
  useEffect(() => {
    if (selectedProduct?.availableSizes && selectedProduct.availableSizes.length > 0) {
      setSelectedSize(selectedProduct.availableSizes[0]);
    } else {
      setSelectedSize(null);
    }
  }, [selectedProduct]);

  if (!selectedProduct) return null;

  const handleAddToCart = () => {
    addItem(selectedProduct, selectedSize);
    addToast(`${selectedProduct.name} añadido al carrito`);
    closeQuickView();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeQuickView}
            className="fixed inset-0 bg-black/50 z-[80] backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-4xl bg-white rounded-xl shadow-2xl z-[90] overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={closeQuickView}
              className="absolute right-4 top-4 p-2 text-gray-400 hover:text-black z-10 bg-white/50 rounded-full"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Imagen */}
              <div className="bg-gray-100 aspect-square md:aspect-auto md:h-full relative">
                {selectedProduct.image ? (
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                )}
              </div>

              {/* Info */}
              <div className="p-8 flex flex-col justify-center">
                <h2 className="text-2xl font-bold mb-2">{selectedProduct.name}</h2>
                <p className="text-xl text-gray-900 mb-4">${selectedProduct.price.toFixed(2)}</p>
                
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                  {selectedProduct.description || "Un esencial moderno diseñado para durar. Fabricado con materiales de primera calidad para ofrecer el máximo confort y estilo."}
                </p>

                {/* Selector de Tallas */}
                {selectedProduct.availableSizes && selectedProduct.availableSizes.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Talla</h3>
                    <div className="flex gap-2">
                      {selectedProduct.availableSizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`w-10 h-10 rounded-full flex items-center justify-center border text-sm font-medium transition-all ${
                            selectedSize === size
                              ? 'border-black bg-black text-white'
                              : 'border-gray-200 text-gray-900 hover:border-gray-300'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 mt-auto">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-black text-white py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
                  >
                    Añadir al Carrito
                  </button>
                  <Link
                    to={`/product/${selectedProduct.id}`}
                    onClick={closeQuickView}
                    className="px-6 py-3 border border-gray-200 rounded-full font-medium hover:bg-gray-50 transition-colors text-center"
                  >
                    Ver Detalles
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default QuickViewModal;