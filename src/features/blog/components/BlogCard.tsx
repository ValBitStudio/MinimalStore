import React from 'react';
import { Link } from 'react-router-dom';
import { BlogPost } from '../../../data/blogPosts';

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  return (
    <Link to={`/blog/${post.id}`} className="group block h-full">
      <div className="relative overflow-hidden rounded-xl aspect-[16/9] mb-4 bg-gray-100">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
          {post.category}
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
          <span>{post.date}</span>
          <span>•</span>
          <span>{post.author}</span>
        </div>
        <h3 className="text-xl font-serif font-bold group-hover:text-gray-600 transition-colors leading-tight">
          {post.title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
          {post.excerpt}
        </p>
        <span className="inline-block text-sm font-bold underline decoration-1 underline-offset-4 mt-1 group-hover:text-gray-600 transition-colors">
          Leer artículo
        </span>
      </div>
    </Link>
  );
};

export default BlogCard;