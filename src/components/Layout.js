import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Layout.css';

const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: '⌂', exact: true },
  { path: '/json', label: 'JSON Formatter', icon: '{ }' },
  { path: '/base64', label: 'Base64', icon: '64' },
  { path: '/url', label: 'URL Encoder', icon: '%' },
  { path: '/jwt', label: 'JWT Decoder', icon: '🔑' },
  { path: '/timestamp', label: 'Timestamp', icon: '⏱' },
];

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`layout ${collapsed ? 'layout--collapsed' : ''}`}>
      {/* Top AdSense Banner */}
      <div className="adsense-top">
        <div className="adsense-placeholder adsense-leaderboard">
          <span>Advertisement · 728×90</span>
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
            {NAV_ITEMS.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                className={({ isActive }) =>
                  `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
                }
              >
                <span className="sidebar__link-icon">{item.icon}</span>
                <span className="sidebar__link-label">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="sidebar__footer">
            <p className="sidebar__tagline">All client-side. No data sent.</p>
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
          <span>Advertisement · 728×90</span>
        </div>
      </div>
    </div>
  );
}
