import { useState, useEffect, useRef } from 'react';

export const useScroll = (threshold = 0) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const direction = currentScrollY > lastScrollY.current ? 'down' : 'up';

      // Actualizar dirección solo si hay un cambio significativo para evitar "jitter"
      if (Math.abs(currentScrollY - lastScrollY.current) > 5) {
        setScrollDirection(direction);
      }

      setIsScrolled(currentScrollY > threshold);
      setScrollY(currentScrollY);
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return { isScrolled, scrollDirection, scrollY };
};

export default useScroll;
