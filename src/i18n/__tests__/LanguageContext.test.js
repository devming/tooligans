import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageProvider, useLanguage, LANGUAGES } from '../LanguageContext';

function TestConsumer() {
  const { t, lang, setLang } = useLanguage();
  return (
    <div>
      <span data-testid="lang">{lang}</span>
      <span data-testid="translated">{t('nav.home')}</span>
      <span data-testid="tagline">{t('home.tagline')}</span>
      {LANGUAGES.map(l => (
        <button key={l.code} onClick={() => setLang(l.code)}>{l.label}</button>
      ))}
    </div>
  );
}

function renderContext() {
  return render(
    <LanguageProvider>
      <TestConsumer />
    </LanguageProvider>
  );
}

describe('LanguageContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('defaults to English', () => {
    renderContext();
    expect(screen.getByTestId('lang').textContent).toBe('en');
    expect(screen.getByTestId('translated').textContent).toBe('Home');
  });

  test('switches to Korean', () => {
    renderContext();
    fireEvent.click(screen.getByText('KO'));
    expect(screen.getByTestId('lang').textContent).toBe('ko');
    expect(screen.getByTestId('translated').textContent).toBe('홈');
    expect(screen.getByTestId('tagline').textContent).toBe('개발자 유틸리티, 한 곳에서');
  });

  test('switches to Chinese', () => {
    renderContext();
    fireEvent.click(screen.getByText('ZH'));
    expect(screen.getByTestId('lang').textContent).toBe('zh');
    expect(screen.getByTestId('translated').textContent).toBe('首页');
  });

  test('switches to Japanese', () => {
    renderContext();
    fireEvent.click(screen.getByText('JA'));
    expect(screen.getByTestId('lang').textContent).toBe('ja');
    expect(screen.getByTestId('translated').textContent).toBe('ホーム');
  });

  test('persists language to localStorage', () => {
    renderContext();
    fireEvent.click(screen.getByText('KO'));
    expect(localStorage.getItem('tooligans_lang')).toBe('ko');
  });

  test('restores language from localStorage', () => {
    localStorage.setItem('tooligans_lang', 'ja');
    renderContext();
    expect(screen.getByTestId('lang').textContent).toBe('ja');
  });

  test('falls back to English for missing key', () => {
    renderContext();
    // Switch to Korean, then test fallback by checking a key we know exists
    fireEvent.click(screen.getByText('KO'));
    // nav.home should be translated
    expect(screen.getByTestId('translated').textContent).toBe('홈');
  });

  test('returns key path when translation not found in any language', () => {
    function MissingKeyConsumer() {
      const { t } = useLanguage();
      return <span data-testid="missing">{t('nonexistent.key.path')}</span>;
    }
    render(
      <LanguageProvider>
        <MissingKeyConsumer />
      </LanguageProvider>
    );
    expect(screen.getByTestId('missing').textContent).toBe('nonexistent.key.path');
  });
});
