import { useState } from 'react';
import { divisions } from '@/data/activities';

const ActivitiesSection = () => {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  return (
    <section className="bg-brand-graphite overflow-hidden">
      <div className="flex justify-between min-h-screen">

        {/* ── ЛЕВАЯ ЧАСТЬ ──────────────────────────────────────────── */}
        <div className="w-[43.75%] flex-shrink-0 pl-[1cm] pr-8 sm:pr-12 py-24 lg:py-32 flex flex-col">

          {/* Список направлений — привязан к верху */}
          <div className="flex flex-col">
            {divisions.map((div, i) => {
              const isActive = activeIdx === i;
              const isOther = activeIdx !== null && !isActive;

              return (
                <div
                  key={div.id}
                  className="cursor-pointer py-4"
                  onMouseEnter={() => setActiveIdx(i)}
                  onMouseLeave={() => setActiveIdx(null)}
                >
                  <div className="flex items-baseline gap-5">
                    {/* Номер */}
                    <span
                      className="font-mono text-[10px] flex-shrink-0 w-7 transition-colors duration-300"
                      style={{ color: isActive ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.35)' }}
                    >
                      {String(i + 1).padStart(2, '0')}.
                    </span>

                    {/* Заголовок */}
                    <h3
                      className="font-light text-white leading-tight transition-all duration-300"
                      style={{
                        fontSize: isActive ? 'clamp(2.3rem, 3.8vw, 3.2rem)' : 'clamp(1.55rem, 2.5vw, 2.05rem)',
                        opacity: isOther ? 0.3 : isActive ? 1 : 1,
                      }}
                    >
                      {div.name}
                    </h3>
                  </div>

                  {/* Описание — появляется при наведении, с отступом */}
                  <div
                    className="overflow-hidden transition-all duration-300"
                    style={{
                      maxHeight: isActive ? '12rem' : '0',
                      opacity: isActive ? 1 : 0,
                    }}
                  >
                    <p
                      className="text-white/50 text-2xl leading-relaxed mt-2"
                      style={{ paddingLeft: 'calc(1.75rem + 1.25rem)' }}
                    >
                      {div.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── ПРАВАЯ ЧАСТЬ: ~45% ширины, фото ──────────────────────── */}
        <div className="hidden lg:block w-1/2 flex-shrink-0 relative">
          {divisions.map((div, i) => (
            <img
              key={div.id}
              src={div.image}
              alt={div.name}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
              style={{ opacity: activeIdx === i ? 1 : 0 }}
            />
          ))}
          {/* Градиент стыка */}
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-brand-graphite to-transparent pointer-events-none" />
        </div>

      </div>
    </section>
  );
};

export default ActivitiesSection;
