import { Buffer } from 'node:buffer';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { deflateSync } from 'node:zlib';

const WIDTH = 1200;
const HEIGHT = 627;
const DIST = path.resolve(process.cwd(), 'dist');
const EDITORIAL = path.join(DIST, 'editorial');
const OG_DIR = path.join(EDITORIAL, 'og');

const COLORS = {
  bg: '#08090d',
  surface: '#0d0f15',
  grid: '#171b24',
  text: '#f3f5f7',
  muted: '#838a99',
  blue: '#00d9ff',
  purple: '#a855f7',
  green: '#00ff88',
};

const FONT = {
  ' ': ['00000','00000','00000','00000','00000','00000','00000'],
  A: ['01110','10001','10001','11111','10001','10001','10001'],
  B: ['11110','10001','10001','11110','10001','10001','11110'],
  C: ['01111','10000','10000','10000','10000','10000','01111'],
  D: ['11110','10001','10001','10001','10001','10001','11110'],
  E: ['11111','10000','10000','11110','10000','10000','11111'],
  F: ['11111','10000','10000','11110','10000','10000','10000'],
  G: ['01111','10000','10000','10111','10001','10001','01111'],
  H: ['10001','10001','10001','11111','10001','10001','10001'],
  I: ['11111','00100','00100','00100','00100','00100','11111'],
  J: ['00111','00010','00010','00010','10010','10010','01100'],
  K: ['10001','10010','10100','11000','10100','10010','10001'],
  L: ['10000','10000','10000','10000','10000','10000','11111'],
  M: ['10001','11011','10101','10101','10001','10001','10001'],
  N: ['10001','11001','10101','10011','10001','10001','10001'],
  O: ['01110','10001','10001','10001','10001','10001','01110'],
  P: ['11110','10001','10001','11110','10000','10000','10000'],
  Q: ['01110','10001','10001','10001','10101','10010','01101'],
  R: ['11110','10001','10001','11110','10100','10010','10001'],
  S: ['01111','10000','10000','01110','00001','00001','11110'],
  T: ['11111','00100','00100','00100','00100','00100','00100'],
  U: ['10001','10001','10001','10001','10001','10001','01110'],
  V: ['10001','10001','10001','10001','10001','01010','00100'],
  W: ['10001','10001','10001','10101','10101','10101','01010'],
  X: ['10001','10001','01010','00100','01010','10001','10001'],
  Y: ['10001','10001','01010','00100','00100','00100','00100'],
  Z: ['11111','00001','00010','00100','01000','10000','11111'],
  '0': ['01110','10001','10011','10101','11001','10001','01110'],
  '1': ['00100','01100','00100','00100','00100','00100','01110'],
  '2': ['01110','10001','00001','00010','00100','01000','11111'],
  '3': ['11110','00001','00001','01110','00001','00001','11110'],
  '4': ['00010','00110','01010','10010','11111','00010','00010'],
  '5': ['11111','10000','10000','11110','00001','00001','11110'],
  '6': ['01110','10000','10000','11110','10001','10001','01110'],
  '7': ['11111','00001','00010','00100','01000','01000','01000'],
  '8': ['01110','10001','10001','01110','10001','10001','01110'],
  '9': ['01110','10001','10001','01111','00001','00001','01110'],
  '?': ['01110','10001','00001','00010','00100','00000','00100'],
  '!': ['00100','00100','00100','00100','00100','00000','00100'],
  '.': ['00000','00000','00000','00000','00000','00110','00110'],
  ',': ['00000','00000','00000','00000','00110','00100','01000'],
  ':': ['00000','00110','00110','00000','00110','00110','00000'],
  '-': ['00000','00000','00000','11111','00000','00000','00000'],
  '/': ['00001','00010','00100','01000','10000','00000','00000'],
  '+': ['00000','00100','00100','11111','00100','00100','00000'],
  '&': ['01100','10010','10100','01000','10101','10010','01101'],
  '(': ['00010','00100','01000','01000','01000','00100','00010'],
  ')': ['01000','00100','00010','00010','00010','00100','01000'],
};

