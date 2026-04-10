import { useState, useMemo } from 'react';
import { BG_PAGE, TEXT_DARK, RED } from '@/styles/theme';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { LightCard } from './ProductCards';

export const ProductCalculatorSection = () => {
  const [calcShape,    setCalcShape]    = useState<'cylinder' | 'rectangle'>('cylinder');
  const [calcDiameter, setCalcDiameter] = useState('');
  const [calcWidth,    setCalcWidth]    = useState('');
  const [calcLength,   setCalcLength]   = useState('');
  const [calcHeight,   setCalcHeight]   = useState('');

  const calcResult = useMemo(() => {
    const h = parseFloat(calcHeight) || 0;
    let vol = 0;
    if (calcShape === 'cylinder') {
      const d = parseFloat(calcDiameter) || 0;
      vol = Math.PI * (d / 2) ** 2 * h;
    } else {
      vol = (parseFloat(calcWidth) || 0) * (parseFloat(calcLength) || 0) * h;
    }
    const tons = (vol * 1500) / 1000;
    return { volume: vol.toFixed(2), tons: tons.toFixed(2), bigbags: Math.ceil(tons) };
  }, [calcShape, calcDiameter, calcWidth, calcLength, calcHeight]);

  return (
    <section className="py-20 lg:py-24" style={{ background: BG_PAGE }}>
      <div className="px-6 sm:px-10 lg:px-[1cm]">
        <ScrollReveal type="fade-up">
          <h2 className="text-4xl font-bold tracking-tighter" style={{ color: TEXT_DARK }}>Смарт-калькулятор</h2>
          <p className="text-gray-400 mt-3 text-sm">Рассчитайте необходимое количество материала</p>
        </ScrollReveal>

        <ScrollReveal type="fade-up" delay={0.1} className="mt-12 grid lg:grid-cols-2 gap-12">
          <div className="space-y-7">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-gray-400 mb-3 block">Форма фильтра</label>
              <div className="flex gap-3">
                {(['cylinder', 'rectangle'] as const).map((shape) => (
                  <button key={shape} onClick={() => setCalcShape(shape)}
                    className="flex-1 py-3.5 rounded-xl font-medium tracking-wide text-sm transition-all duration-300"
                    style={{
                      background: calcShape === shape ? TEXT_DARK : 'rgba(0,0,0,0.06)',
                      color: calcShape === shape ? 'white' : '#888',
                    }}
                  >
                    {shape === 'cylinder' ? 'Цилиндр' : 'Прямоугольник'}
                  </button>
                ))}
              </div>
            </div>

            {calcShape === 'cylinder' ? (
              <div>
                <label className="text-[10px] uppercase tracking-widest text-gray-400 mb-3 block">Диаметр, м</label>
                <input type="number" value={calcDiameter} onChange={e => setCalcDiameter(e.target.value)} placeholder="1.2"
                  className="w-full rounded-xl px-5 py-3.5 font-mono text-lg focus:outline-none transition-colors"
                  style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)', color: TEXT_DARK }} />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {[{ label: 'Ширина, м', val: calcWidth,  set: setCalcWidth,  ph: '2.0' },
                  { label: 'Длина, м',  val: calcLength, set: setCalcLength, ph: '3.0' }].map(({ label, val, set, ph }) => (
                  <div key={label}>
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 mb-3 block">{label}</label>
                    <input type="number" value={val} onChange={e => set(e.target.value)} placeholder={ph}
                      className="w-full rounded-xl px-5 py-3.5 font-mono text-lg focus:outline-none transition-colors"
                      style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)', color: TEXT_DARK }} />
                  </div>
                ))}
              </div>
            )}

            <div>
              <label className="text-[10px] uppercase tracking-widest text-gray-400 mb-3 block">Высота слоя, м</label>
              <input type="number" value={calcHeight} onChange={e => setCalcHeight(e.target.value)} placeholder="0.8"
                className="w-full rounded-xl px-5 py-3.5 font-mono text-lg focus:outline-none transition-colors"
                style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)', color: TEXT_DARK }} />
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <LightCard className="rounded-2xl p-8">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-7">Результат расчёта</p>
              <div className="space-y-6">
                <div>
                  <p className="text-gray-400 text-xs mb-1">Объём</p>
                  <p className="text-4xl font-mono font-light" style={{ color: TEXT_DARK }}>
                    {calcResult.volume} <span className="text-base text-gray-400">м³</span>
                  </p>
                </div>
                <div className="h-px bg-black/5" />
                <div>
                  <p className="text-gray-400 text-xs mb-1">Масса (при 1500 кг/м³)</p>
                  <p className="text-5xl font-mono font-light" style={{ color: RED }}>
                    {calcResult.tons} <span className="text-lg text-gray-400">тонн</span>
                  </p>
                </div>
                <div className="h-px bg-black/5" />
                <div>
                  <p className="text-gray-400 text-xs mb-1">Биг-Бэгов (≈ 1 тонна)</p>
                  <p className="text-4xl font-mono font-light" style={{ color: TEXT_DARK }}>
                    {calcResult.bigbags} <span className="text-base text-gray-400">шт</span>
                  </p>
                </div>
              </div>
            </LightCard>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
