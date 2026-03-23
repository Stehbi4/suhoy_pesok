import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, X } from 'lucide-react';
import { articles } from '@/data/articles';

const ArticlesPage = () => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <main className="h-screen overflow-hidden bg-[#0a0a0a] flex">

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
      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:pr-[1cm] lg:pl-0">

        {/* Кнопка закрытия */}
        <div className="absolute top-8 left-8 lg:left-[1cm]">
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
                className="group flex items-baseline gap-8 transition-all duration-300 cursor-pointer"
                style={{
                  paddingTop: isHovered ? '1.2em' : '0.4em',
                  paddingBottom: isHovered ? '1.2em' : '0.4em',
                }}
                onMouseEnter={() => setHoveredId(article.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Номер */}
                <span
                  className="font-mono flex-shrink-0 w-12 transition-all duration-300"
                  style={{
                    fontSize: isHovered ? '1.1rem' : '0.85rem',
                    color: isHovered ? '#ffffff' : 'rgba(255,255,255,0.25)',
                  }}
                >
                  {String(index + 1).padStart(2, '0')}.
                </span>

                {/* Название */}
                <span
                  className="font-light leading-tight transition-all duration-300"
                  style={{
                    fontSize: isHovered ? '2.4rem' : '1.65rem',
                    color: isHovered ? '#ffffff' : 'rgba(255,255,255,0.4)',
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
