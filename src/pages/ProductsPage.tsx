import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import ProductCard from '../features/products/components/ProductCard';
import { PRODUCTS } from '../data/products';
import { Product } from '../types';
import { useToastStore } from '../store/toastStore';

const CATEGORIES = ['Todos', 'Camisetas', 'Pantalones', 'Accesorios'];
const SIZES = ['S', 'M', 'L', 'XL'];
const COLORS = ['Negro', 'Blanco', 'Beige'];
const ITEMS_PER_PAGE = 8;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

const gridVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const listVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } }
};

// Componente Skeleton para simular la carga de una tarjeta de producto
const ProductSkeleton = () => (
  <div>
    <div className="aspect-[3/4] w-full bg-gray-100 rounded-lg animate-pulse mb-4" />
    <div className="h-4 w-2/3 bg-gray-100 rounded animate-pulse mb-2" />
    <div className="h-4 w-1/3 bg-gray-100 rounded animate-pulse" />
  </div>
);

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const addToast = useToastStore((state) => state.addToast);
  
  // Calcular el precio máximo real basado en los productos existentes
  const maxProductPrice = Math.ceil(Math.max(...(PRODUCTS as Product[]).map(p => p.price), 0)) || 200;

  // Inicializar estados leyendo los parámetros de la URL
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || 'Todos');
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('search') || '');
  const [sortOrder, setSortOrder] = useState<string>(searchParams.get('sort') || 'asc');
  const [selectedSizes, setSelectedSizes] = useState<string[]>(() => {
    const sizes = searchParams.get('sizes');
    return sizes ? sizes.split(',') : [];
  });
  const [selectedColors, setSelectedColors] = useState<string[]>(() => {
    const colors = searchParams.get('colors');
    return colors ? colors.split(',') : [];
  });
  const [priceRange, setPriceRange] = useState<{ min: number; max: number | '' }>(() => {
    const min = searchParams.get('minPrice');
    const max = searchParams.get('maxPrice');
    return { min: min ? Number(min) : 0, max: max ? Number(max) : '' };
  });
  const [showDiscounted, setShowDiscounted] = useState<boolean>(searchParams.get('discount') === 'true');
  const [showInStock, setShowInStock] = useState<boolean>(searchParams.get('stock') === 'true');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => {
    const savedMode = localStorage.getItem('viewMode');
    return (savedMode === 'list' || savedMode === 'grid') ? savedMode : 'grid';
  });
  const [visibleCount, setVisibleCount] = useState<number>(ITEMS_PER_PAGE);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [showCategories, setShowCategories] = useState<boolean>(false);
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const lastScrollY = useRef<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const visible = currentScrollY <= 100 || currentScrollY < lastScrollY.current;
      setIsHeaderVisible(visible);
      lastScrollY.current = currentScrollY;
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Persistir el modo de vista en localStorage
  useEffect(() => {
    localStorage.setItem('viewMode', viewMode);
  }, [viewMode]);

  // Simular carga inicial de datos (Skeleton Effect)
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // 1 segundo de carga simulada
    return () => clearTimeout(timer);
  }, []);

  // Sincronizar estado de filtros con la URL (Persistencia)
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory !== 'Todos') params.set('category', selectedCategory);
    if (searchQuery) params.set('search', searchQuery);
    if (sortOrder !== 'asc') params.set('sort', sortOrder);
    if (selectedSizes.length > 0) params.set('sizes', selectedSizes.join(','));
    if (selectedColors.length > 0) params.set('colors', selectedColors.join(','));
    if (priceRange.min > 0) params.set('minPrice', priceRange.min.toString());
    if (priceRange.max !== '') params.set('maxPrice', priceRange.max.toString());
    if (showDiscounted) params.set('discount', 'true');
    if (showInStock) params.set('stock', 'true');
    
    setSearchParams(params, { replace: true });
  }, [selectedCategory, searchQuery, sortOrder, selectedSizes, selectedColors, priceRange, showDiscounted, showInStock, setSearchParams]);

  const clearFilters = () => {
    setSelectedCategory('Todos');
    setSearchQuery('');
    setSortOrder('asc');
    setPriceRange({ min: 0, max: '' });
    setShowDiscounted(false);
    setShowInStock(false);
    setSelectedSizes([]);
    setSelectedColors([]);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const removeFilter = (type: string, value: string | number) => {
    switch (type) {
      case 'category':
        setSelectedCategory('Todos');
        break;
      case 'search':
        setSearchQuery('');
        break;
      case 'size':
        setSelectedSizes((prev) => prev.filter((s) => s !== value));
        break;
      case 'color':
        setSelectedColors((prev) => prev.filter((c) => c !== value));
        break;
      case 'price':
        setPriceRange({ min: 0, max: '' });
        break;
      case 'discount':
        setShowDiscounted(false);
        break;
      case 'stock':
        setShowInStock(false);
        break;
    }
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const filteredProducts = (PRODUCTS as Product[]).filter(product => {
    const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = product.price >= priceRange.min && (priceRange.max === '' || product.price <= priceRange.max);
    const matchesDiscount = !showDiscounted || (product.discount !== undefined && product.discount > 0);
    const matchesStock = !showInStock || (product.inStock === true);
    const matchesSize = selectedSizes.length === 0 || (product.availableSizes?.some(s => selectedSizes.includes(s)) ?? false);
    const matchesColor = selectedColors.length === 0 || (product.availableColors?.some(c => selectedColors.includes(c)) ?? false);
    return matchesCategory && matchesSearch && matchesPrice && matchesSize && matchesColor && matchesDiscount && matchesStock;
  }).sort((a, b) => {
    return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
  });

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  const hasActiveFilters = selectedCategory !== 'Todos' || 
    searchQuery !== '' || 
    selectedSizes.length > 0 || 
    selectedColors.length > 0 || 
    (priceRange.min !== 0 || priceRange.max !== '') ||
    showDiscounted ||
    showInStock;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    addToast('Enlace copiado al portapapeles');
    setIsShareModalOpen(false);
  };

  return (
    <div>
      <Helmet key="products" defer={false}>
        <title key="title-products">Colección | MinimalStore</title>
        <meta name="description" content="Explora todos nuestros productos de diseño minimalista y atemporal." />
      </Helmet>
      {/* Spacer to prevent content jump */}
      <div className="h-24" />

      {/* Smart Sticky Filter Bar */}
      <div className={`fixed left-0 right-0 z-40 transition-all duration-500 ease-in-out ${
        isHeaderVisible ? 'top-[85px] translate-y-0 opacity-100' : 'top-[85px] -translate-y-[150%] opacity-0 pointer-events-none'
      }`}>
        <div className="container mx-auto px-4 py-3 lg:py-4">
        
        {/* Mobile Layout (< lg) */}
        <div className="lg:hidden flex flex-col gap-3">
          {/* Search Bar */}
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleCount(ITEMS_PER_PAGE);
              }}
              className="w-full bg-white/70 backdrop-blur-md border border-gray-200/50 shadow-sm rounded-full py-2 px-4 pl-10 focus:outline-none focus:border-black focus:bg-white transition-all text-sm"
            />
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>

          {/* Buttons Row */}
          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
            <Motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsShareModalOpen(true)}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-black text-white shadow-sm hover:shadow-md transition-all shrink-0"
              aria-label="Compartir búsqueda"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
              </svg>
            </Motion.button>

            {/* Toggle Vista Grid/List Mobile */}
            <div className="flex bg-gray-100/80 backdrop-blur-md rounded-full p-1 gap-1 border border-gray-200/50 shrink-0">
              <button 
                onClick={() => setViewMode('grid')} 
                className={`p-1.5 rounded-full transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-black' : 'text-gray-400 hover:text-gray-600'}`}
                aria-label="Vista de cuadrícula"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>
              </button>
              <button 
                onClick={() => setViewMode('list')} 
                className={`p-1.5 rounded-full transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-black' : 'text-gray-400 hover:text-gray-600'}`}
                aria-label="Vista de lista"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
              </button>
            </div>

            <Motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowCategories(!showCategories);
                setShowFilters(false);
              }}
              className={`flex-1 flex items-center justify-center gap-2 text-sm font-medium border border-gray-200/50 bg-white/70 backdrop-blur-md shadow-sm px-4 py-2 rounded-full hover:bg-white transition-all whitespace-nowrap ${showCategories ? 'ring-2 ring-black' : ''}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
              Categorías
            </Motion.button>

            <Motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowFilters(!showFilters);
                setShowCategories(false);
              }}
              className={`flex-1 flex items-center justify-center gap-2 text-sm font-medium border border-gray-200/50 bg-white/70 backdrop-blur-md shadow-sm px-4 py-2 rounded-full hover:bg-white transition-all whitespace-nowrap ${showFilters ? 'ring-2 ring-black' : ''}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
              </svg>
              Filtros
            </Motion.button>
          </div>
        </div>

        {/* Desktop Layout (>= lg) */}
        <div className="hidden lg:flex flex-row justify-between items-center gap-4">
          {/* Categorías (Izquierda) */}
          <div className="w-auto">
            <div className="flex gap-2 lg:flex-wrap min-w-max">
            {CATEGORIES.map(category => (
              <Motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedCategory(category);
                  setVisibleCount(ITEMS_PER_PAGE);
                }}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all backdrop-blur-md ${
                  selectedCategory === category
                    ? 'bg-black text-white shadow-lg'
                    : 'bg-white/70 text-gray-700 hover:bg-white border border-gray-200/50 shadow-sm'
                }`}
              >
                {category}
              </Motion.button>
            ))}
            </div>
          </div>

          {/* Buscador y Filtros (Derecha) */}
          <div className="flex items-center gap-3 w-auto justify-end">
            {/* Share Button Desktop */}
            <Motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsShareModalOpen(true)}
              className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full bg-black text-white shadow-sm hover:shadow-md transition-all"
              title="Compartir búsqueda"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
              </svg>
            </Motion.button>

            {/* Toggle Vista Grid/List */}
            <div className="hidden sm:flex bg-gray-100/80 backdrop-blur-md rounded-full p-1 gap-1 border border-gray-200/50">
              <button 
                onClick={() => setViewMode('grid')} 
                className={`p-1.5 rounded-full transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-black' : 'text-gray-400 hover:text-gray-600'}`}
                aria-label="Vista de cuadrícula"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>
              </button>
              <button 
                onClick={() => setViewMode('list')} 
                className={`p-1.5 rounded-full transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-black' : 'text-gray-400 hover:text-gray-600'}`}
                aria-label="Vista de lista"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
              </button>
            </div>

            <Motion.div 
              animate={{ width: isSearchFocused ? 280 : 200 }}
              className="relative hidden sm:block"
            >
              <input
                type="text"
                placeholder="Buscar..."
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setVisibleCount(ITEMS_PER_PAGE);
                }}
                className="w-full bg-white/70 backdrop-blur-md border border-gray-200/50 shadow-sm rounded-full py-2 px-4 pl-10 focus:outline-none focus:border-black focus:bg-white transition-all text-sm"
              />
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </Motion.div>

            <Motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-sm font-medium border border-gray-200/50 bg-white/70 backdrop-blur-md shadow-sm px-4 py-2 rounded-full hover:bg-white transition-all whitespace-nowrap"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
              </svg>
              {showFilters ? 'Ocultar' : 'Filtros'}
            </Motion.button>
          </div>
        </div>

        {/* Mobile Categories Panel */}
        <AnimatePresence>
          {showCategories && (
            <Motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="mt-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map(category => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        setVisibleCount(ITEMS_PER_PAGE);
                        setShowCategories(false);
                      }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors text-center ${
                        selectedCategory === category
                          ? 'bg-black text-white'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </Motion.div>
          )}
        </AnimatePresence>

        {/* Filtros Panel */}
        <AnimatePresence>
          {showFilters && (
            <Motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                
                {/* Header del panel */}
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-medium text-gray-900">Opciones de filtrado</h3>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-gray-500 hover:text-black underline underline-offset-4 transition-colors"
                  >
                    Limpiar todo
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  
                  {/* 1. Ordenar */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700">Ordenar por</label>
                    <div className="relative">
                      <select
                        value={sortOrder}
                        onChange={(e) => {
                          setSortOrder(e.target.value);
                          setVisibleCount(ITEMS_PER_PAGE);
                        }}
                        className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block p-2.5 pr-8 outline-none transition-shadow cursor-pointer"
                      >
                        <option value="asc">Precio: Bajo a Alto</option>
                        <option value="desc">Precio: Alto a Bajo</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                      </div>
                    </div>
                  </div>

                  {/* 2. Precio */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700">Precio</label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                        <input
                          type="number"
                          placeholder="0"
                          value={priceRange.min}
                          onChange={(e) => {
                            setPriceRange({ ...priceRange, min: Number(e.target.value) });
                            setVisibleCount(ITEMS_PER_PAGE);
                          }}
                          className="w-full bg-white border border-gray-200 rounded-lg py-2 pl-6 pr-2 text-sm outline-none focus:border-black transition-colors"
                          min="0"
                        />
                      </div>
                      <span className="text-gray-400">-</span>
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                        <input
                          type="number"
                          placeholder={maxProductPrice.toString()}
                          value={priceRange.max}
                          onChange={(e) => {
                            setPriceRange({ ...priceRange, max: e.target.value === '' ? '' : Number(e.target.value) });
                            setVisibleCount(ITEMS_PER_PAGE);
                          }}
                          className="w-full bg-white border border-gray-200 rounded-lg py-2 pl-6 pr-2 text-sm outline-none focus:border-black transition-colors"
                          min="0"
                        />
                      </div>
                    </div>
                    
                    {/* Toggles: Ofertas y Stock */}
                    <div className="pt-2 flex flex-col gap-2">
                       <label className="inline-flex items-center cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={showDiscounted}
                          onChange={(e) => {
                            setShowDiscounted(e.target.checked);
                            setVisibleCount(ITEMS_PER_PAGE);
                          }}
                        />
                        <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-black"></div>
                        <span className="ml-3 text-sm font-medium text-gray-700">Solo Ofertas</span>
                      </label>

                      <label className="inline-flex items-center cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={showInStock}
                          onChange={(e) => {
                            setShowInStock(e.target.checked);
                            setVisibleCount(ITEMS_PER_PAGE);
                          }}
                        />
                        <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-black"></div>
                        <span className="ml-3 text-sm font-medium text-gray-700">Solo Stock</span>
                      </label>
                    </div>
                  </div>

                  {/* 3. Tallas */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700">Tallas</label>
                    <div className="flex flex-wrap gap-2">
                      {SIZES.map(size => (
                        <button
                          key={size}
                          onClick={() => {
                            setSelectedSizes(prev => 
                              prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
                            );
                            setVisibleCount(ITEMS_PER_PAGE);
                          }}
                          className={`w-8 h-8 rounded-full text-xs font-medium border transition-all flex items-center justify-center ${
                            selectedSizes.includes(size)
                              ? 'bg-black text-white border-black'
                              : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 4. Colores */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700">Colores</label>
                    <div className="flex flex-wrap gap-2">
                      {COLORS.map(color => (
                        <button
                          key={color}
                          onClick={() => {
                            setSelectedColors(prev => 
                              prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
                            );
                            setVisibleCount(ITEMS_PER_PAGE);
                          }}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                            selectedColors.includes(color)
                              ? 'bg-black text-white border-black'
                              : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </Motion.div>
          )}
        </AnimatePresence>
        </div>
      </div>

      {/* Active Filters Pills */}
      <AnimatePresence>
        {hasActiveFilters && (
          <Motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="container mx-auto px-4 mb-6 pt-4"
          >
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-500 mr-2">Filtros activos:</span>
              
              {selectedCategory !== 'Todos' && (
                <button onClick={() => removeFilter('category', selectedCategory)} className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1 transition-colors">
                  {selectedCategory}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>
                </button>
              )}

              {searchQuery && (
                <button onClick={() => removeFilter('search', searchQuery)} className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1 transition-colors">
                  Búsqueda: "{searchQuery}"
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>
                </button>
              )}

              {(priceRange.min !== 0 || priceRange.max !== '') && (
                <button onClick={() => removeFilter('price', 0)} className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1 transition-colors">
                  Precio: ${priceRange.min} - ${priceRange.max === '' ? maxProductPrice : priceRange.max}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>
                </button>
              )}

              {showDiscounted && (
                <button onClick={() => removeFilter('discount', 0)} className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1 transition-colors">
                  Solo Ofertas
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>
                </button>
              )}

              {showInStock && (
                <button onClick={() => removeFilter('stock', 0)} className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1 transition-colors">
                  Solo Stock
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>
                </button>
              )}

              {selectedSizes.map(size => (
                <button key={size} onClick={() => removeFilter('size', size)} className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1 transition-colors">
                  Talla: {size}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>
                </button>
              ))}

              {selectedColors.map(color => (
                <button key={color} onClick={() => removeFilter('color', color)} className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1 transition-colors">
                  Color: {color}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>
                </button>
              ))}

              <button onClick={clearFilters} className="text-xs text-red-500 hover:text-red-700 underline ml-2">
                Limpiar todo
              </button>
            </div>
          </Motion.div>
        )}
      </AnimatePresence>

      {/* Contador de Resultados */}
      {!isLoading && (
        <div className="mb-6 text-sm text-gray-500">
          Mostrando <span className="font-medium text-black">{visibleProducts.length}</span> de <span className="font-medium text-black">{filteredProducts.length}</span> productos
        </div>
      )}

      {/* Grid de Productos */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {Array.from({ length: 8 }).map((_, index) => (
            <ProductSkeleton key={index} />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-24">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No encontramos coincidencias</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-8">
            {searchQuery 
              ? <>No encontramos resultados para <span className="font-medium text-gray-900">"{searchQuery}"</span>. Intenta con otros términos.</>
              : "No hay productos que coincidan con esta combinación de filtros. Prueba eliminando algunos."}
          </p>
          <button 
            onClick={clearFilters}
            className="bg-black text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm"
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <>
          <AnimatePresence mode="wait">
            <Motion.div
              key={`${selectedCategory}-${viewMode}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={viewMode === 'grid' ? "grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8" : "grid grid-cols-1 lg:grid-cols-2 gap-4"}
            >
              {visibleProducts.map((product) => (
                <Motion.div key={product.id} layout variants={viewMode === 'grid' ? gridVariants : listVariants} initial="hidden" animate="visible">
                  <ProductCard product={product} variant={viewMode} />
                </Motion.div>
              ))}
            </Motion.div>
          </AnimatePresence>

          {visibleCount < filteredProducts.length && (
            <div className="mt-12 text-center">
              <button
                onClick={handleLoadMore}
                className="bg-white border border-gray-200 text-gray-900 px-8 py-3 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cargar más
              </button>
            </div>
          )}
        </>
      )}

      {/* Share Modal */}
      <AnimatePresence>
        {isShareModalOpen && (
          <>
            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsShareModalOpen(false)}
              className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
            />
            <Motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-white p-6 rounded-2xl shadow-2xl z-[70]"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold">Compartir búsqueda</h3>
                <button onClick={() => setIsShareModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-4 gap-4 mb-6">
                {/* Facebook */}
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 group">
                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                  </div>
                  <span className="text-xs text-gray-600">Facebook</span>
                </a>
                
                {/* Twitter / X */}
                <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent("¡Mira esta colección en MinimalStore!")}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 group">
                  <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z"/></svg>
                  </div>
                  <span className="text-xs text-gray-600">Twitter</span>
                </a>

                {/* WhatsApp */}
                <a href={`https://wa.me/?text=${encodeURIComponent("¡Mira esta colección en MinimalStore! " + window.location.href)}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 group">
                  <div className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/></svg>
                  </div>
                  <span className="text-xs text-gray-600">WhatsApp</span>
                </a>

                {/* Email */}
                <a href={`mailto:?subject=${encodeURIComponent("Colección MinimalStore")}&body=${encodeURIComponent("¡Mira esta colección que encontré! " + window.location.href)}`} className="flex flex-col items-center gap-2 group">
                  <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform group-hover:bg-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  </div>
                  <span className="text-xs text-gray-600">Email</span>
                </a>
              </div>

              <div className="relative">
                <input 
                  type="text" 
                  readOnly 
                  value={window.location.href} 
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 pl-4 pr-12 text-sm text-gray-600 focus:outline-none"
                />
                <button 
                  onClick={handleCopyLink}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white border border-gray-200 rounded-md hover:bg-gray-50 text-gray-600 transition-colors"
                  title="Copiar enlace"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                </button>
              </div>
            </Motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductsPage;