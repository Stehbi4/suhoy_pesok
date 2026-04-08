import { Link, useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();
  const currentYear = new Date().getFullYear();

  // Only CatalogPage gets light footer; everything else gets dark footer
  const isLightPage = location.pathname === '/catalog';

  const bgClass     = isLightPage ? 'bg-brand-page border-brand-alt' : 'bg-brand-bg border-[#222]';
  const textClass   = isLightPage ? 'text-brand-dark'                : 'text-white';
  const mutedClass  = 'text-gray-500';
  const borderClass = isLightPage ? 'border-brand-alt'               : 'border-[#222]';
  const logoSrc     = isLightPage ? '/Logo/logo-light.png'           : '/Logo/logo-dark.png';

  // inactive button
  const btnClass = isLightPage
    ? 'border border-brand-alt text-brand-dark hover:border-brand-dark/40 hover:text-brand-dark/60'
    : 'border border-gray-700 text-white hover:border-gray-500 hover:text-gray-300';

  // active button — current page accent
  // light (catalog): graphite bg + white text + red border
  // dark: white bg + dark text + red border
  const activeBtnClass = isLightPage
    ? 'bg-brand-graphite text-white font-semibold border border-brand-red'
    : 'bg-white text-brand-dark font-semibold border border-brand-red';

  const isActive = (path: string) => {
    // /product/:slug → подсвечиваем «Продукция» (catalog)
    if (path === '/catalog') return location.pathname === '/catalog' || location.pathname.startsWith('/product/');
    // /articles/:slug → подсвечиваем «Статьи» (footer не содержит эту кнопку, но на всякий случай)
    if (path === '/articles') return location.pathname === '/articles' || location.pathname.startsWith('/articles/');
    return location.pathname.startsWith(path);
  };

  const navLinks = [
    { path: '/about',    label: 'О Нас'    },
    { path: '/delivery', label: 'Доставка' },
    { path: '/contacts', label: 'Контакты' },
  ];

  return (
    <footer className={`${bgClass} border-t`}>
      <div className="w-full px-[1cm] py-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-4">
            <div className="w-10 h-10 flex items-center justify-center">
              <img src={logoSrc} alt="ПЕСОК" className="w-full h-full object-contain" />
            </div>
            <div className="hidden sm:block">
              <span className={`font-bold text-lg tracking-wider block ${textClass}`}>
                Сухой Песок
              </span>
            </div>
          </Link>

          {/* Nav buttons + Contact */}
          <div className="flex items-center gap-10">
            <nav className="flex items-center gap-5">
              {navLinks.map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  className={`
                    text-sm tracking-wider uppercase transition-all duration-200
                    px-4 py-2 rounded
                    ${isActive(path) ? activeBtnClass : btnClass}
                  `}
                >
                  {label}
                </Link>
              ))}
            </nav>

            <div className="text-left lg:text-right">
              <a
                href="tel:+78122909660"
                className={`${textClass} hover:text-gray-400 transition-colors text-base font-light whitespace-nowrap`}
              >
                +7 (812) 290-96-60
              </a>
              <p className={`text-sm mt-1 ${mutedClass}`}>Санкт-Петербург, Россия</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className={`mt-8 pt-8 border-t ${borderClass} flex flex-col md:flex-row justify-between items-center gap-4`}>
          <p className={`text-sm ${mutedClass}`}>
            © {currentYear} Сухой Песок. Все права защищены.
          </p>
          <p className={`text-sm ${isLightPage ? 'text-gray-400' : 'text-[#444]'}`}>
            Сухой кварцевый песок высокого качества
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
