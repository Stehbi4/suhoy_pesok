import { Link } from 'react-router-dom';
import { ArrowUpRight, ZoomIn } from 'lucide-react';
import { BG_PAGE, TEXT_DARK, RED } from '@/styles/theme';
import ScrollReveal from '@/components/ui/ScrollReveal';
import type { Product } from './types';

interface Props {
  product: Product;
  galleryImages: string[];
  setLightboxIdx: (i: number) => void;
}

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
          <div className="flex flex-col lg:flex-row lg:items-start gap-12 lg:gap-16 mb-24 lg:mb-32">

            {/* Основной текст */}
            <p
              className="leading-[1.3] lg:flex-1"
              style={{
                color: TEXT_DARK,
                fontWeight: 300,
                fontSize: 'clamp(1.35rem, 2.2vw, 2.25rem)',
                letterSpacing: '-0.01em',
              }}
            >
              {product.description}
            </p>

            {/* CTA-карточка */}
            <div
              className="shrink-0 lg:w-[272px] xl:w-[300px]"
              style={{ borderTop: `2px solid ${RED}` }}
            >
              <div className="pt-6 flex flex-col">

                {/* Метка */}
                <p
                  className="font-mono text-[9px] tracking-[0.5em] uppercase mb-7"
                  style={{ color: TEXT_DARK, opacity: 0.4 }}
                >
                  Запрос информации
                </p>

                {/* Заголовок */}
                <p
                  className="font-light leading-[1.15] mb-5"
                  style={{
                    color: TEXT_DARK,
                    fontWeight: 300,
                    fontSize: 'clamp(1.4rem, 1.6vw, 1.75rem)',
                    letterSpacing: '-0.01em',
                  }}
                >
                  Получите условия<br />поставки
                </p>

                {/* Подпись */}
                <p
                  className="text-sm leading-relaxed mb-9"
                  style={{ color: TEXT_DARK, opacity: 0.45, fontWeight: 300, lineHeight: 1.6 }}
                >
                  Технические характеристики, объёмы и индивидуальные условия поставки
                </p>

                {/* Кнопка */}
                <Link
                  to="/contacts"
                  className="btn-primary rounded-lg inline-flex items-center gap-3"
                >
                  <span>Связаться с нами</span>
                  <ArrowUpRight className="w-4 h-4" strokeWidth={1.5} />
                </Link>

              </div>
            </div>

          </div>
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
      </div>
    </section>
  );
};
