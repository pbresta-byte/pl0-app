#!/usr/bin/env python3
"""BFS crawler for barbarapijan.com -> plain-text corpus."""
import csv, gzip, html, io, os, re, sys, time, urllib.request, urllib.error
from collections import deque
from urllib.parse import urljoin, urlparse

BASE = "https://www.barbarapijan.com"
OUTDIR = os.path.dirname(os.path.abspath(__file__))
CAP = 2500
DELAY = 1.0
PATTERNS = ["Graha", "Rashi_Lagna", "Bhava", "Nakshatra_radical", "Nakshatra_Chandra",
            "VimshottariDasha", "Amsha", "Varga", "Marriage", "Vocation", "Goldhord",
            "Divination", "Practice_Issues", "Graha_Yoga_Combi", "Spirituality",
            "Ratna_Jewel", "Politics", "Writers", "Death", "Commerce"]
SKIP_RE = re.compile(r"\.(jpg|jpeg|png|gif|bmp|css|js|ico|pdf|zip|mp3|wav|swf)(\?|$)|paypal|mailto:", re.I)
CONTENT_RE = re.compile("|".join(PATTERNS))
TAG_RE = re.compile(r"<script.*?</script>|<style.*?</style>", re.S | re.I)
TAG2_RE = re.compile(r"<br\s*/?>", re.I)
TAG3_RE = re.compile(r"</p>|</div>|</tr>|</li>|</h[1-6]>", re.I)
STRIP_RE = re.compile(r"<[^>]+>")

def fetch(url, timeout=30):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (research-corpus-crawler)",
                                               "Accept-Encoding": "gzip, identity"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        data = r.read()
    if data[:2] == b"\x1f\x8b":
        try:
            data = gzip.GzipFile(fileobj=io.BytesIO(data)).read()
        except OSError:
            pass
    return data

def to_text(raw_bytes):
    try:
        s = raw_bytes.decode("utf-8")
    except UnicodeDecodeError:
        s = raw_bytes.decode("latin-1", errors="ignore")
    if "<html" not in s.lower() and "<body" not in s.lower() and "<loc>" in s:
        return None  # sitemap handled separately
    s = TAG_RE.sub(" ", s)
    s = TAG2_RE.sub("\n", s)
    s = TAG3_RE.sub("\n\n", s)
    s = STRIP_RE.sub(" ", s)
    s = html.unescape(s)
    s = re.sub(r"[ \t]+", " ", s)
    s = re.sub(r"\n\s*\n\s*\n+", "\n\n", s)
    return "\n".join(line.strip() for line in s.splitlines()).strip()

def outfile_for(url):
    p = urlparse(url).path.strip("/")
    name = p.replace("/", "__").replace("\\", "__")
    return name + ".txt"

def extract_links(text, base_url):
    out = []
    for m in re.finditer(r'href=["\']([^"\'#]+)["\']', text, re.I):
        u = urljoin(base_url, m.group(1).strip())
        pu = urlparse(u)
        if pu.scheme not in ("http", "https") or "barbarapijan.com" not in pu.netloc:
            continue
        u = f"{pu.scheme}://{pu.netloc}{pu.path}"
        if SKIP_RE.search(u):
            continue
        out.append(u)
    return out

def main():
    manifest_path = os.path.join(OUTDIR, "manifest.csv")
    done = {}
    new_file = not os.path.exists(manifest_path) or os.path.getsize(manifest_path) == 0
    if not new_file:
        with open(manifest_path, newline="", encoding="utf-8") as f:
            for row in csv.DictReader(f):
                try:
                    done[row["url"]] = row["status"]
                except (KeyError, TypeError):
                    continue
    mf = open(manifest_path, "a", newline="", encoding="utf-8")
    if new_file:
        csv.writer(mf).writerow(["url", "outfile", "chars", "status"])
        mf.flush()

    def record(url, outfile, chars, status):
        csv.writer(mf).writerow([url, outfile, chars, status])
        mf.flush()
        done[url] = status

    q = deque()
    seeds = [BASE + "/bpa/bAstrHom.htm", BASE + "/sitemap.xml"]
    sitemap_locs = []
    for s in seeds:
        try:
            raw = fetch(s)
            text = raw.decode("utf-8", errors="ignore")
            if "sitemap.xml" in s:
                for m in re.finditer(r"<loc>\s*([^<]+?)\s*</loc>", text):
                    u = urlparse(m.group(1).strip())
                    u = f"{u.scheme}://{u.netloc}{u.path}"
                    if SKIP_RE.search(u) or "/bpa/" not in u or u in done:
                        continue
                    sitemap_locs.append(u)
                record(s, "", 0, "sitemap_parsed")
            else:
                q.append(s)  # homepage first
        except Exception as e:
            print(f"[seed-fail] {s}: {e}", flush=True)

    seen = set(q) | set(sitemap_locs)
    for l in sitemap_locs:  # sitemap locs go AFTER homepage BFS links
        q.append(l)
    saved = n404 = nerr = 0
    t0 = time.time()
    while q and saved < CAP:
        url = q.popleft()
        prev = done.get(url)
        if prev and prev not in ("ok",):
            continue
        try:
            raw = fetch(url)
            ctype_ok = bool(CONTENT_RE.search(url)) or "/bpa/" in url
            links = []
            if ctype_ok or True:  # always parse links for BFS
                try:
                    links = extract_links(raw.decode("utf-8", errors="ignore"), url)
                    if not links:
                        links = extract_links(raw.decode("latin-1", errors="ignore"), url)
                except Exception:
                    pass
            for l in links:
                if l not in seen and len(seen) < 60000:
                    seen.add(l)
                    if CONTENT_RE.search(l) or "/bpa/" in l:
                        q.append(l)
            if ctype_ok and prev != "ok":
                txt = to_text(raw)
                of = outfile_for(url)
                with open(os.path.join(OUTDIR, of), "w", encoding="utf-8") as f:
                    f.write(txt or "")
                record(url, of, len(txt or ""), "ok")
                saved += 1
                if saved % 25 == 0:
                    print(f"[{int(time.time()-t0)}s] saved={saved} queue={len(q)} 404={n404} err={nerr} :: {url}", flush=True)
            else:
                record(url, "", 0, "skipped_pattern")
        except urllib.error.HTTPError as e:
            if e.code == 404:
                n404 += 1
                record(url, "", 0, "404")
            else:
                nerr += 1
                record(url, "", 0, f"http{e.code}")
        except Exception as e:
            nerr += 1
            record(url, "", 0, f"error:{type(e).__name__}")
        time.sleep(DELAY)

    print(f"DONE saved={saved} queue={len(q)} 404={n404} err={nerr}", flush=True)
    mf.close()

if __name__ == "__main__":
    main()
