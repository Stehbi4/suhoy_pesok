import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Сброс скролла наверх
  }, [pathname]); // Срабатывает при изменении пути (URL)

  return null; // Компонент ничего не рендерит
};

export default ScrollToTop;