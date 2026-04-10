import { useState } from 'react';
import { Link } from 'react-router-dom';
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

  return (
    <section className="bg-brand-bg">

      {/* Section header */}
      <div className="px-[1cm] pt-20 pb-10">
        <ScrollReveal type="fade-up">
          <p className="text-[10px] uppercase tracking-[0.35em] text-gray-500 mb-4">Наш ассортимент</p>
          <h2 className="text-4xl lg:text-5xl font-light tracking-tight text-white">4 популярные фракции</h2>
        </ScrollReveal>
      </div>

      <div
        className="mx-[1cm] overflow-hidden"
        style={{ height: '78vh', display: 'flex', gap: '4px' }}
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
