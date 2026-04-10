import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const stats = [
  { value: '9',      unit: 'фракций',    label: 'Количество фракций' },
  { value: '10 000', unit: 'тонн / год', label: 'Производственная мощность' },
  { value: '0–2,5',  unit: 'мм рассев',  label: 'Диапазон фракций' },
  { value: '27+',    unit: 'лет опыта',  label: 'Опыт работы' },
];

// Wave animation: each item gets a brightness peak with a delay
const WAVE_DURATION = 2200; // total wave ms
const WAVE_PEAK     = 1.6;  // max brightness multiplier
const ITEM_DELAY    = 180;  // ms between items

const StatsStripSection = () => {
  const sectionRef  = useRef<HTMLElement>(null);
  const animRef     = useRef<number>(0);
  const startRef    = useRef<number>(0);
  const triggeredRef = useRef(false);

  const [brightnesses, setBrightnesses] = useState<number[]>(stats.map(() => 1));

  const runWave = () => {
    startRef.current = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startRef.current;
      const next = stats.map((_, i) => {
        const t = elapsed - i * ITEM_DELAY;
        if (t <= 0) return 1;
        // sine wave 0→peak→1
        const progress = Math.min(t / (WAVE_DURATION - i * ITEM_DELAY), 1);
        const wave = Math.sin(progress * Math.PI);
        return 1 + wave * (WAVE_PEAK - 1);
      });
      setBrightnesses(next);

      if (elapsed < WAVE_DURATION + stats.length * ITEM_DELAY) {
        animRef.current = requestAnimationFrame(tick);
      } else {
        setBrightnesses(stats.map(() => 1));
        triggeredRef.current = false; // allow re-trigger next pass
      }
    };
    animRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el || triggeredRef.current) return;
      const rect = el.getBoundingClientRect();
      const vh   = window.innerHeight;
      // trigger when 45% of section has passed top of viewport
      const passed = -rect.top / rect.height;
      if (passed >= 0.45) {
        triggeredRef.current = true;
        runWave();
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-brand-bg border-t border-b border-[#1f1f1f]">
      <div className="px-[1cm] grid grid-cols-2 lg:grid-cols-4 divide-x divide-[#1f1f1f]">
        {stats.map((s, i) => (
          <div key={i} className="py-10 px-6 lg:px-10 flex flex-col justify-center">
            <div className="flex items-baseline gap-2 mb-1">
              <span
                className="text-3xl lg:text-4xl font-light tracking-tight"
                style={{
                  color: 'white',
                  filter: `brightness(${brightnesses[i]})`,
                  transition: 'filter 0.05s linear',
                }}
              >
                {s.value}
              </span>
              <span
                className="text-sm font-medium uppercase tracking-wider"
                style={{
                  color: 'var(--brand-red, #e63329)',
                  filter: `brightness(${brightnesses[i]})`,
                  transition: 'filter 0.05s linear',
                }}
              >
                {s.unit}
              </span>
            </div>
            <p className="text-gray-500 text-xs uppercase tracking-[0.25em]">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsStripSection;
