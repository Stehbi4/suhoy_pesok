import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { historySlides } from '@/data/companyHistory';
import { RED } from '@/styles/theme';

const SLIDE_COUNT = historySlides.length;

// — Отдельный компонент для точки тайминга.
// useTransform нельзя вызывать внутри .map() — это нарушение Rules of Hooks.
const DotIndicator = ({
  index,
  slideCount,
  scrollYProgress,
}: {
  index: number;
  slideCount: number;
  scrollYProgress: MotionValue<number>;
}) => {
  const pct = index / (slideCount - 1);
  const mid = index / slideCount;

  const size = useTransform(
    scrollYProgress,
    [Math.max(0, mid - 0.05), mid, Math.min(1, mid + 0.15)],
    [8, 14, 8],
  );
  const color = useTransform(
    scrollYProgress,
    [Math.max(0, mid - 0.05), mid],
    ['#333333', RED],
  );

  return (
    <motion.div
      className="absolute top-1/2 rounded-full border-2 bg-brand-graphite"
      style={{
        left: `${pct * 100}%`,
        width: size,
        height: size,
        borderColor: color,
        translateX: '-50%',
        translateY: '-50%',
      }}
    />
  );
};

// ─────────────────────────────────────────────
const HeritageSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef     = useRef<HTMLVideoElement>(null);

  // Принудительный autoplay — Safari/Chrome иногда игнорируют атрибут
  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Горизонтальный сдвиг: 0 → -(N-1)×100vw
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    ['0vw', `-${(SLIDE_COUNT - 1) * 100}vw`],
  );

  // Прогресс-линия тайминга
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section
      ref={containerRef}
      style={{ height: `${SLIDE_COUNT * 100}vh` }}
      className="relative"
    >
      {/* ── Sticky-обёртка: занимает 100vh и прилипает при скролле ── */}
      <div className="sticky top-0 h-screen overflow-hidden bg-brand-graphite">

        {/* ── СЛОЙ 0: видео логотипа ──────────────────────────────────
            • absolute inset-0 — покрывает весь sticky-блок
            • z-0            — ниже слайдов
            • pointer-events-none — не перехватывает клики
            • mix-blend-mode: screen — чёрный фон видео становится
              прозрачным, цветные пиксели логотипа проявляются поверх
              тёмного фона сайта                                       */}
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
          {/* webm (VP9) поддерживает альфа-канал → прозрачный фон нативно.
              mp4 fallback — для браузеров без webm, mix-blend-mode: screen
              симулирует прозрачность если лого светлое на чёрном фоне.
              Конвертация: ffmpeg -i Logo_Animation.mp4 -c:v libvpx-vp9 -pix_fmt yuva420p Logo_Animation.webm */}
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            style={{ mixBlendMode: 'screen' }}
            className="w-[400px] h-[400px] md:w-[520px] md:h-[520px] lg:w-[600px] lg:h-[600px] object-contain opacity-60"
          >
            <source src="/Logo/Logo_Animation.webm" type="video/webm" />
            <source src="/Logo/Logo_Animation.mp4"  type="video/mp4"  />
          </video>
        </div>

        {/* ── СЛОЙ 10: горизонтальный трек со слайдами ──────────────── */}
        <motion.div
          className="relative z-10 flex h-full will-change-transform"
          style={{ x, width: `${SLIDE_COUNT * 100}vw` }}
        >
          {historySlides.map((slide, i) => (
            <div
              key={slide.id}
              className="relative w-screen h-full flex-shrink-0 flex items-center px-6 sm:px-10 lg:px-[1cm]"
            >
              {/* Период — левый верхний угол, top-24 чтобы не перекрывался хедером */}
              <div className="absolute top-24 left-6 sm:left-10 lg:left-[1cm]">
                <div className="text-gray-500 text-lg font-light">{slide.period}</div>
              </div>

              {/* Год фоном — правый нижний угол */}
              <div className="absolute bottom-16 right-6 sm:right-10 lg:right-[1cm] pointer-events-none select-none">
                <span className="text-[15vw] font-extrabold leading-none text-white/[0.03]">
                  {slide.period.split('–').pop()}
                </span>
              </div>

              {/* Текстовый контент */}
              <div className="relative z-10 max-w-3xl pt-20">
                <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-[1.05] mb-8">
                  {slide.title}
                </h2>
                <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-2xl mb-8">
                  {slide.description}
                </p>
                <div className="flex flex-wrap gap-3">
                  {slide.products_tech.map((tech, j) => (
                    <span
                      key={j}
                      className="text-xs text-gray-500 border border-[#333] rounded-full px-4 py-1.5"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* ── СЛОЙ 20: тайминг-полоса — поверх всего ────────────────── */}
        <div className="absolute bottom-8 left-6 sm:left-10 lg:left-[1cm] right-6 sm:right-10 lg:right-[1cm] z-20">
          {/* Годы */}
          <div className="flex justify-between mb-4">
            {historySlides.map((slide, i) => (
              <span key={slide.id} className="text-xs text-gray-600 font-mono">
                {i === historySlides.length - 1
                  ? slide.period.split('–').pop()
                  : slide.period.split('–')[0]}
              </span>
            ))}
          </div>

          {/* Трек */}
          <div className="relative h-[2px] bg-[#222]">
            <motion.div
              className="absolute left-0 top-0 h-full bg-brand-red"
              style={{ width: progressWidth }}
            />
            {historySlides.map((_, i) => (
              <DotIndicator
                key={i}
                index={i}
                slideCount={SLIDE_COUNT}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeritageSection;