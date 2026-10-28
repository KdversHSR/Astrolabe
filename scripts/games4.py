#!/usr/bin/env python3
"""Construit data/cards_games4.json : Blue Archive (ba), Arknights (ak), Azur Lane (al).
Script de MAINTENANCE. Les rosters sont des personnages emblématiques connus ; la rareté (q 0..4) est une ESTIMATION de popularité, pas un classement officiel.
Format : nom | type | étoiles | q | titre de page wiki (optionnel). Les images viennent de scripts/cards.py --art (wikis Fandom, correspondance stricte du nom)."""
import json, re, pathlib, unicodedata
ROOT = pathlib.Path(__file__).resolve().parent.parent
TL = {4: 'S', 3: 'A', 2: 'B', 1: 'C', 0: 'D'}
slug = lambda s: re.sub(r'[^a-z0-9]+', '', unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode().lower())
BA = '''Shiroko|student|3|4
Hoshino|student|3|4
Aru|student|3|3
Hina|student|3|3
Yuuka|student|3|3
Noa|student|3|3
Mika|student|3|4
Nagisa|student|3|3
Seia|student|3|3
Mari|student|3|3
Hifumi|student|3|3
Koharu|student|3|3
Azusa|student|3|3
Hanako|student|3|2
Mashiro|student|3|2
Serika|student|3|3
Nonomi|student|3|2
Ayane|student|3|2
Haruka|student|3|2
Mutsuki|student|3|2
Kayoko|student|3|2
Ako|student|3|3
Iori|student|3|3
Chinatsu|student|3|2
Izuna|student|3|3
Kirino|student|3|2
Kanna|student|3|3
Miyako|student|3|3
Saki|student|3|3
Moe|student|3|2
Miyu|student|3|2
Rio|student|3|3
Momoi|student|3|3
Midori|student|3|3
Yuzu|student|3|2
Aris|student|3|4
Koyuki|student|3|2
Karin|student|3|3
Asuna|student|3|4
Neru|student|3|4
Akane|student|3|3
Toki|student|3|3
Hibiki|student|3|2
Tsurugi|student|3|3
Ichika|student|3|3
Hasumi|student|3|3
Sakurako|student|3|2
Kokona|student|3|3'''
AK = '''Amiya|caster|5|4
Exusiai|sniper|6|4
Texas|vanguard|5|3
Lappland|guard|5|3
SilverAsh|guard|6|4
Eyjafjalla|caster|6|4
Ch'en|guard|6|4|Ch'en
Skadi|guard|6|4
Saria|defender|6|3
Hoshiguma|defender|6|4
Mudrock|defender|6|3
Surtr|guard|6|4
Mostima|caster|6|4
Kal'tsit|medic|6|4|Kal'tsit
Nearl|defender|5|2
Ifrit|caster|6|3
Specter|guard|6|3
Thorns|guard|6|3
Blaze|guard|6|2
Ceobe|caster|6|3
Ptilopsis|medic|5|2
Silence|medic|5|2
Angelina|supporter|6|3
Suzuran|supporter|6|3
Weedy|specialist|6|3
Gavial|medic|5|2
Warfarin|medic|5|1
Nightingale|medic|6|3
Irene|guard|6|3
Typhon|sniper|6|3
Fiammetta|sniper|6|3
Rosmontis|caster|6|4
Dusk|caster|6|4
Ling|supporter|6|4
Nian|defender|6|3
Chongyue|guard|6|4
Ines|specialist|6|3
Viviana|guard|6|3
Mountain|guard|6|3
Penance|defender|6|3
Lee|guard|6|3
Mizuki|specialist|6|3
Reed|guard|6|2
Executor|sniper|5|2
Siege|vanguard|6|3
Bagpipe|vanguard|6|3
Flametail|guard|6|3
Schwarz|sniper|6|3'''
AL = '''Enterprise|cv|5|4
Belfast|cl|5|4
Laffey|dd|5|4
Javelin|dd|5|3
Z23|dd|5|3
Prinz Eugen|ca|5|3
Bismarck|bb|5|3
Akagi|cv|5|3
Kaga|cv|5|3
Amagi|bc|5|3
Atago|ca|5|3
Takao|ca|5|3
Taihou|cv|5|3
Shimakaze|dd|5|3
Unicorn|cvl|5|3
Illustrious|cv|5|3
Formidable|cv|5|3
Sirius|cl|5|3
Cleveland|cl|5|3
Hood|bc|5|4
Warspite|bb|5|3
Queen Elizabeth|bb|5|3
Vestal|ar|5|2
Jean Bart|bb|5|3
Richelieu|bb|5|3
Georgia|bb|5|3
Montpelier|cl|4|2
Ayanami|dd|4|3
Nagato|bb|5|3
Mutsu|bb|5|3
Yamashiro|bb|5|2
Fusou|bb|5|2
Kashino|ar|5|3
Ning Hai|cl|4|2
Ping Hai|cl|4|2
Hakuryuu|cv|5|2
Vauquelin|dd|5|3
Le Malin|dd|5|3
Bache|dd|4|2
Cassin|dd|4|2'''
EN = {'student': ('Élève', 'Student'), 'caster': ('Caster', 'Caster'), 'sniper': ('Sniper', 'Sniper'), 'vanguard': ('Avant-garde', 'Vanguard'), 'guard': ('Garde', 'Guard'),
      'defender': ('Défenseur', 'Defender'), 'medic': ('Médecin', 'Medic'), 'supporter': ('Soutien', 'Supporter'), 'specialist': ('Spécialiste', 'Specialist'),
      'dd': ('Destroyer', 'Destroyer'), 'cl': ('Croiseur léger', 'Light cruiser'), 'ca': ('Croiseur lourd', 'Heavy cruiser'), 'bb': ('Cuirassé', 'Battleship'),
      'bc': ('Croiseur de bataille', 'Battlecruiser'), 'cv': ('Porte-avions', 'Carrier'), 'cvl': ('Porte-avions léger', 'Light carrier'), 'ar': ('Réparation', 'Repair ship')}
G = {'al': ('Azur Lane', AL, 5)}   # Blue Archive et Arknights : voir scripts/gh_images.py (données + images liées)
def build():
    out = []
    for g, (gn, raw, top) in G.items():
        for l in raw.split('\n'):
            p = l.split('|'); n, e, st, q = p[0], p[1], int(p[2]), int(p[3]); wk = p[4] if len(p) > 4 else n
            fr, en = EN[e]; t = TL[q]
            out.append({'id': f'{g}-{slug(n)}', 'g': g, 'n': n, 'ne': n, 'r': 5 if st >= top else 4, 'e': e, 'q': q, 'tl': t, 'wk': wk, 'st': st,
                        'd': f"Personnage {st}★ de {gn}, classe {fr}. Rareté estimée {t} d'après la popularité (non officielle).",
                        'de': f"{st}★ {gn} character, {en} type. Rarity estimated {t} from popularity (unofficial)."})
    return out
if __name__ == '__main__':
    cards = build(); ids = [c['id'] for c in cards]; assert len(ids) == len(set(ids)), 'doublons'
    json.dump({'v': 1, 'cards': cards}, open(ROOT / 'data/cards_games4.json', 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
    from collections import Counter
    print(len(cards), dict(Counter(c['g'] for c in cards)))
