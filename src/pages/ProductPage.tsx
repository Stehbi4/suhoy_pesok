import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Droplets, Circle, Wind, Copy, Check, Truck, Package, ChevronDown } from 'lucide-react';
import { products } from '@/data/articles';
import { useAnimateOnScroll } from '@/hooks/useAnimateOnScroll';

const ProductPage = () => {
  const { slug } = useParams();
  const product = products.find((p) => p.slug === slug);
  const [hoveredSieve, setHoveredSieve] = useState<string | null>(null);
  const [copiedRow, setCopiedRow] = useState<string | null>(null);
  const [calcShape, setCalcShape] = useState<'cylinder' | 'rectangle'>('cylinder');
  const [calcDiameter, setCalcDiameter] = useState('');
  const [calcWidth, setCalcWidth] = useState('');
  const [calcLength, setCalcLength] = useState('');
  const [calcHeight, setCalcHeight] = useState('');

  useAnimateOnScroll();

  const calcResult = useMemo(() => {
    const h = parseFloat(calcHeight) || 0;
    let volume = 0;
    if (calcShape === 'cylinder') {
      const d = parseFloat(calcDiameter) || 0;
      volume = Math.PI * Math.pow(d / 2, 2) * h;
    } else {
      const w = parseFloat(calcWidth) || 0;
      const l = parseFloat(calcLength) || 0;
      volume = w * l * h;
    }
    const density = 1500;
    const tons = (volume * density) / 1000;
    const bigbags = Math.ceil(tons);
    return { volume: volume.toFixed(2), tons: tons.toFixed(2), bigbags };
  }, [calcShape, calcDiameter, calcWidth, calcLength, calcHeight]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white text-3xl">
        Товар не найден
      </div>
    );
  }

  const img = product.images;
  const sio2Value = product.technicalData?.['Содержание оксида кремния (SiO₂), %, не менее'] || 85;
  const maxSieve = Math.max(...Object.values(product.sieveAnalysis || {}).map(Number));

  const handleCopyRow = (key: string, value: string | number) => {
    navigator.clipboard.writeText(`${key}: ${value}`);
    setCopiedRow(key);
    setTimeout(() => setCopiedRow(null), 2000);
  };

  const docPath = `/doc_sand/Фракция ${product.fraction}.pdf`;

  return (
    <main className="bg-[#0a0a0a] text-white overflow-x-hidden">

      {/* ═══ 1. HERO ═══ */}
      <section className="relative h-screen flex items-end justify-center overflow-hidden">
        <img
          src={img.hero}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-b from-transparent to-black" />

        <div className="relative z-10 w-full px-6 sm:px-10 lg:px-[1cm] pb-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
          <div className="animate-on-scroll slide-in-left">
            <div
              className="relative inline-block px-10 py-8"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.4) 30%, transparent 80%)',
              }}
            >
              <h1 className="text-5xl md:text-6xl lg:text-[65px] font-light leading-none tracking-[-0.03em] text-black">
                {product.shortName}
              </h1>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end animate-on-scroll fade-in-up animation-delay-300">
            <div className="group flex flex-col items-center cursor-pointer">
              <span className="text-gray-500 text-xs tracking-[0.3em] uppercase">Подробнее</span>
              <ChevronDown className="w-5 h-5 text-gray-500 animate-bounce" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 2. SCIENCE INSIGHTS ═══ */}
      <section className="min-h-screen py-24 lg:py-32">
        <div className="px-6 sm:px-10 lg:px-[1cm]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

            {/* Левый столбец */}
            <div>
              {/* 1. Описание */}
              <div className="animate-on-scroll slide-in-left">
                <div className="text-2xl lg:text-3xl text-gray-300 leading-relaxed">
                  {product.description}
                </div>
              </div>

              {/* 2. Характеристики */}
              <div className="mt-20 animate-on-scroll fade-in-up">
                <span className="uppercase text-[#f80000] tracking-[0.3em] text-xs font-medium">Характеристика материала</span>
              </div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="animate-on-scroll slide-in-left animation-delay-100 card-dark card-hover p-8 hover:border-[#f80000]/30">
                  <Droplets className="w-7 h-7 text-white mb-6" />
                  <h3 className="text-xl font-light text-white mb-3">&gt; {sio2Value}% SiO₂</h3>
                  <p className="text-gray-400">Высокое содержание диоксида кремния</p>
                </div>

                <div className="animate-on-scroll fade-in-up animation-delay-300 card-dark card-hover p-8 hover:border-[#f80000]/30">
                  <Circle className="w-7 h-7 text-white mb-6" />
                  <h3 className="text-xl font-light text-white mb-3">Окатанное зерно</h3>
                  <p className="text-gray-400">Минимальное сопротивление потоку</p>
                </div>

                <div className="animate-on-scroll slide-in-right animation-delay-500 card-dark card-hover p-8 hover:border-[#f80000]/30">
                  <Wind className="w-7 h-7 text-white mb-6" />
                  <h3 className="text-xl font-light text-white mb-3">Влажность ≤ 0,5%</h3>
                  <p className="text-gray-400">Сухой песок для любых задач</p>
                </div>
              </div>

              {/* 3. Скачать спецификацию */}
              <div className="mt-16 animate-on-scroll fade-in-up animation-delay-500">
                <span className="uppercase text-[#f80000] tracking-[0.3em] text-xs font-medium block mb-6">Скачать спецификацию</span>
                <a
                  href={docPath}
                  download
                  className="bg-[#f80000] text-white px-8 py-4 rounded-lg font-semibold tracking-wide hover:bg-gray-100 transition-colors inline-flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Скачать PDF
                </a>
              </div>
            </div>

            {/* Правый столбец — фото */}
            <div className="flex gap-4 h-[85vh] sticky top-[1cm]">
              <div className="flex flex-col gap-4 flex-shrink-0">
                {img.gallery.slice(0, 4).map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`${product.shortName} — вид ${i + 1}`}
                    className="w-[125px] h-[150px] object-cover rounded-2xl border border-[#222222]"
                  />
                ))}
              </div>
              <img
                src={img.main}
                alt={product.name}
                className="flex-1 h-full object-cover rounded-3xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 3. ГРАНУЛОМЕТРИЯ ═══ */}
      <section className="py-24 lg:py-32">
        <div className="px-6 sm:px-10 lg:px-[1cm]">
          <div className="animate-on-scroll">
            <h2 className="text-4xl lg:text-5xl font-light mt-4">Гранулометрический состав</h2>
          </div>

          <div className="mt-16 animate-on-scroll animation-delay-200">
            <div className="flex items-end gap-3 h-[400px]">
              {Object.entries(product.sieveAnalysis || {}).map(([sieve, pct]) => {
                const percent = Number(pct);
                const heightPct = maxSieve > 0 ? (percent / maxSieve) * 100 : 0;
                const isActive = hoveredSieve === sieve;

                return (
                  <div
                    key={sieve}
                    className="flex-1 flex flex-col items-center justify-end h-full cursor-pointer"
                    onMouseEnter={() => setHoveredSieve(sieve)}
                    onMouseLeave={() => setHoveredSieve(null)}
                  >
                    <div
                      className="mb-3 font-mono text-sm transition-all duration-300"
                      style={{
                        color: isActive ? '#f80000' : 'rgba(255,255,255,0.4)',
                        fontSize: isActive ? '1.4rem' : '0.875rem',
                        fontWeight: isActive ? 600 : 400,
                      }}
                    >
                      {percent}%
                    </div>

                    <div
                      className="w-full rounded-t-xl transition-all duration-500"
                      style={{
                        height: `${Math.max(heightPct, 2)}%`,
                        backgroundColor: isActive ? '#f80000' : 'rgba(255,255,255,0.08)',
                        boxShadow: isActive ? '0 0 40px rgba(248,0,0,0.3)' : 'none',
                      }}
                    />

                    <div
                      className="mt-4 text-center font-mono text-xs transition-all duration-300"
                      style={{ color: isActive ? '#ffffff' : 'rgba(255,255,255,0.35)' }}
                    >
                      {sieve}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-8 text-center text-gray-500 text-sm animate-on-scroll animation-delay-300">
            Наведите на столбец для детализации · Частные остатки на ситах, %
          </div>
        </div>
      </section>

      {/* ═══ 4. ТЕХНИЧЕСКИЙ ХАБ ═══ */}
      <section className="relative py-24 lg:py-32 bg-cover bg-center bg-fixed" style={{ backgroundImage: `url(${img.bg})` }}>
        <div className="absolute inset-0 bg-black/90" />

        <div className="relative z-10 px-6 sm:px-10 lg:px-[1cm]">
          <div className="animate-on-scroll mb-16">
            <span className="uppercase text-[#f80000] tracking-[0.3em] text-xs font-medium">Технические данные</span>
            <h2 className="text-4xl lg:text-5xl font-light mt-4">Полные характеристики</h2>
          </div>

          <div className="max-w-5xl mx-auto animate-on-scroll animation-delay-200">
            <div className="card-dark overflow-hidden">
              <div className="px-8 py-5 border-b border-[#222222]">
                <h4 className="text-sm uppercase tracking-widest text-gray-400">Физико-механические свойства</h4>
              </div>
              {Object.entries(product.technicalData || {}).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between px-8 py-5 border-b border-[#1a1a1a] hover:bg-[#1a1a1a] transition-colors cursor-pointer group"
                  onClick={() => handleCopyRow(key, String(value))}
                >
                  <span className="text-gray-400 text-sm pr-4">{key}</span>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="font-mono text-white">{String(value)}</span>
                    {copiedRow === key ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                </div>
              ))}
              <div className="px-8 py-5">
                <span className="text-gray-400 text-sm">Стандарт</span>
                <span className="float-right font-mono text-[#f80000]">{product.gost}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center text-gray-600 text-xs animate-on-scroll animation-delay-300">
            Нажмите на строку, чтобы скопировать для проектной документации
          </div>
        </div>
      </section>

      {/* ═══ 5. ХИМИЧЕСКИЙ СОСТАВ ═══ */}
      <section className="py-24 lg:py-32">
        <div className="px-6 sm:px-10 lg:px-[1cm]">
          <div className="animate-on-scroll">
            <span className="uppercase text-[#f80000] tracking-[0.3em] text-xs font-medium">Молекулярная чистота</span>
            <h2 className="text-4xl lg:text-5xl font-light mt-4">Химический состав</h2>
          </div>

          <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
            {Object.entries(product.chemicalComposition || {}).map(([element, pct], i) => {
              const isSiO2 = element === 'SiO₂';
              return (
                <div
                  key={element}
                  className={`animate-on-scroll fade-in-up ${
                    isSiO2
                      ? 'col-span-2 sm:col-span-1 bg-[#f80000]/10 border border-[#f80000]/30'
                      : 'card-dark'
                  } card-hover p-6 text-center hover:border-[#f80000]/30`}
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className={`font-mono font-light ${isSiO2 ? 'text-5xl text-[#f80000]' : 'text-3xl text-white'}`}>
                    {pct}%
                  </div>
                  <div className={`mt-3 text-sm ${isSiO2 ? 'text-[#f80000]' : 'text-gray-500'}`}>
                    {element}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ 6. КАЛЬКУЛЯТОР ═══ */}
      <section className="py-24 lg:py-32 bg-[#080808]">
        <div className="px-6 sm:px-10 lg:px-[1cm]">
          <div className="animate-on-scroll">
            <span className="uppercase text-[#f80000] tracking-[0.3em] text-xs font-medium">Расчёт</span>
            <h2 className="text-4xl lg:text-5xl font-light mt-4">Смарт-калькулятор</h2>
            <p className="text-gray-500 mt-4">Рассчитайте необходимое количество материала</p>
          </div>

          <div className="mt-16 grid lg:grid-cols-2 gap-16 animate-on-scroll animation-delay-200">
            <div className="space-y-8">
              <div>
                <label className="text-xs uppercase tracking-widest text-gray-500 mb-3 block">Форма фильтра</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setCalcShape('cylinder')}
                    className={`flex-1 py-4 rounded-lg font-semibold tracking-wide transition-all duration-300 ${
                      calcShape === 'cylinder'
                        ? 'bg-[#f80000] text-white hover:bg-gray-100'
                        : 'card-dark text-gray-400 hover:border-[#f80000]/30'
                    }`}
                  >
                    Цилиндр
                  </button>
                  <button
                    onClick={() => setCalcShape('rectangle')}
                    className={`flex-1 py-4 rounded-lg font-semibold tracking-wide transition-all duration-300 ${
                      calcShape === 'rectangle'
                        ? 'bg-[#f80000] text-white hover:bg-gray-100'
                        : 'card-dark text-gray-400 hover:border-[#f80000]/30'
                    }`}
                  >
                    Прямоугольник
                  </button>
                </div>
              </div>

              {calcShape === 'cylinder' ? (
                <div>
                  <label className="text-xs uppercase tracking-widest text-gray-500 mb-3 block">Диаметр, м</label>
                  <input
                    type="number"
                    value={calcDiameter}
                    onChange={(e) => setCalcDiameter(e.target.value)}
                    placeholder="1.2"
                    className="w-full bg-[#111111] border border-[#222222] rounded-lg px-6 py-4 text-white font-mono text-lg focus:border-[#f80000]/50 focus:outline-none transition-colors"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs uppercase tracking-widest text-gray-500 mb-3 block">Ширина, м</label>
                    <input
                      type="number"
                      value={calcWidth}
                      onChange={(e) => setCalcWidth(e.target.value)}
                      placeholder="2.0"
                      className="w-full bg-[#111111] border border-[#222222] rounded-lg px-6 py-4 text-white font-mono text-lg focus:border-[#f80000]/50 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-widest text-gray-500 mb-3 block">Длина, м</label>
                    <input
                      type="number"
                      value={calcLength}
                      onChange={(e) => setCalcLength(e.target.value)}
                      placeholder="3.0"
                      className="w-full bg-[#111111] border border-[#222222] rounded-lg px-6 py-4 text-white font-mono text-lg focus:border-[#f80000]/50 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs uppercase tracking-widest text-gray-500 mb-3 block">Высота слоя, м</label>
                <input
                  type="number"
                  value={calcHeight}
                  onChange={(e) => setCalcHeight(e.target.value)}
                  placeholder="0.8"
                  className="w-full bg-[#111111] border border-[#222222] rounded-lg px-6 py-4 text-white font-mono text-lg focus:border-[#f80000]/50 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <div className="card-dark p-10">
                <div className="text-xs uppercase tracking-widest text-gray-500 mb-8">Результат расчёта</div>
                <div className="space-y-8">
                  <div>
                    <div className="text-gray-400 text-sm">Объём</div>
                    <div className="text-4xl font-mono font-light text-white mt-1">
                      {calcResult.volume} <span className="text-lg text-gray-500">м³</span>
                    </div>
                  </div>
                  <div className="h-px bg-[#222222]" />
                  <div>
                    <div className="text-gray-400 text-sm">Масса (при 1500 кг/м³)</div>
                    <div className="text-5xl font-mono font-light text-[#f80000] mt-1">
                      {calcResult.tons} <span className="text-xl text-gray-500">тонн</span>
                    </div>
                  </div>
                  <div className="h-px bg-[#222222]" />
                  <div>
                    <div className="text-gray-400 text-sm">Биг-Бэгов (≈ 1 тонна)</div>
                    <div className="text-4xl font-mono font-light text-white mt-1">
                      {calcResult.bigbags} <span className="text-lg text-gray-500">шт</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 7. ОБЛАСТИ ПРИМЕНЕНИЯ ═══ */}
      <section className="py-24 lg:py-32">
        <div className="px-6 sm:px-10 lg:px-[1cm]">
          <div className="animate-on-scroll">
            <span className="uppercase text-[#f80000] tracking-[0.3em] text-xs font-medium">Кейсы</span>
            <h2 className="text-4xl lg:text-5xl font-light mt-4">Области применения</h2>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {product.applicationAreas?.map((area, i) => (
              <div
                key={i}
                className="animate-on-scroll card-dark card-hover p-10 hover:border-[#f80000]/30"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="text-[#f80000] font-mono text-sm mb-4">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h4 className="text-2xl font-light leading-tight">{area}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 8. ЛОГИСТИКА И ДОКУМЕНТЫ ═══ */}
      <section className="py-24 lg:py-32 bg-[#080808]">
        <div className="px-6 sm:px-10 lg:px-[1cm]">
          <div className="grid lg:grid-cols-2 gap-16">
            <div className="animate-on-scroll">
              <span className="uppercase text-[#f80000] tracking-[0.3em] text-xs font-medium">Логистика</span>
              <h2 className="text-4xl font-light mt-4 mb-12">Упаковка и отгрузка</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="card-dark card-hover p-8 hover:border-[#f80000]/30">
                  <Truck className="w-7 h-7 text-white mb-6" />
                  <h3 className="text-xl font-light text-white mb-3">Навал</h3>
                  <p className="text-gray-400">Самосвал / полуприцеп</p>
                </div>
                <div className="card-dark card-hover p-8 hover:border-[#f80000]/30">
                  <Package className="w-7 h-7 text-white mb-6" />
                  <h3 className="text-xl font-light text-white mb-3">МКР</h3>
                  <p className="text-gray-400">Биг-бэг ≈ 1 тонна</p>
                </div>
              </div>
            </div>

            <div className="animate-on-scroll animation-delay-300">
              <span className="uppercase text-[#f80000] tracking-[0.3em] text-xs font-medium">Загрузки</span>
              <h2 className="text-4xl font-light mt-4 mb-12">Документация</h2>
              <div className="space-y-4">
                {[
                  { name: 'Паспорт качества', file: docPath },
                  { name: `Сертификат ${product.gost}`, file: docPath },
                  { name: 'Лабораторное заключение', file: docPath },
                ].map((doc) => (
                  <a
                    key={doc.name}
                    href={doc.file}
                    download
                    className="flex items-center justify-between card-dark card-hover px-8 py-5 hover:border-[#f80000]/30 group"
                  >
                    <span className="text-white font-light">{doc.name}</span>
                    <Download className="w-5 h-5 text-gray-600 group-hover:text-[#f80000] transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ НАЗАД В КАТАЛОГ ═══ */}
      <section className="py-32 bg-black">
        <div className="px-6 sm:px-10 lg:px-[1cm] text-center animate-on-scroll">
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
