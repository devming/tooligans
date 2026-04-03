import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { LanguageProvider } from './i18n/LanguageContext';
import App from './App';

function renderApp(route = '/') {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[route]}>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </MemoryRouter>
    </HelmetProvider>
  );
}

test('renders home page with Tooligans logo', () => {
  renderApp('/');
  const logos = screen.getAllByText(/igans/);
  expect(logos.length).toBeGreaterThan(0);
});

test('renders sidebar navigation links', () => {
  renderApp('/');
  // Sidebar labels may also appear in home page cards, so use getAllByText
  expect(screen.getAllByText('JSON Formatter').length).toBeGreaterThanOrEqual(1);
  expect(screen.getAllByText('Base64').length).toBeGreaterThanOrEqual(1);
  expect(screen.getAllByText('URL Encoder').length).toBeGreaterThanOrEqual(1);
  expect(screen.getAllByText('JWT Decoder').length).toBeGreaterThanOrEqual(1);
  expect(screen.getByText('Timestamp')).toBeInTheDocument();
});

test('renders language selector buttons', () => {
  renderApp('/');
  expect(screen.getByTitle('EN')).toBeInTheDocument();
  expect(screen.getByTitle('KO')).toBeInTheDocument();
  expect(screen.getByTitle('ZH')).toBeInTheDocument();
  expect(screen.getByTitle('JA')).toBeInTheDocument();
});

test('routes to JSON page', () => {
  renderApp('/json');
  expect(screen.getByText('Prettier')).toBeInTheDocument();
  expect(screen.getByText('Minify')).toBeInTheDocument();
});

test('routes to Base64 page', () => {
  renderApp('/base64');
  expect(screen.getByRole('button', { name: /Encode/ })).toBeInTheDocument();
});

test('routes to JWT page', () => {
  renderApp('/jwt');
  expect(screen.getByText('Decode')).toBeInTheDocument();
});

test('routes to Timestamp page', () => {
  renderApp('/timestamp');
  expect(screen.getByText('Current Unix Timestamp')).toBeInTheDocument();
});
