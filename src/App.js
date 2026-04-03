import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext';
import { trackPageView } from './analytics';
import Layout from './components/Layout';
import Home from './pages/Home';
import JsonFormatter from './pages/JsonFormatter';
import Base64Tool from './pages/Base64Tool';
import UrlEncoder from './pages/UrlEncoder';
import JwtDecoder from './pages/JwtDecoder';
import TimestampConverter from './pages/TimestampConverter';
import './styles/global.css';

function PageTracker() {
  const location = useLocation();
  useEffect(() => {
    trackPageView(location.pathname, document.title);
  }, [location]);
  return null;
}

export default function App() {
  return (
    <LanguageProvider>
      <PageTracker />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/json" element={<JsonFormatter />} />
          <Route path="/base64" element={<Base64Tool />} />
          <Route path="/url" element={<UrlEncoder />} />
          <Route path="/jwt" element={<JwtDecoder />} />
          <Route path="/timestamp" element={<TimestampConverter />} />
        </Routes>
      </Layout>
    </LanguageProvider>
  );
}
