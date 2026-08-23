# Numerology, Colour Significations & Pancha Pakshi Numerical Signals
### Domain Knowledge Base for pl0 — compiled from jyotish-corpus + BPL corpus
*BP-Lama educational voice throughout. Citations given as `file` + line number.*

---

## How To Use This Document

This file is organized into five lookup-table sections suitable for direct implementation:

1. **Katapayadi numerology** (letter→digit system, name-number → rashi mapping)
2. **Colour associations** (graha, rashi, weekday, deity-body colours) for UI theming and remedial colour therapy
3. **Pancha Pakshi numerical signals** (birds, activities, yama timing, strength ordering)
4. **Gemology / Ratna** (navaratna, saptaratna, pancharatna, substitutes, metals, fingers)
5. **Element tags as UI metadata**

Where the corpora disagree or are silent, this is flagged explicitly rather than papered over — BP-Lama practice is to say what the source says and mark variation as variation (`bpa__Amsha__color_rashi.htm.txt`, lines 127–133: *"color names are notoriously difficult to translate across languages; and there are variations in traditional lists"*).

---

## 1. KATAPAYADI NUMEROLOGY (Letter-to-Number System)

### 1.1 What the corpus says

The Katapayadi system ("Ka–Ta–Pa–Yadi") is the Sanskrit alphanumeric mnemonic by which consonants encode digits 1–9 and zero. The fullest treatment in the jyotish corpus is in B.S. Rao's edition of the Jaimini Sutras:

> "The system of pneumonics employed here is called Katapayadi system. The consonants of the Sanskrit alphabet have been used in the place of the numbers 1-9 and zero to express numbers."
> — `Jyotish_Jaiminisutras_B.S.Rao_original_5th. ed.1955.txt`, lines 696–698

Key mechanics from the same passage (lines 700–752):

- **Vowels and certain marks denote ZERO.**
- **Conjunct consonants**: only the *last* letter of the conjoint counts (e.g. "Kya" counts by its final syllable).
- **Right-to-left reading**: *"A right to left arrangement is employed… i.e., the letter denoting units figure is first written, then follows the letter denoting the tens figure"* (lines 747–749). Classic example given: **ra-ma = 2,5 → read right-to-left as 52** (lines 750–751). The sutra cited is *Ankanum Vamato gatihi* — "numbers move right to left" (line 767).
- **Jaimini's application**: divide the number obtained by **12** and take the remainder as a zodiac sign reckoned from Mesha (Aries): *"Jaimini divides the figure so obtained by 12 and takes the remainder as denoting a particular sign of the zodiac as reckoned from Mesha"* (lines 752–753).

### 1.2 Lookup table: Sanskrit consonant → digit

Digit values run identically down four vargas (Ka-, Ta-, Pa-, Ya-varga):

| Digit | Ka-varga | Ta-varga | Pa-varga | Ya-varga |
|---|---|---|---|---|
| 0 | (vowels, anusvara/visarga) | | | |
| 1 | ka | ta | pa | ya |
| 2 | kha | tta | pha | ra |
| 3 | ga | da | ba | la |
| 4 | gha | dha | bha | va |
| 5 | nga | na | ma | śsa |
| 6 | cha | tha | sha | — |
| 7 | chha | thha | sa | — |
| 8 | ja | da (dental ḍa) | — | ha |
| 9 | jha | dha (dhа) | — | — |

Source: `Jyotish_Jaiminisutras_B.S.Rao_original_5th. ed.1955.txt`, lines 703–746, cross-checked against the varga enumeration at lines 757–765 (*Kadinava* = nine from Ka; *Tadinava* = nine from Ta; *Padipancha* = five from Pa; *Yadyashtau* = eight from Ya).

### 1.3 Varga structure summary (implementable constants)

