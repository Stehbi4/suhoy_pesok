import { useState, useMemo, useEffect, useCallback } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { products } from '@/data/articles';
import { BG_PAGE } from '@/styles/theme';

import { ProductHeroSection }         from '@/components/sections/Product/ProductHeroSection';
import { ProductInfoSection }          from '@/components/sections/Product/ProductInfoSection';
import { ProductDataCubeSection }      from '@/components/sections/Product/ProductDataCubeSection';
import { ProductDuneSection }          from '@/components/sections/Product/ProductDuneSection';
import { ProductApplicationsSection }  from '@/components/sections/Product/ProductApplicationsSection';
import { ProductCalculatorSection }    from '@/components/sections/Product/ProductCalculatorSection';
import { ProductPackagingSection }     from '@/components/sections/Product/ProductPackagingSection';
import { ProductCTASection }           from '@/components/sections/Product/ProductCTASection';
import { ProductLightbox }             from '@/components/sections/Product/ProductLightbox';

const ProductPage = () => {
  const { slug } = useParams();
  const product  = products.find((p) => p.slug === slug);

  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const galleryImages = useMemo(() => {
    if (!product) return [];
    return [...product.images.gallery.slice(0, 4), product.images.main];
  }, [product]);

  const closeLightbox = useCallback(() => setLightboxIdx(null), []);
  const prevLightbox  = useCallback(
    () => setLightboxIdx(i => i === null ? null : (i - 1 + galleryImages.length) % galleryImages.length),
    [galleryImages.length],
  );
  const nextLightbox  = useCallback(
    () => setLightboxIdx(i => i === null ? null : (i + 1) % galleryImages.length),
    [galleryImages.length],
  );

  useEffect(() => {
    if (lightboxIdx === null) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape')     closeLightbox();
      if (e.key === 'ArrowLeft')  prevLightbox();
      if (e.key === 'ArrowRight') nextLightbox();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [lightboxIdx, closeLightbox, prevLightbox, nextLightbox]);

  useEffect(() => {
    document.body.style.overflow = lightboxIdx !== null ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [lightboxIdx]);

  if (!product) return <Navigate to="/404" replace />;

  return (
    <main className="overflow-x-hidden" style={{ background: BG_PAGE }}>
      {/* 01 — Hero */}
      <ProductHeroSection product={product} />

      {/* 02 — Описание + галерея */}
      <ProductInfoSection product={product} galleryImages={galleryImages} setLightboxIdx={setLightboxIdx} />

      {/* 03 — Куб данных (характеристики / гранулометрия / химсостав) */}
      <ProductDataCubeSection product={product} />

      {/* 04 — Дюна */}
      <ProductDuneSection product={product} />

      {/* 05 — Области применения */}
      <ProductApplicationsSection product={product} galleryImages={galleryImages} />

      {/* 06 — Калькулятор */}
      <ProductCalculatorSection />

      {/* 07 — Упаковка и документация */}
      <ProductPackagingSection product={product} />

      {/* 08 — CTA */}
      <ProductCTASection />

      {/* Лайтбокс */}
      <ProductLightbox
        product={product}
        lightboxIdx={lightboxIdx}
        galleryImages={galleryImages}
        onClose={closeLightbox}
        onPrev={prevLightbox}
        onNext={nextLightbox}
        setLightboxIdx={setLightboxIdx}
      />
    </main>
  );
};

export default ProductPage;
