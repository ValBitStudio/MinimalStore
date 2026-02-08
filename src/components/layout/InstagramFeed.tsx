import React from 'react';

const INSTAGRAM_POSTS = [
  { id: 1, image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop', link: '#' },
  { id: 2, image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600&auto=format&fit=crop', link: '#' },
  { id: 3, image: 'https://images.unsplash.com/photo-1754643127360-e17e6932f023?q=80&w=687&auto=format&fit=crop', link: '#' },
  { id: 4, image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=600&auto=format&fit=crop', link: '#' },
  { id: 5, image: 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?q=80&w=600&auto=format&fit=crop', link: '#' },
  { id: 6, image: 'https://images.unsplash.com/photo-1506152983158-b4a74a01c721?q=80&w=600&auto=format&fit=crop', link: '#' },
];

const InstagramFeed = () => {
  return (
    <section className="bg-white border-t border-gray-100">
      <div className="py-12 container mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
          <h3 className="text-xl font-serif font-bold">@MinimalStore</h3>
        </div>
        <p className="text-gray-500 text-sm mb-8">Síguenos en Instagram para más inspiración</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {INSTAGRAM_POSTS.map((post) => (
          <a 
            key={post.id} 
            href={post.link} 
            className="group relative aspect-square overflow-hidden block"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img 
              src={post.image} 
              alt="Instagram post" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="text-white font-medium text-sm tracking-wider flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default InstagramFeed;