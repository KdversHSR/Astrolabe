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


WIKI = {'hi3': 'honkaiimpact3', 'ww': 'wutheringwaves', 'r99': 'reverse1999', 'uma': 'umamusume'}
def fandom_img(title, g='hi3'):
    """Image principale de la page Fandom d'un personnage Honkai Impact 3rd (None si introuvable)."""
    d = get(f'https://{WIKI[g]}.fandom.com/api.php?action=query&redirects=1&prop=pageimages&piprop=original&format=json&titles=' + urllib.parse.quote(title), timeout=12)
    for p in d.get('query', {}).get('pages', {}).values():
        o = p.get('original')
        if o and o.get('source'): return o['source']
    return None

def portrait(im):
    # recadre un grand visuel (souvent sur fond transparent) en portrait 5:7 centré sur le personnage
    bb = im.getchannel('A').point(lambda a: 255 if a > 40 else 0).getbbox() or (0, 0, im.width, im.height)
    x0, y0, x1, y1 = bb; bw, bh = x1 - x0, y1 - y0
    h = min(bh * 0.82, bw * 1.4 if bw * 1.4 > bh * 0.5 else bh); h = max(h, bh * 0.5); w = h * 5 / 7
    cx = (x0 + x1) / 2; left = max(0, min(im.width - w, cx - w / 2)); top = max(0, y0)
    c = im.crop((int(left), int(top), int(left + w), int(min(im.height, top + h)))); c = c.resize((300, 420)) if c.width and c.height else im.resize((300, 420))
    return c

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
            cards.append({'id': 'gi-' + k, 'g': 'gi', 'n': loc.get('fr', {}).get(str(v['NameTextMapHash']), nm), 'ne': nm, 'r': 5 if 'ORANGE' in q else 4, 'e': EL_GI.get(v.get('Element'), 'wind'), 'art': MIAO + zh + '/imgs/splash.webp' if zh else ''})
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
    for fn in ('cards_extra', 'cards_games'):   # cards_games = Wuthering Waves / Reverse: 1999 / Umamusume (scripts/extra_games.py)
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
        from concurrent.futures import ThreadPoolExecutor
        def one(c):
            u = c.get('art')
            if not u: return
            dest = ROOT / 'img/cards' / (c['id'] + '.webp')
            if dest.exists(): c['img'] = f"img/cards/{c['id']}.webp"; return
            try:
                im = portrait(Image.open(io.BytesIO(get(u, True))).convert('RGBA')); im.save(dest, 'WEBP', quality=80)
                c['img'] = f"img/cards/{c['id']}.webp"
            except Exception: pass
        with ThreadPoolExecutor(8) as ex: list(ex.map(one, out))
        # Honkai Impact 3rd : illustrations depuis le wiki Fandom (page de la Valkyrie). Échec = carte dessinée.
        import time
        t0, fails = time.time(), 0   # garde-fou : on abandonne les images Fandom après 8 min ou 8 échecs d'affilée
        for c in out:
            if time.time() - t0 > 480 or fails >= 8: print('images Fandom : arrêt anticipé (wiki lent ou bloqué), cartes restantes dessinées'); break
            if c['g'] not in WIKI or c.get('img') or (ROOT / 'img/cards' / (c['id'] + '.webp')).exists(): continue
            try:
                title = (c.get('wk') or c['ne']).split(' · ')[0].strip(); u = fandom_img(title, c['g'])
                if u:
                    im = portrait(Image.open(io.BytesIO(get(u, True))).convert('RGBA')); im.save(ROOT / 'img/cards' / (c['id'] + '.webp'), 'WEBP', quality=80); c['img'] = f"img/cards/{c['id']}.webp"; fails = 0
                else: fails = 0
            except Exception as ex_: fails += 1; print('fandom', c['id'], ex_)
            time.sleep(0.5)
    for c in out: c.pop('art', None)
    # on garde 'img' seulement si le fichier existe
    for c in out:
        if not c.get('img') and (ROOT / f"img/cards/{c['id']}.webp").exists(): c['img'] = f"img/cards/{c['id']}.webp"
        if c.get('img') and not (ROOT / c['img']).exists(): c.pop('img')
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
    print(len(out), 'cartes', dict(Counter(c['g'] for c in out)), 'avec image :', sum(1 for c in out if c.get('img')))

if __name__ == '__main__': build('--art' in sys.argv)
