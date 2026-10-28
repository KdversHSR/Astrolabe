#!/usr/bin/env python3
"""Construit data/cards.json : la liste des personnages Hoyoverse utilisés comme cartes.
Sources : données déjà présentes (Honkai: Star Rail), EnkaNetwork/API-docs (Genshin Impact, Zenless Zone Zero, dépôt public GitHub),
data/cards_extra.json (ajouts à la main : Honkai Impact 3rd, Tears of Themis…).
Option --art : tente de télécharger des illustrations (Genshin, ZZZ) dans img/cards/. Échec = simple absence d'image (carte dessinée).
"""
import json, re, sys, io, urllib.request, urllib.parse, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
RAW = 'https://raw.githubusercontent.com/EnkaNetwork/API-docs/master/store/'
def get(u, binary=False, timeout=60):
    u = urllib.parse.quote(u, safe=':/?=&%')
    r = urllib.request.urlopen(urllib.request.Request(u, headers={'User-Agent': 'astrolabe-cards'}), timeout=timeout).read()
    return r if binary else json.loads(r)

MIAO = 'https://raw.githubusercontent.com/yoimiya-kokomi/miao-plugin/master/resources/meta-gs/character/'
EL_GI = {'Ice': 'ice', 'Wind': 'wind', 'Electric': 'elec', 'Fire': 'fire', 'Water': 'water', 'Rock': 'rock', 'Grass': 'grass'}
EL_HSR = {'Fire': 'fire', 'Ice': 'ice', 'Thunder': 'elec', 'Wind': 'wind', 'Physical': 'phys', 'Quantum': 'quantum', 'Imaginary': 'imag'}
EL_ZZZ = {'Elec': 'elec', 'Fire': 'fire', 'Ice': 'ice', 'Physics': 'phys', 'Ether': 'ether', 'Wind': 'wind', 'Lumen': 'lumen'}


# wikis (MediaWiki) essayés dans l'ordre pour chaque jeu : un nom sans point = sous-domaine fandom.com ; sinon nom d'hôte complet
WIKI = {'hi3': ['honkaiimpact3'], 'ww': ['wutheringwaves'], 'r99': ['reverse1999'], 'uma': ['umamusume'], 'bb': ['bleach-bravesouls', 'bleach-brave-souls'],
        'ef': ['endfield.wiki.gg', 'arknightsendfield', 'arknights-endfield'], 'nk': ['nikke-goddess-of-victory-international'],
        'fgo': ['fategrandorder'], 'nte': ['neverness-to-everness', 'nte'], 'op': ['opbr', 'onepiecebountyrush'], 'tot': ['tearsofthemis', 'tot.wiki'],
        'p5x': ['persona5x', 'p5x.wiki.gg', 'persona-5-the-phantom-x'], 'bmh': ['bleach-mirrors-high', 'bleach', 'bleachmirrorshigh'],
        'ba': ['bluearchive'], 'ak': ['arknights'], 'al': ['azurlane']}
# recherche automatique de wikis Fandom si les noms ci-dessus échouent (API publique Fandom)
DISCO = {'bb': 'Bleach Brave Souls', 'ef': 'Arknights Endfield', 'op': 'One Piece Bounty Rush', 'tot': 'Tears of Themis', 'nte': 'Neverness to Everness', 'nk': 'Nikke Goddess of Victory', 'p5x': 'Persona 5 The Phantom X', 'bmh': 'Bleach Mirrors High', 'ba': 'Blue Archive', 'ak': 'Arknights', 'al': 'Azur Lane'}
DEAD = set()
GAMENAME = {'ba': 'Blue Archive', 'ak': 'Arknights', 'al': 'Azur Lane', 'p5x': 'Persona 5 The Phantom X', 'bmh': 'Bleach Mirrors High', 'hi3': 'Honkai Impact 3rd', 'zzz': 'Zenless Zone Zero', 'ww': 'Wuthering Waves', 'r99': 'Reverse 1999', 'uma': 'Umamusume', 'bb': 'Bleach Brave Souls', 'ef': 'Arknights Endfield', 'fgo': 'Fate Grand Order', 'nk': 'Nikke', 'nte': 'Neverness to Everness', 'op': 'One Piece Bounty Rush', 'tot': 'Tears of Themis', 'p5x': 'Persona 5 The Phantom X', 'bmh': 'Bleach'}
def _api(host, q):
    h = host if '.' in host else host + '.fandom.com'
    return get(f'https://{h}/api.php?format=json&redirects=1&' + q, timeout=12)
