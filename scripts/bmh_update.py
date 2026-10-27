#!/usr/bin/env python3
"""Mise à jour hebdomadaire de la page « Bleach : Mirrors High » (lancée chaque lundi par GitHub Actions).
1. Cherche des tier lists publiques du jeu (recherche web + pages de sites de guides) et lit les paliers S/A/B/C par personnage.
2. Si au moins 10 personnages de notre liste sont reconnus : écrit data/bmh_tiers.json (appliqué aux cartes par cards.py et à la page).
3. Sinon : conserve le classement précédent (ou notre estimation). Dans tous les cas, data/bmh.json reçoit la date de vérification et le résultat.
Le fichier data/bmh_tiers.json peut aussi être édité à la main : mettre "manual": true empêche l'écrasement automatique."""
import json, re, pathlib, datetime, urllib.request, urllib.parse, html as H
ROOT = pathlib.Path(__file__).resolve().parent.parent
UA = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36', 'Accept-Language': 'en-US,en;q=0.9'}
OK_HOSTS = ('game8.co', 'gamewith.net', 'prydwen.gg', 'gamerant.com', 'screenrant.com', 'dexerto.com', 'pocketgamer.com', 'gamesradar.com', 'bluestacks.com', 'ldplayer.net', 'fandom.com', 'gamefaqs.gamespot.com', 'sportskeeda.com', 'thegamer.com', 'siliconera.com', 'gamepress.gg')
TODAY = datetime.date.today().isoformat()

def get(u, t=30):
    return urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=t).read().decode('utf-8', 'replace')

def roster():
    cards = json.load(open(ROOT / 'data/cards_games3.json', encoding='utf-8'))
    cards = cards['cards'] if isinstance(cards, dict) else cards
    return [c['ne'] for c in cards if c.get('g') == 'bmh']

def candidates():
    urls = []
    for q in ('Bleach Mirrors High tier list', 'Bleach Mirrors High best characters tier list reroll'):
        try:
            page = get('https://html.duckduckgo.com/html/?q=' + urllib.parse.quote(q))
        except Exception as e:
            print('recherche impossible :', e); continue
        for m in re.findall(r'uddg=([^&"]+)', page):
            u = urllib.parse.unquote(m)
            if any(h in urllib.parse.urlparse(u).netloc for h in OK_HOSTS) and u not in urls: urls.append(u)
    return urls[:8]

def parse(text, names):
    """Découpe le texte en blocs « S tier / A tier… » et range chaque personnage reconnu dans le palier du bloc où il apparaît en premier."""
    t = re.sub(r'\s+', ' ', H.unescape(re.sub(r'<(script|style)[^>]*>.*?</\1>', ' ', text, flags=re.S | re.I)))
    t = re.sub(r'<[^>]+>', ' ', t)
    marks = [(m.start(), (m.group(1) or m.group(2)).upper()) for m in re.finditer(r'\b(?:(SS|S\+|S|A|B|C|D)[ -]?Tier|Tier[: ]+(SS|S\+|S|A|B|C|D)\b)', t)]
    if len(marks) < 3: return {}
    got = {}
    for i, (pos, tier) in enumerate(marks):
        seg = t[pos: marks[i + 1][0] if i + 1 < len(marks) else pos + 3000]
        for n in names:
            if n in got: continue
            full = n.lower(); first = n.split()[0].lower()
            low = seg.lower()
            if full in low or (len(first) > 4 and sum(1 for x in names if x.split()[0].lower() == first) == 1 and re.search(r'\b' + re.escape(first) + r'\b', low)):
                got[n] = 'S' if tier in ('SS', 'S+') else tier if tier in 'SABC' else 'C'
    return got

def main():
    f = ROOT / 'data/bmh_tiers.json'
    cur = json.load(open(f, encoding='utf-8')) if f.exists() else {}
    names = roster(); res = {'date': TODAY, 'status': 'inchangé', 'source': cur.get('source', '')}
    if cur.get('manual'):
        res['status'] = 'classement saisi à la main (non écrasé)'
    else:
        best, src, tried = {}, '', 0
        for u in candidates():
            tried += 1
            try:
                got = parse(get(u), names)
            except Exception as e:
                print('  échec', u, e); continue
            print('  ', u, len(got), 'personnages reconnus')
            if len(got) > len(best): best, src = got, u
        if len(best) >= 10:
            if best != cur.get('tiers'): res['status'] = f'tier list mise à jour ({len(best)} personnages)'
            else: res['status'] = 'vérifiée, sans changement'
            json.dump({'updated': TODAY if best != cur.get('tiers') else cur.get('updated', TODAY), 'source': src, 'tiers': best}, open(f, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
            res['source'] = src
        else:
            res['status'] = f'aucune source exploitable ({tried} pages essayées) : estimation conservée'
    b = json.load(open(ROOT / 'data/bmh.json', encoding='utf-8'))
    b['updated'] = TODAY; b['check'] = res
    json.dump(b, open(ROOT / 'data/bmh.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(res)

if __name__ == '__main__': main()
