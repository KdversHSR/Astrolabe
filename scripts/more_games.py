#!/usr/bin/env python3
"""Construit data/cards_games2.json : Bleach Brave Souls, Dokkan Battle, Arknights Endfield, Fate/Grand Order, Nikke,
Neverness to Everness, One Piece Bounty Rush. Script de MAINTENANCE (rosters + raretés d'après les tier lists d'octobre 2026
de pocketgamer, pockettactics, keengamer, destructoid, allthings.how, gamezebo, icy-veins). Les images sont récupérées par
scripts/cards.py --art (GitHub Actions). Format d'une ligne : nom | type/élément | étoiles | q (0 commune … 4 légendaire) [| titre de page wiki]"""
import json, re, pathlib, unicodedata
ROOT = pathlib.Path(__file__).resolve().parent.parent
TL = {4: 'S', 3: 'A', 2: 'B', 1: 'C', 0: 'D'}
slug = lambda s: re.sub(r'[^a-z0-9]+', '', unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode().lower())

# ---------------- Arknights: Endfield (destructoid + keengamer) : e = élément
EF = '''Laevatain|fire|6|4
Yvonne|ice|6|4
Ardelia|plant|6|4
Gilberta|plant|6|3
Pogranichnik|phys|6|3
Last Rite|ice|6|3
Lifeng|phys|6|2
Endministrator|phys|6|2
Ember|fire|6|1
Alesh|ice|5|1
Arclight|elec|5|2
Avywenna|elec|5|2
Chen Qianyu|phys|5|2
Da Pan|phys|5|2
Perlica|elec|5|2
Snowshine|ice|5|2
Wulfgard|fire|5|1
Xaihi|ice|5|1
Akekuri|fire|4|0
Antal|elec|4|0
Catcher|phys|4|0
Estella|ice|4|0
Fluorite|plant|4|0'''
# ---------------- Neverness to Everness (pocketgamer + icy-veins)
NTE = '''Blackbird||5|4
Zankou||5|4
Lacrimosa|chaos|5|4
Nanally|anima|5|4
Shinku|cosmos|5|4
Hotori|cosmos|5|4
Sakiri||5|4
Linko||5|4
Chiz||5|3
Jiuyuan|anima|5|3
Akane Rin||5|4
Daffodill|chaos|5|3
Zero||5|3
Iroi|anima|5|3
Baicang|incantation|5|3
Haniel||4|3
Hathor|lakshana|4|3
Adler||4|2
Aurelia||4|2
Fadia||4|2
Mint||4|1
Skia||4|1
Edgar||4|0'''
# ---------------- Nikke (pockettactics, tiers « histoire ») : SS=4 S=3 A=2 B=1 C/D=0
NK = '''Anis: Star|4
Cinderella: Crystal Wave|4
Crown|4
Privaty|4
Rapi: Red Hood|4
Snow White: Heavy Arms|4
Ada Wong|3
Ein|3
Flora|3
Helm|3
Laplace: Ultimate Hero|3
Liberalio|3
Little Mermaid|3
Mast: Romantic Maid|3
Mint|3
Moran|3
Nayuta|3
Neon: Vision Eye|3
Scarlet: Black Shadow|3
Takina Inoue|3
Vesti: Tactical Upgrade|3
Ade: Agent Bunny|2
Alice|2
Anchor: Innocent Maid|2
Anis: Sparkling Summer|2
Brid: Silent Track|2
Chisato Nishikigi|2
Cinderella|2
Diesel: Winter Sweets|2
Dorothy: Serendipity|2
Grave|2
Guilty: Mighty Bunny|2
Liter|2
Mari Makinami|2
Maxwell: Ordinary Mechanic|2
Milk: Blooming Bunny|2
Miranda|2
Phantom|2
Prika|2
Red Hood|2
Rouge|2
Sin: Swift Bunny|2
Yukiko|2
Arcana: Fortune Mate|1
Asuka Shikinami Langley|1
Belorta: Pumpkin Witch|1
Blanc|1
Bready|1
Centi|1
Delta: Ninja Thief|1
Drake: Great Villain|1
EVE|1
Jill Valentine|1
Modernia|1
Naga|1
Rei Ayanami|1
Rosanna: Chic Ocean|1
Scarlet|1
Soline: Frost Ticket|1
Tia|1
Trina|1
Velvet|1
Volume|1
A2|0
Clay|0
Emilia|0
Mana|0
Noir|0
Queen|0
Rapunzel|0
Raven|0
Snow White|0
2B|0
Aigis|0
Rem|0
Makima|0'''
# ---------------- Fate/Grand Order (allthings.how) : nom | classe | q
FGO = '''Castoria|Caster|4
Koyanskaya of Light|Assassin|4
Oberon|Pretender|4
Solomon|Caster|4
U-Olga Marie|Beast|4
Yamato Takeru|Saber|4
Sakata Kintoki|Berserker|4
Arjuna (Alter)|Berserker|4
Morgan|Berserker|4
Ibuki-Douji|Berserker|4
Scathach-Skadi|Ruler|4
Merlin|Caster|4
Gilgamesh|Archer|3
Space Ishtar|Foreigner|3
Vlad III|Lancer|3
Galatea|Moon Cancer|3
Melusine|Lancer|3
Super Orion|Archer|3
Tamamo-no-Mae|Caster|3
Kama|Alter Ego|3
Nero Claudius (Bride)|Saber|2
Ozymandias|Rider|2
Edmond Dantes|Avenger|2
Andromeda|Foreigner|2
Mysterious Heroine X (Alter)|Assassin|2
Achilles|Rider|2
Nikola Tesla|Archer|2
Okita Souji|Saber|2
Mordred|Saber|2
Quetzalcoatl|Lancer|2
Medusa (Saber)|Saber|2
Zhuge Liang (El-Melloi II)|Caster|2
Cleopatra|Assassin|2
Katsushika Hokusai|Foreigner|2
Jeanne d'Arc (Alter)|Avenger|2
Abigail Williams|Foreigner|2
Minamoto-no-Raikou|Berserker|2
Iskandar|Rider|1
Sherlock Holmes|Ruler|1
Nightingale|Berserker|1
Jeanne d'Arc|Ruler|1
Kingprotea|Alter Ego|1
Artoria Pendragon|Saber|2
Mash Kyrielight|Shielder|1
Scathach|Lancer|2
Ishtar|Archer|2
Ereshkigal|Lancer|2
Cu Chulainn|Lancer|1
Emiya|Archer|1
Medea|Caster|1
Jack the Ripper|Assassin|1
Altria Pendragon (Alter)|Saber|1
Nursery Rhyme|Caster|1
Georgios|Rider|0
Hassan of the Cursed Arm|Assassin|0
Spartacus|Berserker|0
Cu Chulainn (Prototype)|Lancer|0'''
# ---------------- Dokkan Battle (pockettactics, LR) : nom | race | q
DK = '''True Ultra Instinct Goku|god|4
SSGSS Evolved Vegeta (True Warrior Race)|saiyan|4
Goku & Vegeta (Kaioken) SSGSS Evolved|saiyan|4
Ultimate Fusion Vegito|fusion|4
Ultimate Fusion Gogeta|fusion|4
Super Saiyan Gohan (Youth, Awakened)|saiyan|3
Turles & Destroyers of the Universe|saiyan|3
Majin Buu (Gotenks)|buu|3
Super Saiyan Broly (Nightmarish Impact)|saiyan|3
Goku (Ultra Instinct -Sign-)|god|3
Super Saiyan 4 Goku (Apex)|saiyan|3
Super Janemba|demon|3
Super Saiyan God Goku (Legend Reborn)|god|3
Jiren (Full Power)|universe|3
Goku Black (Super Saiyan Rosé)|god|3
Super Saiyan Goku (Miracle-Making)|saiyan|3
Perfect Cell|android|3
Super Saiyan 4 Vegeta (Unrivaled)|saiyan|3
Android 17 (Team Universe 7)|android|3
Golden Frieza & Android 17|frieza|3
Super Saiyan God Goku & Vegeta|god|2
Super Saiyan 2 Gohan (Youth)|saiyan|2
Piccolo (Power Awakening)|namek|2
Gohan (Beast)|saiyan|2
Super Baby 2|demon|2
Majin Vegeta|saiyan|2
Bardock|saiyan|2
Boujack|universe|2
Beerus & Whis|god|2
Legendary Super Saiyan Broly|saiyan|2
Frieza (Full Power)|frieza|2
Goku Black & Zamasu|god|2
Super Saiyan 3 Goku|saiyan|1
Super Saiyan Trunks (Teen)|saiyan|1
Ultimate Gohan|saiyan|1
Golden Frieza|frieza|1
Cooler (Final Form)|frieza|1
Master Roshi|human|1
Captain Ginyu|frieza|1
Omega Shenron|demon|1
Hit & Super Saiyan God Goku|universe|1
Super Saiyan 3 Gotenks|fusion|1
Uub (Teen)|human|1
Jackie Chun|human|1
Krillin|human|0
Hercule|human|0
Tien|human|0
Yamcha & Puar|human|0
Babidi|demon|0
Dr. Wheelo|android|0
Bio-Broly|android|0
Mecha Frieza & King Cold|frieza|0
Demon King Piccolo|namek|0
Pilaf Gang|human|0
Goku (Youth)|saiyan|0'''
# ---------------- Bleach Brave Souls (pocketgamer, TYBW…) : nom | faction | q
BB = '''Rukia Kuchiki (TYBW Reiokyu)|shinigami|4
Byakuya Kuchiki (TYBW Reiokyu)|shinigami|4
Yhwach (TYBW)|quincy|4
Genryusai Yamamoto (TYBW)|shinigami|4
Haschwalth (TYBW)|quincy|4
Ichigo Kurosaki (True Shikai)|shinigami|4
Uryu Ishida (Voll Stern Dich)|quincy|4
Ichigo Kurosaki (Special)|shinigami|4
Liltotto (TYBW)|quincy|4
Renji Abarai (TYBW)|shinigami|4
Jushiro Ukitake (TYBW)|shinigami|4
Shinji Hirako (Parasol)|shinigami|4
Toshiro Hitsugaya (Fierce Battle)|shinigami|4
Gin Ichimaru (Fierce Battle)|shinigami|4
Kenpachi Zaraki (9th Anniversary)|shinigami|4
Gremmy Thoumeaux|quincy|4
Grimmjow Jaegerjaquez|arrancar|4
Kisuke Urahara (Fierce Battle)|shinigami|4
Rangiku Matsumoto|shinigami|3
Orihime Inoue (Marine)|human|3
Kensei Muguruma|shinigami|3
Shuhei Hisagi|shinigami|3
Sosuke Aizen (Ayakashi)|shinigami|3
Bambietta Basterbine|quincy|3
Nelliel Tu Odelschwanck|arrancar|3
Tier Harribel|arrancar|3
Soi Fon|shinigami|3
Retsu Unohana|shinigami|3
Coyote Stark|arrancar|3
Yumichika Ayasegawa|shinigami|3
Ikkaku Madarame|shinigami|3
Yoruichi Shihoin|shinigami|3
Isshin Kurosaki|shinigami|3
Mayuri Kurotsuchi|shinigami|2
Shunsui Kyoraku|shinigami|2
Nanao Ise|shinigami|2
Sosuke Aizen (TYBW)|shinigami|2
Yachiru Kusajishi|shinigami|2
Chad Yasutora Sado|human|2
Ulquiorra Cifer|arrancar|2
Barragan Louisenbairn|arrancar|2
Izuru Kira|shinigami|2
Sajin Komamura|shinigami|2
Kon (Karakukizer)|human|2
Jugram Haschwalth|quincy|1
Lilynette Gingerback|arrancar|1
Ichibe Hyosube|shinigami|1
Hiyori Sarugaki|shinigami|1
Askin Nakk Le Vaar|quincy|1
White Zangetsu|shinigami|1
Wonderweiss Margela|arrancar|0
Ginrei Kuchiki|shinigami|0'''
# ---------------- One Piece Bounty Rush (gamezebo, commonsensegamer) : nom | rôle | q
OP = '''Pirate King Luffy|attacker|4
Oiran Olin|attacker|4
Roronoa Zoro (Rock of Ages)|attacker|4
Yamato (Hybrid)|attacker|4
Kaido (Hybrid)|attacker|4
Gol D. Roger|attacker|4
Shanks (Four Emperors)|attacker|4
Uta|supporter|4
Oden|attacker|4
Yamato|attacker|3
Nami (Rock of Ages)|supporter|3
King|attacker|3
Charlotte Cracker|attacker|3
Trebol|supporter|3
Brook|runner|3
Kaido|attacker|3
Akainu|attacker|3
Blackbeard|attacker|3
Monkey D. Luffy|attacker|3
Dracule Mihawk|attacker|3
Gecko Moria|attacker|3
Smoker|defender|3
Arlong|attacker|3
Tashigi|runner|2
Crocodile|defender|2
Sakazuki Akainu|attacker|2
Enel|attacker|2
Kaya|defender|2
Sanji|defender|2
Buggy|runner|2
Captain Kuro|attacker|2
Wednesday Vivi|runner|2
Shanks|attacker|2
Roronoa Zoro|defender|2
Sabo|attacker|2
Koby|defender|1
Alvida|runner|1
Nico Robin|attacker|1
Zeff|defender|1
Usopp|attacker|1
Nami|attacker|1
Franky|defender|1
Don Krieg|attacker|0
Tony Tony Chopper|runner|0
Higuma|attacker|0
Helmeppo|runner|0
Johnny|runner|0'''

