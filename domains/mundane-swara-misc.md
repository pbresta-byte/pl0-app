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

### A7. Varsheswara — Lord of the Year and his results

- Selection (Ch. 4, §47–52): candidates for year-lordship in order — lord of the
  sign occupied by the Sun or Moon at solar return, lord of Muntha, lord of the
  Thirasi (trine-rasi of the Muntha). The strongest applicant wins.
- Strength grading (ln 3155–3162): judge by **Panchavargeeyabala** — strong
  if >10 units, moderate 5–10, weak <5. *"No prediction should be made in a
  haphazard manner"* — weigh all conjunctions, aspects and relations with the
  house-lords first.
- Results by planet (ln 3165–3320), each graded strong/moderate/weak:
  - **Sun**: strong = promotion, good health, financial improvement, success
    over enemies; weak = fruitless journeys to distant places, fear from political
    leaders, bad reputation, family misunderstanding. Under Papakarthari yoga =
    continuous fear from rulers, pitta fever, loss in mineral trade.
  - **Moon**: strong = honours, family increase, mental peace, new lands,
    agriculture, precious stones, friendship with political/religious leaders;
    weak = terrible suffering, displacement, asthma, theft in the house,
    aimless travels.
  - **Jupiter**: powerful = fame, new source of wealth, childbirth, victory in
    disputes, pilgrimage; weak = disappointment, loss of reputation, kapha illness,
    quarrels. Aspect-specific modifiers given for each co-tenanted planet
    (e.g. Jupiter aspected by Saturn = trouble from non-Hindus, scandal, gambling
    loss, addiction to liquor).
  - **Venus** (strong): conjugal happiness, success in games, gains through State
    contracts; **Saturn** (strong): fresh acquisitions but general slowness;
    Mars/Mercury results likewise graded.
- Raman's Ch. 9 "Hints of Judgment" insists the annual chart be read *with* the
  natal chart: annual promise fructifies only if the birth chart supports it, and
  dasa results in the year are conditioned by the maraka status of the natal
  periods.

---

## PART B — MUNDANE ASTROLOGY (Samhita: state, weather, nature)

Core text: **Brihat Samhita of Varahamihira**, cited from
`Jyotish_Brihat Samhita_N.Chidambaram_ retyped_upto ch 59.txt` (Chidambaram/
Chistabo retyped edition; chapter numbers per that TOC at ln 246–310).

### B1. Scope and epistemology

