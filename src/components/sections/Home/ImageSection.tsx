import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

const ImageSection = () => {
  const ref = useRef<HTMLElement>(null);

  // Параллакс фона
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ['-15%', '15%']);

  // Параллакс текста
  const textY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);

  // Scroll-reveal: opacity + y снизу + scale (0.5 → 1)
  const { scrollYProgress: revealProgress } = useScroll({
    target: ref,
    offset: ['start 0.9', 'start 0.1'],
  });
  const revealOpacity = useTransform(revealProgress, [0, 1], [0, 1]);
  const revealY       = useTransform(revealProgress, [0, 1], [60, 0]);
  const revealScale   = useTransform(revealProgress, [0, 1], [0.5, 1]);

  return (
    <section ref={ref} className="relative h-[100vh] overflow-hidden">

      {/* Parallax background */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat image-set-background"
        style={{ y: bgY, scale: 1.15 }}
      />

      {/* Усиленное затемнение — 80% */}
      <div className="absolute inset-0 bg-black/80" />

      {/* Затемнение за текстом слева */}
      <div className="absolute left-0 top-0 bottom-0 w-[55%] bg-gradient-to-l from-transparent via-black/50 to-black/80" />

      {/* Parallax + scroll-reveal (opacity + y + scale) */}
      <motion.div
        className="relative z-10 h-full flex items-start justify-start px-[1cm] pt-[100px]"
        style={{ y: textY }}
      >
        <motion.div
          className="text-left max-w-[1000px] will-change-transform"
          style={{ opacity: revealOpacity, y: revealY, scale: revealScale, transformOrigin: 'left center' }}
        >
          <p className="text-white text-4xl md:text-5xl lg:text-6xl font-light leading-[1.05] tracking-tight">
            За наш многолетный опыт мы  <br />
            отобрали материалы  <span className="text-brand-red text-5xl md:text-65xl lg:text-7xl font-medium"> наилучшего </span>  <br />
            качества с проверенных карьеров
          </p>

        </motion.div>
      </motion.div>

      {/* CTA — нижний правый угол */}
      <div className="absolute bottom-[1cm] right-[1cm] z-10 flex flex-col gap-4 sm:flex-row sm:items-center">
        <Link
          to="/catalog"
          className="btn-primary rounded-lg inline-flex items-center justify-center gap-3"
        >
          <span>Смотреть каталог</span>
          <ArrowUpRight className="w-5 h-5" />
        </Link>
        <Link
          to="/contacts"
          className="px-6 py-3 border border-gray-700 text-white rounded-lg font-semibold tracking-wide hover:border-brand-red hover:text-white transition-all duration-300 flex items-center justify-center gap-3"
        >
          <span>Получить консультацию</span>
        </Link>
      </div>

    </section>
  );
};

export default ImageSection;
