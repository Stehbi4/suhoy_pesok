import { useParams, Link } from 'react-router-dom';
import { ArrowUpRight, ArrowLeft } from 'lucide-react';
import { getArticleBySlug, products } from '@/data/articles';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { RED, BG_PAGE, BG_ALT, TEXT_DARK } from '@/styles/theme';

// ── Inline markdown → dark-on-light HTML ─────────────────────────────────────
// Шрифты через clamp() — растут вместе с шириной экрана (2–2.5× от базы)
let _hIdx = 0;
function renderContent(raw: string): string {
  _hIdx = 0;
  return raw
    // ### раньше ##, иначе ## съедает первые два символа ### → артефакт "#"
    .replace(/### (.*)/g,
      `<h3 class="font-medium mt-8 mb-3" style="color:${TEXT_DARK};font-size:clamp(1.15rem,2vw,1.65rem)">$1</h3>`)
    // используем (_match, heading) вместо $1 — $1 в строке из функции не backreference
    .replace(/## (.*)/g, (_match, heading: string) => {
      _hIdx++;
      return `<div class="flex items-baseline gap-5 mt-14 mb-5 pb-4 border-b border-[#d0cfc9]">
        <span class="font-mono text-[10px] tracking-[0.3em] text-gray-400 shrink-0">${String(_hIdx).padStart(2,'0')}</span>
        <h2 class="font-light leading-tight" style="color:${TEXT_DARK};font-size:clamp(1.5rem,2.8vw,2.4rem)">${heading}</h2>
      </div>`;
    })
    .replace(/\*\*(.*?)\*\*/g,
      `<strong class="font-medium" style="color:${TEXT_DARK}">$1</strong>`)
    .replace(/- (.*)/g,
      `<li class="flex items-start gap-3 mb-0.5 list-none text-gray-600">
        <span class="mt-[7px] w-1.5 h-1.5 rounded-full shrink-0" style="background:${RED}"></span>
        <span>$1</span>
      </li>`
    );
}

