'use client';

import { useParams, Link } from 'react-router-dom';
import { ArrowDown, ArrowLeft } from 'lucide-react';
import { products } from '@/data/articles';           // ← здесь все фракции
import { useAnimateOnScroll } from '@/hooks/useAnimateOnScroll';

const ProductPage = () => {
  const { slug } = useParams();
  const product = products.find((p) => p.slug === slug);

  // Запускаем анимации скролла один раз на всю страницу
  useAnimateOnScroll();

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white text-3xl">
        Товар не найден
      </div>
    );
  }

  return (
    <main className="bg-[#0a0a0a] text-white overflow-x-hidden">
      
      {/* ==================== 1. HERO — ПОЛНЫЙ ЭКРАН ==================== */}
      <section className="relative h-screen flex items-end justify-center overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/70 to-black" />

        <div className="container-custom relative z-10 pb-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
          {/* Левая часть — название */}
          <div className="animate-on-scroll">
            <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-10 lg:p-16">
              <h1 className="text-6xl md:text-7xl lg:text-[92px] font-light leading-none tracking-[-0.03em]">
                {product.name}
              </h1>
              <p className="text-[#f80000] text-3xl mt-4 font-light">{product.fraction}</p>
            </div>
          </div>

          {/* Правая часть — стрелка вниз */}
          <div className="flex justify-center lg:justify-end animate-on-scroll animation-delay-300">
            <div className="group flex flex-col items-center cursor-pointer">
              <ArrowDown className="w-20 h-20 text-white group-hover:text-[#f80000] transition-colors duration-300" />
              <span className="mt-6 text-lg tracking-[0.2em] uppercase font-light">Подробнее</span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 2. ОПИСАНИЕ + ФОТО ==================== */}
      <section className="min-h-screen py-20 lg:py-32 flex items-center">
        <div className="container-custom grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Текстовая колонка */}
          <div className="animate-on-scroll slide-in-left">
            <span className="uppercase text-[#f80000] tracking-widest text-sm">Фракция</span>
            <h2 className="text-5xl lg:text-6xl font-light mt-6 leading-tight">{product.shortName}</h2>
            
            <div className="mt-12 text-xl text-gray-300 leading-relaxed">
              {product.description}
            </div>

            {/* Краткие характеристики */}
            <div className="mt-16 grid grid-cols-2 gap-6">
              {Object.entries(product.specifications || {}).slice(0, 4).map(([key, value]) => (
                <div key={key} className="bg-[#111111] border border-[#222222] rounded-2xl p-8">
                  <div className="text-sm text-gray-500 uppercase tracking-wider">{key}</div>
                  <div className="text-3xl font-light text-white mt-3">{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Фото-блок */}
          <div className="animate-on-scroll fade-in-up animation-delay-300 relative">
            <div className="grid grid-cols-12 gap-4">
              {/* 4 мини-фото */}
              <div className="col-span-4 flex flex-col gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <img
                    key={i}
                    src={product.image}
                    alt={`Вид ${i}`}
                    className="aspect-square object-cover rounded-2xl border border-[#222222]"
                  />
                ))}
              </div>
              {/* Большое фото */}
              <div className="col-span-8">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-3xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 3–4. ТАБЛИЦЫ ХАРАКТЕРИСТИК (один фон) ==================== */}
      <section className="relative py-32 bg-cover bg-center" style={{ backgroundImage: `url(${product.image})` }}>
        <div className="absolute inset-0 bg-black/90" />
        
        <div className="container-custom relative z-10">
          {/* Полная таблица характеристик */}
          <div className="animate-on-scroll mb-32">
            <h3 className="text-4xl font-light text-center mb-12">Полные технические характеристики</h3>
            <div className="max-w-5xl mx-auto bg-[#111111] border border-[#222222] rounded-3xl overflow-hidden">
              <table className="w-full">
                <tbody className="divide-y divide-[#222222]">
                  {Object.entries(product.technicalData || {}).map(([key, value]) => (
                    <tr key={key} className="hover:bg-[#1a1a1a]">
                      <td className="px-12 py-7 text-gray-400">{key}</td>
                      <td className="px-12 py-7 font-light text-right">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Химический + Гранулометрический состав */}
          <div className="grid lg:grid-cols-2 gap-20">
            <div className="animate-on-scroll animation-delay-200">
              <h4 className="text-3xl font-light mb-10">Химический состав</h4>
              <div className="space-y-8">
                {Object.entries(product.chemicalComposition || {}).map(([key, val]) => (
                  <div key={key} className="flex justify-between border-b border-[#222222] pb-6">
                    <span className="text-gray-400">{key}</span>
                    <span className="text-2xl text-[#f80000] font-light">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="animate-on-scroll animation-delay-400">
              <h4 className="text-3xl font-light mb-10">Гранулометрический (ситовой) анализ</h4>
              <div className="space-y-8">
                {Object.entries(product.sieveAnalysis || {}).map(([key, val]) => (
                  <div key={key} className="flex justify-between border-b border-[#222222] pb-6">
                    <span>{key}</span>
                    <span className="font-light">{val}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 5. БОЛЬШАЯ ЦИФРА SiO₂ ==================== */}
      <section className="relative h-screen flex items-center overflow-hidden">
        <div className="container-custom grid grid-cols-1 lg:grid-cols-2 gap-12 h-full items-center">
          <div className="animate-on-scroll text-center lg:text-left">
            <div className="text-[160px] lg:text-[240px] font-light leading-none text-[#f80000] tracking-[-0.06em]">
              {product.technicalData?.['Содержание оксида кремния (SiO₂), %, не менее'] || '85'}
            </div>
            <p className="text-5xl -mt-8 font-light">SiO₂</p>
            <p className="text-xl text-gray-400 max-w-md mx-auto lg:mx-0 mt-10">
              Высочайшая чистота, которой доверяют профессионалы
            </p>
          </div>

          <div className="animate-on-scroll fade-in-up animation-delay-500 relative h-full">
            <img
              src={product.image}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a0a]" />
          </div>
        </div>
      </section>

      {/* ==================== 6. ОБЛАСТИ ПРИМЕНЕНИЯ ==================== */}
      <section className="py-32">
        <div className="container-custom">
          <div className="flex items-center gap-4 mb-16">
            <div className="h-px w-12 bg-white" />
            <span className="uppercase text-sm tracking-[0.3em]">Области применения</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {product.applicationAreas?.map((area, i) => (
              <div
                key={i}
                className={`animate-on-scroll card-hover bg-[#111111] border border-[#222222] rounded-3xl p-12 hover:border-[#f80000]/50 transition-all ${
                  i === 0 ? 'animation-delay-100' : i === 1 ? 'animation-delay-300' : 'animation-delay-500'
                }`}
              >
                <div className="text-[#f80000] text-6xl font-light mb-8">0{i + 1}</div>
                <h4 className="text-3xl font-light leading-tight">{area}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 7. КНОПКА НАЗАД ==================== */}
      <section className="h-screen flex items-center bg-black">
        <div className="container-custom text-center animate-on-scroll animation-delay-200">
          <Link
            to="/catalog"
            className="group inline-flex items-center gap-8 text-5xl font-light hover:text-[#f80000] transition-colors"
          >
            <ArrowLeft className="w-14 h-14 group-hover:-translate-x-6 transition-transform duration-300" />
            Вернуться в каталог
          </Link>
          <p className="text-gray-500 mt-10 text-lg">Нужен расчёт стоимости? Напишите нам</p>
        </div>
      </section>
    </main>
  );
};

export default ProductPage;