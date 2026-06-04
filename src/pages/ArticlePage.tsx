import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowLeft, ArrowDown } from 'lucide-react';
import { SweepBtn } from '@/components/ui/SweepBtn';
import { getArticleBySlug, products } from '@/data/articles';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { RED, BG_PAGE, BG_ALT, TEXT_DARK } from '@/styles/theme';

// ── Markdown → HTML (секционный парсер) ──────────────────────────────────────
function renderContent(raw: string): string {
  const lines = raw.split('\n');
  let html = '';
  let i = 0;

  // Responsive CSS — инжектируется один раз в начале
  html += `<style>
    .ac-row{display:grid;grid-template-columns:1fr 1fr;gap:0 4rem;padding:3.5rem 0;border-top:1px solid rgba(26,26,27,0.09);align-items:start}
    .ac-defrow{display:grid;grid-template-columns:1fr 1fr;gap:0 4rem;padding:2rem 0;border-top:1px solid rgba(26,26,27,0.08);align-items:start}
    .ac-tiles{display:grid;grid-template-columns:repeat(3,1fr);gap:0.45rem}
    .ac-tile{aspect-ratio:4/3;background:#2a2a2a;padding:1.4rem 1.25rem;display:flex;align-items:flex-start;font-size:clamp(1rem,1.5vw,1.3rem);color:#ffffff;font-weight:700;line-height:1.25;letter-spacing:-0.025em;position:relative;overflow:hidden}
    .ac-cards{display:grid;grid-template-columns:repeat(2,1fr);gap:1px;background:rgba(26,26,27,0.1)}
    .ac-card{background:${BG_PAGE};padding:1.75rem 1.5rem;display:flex;flex-direction:column}
    .ac-card-dot{width:7px;height:7px;background:${RED};margin-bottom:1.1rem;flex-shrink:0}
    .ac-card-title{font-size:clamp(0.68rem,0.9vw,0.78rem);font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:${TEXT_DARK};margin:0 0 0.75rem;line-height:1.35}
    .ac-card-desc{font-size:clamp(0.88rem,1.2vw,1rem);font-weight:300;line-height:1.7;color:rgba(26,26,27,0.58);margin:0}
    @media(max-width:640px){
      .ac-row,.ac-defrow{grid-template-columns:1fr;gap:0.75rem}
      .ac-tiles{grid-template-columns:repeat(2,1fr);gap:0.35rem}
      .ac-tile{aspect-ratio:1;padding:1rem}
      .ac-cards{grid-template-columns:1fr}
    }
  </style>`;

  const duneSvg = (idx: number) => {
    const variants = [
      `<path d="M-10,108 C45,72 128,122 215,82" stroke="rgba(255,255,255,0.13)" stroke-width="1.2" fill="none"/><path d="M-10,126 C45,90 128,140 215,100" stroke="rgba(255,255,255,0.08)" stroke-width="1" fill="none"/><path d="M-10,144 C45,108 128,155 215,118" stroke="rgba(255,255,255,0.05)" stroke-width="1" fill="none"/>`,
      `<path d="M-10,92 C55,58 138,104 215,68" stroke="rgba(255,255,255,0.11)" stroke-width="1.2" fill="none"/><path d="M-10,116 C55,82 138,128 215,92" stroke="rgba(255,255,255,0.08)" stroke-width="1" fill="none"/><path d="M-10,140 C55,106 138,150 215,116" stroke="rgba(255,255,255,0.05)" stroke-width="1" fill="none"/>`,
      `<path d="M215,148 C158,96 78,118 -10,78" stroke="rgba(255,255,255,0.10)" stroke-width="1.2" fill="none"/><path d="M215,148 C152,112 72,134 -10,96" stroke="rgba(255,255,255,0.07)" stroke-width="1" fill="none"/><path d="M215,148 C156,124 76,146 -10,112" stroke="rgba(255,255,255,0.05)" stroke-width="1" fill="none"/>`,
      `<path d="M-10,132 C32,88 90,138 148,98 C186,72 208,88 215,84" stroke="rgba(255,255,255,0.12)" stroke-width="1.2" fill="none"/><path d="M-10,150 C32,106 90,155 148,116 C186,90 208,106 215,102" stroke="rgba(255,255,255,0.07)" stroke-width="1" fill="none"/>`,
      `<path d="M18,150 C48,98 168,98 198,150" stroke="rgba(255,255,255,0.10)" stroke-width="1.2" fill="none"/><path d="M-2,150 C38,78 178,78 218,150" stroke="rgba(255,255,255,0.07)" stroke-width="1" fill="none"/><path d="M-20,150 C28,58 188,58 235,150" stroke="rgba(255,255,255,0.04)" stroke-width="1" fill="none"/>`,
    ];
    return `<svg aria-hidden style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none" viewBox="0 0 205 150" preserveAspectRatio="xMidYMax meet" xmlns="http://www.w3.org/2000/svg">${variants[idx % variants.length]}</svg>`;
  };

  while (i < lines.length) {
    const line = lines[i].trim();

    if (!line) { i++; continue; }

    // ## H2 — пропускаем (текст уже показан в pull-quote выше)
    if (line.startsWith('## ')) { i++; continue; }

    // ### H3 — собираем весь блок до следующего заголовка
    if (line.startsWith('### ')) {
      const label = line.slice(4);
      i++;

      const sectionLines: string[] = [];
      while (i < lines.length && !lines[i].trim().startsWith('##')) {
        sectionLines.push(lines[i]);
        i++;
      }

      const nonEmpty = sectionLines.map(l => l.trim()).filter(Boolean);
      const hasList = nonEmpty.some(l => l.startsWith('- '));
      const hasBold = nonEmpty.some(l => /^\*\*(.+)\*\*$/.test(l));


      if (hasList) {
        const listItems: string[] = [];
        const preLines: string[] = [];
        for (const l of nonEmpty) {
          if (l.startsWith('- ')) listItems.push(l.slice(2));
          else if (listItems.length === 0) preLines.push(l);
        }
        const prePara = preLines.join(' ');

        // «Области применения» — типографский список как «Преимущества»; иначе — плитки
        const useTypoList = label === 'Области применения';

        if (prePara && !useTypoList) {
          // Есть вводный текст → левая: крупный текст, правая: тёмные плитки
          html += `<div class="ac-row">
            <div>
              <p style="color:${TEXT_DARK};font-size:clamp(1.4rem,2.4vw,2.1rem);font-weight:300;line-height:1.25;letter-spacing:-0.02em;margin:0">${prePara}</p>
            </div>
            <div class="ac-tiles">
              ${listItems.map((item, idx) => `<div class="ac-tile">${duneSvg(idx)}<span style="position:relative;z-index:1">${item}</span></div>`).join('')}
            </div>
          </div>`;
        } else {
          // «Области применения» → заголовок слева, плитки справа
          html += `<div class="ac-row" style="align-items:start">
            <div>
              <p style="color:${TEXT_DARK};font-size:clamp(1.6rem,3vw,3rem);font-weight:300;line-height:1.0;letter-spacing:-0.03em;margin:0">${label}</p>
            </div>
            <div class="ac-tiles">
              ${listItems.map((item, idx) => `<div class="ac-tile">${duneSvg(idx)}<span style="position:relative;z-index:1">${item}</span></div>`).join('')}
            </div>
          </div>`;
        }

      } else if (hasBold) {
        // H3 слева крупным заголовком, справа — сетка карточек с акцентом
        const defItems: string[] = [];
        let j = 0;
        while (j < nonEmpty.length) {
          const sl = nonEmpty[j];
          const bm = sl.match(/^\*\*(.+)\*\*$/);
          if (bm) {
            const title = bm[1];
            j++;
            const descParts: string[] = [];
            while (j < nonEmpty.length && !/^\*\*/.test(nonEmpty[j]) && !nonEmpty[j].startsWith('#')) {
              descParts.push(nonEmpty[j]);
              j++;
            }
            const desc = descParts.join(' ');
            defItems.push(`<div style="padding:1.6rem 0;border-top:1px solid rgba(26,26,27,0.09)">
              <p style="color:${TEXT_DARK};font-size:clamp(1.2rem,1.9vw,1.6rem);font-weight:400;line-height:1.2;margin:0 0 0.65rem;letter-spacing:-0.02em">${title}</p>
              ${desc ? `<p style="color:rgba(26,26,27,0.52);font-size:clamp(1rem,1.5vw,1.25rem);font-weight:300;line-height:1.75;margin:0">${desc}</p>` : ''}
            </div>`);
          } else { j++; }
        }
        html += `<div class="ac-row" style="align-items:start">
          <div>
            <p style="color:${TEXT_DARK};font-size:clamp(1.6rem,3vw,3rem);font-weight:300;line-height:1.0;letter-spacing:-0.03em;margin:0">${label}</p>
          </div>
          <div style="border-top:1px solid rgba(26,26,27,0.09)">
            ${defItems.join('')}
          </div>
        </div>`;

      } else {
        // H3 слева, параграф справа
        const paraText = nonEmpty
          .filter(l => !l.startsWith('#') && !l.startsWith('-'))
          .join(' ')
          .replace(/\*\*(.*?)\*\*/g, `<strong style="color:${TEXT_DARK};font-weight:500">$1</strong>`);
        html += `<div class="ac-row">
          <p style="color:${TEXT_DARK};font-size:clamp(1.4rem,2.4vw,2.1rem);font-weight:300;line-height:1.2;letter-spacing:-0.02em;margin:0">${label}</p>
          <p style="color:rgba(26,26,27,0.62);font-size:clamp(1rem,1.55vw,1.2rem);font-weight:300;line-height:1.85;margin:0">${paraText}</p>
        </div>`;
      }
      continue;
    }

    // Standalone bold+description (вне H3)
    const boldMatch = line.match(/^\*\*(.+)\*\*$/);
    if (boldMatch) {
      const title = boldMatch[1];
      i++;
      const descLines: string[] = [];
      while (i < lines.length) {
        const next = lines[i].trim();
        if (!next || next.startsWith('**') || next.startsWith('#')) break;
        descLines.push(next);
        i++;
      }
      const desc = descLines.join(' ');
      html += `<div class="ac-defrow">
        <p style="color:${TEXT_DARK};font-size:clamp(1.05rem,1.6vw,1.35rem);font-weight:500;line-height:1.3;margin:0;letter-spacing:-0.01em">${title}</p>
        ${desc ? `<p style="color:rgba(26,26,27,0.52);font-size:clamp(1rem,1.5vw,1.2rem);font-weight:300;line-height:1.8;margin:0">${desc}</p>` : ''}
      </div>`;
      continue;
    }

    // Обычный абзац
    const para = lines[i].replace(/\*\*(.*?)\*\*/g,
      `<strong style="color:${TEXT_DARK};font-weight:500">$1</strong>`);
    html += `<p style="color:rgba(26,26,27,0.62);font-size:clamp(1rem,1.55vw,1.2rem);line-height:1.9;font-weight:300;margin:0 0 1em">${para}</p>`;
    i++;
  }

  return html;
}

