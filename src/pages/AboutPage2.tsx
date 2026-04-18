/**
 * AboutPage2 — светлый вариант страницы «О компании» (sandbox для сравнения с тёмной версией).
 * Содержит самодостаточные светлые секции: те же данные, другая цветовая схема.
 */
import React, { useState, useRef, useEffect } from 'react';
import { divisions }   from '@/data/activities';
import { cities, industries } from '@/data/logistics';
import ScrollReveal            from '@/components/ui/ScrollReveal';
import ProductionGallerySection from '@/components/sections/About/ProductionGallerySection';
import PartnersSection          from '@/components/sections/About/PartnersSection';
import AboutVariantSwitcher     from '@/components/ui/AboutVariantSwitcher';

// ─── Палитра ──────────────────────────────────────────────────────────────────
const P = {
  bg:     'bg-brand-page',      // #F5F4F2
  alt:    'bg-brand-alt',       // #EDECEA
  text:   'text-brand-dark',    // #1A1A1B
  muted:  'text-brand-dark/40',
  faint:  'text-brand-dark/22',
  border: 'border-brand-dark/8',
  red:    'text-brand-red',
  line:   'bg-brand-dark/8',
};

// ─── 01 — Intro ───────────────────────────────────────────────────────────────
const LightIntroSection = () => (
  <section className={`${P.bg} min-h-screen flex overflow-hidden relative`}>

    {/* Левая часть — типографика */}
    <div className="flex-1 flex flex-col justify-center px-[1cm] py-24 z-10 relative">

      <p className={`${P.faint} text-xs tracking-[0.6em] uppercase mb-14 font-mono`}>
        О компании
      </p>

      <div className="mb-4 leading-none">
        <span
          className={`font-light ${P.text} tracking-tighter`}
          style={{ fontSize: 'clamp(7rem, 15vw, 13rem)' }}
        >
          ЦМИД
        </span>
      </div>

      <div className="w-10 h-px bg-brand-red mb-10" />

      <p className={`${P.muted} text-lg leading-relaxed max-w-md mb-14`}>
        Первый отечественный производитель поликарбоксилатных
        гиперпластификаторов для бетона.
        Санкт-Петербург, с&nbsp;2014&nbsp;года.
      </p>

      {/* Статы */}
      <div className="flex gap-12">
        {[
          { val: '30 000', label: 'тонн / год' },
          { val: '100+',   label: 'наименований' },
          { val: '2014',   label: 'год запуска' },
        ].map(({ val, label }) => (
          <div key={label}>
            <div className={`${P.text} font-light leading-none`}
              style={{ fontSize: 'clamp(2rem, 3.2vw, 2.8rem)' }}>
              {val}
            </div>
            <div className={`${P.faint} text-xs uppercase tracking-[0.35em] mt-2`}>
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Правая часть — фото */}
    <div className="hidden lg:block w-[46%] flex-shrink-0 relative">
      <img
        src="/Production_Site/site-facade.png"
        alt="Производство ЦМИД"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-page via-brand-page/35 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-page/50 to-transparent" />
    </div>
  </section>
);

// ─── 02 — Направления деятельности ────────────────────────────────────────────
const LightActivitiesSection = () => {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  return (
    <section className={`${P.alt} overflow-hidden`}>
      <div className="flex justify-between min-h-screen">

        {/* Список направлений */}
        <div className="w-[46%] flex-shrink-0 pl-[1cm] pr-10 py-24 lg:py-32 flex flex-col">
          <p className={`${P.faint} text-xs tracking-[0.6em] uppercase mb-12 font-mono`}>
            Направления деятельности
          </p>

          <div className="flex flex-col">
            {divisions.map((div, i) => {
              const isActive = activeIdx === i;
              const isOther  = activeIdx !== null && !isActive;
              return (
                <div
                  key={div.id}
                  className="cursor-pointer py-4"
                  onMouseEnter={() => setActiveIdx(i)}
                  onMouseLeave={() => setActiveIdx(null)}
                >
                  <div className="flex items-baseline gap-5">
                    <span
                      className="font-mono text-[10px] flex-shrink-0 w-7 transition-colors duration-300"
                      style={{ color: isActive ? 'rgba(26,26,27,0.45)' : 'rgba(26,26,27,0.28)' }}
                    >
                      {String(i + 1).padStart(2, '0')}.
                    </span>
                    <h3
                      className={`font-light ${P.text} leading-tight transition-all duration-300`}
                      style={{
                        fontSize: isActive ? 'clamp(2.2rem, 3.6vw, 3rem)' : 'clamp(1.5rem, 2.4vw, 2rem)',
                        opacity:  isOther  ? 0.28 : 1,
                      }}
                    >
                      {div.name}
                    </h3>
                  </div>

                  <div
                    className="overflow-hidden transition-all duration-300 ml-12"
                    style={{ maxHeight: isActive ? '160px' : '0', marginTop: isActive ? '10px' : '0' }}
                  >
                    <p className={`${P.muted} text-base leading-relaxed`}>{div.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Фото-панель */}
        <div className="flex-1 relative">
          <img
            src="/activity/3.Facktory.png"
            alt="Производство"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-alt via-brand-alt/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-alt/50" />
        </div>
      </div>
    </section>
  );
};

// ─── 03 — Производство ────────────────────────────────────────────────────────
const categories = [
  'ЦМИД-4 — поликарбоксилаты',
  'ЦМИД-3 — ремонтные смеси',
  'ЦМИД-1К — гидроизоляция',
  'ГПМ / ГПМУЛЬТРА',
  'Инъекционные составы',
  'Противоморозные добавки',
  'Подливочные смеси',
  'Напольные составы',
  'Монтажные смеси',
];

const stats = [
  { val: '100+', label: 'наименований' },
  { val: '9',    label: 'категорий'    },
  { val: '2014', label: 'год запуска'  },
];

const LightProductionSection = () => (
  <section className={`min-h-screen ${P.bg} flex overflow-hidden relative`}>

    <div className="flex-1 flex flex-col justify-center px-[1cm] py-24 z-10 relative">
      <p className={`${P.faint} text-xs tracking-[0.6em] uppercase mb-12 font-mono`}>
        Наше производство
      </p>

      <div className="mb-3 leading-none">
        <span
          className={`font-light ${P.text} tracking-tighter`}
          style={{ fontSize: 'clamp(7rem, 16vw, 14rem)' }}
        >
          30&thinsp;000
        </span>
      </div>
      <p className={`${P.muted} text-2xl font-light tracking-[0.25em] uppercase mb-10`}>
        тонн / год
      </p>

      <div className="w-10 h-px bg-brand-red mb-10" />

      <div className="flex gap-12 mb-14">
        {stats.map(({ val, label }) => (
          <div key={label}>
            <div className={`${P.text} font-light leading-none`}
              style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}>
              {val}
            </div>
            <div className={`${P.faint} text-xs uppercase tracking-[0.35em] mt-2`}>
              {label}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2.5 max-w-lg">
        {categories.map((cat) => (
          <span
            key={cat}
            className={`px-4 py-2 border ${P.border} ${P.muted} text-sm rounded-full
                        hover:border-brand-red hover:${P.text} transition-all duration-300 cursor-default`}
          >
            {cat}
          </span>
        ))}
      </div>

      <p className={`mt-12 ${P.faint} text-sm leading-relaxed max-w-xs`}>
        Собственный завод в Санкт-Петербурге. Первый отечественный производитель
        поликарбоксилатных гиперпластификаторов.
      </p>
    </div>

    <div className="hidden lg:block w-[44%] flex-shrink-0 relative">
      <img
        src="/Production_Site/site-overview.png"
        alt="Производство ЦМИД"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-page via-brand-page/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-page/60 to-transparent" />
    </div>
  </section>
);

// ─── 04 — Лаборатория / Качество ──────────────────────────────────────────────
const labSpecs: { node: React.ReactNode; label: string }[] = [
  { node: <>до W20</>,                                                                                                        label: 'водонепроницаемость' },
  { node: <>F<span style={{ fontSize: '0.65em', verticalAlign: 'sub' }}>2</span>600+</>, label: 'морозостойкость'     },
  { node: <>−50°C</>,                                                                                                         label: 'температура укладки' },
  { node: <>ГОСТ Р</>,                                                                                                        label: 'аккредитация'        },
];

const labActivities = [
  'Подбор и оптимизация составов бетона',
  'Самоуплотняющиеся бетоны (СУБ)',
  'Арктические и подводные составы',
  'Испытания: прочность, W, F, абразия',
  'Сертификация: ГОСТ, ФАВТ, СРО',
  'Инспекция бетонных заводов и лабораторий',
];

const LightQualitySection = () => (
  <section className={`min-h-screen ${P.alt} flex overflow-hidden`}>

    {/* Фото-панель */}
    <div className="hidden lg:block w-[50%] flex-shrink-0 relative">
      <img
        src="/activity/2.Lab.png"
        alt="Лаборатория ЦМИД"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-l from-brand-alt via-brand-alt/20 to-transparent" />

      {/* Плашки с характеристиками */}
      <div className="absolute bottom-14 left-8 flex flex-col gap-2.5">
        {labSpecs.map(({ node, label }) => (
          <div
            key={label}
            className="flex items-baseline gap-3 bg-white/70 backdrop-blur-sm
                       border border-brand-dark/8 px-4 py-2.5 rounded-lg"
          >
            <span className="text-brand-red font-mono text-base font-medium tabular-nums">
              {node}
            </span>
            <span className={`${P.muted} text-xs`}>{label}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Текст */}
    <div className="flex-1 flex flex-col justify-center px-12 lg:px-14 py-24">
      <p className={`${P.faint} text-xs tracking-[0.6em] uppercase mb-12 font-mono`}>
        Лаборатория — НИЦ
      </p>

      <h2
        className={`font-light ${P.text} leading-tight mb-8`}
        style={{ fontSize: 'clamp(2.8rem, 5.5vw, 5rem)' }}
      >
        Аккредитованный
        <br />
        <span className="font-medium">исследовательский</span>
        <br />
        центр
      </h2>

      <p className={`${P.muted} text-lg leading-relaxed mb-12 max-w-sm`}>
        Испытания и разработка составов для критических объектов:
        АЭС, ГТС, мосты, арктика. Работаем с 1998 года.
      </p>

      <div className="space-y-4 mb-12">
        {labActivities.map((act, i) => (
          <div key={act} className="flex items-baseline gap-4">
            <span className={`${P.faint} font-mono text-xs flex-shrink-0 w-5 tabular-nums`}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className={`${P.text} text-base opacity-65`}>{act}</span>
          </div>
        ))}
      </div>

      <div className="border-l-2 border-brand-red pl-5">
        <p className={`${P.faint} text-xs uppercase tracking-widest mb-2`}>Кейс</p>
        <p className={`${P.text} text-base font-medium`}>Арктик СПГ 2 — ПАО «НОВАТЭК»</p>
        <p className={`${P.muted} text-sm mt-1`}>Состав F<span style={{ fontSize: '0.7em', verticalAlign: 'sub' }}>2</span>600+, W20. Укладка при −50°C. ЯНАО.</p>
      </div>
    </div>
  </section>
);

// ─── 05 — Логистика ───────────────────────────────────────────────────────────
const LightLogisticsSection = () => (
  <section className={`min-h-screen ${P.bg} flex overflow-hidden`}>

    {/* Число + фото */}
    <div className="hidden lg:block w-[35%] flex-shrink-0 relative overflow-hidden">
      <img
        src="/transport.jpg"
        alt="Доставка"
        className="absolute inset-0 w-full h-full object-cover opacity-20"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-brand-page" />

      <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
        <span
          className={`font-light ${P.text} leading-none tracking-tighter`}
          style={{ fontSize: 'clamp(9rem, 20vw, 16rem)' }}
        >
          8
        </span>
        <span className={`${P.faint} text-xs tracking-[0.5em] uppercase mt-2`}>
          регионов
        </span>
      </div>
    </div>

    {/* Список городов + диаграмма */}
    <div className="flex-1 flex flex-col justify-center px-[1cm] py-24">
      <p className={`${P.faint} text-xs tracking-[0.6em] uppercase mb-12 font-mono`}>
        Дилерская сеть и доставка
      </p>

      <h2
        className={`font-light ${P.text} leading-tight mb-12`}
        style={{ fontSize: 'clamp(2.5rem, 4.5vw, 4rem)' }}
      >
        Присутствие
        <br />
        <span className="font-medium">по всей России</span>
      </h2>

      <div className="grid grid-cols-2 gap-x-10 mb-14">
        {cities.map((city, i) => (
          <div key={city.name} className={`flex items-baseline gap-4 py-4 border-b ${P.border}`}>
            <span className={`${P.faint} font-mono text-sm flex-shrink-0 tabular-nums`}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className="min-w-0 flex-1">
              <span className={`${P.text} text-xl font-medium block leading-tight`}>{city.name}</span>
              <span className={`${P.muted} text-sm mt-1 block`}>{city.note}</span>
            </div>
            {city.isHQ && (
              <span className="text-brand-red text-xs uppercase tracking-widest flex-shrink-0">завод</span>
            )}
          </div>
        ))}
      </div>

      <p className={`${P.faint} text-sm uppercase tracking-widest mb-8`}>
        Структура отгрузки по отраслям
      </p>
      <div className="space-y-5 max-w-md">
        {industries.map(({ label, pct, color }) => (
          <div key={label}>
            <div className="flex items-baseline justify-between mb-2.5">
              <span className={`${P.muted} text-base`}>{label}</span>
              <span className={`${P.text} font-light tabular-nums`}
                style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)' }}>
                {pct}<span className={`${P.faint} text-base ml-0.5`}>%</span>
              </span>
            </div>
            <div className={`h-[2px] ${P.line} relative`}>
              <div className="absolute left-0 top-0 h-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 flex items-center gap-3">
        <div className="w-4 h-px bg-brand-red/60" />
        <p className={`${P.muted} text-base`}>мешки 20 кг · МКР (биг-бэг) · навалом</p>
      </div>
    </div>
  </section>
);

// ─── Страница ─────────────────────────────────────────────────────────────────
const AboutPage2 = () => (
  <main className="bg-brand-page text-brand-dark">
    <AboutVariantSwitcher />

    {/* 01 — Intro */}
    <LightIntroSection />

    {/* 02 — Направления */}
    <LightActivitiesSection />

    {/* 03 — Производство (цифры + линейки) */}
    <LightProductionSection />

    {/* 04 — Галерея (переиспользуем с light-пропом) */}
    <ProductionGallerySection />

    {/* 05 — Лаборатория */}
    <LightQualitySection />

    {/* 06 — Логистика */}
    <LightLogisticsSection />

    {/* 07 — Партнёры */}
    <PartnersSection />
  </main>
);

export default AboutPage2;
