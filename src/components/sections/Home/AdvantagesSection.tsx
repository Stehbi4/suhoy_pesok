import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const advantages = [
  {
    title: 'Собственное производство',
    description: 'Контролируем качество от карьера до отгрузки. Передовое оборудование для фракционирования, сушки и очистки.',
  },
  {
    title: 'Гарантированное качество',
    description: 'Каждая партия проходит лабораторный контроль по ГОСТ 8736-2014. Протоколы испытаний на каждую отгрузку.',
  },
  {
    title: 'Гибкие условия',
    description: 'Индивидуальный подход: минимальные объёмы, кастомизация, формы оплаты и онлайн-поддержка.',
  },
  {
    title: 'Доставка СПб и ЛО',
    description: 'Собственный транспорт. Навал или биг-бэги. Доставка за 24 часа по Санкт-Петербургу и Ленинградской области.',
  },
];

// Отдельная строка — анимация привязана к скролу (reversible)
const AdvantageRow = ({ title, description, index }: { title: string; description: string; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.92', 'start 0.45'],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const scale   = useTransform(scrollYProgress, [0, 1], [0.88, 1]);
  const y       = useTransform(scrollYProgress, [0, 1], [24, 0]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity, scale, y }}
      className="flex items-start gap-7 py-7"
    >
      <div className="w-12 h-12 rounded-full border-2 border-gray-400 flex items-center justify-center flex-shrink-0 mt-0.5">
        <span className="text-base font-light text-gray-600">{index + 1}</span>
      </div>
      <div>
        <h3 className="text-xl font-medium text-gray-800 mb-1">{title}</h3>
        <p className="text-sm leading-relaxed font-light text-gray-500">{description}</p>
      </div>
    </motion.div>
  );
};

const AdvantagesSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Заголовок — два слова, привязаны к скролу секции
  const { scrollYProgress: titleProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.9', 'start 0.5'],
  });

  const leftX   = useTransform(titleProgress, [0, 1], [-100, 0]);
  const rightX  = useTransform(titleProgress, [0, 1], [100, 0]);
  const titleOp = useTransform(titleProgress, [0, 1], [0, 1]);

  return (
    <section className="py-24 lg:py-32 bg-[#e8e8e8] relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-black/10" />

      <div ref={sectionRef} className="px-6 sm:px-10 lg:px-[1cm]">

        {/* Заголовок */}
        <div className="mb-20">
          <motion.div style={{ opacity: titleOp }} className="mb-4">
            <p className="text-[10px] uppercase tracking-[0.35em] text-gray-500 text-center">Преимущества</p>
          </motion.div>

          <h2 className="text-[clamp(2.5rem,6vw,5rem)] leading-[1.05] font-light text-gray-800 flex flex-wrap gap-x-[0.3em] justify-center">
            <motion.span style={{ x: leftX, opacity: titleOp }} className="inline-block">
              Наши
            </motion.span>
            <motion.span style={{ x: rightX, opacity: titleOp }} className="inline-block font-medium">
              преимущества
            </motion.span>
          </h2>
        </div>

        {/* Список */}
        <div className="max-w-3xl mx-auto">
          {advantages.map((adv, i) => (
            <AdvantageRow key={i} index={i} title={adv.title} description={adv.description} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default AdvantagesSection;
