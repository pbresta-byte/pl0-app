"""Generate bundled, offline app locales with local OPUS-MT models.

The translator runs only during locale generation. The app receives plain JS
dictionary files and makes no translation API or model calls at runtime.
"""
import json
import os
import re
import sys
from pathlib import Path
from html.parser import HTMLParser

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "www" / "index.html"
OUT = ROOT / "www"
MAX_INPUT_TOKENS = 480
BATCH_SIZE = 16
class VisibleTextParser(HTMLParser):
    """Collect literal page copy, while ignoring executable and hidden text."""
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.skip = []
        self.values = set()
    def handle_starttag(self, tag, attrs):
        if tag in {"script", "style", "noscript"}:
            self.skip.append(tag)
    def handle_endtag(self, tag):
        if self.skip and self.skip[-1] == tag:
            self.skip.pop()
    def handle_data(self, data):
        # HTMLParser already decodes character references with convert_charrefs.
        text = data.strip()
        if not self.skip and 2 <= len(text) <= 500 and re.search(r"[A-Za-z]", text):
            self.values.add(text)

MODELS = {
    "hi": ("Helsinki-NLP/opus-mt-en-hi", "Apache-2.0"),
    "fr": ("Helsinki-NLP/opus-mt-en-fr", "Apache-2.0"),
    "de": ("Helsinki-NLP/opus-mt-en-de", "CC-BY-4.0"),
    "ru": ("Helsinki-NLP/opus-mt-en-ru", "Apache-2.0"),
    "it": ("Helsinki-NLP/opus-mt-en-it", "Apache-2.0"),
    "zh": ("Helsinki-NLP/opus-mt-en-zh", "Apache-2.0"),
    "ko": ("Helsinki-NLP/opus-mt-tc-big-en-ko", "CC-BY-4.0"),
}

