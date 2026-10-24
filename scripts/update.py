#!/usr/bin/env python3
"""Astrolabe : génère data/data.json et les images à partir de sources ouvertes.

Sources
  - StarRailRes (personnages, cônes, reliques, images)   : github.com/Mar-7th/StarRailRes
  - HSR Optimizer, licence MIT (builds, sets, équipes)   : github.com/fribbels/hsr-optimizer
  - Game8 (tier list générale et end game)               : seuls les classements sont repris, avec lien vers la source
Usage
  python scripts/update.py                    # mise à jour complète
  python scripts/update.py --inline out.html  # version « un seul fichier » (aperçu)
"""
import argparse, base64, io, json, re, shutil, subprocess, sys, tempfile, urllib.request, html as H, datetime
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / 'data'
RAW = 'https://raw.githubusercontent.com/Mar-7th/StarRailRes/master'
GAME8 = 'https://game8.co/games/Honkai-Star-Rail/archives/409604'
OPT = 'https://github.com/fribbels/hsr-optimizer.git'
UA = {'User-Agent': 'Mozilla/5.0 (compatible; AstrolabeBot/1.0)'}

EL = {'Fire': 'Feu', 'Ice': 'Glace', 'Thunder': 'Foudre', 'Wind': 'Vent', 'Physical': 'Physique', 'Quantum': 'Quantique', 'Imaginary': 'Imaginaire'}
PA = {'Warrior': 'Destruction', 'Rogue': 'Chasse', 'Mage': 'Érudition', 'Shaman': 'Harmonie', 'Warlock': 'Nihilité', 'Knight': 'Préservation', 'Priest': 'Abondance', 'Memory': 'Souvenir', 'Elation': 'Allégresse'}
STAT_FR = {'ATK': 'ATQ', 'ATK_P': 'ATQ%', 'HP': 'PV', 'HP_P': 'PV%', 'DEF': 'DÉF', 'DEF_P': 'DÉF%', 'SPD': 'VIT', 'CR': 'Taux crit', 'CD': 'DGT crit',
           'EHR': 'Taux d’effet', 'RES': 'Rés. d’effet', 'BE': 'Effet de rupture', 'ERR': 'Recharge d’énergie', 'OHB': 'Soins'}
ELEM_DMG = {'Physical': 'Physique', 'Fire': 'Feu', 'Ice': 'Glace', 'Lightning': 'Foudre', 'Wind': 'Vent', 'Quantum': 'Quantique', 'Imaginary': 'Imaginaire'}


def get(url, binary=False):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=60) as r:
        d = r.read()
    return d if binary else d.decode('utf-8', 'replace')


def getj(name, lang):
    return json.loads(get(f'{RAW}/index_min/{lang}/{name}.json'))


def nz(s):
    return re.sub(r'[^a-z0-9]', '', s.lower())


# ------------------------------------------------------------------ images
def save_img(remote, out, w, q):
    out = Path(out)
    if out.exists():
        return
    try:
        im = Image.open(io.BytesIO(get(f'{RAW}/{remote}', True))).convert('RGBA')
    except Exception as e:
        print('  image manquante :', remote, e)
        return
    im.thumbnail((w, w * 2))
    out.parent.mkdir(parents=True, exist_ok=True)
    im.save(out, 'WEBP', quality=q, method=4)


# ------------------------------------------------------------------ builds (HSR Optimizer)
def match(s, i, o, c):
    d = 0
    for j in range(i, len(s)):
        if s[j] == o:
            d += 1
        elif s[j] == c:
            d -= 1
            if d == 0:
                return j
    return len(s) - 1


def section(s, key, o='{'):
    c = {'{': '}', '[': ']'}[o]
    m = re.search(key, s)
    if not m:
        return ''
    i = s.find(o, m.end())
    return s[i:match(s, i, o, c) + 1] if i >= 0 else ''


