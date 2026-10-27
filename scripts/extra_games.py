#!/usr/bin/env python3
"""Construit data/cards_games.json : cartes Wuthering Waves, Reverse: 1999 et Umamusume.

Script de MAINTENANCE (lancé à la main, pas par GitHub Actions) : il lit des données déjà téléchargées.
  WuWa  : git clone https://github.com/Arikatsu/WutheringWaves_Data   (noms, éléments, raretés, descriptions FR/EN officiels)
  Uma   : git clone https://github.com/uma-moe/umamoe-resources        (master.mdb : noms et phrases d'accroche officiels)
  R1999 : liste codée ci-dessous (aucune source de données ouverte fiable) + tier list.
Usage : python3 scripts/extra_games.py <dossier_WuWa> <dossier_Uma>
Les raretés viennent des tier lists consultées en octobre 2026 (voir TIERS)."""
import json, re, sqlite3, sys, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
nn = lambda x: re.sub(r'[^a-z0-9]', '', x.lower())

# ---------------------------------------------------------------- tier lists (octobre 2026)
WW_T = {  # timesaver.gg, v3.7 phase II  ->  q : 4 légendaire … 0 commune
 4: 'Hiyuki, Jingran, Qingxiao, Yangyang: Xuanling, Denia, Iuno, Lucilla, Lynae, Chisa, Mornye, Suisui, Shorekeeper, Aemeath, Hsin, Luuk Herssen, Sigrika, Lupa, Qiuyuan, Rebecca, Verina',
 3: 'Augusta, Cartethyia, Galbrena, Lucy, Phrolova, Ciaccona, Mortefi, Rover: Electro, Carlotta, Buling, Rover: Aero',
 2: 'Brant, Jiyan, Zani, Cantarella, Changli, Phoebe, Sanhua, Rover: Spectro, Camellya, Encore, Jinhsi, Lingyang, Xiangli Yao, Danjin, Roccia, Yinlin, Zhezhi, Baizhi',
 1: 'Calcharo, Chixia, Rover: Havoc, Aalto, Jianxin, Lumi, Taoqi, Yangyang, Youhu, Yuanwu'}
R9_T = {  # pocketgamer.com, v3.8.0 : S A B C D(E,F)
 4: 'Narcissus, Hedone, Lorentz Butterfly, Ramona, Rhiannon, Twins, Enigma, Beryl, Paper Heron, Brume, Rubuska, Marsha, Igor, Recoleta, Charon, Sentinel, Ezio Auditore, Fatutu, Flutterpage, Anjo Nala, Jiu Niangzi, Kakania, Getian, Lucy, Nautika, Isolde, Kanania, Windsong, Vila, An-An Lee, Bkornblume, Liang Yue, Black Dwarf, Centurion, Dikke, Eternity, Medicine Pocket, Voyager, Sonetto, Shamane, Regulus, Ulrich, Ezra Theodore, Kiperina, Hissabeth',
 3: 'Ms Stranger, Everecho, Silverwing Eagle, Corvus, Coppelia, Cheng Heguang, Melania, Kassandra, A Knight, Alexios, Willow, Noire, Barcarola, Baby Blue, Argus, Reed, Lopera, Tuesday, Moldir, Aleph, Semmelweis, Balloon Party, Lorelei, Name Day, Marcus, Desert Flannel, Kaalaa Baunaa, Spathodea, Bette, Mercuria, Charlie, Pickles, Druvis III, Buddy Fairchild, Eagle, Erick, La Source, Oliver Fog',
 2: 'Yenisei, APPLe, Horropedia, Diggers, Loggerhead, Tooth Fairy, Click, White Rum, Kanjira, Leilani, J, Lilya, Matilda, Mondlicht, Necrologist, Pavia, The Fool, Twins Sleep, X',
 1: 'Cristallo, Ms. Newbabel, Nick Bottom, Rabies, Mr. Duncan, Satsuki, Ulu, Sotheby, Sweetheart, Avgust, Zima',
 0: 'aliEn T, Darley Clatter, Door, Tennant, Mesmer Jr., Ms. Moissan, Poltergeist, Bunny Bunny, Brimley, John Titor, Ms. Radio, Sputnik, TTT, ONiON'}
