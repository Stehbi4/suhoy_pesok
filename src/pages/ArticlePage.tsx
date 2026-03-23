import { useParams, Link } from 'react-router-dom';
import { ChevronRight, ArrowUpRight, Check } from 'lucide-react';
import { getArticleBySlug, products } from '@/data/articles';
import { Badge } from '@/components/ui/badge';

const ArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? getArticleBySlug(slug) : null;

  if (!article) {
    return (
      <main className="min-h-screen pt-24 md:pt-28 bg- flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-light text-gray-900 mb-4">Статья не найдена</h1>
          <Link to="/articles" className="btn-primary rounded-lg inline-flex items-center gap-2">
            <span>Вернуться к статьям</span>
            <ArrowUpRight className="w-5 h-5" />
          </Link>
        </div>
      </main>
    );
  }

  // Find related products
  const relatedProducts = products.filter(product => 
    article.relatedProducts?.some(rp => product.id.includes(rp) || product.fraction.includes(rp))
  );

  return (
    <main className="min-h-screen pt-24 md:pt-28 bg-white">
      {/* Page Header */}
      <section className="relative py-16 md:py-24 bg-gray-50">
        <div className="container-custom">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-6">
            <Link to="/" className="hover:text-gray-900 transition-colors">Главная</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/articles" className="hover:text-gray-900 transition-colors">Статьи</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 line-clamp-1">{article.title}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 leading-tight mb-6">
            {article.title}
          </h1>
          
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <Badge
                key={tag}
                className="bg-[#2563eb]/10 text-[#2563eb] border border-[#2563eb]/30"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-16 md:py-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Featured Image */}
              <div className="relative rounded-lg overflow-hidden mb-10">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-[300px] md:h-[400px] object-cover"
                />
              </div>

              {/* Article Body */}
              <div className="prose prose-lg max-w-none text-gray-700">
                <div 
                  className="leading-relaxed whitespace-pre-line"
                  dangerouslySetInnerHTML={{ 
                    __html: article.content
                      .replace(/## (.*)/g, '<h2 class="text-3xl font-light text-gray-900 mt-12 mb-6">$1</h2>')
                      .replace(/### (.*)/g, '<h3 class="text-xl font-medium text-gray-900 mt-8 mb-4">$1</h3>')
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-900">$1</strong>')
                      .replace(/- (.*)/g, '<li class="flex items-start gap-2 mb-2"><span class="text-[#f80000] mt-1">•</span><span>$1</span></li>')
                  }}
                />
              </div>

              {/* CTA */}
              <div className="mt-12 p-8 bg-gray-50 border border-gray-200 rounded-lg">
                <h3 className="text-2xl font-light text-gray-900 mb-4">
                  Нужен кварцевый песок для {article.tags[0]}?
                </h3>
                <p className="text-gray-600 mb-6">
                  Свяжитесь с нами для получения консультации и расчёта стоимости.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/contacts"
                    className="bg-[#2563eb] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1d4ed8] transition-colors flex items-center justify-center gap-3"
                  >
                    <span>Связаться</span>
                    <ArrowUpRight className="w-5 h-5" />
                  </Link>
                  <Link
                    to="/catalog"
                    className="px-6 py-3 border border-gray-300 text-gray-900 rounded-lg font-semibold hover:border-[#2563eb] hover:text-[#2563eb] transition-all flex items-center justify-center gap-3"
                  >
                    <span>В каталог</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Related Products */}
              {relatedProducts.length > 0 && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-px bg-[#2563eb]" />
                    Подходящие фракции
                  </h3>
                  <div className="space-y-3">
                    {relatedProducts.map((product) => (
                      <Link
                        key={product.id}
                        to={`/product/${product.slug}`}
                        className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-[#f80000] transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-900 font-medium">{product.shortName}</span>
                          <Badge className="bg-[#f80000] text-white text-xs">
                            {product.gost}
                          </Badge>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Links */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-px bg-[#f80000]" />
                  Быстрые ссылки
                </h3>
                <div className="space-y-3">
                  <Link
                    to="/catalog"
                    className="flex items-center gap-3 text-gray-600 hover:text-[#f80000] transition-colors"
                  >
                    <Check className="w-4 h-4 text-[#f80000]" />
                    <span>Каталог продукции</span>
                  </Link>
                  <Link
                    to="/delivery"
                    className="flex items-center gap-3 text-gray-600 hover:text-[#f80000] transition-colors"
                  >
                    <Check className="w-4 h-4 text-[#f80000]" />
                    <span>Доставка и оплата</span>
                  </Link>
                  <Link
                    to="/contacts"
                    className="flex items-center gap-3 text-gray-600 hover:text-[#f80000] transition-colors"
                  >
                    <Check className="w-4 h-4 text-[#f80000]" />
                    <span>Контакты</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ArticlePage;
