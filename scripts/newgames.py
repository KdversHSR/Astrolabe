#!/usr/bin/env python3
"""Construit data/cards_games3.json : Persona 5: The Phantom X (p5x) et Bleach: Mirrors High (bmh).
Script de MAINTENANCE. P5X : rosters recoupés (samurai-gamers, pcgamesn, dbltap) + tier list globale driffle (juin 2026).
BMH : roster connu à la veille du lancement (28 oct. 2026) ; rareté = ESTIMATION (aucune tier list officielle).
Format : nom | élément/rôle | étoiles | q (0..4) | titre de page wiki (optionnel). Les images viennent de scripts/cards.py --art."""
import json, re, pathlib, unicodedata
ROOT = pathlib.Path(__file__).resolve().parent.parent
TL = {4: 'S', 3: 'A', 2: 'B', 1: 'C', 0: 'D'}
slug = lambda s: re.sub(r'[^a-z0-9]+', '', unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode().lower())
P5X = '''Futaba Sakura (Oracle)|almighty|5|4|Futaba Sakura
Masaki Ashiya|ice|5|4
Ayaka Sakai (Chord)|elec|5|4
Yaoling Li (Firecracker)|fire|5|4
Minami Miyashita (Marian)|bless|5|4
Runa Dogenzaka|fire|5|4
Kasumi Yoshizawa|bless|5|4
Riko Tanemura (Navi)|almighty|4|4
Motoha Arai (Tropical)|bless|5|4
Justine & Caroline (Strategist)|almighty|5|4|Justine and Caroline
Kotone (Frostgale)|wind|5|4
Riko Tanemura (Tempest)|wind|5|4
Haru Okumura (Noir)|psy|5|3
Chizuko Nagao (Vino)|nuke|5|3
Mio Natsukawa|ice|5|3
Justine & Caroline (Assassin)|almighty|5|3|Justine and Caroline
Kira Kitazato (Messa)|phys|5|3
Lufel (Cattle)|fire|4|3
Yumi Shiina (Phoebe)|almighty|5|3
Ann Takamaki (Panther)|fire|5|3
Tomoko Noge (Seaside)|psy|5|3
Mayumi Hashimoto|phys|5|3
Justine & Caroline (Medic)|almighty|5|3|Justine and Caroline
Justine & Caroline (Sweeper)|almighty|5|3|Justine and Caroline
Haruna Nishimori (Riddle)|psy|5|2
Reo Kamiyama (Leon)|nuke|4|2
Goro Akechi (Crow)|almighty|5|2
Morgana (Mona)|wind|5|2
Makoto Niijima (Queen)|nuke|5|2
Seiji Shiratori (Fleuret)|wind|4|2
Yaoling Li (Rin)|curse|5|2
Shun Kano (Soy)|ice|4|2
Ren Amamiya (Joker)|curse|5|2
Miyu Sahara (Puppet)|almighty|4|2
Yusuke Kitagawa (Fox)|ice|5|2
Justine & Caroline (Guardian)|almighty|5|2|Justine and Caroline
Ryuji Sakamoto (Skull)|phys|5|2
Wonder (Protagoniste)|phys|5|2|Wonder
Yukimi Fujikawa (Yuki)|bless|4|1
Kiyoshi Kurotani (Key)|fire|4|1
Motoha Arai (Closer)|elec|4|1
Tomoko Noge (Moko)|psy|4|1
Kayo Tomiyama (Okyann)|almighty|4|1
Toshiya Sumi (Sepia)|nuke|4|1
Justine & Caroline (Saboteur)|almighty|5|1|Justine and Caroline
Kotone Montagne (Mont)|ice|4|1
Musubi Matsukata (Bui)|elec|5|1'''
BMH = '''Ichigo Kurosaki|combo|4|4|Ichigo Kurosaki
Sosuke Aizen|shadow|4|4|Sosuke Aizen
Byakuya Kuchiki|shadow|4|3|Byakuya Kuchiki
Grimmjow Jaegerjaquez|crush|4|3|Grimmjow Jaegerjaquez
Toshiro Hitsugaya|combo|4|3|Toshiro Hitsugaya
Yoruichi Shihoin|shadow|4|3|Yoruichi Shihoin
Kisuke Urahara|chain|4|3|Kisuke Urahara
Bambietta Basterbine|crush|4|3|Bambietta Basterbine
Renji Abarai|crush|3|2|Renji Abarai
Uryu Ishida|combo|3|2|Uryu Ishida
Orihime Inoue|chain|3|2|Orihime Inoue
Yasutora Sado (Chad)|tank|3|2|Yasutora Sado
Rangiku Matsumoto|chain|3|2|Rangiku Matsumoto
Mayuri Kurotsuchi|chain|3|2|Mayuri Kurotsuchi
Rukia Kuchiki|chain|3|2|Rukia Kuchiki
Shirin Migishima|combo|4|3
Shirane Sanari|combo|4|3
Naru Jurinna|chain|3|1
Giro Hando|crush|3|1
Maiko Tokishima|tank|3|1
Kuon Hoshimura|combo|3|1
Kanuka Sanakura|chain|3|1
Ibuki Kajimaru|crush|3|1
Hachirota Rohbe|tank|3|1
Daikaku Sohaji|tank|3|1
Tasuku Nimura|shadow|3|0
Tamesu Gocho|chain|3|0
Soyogi Sukenaga|shadow|3|0
Seishiro Ginza|combo|3|0
Mizuki Gandera|crush|3|0'''
EN = {'almighty': ('Tout-puissant', 'Almighty'), 'fire': ('Feu', 'Fire'), 'ice': ('Glace', 'Ice'), 'elec': ('Électrique', 'Electric'),
      'wind': ('Vent', 'Wind'), 'phys': ('Physique', 'Physical'), 'psy': ('Psy', 'Psychokinesis'), 'nuke': ('Nucléaire', 'Nuclear'),
      'bless': ('Bénédiction', 'Bless'), 'curse': ('Malédiction', 'Curse'),
      'combo': ('Combo', 'Combo'), 'crush': ('Crush', 'Crush'), 'chain': ('Chain', 'Chain'), 'shadow': ('Shadow', 'Shadow'), 'tank': ('Tank', 'Tank')}
