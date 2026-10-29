import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const ICONS_DIR = path.resolve('public/icons');
if (!fs.existsSync(ICONS_DIR)) {
  fs.mkdirSync(ICONS_DIR, { recursive: true });
}

// SVG template for normal app icon (full bleed)
const normalSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f43f5e"/>
      <stop offset="50%" stop-color="#e11d48"/>
      <stop offset="100%" stop-color="#9f1239"/>
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="50%" stop-color="#facc15"/>
      <stop offset="100%" stop-color="#ca8a04"/>
    </linearGradient>
    <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#fecdd3"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.35"/>
    </filter>
  </defs>

  <!-- Background rounded squircle -->
  <rect width="512" height="512" rx="128" fill="url(#bgGrad)"/>
  
  <!-- Subtle decorative inner glow -->
  <rect x="16" y="16" width="480" height="480" rx="112" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="4"/>

  <!-- Golden Marriage Rings / Interlocking Hearts Emblem -->
  <g filter="url(#shadow)" transform="translate(256, 230)">
    <!-- Left Ring -->
    <circle cx="-55" cy="0" r="82" fill="none" stroke="url(#goldGrad)" stroke-width="26"/>
    <!-- Right Ring -->
    <circle cx="55" cy="0" r="82" fill="none" stroke="url(#goldGrad)" stroke-width="26"/>

    <!-- Central Sparkling Diamond -->
    <path d="M 0 -70 L 22 -35 L 0 0 L -22 -35 Z" fill="#ffffff" filter="url(#shadow)"/>
    <!-- Sparkle Stars -->
    <path d="M 120 -80 Q 120 -60 140 -60 Q 120 -60 120 -40 Q 120 -60 100 -60 Q 120 -60 120 -80 Z" fill="url(#goldGrad)"/>
    <path d="M -130 60 Q -130 75 -115 75 Q -130 75 -130 90 Q -130 75 -145 75 Q -130 75 -130 60 Z" fill="#ffffff"/>
  </g>

  <!-- Brand Typography -->
  <text x="256" y="420" font-family="'Playfair Display', Georgia, serif" font-size="62" font-weight="bold" fill="#ffffff" text-anchor="middle" letter-spacing="2">couple<tspan fill="#facc15">.com</tspan></text>
</svg>
`;

// SVG template for maskable icon (safe zone inside 410x410 / padding on 512)
const maskableSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f43f5e"/>
      <stop offset="50%" stop-color="#e11d48"/>
      <stop offset="100%" stop-color="#9f1239"/>
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="50%" stop-color="#facc15"/>
      <stop offset="100%" stop-color="#ca8a04"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#000000" flood-opacity="0.3"/>
    </filter>
  </defs>

  <!-- Full bleed background for maskable safe circle -->
  <rect width="512" height="512" fill="url(#bgGrad)"/>

  <!-- Content scaled inside 70% safe area -->
  <g transform="translate(51.2, 51.2) scale(0.8)">
    <g filter="url(#shadow)" transform="translate(256, 220)">
      <circle cx="-50" cy="0" r="76" fill="none" stroke="url(#goldGrad)" stroke-width="24"/>
      <circle cx="50" cy="0" r="76" fill="none" stroke="url(#goldGrad)" stroke-width="24"/>
      <path d="M 0 -64 L 20 -32 L 0 0 L -20 -32 Z" fill="#ffffff"/>
      <path d="M 110 -70 Q 110 -55 125 -55 Q 110 -55 110 -40 Q 110 -55 95 -55 Q 110 -55 110 -70 Z" fill="url(#goldGrad)"/>
    </g>
    <text x="256" y="410" font-family="'Playfair Display', Georgia, serif" font-size="64" font-weight="bold" fill="#ffffff" text-anchor="middle" letter-spacing="2">couple<tspan fill="#facc15">.com</tspan></text>
  </g>
</svg>
`;

async function generate() {
  console.log('Generating PWA and Play Store icons...');

  // Save SVG
  fs.writeFileSync(path.join(ICONS_DIR, 'icon.svg'), normalSvg);
  fs.writeFileSync(path.join(ICONS_DIR, 'favicon.svg'), normalSvg);

  const normalBuffer = Buffer.from(normalSvg);
  const maskableBuffer = Buffer.from(maskableSvg);

  // 192x192
  await sharp(normalBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(ICONS_DIR, 'icon-192.png'));

  // 512x512
  await sharp(normalBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(ICONS_DIR, 'icon-512.png'));

  // Maskable 192x192
  await sharp(maskableBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(ICONS_DIR, 'icon-maskable-192.png'));

  // Maskable 512x512
  await sharp(maskableBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(ICONS_DIR, 'icon-maskable-512.png'));

  // Apple touch icon (180x180)
  await sharp(normalBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(ICONS_DIR, 'apple-touch-icon.png'));

  // Favicon (32x32)
  await sharp(normalBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.join(ICONS_DIR, 'favicon-32.png'));

  console.log('Successfully generated all PWA & Play Store icons in public/icons/');
}

generate().catch((err) => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
