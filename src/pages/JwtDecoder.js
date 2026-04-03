import React, { useState } from 'react';
import { ToolHeader, Panel, TextArea, Button, ButtonGroup, Status } from '../components/ToolPage';
import { useLanguage } from '../i18n/LanguageContext';
import Seo from '../components/Seo';
import './JwtDecoder.css';

function b64decode(str) {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
  return JSON.parse(decodeURIComponent(escape(atob(padded))));
}

export default function JwtDecoder() {
  const { t } = useLanguage();
  const [token, setToken] = useState('');
  const [decoded, setDecoded] = useState(null);
  const [status, setStatus] = useState(null);

  const decode = () => {
    if (!token.trim()) return;
    const parts = token.trim().split('.');
    if (parts.length !== 3) {
      setStatus({ type: 'error', message: t('jwt.status.invalid3parts') });
      setDecoded(null);
      return;
    }
    try {
      const header = b64decode(parts[0]);
      const payload = b64decode(parts[1]);
      const signature = parts[2];

      let expStatus = null;
      if (payload.exp) {
        const now = Math.floor(Date.now() / 1000);
        const expDate = new Date(payload.exp * 1000);
        if (now > payload.exp) {
          expStatus = { type: 'error', msg: t('jwt.status.expired') + expDate.toLocaleString() };
        } else {
          const diff = payload.exp - now;
          const hours = Math.floor(diff / 3600);
          const mins = Math.floor((diff % 3600) / 60);
          expStatus = { type: 'success', msg: `${t('jwt.status.validExpires')}${hours}h ${mins}m (${expDate.toLocaleString()})` };
        }
      }

      setDecoded({ header, payload, signature, expStatus });
      setStatus({ type: 'success', message: t('jwt.status.decoded') });
    } catch (e) {
      setStatus({ type: 'error', message: t('jwt.status.failedDecode') + e.message });
      setDecoded(null);
    }
  };

  const clear = () => { setToken(''); setDecoded(null); setStatus(null); };

  return (
    <div>
      <Seo title="JWT Decoder" description="Decode JSON Web Tokens online. Inspect header, payload, check expiry. Free." path="/jwt" />
      <ToolHeader
        title={t('jwt.title')}
        description={t('jwt.desc')}
      />

      <Panel
        title={t('jwt.tokenLabel')}
        actions={
          <Button size="sm" variant="ghost" onClick={() => navigator.clipboard.readText().then(text => setToken(text.trim()))}>
            {t('common.paste')}
          </Button>
        }
      >
        <TextArea
          value={token}
          onChange={e => setToken(e.target.value)}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
          rows={4}
        />
      </Panel>

      <ButtonGroup style={{ marginTop: '12px' }}>
        <Button onClick={decode} variant="primary">{t('jwt.decode')}</Button>
        <Button onClick={clear} variant="ghost">{t('common.clear')}</Button>
      </ButtonGroup>

      {status && <Status type={status.type} message={status.message} />}

      {decoded && (
        <div className="jwt-sections">
          <Panel title={t('jwt.headerLabel')} className="jwt-section jwt-section--header">
            <pre className="jwt-json">{JSON.stringify(decoded.header, null, 2)}</pre>
          </Panel>

          <Panel
            title={t('jwt.payloadLabel')}
            className="jwt-section jwt-section--payload"
            actions={
              decoded.expStatus && (
                <span className={`jwt-exp jwt-exp--${decoded.expStatus.type}`}>
                  {decoded.expStatus.type === 'success' ? '✓' : '✗'} {decoded.expStatus.msg}
                </span>
              )
            }
          >
            <pre className="jwt-json">{JSON.stringify(decoded.payload, null, 2)}</pre>
          </Panel>

          <Panel title={t('jwt.signatureLabel')} className="jwt-section jwt-section--sig">
            <code className="jwt-sig">{decoded.signature}</code>
            <p className="jwt-sig-note">{t('jwt.sigNote')}</p>
          </Panel>
        </div>
      )}
    </div>
  );
}
