import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

type AnimationType = 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right' | 'scale';

interface ScrollRevealProps {
  children: ReactNode;
  type?: AnimationType;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
  as?: 'div' | 'section' | 'span' | 'h2' | 'h3' | 'p';
  inline?: boolean;
}

const offsetMap: Record<AnimationType, { x: number; y: number; scale: number }> = {
  'fade-up':     { x: 0,    y: 60,  scale: 1 },
  'fade-in':     { x: 0,    y: 0,   scale: 1 },
  'slide-left':  { x: -150, y: 0,   scale: 1 },
  'slide-right': { x: 150,  y: 0,   scale: 1 },
  'scale':       { x: 0,    y: 40,  scale: 0.85 },
};

const ScrollReveal = ({
  children,
  type = 'fade-up',
  delay = 0,
  className = '',
  style,
  as = 'div',
  inline = false,
}: ScrollRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center'],
  });

  const offsets = offsetMap[type];

  // Delay shifts the interpolation range: [delay..1] mapped to [start..end]
  const start = delay;
  const end = Math.min(start + 0.7, 1);

  const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
  const x = useTransform(scrollYProgress, [start, end], [offsets.x, 0]);
  const y = useTransform(scrollYProgress, [start, end], [offsets.y, 0]);
  const scale = useTransform(scrollYProgress, [start, end], [offsets.scale, 1]);

  const MotionComponent = inline ? motion.span : motion[as] || motion.div;

  return (
    <MotionComponent
      ref={ref}
      style={{ opacity, x, y, scale, display: inline ? 'inline-block' : undefined, ...style }}
      className={`will-change-transform ${className}`}
    >
      {children}
    </MotionComponent>
  );
};

export default ScrollReveal;
