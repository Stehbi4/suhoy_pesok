const Quote = () => {
  return (
    <section className="relative h-[100vh] bg-cover bg-center bg-no-repeat overflow-hidden">

      {/* Затемнение за текстом */}
      
      <div className="relative z-10 h-full flex items-center justify-center">
        
        <div className="text-center max-w-[900px]">
          <p className="text-white text-4xl md:text-5xl lg:text-6xl font-light leading-[1.05] tracking-tight">
           Здесь нужна какая то фраза <br />
             Прям - <span className="text-[#f80000] text-5xl md:text-65xl lg:text-7xl font-medium">Цитатой </span> назавём это <br />
            наших виликих умов
          </p>
        </div>

      </div>
    </section>
  );
};

export default Quote;