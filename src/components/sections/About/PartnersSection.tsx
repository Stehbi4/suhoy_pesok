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

// Размеры логотипа по флагу. На мобильном уменьшаем ~в 2.5 раза,
// чтобы логотипы помещались в узкое поле и не наезжали друг на друга.
const SIZE_MAP_DESKTOP = { sm: 220, md: 290, lg: 370 };
const SIZE_MAP_MOBILE  = { sm: 75, md: 95, lg: 120 };

// Параметры орбиты: 3 ряда × 3 колонки
const ORBITS_DESKTOP = [
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

// На мобильном сжимаем x-диапазон (20..80) и снижаем амплитуду дрейфа,
// чтобы логотипы не вылезали за узкий экран.
const ORBITS_MOBILE = ORBITS_DESKTOP.map(o => ({
  ...o,
  x: 20 + (o.x - 15) * (60 / 70), // 15..85 → 20..80
  rx: Math.min(o.rx, 2),
  ry: Math.min(o.ry, 2),
}));

interface LogoState {
  x: number;  // px inside field
  y: number;
  vx: number; // px/frame
  vy: number;
  r: number;  // collision radius px
  impact: number; // scale multiplier, peaks on hit, relaxes to 1
  rot: number;    // current rotation (deg) — shakes on collision
  rotV: number;   // rotation velocity (deg/frame)
}

const PartnersSection = ({ theme = 'light' }: Props) => {
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined'
      ? window.matchMedia('(min-width: 1024px)').matches
      : true,
  );
  const ORBITS = isDesktop ? ORBITS_DESKTOP : ORBITS_MOBILE;
  const SIZE_MAP = isDesktop ? SIZE_MAP_DESKTOP : SIZE_MAP_MOBILE;

  const fieldRef = useRef<HTMLDivElement>(null);
  const statesRef = useRef<LogoState[]>([]);
  const [, forceTick] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const hoveredRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);

  // Mirror hover into a ref so the RAF loop can read it without re-subscribing.
  useEffect(() => { hoveredRef.current = hovered; }, [hovered]);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // (Re)initialize physics when field size or breakpoint changes.
  useEffect(() => {
    const el = fieldRef.current;
    if (!el) return;

    const init = () => {
      const { width: W, height: H } = el.getBoundingClientRect();
      if (W === 0 || H === 0) return;
      const speed = isDesktop ? 0.5 : 0.35; // px/frame, ~60fps → 20–30 px/s
      statesRef.current = partners.map((p, i) => {
        const size = SIZE_MAP[p.logoSize ?? 'md'];
        // Collision radius — ~42% of the box width, wide enough to cover
        // text-heavy logos (ROSATOM, NOVATEK, ТРАНСНЕФТЬ) without packing
        // so tightly that logos can never separate.
        const r = size * 0.42;
        const o = ORBITS[i];
        const angle = o.phase + i * 0.9;
        return {
          x: Math.min(W - r, Math.max(r, (o.x / 100) * W)),
          y: Math.min(H - r, Math.max(r, (o.y / 100) * H)),
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          r,
          impact: 1,
          rot: 0,
          rotV: 0,
        };
      });
      forceTick(t => t + 1);
    };

    init();
    const ro = new ResizeObserver(init);
    ro.observe(el);
    return () => ro.disconnect();
    // ORBITS and SIZE_MAP are derived from isDesktop (module-level consts).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDesktop]);

  // Physics loop — integrate, bounce off walls, resolve pair collisions.
  useEffect(() => {
    const el = fieldRef.current;
    if (!el) return;

    const animate = () => {
      const { width: W, height: H } = el.getBoundingClientRect();
      const states = statesRef.current;
      const hoverIdx = hoveredRef.current;

      for (let i = 0; i < states.length; i++) {
        const s = states[i];
        // Frozen while hovered — logo stays put for the user.
        if (i !== hoverIdx) {
          s.x += s.vx;
          s.y += s.vy;
        }
        // Impact decay (scale → 1)
        s.impact += (1 - s.impact) * 0.12;
        // Rotation spring — stiff pull to 0, strong damping so it swings
        // once or twice and snaps back.
        s.rotV += -s.rot * 0.22;
        s.rotV *= 0.80;
        s.rot  += s.rotV;
        // Hard clamp to keep logos visually upright.
        if (s.rot >  18) { s.rot =  18; s.rotV = 0; }
        if (s.rot < -18) { s.rot = -18; s.rotV = 0; }
      }

      // Walls — squash-scale bump + small rotation kick (capped)
      for (const s of states) {
        if (s.x - s.r < 0)       { s.x = s.r;     s.vx = Math.abs(s.vx);  s.impact = 1.35; s.rotV += 2.5; }
        else if (s.x + s.r > W)  { s.x = W - s.r; s.vx = -Math.abs(s.vx); s.impact = 1.35; s.rotV -= 2.5; }
        if (s.y - s.r < 0)       { s.y = s.r;     s.vy = Math.abs(s.vy);  s.impact = 1.35; s.rotV -= 2.5; }
        else if (s.y + s.r > H)  { s.y = H - s.r; s.vy = -Math.abs(s.vy); s.impact = 1.35; s.rotV += 2.5; }
      }

      // Pair collisions — 4 iterations so overlapping triads untangle in one
      // frame instead of drifting.
      for (let iter = 0; iter < 4; iter++) {
        for (let i = 0; i < states.length; i++) {
          for (let j = i + 1; j < states.length; j++) {
            const a = states[i], b = states[j];
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const dist = Math.hypot(dx, dy) || 0.0001;
            const minDist = a.r + b.r;
            if (dist < minDist) {
              const nx = dx / dist;
              const ny = dy / dist;
              const overlap = (minDist - dist) / 2;
              a.x -= nx * overlap;
              a.y -= ny * overlap;
              b.x += nx * overlap;
              b.y += ny * overlap;
              // Swap normal-component velocities only when approaching —
              // otherwise we'd reverse already-separating pairs → twitch.
              const avn = a.vx * nx + a.vy * ny;
              const bvn = b.vx * nx + b.vy * ny;
              if (iter === 0 && avn > bvn) {
                const diff = bvn - avn;
                a.vx += diff * nx;
                a.vy += diff * ny;
                b.vx -= diff * nx;
                b.vy -= diff * ny;
                // Visible impact: scale pop + perpendicular rotation kick.
                const hitStrength = Math.min(1, Math.abs(diff));
                a.impact = 1 + 0.45 * hitStrength;
                b.impact = 1 + 0.45 * hitStrength;
                // Torque — small rotational kick proportional to hit strength
                const kick = 4 * hitStrength;
                a.rotV -= ny * kick;
                b.rotV += ny * kick;
              }
            }
          }
        }
      }

      // Clamp positions inside field after multi-pair push-apart (a chain of
      // collisions can shove a logo past the wall).
      for (const s of states) {
        if (s.x - s.r < 0)      s.x = s.r;
        if (s.x + s.r > W)      s.x = W - s.r;
        if (s.y - s.r < 0)      s.y = s.r;
        if (s.y + s.r > H)      s.y = H - s.r;
      }

      forceTick(t => (t + 1) % 1_000_000);
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
        ref={fieldRef}
        className="relative w-full"
        style={{ height: '60vh', minHeight: 520 }}
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
          const s     = statesRef.current[i];
          if (!s) return null;
          const scale = (isHov ? 1.15 : 1) * s.impact;

          return (
            <div
              key={i}
              className="absolute"
              style={{
                left:      `${s.x}px`,
                top:       `${s.y}px`,
                transform: `translate(-50%, -50%) scale(${scale}) rotate(${s.rot}deg)`,
                zIndex:    isHov ? 10 : 1,
                willChange: 'transform, left, top',
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
