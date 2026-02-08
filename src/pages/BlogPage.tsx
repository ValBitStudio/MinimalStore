import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { BLOG_POSTS } from '../data/blogPosts';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import ProductCard from '../features/products/components/ProductCard';
import { PRODUCTS } from '../data/products';
import { Product } from '../types';

const BlogPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Helmet key="blog" defer={false}>
        <title key="title-blog">Blog | MinimalStore</title>
        <meta name="description" content="Historias sobre estilo, sostenibilidad y la vida minimalista." />
      </Helmet>
      <Breadcrumbs items={[{ label: 'Blog' }]} className="mb-8" />
      
      <div className="text-center mb-16">
        <h1 className="text-4xl font-serif font-bold mb-4">Nuestro Blog</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Historias sobre estilo, sostenibilidad y la vida minimalista.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {BLOG_POSTS.map((post, index) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group flex flex-col h-full"
          >
            <Link to={`/blog/${post.id}`} className="block overflow-hidden rounded-2xl mb-4 aspect-[4/3]">
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
            </Link>
            <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
              <span className="bg-gray-100 px-2 py-1 rounded-full text-gray-900 font-medium">{post.category}</span>
              <span>{post.date}</span>
            </div>
            <h2 className="text-xl font-bold mb-3 group-hover:text-gray-600 transition-colors">
              <Link to={`/blog/${post.id}`}>{post.title}</Link>
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">
              {post.excerpt}
            </p>
            <Link to={`/blog/${post.id}`} className="text-sm font-medium underline underline-offset-4 hover:text-gray-600 inline-flex items-center gap-1">
              Leer más
            </Link>
          </motion.article>
        ))}
      </div>

      {/* Productos Destacados */}
      <section className="mt-24 border-t border-gray-100 pt-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-serif font-bold mb-2">Productos Destacados</h2>
            <p className="text-gray-500">Completa tu estilo con nuestros favoritos.</p>
          </div>
          <Link to="/products" className="text-sm font-medium hover:text-gray-600 transition-colors underline underline-offset-4">
            Ver tienda
          </Link>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {(PRODUCTS as Product[]).slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default BlogPage;