import HeroSection from '@/components/sections/Home/HeroSection';
import ProductInfoSection from '@/components/sections/Home/ProductInfoSection';
import ProductionSection from '@/components/sections/Home/ProductionSection';
import ImageSection from '@/components/sections/Home/ImageSection';
import QualitySection from '@/components/sections/Home/QualitySection';
import LogisticsSection from '@/components/sections/Home/LogisticsSection';
import AdvantagesSection from '@/components/sections/Home/AdvantagesSection';
import ProductInfoSection2 from '@/components/sections/Home/ProductInfoSection2';


const HomePage = () => {
  return (
    <main className="bg-[#0a0a0a]">
      <HeroSection />
      <ImageSection/>
      <ProductInfoSection />
      <ProductionSection />
      <QualitySection />
      <LogisticsSection />
      <AdvantagesSection /> 
      <ProductInfoSection2 />
      
    </main>
  );
};

export default HomePage;
