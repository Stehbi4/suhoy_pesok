import { Link } from 'react-router-dom';
import { ArrowUpRight, Phone } from 'lucide-react';

const ProductKeyPhrase = () => {
    return (
    <section className="py-32 md:py-40 border-t border-[#222222] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-[#f80000]/10 via-transparent to-transparent opacity-30" />

      <div className="container-custom relative z-10 text-center">
        <h2 className="text-5xl md:text-7xl lg:text-8xl font-light leading-tight mb-10">
          Готовы поставить песок<br />
          <span className="text-[#f80000] font-medium">под ваш проект?</span>
        </h2>

        <p className="text-xl md:text-3xl text-gray-300 mb-16 max-w-4xl mx-auto">
          Оставьте заявку — пришлём коммерческое предложение и сертификаты за 15 минут
        </p>

        <div className="flex flex-col sm:flex-row gap-8 justify-center">
          <Link
            to="/contacts"
            className="bg-[#f80000] hover:bg-[#d90000] text-white text-2xl md:text-3xl font-medium px-16 py-8 rounded-xl flex items-center justify-center gap-4 shadow-[0_0_60px_rgba(248,0,0,0.35)]"
          >
            Получить КП
            <ArrowUpRight className="w-8 h-8" />
          </Link>

          <a
            href="tel:+78122909660"
            className="border-2 border-[#f80000] hover:bg-[#f80000]/10 text-[#f80000] text-2xl md:text-3xl font-medium px-16 py-8 rounded-xl flex items-center justify-center gap-4"
          >
            <Phone className="w-8 h-8" />
            +7 (812) 290-96-60
          </a>
        </div>
      </div>
    </section>
  );
};

export default ProductKeyPhrase