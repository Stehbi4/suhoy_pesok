import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { cities } from '@/data/logistics';

const LogisticsSection = () => {
  const packagingRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: packagingRef,
    offset: ['start 0.95', 'start 0.35'],
  });

  // Строка 1 — летит слева
  const x1 = useTransform(scrollYProgress, [0, 1], [-120, 0]);
  const op1 = useTransform(scrollYProgress, [0, 0.6], [0, 1]);

  // Строка 2 — летит справа, чуть позже
  const x2 = useTransform(scrollYProgress, [0.1, 1], [120, 0]);
  const op2 = useTransform(scrollYProgress, [0.1, 0.7], [0, 1]);

  // Строка 3 — летит слева, ещё позже
  const x3 = useTransform(scrollYProgress, [0.25, 1], [-120, 0]);
  const op3 = useTransform(scrollYProgress, [0.25, 0.85], [0, 1]);

  const transforms = [
    { x: x1, opacity: op1 },
    { x: x2, opacity: op2 },
    { x: x3, opacity: op3 },
  ];

  return (
    <section className="min-h-screen bg-brand-graphite flex flex-col overflow-hidden">

      {/* ── ВЕРХНЯЯ ЧАСТЬ: две колонки ───────────────────────────────── */}
      <div className="flex flex-1 min-h-0">

        {/* Левая: контент */}
        <div className="flex-1 flex flex-col px-[1cm] py-16">

          <p className="text-white/25 text-xs tracking-[0.6em] uppercase mb-10">
            Дилерская сеть и доставка
          </p>

          <h2
            className="font-light text-white leading-tight mb-10"
            style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}
          >
            Присутствие
            <br />
            <span className="font-medium">по всей России</span>
          </h2>

          {/* Города */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 mb-16">
            {cities.map((city, i) => (
              <div
                key={city.name}
                className="flex items-baseline gap-3 lg:gap-4 py-3 lg:py-3.5 border-b border-white/6"
              >
                <span className="text-white/18 font-mono text-xs lg:text-sm flex-shrink-0 tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0 flex-1">
                  <span className="text-white text-base lg:text-lg font-medium block leading-tight">
                    {city.name}
                  </span>
                  <span className="text-white/30 text-xs mt-0.5 block">{city.note}</span>
                </div>
                {city.isHQ && (
                  <span className="text-brand-red text-[10px] uppercase tracking-widest flex-shrink-0">
                    завод
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Форматы поставки */}
          <div ref={packagingRef}>
            <p className="text-white/18 text-[10px] tracking-[0.6em] uppercase mb-6">
              Форматы поставки
            </p>

            <div className="flex flex-col">

              {/* мешки 20 кг */}
              <motion.div style={{ x: x1, opacity: op1 }}
                className="border-t border-white/8 pt-4 pb-3"
              >
                <span className="text-white font-light tracking-tight leading-none"
                  style={{ fontSize: 'clamp(2rem, 6vw, 6rem)' }}>
                  мешки 20 кг
                </span>
              </motion.div>

              {/* МКР (биг-бэг) */}
              <motion.div style={{ x: x2, opacity: op2 }}
                className="border-t border-white/8 pt-4 pb-3"
              >
                <span className="text-white font-light tracking-tight leading-none"
                  style={{ fontSize: 'clamp(2rem, 6vw, 6rem)' }}>
                  МКР (биг-бэг)
                </span>
              </motion.div>

              {/* навалом */}
              <motion.div style={{ x: x3, opacity: op3 }}
                className="border-t border-white/8 pt-4 pb-3 border-b border-b-white/8"
              >
                <span className="font-light tracking-tight leading-none"
                  style={{
                    fontSize: 'clamp(3rem, 6vw, 6rem)',
                    background: 'linear-gradient(135deg, #ff4444 0%, #f80000 50%, #aa0000 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    filter: 'drop-shadow(0 0 20px rgba(248,0,0,0.35))',
                  }}>
                  навалом
                </span>
              </motion.div>

            </div>
          </div>
        </div>

        {/* Правая: фото + большая цифра */}
        <div className="hidden lg:block w-[45%] flex-shrink-0 relative">
          <img
            src="/transport.jpg"
            alt="Доставка"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-graphite via-brand-graphite/25 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-graphite/50 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
            <span
              className="font-light text-white leading-none tracking-tighter"
              style={{ fontSize: 'clamp(9rem, 18vw, 14rem)' }}
            >
              8
            </span>
            <span className="text-white/25 text-xs tracking-[0.5em] uppercase mt-2">
              регионов
            </span>
          </div>
        </div>

      </div>

    </section>
  );
};

export default LogisticsSection;
