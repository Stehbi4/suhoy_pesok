import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { articles } from '@/data/articles';

const ArticlesPage = () => {
  const [hoveredArticle, setHoveredArticle] = useState<string | null>(null);

  return (
    <main className="min-h-screen pt-24 md:pt-28 bg-white">
      
      {/* Articles List with Hover Image */}
      <section className="py-16 md:py-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Articles List */}
            <div className="space-y-0">
              {articles.map((article, index) => (
                <Link
                  key={article.id}
                  to={`/articles/${article.slug}`}
                  className="group block border-b border-gray-200 py-6 first:pt-0"
                  onMouseEnter={() => setHoveredArticle(article.slug)}
                  onMouseLeave={() => setHoveredArticle(null)}
                >
                  <div className="flex items-start gap-6">
                    <span className="text-gray-400 text-sm font-mono mt-1">
                      {String(index + 1).padStart(2, '0')}.
                    </span>
                    <div className="flex-1">
                      <h3 className="text-2xl md:text-3xl font-light text-gray-900 group-hover:text-[#f80000] transition-colors duration-300">
                        {article.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="text-[#f80000]/90 text-sm">Читать статью</span>
                        <ArrowUpRight className="w-4 h-4 text-[#f80000]/90" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Hover Image */}
            <div className="hidden lg:block relative">
              <div className="sticky top-32">
                {articles.map((article) => (
                  <div
                    key={article.slug}
                    className={`absolute inset-0 transition-all duration-500 ${
                      hoveredArticle === article.slug
                        ? 'opacity-100 scale-100'
                        : 'opacity-0 scale-95'
                    }`}
                  >
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-[400px] object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/60 to-transparent rounded-lg" />
                  </div>
                ))}
                {/* Default state - no hover */}
                {!hoveredArticle && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-gray-400 text-lg">
                      Наведите на статью для предпросмотра
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
};

export default ArticlesPage;