# Canonical Jyotish terminology. Hindi uses established Devanagari forms;
# other locales keep the Sanskrit form so MT cannot substitute a misleading
# Western-astrology word for a tradition-specific concept.
SANSKRIT_TERMS = {
    "Sarvato Bhadra Chakra": "सर्वतोभद्र चक्र", "Pañcha Pakshi": "पंचपक्षी",
    "Pancha Pakshi": "पंचपक्षी", "Janma Pañcaka": "जन्म पंचक",
    "Pañcāṅga": "पंचांग", "Panchanga": "पंचांग", "Panchang": "पंचांग",
    "Ayanāṃśa": "अयनांश", "Ayanamsa": "अयनांश", "Tārā Bala": "तारा बल",
    "Tara Bala": "तारा बल", "Muhūrta": "मुहूर्त", "Muhurta": "मुहूर्त",
    "Nakṣatra": "नक्षत्र", "Nakshatra": "नक्षत्र", "Rāśi": "राशि", "Rashi": "राशि",
    "Karaṇa": "करण", "Karana": "करण", "Navāṃśa": "नवांश", "Navamsha": "नवांश",
    "Vimśottari": "विंशोत्तरी", "Mahādaśā": "महादशा", "Daśā": "दशा", "Dasha": "दशा",
    "Tithi": "तिथि", "Lagna": "लग्न", "Bhāva": "भाव", "Bhava": "भाव",
    "Dṛṣṭi": "दृष्टि", "Drishti": "दृष्टि", "Upagraha": "उपग्रह", "Gochar": "गोचर",
    "Graha": "ग्रह", "Kendra": "केंद्र", "Trikona": "त्रिकोण", "Dusthana": "दुःस्थान",
    "Uttama": "उत्तम", "Madhyama": "मध्यम", "Sama": "सम", "Ashubha": "अशुभ",
    "Varjya": "वर्ज्य", "Riktha Tithi": "रिक्ता तिथि", "Amāvasyā": "अमावस्या",
    "Pūrṇimā": "पूर्णिमा", "Mūlatrikoṇa": "मूलत्रिकोण", "Mula Trikona": "मूलत्रिकोण",
}
PLANET_NAMES = {
    "hi": {"Sun":"सूर्य","Moon":"चंद्रमा","Mars":"मंगल","Mercury":"बुध","Jupiter":"बृहस्पति","Venus":"शुक्र","Saturn":"शनि","Rahu":"राहु","Ketu":"केतु"},
    "fr": {"Sun":"Soleil","Moon":"Lune","Mars":"Mars","Mercury":"Mercure","Jupiter":"Jupiter","Venus":"Vénus","Saturn":"Saturne","Rahu":"Rahu","Ketu":"Ketu"},
    "de": {"Sun":"Sonne","Moon":"Mond","Mars":"Mars","Mercury":"Merkur","Jupiter":"Jupiter","Venus":"Venus","Saturn":"Saturn","Rahu":"Rahu","Ketu":"Ketu"},
    "ru": {"Sun":"Солнце","Moon":"Луна","Mars":"Марс","Mercury":"Меркурий","Jupiter":"Юпитер","Venus":"Венера","Saturn":"Сатурн","Rahu":"Раху","Ketu":"Кету"},
    "it": {"Sun":"Sole","Moon":"Luna","Mars":"Marte","Mercury":"Mercurio","Jupiter":"Giove","Venus":"Venere","Saturn":"Saturno","Rahu":"Rahu","Ketu":"Ketu"},
    "zh": {"Sun":"太阳","Moon":"月亮","Mars":"火星","Mercury":"水星","Jupiter":"木星","Venus":"金星","Saturn":"土星","Rahu":"罗睺","Ketu":"计都"},
    "ko": {"Sun":"태양","Moon":"달","Mars":"화성","Mercury":"수성","Jupiter":"목성","Venus":"금성","Saturn":"토성","Rahu":"라후","Ketu":"케투"},
}
SIGN_NAMES = {
    "hi": ["मेष","वृषभ","मिथुन","कर्क","सिंह","कन्या","तुला","वृश्चिक","धनु","मकर","कुंभ","मीन"],
    "fr": ["Bélier","Taureau","Gémeaux","Cancer","Lion","Vierge","Balance","Scorpion","Sagittaire","Capricorne","Verseau","Poissons"],
    "de": ["Widder","Stier","Zwillinge","Krebs","Löwe","Jungfrau","Waage","Skorpion","Schütze","Steinbock","Wassermann","Fische"],
    "ru": ["Овен","Телец","Близнецы","Рак","Лев","Дева","Весы","Скорпион","Стрелец","Козерог","Водолей","Рыбы"],
    "it": ["Ariete","Toro","Gemelli","Cancro","Leone","Vergine","Bilancia","Scorpione","Sagittario","Capricorno","Acquario","Pesci"],
    "zh": ["白羊座","金牛座","双子座","巨蟹座","狮子座","处女座","天秤座","天蝎座","射手座","摩羯座","水瓶座","双鱼座"],
    "ko": ["양자리","황소자리","쌍둥이자리","게자리","사자자리","처녀자리","천칭자리","전갈자리","사수자리","염소자리","물병자리","물고기자리"],
}
WEEKDAYS = {
    "hi": ["रविवार","सोमवार","मंगलवार","बुधवार","गुरुवार","शुक्रवार","शनिवार"],
    "fr": ["dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"],
    "de": ["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"],
    "ru": ["воскресенье","понедельник","вторник","среда","четверг","пятница","суббота"],
    "it": ["domenica","lunedì","martedì","mercoledì","giovedì","venerdì","sabato"],
    "zh": ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"],
    "ko": ["일요일","월요일","화요일","수요일","목요일","금요일","토요일"],
}
DIRECT_LABELS = {
    "hi": {"Movable":"चर राशि","Fixed":"स्थिर राशि","Dual":"द्विस्वभाव राशि","Birth date":"जन्म तिथि","Calendar":"पंचांग","Save":"सहेजें","Fire":"अग्नि","Earth":"पृथ्वी","Air":"वायु","Water":"जल","special aspect":"विशेष दृष्टि","App language":"ऐप की भाषा","Calculation options":"गणना के विकल्प","Reset to demo values":"डेमो मानों पर रीसेट करें","Options":"विकल्प","At a Glance":"एक नज़र में","Location":"स्थान","Name (optional)":"नाम (वैकल्पिक)","Choose the language used throughout the app. Your choice is saved on this device.":"पूरे ऐप में इस्तेमाल होने वाली भाषा चुनें। आपकी पसंद इस डिवाइस पर सहेजी जाएगी।"},
    "fr": {"Movable":"Cardinal","Fixed":"Fixe","Dual":"Mutable","Birth date":"Date de naissance","Calendar":"Calendrier","Save":"Enregistrer","Fire":"Feu","Earth":"Terre","Air":"Air","Water":"Eau","special aspect":"aspect spécial","App language":"Langue de l’application","Calculation options":"Options de calcul","Reset to demo values":"Réinitialiser les valeurs de démonstration","Options":"Options","At a Glance":"Aperçu","Location":"Lieu","Name (optional)":"Nom (facultatif)","Choose the language used throughout the app. Your choice is saved on this device.":"Choisissez la langue de l’application. Votre choix est enregistré sur cet appareil."},
    "de": {"Movable":"Kardinal","Fixed":"Fix","Dual":"Beweglich","Birth date":"Geburtsdatum","Calendar":"Kalender","Save":"Speichern","Fire":"Feuer","Earth":"Erde","Air":"Luft","Water":"Wasser","special aspect":"besonderer Aspekt","App language":"App-Sprache","Calculation options":"Berechnungsoptionen","Reset to demo values":"Auf Demowerte zurücksetzen","Options":"Einstellungen","At a Glance":"Auf einen Blick","Location":"Standort","Name (optional)":"Name (optional)","Choose the language used throughout the app. Your choice is saved on this device.":"Wählen Sie die Sprache der App. Ihre Auswahl wird auf diesem Gerät gespeichert."},
    "ru": {"Movable":"Кардинальный","Fixed":"Фиксированный","Dual":"Мутабельный","Birth date":"Дата рождения","Calendar":"Календарь","Save":"Сохранить","Fire":"Огонь","Earth":"Земля","Air":"Воздух","Water":"Вода","special aspect":"особый аспект","App language":"Язык приложения","Calculation options":"Параметры расчёта","Reset to demo values":"Сбросить до демонстрационных значений","Options":"Настройки","At a Glance":"Краткий обзор","Location":"Местоположение","Name (optional)":"Имя (необязательно)","Choose the language used throughout the app. Your choice is saved on this device.":"Выберите язык приложения. Выбор сохранится на этом устройстве."},
    "it": {"Movable":"Cardinale","Fixed":"Fisso","Dual":"Mutevole","Birth date":"Data di nascita","Calendar":"Calendario","Save":"Salva","Fire":"Fuoco","Earth":"Terra","Air":"Aria","Water":"Acqua","special aspect":"aspetto speciale","App language":"Lingua dell’app","Calculation options":"Opzioni di calcolo","Reset to demo values":"Ripristina i valori di esempio","Options":"Opzioni","At a Glance":"Panoramica","Location":"Luogo","Name (optional)":"Nome (facoltativo)","Choose the language used throughout the app. Your choice is saved on this device.":"Scegli la lingua dell’app. La scelta verrà salvata su questo dispositivo."},
    "zh": {"Movable":"本位星座","Fixed":"固定星座","Dual":"变动星座","Birth date":"出生日期","Calendar":"日历","Save":"保存","Fire":"火象","Earth":"土象","Air":"风象","Water":"水象","special aspect":"特殊相位","App language":"应用语言","Calculation options":"计算选项","Reset to demo values":"重置为演示值","Options":"选项","At a Glance":"一览","Location":"位置","Name (optional)":"姓名（选填）","Choose the language used throughout the app. Your choice is saved on this device.":"选择应用语言。您的选择会保存在此设备上。"},
    "ko": {"Movable":"활동궁","Fixed":"고정궁","Dual":"변통궁","Birth date":"출생일","Calendar":"달력","Save":"저장","Fire":"불","Earth":"땅","Air":"바람","Water":"물","special aspect":"특별한 각","App language":"앱 언어","Calculation options":"계산 옵션","Reset to demo values":"데모 값으로 초기화","Options":"옵션","At a Glance":"한눈에 보기","Location":"위치","Name (optional)":"이름 (선택 사항)","Choose the language used throughout the app. Your choice is saved on this device.":"앱에서 사용할 언어를 선택하세요. 선택한 언어는 이 기기에 저장됩니다."},
}

