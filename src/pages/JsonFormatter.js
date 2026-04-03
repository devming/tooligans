import React, { useState, useCallback, useEffect } from 'react';
import { ToolHeader, Panel, TextArea, Button, ButtonGroup, Status } from '../components/ToolPage';
import { useLanguage } from '../i18n/LanguageContext';

function sortKeysDeep(obj) {
  if (Array.isArray(obj)) return obj.map(sortKeysDeep);
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).sort().reduce((acc, key) => {
      acc[key] = sortKeysDeep(obj[key]);
      return acc;
    }, {});
  }
  return obj;
}

export default function JsonFormatter() {
  const { t } = useLanguage();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState(null);
  const [indent, setIndent] = useState(2);

  // 실시간 검증
  useEffect(() => {
    if (!input.trim()) {
      setStatus(null);
      return;
    }
    try {
      JSON.parse(input);
      setStatus({ type: 'success', message: t('json.status.valid') });
    } catch (e) {
      setStatus({ type: 'error', message: e.message });
    }
  }, [input, t]);

  const prettier = useCallback(() => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      const sorted = sortKeysDeep(parsed);
      setOutput(JSON.stringify(sorted, null, indent));
      setStatus({ type: 'success', message: t('json.status.prettified') });
    } catch (e) {
      setStatus({ type: 'error', message: e.message });
      setOutput('');
    }
  }, [input, indent, t]);

  const minify = useCallback(() => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setStatus({ type: 'success', message: t('json.status.minified') });
    } catch (e) {
      setStatus({ type: 'error', message: e.message });
      setOutput('');
    }
  }, [input, t]);

  const clear = () => { setInput(''); setOutput(''); setStatus(null); };

  const copyOutput = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      setStatus({ type: 'info', message: t('json.status.copied') });
    }
  };

  return (
    <div>
      <ToolHeader
        title={t('json.title')}
        description={t('json.desc')}
        badge={t('common.clientSide')}
      />

      <ButtonGroup>
        <Button onClick={prettier} variant="primary">{t('common.prettier')}</Button>
        <Button onClick={minify} variant="secondary">{t('common.minify')}</Button>
        <select
          value={indent}
          onChange={e => setIndent(Number(e.target.value))}
          style={{ width: 'auto', padding: '7px 10px', fontSize: '0.85rem' }}
        >
          <option value={2}>{t('json.spaces2')}</option>
          <option value={4}>{t('json.spaces4')}</option>
          <option value={1}>{t('json.tab')}</option>
        </select>
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
            placeholder='{"key": "value", "arr": [1, 2, 3]}'
            rows={16}
          />
        </Panel>

        <Panel
          title={t('common.output')}
          actions={
            <Button size="sm" variant="ghost" onClick={copyOutput}>{t('common.copy')}</Button>
          }
        >
          <TextArea
            value={output}
            readOnly
            placeholder={t('json.outputPlaceholder')}
            rows={16}
          />
        </Panel>
      </div>

      {status && <Status type={status.type} message={status.message} />}
    </div>
  );
}
