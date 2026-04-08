import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const quoteRef   = useRef<HTMLDivElement>(null);

  // ── Параллакс фона ────────────────────────────────────────────────────────
  const { scrollYProgress: sectionProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const bgY = useTransform(sectionProgress, [0, 1], ['0%', '30%']);

  // ── Анимация цитаты — собственный ref, как в AdvantagesSection ───────────
  const { scrollYProgress: quoteProgress } = useScroll({
    target: quoteRef,
    offset: ['start 0.95', 'start 0.35'],
  });
  const quoteOpacity = useTransform(quoteProgress, [0, 1], [0,   1]);
  const quoteY       = useTransform(quoteProgress, [0, 1], [60,  0]);
  const quoteScale   = useTransform(quoteProgress, [0, 1], [0.5, 1]);

  return (
    <section ref={sectionRef} className="relative h-[200vh] overflow-hidden">

      {/* Parallax background */}
      <motion.div
        className="absolute inset-0 hero-background"
        style={{ y: bgY, backgroundPosition: 'center top' }}
      />

      {/* Background Effects Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-blue-900/20 to-transparent" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)`,
            backgroundSize: '100px 100px',
          }}
        />
      </div>

      {/* Content Container — первый экран */}
      <div className="relative z-10 w-full px-[1cm] pt-28 pb-16 min-h-[200vh] flex flex-col">

        {/* Заголовок */}
        <div className="flex justify-start items-start">
          <div className="max-w-md animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light text-white leading-[0.95] tracking-tight mb-6">
              Сухой
              <br />
              <span className="text-white font-medium">Кварцевый</span>
              <br />
              Песок
            </h1>
          </div>
        </div>

        {/* Описание + кнопки */}
        <div className="absolute bottom-[105vh] right-0 w-full px-[1cm] flex justify-end items-start lg:items-end gap-6">
          <div className="w-full max-w-md text-right">
            <p className="text-gray-400 text-lg max-w-md mb-8 leading-relaxed">
              Очищенный, фракционированный, <br />
              cухой песок под любые ваши задачи. <br />
              Для промышленности и строительства.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Link
                to="/catalog"
                className="bg-brand-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-red-light transition-colors flex items-center justify-end gap-3"
              >
                <span>В каталог</span>
                <ArrowUpRight className="w-5 h-5" />
              </Link>
              <Link
                to="/contacts"
                className="px-6 py-3 border border-gray-700 text-white rounded-lg font-semibold hover:border-brand-red hover:text-white transition-all duration-300 flex items-center justify-center gap-3"
              >
                <span>Связаться</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Индикатор скрола */}
        <div className="absolute top-[90vh] left-[1cm] z-10 flex flex-col items-center gap-2">
          <span className="text-gray-500 text-xs tracking-[0.3em] uppercase">Листайте</span>
          <ChevronDown className="w-5 h-5 text-gray-500 animate-bounce" />
        </div>
      </div>

      {/* Цитата — второй экран, анимация как в AdvantagesSection ──────────── */}
      <div className="absolute top-[150vh] left-0 right-0 z-10 px-[1cm]">
        <motion.div
          ref={quoteRef}
          style={{ opacity: quoteOpacity, y: quoteY, scale: quoteScale }}
          className="will-change-transform"
        >
          <p className="text-white text-4xl md:text-5xl lg:text-6xl font-light leading-[1.05] tracking-tight">
            Каждая песчинка — кирпичик величия: <br />
            прочность огромного всегда держится на <br />надёжности самого малого
          </p>
        </motion.div>
      </div>

    </section>
  );
};

export default HeroSection;
