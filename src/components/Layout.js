import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage, LANGUAGES } from '../i18n/LanguageContext';
import './Layout.css';

const NAV_KEYS = [
  { path: '/', key: 'home', icon: '⌂', exact: true },
  { path: '/json', key: 'jsonFormatter', icon: '{ }' },
  { path: '/base64', key: 'base64', icon: '64' },
  { path: '/url', key: 'urlEncoder', icon: '%' },
  { path: '/jwt', key: 'jwtDecoder', icon: '🔑' },
  { path: '/timestamp', key: 'timestamp', icon: '⏱' },
];

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const { t, lang, setLang } = useLanguage();

  return (
    <div className={`layout ${collapsed ? 'layout--collapsed' : ''}`}>
      {/* Top AdSense Banner */}
      <div className="adsense-top">
        <div className="adsense-placeholder adsense-leaderboard">
          <span>{t('common.advertisement')}</span>
        </div>
      </div>

      <div className="layout__body">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar__header">
            <NavLink to="/" className="sidebar__logo">
              <span className="logo-text">
                Tool<span className="logo-accent">igans</span>
              </span>
            </NavLink>
            <button
              className="sidebar__toggle"
              onClick={() => setCollapsed(!collapsed)}
              aria-label="Toggle sidebar"
            >
              {collapsed ? '›' : '‹'}
            </button>
          </div>

          <nav className="sidebar__nav">
            {NAV_KEYS.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                className={({ isActive }) =>
                  `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
                }
              >
                <span className="sidebar__link-icon">{item.icon}</span>
                <span className="sidebar__link-label">{t(`nav.${item.key}`)}</span>
              </NavLink>
            ))}
          </nav>

          {/* Language Selector */}
          <div className="sidebar__lang">
            {LANGUAGES.map(l => (
              <button
                key={l.code}
                className={`lang-btn ${lang === l.code ? 'lang-btn--active' : ''}`}
                onClick={() => setLang(l.code)}
                title={l.code.toUpperCase()}
              >
                <span className="lang-btn__flag">{l.flag}</span>
                <span className="lang-btn__label">{l.label}</span>
              </button>
            ))}
          </div>

          <div className="sidebar__footer">
            <p className="sidebar__tagline">{t('common.noDataSent')}</p>
          </div>
        </aside>

        {/* Main content */}
        <main className="main">
          {children}
        </main>
      </div>

      {/* Bottom AdSense Banner */}
      <div className="adsense-bottom">
        <div className="adsense-placeholder adsense-leaderboard">
          <span>{t('common.advertisement')}</span>
        </div>
      </div>
    </div>
  );
}
