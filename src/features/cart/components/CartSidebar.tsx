import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore, selectTotalPrice } from '../../../store/cartStore';
import EmptyState from '../../../components/ui/EmptyState';
import { PRODUCTS } from '../../../data/products';
import ProductCard from '../../products/components/ProductCard';
import { Product } from '../../../types';

const CartSidebar = () => {
  // Obtenemos estado y acciones del store de forma selectiva
  // El componente solo se volverá a renderizar si estas partes específicas del estado cambian
  const cart = useCartStore((state) => state.cart);
  const isOpen = useCartStore((state) => state.isOpen);
  const toggleCart = useCartStore((state) => state.toggleCart);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const totalPrice = useCartStore(selectTotalPrice);

  const navigate = useNavigate();

  // Bloquear el scroll del body cuando el carrito está abierto
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

  const handleCheckout = () => {
    toggleCart(); // Cierra el carrito
    navigate('/checkout'); // Navega a la página de pago
  };

  const handleContinueShopping = () => {
    toggleCart();
    navigate('/products');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop (Fondo oscuro) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
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
              <h2 className="text-xl font-bold tracking-tight">Tu Bolsa</h2>
              <div className="flex items-center gap-3">
                {cart.length > 0 && (
                  <button 
                    onClick={clearCart}
                    className="text-xs font-medium text-gray-500 hover:text-red-600 underline transition-colors"
                  >
                    Vaciar
                  </button>
                )}
                <button onClick={toggleCart} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Lista de Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <EmptyState 
                  title="Tu bolsa está vacía"
                  description="Parece que aún no has añadido nada. Explora nuestra colección para encontrar tus esenciales."
                  actionLabel="Continuar comprando"
                  onAction={handleContinueShopping}
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-8 h-8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                  }
                >
                  <div className="border-t border-gray-100 pt-8">
                    <p className="text-sm font-bold text-gray-900 mb-4">Te podría interesar</p>
                    <div className="grid grid-cols-2 gap-4">
                      {(PRODUCTS as Product[]).slice(0, 2).map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  </div>
                </EmptyState>
              ) : (
                cart.map((item) => (
                  <div key={item.cartItemId} className="flex gap-4">
                    {/* Imagen */}
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-20 h-24 object-cover rounded-md flex-shrink-0 bg-gray-100" 
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-20 h-24 bg-gray-100 rounded-md flex-shrink-0" />
                    )}
                    
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-medium text-sm">
                          {item.name}
                          {item.size && <span className="text-gray-500 font-normal ml-1">({item.size})</span>}
                          {item.color && <span className="text-gray-500 font-normal ml-1">/ {item.color}</span>}
                        </h3>
                        <p className="font-bold text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      <p className="text-xs text-gray-500 mb-auto">${item.price.toFixed(2)} c/u</p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-gray-200 rounded-md">
                          <button 
                            onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                            className="px-2 py-1 hover:bg-gray-50 text-gray-600 disabled:opacity-50"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-medium w-8 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                            className="px-2 py-1 hover:bg-gray-50 text-gray-600"
                          >
                            +
                          </button>
                        </div>
                        <button 
                          onClick={() => removeItem(item.cartItemId)}
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

            {/* Footer con Total */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-gray-100 bg-gray-50">
                <div className="flex justify-between mb-4 text-lg font-bold">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-black text-white py-4 rounded-full font-medium hover:bg-gray-800 transition-all transform active:scale-[0.98]"
                >
                  Proceder al Pago
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;