import { ArrowUpRight } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';

const PositioningSection = () => {
  return (
    <section className="relative py-24 lg:py-32 min-h-screen flex items-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/Production_Site/BG.png')" }}
      />
      <div className="absolute inset-0 bg-black/80" />

      <div className="relative z-10 px-6 sm:px-10 lg:px-[1cm] w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left — statement */}
          <div>
            <ScrollReveal type="slide-left" delay={0.1}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light text-white leading-[1.1] mt-8">
                Мы имеем огромный опыт
                <br />
                в <span className="text-brand-red font-medium">бетонах</span>, смесях
                <br />
                и строительной химии
              </h2>
            </ScrollReveal>

            <ScrollReveal type="fade-up" delay={0.2} className="mt-12">
              <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-lg mb-10">
                За более подробной информацией о наших материалах, технологиях и проектах —
                посетите основной сайт компании.
              </p>
              <a
                href="https://np-cmid.ru/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-brand-red text-white px-8 py-4 rounded-lg font-semibold tracking-wide hover:bg-brand-red-light transition-colors inline-flex items-center gap-3"
              >
                Перейти на наш сайт
                <ArrowUpRight className="w-5 h-5" />
              </a>
            </ScrollReveal>
          </div>

          {/* Right — stats */}
          <div>
            <ScrollReveal type="slide-right" delay={0.15}>
              <div className="space-y-8">
                {[
                  { value: '30+', unit: 'тыс. т/год', label: 'Мощность производства' },
                  { value: '100+', unit: 'наименований', label: 'Продукция в портфеле' },
                  { value: '25', unit: 'лет', label: 'На рынке строительной химии' },
                  { value: 'ISO', unit: '9001', label: 'Сертификация СМК' },
                ].map((stat, i) => (
                  <div key={i} className="flex items-baseline gap-6 border-b border-[#222] pb-6">
                    <span className="text-4xl md:text-5xl font-light text-white whitespace-nowrap">
                      {stat.value}
                      <span className="text-lg text-gray-500 ml-2">{stat.unit}</span>
                    </span>
                    <span className="text-gray-500 text-sm">{stat.label}</span>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PositioningSection;