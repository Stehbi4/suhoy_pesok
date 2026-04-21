import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { products } from '@/data/articles';

type Product = typeof products[number] & {
  chemicalComposition?: Record<string, number>;
  sieveAnalysis?: Record<string, number>;
  technicalData?: Record<string, string | number>;
};

/* ─────────────── block 1: full parameter matrix ─────────────── */

const FULL_ROWS: Array<{
  label: string;
  get: (p: Product) => string | number;
  group?: string;
}> = [
  { label: 'ГОСТ',                                    get: (p) => p.gost || '—' },
  { label: 'Фракция, мм',                             get: (p) => (p.technicalData?.['Фракция песка, мм'] as string) || p.fraction },
  { label: 'Форма зерна',                             get: (p) => (p.technicalData?.['Форма зерна'] as string) || p.specifications?.['Форма зёрен'] || '—', group: 'Физические свойства' },
  { label: 'Насыпная плотность, кг/м³',               get: (p) => (p.technicalData?.['Насыпная плотность, кг/м³'] as string) || p.specifications?.['Насыпная плотность']?.replace(' кг/м³', '') || '—' },
  { label: 'Влажность, %, ≤',                         get: (p) => (p.technicalData?.['Влажность, %, не более'] as number) ?? '—' },
  { label: 'Модуль крупности',                        get: (p) => (p.technicalData?.['Модуль крупности'] as string) || '—' },
  { label: 'pH водной вытяжки',                       get: (p) => (p.technicalData?.['pH водной вытяжки'] as number) ?? '—' },
  { label: 'Радионуклиды, Бк/кг',                     get: (p) => (p.technicalData?.['Удельная эффективная активность естественных радионуклидов, Бк/кг'] as number) ?? '—' },
  { label: 'SiO₂, %, ≥',                              get: (p) => p.chemicalComposition?.['SiO₂'] ?? '—', group: 'Химический состав' },
  { label: 'Al₂O₃, %',                                get: (p) => p.chemicalComposition?.['Al₂O₃'] ?? '—' },
  { label: 'Fe₂O₃, %',                                get: (p) => p.chemicalComposition?.['Fe₂O₃'] ?? '—' },
  { label: 'K₂O, %',                                  get: (p) => p.chemicalComposition?.['K₂O'] ?? '—' },
  { label: 'Na₂O, %',                                 get: (p) => p.chemicalComposition?.['Na₂O'] ?? '—' },
  { label: 'CaO, %',                                  get: (p) => p.chemicalComposition?.['CaO'] ?? '—' },
  { label: 'MgO, %',                                  get: (p) => p.chemicalComposition?.['MgO'] ?? '—' },
  { label: 'Пылев./глинистые, %, ≤',                  get: (p) => (p.technicalData?.['Содержание пылевидных и глинистых частиц, %, не более'] as string) || '—' },
  { label: 'Фасовка',                                 get: (p) => p.packaging?.join(', ') || '—', group: 'Поставка' },
];

/* ─────────────── block 2: interactive comparison ─────────────── */

const SIEVE_KEYS = ['2,5 мм', '1,25 мм', '0,63 мм', '0,315 мм', '0,16 мм', '< 0,16 мм'];

const COMPARE_ROWS: Array<{ label: string; get: (p: Product) => string | number }> = [
  { label: 'SiO₂, %',               get: (p) => p.chemicalComposition?.['SiO₂'] ?? '—' },
  { label: 'Fe₂O₃, %',              get: (p) => p.chemicalComposition?.['Fe₂O₃'] ?? '—' },
  { label: 'Al₂O₃, %',              get: (p) => p.chemicalComposition?.['Al₂O₃'] ?? '—' },
  { label: 'Размер зерна, мм',      get: (p) => (p.technicalData?.['Фракция песка, мм'] as string) || p.fraction },
  { label: 'Форма зерна',           get: (p) => (p.technicalData?.['Форма зерна'] as string) || '—' },
  { label: 'Насып. плотность, кг/м³', get: (p) => (p.technicalData?.['Насыпная плотность, кг/м³'] as string) || '—' },
  { label: 'Влажность, %',          get: (p) => `≤ ${p.technicalData?.['Влажность, %, не более'] ?? '0,5'}` },
  { label: 'Мин. партия, т',        get: () => '1' },
];

