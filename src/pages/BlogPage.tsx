import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { BLOG_POSTS } from '../data/blogPosts';
import BlogCard from '../features/blog/components/BlogCard';

const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  // Extraer categorías únicas de los posts
  const categories = ['Todos', ...Array.from(new Set(BLOG_POSTS.map((post) => post.category)))];

  // Filtrar posts
  const filteredPosts = selectedCategory === 'Todos'
    ? BLOG_POSTS
    : BLOG_POSTS.filter((post) => post.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Helmet>
        <title>Blog | MinimalStore</title>
        <meta name="description" content="Lee nuestros últimos artículos sobre moda, estilo de vida y sostenibilidad." />
      </Helmet>

      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-3 block">Journal</span>
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-gray-900">Historias & Estilo</h1>
        <p className="text-gray-500 text-lg leading-relaxed">
          Explora nuestras últimas reflexiones sobre diseño, sostenibilidad y la vida minimalista.
        </p>
      </div>

      {/* Filtros de Categoría */}
      <div className="flex flex-wrap justify-center gap-3 mb-16">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === category
                ? 'bg-black text-white shadow-md transform scale-105'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
        <AnimatePresence mode='popLayout'>
        {filteredPosts.map((post) => (
          <motion.div
            layout
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
          >
            <BlogCard post={post} />
          </motion.div>
        ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BlogPage;