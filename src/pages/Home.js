import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import Seo from '../components/Seo';
import './Home.css';

const TOOL_KEYS = [
  { path: '/json', icon: '{ }', key: 'json', tags: ['format', 'validate', 'minify'] },
  { path: '/base64', icon: '64', key: 'base64', tags: ['encode', 'decode'] },
  { path: '/url', icon: '%', key: 'url', tags: ['encode', 'decode', 'uri'] },
  { path: '/jwt', icon: '🔑', key: 'jwt', tags: ['token', 'auth', 'decode'] },
  { path: '/timestamp', icon: '⏱', key: 'timestamp', tags: ['unix', 'date', 'time'] },
];

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="home">
      <Seo
        description="Free online developer utilities — JSON formatter, Base64 encoder/decoder, URL encoder, JWT decoder, Unix timestamp converter."
        path="/"
      />
      <div className="home__hero">
        <h1 className="home__title">
          Tool<span className="home__accent">igans</span>
        </h1>
        <p className="home__tagline">{t('home.tagline')}</p>
      </div>

      <div className="home__grid">
        {TOOL_KEYS.map(tool => (
          <Link key={tool.path} to={tool.path} className="tool-card">
            <div className="tool-card__icon">{tool.icon}</div>
            <div className="tool-card__content">
              <h3 className="tool-card__title">{t(`home.tools.${tool.key}.title`)}</h3>
              <p className="tool-card__desc">{t(`home.tools.${tool.key}.desc`)}</p>
              <div className="tool-card__tags">
                {tool.tags.map(tag => (
                  <span key={tag} className="tool-card__tag">{tag}</span>
                ))}
              </div>
            </div>
            <span className="tool-card__arrow">→</span>
          </Link>
        ))}
      </div>

      <div className="home__footer">
        <p>{t('home.footer')}</p>
      </div>
    </div>
  );
}
