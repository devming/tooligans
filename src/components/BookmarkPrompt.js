import React, { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import './BookmarkPrompt.css';

const STORAGE_KEY = 'tooligans_bookmark_dismissed';
const SHOW_DELAY = 3000;

function isMac() {
  return navigator.platform?.toUpperCase().indexOf('MAC') >= 0;
}

export default function BookmarkPrompt({ collapsed }) {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [nudge, setNudge] = useState(false);
  const [dismissed, setDismissed] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEY) === '1'; } catch { return false; }
  });

  useEffect(() => {
    if (dismissed) return;
    const timer = setTimeout(() => setVisible(true), SHOW_DELAY);
    return () => clearTimeout(timer);
  }, [dismissed]);

  const dismiss = (e) => {
    e.stopPropagation();
    setVisible(false);
    setDismissed(true);
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch {}
  };

  const handleClick = () => {
    // 클릭 시 키보드 단축키 강조 애니메이션
    setNudge(true);
    setTimeout(() => setNudge(false), 1500);
  };

  if (dismissed || !visible) return null;

  const shortcut = isMac() ? '⌘ + D' : 'Ctrl + D';

  return (
    <div className={`bookmark-prompt ${collapsed ? 'bookmark-prompt--collapsed' : ''}`} onClick={handleClick}>
      <button className="bookmark-prompt__close" onClick={dismiss} aria-label="Dismiss">
        ×
      </button>
      <div className="bookmark-prompt__star">
        <span className="bookmark-prompt__star-icon">★</span>
        <span className="bookmark-prompt__star-glow" />
      </div>
      <div className="bookmark-prompt__text">
        <span className="bookmark-prompt__title">{t('bookmark.title')}</span>
        <span className={`bookmark-prompt__sub ${nudge ? 'bookmark-prompt__sub--nudge' : ''}`}>
          {nudge ? t('bookmark.nudge') : t('bookmark.sub')}
        </span>
      </div>
      <kbd className={`bookmark-prompt__kbd ${nudge ? 'bookmark-prompt__kbd--nudge' : ''}`}>{shortcut}</kbd>
    </div>
  );
}
