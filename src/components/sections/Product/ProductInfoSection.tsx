import { Download, Droplets, Circle, Wind, ZoomIn } from 'lucide-react';
import { BG_PAGE, TEXT_DARK, RED } from '@/styles/theme';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { LiquidGlassCard } from './ProductCards';
import type { Product } from './types';

interface Props {
  product: Product;
  galleryImages: string[];
  setLightboxIdx: (i: number) => void;
}

export const ProductInfoSection = ({ product, galleryImages, setLightboxIdx }: Props) => {
  const img     = product.images;
  const sio2Value = product.technicalData?.['Содержание оксида кремния (SiO₂), %, не менее'] || 85;
  const docPath = `/doc_sand/Фракция ${product.fraction}.pdf`;

  return (
    <section className="py-24 lg:py-32" style={{ background: BG_PAGE }}>
      <div className="px-6 sm:px-10 lg:px-[1cm]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* Left */}
          <div>
            <ScrollReveal type="slide-left">
              <p className="text-[10px] uppercase tracking-[0.35em] text-gray-400 mb-5">О материале</p>
              <p className="text-2xl lg:text-3xl leading-relaxed" style={{ color: TEXT_DARK }}>
                {product.description}
              </p>
            </ScrollReveal>

            <ScrollReveal type="fade-up" delay={0.1} className="mt-20">
              <p className="text-[10px] uppercase tracking-[0.35em] text-gray-400 mb-6">Краткие характеристики</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { Icon: Droplets, title: `≥ ${sio2Value}% SiO₂`, desc: 'Высокое содержание диоксида кремния' },
                  { Icon: Circle,   title: 'Окатанное зерно',       desc: 'Минимальное сопротивление потоку' },
                  { Icon: Wind,     title: 'Влажность ≤ 0,5%',      desc: 'Сухой для любых задач' },
                ].map(({ Icon, title, desc }) => (
                  <LiquidGlassCard key={title} className="rounded-2xl p-7">
                    <Icon className="w-6 h-6 mb-5" style={{ color: TEXT_DARK, opacity: 0.5 }} />
                    <h3 className="text-lg font-semibold mb-2" style={{ color: TEXT_DARK }}>{title}</h3>
                    <p className="text-sm leading-snug text-gray-500">{desc}</p>
                  </LiquidGlassCard>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal type="fade-up" delay={0.2} className="mt-14">
              <p className="text-[10px] uppercase tracking-[0.35em] text-gray-400 mb-5">Спецификация</p>
              <a href={docPath} download
                className="inline-flex items-center gap-3 text-white px-8 py-4 rounded-xl font-semibold tracking-wide transition-colors"
                style={{ background: RED }}
              >
                <Download className="w-5 h-5" />
                Скачать PDF
              </a>
            </ScrollReveal>
          </div>

          {/* Right — sticky gallery */}
          <div className="flex gap-4 h-[85vh] sticky top-[1cm]">
            <div className="flex flex-col gap-4 flex-shrink-0">
              {img.gallery.slice(0, 4).map((src, i) => (
                <div key={i} className="relative group cursor-zoom-in flex-shrink-0" onClick={() => setLightboxIdx(i)}>
                  <img src={src} alt={`${product.shortName} — вид ${i + 1}`}
                    className="w-[120px] h-[140px] object-cover rounded-2xl transition-opacity duration-300 group-hover:opacity-65"
                    style={{ border: '1px solid rgba(0,0,0,0.08)' }}
                  />
                  <ZoomIn className="absolute top-2 right-2 w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
            <div className="relative flex-1 h-full cursor-zoom-in group" onClick={() => setLightboxIdx(galleryImages.length - 1)}>
              <img src={img.main} alt={product.name}
                className="w-full h-full object-cover rounded-3xl transition-opacity duration-300 group-hover:opacity-90"
              />
              <ZoomIn className="absolute top-4 right-4 w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