def build():
    out = []
    for g, raw in (('p5x', P5X), ('bmh', BMH)):
        for l in raw.split('\n'):
            p = l.split('|'); n, e, st, q = p[0], p[1], int(p[2]), int(p[3]); wk = p[4] if len(p) > 4 else re.sub(r'\s*\(.*?\)', '', n)
            fr, en = EN[e]; t = TL[q]
            if g == 'p5x':
                d = f"Personnage {st}★ de Persona 5: The Phantom X, type {fr}. Classé {t} dans la tier list globale (juin 2026)."
                de = f"{st}★ Persona 5: The Phantom X character, {en} type. Ranked {t} in the global tier list (June 2026)."
            else:
                d = f"Personnage {st}★ de Bleach: Mirrors High, rôle {fr}. Rareté estimée {t} avant le lancement (28 oct. 2026) — non officielle."
                de = f"{st}★ Bleach: Mirrors High character, {en} role. Estimated {t} before launch (Oct 28, 2026) — unofficial."
            out.append({'id': f'{g}-{slug(n)}', 'g': g, 'n': n, 'ne': n, 'r': 5 if st >= 5 or (g == 'bmh' and st >= 4) else 4, 'e': e, 'q': q, 'tl': t, 'wk': wk, 'st': st, 'd': d, 'de': de})
    return out
if __name__ == '__main__':
    cards = build(); ids = [c['id'] for c in cards]; assert len(ids) == len(set(ids)), 'doublons'
    json.dump({'v': 1, 'cards': cards}, open(ROOT / 'data/cards_games3.json', 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
    from collections import Counter
    print(len(cards), dict(Counter(c['g'] for c in cards)), dict(Counter(c['q'] for c in cards)))