def unescape_js(value):
    return (value.replace("\\'", "'").replace('\\"', '"')
            .replace("\\\\", "\\").replace("\\n", "\n").replace("\\t", "\t"))

def parse_template(value):
    slots, out, i = [], [], 0
    while i < len(value):
        if value.startswith("${", i):
            depth, j, quote = 1, i + 2, None
            while j < len(value) and depth:
                c = value[j]
                if quote:
                    if c == "\\": j += 2; continue
                    if c == quote: quote = None
                elif c in "'\"": quote = c
                elif c == "{": depth += 1
                elif c == "}": depth -= 1
                j += 1
            if depth == 0:
                token = f"ZXQHIVAR{len(slots):03d}ZXQ"
                slots.append(value[i:j]); out.append(token); i = j; continue
        out.append(value[i]); i += 1
    normalized = "".join(out)
    return normalized, re.split(r"ZXQHIVAR\d{3}ZXQ", normalized), len(slots)

def collect_source_texts(source):
    values, templates = set(), {}
    visible = VisibleTextParser()
    visible.feed(source)
    values.update(visible.values)
    call_re = re.compile(r"\b(?:T|tr)\(\s*(`(?:\\.|[^`])*`|'(?:\\.|[^'\\])*'|\"(?:\\.|[^\"\\])*\")", re.S)
    for match in call_re.finditer(source):
        raw = match.group(1)
        value = unescape_js(raw[1:-1])
        normalized, parts, count = parse_template(value) if raw.startswith("`") else (value, [], 0)
        values.add(normalized)
        if count:
            templates[normalized] = {"parts": parts, "slots": count}

    # Keyed static copy and English text in source data records (including the
    # horary outcomes) are also translated through the same exact-text lookup.
    i18n_start = source.find("const I18N = {")
    i18n_end = source.find("\n};", i18n_start)
    if i18n_start >= 0 and i18n_end > i18n_start:
        block = source[i18n_start:i18n_end]
        values.update(unescape_js(m.group(1)) for m in re.finditer(r"\ben\s*:\s*`((?:\\.|[^`])*)`", block, re.S))
    values.update(unescape_js(m.group(2)) for m in re.finditer(r"\ben\s*:\s*(['\"])((?:\\.|(?!\1).)*)\1", source, re.S))

    # Include labels, descriptions and brief prose stored as data fields and
    # later passed to T() indirectly (e.g. dignity and Pakṣi state records).
    field_re = re.compile(r"\b(?:label|gist|result|detail|description|indication|reading|message|hint|purpose|title|text|summary|note)\s*:\s*(['\"])((?:\\.|(?!\1).)*)\1", re.S)
    for m in field_re.finditer(source):
        text = unescape_js(m.group(2)).strip()
        if 2 <= len(text) <= 1400 and re.search(r"[A-Za-z]", text): values.add(text)
    # Include labels used as object keys in the existing English/Spanish
    # terminology and result maps. These values are often passed indirectly
    # to T(), so collecting only call arguments would leave them untranslated.
    for declaration in re.finditer(r"const\s+[A-Z0-9_]+_ES\s*=\s*\{", source):
        end = source.find("\n};", declaration.end())
        if end < 0:
            continue
        block = source[declaration.end():end]
        key_re = re.compile(r"(?:^|[,\n])\s*(?:['\"]([^'\"]+)['\"]|([A-Za-z][A-Za-z0-9_ -]*))\s*:", re.M)
        for key in key_re.finditer(block):
            text = unescape_js(key.group(1) or key.group(2)).strip()
            if 2 <= len(text) <= 100 and re.search(r"[A-Za-z]", text): values.add(text)
    return sorted(v for v in values if v.strip()), templates

