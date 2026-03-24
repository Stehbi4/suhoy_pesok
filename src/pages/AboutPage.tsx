import HeritageSection from '@/components/sections/About/HeritageSection';
import ActivitiesSection from '@/components/sections/About/ActivitiesSection';
import PositioningSection from '@/components/sections/About/PositioningSection';
import PhotoAlbumSection from '@/components/sections/About/PhotoAlbumSection';
import PartnersSection from '@/components/sections/About/PartnersSection';

const AboutPage = () => {
  return (
    <main className="bg-[#0a0a0a] text-white">
      {/* 01 — Наследие (горизонтальный скролл-таймлайн) */}
      <HeritageSection />

      {/* 02 — Наша деятельность */}
      <ActivitiesSection />

      {/* 03 — Позиционирование + CTA */}
      <PositioningSection />

      {/* 04 — Фотоальбом (Фибоначчи) */}
      <PhotoAlbumSection />

      {/* 05 — Партнёры */}
      <PartnersSection />
    </main>
  );
};

export default AboutPage;
