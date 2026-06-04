const Quote = () => {
  return (
    <section className="relative h-[100vh] overflow-hidden">
      <div className="relative z-10 h-full flex items-center justify-center">
        
        <div className="text-center max-w-[900px]">
          <p className="text-white text-4xl md:text-5xl lg:text-6xl font-light leading-[1.1] tracking-tight">
            Двадцать пять лет мы <br /> 
            <span className="text-brand-red text-5xl md:text-6xl lg:text-7xl font-medium">учим бетон</span> <br />
            работать там, где другие материалы сдаются.
          </p>
        </div>

      </div>
    </section>
  );
};

export default Quote;