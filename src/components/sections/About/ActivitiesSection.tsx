import { useState } from 'react';
import { divisions } from '@/data/activities';
import ScrollReveal from '@/components/ui/ScrollReveal';

const ActivitiesSection = () => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <section className="min-h-screen py-24 lg:py-32 bg-[#0a0a0a]">
      <div className="px-6 sm:px-10 lg:px-[1cm]">
        <ScrollReveal type="fade-up" className="mb-20">
          <span className="text-[#f80000] font-mono text-sm tracking-[0.3em] uppercase">02 — Деятельность</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mt-4">Наша деятельность</h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 items-start">
          {/* Left — photo column (1/3) */}
          <div className="hidden lg:flex relative h-[500px] items-end">
            {divisions.map((div, i) => (
              <img
                key={div.id}
                src={div.image}
                alt={div.name}
                className="absolute inset-0 w-full h-full object-cover rounded-2xl transition-all duration-700"
                style={{
                  opacity: hoveredIdx === i ? 1 : hoveredIdx === null && i === 0 ? 0.4 : 0,
                  transform: hoveredIdx === i ? 'scale(1)' : 'scale(0.95)',
                }}
              />
            ))}
          </div>

          {/* Right — list (2/3) */}
          <div className="lg:col-span-2 lg:pl-16">
            {divisions.map((div, i) => (
              <ScrollReveal key={div.id} type="fade-up" delay={i * 0.08}>
                <div
                  className="group py-10 border-b border-[#222] cursor-pointer transition-colors duration-300 hover:bg-[#111]/50"
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  <div className="flex items-start gap-10 md:gap-16">
                    {/* Number */}
                    <span className="text-[#f80000] font-mono text-lg md:text-xl flex-shrink-0 w-12">
                      {String(i + 1).padStart(2, '0')}
                    </span>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-2xl md:text-3xl font-light text-white mb-4 group-hover:text-[#f80000] transition-colors duration-300">
                        {div.name}
                      </h3>
                      <p className="text-gray-500 text-base md:text-lg leading-relaxed max-w-xl">
                        {div.description}
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ActivitiesSection;
