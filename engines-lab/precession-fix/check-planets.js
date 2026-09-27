// check-planets.js: regression check for the planet longitudes in www/index.html against reference values
// NOTE: this checks the LIVE www/index.html as it stands (unfixed) -- expected to show the known drift, not pass. Kept as the exact regression test PR #8 used.
// (Swiss Ephemeris, Lahiri sidereal, UT). Extracts the engine block like synchk_inline.js extracts scripts; no browser needed.
// Run: node check-planets.js   (exit code 1 on failure)
// Tolerances (degrees): Sun/Moon 0.05, Mercury/Venus/Mars 0.15, Jupiter 0.5, Saturn 0.8 (JPL Table 1 limit; see comment in heliocentricEcliptic).
const fs = require('fs'), path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', '..', 'www', 'index.html'), 'utf8').split('\n');
const a = html.findIndex(l => l.startsWith('const DEG = Math.PI/180'));
let b = html.findIndex(l => l.startsWith('function computeOuterPositions')); while (!/^}\s*$/.test(html[b])) b++;
const gl = html.find(l => /const GRAHA_LIST\s*=/.test(l));
const eng = new Function([gl, ...html.slice(a, b + 1)].join('\n') + '\nreturn {computePositions, julianDay};')();
const NAMES = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'], TOL = [0.05, 0.05, 0.15, 0.15, 0.15, 0.5, 0.8];
// [year, month, day, hourUT, Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn] sidereal longitudes (Swiss Ephemeris, Lahiri)
const REF = [[1935, 3, 14, 6, 329.78, 84.766, 302.233, 357.038, 180.273, 210.314, 310.369], [1948, 11, 2, 18, 197.091, 216.761, 178.589, 158.618, 228.824, 244.35, 131.324], [1962, 7, 23, 3, 96.459, 352.509, 88.943, 138.268, 46.41, 318.67, 285.376], [1975, 1, 9, 12, 265.085, 231.98, 277.444, 280.528, 237.564, 321.297, 81.66], [1984, 9, 30, 21, 164.229, 241.706, 156.456, 192.731, 243.366, 251.052, 200.691], [1991, 5, 5, 0, 20.273, 267.937, 355.956, 61.685, 83.853, 101.701, 282.981], [2000, 1, 1, 12, 256.516, 199.471, 248.036, 217.713, 304.11, 1.4, 16.542], [2007, 8, 17, 15, 120.374, 173.542, 122.251, 121.21, 42.659, 226.135, 124.009], [2013, 12, 25, 9, 249.671, 157.363, 247.446, 274.68, 164.568, 82.936, 205.68], [2019, 4, 4, 4, 349.981, 336.416, 323.871, 315.93, 38.464, 240.162, 265.854], [2024, 6, 30, 23, 75.423, 12.206, 93.031, 82.626, 21.733, 44.009, 325.229], [2026, 9, 26, 12, 159.19, 336.674, 180.286, 193.398, 94.813, 114.539, 347.696]];
let bad = 0;
for (const r of REF) {
  const p = eng.computePositions(eng.julianDay(r[0], r[1], r[2], r[3], 0, 0, 0), 0, 0, 'lahiri');
  NAMES.forEach((n, i) => {
    const d = Math.abs(((p[n].sidereal - r[4 + i] + 540) % 360) - 180);
    if (d > TOL[i]) { bad++; console.log('FAIL', r.slice(0, 4).join('-'), n, d.toFixed(2), 'deg (tolerance', TOL[i] + ')'); }
  });
}
console.log(bad ? bad + ' planet longitude check(s) failed' : 'checked ' + REF.length + ' moments x 7 bodies; all within tolerance');
process.exit(bad ? 1 : 0);
