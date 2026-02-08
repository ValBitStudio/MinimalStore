import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { BLOG_POSTS } from '../data/blogPosts';
import BlogCard from '../features/blog/components/BlogCard';

const BlogPage = () => {
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
        {BLOG_POSTS.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <BlogCard post={post} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;