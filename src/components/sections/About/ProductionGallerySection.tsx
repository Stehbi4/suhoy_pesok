/**
 * ProductionGallerySection — «Превью + миниатюры».
 *
 * Большой превью-кадр слева, три вертикальных миниатюры справа.
 * Наведение на миниатюру меняет главное фото через плавный crossfade (opacity).
 * Активная миниатюра отмечена красной вертикальной линией слева.
 */
import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';

const photos = [
  {
    src:    '/Production_Site/site-overview.png',
    alt:    'Производственный комплекс с высоты птичьего полёта',
    num:    '01',
    label:  'Комплекс с воздуха',
    detail: 'Площадь территории — 2,5 га',
  },
  {
    src:    '/Production_Site/site-facade.png',
    alt:    'Главный корпус и силосные башни ЦМИД',
    num:    '02',
    label:  'Главный корпус',
    detail: '8 000 м² производственных площадей',
  },
  {
    src:    '/Production_Site/site-entrance.png',
    alt:    'Административная зона и склад готовой продукции',
    num:    '03',
    label:  'Административная зона',
    detail: 'Склад готовой продукции и логистика',
  },
];

const EASE = 'cubic-bezier(0.4, 0, 0.2, 1)';

interface Props {
  theme?: 'light' | 'dark';
}

