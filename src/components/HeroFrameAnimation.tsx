import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

export interface HeroFrameAnimationHandle {
  reset: () => void;
}

interface Props {
  framesPath: string;   // base path + filename prefix, e.g. "/HeroSent/frames1/frame_"
  frameCount: number;
  fps?: number;
  loop?: boolean;
  playing?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onEnded?: () => void;
  framePad?: number;   // zero-padding width, default 4 → frame_0001.png
  frameExt?: string;   // default "png"
}

const reducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const HeroFrameAnimation = forwardRef<HeroFrameAnimationHandle, Props>(
  (
    {
      framesPath,
      frameCount,
      fps = 30,
      loop = true,
      playing = true,
      className,
      style,
      onEnded,
      framePad = 4,
      frameExt = 'png',
    },
    ref,
  ) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const frameRef = useRef(0);
    const rafRef = useRef<number>(0);
    const lastTimeRef = useRef<number | null>(null);
    const playingRef = useRef(playing);
    const onEndedRef = useRef(onEnded);
    const endedRef = useRef(false);

    const [ready, setReady] = useState(false);

    useEffect(() => { playingRef.current = playing; }, [playing]);
    useEffect(() => { onEndedRef.current = onEnded; }, [onEnded]);

    useImperativeHandle(ref, () => ({
      reset() {
        frameRef.current = 0;
        lastTimeRef.current = null;
        endedRef.current = false;
      },
    }));

    const getUrl = useCallback(
      (i: number) =>
        `${framesPath}${String(i + 1).padStart(framePad, '0')}.${frameExt}`,
      [framesPath, framePad, frameExt],
    );

    // ── Preload all frames before animation starts ──────────────────────────
    useEffect(() => {
      if (frameCount <= 0) return; // no frames configured yet
      let cancelled = false;
      let loadedCount = 0;
      const images: HTMLImageElement[] = new Array(frameCount);
      setReady(false);

      const onSettle = () => {
        if (cancelled) return;
        loadedCount++;
        if (loadedCount === frameCount) {
          imagesRef.current = images;
          setReady(true);
        }
      };

      for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.onload = onSettle;
        img.onerror = onSettle; // count errors so we never deadlock
        img.src = getUrl(i);
        images[i] = img;
      }

      return () => { cancelled = true; };
    }, [framesPath, frameCount, getUrl]);

    // ── Cover-scaled draw ───────────────────────────────────────────────────
    const drawCover = useCallback(
      (ctx: CanvasRenderingContext2D, img: HTMLImageElement, w: number, h: number) => {
        if (!img.complete || img.naturalWidth === 0) return; // skip broken / unloaded
        const iw = img.naturalWidth;
        const ih = img.naturalHeight;
        const ir = iw / ih;
        const cr = w / h;
        let sx = 0, sy = 0, sw = iw, sh = ih;
        if (ir > cr) { sw = ih * cr; sx = (iw - sw) / 2; }
        else         { sh = iw / cr; sy = (ih - sh) / 2; }
        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
      },
      [],
    );

    // ── RAF animation loop ──────────────────────────────────────────────────
    useEffect(() => {
      if (!ready) return;

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      const syncCanvasSize = () => {
        const w = canvas.offsetWidth;
        const h = canvas.offsetHeight;
        if (w > 0 && h > 0 && (canvas.width !== w || canvas.height !== h)) {
          canvas.width = w;
          canvas.height = h;
        }
      };

      // Draw first frame immediately (covers the "nothing" state)
      syncCanvasSize();
      const first = imagesRef.current[0];
      if (first?.complete && canvas.width > 0)
        drawCover(ctx, first, canvas.width, canvas.height);

      // Respect prefers-reduced-motion — stay on first frame
      if (reducedMotion) return;

      const msFps = 1000 / fps;

      const tick = (ts: number) => {
        const paused =
          !playingRef.current ||
          document.visibilityState === 'hidden' ||
          endedRef.current;

        if (paused) {
          lastTimeRef.current = null;
          rafRef.current = requestAnimationFrame(tick);
          return;
        }

        if (lastTimeRef.current === null) lastTimeRef.current = ts;
        const delta = ts - lastTimeRef.current;

        if (delta >= msFps) {
          lastTimeRef.current = ts - (delta % msFps);
          syncCanvasSize();

          const w = canvas.width;
          const h = canvas.height;
          if (w > 0 && h > 0) {
            const img = imagesRef.current[frameRef.current];
            if (img?.complete) drawCover(ctx, img, w, h);
          }

          frameRef.current++;
          if (frameRef.current >= frameCount) {
            if (loop) {
              frameRef.current = 0;
            } else {
              frameRef.current = frameCount - 1;
              endedRef.current = true;
              onEndedRef.current?.();
            }
          }
        }

        rafRef.current = requestAnimationFrame(tick);
      };

      const onVisibility = () => {
        if (document.visibilityState === 'visible') lastTimeRef.current = null;
      };
      document.addEventListener('visibilitychange', onVisibility);
      rafRef.current = requestAnimationFrame(tick);

      return () => {
        cancelAnimationFrame(rafRef.current);
        document.removeEventListener('visibilitychange', onVisibility);
      };
    }, [ready, fps, loop, frameCount, drawCover]);

    return <canvas ref={canvasRef} className={className} style={style} />;
  },
);

HeroFrameAnimation.displayName = 'HeroFrameAnimation';
export default HeroFrameAnimation;
