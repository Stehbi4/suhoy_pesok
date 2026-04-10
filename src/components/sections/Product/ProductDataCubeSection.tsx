import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { BG_ALT, TEXT_DARK, RED } from '@/styles/theme';
import { LightCard } from './ProductCards';
import { SandPieChart, ColorPieChart, grainColor } from './ProductCharts';
import type { Product } from './types';

export const ProductDataCubeSection = ({ product }: { product: Product }) => {
  const [[cubeSlide, cubeDir], setCube] = useState<[number, number]>([0, 1]);
  const [copiedRow, setCopiedRow] = useState<string | null>(null);
  const [gActive, setGActive]    = useState<string | null>(null);
  const [cActive, setCActive]    = useState<string | null>(null);

  const changeCube = (next: number) => setCube([next, next > cubeSlide ? 1 : -1]);

  const cubeVariants = {
    enter:  (dir: number) => ({ rotateY: dir * 80,  opacity: 0, filter: 'brightness(0.45)' }),
    center:             { rotateY: 0,           opacity: 1, filter: 'brightness(1)' },
    exit:   (dir: number) => ({ rotateY: dir * -80, opacity: 0, filter: 'brightness(0.45)' }),
  };
  const cubeTrans = { duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] };
  const slideLabels = ['Характеристики', 'Гранулометрия', 'Химический состав'];

  const handleCopyRow = (key: string, value: string | number) => {
    navigator.clipboard.writeText(`${key}: ${value}`);
    setCopiedRow(key);
    setTimeout(() => setCopiedRow(null), 2000);
  };

  const sieveEntries = Object.entries(product.sieveAnalysis  || {}).filter(([, v]) => v > 0);
  const sieveTotal   = sieveEntries.reduce((s, [, v]) => s + v, 0);
  const chemEntries  = Object.entries(product.chemicalComposition || {});
  const chemTotal    = chemEntries.reduce((s, [, v]) => s + v, 0);

  // Color map matching ColorPieChart's sorted assignment (largest → graphite, smallest → red)
  const chemColorMap = (() => {
    const sorted = [...chemEntries].sort(([, a], [, b]) => b - a);
    let gi = 0, ri = 0;
    const map = new Map<string, string>();
    sorted.forEach(([el, v]) => {
      const pct = chemTotal > 0 ? (v / chemTotal) * 100 : 0;
      map.set(el, grainColor(pct, gi, ri));
      if (pct >= 10) gi++; else ri++;
    });
    return map;
  })();

  return (
    <section style={{ background: BG_ALT, overflow: 'hidden', position: 'relative' }}>

      {/* ── Arrow left ── */}
      <motion.button
        whileHover={{ scale: 1.13 }} whileTap={{ scale: 0.92 }}
        onClick={() => changeCube((cubeSlide - 1 + 3) % 3)}
        style={{
          position: 'absolute', left: '1.5rem', top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 30, width: 62, height: 62,
          borderRadius: '50%',
          background: 'rgba(0,0,0,0.07)',
          border: '1.5px solid rgba(0,0,0,0.14)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <ChevronLeft className="w-9 h-9" style={{ color: TEXT_DARK }} strokeWidth={1.8} />
      </motion.button>

      {/* ── Arrow right ── */}
      <motion.button
        whileHover={{ scale: 1.13 }} whileTap={{ scale: 0.92 }}
        onClick={() => changeCube((cubeSlide + 1) % 3)}
        style={{
          position: 'absolute', right: '1.5rem', top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 30, width: 62, height: 62,
          borderRadius: '50%',
          background: 'rgba(0,0,0,0.07)',
          border: '1.5px solid rgba(0,0,0,0.14)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <ChevronRight className="w-9 h-9" style={{ color: TEXT_DARK }} strokeWidth={1.8} />
      </motion.button>

      {/* ── Title row ── */}
      <div style={{
        paddingTop: '0.375rem', paddingBottom: '0.125rem',
        paddingLeft: '1cm', paddingRight: '7rem',
        display: 'flex', alignItems: 'center', overflow: 'hidden',
        position: 'relative', zIndex: 20,
      }}>
        {/* Current title — click → previous slide */}
        <button
          onClick={() => changeCube((cubeSlide - 1 + 3) % 3)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0, padding: 0 }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.h2
              key={`title-${cubeSlide}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.32, ease: 'easeOut' }}
              className="text-4xl lg:text-5xl font-light tracking-tighter select-none"
              style={{ color: TEXT_DARK, whiteSpace: 'nowrap' }}
            >
              {slideLabels[cubeSlide]}
            </motion.h2>
          </AnimatePresence>
        </button>

        <div style={{ flexShrink: 0, width: 100 }} />

        {/* Ghost right — next slide */}
        <button
          onClick={() => changeCube((cubeSlide + 1) % 3)}
          style={{
            flexShrink: 0, width: 200, overflow: 'hidden',
            textAlign: 'left',
            background: 'none', border: 'none', cursor: 'pointer',
            WebkitMaskImage: 'linear-gradient(to right, black 0%, transparent 100%)',
            maskImage: 'linear-gradient(to right, black 0%, transparent 100%)',
          }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={`gr-${cubeSlide}`}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="text-4xl lg:text-5xl font-light tracking-tighter whitespace-nowrap"
              style={{ color: TEXT_DARK, opacity: 0.4 }}
            >
              {slideLabels[(cubeSlide + 1) % 3]}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>

      {/* ── Cube viewport ── */}
      <div
        className="flex justify-center"
        style={{ perspective: '2400px', perspectiveOrigin: '50% 38%', paddingBottom: '0.25rem' }}
      >
        <div style={{ width: '90vw', maxWidth: 1440, position: 'relative' }}>
          <AnimatePresence custom={cubeDir} mode="wait" initial={false}>
            <motion.div
              key={cubeSlide}
              custom={cubeDir}
              variants={cubeVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={cubeTrans}
              style={{
                transformPerspective: 2400,
                transformOrigin: 'center center',
                willChange: 'transform, opacity, filter',
              }}
            >

              {/* ── SLIDE 0: Characteristics table ── */}
              {cubeSlide === 0 && (
                <div className="flex flex-col items-center py-10">
                  <LightCard className="rounded-3xl p-8 lg:p-10" style={{ width: '75%' }}>
                    <p className="text-sm uppercase tracking-[0.35em] text-gray-400 mb-8 text-center">
                      Физико-механические свойства
                    </p>
                    <div className="divide-y divide-black/5">
                      {Object.entries(product.technicalData || {}).map(([key, value]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between py-4 -mx-4 px-4 rounded-lg hover:bg-black/[0.025] transition-colors cursor-pointer group"
                          onClick={() => handleCopyRow(key, String(value))}
                        >
                          <span className="text-gray-500 text-xl pr-6 leading-snug">{key}</span>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <span className="font-mono text-2xl font-medium" style={{ color: TEXT_DARK }}>{String(value)}</span>
                            {copiedRow === key
                              ? <Check className="w-5 h-5 text-green-600" />
                              : <Copy className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            }
                          </div>
                        </div>
                      ))}
                      <div className="flex items-center justify-between py-4">
                        <span className="text-gray-500 text-xl">Стандарт</span>
                        <span className="font-mono text-xl font-medium" style={{ color: RED }}>{product.gost}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 mt-6 text-center">Нажмите на строку, чтобы скопировать</p>
                  </LightCard>
                </div>
              )}

              {/* ── SLIDE 1: Granulometry ── */}
              {cubeSlide === 1 && (
                <>
                  {/* Mobile */}
                  <div className="flex flex-col gap-4 md:hidden">
                    <div style={{ width: '100%', aspectRatio: '1 / 1', overflow: 'hidden' }}>
                      <SandPieChart
                        data={product.sieveAnalysis || {}}
                        size={340}
                        active={gActive}
                        onActive={setGActive}
                      />
                    </div>
                    <div className="rounded-2xl p-4" style={{
                      background: 'rgba(237,236,234,0.92)',
                      border: '1px solid rgba(0,0,0,0.07)',
                    }}>
                      <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-2">Остатки на ситах, %</p>
                      {(() => {
                        let gi = 0, ri = 0;
                        return sieveEntries.map(([key, value]) => {
                          const pct = (value / sieveTotal) * 100;
                          const color = grainColor(pct, gi, ri);
                          if (pct >= 10) gi++; else ri++;
                          return (
                            <div key={key} className="flex items-center gap-2 py-1.5"
                              style={{ opacity: gActive && gActive !== key ? 0.35 : 1, transition: 'opacity 0.2s' }}
                              onMouseEnter={() => setGActive(key)} onMouseLeave={() => setGActive(null)}
                            >
                              <div className="w-3 h-3 rounded-full flex-shrink-0"
                                style={{ background: gActive === key ? RED : color }} />
                              <span className="font-mono text-xs text-gray-600 flex-1">{key}</span>
                              <span className="font-mono text-base font-bold" style={{ color: TEXT_DARK }}>{value}%</span>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>

                  {/* Desktop */}
                  <div className="hidden md:block relative" style={{ height: '96vh', minHeight: 580 }}>
                    <div style={{
                      position: 'absolute', left: '3%', top: '35%',
                      transform: 'translateY(-50%)',
                      height: 'min(105vh, 103vw)', width: 'min(105vh, 103vw)', maxWidth: '87vw',
                    }}>
                      <SandPieChart
                        data={product.sieveAnalysis || {}}
                        size={855}
                        active={gActive}
                        onActive={setGActive}
                      />
                    </div>
                    <div className="absolute flex flex-col gap-3 rounded-2xl p-5" style={{
                      top: 0, right: 0, width: 280,
                      background: 'rgba(237,236,234,0.85)',
                      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                      border: '1px solid rgba(0,0,0,0.07)',
                      boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                    }}>
                      <p className="text-lg uppercase tracking-[0.3em] text-gray-400 mb-0.5">Остатки на ситах, %</p>
                      {(() => {
                        let gi = 0, ri = 0;
                        return sieveEntries.map(([key, value]) => {
                          const pct = (value / sieveTotal) * 100;
                          const color = grainColor(pct, gi, ri);
                          if (pct >= 10) gi++; else ri++;
                          return (
                            <div key={key} className="flex items-center gap-3 cursor-pointer"
                              style={{ opacity: gActive && gActive !== key ? 0.35 : 1, transition: 'opacity 0.2s' }}
                              onMouseEnter={() => setGActive(key)} onMouseLeave={() => setGActive(null)}
                            >
                              <div className="w-6 h-6 rounded-full flex-shrink-0"
                                style={{ background: gActive === key ? RED : color }} />
                              <span className="font-mono text-xl text-gray-600 flex-1">{key}</span>
                              <span className="font-mono text-2xl font-bold" style={{ color: TEXT_DARK }}>{value}%</span>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>
                </>
              )}

              {/* ── SLIDE 2: Chemical ── */}
              {cubeSlide === 2 && (
                <>
                  {/* Mobile */}
                  <div className="flex flex-col gap-4 md:hidden">
                    <div style={{ width: '100%', aspectRatio: '1 / 1', overflow: 'hidden' }}>
                      <ColorPieChart
                        data={product.chemicalComposition || {}}
                        size={340}
                        fill={true}
                        active={cActive}
                        onActive={setCActive}
                      />
                    </div>
                    <div className="rounded-2xl p-4" style={{
                      background: 'rgba(237,236,234,0.92)',
                      border: '1px solid rgba(0,0,0,0.07)',
                    }}>
                      <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-2">Оксиды, %</p>
                      {chemEntries.map(([el, pct]) => {
                        const color = chemColorMap.get(el) ?? '#888';
                        const isOn  = cActive === el;
                        return (
                          <div key={el} className="flex items-center gap-2 py-1.5 cursor-pointer"
                            style={{ opacity: cActive && !isOn ? 0.35 : 1, transition: 'opacity 0.2s' }}
                            onMouseEnter={() => setCActive(el)} onMouseLeave={() => setCActive(null)}
                          >
                            <div className="flex-shrink-0 rounded" style={{
                              width: 12, height: 12, background: color,
                              boxShadow: isOn ? `0 0 8px ${color}cc` : 'none',
                              transition: 'box-shadow 0.2s',
                            }} />
                            <span className="font-mono text-xs flex-1" style={{ color: 'rgba(0,0,0,0.55)', fontWeight: isOn ? 600 : 400 }}>
                              {el}
                            </span>
                            <span className="font-mono text-base font-bold" style={{ color: isOn ? color : TEXT_DARK }}>
                              {pct}%
                            </span>
                          </div>
                        );
                      })}
                      <div className="mt-2 pt-2" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-gray-400 uppercase tracking-widest">Сумма</span>
                          <span className="font-mono text-sm font-semibold" style={{ color: TEXT_DARK }}>{chemTotal.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Desktop */}
                  <div className="hidden md:block relative" style={{ height: '96vh', minHeight: 580 }}>
                    <div style={{
                      position: 'absolute', left: '3%', top: '35%',
                      transform: 'translateY(-50%)',
                      height: 'min(105vh, 103vw)', width: 'min(105vh, 103vw)', maxWidth: '87vw',
                    }}>
                      <ColorPieChart
                        data={product.chemicalComposition || {}}
                        size={855}
                        fill={true}
                        active={cActive}
                        onActive={setCActive}
                      />
                    </div>
                    <div className="absolute flex flex-col gap-3 rounded-2xl p-5" style={{
                      top: 0, right: 0, width: 280,
                      background: 'rgba(237,236,234,0.85)',
                      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                      border: '1px solid rgba(0,0,0,0.07)',
                      boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                    }}>
                      <p className="text-lg uppercase tracking-[0.3em] text-gray-400 mb-0.5">Оксиды, %</p>
                      {chemEntries.map(([el, pct]) => {
                        const color = chemColorMap.get(el) ?? '#888';
                        const isOn  = cActive === el;
                        return (
                          <div key={el} className="flex items-center gap-3 cursor-pointer"
                            style={{ opacity: cActive && !isOn ? 0.35 : 1, transition: 'opacity 0.2s' }}
                            onMouseEnter={() => setCActive(el)} onMouseLeave={() => setCActive(null)}
                          >
                            <div className="flex-shrink-0 rounded" style={{
                              width: 22, height: 22, background: color,
                              boxShadow: isOn ? `0 0 10px ${color}cc` : 'none',
                              transition: 'box-shadow 0.2s',
                            }} />
                            <span className="font-mono text-xl flex-1" style={{ color: 'rgba(0,0,0,0.55)', fontWeight: isOn ? 600 : 400 }}>
                              {el}
                            </span>
                            <span className="font-mono text-2xl font-bold" style={{ color: isOn ? color : TEXT_DARK }}>
                              {pct}%
                            </span>
                          </div>
                        );
                      })}
                      <div className="mt-1 pt-3" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                        <div className="flex justify-between items-center">
                          <span className="text-lg text-gray-400 uppercase tracking-widest">Сумма</span>
                          <span className="font-mono text-2xl font-semibold" style={{ color: TEXT_DARK }}>{chemTotal.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