- The Samhita is mundane science entire: Jyotishaka (the astrologer's duties),
  planetary chapters, comets, canopus, Ursa Major, nakshatra transits, graha
  conjunctions, rain clouds/dharana/rain/Rohini-Swati-Ashadhi yogas, winds,
  earthquakes, meteors, halos, rainbows, dust storms, Sasya Jataka (vegetable
  horoscopy), commodity prices, portents, animal/plant omens (TOC, ln 246–310).
- The astrologer as state functionary (Ch. 2, ln 709–753): *"That prince meets
  with ruin who does not support a Jyotishaka well versed in all divisions"*
  (v.1); *"As is the night without a lamp... so is a prince without a Jyotishaka"*
  (v.3); a prince must know the **six gunas of policy** — Sandhi (peace),
  Vigraha (war), Yana (march), Asana (halt), Dvaidhibhava (duplicity),
  Samsraya (shelter) (ln 671) and the four upayas — Sama, Dana, Bheda, Danda (ln 674).
- Editor N.C.'s empirical defence (ln 180–210): Varahamihira said solar spots
  indicate famine, "found to be the case during famine of 1876–1877"; grain prices
  move with Chandr's course relative to the four Magha stars when Sun is in
  Kumbha; Sani never actually enters Rohini (the Dasaratha legend encodes an
  astronomical truth — Saturn approaches within ~1° without entering).

### B2. Solar phenomena (Ch. 3)

- Ayana shift doctrine (ln 755–765): anciently solstices fell at mid-Aslesha /
  start-Dhanishta; now at Karkataka/Makara ingress. If the Sun changes course
  before reaching Makara → evil on West and South; before Karkataka → evil on
  North and East.
- **Kethus/solar spots** (ln 776–830): 33 named spot-kethus (Thamasa, Keelaka...);
  spots on the solar disc → misery; on lunar disc → happiness (unless shaped like
  crow/headless body/weapon). Shape-keyed results: rod-shaped → prince dies;
  headless-body shape → disease; crow → robbers; pike → famine; umbrella/flag/fan
  shapes → king dethroned, foreign prince reigns. One spot = famine; two or more =
  death of reigning prince. Spot colour maps to varna suffering (white=brahmins,
  red=kshatriyas, yellow=vaisyas, black=sudras) — the recurring colour-code of the
  whole Samhita.
- Seasonal solar colours (ln 820–830): each rtu has a "happy" solar colour
  (e.g. Varsha white, Hemanta blood-colour); wrong colours give drought, disease,
  war. Solar halo north of Sun → rain; south → wind; above → king perishes;
  below → subjects perish (ln 862).

### B3. Eclipses and Rahu (Chs. 4–5)

- Rationalist interlude (ln 992–1040): Varahamihira argues eclipses are caused by
  Earth's shadow / lunar occultation, *not* Rahu's body — "that Rahu does not
  cause eclipses is the truth of Shastras"; yet Rahu is worshipped at eclipses by
  Brahma's boon. Magnitude computed by lunar parallax (akshavalana/ayanavalana).
- Eclipse timing omens: eclipse before calculated time → miscarriage, wars;
  after time → crop blight (ln 1050–1056). Both solar+lunar in one month → army
  dissension and war (intercalary-month precedent cited from Mahabharata
  Bhishma Parva via Garga).
- Eclipse position mapping (ln 1070–1090): six sections of the sky determine who
  suffers (midheaven = central provinces, but grain prices fall); uttarayana
  eclipse hits brahmins/kshatriyas, dakshinayana hits vaisyas/sudras; eastern limb
  eclipsed = abundant rain; western = farmers suffer, seed destroyed.
- Sign-wise national suffering (ln 1090–1130): eclipse in Mesha afflicts Panchalas,
  Kalingas, Surasenas, Cambodians(Odhra/Kirata etc.); Vrishabha → shepherds, cows;
  Mithuna → chaste women, princes, Yamuna-bank peoples, Balhika; Karkataka →
  Abheeras, Sakas, Kurus, Panchalas, grain destroyed. Planet-eclipsed variants:
  Guru eclipsed → Candahar/Sindh/Dravida rulers, grains, mountains suffer 10 months;
  Mangal → Lahore/Malwa/Oudh/Delhi rulers 6 months; Sani → Youdheya, Kauravas,
  easterners 10 months; Budh → Magadha/Mathura suffer while "rest enjoy Kritayuga
  happiness."

### B4. Comets / Ketus (Ch. 11)

- Taxonomy (ln 2060–2130): Ketus are celestial, etherial, terrestrial luminous
  bodies — 101 (Parasara) or 1000 (Garga); Narada says one Ketu in many shapes.
  Duration rule: effects last as many months as days visible (years if visible
  months); onset after 3 weeks.
- Family classification: Kirana Ketus (25, sons of Sun, east/west → princes at
  strife); sons of Agni (25, SE → fears); sons of Yama (25, bent tails, black,
  south → deaths); sons of Earth (23, NE → hunger); sons of Moon (3, white,
  north → happiness); **Brahmadanda** (single comet, three tails/colors → world's
  end); 84 sons of Venus (N/NE); 60 Kanaka Ketus of Saturn; 65 Vikacha Ketus of
  Jupiter (south).
- General rule (ln 2090–2094): small, clear, glossy, straight-tailed, transient,
  white comet → health and happiness; rainbow-shaped or multi-tailed → misery.

### B5. Planetary constellation-transits (Rahu/Ketu-chara, Sani through nakshatras)

- Sani's course through specific nakshatras gives region/caste results (Ch. 11
  opening, ln 2032–2050): Uttarashadha → Dasarna/Yavanas/Ujjain suffer; Sravana →
  officials, physicians, Kalinga; Dhanishta → ruler of Magadha triumphant;
  Satabhishak/P.Bhadra → poets, drunkards, tradesmen afflicted; U.Bhadra →
  dancers, travellers, women, gold; Revati → sovereign's servants, Sarat crops.
- Colour rule again: variegated Sani → birds perish; yellow → hunger-fear;
  blood → wars; ash → strife; cat's-eye/pure/Atasi-flower colour → happiness.

### B6. Rain science (Chs. 21–23) — the crown of Samhita

- Why rain-prediction is supreme (Ch. 21 v.1–4, ln 3920–3935): food depends on
  rain; rain-science makes even an otherwise ignorant man "pass for a great
  astrologer in this Iron Age."
