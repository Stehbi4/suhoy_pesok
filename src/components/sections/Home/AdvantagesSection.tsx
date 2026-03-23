
import { Factory, Shield, Handshake, MapPin } from 'lucide-react';

const AdvantagesSection = () => {
  const advantages = [
    {
      icon: Factory,
      title: 'Собственное производство',
      description:
        'Передовое оборудование для фракционирования, сушки и очистки кварцевого песка. Гарантирует высокое качество и стабильные поставки без дефектов.',
    },
    {
      icon: Shield,
      title: 'Гарантированное качество',
      description:
        'Каждая партия проходит лабораторный контроль по ГОСТ 8736-2014. Обеспечивает чистоту, надежность и однородность для всех клиентов.',
    },
    {
      icon: Handshake,
      title: 'Гибкие условия',
      description:
        'Индивидуальный подход: минимальные объемы, кастомизация, формы оплаты и онлайн-поддержка. Адаптируемся к вашим нуждам быстро.',
    },
    {
      icon: MapPin,
      title: 'Доставка СПб и ЛО',
      description:
        'Собственный транспорт для оперативной доставки навалом или в МКР. Минимизируем затраты и сроки по СПб и области.',
    },
  ];

  return (
    <section className="py-20 md:py-24 bg-white relative overflow-hidden">
      <div className="container-custom relative z-10">
        {/* Section Header */}
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-light text-gray-800 leading-tight text-center mb-24 flex justify-center items-center gap-2">
          <span>Наши</span>
          <span>преимущества</span>
        </h2>

        {/* Advantages List — теперь по центру */}
        <div className="grid grid-cols-1 gap-20 w-[75%] md:w-[50%] mx-auto">
          {advantages.map((advantage, index) => {
            const Icon = advantage.icon;
            return (
              <div
                key={index}
                className="flex items-center"
              >
                <div className="w-20 h-20 rounded-full bg-transparent border-2 border-gray-400 flex items-center justify-center mr-10 flex-shrink-0">
                  <Icon className="w-6 h-6 text-gray-800" />
                </div>
                <div className="text-left">   {/* ← явно по левому краю */}
                  <h3 className="text-3xl font-medium text-gray-800 mb-2">
                    {advantage.title}
                  </h3>
                  <p className="text-gray-600 text-xs leading-relaxed" style={{ fontSize: '0.85rem' }}>
                    {advantage.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AdvantagesSection;