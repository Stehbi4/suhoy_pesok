import { useState, useRef, useEffect } from 'react';
import { partners } from '@/data/partners';
import ScrollReveal from '@/components/ui/ScrollReveal';

// Duplicate array for seamless infinite loop
const loopedPartners = [...partners, ...partners];

const PartnersSection = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // CSS animation-based infinite scroll
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Measure half-width (original set) for seamless reset
    const halfWidth = track.scrollWidth / 2;

    let offset = 0;
    let lastTime = performance.now();
    let animId: number;

    const speed = 0.5; // px per ms → ~30px/s

    const animate = (now: number) => {
      if (!isPaused) {
        const dt = now - lastTime;
        offset += speed * dt;
        if (offset >= halfWidth) offset -= halfWidth;
        track.style.transform = `translateX(-${offset}px)`;
      }
      lastTime = now;
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [isPaused]);

  return (
    <section className="py-24 lg:py-32 bg-[#0a0a0a] overflow-hidden">
      <div className="px-6 sm:px-10 lg:px-[1cm] mb-16">
        <ScrollReveal type="fade-up">
          <span className="text-[#f80000] font-mono text-sm tracking-[0.3em] uppercase">05 — Партнёры</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mt-4">Партнёры</h2>
        </ScrollReveal>
      </div>

      {/* Carousel */}
      <div
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          ref={trackRef}
          className="flex gap-6 will-change-transform"
          style={{ width: 'max-content' }}
        >
          {loopedPartners.map((partner, i) => (
            <div
              key={`${partner.name}-${i}`}
              className="w-[360px] flex-shrink-0 card-dark p-8 hover:border-[#f80000]/30 transition-colors duration-300"
            >
              {/* Logo placeholder */}
              <div className="h-12 mb-6 flex items-center">
                <div className="w-10 h-10 rounded-lg bg-[#1a1a1a] border border-[#333] flex items-center justify-center text-white text-xs font-mono">
                  {partner.shortName.slice(0, 2)}
                </div>
                <span className="ml-3 text-white font-light text-lg">{partner.shortName}</span>
              </div>

              {/* Category tag */}
              <span className="text-[#f80000] text-xs font-mono tracking-wider uppercase">
                {partner.category}
              </span>

              {/* Description */}
              <p className="text-gray-500 text-sm leading-relaxed mt-3 line-clamp-3">
                {partner.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
