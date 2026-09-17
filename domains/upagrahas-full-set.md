# Upagrahas — Full Classical Set

Research file for shadow-graha (Upagraha) implementation in PL0.
Each point marked TRANSCRIBED-VERIFIED (exact quote located in primary source)
or UNVERIFIED (no reliable source found).

---

## 1. Kala Upagrahas (5) — Day/Night 8-Portion Method

### Primary Source: Brihat Parasara Hora Sastra (BPHS), ch. 4

The 5 Kala Velas are portions of the day/night divided into 8 equal parts,
assigned to weekday lords in sequence. The 8th portion is lordless. Only 5
planetary portions are considered (Moon and Venus ignored).

**BPHS (Parasara), ch. 4, as translated by Santhanam:**

> "Divide the day duration (of any week day) into eight equal parts. The eighth portion is lordless. The seven portions are distributed to the seven planets commencing from the lord of the week day. Whichever portion is ruled by Saturn will be the portion of Gulika. Similarly make the night duration into eight equal parts and distribute these commencing from the 5th weeklord. Here again the eighth portion is lordless while Saturn's portion is Gulika. The Sun's portion is Kaala, Mars' portion is Mrityu, Jupiter's portion is Yamaghantaka and Mereury's portion is Ardha Prahara."
>
> — BPHS (Santhanam translation), ch. 4, lines 1370-1382

**BPHS (Parasara), ch. 4, no-Sanskrit retyped edition:**

> "Surya's portion is Kaal, Mangal's portion is Mrityu, Guru's portion is Yamaghantak and Budh's portion is Ardhaprahar."
>
> — BPHS no-Sanskrit retyped, ch. 4, lines 382-383

**BPHS (Parasara), ch. 4, Notes:**

> "Ardhaprahar, Yamaghantak, Mrityu, Kaal and Gulik are the 5 Kaal Velas, suggested by Maharishi Parashar."
>
> — BPHS no-Sanskrit retyped, ch. 4, lines 395-396

### Planet Assignments (verified from BPHS):

| # | Name | Planet | Status |
|---|------|--------|--------|
| 1 | **Kala** (Kaal) | Sun's portion | TRANSCRIBED-VERIFIED |
| 2 | **Mrityu** | Mars' portion | TRANSCRIBED-VERIFIED |
| 3 | **Ardhaprahara** | Mercury's portion | TRANSCRIBED-VERIFIED |
| 4 | **Yamaghantaka** | Jupiter's portion | TRANSCRIBED-VERIFIED |
| 5 | **Gulika** (Mandi) | Saturn's portion | TRANSCRIBED-VERIFIED (already implemented) |

### Day/Night Method (BPHS):

- **Day**: Divide daylight into 8 equal portions. 1st portion → weekday lord.
  Subsequent portions follow in order of weekday lords. 8th portion is lordless.
  The portions ruled by Sun, Mars, Mercury, Jupiter, Saturn are respectively
  Kala, Mrityu, Ardhaprahara, Yamaghantaka, Gulika.

- **Night**: Divide night into 8 equal portions. 1st portion → the planet ruling
  the 5th weekday lord counted from the day in question. Subsequent portions
  follow in usual order. 8th portion is lordless. Same nomenclature.

### Jataka Parijata (Vidyadhara, ~1450 CE) — Ghatika Tables

Corroborating source with explicit ghatika positions:

> "When the length of day or night is 30 ghatikas, the position of Mandi on the week days counting from Sunday onwards is at the end of ghatikas 26, 22, 13, 14, 10, 6 and 2 during daytime... the position of Mandi at nighttime will be different on the week days, viz: at the end of ghatikas 10, 6, 2, 26, 22, 18 and 14 respectively. The position of Yamakantaka during daytime on weekdays is at the end of ghatikas 18, 14, 10, 6, 2, 26, & 22 : of Ardhaprahara, at the end of ghatikas 14, 10 and 6, 2, 26, 22, and 18 ; of Kala, at the end of ghatikas 2, 26, 22, 18, 14, 10 and 6."
>
> — Jataka Parijata, Adh. II, lines 2365-2378

### Jataka Parijata — 9 Upagrahas (full set):

> "The Upagrahas in their order are Kala, Paridhi, Dhuma, Ardhaprahara, Yamakantaka, Kodanda, Mandi, Patha and Upakethu."
>
> — Jataka Parijata, Adh. II, Shloka 6, lines 2281-2283

Planet mapping (Jataka Parijata): Sun=Kala, Moon=Paridhi, Mars=Dhuma,
Mercury=Ardhaprahara, Jupiter=Yamakantaka, Venus=Kodanda, Saturn=Mandi,
Rahu=Patha, Ketu=Upaketu.

---

## 2. Chaya Upagrahas (5) — Sun-Longitude Formulas

