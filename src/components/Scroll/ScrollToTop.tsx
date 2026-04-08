import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getLenis } from '@/components/ui/SmoothScroll';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const lenis = getLenis();
    if (lenis) {
      // Мгновенный сброс через Lenis — без анимации
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;
