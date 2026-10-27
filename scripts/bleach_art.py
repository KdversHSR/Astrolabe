#!/usr/bin/env python3
"""Télécharge une image de présentation pour chacun des 6 arcs de la page « Bleach : Mirrors High » -> img/bleach/<arc>.webp (1280x560).
Sources essayées dans l'ordre : wiki Bleach (Fandom, image principale de la page de l'arc), Wikipédia (affiche de la série), AniList (bannière).
Si rien n'est trouvé, la page utilise l'illustration dessinée intégrée. Lancé par GitHub Actions ; rapport dans data/bleach_art_report.json."""
import io, json, pathlib, re, sys, urllib.parse, urllib.request
ROOT = pathlib.Path(__file__).resolve().parent.parent
UA = {'User-Agent': 'astrolabe-fansite/1.0 (non commercial)'}
ARCS = {'sub': ['Agent of the Shinigami arc', 'Substitute Shinigami arc'], 'ss': ['Soul Society arc', 'Soul Society: The Sneak Entry arc'],
        'hm': ['Arrancar arc', 'Hueco Mundo arc', 'Arrancar: Hueco Mundo Sneak Entry arc'], 'fk': ['Turn Back the Pendulum arc', 'Fake Karakura Town arc', 'Arrancar: Fierce Fight arc'],
        'lost': ['Lost Agent arc', 'Fullbring arc'], 'tybw': ['Thousand-Year Blood War arc', 'Thousand-Year Blood War']}
def get(u, raw=False):
    d = urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=25).read()
    return d if raw else json.loads(d)
def fandom(t):
    r = get('https://bleach.fandom.com/api.php?format=json&redirects=1&action=query&prop=pageimages&piprop=original&titles=' + urllib.parse.quote(t))
    for p in r.get('query', {}).get('pages', {}).values():
        if (p.get('original') or {}).get('source'): return p['original']['source']
def wikipedia(t):
    r = get('https://en.wikipedia.org/w/api.php?format=json&redirects=1&action=query&prop=pageimages&piprop=original&titles=' + urllib.parse.quote(t))
    for p in r.get('query', {}).get('pages', {}).values():
        if (p.get('original') or {}).get('source'): return p['original']['source']
def anilist():
    q = json.dumps({'query': '{Media(search:"Bleach",type:ANIME){bannerImage coverImage{extraLarge}}}'}).encode()
    r = json.loads(urllib.request.urlopen(urllib.request.Request('https://graphql.anilist.co', q, {'Content-Type': 'application/json', **UA}), timeout=20).read())
    m = (r.get('data') or {}).get('Media') or {}; return m.get('bannerImage') or (m.get('coverImage') or {}).get('extraLarge')
def cover(im, W=1280, H=560):
    from PIL import Image
    im = im.convert('RGB'); w, h = im.size; k = max(W / w, H / h); im = im.resize((int(w * k) + 1, int(h * k) + 1), Image.LANCZOS)
    x = (im.width - W) // 2; y = int((im.height - H) * 0.28); return im.crop((x, y, x + W, y + H))
def main():
    from PIL import Image
    out = ROOT / 'img/bleach'; out.mkdir(parents=True, exist_ok=True); rep = {}
    for k, titles in ARCS.items():
        if (out / f'{k}.webp').exists() and '--force' not in sys.argv: rep[k] = 'déjà là'; continue
        u = None; src = ''
        for t in titles:
            try: u = fandom(t); src = 'fandom:' + t
            except Exception as e: print('fandom', t, e)
            if u: break
        if not u:
            try: u = wikipedia('Bleach (TV series)' if k != 'tybw' else 'Bleach: Thousand-Year Blood War'); src = 'wikipedia'
            except Exception as e: print('wikipedia', e)
        if not u:
            try: u = anilist(); src = 'anilist'
            except Exception as e: print('anilist', e)
        if not u: rep[k] = 'introuvable'; continue
        try:
            cover(Image.open(io.BytesIO(get(u, True)))).save(out / f'{k}.webp', 'WEBP', quality=82); rep[k] = src
        except Exception as e: rep[k] = f'échec : {e}'
    json.dump(rep, open(ROOT / 'data/bleach_art_report.json', 'w'), ensure_ascii=False, indent=1); print(rep)
main()