### Primary Source: BPHS (Parasara), ch. 4, as translated by Santhanam:

> "1. Sun+133d20m=Dhuma
> 2. Dhuma+53d20m=Vyatipata
> 3. Vyatipata+180d=Parivesha
> 4. Parivesha-53d20m=Indra Chapa (Indra Dhanus)
> 5. Chapa+16d40m=Upaketu (Sikhi)
>
> Upaketu, if increased by 30 degrees, will reach the Sun's exact position at a given moment."
>
> — BPHS (Santhanam translation), ch. 4, lines 1333-1340

### S. Rath, "Introduction to Vedic Astrology":

> "Dhuma = 133d 20' + Sun
> Vyatipata (Pata) = 360d – Dhuma
> Paridhi (Parivesha) = 180d + Vyatipata
> Chapa (Indrachapa/ Kodanda) = 360d – Paridhi
> Upaketu = 16d 40' + Chapa"
>
> — S. Rath, "Introduction to Vedic Astrology", lines 8074-8078

### Secrets of Astakavarga (P.S. Sastri):

> "Add 133° 20' to the longitude of Surya. The result is the position of Dhuma. Deduct Dhuma from 360° to get Vyatipata. Add 180° to Vyatipata the result is Parigha Parivesha. Deduct Parigha from 360° to get Indradhanu. Add 16° 40' to Indradhanu to get Dhvaja (Upaketu). Add 30° to Upaketu and we have the original longitude of Surya."
>
> — Secrets of Astakavarga, lines 5913-5919

### Jataka Parijata (Vidyadhara):

> "The position of Dhuma is found by adding 4 signs, 13 degrees, 20 minutes to the figures for the Sun. Substract Dhuma from 12 signs.. The result is Vyathipatha. This increased by 6 signs/ becomes Parivesha or Paridhi. When Parivesha again is. subtracted from 12 signs, we get Tndrachapa. Add to this 16 degrees, 4Q minutes ; Kethu is obtained. Kethu increased by one sign will give the figures for. the Sun."
>
> — Jataka Parijata, Adh. II, lines 2379-2385

### B.V. Raman, Prasna Marga:

> "Dhuma (sun's longitude plus 133°); Vyatipata (360° minus Dhuma); Parivesha (180° plus Vyatipata); Indrachapa (360° minus Parivesha); and Ketu (Indrachapa plus 17 degree)"
>
> — B.V. Raman, Prasna Marga, vol. 1, lines 9420-9422

### Chaya Upagraha Formulas (verified):

**Primary source: BPHS Santhanam translation, ch. 4 (additive form):**

| # | Name | Formula | Status |
|---|------|---------|--------|
| 1 | **Dhuma** | Sun + 133°20' | TRANSCRIBED-VERIFIED |
| 2 | **Vyatipata** | Dhuma + 53°20' | TRANSCRIBED-VERIFIED |
| 3 | **Parivesha** (Paridhi) | Vyatipata + 180° | TRANSCRIBED-VERIFIED |
| 4 | **Indrachapa** (Chapa/Kodanda) | Parivesha − 53°20' | TRANSCRIBED-VERIFIED |
| 5 | **Upaketu** (Sikhi/Dhvaja) | Indrachapa + 16°40' | TRANSCRIBED-VERIFIED |

**Equivalent subtractive form (S. Rath / Jataka Parijata / Secrets of Astakavarga):**

| # | Name | Formula |
|---|------|---------|
| 1 | **Dhuma** | Sun + 133°20' |
| 2 | **Vyatipata** | 360° − Dhuma |
| 3 | **Parivesha** | 180° + Vyatipata |
| 4 | **Indrachapa** | 360° − Parivesha |
| 5 | **Upaketu** | Indrachapa + 16°40' |

Note: Both forms produce the same final Upaketu/Indrachapa. The BPHS Santhanam
additive form is used in the implementation (matches the BPHS worked example
exactly). Upaketu + 30° = Sun's original longitude (closure check).

---

## 3. Notes on Existing Implementation

- **Gulika/Mandi**: Already implemented in `www/index.html` (muhurtaWindows function).
  Day table from Kalaprakasika p.176; night table from Kalaprakasika.
  The BPHS method (sequential weekday lords) produces the same day table.

- **Ardhaprahara**: The existing `ARDHAPRAHARA_DAY = null` placeholder is replaced
  with the BPHS-derived table in this implementation.

- **Kala, Mrityu, Yamaghantaka**: New tables derived from BPHS ch. 4 method.
  Night tables use the "5th weekday lord" starting point per BPHS.

- **Chaya Upagrahas**: New function `chayaUpagrahas(sunSidereal)` added.
  Takes Sun's sidereal longitude, returns all 5 Chaya Upagraha longitudes.
  Not wired into UI — functions only, for independent verification.