const ProductionGallerySection = ({ theme = 'light' }: Props) => {
  const isDark = theme === 'dark';
  const P = isDark
    ? {
        section: 'bg-brand-graphite',
        faint:   'text-white/22',
        heading: 'text-white',
        aside:   'text-white/40',
      }
    : {
        section: 'bg-brand-alt',
        faint:   'text-brand-dark/22',
        heading: 'text-brand-dark',
        aside:   'text-brand-dark/40',
      };
  const [selected,    setSelected]    = useState(0);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const close = useCallback(() => setActiveIndex(null), []);
  const prev  = useCallback(() =>
    setActiveIndex(i => i === null ? null : (i - 1 + photos.length) % photos.length), []);
  const next  = useCallback(() =>
    setActiveIndex(i => i === null ? null : (i + 1) % photos.length), []);

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

  useEffect(() => {
    document.body.style.overflow = activeIndex !== null ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [activeIndex]);

  return (
    <>
      <section className={`${P.section} py-20 lg:py-28 overflow-hidden`}>
        <div className="px-[1cm]">
          <ScrollReveal type="fade-up">

            {/* ── Шапка ─────────────────────────────────────────────────── */}
            <div className="flex justify-between items-end mb-10">
              <div>
                <p className={`${P.faint} text-xs tracking-[0.6em] uppercase mb-3 font-mono`}>
                  Производственный комплекс
                </p>
                <h2
                  className={`${P.heading} font-light leading-none`}
                  style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
                >
                  Наш завод
                </h2>
              </div>
              <p className={`${P.aside} text-sm leading-relaxed max-w-xs text-right hidden lg:block`}>
                Собственный завод площадью 8&nbsp;000&nbsp;м²<br />
                в Санкт-Петербурге
              </p>
            </div>

            {/* ── Галерея ───────────────────────────────────────────────── */}
            <div className="flex gap-3 h-[68vh]">

              {/* ── Большой превью ── */}
              <div
                className="flex-1 relative overflow-hidden rounded-2xl cursor-zoom-in"
                onClick={() => setActiveIndex(selected)}
              >
                {/* Все фото стекируются, opacity-переключение = crossfade */}
                {photos.map((photo, i) => (
                  <img
                    key={i}
                    src={photo.src}
                    alt={photo.alt}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{
                      opacity:    selected === i ? 1 : 0,
                      zIndex:     selected === i ? 1 : 0,
                      transition: `opacity 0.45s ${EASE}`,
                    }}
                  />
                ))}

                {/* Градиент снизу */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.06) 45%, transparent 100%)',
                    zIndex: 2,
                  }}
                />

                {/* Плавающая подпись — меняется через opacity */}
                <div className="absolute bottom-0 left-0 right-0 px-8 pb-8 z-[3] pointer-events-none">
                  {photos.map((photo, i) => (
                    <div
                      key={i}
                      className="absolute bottom-8 left-8"
                      style={{
                        opacity:    selected === i ? 1 : 0,
                        transform:  selected === i ? 'translateY(0)' : 'translateY(10px)',
                        transition: `opacity 0.4s ${EASE}, transform 0.4s ${EASE}`,
                      }}
                    >
                      <div className="w-6 h-px bg-brand-red mb-3" />
                      <p className="text-white text-xl font-light leading-tight">
                        {photo.label}
                      </p>
                      <p className="text-white/50 text-sm mt-1.5">
                        {photo.detail}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Счётчик */}
                <div className="absolute top-5 right-5 z-[3] font-mono text-xs text-white/40 select-none">
                  {String(selected + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}
                </div>
              </div>

              {/* ── Миниатюры справа ── */}
              <div className="w-[22%] flex flex-col gap-2.5">
                {photos.map((photo, i) => {
                  const isActive = selected === i;
                  return (
                    <div
                      key={i}
                      className="relative flex-1 overflow-hidden rounded-xl cursor-pointer group"
                      onMouseEnter={() => setSelected(i)}
                      onClick={() => setActiveIndex(i)}
                    >
                      <img
                        src={photo.src}
                        alt={photo.alt}
                        className="w-full h-full object-cover transition-all duration-400"
                        style={{
                          filter:    isActive ? 'brightness(1)' : 'brightness(0.72) saturate(0.8)',
                          transform: isActive ? 'scale(1.04)' : 'scale(1)',
                          transition: `filter 0.35s ${EASE}, transform 0.45s ${EASE}`,
                        }}
                      />

                      {/* Тёмный оверлей на неактивных */}
                      <div
                        className="absolute inset-0 transition-opacity duration-300"
                        style={{ backgroundColor: 'rgba(0,0,0,0.15)', opacity: isActive ? 0 : 1 }}
                      />

                      {/* Красная линия слева — индикатор активной миниатюры */}
                      <div
                        className="absolute left-0 top-0 bottom-0 w-[3px] bg-brand-red"
                        style={{
                          opacity:   isActive ? 1 : 0,
                          transform: isActive ? 'scaleY(1)' : 'scaleY(0)',
                          transformOrigin: 'top',
                          transition: `opacity 0.3s ${EASE}, transform 0.35s ${EASE}`,
                        }}
                      />

                      {/* Номер + подпись */}
                      <div className="absolute bottom-3 left-4 right-2">
                        <span
                          className="font-mono text-[10px] text-white/60 tracking-widest block"
                          style={{ opacity: isActive ? 0.6 : 0.4 }}
                        >
                          {photo.num}
                        </span>
                        <p
                          className="text-white text-xs font-light leading-tight mt-0.5"
                          style={{
                            opacity:   isActive ? 1 : 0,
                            transform: isActive ? 'translateY(0)' : 'translateY(6px)',
                            transition: `opacity 0.3s ${EASE}, transform 0.3s ${EASE}`,
                          }}
                        >
                          {photo.label}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

          </ScrollReveal>
        </div>
      </section>

      {/* ── Лайтбокс ────────────────────────────────────────────────────── */}
      {activeIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={close}
        >
          <button
            className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors z-10"
            onClick={close}
          >
            <X className="w-7 h-7" />
          </button>

          <div className="absolute top-6 left-1/2 -translate-x-1/2 text-gray-500 text-sm font-mono tracking-widest select-none">
            {String(activeIndex + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}
          </div>

          <button
            className="absolute left-4 sm:left-8 text-gray-400 hover:text-white transition-colors z-10 p-2"
            onClick={(e) => { e.stopPropagation(); prev(); }}
          >
            <ChevronLeft className="w-10 h-10" />
          </button>

          <img
            key={activeIndex}
            src={photos[activeIndex].src}
            alt={photos[activeIndex].alt}
            className="max-h-[85vh] max-w-[85vw] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            className="absolute right-4 sm:right-8 text-gray-400 hover:text-white transition-colors z-10 p-2"
            onClick={(e) => { e.stopPropagation(); next(); }}
          >
            <ChevronRight className="w-10 h-10" />
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-gray-400 text-sm tracking-wide text-center">
            {photos[activeIndex].alt}
          </div>

          <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex gap-2">
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setActiveIndex(i); }}
                className={`rounded-full transition-all duration-300 ${
                  i === activeIndex
                    ? 'w-6 h-2 bg-brand-red'
                    : 'w-2 h-2 bg-gray-500 hover:bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ProductionGallerySection;