def enum(text, name):
    blk = section(text, rf'export const {name}\s*=\s*', '{')
    return {k: v.replace("\\'", "'") for k, v in re.findall(r"(\w+):\s*'((?:[^'\\]|\\.)*)'", blk)}


def parse_optimizer(root):
    src = Path(root) / 'src' / 'lib'
    consts = (src / 'constants' / 'constants.ts').read_text('utf-8')
    SETS, STATS = enum(consts, 'Sets'), enum(consts, 'Stats')
    lc_const, ch_const, texts = {}, {}, {}
    for f in (src / 'conditionals' / 'lightcone').glob('*star/*.ts'):
        m = re.search(r"export const (\w+): LightConeConfig = \{\s*id: '(\w+)'", f.read_text('utf-8'))
        if m:
            lc_const[m[1]] = m[2]
    for f in (src / 'conditionals' / 'character').glob('*/*.ts'):
        if '.test' in f.name:
            continue
        t = f.read_text('utf-8')
        m = re.search(r"export const (\w+): CharacterConfig = \{\s*id: '(\w+)',\s*defaultLightCone: (\w+)\.id", t)
        if m:
            ch_const[m[1]] = (m[2], m[3])
            texts[m[1]] = t

    def stat(k):
        if k in STAT_FR:
            return STAT_FR[k]
        m = re.match(r'(\w+)_DMG', k)
        if m:
            return 'DGT ' + ELEM_DMG.get(m[1], m[1])
        return STATS.get(k, k)

    def slots(block):
        o = {}
        for key, lab in (('Body', 'body'), ('Feet', 'feet'), ('PlanarSphere', 'sphere'), ('LinkRope', 'rope')):
            m = re.search(rf'\[Parts\.{key}\]:\s*\[(.*?)\]', block, re.S)
            o[lab] = [stat(x) for x in re.findall(r'Stats\.(\w+)', m[1])] if m else []
        return o

    def lc_of(const, attr):
        if attr == 'defaultLightCone':
            return lc_const.get(ch_const.get(const, ('', ''))[1])
        return lc_const.get(const)

    out = {}
    for const, t in texts.items():
        cid, dlc = ch_const[const]
        sc = section(t, r'const scoring = \(\): ScoringMetadata => \(', '{')
        sim = section(t, r'const simulation = \(\): SimulationMetadata => \(', '{')
        b = {'lc': lc_const.get(dlc), 'parts': slots(section(sc, r'\bparts:', '{')) if sc else {}}
        w = {k: float(v) for k, v in re.findall(r'\[Stats\.(\w+)\]:\s*([\d.]+)', section(sc, r'\bstats:', '{'))} if sc else {}
        subs = re.findall(r'Stats\.(\w+)', section(sim, r'\bsubstats:', '[')) if sim else []
        if not subs:
            subs = [k for k, v in sorted(w.items(), key=lambda x: -x[1]) if v > 0]
        b['subs'] = [stat(x) for x in subs]
        if sim:
            sp = slots(section(sim, r'\bparts:', '{'))
            if any(sp.values()):
                b['parts'] = sp
            b['rel'] = [[SETS.get(a, a), SETS.get(c, c)] for a, c in re.findall(r'\[\s*Sets\.(\w+)\s*,\s*Sets\.(\w+)\s*\]', section(sim, r'\brelicSets:', '['))]
            b['orn'] = [SETS.get(a, a) for a in re.findall(r'Sets\.(\w+)', section(sim, r'\bornamentSets:', '['))]
            lt = section(sim, r'\bleaderboardTeams:', '[')
            teams = re.findall(r'teammates:\s*\[(.*?)\n\s*\],', lt, re.S) if lt else []
            if not teams:
                teams = [section(sim, r'\bteammates:', '[')]
            b['teams'] = []
            for tm in teams[:3]:
                row = []
                for c, l, attr in re.findall(r'characterId:\s*(\w+)\.id,\s*lightCones?:\s*\[?\s*(\w+)\.(\w+)', tm) or \
                        [(x, y, 'defaultLightCone') for x, y in re.findall(r'characterId:\s*(\w+)\.id,\s*lightCone:\s*(\w+)\.defaultLightCone', tm)]:
                    if c in ch_const:
                        row.append({'c': ch_const[c][0], 'l': lc_of(c if attr == 'defaultLightCone' else l, attr)})
                if row:
                    b['teams'].append(row)
        out[cid] = b
    return out


