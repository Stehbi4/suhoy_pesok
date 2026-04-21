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

// skewX(-9deg) — / направление. EXT — расширение контейнера за край экрана,
// чтобы скошенные полосы уходили за вьюпорт, а крайние кромки выглядели прямыми.
const EXT    = '6.5vh';
const SKEW   = 'skewX(-9deg)';
const UNSKEW = 'skewX(9deg)';

export const ProductApplicationsSection = ({ product }: { product: Product }) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const areas = product.applicationAreas ?? [];

  if (!areas.length) return null;

  return (
    <section className="bg-brand-bg" style={{ overflow: 'hidden' }}>
      <div className="px-[1cm] pt-20 pb-10">
        <ScrollReveal type="fade-up">
          <p className="text-[10px] uppercase tracking-[0.35em] text-gray-500 mb-4">Применение</p>
          <h2 className="text-4xl lg:text-5xl font-light tracking-tight text-white">Области применения</h2>
        </ScrollReveal>
      </div>

      <div style={{
        height: '78vh',
        display: 'flex',
        gap: '3px',
        marginLeft: `-${EXT}`,
        width: `calc(100% + 2 * ${EXT})`,
      }}>
        <div
          aria-hidden
          style={{ flex: `0 0 calc(${EXT} * 2)`, pointerEvents: 'none' }}
        />
        {areas.map((area, i) => {
          const art    = matchAreaToArticle(area);
          const bgSrc  = art?.image ?? `/img_fo_articles/${String(i + 1).padStart(2, '0')}.jpg`;
          const href   = art ? `/articles/${art.slug}` : `/articles`;
          const isHov  = hovered === i;
          const anyHov = hovered !== null;

          return (
            <Link
              key={i}
              to={href}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                flex: isHov ? 3 : 1,
                transition: 'flex 0.55s cubic-bezier(0.25,0.46,0.45,0.94)',
                position: 'relative',
                display: 'block',
                overflow: 'hidden',
                transform: SKEW,
              }}
            >
              <div style={{
                position: 'absolute',
                top: 0, bottom: 0,
                left:  `-${EXT}`,
                right: `-${EXT}`,
                transform: UNSKEW,
              }}>
                <img
                  src={bgSrc}
                  alt={area}
                  style={{
                    width: '100%', height: '100%',
                    objectFit: 'cover',
                    transform: `scale(${isHov ? 1.05 : 1.12})`,
                    transition: 'transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94)',
                  }}
                />
              </div>

              <div style={{
                position: 'absolute', inset: 0,
                background: `linear-gradient(to top,
                  rgba(0,0,0,${isHov ? 0.55 : 0.78}) 0%,
                  rgba(0,0,0,0.08) 55%,
                  transparent 100%)`,
                transition: 'background 0.4s',
              }} />

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
                  {area}
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
        <div
          aria-hidden
          style={{ flex: `0 0 calc(${EXT} * 2)`, pointerEvents: 'none' }}
        />
      </div>

      <div className="pb-20" />
    </section>
  );
};
