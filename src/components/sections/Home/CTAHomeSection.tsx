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
            className="btn-primary inline-flex items-center gap-2.5"
          >
            <span>Смотреть каталог</span>
            <ArrowUpRight className="w-4 h-4" strokeWidth={1.5} />
          </Link>
          <Link
            to="/contacts"
            className="btn-sec"
          >
            <span>Связаться с нами</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTAHomeSection;
