/**
 * HomeV2 — Concept A: Матрица задач (Task Matrix)
 * Experimental redesign of the homepage. See docs/redesign/concept-a-task-matrix.md
 *
 * Philosophy: wizard-style task picker → recommended fraction → calculator → quote.
 * Full detail: Hero matrix + Calculator (signature blocks).
 * Skeletal: cases, dealers map, facts, FAQ, CTA bottom, footer.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ChevronDown,
  Package,
  Waves,
  Droplets,
  Circle,
  Activity,
  Diamond,
  Layers,
  HelpCircle,
  ArrowRight,
  ArrowDown,
  FileDown,
  Phone,
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────────────────────
   DATA
   ───────────────────────────────────────────────────────────────────────────── */

type Task = {
  id: string;
  title: string;
  fraction: string;
  fractionRange: [number, number]; // in mm (min, max)
  pricePerTon: number;
  density: number; // tons / m³ bulk
  why: string;
  Icon: typeof Package;
};

const TASKS: Task[] = [
  {
    id: 'floor',
    title: 'Наливные полы',
    fraction: '0,1–0,3 мм',
    fractionRange: [0.1, 0.3],
    pricePerTon: 12000,
    density: 1.55,
    why: 'Мелкое зерно даёт гладкость и глубину блеска, без пузыря и усадки.',
    Icon: Layers,
  },
  {
    id: 'blast',
    title: 'Пескоструй',
    fraction: '0,5–1 мм',
    fractionRange: [0.5, 1],
    pricePerTon: 11200,
    density: 1.48,
    why: 'Угловатое зерно держит абразивность; не пылит в помещении.',
    Icon: Activity,
  },
  {
    id: 'filter',
    title: 'Фильтрация воды',
    fraction: '0,5–2 мм',
    fractionRange: [0.5, 2],
    pricePerTon: 10800,
    density: 1.46,
    why: 'Чистая фракция задерживает взвесь, не забивая систему.',
    Icon: Droplets,
  },
  {
    id: 'pool',
    title: 'Бассейны',
    fraction: '2,5–5 мм',
    fractionRange: [2.5, 5],
    pricePerTon: 10200,
    density: 1.42,
    why: 'Крупное зерно для чаши: фильтрация без взвеси, декоративный слой дна.',
    Icon: Circle,
  },
  {
    id: 'sport',
    title: 'Спорт-покрытия',
    fraction: '3–5 мм',
    fractionRange: [3, 5],
    pricePerTon: 10000,
    density: 1.42,
    why: 'Угловатое крупное зерно — основа искусственного газона и тартана.',
    Icon: Waves,
  },
  {
    id: 'glass',
    title: 'Стекло',
    fraction: '0,1–0,3 мм',
    fractionRange: [0.1, 0.3],
    pricePerTon: 13000,
    density: 1.55,
    why: 'Содержание SiO₂ 99%+ и мелкая однородная фракция — под варку.',
    Icon: Diamond,
  },
  {
    id: 'dry',
    title: 'Сухие смеси',
    fraction: '0,5–2 мм',
    fractionRange: [0.5, 2],
    pricePerTon: 10800,
    density: 1.46,
    why: 'Наполнитель ССС: затирки, штукатурки, клеевые составы.',
    Icon: Package,
  },
  {
    id: 'other',
    title: 'Другое / не уверен',
    fraction: 'подберём вместе',
    fractionRange: [0.5, 2],
    pricePerTon: 10800,
    density: 1.46,
    why: 'Опишите задачу — инженер ответит с рекомендацией и паспортом.',
    Icon: HelpCircle,
  },
];

const DEALERS = [
  { id: 'msk', city: 'Москва', addr: 'Южный Порт, Трофимова 32', x: 58, y: 38, days: '3–5' },
  { id: 'spb', city: 'Санкт-Петербург', addr: 'Обводный, 150', x: 48, y: 22, days: '4–6' },
  { id: 'ekb', city: 'Екатеринбург', addr: 'Уральская, 12', x: 67, y: 40, days: '5–7' },
  { id: 'nsk', city: 'Новосибирск', addr: 'Красный пр., 220', x: 78, y: 45, days: '6–8' },
  { id: 'rnd', city: 'Ростов-на-Дону', addr: 'Ворошиловский, 12', x: 56, y: 58, days: '4–6' },
  { id: 'ksn', city: 'Краснодар', addr: 'Красная, 180', x: 54, y: 65, days: '4–6' },
  { id: 'kzn', city: 'Казань', addr: 'Баумана, 40', x: 62, y: 40, days: '4–6' },
  { id: 'vrn', city: 'Воронеж', addr: 'Плехановская, 18', x: 55, y: 48, days: '3–5' },
];

