import HeroScrollSection from '@/components/sections/HeroLab/HeroScrollSection';
import StatsStripSection from '@/components/sections/Home/StatsStripSection';
import ImageSection from '@/components/sections/Home/ImageSection';
import FractionsGallerySection from '@/components/sections/Home/FractionsGallerySection';
import ProductInfoSection from '@/components/sections/Home/ProductInfoSection';
import AdvantagesSection from '@/components/sections/Home/AdvantagesSection';
import CTAHomeSection from '@/components/sections/Home/CTAHomeSection';

const HeroLabPage = () => {
  return (
    <main className="bg-brand-bg">
      <HeroScrollSection />
      <StatsStripSection />
      <ProductInfoSection />
      <ImageSection />
      <FractionsGallerySection />
      <AdvantagesSection />
      <CTAHomeSection />
    </main>
  );
};

export default HeroLabPage;
