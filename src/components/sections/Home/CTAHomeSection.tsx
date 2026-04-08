import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CTAHomeSection = () => {
  return (
    <section className="relative bg-brand-bg overflow-hidden">
      <div className="relative z-10 px-6 sm:px-10 lg:px-[1cm] py-10 lg:py-14 flex flex-col items-start gap-6">
        <h2 className="text-xl md:text-3xl lg:text-4xl font-light leading-tight text-gray-500 text-left">
          Посмотреть на перечень нашей продукции.
        </h2>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Link
            to="/catalog"
            className="btn-primary rounded-lg inline-flex items-center justify-center gap-3"
          >
            <span>Смотреть каталог</span>
            <ArrowUpRight className="w-5 h-5" />
          </Link>
          <Link
            to="/contacts"
            className="px-6 py-3 border border-gray-700 text-white rounded-lg font-semibold tracking-wide hover:border-brand-red hover:text-white transition-all duration-300 flex items-center justify-center gap-3"
          >
            <span>Связаться с нами</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTAHomeSection;
