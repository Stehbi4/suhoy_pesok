import HeritageSection from '@/components/sections/About/HeritageSection';
import ActivitiesSection from '@/components/sections/About/ActivitiesSection';
import QuoteSection from '@/components/sections/About/QuoteSection';
import PositioningSection from '@/components/sections/About/PositioningSection';
import PhotoAlbumSection from '@/components/sections/About/PhotoAlbumSection';
import PartnersSection from '@/components/sections/About/PartnersSection';
import ProductionSection from '@/components/sections/About/ProductionSection';
import QualitySection from '@/components/sections/About/QualitySection';
import LogisticsSection from '@/components/sections/About/LogisticsSection';

const AboutPage = () => {
  return (
    <main className="bg-brand-graphite text-white">
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

      {/* 08 — Фотоальбом (Фибоначчи) */}
      <PhotoAlbumSection />

      {/* 09 — Партнёры */}
      <PartnersSection />
    </main>
  );
};

export default AboutPage;