def _pimg(d):
    for p in d.get('query', {}).get('pages', {}).values():
        o = p.get('original')
        if o and o.get('source'): return o['source']
import threading
USED = {}; _LK = threading.Lock()
def _pages(d):
    ps = [p for p in d.get('query', {}).get('pages', {}).values() if (p.get('original') or {}).get('source')]
    ps.sort(key=lambda p: p.get('index', 0)); return [(p.get('title', ''), p['original']['source']) for p in ps]
import unicodedata
STOP = {'the', 'of', 'a', 'an', 'and', 'de', 'la', 'le', 'jr', 'ver', 'version'}
def toks(s):
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode().lower()
    return {t for t in re.findall(r'[a-z0-9]+', s) if t not in STOP}
def title_ok(title, name):
    """Le titre de la page du wiki doit correspondre au personnage : tous les mots du nom dans le titre, ou le titre est une partie du nom."""
    T, N = toks(re.sub(r'\(.*?\)', ' ', title)), toks(name)
    if not T or not N: return False
    return N <= T or (T <= N and (len(T) >= 2 or max(len(t) for t in T) >= 4))
def wiki_urls(host, q, exact=False):
    """(titre, URL) candidats sur un wiki MediaWiki : page exacte, sinon les 6 meilleurs résultats de recherche."""
    if exact: return _pages(_api(host, 'action=query&prop=pageimages&piprop=original&titles=' + urllib.parse.quote(q)))
    return _pages(_api(host, 'action=query&generator=search&gsrlimit=6&gsrnamespace=0&prop=pageimages&piprop=original&gsrsearch=' + urllib.parse.quote(q)))
SRC = {}
def fandom_img(queries, g='hi3', names=()):
    """Image dont la PAGE porte le nom du personnage (contrôle strict du titre) ; None si aucune ne correspond (mieux vaut le visuel dessiné qu'une mauvaise image)."""
    names = [n for n in names if n]
    for q in queries:
        for host in WIKI.get(g, []):
            if (g, host) in DEAD: continue
            try:
                for ex in (True, False):
                    for t, u in wiki_urls(host, q, ex):
                        if any(title_ok(t, n) for n in names):
                            SRC[g] = SRC.get(g, 0) + 1; return u
            except Exception as ex_:
                if 'timed out' not in str(ex_) and '404' not in str(ex_): DEAD.add((g, host)); print('wiki indisponible :', g, host, ex_)
    return None
def anilist_img(name):
    """Illustration via AniList (API publique GraphQL), seulement si le nom renvoyé correspond."""
    try:
        q = json.dumps({'query': 'query($s:String){Character(search:$s){name{full alternative} image{large}}}', 'variables': {'s': name}}).encode()
        r = json.loads(urllib.request.urlopen(urllib.request.Request('https://graphql.anilist.co', q, {'Content-Type': 'application/json', 'User-Agent': 'astrolabe-cards'}), timeout=15).read())
        c = ((r.get('data') or {}).get('Character') or {}); u = (c.get('image') or {}).get('large')
        nm = [(c.get('name') or {}).get('full') or ''] + list((c.get('name') or {}).get('alternative') or [])
        return u if u and 'default' not in u and any(title_ok(x, name) or title_ok(name, x) for x in nm if x) else None
    except Exception: return None
def wikipedia_img(name):
    try:
        r = get('https://en.wikipedia.org/w/api.php?format=json&redirects=1&action=query&prop=pageimages&piprop=original&generator=search&gsrlimit=3&gsrsearch=' + urllib.parse.quote(name), timeout=15)
        for t, u in _pages(r):
            if title_ok(t, name): return u
        return None
    except Exception: return None

# ---- séries d'animation (AniList + Jikan) : on charge TOUT le casting d'une série, puis on associe par nom EXACT (bien plus fiable qu'une recherche libre)
SERIES = {'bb': ['BLEACH', 'Bleach: Sennen Kessen-hen'], 'bmh': ['BLEACH', 'Bleach: Sennen Kessen-hen'], 'op': ['One Piece'],
          'p5x': ['Persona 5 the Animation', 'Persona 5 The Animation: The Day Breakers'], 'uma': ['Uma Musume: Pretty Derby']}
