import React, { useState } from 'react';
import { ToolHeader, Panel, TextArea, Button, ButtonGroup, Status } from '../components/ToolPage';

export default function Base64Tool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState(null);

  const encode = () => {
    if (!input.trim()) return;
    try {
      const encoded = btoa(unescape(encodeURIComponent(input)));
      setOutput(encoded);
      setStatus({ type: 'success', message: 'Encoded successfully (UTF-8 safe)' });
    } catch (e) {
      setStatus({ type: 'error', message: e.message });
    }
  };

  const decode = () => {
    if (!input.trim()) return;
    try {
      const decoded = decodeURIComponent(escape(atob(input)));
      setOutput(decoded);
      setStatus({ type: 'success', message: 'Decoded successfully' });
    } catch (e) {
      setStatus({ type: 'error', message: 'Invalid Base64 string: ' + e.message });
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
      <ToolHeader
        title="Base64 Encoder / Decoder"
        description="Encode plain text to Base64 or decode Base64 back to text. UTF-8 safe."
        badge="Client-side"
      />

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
            placeholder="Enter text to encode, or Base64 to decode..."
            rows={14}
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
            placeholder="Result appears here..."
            rows={14}
          />
        </Panel>
      </div>

      {status && <Status type={status.type} message={status.message} />}
    </div>
  );
}
