import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import confetti from 'canvas-confetti';

const ThankYouPage = () => {
  useEffect(() => {
    // Efecto de confeti al cargar la página
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      confetti({
        ...defaults, 
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults, 
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <Helmet key="thank-you" defer={false}>
        <title>¡Gracias por tu compra! | MinimalStore</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <h1 className="text-4xl font-serif font-bold mb-4">¡Gracias por tu compra!</h1>
      <p className="text-gray-600 mb-8 max-w-md">
        Hemos recibido tu pedido correctamente. Te enviaremos un email de confirmación en breve.
      </p>
      <Link 
        to="/" 
        className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
      >
        Volver al Inicio
      </Link>
    </div>
  );
};

export default ThankYouPage;