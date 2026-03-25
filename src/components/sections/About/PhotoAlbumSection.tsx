import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';

// Fibonacci-spiral layout: blocks sized by Fibonacci sequence
// Grid: 4 cols × 3 rows
// Row 1-2 left (col 1-3): largest block (Fib 5)
// Row 2 right (col 4): medium block (Fib 3)
// Row 2 right (col 4-5): medium block (Fib 2)
// Row 3: 2+2+1 = 5 cols → (Fib 2) + (Fib 2) + (Fib 1)
const photos = [
  { src: '/Production_Site/1.png', alt: 'Производство — главный корпус',       span: 'col-span-3 row-span-2' },
  { src: '/Production_Site/2.png', alt: 'Производство — территория с воздуха', span: 'col-span-1 row-span-1' },
  { src: '/Production_Site/3.png', alt: 'Производство — склад',                span: 'col-span-1 row-span-2' },
  { src: '/Production_Site/4.png', alt: 'Производство — конвейер',             span: 'col-span-2 row-span-1' },
  { src: '/Production_Site/5.png', alt: 'Производство',                        span: 'col-span-1 row-span-1' },
];

const PhotoAlbumSection = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const close = useCallback(() => setActiveIndex(null), []);

  const prev = useCallback(() =>
    setActiveIndex(i => (i === null ? null : (i - 1 + photos.length) % photos.length)),
  []);

  const next = useCallback(() =>
    setActiveIndex(i => (i === null ? null : (i + 1) % photos.length)),
  []);

  // Keyboard navigation
  useEffect(() => {
    if (activeIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape')     close();
      if (e.key === 'ArrowLeft')  prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activeIndex, close, prev, next]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = activeIndex !== null ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [activeIndex]);

  return (
    <>
      <section className="bg-[#0a0a0a] py-16 lg:py-24">
        <div className="px-[1cm]">
          <ScrollReveal type="fade-up">
            <div className="grid grid-cols-4 grid-rows-3 gap-3 h-[calc(100vh-2cm)]">
              {photos.map((photo, i) => (
                <div
                  key={i}
                  className={`${photo.span} overflow-hidden rounded-lg group relative cursor-zoom-in`}
                  onClick={() => setActiveIndex(i)}
                >
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-500 flex flex-col items-end justify-between p-4">
                    <ZoomIn className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="text-white text-sm opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0 w-full">
                      {photo.alt}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Lightbox */}
      {activeIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={close}
        >
          {/* Close */}
          <button
            className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors z-10"
            onClick={close}
          >
            <X className="w-7 h-7" />
          </button>

          {/* Counter */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 text-gray-500 text-sm font-mono tracking-widest">
            {String(activeIndex + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}
          </div>

          {/* Prev */}
          <button
            className="absolute left-4 sm:left-8 text-gray-400 hover:text-white transition-colors z-10 p-2"
            onClick={(e) => { e.stopPropagation(); prev(); }}
          >
            <ChevronLeft className="w-10 h-10" />
          </button>

          {/* Image */}
          <img
            key={activeIndex}
            src={photos[activeIndex].src}
            alt={photos[activeIndex].alt}
            className="max-h-[85vh] max-w-[85vw] object-contain rounded-lg animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Next */}
          <button
            className="absolute right-4 sm:right-8 text-gray-400 hover:text-white transition-colors z-10 p-2"
            onClick={(e) => { e.stopPropagation(); next(); }}
          >
            <ChevronRight className="w-10 h-10" />
          </button>

          {/* Caption */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-gray-400 text-sm tracking-wide text-center">
            {photos[activeIndex].alt}
          </div>

          {/* Dot navigation */}
          <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex gap-2">
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setActiveIndex(i); }}
                className={`rounded-full transition-all duration-300 ${
                  i === activeIndex
                    ? 'w-6 h-2 bg-[#f80000]'
                    : 'w-2 h-2 bg-gray-600 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default PhotoAlbumSection;