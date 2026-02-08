import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlistStore } from '../../../store/wishlistStore';
import { useCartStore } from '../../../store/cartStore';
import { useToastStore } from '../../../store/toastStore';
import { Product } from '../../../types';
import EmptyState from '../../../components/ui/EmptyState';

const WishlistSidebar = () => {
  const wishlist = useWishlistStore((state) => state.wishlist);
  const isOpen = useWishlistStore((state) => state.isOpen);
  const toggleWishlistSidebar = useWishlistStore((state) => state.toggleWishlistSidebar);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  
  const addItem = useCartStore((state) => state.addItem);
  const addToast = useToastStore((state) => state.addToast);
  const navigate = useNavigate();

  // Bloquear el scroll del body cuando el sidebar está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleAddToCart = (product: Product) => {
    // Añadir al carrito con la primera talla disponible por defecto
    const sizeToAdd = product.availableSizes && product.availableSizes.length > 0 ? product.availableSizes[0] : null;
    addItem(product, sizeToAdd);
    addToast(`${product.name} añadido al carrito`);
  };

  const handleExplore = () => {
    toggleWishlistSidebar();
    navigate('/products');
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
            onClick={toggleWishlistSidebar}
            className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
          />
          
          {/* Sidebar Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[70] shadow-xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 flex justify-between items-center border-b border-gray-100">
              <h2 className="text-xl font-bold tracking-tight">Tu Lista de Deseos</h2>
              <button onClick={toggleWishlistSidebar} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Lista de Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {wishlist.length === 0 ? (
                <EmptyState 
                  title="Tu lista de deseos está vacía"
                  description="Guarda aquí tus favoritos para no perderlos de vista y comprarlos más tarde."
                  actionLabel="Explorar productos"
                  onAction={handleExplore}
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-8 h-8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                  }
                />
              ) : (
                wishlist.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    {/* Imagen */}
                    <Link to={`/product/${item.id}`} onClick={toggleWishlistSidebar} className="shrink-0">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-20 h-24 object-cover rounded-md bg-gray-100" 
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-20 h-24 bg-gray-100 rounded-md" />
                      )}
                    </Link>
                    
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-1">
                        <Link to={`/product/${item.id}`} onClick={toggleWishlistSidebar}>
                          <h3 className="font-medium text-sm hover:underline">{item.name}</h3>
                        </Link>
                        <p className="font-bold text-sm">${item.price.toFixed(2)}</p>
                      </div>
                      
                      <div className="mt-auto flex gap-3">
                        <button 
                          onClick={() => handleAddToCart(item)}
                          className="text-xs bg-black text-white px-3 py-2 rounded-full hover:bg-gray-800 transition-colors"
                        >
                          Añadir al carrito
                        </button>
                        <button 
                          onClick={() => toggleWishlist(item)}
                          className="text-xs text-red-500 hover:text-red-700 font-medium underline decoration-red-200 underline-offset-2"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default WishlistSidebar;