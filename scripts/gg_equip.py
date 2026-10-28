#!/usr/bin/env python3
"""Équipement (armes / sets d'artéfacts de Genshin, moteurs W / disques de ZZZ) depuis le dépôt public frzyc/genshin-optimizer (licence MIT).
Écrit data/gg_equip.json et les icônes dans img/gg/. Les icônes déjà présentes ne sont pas retéléchargées.
Noms et effets : anglais, et français quand le dépôt le fournit (Genshin)."""
import io, json, re, subprocess, sys, tempfile, urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RAW = 'https://raw.githubusercontent.com/frzyc/genshin-optimizer/master/'
OUT = ROOT / 'img/gg'


def get(path, tries=3):
    err = None
    for _ in range(tries):
        try:
            with urllib.request.urlopen(urllib.request.Request(RAW + path, headers={'User-Agent': 'astrolabe-fansite'}), timeout=40) as r:
                return r.read()
        except Exception as e:
            err = e
    raise err


def gj(path, default=None):
    try:
        return json.loads(get(path))
    except Exception:
        return default


def tree():
    d = Path(tempfile.mkdtemp())
    subprocess.run(['git', 'clone', '-q', '--depth', '1', '--filter=blob:none', '--no-checkout', 'https://github.com/frzyc/genshin-optimizer', str(d)], check=True)
    return subprocess.check_output(['git', '-C', str(d), 'ls-tree', '-r', '--name-only', 'HEAD'], text=True).split('\n')


def human(s):
    return re.sub(r'(?<=[a-z0-9])(?=[A-Z])|(?<=[A-Z])(?=[A-Z][a-z])', ' ', s)


def icon(path, dest, size=160):
    from PIL import Image
    if dest.exists():
        return True
    try:
        im = Image.open(io.BytesIO(get(path))).convert('RGBA')
        im.thumbnail((size, size))
        dest.parent.mkdir(parents=True, exist_ok=True)
        im.save(dest, 'WEBP', quality=82)
        return True
    except Exception:
        return False


def clean(t):
    if isinstance(t, dict):
        t = ' '.join(str(v) for v in t.values())
    elif isinstance(t, list):
        t = ' '.join(str(v) for v in t)
    return re.sub(r'<[^>]+>', '', t or '')


def main():
    T = tree()
    out = {'v': 1}
    DM = 'libs/gi/dm-localization/assets/locales/'
    # ---------- Genshin : armes
    wn = {l: gj(DM + f'{l}/weaponNames_gen.json', {}) for l in ('en', 'fr')}
    weapons = []
    for p in T:
        m = re.match(r'libs/gi/stats/Data/Weapons/(\w+)/(\w+)/data\.json$', p)
        if m:
            weapons.append((m.group(1), m.group(2)))

    def wone(x):
        typ, k = x
        d = gj(f'libs/gi/stats/Data/Weapons/{typ}/{k}/data.json', {})
        ic = next((q for q in T if q.startswith(f'libs/gi/assets/src/gen/weapons/{k}/') and q.endswith('.png') and 'Awaken' not in q), None)
        ok = bool(ic) and icon(ic, OUT / f'gi-w-{k}.webp')
        return {'id': k, 'n': wn['en'].get(k) or human(k), 'nf': wn['fr'].get(k) or wn['en'].get(k) or human(k), 't': d.get('weaponType') or typ.lower(), 'r': d.get('rarity', 0), 's': (d.get('subStat') or {}).get('type', ''), 'img': f'img/gg/gi-w-{k}.webp' if ok else ''}
    with ThreadPoolExecutor(8) as ex:
        gw = list(ex.map(wone, weapons))
    # ---------- Genshin : sets d'artéfacts
    sets = sorted({m.group(1) for p in T for m in [re.match(r'libs/gi/assets/src/gen/artifacts/(\w+)/', p)] if m})

    def sone(k):
        en, fr = gj(DM + f'en/artifact_{k}_gen.json', {}), gj(DM + f'fr/artifact_{k}_gen.json', {})
        ic = sorted(q for q in T if q.startswith(f'libs/gi/assets/src/gen/artifacts/{k}/') and q.endswith('_4.png'))
        ok = bool(ic) and icon(ic[0], OUT / f'gi-a-{k}.webp', 128)
        e, f = en.get('setEffects', {}), fr.get('setEffects', {}) or en.get('setEffects', {})
        return {'id': k, 'n': en.get('setName') or human(k), 'nf': fr.get('setName') or en.get('setName') or human(k), 'e2': e.get('2', ''), 'e4': e.get('4', ''), 'f2': f.get('2', ''), 'f4': f.get('4', ''), 'img': f'img/gg/gi-a-{k}.webp' if ok else ''}
    with ThreadPoolExecutor(8) as ex:
        ga = [x for x in ex.map(sone, sets) if x['e2'] or x['e4']]
    out['gi'] = {'weapons': sorted(gw, key=lambda x: (-x['r'], x['n'])), 'sets': ga}
    # ---------- ZZZ : moteurs W et disques
    ZM = 'libs/zzz/dm-localization/assets/locales/'
    engines = sorted({m.group(1) for p in T for m in [re.match(r'libs/zzz/assets/src/gen/wengines/(\w+)/', p)] if m})

    def eone(k):
        en, st = gj(ZM + f'en/wengine_{k}_gen.json', {}), gj(f'libs/zzz/stats/Data/Wengine/{k}.json', {})
        ok = icon(f'libs/zzz/assets/src/gen/wengines/{k}/icon.png', OUT / f'zzz-w-{k}.webp')
        return {'id': k, 'n': en.get('name') or human(k), 'r': {'S': 5, 'A': 4, 'B': 3}.get(st.get('rarity'), 0), 'rk': st.get('rarity', ''), 't': st.get('type', ''), 'e': clean(en.get('desc2', '')), 'p': clean((en.get('phaseDescs') or [''])[0] if isinstance(en.get('phaseDescs'), list) else ''), 'pn': en.get('phase', ''), 'img': f'img/gg/zzz-w-{k}.webp' if ok else ''}
    with ThreadPoolExecutor(8) as ex:
        ze = list(ex.map(eone, engines))
    discs = sorted({m.group(1) for p in T for m in [re.match(r'libs/zzz/assets/src/gen/discs/(\w+)/', p)] if m})

    def done(k):
        en = gj(ZM + f'en/disc_{k}_gen.json', {})
        ok = icon(f'libs/zzz/assets/src/gen/discs/{k}/cd_s.png', OUT / f'zzz-d-{k}.webp', 128)
        return {'id': k, 'n': en.get('name') or human(k), 'e2': clean(en.get('desc2', '')), 'e4': clean(en.get('desc4', '')), 'img': f'img/gg/zzz-d-{k}.webp' if ok else ''}
    with ThreadPoolExecutor(8) as ex:
        zd = [x for x in ex.map(done, discs) if x['e2'] or x['e4']]
    out['zzz'] = {'engines': sorted(ze, key=lambda x: (-x['r'], x['n'])), 'discs': zd}
    (ROOT / 'data/gg_equip.json').write_text(json.dumps(out, ensure_ascii=False, separators=(',', ':')), 'utf-8')
    print('GI armes', len(gw), 'sets', len(ga), '| ZZZ moteurs', len(ze), 'disques', len(zd))


if __name__ == '__main__':
    main()
