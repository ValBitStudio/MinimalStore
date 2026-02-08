import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCartStore, selectTotalItems } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useScroll } from '../../hooks/useScroll';
import { useAuthStore } from '../../store/authStore';
import { AnimatePresence, motion } from 'framer-motion';

const Navbar = () => {
  const { isScrolled, scrollDirection, scrollY } = useScroll(20);
  const { toggleCart } = useCartStore();
  const totalItems = useCartStore(selectTotalItems);
  const { toggleWishlistSidebar, wishlist } = useWishlistStore();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [readingProgress, setReadingProgress] = useState(0);
  const [wishlistBump, setWishlistBump] = useState(false);
  const prevWishlistLength = useRef(wishlist.length);
  
  const navigate = useNavigate();
  const location = useLocation();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const isBlogPost = location.pathname.startsWith('/blog/');
  const isHome = location.pathname === '/';

  const closeMenu = () => setIsMobileMenuOpen(false);

  // Determinar el estado del header para los estilos
  const isHeaderActive = isScrolled || isMobileMenuOpen || isSearchOpen;
  const textColorClass = isHeaderActive || !isHome ? 'text-gray-900' : 'text-white mix-blend-difference';
  const hoverColorClass = isHeaderActive || !isHome ? 'hover:text-gray-600' : 'hover:text-gray-300';

  // Accesibilidad: Focus Trap para el menú móvil
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') closeMenu();
        
        if (e.key === 'Tab' && mobileMenuRef.current) {
          const focusableElements = mobileMenuRef.current.querySelectorAll(
            'a[href], button:not([disabled]), textarea, input, select'
          );
          const firstElement = focusableElements[0] as HTMLElement;
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isMobileMenuOpen]);

  // Auto-focus al abrir el buscador
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
      closeMenu();
    }
  };

  // Lógica de progreso de lectura para posts del blog
  useEffect(() => {
    if (!isBlogPost) return;

    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollTop / docHeight;
      setReadingProgress(progress * 100);
    };

    window.addEventListener('scroll', updateProgress);
    return () => window.removeEventListener('scroll', updateProgress);
  }, [isBlogPost]);

  const isHidden = scrollDirection === 'down' && isScrolled && scrollY > 120 && !isMobileMenuOpen && !isSearchOpen && !isMegaMenuOpen;

  // Efecto de latido para el icono de favoritos
  useEffect(() => {
    if (wishlist.length > prevWishlistLength.current) {
      setWishlistBump(true);
      const timer = setTimeout(() => setWishlistBump(false), 300);
      return () => clearTimeout(timer);
    }
    prevWishlistLength.current = wishlist.length;
  }, [wishlist.length]);

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out transform ${isHidden ? '-translate-y-full' : 'translate-y-0'} ${
        isHeaderActive ? 'bg-white/60 backdrop-blur-xl py-4' : 'bg-transparent py-4'
      }`}
    >
      {/* Barra de Progreso de Lectura */}
      {isBlogPost && (
        <div className="absolute top-0 left-0 w-full h-1 bg-transparent z-[60]">
          <div 
            className="h-full bg-black transition-all duration-150 ease-out"
            style={{ width: `${readingProgress}%` }}
          />
        </div>
      )}

      <div className="container mx-auto px-4">
        <div className={`flex justify-between items-center relative z-50 ${textColorClass}`}>
          {/* Grupo: Menú Hamburguesa y Logotipo */}
          <div className="flex items-center gap-4">
            <button 
              className={`md:hidden p-2 -ml-2 z-50 relative ${textColorClass}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? (
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>

            <Link to="/" className="text-2xl font-serif font-bold tracking-tighter z-50 relative" onClick={closeMenu}>
              MINIMAL.
            </Link>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex gap-8 items-center absolute left-1/2 -translate-x-1/2">
            <Link to="/" className={`text-sm font-medium ${hoverColorClass} transition-colors relative group`}>
              Inicio
              <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-current transition-all duration-300 group-hover:w-full" />
            </Link>
            
            {/* Mega Menu Trigger */}
            <div 
              className="relative group"
              onMouseEnter={() => setIsMegaMenuOpen(true)}
              onMouseLeave={() => setIsMegaMenuOpen(false)}
            >
              <Link 
                to="/products" 
                className={`text-sm font-medium ${hoverColorClass} transition-colors py-4`}
              >
                <span className="relative">
                  Colección
                  <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-current transition-all duration-300 group-hover:w-full" />
                </span>
              </Link>

              {/* Mega Menu Content */}
              <AnimatePresence>
                {isMegaMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-6 w-[600px]"
                  >
                    <div className="bg-white rounded-xl shadow-xl p-6 grid grid-cols-3 gap-6 border border-gray-100">
                      <div className="space-y-4">
                        <h3 className="font-bold text-gray-900 mb-2">Categorías</h3>
                        <Link to="/products?category=Camisetas" className="block text-sm text-gray-600 hover:text-black hover:translate-x-1 transition-all">Camisetas</Link>
                        <Link to="/products?category=Pantalones" className="block text-sm text-gray-600 hover:text-black hover:translate-x-1 transition-all">Pantalones</Link>
                        <Link to="/products?category=Accesorios" className="block text-sm text-gray-600 hover:text-black hover:translate-x-1 transition-all">Accesorios</Link>
                        <Link to="/products?isNew=true" className="block text-sm text-gray-600 hover:text-black hover:translate-x-1 transition-all font-medium text-blue-600">Novedades</Link>
                      </div>
                      <div className="space-y-4">
                        <h3 className="font-bold text-gray-900 mb-2">Destacados</h3>
                        <Link to="/products?sort=desc" className="block text-sm text-gray-600 hover:text-black hover:translate-x-1 transition-all">Más Vendidos</Link>
                        <Link to="/products?discount=true" className="block text-sm text-gray-600 hover:text-black hover:translate-x-1 transition-all text-red-500">Ofertas</Link>
                      </div>
                      <div className="relative rounded-lg overflow-hidden aspect-[3/4]">
                        <img 
                          src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=400&auto=format&fit=crop" 
                          alt="Colección" 
                          className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-black/20" />
                        <span className="absolute bottom-3 left-3 text-white text-xs font-bold uppercase tracking-wider">Nueva Temporada</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link to="/about" className={`text-sm font-medium ${hoverColorClass} transition-colors relative group`}>
              Nosotros
              <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-current transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link to="/blog" className={`text-sm font-medium ${hoverColorClass} transition-colors relative group`}>
              Blog
              <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-current transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link to="/contact" className={`text-sm font-medium ${hoverColorClass} transition-colors relative group`}>
              Contacto
              <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-current transition-all duration-300 group-hover:w-full" />
            </Link>
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-3 md:gap-5 z-50">
            {/* Search Icon */}
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)} 
              className={`${hoverColorClass} transition-colors p-1`}
              aria-label="Buscar"
              aria-expanded={isSearchOpen}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>

            {/* Account Icon */}
            <Link to={isAuthenticated ? "/account" : "/login"} className={`${hoverColorClass} transition-colors p-1 hidden sm:block`} aria-label="Cuenta">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </Link>

            <button onClick={toggleWishlistSidebar} className={`${hoverColorClass} transition-colors p-1 relative`} aria-label="Lista de deseos">
              <motion.div
                animate={wishlistBump ? { scale: [1, 1.4, 1] } : { scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill={wishlist.length > 0 ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${wishlist.length > 0 ? 'text-red-500' : ''}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </motion.div>
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {wishlist.length}
                </span>
              )}
            </button>
            
            <button onClick={toggleCart} className={`${hoverColorClass} transition-colors relative p-1`} aria-label="Carrito de compras">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar Dropdown */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-white border-t border-gray-100 absolute left-0 right-0 top-full shadow-md"
          >
            <div className="container mx-auto px-4 py-4">
              <form onSubmit={handleSearch} className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-full py-3 pl-12 pr-4 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                />
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <button 
                  type="button" 
                  onClick={() => setIsSearchOpen(false)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-500 hover:text-black"
                >
                  ESC
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            ref={mobileMenuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menú principal"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '100vh' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 bg-white z-40 pt-24 px-4 md:hidden overflow-hidden flex flex-col"
          >
            <nav className="flex flex-col gap-8 text-center items-center justify-center h-full pb-32">
              <Link to="/" onClick={closeMenu} className="text-3xl font-serif font-medium hover:text-gray-500 transition-colors">Inicio</Link>
              <Link to="/products" onClick={closeMenu} className="text-3xl font-serif font-medium hover:text-gray-500 transition-colors">Colección</Link>
              <Link to="/about" onClick={closeMenu} className="text-3xl font-serif font-medium hover:text-gray-500 transition-colors">Nosotros</Link>
              <Link to="/blog" onClick={closeMenu} className="text-3xl font-serif font-medium hover:text-gray-500 transition-colors">Blog</Link>
              <Link to="/contact" onClick={closeMenu} className="text-3xl font-serif font-medium hover:text-gray-500 transition-colors">Contacto</Link>
              
              <div className="w-12 h-[1px] bg-gray-200 my-2"></div>
              
              <Link to={isAuthenticated ? "/account" : "/login"} onClick={closeMenu} className="text-xl font-medium hover:text-gray-500 transition-colors flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                {isAuthenticated ? "Mi Cuenta" : "Iniciar Sesión"}
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;