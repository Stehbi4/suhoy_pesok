import HeroSection from '@/components/sections/Home/HeroSection';
import StatsStripSection from '@/components/sections/Home/StatsStripSection';
import ApplicationsHomeSection from '@/components/sections/Home/ApplicationsHomeSection';
import ImageSection from '@/components/sections/Home/ImageSection';
import FractionsGallerySection from '@/components/sections/Home/FractionsGallerySection';
import ProductInfoSection from '@/components/sections/Home/ProductInfoSection';
import AdvantagesSection from '@/components/sections/Home/AdvantagesSection';
import CTAHomeSection from '@/components/sections/Home/CTAHomeSection';


const HomePage = () => {
  return (
    <main className="bg-brand-bg">

      {/* ═══════════════════════════════════════════════════════════════════════
          1. HERO  —  2 экрана · фон · заголовок · CTA-кнопки · цитата
          Файл: src/components/sections/Home/HeroSection.tsx
         ═══════════════════════════════════════════════════════════════════════ */}
      <HeroSection />

      {/* ═══════════════════════════════════════════════════════════════════════
          2. STATS STRIP  —  4 ключевых показателя
          Файл: src/components/sections/Home/StatsStripSection.tsx
         ═══════════════════════════════════════════════════════════════════════ */}
      <StatsStripSection />

      {/* ═══════════════════════════════════════════════════════════════════════
          3. PRODUCT INFO  —  чёрный фон · большой текст · CTA
          Файл: src/components/sections/Home/ProductInfoSection.tsx
         ═══════════════════════════════════════════════════════════════════════ */}
      <ProductInfoSection />

      {/* ═══════════════════════════════════════════════════════════════════════
          4. СФЕРЫ ПРИМЕНЕНИЯ  —  12 областей · accordion-hover
          Файл: src/components/sections/Home/ApplicationsHomeSection.tsx
         ═══════════════════════════════════════════════════════════════════════ */}
      <ApplicationsHomeSection />

      {/* ═══════════════════════════════════════════════════════════════════════
          5. IMAGE BANNER  —  fullscreen · фото карьера · цитата · параллакс
          Файл: src/components/sections/Home/ImageSection.tsx
         ═══════════════════════════════════════════════════════════════════════ */}
      <ImageSection />

      {/* ═══════════════════════════════════════════════════════════════════════
          6. ФРАКЦИИ  —  4 панели gallery_4.jpg · hover expand 3/4 · 9deg skew
          Файл: src/components/sections/Home/FractionsGallerySection.tsx
         ═══════════════════════════════════════════════════════════════════════ */}
      <FractionsGallerySection />

      {/* ═══════════════════════════════════════════════════════════════════════
          7. ADVANTAGES  —  тёмный фон · 4 карточки · parallax-scroll
          Файл: src/components/sections/Home/AdvantagesSection.tsx
         ═══════════════════════════════════════════════════════════════════════ */}
      <AdvantagesSection />

      {/* ═══════════════════════════════════════════════════════════════════════
          8. CTA HOME  —  чёрный фон · финальный призыв · кнопка в каталог
          Файл: src/components/sections/Home/CTAHomeSection.tsx
         ═══════════════════════════════════════════════════════════════════════ */}
      <CTAHomeSection />  

    </main>
  );
};

export default HomePage;
