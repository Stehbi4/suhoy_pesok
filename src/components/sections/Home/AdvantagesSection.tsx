import { useRef } from 'react';
import { Factory, Shield, Handshake, MapPin } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useAnimateOnScroll } from '@/hooks/useAnimateOnScroll';

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

const AdvantageItem = ({ advantage, index }: { advantage: typeof advantages[0]; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center'],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.85, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.15, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [40, 0]);

  return (
    <motion.div
      ref={ref}
      style={{ scale, opacity, y }}
      className="flex items-center will-change-transform"
    >
      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-gray-400 flex items-center justify-center mr-8 md:mr-10 flex-shrink-0">
        <span className="text-xl md:text-2xl font-light text-gray-800">{index + 1}</span>
      </div>
      <div>
        <h3 className="text-xl md:text-2xl font-medium text-gray-800 mb-2">
          {advantage.title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed max-w-md">
          {advantage.description}
        </p>
      </div>
    </motion.div>
  );
};

const AdvantagesSection = () => {
  useAnimateOnScroll();

  return (
    <section className="py-20 md:py-32 bg-[#e8e8e8] relative overflow-hidden">
      <div className="px-6 sm:px-10 lg:px-[1cm] relative z-10">

        {/* Заголовок */}
        <div className="mb-28 overflow-hidden">
          <h2 className="text-6xl md:text-7xl lg:text-8xl font-light text-gray-800 leading-tight text-center flex items-baseline justify-center gap-[0.3em]">
            <span className="inline-block animate-on-scroll slide-in-left">Наши</span>
            <span className="inline-block animate-on-scroll slide-in-right animation-delay-200">преимущества</span>
          </h2>
        </div>

        {/* Список */}
        <div className="grid grid-cols-1 gap-16 max-w-2xl mx-auto">
          {advantages.map((advantage, index) => (
            <AdvantageItem key={index} advantage={advantage} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdvantagesSection;