_POOL = {}
def _gql(query, variables):
    q = json.dumps({'query': query, 'variables': variables}).encode()
    return json.loads(urllib.request.urlopen(urllib.request.Request('https://graphql.anilist.co', q, {'Content-Type': 'application/json', 'User-Agent': 'astrolabe-cards'}), timeout=25).read())
def series_pool(g):
    """{clé(nom): URL} pour le casting complet des séries liées au jeu g (cache)."""
    if g in _POOL: return _POOL[g]
    pool = {}; _POOL[g] = pool
    for title in SERIES.get(g, []):
        try:
            for page in range(1, 9):
                r = _gql('query($s:String,$p:Int){Media(search:$s,type:ANIME,sort:SEARCH_MATCH){title{romaji} characters(page:$p,perPage:50,sort:ROLE){pageInfo{hasNextPage} nodes{name{full alternative} image{large}}}}}', {'s': title, 'p': page})
                ch = (((r.get('data') or {}).get('Media') or {}).get('characters') or {})
                for n in ch.get('nodes') or []:
                    u = (n.get('image') or {}).get('large')
                    if not u or 'default' in u: continue
                    for nm in [(n.get('name') or {}).get('full') or ''] + list((n.get('name') or {}).get('alternative') or []):
                        k = ''.join(sorted(toks(nm)))
                        if k: pool.setdefault(k, (nm, u))
                if not (ch.get('pageInfo') or {}).get('hasNextPage'): break
        except Exception as ex: print('AniList série indisponible :', g, title, ex)
    print('casting chargé :', g, len(pool), 'noms')
    return pool
def series_img(g, name):
    """Image du personnage dans le casting de la série, si le nom correspond EXACTEMENT (mêmes mots, dans n'importe quel ordre) ; sinon None."""
    if g not in SERIES: return None
    base = re.sub(r'\(.*?\)', ' ', name); k = ''.join(sorted(toks(base)))
    if not k: return None
    hit = series_pool(g).get(k)
    if hit: return hit[1]
    N = toks(base)
    if len(N) >= 2:                               # nom complet inclus dans un nom plus long (ex. « Yasutora Sado » ↔ « Yasutora "Chad" Sado »)
        for kk, (nm, u) in series_pool(g).items():
            if N <= toks(nm): return u
    return None
_VQD = {}
def web_img(name, game):
    """Dernier recours : recherche d'images web (DuckDuckGo, sans clé). On exige que le TITRE du résultat contienne le nom du personnage."""
    try:
        q = f'{name} {game} character art'
        h = urllib.request.urlopen(urllib.request.Request('https://duckduckgo.com/?q=' + urllib.parse.quote(q) + '&iax=images&ia=images', headers={'User-Agent': UA_}), timeout=15).read().decode('utf-8', 'ignore')
        m = re.search(r'vqd=["\']?([\d-]+)', h)
        if not m: return None
        r = json.loads(urllib.request.urlopen(urllib.request.Request('https://duckduckgo.com/i.js?l=us-en&o=json&q=' + urllib.parse.quote(q) + '&vqd=' + m.group(1), headers={'User-Agent': UA_, 'Referer': 'https://duckduckgo.com/'}), timeout=15).read())
        for it in r.get('results', [])[:12]:
            w, hh = it.get('width') or 0, it.get('height') or 0
            if w >= 300 and hh >= 300 and toks(name) <= toks(it.get('title', '') + ' ' + it.get('url', '')): return it.get('image')
    except Exception: return None
    return None
UA_ = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36'
def discover(g):
    try:
        r = get('https://www.fandom.com/api/v1/Wikis/ByString?includeDomain=true&limit=3&string=' + urllib.parse.quote(DISCO[g]), timeout=15)
        for it in r.get('items', []):
            h = (it.get('domain') or '').replace('https://', '').replace('http://', '').strip('/')
            if h and h not in WIKI[g]: WIKI[g].append(h); print('wiki découvert :', g, h)
    except Exception as ex: print('découverte impossible', g, ex)
_ATLAS = None
def atlas_img(name):
    """Fate/Grand Order : illustration d'ascension finale depuis l'API publique Atlas Academy (correspondance floue sur le nom)."""
    global _ATLAS
    import difflib
    if _ATLAS is None:
        _ATLAS = {}
        try:
            for sv in get('https://api.atlasacademy.io/export/JP/nice_servant_lang_en.json', timeout=240):
                asc = ((sv.get('extraAssets') or {}).get('charaGraph') or {}).get('ascension') or {}
                if asc: _ATLAS[re.sub(r'[^a-z0-9]', '', sv['name'].lower())] = asc[sorted(asc)[-1]]
        except Exception as ex: print('Atlas Academy indisponible :', ex)
    k = re.sub(r'[^a-z0-9]', '', name.lower())
    if k in _ATLAS: return _ATLAS[k]
    m = difflib.get_close_matches(k, list(_ATLAS), 1, 0.8)
    return _ATLAS[m[0]] if m else None

