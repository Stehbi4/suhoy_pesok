// src/components/sections/KeyFeaturesSection.tsx
import { Beaker, Droplets, Percent, Truck } from 'lucide-react';

const features = [
  { icon: Beaker, value: '> 98%', label: 'SiO₂' },
  { icon: Droplets, value: '≤ 0.5%', label: 'Влажность' },
  { icon: Percent, value: '8 фракций', label: '0.1–3.0 мм' },
  { icon: Truck, value: '1 день', label: 'Доставка СПб и ЛО' },
];

const KeyFeaturesSection = () => {
  return (
    <section className="py-20 md:py-32 border-t border-[#222222]">
      <div className="container-custom grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
        {features.map((f, i) => (
          <div key={i} className="text-center">
            <f.icon className="w-7 h-7 text-white mx-auto mb-6" />
            <div className="text-4xl md:text-6xl font-light mb-3">{f.value}</div>
            <div className="text-gray-400 text-lg md:text-xl uppercase tracking-wider">{f.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default KeyFeaturesSection;