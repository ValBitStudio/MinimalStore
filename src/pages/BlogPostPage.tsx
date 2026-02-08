import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { BLOG_POSTS } from '../data/blogPosts';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import NotFoundPage from './NotFoundPage';

const BlogPostPage = () => {
  const { id } = useParams<{ id: string }>();
  const post = BLOG_POSTS.find(p => p.id === parseInt(id || '0'));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!post) {
    return <NotFoundPage />;
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Helmet key={`blog-post-${id}`} defer={false}>
        <title>{post.title} | MinimalStore</title>
        <meta name="description" content={post.excerpt} />
        {/* Open Graph para compartir en redes */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.image} />
      </Helmet>
      <Breadcrumbs items={[
        { label: 'Blog', path: '/blog' },
        { label: post.title }
      ]} className="mb-8" />

      <header className="text-center mb-12">
        <div className="flex items-center justify-center gap-4 text-sm text-gray-500 mb-6">
          <span className="bg-gray-100 px-3 py-1 rounded-full text-gray-900 font-medium">{post.category}</span>
          <span>{post.date}</span>
          <span>•</span>
          <span>Por {post.author}</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-serif font-bold mb-8 leading-tight">{post.title}</h1>
        <div className="aspect-[21/9] w-full overflow-hidden rounded-2xl">
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-full object-cover"
          />
        </div>
      </header>

      <div className="prose prose-lg mx-auto text-gray-600">
        {/* Simulamos párrafos para que se vea como un artículo real */}
        <p className="lead text-xl text-gray-900 font-medium mb-6">{post.excerpt}</p>
        <p className="mb-6">{post.content}</p>
        <p className="mb-6">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
        <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">La importancia de los detalles</h3>
        <p className="mb-6">
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </div>
    </article>
  );
};

export default BlogPostPage;