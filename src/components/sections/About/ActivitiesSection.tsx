import { useState } from 'react';
import { divisions } from '@/data/activities';
import ScrollReveal from '@/components/ui/ScrollReveal';

const ActivitiesSection = () => {
  // По умолчанию активен первый пункт — картинка видна сразу
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <section className="bg-[#0a0a0a] overflow-hidden">
      <div className="flex min-h-screen">

        {/* ── ЛЕВАЯ ЧАСТЬ: 2/3 ─────────────────────────────────────── */}
        <div className="flex-1 px-6 sm:px-10 lg:px-[1cm] py-24 lg:py-32 flex flex-col">

          {/* Заголовок */}
          <ScrollReveal type="fade-up">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-20">
              Наша деятельность
            </h2>
          </ScrollReveal>

          {/* Список */}
          <div className="flex-1 flex flex-col justify-center">
            {divisions.map((div, i) => (
              <ScrollReveal key={div.id} type="fade-up" delay={i * 0.08}>
                <div
                  className="group py-10  cursor-pointer"
                  onMouseEnter={() => setActiveIdx(i)}
                >
                  <div className="flex items-start gap-10 md:gap-16">

                    {/* Номер */}
                    <span className="text-white/30 font-mono text-sm flex-shrink-0 w-10 pt-1">
                      {String(i + 1).padStart(2, '0')}.
                    </span>

                    {/* Контент */}
                    <div className="flex-1">
                      <h3
                        className="font-light text-white leading-tight mb-4 transition-all duration-300"
                        style={{ fontSize: activeIdx === i ? '2rem' : '1.75rem' }}
                      >
                        {div.name}
                      </h3>
                      <p className="text-white/60 text-base md:text-lg leading-relaxed max-w-xl">
                        {div.description}
                      </p>
                    </div>

                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* ── ПРАВАЯ ЧАСТЬ: 1/3, картинка на всю высоту ───────────── */}
        <div className="hidden lg:block w-[33.333%] flex-shrink-0 relative py-8">
          {divisions.map((div, i) => (
            <img
              key={div.id}
              src={div.image}
              alt={div.name}
              className="absolute inset-x-0 top-8 bottom-8 w-full h-[calc(100%-4rem)] object-cover object-left rounded-2xl transition-opacity duration-700"
              style={{ opacity: activeIdx === i ? 1 : 0 }}
            />
          ))}
          {/* Лёгкий градиент чтобы стык не был резким */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-transparent to-transparent w-16 pointer-events-none" />
        </div>

      </div>
    </section>
  );
};

export default ActivitiesSection;