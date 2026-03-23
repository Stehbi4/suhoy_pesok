const ImageSection = () => {
  return (
    <section className="relative h-[100vh] bg-cover bg-center bg-no-repeat overflow-hidden image-set-background">

      {/* Затемнение за текстом */}
      <div className="absolute left-0 top-0 bottom-0 w-[55%] bg-gradient-to-l from-transparent via-black/70 to-black/90" />

      <div className="relative z-10 h-full flex items-start justify-start px-[1cm] pt-[100px]">
        
        <div className="text-left max-w-[900px]">
          <p className="text-white text-4xl md:text-5xl lg:text-6xl font-light leading-[1.05] tracking-tight">
            Мы закупаем наще сырьё <br />
            с <span className="text-[#f80000] text-5xl md:text-65xl lg:text-7xl font-medium">проверенных </span> карьеров <br />
            Ленинградской области
          </p>
        </div>

      </div>
    </section>
  );
};

export default ImageSection;