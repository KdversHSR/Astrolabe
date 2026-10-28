#!/usr/bin/env python3
"""Résumé des versions par jeu -> data/gg_versions.json
- Genshin : généré automatiquement à partir de paimon-moe (banners.js : version, dates, personnages vedettes).
- Autres jeux : données saisies à la main dans data/gg_versions_manual.json (fusionnées ici), jamais inventées.
Ne remplace jamais des données existantes par du vide."""
import json, re, subprocess, sys, urllib.request, os, tempfile, datetime
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = lambda *p: os.path.join(ROOT, 'data', *p)
PM = 'https://raw.githubusercontent.com/MadeBaruna/paimon-moe/main/src/data/banners.js'

def norm(s): return re.sub(r'[^a-z0-9]', '', s.lower())

def genshin():
    src = urllib.request.urlopen(PM, timeout=60).read().decode()
    tmp = tempfile.mkdtemp(); f = os.path.join(tmp, 'b.mjs'); open(f, 'w').write(src)
    out = subprocess.run(['node', '-e', f"import('{f}').then(m=>console.log(JSON.stringify(m.banners.characters)))"], capture_output=True, text=True, timeout=60)
    bans = json.loads(out.stdout)
    cards = json.load(open(D('cards.json')))['cards']
    names = {norm(c['n']): c['n'] for c in cards if c['g'] == 'gi'}
    def disp(i):
        n = norm(i)
        if n in names: return names[n]
        for k, v in names.items():
            if k.endswith(n) or n.endswith(k): return v
        return ' '.join(w.capitalize() for w in i.split('-'))
    vs = {}
    for b in bans:
        v = b.get('version')
        if not v: continue
        e = vs.setdefault(v, {'v': v, 'd': b['start'][:10], 'e': b['end'][:10], 'feat': [], 'ban': []})
        e['d'] = min(e['d'], b['start'][:10]); e['e'] = max(e['e'], b['end'][:10])
        for i in b.get('featured', []):
            n = disp(i)
            if n not in e['feat']: e['feat'].append(n)
        e['ban'].append(b.get('name', ''))
    return sorted(vs.values(), key=lambda x: [int(p) for p in x['v'].split('.')])

def main():
    path = D('gg_versions.json')
    try: data = json.load(open(path))
    except Exception: data = {}
    man = {}
    try: man = json.load(open(D('gg_versions_manual.json')))
    except Exception: pass
    for k, v in man.items():
        data[k] = dict(v, src='manual')
    try:
        g = genshin()
        if len(g) > 10:
            data['gi'] = {'src': 'auto', 'from': 'paimon-moe', 'checked': datetime.date.today().isoformat(), 'v': g}
    except Exception as ex:
        print('Genshin versions: échec, données conservées :', ex)
    json.dump(data, open(path, 'w'), ensure_ascii=False, indent=1)
    print({k: len(v.get('v', [])) for k, v in data.items()})
main()