- **Gestation-of-clouds doctrine** (ln 3940–3990): "pregnant clouds" appear from
  when Chandr reaches P.Ashadha in bright Margasira; **rain falls 195 days later**
  when Chandr re-enters the same asterism — inversion rules: bright-half conception
  delivers in dark half, day↔night, morning twilight↔evening twilight, east↔west.
  Month-by-month delivery table given for conceptions Magha→Karttika (moderate
  rains for early ones).
- Supporting signs of immediate rain (BS Ch. XXVIII via Gour,
  `Jyotish_A.K. Gour_Introduction to astrology_Ganita, Hora, Samhita .txt`
  ln 7523–7560): dazzling rising Sun like molten gold → same-day rain; tasteless
  water, moist salt, subdued wind, fish ashore, frog-croaking; cats scratching
  ground, rust smelling of raw meat, children building road-bridges; ants shifting
  eggs, snake-mating, cows looking at the sun; dogs barking skyward, NE lightning.
- Related rain chapters in TOC: Dharana (rain-support days), Rohini Yoga,
  Swati Yoga, Ashadhi Yoga, winds, immediate rain (ln 267–276) — the four-yoga
  rainfall complex of Garga/Parasara/Kashyapa/Vatsa.

### B7. Other mundane branches

- **Sankranti/"Graha's years"** (Ch. 19 area): lords over successive 6-month
  new/full-moon periods cycle Brahma→Chandr→Indra→Kubera→Varuna→Agni→Yama;
  Brahma-lord = prosperity, Yama-lord = drought/famine/blight (ln 1042–1050).
- **Earthquakes, meteors (Ulkas), halos, rainbows, parhelion, dust storms,
  thunderbolts** — each has a dedicated chapter keyed to direction, colour, time.
- **Sasya Jataka (vegetable horoscopy)** and **commodity price chapters** (40–42):
   price of grain forecast from planetary/omen data; the Magha-star observation in
   B1 shows price prediction was actively used.
- Animal/portent samhitas (M.R.Bhat part 2 file): idols (58), entering forest (59),
  installation (60), features of cows (61), dogs (62), cocks (63), tortoises (64),
  goats (65), horses (66), elephants (67), signs of men (68), maidens (70), omens
  from garment slits (71), umbrellas/chowries, gems/pearls/rubies (80–82) —
  `Jyotish_Brihat Samhita_M.R.Bhat_part 2_1981.txt` ln 412–13661.

---

## PART C — SWARODAYA (Breath science)

> **Gap flag:** Banerjee's *Swara Sadhana* (1996) named in the brief is absent.
> Corpus swarodaya content survives only inside Kalaprakasika's travel/muhurta
> chapters plus scattered references. Coverage below is real but thin.

### C1. Breath-directional rules for journeys

(`Jyotish_1982_Kalaprakasika.txt` ln 7851–7862):
- Right nostril flowing → step out **right foot first**; left nostril → left foot first.
- **Do not go East or North when breath flows through the left nostril; do not go
  West or South when it flows through the right** — violation brings thieves and
  risk to life. (I.e., solar/right breath suits south-westerly movement, lunar/left
  suits north-easterly.)
- Entering a house when breathing through the right nostril, leaving when through
  the left — "a very good rule."

### C2. Breath check before first use (muhurta context)

- Before wearing new cloth or jewel, first ride in a vehicle, first use of
  umbrella/instruments/gold vessels/thrones: *"watch your breath. If the breath
  flows through the left nostril, the time is auspicious"* (ln 6280–6284). Left-
  (lunar-)swara favoured for receptive/acquisitive first-uses.

### C3. Contextual frame

- KP vol.3 frames the macro-micro principle behind swara ("As above, so below,"
  hermetic axiom; magnetism linking celestial and terrestrial,
  `Jyotish_K.P._Astro_for beginners_vol_3.txt` ln 130–140) — the same logic that
  justifies breath-cycle timing. Full ida/pingala/sushumna tattva machinery
  (chandra-svara, surya-svara, five-element breath qualities, swara-based prashna)
  is **not recoverable from this corpus**; would need the missing Swara Sadhana text.

---

## PART D — MISCELLANEOUS SYSTEMS

### D1. Fortuna / Pars Fortuna (KP treatment)

