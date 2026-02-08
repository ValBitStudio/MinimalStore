import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useWishlistStore } from '../store/wishlistStore';
import ProductCard from '../features/products/components/ProductCard';

const WishlistPage = () => {
  const wishlist = useWishlistStore((state) => state.wishlist);

  if (wishlist.length === 0) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-medium mb-4">Tu lista de deseos está vacía</h1>
        <Link to="/products" className="text-black underline hover:text-gray-600 transition-colors">
          Explorar productos
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Helmet key="wishlist" defer={false}>
        <title key="title-wishlist">Mi Lista de Deseos | MinimalStore</title>
        <meta name="description" content="Tus productos favoritos guardados para más tarde." />
      </Helmet>
      <h1 className="text-3xl font-serif font-bold mb-8">Mi Lista de Deseos</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        {wishlist.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;