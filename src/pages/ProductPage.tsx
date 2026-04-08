import { useState, useMemo, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, ArrowUpRight, Download, Droplets, Circle, Wind,
  Copy, Check, Truck, Package, X,
  ChevronLeft, ChevronRight, ZoomIn, ArrowDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { products, articles } from '@/data/articles';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { BG_PAGE, BG_ALT, TEXT_DARK, RED, BG_DARK } from '@/styles/theme';

// Muted, sophisticated palette for chemical element sectors
const CHEM_COLORS = [
  '#C8A558', // SiO₂  — warm golden
  '#6FA8B4', // Al₂O₃ — muted teal
  '#B5724A', // Fe₂O₃ — earthy sienna
  '#7A9E6E', // K₂O   — sage green
  '#9E8EC8', // Na₂O  — dusty violet
  '#B5A088', // CaO   — warm taupe
  '#7A96B8', // MgO   — slate blue
];

// ── helpers ───────────────────────────────────────────────────────────────────
function polar(cx: number, cy: number, r: number, deg: number) {
  const a = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}
function sectorPath(cx: number, cy: number, r: number, a1: number, a2: number) {
  const s = polar(cx, cy, r, a1);
  const e = polar(cx, cy, r, a2);
  const large = a2 - a1 > 180 ? 1 : 0;
  return `M${cx},${cy} L${s.x.toFixed(2)},${s.y.toFixed(2)} A${r},${r},0,${large},1,${e.x.toFixed(2)},${e.y.toFixed(2)}Z`;
}

// Match application area to article by Russian keywords
function matchAreaToArticle(area: string) {
  const clean = area.toLowerCase().replace(/^для\s+/i, '');
  const words = clean.split(/[\s/]+/).filter(w => w.length > 4);
  return articles.find(art => {
    const t = art.title.toLowerCase();
    return words.some(w => t.includes(w));
  }) ?? null;
}

// ── ColorPieChart — muted-color donut with CSS 3D perspective tilt ───────────
const ColorPieChart = ({
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
  const active  = extActive  !== undefined ? extActive  : intActive;
  const setActive = extOnActive ?? setIntActive;

  const cx = size / 2, cy = size / 2;
  const R  = size * 0.43;
  const IR = size * 0.22;

  const entries = Object.entries(data).filter(([, v]) => v > 0);
  const total   = entries.reduce((s, [, v]) => s + v, 0);
  if (!entries.length) return null;

  // Largest sectors at top, smallest at bottom (perspective tilt makes bottom appear wider)
  const sorted = [...entries].sort(([, a], [, b]) => b - a);
  const smallestSweepC = (sorted[sorted.length - 1][1] / total) * 360;
  let ang = -180 + smallestSweepC / 2;
  const slices = sorted.map(([key, value], idx) => {
    const pct   = (value / total) * 100;
    const sweep = (pct / 100) * 360;
    const start = ang; ang += sweep;
    return { key, value, pct, start, end: ang, color: CHEM_COLORS[idx % CHEM_COLORS.length] };
  });

  const vFS = size * 0.056;   // value font size
  const lFS = size * 0.027;   // label font size

  return (
    <div style={{
      position: 'relative',
      display: fill ? 'block' : 'inline-flex',
      width: fill ? '100%' : undefined,
      height: fill ? '100%' : undefined,
      alignItems: fill ? undefined : 'center',
      justifyContent: fill ? undefined : 'center',
    }}>
      {/* Depth "shadow" disc — gives thickness illusion */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          transform: 'perspective(900px) rotateX(38deg) translateY(28px)',
          transformOrigin: '50% 62%',
          borderRadius: '50%',
          background: 'rgba(0,0,0,0.22)',
          filter: 'blur(32px)',
          pointerEvents: 'none',
        }}
      />

      {/* Main tilted pie */}
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
          {/* Extrusion "side" faces — drawn first (behind top face) */}
          {slices.map(({ key, start, end, color }) => {
            const depth = 26; // px extrusion depth in SVG space
            const s1 = polar(cx, cy, R, start);
            const e1 = polar(cx, cy, R, end);
            const s2 = { x: s1.x, y: s1.y + depth };
            const e2 = { x: e1.x, y: e1.y + depth };
            // Simple side trapezoid: top-arc-edge approximated as two straight lines
            const sidePath = `M${s1.x},${s1.y} L${s2.x},${s2.y} L${e2.x},${e2.y} L${e1.x},${e1.y} Z`;
            return (
              <path
                key={`side-${key}`}
                d={sidePath}
                fill={color}
                style={{ opacity: 0.6, pointerEvents: 'none' }}
              />
            );
          })}

          {/* Top face sectors */}
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
                  style={{
                    opacity: active && !isOn ? 0.68 : 1,
                    filter: isOn ? 'brightness(1.13)' : 'none',
                  }}
                />
              </g>
            );
          })}

          {/* Donut hole */}
          <circle cx={cx} cy={cy} r={IR} fill="rgba(0,0,0,0.55)" />
          <circle cx={cx} cy={cy} r={IR} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />

          {/* Center text */}
          {active ? (
            <>
              <text x={cx} y={cy + vFS * 0.35} textAnchor="middle"
                fill="white"
                fontSize={vFS} fontFamily="ui-monospace,monospace" fontWeight="800"
                filter="url(#chemTextGlow)">
                {slices.find(s => s.key === active)?.value}%
              </text>
              <text x={cx} y={cy + vFS * 0.35 + lFS * 1.4} textAnchor="middle"
                fill="white"
                fontSize={lFS * 1.1} fontFamily="ui-monospace,monospace" fontWeight="600"
                filter="url(#chemTextGlow)">
                {active}
              </text>
            </>
          ) : (
            <text x={cx} y={cy + lFS * 0.5} textAnchor="middle"
              fill="white"
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

// ── LiquidGlassCard — iOS 26 style, rainbow gradient border ──────────────────
const LiquidGlassCard = ({
  children,
  className = '',
  style,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}) => {
  const [pos, setPos] = useState({ x: 50, y: 50, on: false });
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        backgroundImage: [
          'linear-gradient(rgba(255,255,255,0.72),rgba(255,255,255,0.72))',
          'conic-gradient(from 135deg,#ff9a9e,#a18cd1,#a8edea,#fecfef,#fad0c4,#ff9a9e)',
        ].join(', '),
        backgroundClip: 'padding-box,border-box',
        backgroundOrigin: 'padding-box,border-box',
        WebkitBackgroundClip: 'padding-box,border-box',
        border: '1.5px solid transparent',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        boxShadow: pos.on
          ? '0 25px 50px -12px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.9), 0 0 0 1px rgba(248,0,0,0.25)'
          : '0 4px 32px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.9)',
        transform: pos.on ? 'translateY(-8px)' : 'translateY(0)',
        transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1), box-shadow 0.4s cubic-bezier(0.4,0,0.2,1)',
        ...style,
      }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setPos({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100, on: true });
      }}
      onMouseLeave={() => setPos(p => ({ ...p, on: false }))}
      onClick={onClick}
    >
      {/* Prismatic cursor specular */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${pos.x}% ${pos.y}%, rgba(168,100,255,0.10) 0%, rgba(100,200,255,0.08) 30%, rgba(255,100,150,0.05) 58%, transparent 78%)`,
          opacity: pos.on ? 1 : 0,
        }}
      />
      {children}
    </div>
  );
};

// ── LightCard — clean card for light sections ─────────────────────────────────
const LightCard = ({ children, className = '', style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) => (
  <div
    className={`relative overflow-hidden card-hover border border-black/[0.07] hover:border-brand-red/30 ${className}`}
    style={{
      background: 'rgba(255,255,255,0.88)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      boxShadow: '0 4px 40px rgba(0,0,0,0.06)',
      ...style,
    }}
  >
    {children}
  </div>
);

// ── SandPieChart ──────────────────────────────────────────────────────────────
// Renders ONLY the SVG. Pass active/onActive for controlled mode (legend outside).
const SandPieChart = ({
  data,
  sandSrc,
  size = 320,
  active: extActive,
  onActive: extOnActive,
}: {
  data: Record<string, number>;
  sandSrc: string;
  size?: number;
  active?: string | null;
  onActive?: (k: string | null) => void;
}) => {
  const [intActive, setIntActive] = useState<string | null>(null);
  const active = extActive !== undefined ? extActive : intActive;
  const setActive = extOnActive ?? setIntActive;

  const cx = size / 2, cy = size / 2;
  const R = size * 0.4375;
  const IR = size * 0.188;

  const entries = Object.entries(data).filter(([, v]) => v > 0);
  const total = entries.reduce((s, [, v]) => s + v, 0);
  if (!entries.length) return null;

  // Largest sectors at top, smallest at bottom — due to rotateX tilt the bottom
  // appears visually larger, compensating the smaller percentage.
  const sorted = [...entries].sort(([, a], [, b]) => b - a);
  const smallestSweep = (sorted[sorted.length - 1][1] / total) * 360;
  // Position the smallest sector centered at 180° (bottom of circle)
  let ang = -180 + smallestSweep / 2;
  const slices = sorted.map(([key, value]) => {
    const pct = (value / total) * 100;
    const sweep = (pct / 100) * 360;
    const start = ang; ang += sweep;
    return { key, value, pct, start, end: ang };
  });
  const maxPct = Math.max(...slices.map(sl => sl.pct));
  const patId = `sp-${size}`;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* 3D shadow disc */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          transform: 'perspective(1000px) rotateX(34deg) translateY(24px)',
          transformOrigin: '50% 63%',
          borderRadius: '50%',
          background: 'rgba(0,0,0,0.28)',
          filter: 'blur(38px)',
          pointerEvents: 'none',
        }}
      />
      {/* Tilted chart */}
      <div
        style={{
          width: '100%',
          height: '100%',
          transform: 'perspective(1000px) rotateX(34deg)',
          transformOrigin: '50% 63%',
          filter: 'drop-shadow(0 14px 40px rgba(0,0,0,0.22))',
        }}
      >
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full" style={{ overflow: 'visible' }}>
          <defs>
            <pattern id={patId} patternUnits="userSpaceOnUse" width={size} height={size}>
              <image href={sandSrc} x="0" y="0" width={size} height={size} preserveAspectRatio="xMidYMid slice" />
            </pattern>
            <filter id="textGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {slices.map(({ key, pct, start, end }) => {
            const isOn = active === key;
            const midA = ((start + end) / 2 - 90) * (Math.PI / 180);
            const dx = isOn ? Math.cos(midA) * size * 0.035 : 0;
            const dy = isOn ? Math.sin(midA) * size * 0.035 : 0;
            const darkness = (1 - pct / maxPct) * 0.6;
            return (
              <g key={key} style={{ cursor: 'pointer' }}
                onMouseEnter={() => setActive(key)}
                onMouseLeave={() => setActive(null)}
              >
                <motion.path
                  d={sectorPath(cx, cy, R, start, end)}
                  fill={`url(#${patId})`}
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="1"
                  animate={{ x: dx, y: dy }}
                  transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                />
                <motion.path
                  d={sectorPath(cx, cy, R, start, end)}
                  fill="#000"
                  style={{ pointerEvents: 'none' }}
                  animate={{ x: dx, y: dy, opacity: isOn ? darkness * 0.25 : darkness }}
                  transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                />
              </g>
            );
          })}

          <circle cx={cx} cy={cy} r={IR} fill={`url(#${patId})`} />
          <circle cx={cx} cy={cy} r={IR} fill="rgba(0,0,0,0.42)" />
          <circle cx={cx} cy={cy} r={IR} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />

          {active ? (
            <>
              <text x={cx} y={cy - size * 0.022} textAnchor="middle" fill="white"
                fontSize={size * 0.08} fontFamily="ui-monospace,monospace" fontWeight="800"
                filter="url(#textGlow)">
                {slices.find(sl => sl.key === active)?.value}%
              </text>
              <text x={cx} y={cy + size * 0.055} textAnchor="middle" fill="white"
                fontSize={size * 0.032} fontFamily="ui-monospace,monospace" fontWeight="600"
                filter="url(#textGlow)">
                {active}
              </text>
            </>
          ) : (
            <>
              <text x={cx} y={cy - size * 0.015} textAnchor="middle" fill="white"
                fontSize={size * 0.042} fontFamily="ui-monospace,monospace" fontWeight="700"
                filter="url(#textGlow)">гран.</text>
              <text x={cx} y={cy + size * 0.052} textAnchor="middle" fill="white"
                fontSize={size * 0.042} fontFamily="ui-monospace,monospace" fontWeight="700"
                filter="url(#textGlow)">состав</text>
            </>
          )}
        </svg>
      </div>
    </div>
  );
};

