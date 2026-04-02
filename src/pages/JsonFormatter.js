import React, { useState, useCallback } from 'react';
import { ToolHeader, Panel, TextArea, Button, ButtonGroup, Status } from '../components/ToolPage';

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState(null);
  const [indent, setIndent] = useState(2);

  const format = useCallback(() => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent));
      setStatus({ type: 'success', message: 'Valid JSON — formatted successfully' });
    } catch (e) {
      setStatus({ type: 'error', message: e.message });
      setOutput('');
    }
  }, [input, indent]);

  const minify = useCallback(() => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setStatus({ type: 'success', message: 'Minified successfully' });
    } catch (e) {
      setStatus({ type: 'error', message: e.message });
      setOutput('');
    }
  }, [input]);

  const validate = useCallback(() => {
    if (!input.trim()) return;
    try {
      JSON.parse(input);
      setStatus({ type: 'success', message: 'Valid JSON' });
    } catch (e) {
      setStatus({ type: 'error', message: e.message });
    }
  }, [input]);

  const clear = () => { setInput(''); setOutput(''); setStatus(null); };

  const copyOutput = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      setStatus({ type: 'info', message: 'Copied to clipboard!' });
    }
  };

  return (
    <div>
      <ToolHeader
        title="JSON Formatter"
        description="Format, minify, and validate JSON. All processing happens in your browser."
        badge="Client-side"
      />

      <ButtonGroup>
        <Button onClick={format} variant="primary">Format</Button>
        <Button onClick={minify} variant="secondary">Minify</Button>
        <Button onClick={validate} variant="secondary">Validate</Button>
        <select
          value={indent}
          onChange={e => setIndent(Number(e.target.value))}
          style={{ width: 'auto', padding: '7px 10px', fontSize: '0.85rem' }}
        >
          <option value={2}>2 spaces</option>
          <option value={4}>4 spaces</option>
          <option value={1}>1 tab (soft)</option>
        </select>
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
            placeholder='{"key": "value", "arr": [1, 2, 3]}'
            rows={16}
          />
        </Panel>

        <Panel
          title="Output"
          actions={
            <Button size="sm" variant="ghost" onClick={copyOutput}>Copy</Button>
          }
        >
          <TextArea
            value={output}
            readOnly
            placeholder="Formatted JSON will appear here..."
            rows={16}
          />
        </Panel>
      </div>

      {status && <Status type={status.type} message={status.message} />}
    </div>
  );
}