def source_terms(locale):
    terms = dict(SANSKRIT_TERMS if locale == "hi" else {k:k for k in SANSKRIT_TERMS})
    terms.update(PLANET_NAMES[locale])
    # Map common Sanskrit/English sign labels to their familiar local forms.
    for english, local in zip(["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"], SIGN_NAMES[locale]):
        terms[english] = local
    return terms

def collapse_repetition(text, locale):
    """Remove pathological short-token loops produced by the zh OPUS model."""
    if locale != "zh" or len(text) < 9:
        return text
    output, index = [], 0
    while index < len(text):
        found = False
        max_width = min(60, (len(text) - index) // 3)
        for width in range(1, max_width + 1):
            unit = text[index:index+width]
            repeats = 1
            while text.startswith(unit, index + repeats*width):
                repeats += 1
            if repeats >= 3:
                output.append(unit)
                index += repeats*width
                found = True
                break
        if not found:
            output.append(text[index])
            index += 1
    return "".join(output)

def repair_exact_terminology(exact, texts, terms, locale):
    """Replace outputs with mangled/dropped protected terms by safe source text."""
    all_terms = terms
    terms = {key: value for key, value in all_terms.items() if key in SANSKRIT_TERMS}
    term_re = re.compile(r"(?<![A-Za-z])(" + "|".join(map(re.escape, sorted(terms, key=len, reverse=True))) + r")(?![A-Za-z])", re.I)
    safe_re = re.compile(r"(?<![A-Za-z])(" + "|".join(map(re.escape, sorted(all_terms, key=len, reverse=True))) + r")(?![A-Za-z])", re.I)
    canonical = {key.lower(): key for key in terms}
    safe_canonical = {key.lower(): key for key in all_terms}
    repaired = 0
    for text in texts:
        translated = exact.get(text, text)
        expected = []
        for match in term_re.finditer(text):
            key = canonical.get(match.group(0).lower())
            if key and terms[key] not in expected:
                expected.append(terms[key])
        malformed = "ZXQ" in translated or "HITERM" in translated or any(term not in translated for term in expected)
        if malformed:
            exact[text] = safe_re.sub(lambda m: all_terms[safe_canonical[m.group(0).lower()]], text)
            repaired += 1
    return repaired

def protect(text, locale):
    found = []
    all_terms = source_terms(locale)
    # Let the MT model translate common planets and zodiac signs naturally;
    # reserve placeholders for Jyotish-specific concepts whose wording must
    # remain tradition-aware (lagna, nakṣatra, daśā, etc.).
    terms = {key: value for key, value in all_terms.items() if key in SANSKRIT_TERMS}
    term_re = re.compile(r"(?<![A-Za-z])(" + "|".join(map(re.escape, sorted(terms, key=len, reverse=True))) + r")(?![A-Za-z])", re.I)
    def sub(m):
        matched = m.group(0)
        canonical = next((k for k in terms if k.lower() == matched.lower()), matched)
        token = f"ZXQHITERM{len(found):03d}ZXQ"
        found.append((token, terms[canonical]))
        return token
    text = term_re.sub(sub, text)
    tags = []
    text = re.sub(r"</?[A-Za-z][^>]*>", lambda m: tags.append(m.group(0)) or f"ZXQHITAG{len(tags)-1:03d}ZXQ", text)
    return text, found, tags

def split_long(text, tokenizer):
    if len(tokenizer(text, add_special_tokens=True, truncation=False)["input_ids"]) <= MAX_INPUT_TOKENS:
        return [text]
    chunks, rest = [], text
    while rest:
        # Pick a punctuation boundary near a safe character budget; preserve
        # punctuation and spaces so output concatenates naturally.
        limit = min(850, len(rest))
        points = [rest.rfind(mark, 0, limit) for mark in (". ", "? ", "! ", "; ", " — ", ", ")]
        cut = max(points)
        if cut < 180: cut = rest.rfind(" ", 0, limit)
        if cut < 1: cut = min(450, len(rest))
        width = 2 if rest[cut:cut+2] in (". ", "? ", "! ", "; ") else 3 if rest[cut:cut+3] == " — " else 2 if rest[cut:cut+2] == ", " else 1
        part, rest = rest[:cut+width], rest[cut+width:]
        if len(tokenizer(part, add_special_tokens=True, truncation=False)["input_ids"]) > MAX_INPUT_TOKENS:
            # Hard split only as a last resort; keep a marker token intact.
            while part and (part[-1].isalnum() or part[-1] == "_"):
                rest = part[-1:] + rest; part = part[:-1]
        chunks.append(part)
    return chunks

def translate_text(model, tokenizer, source, locale):
    protected, term_tokens, tag_tokens = protect(source, locale)
    pieces = split_long(protected, tokenizer)
    outputs = []
    for start in range(0, len(pieces), BATCH_SIZE):
        batch = tokenizer(pieces[start:start+BATCH_SIZE], return_tensors="pt", padding=True, truncation=True, max_length=MAX_INPUT_TOKENS)
        generated = model.generate(**batch, max_new_tokens=MAX_INPUT_TOKENS, num_beams=1)
        outputs.extend(tokenizer.batch_decode(generated, skip_special_tokens=True))
    translated = "".join(outputs)
    for token, term in term_tokens:
        translated = translated.replace(token, term)
    for i, tag in enumerate(tag_tokens):
        translated = translated.replace(f"ZXQHITAG{i:03d}ZXQ", tag)
    # Remove spaces before punctuation commonly introduced by MT.
    translated = re.sub(r"\s+([,.;:!?।，。！？])", r"\1", translated).strip()
    return translated

def translate_texts(model, tokenizer, sources, locale):
    """Translate source strings in batches while preserving per-string markers."""
    prepared, owners = [], []
    state = []
    for owner, source in enumerate(sources):
        protected, term_tokens, tag_tokens = protect(source, locale)
        pieces = split_long(protected, tokenizer)
        state.append({"pieces": len(pieces), "outputs": [], "terms": term_tokens, "tags": tag_tokens})
        for piece in pieces:
            prepared.append(piece)
            owners.append(owner)
    for start in range(0, len(prepared), BATCH_SIZE):
        batch = tokenizer(prepared[start:start+BATCH_SIZE], return_tensors="pt", padding=True,
                          truncation=True, max_length=MAX_INPUT_TOKENS)
        generated = model.generate(**batch, max_new_tokens=MAX_INPUT_TOKENS, num_beams=1)
        for owner, translated in zip(owners[start:start+BATCH_SIZE], tokenizer.batch_decode(generated, skip_special_tokens=True)):
            state[owner]["outputs"].append(translated)
    results = []
    for entry in state:
        translated = "".join(entry["outputs"])
        for token, term in entry["terms"]:
            translated = translated.replace(token, term)
        for i, tag in enumerate(entry["tags"]):
            translated = translated.replace(f"ZXQHITAG{i:03d}ZXQ", tag)
        translated = re.sub(r"\s+([,.;:!?।，。！？])", r"\1", translated).strip()
        results.append(translated)
    return results

def main():
    sys.stdout.reconfigure(encoding="utf-8")
    source = SOURCE.read_text(encoding="utf-8")
    texts, templates = collect_source_texts(source)
    print(f"Found {len(texts)} source strings ({sum(len(t) for t in texts):,} chars) and {len(templates)} dynamic templates", flush=True)
    import torch
    from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
    torch.set_num_threads(min(8, os.cpu_count() or 1))

    selected_locales = {item.strip() for item in os.environ.get("PL0_LOCALES", "").split(",") if item.strip()}
    for locale, (model_id, license_name) in MODELS.items():
        if selected_locales and locale not in selected_locales:
            continue
        print(f"Loading {model_id} for {locale}…", flush=True)
        tokenizer = AutoTokenizer.from_pretrained(model_id)
        model = AutoModelForSeq2SeqLM.from_pretrained(model_id)
        exact = {}
        ordered_texts = sorted(texts, key=lambda text: len(tokenizer(text, add_special_tokens=True, truncation=False)["input_ids"]))
        for start in range(0, len(ordered_texts), BATCH_SIZE):
            group = ordered_texts[start:start+BATCH_SIZE]
            exact.update(zip(group, translate_texts(model, tokenizer, group, locale)))
            completed = min(start + len(group), len(ordered_texts))
            if completed % 100 < BATCH_SIZE or completed == len(ordered_texts):
                print(f"{locale}: translated {completed}/{len(ordered_texts)}", flush=True)

        terms = source_terms(locale)
        for key, value in PLANET_NAMES[locale].items(): exact.setdefault(key, value)
        for month, name in zip(["January","February","March","April","May","June","July","August","September","October","November","December"],
                               {"hi":["जनवरी","फ़रवरी","मार्च","अप्रैल","मई","जून","जुलाई","अगस्त","सितंबर","अक्टूबर","नवंबर","दिसंबर"],
                                "fr":["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"],
                                "de":["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"],
                                "ru":["январь","февраль","март","апрель","май","июнь","июль","август","сентябрь","октябрь","ноябрь","декабрь"],
                                "it":["gennaio","febbraio","marzo","aprile","maggio","giugno","luglio","agosto","settembre","ottobre","novembre","dicembre"],
                                "zh":["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],
                                "ko":["1월","2월","3월","4월","5월","6월","7月","8월","9월","10월","11월","12월"]}[locale]):
            exact.setdefault(month, name)
        exact.update({day: WEEKDAYS[locale][i] for i,day in enumerate(["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"])})
        exact.update(DIRECT_LABELS[locale])
        exact = {key: collapse_repetition(value, locale) for key,value in exact.items()}
        if locale == "hi":
            overrides_path = ROOT / "tools" / "hindi-overrides.json"
            if overrides_path.exists():
                exact.update(json.loads(overrides_path.read_text(encoding="utf-8")))

        # Add exact entries for terminology-only labels and guard every
        # translated string against lost or mangled protected terms.
        exact.update(terms)
        repaired = repair_exact_terminology(exact, texts, terms, locale)
        print(f"{locale}: repaired {repaired} strings with unsafe terminology placeholders", flush=True)

        # Replace interpolation markers in translated templates only at runtime.
        template_records = []
        for normalized, meta in templates.items():
            if normalized in exact:
                if any(f"ZXQHIVAR{i:03d}ZXQ" not in exact[normalized] for i in range(meta["slots"])):
                    # Never ship a mangled interpolation marker; keep this
                    # template readable in English if the model drops one.
                    exact[normalized] = normalized
                template_records.append({"parts":meta["parts"],"value":exact[normalized]})

        # Carefully fixed safety copy. The app's shared policy guard also runs
        # on English source text before any locale translation is returned.
        policy = {
            "hi": "केवल पारंपरिक व्याख्याएँ; परिणामों की कोई गारंटी नहीं, और यह चिकित्सा, वित्तीय या कानूनी सलाह नहीं है।",
            "fr": "Interprétations traditionnelles uniquement ; aucun résultat n’est garanti et ceci ne constitue pas un conseil médical, financier ou juridique.",
            "de": "Nur traditionelle Deutungen; Ergebnisse werden nicht garantiert. Dies ist keine medizinische, finanzielle oder rechtliche Beratung.",
            "ru": "Только традиционные толкования; результаты не гарантируются. Это не медицинская, финансовая или юридическая консультация.",
            "it": "Solo interpretazioni tradizionali; nessun risultato è garantito e non si tratta di consulenza medica, finanziaria o legale.",
            "zh": "仅供传统诠释；不保证任何结果，也不构成医疗、财务或法律建议。",
            "ko": "전통적 해석만을 제공합니다. 결과를 보장하지 않으며 의료·재정·법률 조언이 아닙니다。",
        }[locale]
        exact["Traditional interpretations only; no guaranteed outcomes or medical, financial or legal advice."] = policy
        payload = {"locale":locale,"model":model_id,"license":license_name,"exact":exact,"terms":terms,"templates":template_records}
        output = OUT / f"pl0-i18n-{locale}.js"
        output.write_text("window.PL0_I18N_" + locale.upper() + " = " + json.dumps(payload, ensure_ascii=False, separators=(",",":")) + ";\n", encoding="utf-8")
        print(f"Wrote {output} ({len(exact)} exact strings, {len(template_records)} templates)", flush=True)
        del model, tokenizer
        if torch.cuda.is_available(): torch.cuda.empty_cache()

def repair_existing_locales():
    source = SOURCE.read_text(encoding="utf-8")
    texts, _ = collect_source_texts(source)
    repaired_total = 0
    for locale in MODELS:
        path = OUT / f"pl0-i18n-{locale}.js"
        if not path.exists():
            print(f"skip {locale}: pack not generated yet", flush=True)
            continue
        content = path.read_text(encoding="utf-8")
        payload = json.loads(content[len(f"window.PL0_I18N_{locale.upper()} = "):content.rfind(";")])
        terms = payload.get("terms", {})
        repaired = repair_exact_terminology(payload["exact"], texts, terms, locale)
        payload["exact"].update(terms)
        payload["exact"].update(DIRECT_LABELS[locale])
        payload["exact"] = {key:collapse_repetition(value, locale) for key,value in payload["exact"].items()}
        for record in payload.get("templates", []):
            parts = record["parts"]
            key = "".join(part + (f"ZXQHIVAR{i:03d}ZXQ" if i < len(parts)-1 else "") for i,part in enumerate(parts))
            value = payload["exact"].get(key, key)
            if any(f"ZXQHIVAR{i:03d}ZXQ" not in value for i in range(len(parts)-1)):
                value = key
            record["value"] = value
        path.write_text("window.PL0_I18N_" + locale.upper() + " = " + json.dumps(payload, ensure_ascii=False, separators=(",", ":")) + ";\n", encoding="utf-8")
        print(f"{locale}: repaired {repaired} terminology strings", flush=True)
        repaired_total += repaired
    print(f"Repaired {repaired_total} locale strings total", flush=True)

if __name__ == "__main__":
    repair_existing_locales() if "--repair-only" in sys.argv else main()
