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
  // light (white bg): CatalogPage only
  const isLightPage = location.pathname === '/catalog';
  // transparent (over hero image): DeliveryPage + individual ArticlePage
  const isTransparentPage =
    location.pathname === '/delivery' ||
    location.pathname.startsWith('/articles/');
  // dark = everything else (default)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const isVisible = prevScrollPos > currentScrollPos || currentScrollPos < 50;
      setVisible(isVisible);
      setIsScrolled(currentScrollPos > 20);
      setPrevScrollPos(currentScrollPos);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  const leftGroup = [
    { path: '/catalog', label: 'Продукция' },
    { path: '/articles', label: 'Статьи' },
  ];
  const rightGroup = [
    { path: '/about', label: 'О Нас' },
    { path: '/delivery', label: 'Доставка' },
    { path: '/contacts', label: 'Контакты' },
  ];

  // ── per-variant styles ────────────────────────────────────────────────────
  let headerBg: string;
  let textClass: string;
  let hoverTextClass: string;
  let activeTextClass: string;
  let logoSrc: string;
  // button style — for transparent: dark pill behind each button; others: plain border
  let btnClass: string;
  let mobileMenuClass: string;

  if (isLightPage) {
    // 2. White background
    headerBg = isScrolled
      ? 'bg-brand-page/95 backdrop-blur-md border-b border-brand-alt shadow-sm'
      : 'bg-brand-page/80 backdrop-blur-sm';
    textClass = 'text-brand-dark';
    hoverTextClass = 'hover:text-brand-dark/60';
    activeTextClass = 'text-brand-dark font-semibold';
    logoSrc = '/Logo/logo-light.png';
    btnClass = 'border border-brand-alt hover:border-brand-dark/40';
    mobileMenuClass = 'bg-brand-page border-brand-alt';

  } else if (isTransparentPage) {
    // 3. Transparent — subtle blur on header, dark pill on buttons for readability
    headerBg = 'backdrop-blur-sm';
    textClass = 'text-white';
    hoverTextClass = 'hover:text-white/70';
    activeTextClass = 'text-white font-semibold';
    logoSrc = '/Logo/logo-dark.png';
    // Each button gets its own dark semi-transparent pill
    btnClass = 'bg-black/30 backdrop-blur-sm border border-white/20 hover:bg-black/45 hover:border-white/40';
    mobileMenuClass = 'bg-black/80 backdrop-blur-md border-white/10';

  } else {
    // 1. Dark background (default)
    headerBg = isScrolled
      ? 'bg-brand-bg/95 backdrop-blur-md border-b border-[#222] shadow-lg shadow-black/10'
      : 'bg-transparent';
    textClass = 'text-white';
    hoverTextClass = 'hover:text-gray-300';
    activeTextClass = 'text-white font-semibold';
    logoSrc = '/Logo/logo-dark.png';
    btnClass = 'border border-gray-700 hover:border-gray-500';
    mobileMenuClass = 'bg-brand-bg border-[#222]';
  }

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    // /articles list: exact match only (not /articles/:slug)
    if (path === '/articles') return location.pathname === '/articles';
    return location.pathname.startsWith(path);
  };

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
              {leftGroup.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`
                    text-sm tracking-wider uppercase transition-all duration-200
                    px-4 py-2 rounded
                    ${btnClass}
                    ${hoverTextClass}
                    ${isActive(link.path) ? activeTextClass : textClass}
                  `}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-8">
              {rightGroup.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`
                    text-sm tracking-wider uppercase transition-all duration-200
                    px-4 py-2 rounded
                    ${btnClass}
                    ${hoverTextClass}
                    ${isActive(link.path) ? activeTextClass : textClass}
                  `}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className={`lg:hidden p-2 ${textClass} ${isTransparentPage ? 'bg-black/30 backdrop-blur-sm rounded-lg border border-white/20' : ''}`}
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
            {[...leftGroup, ...rightGroup].map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-2xl font-light tracking-wider transition-colors ${
                  isActive(link.path) ? activeTextClass : `${textClass} ${hoverTextClass}`
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
