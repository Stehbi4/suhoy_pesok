import { ArrowUpRight } from 'lucide-react';

const ProductInfoSection = () => {
  
  return (
    <section className="relative min-h-screen bg-black overflow-hidden">
      <div className="relative z-10 flex min-h-screen flex-col justify-between px-6 sm:px-10 lg:px-[1cm] py-12 lg:py-16">
        
      <div className="flex-grow flex items-center">
        <div className="grid grid-cols-1 gap-16 lg:gap-24 items-center">
          {/* Content */}
          <div>
                                  
            <p className="text-gray-200 text-4xl sm:text-4xl lg:text-6xl py-8 mb-8">
              <span className="text-7xl text-[#f80000] font-medium">Наш</span> сухой кварцевый песок проходит <br/> многоступенчатую обработку: 
              <br/>
              <br/>
              фракционирование, сушку и очистку. Это обеспечивает  <span className="text-7xl text-[#f80000] font-medium"> стабильное качество   </span>, 
              узкий фракционный состав и минимальное содержание влаги.
            </p>

            {/* CTA */} 
            <div className="pt-10 md:pt-16">
            <div className="flex flex-col justify-end items-end gap-4 sm:flex-row sm:items-end sm:justify-end">
              <a
                href="/catalog"
                className="btn-primary rounded-lg inline-flex items-center justify-center gap-3"
              >
                <span>Смотреть каталог</span>
                <ArrowUpRight className="w-5 h-5" />
              </a>
              <a
                href="/contacts"
                className="px-6 py-3 border border-gray-700 text-white rounded-lg font-semibold tracking-wide hover:border-[#f80000] hover:text-white transition-all duration-300 flex items-center justify-center gap-3"
              >
                <span>Получить консультацию</span>
              </a>
            </div>
          </div>
        </div>
          
        </div>
      </div>
      </div>
    </section>
  );
};

export default ProductInfoSection;