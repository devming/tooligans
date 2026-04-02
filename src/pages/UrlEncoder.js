import React, { useState } from 'react';
import { ToolHeader, Panel, TextArea, Button, ButtonGroup, Status } from '../components/ToolPage';

export default function UrlEncoder() {
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
      setStatus({ type: 'success', message: `Encoded using ${mode === 'component' ? 'encodeURIComponent' : 'encodeURI'}` });
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
      setStatus({ type: 'success', message: 'Decoded successfully' });
    } catch (e) {
      setStatus({ type: 'error', message: 'Malformed URI: ' + e.message });
    }
  };

  const clear = () => { setInput(''); setOutput(''); setStatus(null); };

  const swap = () => { setInput(output); setOutput(input); setStatus(null); };

  return (
    <div>
      <ToolHeader
        title="URL Encoder / Decoder"
        description="Encode or decode URL components and full URIs."
        badge="Client-side"
      />

      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <button
            className={`mode-btn ${mode === 'component' ? 'mode-btn--active' : ''}`}
            onClick={() => setMode('component')}
            style={{
              padding: '7px 16px',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border)',
              background: mode === 'component' ? 'var(--accent-dim)' : 'var(--bg-secondary)',
              color: mode === 'component' ? 'var(--accent-light)' : 'var(--text-secondary)',
              borderColor: mode === 'component' ? 'var(--accent)' : 'var(--border)',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
            }}
          >
            encodeURIComponent
          </button>
          <button
            onClick={() => setMode('full')}
            style={{
              padding: '7px 16px',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border)',
              background: mode === 'full' ? 'var(--accent-dim)' : 'var(--bg-secondary)',
              color: mode === 'full' ? 'var(--accent-light)' : 'var(--text-secondary)',
              borderColor: mode === 'full' ? 'var(--accent)' : 'var(--border)',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
            }}
          >
            encodeURI (full URI)
          </button>
        </div>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          {mode === 'component'
            ? '→ Encodes all special chars including :/?#[]@!$&\'()*+,;= — use for query param values'
            : '→ Preserves URI structure chars (:/?#[]@) — use for complete URLs'
          }
        </p>
      </div>

      <ButtonGroup>
        <Button onClick={encode} variant="primary">Encode →</Button>
        <Button onClick={decode} variant="secondary">← Decode</Button>
        <Button onClick={swap} variant="ghost">⇄ Swap</Button>
        <Button onClick={clear} variant="ghost">Clear</Button>
      </ButtonGroup>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Panel
          title="Input"
          actions={
            <Button size="sm" variant="ghost" onClick={() => navigator.clipboard.readText().then(t => setInput(t))}>
              Paste
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
          title="Output"
          actions={
            <Button size="sm" variant="ghost" onClick={() => { if (output) navigator.clipboard.writeText(output); }}>
              Copy
            </Button>
          }
        >
          <TextArea
            value={output}
            readOnly
            placeholder="Encoded/decoded result..."
            rows={12}
          />
        </Panel>
      </div>

      {status && <Status type={status.type} message={status.message} />}
    </div>
  );
}
