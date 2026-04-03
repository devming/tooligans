import React, { useState } from 'react';
import { ToolHeader, Panel, TextArea, Button, ButtonGroup, Status } from '../components/ToolPage';
import { useLanguage } from '../i18n/LanguageContext';
import Seo from '../components/Seo';

export default function Base64Tool() {
  const { t } = useLanguage();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState(null);

  const encode = () => {
    if (!input.trim()) return;
    try {
      const encoded = btoa(unescape(encodeURIComponent(input)));
      setOutput(encoded);
      setStatus({ type: 'success', message: t('base64.status.encoded') });
    } catch (e) {
      setStatus({ type: 'error', message: e.message });
    }
  };

  const decode = () => {
    if (!input.trim()) return;
    try {
      const decoded = decodeURIComponent(escape(atob(input)));
      setOutput(decoded);
      setStatus({ type: 'success', message: t('base64.status.decoded') });
    } catch (e) {
      setStatus({ type: 'error', message: t('base64.status.invalidBase64') + e.message });
    }
  };

  const clear = () => { setInput(''); setOutput(''); setStatus(null); };

  const swap = () => {
    const temp = input;
    setInput(output);
    setOutput(temp);
    setStatus(null);
  };

  return (
    <div>
      <Seo title="Base64 Encoder / Decoder" description="Encode text to Base64 or decode Base64 to text online. UTF-8 safe, free." path="/base64" />
      <ToolHeader
        title={t('base64.title')}
        description={t('base64.desc')}
      />

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
            placeholder={t('base64.inputPlaceholder')}
            rows={14}
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
            placeholder={t('base64.outputPlaceholder')}
            rows={14}
          />
        </Panel>
      </div>

      {status && <Status type={status.type} message={status.message} />}
    </div>
  );
}
