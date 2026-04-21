import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HomePage from '@/pages/HomePage';
import HomeV2 from '@/pages/HomeV2';
import CatalogPage from '@/pages/CatalogPage';
import ComparePage from '@/pages/ComparePage';
import ProductPage from '@/pages/ProductPage';
import AboutPage  from '@/pages/AboutPage';
import AboutPage2 from '@/pages/AboutPage2';
import DeliveryPage from '@/pages/DeliveryPage';
import ArticlesPage from '@/pages/ArticlesPage';
import ArticlePage from '@/pages/ArticlePage';
import ContactsPage from '@/pages/ContactsPage';
import NotFoundPage from '@/pages/NotFoundPage';
import ScrollToTop from '@/components/Scroll/ScrollToTop';
import BackToTop from '@/components/Scroll/BackToTop';
import SmoothScroll from '@/components/ui/SmoothScroll';
import Preloader from '@/components/ui/Preloader';
import './App.css';

// Experimental redesign routes (/v2, /v3, /v4) render without shared Header/Footer
// so each variant can present its own navigation chrome for comparison.
const FULLSCREEN_ROUTES = ['/articles', '/v2', '/v3', '/v4'];

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
          <Route path="/v2" element={<HomeV2 />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/product/:slug" element={<ProductPage />} />
          <Route path="/about"   element={<AboutPage />}  />
          <Route path="/about-2" element={<AboutPage2 />} />
          <Route path="/delivery" element={<DeliveryPage />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/articles/:slug" element={<ArticlePage />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<NotFoundPage />} />
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