// ─────────────────────────────────────────────────────────────────────────────
const ArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? getArticleBySlug(slug) : null;

  if (!article) {
    return (
      <main className="min-h-screen pt-24 bg-brand-page flex items-center justify-center">
        <div className="text-center px-6">
          <p className="font-mono text-xs tracking-[0.4em] uppercase text-gray-400 mb-4">404</p>
          <h1 className="text-4xl font-light mb-8" style={{ color: TEXT_DARK }}>Статья не найдена</h1>
          <Link to="/articles" className="btn-primary rounded-lg inline-flex items-center gap-2">
            <span>К статьям</span>
            <ArrowUpRight className="w-5 h-5" />
          </Link>
        </div>
      </main>
    );
  }

  const relatedProducts = products.filter(p =>
    article.relatedProducts?.some(rp => p.id.includes(rp) || p.fraction.includes(rp))
  );

  // Split shortDescription: first word(s) until second space for red accent
  const descWords = article.shortDescription.split(' ');
  const accentWord = descWords.slice(0, 2).join(' ');
  const descRest   = descWords.slice(2).join(' ');

  return (
    <main style={{ background: BG_PAGE }}>

      {/* ═══════════════════════════════════════════════════════════════════════
          1. HERO — фото фон + текст поверх с градиентом
         ═══════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[90vh] flex flex-col justify-between pt-24 md:pt-28 pb-10 px-6 sm:px-10 lg:px-[1cm] overflow-hidden">

        {/* Фоновое изображение */}
        <img
          src={article.image}
          alt={article.title}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Градиент: тёмный снизу (под заголовком) → прозрачный сверху */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.25) 100%)',
          }}
        />

        {/* Top row: breadcrumb + метка */}
        <div className="relative z-10 flex items-center justify-between">
          

          <ScrollReveal type="fade-up" delay={0.05}>
            <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-white/40 hidden sm:block">
               
            </span>
          </ScrollReveal>
        </div>

        {/* Bottom: теги + гигантский заголовок + линия */}
        <div className="relative z-10 flex flex-col gap-6">
          <ScrollReveal type="fade-up" delay={0.05}>
            <p className="font-mono text-[10px] tracking-[0.5em] uppercase" style={{ color: RED }}>
              {article.tags.join(' · ')}
            </p>
          </ScrollReveal>

          <ScrollReveal type="fade-up" delay={0.1}>
            <h1
              className="font-light leading-[1.05] max-w-5xl text-white"
              style={{ fontSize: 'clamp(2.4rem, 6vw, 5.5rem)' }}
            >
              {article.title}
            </h1>
          </ScrollReveal>

          <ScrollReveal type="fade-up" delay={0.15}>
            <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-px" style={{ background: RED }} />
                <span className="font-mono text-[10px] tracking-widest uppercase text-white/40">
                  Читать далее
                </span>
              </div>
              <div
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center"
              >
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <path d="M7 2v10M3 8l4 4 4-4" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          2. PULL QUOTE — короткое описание большим текстом
         ═══════════════════════════════════════════════════════════════════════ */}
      <section
        className="py-16 md:py-24 px-6 sm:px-10 lg:px-[1cm]"
        style={{ background: BG_ALT, borderBottom: `1px solid #d0cfc9` }}
      >
        <ScrollReveal type="fade-up">
          <p
            className="font-light leading-[1.35] max-w-4xl"
            style={{ fontSize: 'clamp(1.45rem, 2.8vw, 2.5rem)', color: TEXT_DARK }}
          >
            <span style={{ color: RED }}>{accentWord} </span>
            {descRest}
          </p>
        </ScrollReveal>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          3. КОНТЕНТ + САЙДБАР
         ═══════════════════════════════════════════════════════════════════════ */}
      <section className="px-6 sm:px-10 lg:px-[1cm] py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_440px] gap-12 lg:gap-20">

          {/* ── Основной текст ─────────────────────────────────────────────── */}
          <div>
            <ScrollReveal type="fade-up">
              <div
                className="text-gray-600 whitespace-pre-line"
                style={{ fontSize: 'clamp(1rem, 1.8vw, 1.5rem)', lineHeight: 1.8 }}
                dangerouslySetInnerHTML={{ __html: renderContent(article.content) }}
              />
            </ScrollReveal>

            {/* Назад */}
            <ScrollReveal type="fade-up" delay={0.05}>
              <div className="mt-16 pt-8" style={{ borderTop: `1px solid #d0cfc9` }}>
                <Link
                  to="/articles"
                  className="inline-flex items-center gap-2.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Все статьи</span>
                </Link>
              </div>
            </ScrollReveal>
          </div>

          {/* ── Сайдбар ────────────────────────────────────────────────────── */}
          <aside className="flex flex-col gap-8 lg:sticky lg:top-[1cm] lg:self-start">

            {/* Фракции */}
            {relatedProducts.length > 0 && (
              <ScrollReveal type="fade-up" delay={0.1}>
                <div style={{ borderTop: `2px solid ${RED}` }} className="pt-5">
                  <p className="font-mono text-xs tracking-[0.3em] uppercase text-gray-400 mb-5">
                    Подходящие фракции
                  </p>
                  <div className="flex flex-col gap-2">
                    {relatedProducts.map((product) => (
                      <Link
                        key={product.id}
                        to={`/product/${product.slug}`}
                        className="group flex items-center justify-between py-3 px-0"
                        style={{ borderBottom: `1px solid #d0cfc9` }}
                      >
                        <span
                          className="text-base font-light group-hover:text-black transition-colors"
                          style={{ color: TEXT_DARK }}
                        >
                          {product.shortName}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-gray-400">
                            {product.gost}
                          </span>
                          <ArrowUpRight
                            className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ color: RED }}
                          />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* Навигация */}
            <ScrollReveal type="fade-up" delay={0.15}>
              <div style={{ borderTop: `1px solid #d0cfc9` }} className="pt-5">
                <p className="font-mono text-xs tracking-[0.3em] uppercase text-gray-400 mb-5">
                  Разделы
                </p>
                <div className="flex flex-col gap-1">
                  {[
                    { to: '/catalog',  label: 'Каталог продукции' },
                    { to: '/delivery', label: 'Доставка и оплата'  },
                    { to: '/about',    label: 'О компании'         },
                    { to: '/contacts', label: 'Контакты'           },
                  ].map(({ to, label }) => (
                    <Link
                      key={to}
                      to={to}
                      className="group flex items-center justify-between py-3 text-base text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      <span>{label}</span>
                      <ArrowUpRight
                        className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: RED }}
                      />
                    </Link>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </aside>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          4. CTA — тёмный контраст на фоне светлой страницы
         ═══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-black">
        <div className="px-6 sm:px-10 lg:px-[1cm] py-14 lg:py-20 flex flex-col items-start gap-6">
          <ScrollReveal type="fade-up">
            <h2
              className="font-light leading-tight text-gray-400"
              style={{ fontSize: 'clamp(1.4rem, 3.5vw, 3rem)' }}
            >
              Нужен кварцевый песок для{' '}
              <span style={{ color: RED }}>{article.tags[0]}</span>?
            </h2>
          </ScrollReveal>
          <ScrollReveal type="fade-up" delay={0.08}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                to="/contacts"
                className="btn-primary rounded-lg inline-flex items-center justify-center gap-3"
              >
                <span>Связаться с нами</span>
                <ArrowUpRight className="w-5 h-5" />
              </Link>
              <Link
                to="/catalog"
                className="px-6 py-3 border border-gray-700 text-white rounded-lg font-semibold tracking-wide hover:border-brand-red hover:text-white transition-all duration-300 flex items-center justify-center gap-3"
              >
                <span>Смотреть каталог</span>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

    </main>
  );
};

export default ArticlePage;
