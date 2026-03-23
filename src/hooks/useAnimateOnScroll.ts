import { useEffect, useRef } from 'react';

export function useAnimateOnScroll() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // observer.unobserve(entry.target); // если анимация нужна только один раз
          }
          // else {
          //   entry.target.classList.remove('visible'); // если хочешь повтор при скролле вверх
          // }
        });
      },
      {
        threshold: 0.15,          // 15% блока видно → запускаем
        rootMargin: '0px 0px -10% 0px',
      }
    );

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return ref;
}