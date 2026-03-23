import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

const ProductApplications = ({ product, relatedArticles }: { product: any; relatedArticles: any[] }) => (
  <section className="py-16 md:py-24 bg-[#0a0a0a]">
    <div className="container-custom">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-px bg-white" />
        <span className="uppercase tracking-widest text-sm text-white/70">Области применения</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {product.applicationAreas.map((area: string, i: number) => (
          <div key={i} className="flex gap-4 bg-[#111111] border border-[#222222] rounded-2xl p-6 hover:border-[#f80000]">
            <Check className="w-6 h-6 text-[#f80000] mt-1" />
            <span className="text-lg text-white">{area}</span>
          </div>
        ))}
      </div>

      {/* Связанные статьи */}
      {relatedArticles.length > 0 && (
        <div className="mt-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-px bg-[#f80000]" />
            <span className="text-[#f80000] uppercase tracking-widest text-sm">Полезные статьи</span>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedArticles.map((art) => (
              <Link key={art.id} to={`/articles/${art.slug}`} className="group">
                <img src={art.image} className="w-full h-52 object-cover rounded-2xl mb-4 group-hover:scale-105 transition-transform" />
                <h3 className="text-xl text-white group-hover:text-[#f80000]">{art.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  </section>
);

export default ProductApplications;