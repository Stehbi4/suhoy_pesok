import { useState } from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from '@/components/ui/ScrollReveal';

const fractions = [
  { name: '0,0–0,315 мм', img: '/img_fo_products/0,0-0,315/BG_Send_Well_4.jpg',  slug: 'pesok-0-0-315' },
  { name: '0,315–0,63 мм', img: '/img_fo_products/0,315-0,63/BG_Send_Well_4.jpg', slug: 'pesok-0-315-0-63' },
  { name: '0,0–0,63 мм',  img: '/img_fo_products/0,0–0,63/BG_Send_Well_4.jpg',   slug: 'pesok-0-0-63' },
  { name: '0,63–2,5 мм',  img: '/img_fo_products/0,63-2,5/BG_Send_Well_4.jpg',   slug: 'pesok-0-63-2-5' },
];

const FractionsGallerySection = () => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="bg-brand-bg">
      <div className="px-[1cm] pt-20 pb-10">
        <ScrollReveal type="fade-up">
          <p className="text-[10px] uppercase tracking-[0.35em] text-gray-500 mb-4">Наш ассортимент</p>
          <h2 className="text-4xl lg:text-5xl font-light tracking-tight text-white">4 популярные фракции</h2>
        </ScrollReveal>
      </div>

      <div className="overflow-hidden" style={{ height: '78vh', display: 'flex' }}>
        {fractions.map((frac, i) => {
          const isHov   = hovered === i;
          const flexVal = isHov ? 1.5 : 1;

          const inner = (
            <div
              className="relative overflow-hidden w-full h-full"
              style={{
                transform: 'skewX(-9deg)',
                marginLeft: i === 0 ? 0 : -50,
                zIndex: isHov ? fractions.length + 1 : fractions.length - i,
                flex: `${flexVal} 0 0`,
                transition: 'flex 0.55s cubic-bezier(0.25,0.46,0.45,0.94)',
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Фото: анимация масштаба при наведении */}
              <div
                className="absolute inset-0"
                style={{
                  transform: `skewX(9deg) scale(${isHov ? 1.25 : 1.15})`,
                  backgroundImage: `url(${frac.img})`,
                  backgroundSize: '100vw auto',
                  backgroundPosition: 'center bottom',
                  backgroundRepeat: 'no-repeat',
                  transition: 'transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94)',
                }}
              />

              {/* Gradient overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to top, rgba(0,0,0,${isHov ? 0.65 : 0.82}) 0%, rgba(0,0,0,0.15) 60%, transparent 100%)`,
                  transition: 'background 0.4s',
                }}
              />


              {/* Label */}
              <div
                className="absolute bottom-8 left-5 right-5"
                style={{
                  transform: 'skewX(9deg)',
                  opacity: isHov || hovered === null ? 1 : 0.5,
                  transition: 'opacity 0.35s',
                }}
              >
                <span className="font-mono text-[10px] text-white/30 block mb-1">{String(i + 1).padStart(2, '0')}</span>
                <p
                  className="text-white font-light leading-tight"
                  style={{
                    fontSize: isHov ? '1.5rem' : '0.85rem',
                    transition: 'font-size 0.4s cubic-bezier(0.25,0.46,0.45,0.94)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                  }}
                >
                  {frac.name}
                </p>
                {isHov && (
                  <p className="text-white/50 text-xs mt-2 uppercase tracking-widest font-mono">
                    Подробнее →
                  </p>
                )}
              </div>
            </div>
          );

          return (
            <Link
              key={i}
              to={`/product/${frac.slug}`}
              className="contents"
              style={{
                display: 'contents',
                flex: `${flexVal} 0 0`,
                transition: 'flex 0.55s cubic-bezier(0.25,0.46,0.45,0.94)',
              }}
            >
              {inner}
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default FractionsGallerySection;
