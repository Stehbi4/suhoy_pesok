const ProductKeyPhrase = ({ product }: { product: any }) => (
  <section className="relative h-[90vh] bg-cover bg-center overflow-hidden" style={{ backgroundImage: `url(${product.image})` }}>
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black" />

    <div className="absolute bottom-1/3 left-[1cm] max-w-2xl">
      <div className="text-6xl md:text-7xl lg:text-8xl font-light text-white leading-none tracking-tighter">
        SiO₂ <span className="text-[#f80000]">более 85%</span>
      </div>
      <p className="mt-6 text-2xl text-gray-300 max-w-md">
        Высочайшая чистота и идеальная фракция для любых задач
      </p>
    </div>
  </section>
);

export default ProductKeyPhrase;