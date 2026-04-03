import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { LanguageProvider } from '../../i18n/LanguageContext';
import TimestampConverter from '../TimestampConverter';

function renderPage() {
  return render(
    <HelmetProvider>
      <MemoryRouter>
        <LanguageProvider>
          <TimestampConverter />
        </LanguageProvider>
      </MemoryRouter>
    </HelmetProvider>
  );
}

describe('TimestampConverter', () => {
  beforeEach(() => { jest.useFakeTimers(); });
  afterEach(() => { jest.useRealTimers(); });

  test('renders title and live timestamp', () => {
    renderPage();
    expect(screen.getByText('Timestamp Converter')).toBeInTheDocument();
    expect(screen.getByText('Current Unix Timestamp')).toBeInTheDocument();
  });

  test('converts Unix timestamp to date (seconds)', () => {
    renderPage();
    const tsInput = screen.getAllByRole('spinbutton')[0];
    fireEvent.change(tsInput, { target: { value: '1609459200' } });
    fireEvent.click(screen.getAllByText('Convert')[0]);
    // Multiple results contain 2021, use getAllByText
    const results = screen.getAllByText(/2021/);
    expect(results.length).toBeGreaterThanOrEqual(1);
    // Check specific formats exist
    expect(screen.getByText(/2021-01-01T00:00:00\.000Z/)).toBeInTheDocument();
  });

  test('converts Unix timestamp (milliseconds)', () => {
    renderPage();
    const tsInput = screen.getAllByRole('spinbutton')[0];
    const selects = screen.getAllByRole('combobox');
    fireEvent.change(selects[0], { target: { value: 'ms' } });
    fireEvent.change(tsInput, { target: { value: '1609459200000' } });
    fireEvent.click(screen.getAllByText('Convert')[0]);
    expect(screen.getByText(/2021-01-01T00:00:00\.000Z/)).toBeInTheDocument();
  });

  test('invalid timestamp shows error', () => {
    renderPage();
    const tsInput = screen.getAllByRole('spinbutton')[0];
    fireEvent.change(tsInput, { target: { value: '' } });
    fireEvent.click(screen.getAllByText('Convert')[0]);
    expect(screen.getByText(/Invalid timestamp/i)).toBeInTheDocument();
  });

  test('converts date to Unix timestamp', () => {
    renderPage();
    const textInputs = screen.getAllByRole('textbox');
    fireEvent.change(textInputs[0], { target: { value: '2021-01-01T00:00:00Z' } });
    fireEvent.click(screen.getAllByText('Convert')[1]);
    expect(screen.getByText('1609459200')).toBeInTheDocument();
  });

  test('invalid date shows error', () => {
    renderPage();
    const textInputs = screen.getAllByRole('textbox');
    fireEvent.change(textInputs[0], { target: { value: 'not a date' } });
    fireEvent.click(screen.getAllByText('Convert')[1]);
    expect(screen.getByText(/Invalid date/i)).toBeInTheDocument();
  });

  test('live timestamp updates every second', () => {
    renderPage();
    const initialTs = Math.floor(Date.now() / 1000);
    expect(screen.getByText(String(initialTs))).toBeInTheDocument();
    act(() => { jest.advanceTimersByTime(1000); });
    expect(screen.getByText(String(initialTs + 1))).toBeInTheDocument();
  });

  test('Use this button populates timestamp input', () => {
    renderPage();
    fireEvent.click(screen.getByText(/Use this/));
    const tsInput = screen.getAllByRole('spinbutton')[0];
    expect(tsInput.value).not.toBe('');
  });

  test('relative time shows "ago" for past timestamps', () => {
    renderPage();
    const pastTs = Math.floor(Date.now() / 1000) - 7200; // 2h ago
    const tsInput = screen.getAllByRole('spinbutton')[0];
    fireEvent.change(tsInput, { target: { value: String(pastTs) } });
    fireEvent.click(screen.getAllByText('Convert')[0]);
    expect(screen.getByText(/ago/)).toBeInTheDocument();
  });
});