const USE_FILTERS: Array<{ key: string; label: string; match: (p: Product) => boolean }> = [
  { key: 'all',          label: 'Все',          match: () => true },
  { key: 'glass',        label: 'Стекло',       match: (p) => p.applicationAreas?.some((a) => a.includes('стекла')) ?? false },
  { key: 'filter',       label: 'Фильтрация',   match: (p) => p.applicationAreas?.some((a) => a.includes('фильтрации')) ?? false },
  { key: 'floors',       label: 'Полы / ССС',   match: (p) => p.applicationAreas?.some((a) => a.includes('смесей')) ?? false },
  { key: 'sandblast',    label: 'Пескоструй',   match: (p) => p.applicationAreas?.some((a) => a.includes('пескоструйных') || a.includes('гидропескоструйных')) ?? false },
  { key: 'sport',        label: 'Спорт',        match: (p) => p.applicationAreas?.some((a) => a.includes('спортивных')) ?? false },
  { key: 'sandbox',      label: 'Песочницы',    match: (p) => p.applicationAreas?.some((a) => a.includes('песочниц')) ?? false },
  { key: 'roof',         label: 'Кровля',       match: (p) => p.applicationAreas?.some((a) => a.includes('кровельных')) ?? false },
];

/* selected-column palette for the interactive matrix */
const SEL_COLORS = ['#0a0a0a', '#f80000', '#3f3f46', '#b91c1c'];

/* ─────────────── component ─────────────── */