def quality_gate(im):
    """Refuse les images qui rendraient mal en carte : trop petites, bannières très larges, quasi vides (logo, aplat), presque entièrement transparentes."""
    from PIL import ImageStat
    W, H = im.size
    if min(W, H) < 140 or W * H < 30000: raise ValueError('trop petite')
    if W / H > 1.9: raise ValueError('bannière trop large')
    if H / W > 3.2: raise ValueError('trop étroite')
    a = im.getchannel('A')
    if a.getextrema()[0] < 250:
        if sum(1 for v in a.resize((32, 32)).getdata() if v > 40) < 120: raise ValueError('quasi transparente')
    if max(ImageStat.Stat(im.convert('RGB').resize((64, 64))).stddev) < 9: raise ValueError('aplat / sans détail')

def portrait(im):
    """Cadre 5:7 (300x420) sans zoom excessif : visuel opaque -> entier sur fond flouté ; détourage transparent -> personnage complet en largeur, haut du corps si très haut."""
    from PIL import Image, ImageFilter
    quality_gate(im)
    R = 5 / 7; W, H = im.size; TW, TH = 300, 420
    if im.getchannel('A').getextrema()[0] > 200:
        im = im.convert('RGB')
        if W / H < 0.85:                       # déjà portrait : recadrage haut
            ch = min(H, W / R); out = im.crop((0, 0, W, int(ch)))
            if out.height < W / R - 2: out = out.crop((int((W - out.height * R) / 2), 0, int((W + out.height * R) / 2), out.height))
            return out.resize((TW, TH), Image.LANCZOS).convert('RGBA')
        bg = im.resize((TW, TH), Image.BILINEAR).filter(ImageFilter.GaussianBlur(14)); bg = Image.blend(bg, Image.new('RGB', (TW, TH), (10, 12, 28)), .35)
        fw = TW; fh = int(H * TW / W)
        if fh > TH * 0.8: fh = int(TH * 0.8); fw = int(W * fh / H)
        bg.paste(im.resize((fw, fh), Image.LANCZOS), ((TW - fw) // 2, int((TH - fh) * 0.42))); return bg.convert('RGBA')
    bb = im.getchannel('A').point(lambda a: 255 if a > 40 else 0).getbbox() or (0, 0, W, H)
    x0, y0, x1, y1 = bb; bw, bh = x1 - x0, y1 - y0
    w = max(bw * 1.08, 1); h = w / R
    if bh > h * 1.12: pass                      # très haut : on garde le haut du corps (h déjà < bh)
    elif h > bh * 1.25: h = bh * 1.25; w = h * R if h * R > bw else bw * 1.08
    cx = (x0 + x1) / 2; left = cx - w / 2; top = y0 - h * 0.04
    canvas = Image.new('RGBA', (int(w), int(h)), (0, 0, 0, 0)); canvas.paste(im, (int(-left), int(-top)))
    return canvas.resize((TW, TH), Image.LANCZOS)

def build(art=False):
    cards = []
    # --- Honkai: Star Rail (données locales)
    d = json.load(open(ROOT / 'data/data.json')); en = json.load(open(ROOT / 'data/data_en.json'))['c']
    for c in d['chars']:
        cards.append({'id': 'hsr-' + c['id'], 'g': 'hsr', 'n': c['n'], 'ne': en.get(c['id'], {}).get('n', c['n']), 'r': 5 if c['r'] == 5 else 4, 'e': EL_HSR.get(c.get('ei'), 'phys'), 'img': f"img/p/{c['id']}.webp", 'pa': c.get('p', ''), 'pe': c.get('pi', ''), **({'ro': [k for k in ('dps', 'support', 'sustain') if k in (c.get('tr') or {})][0]} if [k for k in ('dps', 'support', 'sustain') if k in (c.get('tr') or {})] else {})})
    # --- Genshin Impact
    try:
        ch = get(RAW + 'characters.json'); loc = get(RAW + 'loc.json')
        for k, v in ch.items():
            nm = loc['en'].get(str(v.get('NameTextMapHash'))); 
            if not nm or re.search(r'Trial|Test', nm): continue
            q = v.get('QualityType', '')
            if 'ORANGE' not in q and 'PURPLE' not in q: continue
            side = (v.get('SideIconName') or '').replace('UI_AvatarIcon_Side_', '')
            zh = loc.get('zh-cn', {}).get(str(v['NameTextMapHash']), '')
            cards.append({'id': 'gi-' + k, 'g': 'gi', 'n': loc.get('fr', {}).get(str(v['NameTextMapHash']), nm), 'ne': nm, 'r': 5 if 'ORANGE' in q else 4, 'e': EL_GI.get(v.get('Element'), 'wind'), 'art': MIAO + zh + '/imgs/splash.webp' if zh else '', 'art2': f'https://enka.network/ui/UI_Gacha_AvatarImg_{side}.png' if side else ''})
    except Exception as ex: print('Genshin ignoré :', ex)
    # --- Zenless Zone Zero
    try:
        av = get(RAW + 'zzz/avatars.json'); zl = get(RAW + 'zzz/locs.json')
        for k, v in av.items():
            nm = zl['en'].get(v['Name']);
            if not nm: continue
            ets = v.get('ElementTypes') or ['Physics']
            cards.append({'id': 'zzz-' + k, 'g': 'zzz', 'n': zl.get('fr', {}).get(v['Name'], nm), 'ne': nm, 'r': 5 if v.get('Rarity') == 4 else 4, 'e': EL_ZZZ.get(ets[-1], 'phys'), 'art': 'https://enka.network' + v['Image'] if v.get('Image') else ''})
    except Exception as ex: print('ZZZ ignoré :', ex)
    # --- ajouts manuels
    for fn in ('cards_extra', 'cards_games', 'cards_games2', 'cards_games3', 'cards_games4', 'cards_games5'):   # cards_games = Wuthering Waves / Reverse: 1999 / Umamusume (scripts/extra_games.py)
        try:
            for c in json.load(open(ROOT / f'data/{fn}.json', encoding='utf-8'))['cards']: cards.append(c)
        except Exception as ex: print(fn, 'ignoré :', ex)
    try:
        loc = get(RAW + 'loc.json'); en2zh = {}
        for h, t in loc['en'].items():
            if h in loc.get('zh-cn', {}): en2zh.setdefault(t, loc['zh-cn'][h])
        for c in cards:
            if c['g'] == 'gi' and not c.get('art'):
                nm_ = c['ne'].split(' (')[0]; zh = '旅行者' if nm_ == 'Traveler' else en2zh.get(nm_, '')
                if zh: c['art'] = MIAO + zh + '/imgs/splash.webp'
    except Exception as ex: print('noms chinois ignorés :', ex)
    seen, out = set(), []
    for c in cards:
        if c['id'] in seen or re.search(r'Traveler|Voyageur|Player', c['ne']) and c['g'] == 'gi': continue
        seen.add(c['id']); out.append(c)
    if art:
        from PIL import Image
        (ROOT / 'img/cards').mkdir(exist_ok=True)
        VF = ROOT / 'img/cards/_v27.json'; DONE = set(json.load(open(VF)) if VF.exists() else [])   # images déjà refaites avec le contrôle strict des noms (v27)
        if not VF.exists():   # première exécution v27 : on supprime les anciennes images des wikis (certaines ne correspondaient pas au personnage)
            for f in (ROOT / 'img/cards').glob('*.webp'):
                if f.stem.split('-')[0] in WIKI: f.unlink()
            for f in (ROOT / 'img/cards').glob('_v2[0-6].json'): f.unlink()
        from concurrent.futures import ThreadPoolExecutor
        def one(c):
            dest = ROOT / 'img/cards' / (c['id'] + '.webp')
            if dest.exists() and c['id'] in DONE: c['img'] = f"img/cards/{c['id']}.webp"; return
            for u in (c.get('art'), c.get('art2')):
                if not u: continue
                try:
                    im = portrait(Image.open(io.BytesIO(get(u, True))).convert('RGBA')); im.save(dest, 'WEBP', quality=80)
                    c['img'] = f"img/cards/{c['id']}.webp"; DONE.add(c['id']); return
                except Exception: pass
        with ThreadPoolExecutor(8) as ex: list(ex.map(one, out))
        # Honkai Impact 3rd : illustrations depuis le wiki Fandom (page de la Valkyrie). Échec = carte dessinée.
        import time
        t0 = time.time()   # garde-fou : on abandonne les images des wikis après 20 min (les cartes restantes restent dessinées)
        for g_ in list(DISCO):
            if any(c['g'] == g_ for c in out) and not any(c.get('img') for c in out if c['g'] == g_): discover(g_)
        def wiki_one(c):
            dest = ROOT / 'img/cards' / (c['id'] + '.webp')
            if time.time() - t0 > 1800 or c['g'] not in WIKI or (c.get('img') and c['id'] in DONE): return
            if c['g'] == 'hsr': return
            if dest.exists() and c['id'] in DONE: c['img'] = f"img/cards/{c['id']}.webp"; return
            try:
                ne = c['ne']; base = (c.get('wk') or ne).split(' · ')[0].strip(); suit = ne.split(' · ')[-1].strip() if ' · ' in ne else ''
                qs = [suit + ' ' + base.split()[0], suit, ne.replace(' · ', ' ')] if c['g'] == 'hi3' and suit else [re.sub(r'[()]', ' ', ne), base]
                u = atlas_img(base) if c['g'] == 'fgo' else None
                u = u or series_img(c['g'], base) or series_img(c['g'], ne)
                u = u or fandom_img(qs, c['g'], [base, re.sub(r'[()]', ' ', ne), suit])
                if not u and c['g'] != 'hi3': u = anilist_img(base) or wikipedia_img(base)
                if not u: u = web_img(base, GAMENAME.get(c['g'], c['g']))
                if u:
                    im = portrait(Image.open(io.BytesIO(get(u, True, 30))).convert('RGBA')); im.save(dest, 'WEBP', quality=80); c['img'] = f"img/cards/{c['id']}.webp"; DONE.add(c['id'])
                    if len(DONE) % 25 == 0: json.dump(sorted(DONE), open(VF, 'w'))
            except Exception as ex_: print('image', c['id'], ex_)
            time.sleep(0.15)
        if any(c['g'] == 'fgo' for c in out): atlas_img('x')   # charge l'index Atlas une seule fois avant les threads
        with ThreadPoolExecutor(6) as ex: list(ex.map(wiki_one, out))
        json.dump(sorted(DONE), open(VF, 'w'))
        if time.time() - t0 > 1800: print('images : arrêt anticipé après 30 min')
    for c in out: c.pop('art', None); c.pop('art2', None)
    # on garde 'img' seulement si le fichier existe
    for c in out:
        if not c.get('img') and (ROOT / f"img/cards/{c['id']}.webp").exists(): c['img'] = f"img/cards/{c['id']}.webp"
        if c.get('img') and not (ROOT / c['img']).exists(): c.pop('img')
    # images déposées à la main : img/manual/<id>.(webp|png|jpg) (priorité sur tout le reste) ; ids dans data/img_report.json
    for c in out:
        for ext in ('webp', 'png', 'jpg', 'jpeg'):
            f = ROOT / 'img/manual' / f"{c['id']}.{ext}"
            if f.exists(): c['img'] = f"img/manual/{c['id']}.{ext}"; break
    # Star Savior (cartes de data/gg_extra.json) : même dépôt manuel
    try:
        XP = ROOT / 'data/gg_extra.json'; X = json.load(open(XP, encoding='utf-8'))
        for g_, L_ in X.items():
            for c in L_:
                for ext in ('webp', 'png', 'jpg', 'jpeg'):
                    f = ROOT / 'img/manual' / f"{c['id']}.{ext}"
                    if f.exists(): c['img'] = f"img/manual/{c['id']}.{ext}"; break
        json.dump(X, open(XP, 'w'), ensure_ascii=False, indent=1)
    except Exception as e: print('gg_extra images manuelles ignorées :', e)
    # table id -> image, conservée d'une semaine à l'autre : une image trouvée un jour n'est jamais perdue
    try:
        MP = ROOT / 'data/img_map.json'
        try: prev = json.load(open(MP, encoding='utf-8'))
        except Exception: prev = {}
        mp = {c['id']: c['img'] for c in out if c.get('img')}
        for k_, v_ in prev.items():
            if k_ not in mp and (ROOT / v_).exists(): mp[k_] = v_
        json.dump(mp, open(MP, 'w'), ensure_ascii=False, separators=(',', ':'))
    except Exception as e: print('img_map ignoré :', e)
    # raretés d'après les tier lists actuelles (data/card_tiers.json) -> champ q (0 commune … 4 légendaire)

    seen = set(); out = [c for c in out if not (c['id'] in seen or seen.add(c['id']))]
    try:
        T = json.load(open(ROOT / 'data/card_tiers.json', encoding='utf-8'))
        nn = lambda x: re.sub(r'[^a-z0-9]', '', x.lower())
        AL = {'tartaglia': 'childe', 'ravenshogun': 'raiden', 'raidenshogun': 'raiden', 'kaedeharakazuha': 'kazuha', 'kamisatoayaka': 'ayaka', 'kamisatoayato': 'ayato', 'sangonomiyakokomi': 'kokomi', 'kujousara': 'sara', 'aratakiitto': 'itto', 'shikanoinheizou': 'heizou'}
        idx = {g: {nn(x): t for t, l in T[g].items() if t in T['scale'][g] for x in l} for g in ('gi', 'zzz', 'hi3')}
        hs = json.load(open(ROOT / 'data/data.json', encoding='utf-8'))['tiers']['ov']
        hsr = {str(i): t for t, l in hs.items() for i in l}
        for c in out:
            q = None
            if c['g'] == 'hsr': t = hsr.get(c['id'].replace('hsr-', '')); q = T['scale']['hsr'].get(t)
            elif c['g'] in idx:
                k = nn(c['ne'].split('·')[-1]) if c['g'] == 'hi3' else nn(c['ne']); k = AL.get(k, k) if c['g'] == 'gi' else k
                t = idx[c['g']].get(k); q = T['scale'][c['g']].get(t)
            if q is not None: c['q'] = q
            if q is not None:
                c['tl'] = t
        print('tiers appliquées :', sum(1 for c in out if 'q' in c), '/', len(out))
    except Exception as e: print('tiers ignorées :', e)
    # Bleach : Mirrors High -> tier list mise à jour chaque lundi par scripts/bmh_update.py (data/bmh_tiers.json)
    try:
        BT = json.load(open(ROOT / 'data/bmh_tiers.json', encoding='utf-8'))['tiers']; QM = {'S': 4, 'A': 3, 'B': 2, 'C': 1}
        for c in out:
            if c['g'] == 'bmh' and BT.get(c['ne']) in QM: c['q'] = QM[BT[c['ne']]]; c['tl'] = BT[c['ne']]
    except Exception: pass
    # descriptifs façon Pokédex (data/card_desc.json) -> d (FR) / de (EN)
    try:
        DS = json.load(open(ROOT / 'data/card_desc.json', encoding='utf-8'))
        for c in out:
            v = DS.get(c['ne'])
            if c['g'] == 'hi3':
                a, _, b = c['ne'].partition(' · '); bio = DS.get('__B__' + a)
                if bio: v = [bio[0] + (' Forme de Herrscher : une puissance qui dépasse celle des valkyries.' if 'Herrscher' in b else f' Tenue « {b} ».'), bio[1] + (' Herrscher form: a power beyond that of ordinary Valkyries.' if 'Herrscher' in b else f' Battlesuit “{b}”.')]
            if v and c['g'] in ('hsr', 'gi', 'zzz', 'hi3') and not c.get('d'): c['d'], c['de'] = v
        print('descriptifs :', sum(1 for c in out if c.get('d')), '/', len(out))
    except Exception as e: print('descriptifs ignorés :', e)
    json.dump({'v': 1, 'cards': out}, open(ROOT / 'data/cards.json', 'w'), ensure_ascii=False, separators=(',', ':'))
    from collections import Counter
    rep_ = {g: [c['ne'] for c in out if c['g'] == g and not c.get('img')] for g in sorted({c['g'] for c in out})}
    json.dump({g: {'total': sum(1 for c in out if c['g'] == g), 'sans_image': v, 'ids': [c['id'] for c in out if c['g'] == g and not c.get('img')]} for g, v in rep_.items()}, open(ROOT / 'data/img_report.json', 'w'), ensure_ascii=False, indent=1)
    print('cartes sans image :', {g: len(v) for g, v in rep_.items() if v})
    print(len(out), 'cartes', dict(Counter(c['g'] for c in out)), 'avec image :', sum(1 for c in out if c.get('img')))

if __name__ == '__main__': build('--art' in sys.argv)
