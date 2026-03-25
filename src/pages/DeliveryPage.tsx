import { Link } from 'react-router-dom';
import { Truck, Package, MapPin, Clock, Phone, CheckCircle2 } from 'lucide-react';

const DeliveryPage = () => {
  const deliveryOptions = [
    {
      icon: Truck,
      title: 'Собственный транспорт',
      description: 'Цементовозы и самосвалы для перевозки сыпучих материалов'
    },
    {
      icon: Package,
      title: 'Навалом и в МКР',
      description: 'Доставка навалом или в мягких контейнерах (биг-бэгах)'
    },
    {
      icon: MapPin,
      title: 'СПб и Ленинградская область',
      description: 'Оперативная доставка по всему региону'
    },
    {
      icon: Clock,
      title: 'Точные сроки',
      description: 'Соблюдение согласованных сроков поставки'
    }
  ];

  const pricing = [
    { volume: 'до 10 тонн', price: 'по запросу', note: 'Минимальный заказ' },
    { volume: '10-25 тонн', price: 'по запросу', note: 'Стандартная доставка' },
    { volume: '25+ тонн', price: 'по запросу', note: 'Оптовые условия' }
  ];

  const workProcess = [
    { step: '01', title: 'Заявка', description: 'Оставляете заявку по телефону или на сайте' },
    { step: '02', title: 'Расчёт', description: 'Мы рассчитываем стоимость и сроки доставки' },
    { step: '03', title: 'Договор', description: 'Заключаем договор и согласовываем детали' },
    { step: '04', title: 'Доставка', description: 'Доставляем продукцию в указанные сроки' }
  ];

  return (
    <main className="min-h-screen pt-24 md:pt-0 bg-[#0a0a0a]">
      {/* Page Header */}
      <section className="relative min-h-screen py-16 md:py-24 overflow-hidden bg-cover bg-center" style={{ backgroundImage: "url('/Car_Cem_Dilivery.jpg')" }}>
        <div className="absolute inset-0 bg-gradient-radial from-blue-900/10 to-transparent opacity-30" />
        
        <div className="max-w-[1920px] mx-auto lg:px-[1cm] relative z-10 pt-12">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-white leading-tight mb-6">
            Доставка
            <br />
            <span className="px-24 text-white font-medium"> и оплата</span>
          </h1>
        </div>
      </section>

      {/* Delivery Options */}
      <section className="py-16 md:py-12">
        <div className="container-custom">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-px bg-white" />
            <span className="text-white text-sm tracking-[0.3em] uppercase font-medium">
              Варианты доставки
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {deliveryOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <div
                  key={index}
                  className="card-dark card-hover p-8 hover:border-[#f80000]/30"
                >
                  <Icon className="w-7 h-7 text-white mb-6" />
                  <h3 className="text-xl font-light text-white mb-3">
                    {option.title}
                  </h3>
                  <p className="text-gray-400">
                    {option.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 md:py-24 bg-[#0a0a0a] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-blue-900/10 to-transparent opacity-20" />
        
        <div className="container-custom relative z-10">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-px bg-white" />
            <span className="text-white text-sm tracking-[0.3em] uppercase font-medium">
              Тарифы на доставку
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricing.map((item, index) => (
              <div
                key={index}
                className="card-dark card-hover p-8 hover:border-[#f80000]/30 rounded-lg text-center transition-all duration-300"
              >
                <div className="text-2xl font-light text-white mb-2">
                  {item.volume}
                </div>
                <div className="text-3xl font-light text-white mb-2">
                  {item.price}
                </div>
                <div className="text-gray-500 text-sm">
                  {item.note}
                </div>
              </div>
            ))}
          </div>

          <p className="text-gray-500 text-center mt-8">
            * Точная стоимость доставки рассчитывается индивидуально в зависимости от расстояния и объёма
          </p>
        </div>
      </section>
      <section className="relative min-h-screen py-16 md:py-24 overflow-hidden bg-cover bg-center" style={{ backgroundImage: "url('/Soft_Sand_Containers_x.png')" }}>
        <div className="absolute inset-0 bg-gradient-radial from-blue-900/10 to-transparent opacity-30" />
        
        <div className="max-w-[1920px] mx-auto lg:px-[1cm] relative z-10 pt-12">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-white leading-tight mb-6">
            Наавалом, или в мягких контейнерах (биг-бэгах)<br/>
            Своим трансмортом!
            </h1>
        </div>
      </section>
      {/* Work Process */}
      <section className="py-16 md:py-24">
        <div className="container-custom">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-px bg-white" />
            <span className="text-white text-sm tracking-[0.3em] uppercase font-medium">
              Как мы работаем
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-light text-white mb-12">
            Схема работы
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {workProcess.map((step, index) => (
              <div
                key={index}
                className="card-dark card-hover p-8 hover:border-[#f80000]/30 rounded-lg  transition-all duration-300"
              >
                <div className="text-5xl font-bold text-[#1a1a1a] mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-light text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
{/* Full Width Map */}
        <div className="w-full">
        <iframe
          src="https://yandex.ru/map-widget/v1/?ll=30.489667%2C60.039733&z=14&pt=30.489667%2C60.039733&dark=true"
          width="100%"
          height="750"
          frameBorder="0"
          allowFullScreen
          className="border-0"
          title="Карта доставки — ЗАО НП ЦМИД"
        />
      </div>
      {/* Payment */}
      <section className="py-16 md:py-24 bg-[#0a0a0a] relative overflow-hidden">
        <div className="absolute inset-0 orange-glow opacity-20" />
        
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
            {/* Payment Methods */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-px bg-white" />
                <span className="text-white text-sm tracking-[0.3em] uppercase font-medium">
                  Способы оплаты
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl font-light text-white mb-8">
                Удобная оплата 
              </h2>
              <div className="space-y-4">
                <div className="flex items-start card-dark card-hover p-6 hover:border-[#f80000]/30 rounded-lg hover:border-[#f80000]/50 transition-all duration-300">
                  <CheckCircle2 className="w-6 h-6 text-white flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-lg text-white mb-1">Безналичный расчёт</h3>
                    <p className="text-gray-400">Для юридических лиц по договору</p>
                  </div>
                </div>
                <div className="flex items-start card-dark card-hover p-6 hover:border-[#f80000]/30 rounded-lg hover:border-[#f80000]/50 transition-all duration-300">
                  <CheckCircle2 className="w-6 h-6 text-white flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-lg text-white mb-1">!Наличный расчёт!?</h3>
                    <p className="text-gray-400">Для физических лиц</p>
                  </div>
                </div>
                <div className="flex items-start card-dark card-hover p-6 hover:border-[#f80000]/30 rounded-lg hover:border-[#f80000]/50 transition-all duration-300">
                  <CheckCircle2 className="w-6 h-6 text-white flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-lg text-white mb-1">Отсрочка платежа??</h3>
                    <p className="text-gray-400">Для постоянных клиентов</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact CTA */}
            <div className="bg-[#111111]  border border-[#222222] rounded-lg p-8 md:p-12">
              <h3 className="text-2xl md:text-3xl font-light text-white mb-4">
                Узнать стоимость доставки
              </h3>
              <p className="text-white/80 mb-8">
                Свяжитесь с нами для получения точного расчёта стоимости доставки 
                в ваш регион.
              </p>
              <div className="space-y-4">
                <a
                  href="tel:+78122909660"
                  className="flex items-center gap-3 text-white hover:text-white/80 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  <span className="text-lg">+7 (812) 290-96-60</span>
                </a>
                <Link
                  to="/contacts"
                  className="block w-full bg-[#f80000] text-white py-4 rounded-lg font-semibold tracking-[#f80000] hover:bg-[#ff3333] transition-colors text-center"
                >
                  Оставить заявку
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DeliveryPage;
