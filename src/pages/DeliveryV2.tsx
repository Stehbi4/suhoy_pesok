import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Phone, ArrowUpRight } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';

/* ────────────────────────────────────────────────────────────────────────
   /delivery/v2 — альтернативная страница доставки.
   Стиль наследован от AboutPage: Manrope font-light/medium, моно-индексы,
   двухколоночные сплиты с фотографиями, моно-цифры, красные акценты.
   Логика та же (варианты, тарифы, процесс, карта, CTA), но визуально иначе:
   – горизонтальный «маршрут от завода до объекта» вместо карточек процесса
   – тонажная шкала вместо ценовых карточек
   – два больших фото-сплита (как QualitySection / LogisticsSection)
   ──────────────────────────────────────────────────────────────────────── */

const regions = [
  { name: 'Санкт-Петербург',       note: 'базовый радиус, до 60 км',  hq: true },
  { name: 'Ленинградская область', note: 'все районы, до 250 км' },
  { name: 'Карелия',               note: 'Петрозаводск, Сортавала' },
  { name: 'Псковская обл.',        note: 'через ЛО, по согласованию' },
  { name: 'Новгородская обл.',     note: 'через ЛО, по согласованию' },
  { name: 'СЗФО',                  note: 'дальние плечи под заказ' },
];

const fleet = [
  { type: 'Самосвал',     payload: '20 т', use: 'Навалом, карьер → объект' },
  { type: 'Цементовоз',   payload: '25 т', use: 'Сухие смеси под пневмо-разгрузку' },
  { type: 'Тягач + борт', payload: '20 т', use: 'МКР по 1000 кг, паллеты' },
  { type: 'Малотоннажник',payload: '5 т',  use: 'Городские объекты с ограничением въезда' },
];

const tariffSteps = [
  { volume: '5',   label: 'до 5 т',     note: 'городской объект'  },
  { volume: '10',  label: '5–10 т',     note: 'минимальный заказ' },
  { volume: '20',  label: '10–20 т',    note: 'один борт'         },
  { volume: '40',  label: '20–40 т',    note: 'двойной рейс'      },
  { volume: '100', label: 'от 100 т',   note: 'оптовый контракт'  },
];

const route = [
  { step: '01', title: 'Заявка',  desc: 'Звонок или форма на сайте — фиксируем объём, адрес, сроки' },
  { step: '02', title: 'Расчёт',  desc: 'В течение часа возвращаемся с точной ценой и окном доставки' },
  { step: '03', title: 'Договор', desc: 'УПД, ТТН, паспорт качества — всё готовится заранее' },
  { step: '04', title: 'Рейс',    desc: 'Загрузка с собственной площадки, прямой контакт с водителем' },
  { step: '05', title: 'Объект',  desc: 'Контрольное взвешивание, выгрузка, закрывающие документы' },
];

const ease = [0.25, 0.46, 0.45, 0.94] as const;