const CRC_TABLE = Array.from({ length: 256 }, (_, value) => {
  let crc = value;
  for (let bit = 0; bit < 8; bit += 1) crc = (crc & 1) ? (0xedb88320 ^ (crc >>> 1)) : (crc >>> 1);
  return crc >>> 0;
});

function rgb(hex) {
  const value = Number.parseInt(hex.slice(1), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuffer = Buffer.from(type, 'ascii');
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 0);
  return Buffer.concat([length, typeBuffer, data, crc]);
}

function makeCanvas() {
  const pixels = Buffer.alloc(WIDTH * HEIGHT * 3);
  const [r, g, b] = rgb(COLORS.bg);
  for (let i = 0; i < pixels.length; i += 3) {
    pixels[i] = r;
    pixels[i + 1] = g;
    pixels[i + 2] = b;
  }
  return pixels;
}

function rect(pixels, x, y, width, height, color) {
  const [r, g, b] = rgb(color);
  const x0 = Math.max(0, Math.floor(x));
  const y0 = Math.max(0, Math.floor(y));
  const x1 = Math.min(WIDTH, Math.ceil(x + width));
  const y1 = Math.min(HEIGHT, Math.ceil(y + height));
  for (let py = y0; py < y1; py += 1) {
    for (let px = x0; px < x1; px += 1) {
      const offset = (py * WIDTH + px) * 3;
      pixels[offset] = r;
      pixels[offset + 1] = g;
      pixels[offset + 2] = b;
    }
  }
}

