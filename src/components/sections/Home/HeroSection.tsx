import { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { motion, useMotionValue, animate, AnimatePresence } from 'framer-motion';
import type { AnimationPlaybackControls } from 'framer-motion';

/**
 * Phase state machine:
 *   idle        – screen 1: image bg, title + CTA visible, "Листайте" shown
 *   to-screen2  – transitioning forward: video1 plays, content animates up, scroll locked
 *   screen2     – screen 2: video2 loops, quote visible, normal scroll + back-threshold
 *   to-screen1  – transitioning back: black flash, image restores, content slides down
 */
type Phase = 'idle' | 'to-screen2' | 'screen2' | 'to-screen1';

/** Accumulated upward wheel delta required to trigger the back transition */
const BACK_THRESHOLD = 300;

const HeroSection = () => {
  const sectionRef   = useRef<HTMLElement>(null);
  const video1Ref    = useRef<HTMLVideoElement>(null);
  const video2Ref    = useRef<HTMLVideoElement>(null);
  const rafRef       = useRef<number>(0);
  const isLocked     = useRef(false);
  const phaseRef     = useRef<Phase>('idle');
  const showQuoteRef = useRef(false);
  const backDeltaRef = useRef(0);        // accumulated upward delta at screen2
  const animStopRef  = useRef<AnimationPlaybackControls[]>([]);
  const fallbackRef  = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const [phase,     setPhase]     = useState<Phase>('idle');
  const [showQuote, setShowQuote] = useState(false);
  const [darkening, setDarkening] = useState(false);

  // Content MotionValues — driven directly by code, not useScroll
  const contentY  = useMotionValue(0);
  const contentOp = useMotionValue(1);

  const syncPhase = useCallback((p: Phase) => { phaseRef.current = p; setPhase(p); }, []);

  const stopAnims = () => {
    animStopRef.current.forEach(a => a.stop?.());
    animStopRef.current = [];
  };

  // ── RAF smooth scroll ──────────────────────────────────────────────────────
  const animateScrollTo = useCallback((target: number, ms: number, onDone?: () => void) => {
    cancelAnimationFrame(rafRef.current);
    const from  = window.scrollY;
    const start = performance.now();
    const ease  = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const tick  = (now: number) => {
      const t = Math.min((now - start) / ms, 1);
      window.scrollTo(0, from + (target - from) * ease(t));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
      else onDone?.();
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  // ── idle → to-screen2 ──────────────────────────────────────────────────────
  const startForward = useCallback(() => {
    if (isLocked.current) return;
    isLocked.current = true;
    backDeltaRef.current = 0;
    syncPhase('to-screen2');
    showQuoteRef.current = false;
    setShowQuote(false);

    // Instant cut: start video1 from beginning
    const v1 = video1Ref.current;
    if (v1) { v1.currentTime = 0; void v1.play(); }

    // Animate content out (matches scroll duration)
    stopAnims();
    animStopRef.current = [
      animate(contentY,  -260, { duration: 2,   ease: [0.37, 0, 0.63, 1] }),
      animate(contentOp, 0,    { duration: 1.5, ease: [0.42, 0, 0.58, 1] }),
    ];

    // Scroll to screen 2 over 2s
    animateScrollTo(window.innerHeight, 2000);

    // Safety fallback: if video1 never fires onEnded
    clearTimeout(fallbackRef.current);
    fallbackRef.current = setTimeout(() => {
      if (phaseRef.current === 'to-screen2') {
        void video2Ref.current?.play();
        syncPhase('screen2');
        isLocked.current = false;
      }
    }, 12000);
  }, [syncPhase, contentY, contentOp, animateScrollTo]);

  // ── video1: quote 1 s before end ──────────────────────────────────────────
  const onVideo1TimeUpdate = useCallback(() => {
    const v = video1Ref.current;
    if (!v || !v.duration) return;
    if (!showQuoteRef.current && v.currentTime >= v.duration - 1) {
      showQuoteRef.current = true;
      setShowQuote(true);
    }
  }, []);

  // ── video1 ended: crossfade to video2, unlock ─────────────────────────────
  const onVideo1Ended = useCallback(() => {
    clearTimeout(fallbackRef.current);
    void video2Ref.current?.play();
    syncPhase('screen2');
    isLocked.current = false;
  }, [syncPhase]);

  // ── screen2 → to-screen1 ──────────────────────────────────────────────────
  const startBack = useCallback(() => {
    if (isLocked.current) return;
    isLocked.current = true;
    backDeltaRef.current = 0;
    syncPhase('to-screen1');
    showQuoteRef.current = false;
    setShowQuote(false);
    setDarkening(true);               // black fades in (0.2s)

    setTimeout(() => {
      // Black is fully on — stop videos, switch bg to image, snap content instantly
      video2Ref.current?.pause();
      video1Ref.current?.pause();
      if (video1Ref.current) video1Ref.current.currentTime = 0;

      syncPhase('idle');              // image appears under black
      stopAnims();
      contentY.set(0);               // snap — no entry animation
      contentOp.set(1);

      // Scroll back to 0 over 1.4s
      animateScrollTo(0, 1400, () => {
        isLocked.current = false;
        if (video2Ref.current) video2Ref.current.currentTime = 0;
      });

      // Fade black out immediately (0.2s) — total dark effect ≈ 0.4–0.5s
      setDarkening(false);
    }, 250);
  }, [syncPhase, contentY, contentOp, animateScrollTo]);

  // ── Event listeners ───────────────────────────────────────────────────────
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      // Block everything during locked transitions
      if (isLocked.current) { e.preventDefault(); return; }

      // idle at top, scroll down → forward
      if (phaseRef.current === 'idle' && window.scrollY < 10 && e.deltaY > 0) {
        e.preventDefault();
        startForward();
        return;
      }

      // screen2 at screen2-top, scroll up → accumulate threshold, then back
      if (phaseRef.current === 'screen2' && window.scrollY <= window.innerHeight + 5) {
        if (e.deltaY < 0) {
          e.preventDefault();
          backDeltaRef.current += Math.abs(e.deltaY);
          if (backDeltaRef.current >= BACK_THRESHOLD) startBack();
        } else {
          backDeltaRef.current = 0;   // scrolling down: reset back counter
        }
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const all = ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' '];
      if (isLocked.current && all.includes(e.key)) { e.preventDefault(); return; }

      if (phaseRef.current === 'idle' && window.scrollY < 10 &&
          ['ArrowDown', 'PageDown', ' '].includes(e.key)) {
        e.preventDefault();
        startForward();
      }
      if (phaseRef.current === 'screen2' && window.scrollY <= window.innerHeight + 5 &&
          ['ArrowUp', 'PageUp'].includes(e.key)) {
        e.preventDefault();
        backDeltaRef.current += 100;
        if (backDeltaRef.current >= BACK_THRESHOLD) startBack();
      }
    };

    window.addEventListener('wheel',   onWheel,  { passive: false });
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('wheel',   onWheel);
      window.removeEventListener('keydown', onKeyDown);
      cancelAnimationFrame(rafRef.current);
      clearTimeout(fallbackRef.current);
    };
  }, [startForward, startBack]);

  return (
    // 200 vh so the sticky inner stays on screen during back-scroll
    <section ref={sectionRef} className="relative h-[200vh]">
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* ── BG: image — only in idle, instant cut ─────────────────────── */}
        <div
          className="absolute inset-0 top-20 md:top-24 bg-cover bg-center z-0"
          style={{
            backgroundImage: "url('/HeroSent/sand-pile_1.png')",
            opacity: phase === 'idle' ? 1 : 0,
            transition: 'none',
          }}
        />

        {/* ── BG: video 1 — instant cut in, instant cut out ─────────────── */}
        <video
          ref={video1Ref}
          src="/HeroSent/part%201.mp4"
          muted
          playsInline
          onTimeUpdate={onVideo1TimeUpdate}
          onEnded={onVideo1Ended}
          className="absolute inset-0  object-cover pointer-events-none z-[1]"
          style={{ opacity: phase === 'to-screen2' ? 1 : 0, transition: 'none' }}
        />

        {/* ── BG: video 2 — instant cut in, loops ──────────────────────── */}
        <video
          ref={video2Ref}
          src="/HeroSent/part%202.mp4"
          muted
          playsInline
          loop
          className="absolute inset-0 object-cover pointer-events-none z-[2]"
          style={{ opacity: phase === 'screen2' ? 1 : 0, transition: 'none' }}
        />

        {/* Permanent dark overlay */}
        <div className="absolute inset-0 bg-black/20 z-[3]" />

        {/* Black flash for back transition */}
        <div
          className="absolute inset-0 bg-black z-[9] pointer-events-none"
          style={{ opacity: darkening ? 1 : 0, transition: 'opacity 0.2s ease' }}
        />

        {/* ── Screen 1 content: title + CTA ──────────────────────────────── */}
        <motion.div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{ y: contentY, opacity: contentOp }}
        >
          {/* Heading — top left */}
          <div
            className="absolute pointer-events-auto"
            style={{ top: 'calc(5rem + 1cm)', left: '1cm' }}
          >
            <h1
              className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white leading-[0.95]"
              style={{ fontWeight: 200, letterSpacing: '0.04em' }}
            >
              Сухой кварцевый
              <br />
              <span style={{ fontWeight: 300, fontStyle: 'italic', letterSpacing: '0.01em' }}>
                песок
              </span>
            </h1>
          </div>

          {/* Description + buttons — bottom right */}
          <div
            className="absolute pointer-events-auto text-right"
            style={{ bottom: '0.5cm', right: '1cm' }}
          >
            <p className="text-gray-400 text-lg max-w-md mb-6 leading-relaxed ml-auto">
              Очищенный, фракционированный, <br />
              cухой песок под любые ваши задачи. <br />
              Для промышленности и строительства.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Link
                to="/catalog"
                className="bg-brand-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-red-light transition-colors flex items-center justify-center gap-3"
              >
                <span>В каталог</span>
                <ArrowUpRight className="w-5 h-5" />
              </Link>
              <Link
                to="/contacts"
                className="px-6 py-3 border border-gray-700 text-white rounded-lg font-semibold hover:border-brand-red transition-all duration-300 flex items-center justify-center gap-3"
              >
                <span>Связаться</span>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* ── Screen 2 quote — appears 1 s before video1 ends ─────────────── */}
        <AnimatePresence>
          {showQuote && (
            <motion.div
              key="quote"
              initial={{ opacity: 0, y: 60, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="absolute inset-x-0 z-10 px-[1cm]"
              style={{ top: '50%', transform: 'translateY(-50%)' }}
            >
              <p className="text-white text-4xl md:text-5xl lg:text-6xl font-light leading-[1.05] tracking-tight">
                Каждая песчинка — кирпичик величия: <br />
                прочность огромного всегда держится на <br />надёжности самого малого
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── "Листайте" — idle only, centre of left half ──────────────────── */}
        <AnimatePresence>
          {phase === 'idle' && (
            <motion.div
              key="scroll-hint"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              className="absolute z-10 flex flex-col items-center gap-2"
              style={{ bottom: '0.5cm', left: '25%', transform: 'translateX(-50%)' }}
            >
              <span className="text-gray-500 text-xs tracking-[0.3em] uppercase">Листайте</span>
              <ChevronDown className="w-5 h-5 text-gray-500 animate-bounce" />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};

export default HeroSection;