const DeliveryV2 = () => {
  /* ── Hero parallax ─────────────────────────────────────────────────── */
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroBgY    = useTransform(heroProgress, [0, 1], ['0%',  '25%']);
  const heroTextY  = useTransform(heroProgress, [0, 1], ['0%', '-15%']);
  const heroDimOp  = useTransform(heroProgress, [0, 1], [0.55, 0.85]);

  /* ── Тонажная шкала: «бегунок» едет по мере скролла ─────────────────── */
  const scaleRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: scaleP } = useScroll({
    target: scaleRef,
    offset: ['start 0.85', 'end 0.5'],
  });
  const scaleSmoothed = useSpring(scaleP, { stiffness: 120, damping: 22, mass: 0.6 });
  const fillW    = useTransform(scaleSmoothed, [0, 1], ['0%', '100%']);
  const knobLeft = useTransform(scaleSmoothed, [0, 1], ['0%', '100%']);

  /* ── Фон-сплит с цементовозом ──────────────────────────────────────── */
  const truckRef = useRef<HTMLElement>(null);
  const { scrollYProgress: truckP } = useScroll({
    target: truckRef,
    offset: ['start end', 'end start'],
  });
  const truckBgY = useTransform(truckP, [0, 1], ['-12%', '12%']);

  return (
    <main className="bg-brand-graphite text-white">

      {/* ── 01 — HERO: ассиметричный сплит ──────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen overflow-hidden">
        {/* Фото-фон с параллаксом */}
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/Car_Cem_Dilivery.jpg')", y: heroBgY }}
        />
        {/* Дим-слой для читаемости текста */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-brand-graphite via-brand-graphite/60 to-transparent"
          style={{ opacity: heroDimOp }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-graphite/70 to-transparent" />

        {/* Левая «винетка» с цифрой 60 */}
        <div className="hidden lg:flex absolute top-0 left-0 bottom-0 w-16 flex-col items-center justify-between py-12 z-20 select-none pointer-events-none">
          <span className="text-white/30 text-[10px] tracking-[0.5em] uppercase rotate-180" style={{ writingMode: 'vertical-rl' }}>
            СПб + Ленобласть
          </span>
          <span className="text-white/20 font-mono text-xs">v2</span>
        </div>

        {/* Контент */}
        <motion.div
          style={{ y: heroTextY }}
          className="relative z-10 max-w-[1920px] mx-auto px-6 sm:px-10 lg:px-[1cm] pt-40 pb-24 min-h-screen flex flex-col justify-end"
        >
          <p className="text-white/35 text-xs tracking-[0.6em] uppercase mb-10">
            Логистика — собственный парк
          </p>

          <h1
            className="font-light text-white leading-[0.95] mb-10"
            style={{ fontSize: 'clamp(3rem, 9vw, 9rem)' }}
          >
            Доставка
            <br />
            <span className="font-medium">песком и смесями</span>
          </h1>

          {/* Нижняя «панель» с метриками */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-8 mt-8 pt-10 border-t border-white/10 max-w-5xl">
            {[
              { value: '60',   unit: 'км',      label: 'базовый радиус' },
              { value: '20+',  unit: 'т / рейс',label: 'грузоподъёмность' },
              { value: '24/7', unit: '',        label: 'диспетчерская' },
              { value: '8',    unit: 'регионов',label: 'дилерская сеть' },
            ].map((m, i) => (
              <ScrollReveal key={i} type="fade-up" delay={0.1 + i * 0.08}>
                <div>
                  <div className="font-light text-white leading-none whitespace-nowrap"
                    style={{ fontSize: 'clamp(2rem, 3.4vw, 3rem)' }}>
                    {m.value}
                    {m.unit && <span className="text-base lg:text-lg text-white/40 ml-2">{m.unit}</span>}
                  </div>
                  <span className="text-white/35 text-[10px] tracking-[0.4em] uppercase mt-2 block">
                    {m.label}
                  </span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── 02 — РЕГИОНЫ + большая «8» (LogisticsSection-стиль) ────────── */}
      <section className="min-h-screen bg-brand-graphite flex flex-col lg:flex-row overflow-hidden">

        {/* Левая колонка: контент */}
        <div className="flex-1 flex flex-col px-6 sm:px-10 lg:px-[1cm] py-24">
          <p className="text-white/25 text-xs tracking-[0.6em] uppercase mb-10">
            География поставок
          </p>

          <h2
            className="font-light text-white leading-tight mb-10"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 4rem)' }}
          >
            Возим
            <br />
            <span className="font-medium">по Северо-Западу</span>
          </h2>

          <p className="text-white/45 text-base lg:text-lg leading-relaxed mb-12 max-w-lg">
            Базовый радиус — Санкт-Петербург и Ленобласть. Дальние плечи —
            под заказ, с фиксированной ценой за рейс.
          </p>

          {/* Список регионов */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10">
            {regions.map((r, i) => (
              <div
                key={r.name}
                className="flex items-baseline gap-3 lg:gap-4 py-3 lg:py-3.5 border-b border-white/8"
              >
                <span className="text-white/18 font-mono text-xs lg:text-sm flex-shrink-0 tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0 flex-1">
                  <span className="text-white text-base lg:text-lg font-medium block leading-tight">
                    {r.name}
                  </span>
                  <span className="text-white/35 text-xs mt-0.5 block">{r.note}</span>
                </div>
                {r.hq && (
                  <span className="text-brand-red text-[10px] uppercase tracking-widest flex-shrink-0">
                    база
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Правая колонка: фото + большая цифра */}
        <div className="hidden lg:block w-[42%] flex-shrink-0 relative">
          <img
            src="/Car_Cem_Dilivery.jpg"
            alt="Доставка"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-graphite via-brand-graphite/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-graphite/60 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
            <span
              className="font-light text-white leading-none tracking-tighter"
              style={{ fontSize: 'clamp(9rem, 18vw, 14rem)' }}
            >
              8
            </span>
            <span className="text-white/30 text-xs tracking-[0.5em] uppercase mt-2">
              регионов
            </span>
          </div>
        </div>
      </section>

      {/* ── 03 — ТОНАЖНАЯ ШКАЛА (вместо карточек тарифов) ──────────────── */}
      <section className="py-24 lg:py-32 bg-brand-graphite border-t border-white/5">
        <div className="px-6 sm:px-10 lg:px-[1cm]">

          <p className="text-white/25 text-xs tracking-[0.6em] uppercase mb-10">
            Тарифная шкала
          </p>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-20">
            <h2
              className="font-light text-white leading-tight max-w-3xl"
              style={{ fontSize: 'clamp(2rem, 4.5vw, 4rem)' }}
            >
              Чем больше объём —<br />
              <span className="font-medium">тем ниже цена за тонну</span>
            </h2>
            <p className="text-white/45 text-base lg:text-lg max-w-md">
              Точная ставка зависит от расстояния и типа транспорта.
              Пять типовых сценариев — от городского рейса до контракта.
            </p>
          </div>

          {/* Сама шкала */}
          <div ref={scaleRef} className="relative pt-14 pb-2">

            {/* Цифры тонн */}
            <div className="relative h-20 mb-2">
              {tariffSteps.map((s, i) => {
                const left = (i / (tariffSteps.length - 1)) * 100;
                return (
                  <div
                    key={s.volume}
                    className="absolute top-0 -translate-x-1/2 text-center select-none"
                    style={{ left: `${left}%` }}
                  >
                    <div className="font-light text-white leading-none"
                      style={{ fontSize: 'clamp(1.6rem, 2.6vw, 2.4rem)' }}>
                      {s.volume}
                      <span className="text-white/35 text-sm ml-1">т</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Трек */}
            <div className="relative h-[3px] bg-white/10">
              <motion.div
                className="absolute left-0 top-0 h-full"
                style={{
                  width: fillW,
                  background: 'linear-gradient(90deg, #ff4444 0%, #f80000 60%, #aa0000 100%)',
                  filter: 'drop-shadow(0 0 12px rgba(248,0,0,0.5))',
                }}
              />
              {/* Точки-засечки */}
              {tariffSteps.map((_, i) => {
                const left = (i / (tariffSteps.length - 1)) * 100;
                return (
                  <div
                    key={i}
                    className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-brand-graphite border border-white/30"
                    style={{ left: `${left}%` }}
                  />
                );
              })}
              {/* Бегунок */}
              <motion.div
                className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-brand-red"
                style={{
                  left: knobLeft,
                  boxShadow: '0 0 0 6px rgba(248,0,0,0.15), 0 0 24px rgba(248,0,0,0.6)',
                }}
              />
            </div>

            {/* Подписи под шкалой */}
            <div className="relative h-24 mt-6">
              {tariffSteps.map((s, i) => {
                const left = (i / (tariffSteps.length - 1)) * 100;
                return (
                  <div
                    key={s.label}
                    className="absolute top-0 -translate-x-1/2 text-center select-none w-32"
                    style={{ left: `${left}%` }}
                  >
                    <div className="text-white/70 text-xs lg:text-sm font-medium">{s.label}</div>
                    <div className="text-white/30 text-[10px] mt-1 leading-snug">{s.note}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="text-white/30 text-sm mt-8 max-w-2xl">
            * Точную стоимость рассчитываем индивидуально — расстояние, тип песка, окно доставки.
          </p>
        </div>
      </section>

      {/* ── 04 — ПАРК ТЕХНИКИ: фото-сплит, как QualitySection ──────────── */}
      <section ref={truckRef} className="relative min-h-screen bg-brand-graphite flex flex-col lg:flex-row overflow-hidden">

        {/* Левая колонка: фото с параллаксом */}
        <div className="hidden lg:block w-[45%] flex-shrink-0 relative overflow-hidden">
          <motion.img
            src="/Soft_Sand_Containers_x.png"
            alt="Транспорт ЦМИД"
            className="absolute inset-0 w-full h-[120%] object-cover"
            style={{ y: truckBgY }}
          />
          <div className="absolute inset-0 bg-gradient-to-l from-brand-graphite via-brand-graphite/25 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-graphite/55 to-transparent" />

          {/* Цифра + подпись по центру */}
          <div className="absolute inset-0 flex flex-col items-center justify-center select-none px-8">
            <span
              className="font-light text-white leading-none tracking-tighter"
              style={{ fontSize: 'clamp(8rem, 15vw, 12rem)' }}
            >
              4
            </span>
            <span className="text-white/30 text-xs tracking-[0.5em] uppercase mt-2">
              типа транспорта
            </span>
          </div>
        </div>

        {/* Правая колонка: список */}
        <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-[1cm] py-24">
          <p className="text-white/25 text-xs tracking-[0.6em] uppercase mb-10">
            Парк
          </p>

          <h2
            className="font-light text-white leading-tight mb-8"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 4rem)' }}
          >
            Под каждый объём —<br />
            <span className="font-medium">свой тип машины</span>
          </h2>

          <p className="text-white/45 text-base lg:text-lg leading-relaxed mb-10 max-w-lg">
            Собственный парк — никаких посредников и сторонних перевозчиков.
            Разгружаемся навалом или в МКР — что удобнее на объекте.
          </p>

          <div className="flex flex-col">
            {fleet.map((v, i) => (
              <motion.div
                key={v.type}
                initial={{ opacity: 0, x: 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: i * 0.08, ease }}
                className="border-t border-white/8 last:border-b py-5 flex items-baseline gap-6 group"
              >
                <span className="text-white/18 font-mono text-xs flex-shrink-0 w-7 tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-light leading-none mb-2"
                    style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)' }}>
                    {v.type}
                  </div>
                  <div className="text-white/40 text-sm">{v.use}</div>
                </div>
                <span className="text-brand-red font-mono text-sm tracking-wider flex-shrink-0 group-hover:text-brand-red-light transition-colors">
                  {v.payload}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 05 — МАРШРУТ: горизонтальный таймлайн вместо карточек ──────── */}
      <section className="py-24 lg:py-32 bg-brand-graphite border-t border-white/5">
        <div className="px-6 sm:px-10 lg:px-[1cm]">

          <p className="text-white/25 text-xs tracking-[0.6em] uppercase mb-10">
            Как мы работаем
          </p>

          <h2
            className="font-light text-white leading-tight mb-20 max-w-4xl"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 4rem)' }}
          >
            От заявки <span className="font-medium">до объекта</span>
          </h2>

          {/* Десктоп: горизонтальный маршрут */}
          <div className="hidden md:block">
            <div className="relative">
              {/* Линия */}
              <div className="absolute top-12 left-0 right-0 h-px bg-white/10" />
              {/* Поезд из этапов */}
              <div className="relative grid grid-cols-5 gap-4">
                {route.map((r, i) => (
                  <motion.div
                    key={r.step}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.5, delay: i * 0.12, ease }}
                    className="relative"
                  >
                    {/* Узел */}
                    <div className="relative h-24 flex items-center justify-start">
                      <div className="w-6 h-6 rounded-full bg-brand-graphite border border-brand-red flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-brand-red" />
                      </div>
                    </div>

                    <div className="text-brand-red font-mono text-xs tracking-widest mb-3">
                      {r.step}
                    </div>
                    <h3 className="text-white font-light leading-tight mb-3"
                      style={{ fontSize: 'clamp(1.4rem, 2vw, 1.9rem)' }}>
                      {r.title}
                    </h3>
                    <p className="text-white/40 text-sm leading-relaxed">
                      {r.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Мобила: вертикальный список */}
          <div className="md:hidden flex flex-col">
            {route.map((r, i) => (
              <motion.div
                key={r.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex gap-5 pb-8 last:pb-0 relative"
              >
                {/* Линия слева + узел */}
                <div className="relative flex-shrink-0 w-6 flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-brand-red mt-1.5" />
                  {i < route.length - 1 && (
                    <div className="absolute top-4 bottom-0 w-px bg-white/10" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-brand-red font-mono text-xs tracking-widest mb-1">
                    {r.step}
                  </div>
                  <h3 className="text-white text-xl font-light mb-2">{r.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{r.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 06 — КАРТА (full-width) ─────────────────────────────────────── */}
      <div className="w-full">
        <iframe
          src="https://yandex.ru/map-widget/v1/?ll=30.489667%2C60.039733&z=14&pt=30.489667%2C60.039733&dark=true"
          width="100%"
          height="600"
          frameBorder="0"
          allowFullScreen
          className="border-0 block"
          title="Карта доставки — ЗАО НП ЦМИД"
        />
      </div>

      {/* ── 07 — CTA: «Узнать стоимость» (полноэкранный, full-bleed) ───── */}
      <section className="relative py-24 lg:py-32 bg-brand-graphite overflow-hidden border-t border-white/5">
        {/* Большая фоновая цифра */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span
            className="font-extrabold text-white/[0.025] leading-none whitespace-nowrap"
            style={{ fontSize: 'clamp(14rem, 30vw, 32rem)' }}
          >
            290·96·60
          </span>
        </div>

        <div className="relative z-10 px-6 sm:px-10 lg:px-[1cm]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-end">

            {/* Левая часть */}
            <div>
              <p className="text-white/25 text-xs tracking-[0.6em] uppercase mb-8">
                Запрос расчёта
              </p>
              <h2
                className="font-light text-white leading-[1.05] mb-8"
                style={{ fontSize: 'clamp(2.4rem, 5vw, 4.5rem)' }}
              >
                Узнать стоимость
                <br />
                <span className="font-medium">доставки</span>
              </h2>
              <p className="text-white/50 text-base lg:text-lg leading-relaxed max-w-md">
                Скажите объём и адрес — рассчитаем за 15 минут.
                Без обязательств, без авансов до подписания договора.
              </p>
            </div>

            {/* Правая часть: телефон + кнопка */}
            <div className="flex flex-col gap-6 lg:items-end">
              <a
                href="tel:+78122909660"
                className="group inline-flex items-center gap-5 text-white"
              >
                <span className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-brand-red group-hover:bg-brand-red transition-colors">
                  <Phone className="w-5 h-5" />
                </span>
                <span className="font-light leading-none tracking-tight"
                  style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)' }}>
                  +7 (812) 290-96-60
                </span>
              </a>

              <Link
                to="/contacts"
                className="group inline-flex items-center justify-between gap-6 bg-brand-red hover:bg-brand-red-light transition-colors text-white px-8 py-5 lg:min-w-[360px]"
              >
                <span className="font-medium tracking-wide">Оставить заявку</span>
                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DeliveryV2;