const FAQ_ITEMS: Array<{ q: string; a: string }> = [
  {
    q: 'Какой минимальный заказ?',
    a: 'От 1 тонны (мешки 50 кг) или биг-бэг 1 т. Для регулярных клиентов — гибкий график, без нижнего порога.',
  },
  { q: 'Как цена меняется с объёмом?', a: 'До 5 т — розница. 5–20 т — опт первого уровня. От 20 т — договорная.' },
  { q: 'Партия — как часто обновляется?', a: 'Карьер выдаёт партию раз в 10–12 дней. XRF-протокол — к каждой.' },
  { q: 'Есть ли сертификат соответствия?', a: 'ГОСТ 22551-2019 + СЭЗ + декларация. PDF скачиваются без формы.' },
  { q: 'Условия оплаты и возврата?', a: 'Безнал, 30% предоплата, 70% — по факту отгрузки. Возврат — по браку партии.' },
  { q: 'Как хранить кварцевый песок?', a: 'Сухое крытое помещение, на поддонах. Биг-бэги — до 24 мес без потери свойств.' },
];

/* ─────────────────────────────────────────────────────────────────────────────
   HELPERS
   ───────────────────────────────────────────────────────────────────────────── */

const formatRub = (n: number) =>
  new Intl.NumberFormat('ru-RU').format(Math.round(n)) + ' ₽';

/** Tons needed = area (m²) × thickness (mm) / 1000 × density × safety factor */
const calcTons = (areaM2: number, thicknessMm: number, density: number, safetyPct: number) => {
  const base = (areaM2 * thicknessMm) / 1000; // volume in m³
  return base * density * (1 + safetyPct / 100);
};

/* ─────────────────────────────────────────────────────────────────────────────
   HEADER
   ───────────────────────────────────────────────────────────────────────────── */

