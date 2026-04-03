import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { LanguageProvider } from '../../i18n/LanguageContext';
import JsonFormatter from '../JsonFormatter';

function renderPage() {
  return render(
    <HelmetProvider>
      <MemoryRouter>
        <LanguageProvider>
          <JsonFormatter />
        </LanguageProvider>
      </MemoryRouter>
    </HelmetProvider>
  );
}

function getInput() {
  return screen.getAllByRole('textbox')[0];
}

function getOutput() {
  return screen.getAllByRole('textbox')[1];
}

describe('JsonFormatter', () => {
  test('renders title and buttons', () => {
    renderPage();
    expect(screen.getByText('JSON Formatter')).toBeInTheDocument();
    expect(screen.getByText('Prettier')).toBeInTheDocument();
    expect(screen.getByText('Minify')).toBeInTheDocument();
    expect(screen.getByText('Clear')).toBeInTheDocument();
  });

  test('real-time validation — valid JSON shows success', () => {
    renderPage();
    fireEvent.change(getInput(), { target: { value: '{"a":1}' } });
    expect(screen.getByText('Valid JSON')).toBeInTheDocument();
  });

  test('real-time validation — invalid JSON shows error', () => {
    renderPage();
    fireEvent.change(getInput(), { target: { value: '{bad json' } });
    expect(screen.getByText(/Expected property name/i)).toBeInTheDocument();
  });

  test('real-time validation — empty input clears status', () => {
    renderPage();
    fireEvent.change(getInput(), { target: { value: '{"a":1}' } });
    expect(screen.getByText('Valid JSON')).toBeInTheDocument();
    fireEvent.change(getInput(), { target: { value: '' } });
    expect(screen.queryByText('Valid JSON')).not.toBeInTheDocument();
  });

  test('prettier formats and sorts keys alphabetically', () => {
    renderPage();
    fireEvent.change(getInput(), { target: { value: '{"z":1,"a":2,"m":3}' } });
    fireEvent.click(screen.getByText('Prettier'));
    const output = getOutput();
    const parsed = JSON.parse(output.value);
    expect(Object.keys(parsed)).toEqual(['a', 'm', 'z']);
  });

  test('prettier sorts nested keys recursively', () => {
    renderPage();
    const input = '{"b":{"z":1,"a":2},"a":1}';
    fireEvent.change(getInput(), { target: { value: input } });
    fireEvent.click(screen.getByText('Prettier'));
    const output = JSON.parse(getOutput().value);
    expect(Object.keys(output)).toEqual(['a', 'b']);
    expect(Object.keys(output.b)).toEqual(['a', 'z']);
  });

  test('prettier respects indent setting', () => {
    renderPage();
    fireEvent.change(getInput(), { target: { value: '{"a":1}' } });
    // Change to 4 spaces
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '4' } });
    fireEvent.click(screen.getByText('Prettier'));
    const output = getOutput().value;
    expect(output).toContain('    "a"'); // 4 spaces
  });

  test('minify produces single-line output', () => {
    renderPage();
    fireEvent.change(getInput(), { target: { value: '{\n  "a": 1,\n  "b": 2\n}' } });
    fireEvent.click(screen.getByText('Minify'));
    expect(getOutput().value).toBe('{"a":1,"b":2}');
  });

  test('prettier with invalid JSON shows error', () => {
    renderPage();
    fireEvent.change(getInput(), { target: { value: 'not json' } });
    fireEvent.click(screen.getByText('Prettier'));
    expect(getOutput().value).toBe('');
  });

  test('clear resets input, output, and status', () => {
    renderPage();
    fireEvent.change(getInput(), { target: { value: '{"a":1}' } });
    fireEvent.click(screen.getByText('Prettier'));
    expect(getOutput().value).not.toBe('');
    fireEvent.click(screen.getByText('Clear'));
    expect(getInput().value).toBe('');
    expect(getOutput().value).toBe('');
  });
});
