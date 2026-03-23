// LogisticsSection.tsx
import { CheckCircle2 } from 'lucide-react';

const LogisticsSection = () => {
  const features = [
    'Собственный специализированный транспорт',
    'Доставка в Санкт-Петербурге и ЛО',
    'Навалом или в МКР (биг-бэгах)',
    'Гибкие условия поставок',
    'Точные сроки доставки',
    'Большие объемы без проблем',
  ];

  return (
    <section className="py-16 md:py-20 bg-black relative overflow-hidden">
      <div className="mx-auto px-4 lg:px-[1cm] relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Image */}
          <div className="relative order-2 lg:order-1">
            <div className="relative">
              {/* Decorative frame */}
              <div className="absolute -top-4 -left-4 w-24 h-24 border-l-2 border-t-2 border-white" />  {/* Изменено на белый */}
              
              <img
                src="/transport.jpg"
                alt="Логистика и доставка"
                className="w-full h-[400px] lg:h-[550px] object-cover rounded-lg"
              />
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/60 to-transparent rounded-lg" />
            </div>
            
            {/* Floating Badge */}
            <div className="absolute -bottom-4 -right-4 bg-[#f80000] text-white p-5 rounded-lg">
              <div className="text-3xl font-light">24/7</div>
              <div className="text-sm text-white/80 tracking-wider uppercase">Доставка</div>
            </div>
          </div>
          {/* Content */}
          <div className="order-1 lg:order-2">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-px bg-white" />
              <span className="text-gray-400 text-sm tracking-[0.3em] uppercase font-medium">
                Доставка
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight mb-6">
              Логистика и
              <br />
              <span className="text-white font-medium">Доставка</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              Собственный специализированный транспорт для оперативной доставки.
              Доставляем в Санкт-Петербурге и Ленинградской области навалом или в
              МКР (биг-бэгах). Гибкие условия, точные сроки, большие объемы без проблем.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-[#111111] border border-[#222222] card-hover hover:border-[#f80000]/30"
                >
                  <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
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

export default LogisticsSection;