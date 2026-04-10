import { useState } from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { articles } from '@/data/articles';
import type { Product } from './types';

function matchAreaToArticle(area: string) {
  const clean = area.toLowerCase().replace(/^для\s+/i, '');
  const words  = clean.split(/[\s/]+/).filter(w => w.length > 4);
  if (!words.length) return null;

  let best: (typeof articles)[0] | null = null;
  let bestScore = 0;

  for (const art of articles) {
    const t     = art.title.toLowerCase();
    const score = words.filter(w => t.includes(w)).length;
    if (score > bestScore) { bestScore = score; best = art; }
  }
  return best;
}

export const ProductApplicationsSection = ({ product }: { product: Product }) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const areas = product.applicationAreas ?? [];

  if (!areas.length) return null;

  return (
    <section className="bg-brand-bg">

      {/* Header */}
      <div className="px-[1cm] pt-20 pb-10">
        <ScrollReveal type="fade-up">
          <p className="text-[10px] uppercase tracking-[0.35em] text-gray-500 mb-4">Применение</p>
          <h2 className="text-4xl lg:text-5xl font-light tracking-tight text-white">Области применения</h2>
        </ScrollReveal>
      </div>

      {/* Gallery — same pattern as ProductInfoSection */}
      <div
        className="mx-[1cm] overflow-hidden bg-brand-bg"
        style={{ height: '78vh', display: 'flex', gap: '4px' }}
      >
        {areas.map((area, i) => {
          const art   = matchAreaToArticle(area);
          const bgSrc = art?.image ?? `/img_fo_articles/${String(i + 1).padStart(2, '0')}.jpg`;
          const href  = art ? `/articles/${art.slug}` : undefined;
          const isHov  = hovered === i;
          const anyHov = hovered !== null;

          const panel = (
            <div
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                flex: isHov ? 3 : 1,
                transition: 'flex 0.55s cubic-bezier(0.25,0.46,0.45,0.94)',
                position: 'relative',
                display: 'block',
                overflow: 'hidden',
                transform: 'skewX(-15deg)',
              }}
            >
              {/* Image — counter-skew + centered */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left:  'calc(-21vh)',
                  right: 'calc(-21vh)',
                  transform: `skewX(15deg) scale(${isHov ? 1.1 : 1.0})`,
                  transformOrigin: '50% 50%',
                  transition: 'transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94)',
                  backgroundImage:    `url(${bgSrc})`,
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

              {/* Label */}
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
                  {area}
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
            </div>
          );

          return href ? (
            <Link key={i} to={href} style={{ display: 'contents' }}>
              {panel}
            </Link>
          ) : (
            <div key={i} style={{ display: 'contents' }}>
              {panel}
            </div>
          );
        })}
      </div>

      <div className="pb-20" />
    </section>
  );
};
