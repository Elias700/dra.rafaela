/**
 * Gera as imagens otimizadas do site a partir dos originais em images-src/.
 *
 *   node scripts/optimize-images.mjs
 *
 * - Fotos: WebP em larguras responsivas -> public/images/<nome>-<largura>.webp
 *   (o loader do NgOptimizedImage em app.config.ts monta o srcset com esses nomes).
 * - Ícones: favicon.svg, favicon.ico, apple-touch-icon, ícones do manifest.
 * - og-image.jpg (1200×630) provisória.
 *
 * TODO(logo): quando o logo oficial chegar, troque o ícone provisório (MONOGRAM_SVG)
 * pelo arquivo do logo e rode o script de novo.
 */
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const ROOT = join(import.meta.dirname, '..');
const SRC = join(ROOT, 'images-src');
const OUT = join(ROOT, 'public');
const IMG_OUT = join(OUT, 'images');

/** Larguras geradas. Deve bater com IMAGE_CONFIG.breakpoints em app.config.ts. */
const WIDTHS = [320, 480, 640, 960];

/** TODO(foto): nomes dos arquivos .jpeg em images-src/ (ex.: 'foto-hero', 'foto-sobre'). */
const PHOTOS = [];

const DEEP = '#123f3d';
const GOLD = '#d9b97a';
const BG = '#fbf8f3';

const MONOGRAM_SVG = (size, rounded = true) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}">
  <rect width="64" height="64" rx="${rounded ? 14 : 0}" fill="${DEEP}"/>
  <g transform="translate(14 13) scale(1.5)" fill="none" stroke="${BG}" stroke-width="1.5" stroke-linejoin="round">
    <path d="M7.2 3.2c-2.3 0-4 1.9-4 4.4 0 2.2.8 3.9 1.5 5.8.6 1.7.8 3.6 1.2 5.5.3 1.4.8 2.1 1.6 2.1 1 0 1.3-1 1.6-2.4.4-1.8.8-3.5 2.9-3.5s2.5 1.7 2.9 3.5c.3 1.4.6 2.4 1.6 2.4.8 0 1.3-.7 1.6-2.1.4-1.9.6-3.8 1.2-5.5.7-1.9 1.5-3.6 1.5-5.8 0-2.5-1.7-4.4-4-4.4-1.8 0-2.8 1-4.8 1s-3-1-4.8-1z"/>
  </g>
</svg>`;

async function photos() {
  await mkdir(IMG_OUT, { recursive: true });
  for (const name of PHOTOS) {
    const input = join(SRC, `${name}.jpeg`);
    const meta = await sharp(input).metadata();
    console.log(`${name}: ${meta.width}×${meta.height}`);
    for (const w of WIDTHS) {
      await sharp(input)
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: 78, effort: 6 })
        .toFile(join(IMG_OUT, `${name}-${w}.webp`));
    }
  }
}

/** ICO com um único PNG embutido (formato aceito por todos os navegadores atuais). */
function pngToIco(png, size) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  const entry = Buffer.alloc(16);
  entry.writeUInt8(size >= 256 ? 0 : size, 0);
  entry.writeUInt8(size >= 256 ? 0 : size, 1);
  entry.writeUInt8(0, 2);
  entry.writeUInt8(0, 3);
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(png.length, 8);
  entry.writeUInt32LE(22, 12);
  return Buffer.concat([header, entry, png]);
}

async function icons() {
  await writeFile(join(OUT, 'favicon.svg'), MONOGRAM_SVG(64).trim());
  const png = (size, rounded = true) =>
    sharp(Buffer.from(MONOGRAM_SVG(size, rounded)))
      .png()
      .toBuffer();
  await writeFile(join(OUT, 'favicon.ico'), pngToIco(await png(48), 48));
  await writeFile(join(OUT, 'apple-touch-icon.png'), await png(180, false));
  await writeFile(join(OUT, 'icon-192.png'), await png(192));
  await writeFile(join(OUT, 'icon-512.png'), await png(512));
  await writeFile(join(OUT, 'icon-maskable-512.png'), await png(512, false));
}

async function ogImage() {
  // TODO(og): trocar por arte com nome, foto e cidade da clínica quando houver.
  const svg = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="${BG}"/>
  <circle cx="1010" cy="140" r="260" fill="#e3efec"/>
  <text x="80" y="210" font-family="Georgia, serif" font-size="30" fill="${DEEP}" letter-spacing="4">ODONTOLOGIA</text>
  <text x="80" y="300" font-family="Georgia, serif" font-size="64" fill="${DEEP}">Cuidar do seu sorriso</text>
  <text x="80" y="380" font-family="Georgia, serif" font-size="64" fill="${DEEP}">começa com escuta.</text>
  <path d="M80 420 Q200 445 320 420" stroke="${GOLD}" stroke-width="3" fill="none"/>
  <text x="80" y="500" font-family="Arial, sans-serif" font-size="28" fill="#4f5e5c">Atendimento humanizado · Implantes dentários</text>
</svg>`);
  await sharp(svg).jpeg({ quality: 82, mozjpeg: true }).toFile(join(OUT, 'og-image.jpg'));
}

await photos();
await icons();
await ogImage();
console.log('Imagens geradas em public/.');
