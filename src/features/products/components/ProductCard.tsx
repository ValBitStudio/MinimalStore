import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { Product } from '../../../types';
import { useCartStore } from '../../../store/cartStore';
import { useToastStore } from '../../../store/toastStore';
import { useQuickViewStore } from '../../../store/quickViewStore';
import Tooltip from '../../../components/ui/Tooltip';
import { useWishlistStore } from '../../../store/wishlistStore';

interface ProductCardProps {
  product: Product;
  variant?: 'grid' | 'list';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, variant = 'grid' }) => {
  const addItem = useCartStore((state) => state.addItem);
  const cart = useCartStore((state) => state.cart);
  const addToast = useToastStore((state) => state.addToast);
  const openQuickView = useQuickViewStore((state) => state.openQuickView);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const wishlist = useWishlistStore((state) => state.wishlist);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Solución al error: Usamos optional chaining (?.) y nullish coalescing (??)
  // Si availableSizes es undefined, usamos 0 como longitud por defecto.
  const hasSizes = (product.availableSizes?.length ?? 0) > 0;

  const isInCart = cart.some(item => item.id === product.id);
  const isInWishlist = wishlist.some(item => item.id === product.id);

  // Función para reproducir sonido de éxito (sin archivos externos)
  const playSuccessSound = () => {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Evita que el Link navegue al hacer clic en el botón
    e.stopPropagation();
    
    if (isAdding) return;
    setIsAdding(true);
    playSuccessSound();

    // Si hay tallas, seleccionamos la primera por defecto, si no, null
    const sizeToAdd = hasSizes && product.availableSizes ? product.availableSizes[0] : null;
    addItem(product, sizeToAdd);
    addToast(`${product.name} añadido al carrito`);

    setTimeout(() => setIsAdding(false), 1500);
  };

  const isList = variant === 'list';

  return (
    <Link 
      to={`/product/${product.id}`} 
      className={`group relative ${isList ? 'flex flex-col sm:flex-row gap-6 bg-white p-5 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300' : 'block bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`relative overflow-hidden bg-gray-100 ${isList ? 'w-full sm:w-48 aspect-[4/5] shrink-0 rounded-xl' : 'aspect-[3/4] w-full'}`}>
        {product.image && !isLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse z-10" />
        )}

        {/* Etiquetas (Badges) - Nuevo / Oferta */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-2 pointer-events-none">
          {product.isNew && (
            <span className="bg-black text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest shadow-sm">
              Nuevo
            </span>
          )}
          {product.discount && (
            <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest shadow-sm">
              -{product.discount}%
            </span>
          )}
        </div>
        
        {product.image ? (
          <>
            <img
              src={product.image}
              alt={product.name}
              className={`w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
              loading="lazy"
              onLoad={() => setIsLoaded(true)}
            />
            {product.images && product.images.length > 1 && (
              <img
                src={product.images[1]}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover object-center opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out"
                loading="lazy"
              />
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
        
        {/* Botones Overlay (Solo visibles en modo Grid) */}
        {!isList && (
          <>
            {/* Botón Vista Rápida (Ojo) - Abajo a la derecha */}
            <div className="absolute bottom-3 right-3 z-20">
              <Tooltip text="Vista rápida">
              <Motion.button
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  openQuickView(product);
                }}
                className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center shadow-md hover:bg-black hover:text-white transition-all"
                aria-label="Vista rápida"
              >
                <Motion.div
                  animate={isHovered ? { scaleY: [1, 0.1, 1] } : { scaleY: 1 }}
                  transition={{
                    duration: 0.35,
                    repeat: Infinity,
                    repeatDelay: 2,
                    ease: "easeInOut"
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </Motion.div>
              </Motion.button>
            </Tooltip>
            </div>

            {/* Botón Favoritos (Corazón) - Abajo a la izquierda */}
            <div className="absolute bottom-3 left-3 z-20">
            <Tooltip text={isInWishlist ? "Eliminar de favoritos" : "Agregar a favoritos"}>
              <Motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ 
                  scale: [1, 1.15, 1],
                  transition: { duration: 0.8, repeat: Infinity }
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleWishlist(product);
                  if (!isInWishlist) addToast("Añadido a favoritos");
                }}
                className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center shadow-md hover:bg-black hover:text-white transition-colors"
                aria-label="Agregar a favoritos"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill={isInWishlist ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${isInWishlist ? 'text-red-500' : 'text-current'}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </Motion.button>
            </Tooltip>
            </div>
          </>
        )}
      </div>
      
      <div className={isList ? 'flex-1 flex flex-col' : 'p-4 flex flex-col h-full'}>
        {!isList && (
           <div className="mb-2">
             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{product.category}</span>
             <div className="flex justify-between items-start mt-1">
               <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-tight pr-2">{product.name}</h3>
               <div className="text-right">
                 <p className={`font-bold text-sm ${product.discount ? 'text-red-600' : 'text-gray-900'}`}>
                   ${product.price.toFixed(2)}
                 </p>
                 {product.discount && (
                   <p className="text-[10px] text-gray-400 line-through">
                     ${(product.price / (1 - product.discount / 100)).toFixed(2)}
                   </p>
                 )}
               </div>
             </div>
           </div>
        )}

        {isList && (
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{product.category}</span>
          </div>
        )}
        
        {isList && <h3 className="text-xl mb-3 font-bold text-gray-900 group-hover:text-gray-600 transition-colors">{product.name}</h3>}
        
        {isList && (
          <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed max-w-2xl">
            {product.description || "Un esencial moderno diseñado para durar. Fabricado con materiales de primera calidad para ofrecer el máximo confort."}
          </p>
        )}

        {/* Tallas (Visible en Grid y List) */}
        {product.availableSizes && product.availableSizes.length > 0 ? (
          <div className={`flex flex-wrap gap-1 ${isList ? 'gap-2 mb-6' : 'mb-4'}`}>
            {product.availableSizes.slice(0, isList ? undefined : 4).map(size => (
              <span key={size} className={`text-[10px] font-medium text-gray-500 bg-gray-100 rounded ${isList ? 'px-2 py-1 border border-gray-100' : 'px-2 py-0.5'}`}>
                {size}
              </span>
            ))}
            {!isList && product.availableSizes.length > 4 && (
               <span className="text-[10px] text-gray-400 px-1">...</span>
            )}
          </div>
        ) : (
           !isList && <div className="mb-4 h-5"></div>
        )}

        {/* Botón Agregar a la Bolsa (Grid) */}
        {!isList && (
          <button
            onClick={handleAddToCart}
            className={`w-full mt-auto py-2.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all flex items-center justify-center gap-2 ${
              isAdding 
                ? 'bg-green-600 text-white' 
                : isInCart
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            {isAdding ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                Añadido
              </>
            ) : (
              "Agregar a la bolsa"
            )}
          </button>
        )}

        {isList && (
        <div className="flex items-center mt-auto justify-between">
          <div className="flex items-baseline gap-2">
            <p className={`font-medium text-2xl ${product.discount ? 'text-red-600' : 'text-gray-900'}`}>
              ${product.price.toFixed(2)}
            </p>
            {product.discount && (
              <p className="text-xs sm:text-sm text-gray-400 line-through">
                ${(product.price / (1 - product.discount / 100)).toFixed(2)}
              </p>
            )}
          </div>

            <div className="flex items-center gap-3">
            <button
              onClick={handleAddToCart}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                isAdding 
                  ? 'bg-green-600 text-white' 
                  : isInCart
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              {isAdding ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span>Añadido</span>
                </>
              ) : (
                <span>Añadir al carrito</span>
              )}
            </button>
            
            <Tooltip text={isInWishlist ? "Eliminar de favoritos" : "Agregar a favoritos"}>
              <Motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ 
                  scale: [1, 1.15, 1],
                  transition: { duration: 0.8, repeat: Infinity }
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleWishlist(product);
                  if (!isInWishlist) addToast("Añadido a favoritos");
                }}
                className="p-2 border border-gray-200 rounded-full hover:bg-gray-50 text-gray-600 transition-colors"
                aria-label="Agregar a favoritos"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill={isInWishlist ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${isInWishlist ? 'text-red-500' : 'text-current'}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </Motion.button>
            </Tooltip>

            <Tooltip text="Vista rápida">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                openQuickView(product);
              }}
              className="p-2 border border-gray-200 rounded-full hover:bg-gray-50 text-gray-600 transition-colors"
              title="Vista rápida"
            >
              <Motion.div
                animate={isHovered ? { scaleY: [1, 0.1, 1] } : { scaleY: 1 }}
                transition={{
                  duration: 0.35,
                  repeat: Infinity,
                  repeatDelay: 2,
                  ease: "easeInOut"
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </Motion.div>
            </button>
            </Tooltip>
            </div>
        </div>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;