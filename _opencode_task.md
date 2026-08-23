Implement three new features in www/index.html (a single-file Jyotish app). Study the existing patterns first — especially how pages are registered (hamburger menu buttons with data-page="pageX" + <div id="pageX" class="page"><div id="xPageContent">), how renderXxxPage() functions populate content, and the existing SIGNS array, GRAHA_LIST, computePositions(jd,lat,lon), and julianDay() functions.

FEATURE 1 — SIGN_LORDS data table. Add near the top data section (after SIGNS):
const SIGN_LORDS = {Aries:"Mangal",Taurus:"Shukra",Gemini:"Budha",Cancer:"Chandra",Leo:"Surya",Virgo:"Budha",Libra:"Shukra",Scorpio:"Mangal",Sagittarius:"Guru",Capricorn:"Shani",Aquarius:"Shani",Pisces:"Guru"};
Also add classical Sanskrit names: const SIGN_SANSKRIT = {Aries:"Mesha",Taurus:"Vrishabha",Gemini:"Mithuna",Cancer:"Karka",Leo:"Simha",Virgo:"Kanya",Libra:"Tula",Scorpio:"Vrishchika",Sagittarius:"Dhanu",Capricorn:"Makara",Aquarius:"Kumbha",Pisces:"Meena"};

FEATURE 2 — "House Lord Results" section on the existing Natal General Reading page (pageNatal). In renderNatalPage() (find it), after whatever it currently renders, append a new panel with:
- A <select> dropdown for houses 1-12
- For the selected house N: compute the rashi occupying that house from the ascendant (sign index = (ascIdx + N-1) % 12), show: the sign name (+Sanskrit), its lord (SIGN_LORDS), which house that lord is placed in natally (from birth chart positions), the lord's dignity state (own/exalted/debilitated/friend's sign using standard dignities: Mars own=Aries/Scorpio exalt=Capricorn; Venus own=Taurus/Libra exalt=Pisces; Mercury own=Gemini/Virgo exalt=Virgo; Moon own=Cancer exalt=Taurus; Sun own=Leo exalt=Aries; Jupiter own=Sagittarius/Pisces exalt=Cancer; Saturn own=Capricorn/Aquarius exalt=Libra), whether the lord is in a kendra (1/4/7/10) or trikona (1/5/9) from lagna, and a short reading sentence per house covering the house's classical significations (1=body/vitality, 2=wealth/speech, 3=siblings/courage, 4=mother/home, 5=children/intellect, 6=enemies/service, 7=spouse/partnership, 8=longevity/transformation, 9=dharma/guru, 10=career/status, 11=gains/networks, 12=loss/moksha).
- The dropdown should re-render the results onchange without reloading the page.

FEATURE 3 — New hamburger page "Divisional Varga" (pageVarga). Add button in .hamburger-menu-list after the Dasha button: <button type="button" data-page="pageVarga" data-i18n="navVarga">Divisional Varga</button>. Add <div id="pageVarga" class="page"><div class="result-col" id="vargaPageContent" style="max-width:1000px; margin:0 auto;"></div></div> near the other page divs. Write renderVargaPage() and wire it into the page-switching logic (find where renderNatalPage etc. are called on navigation).

renderVargaPage must compute these classical divisions of the Moon's sidereal longitude AND the Lagna degree (both available via computePositions at the natal moment used elsewhere in the app — reuse getReferencePanchaka() or the same jd/positions pattern renderNatalPage uses):
- D1 Rasi: sign itself
- D2 Hora: rule — for odd signs, first half (0-15°)=Sun's hora Leo, second half=Moon's hora Cancer; for even signs reversed (first=Cancer/Moon, second=Leo/Sun)
- D3 Drekkana: each 10° → sign+4 mod 12 (i.e., start from the sign itself, 2nd drekkana = 5th sign from it, 3rd = 9th from it)
- D4 Chaturthamsha: each 7.5° → sign+3 mod 12
- D7 Saptamsha: each 4°17'8.57"; odd signs start from same sign, even signs start from 7th sign
- D9 Navamsha: each 3°20'; fire signs (Ar/Le/Sg) start Aries, earth (Ta/Vi/Cp) start Capricorn, air (Ge/Li/Aq) start Libra, water (Cn/Sc/Pi) start Cancer
- D10 Dasamsha: each 3°; odd signs count from same sign, even from 9th sign
- D12 Dwadashamsha: each 2.5° → start from the sign itself, count forward
- D16 Shodasamsha: each 1°52'30"; movable signs start Aries, fixed start Leo, dual start Sagittarius
- D20 Vimshamsha: each 1°30'; movable start Aries, fixed start Sagittarius, dual start Leo
- D24 Chaturvimshamsha: each 1°15'; odd signs start Leo, even start Cancer
- D27 Bhamsha/Nakshatramsha: each 1°6'40"; fiery signs start Aries, earthy start Cancer, airy start Libra, watery start Capricorn
- D30 Trimshamsha: odd signs — 0-5 Mars(Aries), 5-10 Saturn(Aquarius), 10-18 Jupiter(Sagittarius), 18-25 Mercury(Gemini), 25-30 Venus(Libra); even signs reversed order starting Cancer
- D40 Khavedamsha: each 0°45'; odd signs start Aries, even start Libra
- D45 Akshavedamsha: each 0°40'; movable start Aries, fixed start Leo, dual start Sagittarius
- D60 Shashtiamsha: each 0°30'; compute sign = (sign*12 + floor(degree_in_sign*2)) mod 12 counted from the sign itself... actually standard: ignore sign, take (longitude_degrees * 2) mod 12 as sign index from Aries.

Display: a dropdown to pick which varga (default D9 Navamsha), then a small North Indian diamond chart (reuse the existing CH/HOUSE_POLY geometry if accessible, else a simple table) showing which planets fall in which signs of that division, plus a table listing planet | longitude | divisional sign for all 16 vargas.

Each varga entry should include its classical purpose line: D1 body, D2 wealth, D3 siblings, D4 fortune/property, D7 children/progeny, D9 spouse/dharma, D10 career/power, D12 parents, D16 vehicles/comforts, D20 spiritual pursuits, D24 education/learning, D27 strengths/weaknesses, D30 misfortunes/evils, D40 maternal legacy, D45 paternal legacy, D60 all matters/karma.

FEATURE 4 — "House Nature Reading" new hamburger page (pageHouseNature). Button label: House Readings. This page has a dropdown of houses 1-12, and for the selected house shows detailed classical readings organized in sub-dropdowns:
- "Sign occupying" (rashi nature: element/tattva, modality/movable-fixed-dual, gender odd/even, caste as per BPHS ch.4)
- "Lord of the house" (lord name, its own signs, exaltation sign and degree, debilitation sign and degree, friend/enemy planets per standard planetary friendship tables)
- "Placement of lord" (which house the lord occupies natally and what that combines: e.g., "4th lord in 10th = career tied to home/mother, property through profession")
- "Aspects received" (list which planets aspect this house by whole-sign Graha Drishti: all planets aspect the 7th from themselves; Mars additionally 4 & 8; Jupiter 5 & 9; Saturn 3 & 10; Rahu/Ketu 5 & 9 per some traditions - note this app uses whole-sign aspects)
Use BPHS ch.4 sign descriptions and standard bhava significations. All text bilingual-ready using the T() helper if present.

Do NOT touch any other features. Keep code style consistent with the file (var declarations, template literals with ${}, T() for i18n). After implementing, run your own headless vm regression to verify all script blocks still parse and the new functions load.