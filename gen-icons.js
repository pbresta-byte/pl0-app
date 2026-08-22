// Pure-JS icon generator (no native deps) — draws a simple "Sarvato Bhadra"
// grid glyph (outer square + cross grid + center bindu) onto a solid ground.
const { PNG } = require("pngjs");
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "www", "icons");
fs.mkdirSync(OUT, { recursive: true });

const NIGHT = [0x19, 0x16, 0x32]; // deep indigo panel color, matches app's night theme
const GOLD = [0xd1, 0xa9, 0x4e];
const VERMILION = [0xc1, 0x44, 0x2e];

function setPx(png, x, y, [r, g, b], a = 255) {
  if (x < 0 || y < 0 || x >= png.width || y >= png.height) return;
  const idx = (png.width * y + x) << 2;
  png.data[idx] = r;
  png.data[idx + 1] = g;
  png.data[idx + 2] = b;
  png.data[idx + 3] = a;
}

function fillRect(png, x0, y0, x1, y1, color, a = 255) {
  for (let y = Math.max(0, y0); y < Math.min(png.height, y1); y++) {
    for (let x = Math.max(0, x0); x < Math.min(png.width, x1); x++) {
      setPx(png, x, y, color, a);
    }
  }
}

function strokeRect(png, x0, y0, x1, y1, w, color) {
  fillRect(png, x0, y0, x1, y0 + w, color);
  fillRect(png, x0, y1 - w, x1, y1, color);
  fillRect(png, x0, y0, x0 + w, y1, color);
  fillRect(png, x1 - w, y0, x1, y1, color);
}

function drawGlyph(size, { fullBleed }) {
  const png = new PNG({ width: size, height: size });
  fillRect(png, 0, 0, size, size, NIGHT); // solid background, no transparency

  const pad = fullBleed ? Math.round(size * 0.24) : Math.round(size * 0.14);
  const x0 = pad, y0 = pad, x1 = size - pad, y1 = size - pad;
  const w = Math.max(2, Math.round(size * 0.022));

  strokeRect(png, x0, y0, x1, y1, w, GOLD);

  const third = (x1 - x0) / 3;
  for (let i = 1; i <= 2; i++) {
    const gx = Math.round(x0 + third * i);
    fillRect(png, gx - Math.ceil(w / 2), y0, gx + Math.ceil(w / 2), y1, GOLD);
    const gy = Math.round(y0 + third * i);
    fillRect(png, x0, gy - Math.ceil(w / 2), x1, gy + Math.ceil(w / 2), GOLD);
  }

  const cx0 = Math.round(x0 + third), cx1 = Math.round(x0 + third * 2);
  const cy0 = Math.round(y0 + third), cy1 = Math.round(y0 + third * 2);
  const bindR = Math.round((cx1 - cx0) * 0.24);
  const ccx = Math.round((cx0 + cx1) / 2), ccy = Math.round((cy0 + cy1) / 2);
  for (let y = ccy - bindR; y <= ccy + bindR; y++) {
    for (let x = ccx - bindR; x <= ccx + bindR; x++) {
      if ((x - ccx) ** 2 + (y - ccy) ** 2 <= bindR * bindR) setPx(png, x, y, VERMILION);
    }
  }
  return png;
}

const SIZES = [16, 32, 72, 96, 128, 144, 152, 180, 192, 384, 512];
for (const s of SIZES) {
  const png = drawGlyph(s, { fullBleed: false });
  png.pack().pipe(fs.createWriteStream(path.join(OUT, `icon-${s}.png`)));
}
for (const s of [192, 512]) {
  const png = drawGlyph(s, { fullBleed: true });
  png.pack().pipe(fs.createWriteStream(path.join(OUT, `icon-maskable-${s}.png`)));
}
console.log("icons written to", OUT);
