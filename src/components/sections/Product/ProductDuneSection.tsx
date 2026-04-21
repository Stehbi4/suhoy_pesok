import { useEffect, useRef, useState } from 'react';
import { BG_ALT, BG_PAGE, RED } from '@/styles/theme';
import { getLenis } from '@/components/ui/SmoothScroll';
import type { Product } from './types';

export const ProductDuneSection = ({ product }: { product: Product }) => {
  const sandPngSrc = product.images.hero.replace(/\/[^/]+$/, '/BG.png');

  const sectionRef = useRef<HTMLElement>(null);
  // 0 — секция ещё не въехала снизу; 1 — полностью прошла
  const [p, setP] = useState(0);

  useEffect(() => {
    let last = -1;
    const update = () => {
      const el = sectionRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const raw = (vh - r.top) / (vh + r.height);
      const next = Math.max(0, Math.min(1, raw));
      if (Math.abs(next - last) > 0.001) {
        last = next;
        setP(next);
      }
    };
    update();

    // Привязка к Lenis (нативный scroll-event подавлен smooth-scroll-ом),
    // плюс страховка через window.scroll + resize.
    let detachLenis: (() => void) | null = null;
    const tryAttachLenis = () => {
      const lenis = getLenis();
      if (lenis) {
        lenis.on('scroll', update);
        detachLenis = () => lenis.off('scroll', update);
        return true;
      }
      return false;
    };
    if (!tryAttachLenis()) {
      // Lenis создаётся в useEffect SmoothScroll — может появиться чуть позже.
      const id = setInterval(() => { if (tryAttachLenis()) clearInterval(id); }, 100);
      setTimeout(() => clearInterval(id), 3000);
    }

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      detachLenis?.();
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  // мапим p ∈ [0, 0.5] → движение от края к центру
  const t = Math.max(0, Math.min(1, p / 0.5));
  const xLeft  = `${(t - 1) * 60}%`;   // -60% → 0%
  const xRight = `${(1 - t) * 60}%`;   //  60% → 0%
  const opacity = Math.max(0, Math.min(1, p / 0.25));

  return (
    <section ref={sectionRef} className="relative overflow-hidden" style={{ minHeight: '100vh', background: BG_ALT }}>
      <img
        src={sandPngSrc}
        alt=""
        className="absolute bottom-0 left-0 w-full h-full pointer-events-none"
        style={{ objectFit: 'cover', objectPosition: 'bottom' }}
        onError={(e) => { e.currentTarget.src = product.images.bg || product.images.hero; }}
      />

      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{ height: 280, background: `linear-gradient(to bottom, transparent, ${BG_PAGE})` }}
      />

      <div className="relative z-10 px-6 sm:px-10 lg:px-[1cm] pt-[1cm] pb-16 overflow-hidden">
        <h2
          className="font-bold tracking-tighter leading-[1.05] flex flex-col gap-1"
          style={{ fontSize: 'clamp(2.5rem, 9.375vw, 4.6875rem)', color: '#FFFFFF' }}
        >
          <span
            className="self-start inline-block"
            style={{ transform: `translateX(${xLeft})`, opacity, willChange: 'transform' }}
          >
            Самый <span style={{ color: RED, fontSize: '1.22em' }}>популярный</span>
          </span>
          <span
            className="self-end inline-block"
            style={{ transform: `translateX(${xRight})`, opacity, willChange: 'transform' }}
          >
            для {product.popularSphere}
          </span>
        </h2>
      </div>
    </section>
  );
};
