const ProductDescription = ({ product }: { product: any }) => (
  <section className="py-16 md:py-24 container-custom bg-[#0a0a0a]">
    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
      {/* Левая колонка */}
      <div className="lg:pl-[1cm]">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-px bg-white" />
          <span className="uppercase tracking-widest text-sm text-white/70">Описание</span>
        </div>
        <p className="text-2xl text-gray-400 leading-relaxed">{product.description}</p>

        {/* Фасовка */}
        <div className="mt-12">
          <h3 className="text-sm text-gray-500 mb-4">Варианты фасовки</h3>
          <div className="flex flex-wrap gap-3">
            {product.packaging.map((p: string) => (
              <span key={p} className="px-6 py-3 border border-[#333333] text-white rounded-2xl text-sm hover:border-[#f80000] transition-colors">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Правая колонка — фото */}
      <div className="relative -mr-[1cm] lg:mr-0">
        <div className="absolute left-0 top-0 w-1/6 h-full grid grid-rows-4 gap-4 pr-6 z-10">
          {Array(4).fill(0).map((_, i) => (
            <img key={i} src={product.image} className="rounded-2xl object-cover" />
          ))}
        </div>
        <img
          src={product.image}
          className="w-5/6 ml-auto rounded-3xl shadow-2xl"
          alt={product.name}
        />
      </div>
    </div>
  </section>
);

export default ProductDescription;