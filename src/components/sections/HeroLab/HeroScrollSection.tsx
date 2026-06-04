import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

/**
 * Эксперимент: фон-секвенция на фреймах, привязана к скролу.
 *
 * Всё считаем в абсолютных vh от верха секции (sectionVh):
 *
 *   sectionVh 0 .. PHASE1_END_VH       — frames1 scrub (122 кадра × 0.85vh)
 *   sectionVh PHASE1_END_VH .. SECTION_VH
 *                                       — frames2 scrub непрерывно, циклом.
 *                                         Скрол назад → кадры идут назад.
 *                                         Если кончились — % FRAME_COUNT,
 *                                         начинаем с первого, без замираний.
 *
 *   sectionVh PHASE2_END_VH .. PINNED_END_VH
 *                                       — TAIL: дополнительные 100vh скрола
 *                                         внутри pinned, текст уже спрятан,
 *                                         кадры продолжают цикл.
 *
 *   sectionVh PINNED_END_VH .. SECTION_VH
 *                                       — EXIT (100vh): sticky уезжает вверх,
 *                                         снизу появляется StatsStrip.
 *                                         frames2 продолжает scrub до конца.
 *
 * Высота секции:
 *   PHASE_VH       = FRAME_COUNT × VH_PER_FRAME   (~104vh)
 *   PINNED_END_VH  = 2 × PHASE_VH + TAIL_VH       (~407 - 100 = 307vh)
 *   SECTION_VH     = PINNED_END_VH + 100          (+100vh exit)
 */
const FRAME_COUNT = 122;
const VH_PER_FRAME = 0.6;                               // 1 кадр / 0.6vh скрола
const PHASE_VH = FRAME_COUNT * VH_PER_FRAME;            // ~73.2vh
const TAIL_VH = 0;                                      // без буфера, секция короче
const PHASE1_END_VH = PHASE_VH;                         // конец phase 1 (frames1)
const PHASE2_END_VH = 2 * PHASE_VH;                     // конец phase 2 (frames2 1-й цикл)
const PINNED_END_VH = PHASE2_END_VH + TAIL_VH;          // конец pinned (sticky отпускает)
const SECTION_VH = PINNED_END_VH + 100;                 // +100vh natural exit

// Кроссфейд между frames1 и frames2 — узкий, чтобы не было видимого наложения
const CF_BAND_VH = 4;                                    // ±4vh вокруг PHASE1_END_VH

// Текст screen2 — позиции в абсолютных vh
const S2_FADE_IN_FROM_VH  = 75;                          // сразу после phase 1
const S2_FADE_IN_TO_VH    = 100;
const S2_FADE_OUT_FROM_VH = 120;
const S2_FADE_OUT_TO_VH   = 145;                         // полностью гаснет до начала exit (146)

// Текст screen1 — гаснет по мере скрола
const S1_FADE_OUT_VH = 50;                               // полностью уезжает к sectionVh=50

const buildUrl = (base: string, i: number) =>
  `${base}${String(i + 1).padStart(4, '0')}.webp`;

