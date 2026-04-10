import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

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

const initialMap: Record<AnimationType, { x?: number; y?: number; scale?: number; opacity: number }> = {
  'fade-up':    { opacity: 0, y: 50 },
  'fade-in':    { opacity: 0 },
  'slide-left': { opacity: 0, x: -80 },
  'slide-right':{ opacity: 0, x: 80 },
  'scale':      { opacity: 0, scale: 0.9 },
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
  const MotionComponent = inline ? motion.span : (motion as any)[as] || motion.div;

  return (
    <MotionComponent
      initial={initialMap[type]}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ display: inline ? 'inline-block' : undefined, ...style }}
      className={className}
    >
      {children}
    </MotionComponent>
  );
};

export default ScrollReveal;
