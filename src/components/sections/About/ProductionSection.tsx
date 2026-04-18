import { motion } from 'framer-motion';

const categories = [
  'ЦМИД-4 — поликарбоксилаты',
  'ЦМИД-3 — ремонтные смеси',
  'ЦМИД-1К — гидроизоляция',
  'ГПМ / ГПМУЛЬТРА',
  'Инъекционные составы',
  'Противоморозные добавки',
  'Подливочные смеси',
  'Напольные составы',
];

const stats = [
  { val: '100+', label: 'наименований' },
  { val: '9',    label: 'категорий'    },
  { val: '2014', label: 'год запуска'  },
];

const ease = [0.25, 0.46, 0.45, 0.94] as const;

const ProductionSection = () => (
  <section className="min-h-screen bg-brand-graphite flex overflow-hidden relative">

    {/* ── ЛЕВАЯ ЧАСТЬ ────────────────────────────────────────────────── */}
    <div className="flex-1 flex flex-col justify-center px-[1cm] py-24 z-10 relative">

      <p className="text-white/25 text-xs tracking-[0.6em] uppercase mb-12">
        Наше производство
      </p>

      {/* Главное число */}
      <div className="mb-3 leading-none">
        <span className="font-light text-white tracking-tighter"
          style={{ fontSize: 'clamp(7rem, 16vw, 14rem)' }}>
          30 000
        </span>
      </div>
      <p className="text-white/40 text-2xl font-light tracking-[0.25em] uppercase mb-10">
        тонн / год
      </p>

      <div className="w-10 h-px bg-brand-red mb-10" />

      {/* Вторичные цифры */}
      <div className="flex gap-12 mb-10">
        {stats.map(({ val, label }) => (
          <div key={label}>
            <div className="text-white font-light leading-none"
              style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}>
              {val}
            </div>
            <div className="text-white/30 text-xs uppercase tracking-[0.35em] mt-2">
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Таблица категорий — 2 колонки */}
      <div className="grid grid-cols-2 gap-x-10 mb-10">
        {categories.map((cat, i) => (
          <div key={cat}
            className="flex items-baseline gap-4 py-3.5 border-b border-white/6">
            <span className="text-white/18 font-mono text-sm flex-shrink-0 tabular-nums">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="text-white text-lg font-medium leading-tight">{cat}</span>
          </div>
        ))}
      </div>

      {/* Сноска — выезжает снизу */}
      <motion.p
        className="text-white/50 text-xl font-light leading-snug col-span-2"
        style={{ maxWidth: '66%' }}
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.9, ease }}
      >
        Собственный завод в Санкт-Петербурге.{' '}
        <span style={{
          background: 'linear-gradient(135deg, #ff6644 0%, #f80000 50%, #aa0000 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          filter: 'drop-shadow(0 0 12px rgba(248,0,0,0.4))',
        }}>
          Первый отечественный производитель
        </span>{' '}
        поликарбоксилатных гиперпластификаторов.
      </motion.p>
    </div>

    {/* ── ПРАВАЯ ЧАСТЬ: фото ─────────────────────────────────────────── */}
    <div className="hidden lg:block w-[45%] flex-shrink-0 relative">
      <img src="/activity/3.Facktory.png" alt="Производство ЦМИД"
        className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-graphite via-brand-graphite/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-graphite/60 to-transparent" />
      <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
        <span className="font-light text-white leading-none tracking-tighter"
          style={{ fontSize: 'clamp(9rem, 18vw, 14rem)' }}>
          100+
        </span>
        <span className="text-white/25 text-xs tracking-[0.5em] uppercase mt-2">
          наименований
        </span>
      </div>
    </div>

  </section>
);

export default ProductionSection;
