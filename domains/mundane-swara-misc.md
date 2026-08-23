# Domain: Mundane Astrology, Swarodaya & Miscellaneous Systems

> Corpus-derived knowledge base (BP-Lama voice: cite file + line). Compiled from
> `jyotish-corpus/`. **Source gap note:** the task brief named
> Gopalakrishnan's *Mundane Astrology* (2009), Banerjee's *Swara Sadhana* (1996),
> Ojha's *The Solar Return or Varshaphal* (2005), and Saxena's *Tajik Neelkanthi*
> (2001) as key sources — **none of these files exist in the corpus**. This document
> is built from what the corpus actually contains:
> `Jyotish_Varshaphal_B.V.Raman_1992.txt`, `Jyotish_1982_Kalaprakasika.txt`,
> `Jyotish_Brihat Samhita_*` (four versions), `Jyotish_A.K. Gour_Introduction to astrology_Ganita, Hora, Samhita .txt`,
> plus scattered swara/mundane references in other files. Swarodaya coverage is
> therefore thin and flagged as such.

---

## PART A — VARSHAPHAL / TAJIKA (Annual Horoscopy)

### A1. What Tajika is; provenance

- Raman, Ch. I "Introductory" (`Jyotish_Varshaphal_B.V.Raman_1992.txt` ~ln 138–145):
  Varshaphal belongs to the **Tajaka** school, distinct from Parasari and Jaimini.
  The chief authorities are **Nilakantha and Kesava**; there are acknowledged
  *differences between Tajika and Parasari doctrine*, which Raman treats as a
  legitimate school variance rather than an error.
- The annual chart is called the **progressed horoscope** — cast for the exact
  solar return moment each year (Ch. 2, "Erecting the Progressed Horoscope").
  Two methods (A and B) are given for computing the progressed ascendant from the
  solar-return day and time; Raman supplies a "Revised Table for Yearly Chart."
