import ScrollReveal from '@/components/ui/ScrollReveal';
import { SweepBtn } from '@/components/ui/SweepBtn';

export const ProductCTASection = () => (
  <section className="relative bg-black overflow-hidden">
    <div className="relative z-10 px-6 sm:px-10 lg:px-[1cm] py-10 lg:py-14 flex flex-col items-start gap-6">
      <ScrollReveal type="fade-up">
        <h2 className="text-xl md:text-3xl lg:text-4xl font-light leading-tight text-gray-500 text-left">
          Вернуться на перечень нашей продукции.
        </h2>
      </ScrollReveal>
      <ScrollReveal type="fade-up" delay={0.1}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <SweepBtn to="/catalog" light>Смотреть каталог</SweepBtn>
          <SweepBtn to="/contacts" light>Связаться с нами</SweepBtn>
        </div>
      </ScrollReveal>
    </div>
  </section>
);