// ── Shared section label (matches ProductInfoSection pattern) ─────────────────
const SLabel = ({ n, text }: { n: string; text: string }) => (
  <div className="flex items-center gap-4 mb-10 md:mb-14">
    <span className="h-px w-10 shrink-0" style={{ background: TEXT_DARK, opacity: 0.25 }} />
    <span
      className="font-mono text-[10px] uppercase tracking-[0.45em]"
      style={{ color: TEXT_DARK, opacity: 0.45 }}
    >
      {n} · {text}
    </span>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
const ArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? getArticleBySlug(slug) : null;
  if (!article) return <Navigate to="/404" replace />;

  const relatedProducts = products.filter(p =>
    article.relatedProducts?.some(rp => p.id.includes(rp) || p.fraction.includes(rp))
  );

  const descWords = article.shortDescription.split(' ');
  const accentWord = descWords.slice(0, 2).join(' ');
  const descRest   = descWords.slice(2).join(' ');

  return (
    <main style={{ background: BG_PAGE }}>

      {/* ══════════════════════════════════════════════════════════════════════
          HERO — фото + только заголовок (мелкий текст убран)
         ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative h-screen overflow-hidden bg-black">
        <img
          src={article.image}
          alt={article.title}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Локальное затемнение под заголовком — без резкого градиента */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 90% 70% at 10% 92%, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.3) 50%, transparent 80%)',
          }}
        />
        {/* Тонкая виньетка сверху — хедер читается */}
        <div
          aria-hidden
          className="absolute top-0 left-0 right-0 h-36 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.35), transparent)' }}
        />

        <div className="relative z-10 h-full px-6 sm:px-10 lg:px-[1cm] pt-[1cm] pb-[1cm] flex flex-col">
          {/* Заголовок — у нижнего левого края */}
          <div className="mt-auto">
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.05, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-white leading-[1.0] max-w-5xl"
              style={{
                fontWeight: 200,
                fontSize: 'clamp(2.4rem, 6vw, 5.5rem)',
                letterSpacing: '-0.02em',
              }}
            >
              {article.title}
            </motion.h1>

            <motion.div
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.7, duration: 0.8, ease: 'easeOut' }}
              className="mt-8 h-px w-28"
              style={{ background: 'rgba(255,255,255,0.22)' }}
            />
          </div>

          {/* Scroll indicator — правый нижний угол */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.7 }}
            className="absolute bottom-[1cm] right-[1cm] flex items-center gap-3"
            style={{ color: 'rgba(255,255,255,0.45)' }}
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] font-light">
              Прокрутить
            </span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 2.0, ease: 'easeInOut' }}
            >
              <ArrowDown className="w-4 h-4" strokeWidth={1.25} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          01 — INTRO / PULL QUOTE
         ══════════════════════════════════════════════════════════════════════ */}
      <section
        className="px-6 sm:px-10 lg:px-[1cm] pt-20 md:pt-28 pb-20 md:pb-28"
        style={{ background: BG_PAGE, borderBottom: '1px solid rgba(26,26,27,0.1)' }}
      >
        <ScrollReveal type="fade-up">
          <SLabel n="01" text="О применении" />
        </ScrollReveal>

        <ScrollReveal type="fade-up" delay={0.05}>
          <div className="flex gap-6 lg:gap-10 max-w-5xl">
            <div
              className="w-[3px] shrink-0 self-stretch rounded-full"
              style={{ background: RED }}
            />
            <p
              className="font-light leading-[1.3]"
              style={{
                fontSize: 'clamp(1.4rem, 2.6vw, 2.4rem)',
                color: TEXT_DARK,
                letterSpacing: '-0.015em',
              }}
            >
              <span style={{ color: RED }}>{accentWord} </span>
              {descRest}
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          02 + 03 — ЕДИНЫЙ БЛОК: Подходящие фракции + Контент
                    Общий фон BG_ALT с SVG-дюнами внизу
         ══════════════════════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden" style={{ background: BG_ALT }}>

        {/* ── SVG: дюны по всей высоте блока ──────────────────────────────── */}
        <svg
          aria-hidden
          className="absolute inset-0 w-full h-full pointer-events-none select-none"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* 9 гребней от верха до низа — дальние прозрачнее, ближние плотнее */}
          <path d="M0,75  C200,50  400,90  600,62  C800,34  1000,72 1200,48  C1360,30  1420,46  1440,42  L1440,900 L0,900 Z"
            fill="#1A1A1B" fillOpacity="0.016"/>
          <path d="M0,175 C180,148 360,182 560,158 C760,134 920,170 1100,148 C1280,126 1380,150 1440,144 L1440,900 L0,900 Z"
            fill="#1A1A1B" fillOpacity="0.021"/>
          <path d="M0,275 C170,250 345,280 545,258 C745,236 905,268 1100,248 C1295,228 1385,252 1440,244 L1440,900 L0,900 Z"
            fill="#1A1A1B" fillOpacity="0.027"/>
          <path d="M0,375 C165,352 340,378 540,358 C740,338 900,366 1100,348 C1300,330 1385,352 1440,344 L1440,900 L0,900 Z"
            fill="#1A1A1B" fillOpacity="0.034"/>
          <path d="M0,470 C175,448 350,474 550,455 C750,436 908,462 1106,446 C1304,430 1388,450 1440,443 L1440,900 L0,900 Z"
            fill="#1A1A1B" fillOpacity="0.041"/>
          <path d="M0,562 C182,542 358,566 558,549 C758,532 914,556 1112,542 C1310,528 1390,546 1440,540 L1440,900 L0,900 Z"
            fill="#1A1A1B" fillOpacity="0.049"/>
          <path d="M0,650 C188,632 364,655 564,640 C764,625 918,648 1116,636 C1314,624 1390,640 1440,635 L1440,900 L0,900 Z"
            fill="#1A1A1B" fillOpacity="0.057"/>
          <path d="M0,735 C185,720 362,740 562,728 C762,716 916,736 1116,726 C1316,716 1390,730 1440,725 L1440,900 L0,900 Z"
            fill="#1A1A1B" fillOpacity="0.066"/>
          <path d="M0,820 C190,808 365,824 565,814 C765,804 918,820 1116,812 C1316,804 1390,816 1440,812 L1440,900 L0,900 Z"
            fill="#1A1A1B" fillOpacity="0.075"/>
        </svg>

        {/* ══ 02 — ПОДХОДЯЩИЕ ФРАКЦИИ ══════════════════════════════════════ */}
        {relatedProducts.length > 0 && (
          <section
            className="relative z-10 px-6 sm:px-10 lg:px-[1cm] pt-20 md:pt-28 pb-20 md:pb-28"
            style={{ borderBottom: '1px solid rgba(26,26,27,0.1)' }}
          >
            <ScrollReveal type="fade-up">
              <div className="flex items-end justify-between mb-0">
                <div>
                  <h2
                    className="font-light"
                    style={{
                      fontSize: 'clamp(1.8rem, 3.5vw, 3rem)',
                      color: TEXT_DARK,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    Подходящие фракции
                  </h2>
                </div>
                <Link
                  to="/catalog"
                  className="hidden lg:inline-flex items-center gap-2 text-sm transition-colors mb-1"
                  style={{ color: 'rgba(26,26,27,0.4)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = TEXT_DARK)}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(26,26,27,0.4)')}
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em]">Весь каталог</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </ScrollReveal>

            <div
              className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
              style={{ borderTop: '1px solid rgba(26,26,27,0.15)' }}
            >
              {relatedProducts.map((product, i) => (
                <ScrollReveal key={product.id} type="fade-up" delay={i * 0.07}>
                  <Link
                    to={`/product/${product.slug}`}
                    className="group relative block py-10 overflow-hidden"
                    style={{
                      borderBottom: '1px solid rgba(26,26,27,0.15)',
                      boxShadow: i > 0 ? 'inset 1px 0 0 rgba(26,26,27,0.15)' : 'none',
                      paddingRight: '1.5rem',
                      paddingLeft: i > 0 ? '1.75rem' : '0',
                    }}
                  >
                    <span
                      className="absolute top-5 right-0 font-mono text-[10px] tracking-[0.15em]"
                      style={{ color: TEXT_DARK, opacity: 0.25 }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>

                    <div className="flex items-baseline gap-2">
                      <span
                        className="group-hover:text-brand-red transition-colors leading-none"
                        style={{
                          color: TEXT_DARK,
                          fontWeight: 200,
                          fontSize: 'clamp(2rem, 4vw, 3.25rem)',
                          letterSpacing: '-0.03em',
                        }}
                      >
                        {product.fraction.replace(' мм', '')}
                      </span>
                      <span
                        className="font-mono"
                        style={{ color: TEXT_DARK, opacity: 0.3, fontSize: '0.7rem', letterSpacing: '0.12em' }}
                      >
                        мм
                      </span>
                    </div>

                    <div className="mt-5 space-y-1.5">
                      <p className="font-mono text-xs" style={{ color: TEXT_DARK, opacity: 0.38 }}>
                        {product.gost}
                      </p>
                      {product.specifications?.['SiO₂'] && (
                        <p className="text-xs font-light" style={{ color: TEXT_DARK, opacity: 0.5 }}>
                          SiO₂ {product.specifications['SiO₂']}
                        </p>
                      )}
                      <p className="text-xs font-light" style={{ color: TEXT_DARK, opacity: 0.5 }}>
                        {product.packaging.join(' · ')}
                      </p>
                    </div>

                    <div className="mt-8">
                      <span
                        className="relative inline-flex items-center justify-between overflow-hidden"
                        style={{ border: `1px solid rgba(26,26,27,0.18)`, padding: '0.6rem 1rem', color: TEXT_DARK }}
                      >
                        <span
                          className="absolute inset-0 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                          style={{ background: RED }}
                          aria-hidden
                        />
                        <span className="relative z-10 font-mono text-[10px] tracking-[0.3em] uppercase transition-colors duration-500 group-hover:text-white">
                          Перейти
                        </span>
                        <ArrowUpRight
                          className="relative z-10 w-3.5 h-3.5 ml-2.5 transition-all duration-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          strokeWidth={1.5}
                        />
                      </span>
                    </div>

                    <span
                      className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500"
                      style={{ background: RED }}
                      aria-hidden
                    />
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </section>
        )}

        {/* ══ 03 — КОНТЕНТ ═════════════════════════════════════════════════ */}
        <section className="relative z-10 px-6 sm:px-10 lg:px-[1cm] pt-20 md:pt-28 pb-24 md:pb-40">

          <ScrollReveal type="fade-up" delay={0.04}>
            <div dangerouslySetInnerHTML={{ __html: renderContent(article.content) }} />
          </ScrollReveal>

          <ScrollReveal type="fade-up" delay={0.06}>
            <div
              className="mt-20 pt-10 flex flex-col sm:flex-row sm:items-center gap-8 sm:justify-between"
              style={{ borderTop: '1px solid rgba(26,26,27,0.1)' }}
            >
              <Link
                to="/articles"
                className="inline-flex items-center gap-3 shrink-0 transition-colors"
                style={{ color: 'rgba(26,26,27,0.32)' }}
                onMouseEnter={e => (e.currentTarget.style.color = TEXT_DARK)}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(26,26,27,0.32)')}
              >
                <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
                <span className="font-mono text-[10px] uppercase tracking-[0.3em]">Все применения</span>
              </Link>

              {relatedProducts.length > 0 && (
                <div className="flex flex-wrap items-baseline gap-x-7 gap-y-2">
                  <span
                    className="font-mono text-[9px] uppercase tracking-[0.4em] shrink-0"
                    style={{ color: TEXT_DARK, opacity: 0.22 }}
                  >
                    Фракции:
                  </span>
                  {relatedProducts.map((p, i) => (
                    <span key={p.id} className="inline-flex items-baseline gap-2">
                      <Link
                        to={`/product/${p.slug}`}
                        className="group inline-flex items-baseline gap-1 transition-colors"
                        style={{ color: 'rgba(26,26,27,0.38)' }}
                        onMouseEnter={e => (e.currentTarget.style.color = RED)}
                        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(26,26,27,0.38)')}
                      >
                        <span style={{ fontWeight: 200, fontSize: 'clamp(1.05rem, 1.5vw, 1.2rem)', letterSpacing: '-0.02em' }}>
                          {p.fraction}
                        </span>
                      </Link>
                      {i < relatedProducts.length - 1 && (
                        <span style={{ color: 'rgba(26,26,27,0.14)', fontSize: '0.75rem' }}>·</span>
                      )}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </ScrollReveal>

        </section>

      </div>{/* /unified dune block */}

      {/* ══════════════════════════════════════════════════════════════════════
          04 — CTA (тёмная, крупная типографика)
         ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: '#0d0d0d' }}>

        {/* Фоновое слово — призрак тега */}
        <div
          aria-hidden
          className="absolute inset-0 flex items-center justify-end pointer-events-none select-none pr-[1cm]"
        >
          <span
            className="font-light leading-none whitespace-nowrap"
            style={{
              fontSize: 'clamp(6rem, 18vw, 18rem)',
              fontWeight: 200,
              letterSpacing: '-0.04em',
              color: 'rgba(255,255,255,0.028)',
            }}
          >
            {article.tags[0]}
          </span>
        </div>

        <div className="relative z-10 px-6 sm:px-10 lg:px-[1cm] py-20 lg:py-32">

          {/* Label */}
          <div className="flex items-center gap-4 mb-14">
            <span className="h-px w-10 shrink-0" style={{ background: 'rgba(255,255,255,0.15)' }} />
            <span className="font-mono text-[10px] uppercase tracking-[0.45em]" style={{ color: 'rgba(255,255,255,0.25)' }}>
              04 · Заявка
            </span>
          </div>

          {/* Heading — большая тонкая */}
          <ScrollReveal type="fade-up">
            <h2
              className="leading-[1.0] mb-14"
              style={{
                fontWeight: 200,
                fontSize: 'clamp(2.2rem, 6vw, 5.5rem)',
                letterSpacing: '-0.03em',
                color: 'rgba(255,255,255,0.35)',
                maxWidth: '18ch',
              }}
            >
              Нужен кварцевый<br />
              песок для{' '}
              <span style={{ color: 'rgba(255,255,255,0.75)' }}>{article.tags[0]}</span>
              <span style={{ color: RED }}>?</span>
            </h2>
          </ScrollReveal>

          {/* CTA row */}
          <ScrollReveal type="fade-up" delay={0.06}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

              <SweepBtn to="/contacts" light>Связаться с нами</SweepBtn>
              <SweepBtn to="/catalog" light>Весь каталог</SweepBtn>

            </div>
          </ScrollReveal>
        </div>
      </section>

    </main>
  );
};

export default ArticlePage;
