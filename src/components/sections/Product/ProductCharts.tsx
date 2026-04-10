import { useState } from 'react';
import { motion } from 'framer-motion';

export const CHEM_COLORS = [
  '#C8A558', // SiO₂  — warm golden
  '#6FA8B4', // Al₂O₃ — muted teal
  '#B5724A', // Fe₂O₃ — earthy sienna
  '#7A9E6E', // K₂O   — sage green
  '#9E8EC8', // Na₂O  — dusty violet
  '#B5A088', // CaO   — warm taupe
  '#7A96B8', // MgO   — slate blue
];

function polar(cx: number, cy: number, r: number, deg: number) {
  const a = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

export function sectorPath(cx: number, cy: number, r: number, a1: number, a2: number) {
  const s = polar(cx, cy, r, a1);
  const e = polar(cx, cy, r, a2);
  const large = a2 - a1 > 180 ? 1 : 0;
  return `M${cx},${cy} L${s.x.toFixed(2)},${s.y.toFixed(2)} A${r},${r},0,${large},1,${e.x.toFixed(2)},${e.y.toFixed(2)}Z`;
}

// ── ColorPieChart — muted-color donut with CSS 3D perspective tilt ─────────────
export const ColorPieChart = ({
  data,
  size = 440,
  fill = false,
  active: extActive,
  onActive: extOnActive,
}: {
  data: Record<string, number>;
  size?: number;
  fill?: boolean;
  active?: string | null;
  onActive?: (k: string | null) => void;
}) => {
  const [intActive, setIntActive] = useState<string | null>(null);
  const active   = extActive  !== undefined ? extActive  : intActive;
  const setActive = extOnActive ?? setIntActive;

  const cx = size / 2, cy = size / 2;
  const R  = size * 0.43;
  const IR = size * 0.22;

  const entries = Object.entries(data).filter(([, v]) => v > 0);
  const total   = entries.reduce((s, [, v]) => s + v, 0);
  if (!entries.length) return null;

  const sorted = [...entries].sort(([, a], [, b]) => b - a);
  const smallestSweepC = (sorted[sorted.length - 1][1] / total) * 360;
  let ang = -180 + smallestSweepC / 2;
  let cGi = 0, cRi = 0;
  const slices = sorted.map(([key, value]) => {
    const pct   = (value / total) * 100;
    const sweep = (pct / 100) * 360;
    const color = grainColor(pct, cGi, cRi);
    if (pct >= 10) cGi++; else cRi++;
    const start = ang; ang += sweep;
    return { key, value, pct, start, end: ang, color };
  });

  const vFS = size * 0.056;
  const lFS = size * 0.027;

  return (
    <div style={{
      position: 'relative',
      display: fill ? 'block' : 'inline-flex',
      width: fill ? '100%' : undefined,
      height: fill ? '100%' : undefined,
      alignItems: fill ? undefined : 'center',
      justifyContent: fill ? undefined : 'center',
    }}>
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0,
          transform: 'perspective(900px) rotateX(38deg) translateY(28px)',
          transformOrigin: '50% 62%',
          borderRadius: '50%',
          background: 'rgba(0,0,0,0.22)',
          filter: 'blur(32px)',
          pointerEvents: 'none',
        }}
      />
      <div style={{
        transform: 'perspective(900px) rotateX(38deg)',
        transformOrigin: '50% 62%',
        filter: 'drop-shadow(0 12px 32px rgba(0,0,0,0.28)) drop-shadow(0 4px 12px rgba(0,0,0,0.18))',
        ...(fill ? { width: '100%', height: '100%' } : {}),
      }}>
        <svg viewBox={`0 0 ${size} ${size}`} width={fill ? '100%' : size} height={fill ? '100%' : size} style={{ display: 'block', overflow: 'visible' }}>
          <defs>
            <filter id="chemTextGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          {slices.map(({ key, start, end, color }) => {
            const depth = 26;
            const s1 = polar(cx, cy, R, start);
            const e1 = polar(cx, cy, R, end);
            const s2 = { x: s1.x, y: s1.y + depth };
            const e2 = { x: e1.x, y: e1.y + depth };
            return (
              <path key={`side-${key}`}
                d={`M${s1.x},${s1.y} L${s2.x},${s2.y} L${e2.x},${e2.y} L${e1.x},${e1.y} Z`}
                fill={color}
                style={{ opacity: 0.6, pointerEvents: 'none' }}
              />
            );
          })}
          {slices.map(({ key, start, end, color }) => {
            const isOn = active === key;
            const midA = ((start + end) / 2 - 90) * (Math.PI / 180);
            const dx = isOn ? Math.cos(midA) * 16 : 0;
            const dy = isOn ? Math.sin(midA) * 16 : 0;
            return (
              <g key={key} style={{ cursor: 'pointer' }}
                onMouseEnter={() => setActive(key)}
                onMouseLeave={() => setActive(null)}
              >
                <motion.path
                  d={sectorPath(cx, cy, R, start, end)}
                  fill={color}
                  stroke="rgba(255,255,255,0.85)"
                  strokeWidth="1.5"
                  animate={{ x: dx, y: dy }}
                  transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                  style={{ opacity: active && !isOn ? 0.68 : 1, filter: isOn ? 'brightness(1.13)' : 'none' }}
                />
              </g>
            );
          })}
          <circle cx={cx} cy={cy} r={IR} fill="rgba(0,0,0,0.55)" />
          <circle cx={cx} cy={cy} r={IR} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
          {active ? (
            <>
              <text x={cx} y={cy + vFS * 0.35} textAnchor="middle" fill="white"
                fontSize={vFS} fontFamily="ui-monospace,monospace" fontWeight="800"
                filter="url(#chemTextGlow)">
                {slices.find(s => s.key === active)?.value}%
              </text>
              <text x={cx} y={cy + vFS * 0.35 + lFS * 1.4} textAnchor="middle" fill="white"
                fontSize={lFS * 1.1} fontFamily="ui-monospace,monospace" fontWeight="600"
                filter="url(#chemTextGlow)">
                {active}
              </text>
            </>
          ) : (
            <text x={cx} y={cy + lFS * 0.5} textAnchor="middle" fill="white"
              fontSize={lFS * 1.1} fontFamily="ui-monospace,monospace" fontWeight="600"
              filter="url(#chemTextGlow)">
              хим. состав
            </text>
          )}
        </svg>
      </div>
    </div>
  );
};