UM_T = {  # progameguides.com
 4: 'Oguri Cap, Maruzensky, Taiki Shuttle, Symboli Rudolf, Rice Shower',
 3: 'Silence Suzuka, El Condor Pasa, Mejiro McQueen, Special Week, T.M. Opera O, Mayano Top Gun, Mihono Bourbon',
 2: 'Biwa Hayahide, Tokai Teio, Daiwa Scarlet, Air Groove, Grass Wonder, Gold Ship, Vodka',
 1: 'Nice Nature, Sakura Bakushin O, Matikanefukukitaru, King Halo, Super Creek',
 0: 'Haru Urara, Mejiro Ryan, Winning Ticket, Agnes Tachyon'}
TLN = {4: 'S', 3: 'A', 2: 'B', 1: 'C', 0: 'D'}
def tier_idx(T):
    return {nn(x): q for q, s in T.items() for x in s.split(', ')}

def clean(t, n=170):
    t = re.sub(r'<[^>]+>', '', t or ''); t = re.sub(r'\s+', ' ', t).strip()
    if len(t) <= n: return t
    cut = t[:n]; k = max(cut.rfind('. '), cut.rfind('! '), cut.rfind('? '))
    return cut[:k + 1] if k > 60 else cut.rsplit(' ', 1)[0] + '…'

# ---------------------------------------------------------------- Wuthering Waves
def wuwa(src):
    src = pathlib.Path(src)
    d = json.load(open(src / 'BinData/role/roleinfo.json'))
    tm = lambda lg: {x['Id']: x['Content'] for x in json.load(open(src / f'Textmaps/{lg}/multi_text/MultiText.json'))}
    en, fr = tm('en'), tm('fr')
    EL = {1: 'ice', 2: 'fire', 3: 'elec', 4: 'wind', 5: 'spectro', 6: 'havoc'}
    idx = tier_idx(WW_T); out, seen = [], set()
    for r in d:
        if r['IsTrial'] or r['ParentId'] != 0 or r['RoleType'] != 1: continue
        ne = (en.get(r['Name']) or '').strip(); n = (fr.get(r['Name']) or ne).strip()
        if not ne or r['ElementId'] not in EL: continue
        if ne.startswith('Rover'):                    # un seul Rover par élément
            if ne in seen: continue
        seen.add(ne)
        q = idx.get(nn(ne.replace('Yangyang: Xuanling', 'Yangyang Xuanling')))
        if q is None: q = idx.get(nn(ne.split(':')[0])) if not ne.startswith('Rover') else None
        if ne == 'Yangyang': q = 1
        if q is None: q = 2 if r['QualityId'] == 5 else 1
        c = {'id': 'ww-' + str(r['Id']), 'g': 'ww', 'n': n, 'ne': ne, 'r': int(r['QualityId']), 'e': EL[r['ElementId']], 'q': q, 'tl': TLN[q],
             'd': clean(fr.get(r['Introduction']) or en.get(r['Introduction'])), 'de': clean(en.get(r['Introduction'])), 'wk': ne.replace('Rover: ', 'Rover (') + (')' if ne.startswith('Rover') else '')}
        out.append(c)
    return out