// ── ProductPage ───────────────────────────────────────────────────────────────
const ProductPage = () => {
  const { slug } = useParams();
  const product = products.find((p) => p.slug === slug);

  const [copiedRow, setCopiedRow]     = useState<string | null>(null);
  const [calcShape, setCalcShape]     = useState<'cylinder' | 'rectangle'>('cylinder');
  const [calcDiameter, setCalcDiameter] = useState('');
  const [calcWidth, setCalcWidth]     = useState('');
  const [calcLength, setCalcLength]   = useState('');
  const [calcHeight, setCalcHeight]   = useState('');
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [[cubeSlide, cubeDir], setCube] = useState<[number, number]>([0, 1]);
  const [rulerX, setRulerX]           = useState(50);
  const [hoveredArea, setHoveredArea] = useState<number | null>(null);
  const [gActive, setGActive]         = useState<string | null>(null); // granulometry
  const [cActive, setCActive]         = useState<string | null>(null); // chemical

  const galleryImages = useMemo(() => {
    if (!product) return [];
    return [...product.images.gallery.slice(0, 4), product.images.main];
  }, [product]);

  const closeLightbox = useCallback(() => setLightboxIdx(null), []);
  const prevLightbox  = useCallback(
    () => setLightboxIdx(i => i === null ? null : (i - 1 + galleryImages.length) % galleryImages.length),
    [galleryImages.length],
  );
  const nextLightbox  = useCallback(
    () => setLightboxIdx(i => i === null ? null : (i + 1) % galleryImages.length),
    [galleryImages.length],
  );

  useEffect(() => {
    if (lightboxIdx === null) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevLightbox();
      if (e.key === 'ArrowRight') nextLightbox();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [lightboxIdx, closeLightbox, prevLightbox, nextLightbox]);

  useEffect(() => {
    document.body.style.overflow = lightboxIdx !== null ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [lightboxIdx]);

  const calcResult = useMemo(() => {
    const h = parseFloat(calcHeight) || 0;
    let vol = 0;
    if (calcShape === 'cylinder') {
      const d = parseFloat(calcDiameter) || 0;
      vol = Math.PI * (d / 2) ** 2 * h;
    } else {
      vol = (parseFloat(calcWidth) || 0) * (parseFloat(calcLength) || 0) * h;
    }
    const tons = (vol * 1500) / 1000;
    return { volume: vol.toFixed(2), tons: tons.toFixed(2), bigbags: Math.ceil(tons) };
  }, [calcShape, calcDiameter, calcWidth, calcLength, calcHeight]);

  const changeCube = (next: number) => setCube([next, next > cubeSlide ? 1 : -1]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bg text-white text-3xl">
        Товар не найден
      </div>
    );
  }

  const img        = product.images;
  const sio2Value  = product.technicalData?.['Содержание оксида кремния (SiO₂), %, не менее'] || 85;
  const docPath    = `/doc_sand/Фракция ${product.fraction}.pdf`;
  const areas      = product.applicationAreas || [];
  const sandPngSrc = img.hero.replace(/\/[^/]+$/, '/black-sand-background-free-png.png');

  // Cube variants — true 3D face rotation (cube Y-axis spin illusion)
  const cubeVariants = {
    enter: (dir: number) => ({ rotateY: dir * 80, opacity: 0, filter: 'brightness(0.45)' }),
    center: { rotateY: 0, opacity: 1, filter: 'brightness(1)' },
    exit:  (dir: number) => ({ rotateY: dir * -80, opacity: 0, filter: 'brightness(0.45)' }),
  };
  const cubeTrans = { duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] as [number,number,number,number] };
  const slideLabels = ['Характеристики', 'Гранулометрия', 'Химический состав'];

  const handleCopyRow = (key: string, value: string | number) => {
    navigator.clipboard.writeText(`${key}: ${value}`);
    setCopiedRow(key);
    setTimeout(() => setCopiedRow(null), 2000);
  };

  // Sieve & chemical data for external legends
  const sieveEntries = Object.entries(product.sieveAnalysis || {}).filter(([, v]) => v > 0);
  const sieveTotal   = sieveEntries.reduce((s, [, v]) => s + v, 0);
  const chemEntries  = Object.entries(product.chemicalComposition || {});
  const chemTotal    = chemEntries.reduce((s, [, v]) => s + v, 0);

  return (
    <main className="overflow-x-hidden" style={{ background: BG_PAGE }}>

      {/* ═══════════════════════════════════════════════════════════════════════
          1. HERO  —  sand macro · badge · gradient to off-white · ruler
         ═══════════════════════════════════════════════════════════════════════ */}
      <section
        className="relative h-screen flex items-center justify-center overflow-hidden"
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setRulerX(((e.clientX - r.left) / r.width) * 100);
        }}
      >
        <img src={img.hero} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />

        {/* Gradient → off-white at bottom */}
        <div className="absolute bottom-0 left-0 right-0" style={{
          height: '42%',
          background: `linear-gradient(to bottom, transparent 0%, rgba(245,244,242,0.6) 55%, ${BG_PAGE} 100%)`,
        }} />

        {/* Badge */}
        <motion.div
          className="relative z-10 text-center"
          initial={{ y: 28, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.95, ease: 'easeOut' }}
        >
          <div
            className="inline-block px-10 sm:px-14 py-8 sm:py-10 rounded-3xl"
            style={{
              background: 'rgba(255,255,255,0.11)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.22)',
              boxShadow: '0 28px 72px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.24)',
            }}
          >
            <p className="text-white/55 text-[10px] uppercase tracking-[0.5em] mb-4">Кварцевый песок</p>
            <h1 className="text-[clamp(2.2rem,6.5vw,5rem)] font-bold tracking-tighter text-white leading-none drop-shadow-lg">
              {product.shortName}
            </h1>
            <p className="text-white/30 text-xs mt-4 font-mono tracking-widest">{product.gost}</p>
          </div>
          <div className="mx-16 h-3 rounded-full blur-xl opacity-50 -mt-1" style={{ background: 'rgba(0,0,0,0.8)' }} />
        </motion.div>

        {/* Floating CTA arrow */}
        <motion.div
          className="absolute z-20 bottom-14 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.7 }}
        >
          <span className="text-[10px] uppercase tracking-[0.4em] font-semibold" style={{ color: TEXT_DARK }}>Подробнее</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.9, ease: 'easeInOut' }}>
            <ArrowDown className="w-10 h-10" style={{ color: TEXT_DARK }} strokeWidth={1.5} />
          </motion.div>
        </motion.div>

        {/* Interactive ruler */}
        <div
          className="absolute bottom-0 left-0 right-0 z-30 cursor-crosshair overflow-hidden"
          style={{ height: 44, background: BG_DARK }}
        >
          <div aria-hidden className="absolute inset-0 pointer-events-none" style={{
            background: `radial-gradient(ellipse 24% 100% at ${rulerX}% 110%, rgba(255,255,255,0.30) 0%, transparent 100%)`,
          }} />
          <div className="absolute bottom-0 left-0 right-0 flex h-full items-end pb-1.5 px-1">
            {Array.from({ length: 100 }, (_, i) => (
              <div key={i} className="flex-1 flex justify-center items-end">
                <div style={{
                  width: 1,
                  height: i % 10 === 0 ? 18 : i % 5 === 0 ? 11 : 5,
                  background: `rgba(255,255,255,${i % 10 === 0 ? 0.46 : i % 5 === 0 ? 0.23 : 0.11})`,
                }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          2. GLASS CARDS  —  light bg · iOS 26 LiquidGlass · dark text
         ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 lg:py-32" style={{ background: BG_PAGE }}>
        <div className="px-6 sm:px-10 lg:px-[1cm]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

            {/* Left */}
            <div>
              <ScrollReveal type="slide-left">
                <p className="text-[10px] uppercase tracking-[0.35em] text-gray-400 mb-5">О материале</p>
                <p className="text-2xl lg:text-3xl leading-relaxed" style={{ color: TEXT_DARK }}>
                  {product.description}
                </p>
              </ScrollReveal>

              <ScrollReveal type="fade-up" delay={0.1} className="mt-20">
                <p className="text-[10px] uppercase tracking-[0.35em] text-gray-400 mb-6">Краткие характеристики</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { Icon: Droplets, title: `≥ ${sio2Value}% SiO₂`, desc: 'Высокое содержание диоксида кремния' },
                    { Icon: Circle,   title: 'Окатанное зерно',       desc: 'Минимальное сопротивление потоку' },
                    { Icon: Wind,     title: 'Влажность ≤ 0,5%',      desc: 'Сухой для любых задач' },
                  ].map(({ Icon, title, desc }) => (
                    <LiquidGlassCard key={title} className="rounded-2xl p-7">
                      <Icon className="w-6 h-6 mb-5" style={{ color: TEXT_DARK, opacity: 0.5 }} />
                      <h3 className="text-lg font-semibold mb-2" style={{ color: TEXT_DARK }}>{title}</h3>
                      <p className="text-sm leading-snug text-gray-500">{desc}</p>
                    </LiquidGlassCard>
                  ))}
                </div>
              </ScrollReveal>

              <ScrollReveal type="fade-up" delay={0.2} className="mt-14">
                <p className="text-[10px] uppercase tracking-[0.35em] text-gray-400 mb-5">Спецификация</p>
                <a href={docPath} download
                  className="inline-flex items-center gap-3 text-white px-8 py-4 rounded-xl font-semibold tracking-wide transition-colors"
                  style={{ background: RED }}
                >
                  <Download className="w-5 h-5" />
                  Скачать PDF
                </a>
              </ScrollReveal>
            </div>

            {/* Right — sticky gallery */}
            <div className="flex gap-4 h-[85vh] sticky top-[1cm]">
              <div className="flex flex-col gap-4 flex-shrink-0">
                {img.gallery.slice(0, 4).map((src, i) => (
                  <div key={i} className="relative group cursor-zoom-in flex-shrink-0" onClick={() => setLightboxIdx(i)}>
                    <img src={src} alt={`${product.shortName} — вид ${i + 1}`}
                      className="w-[120px] h-[140px] object-cover rounded-2xl transition-opacity duration-300 group-hover:opacity-65"
                      style={{ border: '1px solid rgba(0,0,0,0.08)' }}
                    />
                    <ZoomIn className="absolute top-2 right-2 w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
              <div className="relative flex-1 h-full cursor-zoom-in group" onClick={() => setLightboxIdx(4)}>
                <img src={img.main} alt={product.name}
                  className="w-full h-full object-cover rounded-3xl transition-opacity duration-300 group-hover:opacity-90"
                />
                <ZoomIn className="absolute top-4 right-4 w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          3. DATA CUBE  —  cube-face rotation · ghost titles · infographic
         ═══════════════════════════════════════════════════════════════════════ */}
      <section style={{ background: BG_ALT, overflow: 'hidden', position: 'relative' }}>

        {/* ── Arrows — vertically centered in the full section ── */}
        <motion.button
          whileHover={{ scale: 1.13 }} whileTap={{ scale: 0.92 }}
          onClick={() => changeCube((cubeSlide - 1 + 3) % 3)}
          style={{
            position: 'absolute', left: '1.5rem', top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 30, width: 62, height: 62,
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.07)',
            border: '1.5px solid rgba(0,0,0,0.14)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <ChevronLeft className="w-9 h-9" style={{ color: TEXT_DARK }} strokeWidth={1.8} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.13 }} whileTap={{ scale: 0.92 }}
          onClick={() => changeCube((cubeSlide + 1) % 3)}
          style={{
            position: 'absolute', right: '1.5rem', top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 30, width: 62, height: 62,
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.07)',
            border: '1.5px solid rgba(0,0,0,0.14)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <ChevronRight className="w-9 h-9" style={{ color: TEXT_DARK }} strokeWidth={1.8} />
        </motion.button>

        {/* ── Title row: title at 1cm left · ghost-right fades out ── */}
        <div
          style={{
            paddingTop: '2.5rem', paddingBottom: '1rem',
            paddingLeft: '1cm', paddingRight: '7rem',
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Current title */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.h2
              key={`title-${cubeSlide}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.32, ease: 'easeOut' }}
              className="text-4xl lg:text-5xl font-light tracking-tighter select-none"
              style={{ color: TEXT_DARK, flexShrink: 0, whiteSpace: 'nowrap' }}
            >
              {slideLabels[cubeSlide]}
            </motion.h2>
          </AnimatePresence>

          {/* Gap between title and ghost */}
          <div style={{ flexShrink: 0, width: 100 }} />

          {/* Ghost right — next slide, fades out to the right */}
          <button
            onClick={() => changeCube((cubeSlide + 1) % 3)}
            style={{
              flexShrink: 0, width: 200, overflow: 'hidden',
              textAlign: 'left',
              background: 'none', border: 'none', cursor: 'pointer',
              WebkitMaskImage: 'linear-gradient(to right, black 0%, transparent 100%)',
              maskImage: 'linear-gradient(to right, black 0%, transparent 100%)',
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={`gr-${cubeSlide}`}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="text-4xl lg:text-5xl font-light tracking-tighter whitespace-nowrap"
                style={{ color: TEXT_DARK, opacity: 0.4 }}
              >
                {slideLabels[(cubeSlide + 1) % 3]}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>

        {/* ── Cube viewport — perspective parent ── */}
        <div
          className="flex justify-center"
          style={{ perspective: '2400px', perspectiveOrigin: '50% 38%', paddingBottom: '1.5rem' }}
        >
          <div style={{ width: '90vw', maxWidth: 1440, position: 'relative' }}>
            <AnimatePresence custom={cubeDir} mode="wait" initial={false}>
              <motion.div
                key={cubeSlide}
                custom={cubeDir}
                variants={cubeVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={cubeTrans}
                style={{
                  transformPerspective: 2400,
                  transformOrigin: 'center center',
                  willChange: 'transform, opacity, filter',
                }}
              >

                {/* ── SLIDE 0: Characteristics table — 75% width ── */}
                {cubeSlide === 0 && (
                  <div className="flex flex-col items-center py-10">
                    <LightCard className="rounded-3xl p-8 lg:p-10" style={{ width: '75%' }}>
                      <p className="text-sm uppercase tracking-[0.35em] text-gray-400 mb-8 text-center">
                        Физико-механические свойства
                      </p>
                      <div className="divide-y divide-black/5">
                        {Object.entries(product.technicalData || {}).map(([key, value]) => (
                          <div
                            key={key}
                            className="flex items-center justify-between py-4 -mx-4 px-4 rounded-lg hover:bg-black/[0.025] transition-colors cursor-pointer group"
                            onClick={() => handleCopyRow(key, String(value))}
                          >
                            <span className="text-gray-500 text-xl pr-6 leading-snug">{key}</span>
                            <div className="flex items-center gap-3 flex-shrink-0">
                              <span className="font-mono text-2xl font-medium" style={{ color: TEXT_DARK }}>{String(value)}</span>
                              {copiedRow === key
                                ? <Check className="w-5 h-5 text-green-600" />
                                : <Copy className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                              }
                            </div>
                          </div>
                        ))}
                        <div className="flex items-center justify-between py-4">
                          <span className="text-gray-500 text-xl">Стандарт</span>
                          <span className="font-mono text-xl font-medium" style={{ color: RED }}>{product.gost}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-400 mt-6 text-center">Нажмите на строку, чтобы скопировать</p>
                    </LightCard>
                  </div>
                )}

                {/* ── SLIDE 1: Granulometry — 85vh, left offset, legend top-right ── */}
                {cubeSlide === 1 && (
                  <>
                    {/* Mobile (< md): chart + legend stacked */}
                    <div className="flex flex-col gap-4 md:hidden">
                      <div style={{ width: '100%', aspectRatio: '1 / 1', overflow: 'hidden' }}>
                        <SandPieChart
                          data={product.sieveAnalysis || {}}
                          sandSrc="/sand-macro.jpg"
                          size={340}
                          active={gActive}
                          onActive={setGActive}
                        />
                      </div>
                      <div className="rounded-2xl p-4" style={{
                        background: 'rgba(237,236,234,0.92)',
                        border: '1px solid rgba(0,0,0,0.07)',
                      }}>
                        <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-2">Остатки на ситах, %</p>
                        {sieveEntries.map(([key, value]) => {
                          const pct = (value / sieveTotal) * 100;
                          return (
                            <div key={key} className="flex items-center gap-2 py-1.5"
                              style={{ opacity: gActive && gActive !== key ? 0.35 : 1, transition: 'opacity 0.2s' }}
                              onMouseEnter={() => setGActive(key)} onMouseLeave={() => setGActive(null)}
                            >
                              <div className="w-3 h-3 rounded-full flex-shrink-0"
                                style={{ background: gActive === key ? RED : `hsl(${35 + pct * 0.3},58%,${42 + pct * 0.25}%)` }} />
                              <span className="font-mono text-xs text-gray-600 flex-1">{key}</span>
                              <span className="font-mono text-base font-bold" style={{ color: TEXT_DARK }}>{value}%</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Desktop (md+): overlay layout */}
                    <div className="hidden md:block relative" style={{ height: '94vh', minHeight: 580 }}>
                      <div style={{
                        position: 'absolute', left: '3%', top: '50%',
                        transform: 'translateY(-50%)',
                        height: 'min(94vh, 92vw)', width: 'min(94vh, 92vw)', maxWidth: '78vw',
                      }}>
                        <SandPieChart
                          data={product.sieveAnalysis || {}}
                          sandSrc="/sand-macro.jpg"
                          size={760}
                          active={gActive}
                          onActive={setGActive}
                        />
                      </div>
                      <div className="absolute flex flex-col gap-3 rounded-2xl p-5" style={{
                        top: 0, right: 0, width: 250,
                        background: 'rgba(237,236,234,0.85)',
                        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                        border: '1px solid rgba(0,0,0,0.07)',
                        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                      }}>
                        <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-0.5">Остатки на ситах, %</p>
                        {sieveEntries.map(([key, value]) => {
                          const pct = (value / sieveTotal) * 100;
                          return (
                            <div key={key} className="flex items-center gap-3 cursor-pointer"
                              style={{ opacity: gActive && gActive !== key ? 0.35 : 1, transition: 'opacity 0.2s' }}
                              onMouseEnter={() => setGActive(key)} onMouseLeave={() => setGActive(null)}
                            >
                              <div className="w-4 h-4 rounded-full flex-shrink-0"
                                style={{ background: gActive === key ? RED : `hsl(${35 + pct * 0.3},58%,${42 + pct * 0.25}%)` }} />
                              <span className="font-mono text-sm text-gray-600 flex-1">{key}</span>
                              <span className="font-mono text-lg font-bold" style={{ color: TEXT_DARK }}>{value}%</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}

                {/* ── SLIDE 2: Chemical — same size/position as granulometry ── */}
                {cubeSlide === 2 && (
                  <>
                    {/* Mobile (< md): chart + legend stacked */}
                    <div className="flex flex-col gap-4 md:hidden">
                      <div style={{ width: '100%', aspectRatio: '1 / 1', overflow: 'hidden' }}>
                        <ColorPieChart
                          data={product.chemicalComposition || {}}
                          size={340}
                          fill={true}
                          active={cActive}
                          onActive={setCActive}
                        />
                      </div>
                      <div className="rounded-2xl p-4" style={{
                        background: 'rgba(237,236,234,0.92)',
                        border: '1px solid rgba(0,0,0,0.07)',
                      }}>
                        <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-2">Оксиды, %</p>
                        {chemEntries.map(([el, pct], idx) => {
                          const color = CHEM_COLORS[idx % CHEM_COLORS.length];
                          const isOn = cActive === el;
                          return (
                            <div key={el} className="flex items-center gap-2 py-1.5 cursor-pointer"
                              style={{ opacity: cActive && !isOn ? 0.35 : 1, transition: 'opacity 0.2s' }}
                              onMouseEnter={() => setCActive(el)} onMouseLeave={() => setCActive(null)}
                            >
                              <div className="flex-shrink-0 rounded" style={{
                                width: 12, height: 12, background: color,
                                boxShadow: isOn ? `0 0 8px ${color}cc` : 'none',
                                transition: 'box-shadow 0.2s',
                              }} />
                              <span className="font-mono text-xs flex-1" style={{ color: 'rgba(0,0,0,0.55)', fontWeight: isOn ? 600 : 400 }}>
                                {el}
                              </span>
                              <span className="font-mono text-base font-bold" style={{ color: isOn ? color : TEXT_DARK }}>
                                {pct}%
                              </span>
                            </div>
                          );
                        })}
                        <div className="mt-2 pt-2" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] text-gray-400 uppercase tracking-widest">Сумма</span>
                            <span className="font-mono text-sm font-semibold" style={{ color: TEXT_DARK }}>{chemTotal.toFixed(1)}%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Desktop (md+): overlay layout */}
                    <div className="hidden md:block relative" style={{ height: '94vh', minHeight: 580 }}>
                      <div style={{
                        position: 'absolute', left: '3%', top: '50%',
                        transform: 'translateY(-50%)',
                        height: 'min(94vh, 92vw)', width: 'min(94vh, 92vw)', maxWidth: '78vw',
                      }}>
                        <ColorPieChart
                          data={product.chemicalComposition || {}}
                          size={760}
                          fill={true}
                          active={cActive}
                          onActive={setCActive}
                        />
                      </div>
                      <div className="absolute flex flex-col gap-3 rounded-2xl p-5" style={{
                        top: 0, right: 0, width: 250,
                        background: 'rgba(237,236,234,0.85)',
                        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                        border: '1px solid rgba(0,0,0,0.07)',
                        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                      }}>
                        <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-0.5">Оксиды, %</p>
                        {chemEntries.map(([el, pct], idx) => {
                          const color = CHEM_COLORS[idx % CHEM_COLORS.length];
                          const isOn = cActive === el;
                          return (
                            <div key={el} className="flex items-center gap-3 cursor-pointer"
                              style={{ opacity: cActive && !isOn ? 0.35 : 1, transition: 'opacity 0.2s' }}
                              onMouseEnter={() => setCActive(el)} onMouseLeave={() => setCActive(null)}
                            >
                              <div className="flex-shrink-0 rounded" style={{
                                width: 16, height: 16, background: color,
                                boxShadow: isOn ? `0 0 10px ${color}cc` : 'none',
                                transition: 'box-shadow 0.2s',
                              }} />
                              <span className="font-mono text-sm flex-1" style={{ color: 'rgba(0,0,0,0.55)', fontWeight: isOn ? 600 : 400 }}>
                                {el}
                              </span>
                              <span className="font-mono text-lg font-bold" style={{ color: isOn ? color : TEXT_DARK }}>
                                {pct}%
                              </span>
                            </div>
                          );
                        })}
                        <div className="mt-1 pt-3" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-400 uppercase tracking-widest">Сумма</span>
                            <span className="font-mono text-base font-semibold" style={{ color: TEXT_DARK }}>{chemTotal.toFixed(1)}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          4. DUNE SECTION  —  PNG full screen, text on transparent top
         ═══════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ minHeight: '100vh', background: BG_ALT }}>
        {/* Sand PNG: pressed to bottom, fills full height. Transparent top = white bg shows */}
        <img
          src={sandPngSrc}
          alt=""
          className="absolute bottom-0 left-0 w-full h-full pointer-events-none"
          style={{ objectFit: 'cover', objectPosition: 'bottom' }}
          onError={(e) => { e.currentTarget.src = img.bg || img.hero; }}
        />

        {/* 100px gradient transparent → TEXT_DARK at very bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{ height: 100, background: `linear-gradient(to bottom, transparent, ${TEXT_DARK})` }}
        />

        {/* Text in upper area (on transparent part of PNG) */}
        <div className="relative z-10 px-6 sm:px-10 lg:px-[1cm] pt-36 lg:pt-44 pb-16 overflow-hidden">
          <h2
            className="font-bold tracking-tighter leading-[1.05] flex flex-col gap-1"
            style={{ fontSize: 'clamp(2.5rem, 9.375vw, 4.6875rem)', color: TEXT_DARK }}
          >
            <ScrollReveal type="slide-left" inline className="self-start">
              Самый <span style={{ color: RED, fontSize: '1.22em' }}>популярный</span>
            </ScrollReveal>
            <ScrollReveal type="slide-right" delay={0.1} inline className="self-end">
              для {product.popularSphere}
            </ScrollReveal>
          </h2>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          5. APPLICATIONS  —  article images · links from data/
         ═══════════════════════════════════════════════════════════════════════ */}
      <section style={{ background: TEXT_DARK }}>
        <div className="px-6 sm:px-10 lg:px-[1cm] pt-24 pb-14">
          <ScrollReveal type="fade-up">
            <h2 className="text-4xl lg:text-5xl font-light tracking-tighter text-white">Области применения</h2>
          </ScrollReveal>
        </div>

        <div className="overflow-hidden" style={{ height: '85vh', display: 'flex' }}>
          {areas.map((area, i) => {
            const art = matchAreaToArticle(area);
            const bgSrc = art?.image ?? galleryImages[i % galleryImages.length];
            const href  = art ? `/articles/${art.slug}` : undefined;
            const isHov = hoveredArea === i;

            const inner = (
              <div
                className="relative overflow-hidden w-full h-full"
                style={{
                  transform: 'skewX(-4deg)',
                  marginLeft: i === 0 ? 0 : -28,
                  zIndex: isHov ? areas.length + 1 : areas.length - i,
                  flex: isHov ? '2.2 0 0' : '1 0 0',
                  transition: 'flex 0.5s cubic-bezier(0.25,0.46,0.45,0.94)',
                }}
                onMouseEnter={() => setHoveredArea(i)}
                onMouseLeave={() => setHoveredArea(null)}
              >
                <img
                  src={bgSrc}
                  alt={area}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700"
                  style={{ transform: `skewX(4deg) scale(${isHov ? 1.07 : 1.13})`, transformOrigin: '50% 50%' }}
                />
                <div className="absolute inset-0" style={{
                  background: `linear-gradient(to top, rgba(0,0,0,${isHov ? 0.72 : 0.88}) 0%, rgba(0,0,0,0.08) 55%, transparent 100%)`,
                  transition: 'background 0.4s',
                }} />
                <div className="absolute bottom-8 left-6 right-6" style={{ transform: 'skewX(4deg)' }}>
                  <span className="font-mono text-[10px] text-white/30 block">{String(i + 1).padStart(2, '0')}</span>
                  <p className="text-white text-sm font-light leading-snug mt-1.5">{area}</p>
                  {art && (
                    <p className="text-white/40 text-xs mt-1 font-mono truncate">{art.title}</p>
                  )}
                </div>
              </div>
            );

            return href ? (
              <Link key={i} to={href} className="contents" style={{ display: 'contents', flex: isHov ? '2.2 0 0' : '1 0 0', transition: 'flex 0.5s cubic-bezier(0.25,0.46,0.45,0.94)' }}>
                {inner}
              </Link>
            ) : (
              <div key={i} style={{ display: 'contents', flex: isHov ? '2.2 0 0' : '1 0 0' }}>{inner}</div>
            );
          })}
        </div>
        <div className="pb-24" />
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          6. CALCULATOR  —  off-white · graphite palette
         ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-24" style={{ background: BG_PAGE }}>
        <div className="px-6 sm:px-10 lg:px-[1cm]">
          <ScrollReveal type="fade-up">
            <h2 className="text-4xl font-bold tracking-tighter" style={{ color: TEXT_DARK }}>Смарт-калькулятор</h2>
            <p className="text-gray-400 mt-3 text-sm">Рассчитайте необходимое количество материала</p>
          </ScrollReveal>

          <ScrollReveal type="fade-up" delay={0.1} className="mt-12 grid lg:grid-cols-2 gap-12">
            <div className="space-y-7">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-gray-400 mb-3 block">Форма фильтра</label>
                <div className="flex gap-3">
                  {(['cylinder', 'rectangle'] as const).map((shape) => (
                    <button key={shape} onClick={() => setCalcShape(shape)}
                      className="flex-1 py-3.5 rounded-xl font-medium tracking-wide text-sm transition-all duration-300"
                      style={{
                        background: calcShape === shape ? TEXT_DARK : 'rgba(0,0,0,0.06)',
                        color: calcShape === shape ? 'white' : '#888',
                      }}
                    >
                      {shape === 'cylinder' ? 'Цилиндр' : 'Прямоугольник'}
                    </button>
                  ))}
                </div>
              </div>

              {calcShape === 'cylinder' ? (
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 mb-3 block">Диаметр, м</label>
                  <input type="number" value={calcDiameter} onChange={e => setCalcDiameter(e.target.value)} placeholder="1.2"
                    className="w-full rounded-xl px-5 py-3.5 font-mono text-lg focus:outline-none transition-colors"
                    style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)', color: TEXT_DARK }} />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {[{ label: 'Ширина, м', val: calcWidth, set: setCalcWidth, ph: '2.0' },
                    { label: 'Длина, м',  val: calcLength, set: setCalcLength, ph: '3.0' }].map(({ label, val, set, ph }) => (
                    <div key={label}>
                      <label className="text-[10px] uppercase tracking-widest text-gray-400 mb-3 block">{label}</label>
                      <input type="number" value={val} onChange={e => set(e.target.value)} placeholder={ph}
                        className="w-full rounded-xl px-5 py-3.5 font-mono text-lg focus:outline-none transition-colors"
                        style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)', color: TEXT_DARK }} />
                    </div>
                  ))}
                </div>
              )}

              <div>
                <label className="text-[10px] uppercase tracking-widest text-gray-400 mb-3 block">Высота слоя, м</label>
                <input type="number" value={calcHeight} onChange={e => setCalcHeight(e.target.value)} placeholder="0.8"
                  className="w-full rounded-xl px-5 py-3.5 font-mono text-lg focus:outline-none transition-colors"
                  style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)', color: TEXT_DARK }} />
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <LightCard className="rounded-2xl p-8">
                <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-7">Результат расчёта</p>
                <div className="space-y-6">
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Объём</p>
                    <p className="text-4xl font-mono font-light" style={{ color: TEXT_DARK }}>
                      {calcResult.volume} <span className="text-base text-gray-400">м³</span>
                    </p>
                  </div>
                  <div className="h-px bg-black/5" />
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Масса (при 1500 кг/м³)</p>
                    <p className="text-5xl font-mono font-light" style={{ color: RED }}>
                      {calcResult.tons} <span className="text-lg text-gray-400">тонн</span>
                    </p>
                  </div>
                  <div className="h-px bg-black/5" />
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Биг-Бэгов (≈ 1 тонна)</p>
                    <p className="text-4xl font-mono font-light" style={{ color: TEXT_DARK }}>
                      {calcResult.bigbags} <span className="text-base text-gray-400">шт</span>
                    </p>
                  </div>
                </div>
              </LightCard>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          7. PACKAGING + DOCS  —  off-white
         ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-24" style={{ background: BG_ALT, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <div className="px-6 sm:px-10 lg:px-[1cm]">
          <div className="grid lg:grid-cols-2 gap-16">
            <ScrollReveal type="slide-left">
              <h2 className="text-3xl font-bold tracking-tighter mb-10" style={{ color: TEXT_DARK }}>Упаковка и отгрузка</h2>
              <div className="grid grid-cols-2 gap-5">
                {[
                  { Icon: Truck,   title: 'Навал', desc: 'Самосвал / полуприцеп' },
                  { Icon: Package, title: 'МКР',   desc: 'Биг-бэг ≈ 1 тонна' },
                ].map(({ Icon, title, desc }) => (
                  <LiquidGlassCard key={title} className="rounded-2xl p-7">
                    <Icon className="w-6 h-6 mb-5" style={{ color: TEXT_DARK, opacity: 0.55 }} />
                    <h3 className="text-lg font-semibold mb-2" style={{ color: TEXT_DARK }}>{title}</h3>
                    <p className="text-sm text-gray-400">{desc}</p>
                  </LiquidGlassCard>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal type="slide-right" delay={0.1}>
              <h2 className="text-3xl font-bold tracking-tighter mb-10" style={{ color: TEXT_DARK }}>Документация</h2>
              <div className="space-y-3">
                {[
                  { name: 'Паспорт качества',         file: docPath },
                  { name: `Сертификат ${product.gost}`, file: docPath },
                  { name: 'Лабораторное заключение',  file: docPath },
                ].map((doc) => (
                  <a key={doc.name} href={doc.file} download
                    className="flex items-center justify-between rounded-2xl px-7 py-5 group card-hover border border-black/[0.07] hover:border-brand-red/30"
                    style={{ background: 'rgba(255,255,255,0.7)' }}
                  >
                    <span className="text-sm font-medium" style={{ color: TEXT_DARK }}>{doc.name}</span>
                    <Download className="w-4 h-4 text-gray-400 group-hover:text-brand-dark transition-colors" />
                  </a>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          8. CTA
         ═══════════════════════════════════════════════════════════════════════ */}
      <section className="relative bg-black overflow-hidden">
        <div className="relative z-10 px-6 sm:px-10 lg:px-[1cm] py-10 lg:py-14 flex flex-col items-start gap-6">
          <ScrollReveal type="fade-up">
            <h2 className="text-xl md:text-3xl lg:text-4xl font-light leading-tight text-gray-500 text-left">
              Вернуться на перечень нашей продукции.
            </h2>
          </ScrollReveal>
          <ScrollReveal type="fade-up" delay={0.1}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                to="/catalog"
                className="btn-primary rounded-lg inline-flex items-center justify-center gap-3"
              >
                <span>Смотреть каталог</span>
                <ArrowUpRight className="w-5 h-5" />
              </Link>
              <Link
                to="/contacts"
                className="px-6 py-3 border border-gray-700 text-white rounded-lg font-semibold tracking-wide hover:border-brand-red hover:text-white transition-all duration-300 flex items-center justify-center gap-3"
              >
                <span>Связаться с нами</span>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          LIGHTBOX
         ═══════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.96)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeLightbox}
          >
            <button className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors z-10" onClick={closeLightbox}>
              <X className="w-7 h-7" />
            </button>
            <div className="absolute top-6 left-1/2 -translate-x-1/2 text-gray-500 text-sm font-mono tracking-widest">
              {String(lightboxIdx + 1).padStart(2, '0')} / {String(galleryImages.length).padStart(2, '0')}
            </div>
            <button className="absolute left-4 sm:left-8 text-gray-400 hover:text-white z-10 p-2"
              onClick={e => { e.stopPropagation(); prevLightbox(); }}>
              <ChevronLeft className="w-10 h-10" />
            </button>
            <img key={lightboxIdx} src={galleryImages[lightboxIdx]} alt={`${product.shortName} — ${lightboxIdx + 1}`}
              className="max-h-[85vh] max-w-[85vw] object-contain rounded-xl" onClick={e => e.stopPropagation()} />
            <button className="absolute right-4 sm:right-8 text-gray-400 hover:text-white z-10 p-2"
              onClick={e => { e.stopPropagation(); nextLightbox(); }}>
              <ChevronRight className="w-10 h-10" />
            </button>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
              {galleryImages.map((_, i) => (
                <button key={i} onClick={e => { e.stopPropagation(); setLightboxIdx(i); }}
                  className="rounded-full transition-all duration-300"
                  style={{ width: i === lightboxIdx ? 24 : 8, height: 8, background: i === lightboxIdx ? RED : 'rgba(255,255,255,0.25)' }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default ProductPage;