function normalizeText(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[—–]/g, '-')
    .replace(/[“”]/g, '"')
    .replace(/[’']/g, '')
    .toUpperCase();
}

function drawText(pixels, text, x, y, scale, color) {
  let cursor = x;
  for (const char of normalizeText(text)) {
    const glyph = FONT[char] ?? FONT['?'];
    for (let row = 0; row < glyph.length; row += 1) {
      for (let col = 0; col < glyph[row].length; col += 1) {
        if (glyph[row][col] === '1') rect(pixels, cursor + col * scale, y + row * scale, scale, scale, color);
      }
    }
    cursor += scale * 6;
  }
}

function wrap(text, maxChars) {
  const words = normalizeText(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let line = '';
  for (const word of words) {
    if (!line) {
      line = word;
      continue;
    }
    if (`${line} ${word}`.length <= maxChars) line = `${line} ${word}`;
    else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function drawGrid(pixels) {
  for (let x = 0; x < WIDTH; x += 48) rect(pixels, x, 0, 1, HEIGHT, COLORS.grid);
  for (let y = 0; y < HEIGHT; y += 48) rect(pixels, 0, y, WIDTH, 1, COLORS.grid);
  rect(pixels, 0, 0, WIDTH, 6, COLORS.blue);
  rect(pixels, 72, 70, 42, 42, COLORS.surface);
  rect(pixels, 72, 70, 42, 2, COLORS.blue);
  rect(pixels, 72, 110, 42, 2, COLORS.blue);
  rect(pixels, 72, 70, 2, 42, COLORS.blue);
  rect(pixels, 112, 70, 2, 42, COLORS.blue);
  drawText(pixels, 'RM', 80, 82, 3, COLORS.blue);
}

function titleScale(title) {
  const length = normalizeText(title).length;
  if (length <= 26) return 6;
  if (length <= 48) return 5;
  return 4;
}

function drawCard({ label, title, meta, accent = COLORS.purple }) {
  const pixels = makeCanvas();
  drawGrid(pixels);

  drawText(pixels, label, 144, 82, 3, accent);
  drawText(pixels, 'OG / 1200X627', 906, 82, 2, COLORS.muted);

  rect(pixels, 72, 170, 4, 236, accent);
  const scale = titleScale(title);
  const maxChars = Math.max(24, Math.floor(930 / (scale * 6)));
  const lines = wrap(title, maxChars).slice(0, 3);
  const lineHeight = scale * 11;
  let y = 188;
  for (const line of lines) {
    drawText(pixels, line, 104, y, scale, COLORS.text);
    y += lineHeight;
  }

  drawText(pixels, 'RENAN MELO / EDITORIAL', 104, 420, 2, COLORS.muted);
  rect(pixels, 72, 506, 1056, 1, COLORS.grid);
  drawText(pixels, meta, 72, 542, 2, COLORS.muted);
  drawText(pixels, 'RENAN.SNELABS.SPACE', 858, 542, 2, COLORS.blue);
  return pixels;
}

function encodePng(pixels) {
  const scanline = WIDTH * 3 + 1;
  const raw = Buffer.alloc(scanline * HEIGHT);
  for (let y = 0; y < HEIGHT; y += 1) {
    const rowStart = y * scanline;
    raw[rowStart] = 0;
    pixels.copy(raw, rowStart + 1, y * WIDTH * 3, (y + 1) * WIDTH * 3);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(WIDTH, 0);
  ihdr.writeUInt32BE(HEIGHT, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

function decodeHtml(value) {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number.parseInt(code, 10)))
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function getMeta(html, key) {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = html.match(new RegExp(`<meta\\s+(?:property|name)=["']${escaped}["']\\s+content=["']([^"']*)["']`, 'i'));
  return match ? decodeHtml(match[1]) : null;
}

function getAllMeta(html, key) {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return [...html.matchAll(new RegExp(`<meta\\s+(?:property|name)=["']${escaped}["']\\s+content=["']([^"']*)["']`, 'gi'))]
    .map((match) => decodeHtml(match[1]));
}

function writeCard(filePath, card) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const png = encodePng(card);
  fs.writeFileSync(filePath, png);
  const digest = createHash('sha256').update(png).digest('hex');
  process.stdout.write(`social_image=${path.relative(DIST, filePath)} sha256:${digest} bytes:${png.length}\n`);
}

if (!fs.existsSync(path.join(DIST, 'index.html')) || !fs.existsSync(path.join(EDITORIAL, 'index.html'))) {
  throw new Error('Composed dist must exist before generating social images.');
}

writeCard(
  path.join(DIST, 'og.png'),
  drawCard({
    label: 'RENAN MELO / PORTFOLIO',
    title: 'SOFTWARE, PRODUCT & COMPUTING',
    meta: 'SYSTEMS / AI / INFRASTRUCTURE / EXPERIMENTAL COMPUTING',
    accent: COLORS.blue,
  }),
);

writeCard(
  path.join(OG_DIR, 'editorial.png'),
  drawCard({
    label: 'RENAN MELO / EDITORIAL',
    title: 'IDEIAS QUE APARECEM ENQUANTO CONSTRUO.',
    meta: 'TECNOLOGIA / COMPUTACAO / SOFTWARE / HARDWARE',
    accent: COLORS.purple,
  }),
);

for (const entry of fs.readdirSync(EDITORIAL, { withFileTypes: true })) {
  if (!entry.isDirectory() || entry.name === 'og' || entry.name.startsWith('_')) continue;
  const htmlPath = path.join(EDITORIAL, entry.name, 'index.html');
  if (!fs.existsSync(htmlPath)) continue;

  const html = fs.readFileSync(htmlPath, 'utf8');
  if (getMeta(html, 'og:type') !== 'article') continue;

  const rawTitle = getMeta(html, 'og:title');
  if (!rawTitle) throw new Error(`Missing og:title for editorial/${entry.name}`);
  const title = rawTitle.replace(/\s+[—-]\s+Renan Melo$/i, '');
  const publishedAt = getMeta(html, 'article:published_time')?.slice(0, 10) ?? 'EDITORIAL';
  const tags = getAllMeta(html, 'article:tag').slice(0, 3);
  const meta = [publishedAt, ...tags].join(' / ');

  writeCard(
    path.join(OG_DIR, `${entry.name}.png`),
    drawCard({
      label: 'ESSAY / RENAN MELO / EDITORIAL',
      title,
      meta,
      accent: COLORS.purple,
    }),
  );
}
