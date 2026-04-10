import { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { motion, useMotionValue, AnimatePresence } from 'framer-motion';

/**
 * Phase machine:
 *   idle         — scrollY=0, photo bg, screen1 content visible
 *   transitioning — locked 1.5s scripted scroll, video1 plays
 *   video         — video2 loops, scroll free, content fades by scroll
 *   returning     — video2 fades 1.5s → black 0.8s → photo, text stays
 *
 * Section = 250vh:
 *   0–100vh   screen 1  (photo zone)
 *   100–250vh screen 2  (video zone, quote)
 */
type Phase = 'idle' | 'transitioning' | 'video' | 'returning';

const HeroSection = () => {
  const video1Ref   = useRef<HTMLVideoElement>(null);
  const video2Ref   = useRef<HTMLVideoElement>(null);
  const rafRef      = useRef<number>(0);
  const phaseRef    = useRef<Phase>('idle');
  const lockedRef   = useRef(false);

  const [phase,      setPhase]      = useState<Phase>('idle');
  const [darkening,  setDarkening]  = useState(false);
  const [video2Fade, setVideo2Fade] = useState(false);
  const [showHint,   setShowHint]   = useState(true);

  // Motion values for content layers — set directly from scroll listener
  const s1Op = useMotionValue(1);   // screen 1 opacity
  const s2Op = useMotionValue(0);   // screen 2 opacity

  const syncPhase = (p: Phase) => { phaseRef.current = p; setPhase(p); };

  // ── RAF smooth scroll ─────────────────────────────────────────────────────
  const animateScrollTo = useCallback((target: number, ms: number, onDone?: () => void) => {
    cancelAnimationFrame(rafRef.current);
    const from  = window.scrollY;
    const start = performance.now();
    const ease  = (t: number) => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2;
    const tick  = (now: number) => {
      const t = Math.min((now - start) / ms, 1);
      window.scrollTo(0, from + (target - from) * ease(t));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
      else onDone?.();
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  // ── idle → transitioning: lock, play video1, scripted scroll 1.5s ─────────
  const startTransition = useCallback(() => {
    if (phaseRef.current !== 'idle' || lockedRef.current) return;
    lockedRef.current = true;
    syncPhase('transitioning');
    setShowHint(false);

    const v1 = video1Ref.current;
    if (v1) { v1.currentTime = 0; void v1.play(); }

    const duration = (v1?.duration && isFinite(v1.duration) ? v1.duration : 5) * 1000;
    animateScrollTo(window.innerHeight, duration, () => {
      // Scripted scroll done → start video2, unlock
      const v2 = video2Ref.current;
      if (v2) { v2.currentTime = 0; void v2.play(); }
      syncPhase('video');
      lockedRef.current = false;
    });
  }, [animateScrollTo]);

  // ── video → returning: text stays, video2 fades 1.5s → black 0.8s → photo ─
  const startReturn = useCallback(() => {
    if (lockedRef.current || phaseRef.current !== 'video') return;
    lockedRef.current = true;
    syncPhase('returning');

    // Keep screen1 content visible
    s1Op.set(1);

    // Fade video2 out over 1.5s (CSS transition)
    setVideo2Fade(true);

    setTimeout(() => {
      // video2 fully faded — black appears, immediately swap to photo underneath
      setDarkening(true);
      video1Ref.current?.pause();
      video2Ref.current?.pause();
      if (video1Ref.current) video1Ref.current.currentTime = 0;
      if (video2Ref.current) video2Ref.current.currentTime = 0;
      setVideo2Fade(false);
      s2Op.set(0);
      syncPhase('idle');
      setShowHint(true);
      // Short delay just for black to render, then fade out
      setTimeout(() => {
        setDarkening(false);
        lockedRef.current = false;
      }, 50);
    }, 1500);
  }, [s1Op, s2Op]);

  // ── Wheel: first scroll down triggers scripted transition ─────────────────
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (lockedRef.current) { e.preventDefault(); return; }
      if (phaseRef.current === 'idle' && e.deltaY > 0) {
        e.preventDefault();
        startTransition();
      }
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, [startTransition]);

  // ── Scroll: content opacity tied to scroll position ───────────────────────
  useEffect(() => {
    const onScroll = () => {
      const sy  = window.scrollY;
      const ih  = window.innerHeight;
      const cur = phaseRef.current;

      if (cur === 'returning' || cur === 'idle') return;

      // Screen 1: fades out as scroll goes 0→ih
      s1Op.set(Math.max(0, 1 - (sy / ih) * 1.4));
      setShowHint(sy < ih * 0.08);

      // Screen 2: fades in 70–100vh, holds, fades out 180–250vh
      const fadeIn  = (sy - ih * 0.7) / (ih * 0.3);   // 0→1 over 70–100vh
      const fadeOut = (sy - ih * 1.8) / (ih * 0.7);   // 0→1 over 180–250vh
      const op = Math.max(0, Math.min(1, fadeIn)) * Math.max(0, 1 - Math.max(0, fadeOut));
      s2Op.set(op);

      // Return trigger: user scrolled all the way back to top
      if (cur === 'video' && sy < 10) {
        startReturn();
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [s1Op, s2Op, startReturn]);

  return (
    <section className="relative h-[250vh]">

      {/* ── Sticky background — photo or video, never moves ──────────────── */}
      <div className="sticky top-0 h-screen overflow-hidden pointer-events-none z-0">

        {/* Photo — visible only in idle */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/HeroSent/sand-pile_1.png')",
            opacity: phase === 'idle' ? 1 : 0,
            transition: 'none',
          }}
        />

        {/* Video 1 — transition animation, plays once */}
        <video
          ref={video1Ref}
          src="/HeroSent/part%201.mp4"
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: phase === 'transitioning' ? 1 : 0,
            transition: 'none',
          }}
        />

        {/* Video 2 — looping bg for video phase */}
        <video
          ref={video2Ref}
          src="/HeroSent/part%202.mp4"
          muted
          playsInline
          loop
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: (phase === 'video' || phase === 'returning') && !video2Fade ? 1 : 0,
            transition: video2Fade ? 'opacity 1.5s ease' : 'none',
          }}
        />

        {/* Permanent dark overlay */}
        <div className="absolute inset-0 bg-black/25" />

        {/* Black flash for return */}
        <div
          className="absolute inset-0 bg-black pointer-events-none"
          style={{
            opacity: darkening ? 1 : 0,
            transition: 'opacity 0.8s ease',
          }}
        />
      </div>

      {/* ── Screen 1: title + CTA — normal document flow at top ─────────── */}
      <motion.div
        className="absolute top-0 left-0 right-0 pointer-events-none z-10"
        style={{ height: '100vh', opacity: s1Op }}
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
              className="bg-brand-red text-white px-8 py-3 rounded-lg font-semibold hover:bg-brand-red-light transition-colors flex items-center justify-center gap-3"
            >
              <span>В каталог</span>
              <ArrowUpRight className="w-5 h-5" />
            </Link>
            <Link
              to="/contacts"
              className="px-8 py-3 border border-gray-700 text-white rounded-lg font-semibold hover:border-brand-red transition-all duration-300 flex items-center justify-center gap-3"
            >
              <span>Связаться</span>
            </Link>
          </div>
        </div>

        {/* "Листайте" */}
        <AnimatePresence>
          {showHint && phase === 'idle' && (
            <motion.button
              key="hint"
              onClick={startTransition}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.8 } }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
              className="absolute z-10 flex flex-col items-center gap-2 cursor-pointer bg-transparent border-0 p-0 pointer-events-auto"
              style={{ bottom: '0.5cm', left: '50%', transform: 'translateX(-50%)' }}
            >
              <span className="text-white/70 text-sm tracking-[0.3em] uppercase">Листайте</span>
              <ChevronDown className="w-6 h-6 text-white/70 animate-bounce" />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Screen 2: quote — normal document flow at 150vh ─────────────── */}
      <motion.div
        className="absolute left-0 right-0 z-10 flex items-center px-[1cm] pointer-events-none"
        style={{ top: '100vh', height: '100vh', opacity: s2Op }}
      >
        <p className="text-white text-4xl md:text-5xl lg:text-6xl font-light leading-[1.05] tracking-tight">
          Каждая песчинка — кирпичик величия: <br />
          прочность огромного всегда держится на <br />надёжности самого малого
        </p>
      </motion.div>

    </section>
  );
};

export default HeroSection;
