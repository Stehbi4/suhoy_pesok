import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HomePage from '@/pages/HomePage';
import CatalogPage from '@/pages/CatalogPage';
import ProductPage from '@/pages/ProductPage';
import AboutPage from '@/pages/AboutPage';
import DeliveryPage from '@/pages/DeliveryPage';
import ArticlesPage from '@/pages/ArticlesPage';
import ArticlePage from '@/pages/ArticlePage';
import ContactsPage from '@/pages/ContactsPage';
import ScrollToTop from '@/components/Scroll/ScrollToTop';
import BackToTop from '@/components/Scroll/BackToTop';
import SmoothScroll from '@/components/ui/SmoothScroll';
import Preloader from '@/components/ui/Preloader';
import './App.css';

const FULLSCREEN_ROUTES = ['/articles'];

function AppLayout() {
  const location = useLocation();
  const isFullscreen = FULLSCREEN_ROUTES.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg">
      <SmoothScroll />
      {!isFullscreen && <Header />}
      <div className="flex-grow">
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/product/:slug" element={<ProductPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/delivery" element={<DeliveryPage />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/articles/:slug" element={<ArticlePage />} />
          <Route path="/contacts" element={<ContactsPage />} />
        </Routes>
        {!isFullscreen && <BackToTop />}
      </div>
      {!isFullscreen && <Footer />}
    </div>
  );
}

function App() {
  const [preloading, setPreloading] = useState(true);

  return (
    <>
      {preloading && <Preloader onDone={() => setPreloading(false)} />}
      <Router>
        <AppLayout />
      </Router>
    </>
  );
}

export default App;