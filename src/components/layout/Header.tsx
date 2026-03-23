import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  const location = useLocation();
  
  const lightPages = ['/catalog', '/articles', '/product'];
  const isLightPage = lightPages.some(page => location.pathname.startsWith(page));
  const shadowClass = isScrolled ? 'shadow-lg shadow-black/10' : '';

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;

      // Показываем/скрываем в зависимости от направления скролла
      const isVisible = prevScrollPos > currentScrollPos || currentScrollPos < 50;

      setVisible(isVisible);
      setIsScrolled(currentScrollPos > 20); // для изменения стиля при скролле
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

    // Styles based on page type
  const bgClass = isScrolled
    ? `${isLightPage ? 'bg-white/95 backdrop-blur-md border-b border-gray-200' : 'bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#222222]'}`
    : 'bg-transparent';
  
  const textClass = isLightPage ? 'text-gray-900' : 'text-white';
  const hoverTextClass = isLightPage ? 'hover:text-gray-600' : 'hover:text-gray-300';
  const activeTextClass = isLightPage ? 'text-gray-900 font-medium' : 'text-white font-medium';
  const logoSrc = isLightPage ? '/logo-light.png' : '/logo-dark.png';
  
  // Border styles for buttons
  const borderClass = isLightPage 
    ? 'border border-gray-300 hover:border-gray-500' 
    : 'border border-gray-700 hover:border-gray-500';
  
  const isActive = (path: string) => location.pathname === path;
  


  return (
    <header className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-300 ease-in-out
        ${visible ? 'translate-y-0' : '-translate-y-full'}
        ${bgClass} backdrop-blur-md
        ${shadowClass} 
        ${bgClass}`}>
      <div className="w-full px-[1cm]">
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* Logo with Name */}
          <Link to="/" className="flex items-center gap-3 sm:gap-4 group">
            <img
              src={logoSrc}
              alt="Сухой Песок"
              className="h-10 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <div className="hidden sm:block">
              <span className={`font-bold text-lg ${textClass} tracking-wider block`}>
                Сухой Песок
              </span>
            </div>
          </Link>
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center">
            {/* Left Group */}
            <div className="flex items-center gap-8 mr-[10vw] xl:mr-[25vw] ">
              {leftGroup.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm tracking-wider uppercase transition-colors px-4 py-2 rounded bg-transparent ${borderClass} ${hoverTextClass} ${
                    isActive(link.path) ? activeTextClass : textClass
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            
            {/* Right Group */}
            <div className="flex items-center gap-8">
              {rightGroup.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm tracking-wider uppercase transition-colors px-4 py-2 rounded bg-transparent ${borderClass} ${hoverTextClass} ${
                    isActive(link.path) ? activeTextClass : textClass
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
          
          {/* Mobile Menu Button */}
          <button
            className={`lg:hidden p-2 ${textClass}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className={`lg:hidden border-t ${isLightPage ? 'bg-white border-gray-200' : 'bg-[#0a0a0a] border-[#222222]'}`}>
          <nav className="container-custom py-8 flex flex-col gap-6">
            {[...leftGroup, ...rightGroup].map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-2xl font-light tracking-wider ${
                  isActive(link.path) ? (isLightPage ? 'text-gray-900 font-medium' : 'text-white font-medium') : textClass
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