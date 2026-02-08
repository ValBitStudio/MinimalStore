import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const categories = [
  {
    id: 1,
    name: 'Camisetas',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
    link: '/products?category=Camisetas'
  },
  {
    id: 2,
    name: 'Pantalones',
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80',
    link: '/products?category=Pantalones'
  },
  {
    id: 3,
    name: 'Accesorios',
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80',
    link: '/products?category=Accesorios'
  }
];

const CategoryGrid = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-serif font-bold text-center mb-12">Explora por Categoría</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <Link key={cat.id} to={cat.link} className="group relative h-96 overflow-hidden rounded-lg cursor-pointer block">
              <div className="absolute inset-0 bg-gray-200">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.h3
                  whileHover={{ scale: 1.1 }}
                  className="text-white text-3xl font-bold tracking-wider uppercase"
                >
                  {cat.name}
                </motion.h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;