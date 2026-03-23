import { Link } from 'react-router-dom';
import { CheckCircle2, Award, Users, ArrowUpRight } from 'lucide-react';

const AboutPage = () => {
  const advantages = [
    {
      icon: Award,
      title: 'Собственное производство',
      description: 'Полный контроль качества на всех этапах производства'
    },
    {
      icon: CheckCircle2,
      title: 'Сертифицированная продукция',
      description: 'Соответствие ГОСТ 8736-2014 и другим стандартам'
    },
    {
      icon: Users,
      title: 'Опытная команда',
      description: '25+ лет опыта в производстве строительных '
    }
  ];


  return (
    <main className="min-h-screen pt-24 md:pt-0  bg-[#0a0a0a]">
      {/* Page Header */}
      <section className="relative h-[100vh] bg-cover bg-center bg-no-repeat overflow-hidden about-hero-set-background">

  <div className="max-w-[1920px] py-16 md:py-24 mx-auto px-4 lg:px-[1cm] relative z-10">
    
    <div className="flex items-center pt-12 gap-4 mb-5">
      <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-white leading-tight mb-6">
            О нас
      </h1>
    </div>

  </div>
</section>
      <section className="relative py-16 md:py-24 bg-[#0a0a0a] overflow-hidden">

  <div className="max-w-[1920px] mx-auto px-4 lg:px-[1cm] relative z-10">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">     
      {/* Левая колонка — текст */}
      <div>
        <p className="text-white text-xl md:text-4xl leading-relaxed">
          ЗАО «НП ЦМИД» 
          <br /></p>
          <br />
          <br />
          <p className="text-white text-xl md:text-2xl leading-relaxed">Уже более{' '}
          <span className="text-3xl md:text-4xl lg:text-5xl font-medium text-[#f80000] inline-block -my-1 align-middle">
            25
          </span>{' '}
          лет в строительной химии.<br />
          Недавно мы запустили собственное производство высококачественного сухого кварцевого песка.
        </p>
      </div>

      {/* Правая колонка — фото с декоративной рамкой и бейджем */}
      <div className="relative">
        <div className="relative">

          <img
            src="/CMID_Bilding.png"
            alt="ЗАО НП ЦМИД — производство сухого кварцевого песка"
            className="w-full h-[300px] lg:h-[620px] object-cover rounded-lg"
          />

          {/* Тёмный градиент сверху для читаемости */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/70 via-transparent to-transparent rounded-lg" />
        </div>

      </div>
    </div>
  </div>
</section>

      {/* Company Info */}
      <section className="py-16 md:py-24">
        <div className="container-custom">
          <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-12 h-px bg-white" />
                <span className="text-white text-sm tracking-[0.3em] uppercase font-medium">
                  Наша история
                </span>
                <div className="w-12 h-px bg-white" />
              </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Left - Content */}
            <div>
              

              <h2 className="text-3xl md:text-4xl font-light text-white leading-tight mb-8">
                Производитель сухого
                <br />
                <span className="text-white font-medium">кварцевого песка</span>
              </h2>

              <div className="space-y-6 text-gray-400 text-lg leading-relaxed">
                <p>
                  ЗАО «НП ЦМИД» (Научно-производственный центр материалов и добавок) основано в 1998 году в Санкт-Петербурге при поддержке специалистов ВНИИГ им. Б.Е. Веденеева.
                </p>
                <p>
                  Более 25 лет мы разрабатываем и производим сухие строительные смеси специального назначения, ремонтные составы и добавки для бетона для самых сложных объектов: ГЭС, АЭС, мосты, тоннели, порты и гидротехнические сооружения.
                </p>
                <p>
                  Совсем недавно мы запустили линию по производству высококачественного сухого кварцевого песка. 
                  Всё то же научное качество, тот же жёсткий контроль, но теперь — чистый фракционированный песок для ваших задач.
                </p>
                <p>
                  Каждая партия продукции проходит строгий лабораторный контроль, что 
                  гарантирует стабильное качество и соответствие государственным стандартам.
                  <br />
                </p>
              </div>
            </div>

            {/* Right - Stats */}
            <div className="relative">
              {/* Decorative circles */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] border border-[#222222] rounded-full" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] border border-[#333333] rounded-full" />
              
              <div className="relative grid grid-cols-2 gap-6">
                <div className="card-dark card-hover p-8 text-center hover:border-[#f80000]/30">
                  <div className="text-5xl font-light text-whight mb-2">25<span className="text-[#f80000]">+</span></div>
                  <div className="text-gray-500 text-sm tracking-wider uppercase">
                    Лет опыта
                  </div>
                </div>
                
                <div className="card-dark card-hover p-8 text-center hover:border-[#f80000]/30">
                  <div className="text-5xl font-light text-white mb-2">500<span className="text-[#f80000]">+</span></div>
                  <div className="text-gray-500 text-sm tracking-wider uppercase">
                    Клиентов
                  </div>
                </div>
                
                <div className="card-dark card-hover p-8 text-center hover:border-[#f80000]/30">
                  <div className="text-5xl font-light text-white mb-2">8</div>
                  <div className="text-gray-500 text-sm tracking-wider uppercase">
                    Фракций
                  </div>
                </div>
                
                <div className="card-dark card-hover p-8 text-center hover:border-[#f80000]/30">
                  <div className="text-5xl font-light text-white mb-2">24<span className="text-[#f80000]">/</span>7</div>
                  <div className="text-gray-500 text-sm tracking-wider uppercase">
                    Производство
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

           {/* Общий контейнер для Mission и Advantages с фоном */}
      <div className="relative overflow-hidden mission-background">
        {/* Градиент-overlay для всего блока */}
        <div className="absolute inset-0 bg-gradient-radial from-blue-900/10 to-transparent opacity-20" />

        {/* Mission */}
        <section className="py-16 md:py-24 relative z-10"> 
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-12 h-px bg-white" />
                <span className="text-white text-sm tracking-[0.3em] uppercase font-medium">
                  Миссия
                </span>
                <div className="w-12 h-px bg-white" />
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-white leading-tight mb-8">
                Обеспечивать промышленность <span className="text-[#f80000]">высококачественным</span> сырьём
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                Наша миссия — производить и поставлять кварцевый песок, который соответствует 
                самым высоким требованиям качества, помогая нашим клиентам достигать 
                выдающихся результатов в их бизнесе.
              </p>
            </div>
          </div>
        </section>
      
        {/* Advantages */}
        <section className="py-16 md:py-24 relative z-10"> 
          <div className="container-custom">
            <div className="flex items-center justify-center gap-4 mb-12">
              <div className="w-12 h-px bg-white" />
              <span className="text-white text-sm tracking-[0.3em] uppercase font-medium">
                Наши преимущества
              </span>
	      <div className="w-12 h-px bg-white" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {advantages.map((advantage, index) => {
                const Icon = advantage.icon;
                return (
                  <div
                    key={index}
                    className="card-dark card-hover p-8 hover:border-[#f80000]/30"
                  >
                    <Icon className="w-7 h-7 text-white mb-6" />
                    <h3 className="text-xl font-light text-white mb-3">
                      {advantage.title}
                    </h3>
                    <p className="text-gray-400">
                      {advantage.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="container-custom">
          <div className="bg-[#111111] border border-[#222222] rounded-lg p-12 md:p-16 text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-white mb-6">
              Готовы сотрудничать?
            </h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
              Свяжитесь с нами для получения консультации и расчёта стоимости. 
              Мы поможем подобрать оптимальное решение для ваших задач.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contacts"
                className="bg-[#f80000] text-white px-8 py-4 rounded-lg font-semibold tracking-wide hover:bg-gray-100 transition-colors inline-flex items-center justify-center gap-2"
              >
                <span>Связаться</span>
                <ArrowUpRight className="w-5 h-5" />
              </Link>
              <Link
                to="/catalog"
                className="border border-white text-white px-8 py-4 rounded-lg font-semibold tracking-wide hover:bg-white/10 transition-colors inline-flex items-center justify-center gap-2"
              >
                <span>В каталог</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
