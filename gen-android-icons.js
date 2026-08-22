const { PNG } = require("pngjs");
const fs = require("fs");
const path = require("path");

const RES = path.join(__dirname, "android", "app", "src", "main", "res");
const NIGHT = [0x19, 0x16, 0x32];
const GOLD = [0xd1, 0xa9, 0x4e];
const VERMILION = [0xc1, 0x44, 0x2e];

function setPx(png, x, y, [r, g, b], a = 255) {
  if (x < 0 || y < 0 || x >= png.width || y >= png.height) return;
  const idx = (png.width * y + x) << 2;
  png.data[idx] = r; png.data[idx + 1] = g; png.data[idx + 2] = b; png.data[idx + 3] = a;
}
function fillRect(png, x0, y0, x1, y1, color, a = 255) {
  for (let y = Math.max(0, y0); y < Math.min(png.height, y1); y++)
    for (let x = Math.max(0, x0); x < Math.min(png.width, x1); x++) setPx(png, x, y, color, a);
}
function strokeRect(png, x0, y0, x1, y1, w, color) {
  fillRect(png, x0, y0, x1, y0 + w, color);
  fillRect(png, x0, y1 - w, x1, y1, color);
  fillRect(png, x0, y0, x0 + w, y1, color);
  fillRect(png, x1 - w, y0, x1, y1, color);
}
function drawGlyph(size, { withBackground, padFrac }) {
  const png = new PNG({ width: size, height: size });
  if (withBackground) fillRect(png, 0, 0, size, size, NIGHT);
  const pad = Math.round(size * padFrac);
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
  for (let y = ccy - bindR; y <= ccy + bindR; y++)
    for (let x = ccx - bindR; x <= ccx + bindR; x++)
      if ((x - ccx) ** 2 + (y - ccy) ** 2 <= bindR * bindR) setPx(png, x, y, VERMILION);
  return png;
}
function write(png, p) { fs.mkdirSync(path.dirname(p), { recursive: true }); png.pack().pipe(fs.createWriteStream(p)); }

// Legacy launcher icons (pre-API26): solid background, standard padding.
const LEGACY = { mdpi: 48, hdpi: 72, xhdpi: 96, xxhdpi: 144, xxxhdpi: 192 };
for (const [dpi, size] of Object.entries(LEGACY)) {
  const png = drawGlyph(size, { withBackground: true, padFrac: 0.14 });
  write(png, path.join(RES, `mipmap-${dpi}`, "ic_launcher.png"));
  write(drawGlyph(size, { withBackground: true, padFrac: 0.14 }), path.join(RES, `mipmap-${dpi}`, "ic_launcher_round.png"));
}

// Adaptive icon foreground layer (API26+): transparent bg, generous padding
// so the glyph survives circle/squircle/rounded-square masking.
const FOREGROUND = { mdpi: 108, hdpi: 162, xhdpi: 216, xxhdpi: 324, xxxhdpi: 432 };
for (const [dpi, size] of Object.entries(FOREGROUND)) {
  const png = drawGlyph(size, { withBackground: false, padFrac: 0.32 });
  write(png, path.join(RES, `mipmap-${dpi}`, "ic_launcher_foreground.png"));
}

console.log("android launcher icons written");