const ComparePage = () => {
  const navigate = useNavigate();

  // Block 2 state
  const [useFilter, setUseFilter] = useState('all');
  const [selected, setSelected] = useState<string[]>([products[0]?.id, products[3]?.id].filter(Boolean) as string[]);

  const filterFn = USE_FILTERS.find((f) => f.key === useFilter)?.match ?? (() => true);
  const visibleProducts = useMemo(() => products.filter(filterFn), [useFilter]);

  const selectedProducts = useMemo(
    () => visibleProducts.filter((p) => selected.includes(p.id)),
    [visibleProducts, selected]
  );

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 4) return [...prev.slice(1), id];
      return [...prev, id];
    });
  };

  const clearSelection = () => setSelected([]);

  /* grouped-bar chart data */
  const chartSeries = selectedProducts
    .filter((p) => p.sieveAnalysis)
    .map((p, i) => ({
      id: p.id,
      label: p.shortName || p.fraction,
      color: SEL_COLORS[selected.indexOf(p.id) % SEL_COLORS.length],
      data: SIEVE_KEYS.map((k) => (p.sieveAnalysis as Record<string, number>)[k] ?? 0),
    }));
  const chartMax = Math.max(60, ...chartSeries.flatMap((s) => s.data));

  return (
    <main className="min-h-screen bg-white">
      {/* ─────────── Compact Hero ─────────── */}
      <section className="relative bg-brand-page border-b border-gray-200 pt-28 pb-12 md:pt-32 md:pb-16">
        <div className="w-full px-[1cm]">
          <button
            onClick={() => navigate(-1)}
            className="group inline-flex items-center gap-2 text-sm text-gray-600 hover:text-brand-red transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="uppercase tracking-widest">Назад в каталог</span>
          </button>

          <div className="flex items-baseline gap-4 text-[11px] tracking-[0.2em] text-gray-500 uppercase mb-4">
            <span className="font-mono">02 / матрица</span>
            <span className="h-px flex-1 bg-gray-300 max-w-[80px]" />
            <span>{products.length} фракций</span>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl lg:text-7xl font-medium text-gray-900 leading-[0.95] tracking-tight"
          >
            Сравнение<br />
            <span className="text-brand-red">характеристик</span>
          </motion.h1>

          <p className="mt-6 max-w-2xl text-gray-600 text-base md:text-lg">
            Физико‑химические параметры всех фракций в одной таблице. Ниже — интерактивная
            матрица: выбирайте до четырёх фракций и сравнивайте гранулометрию.
          </p>
        </div>
      </section>

      {/* ─────────── Block 1 — Full matrix ─────────── */}
      <section className="relative py-16 md:py-20">
        <div className="w-full px-[1cm]">
          <header className="mb-8 md:mb-10">
            <div className="text-[11px] tracking-[0.2em] text-gray-500 uppercase font-mono mb-2">
              01 / Полная таблица
            </div>
            <h2 className="text-3xl md:text-4xl font-medium text-gray-900">
              Все фракции. Все характеристики.
            </h2>
          </header>

          <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-sm" style={{ minWidth: 960 }}>
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="sticky left-0 z-10 bg-gray-50 text-left px-5 py-4 text-[11px] tracking-[0.15em] uppercase text-gray-500 font-medium w-[240px]">
                      Параметр
                    </th>
                    {products.map((p) => (
                      <th
                        key={p.id}
                        className="text-left px-4 py-4 font-medium text-gray-900 border-l border-gray-100 min-w-[150px]"
                      >
                        <div className="font-mono text-[13px] text-gray-900">{p.fraction}</div>
                        <Link
                          to={`/product/${p.slug}`}
                          className="text-[11px] text-gray-400 hover:text-brand-red uppercase tracking-wider"
                        >
                          открыть →
                        </Link>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {FULL_ROWS.map((row, ri) => (
                    <tr
                      key={row.label}
                      className={`border-b border-gray-100 last:border-0 ${ri % 2 ? 'bg-white' : 'bg-gray-50/40'}`}
                    >
                      <td className="sticky left-0 z-10 bg-inherit px-5 py-3 text-gray-600">
                        {row.group && (
                          <div className="text-[9px] tracking-[0.2em] uppercase text-brand-red mb-0.5 font-mono">
                            {row.group}
                          </div>
                        )}
                        <div>{row.label}</div>
                      </td>
                      {products.map((p) => (
                        <td key={p.id} className="px-4 py-3 font-mono text-gray-900 border-l border-gray-100">
                          {String(row.get(p as Product))}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 text-xs text-gray-500 md:hidden">
            Потяните таблицу вбок, чтобы увидеть все фракции →
          </div>
        </div>
      </section>

      {/* ─────────── Block 2 — Interactive comparison ─────────── */}
      <section className="relative py-16 md:py-24 bg-brand-page border-t border-gray-200">
        <div className="w-full px-[1cm]">
          {/* section header */}
          <header className="flex flex-wrap items-end justify-between gap-6 mb-8 md:mb-10">
            <div>
              <div className="text-[11px] tracking-[0.2em] text-gray-500 uppercase font-mono mb-2">
                02 / Матрица
              </div>
              <h2 className="text-3xl md:text-4xl font-medium text-gray-900">
                Сравнение фракций
              </h2>
              <p className="mt-2 text-gray-600 max-w-xl">
                Выберите до четырёх фракций — клик по колонке переключает сравнение.
              </p>
            </div>

            <button
              onClick={clearSelection}
              disabled={selected.length === 0}
              className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-brand-red transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-brand-red" />
              Очистить выбор
            </button>
          </header>

          {/* filter chips */}
          <div className="mb-6">
            <div className="text-[10px] tracking-[0.2em] uppercase text-gray-500 mb-3 font-mono">
              Фильтр по задаче
            </div>
            <div className="flex flex-wrap gap-2">
              {USE_FILTERS.map((f) => {
                const active = useFilter === f.key;
                return (
                  <button
                    key={f.key}
                    onClick={() => setUseFilter(f.key)}
                    className={`px-4 py-2 text-sm rounded-full border transition-all ${
                      active
                        ? 'bg-gray-900 text-white border-gray-900'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-900'
                    }`}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* compare table */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm" style={{ minWidth: 720 }}>
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="sticky left-0 z-10 bg-white text-left px-5 py-4 text-[11px] tracking-[0.15em] uppercase text-gray-500 font-medium w-[240px]">
                      Параметр
                    </th>
                    {visibleProducts.map((p) => {
                      const isSel = selected.includes(p.id);
                      const selIdx = selected.indexOf(p.id);
                      return (
                        <th
                          key={p.id}
                          onClick={() => toggleSelect(p.id)}
                          className={`cursor-pointer select-none text-left px-4 py-4 border-l transition-all ${
                            isSel
                              ? 'text-white'
                              : selected.length > 0
                                ? 'bg-white text-gray-400 border-gray-100'
                                : 'bg-white text-gray-900 border-gray-100 hover:bg-gray-50'
                          }`}
                          style={isSel ? { background: SEL_COLORS[selIdx % SEL_COLORS.length], borderColor: 'transparent' } : undefined}
                        >
                          <div className="font-mono text-[13px]">{p.fraction}</div>
                          <div className={`text-[10px] uppercase tracking-widest mt-0.5 ${isSel ? 'text-white/70' : 'text-gray-400'}`}>
                            {isSel ? `выбрано · ${selIdx + 1}` : 'выбрать'}
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {COMPARE_ROWS.map((row, ri) => (
                    <tr key={row.label} className={`border-b border-gray-100 last:border-0 ${ri % 2 ? 'bg-white' : 'bg-gray-50/40'}`}>
                      <td className="sticky left-0 z-10 bg-inherit px-5 py-3.5 text-gray-600">
                        {row.label}
                      </td>
                      {visibleProducts.map((p) => {
                        const isSel = selected.includes(p.id);
                        const selIdx = selected.indexOf(p.id);
                        return (
                          <td
                            key={p.id}
                            className={`px-4 py-3.5 font-mono border-l border-gray-100 transition-all ${
                              isSel ? 'text-white font-semibold' : selected.length > 0 ? 'text-gray-400' : 'text-gray-900'
                            }`}
                            style={isSel ? { background: SEL_COLORS[selIdx % SEL_COLORS.length] } : undefined}
                          >
                            {String(row.get(p as Product))}
                          </td>
                        );
                      })}
                    </tr>
                  ))}

                  {/* CTA row — образец + ТУ */}
                  <tr>
                    <td className="sticky left-0 z-10 bg-white px-5 py-4" />
                    {visibleProducts.map((p) => {
                      const isSel = selected.includes(p.id);
                      return (
                        <td key={p.id} className="px-3 py-4 border-l border-gray-100 align-top bg-white">
                          <Link
                            to={`/product/${p.slug}`}
                            className={`inline-flex items-center gap-2 px-3 py-2 text-[11px] uppercase tracking-widest font-medium rounded transition-all ${
                              isSel
                                ? 'bg-gray-900 text-white hover:bg-brand-red'
                                : 'bg-white text-gray-400 border border-gray-200 hover:text-gray-900 hover:border-gray-900'
                            }`}
                          >
                            <FileText className="w-3.5 h-3.5" />
                            Образец + ТУ
                          </Link>
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* bar chart */}
          <div className="mt-10 bg-white border border-gray-200 rounded-lg p-6 md:p-8">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
              <div>
                <div className="text-[10px] tracking-[0.2em] uppercase text-gray-500 mb-2 font-mono">
                  Сравнение · выбрано {chartSeries.length} из 4
                </div>
                <h3 className="text-xl md:text-2xl font-medium text-gray-900">
                  Распределение зёрен
                </h3>
              </div>

              {chartSeries.length > 0 && (
                <div className="flex flex-wrap gap-4 text-xs">
                  {chartSeries.map((s) => (
                    <div key={s.id} className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-sm" style={{ background: s.color }} />
                      <span className="font-mono text-gray-700">{s.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {chartSeries.length === 0 ? (
              <div className="py-16 text-center text-gray-400 text-sm">
                Выберите фракцию выше, чтобы увидеть распределение зёрен.
              </div>
            ) : (
              <BarChart series={chartSeries} sieves={SIEVE_KEYS} max={chartMax} />
            )}
          </div>

          {/* footer CTA */}
          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 pt-8 border-t border-gray-200">
            <div className="text-sm text-gray-600 max-w-lg">
              Нужна помощь с выбором фракции под вашу задачу? Отправим образец и ТУ на почту.
            </div>
            <Link
              to="/contacts"
              className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 text-sm uppercase tracking-widest font-medium hover:bg-brand-red transition-colors"
            >
              <Download className="w-4 h-4" />
              Запросить образец
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

/* ─────────────── BarChart ─────────────── */

function BarChart({
  series,
  sieves,
  max,
}: {
  series: Array<{ id: string; label: string; color: string; data: number[] }>;
  sieves: string[];
  max: number;
}) {
  const H = 240;
  const PAD_T = 16;
  const PAD_B = 36;
  const BAR_W = 14;
  const GAP = 4;
  const GROUP_W = series.length * BAR_W + (series.length - 1) * GAP;
  const GROUP_GAP = 48;
  const W = sieves.length * GROUP_W + (sieves.length - 1) * GROUP_GAP + 64;

  const chartH = H - PAD_T - PAD_B;
  const ticks = [0, 25, 50, 75, 100].filter((t) => t <= max * 1.1);

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} style={{ minWidth: W, width: '100%', height: H }}>
        {/* gridlines */}
        {ticks.map((t) => {
          const y = PAD_T + chartH - (t / max) * chartH;
          return (
            <g key={t}>
              <line x1={48} x2={W} y1={y} y2={y} stroke="#e5e7eb" strokeDasharray="2 3" />
              <text x={0} y={y + 4} fontSize="10" fill="#9ca3af" fontFamily="ui-monospace, monospace">
                {t}%
              </text>
            </g>
          );
        })}

        {/* bars */}
        {sieves.map((sv, gi) => {
          const gx = 56 + gi * (GROUP_W + GROUP_GAP);
          return (
            <g key={sv}>
              {series.map((s, bi) => {
                const v = s.data[gi] || 0;
                const h = (v / max) * chartH;
                const x = gx + bi * (BAR_W + GAP);
                const y = PAD_T + chartH - h;
                return (
                  <g key={s.id}>
                    <motion.rect
                      initial={{ height: 0, y: PAD_T + chartH }}
                      animate={{ height: h, y }}
                      transition={{ duration: 0.5, delay: gi * 0.04 + bi * 0.06, ease: 'easeOut' }}
                      x={x}
                      width={BAR_W}
                      fill={s.color}
                    />
                    {v > 2 && (
                      <text
                        x={x + BAR_W / 2}
                        y={y - 4}
                        textAnchor="middle"
                        fontSize="9"
                        fill="#374151"
                        fontFamily="ui-monospace, monospace"
                      >
                        {v}
                      </text>
                    )}
                  </g>
                );
              })}
              <text
                x={gx + GROUP_W / 2}
                y={H - 12}
                textAnchor="middle"
                fontSize="10"
                fill="#6b7280"
                fontFamily="ui-monospace, monospace"
              >
                {sv}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default ComparePage;
