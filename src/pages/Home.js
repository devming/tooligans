import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const TOOLS = [
  {
    path: '/json',
    icon: '{ }',
    title: 'JSON Formatter',
    desc: 'Format, minify, and validate JSON with syntax highlighting.',
    tags: ['format', 'validate', 'minify'],
  },
  {
    path: '/base64',
    icon: '64',
    title: 'Base64',
    desc: 'Encode and decode Base64 strings and files instantly.',
    tags: ['encode', 'decode'],
  },
  {
    path: '/url',
    icon: '%',
    title: 'URL Encoder',
    desc: 'Encode/decode URL components and full URIs.',
    tags: ['encode', 'decode', 'uri'],
  },
  {
    path: '/jwt',
    icon: '🔑',
    title: 'JWT Decoder',
    desc: 'Decode JWT tokens, inspect header & payload, check expiry.',
    tags: ['token', 'auth', 'decode'],
  },
  {
    path: '/timestamp',
    icon: '⏱',
    title: 'Timestamp Converter',
    desc: 'Convert Unix timestamps to dates and back, live counter.',
    tags: ['unix', 'date', 'time'],
  },
];

export default function Home() {
  return (
    <div className="home">
      <div className="home__hero">
        <h1 className="home__title">
          Tool<span className="home__accent">igans</span>
        </h1>
        <p className="home__tagline">Developer utilities, all in one place</p>
        <p className="home__sub">
          All tools run entirely in your browser. Zero data sent to any server.
        </p>
      </div>

      <div className="home__grid">
        {TOOLS.map(tool => (
          <Link key={tool.path} to={tool.path} className="tool-card">
            <div className="tool-card__icon">{tool.icon}</div>
            <div className="tool-card__content">
              <h3 className="tool-card__title">{tool.title}</h3>
              <p className="tool-card__desc">{tool.desc}</p>
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
        <p>Built for developers · Open source · No tracking</p>
      </div>
    </div>
  );
}
