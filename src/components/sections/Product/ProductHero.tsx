import { ArrowDown } from 'lucide-react';

const ProductHero = ({ product }: { product: any }) => (
  <section className="relative h-screen w-full overflow-hidden">
    <img
      src={product.image}
      alt={product.name}
      className="absolute inset-0 w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/70 to-black" />

    {/* Название фракции слева внизу */}
    <div className="absolute bottom-12 left-8 md:left-[1cm] z-10">
      <div className="bg-white/10 backdrop-blur-md px-10 py-8 rounded-3xl border border-white/20">
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-light text-white tracking-tighter leading-none">
          {product.shortName}
        </h1>
      </div>
    </div>

    {/* Прыгающая стрелка справа */}
    <div className="absolute bottom-16 right-8 md:right-[1cm] flex flex-col items-center text-white/70">
      <p className="uppercase tracking-[3px] text-sm mb-3">Подробнее</p>
      <ArrowDown className="w-10 h-10 animate-bounce" />
    </div>
  </section>
);

export default ProductHero;