function HeaderV2() {
  return (
    <header className="sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur border-b border-[#222]">
      <div className="mx-auto max-w-[1440px] px-10 h-20 flex items-center">
        <a href="/" className="font-extrabold text-[22px] tracking-[0.2em] text-white">
          ЦМИД
        </a>
        <nav className="flex-1 flex items-center justify-center gap-10 text-[13px] text-neutral-400">
          <a href="#catalog" className="hover:text-white transition">Каталог</a>
          <a href="#apps" className="hover:text-white transition">Применения</a>
          <a href="#delivery" className="hover:text-white transition">Доставка</a>
          <a href="#contacts" className="hover:text-white transition">Контакты</a>
        </nav>
        <div className="flex items-center gap-5">
          <a href="tel:88000000000" className="text-white text-[13px] font-semibold hidden md:flex items-center gap-2">
            <Phone size={14} />
            8 800 000-00-00
          </a>
          <a
            href="/catalog"
            className="px-4 h-9 flex items-center gap-2 text-[12px] font-semibold text-[#f80000] tracking-[0.2em] border border-[#f80000] rounded bg-[#111]/60 hover:bg-[#f80000] hover:text-white transition"
          >
            Знаю фракцию → Каталог
          </a>
        </div>
      </div>
    </header>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   HERO — Task Matrix
   ───────────────────────────────────────────────────────────────────────────── */

function HeroMatrix({
  selected,
  onSelect,
}: {
  selected: Task | null;
  onSelect: (task: Task) => void;
}) {
  const prefersReduced = useReducedMotion();
  return (
    <section className="relative overflow-hidden bg-[#0a0a0a] pt-24 pb-12">
      {/* red radial glow */}
      <div
        className="absolute left-1/2 top-20 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(248,0,0,0.08), transparent 70%)' }}
      />

      <div className="relative mx-auto max-w-[1440px] px-10">
        <div className="text-[#f80000] text-[13px] font-bold tracking-[0.5em] mb-6">
          ПОДБОР ПОД ЗАДАЧУ
        </div>
        <h1 className="text-white text-[56px] md:text-[72px] font-extrabold leading-[1.05] max-w-[1000px]">
          Что вы делаете<br />кварцевым песком?
        </h1>
        <p className="mt-8 text-neutral-400 text-lg max-w-[900px]">
          Выберите задачу — покажем фракцию, объём и цену. Это не каталог, это мастер подбора.
        </p>

        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6">
          {TASKS.map(task => {
            const isActive = selected?.id === task.id;
            const Icon = task.Icon;
            return (
              <motion.button
                key={task.id}
                onClick={() => onSelect(task)}
                className={`group relative text-left rounded-xl border bg-[#141414] p-6 h-[160px] flex flex-col justify-between transition-colors ${
                  isActive ? 'border-[#f80000]' : 'border-[#222] hover:border-[#444]'
                }`}
                whileHover={prefersReduced ? undefined : { y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                {/* hover red glow */}
                <div
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  style={{ background: 'radial-gradient(circle at top right, rgba(248,0,0,0.18), transparent 60%)' }}
                />
                <Icon size={28} strokeWidth={1} className="text-[#f80000]" />
                <div>
                  <div className="text-white text-[20px] font-semibold leading-tight">{task.title}</div>
                  <div className="mt-1 text-neutral-500 text-[13px]">{task.fraction}</div>
                </div>
                <ArrowRight
                  size={20}
                  className={`absolute right-5 bottom-5 transition-all ${
                    isActive ? 'text-[#f80000] translate-x-0' : 'text-neutral-500 group-hover:translate-x-1 group-hover:text-white'
                  }`}
                />
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   RESULT STRIP
   ───────────────────────────────────────────────────────────────────────────── */

function ResultStrip({ task, onGoToCalc }: { task: Task | null; onGoToCalc: () => void }) {
  return (
    <AnimatePresence mode="wait">
      {task && (
        <motion.div
          key={task.id}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="sticky top-20 z-30 bg-[#111] border-y border-[#222]"
          style={{ borderTopColor: 'rgba(248,0,0,0.3)' }}
        >
          <div className="mx-auto max-w-[1440px] px-10 h-16 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <span className="text-[11px] font-bold tracking-[0.5em] text-neutral-500">ВЫ ВЫБРАЛИ:</span>
              <span className="text-white text-[15px] font-semibold">
                {task.title} <span className="text-neutral-500 mx-2">·</span> фракция {task.fraction}
              </span>
            </div>
            <button
              onClick={onGoToCalc}
              className="flex items-center gap-3 px-6 h-9 bg-[#f80000] text-white text-[12px] font-bold tracking-[0.3em] rounded hover:bg-[#ff3333] transition"
            >
              К РАСЧЁТУ <ArrowDown size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   CALCULATOR (signature block)
   ───────────────────────────────────────────────────────────────────────────── */

function CalculatorSection({ task }: { task: Task | null }) {
  const [area, setArea] = useState(120);
  const [thickness, setThickness] = useState(3);
  const [safety, setSafety] = useState(7);

  // if no task is picked, default to "floors"
  const activeTask = task ?? TASKS[0];

  const tons = useMemo(
    () => calcTons(area, thickness, activeTask.density, safety),
    [area, thickness, activeTask.density, safety],
  );
  const priceFrom = tons * activeTask.pricePerTon * 0.95;
  const priceTo = tons * activeTask.pricePerTon * 1.1;
  // big-bags: 1 t each
  const bigBags = Math.ceil(tons);

  return (
    <section id="calculator" className="bg-[#0a0a0a] pt-20 pb-24 scroll-mt-36">
      <div className="mx-auto max-w-[1440px] px-10">
        <div className="w-16 h-0.5 bg-[#f80000]" />
        <div className="mt-4 text-[#f80000] text-[12px] font-bold tracking-[0.5em]">РАСЧЁТ</div>
        <h2 className="mt-4 text-white text-[48px] md:text-[56px] font-extrabold leading-[1.05]">
          Объём и цена под<br />вашу задачу
        </h2>

        <div className="mt-16 grid md:grid-cols-2 gap-4">
          {/* INPUTS */}
          <div className="bg-[#141414] border border-[#222] rounded-2xl p-8">
            <div className="inline-flex items-center gap-2 px-4 h-9 bg-[#0a0a0a] border border-[#f80000]/50 rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#f80000]" />
              <span className="text-white text-[12px] font-semibold">
                {activeTask.title} · {activeTask.fraction}
              </span>
            </div>

            <Slider
              label="Площадь, м²"
              value={area}
              onChange={setArea}
              min={5}
              max={500}
              unit="м²"
            />
            <Slider
              label="Толщина слоя, мм"
              value={thickness}
              onChange={setThickness}
              min={1}
              max={20}
              unit="мм"
            />

            <div className="mt-8">
              <div className="text-[11px] font-bold tracking-[0.5em] text-neutral-500 mb-3">ЗАПАС</div>
              <div className="flex gap-2">
                {[5, 7, 10].map(v => (
                  <button
                    key={v}
                    onClick={() => setSafety(v)}
                    className={`w-24 h-11 rounded-lg text-[16px] font-semibold transition ${
                      safety === v
                        ? 'bg-[#f80000] text-white'
                        : 'bg-[#0a0a0a] border border-[#333] text-white hover:border-[#555]'
                    }`}
                  >
                    {v}%
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RESULT */}
          <div className="bg-[#1a1a1a] border border-[#222] rounded-2xl p-8 flex gap-8">
            <BigBagVisual tons={bigBags} />
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-bold tracking-[0.5em] text-neutral-500">ПОТРЕБУЕТСЯ</div>
              <div className="mt-2 flex items-end gap-3 font-mono text-white text-[96px] font-bold leading-none tabular-nums">
                {tons.toFixed(1)}
              </div>
              <div className="mt-1 text-neutral-400 text-xl font-light">тонны</div>

              <div className="mt-8 h-px bg-[#222]" />
              <div className="mt-4 text-[11px] font-bold tracking-[0.5em] text-neutral-500">ЦЕНА</div>
              <div className="mt-1 text-white text-[22px] font-semibold">от {formatRub(priceFrom)}</div>
              <div className="text-neutral-500 text-[13px]">до {formatRub(priceTo)} · без доставки</div>

              <div className="mt-8 h-px bg-[#222]" />
              <div className="mt-4 text-[10px] font-bold tracking-[0.5em] text-neutral-500">ДО БЛИЖАЙШЕГО ДИЛЕРА</div>
              <div className="mt-1 text-white text-[14px] font-semibold">Москва · Южный Порт</div>
              <div className="text-neutral-500 text-[13px]">3–5 дней · фура 20 т</div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-6">
          <a
            href="#cta"
            className="inline-flex items-center gap-3 px-8 h-12 bg-[#f80000] text-white text-[13px] font-bold tracking-[0.3em] rounded hover:bg-[#ff3333] transition"
          >
            ОФОРМИТЬ ЗАЯВКУ <ArrowRight size={16} />
          </a>
          <button className="text-neutral-400 text-[13px] font-medium hover:text-white transition">
            + Добавить в коммерческое предложение
          </button>
        </div>
      </div>
    </section>
  );
}

function Slider({
  label,
  value,
  onChange,
  min,
  max,
  unit,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  unit: string;
}) {
  return (
    <div className="mt-8">
      <div className="text-[11px] font-bold tracking-[0.5em] text-neutral-500 mb-3">{label.toUpperCase()}</div>
      <div className="flex items-center gap-6 bg-[#0a0a0a] border border-[#333] rounded-lg px-5 h-14">
        <div className="flex items-baseline gap-2 min-w-[100px]">
          <span className="text-white text-[28px] font-bold tabular-nums">{value}</span>
          <span className="text-neutral-500 text-sm">{unit}</span>
        </div>
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="flex-1 accent-[#f80000]"
        />
      </div>
    </div>
  );
}

function BigBagVisual({ tons }: { tons: number }) {
  const prefersReduced = useReducedMotion();
  // visual height scales with tons (capped)
  const visual = Math.min(1 + tons * 0.12, 2.5);
  return (
    <div
      className="bg-[#0a0a0a] rounded-xl w-56 h-64 relative overflow-hidden flex items-center justify-center shrink-0"
      aria-hidden="true"
    >
      <motion.div
        className="relative"
        animate={{ scale: prefersReduced ? 1 : visual * 0.5 + 0.5 }}
        transition={{ type: 'spring', stiffness: 180, damping: 18 }}
      >
        {/* straps */}
        <div className="absolute -top-4 left-4 w-3 h-8 rounded bg-neutral-600" />
        <div className="absolute -top-4 right-4 w-3 h-8 rounded bg-neutral-600" />
        {/* handle */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-16 h-2.5 rounded bg-neutral-600" />
        {/* bag body */}
        <div className="w-36 h-40 rounded bg-[#333] flex items-center justify-center">
          <div className="text-[#f80000] text-[36px] font-extrabold tabular-nums leading-none">
            {tons}
          </div>
        </div>
      </motion.div>
      <div className="absolute bottom-3 left-0 right-0 text-center text-[9px] font-bold tracking-[0.4em] text-neutral-500">
        BIG-BAG × {tons}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   CASES STRIP (skeletal)
   ───────────────────────────────────────────────────────────────────────────── */

function CasesSection() {
  return (
    <section className="bg-[#0a0a0a] py-20">
      <div className="mx-auto max-w-[1440px] px-10">
        <div className="w-16 h-0.5 bg-[#f80000]" />
        <div className="mt-4 text-[#f80000] text-[12px] font-bold tracking-[0.5em]">КЕЙСЫ ПО ЗАДАЧАМ</div>
        <h2 className="mt-4 text-white text-[40px] font-extrabold">Делали. Показываем.</h2>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {TASKS.slice(0, 7).map((t, i) => (
            <div
              key={t.id}
              className="group relative overflow-hidden rounded-xl bg-[#141414] border border-[#222] hover:border-[#f80000]/50 transition h-[240px]"
            >
              <div className="h-[140px] bg-[#1a1a1a] flex items-center justify-center text-[10px] font-bold tracking-[0.4em] text-neutral-600">
                ⟦ ФОТО ОБЪЕКТА ⟧
              </div>
              <div className="p-4">
                <div className="text-white text-[15px] font-semibold">{t.title}</div>
                <div className="mt-2 text-neutral-500 text-[11px] font-mono">
                  {120 + i * 15} м² · {(3 + i * 0.4).toFixed(1)} т · {3 + (i % 4)} дня
                </div>
              </div>
              <div className="absolute top-36 right-3 px-2 h-4 rounded-full bg-[#0a0a0a] border border-[#333] text-[7px] font-bold tracking-[0.4em] text-neutral-500 flex items-center">
                ПАСПОРТ
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   DEALERS MAP (skeletal)
   ───────────────────────────────────────────────────────────────────────────── */

function DealersSection() {
  const [active, setActive] = useState(DEALERS[0]);
  return (
    <section className="bg-[#111] py-20">
      <div className="mx-auto max-w-[1440px] px-10">
        <div className="w-16 h-0.5 bg-[#f80000]" />
        <div className="mt-4 text-[#f80000] text-[12px] font-bold tracking-[0.5em]">8 ДИЛЕРОВ ПО РФ</div>
        <h2 className="mt-4 text-white text-[40px] font-extrabold">География поставок</h2>

        <div className="mt-10 grid md:grid-cols-[1fr_400px] gap-5">
          <div className="relative bg-[#141414] border border-[#222] rounded-xl h-[380px] overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center text-[13px] tracking-[0.2em] text-neutral-700">
              ⟦ интерактивная карта РФ ⟧
            </div>
            {DEALERS.map(d => (
              <button
                key={d.id}
                onClick={() => setActive(d)}
                className="absolute w-3 h-3 -translate-x-1.5 -translate-y-1.5 rounded-full bg-[#f80000] hover:scale-150 transition-transform"
                style={{ left: `${d.x}%`, top: `${d.y}%` }}
                aria-label={d.city}
              >
                <span
                  className="absolute inset-0 rounded-full animate-ping"
                  style={{ background: 'rgba(248,0,0,0.4)' }}
                />
              </button>
            ))}
          </div>

          <div className="bg-[#141414] border border-[#222] rounded-xl p-6">
            <div className="text-[11px] font-bold tracking-[0.5em] text-[#f80000]">ВЫБРАННЫЙ ДИЛЕР</div>
            <div className="mt-2 text-white text-[28px] font-extrabold">{active.city}</div>
            <div className="mt-2 text-neutral-400 text-[13px]">{active.addr}</div>
            <div className="mt-4 h-px bg-[#222]" />
            <div className="mt-4 text-white text-[13px] font-semibold">{active.days} дней фурой</div>
            <div className="text-neutral-500 text-[12px]">от 2 т · СТГ и РЖД</div>
            <div className="mt-4 h-px bg-[#222]" />
            <div className="mt-4 text-[10px] font-bold tracking-[0.5em] text-neutral-500">В НАЛИЧИИ</div>
            <div className="mt-2 grid grid-cols-2 gap-y-2">
              {['0,1–0,3 мм', '0,5–1 мм', '0,8–2 мм', '2,5–5 мм'].map(fr => (
                <div key={fr} className="flex items-center gap-3 text-neutral-300 text-[12px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f80000]" />
                  {fr}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   FACTS (skeletal)
   ───────────────────────────────────────────────────────────────────────────── */

function FactsSection() {
  const facts = [
    ['30 000', 'тонн в год'],
    ['8', 'дилеров по РФ'],
    ['с 2008', 'на рынке'],
    ['ГОСТ +', 'паспорт партии'],
  ];
  return (
    <section className="bg-[#0a0a0a] py-16">
      <div className="mx-auto max-w-[1440px] px-10">
        <div className="w-16 h-0.5 bg-[#f80000]" />
        <div className="mt-4 text-[#f80000] text-[12px] font-bold tracking-[0.5em] mb-8">ЦМИД В ЦИФРАХ</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {facts.map(([big, sub]) => (
            <div key={big} className="bg-[#141414] border border-[#222] rounded-xl p-6 h-40">
              <div className="font-mono text-white text-[44px] font-extrabold leading-tight">{big}</div>
              <div className="mt-4 text-neutral-500 text-[14px]">{sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   FAQ (skeletal accordion)
   ───────────────────────────────────────────────────────────────────────────── */

function FaqSection() {
  const [open, setOpen] = useState(0);
  return (
    <section className="bg-[#111] py-20">
      <div className="mx-auto max-w-[1440px] px-10">
        <div className="w-16 h-0.5 bg-[#f80000]" />
        <div className="mt-4 text-[#f80000] text-[12px] font-bold tracking-[0.5em]">ВОПРОСЫ СНАБЖЕНЦЕВ</div>
        <h2 className="mt-4 text-white text-[40px] font-extrabold">Короткие ответы</h2>

        <div className="mt-10 space-y-2">
          {FAQ_ITEMS.map((item, i) => (
            <button
              key={item.q}
              onClick={() => setOpen(open === i ? -1 : i)}
              className="w-full text-left bg-[#141414] border border-[#222] rounded-lg px-6 py-5 hover:border-[#333] transition"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="text-white text-[16px] font-semibold">{item.q}</div>
                <ChevronDown
                  size={20}
                  className={`text-[#f80000] transition-transform ${open === i ? 'rotate-180' : ''}`}
                />
              </div>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-3 text-neutral-400 text-[13px]">{item.a}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   CTA BOTTOM
   ───────────────────────────────────────────────────────────────────────────── */

function CtaBottomSection() {
  return (
    <section id="cta" className="bg-[#0a0a0a] py-20 scroll-mt-36">
      <div className="mx-auto max-w-[1440px] px-10">
        <div className="w-16 h-0.5 bg-[#f80000]" />
        <div className="mt-4 text-[#f80000] text-[12px] font-bold tracking-[0.5em]">СВЯЗАТЬСЯ</div>
        <h2 className="mt-4 text-white text-[40px] font-extrabold">Два способа</h2>

        <div className="mt-10 grid md:grid-cols-2 gap-5">
          {/* form */}
          <form
            className="bg-[#141414] border border-[#222] rounded-2xl p-8"
            onSubmit={e => {
              e.preventDefault();
              alert('Заявка отправлена (заглушка)');
            }}
          >
            <div className="text-[11px] font-bold tracking-[0.5em] text-[#f80000]">ПЕРЕЗВОНИТЕ МНЕ</div>
            <div className="mt-4 text-white text-[22px] font-semibold">Ответим в течение часа</div>
            <div className="mt-6 space-y-3">
              <input required className="w-full bg-[#0a0a0a] border border-[#333] rounded-md px-4 h-10 text-white text-[13px] placeholder:text-neutral-600" placeholder="Ваше имя" />
              <input required type="tel" className="w-full bg-[#0a0a0a] border border-[#333] rounded-md px-4 h-10 text-white text-[13px] placeholder:text-neutral-600" placeholder="Телефон" />
              <input className="w-full bg-[#0a0a0a] border border-[#333] rounded-md px-4 h-10 text-white text-[13px] placeholder:text-neutral-600" placeholder="Задача (коротко)" />
            </div>
            <button
              type="submit"
              className="mt-6 px-6 h-10 bg-[#f80000] text-white text-[12px] font-bold tracking-[0.3em] rounded hover:bg-[#ff3333] transition"
            >
              ОТПРАВИТЬ →
            </button>
          </form>

          {/* download */}
          <div className="bg-[#141414] border border-[#222] rounded-2xl p-8 flex flex-col">
            <div className="text-[11px] font-bold tracking-[0.5em] text-neutral-500">НЕ ГОТОВЫ ГОВОРИТЬ?</div>
            <div className="mt-4 text-white text-[22px] font-semibold">Скачайте ГОСТ-паспорт</div>
            <div className="mt-2 text-neutral-400 text-[13px]">
              Все 4 фракции · актуальная партия · XRF-протокол
            </div>
            <div className="mt-auto flex items-center gap-6 pt-6">
              <div className="w-20 h-24 bg-[#0a0a0a] border border-[#333] rounded flex items-center justify-center text-[#f80000] font-bold">
                PDF
              </div>
              <a
                href="#"
                className="inline-flex items-center gap-3 px-6 h-10 border border-[#f80000] text-[#f80000] text-[11px] font-bold tracking-[0.3em] rounded hover:bg-[#f80000] hover:text-white transition"
              >
                <FileDown size={14} /> СКАЧАТЬ
              </a>
            </div>
            <div className="mt-4 text-neutral-600 text-[12px]">PDF, 1.2 МБ · без формы</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   FOOTER
   ───────────────────────────────────────────────────────────────────────────── */

function FooterV2() {
  return (
    <footer id="contacts" className="bg-[#111] border-t border-[#222] py-10">
      <div className="mx-auto max-w-[1440px] px-10 grid md:grid-cols-2 gap-6">
        <div>
          <div className="text-white text-[22px] font-extrabold tracking-[0.2em]">ЦМИД</div>
          <div className="mt-3 text-neutral-400 text-[13px]">
            Производство и поставка сухого кварцевого песка
          </div>
          <div className="mt-2 text-neutral-600 text-[12px]">
            ИНН 00000000 · ООО ЦМИД · г. Москва
          </div>
          <div className="mt-8 text-neutral-700 text-[11px]">
            © 2026 ЦМИД. Политика конфиденциальности.
          </div>
        </div>
        <div className="flex md:justify-end items-start gap-10 text-[13px] text-neutral-400">
          <a href="/catalog" className="hover:text-white">Каталог</a>
          <a href="#apps" className="hover:text-white">Применения</a>
          <a href="#delivery" className="hover:text-white">Доставка</a>
          <a href="#contacts" className="hover:text-white">Контакты</a>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PAGE
   ───────────────────────────────────────────────────────────────────────────── */

export default function HomeV2() {
  const [selected, setSelected] = useState<Task | null>(null);
  const calcRef = useRef<HTMLDivElement>(null);

  const handleSelect = (task: Task) => {
    setSelected(task);
  };

  const handleGoToCalc = () => {
    const el = document.getElementById('calculator');
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Update page title
  useEffect(() => {
    const prev = document.title;
    document.title = 'ЦМИД · V2 — Матрица задач';
    return () => {
      document.title = prev;
    };
  }, []);

  return (
    <div className="bg-[#0a0a0a] text-white font-[Manrope,sans-serif] min-h-screen">
      <HeaderV2 />
      <HeroMatrix selected={selected} onSelect={handleSelect} />
      <ResultStrip task={selected} onGoToCalc={handleGoToCalc} />
      <div ref={calcRef}>
        <CalculatorSection task={selected} />
      </div>
      <CasesSection />
      <DealersSection />
      <FactsSection />
      <FaqSection />
      <CtaBottomSection />
      <FooterV2 />
    </div>
  );
}