const drawCover = (
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  w: number,
  h: number,
) => {
  if (!img.complete || img.naturalWidth === 0) return;
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  const ir = iw / ih;
  const cr = w / h;
  let sx = 0;
  let sy = 0;
  let sw = iw;
  let sh = ih;
  if (ir > cr) {
    sw = ih * cr;
    sx = (iw - sw) / 2;
  } else {
    sh = iw / cr;
    sy = (ih - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
};

const HeroScrollSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const c1Ref = useRef<HTMLCanvasElement>(null);
  const c2Ref = useRef<HTMLCanvasElement>(null);
  const screen1Ref = useRef<HTMLDivElement>(null);
  const screen2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // ── Прелоад двух наборов фреймов
    const frames1: HTMLImageElement[] = new Array(FRAME_COUNT);
    const frames2: HTMLImageElement[] = new Array(FRAME_COUNT);
    for (let i = 0; i < FRAME_COUNT; i++) {
      const im1 = new Image();
      im1.src = buildUrl('/HeroSent/frames1/frame_', i);
      frames1[i] = im1;
      const im2 = new Image();
      im2.src = buildUrl('/HeroSent/frames2/frame_', i);
      frames2[i] = im2;
    }

    let raf = 0;
    let lastSecVh = -1;
    let lastIdx1 = -1;
    let lastIdx2 = -1;

    const syncCanvas = (c: HTMLCanvasElement) => {
      const w = c.offsetWidth;
      const h = c.offsetHeight;
      if (w > 0 && h > 0 && (c.width !== w || c.height !== h)) {
        c.width = w;
        c.height = h;
        return true;
      }
      return false;
    };

    const update = () => {
      const el = sectionRef.current;
      if (!el) {
        raf = requestAnimationFrame(update);
        return;
      }
      const rect = el.getBoundingClientRect();
      const innerH = window.innerHeight;
      // sectionVh: 0 в начале секции, SECTION_VH когда секция полностью ушла.
      const sectionVh = (-rect.top / innerH) * 100;

      const c1 = c1Ref.current;
      const c2 = c2Ref.current;

      // ── Видимость холстов: hard switch с узким кроссфейдом ±CF_BAND_VH
      let v1Op: number;
      let v2Op: number;
      if (sectionVh < PHASE1_END_VH - CF_BAND_VH) {
        v1Op = 1;
        v2Op = 0;
      } else if (sectionVh > PHASE1_END_VH + CF_BAND_VH) {
        v1Op = 0;
        v2Op = 1;
      } else {
        v1Op = 1 - (sectionVh - (PHASE1_END_VH - CF_BAND_VH)) / (CF_BAND_VH * 2);
        v2Op = 1 - v1Op;
      }

      // ── Текст: только opacity, без перемещения
      const s1 = screen1Ref.current;
      const s2 = screen2Ref.current;
      if (s1) {
        s1.style.opacity = String(Math.max(0, 1 - sectionVh / S1_FADE_OUT_VH));
      }
      if (s2) {
        const fadeIn = Math.max(
          0,
          Math.min(1, (sectionVh - S2_FADE_IN_FROM_VH) / (S2_FADE_IN_TO_VH - S2_FADE_IN_FROM_VH)),
        );
        const fadeOut = Math.max(
          0,
          Math.min(1, (sectionVh - S2_FADE_OUT_FROM_VH) / (S2_FADE_OUT_TO_VH - S2_FADE_OUT_FROM_VH)),
        );
        s2.style.opacity = String(fadeIn * (1 - fadeOut));
      }

      // ── Холсты + scrub-индексы — только при заметной смене скрола
      if (Math.abs(sectionVh - lastSecVh) > 0.05) {
        lastSecVh = sectionVh;

        if (c1) c1.style.opacity = String(v1Op);
        if (c2) c2.style.opacity = String(v2Op);

        // frames1 scrub: от 0 до PHASE1_END_VH
        if (c1 && v1Op > 0.02) {
          const p1Vh = Math.max(0, Math.min(PHASE1_END_VH, sectionVh));
          const idx1 = Math.min(FRAME_COUNT - 1, Math.floor(p1Vh / VH_PER_FRAME));
          const resized = syncCanvas(c1);
          if (idx1 !== lastIdx1 || resized) {
            const ctx = c1.getContext('2d');
            const img = frames1[idx1];
            if (ctx && img && c1.width > 0) {
              ctx.clearRect(0, 0, c1.width, c1.height);
              drawCover(ctx, img, c1.width, c1.height);
            }
            lastIdx1 = idx1;
          }
        }

        // frames2 scrub: от PHASE1_END_VH до конца секции, циклом по mod FRAME_COUNT.
        // Кадры кончаются → начинаем с первого; скрол назад → кадры назад.
        if (c2 && v2Op > 0.02) {
          const f2Vh = Math.max(0, sectionVh - PHASE1_END_VH);
          const idx2Raw = Math.floor(f2Vh / VH_PER_FRAME);
          const idx2 = ((idx2Raw % FRAME_COUNT) + FRAME_COUNT) % FRAME_COUNT;
          const resized = syncCanvas(c2);
          if (idx2 !== lastIdx2 || resized) {
            const ctx = c2.getContext('2d');
            const img = frames2[idx2];
            if (ctx && img && c2.width > 0) {
              ctx.clearRect(0, 0, c2.width, c2.height);
              drawCover(ctx, img, c2.width, c2.height);
            }
            lastIdx2 = idx2;
          }
        }
      }

      raf = requestAnimationFrame(update);
    };

    raf = requestAnimationFrame(update);

    // Отрисовать первый кадр сразу, как только он догрузится
    const drawFirst = () => {
      const c1 = c1Ref.current;
      if (!c1) return;
      syncCanvas(c1);
      const ctx = c1.getContext('2d');
      const img = frames1[0];
      if (ctx && img?.complete && c1.width > 0) drawCover(ctx, img, c1.width, c1.height);
    };
    if (frames1[0].complete) drawFirst();
    else frames1[0].addEventListener('load', drawFirst, { once: true });

    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        className="relative"
        style={{ height: `${SECTION_VH}vh` }}
      >
        {/* ── Sticky background ─────────────────────────────────────────── */}
        <div className="sticky top-0 h-screen overflow-hidden pointer-events-none z-0 bg-black">
          <canvas
            ref={c1Ref}
            className="absolute inset-0 w-full h-full"
            style={{ opacity: 1 }}
          />
          <canvas
            ref={c2Ref}
            className="absolute inset-0 w-full h-full"
            style={{ opacity: 0 }}
          />
          <div className="absolute inset-0 bg-black/25" />
        </div>
      </section>

      {/* ── Текст-оверлей: статичен в viewport, только меняется opacity ──
          z-30 — ниже Header (z-50), выше всего остального контента.        */}
      <div className="fixed inset-0 z-30 pointer-events-none">
        {/* Screen 1: title + CTA */}
        <div ref={screen1Ref} className="absolute inset-0" style={{ opacity: 1 }}>
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
                className="btn-primary inline-flex items-center gap-2.5"
              >
                <span>В каталог</span>
                <ArrowUpRight className="w-4 h-4" strokeWidth={1.5} />
              </Link>
              <Link
                to="/contacts"
                className="btn-sec"
              >
                <span>Связаться</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Screen 2: цитата */}
        <div
          ref={screen2Ref}
          className="absolute inset-0 flex items-center px-[1cm]"
          style={{ opacity: 0 }}
        >
          <p className="text-white text-4xl md:text-5xl lg:text-6xl font-light leading-[1.05] tracking-tight">
            Каждая песчинка — кирпичик величия: <br />
            прочность огромного всегда держится на <br />
            надёжности самого малого
          </p>
        </div>
      </div>
    </>
  );
};

export default HeroScrollSection;
