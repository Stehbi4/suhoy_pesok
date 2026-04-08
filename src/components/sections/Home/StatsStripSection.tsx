const stats = [
  { value: '9', unit: 'фракций', label: 'Количество фракций' },
  { value: '10 000', unit: 'тонн / год', label: 'Производственная мощность' },
  { value: '0–2,5', unit: 'мм рассев', label: 'Диапазон фракций' },
  { value: '27+', unit: 'лет опыта', label: 'Опыт работы' },
];

const StatsStripSection = () => {
  return (
    <section className="bg-brand-bg border-t border-b border-[#1f1f1f]">
      <div className="px-[1cm] grid grid-cols-2 lg:grid-cols-4 divide-x divide-[#1f1f1f]">
        {stats.map((s, i) => (
          <div key={i} className="py-10 px-6 lg:px-10 flex flex-col justify-center">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-4xl lg:text-5xl font-light text-white tracking-tight">{s.value}</span>
              <span className="text-sm text-brand-red font-medium uppercase tracking-wider">{s.unit}</span>
            </div>
            <p className="text-gray-500 text-xs uppercase tracking-[0.25em]">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsStripSection;
