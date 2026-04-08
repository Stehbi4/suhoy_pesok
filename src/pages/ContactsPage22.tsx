import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, ChevronRight } from 'lucide-react';

const ContactsPage = () => {
  return (
    <main className="min-h-screen pt-24 md:pt-28 bg-[#0a0a0a]">
      {/* Page Header */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-blue-900/10 to-transparent" />
        
        <div className="container-custom relative z-10">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-6">
            <Link to="/" className="hover:text-white transition-colors">Главная</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Контакты</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-white leading-tight mb-6">
            Свяжитесь
            <br />
            <span className="text-white font-medium">с нами</span>
          </h1>
          
          <p className="text-gray-400 text-lg max-w-2xl">
            Свяжитесь с нами удобным способом. Мы всегда готовы ответить на ваши вопросы 
            и помочь с выбором продукции.
          </p>
        </div>
      </section>

      {/* Contacts Content */}
      <section className="py-16 md:py-24">
        <div className="container-custom">
          {/* Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Phone */}
            <div className="bg-[#111111] border border-[#222222] rounded-lg p-6 card-hover hover:border-brand-red/50">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-sm text-gray-500 uppercase tracking-wider mb-3">
                Телефоны
              </h3>
              <div className="space-y-1">
                <a
                  href="tel:+78122909660"
                  className="text-lg font-light text-white hover:text-brand-red/50 transition-colors block"
                >
                  +7 (812) 290-96-60
                </a>
                <a
                  href="tel:+79990335733"
                  className="text-lg font-light text-white hover:text-brand-red/50 transition-colors block"
                >
                  +7 (999) 033-57-33
                </a>
                <a
                  href="tel:+78125352102"
                  className="text-lg font-light text-white hover:text-brand-red/50 transition-colors block"
                >
                  +7 (812) 535-21-02 доб. 5
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="bg-[#111111] border border-[#222222] rounded-lg p-6 card-hover hover:border-brand-red/50">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-sm text-gray-500 uppercase tracking-wider mb-3">
                Email
              </h3>
              <a
                href="mailto:zakaz@np-cmid.ru"
                className="text-lg font-light text-white hover:text-brand-red/50 transition-colors block"
              >
                zakaz@np-cmid.ru
              </a>
            </div>

            {/* Working Hours */}
            <div className="bg-[#111111] border border-[#222222] rounded-lg p-6 card-hover hover:border-brand-red/50">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-sm text-gray-500 uppercase tracking-wider mb-3">
                Режим работы
              </h3>
              <div className="space-y-1">
                <p className="text-white">
                  <span className="text-gray-500">Пн-Пт:</span> 8:30 - 17:30
                </p>
                <p className="text-gray-500">
                  <span className="text-gray-500">Сб-Вс:</span> выходной
                </p>
              </div>
            </div>

            {/* Address */}
            <div className="bg-[#111111] border border-[#222222] rounded-lg p-6 card-hover hover:border-brand-red/50">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-sm text-gray-500 uppercase tracking-wider mb-3">
                Адрес
              </h3>
              <p className="text-white text-sm leading-relaxed">
                Россия, Ленинградская область,<br />
                Всеволожский район, Мурино,<br />
                Центральный проезд, 10
              </p>
            </div>
          </div>
        </div>

        
      </section>
    </main>
  );
};

export default ContactsPage;
