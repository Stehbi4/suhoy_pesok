import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <main className="relative min-h-screen overflow-hidden">
    {/* Fullscreen image — fixed to cover entire viewport */}
    <img
      src="/404/404.png"
      alt="404"
      className="fixed inset-0 w-full h-full object-cover z-0"
    />

    {/* Overlay with text */}
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-6">
      <h1 className="text-8xl md:text-9xl font-bold text-white mb-4" style={{ textShadow: '0 2px 24px rgba(0,0,0,0.5)' }}>
        404
      </h1>
      <p className="text-2xl md:text-3xl text-white/90 mb-2 font-light" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.5)' }}>
        Страница не найдена
      </p>
      <p className="text-white/60 mb-10 text-lg" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.5)' }}>
        Такой страницы не существует или она была перемещена
      </p>
      <Link
        to="/"
        className="bg-brand-red text-white px-8 py-3 rounded-lg font-semibold hover:bg-brand-red-light transition-colors"
      >
        На главную
      </Link>
    </div>
  </main>
);

export default NotFoundPage;
