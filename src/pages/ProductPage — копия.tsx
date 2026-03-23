// src/pages/ProductPage.tsx
import { useParams, Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

import {products} from '@/data/articles';
import ProductHero from '@/components/sections/Product/ProductHero';
import ProductDescription from '@/components/sections/Product/ProductDescription';
import ProductSpecs from '@/components/sections/Product/ProductSpecs';
import ProductChemistry from '@/components/sections/Product/ProductChemistry';
import ProductKeyPhrase from '@/components/sections/Product/ProductKeyPhrase';
import ProductApplications from '@/components/sections/Product/ProductApplications';
import ProductBackToCatalog from '@/components/sections/Product/ProductBackToCatalog';

const ProductPage = () => {
  const { slug } = useParams();
  const product = products.find(p => p.slug === slug);

   if (!product) {
    return (
      <main className="min-h-screen pt-24 md:pt-28 bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-light text-gray-900 mb-4">Товар не найден</h1>
          <Link to="/catalog" className="bg-[#f80000] text-white px-6 py-3 rounded-lg inline-flex items-center gap-2 hover:bg-[#1d4ed8] transition-colors">
            <span>Вернуться в каталог</span>
            <ArrowUpRight className="w-5 h-5" />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#0a0a0a] min-h-screen">
      <ProductHero product={product} />
      <ProductDescription product={product} />
      <ProductSpecs product={product} />
      <ProductChemistry product={product} />
      <ProductKeyPhrase product={product} />
      <ProductApplications product={product} />
      <ProductBackToCatalog />
    </main>
  );
};

export default ProductPage;