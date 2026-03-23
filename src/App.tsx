import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import './App.css';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-[#0a0a0a]">
        <Header />
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
          <BackToTop />
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;