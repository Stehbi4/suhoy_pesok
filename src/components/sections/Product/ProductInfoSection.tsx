import { ArrowUpRight, ZoomIn } from 'lucide-react';
import { BG_PAGE, TEXT_DARK, RED } from '@/styles/theme';
import ScrollReveal from '@/components/ui/ScrollReveal';
import type { Product } from './types';

interface Props {
  product: Product;
  galleryImages: string[];
  setLightboxIdx: (i: number) => void;
}

/**
 * Editorial info section — вариант B «horizontal plate».
 * Всё вертикально с ритмом:
 *  1) рубрика + описание
 *  2) горизонтальный ряд 3 портретных фото
 *  3) горизонтальный ряд 3 крупных характеристик
 *  4) PDF-ссылка справа
 */
export const ProductInfoSection = ({ product, galleryImages, setLightboxIdx }: Props) => {
  const img = product.images;
  const sio2Value = product.technicalData?.['Содержание оксида кремния (SiO₂), %, не менее'] || 85;
  const docPath = `/doc_sand/Фракция ${product.fraction}.pdf`;

  const photos = galleryImages.map((src, i) => ({ src, idx: i }));

  const specs = [
    { num: `≥${sio2Value}`, unit: '%', label: 'SiO₂',             desc: 'Содержание диоксида кремния' },
    { num: 'R',             unit: '',  label: 'Окатанное зерно',   desc: 'Минимальное сопротивление потоку' },
    { num: '≤0,5',          unit: '%', label: 'Влажность',         desc: 'Сухой для любых задач' },
  ];

  return (
    <section className="py-28 lg:py-40 relative" style={{ background: BG_PAGE }}>
      <div className="px-6 sm:px-10 lg:px-[1cm]">

        {/* 1. Рубрика + описание */}
        <ScrollReveal type="fade-up">
          <div className="flex items-center gap-4 mb-12">
            <span className="h-px w-10" style={{ background: TEXT_DARK, opacity: 0.35 }} />
            <span
              className="text-[10px] uppercase tracking-[0.45em]"
              style={{ color: TEXT_DARK, opacity: 0.55 }}
            >
              01 · О материале
            </span>
          </div>
        </ScrollReveal>

        <ScrollReveal type="slide-left" delay={0.05}>
          <p
            className="leading-[1.3] max-w-5xl mb-24 lg:mb-32"
            style={{
              color: TEXT_DARK,
              fontWeight: 300,
              fontSize: 'clamp(1.35rem, 2.2vw, 2.25rem)',
              letterSpacing: '-0.01em',
            }}
          >
            {product.description}
          </p>
        </ScrollReveal>

        {/* 2. Ряд 3 портретных фото */}
        <ScrollReveal type="fade-up" delay={0.05}>
          <div className="mb-24 lg:mb-32">
            {/* мини-рубрика ряда */}
            <div className="flex items-center justify-between mb-6">
              <span
                className="text-[10px] uppercase tracking-[0.45em]"
                style={{ color: TEXT_DARK, opacity: 0.45 }}
              >
                02 · Материал в деталях
              </span>
              <span
                className="text-[10px] font-mono tracking-[0.2em]"
                style={{ color: TEXT_DARK, opacity: 0.35 }}
              >
                03 · фото
              </span>
            </div>

            <div
              className={`grid gap-4 lg:gap-6 grid-cols-1 ${photos.length === 4 ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-3'}`}
            >
              {photos.map((p, i) => (
                <figure
                  key={i}
                  className="relative group cursor-zoom-in"
                  onClick={() => setLightboxIdx(p.idx)}
                >
                  <div
                    className="relative overflow-hidden"
                    style={{ aspectRatio: '3 / 4' }}
                  >
                    <img
                      src={p.src}
                      alt={`${product.shortName} — ${String(i + 1).padStart(2, '0')}`}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.04]"
                    />
                    <ZoomIn
                      className="absolute top-4 right-4 w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-md"
                      strokeWidth={1.5}
                    />
                  </div>
                  {/* подпись ПОД фото — только номер */}
                  <figcaption className="mt-3 flex items-baseline gap-4">
                    <span
                      className="font-mono tracking-[0.15em]"
                      style={{ color: TEXT_DARK, opacity: 0.55, fontSize: '1rem', fontWeight: 400 }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="flex-1 h-px" style={{ background: TEXT_DARK, opacity: 0.15 }} />
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* 3. Ряд 3 крупных характеристик — full-width */}
        <ScrollReveal type="fade-up" delay={0.05}>
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-10">
              <span className="h-px w-10" style={{ background: TEXT_DARK, opacity: 0.35 }} />
              <span
                className="text-[10px] uppercase tracking-[0.45em]"
                style={{ color: TEXT_DARK, opacity: 0.55 }}
              >
                03 · Характеристики
              </span>
            </div>

            <div
              className="grid grid-cols-1 md:grid-cols-3"
              style={{ borderTop: '1px solid rgba(26,26,27,0.15)' }}
            >
              {specs.map((s, i) => (
                <div
                  key={s.label}
                  className="py-10 md:py-14 md:pr-8 md:first:pr-8 md:last:pr-0 relative"
                  style={{
                    borderBottom: '1px solid rgba(26,26,27,0.15)',
                    // вертикальный хайрлайн между колонками (десктоп)
                    boxShadow: i > 0 ? 'inset 1px 0 0 rgba(26,26,27,0.15)' : 'none',
                    paddingLeft: i > 0 ? '2rem' : '0',
                  }}
                >
                  {/* индекс в углу */}
                  <span
                    className="absolute top-4 right-4 text-[10px] font-mono tracking-[0.15em]"
                    style={{ color: TEXT_DARK, opacity: 0.3 }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  {/* огромный тонкий номер */}
                  <div className="flex items-baseline gap-2">
                    <span
                      style={{
                        color: TEXT_DARK,
                        fontWeight: 200,
                        fontSize: 'clamp(3rem, 6vw, 5.5rem)',
                        letterSpacing: '-0.03em',
                        lineHeight: 1,
                      }}
                    >
                      {s.num}
                    </span>
                    {s.unit && (
                      <span
                        style={{
                          color: TEXT_DARK,
                          opacity: 0.5,
                          fontWeight: 300,
                          fontSize: 'clamp(1rem, 1.4vw, 1.25rem)',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {s.unit}
                      </span>
                    )}
                  </div>

                  {/* лейбл + описание */}
                  <p
                    className="mt-6 text-sm tracking-[0.12em] uppercase"
                    style={{ color: TEXT_DARK, fontWeight: 500 }}
                  >
                    {s.label}
                  </p>
                  <p
                    className="mt-2 text-sm leading-snug max-w-xs"
                    style={{ color: TEXT_DARK, opacity: 0.55, fontWeight: 300 }}
                  >
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* 4. PDF — справа, text-link */}
        <ScrollReveal type="fade-up" delay={0.1}>
          <div className="flex justify-end">
            <a
              href={docPath}
              download
              className="group inline-flex items-center gap-4"
              style={{ color: TEXT_DARK }}
            >
              <span
                className="text-[10px] uppercase tracking-[0.45em]"
                style={{ opacity: 0.45 }}
              >
                Полная спецификация
              </span>
              <span
                className="relative text-base tracking-wide"
                style={{ fontWeight: 400 }}
              >
                Скачать PDF
                <span
                  aria-hidden
                  className="absolute left-0 -bottom-1 h-px w-full origin-left scale-x-100 transition-transform duration-500 group-hover:scale-x-0"
                  style={{ background: 'currentColor', opacity: 0.4 }}
                />
                <span
                  aria-hidden
                  className="absolute left-0 -bottom-1 h-px w-full origin-right scale-x-0 transition-transform duration-500 delay-[50ms] group-hover:scale-x-100"
                  style={{ background: RED }}
                />
              </span>
              <ArrowUpRight
                className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
                strokeWidth={1.5}
              />
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
