import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import JsonFormatter from './pages/JsonFormatter';
import Base64Tool from './pages/Base64Tool';
import UrlEncoder from './pages/UrlEncoder';
import JwtDecoder from './pages/JwtDecoder';
import TimestampConverter from './pages/TimestampConverter';
import './styles/global.css';

export default function App() {
  return (
    <LanguageProvider>
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