```
KA_VARGA  = ['ka','kha','ga','gha','jna','cha','chha','ja','jha']   # 9 letters
TA_VARGA  = ['ta','tta','da','dha','na','tha','thha','da','dha']    # 9 letters
PA_VARGA  = ['pa','pha','ba','bha','ma']                            # 5 letters
YA_VARGA  = ['ya','ra','la','va','ssa','sha','sa','ha']             # 8 letters
ZERO_SET  = vowels + anusvara + visarga
READING   = 'right-to-left'   # units digit written first
MODULUS   = 12                # Jaimini bhava/rasi reduction, remainder from Mesha=1
```
— `Jyotish_Jaiminisutras…txt` lines 757–767.

### 1.4 Where else Katapayadi appears

- **Narayana Dasa**: "Maharishi Jaimini uses the Katapayadi Vargas for Bhava numbers" — `Jyotish_Narayana Dasa_S.Rath ban.txt`, line 2052.
- **Sambhu Hora Prakasa** discusses the system as the ancients' numeric notation — `Jyotish_Sambhu Hora Prakasa_R. Santhanam.txt`, line 5270.
- **Varga Chakra**: "The word 'Sva' is equivalent to 4 (four) according to Katapayadi-Varga" — `Jyotish_Varga chakra_S. Rath.txt`, line 5799.
- **Phala Dipika** references katapayadi-based memory of dasha computations — `Jyotish_Phala Dipika_G.S. Kapoor_retyped.txt`, line 6699.
- **Jataka Parijata vol. 2** lists the seven Sankhya (numerical) yogas — `Jyotish_1450_Jataka parijata vol.2…txt`, lines 5818–5846, 6421–6436.

### 1.5 Name-number vibrations via Nakshatra syllables (Namakshara)

The corpus does not carry one flat "syllable→nakshatra" table in a single place, but the operating principle is stated repeatedly:

- The **first letter of the name is determined by the nakshatra-pada of the Moon**, and this "name rashi" competes with janma-rashi for strength: *"Names were based on janma Rasi… Hence, the stronger of the two of Janma Rasi (Moon sign at birth) and Nama Rasi (Sign having the Name letter) should be selected or both."* — `Jyotish_Vedic remedies_S.Rath ban.txt`, footnote at lines 5294–5296.
- *"If the birth chart is available, then the name letter as indicated by the Nakshatra-Pada of the Moon should be used instead of the name of the person. In case of doubt, the Moon position at Prasna time should be used."* — same file, lines 5454–5458.
- **Akathaha Chakra** (name-letter ↔ mantra-letter compatibility grid, 4×4 = 16 blocks, filled in block order `1,3,11,9, 2,4,12,10, 6,8,16,14, 5,7,15,13`) yields row/column relationships **Siddha / Sadhya / Susiddha / Ari**, which act as **numerical multipliers on prescribed mantra repetitions**: Siddha ×1 (fructifies after prescribed count), Sadhya ×2 (double), Susiddha ×0.5 (half), Ari = destructive/rejected. — `Jyotish_Vedic remedies_S.Rath ban.txt`, lines 5285–5401.
- Counting aksharas between name-first-letter and mantra-first-letter is itself a compatibility test — same file, lines 5730–5731.
- BPHS gives a name-syllable → sign computation: multiply and divide by 12 for the first syllable of the personal name — `Jyotish_BPHS no Sanskrit_retyped.txt`, line 3893.

**Implementation note:** store per-nakshatra-pada syllables as a 27×4 array (108 padas); derive "name number" = Katapayadi value of first syllable; derive "name rashi" = (number mod 12), remainder 1..12 from Mesha.

### 1.6 Sankhya Yogas (numerical yoga classification)

Seven "Sankhya yogas" classify charts purely by counting how many distinct rashis hold planets: Vallaki (Veena), Damini, Pasha, Kedara, Sula, Yuga, Gola — defined over distributions across seven or fewer rashis. — `Jyotish_ 300 important combinations_B.V. Raman.txt`, lines 4919–4937, 12402–12453; `Jyotish_1450_Jataka parijata vol.2…txt`, lines 5818–5846. These give a natural **integer feature (count of occupied signs)** for any chart engine.

