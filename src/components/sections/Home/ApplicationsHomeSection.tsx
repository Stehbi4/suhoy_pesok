import { useState } from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from '@/components/ui/ScrollReveal';

const areas = [
  { label: 'Пескоструйные работы',        slug: 'pesok-dlya-peskostruynyh-rabot',  img: '/img_fo_articles/01.jpg' },
  { label: 'Строительные смеси',          slug: 'pesok-dlya-stroitelnyh-smesey',   img: '/img_fo_articles/02.jpg' },
  { label: 'Фильтрация и водоподготовка', slug: 'pesok-dlya-filtracii',             img: '/img_fo_articles/03.jpg' },
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

      <div className="overflow-hidden" style={{ height: '82vh', display: 'flex' }}>
        {areas.map((area, i) => {
          const isHov = hovered === i;

          const inner = (
            <div
              className="relative overflow-hidden w-full h-full"
              style={{
                transform: 'skewX(-9deg)',
                marginLeft: i === 0 ? 0 : -50,
                zIndex: isHov ? areas.length + 1 : areas.length - i,
                flex: isHov ? '2.5 0 0' : '1 0 0',
                transition: 'flex 0.48s cubic-bezier(0.25,0.46,0.45,0.94)',
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <img
                src={area.img}
                alt={area.label}
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  transform: `skewX(9deg) scale(${isHov ? 1.06 : 1.12})`,
                  transformOrigin: '50% 50%',
                  transition: 'transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)',
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to top, rgba(0,0,0,${isHov ? 0.7 : 0.88}) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)`,
                  transition: 'background 0.4s',
                }}
              />


              <div className="absolute bottom-7 left-5 right-5" style={{ transform: 'skewX(9deg)' }}>
                <span className="font-mono text-[10px] text-white/30 block">{String(i + 1).padStart(2, '0')}</span>
                <p className="text-white text-sm font-light leading-snug mt-1.5">{area.label}</p>
              </div>
            </div>
          );

          return (
            <Link
              key={i}
              to={`/articles/${area.slug}`}
              className="contents"
              style={{
                display: 'contents',
                flex: isHov ? '2.5 0 0' : '1 0 0',
                transition: 'flex 0.48s cubic-bezier(0.25,0.46,0.45,0.94)',
              }}
            >
              {inner}
            </Link>
          );
        })}
      </div>
      <div className="pb-20" />
    </section>
  );
};

export default ApplicationsHomeSection;
