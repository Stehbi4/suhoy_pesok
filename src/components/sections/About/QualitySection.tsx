import React from 'react';
import { motion } from 'framer-motion';

const specs: { label: string; node: React.ReactNode }[] = [
  { label: 'водонепроницаемость', node: <>до W20</> },
  { label: 'морозостойкость',     node: <>F<sub style={{ fontSize: '0.65em', verticalAlign: 'sub' }}>2</sub>600+</> },
  { label: 'температура укладки', node: <>−50°C</> },
  { label: 'аккредитация',        node: <>ГОСТ Р</> },
];

const activities = [
  'Подбор и оптимизация составов бетона',
  'Самоуплотняющиеся бетоны (СУБ)',
  'Арктические и подводные составы',
  'Испытания: прочность, W, F, абразия',
  'Сертификация: ГОСТ, ФАВТ, СРО',
  'Инспекция бетонных заводов и лабораторий',
];

const ease = [0.25, 0.46, 0.45, 0.94] as const;

const QualitySection = () => (
  <section className="min-h-screen bg-brand-graphite flex overflow-hidden">

    {/* ── ЛЕВАЯ ЧАСТЬ: фото ─────────────────────────────────────────── */}
    <div className="hidden lg:block w-[45%] flex-shrink-0 relative">
      <img src="/activity/2.Lab.png" alt="Лаборатория ЦМИД"
        className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-l from-brand-graphite via-brand-graphite/25 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-graphite/50 to-transparent" />

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 select-none px-8">
        {specs.map(({ node, label }) => (
          <div key={label} className="flex flex-col items-center">
            <span className="font-light text-white leading-none tracking-tighter"
              style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}>
              {node}
            </span>
            <span className="text-white/30 text-[10px] tracking-[0.4em] uppercase mt-1">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>

    {/* ── ПРАВАЯ ЧАСТЬ: контент ──────────────────────────────────────── */}
    <div className="flex-1 flex flex-col justify-center px-[1cm] py-24">

      <p className="text-white/25 text-xs tracking-[0.6em] uppercase mb-12">
        Лаборатория — НИЦ
      </p>

      <h2 className="font-light text-white leading-tight mb-8 break-words"
        style={{ fontSize: 'clamp(1.8rem, 5.5vw, 5rem)' }}>
        Аккредитованный
        <br />
        <span className="font-medium">исследовательский</span>
        <br />
        центр
      </h2>

      <p className="text-white/45 text-base lg:text-lg leading-relaxed mb-10 max-w-sm">
        Испытания и разработка составов для критических объектов:
        АЭС, ГТС, мосты, арктика. Работаем с 1998 года.
      </p>

      {/* Таблица направлений — 1 колонка на мобильном, 2 на десктопе */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 mb-10">
        {activities.map((act, i) => (
          <div key={act}
            className="flex items-baseline gap-3 lg:gap-4 py-3 lg:py-3.5 border-b border-white/6">
            <span className="text-white/18 font-mono text-xs lg:text-sm flex-shrink-0 tabular-nums">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="text-white text-base lg:text-lg font-medium leading-tight">{act}</span>
          </div>
        ))}
      </div>

      {/* Кейс — выезжает снизу */}
      <motion.div
        className="border-l-2 border-brand-red pl-5"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.7, ease }}
      >
        <p className="text-white/25 text-xs uppercase tracking-widest mb-2">Кейс</p>
        <p className="text-white text-base font-medium">Арктик СПГ 2 — ПАО «НОВАТЭК»</p>
        <p className="text-white/45 text-sm mt-1">
          Состав F<span style={{ fontSize: '0.7em', verticalAlign: 'sub' }}>2</span>600+, W20. Укладка при −50°C. ЯНАО.
        </p>
      </motion.div>
    </div>

  </section>
);

export default QualitySection;