def build():
    out = []
    def add(g, n, e, r, q, st=None, wk=None, dd=None):
        c = {'id': f'{g}-{slug(n)}', 'g': g, 'n': n, 'ne': n, 'r': 5 if r >= 5 else 4, 'e': e or 'unk', 'q': q, 'tl': TL[q], 'wk': wk or n}
        if st: c['st'] = st
        if dd: c['d'], c['de'] = dd
        out.append(c)
    for l in EF.split('\n'):
        n, e, st, q = l.split('|'); st = int(st); add('ef', n, e, st, int(q), st,
            dd=(f"Opérateur {st}★ d’Arknights: Endfield, élément {{E}}. Classé {TL[int(q)]} dans la tier list actuelle.", f"{st}★ Arknights: Endfield operator, {{E}} element. Ranked {TL[int(q)]} in the current tier list."))
    for l in NTE.split('\n'):
        n, e, r, q = l.split('|'); add('nte', n, e or 'unk', int(r), int(q), 5 if int(r) >= 5 else 4)
    for l in NK.split('\n'):
        n, q = l.split('|'); q = int(q); add('nk', n, 'unk', 5 if q >= 2 else 4, q, 5 if q >= 2 else 4, wk=n)
    for l in FGO.split('\n'):
        n, cl, q = l.split('|'); q = int(q); add('fgo', n, cl.lower().replace(' ', '') or 'unk', 5, q, 5 if q >= 3 else 4 if q >= 1 else 3, wk=n)
    for l in DK.split('\n'):
        n, e, q = l.split('|'); q = int(q); add('dk', n, e, 5 if q >= 2 else 4, q, 5 if q >= 2 else 4, wk=re.sub(r'\s*\(.*?\)', '', n))
    for l in BB.split('\n'):
        n, e, q = l.split('|'); q = int(q); add('bb', n, e, 5 if q >= 2 else 4, q, 6 if q >= 3 else 5 if q >= 1 else 4, wk=re.sub(r'\s*\(.*?\)', '', n))
    for l in OP.split('\n'):
        n, e, q = l.split('|'); q = int(q); add('op', n, e, 5 if q >= 2 else 4, q, 6 if q >= 4 else 5 if q >= 2 else 4, wk=re.sub(r'\s*\(.*?\)', '', n))
    seen, res = set(), []
    for c in out:
        if c['id'] in seen: continue
        seen.add(c['id']); res.append(c)
    return res

NAMES = {  # libellés d'éléments / types (français, anglais) pour les textes
 'fire': ('Chaleur', 'Heat'), 'ice': ('Cryo', 'Cryo'), 'elec': ('Électrique', 'Electric'), 'plant': ('Nature', 'Nature'), 'phys': ('Physique', 'Physical')}
if __name__ == '__main__':
    cards = build()
    for c in cards:
        if c['g'] == 'ef':
            fr, en = NAMES.get(c['e'], (c['e'], c['e']))
            c['d'] = f"Opérateur {c['st']}★ d’Arknights: Endfield, élément {fr}. Classé {c['tl']} dans la tier list actuelle."
            c['de'] = f"{c['st']}★ Arknights: Endfield operator, {en} element. Ranked {c['tl']} in the current tier list."
    json.dump({'v': 1, 'cards': cards}, open(ROOT / 'data/cards_games2.json', 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
    from collections import Counter
    print(len(cards), dict(Counter(c['g'] for c in cards)), dict(Counter(c['q'] for c in cards)))
