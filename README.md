# Muhūrta Gauge — Sarvato Bhadra Chakra Analyzer

A Vedic muhūrta (auspicious-timing) analyzer. Point it at a moment and a reference person's birth star, and it scores how auspicious that moment is — then goes well beyond a single number:

- **Sarvato Bhadra Chakra scoring** — Vedha, Tārā Bala, Latta, Upagraha, planetary dignity/retrograde strength, and a Pañcha Pakshi blend, all folded into one verdict with the reasoning shown, not just a score
- **Pañchāṅga** — Tithi, Vāra, Nakṣatra, Yoga, Karaṇa, plus a general muhūrta-dosha checklist (Riktha Tithi, bad Karaṇa, Vyatīpāta/Vaidhṛti Yoga)
- **Pañcha Pakshi** — live 24-hour bird-state chart and "best time to ask" horary finder
- **Auspicious Calendar** — a month view split into day/night halves, each independently scored
- **Antara Chakra** — a live, 41-zone portent compass (Bṛhat Saṁhitā) that rotates with your phone's actual compass heading, with an interactive animal/direction cross-reference
- **Nakṣatra Categories** and a **remedy mini-box** (standard Navagraha upāya) when a reading turns up something negative

Every rule is transcribed from a named classical source (cited inline in the app, chapter and verse where possible) or explicitly flagged as this app's own synthesis when it bridges two source systems — see the methodology notes at the bottom of each page.

## Use it now

**Live:** https://claude.ai/code/artifact/35b5b1b9-d2a6-423c-bd82-649b053ea57b (private artifact — this link is for you, not for sharing)

The app is also a single self-contained HTML file with no build step and no server — you can just open [`www/index.html`](www/index.html) directly in any browser.

## Android

**Download:** grab the latest APK from [Releases](../../releases/latest) and install it directly (you'll need to allow "install from unknown sources" once, since this isn't distributed through the Play Store).

**Build it yourself:**
```bash
npm install
npx cap sync android
cd android
./gradlew assembleDebug
```
The APK lands at `android/app/build/outputs/apk/debug/app-debug.apk`. Requires a JDK and the Android SDK (`ANDROID_HOME` set, platform 36 + build-tools installed).

## iPhone / iOS

There's no downloadable iOS app here, and that's a real platform limit, not an oversight: Apple only allows building and signing iOS apps through Xcode, which only runs on macOS. This project has been developed on Windows.

The practical alternative — and it works well since the app is already a proper PWA — is:

1. Open the app in Safari on your iPhone
2. Tap the Share button → **Add to Home Screen**

That gives you a real home-screen icon and a full-screen, app-like experience (manifest, icons, and offline service worker are already set up for this), without needing App Store signing at all.

If you ever want a genuine `.ipa`, that requires either a Mac (locally or via a cloud CI like GitHub Actions' macOS runners) and an Apple Developer account for code signing — a separate undertaking from anything in this repo today.

## Project layout

- `www/` — the app itself (single HTML file + PWA manifest/service worker/icons). This is the source of truth.
- `android/` — Capacitor-wrapped Android project. `android/app/src/main/assets/public` is regenerated from `www/` by `npx cap sync` — it's not committed.
- `capacitor.config.json` / `package.json` — Capacitor + build config.

## License / status

Private project, not currently licensed for reuse.
