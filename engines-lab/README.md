# Engines lab

A holding area for verified engine fixes that are **not applied to the live app**
(`www/index.html`'s own functions are untouched by anything in here). Per Cristian
(2026-09-27): these came out of two real PRs against this repo (#8, #4) that fixed
genuine bugs, but neither is going into the public app as it stands — they're kept
here, together, as a starting point for a future separate composite calculator /
engine-and-test sandbox, and may get split out into their own repo/archive later.

Nothing here is wired into `www/index.html`. The live app's `heliocentricEcliptic()`,
`commodityBacktestScore()`, `venusOnlyBacktestScore()` and `maleficOnlyBacktestScore()`
are exactly as they were before these PRs — chart output for real users is unaffected.

- `precession-fix/` — from PR #8. Corrects a J2000-vs-of-date frame mismatch in the
  outer-planet position math (Mars/Venus were off by up to ~2.3°, sometimes landing
  in the wrong sign). Verified independently against Swiss Ephemeris in the
  personal build (`PL0-Personal/PERSONAL-APP.md`).
- `venus-clause-fix/` — from PR #4. Fixes a structural bug in the Gold Venus
  commodity-backtest signal that made it mathematically incapable of ever
  reading bearish (0 exceptions across ~5,000 backtested days).
