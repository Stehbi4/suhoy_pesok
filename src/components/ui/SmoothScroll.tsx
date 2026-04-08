import { useEffect } from 'react';
import Lenis from 'lenis';

// Singleton — доступен в других компонентах (например, ScrollToTop)
let lenisInstance: Lenis | null = null;

export const getLenis = () => lenisInstance;

const SmoothScroll = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    });

    lenisInstance = lenis;

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  return null;
};

export default SmoothScroll;
