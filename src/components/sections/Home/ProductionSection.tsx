// ProductionSection.tsx
import { CheckCircle2 } from 'lucide-react';

const ProductionSection = () => {
  const features = [
    'Передовые технологии фракционирования',
    'Современное оборудование для сушки',
    'Многоступенчатая очистка',
    'Полный контроль на всех этапах',
    'Влажность не более 0.5%',
    'Узкий фракционный состав',
  ];

  return (
    <section className="py-16 md:py-20 bg-black relative overflow-hidden">
      <div className="mx-auto px-[1cm] relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Image */}
          <div className="relative order-2 lg:order-1">
            <div className="relative">
              {/* Decorative frame */}
              <div className="absolute -top-3 -left-3 w-20 h-20 border-l-2 border-t-2 border-white" />
              <div className="absolute -bottom-3 -right-3 w-20 h-20 border-r-2 border-b-2 border-[#f80000]" />
              
              <img
                src="/production.jpg"
                alt="Современное производство"
                className="w-full h-[400px] lg:h-[550px] object-cover rounded-lg"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/60 to-transparent rounded-lg" />
            </div>
            
            {/* Floating Badge */}
            <div className="absolute -bottom-4 -right-4 bg-[#f80000] text-white p-5 rounded-lg">
              <div className="text-3xl font-light">25+</div>
              <div className="text-sm text-white/80 tracking-wider uppercase">Лет</div>
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-px bg-white" />
              <span className="text-gray-400 text-sm tracking-[0.3em] uppercase font-medium">
                Наше производство
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight mb-6">
              Современное
              <br />
              <span className="text-white font-medium">Производство</span>
            </h2>

            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              Мы не добываем песок сами — мы берём лучшее сырьё с проверенных карьеров 
              и доводим его до совершенства. <span className="text-3xl text-[#f80000] font-medium"> Наш многолетний опыт </span> лабораторных испытаний 
              и разработки высокотехнологичных ремонтных материалов для бетона позволил 
              нам создать собственную линию сухого кварцевого песка <span className="text-3xl text-[#f80000] font-medium"> с исключительными характеристиками</span>. 
            </p>           
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-[#111111] border border-[#222222] hover:border-[#f80000]/30 transition-colors"
                >
                  <CheckCircle2 className="w-5 h-5 text-whites flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300 text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductionSection;