import { useNavigate, useLocation } from 'react-router-dom';

const AboutVariantSwitcher = () => {
  const navigate     = useNavigate();
  const { pathname } = useLocation();
  const isDark       = pathname === '/about';

  return (
    <div className="fixed bottom-8 right-8 z-40 flex gap-1 rounded-full p-1 border backdrop-blur-md shadow-xl"
      style={{ backgroundColor: isDark ? 'rgba(10,10,10,0.85)' : 'rgba(245,244,242,0.88)', borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(26,26,27,0.12)' }}
    >
      <button
        onClick={() => navigate('/about')}
        className="px-4 py-2 rounded-full text-[10px] font-medium tracking-[0.2em] uppercase transition-all duration-200"
        style={{
          backgroundColor: isDark  ? 'rgba(255,255,255,0.9)' : 'transparent',
          color:           isDark  ? '#0a0a0a'               : 'rgba(26,26,27,0.35)',
        }}
      >
        Тёмная
      </button>
      <button
        onClick={() => navigate('/about-2')}
        className="px-4 py-2 rounded-full text-[10px] font-medium tracking-[0.2em] uppercase transition-all duration-200"
        style={{
          backgroundColor: !isDark ? '#1A1A1B'               : 'transparent',
          color:           !isDark ? '#F5F4F2'               : 'rgba(255,255,255,0.35)',
        }}
      >
        Светлая
      </button>
    </div>
  );
};

export default AboutVariantSwitcher;
