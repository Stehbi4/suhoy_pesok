import { Download, Truck, Package } from 'lucide-react';
import { BG_ALT, TEXT_DARK } from '@/styles/theme';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { LiquidGlassCard } from './ProductCards';
import type { Product } from './types';

export const ProductPackagingSection = ({ product }: { product: Product }) => {
  const docPath = `/doc_sand/Фракция ${product.fraction}.pdf`;

  return (
    <section className="py-20 lg:py-24" style={{ background: BG_ALT, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
      <div className="px-6 sm:px-10 lg:px-[1cm]">
        <div className="grid lg:grid-cols-2 gap-16">
          <ScrollReveal type="slide-left">
            <h2 className="text-3xl font-bold tracking-tighter mb-10" style={{ color: TEXT_DARK }}>Упаковка и отгрузка</h2>
            <div className="grid grid-cols-2 gap-5">
              {[
                { Icon: Truck,   title: 'Навал', desc: 'Самосвал / полуприцеп' },
                { Icon: Package, title: 'МКР',   desc: 'Биг-бэг ≈ 1 тонна' },
              ].map(({ Icon, title, desc }) => (
                <LiquidGlassCard key={title} className="rounded-2xl p-7">
                  <Icon className="w-6 h-6 mb-5" style={{ color: TEXT_DARK, opacity: 0.55 }} />
                  <h3 className="text-lg font-semibold mb-2" style={{ color: TEXT_DARK }}>{title}</h3>
                  <p className="text-sm text-gray-400">{desc}</p>
                </LiquidGlassCard>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal type="slide-right" delay={0.1}>
            <h2 className="text-3xl font-bold tracking-tighter mb-10" style={{ color: TEXT_DARK }}>Документация</h2>
            <div className="space-y-3">
              {[
                { name: 'Паспорт качества',            file: docPath },
                { name: `Сертификат ${product.gost}`,  file: docPath },
                { name: 'Лабораторное заключение',     file: docPath },
              ].map((doc) => (
                <a key={doc.name} href={doc.file} download
                  className="flex items-center justify-between rounded-2xl px-7 py-5 group card-hover border border-black/[0.07] hover:border-brand-red/30"
                  style={{ background: 'rgba(255,255,255,0.7)' }}
                >
                  <span className="text-sm font-medium" style={{ color: TEXT_DARK }}>{doc.name}</span>
                  <Download className="w-4 h-4 text-gray-400 group-hover:text-brand-dark transition-colors" />
                </a>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