# ---------------------------------------------------------------- Reverse: 1999
R9 = '''6|Mineral|The Twins, Rubuska, Sentinel, Kassandra, Recoleta, Fatutu, Jiu Niangzi, Semmelweis, Kaalaa Baunaa, Pickles, Eternity, Ms. NewBabel
6|Intellect|Enigma, Lorentz Butterfly, Beryl, Corvus, Ulrich, Aleph, Lucy, 6
6|Plant|Ramona, Paper Heron, Hissabeth, Noire, Willow, Argus, Kakania, Vila, Marcus, Jessica, An-an Lee, Druvis III, Sotheby
6|Star|Cheng Heguang, Ezio Auditore, Kiperina, Liang Yue, Barcarola, Flutterpage, Windsong, Ezra, 37, Tooth Fairy, Lilya, Regulus, Voyager
6|Beast|Igor, Marsha, Brume, Moldir, Lopera, Anjo Nala, J, Getian, Spathodea, Shamane, Melania, Centurion, Medicine Pocket
6|Spirit|Charon, Nautika, Tuesday, Mercuria, Isolde, A Knight
5|Plant|Buddy Fairchild, Loggerhead, Avgust, Kanjira, Diggers, Bkornblume, Satsuki
5|Beast|Alexios, Mr. Duncan, Desert Flannel, Dikke, Sweetheart, Tennant
5|Mineral|Name Day, Brimley, Ulu, Horropedia, Balloon Party, Necrologist, Sonetto
5|Star|Lorelei, Yenisei, Blonney, Baby Blue, Charlie, Matilda
5|Spirit|Barbara, Click
5|Intellect|X
4|Spirit|NORA, Poltergeist
4|Plant|Reed, Eagle, Rabies, Zima
4|Intellect|White Rum, Mesmer Jr.
4|Star|APPLe, Erick, Oliver Fog, TTT
4|Beast|Bunny Bunny, Nick Bottom, Pavia
4|Mineral|Cristallo, Mondlicht, Ms. Moissan
5|unk|Narcissus, Hedone, Rhiannon, Everecho, Ms Stranger, Coppelia, Silverwing Eagle, Black Dwarf, Kanania'''
AFN = {'Mineral': ('Minéral', 'Mineral'), 'Intellect': ('Intellect', 'Intellect'), 'Plant': ('Plante', 'Plant'), 'Star': ('Étoile', 'Star'), 'Beast': ('Bête', 'Beast'), 'Spirit': ('Esprit', 'Spirit'), 'unk': ('Arcaniste', 'Arcanist')}
def r1999():
    idx = tier_idx(R9_T); out = []; seen = set()
    for line in R9.split('\n'):
        st, af, names = line.split('|')
        for nme in names.split(', '):
            k = nn(nme)
            if k in seen: continue
            seen.add(k); q = idx.get(k)
            if q is None and k == 'ezra': q = idx.get('ezratheodore')
            if q is None: q = {6: 3, 5: 2, 4: 1}[int(st)]
            a = AFN[af]; stars = int(st)
            fr = f"Arcaniste {stars}★ d’affinité {a[0]}" + (f", classé {TLN[q]} dans la tier list actuelle." if k in idx else '.')
            en = f"{stars}★ Arcanist of the {a[1]} afflatus" + (f", ranked {TLN[q]} in the current tier list." if k in idx else '.')
            out.append({'id': 'r99-' + k, 'g': 'r99', 'n': nme, 'ne': nme, 'r': 5 if stars >= 5 else 4, 'e': af.lower() if af != 'unk' else 'unk', 'q': q, 'tl': TLN[q], 'd': fr, 'de': en, 'wk': nme})
    return out

# ---------------------------------------------------------------- Umamusume
def uma(src):
    c = sqlite3.connect(pathlib.Path(src) / 'master.mdb'); idx = tier_idx(UM_T); out = []
    tx = lambda cat, i: (c.execute('select text from text_data where category=? and "index"=?', (cat, i)).fetchone() or [''])[0]
    best = dict(c.execute('select chara_id, max(default_rarity) from card_data group by chara_id').fetchall())
    for (cid,) in c.execute('select id from chara_data where id between 1001 and 1999 order by id').fetchall():
        ne = tx(170, cid).strip()
        if not ne or cid not in best: continue
        tag = re.sub(r'\s+', ' ', tx(144, cid).replace('\\n', ' ')).strip()
        k = nn(ne); q = idx.get(k, None)
        if q is None: q = {3: 2, 2: 1, 1: 0}.get(best[cid], 1)
        out.append({'id': f'uma-{cid}', 'g': 'uma', 'n': ne, 'ne': ne, 'r': 5 if best[cid] >= 3 else 4, 'e': 'uma', 'q': q, 'tl': TLN[q] if k in idx else '', 'd': '', 'de': tag, 'wk': ne})
    return out

if __name__ == '__main__':
    ww, um = sys.argv[1], sys.argv[2]
    cards = wuwa(ww) + r1999() + uma(um)
    # traductions FR des phrases Umamusume (data/uma_fr.json : {nom anglais: phrase})
    try:
        fr = json.load(open(ROOT / 'data/uma_fr.json', encoding='utf-8'))
        for c in cards:
            if c['g'] == 'uma': c['d'] = fr.get(c['ne']) or c['de']
    except FileNotFoundError:
        for c in cards:
            if c['g'] == 'uma': c['d'] = c['de']
    json.dump({'v': 1, 'cards': cards}, open(ROOT / 'data/cards_games.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
    from collections import Counter
    print(len(cards), dict(Counter(c['g'] for c in cards)), 'q:', dict(Counter(c['q'] for c in cards)))
