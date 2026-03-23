const ProductChemistry = ({ product }: { product: any }) => (
  <section className="py-16 md:py-24 bg-[#0a0a0a]">
    <div className="container-custom">
      <div className="flex items-center gap-4 mb-12">
        <div className="w-12 h-px bg-white" />
        <span className="uppercase tracking-widest text-sm text-white/70">Состав</span>
      </div>

      {/* Гранулометрический состав */}
      {product.sieveAnalysis && (
        <div className="mb-20">
          <h3 className="text-2xl text-white mb-8">Гранулометрический состав (рассев)</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {Object.entries(product.sieveAnalysis).map(([size, percent]) => (
              <div 
                key={size} 
                className="bg-[#111111] border border-[#222222] rounded-2xl p-6 text-center hover:border-[#f80000] transition-all"
              >
                <div className="text-sm text-gray-400">{size}</div>
                <div className="text-5xl font-light text-[#f80000] mt-2">
                  {percent}% {/* ← Исправлено: TS теперь доволен */}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Химический состав */}
      {product.chemicalComposition && (
        <div>
          <h3 className="text-2xl text-white mb-8">Химический состав</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Object.entries(product.chemicalComposition).map(([el, val]) => (
              <div 
                key={el} 
                className="bg-[#111111] border border-[#222222] rounded-2xl p-6 text-center hover:border-[#f80000] transition-all"
              >
                <div className="text-sm text-gray-400">{el}</div>
                <div className="text-5xl font-light text-white mt-2">
                  {val}% {/* ← тоже исправлено */}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </section>
);

export default ProductChemistry;