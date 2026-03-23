// QualitySection.tsx
import { CheckCircle2 } from 'lucide-react';

const QualitySection = () => {
  const checks = [
    'Рассев и гранулометрический анализ',
    'Химический состав (SiO₂ > 85%)',
    'Контроль влажности',
    'Проверка на отсутствие примесей',
    'Соответствие ГОСТ 8736-2014 и  Р 51641-2000',
    'Сертификаты качества',
  ];

  return (
    <section className="py-16 md:py-20 bg-black relative overflow-hidden">
      <div className="max-w-[1920px] mx-auto px-4 lg:px-[1cm] relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Content */}
          <div>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-px bg-white" />
              <span className="text-gray-400 text-sm tracking-[0.3em] uppercase font-medium">
                Лаборатория
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight mb-6">
              Контроль
              <br />
              <span className="text-white font-medium">Качества</span>
            </h2>

            <p className="text-gray-300 text-lg leading-relaxed mb-8">
               Жёсткий входной контроль, прецизионная сушка, многоступенчатая очистка 
              и фракционирование — каждый этап находится под контролем нашей лаборатории, 
              которая более <span className="text-3xl text-[#f80000] font-medium">20</span> лет работает с самыми требовательными задачами строительной химии.<br />
              Каждая партия проходит лабораторный контроль: рассев, химический состав, 
              влажность, отсутствие примесей. Гарантируем стабильное качество и 
              соответствие стандартам.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {checks.map((check, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-[#111111] border border-[#222222] hover:border-[#f80000]/30 transition-colors"
                >
                  <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300 text-sm">{check}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative">
              {/* Decorative frame */}
              <div className="absolute -top-3 -right-3 w-20 h-20 border-r-2 border-t-2 border-white" />
              <div className="absolute -bottom-3 -left-3 w-20 h-20 border-l-2 border-b-2 border-[#f80000]" />
              
              <img
                src="/laboratory.jpg"
                alt="Контроль качества в лаборатории"
                className="w-full h-[400px] lg:h-[550px] object-cover rounded-lg"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/60 to-transparent rounded-lg" />
            </div>
            
            {/* Floating Badge */}
            <div className="absolute -bottom-4 -left-4 bg-[#f80000] text-white p-5 rounded-lg">
              <div className="text-3xl font-light text-white">100%</div>
              <div className="text-sm text-white/80 tracking-wider uppercase">Контроль партий</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QualitySection;