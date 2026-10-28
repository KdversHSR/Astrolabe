#!/usr/bin/env python3
"""Blue Archive (ba) et Arknights (ak) : roster ET illustrations viennent de bases de données communautaires hébergées sur GitHub.
Le nom d'une carte et son image sortent de la MÊME entrée de données (même identifiant) : aucun risque de décalage nom/image.
  - Blue Archive : SchaleDB (data/en/students.min.json + images/student/portrait/<Id>.webp)
  - Arknights    : Aceship/AN-EN-Tags (character_table) + Aceship/Arknight-Images (characters/<id>_2.png, sinon _1)
Écrit data/cards_games5.json et les images dans img/cards/. Relançable sans risque (images déjà présentes = ignorées). Utilisé par le workflow du lundi."""
import io, json, re, sys, pathlib, unicodedata, urllib.request
from concurrent.futures import ThreadPoolExecutor
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
ROOT = pathlib.Path(__file__).resolve().parent.parent
UA = {'User-Agent': 'astrolabe-fansite/1.0 (non commercial)'}
RAW = 'https://raw.githubusercontent.com/'
SCHALE = RAW + 'SchaleDB/SchaleDB/main/'
AKT = RAW + 'Aceship/AN-EN-Tags/master/json/gamedata/en_US/gamedata/excel/character_table.json'
AKI = RAW + 'Aceship/Arknight-Images/main/portraits/'
AKC = RAW + 'Aceship/Arknight-Images/main/characters/'
TL = {4: 'S', 3: 'A', 2: 'B', 1: 'C', 0: 'D'}
slug = lambda s: re.sub(r'[^a-z0-9]+', '', unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode().lower())
PROF = {'PIONEER': 'vanguard', 'WARRIOR': 'guard', 'TANK': 'defender', 'SNIPER': 'sniper', 'CASTER': 'caster', 'MEDIC': 'medic', 'SUPPORT': 'supporter', 'SPECIAL': 'specialist'}
PROF_FR = {'vanguard': 'Avant-garde', 'guard': 'Garde', 'defender': 'Défenseur', 'sniper': 'Sniper', 'caster': 'Caster', 'medic': 'Médecin', 'supporter': 'Soutien', 'specialist': 'Spécialiste'}
PROF_EN = {'vanguard': 'Vanguard', 'guard': 'Guard', 'defender': 'Defender', 'sniper': 'Sniper', 'caster': 'Caster', 'medic': 'Medic', 'supporter': 'Supporter', 'specialist': 'Specialist'}
AK_STARS = {'Exusiai', "Ch'en", 'SilverAsh', 'Eyjafjalla', 'Skadi', 'Surtr', 'Hoshiguma', 'Mostima', "Kal'tsit", 'Rosmontis', 'Dusk', 'Ling', 'Chongyue', 'Nian', 'Ceobe', 'Texas', 'Lappland', 'Saria', 'Mudrock', 'Thorns', 'Specter', 'Weedy', 'Irene', 'Mizuki'}

def get(u, raw=True, t=40):
    d = urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=t).read()
    return d if raw else json.loads(d)

def roster():
    out = []
    ba = get(SCHALE + 'data/en/students.min.json', False)
    for s in ba:
        if not s['IsReleased'][1]: continue
        n, st = s['Name'], s['StarGrade']
        lim = (s.get('IsLimited') or 0) > 0
        q = 4 if (st == 3 and lim) else {3: 3, 2: 2, 1: 1}.get(st, 1)
        t = TL[q]; sc = s.get('School', '')
        out.append({'id': f'ba-{slug(n)}', 'g': 'ba', 'n': n, 'ne': n, 'r': 5 if st == 3 else 4, 'e': 'student', 'q': q, 'tl': t, 'st': st, 'src': SCHALE + f"images/student/portrait/{s['Id']}.webp",
                    'd': f"Élève {st}★ de Blue Archive, école {sc}{' (édition limitée)' if lim else ''}. Rareté estimée {t} (non officielle).",
                    'de': f"{st}★ Blue Archive student, {sc} school{' (limited)' if lim else ''}. Rarity estimated {t} (unofficial)."})
    ak = get(AKT, False)
    for cid, v in ak.items():
        if not cid.startswith('char_') or v.get('isNotObtainable') or v['rarity'] not in ('TIER_5', 'TIER_6') or v['profession'] not in PROF: continue
        n = v['name']; st = 6 if v['rarity'] == 'TIER_6' else 5; e = PROF[v['profession']]
        q = 4 if n in AK_STARS and st == 6 else 3 if st == 6 else 2; t = TL[q]
        out.append({'id': f'ak-{slug(n)}', 'g': 'ak', 'n': n, 'ne': n, 'r': 5 if st == 6 else 4, 'e': e, 'q': q, 'tl': t, 'st': st, 'src': AKI + cid + '_2.png', 'src2': AKI + cid + '_1.png', 'src3': AKC + cid + '_1.png',
                    'd': f"Opérateur {st}★ d'Arknights, classe {PROF_FR[e]}. Rareté estimée {t} d'après la popularité (non officielle).",
                    'de': f"{st}★ Arknights operator, {PROF_EN[e]} class. Rarity estimated {t} from popularity (unofficial)."})
    seen, res = set(), []
    for c in out:
        if c['id'] in seen: c['id'] += '2'
        seen.add(c['id']); res.append(c)
    return res

def main():
    from cards import portrait
    from PIL import Image
    cards = roster(); D = ROOT / 'img/cards'; D.mkdir(exist_ok=True)
    VF = D / '_v27.json'; DONE = set(json.load(open(VF)) if VF.exists() else [])
    def one(c):
        dest = D / (c['id'] + '.webp')
        if dest.exists(): return True
        for u in (c.get('src'), c.get('src2'), c.get('src3')):
            if not u: continue
            try:
                im = portrait(Image.open(io.BytesIO(get(u))).convert('RGBA')); im.save(dest, 'WEBP', quality=80); return True
            except Exception as e:
                pass
        return False
    with ThreadPoolExecutor(8) as ex: ok = list(ex.map(one, cards))
    keep = []
    for c, o in zip(cards, ok):
        c.pop('src', None); c.pop('src2', None); c.pop('src3', None)
        if o: c['img'] = f"img/cards/{c['id']}.webp"; DONE.add(c['id'])
        keep.append(c)   # une carte sans image reste jouable (carte dessinée) : elle ne disparaît pas
    json.dump(sorted(DONE), open(VF, 'w'))
    json.dump({'v': 1, 'cards': keep}, open(ROOT / 'data/cards_games5.json', 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
    from collections import Counter
    print(len(keep), dict(Counter(c['g'] for c in keep)), 'avec image :', sum(1 for c in keep if c.get('img')))

if __name__ == '__main__': main()
