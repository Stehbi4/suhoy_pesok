import HeritageSection          from '@/components/sections/About/HeritageSection';
import ActivitiesSection        from '@/components/sections/About/ActivitiesSection';
import QuoteSection             from '@/components/sections/About/QuoteSection';
import PositioningSection       from '@/components/sections/About/PositioningSection';
import ProductionGallerySection from '@/components/sections/About/ProductionGallerySection';
import PartnersSection        from '@/components/sections/About/PartnersSection';
import ProductionSection        from '@/components/sections/About/ProductionSection';
import QualitySection           from '@/components/sections/About/QualitySection';
import LogisticsSection         from '@/components/sections/About/LogisticsSection';
import AboutVariantSwitcher     from '@/components/ui/AboutVariantSwitcher';

const AboutPage = () => {
  return (
    <main className="bg-brand-graphite text-white">
      <AboutVariantSwitcher />

      {/* 01 — Наследие (горизонтальный скролл-таймлайн) */}
      <HeritageSection />

      {/* 02 — Наша деятельность */}
      <ActivitiesSection />

      {/* 03 — Позиционирование + CTA */}
      <PositioningSection />

      {/* 04 — Цитата */}
      <QuoteSection />

      {/* 05 — Производство */}
      <ProductionSection />

      {/* 06 — Контроль качества */}
      <QualitySection />

      {/* 07 — Логистика */}
      <LogisticsSection />

      {/* 08 — Галерея производственного комплекса (3 фото) */}
      <ProductionGallerySection theme="dark" />

      {/* 09 — Партнёры */}
      <PartnersSection theme="dark" />
    </main>
  );
};

export default AboutPage;
