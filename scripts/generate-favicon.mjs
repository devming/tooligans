import sharp from 'sharp';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(__dirname, '..', 'public');

// "T" with purple accent on dark background
const svg = `
<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#12121c"/>
      <stop offset="100%" stop-color="#0a0a0f"/>
    </linearGradient>
    <radialGradient id="glow" cx="256" cy="256" r="220" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="rgba(108,92,231,0.2)"/>
      <stop offset="100%" stop-color="rgba(108,92,231,0)"/>
    </radialGradient>
  </defs>
  <rect width="512" height="512" rx="96" fill="url(#bg)"/>
  <rect width="512" height="512" rx="96" fill="url(#glow)"/>
  <text x="256" y="340" font-family="Arial, Helvetica, sans-serif" font-size="340" font-weight="800" text-anchor="middle" fill="#e8e8f0">T</text>
  <rect x="248" y="88" width="8" height="260" rx="4" fill="#6c5ce7" opacity="0.8"/>
</svg>`;

const svgBuf = Buffer.from(svg);

// Generate multiple sizes
await Promise.all([
  sharp(svgBuf).resize(16, 16).png().toFile(resolve(publicDir, 'favicon-16.png')),
  sharp(svgBuf).resize(32, 32).png().toFile(resolve(publicDir, 'favicon-32.png')),
  sharp(svgBuf).resize(192, 192).png().toFile(resolve(publicDir, 'logo192.png')),
  sharp(svgBuf).resize(512, 512).png().toFile(resolve(publicDir, 'logo512.png')),
  // ICO from 32x32 PNG
  sharp(svgBuf).resize(32, 32).png().toFile(resolve(publicDir, 'favicon.ico')),
]);

console.log('✓ Generated favicon-16.png, favicon-32.png, favicon.ico, logo192.png, logo512.png');
