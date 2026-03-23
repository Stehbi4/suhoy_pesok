'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

const ContactsPage = () => {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const subjects = ['Партнёрство', 'Заказ', 'Поверхности', 'Отрасли', 'Сотрудничество', 'Другое'];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedSubject) {
      alert('Пожалуйста, выберите тему');
      return;
    }

    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.append('subject', selectedSubject);

    try {
      const res = await fetch('https://formspree.io/f/XXXXXXXX', {  // ← ЗАМЕНИ НА СВОЙ КОД
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        setSubmitted(true);
        form.reset();
        setSelectedSubject('');
        setTimeout(() => setSubmitted(false), 8000);
      } else {
        alert('Ошибка отправки. Попробуйте позже.');
      }
    } catch (err) {
      alert('Ошибка соединения');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <main className="min-h-screen pt-6 md:pt-8 bg-[#0a0a0a]">
    <section className="py-16 md:py-12 bg-[#0a0a0a]">
    <div className="p-8 md:p-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
      
      {/* Левая колонка — большой текст (как в макете) */}
      <div className="lg:col-span-6">
        <h2 className="text-4xl md:text-5xl font-light leading-tight text-white mb-6">
          Свяжитесь с нами
          <br />
          для <span className="text-6xl text-[#f80000]">сотрудничества</span>
        </h2>
        <p className="text-xl text-gray-400 max-w-2xl">
          Получите консультацию, расчёт стоимости или обсудите условия партнёрства. 
          Мы <span className="text-3xl text-[#f80000]">ответим </span>в течение 1 рабочего дня.
        </p>
      </div>

      {/* Правая колонка — форма */}
      <div className="lg:col-span-6">
          
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Имя + Email */}
            <div className="space-y-2"> 
              <div>
                <label className="block text-sm text-gray-400 mb-2">Имя*</label>
                <input 
                  type="text" 
                  name="name" 
                  required 
                  className="w-full bg-transparent border-b-2 border-white pb-4 text-white text-lg 
                    placeholder:text-gray-500 focus:border-[#f80000] outline-none transition-all" 
                  placeholder="Ваше имя" 
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Email*</label>
                <input 
                  type="email" 
                  name="email" 
                  required 
                  className="w-full bg-transparent border-b-2 border-white pb-4 text-white text-lg 
                    placeholder:text-gray-500 focus:border-[#f80000] outline-none transition-all" 
                  placeholder="your@email.com" 
                />
              </div> 
              <div>
                <label className="block text-sm text-gray-400 mb-2">Телефон</label>
                <input type="tel"
                  name="phone" 
                  className="w-full bg-transparent border-b-2 border-white pb-4 text-white text-lg 
                    placeholder:text-gray-500 focus:border-[#f80000] outline-none transition-all" 
                  placeholder="+7 (___) ___-__-__" 
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Название компании*</label>
                <input 
                  type="text" 
                  name="company" 
                  required 
                  className="w-full bg-transparent border-b-2 border-white pb-4 text-white text-lg 
                    placeholder:text-gray-500 focus:border-[#f80000] outline-none transition-all" 
                  placeholder="ООО Ромашка" 
                />
              </div>
            </div>
            {/* Выбор темы — точь-в-точь как в макете */}
            <div>
              <label className="block text-sm text-gray-400 mb-3">Выберите тему</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {subjects.map((subj) => (
                  <button
                    key={subj}
                    type="button"
                    onClick={() => setSelectedSubject(subj)}
                    className={`py-2 rounded-2xl border text-sm font-light transition-all ${
                      selectedSubject === subj 
                        ? 'bg-[#f80000] border-[#f80000] text-white' 
                        : 'border-[#333333] hover:border-[#555] text-gray-300'
                    }`}
                  >
                    {subj}
                  </button>
                ))}
              </div>
            </div>

            {/* Сообщение */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Сообщение</label>
              <textarea 
                name="message" 
                rows={3}
                className="w-full bg-transparent border-b-2 border-white px-6 py-4 text-white focus:border-[#f80000] outline-none resize-y transition-colors"
                placeholder="Опишите ваш запрос..."
                required
              />
            </div>

            {/* Чекбокс */}
            <div className="flex items-start gap-3">
              <input 
                type="checkbox" 
                name="privacy" 
                id="privacy" 
                required 
                className="mt-1 accent-[#f80000]" 
              />
              <label htmlFor="privacy" className="text-sm text-gray-400 cursor-pointer">
                Я согласен с{' '}
                <a href="/privacy" className="text-white hover:text-[#f80000] underline">Политикой конфиденциальности</a>
              </label>
            </div>

            {/* Кнопка отправки */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 md:px-12 bg-[#f80000] hover:bg-[#ff1a1a] transition-all py-3 rounded-2xl text-lg font-medium disabled:opacity-70"
            >
              {isSubmitting ? 'Отправляем...' : 'Отправить сообщение'}
            </button>
          </form>

          {/* Сообщение об успехе */}
          {submitted && (
            <div className="mt-6 p-4 bg-green-900/30 border border-green-500/50 rounded-2xl text-center text-green-400">
              ✅ Спасибо! Мы получили ваше сообщение и свяжемся с вами в ближайшее время.
            </div>
          )}
        </div>
      
    </div>
  </div>
</section>
      {/* Contacts Content */}
      <section className="py-16 md:py-24">
        <div className="container-custom">
          {/* Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Phone */}
            <div className="bg-[#111111] border border-[#222222] rounded-lg p-6 hover:border-[#f80000]/50 transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-sm text-gray-500 uppercase tracking-wider mb-3">
                Телефоны
              </h3>
              <div className="space-y-1">
                <a
                  href="tel:+78125352102"
                  className="text-lg font-light text-white hover:text-[#f80000]/50 transition-colors block"
                >
                  +7 (812) 535-21-02 доб. 5
                </a>
                <a
                  href="tel:+78122909660"
                  className="text-lg font-light text-white hover:text-[#f80000]/50 transition-colors block"
                >
                  +7 (812) 290-96-60
                </a>
                <a
                  href="tel:+79213523822"
                  className="text-lg font-light text-white hover:text-[#f80000]/50 transition-colors block"
                >
                  +7 (921) 352-38-22
                </a>
                <a
                  href="tel:+79990335733"
                  className="text-lg font-light text-white hover:text-[#f80000]/50 transition-colors block"
                >
                  +7 (999) 033-57-33
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="bg-[#111111] border border-[#222222] rounded-lg p-6 hover:border-[#f80000]/50 transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-sm text-gray-500 uppercase tracking-wider mb-3">
                Email
              </h3>
              <a
                href="mailto:zakaz@np-cmid.ru"
                className="text-lg font-light text-white hover:text-[#f80000]/50 transition-colors block"
              >
                zakaz@np-cmid.ru
              </a>
              
              <a
                href="mailto:ym.schinin@np-cmid.ru"
                className="text-lg font-light text-white hover:text-[#f80000]/50 transition-colors block"
              >
                ym.schinin@np-cmid.ru
              </a>
            </div>

            {/* Working Hours */}
            <div className="bg-[#111111] border border-[#222222] rounded-lg p-6 hover:border-[#f80000]/50 transition-all duration-300">
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
            <div className="bg-[#111111] border border-[#222222] rounded-lg p-6 hover:border-[#f80000]/50 transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-sm text-gray-500 uppercase tracking-wider mb-3">
                Адрес
              </h3>
              <p className="text-white text-sm leading-relaxed">
                Офис:<br />
                <p className="text-white text-xs leading-relaxed">
                  Россия, Ленинградская область,<br />
                  Сапкт-Петербург,<br />
                  Гражданский проспект, д. 26, отиф 1-15
                </p>
              </p>
              <br />
              <p className="text-white text-sm leading-relaxed">
                Поизводство:<br />
                <p className="text-white text-xs leading-relaxed">
                  Россия, Ленинградская область,<br />
                  Всеволожский район, Мурино,<br />
                  Центральный проезд, 10
                </p>
              </p>
            </div>
          </div>
        </div>
    
        {/* Full Width Map */}
        <div className="w-full py-16 md:py-24">
          <iframe
            src="https://yandex.ru/map-widget/v1/?ll=30.389295%2C60.006293&z=14&pt=30.389295%2C60.006293%2Ccomma"
            width="100%"
            height="650"
            frameBorder="0"
            allowFullScreen
            className="grayscale"
          />
        </div>
      </section>
      
    </main>
  );
};

export default ContactsPage;
