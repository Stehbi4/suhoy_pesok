import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import type { Product } from './types';

/**
 * Editorial hero — тонкая типографика на фото, без карточки/градиента/линейки.
 * Слои: (1) фото, (2) мягкое локальное затемнение под текстом, (3) эдиториальная сетка.
 */
export const ProductHeroSection = ({ product }: { product: Product }) => {
  const img = product.images;
  const [value, unitRaw] = (product.fraction || product.shortName || '').split(' ');
  const unit = unitRaw || 'мм';
  // ASCII hyphen → typographic en-dash
  const valueTypo = value.replace(/-/g, '\u2013');

  return (
    <section className="relative h-screen overflow-hidden bg-black">
      {/* 1. Фото */}
      <img
        src={img.hero}
        alt={product.name}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* 2. Мягкое локальное затемнение — только слева/снизу под текстом.
             Без резкой линии перехода и без градиента в off-white. */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 80% at 20% 85%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 45%, transparent 75%)',
        }}
      />
      {/* тонкая виньетка сверху — чтобы хедер сайта читался */}
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-40 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.35), transparent)' }}
      />

      {/* 3. Эдиториальная сетка */}
      <div className="relative z-10 h-full px-[1cm] py-[1cm] flex flex-col">
        {/* Top rubric — малая метка в левом верхнем углу */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex items-center gap-4"
        >
          <span className="h-px w-10 bg-white/50" />
          <span className="text-[10px] uppercase tracking-[0.45em] text-white/75 font-light">
            Кварцевый песок
          </span>
        </motion.div>

        {/* Основной блок — у нижнего левого края */}
        <div className="mt-auto max-w-[min(92vw,1200px)]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex flex-col gap-6"
          >
            {/* small overline — artikul/fraction label */}
            <p className="text-[10px] uppercase tracking-[0.5em] text-white/55 font-light">
              Фракция
            </p>

            {/* Huge thin numeric heading */}
            <h1
              className="text-white leading-[0.9] flex items-baseline flex-wrap gap-x-4"
              style={{ fontWeight: 200, letterSpacing: '-0.01em' }}
            >
              <span
                style={{
                  fontSize: 'clamp(3.5rem, 11vw, 10.5rem)',
                  textShadow: '0 2px 40px rgba(0,0,0,0.35)',
                }}
              >
                {valueTypo}
              </span>
              <span
                className="text-white/65 font-light"
                style={{ fontSize: 'clamp(1.25rem, 2.2vw, 2rem)', letterSpacing: '0.04em' }}
              >
                {unit}
              </span>
            </h1>

            {/* hairline — никаких «плашек», просто тонкая линия */}
            <div className="h-px w-32 bg-white/35" />

            {/* Meta-row: ГОСТ + полное название */}
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
              <span
                className="text-white/85 text-xs tracking-[0.2em] font-mono"
                style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}
              >
                {product.gost}
              </span>
              <span className="hidden md:inline-block h-3 w-px bg-white/25" />
              <span className="text-white/70 text-sm md:text-base font-light max-w-xl leading-snug">
                {product.name}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Нижний правый угол — минималистичный scroll-hint (без линейки) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.7 }}
          className="absolute bottom-[1cm] right-[1cm] flex items-center gap-3 text-white/70"
        >
          <span className="text-[10px] uppercase tracking-[0.4em] font-light">
            Подробнее
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2.0, ease: 'easeInOut' }}
          >
            <ArrowDown className="w-5 h-5" strokeWidth={1.25} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
