import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { BLOG_POSTS } from '../data/blogPosts';
import Breadcrumbs from '../components/ui/Breadcrumbs';

const BlogPostPage = () => {
  const { id } = useParams<{ id: string }>();
  const post = BLOG_POSTS.find((p) => p.id === parseInt(id || '0'));

  // Scroll al inicio al cargar
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!post) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Artículo no encontrado</h1>
        <Link to="/blog" className="text-black underline hover:text-gray-600">Volver al blog</Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Helmet>
        <title>{post.title} | MinimalStore Blog</title>
        <meta name="description" content={post.excerpt} />
      </Helmet>

      <Breadcrumbs 
        items={[
          { label: 'Blog', path: '/blog' },
          { label: post.title }
        ]} 
        className="mb-8"
      />

      <header className="mb-10 text-center max-w-3xl mx-auto">
        <div className="flex items-center justify-center gap-3 text-sm text-gray-500 mb-6">
          <span className="bg-gray-100 px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider text-gray-900">{post.category}</span>
          <span>•</span>
          <span>{post.date}</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-serif font-bold mb-8 leading-tight text-gray-900">
          {post.title}
        </h1>
        <div className="flex items-center justify-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-serif font-bold text-lg">
            {post.author.charAt(0)}
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-gray-900">{post.author}</p>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Editor</p>
          </div>
        </div>
      </header>

      <div className="aspect-[21/9] w-full overflow-hidden rounded-2xl mb-12 bg-gray-100 shadow-sm">
        <img 
          src={post.image} 
          alt={post.title} 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="prose prose-lg mx-auto prose-headings:font-serif prose-a:text-black hover:prose-a:text-gray-600 prose-img:rounded-xl text-gray-600">
        <p className="lead text-xl text-gray-500 mb-8 font-serif italic border-l-4 border-black pl-4">
          {post.excerpt}
        </p>
        {/* Renderizado seguro del contenido (en un caso real usarías un parser de Markdown) */}
        <div className="space-y-6">
            {post.content.split('\n').map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
            ))}
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        </div>
      </div>
    </article>
  );
};

export default BlogPostPage;