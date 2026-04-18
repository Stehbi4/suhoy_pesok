/**
 * PartnersSection — логотипы плавают как пузыри.
 * theme="light" — на кремовом фоне (brand-page), theme="dark" — на графите.
 * Каждый логотип: своя орбита (sin/cos), скорость, размер.
 * При наведении — всплывает название компании.
 */
import { useEffect, useRef, useState } from 'react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { partners } from '@/data/partners';

interface Props {
  theme?: 'light' | 'dark';
}

// Размеры логотипа по флагу
const SIZE_MAP = { sm: 285, md: 375, lg: 480 };

// Параметры орбиты: 3 ряда × 3 колонки
const ORBITS = [
  // Ряд 1 — верх
  { x: 15, y: 22, rx: 3, ry: 3, spd: 0.0018, phase: 0.0 },  // Росатом    (lg)
  { x: 50, y: 18, rx: 4, ry: 3, spd: 0.0022, phase: 1.2 },  // Минобороны (md)
  { x: 85, y: 25, rx: 3, ry: 4, spd: 0.0015, phase: 2.5 },  // НОВАТЭК    (lg)
  // Ряд 2 — середина
  { x: 12, y: 55, rx: 4, ry: 3, spd: 0.0025, phase: 0.7 },  // Росморпорт (lg)
  { x: 42, y: 52, rx: 3, ry: 4, spd: 0.002,  phase: 3.1 },  // Транснефть (md)
  { x: 72, y: 58, rx: 4, ry: 3, spd: 0.0028, phase: 1.8 },  // Метро      (sm)
  // Ряд 3 — низ
  { x: 28, y: 82, rx: 3, ry: 3, spd: 0.0023, phase: 4.2 },  // Канал      (md)
  { x: 58, y: 85, rx: 4, ry: 3, spd: 0.003,  phase: 2.0 },  // Росавиация (sm)
  { x: 88, y: 80, rx: 3, ry: 4, spd: 0.0018, phase: 0.4 },  // Росморречфлот (md)
];

interface LogoState { x: number; y: number; }

const PartnersSection = ({ theme = 'light' }: Props) => {
  const [positions, setPositions] = useState<LogoState[]>(
    ORBITS.map(o => ({ x: o.x, y: o.y }))
  );
  const [hovered, setHovered] = useState<number | null>(null);
  const rafRef = useRef<number>(0);
  const t = useRef(0);

  useEffect(() => {
    const animate = () => {
      t.current += 1;
      setPositions(
        ORBITS.map(o => ({
          x: o.x + o.rx * Math.sin(t.current * o.spd + o.phase),
          y: o.y + o.ry * Math.cos(t.current * o.spd * 0.7 + o.phase),
        }))
      );
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const isDark = theme === 'dark';

  const palette = isDark
    ? {
        section:  'bg-brand-graphite',
        faint:    'text-white/22',
        heading:  'text-white',
        stat:     'text-white',
        statLbl:  'text-white/30',
        border:   'border-white/[0.08]',
        footNote: 'text-white/25',
        tipBg:    'bg-white text-brand-dark',
        tipArrow: '#ffffff',
        dotGrid:  'rgba(255,255,255,0.06)',
        // Покой — белые силуэты; hover — родные цвета
        dimFilter:  'grayscale(100%) brightness(0) invert(1) opacity(0.45)',
        hoverFilter: 'none',
      }
    : {
        section:  'bg-brand-page',
        faint:    'text-brand-dark/22',
        heading:  'text-brand-dark',
        stat:     'text-brand-dark',
        statLbl:  'text-brand-dark/30',
        border:   'border-brand-dark/8',
        footNote: 'text-brand-dark/25',
        tipBg:    'bg-brand-dark text-white',
        tipArrow: '#1A1A1B',
        dotGrid:  'rgba(26,26,27,0.05)',
        dimFilter:  'grayscale(100%) opacity(0.55)',
        hoverFilter: 'none',
      };

  return (
    <section className={`${palette.section} py-24 lg:py-32 overflow-hidden`}>
      <div className="px-[1cm]">
        <ScrollReveal type="fade-up">

          {/* ── Шапка ───────────────────────────────────────────────────── */}
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className={`${palette.faint} text-xs tracking-[0.6em] uppercase mb-3 font-mono`}>
                Партнёры и клиенты
              </p>
              <h2
                className={`${palette.heading} font-light leading-none`}
                style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}
              >
                Нам доверяют
              </h2>
            </div>

            {/* Стата */}
            <div className="hidden lg:flex gap-10">
              {[
                { val: partners.length, label: 'клиентов' },
                { val: '25+',           label: 'лет опыта' },
              ].map(({ val, label }) => (
                <div key={label} className="text-right">
                  <div
                    className={`${palette.stat} font-light leading-none tabular-nums`}
                    style={{ fontSize: 'clamp(2rem, 3vw, 2.5rem)' }}
                  >
                    {val}
                  </div>
                  <div className={`${palette.statLbl} text-xs uppercase tracking-[0.35em] mt-1`}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`border-t ${palette.border} mb-0`} />

        </ScrollReveal>
      </div>

      {/* ── Поле логотипов ──────────────────────────────────────────────── */}
      <div
        className="relative w-full"
        style={{ height: '50vh', minHeight: 380 }}
      >
        {/* Dot-grid подложка */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              `radial-gradient(circle, ${palette.dotGrid} 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        {partners.map((p, i) => {
          const size  = SIZE_MAP[p.logoSize ?? 'md'];
          const isHov = hovered === i;
          const pos   = positions[i];

          return (
            <div
              key={i}
              className="absolute transition-transform duration-100"
              style={{
                left:      `${pos.x}%`,
                top:       `${pos.y}%`,
                transform: `translate(-50%, -50%) scale(${isHov ? 1.15 : 1})`,
                zIndex:    isHov ? 10 : 1,
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Логотип без фона */}
              <div
                className="relative flex items-center justify-center cursor-pointer"
                style={{ width: size, height: size * 0.7 }}
              >
                <img
                  src={p.logo}
                  alt={p.shortName}
                  draggable={false}
                  style={{
                    maxWidth:  '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    filter: isHov ? palette.hoverFilter : palette.dimFilter,
                    transition: 'filter 0.35s ease',
                  }}
                />
              </div>

              {/* Тултип */}
              <div
                className="absolute left-1/2 pointer-events-none"
                style={{
                  top: '110%',
                  transform: 'translateX(-50%)',
                  opacity: isHov ? 1 : 0,
                  transition: 'opacity 0.25s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                <div className={`${palette.tipBg} text-[11px] font-medium px-3 py-1.5 rounded-lg tracking-wide relative`}>
                  {p.shortName}
                  <div
                    style={{
                      position: 'absolute',
                      top: '-5px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 0, height: 0,
                      borderLeft:  '5px solid transparent',
                      borderRight: '5px solid transparent',
                      borderBottom: `5px solid ${palette.tipArrow}`,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-[1cm] mt-6">
        <p className={`${palette.footNote} text-xs text-center tracking-[0.3em] uppercase font-mono`}>
          и многие другие
        </p>
      </div>
    </section>
  );
};

export default PartnersSection;
