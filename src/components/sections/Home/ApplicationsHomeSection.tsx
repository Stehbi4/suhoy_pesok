import { useState } from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from '@/components/ui/ScrollReveal';

const areas = [
  { label: 'Пескоструйные работы',        slug: 'pesok-dlya-peskostruynyh-rabot',  img: '/img_fo_articles/01.jpg' },
  { label: 'Строительные смеси',          slug: 'pesok-dlya-stroitelnyh-smesey',   img: '/img_fo_articles/02.jpg' },
  { label: 'Спортивные покрытия',         slug: 'pesok-dlya-sportivnyh-pokrytiy',  img: '/img_fo_articles/04.jpg' },
  { label: 'Ландшафтный дизайн',         slug: 'pesok-dlya-landshafta',            img: '/img_fo_articles/05.jpg' },
  { label: 'Детские песочницы',           slug: 'pesok-dlya-detskih-pesochek',      img: '/img_fo_articles/06.jpg' },
  { label: 'Песочницы локомотивов',       slug: 'pesok-dlya-lokomotivov',           img: '/img_fo_articles/07.jpg' },
  { label: 'Посыпка автодорог',          slug: 'pesok-dlya-posypki-dorog',         img: '/img_fo_articles/08.jpg' },
  { label: 'Кровельные материалы',        slug: 'pesok-dlya-krovli',                img: '/img_fo_articles/09.jpg' },
  { label: 'Энергокотлы кипящего слоя',  slug: 'pesok-dlya-kotlov',                img: '/img_fo_articles/10.jpg' },
  { label: 'Декоративное стекло',         slug: 'pesok-dlya-stekla',                img: '/img_fo_articles/11.jpg' },
  { label: 'Гидропескоструйные работы',   slug: 'pesok-dlya-gidropeskostruya',      img: '/img_fo_articles/12.jpg' },
];

const ApplicationsHomeSection = () => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section style={{ background: '#111111' }}>
      <div className="px-[1cm] pt-20 pb-10">
        <ScrollReveal type="fade-up">
          <p className="text-[10px] uppercase tracking-[0.35em] text-gray-500 mb-4">Сферы применения</p>
          <h2 className="text-4xl lg:text-5xl font-light tracking-tight text-white">Где применяется наш песок</h2>
        </ScrollReveal>
      </div>

      <div style={{ height: '82vh', display: 'flex', gap: '1px' }}>
        {areas.map((area, i) => {
          const isHov = hovered === i;
          return (
            <Link
              key={i}
              to={`/articles/${area.slug}`}
              style={{
                display: 'block',
                position: 'relative',
                flex: isHov ? '3 0 0' : '1 0 0',
                transition: 'flex 0.48s cubic-bezier(0.25,0.46,0.45,0.94)',
                overflow: 'hidden',
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Image */}
              <img
                src={area.img}
                alt={area.label}
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  transform: `scale(${isHov ? 1.05 : 1.12})`,
                  transition: 'transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)',
                }}
              />

              {/* Gradient */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to top, rgba(0,0,0,${isHov ? 0.65 : 0.85}) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)`,
                  transition: 'background 0.4s',
                }}
              />

              {/* Label */}
              <div className="absolute bottom-6 left-3 right-3 z-10 pointer-events-none">
                <span className="font-mono text-[9px] text-white/30 block mb-1">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p
                  className="text-white font-light leading-snug"
                  style={{
                    fontSize: isHov ? '0.9rem' : '0.7rem',
                    transition: 'font-size 0.4s',
                    whiteSpace: isHov ? 'normal' : 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {area.label}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
      <div className="pb-20" />
    </section>
  );
};

export default ApplicationsHomeSection;