# ------------------------------------------------------------------ tier list (Game8)
def cells(tr):
    return re.findall(r'<t[dh][^>]*>(.*?)</t[dh]>', tr, re.S)


def names_in(cell):
    out = []
    for a in re.findall(r'<a [^>]*>(.*?)</a>', cell, re.S):
        txt = H.unescape(re.sub(r'<[^>]+>', ' ', a)).strip()
        if not txt:
            alt = re.search(r'alt="([^"]*)"', a)
            txt = H.unescape(alt[1]) if alt else ''
        txt = re.sub(r'\s+', ' ', re.sub(r'^Star Rail\s*-\s*', '', txt)).strip()
        if txt and txt not in out:
            out.append(txt)

    return out


def scrape_game8():
    page = get(GAME8)
    ver = re.search(r'Version (\d\.\d+)', page)
    res, eg = {}, {'moc': {}, 'pf': {}, 'as': {}}
    for ti, tb in enumerate(re.findall(r'<table.*?</table>', page, re.S)):
        got = {}
        for tr in re.findall(r'<tr.*?</tr>', tb, re.S):
            cs = cells(tr)
            if not cs:
                continue
            m = re.match(r'\s*(SS|S\+|S|A|B|C)\s*Tier', H.unescape(re.sub(r'<[^>]+>', ' ', cs[0])).strip())
            if m:
                got[m[1]] = cs[1:]
        if len(got) >= 5 and 'SS' in got:
            if not res and len(got['SS']) == 1:
                res = {t: names_in(c[0]) for t, c in got.items()}
            elif res and len(got['SS']) == 3 and not eg['moc'] and ti >= 2:
                for t, c in got.items():
                    for k, cell in zip(('moc', 'pf', 'as'), c):
                        eg[k][t] = names_in(cell)
    if sum(len(v) for v in res.values()) < 60:
        raise RuntimeError('structure Game8 inattendue')
    return res, eg, ver[1] if ver else None


