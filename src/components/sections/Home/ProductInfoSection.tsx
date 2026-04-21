import { useState } from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from '@/components/ui/ScrollReveal';

const areas = [
  { label: 'Пескоструйные работы',        slug: 'pesok-dlya-peskostruynyh-rabot',  img: '/img_fo_articles/01.jpg' },
  { label: 'Строительные смеси',          slug: 'pesok-dlya-stroitelnyh-smesey',   img: '/img_fo_articles/02.jpg' },
  { label: 'Фильтрация и водоподготовка', slug: 'pesok-dlya-filtracii',             img: '/img_fo_articles/03.jpg' },
  { label: 'Спортивные покрытия',         slug: 'pesok-dlya-sportivnyh-pokrytiy',  img: '/img_fo_articles/04.jpg' },
  { label: 'Ландшафтный дизайн',          slug: 'pesok-dlya-landshafta',            img: '/img_fo_articles/05.jpg' },
  { label: 'Детские песочницы',           slug: 'pesok-dlya-detskih-pesochek',      img: '/img_fo_articles/06.jpg' },
  { label: 'Песочницы локомотивов',       slug: 'pesok-dlya-lokomotivov',           img: '/img_fo_articles/07.jpg' },
  { label: 'Посыпка автодорог',           slug: 'pesok-dlya-posypki-dorog',         img: '/img_fo_articles/08.jpg' },
  { label: 'Кровельные материалы',        slug: 'pesok-dlya-krovli',                img: '/img_fo_articles/09.jpg' },
  { label: 'Энергокотлы кипящего слоя',   slug: 'pesok-dlya-kotlov',                img: '/img_fo_articles/10.jpg' },
  { label: 'Декоративное стекло',         slug: 'pesok-dlya-stekla',                img: '/img_fo_articles/11.jpg' },
  { label: 'Гидропескоструйные работы',   slug: 'pesok-dlya-gidropeskostruya',      img: '/img_fo_articles/12.jpg' },
];

// skewX(+9deg) → \ direction (top shifts LEFT, bottom shifts RIGHT)
//   section 1  bottom-left  = left screen edge   ✓
//   section 12 top-right    = right screen edge  ✓
//   dark corners: top-left and bottom-right
//
// EXT = (H/2)·tan(9°) ≈ 6.5vh — container overhang on each side.
// Counter-skew skewX(-9deg) on images/text + extend image by EXT to fill corners.
const EXT    = '6.5vh';
const SKEW   = 'skewX(-9deg)';  // / direction — top shifts right, bottom shifts left
const UNSKEW = 'skewX(9deg)';   // cancel skew for content inside

const ProductInfoSection = () => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="bg-brand-bg" style={{ overflow: 'hidden' }}>

      <div className="px-[1cm] pt-20 pb-10">
        <ScrollReveal type="fade-up">
          <p className="text-[10px] uppercase tracking-[0.35em] text-gray-500 mb-4">Сферы применения</p>
          <h2 className="text-4xl lg:text-5xl font-light tracking-tight text-white">Где применяется наш песок</h2>
        </ScrollReveal>
      </div>

      {/* Gallery — extends EXT beyond each edge so corners are covered.
          Section overflow:hidden clips it flush with the viewport. */}
      <div style={{
        height: '78vh',
        display: 'flex',
        gap: '3px',
        marginLeft: `-${EXT}`,
        width: `calc(100% + 2 * ${EXT})`,
      }}>
        {/* Left transparent spacer — shrinks on hover to give text more room */}
        <div
          aria-hidden
          style={{
            flex: `0 0 calc(${EXT} * 2)`,
            pointerEvents: 'none',
          }}
        />
        {areas.map((area, i) => {
          const isHov  = hovered === i;
          const anyHov = hovered !== null;

          return (
            <Link
              key={i}
              to={`/articles/${area.slug}`}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                flex: isHov ? 3 : 1,
                transition: 'flex 0.55s cubic-bezier(0.25,0.46,0.45,0.94)',
                position: 'relative',
                display: 'block',
                overflow: 'hidden',
                transform: SKEW,          // \ lean, default center origin → parallel strips
              }}
            >
              {/* Image — counter-skew + extend to fill diagonal corners */}
              <div style={{
                position: 'absolute',
                top: 0, bottom: 0,
                left:  `-${EXT}`,
                right: `-${EXT}`,
                transform: UNSKEW,
              }}>
                <img
                  src={area.img}
                  alt={area.label}
                  style={{
                    width: '100%', height: '100%',
                    objectFit: 'cover',
                    transform: `scale(${isHov ? 1.05 : 1.12})`,
                    transition: 'transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94)',
                  }}
                />
              </div>

              {/* Gradient */}
              <div style={{
                position: 'absolute', inset: 0,
                background: `linear-gradient(to top,
                  rgba(0,0,0,${isHov ? 0.55 : 0.78}) 0%,
                  rgba(0,0,0,0.08) 55%,
                  transparent 100%)`,
                transition: 'background 0.4s',
              }} />

              {/* Label — counter-skew so text is upright */}
              <div style={{
                position: 'absolute',
                bottom: '2rem',
                left: '1.25rem',
                right: '1.25rem',
                transform: UNSKEW,
                opacity: isHov || !anyHov ? 1 : 0.35,
                transition: 'opacity 0.35s',
              }}>
                <span style={{
                  fontFamily: 'monospace', fontSize: '10px',
                  color: 'rgba(255,255,255,0.3)',
                  display: 'block', marginBottom: '0.25rem',
                }}>
                  {String(i + 1).padStart(2, '0')}
                </span>

                <p style={{
                  color: 'white', fontWeight: 300, lineHeight: 1.2,
                  overflow: 'hidden',
                  fontSize: isHov ? '1.5rem' : '0.72rem',
                  transition: 'font-size 0.4s cubic-bezier(0.25,0.46,0.45,0.94)',
                  whiteSpace: isHov ? 'normal' : 'nowrap',
                  textOverflow: 'ellipsis',
                }}>
                  {area.label}
                </p>

                {isHov && (
                  <p style={{
                    color: 'rgba(255,255,255,0.5)',
                    fontSize: '0.7rem', marginTop: '0.5rem',
                    textTransform: 'uppercase', letterSpacing: '0.12em',
                    fontFamily: 'monospace',
                  }}>
                    Подробнее →
                  </p>
                )}
              </div>
            </Link>
          );
        })}
        {/* Right transparent spacer — mirrors the left one */}
        <div
          aria-hidden
          style={{
            flex: `0 0 calc(${EXT} * 2)`,
            pointerEvents: 'none',
          }}
        />
      </div>

      <div className="pb-20" />
    </section>
  );
};

export default ProductInfoSection;