- **Locality matters**: the yearly chart is cast for the native's place of
  residence at the birthday, not the birthplace ("Locality for Casting Yearly
  Chart," §15).

### A2. Tajika strengths (balas) — a foreign system grafted on

- Ch. 3 lists a full Tajika strength apparatus not found in Parasari:
  **Hadda** (terms/bounds, §41–42, with Haddabala), **Drekkanabala**, **Navamsabala**,
  **Kshetrabala** (§38), **Ochchabala** (exaltation strength, §39–40),
  and the **Dwadasavargas** — eleven divisional vargas (Rasi, Hora, Drekkana,
  Navamsa, Dwadasamsa etc., §§21–33) rolled into **Dwadasavargeeyabala** and
  **Panchavargeeyabala** (§§36–37, 45).
- Key doctrinal point: Tajika planetary orbs (**Deepthamsa**) are the same orbs
  Lilly used in Western astrology (Sun 15°, Moon 12°, Mars 8°, Mercury 7°,
  Jupiter 9°, Venus 7°, Saturn 9°). Raman notes these were later converted in
  the West into "aspectal orbs" (Ch. 3 §64 discussion, ~ln 2320–2340).

### A3. Muntha — the progressed ascendant point

- Definition (`...Raman_1992.txt` ln 2147–2163): **Muntha travels one rasi per
  year from the birth ascendant.** Computation: add the ascendant sign number at
  birth to elapsed years, divide by 12, take the remainder counted from Mesha.
  Example: Kumbha asc (10s) + 23 years = 33s 12° → Muntha = Makara 12°,
  Muntha lord = Sani.
- Bhava results by house (ln 2178–2215): Muntha in 1st = destruction of enemies,
  honour, birth of issue, gain of vehicle, elevation; 2nd = fame, income;
  3rd = success over enemies, help from high-placed people; 4th = sickness,
  mental affliction (bad); 5th = wisdom, children's prosperity, pilgrimage;
  6th = debts, ill-health, enemies increase; 7th = sorrow to wife, loss of money;
  8th = fear from thieves/enemies, serious illness; 9th = favours from superiors,
  wealth, fame; 10th = help from rulers, success, reputation; 11th = happiness,
  political success, new friendships; 12th = heavy expenditure, illness, enmity.
- Placement rule (ln 2164–2170): year favourable if Muntha lord has favourable
  aspects to benefics; unfavourable if Muntha falls in 4th/6th/7th/8th/12th of
  the yearly chart; 9th/10th/11th confers responsible position; 1st/2nd/3rd/5th
  gives a new job or occupation.
- Muntha with planets (Nilakantha, ln 2232–2285): Sun = political success;
  Moon = fame, good health (if afflicted, great sorrow); Mars/Saturn = pitta/
  inflammatory illness, surgery, blood pressure complaints; Mercury/Venus =
  marriage, religious deeds; Jupiter = childbirth, domestic happiness, ornaments;
  Saturn = rheumatism/windy complaints, burns, heavy expense — lessened if
  aspected by Jupiter.
- **Rahu's two faces** (ln 2273–2278, a distinctive Nilakantha doctrine): arc from
  planet to end-of-sign = Rahu's **face (mukha)**; arc from beginning-of-sign =
  Rahu's **hind part (prishta)**. Muntha in Rahu's face → access to wealth, fame,
  charity; in prishta → fear from enemies, all-round difficulty.
- Year-lord checks on Muntha lord (ln 2271–2295): if Muntha lord sits in 6/8/12/4
  from Varsha Lagna, retrograde or combust → illness, heavy expenditure, loss of
  money; if conjunct/aspected by an afflicted 8th lord → possible death or critical
  period (only under a maraka dasa in the natal chart).

### A4. The sixteen Tajika Yogas (planetary aspects, not Parashari yogas)

Raman's own verdict (ln 2295–2300): *"the yogas listed in Tajaka works are not
yogas in the sense in which the term is used in Parasari, but only mutual aspects
of planets"* — and they work in horary too. Thachakasara lists sixteen:

| # | Yoga | Mechanism | Result |
|---|------|-----------|--------|
| 1 | **Ishkavala** | planets only in kendras+panaparas, none in apoklimas | wealth, happiness, luck |
| 2 | **Induvara** | planets only in apoklimas | disappointment, worry, ailment |
| 3 | **Ithasala** | faster planet behind slower, orbs (Deepthamsas) intermingle — applying aspect | beneficial; event per houses of the lords involved |
| 4 | **Easarpha** | faster ahead of slower by ≥1° — separating | failure, disappointment |
| 5 | **Nakta** | no Ithasala between fast/slow pair; a still-faster planet links both by aspect | transference of light; fulfilment |
| 6 | **Yamaya** | two planets not mutual, but both in Ithasala with a slow planet | object fulfilled through a third person |
| 7 | **Manahoo** | Ithasala exists but Saturn/Mars within orb of the faster knock off its light | failure, debt, quarrels, loss of wealth |
| 8 | **Kamboola** | Moon joins an Ithasala yoga | favourable; strength graded strong/medium/weak by dignity |
| 9 | **Gairikamboola** | Moon with any planet + another planet just entered a sign | (mixed) |
| 10 | **Khallasara** | Lagna lord between Moon and another planet, no orb-mingling anywhere | disappointment in all undertakings |
| 11 | **Radda** | (blocked/obstructed combination) | frustration |
| 12 | **Dupharikuttha** | mutual Ithasala of benefics in good houses | mixed-good |
| 13 | **Duttotta** | both significators weak, but one gains Ithasala with an exalted/own-sign planet | success through another person's help |
| 14 | **Thambeera** | (lame/crooked configuration) | delay |
| 15 | **Kuttha** | malefic-dominated combination | adversity |
| 16 | **Durupha** | significators in dual/infirm positions | instability |

(Enumerations ln 2299–2312; detailed treatments ln 2317–2560.)

- **Ithasala's three variations** (ln 2344–2350): **Vartamana** (present — orbs
  currently mingling), **Purna** (full — exact within one degree), **Bhavishyat**
  (future — orbs about to mingle). Raman maps these explicitly onto Western
  applying/full/separating aspects (~ln 2440).
- Worked examples are instructive: Sun 5°30' Aries / Mars 25°30' Aries → Vartamana
  Ithasala; Jupiter Pisces 3°4' / Moon Cancer 3°5' trine → Purna; Mercury Virgo
  22° / Venus Libra 7° → Bhavishyat.
- Nakta example (ln 2480–2500): Virgo lagna query about marriage; Mercury (lagna
  lord) Leo 10°, Jupiter (7th lord) Pisces 12°, no mutual aspect; Moon Taurus 11°
  squares Mercury and sextiles Jupiter → Nakta transfers the light.
- Manahoo example (ln 2510–2530): Libra 12° rising, Venus (L1) Cancer 15°, Moon
  (L10) Taurus 10°, sextile-Ithasala promises achievement — but Mars+Saturn at
  16° Taurus sit in the Moon's Deepthamsa → yoga neutralised, disappointment.

### A5. Varsha Dasa & Shuktis

- Ch. 5: **Varsha Dasa** — the yearly planetary periods computed from the year-
  lord (Varsheswara); proportioned like Mudda dasa; subdivided into **bhuktis**
  (§53–56). **Shuktis** are fivefold sub-periods (the Tajika analogue of
  Panchavargeeya weighting). Timing of events is done by dasa-bhukti overlaid on
  the saham and house promised in the annual chart.

### A6. Sahams — sensitive Arabic-style lots

- Ch. 8 "On Sahams" (§78–81): a **Saham** = sensitive point computed as
  A + B − C (planet/lord combinations, e.g. Punsaham, Vivaha-saham for marriage,
  Bandhana-saham for imprisonment). The saham becomes active when its lord or
  a benefic transits/aspect it during the year; timing via Varsha dasa of the
  saham's lord. Raman notes saham theory is the Tajika counterpart of the
  **Arabic Parts** (see Part D).