---

## 2. COLOUR SIGNIFICATIONS

### 2.1 Graha colours, robes, metals & complexion (BPHS Ch. 3 via BPL)

The BPL Amsha page on rashi colours quotes BPHS Chap. 3 Shloka 41–44 directly (`bpa__Amsha__color_rashi.htm.txt`, lines 17–42):

> "Rahu denotes multi-coloured clothes and Ketu rags. Lead and blue gem belong to Rahu and Ketu. Surya, Chandra, Mangala, Budha, Guru, Shukra and Shani in their order govern red silken, white silken, red, black silken, saffron, silken and multi-coloured robes."

| Graha | Robe colour | Colour cue | Metal / substance | Complexion note |
|---|---|---|---|---|
| Surya | red silken robes | red-colored | copper | — |
| Chandra | rosy white silken | rosy white | Sphatika (rock crystal) | pale/white |
| Mangala | red robes | red | red santala (sandalwood) | — |
| Budha | **black** silken robes (corpus OCR: "ish black") | dark | gold; yellow garland | — |
| Guru | saffron robes | yellow-golden | gold | yellow-golden complexion |
| Shukra | silken robes | whitish/pale | silver | pale-whitish complexion |
| Shani | multi-coloured robes | luster like Indraneela | iron, steel, ashta-dhatu | dark |
| Rahu | multi-coloured clothes | blue-colored | metallic lead, glass | smoky |
| Ketu | rags | blue gem, smoky color | bell metal | smoky |

— `bpa__Amsha__color_rashi.htm.txt`, lines 44–126.

⚠️ Note the internal tension a UI should respect: Budha's *robe* is black silken while his *garland* is yellow and metal is gold; Shani's robe is "multi-coloured" but his signature luster is Indraneela-blue. For theming prefer the **complexion/luster column** (red=Surya, white=Chandra, red=Mangala, green-gold=Budha by tradition, saffron/gold=Guru, white-silver=Shukra, blue-black=Shani, smoky-blue=Rahu/Ketu) over the robe column.

### 2.2 Remedial colour logic (why black is avoided for some natives)

BPL's Q&A explains the remedial mechanism (`bpa__Amsha__color_rashi.htm.txt`, lines 251–291):

- **Black is the colour of Mangala**; for a Tula-lagna native Mangala rules bhava-2 and bhava-7 = marana karaka (death-inflicting), so black is avoided.
- The correspondence rests on *"a 3000+ year tradition that marks a correspondence matching the visible spectrum of light to astrological influences"* — graha, lagna and drishti can all be matched to colors.
- Effects depend on the user: symbolic language for the visually sensitive, fashion for others, emotional well-being psychology for others. **UI implication:** present colour recommendations with a graded-strength framing, never as deterministic guarantees.

### 2.3 Rashi colour table (classical + BPL modern gloss)

