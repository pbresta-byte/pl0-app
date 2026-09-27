# Precession fix (source: PR #8, closed — landed here instead)

`heliocentricEcliptic()` in `www/index.html` builds a planet's heliocentric vector
from J2000 orbital elements, then combines it with `earthHeliocentric()`, which is
built from `sunLongitude(T)` -- an of-date (not J2000) quantity. The two vectors
don't share a frame, so the geocentric direction comes out rotated by however much
precession has accumulated since J2000: up to ~2.3° for Mars, ~1.9° for Venus,
~1.4° for Saturn across 1930-2030 (measured against Swiss Ephemeris), occasionally
enough to land a planet in the wrong sign (7 of 300 test moments for Saturn).

## The fix
Rotate the planet's heliocentric x/y by the accumulated general precession in
longitude since J2000 before combining with the of-date Earth vector:

```js
// pA = general precession in longitude since J2000 (IAU 1976 rate)
const pA = (1.396971278*T + 0.000308650*T*T)*DEG;
const xd = x*Math.cos(pA) - y*Math.sin(pA), yd = x*Math.sin(pA) + y*Math.cos(pA);
```

`check-planets.js` here is the regression check from the PR: 12 moments (1930-2030)
x 7 bodies against Swiss Ephemeris Lahiri-sidereal reference values, run with
`node check-planets.js`. NOT applied to `www/index.html` -- copy the one-line
rotation into `heliocentricEcliptic()` there (right after the `{x,y,z,r}` it
currently returns) if this ever gets activated for real.