(`Jyotish_K.P._Astro_for beginners_vol_3.txt` ln 3758–3810):
- Formula: **Fortuna = Asc + Moon − Sun** ("equivalent to adding the thithi to
  the lagna"). Moves faster than the Moon — about 1° per 4 minutes; must be
  individually computed, not read from ephemeris.
- Tithi-house mapping: New-Moon births → Fortuna in lagna; Sukla Tritiya → 2nd;
  Panchami → 3rd; Saptami → 4th; ... Full Moon → 7th; Krishna paksha births place
  it between 7th and 12th.
- Doctrine: Lagna, meridian and Fortuna are the only fast movers that explain why
  twins born minutes apart get "diametrically opposite" results — so never omit
  Fortuna from a chart. It **improves matters of the house it occupies**;
  transits/progressions aspecting it time fortune; Yogadhipatis transiting its
  position bring unexpected advantage. It signifies **worldly success** but has
  *nothing to do with longevity* (proof: New-Moon infants with Fortuna in lagna
  die young). This is the corpus's direct Arabic-parts bridge to Tajika Sahams (A6).

### D2. Sensitive points of the zodiac (KP)

(ln 460–480): degree-band pairs in odd/even signs denote professions — e.g.
18°00'–18°30' odd / 11°30'–12°00' even = "learned in shastras" (scientists,
professors); 20°30'–21° odd = small scholars of Vedas/Vedangas; 23°00'–23°30'
odd = accountants, statisticians, astrologers, astronomers. A fixed-degree
sensitive-point system parallel to Arabic parts/sahams.

### D3. Kalaprakasika's samskara/election miscellany

(`Jyotish_1982_Kalaprakasika.txt`):
- Jewel/cloth first-wear muhurtas (ln 6230–6290): benefics in kendra/trine,
  malefics in 3/6/11, 8th vacant; famous gold-jewel yoga — Jupiter exalted in
  rising navamsa with Mercury+Venus in 4th → "thousands of ornaments";
  Saturday-Rohini Amirthaghatika making-and-wearing pairing.
- Vastu-Purusha (ln 6310–6320): sleeps head-East during Bhadrapada/Aswayuja/
  Kartika months, head-South Margasira–Magha, head-West Phalguna–Vaisakha,
  head-North Jyeshta–Sravana; never build on head/hands/legs/back sectors.
- Foundation asterism pairs by direction: Aslesha+Krittika, Chitra+Visakha,
  Pushya+Magha, U.Ashadha+Sravana (ln 6290–6300); lagna-halves decide which side
  of the plot to begin building.
- **Panchaka journey arithmetic** (ln 7805–7830): add thithi+vara+nakshatra+
  rising sign (+15, +12, +10, +8, +4 variants) ÷ 9; remainder 5 flags illness,
  fire-danger, royal trouble, thieves, disaster respectively.
- Transit/Lunar-horoscope system (Ch. XXXVII–XXXIX, ln 10568–11446): count
  Krittika→Janma-nakshatra ÷ 9 → planetary dasa of the day (1 Sun, 2 Moon, 3 Mars,
  4 Rahu, 5 Jupiter, 6 Saturn, 7 Mercury, 8 Ketu, 9 Venus); month-count system ×7÷8.
- Counteractive combinations (Ch. XXXIV, ln 9646): stellar combos that neutralise
  the "exterminative yogas" of Ch. XXXIII.

### D4. Dharma types

> **Gap flag:** no dharma-type system (Larson/Knapp-style brahmana-kshatriya-
> vaishya-shudra dharma typologies, or Jaimini-based dharma classifications) exists
> under that name in this corpus. Nearest material: the pervasive **varna-colour-
> direction coding** of Brihat Samhita (white/brahmin, red/kshatriya, yellow/vaishya,
> black/shudra applied to solar spots, comet colours, eclipse limbs — B2–B5 above),
  which functions as a mundane dharma-type map; and Gour's Samhita framing of
  astrology's purpose (`...Gour...Samhita .txt` ln 1754, 6883).

---

## Source inventory & gaps

| Needed | Status |
|---|---|
| Gopalakrishnan, Mundane Astrology (2009) | **absent** |
| Brihat Samhita | present ×4 (Chidambaram full-to-59; Sastri 1946; M.R.Bhat pt2 1981; rare partial) |
| Banerjee, Swara Sadhana (1996) | **absent** — swara only via Kalaprakasika |
| Raman, Varshaphal (1992) | present — primary Tajika source |
| Ojha, Solar Return/Varshaphal (2005) | **absent** |
| Saxena, Tajik Neelkanthi (2001) | **absent** |
| Kalaprakasika (1982) | present — muhurta/swara/misc |
| KP Astro for Beginners vol.3 | present — Fortuna, sensitive points |

