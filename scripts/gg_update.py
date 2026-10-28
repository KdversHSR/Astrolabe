#!/usr/bin/env python3
"""Mise à jour hebdomadaire (lundi) des tier lists des pages Genshin, ZZZ, Wuthering Waves, Reverse: 1999, Neverness to Everness.

Principe : pour chaque jeu, on essaie les sources listées dans SOURCES dans l'ordre. Un classement n'est accepté que s'il
reconnaît au moins 30 % du roster du site (sinon la mise en page a changé : on garde l'ancien classement et on le dit).
Résultat : data/gg_tiers.json  ->  {jeu: {tiers: {nom: tier}, src, checked, status}}
Les sources sont des adresses publiques ; si une adresse change, il suffit de la corriger dans SOURCES (ou dans data/gg_sources.json).
"""
import json, re, sys, time, datetime, urllib.request, unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BROWSER = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36', 'Accept-Language': 'en'}
GGMAP = {'SS': 'SS', 'T0': 'SS', 'EX': 'SS', 'T0.5': 'S', 'S+': 'S', 'S': 'S', 'T1': 'S', 'T1.5': 'A', 'A+': 'A', 'A': 'A', 'T2': 'A', 'B+': 'B', 'B': 'B', 'T3': 'B', 'C': 'C', 'T4': 'C', 'T5': 'D', 'D': 'D'}
# Adresses par défaut (à vérifier/ajuster : je n'ai pas pu les tester depuis mon environnement, seul GitHub y est accessible).
SOURCES = {
    'zzz': [('prydwen', 'https://www.prydwen.gg/page-data/zenless/tier-list/page-data.json')],
    'ww': [('prydwen', 'https://www.prydwen.gg/page-data/wuthering-waves/tier-list/page-data.json')],
    'r99': [('prydwen', 'https://www.prydwen.gg/page-data/reverse-1999/tier-list/page-data.json')],
    'gi': [('html', 'https://genshin.gg/tier-list/')],
    'ss': [('html', 'https://www.ldshop.gg/blog/starsavior/starsavior-tier-list.html'), ('html', 'https://driffle.com/blog/star-savior-tier-list/')],
    'nte': [('prydwen', 'https://www.prydwen.gg/page-data/neverness-to-everness/tier-list/page-data.json')],
}
try:
    SOURCES.update({k: [tuple(x) for x in v] for k, v in json.load(open(ROOT / 'data/gg_sources.json', encoding='utf-8')).items()})
except Exception:
    pass


def get(url, tries=3):
    err = None
    for i in range(tries):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=BROWSER), timeout=60) as r:
                d = r.read()
                if r.headers.get('Content-Encoding') == 'gzip':
                    import gzip
                    d = gzip.decompress(d)
                return d.decode('utf-8', 'replace')
        except Exception as e:
            err = e
            time.sleep(3 * (i + 1))
    raise err


def nz(s):
    return re.sub(r'[^a-z0-9]', '', unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode().lower())


def parse_prydwen(raw, names):
    found = {}

    def walk(o):
        if isinstance(o, dict):
            nm = o.get('name') or o.get('title')
            if isinstance(nm, str) and nz(nm) in names:
                for k, v in o.items():
                    if isinstance(v, str) and re.search(r'tier|rank|rating', k, re.I) and v.strip() in GGMAP:
                        found.setdefault(names[nz(nm)], GGMAP[v.strip()])
            for v in o.values():
                walk(v)
        elif isinstance(o, list):
            for v in o:
                walk(v)
    walk(json.loads(raw))
    return found


LABEL = re.compile(r'^(SS|S\+|S|A\+|A|B\+|B|C|D|EX|T0\.5|T0|T1\.5|T1|T2|T3|T4|T5)(\s*(-|–)?\s*tier)?$', re.I)


def parse_html(raw, names):
    """Lit le texte de la page dans l'ordre : une étiquette de tier (S, A, T0…) puis les noms qui la suivent."""
    raw = re.sub(r'<(script|style)[\s\S]*?</\1>', ' ', raw, flags=re.I)
    raw = re.sub(r'<img[^>]*?alt="([^"]*)"[^>]*>', r'<b>\1</b>', raw, flags=re.I)
    toks = [re.sub(r'\s+', ' ', t).strip() for t in re.split(r'<[^>]+>', raw)]
    cur, found = None, {}
    for t in toks:
        if not t or len(t) > 40:
            continue
        m = LABEL.match(t)
        if m and t.upper() in GGMAP or (m and m.group(1).upper() in GGMAP):
            cur = GGMAP[m.group(1).upper()]
            continue
        k = nz(re.sub(r'\b(tier list|icon)\b', '', t, flags=re.I))
        if cur and k in names:
            found.setdefault(names[k], cur)
    return found


def main():
    cards = json.load(open(ROOT / 'data/cards.json', encoding='utf-8'))
    cards = cards.get('cards', cards)
    f = ROOT / 'data/gg_tiers.json'
    out = json.load(open(f, encoding='utf-8')) if f.exists() else {}
    today = datetime.date.today().isoformat()
    for g, srcs in SOURCES.items():
        ro = {c['n'] for c in cards if c['g'] == g}
        names = {nz(n): n for n in ro}
        names.update({nz(c.get('ne', '')): c['n'] for c in cards if c['g'] == g and c.get('ne')})
        if not ro:
            continue
        done, why = False, []
        for kind, url in srcs:
            try:
                raw = get(url)
                res = parse_prydwen(raw, names) if kind == 'prydwen' else parse_html(raw, names)
                cov = len(set(res)) / len(ro)
                if cov < .3:
                    why.append(f'{url.split("/")[2]} : seulement {len(res)}/{len(ro)} reconnus')
                    continue
                out[g] = {'tiers': res, 'src': url.split('/')[2].replace('www.', ''), 'checked': today, 'status': f'{len(res)}/{len(ro)} personnages classés'}
                done = True
                print(g, 'OK', url, len(res), '/', len(ro))
                break
            except Exception as e:
                why.append(f'{url.split("/")[2]} : {str(e)[:60]}')
        if not done:
            old = out.get(g, {})
            old['status'] = 'source illisible cette semaine, ancien classement conservé : ' + ' ; '.join(why)[:200]
            out[g] = old
            print(g, 'ÉCHEC', why)
    f.write_text(json.dumps(out, ensure_ascii=False, separators=(',', ':')), 'utf-8')


if __name__ == '__main__':
    main()
