import { Link, useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();
  const currentYear = new Date().getFullYear();

  // Pages with light background
  const lightPages = ['/catalog', '/articles', '/product'];
  const isLightPage = lightPages.some(page => location.pathname.startsWith(page));


  // Styles based on page type
  const bgClass = isLightPage ? 'bg-white border-gray-200' : 'bg-[#0a0a0a] border-[#222222]';
  const textClass = isLightPage ? 'text-gray-900' : 'text-white';
  const mutedTextClass = isLightPage ? 'text-gray-500' : 'text-gray-500';
  const borderClass = isLightPage ? 'border-gray-200' : 'border-[#222222]';
  const logoSrc = isLightPage ? '/Logo/logo-light.png' : '/Logo/logo-dark.png';

  return (
    <footer className={`${bgClass} border-t`}>
      

      {/* Bottom Bar */}
      <div className={`border-t ${borderClass}`}>
        <div className="w-full px-[1cm] py-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-4">
              <div className="w-10 h-10 flex items-center justify-center">
                <img 
                  src={logoSrc}
                  alt="ПЕСОК" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="hidden sm:block">
                <span className={`font-bold text-lg ${textClass} tracking-wider block`}>
                Сухой Песок
              </span>
              </div>
            </Link>

          {/* Contact */}
            <div className="text-left lg:text-right">
              <a
                href="tel:+78122909660"
                className={`${textClass} hover:text-gray-400 transition-colors text-base font-light whitespace-nowrap`}
              >
                +7 (812) 290-96-60
              </a>
              <p className={`text-sm mt-1 ${mutedTextClass}`}>
                Санкт-Петербург, Россия
              </p>
            </div>
          </div>

          {/* Copyright */}
          <div className={`mt-8 pt-8 border-t ${borderClass} flex flex-col md:flex-row justify-between items-center gap-4`}>
            <p className={`text-sm ${mutedTextClass}`}>
              © {currentYear} Сухой Песок. Все права защищены.
            </p>
            <p className={`text-sm ${isLightPage ? 'text-gray-400' : 'text-[#444444]'}`}>
              Сухой кварцевый песок высокого качества
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
