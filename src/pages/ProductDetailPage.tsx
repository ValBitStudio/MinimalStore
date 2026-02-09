import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { PRODUCTS } from '../data/products';
import { useCartStore } from '../store/cartStore';
import { useToastStore } from '../store/toastStore';
import { useWishlistStore } from '../store/wishlistStore';
import ProductCard from '../features/products/components/ProductCard';
import { Product } from '../types';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import Skeleton from '../components/ui/Skeleton';

interface ColorOption {
  name: string;
  class: string;
  ring: string;
  text: string;
  bgImage: string;
}

const SIZES = ['S', 'M', 'L', 'XL'];
const COLORS: ColorOption[] = [
  { name: 'Negro', class: 'bg-black', ring: 'ring-black', text: 'text-white', bgImage: 'bg-gray-900' },
  { name: 'Blanco', class: 'bg-white border border-gray-200', ring: 'ring-gray-300', text: 'text-gray-900', bgImage: 'bg-gray-100' },
  { name: 'Beige', class: 'bg-[#e5e5d0]', ring: 'ring-[#e5e5d0]', text: 'text-gray-900', bgImage: 'bg-[#f0f0e0]' },
];

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const wishlist = useWishlistStore((state) => state.wishlist);
  const addToast = useToastStore((state) => state.addToast);
  
  const getCurrentProduct = () => (PRODUCTS as Product[]).find((p) => p.id === parseInt(id || '0'));

  const [selectedImage, setSelectedImage] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [isZoomed, setIsZoomed] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 });
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const mainImageRef = useRef<HTMLImageElement>(null);
  
  const [selectedSize, setSelectedSize] = useState(() => {
    const product = getCurrentProduct();
    return product?.availableSizes?.[0] || SIZES[0];
  });

  const [selectedColor, setSelectedColor] = useState<ColorOption>(() => {
    const product = getCurrentProduct();
    if (product?.availableColors?.[0]) {
      return COLORS.find(c => c.name === product.availableColors![0]) || COLORS[0];
    }
    return COLORS[0];
  });

  useEffect(() => {
    window.scrollTo(0, 0);

    const currentProduct = (PRODUCTS as Product[]).find((p) => p.id === parseInt(id || '0'));
    
    if (currentProduct) {
      // Resetear selección de Talla
      setSelectedSize(currentProduct.availableSizes?.[0] || SIZES[0]);
      
      // Resetear selección de Color
      const newColor = currentProduct.availableColors?.[0] 
        ? COLORS.find(c => c.name === currentProduct.availableColors![0]) || COLORS[0]
        : COLORS[0];
      setSelectedColor(newColor);

      // Resetear UI (Galería, Zoom, Tabs)
      setSelectedImage(0);
      setIsZoomed(false);
      setActiveTab('description');
    }
  }, [id]);

  useEffect(() => {
    setIsImageLoaded(false);
    setImageError(false);
    // Verificar si la imagen ya está en caché al cambiar
    if (mainImageRef.current && mainImageRef.current.complete) {
      setIsImageLoaded(true);
    }
  }, [selectedImage, id]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        imageContainerRef.current && 
        event.target instanceof Node && 
        !imageContainerRef.current.contains(event.target)
      ) {
        setIsZoomed(false);
      }
    };

    if (isZoomed) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isZoomed]);

  const product = (PRODUCTS as Product[]).find((p) => p.id === parseInt(id || '0'));

  if (!product) {
    return <div className="text-center py-20">Producto no encontrado</div>;
  }

  const relatedProducts = (PRODUCTS as Product[]).filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  const hasSizes = (product.availableSizes?.length ?? 0) > 0;

  const isSizeAvailable = product.availableSizes?.includes(selectedSize) ?? true;
  const isColorAvailable = product.availableColors?.includes(selectedColor.name) ?? true;
  const isStockAvailable = (product.inStock !== false) && isSizeAvailable && isColorAvailable;
  const isWishlist = wishlist.some((item: Product) => item.id === product.id);

  const sizeModifier = product.priceModifiers?.size?.[selectedSize] || 0;
  const colorModifier = product.priceModifiers?.color?.[selectedColor.name] || 0;
  const currentPrice = product.price + sizeModifier + colorModifier;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return; // Solo calcular si está en modo zoom
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setCursorPos({ x, y });
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImage((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImage((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const galleryImages = product.images && product.images.length > 0 
    ? product.images.map((src, index) => ({ id: index, src, label: `Vista ${index + 1}`, bg: '', text: '' }))
    : [
    { id: 0, label: 'Vista Frontal', bg: selectedColor.bgImage, text: selectedColor.text, src: '' },
    { id: 1, label: 'Vista Lateral', bg: selectedColor.bgImage, text: selectedColor.text, src: '' },
    { id: 2, label: 'Detalle Tejido', bg: selectedColor.bgImage, text: selectedColor.text, src: '' },
    { id: 3, label: 'Lifestyle', bg: selectedColor.bgImage, text: selectedColor.text, src: '' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Helmet key={`product-${id}`} defer={false}>
        <title>{`${product.name} | MinimalStore`}</title>
        <meta name="description" content={product.description || `Compra ${product.name} al mejor precio en MinimalStore.`} />
        
        <meta property="og:type" content="product" />
        <meta property="og:title" content={product.name} />
        <meta property="og:description" content={product.description || `Detalles de ${product.name}`} />
        <meta property="og:image" content={product.image} />
        <meta property="og:url" content={window.location.href} />
        <meta property="product:price:amount" content={currentPrice.toFixed(2)} />
        <meta property="product:price:currency" content="USD" />
      </Helmet>

      <Breadcrumbs items={[
        { label: 'Productos', path: '/products' },
        { label: product.name }
      ]} className="mb-8" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex md:flex-col gap-4 order-last md:order-first overflow-x-auto md:overflow-visible md:w-24 shrink-0 scrollbar-hide">
            {galleryImages.map((img, index) => (
              <button
                key={img.id}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square w-20 md:w-full rounded-md flex items-center justify-center overflow-hidden text-xs font-medium transition-all shrink-0 ${img.bg || ''} ${img.text || ''} ${selectedImage === index ? 'ring-2 ring-black ring-offset-2' : 'opacity-60 hover:opacity-100'}`}
              >
                {img.src ? (
                  <img src={img.src} alt={img.label} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  img.label
                )}
              </button>
            ))}
          </div>

          <div 
            ref={imageContainerRef}
            className={`flex-1 aspect-square w-full rounded-lg overflow-hidden bg-gray-100 relative ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
            onClick={toggleZoom}
            onMouseMove={handleMouseMove}
          >
            {(galleryImages[selectedImage].src || (selectedImage === 0 && product.image)) && !isImageLoaded && (
              <Skeleton className="absolute inset-0 z-10 w-full h-full rounded-none" />
            )}

            {galleryImages[selectedImage].src || (selectedImage === 0 && product.image) ? (
              <img 
                ref={mainImageRef}
                key={`${id}-${selectedImage}`}
                src={imageError ? "https://placehold.co/600x600/f3f4f6/9ca3af?text=No+Image" : (galleryImages[selectedImage].src || product.image)}
                alt={product.name} 
                className={`w-full h-full object-cover object-center transition-transform duration-200 ease-out ${isZoomed ? 'scale-[2]' : 'scale-100'} ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                style={{ transformOrigin: `${cursorPos.x}% ${cursorPos.y}%` }}
                loading="eager"
                onError={() => {
                  setImageError(true);
                  setIsImageLoaded(true);
                }}
                onLoad={() => setIsImageLoaded(true)}
              />
            ) : (
              <div 
                className={`w-full h-full flex items-center justify-center text-2xl font-light transition-transform duration-200 ease-out ${isZoomed ? 'scale-[2]' : 'scale-100'} ${galleryImages[selectedImage].bg} ${galleryImages[selectedImage].text}`}
                style={{ transformOrigin: `${cursorPos.x}% ${cursorPos.y}%` }}
              >
                {galleryImages[selectedImage].label}
              </div>
            )}

            {galleryImages.length > 1 && (
              <>
                <button 
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-gray-900 shadow-sm transition-all z-10 opacity-0 group-hover:opacity-100 hover:scale-110"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-gray-900 shadow-sm transition-all z-10 opacity-0 group-hover:opacity-100 hover:scale-110"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                </button>
              </>
            )}
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
          <div className="flex items-baseline gap-3 mb-6">
            <p className={`text-2xl font-medium ${product.discount ? 'text-red-600' : 'text-gray-900'}`}>
              ${currentPrice.toFixed(2)}
            </p>
            {product.discount && (
              <>
                <p className="text-lg text-gray-400 line-through">
                  ${(currentPrice / (1 - product.discount / 100)).toFixed(2)}
                </p>
                <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                  -{product.discount}%
                </span>
              </>
            )}
          </div>
          
          <div className="flex border-b border-gray-200 mb-6">
            {['description', 'details', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 px-1 mr-6 text-sm font-medium transition-colors relative ${
                  activeTab === tab ? 'text-black' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab === 'description' && 'Descripción'}
                {tab === 'details' && 'Detalles'}
                {tab === 'reviews' && 'Reseñas'}
                {activeTab === tab && (
                  <Motion.span 
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-black" 
                  />
                )}
              </button>
            ))}
          </div>

          <div className="mb-8 min-h-[120px]">
            <AnimatePresence mode='wait'>
              {activeTab === 'description' && (
                <Motion.div
                  key="description"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="prose prose-sm text-gray-500"
                >
                  <p>
                    Este es un producto esencial de nuestra colección {product.category}. 
                    Diseñado con materiales de alta calidad para durar y ofrecer el máximo confort.
                    Ideal para combinar con cualquier estilo minimalista.
                  </p>
                </Motion.div>
              )}
              {activeTab === 'details' && (
                <Motion.div
                  key="details"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm text-gray-500 space-y-2"
                >
                  <p><span className="font-medium text-gray-900">Material:</span> 100% Algodón Orgánico</p>
                  <p><span className="font-medium text-gray-900">Peso:</span> 180g/m²</p>
                  <p><span className="font-medium text-gray-900">Cuidado:</span> Lavar a máquina en frío</p>
                  <p><span className="font-medium text-gray-900">Origen:</span> Fabricado en Portugal</p>
                </Motion.div>
              )}
              {activeTab === 'reviews' && (
                <Motion.div
                  key="reviews"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex text-yellow-400 text-sm">★★★★★</div>
                    <span className="text-xs text-gray-500">(4.8/5)</span>
                  </div>
                  <div className="text-sm text-gray-500 border-b border-gray-100 pb-2">
                    <p className="font-medium text-gray-900 mb-1">Excelente calidad</p>
                    <p>Me encanta el tejido y cómo queda. Definitivamente compraré más colores.</p>
                    <p className="text-xs text-gray-400 mt-1">Juan P. - Hace 2 días</p>
                  </div>
                </Motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Color: <span className="text-gray-500 font-normal">{selectedColor.name}</span></h3>
            <div className="flex gap-3">
              {COLORS.map((color) => {
                const isAvailable = product.availableColors ? product.availableColors.includes(color.name) : true;
                return (
                  <button
                    key={color.name}
                    onClick={() => isAvailable && setSelectedColor(color)}
                    disabled={!isAvailable}
                    className={`w-10 h-10 rounded-full focus:outline-none transition-all ${color.class} ${
                      selectedColor.name === color.name 
                        ? `ring-2 ring-offset-2 ${color.ring}` 
                        : isAvailable 
                          ? 'hover:scale-110' 
                          : 'opacity-20 cursor-not-allowed ring-1 ring-gray-200'
                    }`}
                    aria-label={`Seleccionar color ${color.name}`}
                  />
                );
              })}
            </div>
          </div>

          {hasSizes && (
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Talla</h3>
              <div className="flex gap-3">
                {SIZES.map((size) => {
                  const isAvailable = product.availableSizes ? product.availableSizes.includes(size) : true;
                  return (
                    <button
                      key={size}
                      onClick={() => isAvailable && setSelectedSize(size)}
                      disabled={!isAvailable}
                      className={`w-12 h-12 rounded-full flex items-center justify-center border text-sm font-medium transition-all ${
                        selectedSize === size
                          ? 'border-black bg-black text-white'
                          : isAvailable
                            ? 'border-gray-200 text-gray-900 hover:border-gray-300 cursor-pointer'
                            : 'border-gray-100 text-gray-300 cursor-not-allowed bg-gray-50 decoration-slice line-through opacity-60'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={() => {
                addItem({ ...product, price: currentPrice, color: selectedColor.name }, hasSizes ? selectedSize : null);
                addToast(`${product.name} añadido al carrito`);
              }}
              disabled={!isStockAvailable}
              className={`flex-1 py-4 rounded-full font-medium transition-colors ${
                isStockAvailable 
                  ? 'bg-black text-white hover:bg-gray-800' 
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isStockAvailable ? 'Añadir a la Bolsa' : 'Agotado'}
            </button>
            <button 
              onClick={() => {
                toggleWishlist(product);
                addToast(isWishlist ? 'Eliminado de favoritos' : 'Añadido a favoritos', 'info');
              }}
              className="w-14 h-14 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill={isWishlist ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${isWishlist ? 'text-red-500' : 'text-gray-900'}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="border-t border-gray-100 pt-16">
          <h2 className="text-2xl font-bold mb-8">También te podría gustar</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {relatedProducts.map((related) => (
              <ProductCard key={related.id} product={related} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;