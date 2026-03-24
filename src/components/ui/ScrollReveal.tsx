import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

type AnimationType = 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right' | 'scale';

interface ScrollRevealProps {
  children: ReactNode;
  type?: AnimationType;
  delay?: number;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
  as?: 'div' | 'section' | 'span' | 'h2' | 'h3' | 'p' | 'a';
  inline?: boolean;
}

const offsetMap: Record<AnimationType, { x: number; y: number; scale: number }> = {
  'fade-up':     { x: 0,    y: 60,   scale: 1 },
  'fade-in':     { x: 0,    y: 0,    scale: 1 },
  'slide-left':  { x: -120, y: 0,    scale: 1 },
  'slide-right': { x: 120,  y: 0,    scale: 1 },
  'scale':       { x: 0,    y: 30,   scale: 0.88 },
};

const ScrollReveal = ({
  children,
  type = 'fade-up',
  delay = 0,
  duration = 0.6,
  className = '',
  style,
  as = 'div',
  inline = false,
}: ScrollRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);

  // Scroll range: element enters viewport → reaches ~40% from top
  // This gives enough travel for Lenis inertia to create the "settling" effect
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.95', 'start 0.4'],
  });

  const offsets = offsetMap[type];

  // Delay shifts the animation start within the scroll range
  const start = delay;
  const end = Math.min(start + duration, 1);

  const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
  const x = useTransform(scrollYProgress, [start, end], [offsets.x, 0]);
  const y = useTransform(scrollYProgress, [start, end], [offsets.y, 0]);
  const scale = useTransform(scrollYProgress, [start, end], [offsets.scale, 1]);

  const MotionComponent = inline ? motion.span : (motion as any)[as] || motion.div;

  return (
    <MotionComponent
      ref={ref}
      style={{
        opacity,
        x,
        y,
        scale,
        display: inline ? 'inline-block' : undefined,
        ...style,
      }}
      className={`will-change-transform ${className}`}
    >
      {children}
    </MotionComponent>
  );
};

export default ScrollReveal;