// Graphite shades (≥10%) and red shades (<10%) for granulometry sectors
const GRAIN_GREY = ['#1a1a1a', '#2e2e2e', '#424242', '#595959', '#6e6e6e'];
const GRAIN_RED  = ['#c41a1a', '#e03535', '#f04848', '#ff5c5c', '#ff7575'];

export function grainColor(pct: number, greyIdx: number, redIdx: number): string {
  return pct >= 10
    ? GRAIN_GREY[greyIdx % GRAIN_GREY.length]
    : GRAIN_RED[redIdx  % GRAIN_RED.length];
}

// ── SandPieChart — infographic style, same 3D tilt as ColorPieChart ─────────────
export const SandPieChart = ({
  data,
  sandSrc: _sandSrc,  // kept for API compat, no longer used
  size = 320,
  active: extActive,
  onActive: extOnActive,
}: {
  data: Record<string, number>;
  sandSrc?: string;
  size?: number;
  active?: string | null;
  onActive?: (k: string | null) => void;
}) => {
  const [intActive, setIntActive] = useState<string | null>(null);
  const active    = extActive  !== undefined ? extActive  : intActive;
  const setActive = extOnActive ?? setIntActive;

  const cx = size / 2, cy = size / 2;
  const R  = size * 0.43;
  const IR = size * 0.22;

  const entries = Object.entries(data).filter(([, v]) => v > 0);
  const total   = entries.reduce((s, [, v]) => s + v, 0);
  if (!entries.length) return null;

  // Sort largest → smallest so big graphite sectors sit at top
  const sorted = [...entries].sort(([, a], [, b]) => b - a);
  const smallestSweep = (sorted[sorted.length - 1][1] / total) * 360;
  let ang = -180 + smallestSweep / 2;
  let greyIdx = 0, redIdx = 0;
  const slices = sorted.map(([key, value]) => {
    const pct   = (value / total) * 100;
    const sweep = (pct / 100) * 360;
    const color = grainColor(pct, greyIdx, redIdx);
    if (pct >= 10) greyIdx++; else redIdx++;
    const start = ang; ang += sweep;
    return { key, value, pct, start, end: ang, color };
  });

  const vFS = size * 0.056;
  const lFS = size * 0.027;

  return (
    <div style={{
      position: 'relative',
      display: 'inline-flex',
      width: '100%', height: '100%',
      alignItems: 'center', justifyContent: 'center',
    }}>
      {/* Shadow disc */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0,
        transform: 'perspective(900px) rotateX(38deg) translateY(28px)',
        transformOrigin: '50% 62%',
        borderRadius: '50%',
        background: 'rgba(0,0,0,0.22)',
        filter: 'blur(32px)',
        pointerEvents: 'none',
      }} />

      {/* Tilted pie */}
      <div style={{
        width: '100%', height: '100%',
        transform: 'perspective(900px) rotateX(38deg)',
        transformOrigin: '50% 62%',
        filter: 'drop-shadow(0 12px 32px rgba(0,0,0,0.28)) drop-shadow(0 4px 12px rgba(0,0,0,0.18))',
      }}>
        <svg viewBox={`0 0 ${size} ${size}`} width="100%" height="100%" style={{ display: 'block', overflow: 'visible' }}>
          <defs>
            <filter id="grainTextGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Extrusion side faces */}
          {slices.map(({ key, start, end, color }) => {
            const depth = 26;
            const s1 = polar(cx, cy, R, start);
            const e1 = polar(cx, cy, R, end);
            const s2 = { x: s1.x, y: s1.y + depth };
            const e2 = { x: e1.x, y: e1.y + depth };
            return (
              <path key={`side-${key}`}
                d={`M${s1.x},${s1.y} L${s2.x},${s2.y} L${e2.x},${e2.y} L${e1.x},${e1.y} Z`}
                fill={color}
                style={{ opacity: 0.55, pointerEvents: 'none' }}
              />
            );
          })}

          {/* Top face sectors */}
          {slices.map(({ key, start, end, color }) => {
            const isOn = active === key;
            const midA = ((start + end) / 2 - 90) * (Math.PI / 180);
            const dx   = isOn ? Math.cos(midA) * 16 : 0;
            const dy   = isOn ? Math.sin(midA) * 16 : 0;
            return (
              <g key={key} style={{ cursor: 'pointer' }}
                onMouseEnter={() => setActive(key)}
                onMouseLeave={() => setActive(null)}
              >
                <motion.path
                  d={sectorPath(cx, cy, R, start, end)}
                  fill={color}
                  stroke="rgba(255,255,255,0.55)"
                  strokeWidth="1.5"
                  animate={{ x: dx, y: dy }}
                  transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                  style={{ opacity: active && !isOn ? 0.55 : 1, filter: isOn ? 'brightness(1.18)' : 'none' }}
                />
              </g>
            );
          })}

          {/* Donut hole */}
          <circle cx={cx} cy={cy} r={IR} fill="rgba(0,0,0,0.60)" />
          <circle cx={cx} cy={cy} r={IR} fill="none" stroke="rgba(255,255,255,0.20)" strokeWidth="2" />

          {/* Center text */}
          {active ? (
            <>
              <text x={cx} y={cy + vFS * 0.35} textAnchor="middle" fill="white"
                fontSize={vFS} fontFamily="ui-monospace,monospace" fontWeight="800"
                filter="url(#grainTextGlow)">
                {slices.find(s => s.key === active)?.value}%
              </text>
              <text x={cx} y={cy + vFS * 0.35 + lFS * 1.4} textAnchor="middle" fill="white"
                fontSize={lFS * 1.1} fontFamily="ui-monospace,monospace" fontWeight="600"
                filter="url(#grainTextGlow)">
                {active}
              </text>
            </>
          ) : (
            <text x={cx} y={cy + lFS * 0.5} textAnchor="middle" fill="white"
              fontSize={lFS * 1.1} fontFamily="ui-monospace,monospace" fontWeight="600"
              filter="url(#grainTextGlow)">
              гран. состав
            </text>
          )}
        </svg>
      </div>
    </div>
  );
};
