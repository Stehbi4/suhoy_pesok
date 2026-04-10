import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Truck, Package, MapPin, Clock, Phone, CheckCircle2 } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

const DeliveryPage = () => {
  const heroRef     = useRef<HTMLElement>(null);
  const section4Ref = useRef<HTMLElement>(null);
  const s4TextRef   = useRef<HTMLHeadingElement>(null);

  // ── Параллакс секции 1 ────────────────────────────────────────────────────
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroBgY = useTransform(heroProgress, [0, 1], ['0%', '30%']);

  // ── Параллакс фона секции 4 ───────────────────────────────────────────────
  const { scrollYProgress: s4Progress } = useScroll({
    target: section4Ref,
    offset: ['start end', 'end start'],
  });
  const s4BgY = useTransform(s4Progress, [0, 1], ['-15%', '15%']);

  // ── Анимация текста секции 4 — как "Каждая песчинка" в HeroSection ────────
  const { scrollYProgress: s4TextProgress } = useScroll({
    target: s4TextRef,
    offset: ['start 0.95', 'start 0.35'],
  });
  const s4TextOpacity = useTransform(s4TextProgress, [0, 1], [0,   1]);
  const s4TextY       = useTransform(s4TextProgress, [0, 1], [60,  0]);
  const s4TextScale   = useTransform(s4TextProgress, [0, 1], [0.5, 1]);

  const deliveryOptions = [
    {
      icon: Truck,
      title: 'Собственный транспорт',
      description: 'Цементовозы и самосвалы для перевозки сыпучих материалов'
    },
    {
      icon: Package,
      title: 'Навалом и в МКР',
      description: 'Доставка навалом или в мягких контейнерах (биг-бэгах)'
    },
    {
      icon: MapPin,
      title: 'СПб и Ленинградская область',
      description: 'Оперативная доставка по всему региону'
    },
    {
      icon: Clock,
      title: 'Точные сроки',
      description: 'Соблюдение согласованных сроков поставки'
    }
  ];

  const pricing = [
    { volume: 'до 10 тонн', price: 'по запросу', note: 'Минимальный заказ' },
    { volume: '10-25 тонн', price: 'по запросу', note: 'Стандартная доставка' },
    { volume: '25+ тонн', price: 'по запросу', note: 'Оптовые условия' }
  ];

  const workProcess = [
    { step: '01', title: 'Заявка', description: 'Оставляете заявку по телефону или на сайте' },
    { step: '02', title: 'Расчёт', description: 'Мы рассчитываем стоимость и сроки доставки' },
    { step: '03', title: 'Договор', description: 'Заключаем договор и согласовываем детали' },
    { step: '04', title: 'Доставка', description: 'Доставляем продукцию в указанные сроки' }
  ];

  return (
    <main className="min-h-screen pt-24 md:pt-0 bg-brand-bg">

      {/* ── 01 — Page Header (parallax) ───────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen overflow-hidden">
        {/* Parallax background */}
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/Car_Cem_Dilivery.jpg')", y: heroBgY }}
        />
        <div className="absolute inset-0 bg-gradient-radial from-blue-900/10 to-transparent opacity-30" />

        <div className="max-w-[1920px] mx-auto lg:px-[1cm] relative z-10 pt-40 py-16 md:py-24">
          {/* Заголовок — статичный, как на Hero */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-white leading-tight mb-6">
            Доставка
            <br />
            <span className="px-24 text-white font-medium"> и оплата</span>
          </h1>
        </div>
      </section>

      {/* ── 02 — Delivery Options ─────────────────────────────────────────── */}
      <section className="py-16 md:py-12">
        <div className="container-custom">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-px bg-white" />
            <span className="text-white text-sm tracking-[0.3em] uppercase font-medium">
              Варианты доставки
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {deliveryOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -8 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="card-dark card-hover p-8 hover:border-brand-red/30 rounded-lg"
                >
                  <Icon className="w-7 h-7 text-white mb-6" />
                  <h3 className="text-xl font-light text-white mb-3">
                    {option.title}
                  </h3>
                  <p className="text-gray-400">
                    {option.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 03 — Pricing ──────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-brand-bg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-blue-900/10 to-transparent opacity-20" />

        <div className="container-custom relative z-10">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-px bg-white" />
            <span className="text-white text-sm tracking-[0.3em] uppercase font-medium">
              Тарифы на доставку
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricing.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
                className="card-dark card-hover p-8 rounded-lg text-center"
              >
                <div className="text-2xl font-light text-white mb-2">
                  {item.volume}
                </div>
                <div className="text-3xl font-light text-white mb-2">
                  {item.price}
                </div>
                <div className="text-gray-500 text-sm">
                  {item.note}
                </div>
              </motion.div>
            ))}
          </div>

          <p className="text-gray-500 text-center mt-8">
            * Точная стоимость доставки рассчитывается индивидуально в зависимости от расстояния и объёма
          </p>
        </div>
      </section>

      {/* ── 04 — Containers hero (parallax + text animation) ──────────────── */}
      <section ref={section4Ref} className="relative min-h-screen overflow-hidden">
        {/* Parallax background */}
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/Soft_Sand_Containers_x.png')", y: s4BgY }}
        />
        <div className="absolute inset-0 bg-gradient-radial from-blue-900/10 to-transparent opacity-30" />

        <div className="max-w-[1920px] mx-auto lg:px-[1cm] relative z-10 pt-40 py-16 md:py-24">
          <motion.h1
            ref={s4TextRef}
            style={{ opacity: s4TextOpacity, y: s4TextY, scale: s4TextScale }}
            className="text-5xl md:text-6xl lg:text-7xl font-light text-white leading-tight mb-6 will-change-transform"
          >
            Навалом, или в мягких контейнерах (биг-бэгах)<br />
            Своим транспортом!
          </motion.h1>
        </div>
      </section>

      {/* ── 05 — Work Process ─────────────────────────────────────────────── */}
      <section className="py-16 md:py-24">
        <div className="container-custom">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-px bg-white" />
            <span className="text-white text-sm tracking-[0.3em] uppercase font-medium">
              Как мы работаем
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-light text-white mb-12">
            Схема работы
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {workProcess.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card-dark card-hover p-8 rounded-lg"
              >
                <div className="text-5xl font-bold text-[#1a1a1a] mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-light text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-400">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 06 — Map ──────────────────────────────────────────────────────── */}
      <div className="w-full">
        <iframe
          src="https://yandex.ru/map-widget/v1/?ll=30.489667%2C60.039733&z=14&pt=30.489667%2C60.039733&dark=true"
          width="100%"
          height="750"
          frameBorder="0"
          allowFullScreen
          className="border-0"
          title="Карта доставки — ЗАО НП ЦМИД"
        />
      </div>

      {/* ── 07 — Payment ──────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-brand-bg relative overflow-hidden">
        <div className="absolute inset-0 orange-glow opacity-20" />

        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
            {/* Payment Methods */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-px bg-white" />
                <span className="text-white text-sm tracking-[0.3em] uppercase font-medium">
                  Способы оплаты
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl font-light text-white mb-8">
                Удобная оплата
              </h2>
              <div className="space-y-4">
                {[
                  { title: 'Безналичный расчёт', desc: 'Для юридических лиц по договору' },
                  { title: '!Наличный расчёт!?', desc: 'Для физических лиц' },
                  { title: 'Отсрочка платежа??', desc: 'Для постоянных клиентов' },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.45, delay: index * 0.1 }}
                    className="flex items-start card-dark card-hover p-6 rounded-lg hover:border-brand-red/50"
                      whileHover={{ y: -8 }}
                      style={{ border: '1px solid #222', transition: 'border-color 0.3s ease, box-shadow 0.4s ease' }}
                  >
                    <CheckCircle2 className="w-6 h-6 text-white flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-lg text-white mb-1">{item.title}</h3>
                      <p className="text-gray-400">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Contact CTA */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55 }}
              className="bg-brand-bg-alt border border-[#222] rounded-lg p-8 md:p-12"
            >
              <h3 className="text-2xl md:text-3xl font-light text-white mb-4">
                Узнать стоимость доставки
              </h3>
              <p className="text-white/80 mb-8">
                Свяжитесь с нами для получения точного расчёта стоимости доставки
                в ваш регион.
              </p>
              <div className="space-y-4">
                <a
                  href="tel:+78122909660"
                  className="flex items-center gap-3 text-white hover:text-white/80 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  <span className="text-lg">+7 (812) 290-96-60</span>
                </a>
                <Link
                  to="/contacts"
                  className="block w-full bg-brand-red text-white py-4 rounded-lg font-semibold tracking-brand-red hover:bg-brand-red-light transition-colors text-center"
                >
                  Оставить заявку
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DeliveryPage;
