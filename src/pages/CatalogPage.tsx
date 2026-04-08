import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Check, Package, Filter } from 'lucide-react';
import { products, filterOptions } from '@/data/articles';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

const CatalogPage = () => {
  const uniqueApplicationAreas = useMemo(() => {
    const areasSet = new Set<string>();
    products.forEach((product) => {
      product.applicationAreas.forEach((area) => areasSet.add(area));
    });
    return Array.from(areasSet).map((area) => ({ value: area, label: area }));
  }, []);

  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [selectedFractions, setSelectedFractions] = useState<string[]>([]);
  const [selectedGosts, setSelectedGosts] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const handleAreaToggle = (area: string) => {
    setSelectedAreas((prev) =>
      prev.includes(area)
        ? prev.filter((a) => a !== area)
        : [...prev, area]
    );
  };

  const handleFractionToggle = (fraction: string) => {
    setSelectedFractions((prev) =>
      prev.includes(fraction)
        ? prev.filter((f) => f !== fraction)
        : [...prev, fraction]
    );
  };

  const handleGostToggle = (gost: string) => {
    setSelectedGosts((prev) =>
      prev.includes(gost)
        ? prev.filter((g) => g !== gost)
        : [...prev, gost]
    );
  };


  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const areaMatch = selectedAreas.length === 0 || 
        selectedAreas.some((area) => product.applicationAreas.includes(area));
      const fractionMatch = selectedFractions.length === 0 || 
        selectedFractions.some(f => product.fraction.includes(f.replace(' мм', '').replace(' (отсев)', '')));
      const gostMatch = selectedGosts.length === 0 || 
        selectedGosts.includes(product.gost);
      return areaMatch && fractionMatch && gostMatch;
    });
  }, [selectedAreas, selectedFractions, selectedGosts, selectedColors]);

  const hasActiveFilters = selectedAreas.length > 0 || selectedFractions.length > 0 || selectedGosts.length > 0 || selectedColors.length > 0;

  const clearFilters = () => {
    setSelectedAreas([]);
    setSelectedFractions([]);
    setSelectedGosts([]);
    setSelectedColors([]);
  };

  return (
    <main className="min-h-screen pt-24 md:pt-28 bg-white">
      {/* Page Header */}
      <section className="relative py-8 md:py-12 bg-white">
        <div className="w-full px-[1cm]">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-gray-900 font-medium mb-6">
            Наша продукция
          </h1>
        </div>
      </section>

      {/* Catalog Content */}
      <section className="py-8 md:py-6">
        <div className="w-full px-[1cm]">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-6">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900"
            >
              <Filter className="w-5 h-5" />
              <span>Фильтры</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 bg-brand-red rounded-full" />
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Filters */}
            <div className={`lg:col-span-1 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 lg:top-28 card-hover hover:border-brand-red/30">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-medium text-gray-900 flex items-center gap-3">
                    <Filter className="w-5 h-5 text-brand-red" />
                    Фильтры
                  </h2>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-brand-red hover:text-[#1d4ed8] transition-colors"
                    >
                      Сбросить
                    </button>
                  )}
                </div>

                {/* Areas Filter */}
                <div className="mb-8">
                  <h3 className="text-sm text-gray-500 uppercase tracking-wider mb-4">
                    Области Применения
                  </h3>
                  <div className="space-y-3">
                    {uniqueApplicationAreas.map((area) => (
                      <div
                        key={area.value}
                        className="flex items-start gap-3 cursor-pointer group"
                        onClick={() => handleAreaToggle(area.value)}
                      >
                        <Checkbox
                          checked={selectedAreas.includes(area.value)}
                          className="mt-0.5 border-gray-300 data-[state=checked]:bg-brand-red data-[state=checked]:border-brand-red"
                        />
                        <span
                          className={`text-sm leading-tight group-hover:text-brand-red transition-colors ${
                            selectedAreas.includes(area.value)
                              ? 'text-gray-900'
                              : 'text-gray-600'
                          }`}
                        >
                          {area.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-gray-200 my-6" />

                {/* Fraction Filter */}
                <div className="mb-8">
                  <h3 className="text-sm text-gray-500 uppercase tracking-wider mb-4">
                    Фракция
                  </h3>
                  <div className="space-y-3">
                    {filterOptions.fractions.map((fraction) => (
                      <div
                        key={fraction.value}
                        className="flex items-start gap-3 cursor-pointer group"
                        onClick={() => handleFractionToggle(fraction.value)}
                      >
                        <Checkbox
                          checked={selectedFractions.includes(fraction.value)}  
                          className="mt-0.5 border-gray-300 data-[state=checked]:bg-brand-red data-[state=checked]:border-brand-red"
                        />
                        <span
                          className={`text-sm leading-tight group-hover:text-brand-red transition-colors ${
                            selectedFractions.includes(fraction.value)
                              ? 'text-gray-900'
                              : 'text-gray-600'
                          }`}
                        >
                          {fraction.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-gray-200 my-6" />

                {/* GOST Filter */}
                <div className="mb-8">
                  <h3 className="text-sm text-gray-500 uppercase tracking-wider mb-4">
                    ГОСТ
                  </h3>
                  <div className="space-y-3">
                    {filterOptions.gosts.map((gost) => (
                      <div
                        key={gost.value}
                        className="flex items-start gap-3 cursor-pointer group"
                        onClick={() => handleGostToggle(gost.value)}
                      >
                        <Checkbox
                          checked={selectedGosts.includes(gost.value)}
                          className="mt-0.5 border-gray-300 data-[state=checked]:bg-brand-red data-[state=checked]:border-brand-red"
                        />
                        <span
                          className={`text-sm leading-tight group-hover:text-brand-red transition-colors ${
                            selectedGosts.includes(gost.value)
                              ? 'text-gray-900'
                              : 'text-gray-600'
                          }`}
                        >
                          {gost.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content - Products List (Single Column) */}
            <div className="lg:col-span-3 space-y-6">
              {filteredProducts.length > 0 ? (
                <div className="space-y-6">
                  {filteredProducts.map((product) => (
                    <Link
                      key={product.id}
                      to={`/product/${product.slug}`}
                      className="group block bg-white border border-gray-200 rounded-lg overflow-hidden card-hover hover:border-brand-red/50"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                        {/* Product Image */}
                        <div className="relative h-48 md:h-full overflow-hidden">
                          <img
                            src={product.images.thumb}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 md:bg-gradient-to-t md:from-white/20 md:to-transparent" />
                        </div>

                        {/* Product Info */}
                        <div className="md:col-span-2 p-6">
                          <div className="flex flex-wrap gap-2 mb-3">
                            <Badge className="bg-brand-red text-white">
                              {product.fraction}
                            </Badge>
                            
                          </div>

                          <h3 className="text-xl font-medium text-gray-900 mb-2 group-hover:text-brand-red transition-colors">
                            {product.name}
                          </h3>
                          
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {product.description}
                          </p>

                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-sm">
                              <Check className="w-4 h-4 text-brand-red" />
                              <span className="text-gray-700">{product.gost}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Check className="w-4 h-4 text-brand-red" />
                              <span className="text-gray-700">
                                Фасовка: {product.packaging.join(', ')}
                              </span>
                            </div>
                          </div>

                          {/* Key Specs */}
                          <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                            <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600">
                              SiO2 &gt; 85%
                            </span>
                            <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600">
                              Влажность ≤ 0.5%
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-16 text-center card-hover hover:border-brand-red/30">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-6" />
                  <h3 className="text-2xl font-light text-gray-900 mb-3">
                    Товары не найдены
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto mb-6">
                    Попробуйте изменить параметры фильтрации или сбросить фильтры.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="bg-brand-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1d4ed8] transition-colors"
                  >
                    Сбросить фильтры
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CatalogPage; 