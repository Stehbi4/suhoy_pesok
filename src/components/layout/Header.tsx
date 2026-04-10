import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  const location = useLocation();

  // ── page type ──────────────────────────────────────────────────────────────
  const knownRoutes = ['/', '/catalog', '/about', '/delivery', '/contacts', '/articles', '/404'];
  const isKnown     = knownRoutes.includes(location.pathname) ||
                      location.pathname.startsWith('/articles/') ||
                      location.pathname.startsWith('/product/');
  const isLightPage = location.pathname === '/catalog' || location.pathname === '/404' || !isKnown;
  const isTransparentPage = location.pathname === '/delivery' ||
                            location.pathname.startsWith('/articles/') ||
                            location.pathname.startsWith('/product/');

  useEffect(() => {
    const handleScroll = () => {
      const cur = window.scrollY;
      setVisible(prevScrollPos > cur || cur < 50);
      setIsScrolled(cur > 20);
      setPrevScrollPos(cur);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  const leftGroup  = [
    { path: '/catalog',  label: 'Продукция' },
    { path: '/articles', label: 'Статьи'    },
  ];
  const rightGroup = [
    { path: '/about',    label: 'О Нас'     },
    { path: '/delivery', label: 'Доставка'  },
    { path: '/contacts', label: 'Контакты'  },
  ];

  // ── per-variant styles ─────────────────────────────────────────────────────
  let headerBg:       string;
  let textClass:      string;
  let hoverClass:     string;
  let logoSrc:        string;
  let btnClass:       string;   // inactive button
  let activeBtnClass: string;   // active (current page) button — full override
  let mobileMenuClass: string;

  if (isLightPage) {
    // 2. White background
    headerBg = isScrolled
      ? 'bg-brand-page/95 backdrop-blur-md border-b border-brand-alt shadow-sm'
      : 'bg-brand-page/80 backdrop-blur-sm';
    textClass      = 'text-brand-dark';
    hoverClass     = 'hover:text-brand-dark/60 hover:border-brand-dark/40';
    logoSrc        = '/Logo/logo-light.png';
    btnClass       = 'border border-brand-alt text-brand-dark';
    // active: graphite bg + white text + red border
    activeBtnClass = 'bg-gray-200 text-brand-dark font-semibold border border-brand-red';
    mobileMenuClass = 'bg-brand-page border-brand-alt';

  } else if (isTransparentPage) {
    // 3. Transparent — backdrop-blur-[5px] (≈20% больше sm=4px)
    // will-change: transform фиксирует compositing во время slide анимации
    headerBg = 'backdrop-blur-[5px] [will-change:transform]';
    textClass      = 'text-white';
    hoverClass     = 'hover:text-white/70 hover:border-white/40 hover:bg-black/45';
    logoSrc        = '/Logo/logo-dark.png';
    // inactive: тёмная полупрозрачная пилюля
    btnClass       = 'bg-black/30 backdrop-blur-[5px] border border-white/20 text-white';
    // active: белое затемнение + красный текст + красная рамка
    activeBtnClass = 'bg-white/20 backdrop-blur-[5px] border border-brand-red text-whight font-semibold';
    mobileMenuClass = 'bg-black/80 backdrop-blur-md border-white/10';

  } else {
    // 1. Transparent (default — home, product pages)
    headerBg       = '';
    textClass      = 'text-white';
    hoverClass     = 'hover:text-white/60';
    logoSrc        = '/Logo/logo-dark.png';
    btnClass       = 'text-white';
    activeBtnClass = 'text-brand-red font-semibold';
    mobileMenuClass = 'bg-black/70 backdrop-blur-md border-white/10';
  }

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    // /articles/:slug → подсвечиваем «Статьи»
    if (path === '/articles') return location.pathname === '/articles' || location.pathname.startsWith('/articles/');
    // /product/:slug → подсвечиваем «Продукция» (catalog)
    if (path === '/catalog') return location.pathname === '/catalog' || location.pathname.startsWith('/product/');
    return location.pathname.startsWith(path);
  };

  const linkCls = (path: string) =>
    `text-sm tracking-wider uppercase transition-all duration-200 px-4 py-2 rounded
     ${isActive(path) ? activeBtnClass : `${btnClass} ${hoverClass}`}`;

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-300 ease-in-out
        ${visible ? 'translate-y-0' : '-translate-y-full'}
        ${headerBg}
      `}
    >
      <div className="w-full px-[1cm]">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 sm:gap-4 group">
            <img
              src={logoSrc}
              alt="Сухой Песок"
              className="h-10 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <div className="hidden sm:block">
              <span className={`font-bold text-lg tracking-wider block ${textClass}`}>
                Сухой Песок
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center">
            <div className="flex items-center gap-8 mr-[10vw] xl:mr-[25vw]">
              {leftGroup.map(({ path, label }) => (
                <Link key={path} to={path} className={linkCls(path)}>{label}</Link>
              ))}
            </div>
            <div className="flex items-center gap-8">
              {rightGroup.map(({ path, label }) => (
                <Link key={path} to={path} className={linkCls(path)}>{label}</Link>
              ))}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className={`lg:hidden p-2 ${textClass} ${
              isTransparentPage
                ? 'bg-black/30 backdrop-blur-[5px] rounded-lg border border-white/20'
                : ''
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className={`lg:hidden border-t ${mobileMenuClass}`}>
          <nav className="w-full px-[1cm] py-8 flex flex-col gap-6">
            {[...leftGroup, ...rightGroup].map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`text-2xl font-light tracking-wider transition-colors ${
                  isActive(path)
                    ? `${activeBtnClass} px-4 py-2 rounded`
                    : `${textClass} ${hoverClass}`
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
