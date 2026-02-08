import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import MainLayout from './components/layout/MainLayout';
import ErrorBoundary from './components/ui/ErrorBoundary';
import ScrollToTop from './components/layout/ScrollToTop';
import { lazyRetry } from './utils/lazyRetry';
import { useAuthStore } from './store/authStore';


const HomePage = lazyRetry(() => import('./pages/HomePage'));
const ProductsPage = lazyRetry(() => import('./pages/ProductsPage'));
const ProductDetailPage = lazyRetry(() => import('./pages/ProductDetailPage'));
const AboutPage = lazyRetry(() => import('./pages/AboutPage'));
const ContactPage = lazyRetry(() => import('./pages/ContactPage'));
const CheckoutPage = lazyRetry(() => import('./pages/CheckoutPage'));
const ThankYouPage = lazyRetry(() => import('./pages/ThankYouPage'));
const WishlistPage = lazyRetry(() => import('./pages/WishlistPage'));
const FAQPage = lazyRetry(() => import('./pages/FAQPage'));
const NotFoundPage = lazyRetry(() => import('./pages/NotFoundPage'));
const BlogPage = lazyRetry(() => import('./pages/BlogPage'));
const BlogPostPage = lazyRetry(() => import('./pages/BlogPostPage'));
const LoginPage = lazyRetry(() => import('./pages/LoginPage'));
const RegisterPage = lazyRetry(() => import('./pages/RegisterPage'));
const AccountPage = lazyRetry(() => import('./pages/AccountPage'));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-white" role="status" aria-label="Cargando contenido">
    <div className="w-12 h-12 border-4 border-gray-100 border-t-black rounded-full animate-spin"></div>
    <span className="sr-only">Cargando...</span>
  </div>
);


const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <Helmet defaultTitle="MinimalStore | Moda Minimalista y Atemporal">
          <meta name="description" content="Descubre nuestra colección de esenciales modernos diseñados para durar." />
        </Helmet>
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="product/:id" element={<ProductDetailPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="checkout" element={<CheckoutPage />} />
                <Route path="thank-you" element={<ThankYouPage />} />
                <Route path="wishlist" element={<WishlistPage />} />
                <Route path="faq" element={<FAQPage />} />
                <Route path="blog" element={<BlogPage />} />
                <Route path="blog/:id" element={<BlogPostPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route element={<ProtectedRoute />}>
                  <Route path="account" element={<AccountPage />} />
                </Route>
                {/* Página 404 */}
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </Suspense>
        </ErrorBoundary>
    </Router>
  );
};

export default App;