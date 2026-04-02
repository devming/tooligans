import React, { useState } from 'react';
import { ToolHeader, Panel, TextArea, Button, ButtonGroup, Status } from '../components/ToolPage';
import './JwtDecoder.css';

function b64decode(str) {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
  return JSON.parse(decodeURIComponent(escape(atob(padded))));
}

export default function JwtDecoder() {
  const [token, setToken] = useState('');
  const [decoded, setDecoded] = useState(null);
  const [status, setStatus] = useState(null);

  const decode = () => {
    if (!token.trim()) return;
    const parts = token.trim().split('.');
    if (parts.length !== 3) {
      setStatus({ type: 'error', message: 'Invalid JWT: must have 3 parts (header.payload.signature)' });
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
          expStatus = { type: 'error', msg: `Expired on ${expDate.toLocaleString()}` };
        } else {
          const diff = payload.exp - now;
          const hours = Math.floor(diff / 3600);
          const mins = Math.floor((diff % 3600) / 60);
          expStatus = { type: 'success', msg: `Valid — expires in ${hours}h ${mins}m (${expDate.toLocaleString()})` };
        }
      }

      setDecoded({ header, payload, signature, expStatus });
      setStatus({ type: 'success', message: 'JWT decoded successfully' });
    } catch (e) {
      setStatus({ type: 'error', message: 'Failed to decode: ' + e.message });
      setDecoded(null);
    }
  };

  const clear = () => { setToken(''); setDecoded(null); setStatus(null); };

  return (
    <div>
      <ToolHeader
        title="JWT Decoder"
        description="Decode JSON Web Tokens — inspect header, payload, and check expiry. Signature is NOT verified."
        badge="Client-side"
      />

      <Panel
        title="JWT Token"
        actions={
          <Button size="sm" variant="ghost" onClick={() => navigator.clipboard.readText().then(t => setToken(t.trim()))}>
            Paste
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
        <Button onClick={decode} variant="primary">Decode</Button>
        <Button onClick={clear} variant="ghost">Clear</Button>
      </ButtonGroup>

      {status && <Status type={status.type} message={status.message} />}

      {decoded && (
        <div className="jwt-sections">
          <Panel title="Header" className="jwt-section jwt-section--header">
            <pre className="jwt-json">{JSON.stringify(decoded.header, null, 2)}</pre>
          </Panel>

          <Panel
            title="Payload"
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

          <Panel title="Signature" className="jwt-section jwt-section--sig">
            <code className="jwt-sig">{decoded.signature}</code>
            <p className="jwt-sig-note">⚠ Signature is displayed but NOT cryptographically verified.</p>
          </Panel>
        </div>
      )}
    </div>
  );
}
