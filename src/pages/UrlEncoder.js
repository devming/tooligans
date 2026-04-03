import React, { useState } from 'react';
import { ToolHeader, Panel, TextArea, Button, ButtonGroup, Status } from '../components/ToolPage';
import { useLanguage } from '../i18n/LanguageContext';
import Seo from '../components/Seo';

export default function UrlEncoder() {
  const { t } = useLanguage();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState(null);
  const [mode, setMode] = useState('component'); // 'component' | 'full'

  const encode = () => {
    if (!input.trim()) return;
    try {
      const result = mode === 'component'
        ? encodeURIComponent(input)
        : encodeURI(input);
      setOutput(result);
      setStatus({ type: 'success', message: mode === 'component' ? t('url.status.encodedComponent') : t('url.status.encodedFull') });
    } catch (e) {
      setStatus({ type: 'error', message: e.message });
    }
  };

  const decode = () => {
    if (!input.trim()) return;
    try {
      const result = mode === 'component'
        ? decodeURIComponent(input)
        : decodeURI(input);
      setOutput(result);
      setStatus({ type: 'success', message: t('url.status.decoded') });
    } catch (e) {
      setStatus({ type: 'error', message: t('url.status.malformedURI') + e.message });
    }
  };

  const clear = () => { setInput(''); setOutput(''); setStatus(null); };

  const swap = () => { setInput(output); setOutput(input); setStatus(null); };

  const modeStyle = (active) => ({
    padding: '7px 16px',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--border)',
    background: active ? 'var(--accent-dim)' : 'var(--bg-secondary)',
    color: active ? 'var(--accent-light)' : 'var(--text-secondary)',
    borderColor: active ? 'var(--accent)' : 'var(--border)',
    cursor: 'pointer',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.8rem',
  });

  return (
    <div>
      <Seo title="URL Encoder / Decoder" description="Encode or decode URL components and full URIs online. Supports encodeURIComponent and encodeURI modes. Free." path="/url" />
      <ToolHeader
        title={t('url.title')}
        description={t('url.desc')}
      />

      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <button onClick={() => setMode('component')} style={modeStyle(mode === 'component')}>
            {t('url.componentMode')}
          </button>
          <button onClick={() => setMode('full')} style={modeStyle(mode === 'full')}>
            {t('url.fullMode')}
          </button>
        </div>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          {mode === 'component' ? t('url.componentHint') : t('url.fullHint')}
        </p>
      </div>

      <ButtonGroup>
        <Button onClick={encode} variant="primary">{t('common.encode')}</Button>
        <Button onClick={decode} variant="secondary">{t('common.decode')}</Button>
        <Button onClick={swap} variant="ghost">{t('common.swap')}</Button>
        <Button onClick={clear} variant="ghost">{t('common.clear')}</Button>
      </ButtonGroup>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Panel
          title={t('common.input')}
          actions={
            <Button size="sm" variant="ghost" onClick={() => navigator.clipboard.readText().then(text => setInput(text))}>
              {t('common.paste')}
            </Button>
          }
        >
          <TextArea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="https://example.com/path?q=hello world&lang=한국어"
            rows={12}
          />
        </Panel>

        <Panel
          title={t('common.output')}
          actions={
            <Button size="sm" variant="ghost" onClick={() => { if (output) navigator.clipboard.writeText(output); }}>
              {t('common.copy')}
            </Button>
          }
        >
          <TextArea
            value={output}
            readOnly
            placeholder={t('url.outputPlaceholder')}
            rows={12}
          />
        </Panel>
      </div>

      {status && <Status type={status.type} message={status.message} />}
    </div>
  );
}
