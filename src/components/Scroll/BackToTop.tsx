// Создайте новый файл: src/components/BackToTop.tsx

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 500); // Показываем после 500px скролла
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`
        fixed bottom-8 right-8 z-[60]
        bg-brand-red hover:bg-brand-red-light
        text-white 
        w-16 h-16 
        rounded-full 
        flex items-center justify-center
        shadow-2xl shadow-black/50
        transition-all duration-300
        ${isVisible 
          ? 'opacity-100 scale-100' 
          : 'opacity-0 scale-75 pointer-events-none'
        }
      `}
      aria-label="Вернуться наверх"
    >
      <ArrowUp className="w-8 h-8" strokeWidth={2.5} />
    </button>
  );
};

export default BackToTop;