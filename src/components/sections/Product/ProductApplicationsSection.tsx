import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TEXT_DARK } from '@/styles/theme';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { articles } from '@/data/articles';
import type { Product } from './types';

// Gallery fallback images
const galleryFallback = [
  '/gallery/sand-1.jpg',
  '/gallery/sand-2.jpg',
  '/gallery/sand-3.jpg',
  '/gallery/sand-4.jpg',
  '/gallery/sand-5.jpg',
];

function matchAreaToArticle(area: string) {
  const clean = area.toLowerCase().replace(/^для\s+/i, '');
  const words = clean.split(/[\s/]+/).filter(w => w.length > 4);
  if (!words.length) return null;

  let bestArt: (typeof articles)[0] | null = null;
  let bestScore = 0;

  for (const art of articles) {
    const t     = art.title.toLowerCase();
    const score = words.filter(w => t.includes(w)).length;
    if (score > bestScore) { bestScore = score; bestArt = art; }
  }

  return bestArt;
}

export const ProductApplicationsSection = ({ product, galleryImages }: { product: Product; galleryImages: string[] }) => {
  const [hoveredArea, setHoveredArea] = useState<number | null>(null);
  const areas = product.applicationAreas || [];
  const images = galleryImages.length ? galleryImages : galleryFallback;

  return (
    <section style={{ background: TEXT_DARK }}>
      <div className="px-6 sm:px-10 lg:px-[1cm] pt-24 pb-14">
        <ScrollReveal type="fade-up">
          <h2 className="text-4xl lg:text-5xl font-light tracking-tighter text-white">Области применения</h2>
        </ScrollReveal>
      </div>

      <div className="overflow-hidden" style={{ height: '85vh', display: 'flex' }}>
        {areas.map((area, i) => {
          const art   = matchAreaToArticle(area);
          const bgSrc = art?.image ?? images[i % images.length];
          const href  = art ? `/articles/${art.slug}` : undefined;
          const isHov = hoveredArea === i;

          const inner = (
            <div
              className="relative overflow-hidden w-full h-full"
              style={{
                transform: 'skewX(-4deg)',
                marginLeft: i === 0 ? 0 : -28,
                zIndex: isHov ? areas.length + 1 : areas.length - i,
                flex: isHov ? '2.2 0 0' : '1 0 0',
                transition: 'flex 0.5s cubic-bezier(0.25,0.46,0.45,0.94)',
              }}
              onMouseEnter={() => setHoveredArea(i)}
              onMouseLeave={() => setHoveredArea(null)}
            >
              <img
                src={bgSrc}
                alt={area}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700"
                style={{ transform: `skewX(4deg) scale(${isHov ? 1.07 : 1.13})`, transformOrigin: '50% 50%' }}
              />
              <div className="absolute inset-0" style={{
                background: `linear-gradient(to top, rgba(0,0,0,${isHov ? 0.72 : 0.88}) 0%, rgba(0,0,0,0.08) 55%, transparent 100%)`,
                transition: 'background 0.4s',
              }} />
              <div className="absolute bottom-8 left-6 right-6" style={{ transform: 'skewX(4deg)' }}>
                <span className="font-mono text-[10px] text-white/30 block">{String(i + 1).padStart(2, '0')}</span>
                <p className="text-white text-sm font-light leading-snug mt-1.5">{area}</p>
                {art && (
                  <p className="text-white/40 text-xs mt-1 font-mono truncate">{art.title}</p>
                )}
              </div>
            </div>
          );

          return href ? (
            <Link key={i} to={href} className="contents" style={{ display: 'contents', flex: isHov ? '2.2 0 0' : '1 0 0', transition: 'flex 0.5s cubic-bezier(0.25,0.46,0.45,0.94)' }}>
              {inner}
            </Link>
          ) : (
            <div key={i} style={{ display: 'contents', flex: isHov ? '2.2 0 0' : '1 0 0' }}>{inner}</div>
          );
        })}
      </div>
      <div className="pb-24" />
    </section>
  );
};
