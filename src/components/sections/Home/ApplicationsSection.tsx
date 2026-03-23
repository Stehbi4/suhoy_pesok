// src/components/sections/ApplicationsSection.tsx
const applications = [
  "Сухие строительные смеси",
  "Литейное производство",
  "Стекольная промышленность",
  "Пескоструйная обработка",
  "Фильтры для воды",
  "Спортивные и детские покрытия",
  "Производство красок и покрытий",
  "Нефтегазовая отрасль",
];

const ApplicationsSection = () => {
  return (
    <section className="py-20 md:py-32 bg-[#111111]">
      <div className="container-custom">
        <h2 className="text-5xl md:text-7xl font-light text-center mb-16">
          Где мы <span className="text-[#f80000] font-medium">применяемся</span>
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10">
          {applications.map((app, i) => (
            <div 
              key={i}
              className="bg-[#1a1a1a] border border-[#222222] hover:border-[#f80000]/50 rounded-xl p-8 text-center transition-all hover:scale-[1.03]"
            >
              <div className="text-2xl md:text-3xl font-light">{app}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ApplicationsSection;