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

const N = areas.length;

// skewX(-15deg): horizontal extension at panel height =  H × tan15° ≈ H × 0.268
// Image is extended left/right by that amount and counter-skewed so it appears straight.
// gap: 4px on the flex container → visible BG-coloured diagonal divider line

const ProductInfoSection = () => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="bg-brand-bg">

      {/* Section header */}
      <div className="px-[1cm] pt-20 pb-10">
        <ScrollReveal type="fade-up">
          <p className="text-[10px] uppercase tracking-[0.35em] text-gray-500 mb-4">Сферы применения</p>
          <h2 className="text-4xl lg:text-5xl font-light tracking-tight text-white">Где применяется наш песок</h2>
        </ScrollReveal>
      </div>

      {/* Gallery — bg-brand-bg fills the gap (= divider colour) */}
      <div
        className="mx-[1cm] overflow-hidden bg-brand-bg"
        style={{ height: '78vh', display: 'flex', gap: '4px' }}
      >
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
                // Diagonal walls via skewX — same visual angle as 15° clip-path
                transform: 'skewX(-15deg)',
              }}
            >
              {/* Image — counter-skew + extend to fill skewed container */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  // extend horizontally to fill diagonal corners: H × tan15° ≈ 21vh
                  left:  'calc(-21vh)',
                  right: 'calc(-21vh)',
                  transform: `skewX(15deg) scale(${isHov ? 1.1 : 1.0})`,
                  transformOrigin: '50% 50%',
                  transition: 'transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94)',
                  backgroundImage:    `url(${area.img})`,
                  backgroundSize:     'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat:   'no-repeat',
                }}
              />

              {/* Gradient overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `linear-gradient(to top,
                    rgba(0,0,0,${isHov ? 0.55 : 0.72}) 0%,
                    rgba(0,0,0,0.08) 55%,
                    transparent 100%)`,
                  transition: 'background 0.4s',
                }}
              />

              {/* Label — counter-skew text */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '2rem',
                  left:  '1.25rem',
                  right: '1.25rem',
                  transform: 'skewX(15deg)',
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
                    overflow: 'hidden',
                    fontSize: isHov ? '1.6rem' : '0.75rem',
                    transition: 'font-size 0.4s cubic-bezier(0.25,0.46,0.45,0.94)',
                    whiteSpace: isHov ? 'normal' : 'nowrap',
                  }}
                >
                  {area.label}
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

      <div className="pb-20" />
    </section>
  );
};

export default ProductInfoSection;
