import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { LanguageProvider } from '../../i18n/LanguageContext';
import JwtDecoder from '../JwtDecoder';

function renderPage() {
  return render(
    <HelmetProvider>
      <MemoryRouter>
        <LanguageProvider>
          <JwtDecoder />
        </LanguageProvider>
      </MemoryRouter>
    </HelmetProvider>
  );
}

// Standard test JWT: {"alg":"HS256","typ":"JWT"}.{"sub":"1234567890","name":"John Doe","iat":1516239022}
const VALID_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

// JWT with future exp
function makeJwtWithExp(exp) {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).replace(/=/g, '');
  const payload = btoa(JSON.stringify({ sub: '123', exp })).replace(/=/g, '');
  return `${header}.${payload}.fakesig`;
}

describe('JwtDecoder', () => {
  test('renders title and decode button', () => {
    renderPage();
    expect(screen.getByText('JWT Decoder')).toBeInTheDocument();
    expect(screen.getByText('Decode')).toBeInTheDocument();
  });

  test('decodes valid JWT and shows header/payload/signature', () => {
    renderPage();
    fireEvent.change(screen.getByRole('textbox'), { target: { value: VALID_JWT } });
    fireEvent.click(screen.getByText('Decode'));

    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('Payload')).toBeInTheDocument();
    expect(screen.getByText('Signature')).toBeInTheDocument();
    expect(screen.getByText(/HS256/)).toBeInTheDocument();
    expect(screen.getByText(/John Doe/)).toBeInTheDocument();
  });

  test('shows error for token with wrong number of parts', () => {
    renderPage();
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'only.twoparts' } });
    fireEvent.click(screen.getByText('Decode'));
    expect(screen.getByText(/must have 3 parts/i)).toBeInTheDocument();
  });

  test('shows error for invalid base64 in token', () => {
    renderPage();
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'a.b.c' } });
    fireEvent.click(screen.getByText('Decode'));
    expect(screen.getByText(/Failed to decode/i)).toBeInTheDocument();
  });

  test('shows expired status for past exp', () => {
    renderPage();
    const pastExp = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
    const jwt = makeJwtWithExp(pastExp);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: jwt } });
    fireEvent.click(screen.getByText('Decode'));
    expect(screen.getByText(/Expired/i)).toBeInTheDocument();
  });

  test('shows valid status for future exp', () => {
    renderPage();
    const futureExp = Math.floor(Date.now() / 1000) + 7200; // 2 hours from now
    const jwt = makeJwtWithExp(futureExp);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: jwt } });
    fireEvent.click(screen.getByText('Decode'));
    expect(screen.getByText(/Valid/i)).toBeInTheDocument();
  });

  test('clear resets everything', () => {
    renderPage();
    fireEvent.change(screen.getByRole('textbox'), { target: { value: VALID_JWT } });
    fireEvent.click(screen.getByText('Decode'));
    expect(screen.getByText('Header')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Clear'));
    expect(screen.getByRole('textbox').value).toBe('');
    expect(screen.queryByText('Header')).not.toBeInTheDocument();
  });

  test('shows signature not verified warning', () => {
    renderPage();
    fireEvent.change(screen.getByRole('textbox'), { target: { value: VALID_JWT } });
    fireEvent.click(screen.getByText('Decode'));
    expect(screen.getByText(/NOT cryptographically verified/i)).toBeInTheDocument();
  });
});
