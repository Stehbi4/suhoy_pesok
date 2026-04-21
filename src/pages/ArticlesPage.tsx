import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, X } from 'lucide-react';
import { articles } from '@/data/articles';

const ArticlesPage = () => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined'
      ? window.matchMedia('(min-width: 1024px)').matches
      : true,
  );
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return (
    <main className="h-screen overflow-hidden bg-brand-bg flex">

      {/* Левая часть — картинка, 1/3 ширины, 2/3 высоты, прибита к низу */}
      <div className="hidden lg:flex w-1/3 flex-shrink-0 flex-col justify-end px-[1cm] pb-[1cm]">
        <div className="relative h-[66vh] rounded-xl overflow-hidden">
          {articles.map((article) => (
            <div
              key={article.id}
              className="absolute inset-0 transition-all duration-500"
              style={{
                opacity: hoveredId === article.id ? 1 : 0,
                transform: hoveredId === article.id ? 'scale(1)' : 'scale(1.03)',
              }}
            >
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          ))}

        </div>
      </div>

      {/* Правая часть — список, 2/3 ширины */}
      <div className="flex-1 flex flex-col justify-center px-4 md:px-16 lg:pr-[1cm] lg:pl-0">

        {/* Кнопка закрытия */}
        <div className="absolute top-8 left-4 lg:left-[1cm]">
          <Link to="/" className="text-white/50 hover:text-white transition-colors">
            <X className="w-8 h-8" />
          </Link>
        </div>

        {/* Список статей */}
        <nav className="flex flex-col">
          {articles.map((article, index) => {
            const isHovered = hoveredId === article.id;
            return (
              <Link
                key={article.id}
                to={`/articles/${article.slug}`}
                className="group flex items-baseline gap-3 lg:gap-8 transition-all duration-300 cursor-pointer"
                style={{
                  paddingTop: isDesktop ? (isHovered ? '1.2em' : '0.4em') : '0.35em',
                  paddingBottom: isDesktop ? (isHovered ? '1.2em' : '0.4em') : '0.35em',
                }}
                onMouseEnter={() => setHoveredId(article.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Номер */}
                <span
                  className="font-mono flex-shrink-0 w-7 lg:w-12 transition-all duration-300"
                  style={{
                    fontSize: isDesktop
                      ? (isHovered ? '1.1rem' : '0.85rem')
                      : '0.7rem',
                    color: isHovered ? '#ffffff' : 'rgba(255,255,255,0.25)',
                  }}
                >
                  {String(index + 1).padStart(2, '0')}.
                </span>

                {/* Название */}
                <span
                  className="font-light leading-[1.15] transition-all duration-300"
                  style={{
                    fontSize: isDesktop
                      ? (isHovered ? '2.4rem' : '1.65rem')
                      : '0.95rem',
                    color: isDesktop && !isHovered ? 'rgba(255,255,255,0.4)' : '#ffffff',
                  }}
                >
                  {article.title}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </main>
  );
};

export default ArticlesPage;