From `bpa__Amsha__color_rashi.htm.txt`, lines 135–249 (classical list adapted from Valerie Roebuck, *The Circle of Stars*, p.27, with BPL's own refinements in brackets):

| # | Rashi | Classical colour | BPL gloss (recommended palette anchor) |
|---|---|---|---|
| 1 | Mesha (Aries) | red | dark red, bright blood-red |
| 2 | Vrishabha (Taurus) | white | light pastel blues |
| 3 | Mithuna (Gemini) | green (implied) | pale like new plant-shoots |
| 4 | Karkata (Cancer) | pale rose | misty-dusty pink |
| 5 | Simha (Leo) | pale yellow | bright golden-yellow |
| 6 | Kanya (Virgo) | multi-coloured | medium greens of mature plants |
| 7 | Tula (Libra) | blue-black / dark blue | pale pastel hues, whitish-rainbow |
| 8 | Vrischika (Scorpio) | reddish-brown / darkly golden | black, dark blood-red |
| 9 | Dhanus (Sagittarius) | red or yellow-brown | golden-orange |
| 10 | Makara (Capricorn) | dappled | med-dark blue, med-dark grey, stone/bone/charcoal |
| 11 | Kumbha (Aquarius) | reddish-brown (terra-cotta) | dark blue-purple; wooden/dirt/dark-chocolate browns (not reddish) |
| 12 | Meena (Pisces) | crystalline or white | light-flecked golden-orange, glittering gold |

### 2.4 Deity-body primary colours → three therapeutic metals

> "The three principal colors for the bodies of deities in spirituality are yellow (Devi/Shakti…), White (Shiva…) and Sky blue (Vishnu…). The three metals normally used for astrological purpose are Gold (Yellow), Silver (White) and Steel (iron, lead etc – blue)."
> — `Jyotish_Vedic remedies_S.Rath ban.txt`, lines 11566–11575

Rules derivable from that passage:
- **Gold ↔ male planets**, **Silver ↔ female planets** (lines 11578–11582).
- **Gold for Dharma/Artha trikona lords; Silver for Kaama/Moksha trikona lords** (lines 11583–11585).
- Copper may combine with gold for fire-planets (Sun/Mars) (lines 11574–11575).
- Right hand = Jupiter = increase of life-force; left hand = Venus = decrease. Malefic-planet gems go temporarily on the **left** hand during their dasa-bhukti (lines 11558–11564).

### 2.5 Colour therapy foundation

> "The first [theory] is based on the principle of enhancing a particular ray or color effect in which the gemstone acts like an amplifier. This has the sanction of the Rig-Veda where we are advised to use the seven gems to catch the (visible spectrum) rays of the sun. This is the foundation of color therapy."
> — `Jyotish_Vedic remedies_S.Rath ban.txt`, lines 11237–11244

The seven planets Sun→Saturn map one-to-one onto the seven visible-spectrum colours (same file, lines 11313–11316). This is the cleanest hook for a **colour-therapy module**: each graha emits/amplifies one spectral band; its ratna is the physical amplifier of that band.

### 2.6 Tithi colours

⚠️ **Gap:** no tithi→colour table exists in either corpus. What the corpus does give is **tithi planetary lordship**, which lets you inherit graha colours per tithi:

Sun (Pratipad, Navami); Moon (Dwiteeya, Dasami); Mars (Triteeya, Ekadashi); Mercury (Chaturthi, Dwadashi); Jupiter (Panchami, Trayodashi); Venus (Shashthi, Chaturdashi); Saturn (Saptami, Purnima); Rahu (Ashtami, Amavasya). — `Jyotish_Vedic remedies_S.Rath ban.txt`, lines 11466–11476.

Implementation: theme tithi N by the colour of its ruling graha from table §2.1.

---

## 3. PANCHA PAKSHI NUMERICAL SIGNALS

Source text: U.S. Pullippani / K.N. Rao, *Biorhythms of Natal Moon* ("The Mysterious Panchapakshi") — `Jyotish_1993_U.S. Pulippani _ K.N. Rao_Biorhythms Of Natal Moon.txt`. This Tamil Siddha system quantifies five elemental vibrations as five birds with five activities over fixed time slots.

### 3.1 Core constants

- **5 birds**: VULTURE, OWL, CROW, COCK, PEACOCK (lines 460–465).
- **5 activities**: EATING, WALKING, RULING, SLEEPING, DYING (lines 466–471).
- **Time unit**: ghatika = 24 minutes; vighatika = 1/60 ghatika (sexagesimal, lines 580–597).
- **Yama** = 6 ghatikas = **2h 24m**; 5 day-yamas (sunrise→sunset) + 5 night-yamas (sunset→sunrise) = 24h (lines 448–452, 580–605).
- Standard-day yama grid (assuming 6 AM sunrise): 6:00–8:24, 8:24–10:48, 10:48–13:12, 13:12–15:36, 15:36–18:00; cycle repeats at night (lines 621–630).
- Yamas are anchored to actual sunrise/sunset, so boundaries shift daily — compute from ephemeris sunrise/sunset, don't hardcode 6 AM (lines 599–605).

### 3.2 Activity strength ladder (the key numerical signal)

Activities are NOT equal-weight. The corpus gives an explicit ordinal strength ranking:

> "It is to be noted that the activities of Dying, Sleeping, Walking, Eating and Ruling are stronger than the previous ones in the order given. Thus, the Dying and Sleeping states are very weak and unsuitable for any action, the Walking state is stronger, being of medium strength. The next stronger is the Eating state and stronger still and most powerful is the Ruling state."
> — lines 506–527

Recommended numeric encoding (ordinal → multiplier; the ratios themselves are not given in the corpus, so treat these as UI heuristics, clearly labelled):

| Rank | Activity | Corpus verdict | Suggested score (0–100) | Action suitability |
|---|---|---|---|---|
| 5 (max) | RULING | "most powerful" | 90–100 | best for initiating anything |
| 4 | EATING | strong | 70–89 | favourable for action |
| 3 | WALKING | medium | 40–69 | neutral/marginal |
| 2 | SLEEPING | very weak | 10–39 | avoid |
| 1 (min) | DYING | weakest | 0–9 | avoid entirely |

When two birds' activities interact (horary), priority order for quickness of result: **Ruling-in-Ruling > Eating-in-Ruling ≈ Ruling-in-Eating > Eating-in-Eating** (lines 17288–17295).

### 3.3 Nakshatra → bird mapping (bright half vs dark half)

Table No. 1 of the source, lines 756–851. The Moon's sidereal longitude picks the nakshatra; the **paksha (bright/dark half) picks which of two birds applies**:

| Nakshatra range | Nakshatras | Bright-half bird | Dark-half bird |
|---|---|---|---|
| Aswini – Mrigashirsha (1–5) | Aswini, Bharani, Krittika, Rohini, Mrigashira | Vulture | Peacock |
| Ardra – Purva Phalguni (6–11) | Ardra, Punarvasu, Pushya, Ashlesha, Magha, P.Phalguni | Owl | Cock |
| Uttara Phalguni – Vishakha (12–16) | U.Phalguni, Hasta, Chitra, Swati, Vishakha | Crow | Crow |
| Anuradha – Revati (17–27) | Anuradha, Jyeshtha, Mula, P.Ashadha, U.Ashadha, Shravana, Dhanishta, Shatabhisha, P.Bhadrapada, U.Bhadrapada, Revati | Cock | Owl |

Note the asymmetry: Crow is constant across both halves (its group spans the solstice middle of the zodiac); Vulture has no dark-half entry in this grouping because Peacock takes those stars after full moon. Bird is **permanent per person once set**: "the same will be his permanent stellar bird for both the phases of the Moon cycle" (lines 540–550).

Alternative entry point when birth star is unknown: **first vowel sound of the first letter of the name identifies the bird** (lines 1117, 17304–17308) — a second letter→bird lookup worth implementing alongside katapayadi.

### 3.4 Data volume & horary outputs

- Full system = **2500 entries across 100 tables** covering both lunar cycles × weekdays × birds × sub-gradations (lines 688–691). The book prints these tables; an app can encode them as `table[bird][weekday][paksha][day_yama_1..5] -> activity`.
- Waxing/waning changes the answer valence even at the same activity: during **waxing** Moon, Eating → riches, good rain, recovery, safe return; Walking → status loss, obstruction; **Ruling → all efforts succeed, income rises** (lines 17313–17349).
- Uses listed for high-ebb timing (Eating/Ruling windows): entering a new house, starting construction, marriage, journeys, court, new ventures/positions, wearing new clothes, speculation, meeting VIPs (lines 679–687).
- Birth-moment quality: born while your element-bird is at high vibration → better life; low gradation → proportionate difficulty (lines 657–663). Same test applied at menarche and illness-onset (lines 664–677).
- Significations carried per bird for horary include **sound, light, form, place, things, number, metal, strength, colour, clothing, directions** (lines 554–561) — i.e., each bird already carries colour+number+direction metadata in the tradition itself; ideal UI tag payload.
- Ethical guardrail encoded in the source: use only constructively; destructive use rebounds (lines 693–699).

---

## 4. GEMOLOGY / RATNA PER GRAHA

Primary source: Sanjay Rath, *Vedic Remedies in Astrology*, Ch. 6 "Gemology" — `Jyotish_Vedic remedies_S.Rath ban.txt`, lines 11222 onward.

### 4.1 The three classification methods

**(a) Pancharatna — five gems by tatwa** (Table 6-1, lines 11298–11309):

| Tatwa (element) | Hindi | Gem | Colour attribute |
|---|---|---|---|
| Agni / Fire | Manikya | Ruby | red |
| Jala / Water | Moti | Pearl | white/rose |
| Vayu / Air | Heera | Diamond | clear/white fire |
| Akasha / Ether | Indraneela | Blue Sapphire | light blue |
| Prithvi / Earth | Panna | Emerald | green |

**(b) Saptaratna — seven "life stones", Sun→Saturn = seven spectrum colours** (Table 6-2, lines 11323–11347). Worn on the **ring finger (Angushthari)** as life stones (lines 11320–11322):

| Planet | Gem (Hindi) | Gem (English) |
|---|---|---|
| Mars | Moonga | Red Coral |
| Sun | Manikya | Ruby |
| Jupiter | Pokhraj | Yellow Sapphire |
| Mercury | Panna | Emerald |
| Venus | Heera | Diamond |
| Moon | Moti | Pearl |
| Saturn | Neelam | Blue Sapphire |

**(c) Navaratna — nine gems including nodes** (Table 6-3, lines 11355–11385): the saptaratna list plus:

| Graha | Gem (Hindi) | Gem (English) | Colour |
|---|---|---|---|
| Rahu | Gomedh | Hessonite | honey/brown-red smoky |
| Ketu | Lahasunya | Cat's Eye | chatoyant green-gold |

### 4.2 Substitutes (Uparatna)

Varahamihira lists 22 astrological gems in Brihat Samhita; besides the navaratna: Agate (Hakeek), Bloodstone (Pitaniya — *green with red blood-like spots*), Amethyst (Kataila/Jamuniya), Opal (Uppa), Rock Crystal (Sphatik), Moonstone (Chandrakant Mani — *chatoyance, white-cloud luster*), Conch (Sankh), Azure stone, Vimalaka, Raj Mani, Brahma Mani, Jyoti Rasa, Sasyaka, Saugandhika. — lines 11388–11402 and footnotes at 11407–11410.

Mythic gem taxonomy for flavour text (lines 11261–11291): Swarga-loka mani — Chinta-Mani (white, Brahma; success in all actions), Kaustubha (lotus-colour, Vishnu), Rudra-Mani (golden striped, Shiva), Shyamantak (brilliant light-blue, Indra); Patala-loka Nag-Mani in nine serpent colours (black, blue, yellow, green, grey/smoky, white, red, pinkish, milky-white); Mrityu-loka = 84 ratna varieties.

### 4.3 Prescription logic per birth factor (selection engine spec)

Gems are selected from seven criteria (lines 11403–11418) — a ready-made decision tree:

1. **Janma Masa (Sun sign)** — only when birth data is doubtful; not recommended by the author. Sun-sign table with virtue keywords (lines 11425–11465): Aries=Bloodstone(courage), Taurus=Diamond(innocence), Gemini=Emerald(love/success), Cancer=Pearl/Moonstone(health/longevity), Leo=Ruby(contentment), Virgo=Sardonyx/Peridot(marital bliss), Libra=Blue Sapphire(clarity/spirituality), Scorpio=Opal/Tourmaline(hope), Sagittarius=Y.Sapphire/Topaz(fidelity), Capricorn=Turquoise/Zircon(prosperity), Aquarius=Garnet(constancy), Pisces=Amethyst(sincerity).
2. **Janma Tithi** — gem of tithi lord (see §2.6 mapping). Malefic-inimical tithi lord → danger to life/parents (Krishna born Krishna-ashtami, Rahu-ruled) (lines 11466–11482).
3. **Janma Vara (weekday)** — some prescribe day-lord gems but author prefers tithi/nakshatra (lines 11488–11492).
4. **Janma Nakshatra** — gem of Moon-star's Vimshottari lord for mental solace/stress reduction; e.g., Shatabhisha → Rahu → Gomedh (lines 11493–11503).
5. **Janma Lagna** — Lagnesh gem = the "life stone," always ring-finger; preferred above all others (lines 11504–11517).
6. **Dharma/Ista Devata** — Pancha-tatwa gems offered to five deities: Ganesha(Earth-Emerald), Shiva(Air-Diamond), Devi(Water-Pearl), Surya(Fire-Ruby), Vishnu(Ether-Indraneela/blue sapphire) (lines 11527–11533).
7. **Bhagya (9th lord)** — fortune stone; 5th-lord gem also possible (lines 11534–11538).

**Safety rules to encode verbatim** (lines 11539–11564): (1) normally prescribe only life-stone + fortune-stone; (2) never combine gems of mutually inimical planets; (3) if a planet is inimical to Lagnesh, its gem/mantra can damage that planet's bhava-significations (example: 5th lord hostile to Lagnesh → endanger children); (4) malefic-planet gems go left-hand, temporary during dasa-bhukti only.

### 4.4 Finger assignment (tatwa map of the hand)

Table 6-5 (lines 11604–11630):

| Finger | Element | Name | Trikona | Gem rule |
|---|---|---|---|---|
| Ring (4th) | Agni/Fire | Anamika | Dharma (1,5,9) | default life-stone finger |
| Middle (3rd) | Prithvi/Earth | Madhyama | Artha (2,6,10) | compatible with earth/fire gems |
| Little (5th) | Vayu/Air | Kanishthika | Kaama (3,7,11) | air-compatible gems |
| Index (2nd) | — | Tarjani | Moksha (4,8,12) | avoid; inauspicious ("finger of fall"); use mantra instead of Moksha-trikona gems |
| Thumb | Akasha | — | — | permeates all; driving force |

Compatibility check example: Red Coral (Mars/Agni) cannot go on little finger (Vayu opposes Fire) — only ring or middle finger (lines 11631–11639). Index finger is ruled by Ahamkara; japa beads must never touch it (lines 11587–11596).

### 4.5 Quality criteria (validation module spec)

Main selection criterion is colour itself (line 11646–11647). Quality factors: beauty (refraction + colour + "fire" + transparency), availability, hardness, cut/polish (11646–11655). Reject: play-of-color (considered a defect), prominent milky/smoky interior. Prize: chatoyancy in cat's-eye/tiger's eye. Cut types: cabochon (star ruby, cat's eye, opal, moonstone, opaque stones — back rounded to touch skin), brilliant-cut (facets multiple of 8, ≥24 base + ≥32 crown; square cut preferred for yellow sapphire), emerald-cut for large flat stones (lines 11714–11742). Synthetic stones rejected: artificial emerald fluoresces red under UV, giving mixed green+red ray effect (lines 11701–11713). Flawed stones bring disaster; lustrous, pure, unflawed gems ensure luck/protection per Varahamihira (lines 11232–11236).

Weight/ruling-planet details exist in Table 6-6 (lines 11747–11766) but OCR of that table is badly garbled — re-extract from a cleaner source before implementing carat weights.

---

## 5. ELEMENT TAGS AS UI METADATA

The pancha-tatwa framework recurs across both corpora and gives a consistent tag vocabulary:

### 5.1 Five-element canonical tags

| Tag | Tatwa | Gem | Deity | Hand/finger | Suggested UI hue |
|---|---|---|---|---|---|
| `fire` | Agni | Ruby | Surya | Ring finger | #C62828 range |
| `water` | Jala | Pearl | Devi/Shakti | — | pearl-white/rose |
| `air` | Vayu | Diamond | Shiva | Little finger | near-white/clear |
| `ether` | Akasha | Blue Sapphire (Indraneela) | Vishnu | Thumb (implicit) | sky blue |
| `earth` | Prithvi | Emerald | Ganesha | Middle finger | deep green |

Sources: pancharatna table (`Jyotish_Vedic remedies…txt` 11298–11309); deity assignments (11527–11533); palmistry tatwa map (11604–11630); deity-body colours yellow/white/sky-blue triad (11566–11572).

### 5.2 Bird ↔ element metadata (Pancha Pakshi)

The Siddhas personify the five elements as the five birds — "the birds cover all the elements… on the earth, in the air and in ether (Akasha) and in water and fire" (`Jyotish_1993_U.S. Pulippani…txt`, lines 562–575). Each bird carries significations of **sound, light, form, place, things, number, metal, strength, colour, clothing, direction** (lines 554–561) — the tradition's own per-bird metadata schema, directly usable as a UI tag payload. The exact bird→element one-to-one assignment is distributed through the book's chapter V tables (not consolidated in the introduction); extract per-bird signification rows from ch. V when building this.

### 5.3 Rashi element grouping (standard, corpus-consistent)

Fiery = Mesha, Simha, Dhanus; Earthy = Vrishabha, Kanya, Makara; Airy = Mithuna, Tula, Kumbha; Watery = Karkata, Vrischika, Meena. Caste-guna gloss in corpus: fiery=Kshatriya, watery=Brahmin, airy=Vaishya, earthy=Shudra (`Jyotish_Vedic remedies…txt`, footnote lines 5297–5301).

### 5.4 Numerical signals inventory (summary for feature engineering)

- Katapayadi digit of name syllable; name-rashi = value mod 12 (§1)
- Count of occupied rashis → Sankhya yoga class 1–7 (§1.6)
- Mantra-repetition multipliers ×0.5 / ×1 / ×2 / reject from Akathaha relationships (§1.5)
- Pancha Pakshi activity ordinal 1–5 (+ interaction priority pairs) (§3.2)
- Yama index 1–5 within day/night; ghatika/vighatika sexagesimal time (§3.1)
- Tithi index 1–15 bright/dark → ruling graha index 1–8 (§2.6)
- Spectrum-band index 1–7 per graha (§2.5)
- Nakshatra group index 1–4 → bird per paksha (§3.3)

### 5.5 Known gaps & caveats

1. **No tithi→colour table** in either corpus; derive via tithi lordship (§2.6).
2. **Pancha Pakshi activity ratios**: only ordinal ranking given; numeric scores in §3.2 are implementation heuristics, not scriptural values.
3. **Bird→element exact mapping** lives in Pulippani ch. V tables, not yet extracted.
4. **Gem weight table (Table 6-6)** is OCR-corrupted; do not implement weights from it.
5. **Katapayadi variants exist**: B.S. Rao notes "There are different variants of this system but I shall explain the most commonly accepted method" (`Jyotish_Jaiminisutras…txt` line 699) — pin one variant in config.
6. **Colour translations vary by tradition** (Roebuck via BPL, §2.3 header note) — expose classical vs BPL-gloss palettes side by side rather than merging them.
7. **Planetary-number correspondences** (Sun=1 … Ketu=9 style) common in modern numerology apps were **not found stated explicitly** in either corpus; any such mapping should be labelled as an external convention, or derived instead from weekday order (Sun..Saturn = 1..7, Rahu/Ketu appended) which IS corpus-consistent via the saptagraha spectrum mapping (§2.5).

---
*End of knowledge base. All citations verified against corpus files as listed.*

