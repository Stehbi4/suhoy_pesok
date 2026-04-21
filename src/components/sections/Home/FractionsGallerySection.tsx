import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';

const fractions = [
  { name: '0,0–0,315 мм',  slug: 'pesok-0-0-315',   img: '/img_fo_products/0,0-0,315/Home_P_Sand_1.png' },
  { name: '0,315–0,63 мм', slug: 'pesok-0-315-0-63', img: '/img_fo_products/0,315-0,63/Home_P_Sand_1.png' },
  { name: '0,0–0,63 мм',   slug: 'pesok-0-0-63',     img: '/img_fo_products/0,0–0,63/Home_P_Sand_1.png' },
  { name: '0,63–2,5 мм',   slug: 'pesok-0-63-2-5',   img: '/img_fo_products/0,63-2,5/Home_P_Sand_1.png' },
];

const N = fractions.length;

// Background div extended left by 21vh to fill the diagonal clip area.
// background-position-x compensates: x = 21vh − i × (gallery_width / N)
const panoBgPos = (i: number) =>
  `calc(21vh - ${i} * (100vw - 2cm) / ${N}) center`;

const FractionsGallerySection = () => {
  const [hovered, setHovered] = useState<number | null>(null);

  // Mobile carousel state
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      const i = Math.round(el.scrollLeft / el.clientWidth);
      setActiveIdx(i);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const goTo = (i: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(N - 1, i));
    el.scrollTo({ left: clamped * el.clientWidth, behavior: 'smooth' });
  };

  return (
    <section className="bg-brand-bg">

      {/* Section header */}
      <div className="px-[1cm] pt-20 pb-10">
        <ScrollReveal type="fade-up">
          <p className="text-[10px] uppercase tracking-[0.35em] text-gray-500 mb-4">Наш ассортимент</p>
          <h2 className="text-4xl lg:text-5xl font-light tracking-tight text-white">4 популярные фракции</h2>
        </ScrollReveal>
      </div>

      {/* Mobile: horizontal snap carousel, one full-width card per screen */}
      <div className="lg:hidden relative">
        <div
          ref={scrollerRef}
          className="frac-scroll flex overflow-x-auto snap-x snap-mandatory pb-4"
          style={{ scrollbarWidth: 'none' }}
        >
        {fractions.map((frac, i) => (
          <Link
            key={i}
            to={`/product/${frac.slug}`}
            className="snap-start shrink-0 w-screen block px-[1cm]"
          >
            <div className="w-full aspect-square overflow-hidden rounded-sm bg-[#0a0a0a]">
              <img
                src={frac.img}
                alt={frac.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-4 flex items-baseline gap-3">
              <span
                className="text-white/40 text-xs"
                style={{ fontFamily: 'monospace' }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="text-white text-2xl font-light">{frac.name}</p>
            </div>
          </Link>
        ))}
        </div>

        {/* Arrow buttons — overlay on image row (square area sits at top, so
            buttons vertically centered within image = ~half of w-screen). */}
        <button
          aria-label="Предыдущая фракция"
          onClick={() => goTo(activeIdx - 1)}
          disabled={activeIdx === 0}
          className="absolute top-1/2 -translate-y-1/2 left-2 w-10 h-10 rounded-full bg-black/55 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white disabled:opacity-30 disabled:pointer-events-none transition-opacity"
          style={{ top: 'calc((100vw - 2cm) / 2 + 1rem)' }}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          aria-label="Следующая фракция"
          onClick={() => goTo(activeIdx + 1)}
          disabled={activeIdx === N - 1}
          className="absolute top-1/2 -translate-y-1/2 right-2 w-10 h-10 rounded-full bg-black/55 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white disabled:opacity-30 disabled:pointer-events-none transition-opacity"
          style={{ top: 'calc((100vw - 2cm) / 2 + 1rem)' }}
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 pb-2">
          {fractions.map((_, i) => (
            <button
              key={i}
              aria-label={`Перейти к фракции ${i + 1}`}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === activeIdx ? 'w-6 bg-white' : 'w-1.5 bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Desktop: clip-path panel gallery */}
      <div
        className="hidden lg:flex mx-[1cm] overflow-hidden"
        style={{ height: '78vh', gap: '4px' }}
      >
        {fractions.map((frac, i) => {
          const isHov  = hovered === i;
          const anyHov = hovered !== null;
          const flexVal = isHov ? 3 : 1;

          const clipPath =
            i === 0       ? 'polygon(0% 0%, 100% 0%, calc(100% - 21vh) 100%, 0% 100%)'
            : i === N - 1 ? 'polygon(0% 0%, 100% 0%, 100% 100%, calc(0% - 21vh) 100%)'
            :                'polygon(0% 0%, 100% 0%, calc(100% - 21vh) 100%, calc(0% - 21vh) 100%)';

          return (
            <Link
              key={i}
              to={`/product/${frac.slug}`}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                flex: `${flexVal} 1 0`,
                transition: 'flex 0.55s cubic-bezier(0.25,0.46,0.45,0.94)',
                position: 'relative',
                display: 'block',
                clipPath,
              }}
            >
              {/* Background — extended left by 21vh, same image on all panels */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  right: 0,
                  left: 'calc(-21vh)',
                  backgroundImage:    `url(${frac.img})`,
                  backgroundSize:     'calc(100vw - 2cm) auto',
                  backgroundPosition: panoBgPos(i),
                  backgroundRepeat:   'no-repeat',
                  transform:          `scale(${isHov ? 1.05 : 1.0})`,
                  transformOrigin:    'calc(50% + 10.5vh) 50%',
                  transition:         'transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94)',
                }}
              />


              {/* Label */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '2rem',
                  left: '1.25rem',
                  right: '1.25rem',
                  opacity: isHov || !anyHov ? 1 : 0.35,
                  transition: 'opacity 0.35s',
                }}
              >
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '10px',
                    color: 'rgba(255,255,255,0.3)',
                    display: 'block',
                    marginBottom: '0.25rem',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>

                <p
                  style={{
                    color: 'white',
                    fontWeight: 300,
                    lineHeight: 1.2,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    fontSize: isHov ? '3rem' : '1.7rem',
                    transition: 'font-size 0.4s cubic-bezier(0.25,0.46,0.45,0.94)',
                  }}
                >
                  {frac.name}
                </p>

                {isHov && (
                  <p
                    style={{
                      color: 'rgba(255,255,255,0.5)',
                      fontSize: '0.7rem',
                      marginTop: '0.5rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.12em',
                      fontFamily: 'monospace',
                    }}
                  >
                    Подробнее →
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default FractionsGallerySection;
