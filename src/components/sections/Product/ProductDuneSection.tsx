import { BG_ALT, TEXT_DARK, RED } from '@/styles/theme';
import ScrollReveal from '@/components/ui/ScrollReveal';
import type { Product } from './types';

export const ProductDuneSection = ({ product }: { product: Product }) => {
  const sandPngSrc = product.images.hero.replace(/\/[^/]+$/, '/black-sand-background.png');

  return (
    <section className="relative overflow-hidden" style={{ minHeight: '100vh', background: BG_ALT }}>
      <img
        src={sandPngSrc}
        alt=""
        className="absolute bottom-0 left-0 w-full h-full pointer-events-none"
        style={{ objectFit: 'cover', objectPosition: 'bottom' }}
        onError={(e) => { e.currentTarget.src = product.images.bg || product.images.hero; }}
      />

      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{ height: 100, background: `linear-gradient(to bottom, transparent, ${TEXT_DARK})` }}
      />

      <div className="relative z-10 px-6 sm:px-10 lg:px-[1cm] pt-[1cm] pb-16 overflow-hidden">
        <h2
          className="font-bold tracking-tighter leading-[1.05] flex flex-col gap-1"
          style={{ fontSize: 'clamp(2.5rem, 9.375vw, 4.6875rem)', color: TEXT_DARK }}
        >
          <ScrollReveal type="slide-left" inline className="self-start">
            Самый <span style={{ color: RED, fontSize: '1.22em' }}>популярный</span>
          </ScrollReveal>
          <ScrollReveal type="slide-right" delay={0.1} inline className="self-end">
            для {product.popularSphere}
          </ScrollReveal>
        </h2>
      </div>
    </section>
  );
};
