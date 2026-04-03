import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { LanguageProvider } from '../../i18n/LanguageContext';
import Base64Tool from '../Base64Tool';

function renderPage() {
  return render(
    <HelmetProvider>
      <MemoryRouter>
        <LanguageProvider>
          <Base64Tool />
        </LanguageProvider>
      </MemoryRouter>
    </HelmetProvider>
  );
}

function getInput() { return screen.getAllByRole('textbox')[0]; }
function getOutput() { return screen.getAllByRole('textbox')[1]; }
function clickEncode() { fireEvent.click(screen.getByRole('button', { name: /Encode/ })); }
function clickDecode() { fireEvent.click(screen.getByRole('button', { name: /Decode/ })); }

describe('Base64Tool', () => {
  test('renders title and buttons', () => {
    renderPage();
    expect(screen.getByText('Base64 Encoder / Decoder')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Encode/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Decode/ })).toBeInTheDocument();
  });

  test('encodes ASCII text to Base64', () => {
    renderPage();
    fireEvent.change(getInput(), { target: { value: 'Hello, World!' } });
    clickEncode();
    expect(getOutput().value).toBe('SGVsbG8sIFdvcmxkIQ==');
  });

  test('decodes Base64 to ASCII text', () => {
    renderPage();
    fireEvent.change(getInput(), { target: { value: 'SGVsbG8sIFdvcmxkIQ==' } });
    clickDecode();
    expect(getOutput().value).toBe('Hello, World!');
  });

  test('encodes UTF-8 text (Korean)', () => {
    renderPage();
    fireEvent.change(getInput(), { target: { value: '안녕하세요' } });
    clickEncode();
    const output = getOutput().value;
    expect(decodeURIComponent(escape(atob(output)))).toBe('안녕하세요');
  });

  test('decodes invalid Base64 shows error', () => {
    renderPage();
    fireEvent.change(getInput(), { target: { value: '!!!invalid!!!' } });
    clickDecode();
    expect(screen.getByText(/Invalid Base64/i)).toBeInTheDocument();
  });

  test('swap exchanges input and output', () => {
    renderPage();
    fireEvent.change(getInput(), { target: { value: 'test' } });
    clickEncode();
    const encoded = getOutput().value;
    fireEvent.click(screen.getByRole('button', { name: /Swap/ }));
    expect(getInput().value).toBe(encoded);
    expect(getOutput().value).toBe('test');
  });

  test('clear resets everything', () => {
    renderPage();
    fireEvent.change(getInput(), { target: { value: 'test' } });
    clickEncode();
    fireEvent.click(screen.getByText('Clear'));
    expect(getInput().value).toBe('');
    expect(getOutput().value).toBe('');
  });

  test('encode with empty input does nothing', () => {
    renderPage();
    clickEncode();
    expect(getOutput().value).toBe('');
  });
});
