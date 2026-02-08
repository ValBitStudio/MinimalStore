import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { PRODUCTS } from '../data/products';
import ProductCard from '../features/products/components/ProductCard';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import EmptyState from '../components/ui/EmptyState';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const searchParam = searchParams.get('search');
  const sortParam = searchParams.get('sort');
  const isNewParam = searchParams.get('isNew');
  const discountParam = searchParams.get('discount');

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Extraer categorías únicas
  const categories = ['Todos', ...Array.from(new Set(PRODUCTS.map((p) => p.category)))];
  const activeCategory = categoryParam || 'Todos';

  // Filtrado y Ordenamiento
  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    // 1. Filtro por Categoría
    if (activeCategory !== 'Todos') {
      result = result.filter((p) => p.category === activeCategory);
    }

    // 2. Filtro por Búsqueda
    if (searchParam) {
      const query = searchParam.toLowerCase();
      result = result.filter((p) => 
        p.name.toLowerCase().includes(query) || 
        p.category.toLowerCase().includes(query)
      );
    }

    // 3. Filtros Especiales (Nuevos / Ofertas)
    if (isNewParam === 'true') {
      result = result.filter((p) => p.isNew);
    }
    if (discountParam === 'true') {
      result = result.filter((p) => p.discount);
    }

    // 4. Ordenamiento
    if (sortParam === 'asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortParam === 'desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [activeCategory, searchParam, sortParam, isNewParam, discountParam]);

  const handleCategoryChange = (category: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (category === 'Todos') {
      newParams.delete('category');
    } else {
      newParams.set('category', category);
    }
    setSearchParams(newParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Helmet>
        <title>Colección | MinimalStore</title>
        <meta name="description" content="Explora nuestra colección completa de moda minimalista." />
      </Helmet>

      <Breadcrumbs 
        items={[{ label: 'Colección' }]} 
        className="mb-6"
      />

      <div className="flex flex-col gap-8 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-serif font-bold text-gray-900">
            {activeCategory === 'Todos' ? 'Toda la Colección' : activeCategory}
          </h1>
          <span className="text-sm text-gray-500 hidden md:block">
            {filteredProducts.length} productos encontrados
          </span>
        </div>

        {/* Barra de Herramientas: Filtros y Vistas */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-gray-100 pb-6">
          
          {/* Filtros de Categoría (Scroll horizontal en móvil) */}
          <div className="w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
            <div className="flex gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    activeCategory === cat
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Controles: Texto (Móvil), Sort y View Toggle */}
          <div className="w-full lg:w-auto flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Texto visible solo en móvil para evitar huecos */}
            <span className="text-sm text-gray-500 md:hidden self-start sm:self-center">
              Mostrando {filteredProducts.length} de {PRODUCTS.length} productos
            </span>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              {/* Selector de Orden */}
              <select 
                value={sortParam || ''}
                onChange={(e) => {
                  const newParams = new URLSearchParams(searchParams);
                  if (e.target.value) newParams.set('sort', e.target.value);
                  else newParams.delete('sort');
                  setSearchParams(newParams);
                }}
                className="bg-transparent text-sm font-medium text-gray-700 focus:outline-none cursor-pointer border-none ring-0"
              >
                <option value="">Relevancia</option>
                <option value="asc">Precio: Menor a Mayor</option>
                <option value="desc">Precio: Mayor a Menor</option>
              </select>

              <div className="w-px h-4 bg-gray-300 mx-2" />

              {/* Toggle Vista */}
              <div className="flex bg-gray-100 p-1 rounded-lg">
                <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-black' : 'text-gray-400 hover:text-gray-600'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>
                </button>
                <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-black' : 'text-gray-400 hover:text-gray-600'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de Productos */}
      {filteredProducts.length > 0 ? (
        <div className={viewMode === 'grid' ? "grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-8 md:gap-y-12" : "flex flex-col gap-6"}>
          <AnimatePresence mode='popLayout'>
            {filteredProducts.map((product) => (
              <motion.div layout key={product.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ProductCard product={product} variant={viewMode} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <EmptyState title="No se encontraron productos" description="Intenta ajustar tus filtros o búsqueda." actionLabel="Ver todo" onAction={() => { setSearchParams({}); }} />
      )}
    </div>
  );
};

export default ProductsPage;