# ------------------------------------------------------------------ main
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--optimizer-path')
    ap.add_argument('--inline')
    ap.add_argument('--skip-images', action='store_true')
    ap.add_argument('--no-scrape', action='store_true')
    a = ap.parse_args()
    DATA.mkdir(exist_ok=True)
    manual = json.loads((DATA / 'manual.json').read_text('utf-8'))

    print('1/5 StarRailRes…')
    fr, en = getj('characters', 'fr'), getj('characters', 'en')
    S, R, P = getj('character_skills', 'fr'), getj('character_ranks', 'fr'), getj('character_promotions', 'fr')
    LCf, LCe, LR = getj('light_cones', 'fr'), getj('light_cones', 'en'), getj('light_cone_ranks', 'fr')
    RSf, RSe = getj('relic_sets', 'fr'), getj('relic_sets', 'en')

    print('2/5 builds (HSR Optimizer)…')
    if a.optimizer_path:
        opt_root, tmp = a.optimizer_path, None
    else:
        tmp = tempfile.mkdtemp()
        subprocess.run(['git', 'clone', '--depth', '1', '--filter=blob:none', '--sparse', OPT, tmp], check=True)
        subprocess.run(['git', '-C', tmp, 'sparse-checkout', 'set', 'src/lib/conditionals', 'src/lib/constants'], check=True)
        opt_root = tmp
    builds = parse_optimizer(opt_root)
    if tmp:
        shutil.rmtree(tmp, ignore_errors=True)
    if len(builds) < 50:
        sys.exit('Parsing des builds : trop peu de résultats, abandon pour ne pas écraser les données.')

    ids = [k for k in fr if not (k.startswith('80') and int(k) % 2 == 0)]
    by_en = {}
    for k, v in en.items():
        by_en.setdefault(nz(v['name']), []).append(k)
    TB = {'Trailblazer': '8001', 'Trailblazer (Fire)': '8003', 'Trailblazer (Imaginary)': '8005', 'Trailblazer (Ice)': '8007',
          'Trailblazer (Lightning)': '8009', 'March 7th': '1001', 'March 7th (Imaginary)': '1224'}
    AL = {'Nova': 'Himeko • Nova', 'Summeretto': 'Robin • Summeretto', 'Waveflair': 'Aventurine • Waveflair', 'Permansor Terrae': 'Dan Heng • Permansor Terrae',
          'Imbibitor Lunae': 'Dan Heng • Imbibitor Lunae', 'Topaz': 'Topaz & Numby', 'Mortenax Blade': 'Blade Mortenax'}

    def rid(n):
        n = n.strip()
        if n in TB:
            return TB[n]
        for cand in (n, AL.get(n, n)):
            if nz(cand) in by_en:
                return by_en[nz(cand)][0]
        print('  nom non reconnu :', n)

    print('3/5 tier list (Game8)…')
    seed = json.loads((DATA / 'seed_tiers.json').read_text('utf-8'))
    tiers, eg, version = seed['overall'], seed['endgame'], manual.get('version')
    if not a.no_scrape:
        try:
            tiers, eg, v = scrape_game8()
            version = v or version
            (DATA / 'seed_tiers.json').write_text(json.dumps({'overall': tiers, 'endgame': eg}, ensure_ascii=False, indent=1), 'utf-8')
            print('   tier list mise à jour depuis Game8')
        except Exception as e:
            print('   ATTENTION Game8 indisponible, anciennes données conservées :', e)
    tier = {}
    for t, ns in tiers.items():
        for n in ns:
            i = rid(n)
            if i:
                tier[i] = t
    egid = {m: {t: [i for i in (rid(n) for n in ns) if i] for t, ns in d.items()} for m, d in eg.items()}

    rsn = {nz(v['name']): k for k, v in RSe.items()}
    cj = json.loads((DATA / 'curated_builds.json').read_text('utf-8'))
    curated = {rid(n): v for n, v in cj.items() if rid(n)}

    def fmt(d, pa):
        def f(m):
            x, y = pa[0][int(m[1]) - 1], pa[-1][int(m[1]) - 1]
            g = (lambda v: '%g' % round(v * 100, 2)) if m[2] == '%' else (lambda v: '%g' % round(v, 2))
            return (g(x) + '→' + g(y) if x != y else g(x)) + m[2]
        return re.sub(r'#(\d)\[(?:i|f\d)\](%?)', f, d)

    chars = []
    for k in ids:
        v = fr[k]
        n = v['name'] if '{NICKNAME}' not in v['name'] else 'Pionnier · ' + PA[v['path']]
        sk = [{'n': S[s]['name'], 't': S[s]['type_text'], 'd': S[s]['simple_desc'] or ''} for s in v['skills']
              if s in S and S[s]['type_text'] in ('Attaque normale', 'Compétence', 'Ultime', 'Talent', 'Technique')]
        rk = [{'n': R[r]['name'], 'd': re.sub(r'<[^>]+>', '', R[r]['desc'])} for r in v['ranks'] if r in R]
        pv = P[k]['values'][6]
        f = lambda s: round(pv[s]['base'] + pv[s]['step'] * 79)
        c = {'id': k, 'n': n, 'r': v['rarity'], 'e': EL[v['element']], 'p': PA[v['path']], 's': sk, 'x': rk, 't': tier.get(k, '?'),
             'st': {'hp': f('hp'), 'atk': f('atk'), 'def': f('def'), 'spd': round(pv['spd']['base']), 'cr': round(pv['crit_rate']['base'] * 100),
                    'cd': round(pv['crit_dmg']['base'] * 100), 'ta': round(pv['taunt']['base']), 'sp': v['max_sp']}}
        b = builds.get(k)
        if b:
            b = dict(b)
            b['lc'] = b.get('lc') if b.get('lc') in LCf else None
            b['rel'] = [pr for pr in ([rsn.get(nz(x)) for x in pair] for pair in b.get('rel', [])) if None not in pr]
            b['orn'] = [i for i in (rsn.get(nz(x)) for x in b.get('orn', [])) if i]
            b['teams'] = [[m for m in team if m['c'] in fr] for team in b.get('teams', [])]
            cur = curated.get(k)
            if cur and not b['rel']:  # source sans simulation : repli sur les builds vérifiés à la main
                b['rel'] = [pr for pr in ([rsn.get(nz(x)) for x in pair] for pair in cur['rel']) if None not in pr]
                b['orn'] = [i for i in (rsn.get(nz(x)) for x in cur['orn']) if i]
                b['teams'] = [[{'c': m, 'l': (builds.get(m) or {}).get('lc')} for m in (rid(n) for n in team) if m] for team in cur['teams']]
                b['curated'] = True
            c['b'] = b
        chars.append(c)
    chars.sort(key=lambda c: -int(c['id']))
    lcs = [{'id': k, 'n': v['name'], 'r': v['rarity'], 'p': PA[v['path']], 'k': LR[k]['skill'], 'd': fmt(LR[k]['desc'], LR[k]['params'])} for k, v in LCf.items()]
    lcs.sort(key=lambda x: (-x['r'], x['n']))
    sets = [{'id': k, 'n': v['name'], 'd': v['desc'], 'pl': len(v['desc']) == 1} for k, v in RSf.items()]
    sets.sort(key=lambda x: (x['pl'], x['n']))
    out = {'version': version, 'updated': datetime.date.today().isoformat(), 'chars': chars, 'lcs': lcs, 'sets': sets, 'eg': egid, 'manual': manual}
    (DATA / 'data.json').write_text(json.dumps(out, ensure_ascii=False, separators=(',', ':')), 'utf-8')
    print(f'   {len(chars)} personnages, {len(lcs)} cônes, {len(sets)} sets, {sum(1 for c in chars if "b" in c)} builds')

    if not a.skip_images:
        print('4/5 images…')
        im = ROOT / 'img'
        jobs = []
        for k in ids:
            jobs += [(fr[k]['icon'], im / f'c/{k}.webp', 96, 80), (fr[k]['preview'], im / f'p/{k}.webp', 300, 72)]
        jobs += [(v['icon'], im / f'l/{k}.webp', 96, 75) for k, v in LCf.items()]
        jobs += [(v['icon'], im / f'r/{k}.webp', 96, 75) for k, v in RSf.items()]
        with ThreadPoolExecutor(8) as ex:
            list(ex.map(lambda j: save_img(*j), jobs))

    if a.inline:
        print('5/5 fichier unique…')
        imgs = {f'{f.parent.name}/{f.stem}': 'data:image/webp;base64,' + base64.b64encode(f.read_bytes()).decode() for f in (ROOT / 'img').glob('*/*.webp')}
        h = (ROOT / 'index.html').read_text('utf-8')
        h = h.replace('<link rel="stylesheet" href="style.css">', '<style>' + (ROOT / 'style.css').read_text('utf-8') + '</style>')
        h = h.replace('<script src="config.js"></script>', '<script>window.CFG={}</script>')
        h = h.replace('<script src="app.js"></script>', '<script>window.__DATA__=' + json.dumps(out, ensure_ascii=False, separators=(',', ':')) +
                      ';window.__IMG__=' + json.dumps(imgs) + ';</script><script>' + (ROOT / 'app.js').read_text('utf-8') + '</script>')
        Path(a.inline).write_text(h, 'utf-8')
    print('Terminé.')


if __name__ == '__main__':
    main()
