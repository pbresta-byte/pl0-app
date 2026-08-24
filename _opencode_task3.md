Restructure the House Lord Results panel (in renderNatalPage) and the Varga readings panel (in renderVargaPage) to match Parashara's Light 9's report style: a bold placement heading followed by interpretation blocks grouped BY SOURCE.

The data is already in the file as BPHS_LORD_PLACEMENTS — an object keyed [lordBhava][placementHouse] with {verse, text}. Bhava names in Sanskrit order: Tanu(1), Dhan(2), Sahaj(3), Bandhu(4), Putr(5), Ari(6), Yuvati(7), Randhr(8), Dharm(9), Karm(10), Labh(11), Vyaya(12).

For the House Lord Results panel, when house H is selected:
1. Compute lord = SIGN_LORDS[sign of house H], and placement house P where that lord sits natally.
2. Look up BPHS_LORD_PLACEMENTS[LORD_BHAVA_NAMES[H]][P] (map house number 1-12 to bhava name).
3. Render in PL9 style:

  <b>The lord of the Hth house is in the Pth house.</b>
  <i>Parashara Hora</i> (BPHS ch.24 v.verse)
  "text from table"

4. Below that, add collapsible sections for additional classical sources present in the corpus, each with a one-line note that the full verse text is available in the corpus edition cited. Sources to list: Satya Jatakam, Phala Dipika, Jataka Parijata, Garga Hora (mark "see corpus" with file names). Do NOT fabricate their verse texts — only BPHS has extracted verses; label others as reference pointers.

5. Keep the existing dignity/kendra/trikona info as a compact kv-table ABOVE the source blocks.

For the Varga readings panel, restructure similarly: bold heading "<Planet> in <Sign> in <varga name>" then a single template-reading block labeled "Template reading (synthesis)" — keep existing content but styled like PL9's report.

Style notes: use italic serif for source headings, bold for the placement statement, blockquote-style indentation for verse text. Match existing app CSS variables.
