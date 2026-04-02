import React, { useState, useEffect } from 'react';
import { ToolHeader, Panel, Button, Status } from '../components/ToolPage';
import './TimestampConverter.css';

export default function TimestampConverter() {
  const [now, setNow] = useState(Math.floor(Date.now() / 1000));
  const [tsInput, setTsInput] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [tsResult, setTsResult] = useState(null);
  const [dateResult, setDateResult] = useState(null);
  const [status, setStatus] = useState(null);
  const [unit, setUnit] = useState('s'); // 's' | 'ms'

  useEffect(() => {
    const id = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(id);
  }, []);

  const convertTs = () => {
    const n = parseInt(tsInput, 10);
    if (isNaN(n)) { setStatus({ type: 'error', message: 'Invalid timestamp' }); return; }
    const ms = unit === 'ms' ? n : n * 1000;
    const d = new Date(ms);
    if (isNaN(d.getTime())) { setStatus({ type: 'error', message: 'Timestamp out of range' }); return; }
    setTsResult({
      utc: d.toUTCString(),
      iso: d.toISOString(),
      local: d.toLocaleString(),
      relative: formatRelative(d),
    });
    setStatus({ type: 'success', message: 'Converted successfully' });
  };

  const convertDate = () => {
    if (!dateInput) { setStatus({ type: 'error', message: 'Enter a date/time' }); return; }
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) { setStatus({ type: 'error', message: 'Invalid date string' }); return; }
    setDateResult({
      unix: Math.floor(d.getTime() / 1000),
      unixMs: d.getTime(),
    });
    setStatus({ type: 'success', message: 'Converted successfully' });
  };

  const useNow = () => {
    setTsInput(String(now));
    setUnit('s');
  };

  function formatRelative(d) {
    const diff = Math.floor((d - Date.now()) / 1000);
    const abs = Math.abs(diff);
    const past = diff < 0;
    if (abs < 60) return `${abs}s ${past ? 'ago' : 'from now'}`;
    if (abs < 3600) return `${Math.floor(abs / 60)}m ${past ? 'ago' : 'from now'}`;
    if (abs < 86400) return `${Math.floor(abs / 3600)}h ${past ? 'ago' : 'from now'}`;
    return `${Math.floor(abs / 86400)}d ${past ? 'ago' : 'from now'}`;
  }

  return (
    <div>
      <ToolHeader
        title="Timestamp Converter"
        description="Convert Unix timestamps to human-readable dates and vice versa."
        badge="Client-side"
      />

      {/* Live clock */}
      <div className="ts-live">
        <div className="ts-live__label">Current Unix Timestamp</div>
        <div className="ts-live__value">{now}</div>
        <div className="ts-live__sub">{new Date(now * 1000).toUTCString()}</div>
        <button className="ts-live__use" onClick={useNow}>Use this →</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '20px' }}>
        {/* Timestamp → Date */}
        <Panel title="Unix Timestamp → Date">
          <div className="ts-field">
            <div className="ts-field__row">
              <input
                type="number"
                value={tsInput}
                onChange={e => setTsInput(e.target.value)}
                placeholder="1609459200"
                className="mono"
                style={{ flex: 1 }}
              />
              <select
                value={unit}
                onChange={e => setUnit(e.target.value)}
                style={{ width: 'auto', padding: '9px 10px', fontSize: '0.82rem' }}
              >
                <option value="s">seconds</option>
                <option value="ms">milliseconds</option>
              </select>
            </div>
            <Button onClick={convertTs} variant="primary" style={{ marginTop: '10px', width: '100%' }}>Convert</Button>
          </div>

          {tsResult && (
            <div className="ts-result">
              <div className="ts-result__row">
                <span className="ts-result__label">UTC</span>
                <span className="ts-result__value">{tsResult.utc}</span>
              </div>
              <div className="ts-result__row">
                <span className="ts-result__label">ISO 8601</span>
                <span className="ts-result__value">{tsResult.iso}</span>
              </div>
              <div className="ts-result__row">
                <span className="ts-result__label">Local</span>
                <span className="ts-result__value">{tsResult.local}</span>
              </div>
              <div className="ts-result__row">
                <span className="ts-result__label">Relative</span>
                <span className="ts-result__value ts-result__value--accent">{tsResult.relative}</span>
              </div>
            </div>
          )}
        </Panel>

        {/* Date → Timestamp */}
        <Panel title="Date → Unix Timestamp">
          <div className="ts-field">
            <input
              type="datetime-local"
              value={dateInput}
              onChange={e => setDateInput(e.target.value)}
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}
            />
            <div style={{ marginTop: '8px' }}>
              <input
                type="text"
                value={dateInput}
                onChange={e => setDateInput(e.target.value)}
                placeholder="or type: 2024-01-01T00:00:00Z"
                className="mono"
              />
            </div>
            <Button onClick={convertDate} variant="primary" style={{ marginTop: '10px', width: '100%' }}>Convert</Button>
          </div>

          {dateResult && (
            <div className="ts-result">
              <div className="ts-result__row">
                <span className="ts-result__label">Unix (s)</span>
                <span className="ts-result__value ts-result__value--accent">
                  {dateResult.unix}
                  <button
                    className="ts-copy-btn"
                    onClick={() => navigator.clipboard.writeText(String(dateResult.unix))}
                  >copy</button>
                </span>
              </div>
              <div className="ts-result__row">
                <span className="ts-result__label">Unix (ms)</span>
                <span className="ts-result__value">
                  {dateResult.unixMs}
                  <button
                    className="ts-copy-btn"
                    onClick={() => navigator.clipboard.writeText(String(dateResult.unixMs))}
                  >copy</button>
                </span>
              </div>
            </div>
          )}
        </Panel>
      </div>

      {status && <Status type={status.type} message={status.message} />}
    </div>
  );
}
