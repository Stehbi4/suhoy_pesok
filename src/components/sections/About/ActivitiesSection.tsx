import { useState, useEffect } from 'react';
import { divisions } from '@/data/activities';

const ActivitiesSection = () => {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  // Desktop = hover-driven; mobile = tap-driven (toggle).
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined'
      ? window.matchMedia('(min-width: 1024px)').matches
      : true,
  );
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = (e: MediaQueryListEvent) => {
      setIsDesktop(e.matches);
      setActiveIdx(null); // reset on breakpoint flip
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return (
    <section className="relative bg-brand-graphite overflow-hidden">

      {/* ── Mobile-only фон: картинка активного направления ──────────── */}
      <div className="lg:hidden absolute inset-0 z-0 pointer-events-none">
        {divisions.map((div, i) => (
          <img
            key={div.id}
            src={div.image}
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
            style={{ opacity: activeIdx === i ? 0.35 : 0 }}
          />
        ))}
        {/* Затемнение поверх для читаемости текста */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-brand-graphite/85 via-brand-graphite/65 to-brand-graphite/90 transition-opacity duration-500"
          style={{ opacity: activeIdx !== null ? 1 : 0 }}
        />
      </div>

      <div className="relative z-10 flex justify-between min-h-screen">

        {/* ── ЛЕВАЯ ЧАСТЬ ──────────────────────────────────────────── */}
        <div className="w-full lg:w-[43.75%] flex-shrink-0 px-[1cm] lg:pl-[1cm] lg:pr-8 xl:pr-12 py-24 lg:py-32 flex flex-col">

          {/* Список направлений — привязан к верху */}
          <div className="flex flex-col">
            {divisions.map((div, i) => {
              const isActive = activeIdx === i;
              const isOther = activeIdx !== null && !isActive;

              return (
                <div
                  key={div.id}
                  className="cursor-pointer py-4 select-none"
                  onMouseEnter={isDesktop ? () => setActiveIdx(i)    : undefined}
                  onMouseLeave={isDesktop ? () => setActiveIdx(null) : undefined}
                  onClick={isDesktop ? undefined : () => setActiveIdx(prev => prev === i ? null : i)}
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
