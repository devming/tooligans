import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { LanguageProvider } from '../../i18n/LanguageContext';
import UrlEncoder from '../UrlEncoder';

function renderPage() {
  return render(
    <HelmetProvider>
      <MemoryRouter>
        <LanguageProvider>
          <UrlEncoder />
        </LanguageProvider>
      </MemoryRouter>
    </HelmetProvider>
  );
}

function getInput() { return screen.getAllByRole('textbox')[0]; }
function getOutput() { return screen.getAllByRole('textbox')[1]; }
function clickEncode() { fireEvent.click(screen.getByRole('button', { name: /Encode →/ })); }
function clickDecode() { fireEvent.click(screen.getByRole('button', { name: /← Decode/ })); }

describe('UrlEncoder', () => {
  test('renders title and mode buttons', () => {
    renderPage();
    expect(screen.getByText(/URL Encoder/)).toBeInTheDocument();
    expect(screen.getByText('encodeURIComponent')).toBeInTheDocument();
  });

  test('encodeURIComponent mode encodes special chars', () => {
    renderPage();
    fireEvent.change(getInput(), { target: { value: 'hello world&foo=bar' } });
    clickEncode();
    expect(getOutput().value).toBe('hello%20world%26foo%3Dbar');
  });

  test('encodeURIComponent mode encodes slashes', () => {
    renderPage();
    fireEvent.change(getInput(), { target: { value: 'path/to/file' } });
    clickEncode();
    expect(getOutput().value).toBe('path%2Fto%2Ffile');
  });

  test('encodeURI mode preserves URI structure', () => {
    renderPage();
    fireEvent.click(screen.getByText(/encodeURI \(full/));
    fireEvent.change(getInput(), { target: { value: 'https://example.com/path?q=hello world' } });
    clickEncode();
    const output = getOutput().value;
    expect(output).toContain('https://example.com/path');
    expect(output).toContain('hello%20world');
  });

  test('decodes URL-encoded string', () => {
    renderPage();
    fireEvent.change(getInput(), { target: { value: 'hello%20world%26foo%3Dbar' } });
    clickDecode();
    expect(getOutput().value).toBe('hello world&foo=bar');
  });

  test('decode with malformed URI shows error', () => {
    renderPage();
    fireEvent.change(getInput(), { target: { value: '%E0%A4%A' } });
    clickDecode();
    expect(screen.getByText(/Malformed URI/i)).toBeInTheDocument();
  });

  test('encodes Korean characters', () => {
    renderPage();
    fireEvent.change(getInput(), { target: { value: '한국어' } });
    clickEncode();
    expect(getOutput().value).toBe(encodeURIComponent('한국어'));
  });

  test('swap exchanges input and output', () => {
    renderPage();
    fireEvent.change(getInput(), { target: { value: 'test value' } });
    clickEncode();
    const encoded = getOutput().value;
    fireEvent.click(screen.getByRole('button', { name: /Swap/ }));
    expect(getInput().value).toBe(encoded);
  });

  test('clear resets everything', () => {
    renderPage();
    fireEvent.change(getInput(), { target: { value: 'test' } });
    clickEncode();
    fireEvent.click(screen.getByText('Clear'));
    expect(getInput().value).toBe('');
    expect(getOutput().value).toBe('');
  });
});
