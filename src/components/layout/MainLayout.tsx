import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import CartSidebar from '../../features/cart/components/CartSidebar';
import WishlistSidebar from '../../features/wishlist/components/WishlistSidebar';
import InstagramFeed from './InstagramFeed';
import ScrollToTop from './ScrollToTop';
import QuickViewModal from '../../features/products/components/QuickViewModal';
import NewsletterPopup from './NewsletterPopup';
import ToastContainer from '../ui/ToastContainer';
import BackToTopButton from '../ui/BackToTopButton';

const MainLayout: React.FC = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isCheckout = location.pathname === '/checkout';

  return (
    <div className="flex flex-col min-h-screen font-sans text-gray-900">
      <Navbar />
      <CartSidebar />
      <WishlistSidebar />
      <QuickViewModal />
      <ToastContainer />
      <NewsletterPopup />
      <BackToTopButton />
      <ScrollToTop />
      <main className={`flex-grow ${isHome ? '' : 'container mx-auto px-4 py-8 pt-24'}`}>
        {/* Outlet renderiza la ruta hija actual */}
        <Outlet />
      </main>
      
      {!isCheckout && <InstagramFeed />}
      
      {isCheckout ? (
        <footer className="bg-white border-t border-gray-100 py-8 text-center text-xs text-gray-400">
          <p>&copy; {new Date().getFullYear()} ValBitStudio. Pago 100% Seguro.</p>
        </footer>
      ) : (
        <Footer />
      )}
    </div>
  );
};

export default MainLayout;