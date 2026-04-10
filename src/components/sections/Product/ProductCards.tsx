import { useState } from 'react';

// ── LiquidGlassCard — iOS 26 style, rainbow gradient border ───────────────────
export const LiquidGlassCard = ({
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

// ── LightCard — clean card for light sections ──────────────────────────────────
export const LightCard = ({
  children,
  className = '',
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) => (
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
