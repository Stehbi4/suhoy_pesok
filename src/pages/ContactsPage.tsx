import type { ReactNode } from 'react';
import { Phone, Mail, MapPin, Clock, ArrowUpRight } from 'lucide-react';

const ContactsPage = () => {
  return (
    <main className="min-h-screen pt-24 md:pt-28 bg-brand-bg text-white relative overflow-hidden">
      {/* ─── ОГРОМНЫЕ ФОНОВЫЕ ЦИФРЫ ─────────────────────── */}
      <div className="absolute inset-x-0 bottom-0 flex justify-center pointer-events-none select-none z-0">
        <span
          className="font-extrabold text-white/[0.035] leading-[0.85] whitespace-nowrap tracking-tighter translate-y-[12%]"
          style={{ fontSize: 'clamp(16rem, 42vw, 44rem)' }}
        >
          290·96·60
        </span>
      </div>

      {/* ─── HERO ─────────────────────────────────────────── */}
      <section className="relative z-10 py-8 md:py-12 px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          <h1 className="lg:col-span-8 text-[2.25rem] sm:text-5xl md:text-5xl lg:text-6xl font-light leading-[1.05] text-white">
            Свяжитесь с нами
            <br />
            для{' '}
            <span className="text-brand-red sm:text-6xl lg:text-7xl">
              сотрудничества
            </span>
          </h1>
          <p className="lg:col-span-4 text-base md:text-lg text-gray-400 leading-relaxed">
            Получите консультацию, расчёт стоимости или обсудите условия
            партнёрства. Мы{' '}
            <span className="text-brand-red">ответим</span> в течение 1 рабочего
            дня.
          </p>
        </div>
      </section>

      {/* ─── CONTACT CARDS + MAP — SPLIT ─────────────────── */}
      <section className="relative z-10 px-6 md:px-12 pb-20 md:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6">
          {/* LEFT — 2×2 контактные карточки */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5 content-start">
            <ContactCard icon={<Phone />} label="Телефоны">
              <a href="tel:+78125352102" className="block text-base font-light text-white hover:text-brand-red transition-colors">
                +7 (812) 535-21-02 доб. 5
              </a>
              <a href="tel:+78122909660" className="block text-base font-light text-white hover:text-brand-red transition-colors">
                +7 (812) 290-96-60
              </a>
              <a href="tel:+79213523822" className="block text-base font-light text-white hover:text-brand-red transition-colors">
                +7 (921) 352-38-22
              </a>
              <a href="tel:+79990335733" className="block text-base font-light text-white hover:text-brand-red transition-colors">
                +7 (999) 033-57-33
              </a>
            </ContactCard>

            <ContactCard icon={<Mail />} label="Email">
              <a href="mailto:zakaz@np-cmid.ru" className="block text-base font-light text-white hover:text-brand-red transition-colors">
                zakaz@np-cmid.ru
              </a>
              <a href="mailto:ym.schinin@np-cmid.ru" className="block text-base font-light text-white hover:text-brand-red transition-colors break-all">
                ym.schinin@np-cmid.ru
              </a>
            </ContactCard>

            <ContactCard icon={<Clock />} label="Режим работы">
              <p className="text-base font-light text-white">
                <span className="text-gray-500">Пн—Пт:</span> 8:30 — 17:30
              </p>
              <p className="text-base font-light text-gray-500">
                <span className="text-gray-500">Сб—Вс:</span> выходной
              </p>
            </ContactCard>

            <ContactCard icon={<MapPin />} label="Производство">
              <p className="text-sm font-light text-gray-300 leading-relaxed">
                Россия, Ленинградская область,
                <br />
                Всеволожский район, Мурино,
                <br />
                Центральный проезд, 10
              </p>
            </ContactCard>
          </div>

          {/* RIGHT — карта */}
          <div className="lg:col-span-7 relative">
            <div className="relative h-[420px] sm:h-[520px] lg:h-full lg:min-h-[560px] overflow-hidden rounded-lg border border-[#222222] group">
              <iframe
                src="https://yandex.ru/map-widget/v1/?ll=30.487752%2C60.039149&z=14&pt=30.487752%2C60.039149&%2Ccomma"
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen
                className="grayscale group-hover:grayscale-0 transition-[filter] duration-700 w-full h-full"
                title="Производство — Мурино, Центральный проезд, 10"
              />

              {/* Угловой бэдж — индикатор локации */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2.5 bg-brand-bg/85 backdrop-blur-sm border border-[#222] px-3.5 py-2 rounded">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-brand-red opacity-60 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-red" />
                </span>
                <span className="text-[11px] tracking-[0.2em] uppercase text-gray-200 font-medium">
                  Мурино · Центральный пр., 10
                </span>
              </div>

              {/* Угловые риски */}
              <span className="pointer-events-none absolute top-0 left-0 w-6 h-6 border-t border-l border-brand-red/80" />
              <span className="pointer-events-none absolute top-0 right-0 w-6 h-6 border-t border-r border-brand-red/80" />
              <span className="pointer-events-none absolute bottom-0 left-0 w-6 h-6 border-b border-l border-brand-red/80" />
              <span className="pointer-events-none absolute bottom-0 right-0 w-6 h-6 border-b border-r border-brand-red/80" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

/* ────────────────────────────────────────────────────────── */
/* Карточка контакта                                          */
/* ────────────────────────────────────────────────────────── */
const ContactCard = ({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) => (
  <div className="card-dark p-6 lg:p-7 hover:border-brand-red/40 transition-colors duration-300 group relative overflow-hidden">
    {/* Верхняя «подсветка» на hover */}
    <span className="absolute top-0 left-0 h-px w-0 bg-brand-red group-hover:w-full transition-[width] duration-500 ease-out" />

    <div className="flex items-start justify-between mb-5">
      <div className="w-11 h-11 rounded-lg bg-white/5 flex items-center justify-center text-white [&_svg]:w-5 [&_svg]:h-5 group-hover:bg-white/10 transition-colors">
        {icon}
      </div>
      <ArrowUpRight className="w-4 h-4 text-gray-700 group-hover:text-brand-red group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
    </div>

    <h3 className="text-[11px] tracking-[0.25em] uppercase text-gray-500 mb-3 font-medium">
      {label}
    </h3>

    <div className="space-y-1">{children}</div>
  </div>
);

export default ContactsPage;
