import React from 'react';
import './ToolPage.css';

export function ToolHeader({ title, description, badge }) {
  return (
    <div className="tool-header">
      <div className="tool-header__top">
        <h1 className="tool-header__title">{title}</h1>
        {badge && <span className="tool-header__badge">{badge}</span>}
      </div>
      {description && (
        <p className="tool-header__desc">{description}</p>
      )}
    </div>
  );
}

export function ToolGrid({ children, cols = 2 }) {
  return (
    <div className="tool-grid" style={{ '--cols': cols }}>
      {children}
    </div>
  );
}

export function Panel({ title, children, className = '', actions }) {
  return (
    <div className={`panel ${className}`}>
      {(title || actions) && (
        <div className="panel__header">
          {title && <h3 className="panel__title">{title}</h3>}
          {actions && <div className="panel__actions">{actions}</div>}
        </div>
      )}
      <div className="panel__body">{children}</div>
    </div>
  );
}

export function TextArea({ label, value, onChange, placeholder, readOnly, rows = 8, mono = true }) {
  return (
    <div className="field">
      {label && <label className="field__label">{label}</label>}
      <textarea
        className={mono ? 'mono' : ''}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        rows={rows}
      />
    </div>
  );
}

export function Button({ children, onClick, variant = 'primary', disabled, size = 'md', className = '' }) {
  return (
    <button
      className={`btn btn--${variant} btn--${size} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export function ButtonGroup({ children }) {
  return <div className="btn-group">{children}</div>;
}

export function Status({ type, message }) {
  if (!message) return null;
  return (
    <div className={`status status--${type}`}>
      <span className="status__icon">
        {type === 'success' ? '✓' : type === 'error' ? '✗' : type === 'warning' ? '⚠' : 'ℹ'}
      </span>
      {message}
    </div>
  );
}

export function FieldRow({ children }) {
  return <div className="field-row">{children}</div>;
}
