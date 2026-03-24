import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { historySlides } from '@/data/companyHistory';

const SLIDE_COUNT = historySlides.length;

const HeritageSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Horizontal movement: 0% → -(SLIDE_COUNT-1) * 100vw
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    ['0vw', `-${(SLIDE_COUNT - 1) * 100}vw`],
  );

  // Progress line width for timeline
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section ref={containerRef} style={{ height: `${SLIDE_COUNT * 100}vh` }} className="relative">
      {/* Sticky wrapper — locks viewport */}
      <div className="sticky top-0 h-screen overflow-hidden bg-[#0a0a0a]">

        {/* Background rotating logo */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <motion.img
            src="/CMID_Logo.png"
            alt=""
            className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] opacity-[0.04]"
            style={{ rotate: useTransform(scrollYProgress, [0, 1], [0, 360]) }}
          />
        </div>

        {/* Horizontal sliding track */}
        <motion.div
          className="flex h-full will-change-transform"
          style={{ x, width: `${SLIDE_COUNT * 100}vw` }}
        >
          {historySlides.map((slide, i) => (
            <div
              key={slide.id}
              className="relative w-screen h-full flex-shrink-0 flex items-center px-6 sm:px-10 lg:px-[1cm]"
            >
              {/* Year tag — top left */}
              <div className="absolute top-8 left-6 sm:left-10 lg:left-[1cm]">
                <span className="text-[#f80000] font-mono text-sm tracking-[0.3em] uppercase">
                  {String(i + 1).padStart(2, '0')} — Наследие
                </span>
                <div className="mt-2 text-gray-500 text-lg font-light">{slide.period}</div>
              </div>

              {/* Background year number — right bottom */}
              <div className="absolute bottom-16 right-6 sm:right-10 lg:right-[1cm] pointer-events-none select-none">
                <span className="text-[15vw] font-extrabold leading-none text-white/[0.03]">
                  {slide.period.split('–')[0]}
                </span>
              </div>

              {/* Content */}
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

        {/* Timeline bar — bottom */}
        <div className="absolute bottom-8 left-6 sm:left-10 lg:left-[1cm] right-6 sm:right-10 lg:right-[1cm] z-20">
          {/* Labels */}
          <div className="flex justify-between mb-4">
            {historySlides.map((slide) => (
              <span key={slide.id} className="text-xs text-gray-600 font-mono">
                {slide.period.split('–')[0]}
              </span>
            ))}
          </div>

          {/* Track */}
          <div className="relative h-[2px] bg-[#222]">
            <motion.div className="absolute left-0 top-0 h-full bg-[#f80000]" style={{ width: progressWidth }} />

            {/* Dots */}
            {historySlides.map((_, i) => {
              const dotPosition = `${(i / (SLIDE_COUNT - 1)) * 100}%`;
              return (
                <motion.div
                  key={i}
                  className="absolute top-1/2 -translate-y-1/2 rounded-full border-2 border-[#333] bg-[#0a0a0a]"
                  style={{
                    left: dotPosition,
                    width: useTransform(
                      scrollYProgress,
                      [Math.max(0, i / SLIDE_COUNT - 0.05), i / SLIDE_COUNT, Math.min(1, i / SLIDE_COUNT + 0.15)],
                      [8, 14, 8],
                    ),
                    height: useTransform(
                      scrollYProgress,
                      [Math.max(0, i / SLIDE_COUNT - 0.05), i / SLIDE_COUNT, Math.min(1, i / SLIDE_COUNT + 0.15)],
                      [8, 14, 8],
                    ),
                    borderColor: useTransform(
                      scrollYProgress,
                      [Math.max(0, i / SLIDE_COUNT - 0.05), i / SLIDE_COUNT],
                      ['#333', '#f80000'],
                    ),
                    translateX: '-50%',
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeritageSection;
