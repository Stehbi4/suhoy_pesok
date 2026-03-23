import { Link } from 'react-router-dom';
import {ArrowUpRight, Beaker, ChevronDown, Droplets, FileCheck, Thermometer} from 'lucide-react';

const HeroSection = () => {

const characteristics = [
    
    {
      icon: FileCheck,
      label: 'Стандарт',
      value: 'ГОСТ 8736-2014',
      description: 'Соответствие государственным стандартам',
    },

    {
      icon: Thermometer,
      label: 'Термостойкость',
      value: 'До 1200°C',
      description: 'Высокая устойчивость к температурам',
    },
    {
      icon: FileCheck,
      label: 'Качество',
      value: 'Идиально хранить',
      description: 'Соответствие',
    },
    {
      icon: Beaker,
      label: 'SiO₂',
      value: '> 85%',
      description: 'Высокое содержание диоксида кремния',
    },
    {
      icon: Droplets,
      label: 'Влажность',
      value: '≤ 0.5%',
      description: 'Минимальное содержание влаги',
    },
    {
      icon: FileCheck,
      label: 'что то ещё',
      value: 'возможности',
      description: 'уууууаауау',
    },

  ];
  return (
    <section className="relative h-[300vh] bg-cover bg-no-repeat overflow-hidden hero-background bg-[-50%_50%] lg:bg-center">
      {/* Content Container */}
      <div className="relative z-10 w-full px-[1cm] pt-28 pb-16 min-h-[200vh] flex flex-col">
        {/* Top Row: Title */}
        <div className="flex justify-start items-start">
          <div className="max-w-md animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light text-white leading-[0.95] tracking-tight mb-6">
              Сухой
              <br />
              <span className="text-white font-medium">Кварцевый</span>
              <br />
              Песок
            </h1>
          </div>
        </div>
        
        

        {/* Bottom Row: Description, Buttons, and Stats */}
        <div className="absolute bottom-[100vh] right-0 w-full px-[1cm] flex justify-end items-start lg:items-end gap-6">
          
          <div className="w-full max-w-md text-right">
            <p className="text-gray-400 text-lg md:text-lg max-w-md mb-8 leading-relaxed">
              Очищенный,  фракционированный, <br/> 
              cухой песок под любые ваши задачи. <br/>
              Для  промышленности и строительства.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Link
                to="/catalog"
                className="bg-[#f80000] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#ff3333] transition-colors flex items-center justify-end gap-3"
              >
                <span>В каталог</span>
                <ArrowUpRight className="w-5 h-5" />
              </Link>
              <Link
                to="/contacts"
                className="px-6 py-3 border border-gray-700 text-white rounded-lg font-semibold hover:border-[#f80000] hover:text-white transition-all duration-300 flex items-center justify-center gap-3"
              >
                <span>Связаться</span>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute top-[95vh] left-[1cm] z-10 flex flex-col items-center gap-2">
        <span className="text-gray-500 text-xs tracking-[0.3em] uppercase">Листайте</span>
        <ChevronDown className="w-5 h-5 text-gray-500 animate-bounce" />
        </div>

      </div>
      
      <div className="absolute bottom-0 lg:bottom-[15vh] left-0 right-0 px-[1cm] flex flex-col lg:flex-row justify-between items-start gap-6">
  {/* Left characteristics */}
  <div className="space-y-2 lg:space-y-8 w-full lg:w-auto lg:text-right">
    {characteristics.slice(0, 3).map((char, idx) => (
      <div 
        key={idx + 2}
        className="flex items-start gap-4 lg:flex-row-reverse bg-[#111]/60 backdrop-blur-sm border border-[#222] rounded-xl p-6 hover:border-[#f80000]/60 transition-all duration-300"
      >
        <div className="shrink-0 w-14 h-14 rounded-lg bg-[#f80000]/10 flex items-center justify-center">
          <char.icon className="w-7 h-7 text-[#f80000]" />
        </div>
        <div>
          <div className="text-sm text-gray-400 uppercase tracking-wider mb-1 lg:text-right">
            {char.label}
          </div>
          <div className="text-2xl lg:text-3xl font-light text-white mb-2 lg:text-right">
            {char.value}
          </div>
          <div className="text-gray-300 text-base leading-relaxed lg:text-right">
            {char.description}
          </div>
        </div>
      </div>
    ))}
  </div>

  {/* Right characteristics */}
  <div className="space-y-2 lg:space-y-8 w-full lg:w-auto lg:text-left">
    {characteristics.slice(3, 6).map((char, idx) => (
      <div 
        key={idx}
        className="flex items-start gap-4 bg-[#111]/60 backdrop-blur-sm border border-[#222] rounded-xl p-6 hover:border-[#f80000]/60 transition-all duration-300"
      >
        <div className="shrink-0 w-14 h-14 rounded-lg bg-[#f80000]/10 flex items-center justify-center">
          <char.icon className="w-7 h-7 text-[#f80000]" />
        </div>
        <div>
          <div className="text-sm text-gray-400 uppercase tracking-wider mb-1">
            {char.label}
          </div>
          <div className="text-2xl lg:text-3xl font-light text-white mb-2">
            {char.value}
          </div>
          <div className="text-gray-300 text-base leading-relaxed">
            {char.description}
          </div>
        </div>
      </div>
    ))}
  </div>
</div>
            {/* Background Effects Overlay */}
      <div className="absolute inset-0 z-0">
        {/* Blue radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-blue-900/20 to-transparent" />
        
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)`,
            backgroundSize: '100px 100px'
          }}
        />
        
       
      </div>
    </section>
  );
};

export default HeroSection;