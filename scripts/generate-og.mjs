import sharp from 'sharp';
import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const svg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0a0a0f"/>
      <stop offset="50%" stop-color="#12121c"/>
      <stop offset="100%" stop-color="#0a0a0f"/>
    </linearGradient>
    <radialGradient id="glow" cx="600" cy="240" r="300" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="rgba(108,92,231,0.18)"/>
      <stop offset="100%" stop-color="rgba(108,92,231,0)"/>
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- Grid pattern -->
  <g stroke="rgba(108,92,231,0.06)" stroke-width="1">
    ${Array.from({length: 31}, (_, i) => `<line x1="${i*40}" y1="0" x2="${i*40}" y2="630"/>`).join('\n    ')}
    ${Array.from({length: 16}, (_, i) => `<line x1="0" y1="${i*40}" x2="1200" y2="${i*40}"/>`).join('\n    ')}
  </g>

  <!-- Glow -->
  <rect width="1200" height="630" fill="url(#glow)"/>

  <!-- Logo -->
  <text x="490" y="228" font-family="Arial, Helvetica, sans-serif" font-size="82" font-weight="700" fill="#e8e8f0">Tool</text>
  <text x="700" y="228" font-family="Arial, Helvetica, sans-serif" font-size="82" font-weight="700" fill="#6c5ce7">igans</text>

  <!-- Tagline -->
  <text x="600" y="305" font-family="Arial, Helvetica, sans-serif" font-size="26" fill="#8888aa" text-anchor="middle">Developer utilities, all in one place</text>

  <!-- Tool cards -->
  ${[
    { x: 240, icon: '{ }', label: 'JSON' },
    { x: 400, icon: '64', label: 'Base64' },
    { x: 560, icon: '%', label: 'URL' },
    { x: 720, icon: '🔑', label: 'JWT' },
    { x: 880, icon: '⏱', label: 'Time' },
  ].map(t => `
  <g>
    <rect x="${t.x - 55}" y="${t.y || 370}" width="110" height="100" rx="12" fill="#1a1a2e" stroke="rgba(108,92,231,0.3)" stroke-width="1"/>
    <text x="${t.x}" y="${t.y ? t.y + 40 : 410}" font-family="Arial, monospace" font-size="28" font-weight="600" fill="#a29bfe" text-anchor="middle">${t.icon}</text>
    <text x="${t.x}" y="${t.y ? t.y + 75 : 450}" font-family="Arial, sans-serif" font-size="16" font-weight="500" fill="#8888aa" text-anchor="middle">${t.label}</text>
  </g>`).join('')}

  <!-- Bottom accent bar -->
  <rect x="0" y="626" width="1200" height="4" fill="#6c5ce7"/>

  <!-- Footer text -->
  <text x="600" y="610" font-family="monospace" font-size="16" fill="rgba(108,92,231,0.6)" text-anchor="middle">tooligans.vercel.app</text>
</svg>`;

const outPath = resolve(__dirname, '..', 'public', 'og-image.png');
await sharp(Buffer.from(svg)).png().toFile(outPath);
console.log(`✓ Generated ${outPath}`);
