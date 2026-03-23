import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductInfoSection2 = () => {
  
  return (
    <section className="relative bg-black overflow-hidden">
      <div className="relative z-10 flex flex-col justify-between px-6 sm:px-10 lg:px-[1cm] py-12 lg:py-16"> 
        <div className="flex-grow flex items-center">
          <div className="grid grid-cols-1 gap-16 lg:gap-24 items-center">
            {/* CTA Section */}
            <div className="w-full px-[2cm] py-16 md:py-20">
              <div className="max-w-4xl">
                <h2 className={`text-4xl md:text-5xl lg:text-6xl font-light leading-tight mb-6 text-gray-500`}>
                  Эффективное решение для вашей отросли.
                </h2>
                <p className={`text-lg max-w-2xl mb-8 text-gray-500`}>
                  Оптимальный ассортимент сухого кварцевого песка для оптимизации бизнес-процессов 
                  и повышения эффективности.
                </p>
                <Link
                  to="/catalog"
                  className="bg-[#f80000] text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#ff3333] transition-colors whitespace-nowrap inline-flex items-center gap-2">
                  <span>В каталог</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductInfoSection2;