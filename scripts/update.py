#!/usr/bin/env python3
"""Astrolabe : génère data/data.json, data_en.json, calc.json et les images à partir de sources ouvertes.

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
PATH_ICON = {'Warrior': 'Destruction', 'Rogue': 'Hunt', 'Mage': 'Erudition', 'Shaman': 'Harmony', 'Warlock': 'Nihility', 'Knight': 'Preservation', 'Priest': 'Abundance', 'Memory': 'Remembrance', 'Elation': 'Elation'}
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
    res, gen, eg = {}, {}, {}
    for tb in re.findall(r'<table.*?</table>', page, re.S):
        rows = re.findall(r'<tr.*?</tr>', tb, re.S)
        if len(rows) < 6:
            continue
        head = [re.sub(r'\s+', ' ', H.unescape(re.sub(r'<[^>]+>', ' ', c))).strip() for c in cells(rows[0])]
        got = {}
        for tr in rows[1:]:
            cs = cells(tr)
            m = cs and re.match(r'\s*(SS|S\+|S|A|B|C)\s*Tier', H.unescape(re.sub(r'<[^>]+>', ' ', cs[0])).strip())
            if m:
                got[m[1]] = cs[1:]
        if 'SS' not in got or len(got) < 5:
            continue
        if 'DPS' in head and not gen:
            gen = {k: {t: names_in(c[i]) for t, c in got.items() if len(c) > i} for i, k in enumerate(('dps', 'support', 'sustain'))}
        elif 'Memory of Chaos' in head and not eg:
            eg = {k: {t: names_in(c[i]) for t, c in got.items() if len(c) > i} for i, k in enumerate(('moc', 'pf', 'as'))}
        elif len(head) <= 2 and not res:
            res = {t: names_in(c[0]) for t, c in got.items()}
    if sum(len(v) for v in res.values()) < 60 or not gen or not eg:
        raise RuntimeError('structure Game8 inattendue')
    return res, gen, eg, ver[1] if ver else None



# ------------------------------------------------------------------ tendances (historique des classements)
ORDER = ['SS', 'S+', 'S', 'A', 'B', 'C']


def tier_trends(inv):
    """Compare le classement actuel au précédent. Le fichier tier_history.json garde les deux derniers états."""
    f = DATA / 'tier_history.json'
    h = json.loads(f.read_text('utf-8')) if f.exists() else {}
    cur = h.get('current')
    if cur != inv:
        h = {'previous': cur, 'current': inv, 'since': datetime.date.today().isoformat()}
        f.write_text(json.dumps(h, ensure_ascii=False, separators=(',', ':')), 'utf-8')
    prev, trend = h.get('previous'), {}
    if prev:
        for m, d in inv.items():
            pm, tm = prev.get(m, {}), {}
            for i, t in d.items():
                if i not in pm:
                    tm[i] = 'new'
                elif ORDER.index(t) < ORDER.index(pm[i]):
                    tm[i] = 'up'
                elif ORDER.index(t) > ORDER.index(pm[i]):
                    tm[i] = 'down'
            trend[m] = tm
    return trend, (h.get('since') if prev else None)


# ------------------------------------------------------------------ calculateur + traductions anglaises
def build_calc(fr, ids, jobs, im):
    """Matériaux d'ascension et de compétences (data/calc.json), noms d'objets FR/EN."""
    P, T = getj('character_promotions', 'fr'), getj('character_skill_trees', 'fr')
    IF, IE = getj('items', 'fr'), getj('items', 'en')
    used, calc = set(), {}
    pack = lambda ms: [x for m in ms for x in (m['id'], m['num'])]
    for k in ids:
        asc = [pack(m) for m in P[k]['materials'][:6]]
        sk = []
        for anchor in ('Point01', 'Point02', 'Point03', 'Point04'):
            node = next((T[t] for t in fr[k]['skill_trees'] if t in T and T[t].get('anchor') == anchor), None)
            sk.append([pack(l['materials']) for l in node['levels'][1:]] if node else [])
        for lst in asc + [x for s_ in sk for x in s_]:
            used.update(lst[0::2])
        calc[k] = {'a': asc, 's': sk}
    items = {i: {'f': IF[i]['name'], 'e': IE[i]['name'], 'r': IF[i]['rarity']} for i in used if i in IF}
    (DATA / 'calc.json').write_text(json.dumps({'items': items, 'c': calc}, ensure_ascii=False, separators=(',', ':')), 'utf-8')
    for i in items:
        jobs.append((IF[i]['icon'], im / f'i/{i}.webp', 64, 75))
    print(f'   calc.json : {len(calc)} personnages, {len(items)} objets')


def build_en(S, fr, chars, lcs, sets, LCe_, RSe_):
    en, Se, Re = getj('characters', 'en'), getj('character_skills', 'en'), getj('character_ranks', 'en')
    LRe = getj('light_cone_ranks', 'en')
    PAE = {'Warrior': 'Destruction', 'Rogue': 'The Hunt', 'Mage': 'Erudition', 'Shaman': 'Harmony', 'Warlock': 'Nihility', 'Knight': 'Preservation', 'Priest': 'Abundance', 'Memory': 'Remembrance', 'Elation': 'Elation'}
    clean = lambda d: re.sub(r'<[^>]+>', '', d or '')
    out = {'c': {}, 'l': {}, 's': {}}
    for c in chars:
        k, v = c['id'], en[c['id']]
        n = v['name'] if '{NICKNAME}' not in v['name'] else 'Trailblazer · ' + PAE[v['path']]
        sk = [{'n': Se[s]['name'], 'd': Se[s]['simple_desc'] or '', 'f': clean_desc(Se[s].get('desc'))} for s in fr[k]['skills'] if s in Se and (s in S and S[s]['type_text'] in SK_OK)]
        out['c'][k] = {'n': n, 's': sk, 'x': [{'n': Re[r]['name'], 'd': clean(Re[r]['desc'])} for r in fr[k]['ranks'] if r in Re]}
    for l in lcs:
        k = l['id']
        if k in LCe_ and k in LRe:
            out['l'][k] = {'n': LCe_[k]['name'], 'k': LRe[k]['skill'], 'd': fmt_g(LRe[k]['desc'], LRe[k]['params'])}
    for x in sets:
        if x['id'] in RSe_:
            out['s'][x['id']] = {'n': RSe_[x['id']]['name'], 'd': RSe_[x['id']]['desc']}
    (DATA / 'data_en.json').write_text(json.dumps(out, ensure_ascii=False, separators=(',', ':')), 'utf-8')
    print('   data_en.json écrit')


SK_OK = ('ATQ normale', 'Compétence', 'Ultime', 'Talent', 'Technique', 'Compétence du mnémesprit', 'Talent du mnémesprit', 'Comicompétence', 'Compétence de soutien')


def clean_desc(d):
    return re.sub(r'<[^>]+>', '', d or '').replace('\\n', '\n')


def skill_params(sk):
    # une ligne par niveau, valeurs arrondies (les % sont stockés en fraction : 0.5 = 50 %)
    return [[round(x, 4) for x in row] for row in (sk.get('params') or [])]


def fmt_g(d, pa):
    def f(m):
        x, y = pa[0][int(m[1]) - 1], pa[-1][int(m[1]) - 1]
        g = (lambda v: '%g' % round(v * 100, 2)) if m[2] == '%' else (lambda v: '%g' % round(v, 2))
        return (g(x) + '→' + g(y) if x != y else g(x)) + m[2]
    return re.sub(r'#(\d)\[(?:i|f\d)\](%?)', f, d)


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
    tiers, gen, eg, version = seed['overall'], seed['general'], seed['endgame'], manual.get('version')
    if not a.no_scrape:
        try:
            tiers, gen, eg, v = scrape_game8()
            version = v or version
            (DATA / 'seed_tiers.json').write_text(json.dumps({'overall': tiers, 'general': gen, 'endgame': eg}, ensure_ascii=False, indent=1), 'utf-8')
            print('   tier list mise à jour depuis Game8')
        except Exception as e:
            print('   ATTENTION Game8 indisponible, anciennes données conservées :', e)
    ids_of = lambda d: {t: [i for i in (rid(n) for n in ns) if i] for t, ns in d.items()}
    tiers_out = {'ov': ids_of(tiers), **{k: ids_of(v) for k, v in gen.items()}, **{k: ids_of(v) for k, v in eg.items()}}
    inv = {m: {i: t for t, l in d.items() for i in l} for m, d in tiers_out.items()}
    tier = inv['ov']
    trend, since = tier_trends(inv)
    tnotes = {}
    if (DATA / 'tier_notes.json').exists():
        for n_, note in json.loads((DATA / 'tier_notes.json').read_text('utf-8')).items():
            if not n_.startswith('_') and rid(n_):
                tnotes[rid(n_)] = note
    events = json.loads((DATA / 'events.json').read_text('utf-8')) if (DATA / 'events.json').exists() else []
    bj = json.loads((DATA / 'banners.json').read_text('utf-8'))
    # bannières automatiques (API communautaire Ennead) ; en cas d'échec on garde banners.json tel quel
    try:
        cal = json.loads(get('https://api.ennead.cc/mihoyo/starrail/calendar'))
        iso = lambda t: datetime.datetime.fromtimestamp(t - 8 * 3600, datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')  # heure serveur UTC+8 -> UTC
        now_ts = datetime.datetime.now(datetime.timezone.utc).timestamp() + 8 * 3600
        old = {}
        for x in bj['list']:
            if x.get('end') is not None and 'ollab' not in x.get('kind', ''):
                old[tuple(sorted(filter(None, (rid(n) for n in x.get('chars', [])))))] = (x.get('kind'), x.get('kind_en'))
        maxold = max([int(i) for k in old for i in k if i.isdigit()] or [0])
        ch, lc = {}, {}
        for b in cal.get('banners', []):
            if not b.get('start_time') or not b.get('end_time') or b['end_time'] < now_ts - 86400:
                continue
            key = (b['start_time'], b['end_time'])
            if b.get('characters'):
                ch[key] = b
            elif b.get('light_cones'):
                lc[key] = b
        auto = []
        for key, b in sorted(ch.items()):
            five = [c['name'] for c in b['characters'] if c.get('rarity') == 5]
            if not five:
                continue
            lcs = [x['name'] for x in (lc.get(key) or {}).get('light_cones', []) if x.get('rarity') == 5]
            fid = rid(five[0])
            prev = old.get(tuple(sorted(filter(None, (rid(n) for n in five)))))
            isnew = bool(fid) and fid.isdigit() and int(fid) > maxold
            kind, kind_en = prev if prev and prev[0] else (('Nouveau 5★', 'New 5★') if isnew else ('Rerun', 'Rerun'))
            auto.append({'chars': five, 'lcs': lcs, 'kind': kind, 'kind_en': kind_en, 'start': iso(key[0]), 'end': iso(key[1])})
        if auto:
            keep = [x for x in bj['list'] if x.get('end') is None or 'ollab' in x.get('kind', '')]
            bj['list'] = auto + keep
            r4 = [c['name'] for b in ch.values() for c in b['characters'] if c.get('rarity') == 4]
            if r4:
                bj['rateup4'] = list(dict.fromkeys(r4))
            print('  bannières mises à jour automatiquement :', len(auto))
    except Exception as ex:
        print('  bannières automatiques indisponibles (', ex, ') -> banners.json manuel conservé')
    lcn = {nz(v['name']): k for k, v in LCe.items()}
    for b in bj['list']:
        b['chars'] = [i for i in (rid(n) for n in b.get('chars', [])) if i]
        b['lcs'] = [lcn[nz(n)] for n in b.get('lcs', []) if nz(n) in lcn]
    bj['rateup4'] = [i for i in (rid(n) for n in bj.get('rateup4', [])) if i]

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
        sk = [{'n': S[s]['name'], 't': S[s]['type_text'], 'd': S[s]['simple_desc'] or '', 'f': clean_desc(S[s].get('desc')), 'pa': skill_params(S[s])} for s in v['skills']
              if s in S and S[s]['type_text'] in SK_OK]
        rk = [{'n': R[r]['name'], 'd': re.sub(r'<[^>]+>', '', R[r]['desc'])} for r in v['ranks'] if r in R]
        pv = P[k]['values'][6]
        f = lambda s: round(pv[s]['base'] + pv[s]['step'] * 79)
        c = {'id': k, 'n': n, 'r': v['rarity'], 'e': EL[v['element']], 'p': PA[v['path']], 'ei': v['element'], 'pi': v['path'], 's': sk, 'x': rk, 't': tier.get(k, '?'), 'tr': {m: inv[m][k] for m in inv if k in inv[m]},
             'lv': [[round(p[a]['base'], 2), round(p[a]['step'], 3)] for p in P[k]['values'] for a in ('hp', 'atk', 'def')],
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
    # repli : sets fréquents de la même voie, et équipes où le personnage apparaît chez les autres
    from collections import Counter
    pop = {}
    for c in chars:
        if c.get('b') and c['b'].get('rel'):
            cn = pop.setdefault(c['p'], [Counter(), Counter()])
            cn[0].update(p[0] for p in c['b']['rel'] if p[0] == p[1])
            cn[1].update(c['b'].get('orn', [])[:1])
    for c in chars:
        b = c.get('b')
        if not b:
            continue
        if not b.get('rel') and c['p'] in pop:
            b['rel'] = [[i, i] for i, _ in pop[c['p']][0].most_common(2)]
            b['orn'] = [i for i, _ in pop[c['p']][1].most_common(2)]
            b['fallback'] = True
        if not b.get('teams'):
            seen = []
            for o in chars:
                for team in (o.get('b') or {}).get('teams', []):
                    if any(m['c'] == c['id'] for m in team) and o['id'] != c['id'] and len(seen) < 3:
                        seen.append(team)
            b['teams'] = seen
            b['teams_from_others'] = bool(seen)
    lcs = [{'id': k, 'n': v['name'], 'r': v['rarity'], 'p': PA[v['path']], 'pi': v['path'], 'k': LR[k]['skill'], 'd': fmt(LR[k]['desc'], LR[k]['params'])} for k, v in LCf.items()]
    lcs.sort(key=lambda x: (-x['r'], x['n']))
    sets = [{'id': k, 'n': v['name'], 'd': v['desc'], 'pl': len(v['desc']) == 1} for k, v in RSf.items()]
    sets.sort(key=lambda x: (x['pl'], x['n']))
    out = {'version': version, 'updated': datetime.date.today().isoformat(), 'chars': chars, 'lcs': lcs, 'sets': sets, 'tiers': tiers_out, 'trend': trend, 'trend_since': since, 'tnotes': tnotes, 'events': events, 'banners': bj, 'manual': manual}
    (DATA / 'data.json').write_text(json.dumps(out, ensure_ascii=False, separators=(',', ':')), 'utf-8')
    print(f'   {len(chars)} personnages, {len(lcs)} cônes, {len(sets)} sets, {sum(1 for c in chars if "b" in c)} builds')

    extra = []
    build_calc(fr, ids, extra, ROOT / 'img')
    build_en(S, fr, chars, lcs, sets, LCe, RSe)

    if not a.skip_images:
        print('4/5 images…')
        im = ROOT / 'img'
        jobs = list(extra)
        for e_ in ('Fire', 'Ice', 'Thunder', 'Wind', 'Physical', 'Quantum', 'Imaginary'):
            jobs.append((f'icon/element/{e_}.png', im / f'e/{e_}.webp', 48, 85))
        for p_ in PA:
            jobs.append((f'icon/path/{PATH_ICON[p_]}.png', im / f'pa/{p_}.webp', 48, 85))
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
        h = re.sub(r'<script src="https://cdn.jsdelivr.net[^>]*></script>', '', h)
        h = h.replace('<script src="app.js"></script>', '<script>window.__DATA__=' + json.dumps(out, ensure_ascii=False, separators=(',', ':')) +
                      ';window.__DATA_EN__=' + (DATA / 'data_en.json').read_text('utf-8') + ';window.__CALC__=' + (DATA / 'calc.json').read_text('utf-8') + ';window.__IMG__=' + json.dumps(imgs) + ';</script><script>' + (ROOT / 'app.js').read_text('utf-8') + '</script>')
        Path(a.inline).write_text(h, 'utf-8')
    print('Terminé.')


if __name__ == '__main__':
    main()
