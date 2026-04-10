import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { BG_PAGE, BG_DARK, TEXT_DARK } from '@/styles/theme';
import type { Product } from './types';

export const ProductHeroSection = ({ product }: { product: Product }) => {
  const [rulerX, setRulerX] = useState(50);
  const img = product.images;

  return (
    <section
      className="relative h-screen flex items-center justify-center overflow-hidden"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setRulerX(((e.clientX - r.left) / r.width) * 100);
      }}
    >
      <img src={img.hero} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />

      {/* Gradient → off-white at bottom */}
      <div className="absolute bottom-0 left-0 right-0" style={{
        height: '42%',
        background: `linear-gradient(to bottom, transparent 0%, rgba(245,244,242,0.6) 55%, ${BG_PAGE} 100%)`,
      }} />

      {/* Badge */}
      <motion.div
        className="relative z-10 text-center"
        initial={{ y: 28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.95, ease: 'easeOut' }}
      >
        <div
          className="inline-block px-10 sm:px-14 py-8 sm:py-10 rounded-3xl"
          style={{
            background: 'rgba(255,255,255,0.11)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.22)',
            boxShadow: '0 28px 72px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.24)',
          }}
        >
          <p className="text-white/55 text-[10px] uppercase tracking-[0.5em] mb-4">Кварцевый песок</p>
          <h1 className="text-[clamp(2.2rem,6.5vw,5rem)] font-bold tracking-tighter text-white leading-none drop-shadow-lg">
            {product.shortName}
          </h1>
          <p className="text-white/30 text-xs mt-4 font-mono tracking-widest">{product.gost}</p>
        </div>
        <div className="mx-16 h-3 rounded-full blur-xl opacity-50 -mt-1" style={{ background: 'rgba(0,0,0,0.8)' }} />
      </motion.div>

      {/* Floating CTA arrow */}
      <motion.div
        className="absolute z-20 bottom-14 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.7 }}
      >
        <span className="text-[10px] uppercase tracking-[0.4em] font-semibold" style={{ color: TEXT_DARK }}>Подробнее</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.9, ease: 'easeInOut' }}>
          <ArrowDown className="w-10 h-10" style={{ color: TEXT_DARK }} strokeWidth={1.5} />
        </motion.div>
      </motion.div>

      {/* Interactive ruler */}
      <div
        className="absolute bottom-0 left-0 right-0 z-30 cursor-crosshair overflow-hidden"
        style={{ height: 44, background: BG_DARK }}
      >
        <div aria-hidden className="absolute inset-0 pointer-events-none" style={{
          background: `radial-gradient(ellipse 24% 100% at ${rulerX}% 110%, rgba(255,255,255,0.30) 0%, transparent 100%)`,
        }} />
        <div className="absolute bottom-0 left-0 right-0 flex h-full items-end pb-1.5 px-1">
          {Array.from({ length: 100 }, (_, i) => (
            <div key={i} className="flex-1 flex justify-center items-end">
              <div style={{
                width: 1,
                height: i % 10 === 0 ? 18 : i % 5 === 0 ? 11 : 5,
                background: `rgba(255,255,255,${i % 10 === 0 ? 0.46 : i % 5 === 0 ? 0.23 : 0.11})`,
              }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
