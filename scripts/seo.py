#!/usr/bin/env python3
"""Pages statiques indexables par Google : fiche/<jeu>/<personnage>.html, pages de jeu, sitemap.xml, robots.txt.
Lancé par le robot du lundi après cards.py. Aucun contenu inventé : on n'utilise que les données du site (cards.json, gg_tiers.json, gg_extra.json).
Adresse du site : variable d'environnement SITE_URL (par défaut celle de GitHub Pages)."""
import json, os, re, html, datetime, shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = os.environ.get('SITE_URL', 'https://kdvershsr.github.io/Astrolabe').rstrip('/')
GAMES = {  # clé carte -> (slug de l'application, nom, éditeur)
    'hsr': ('astrolabe', 'Honkai: Star Rail', 'HoYoverse'), 'gi': ('genshin', 'Genshin Impact', 'HoYoverse'),
    'zzz': ('zzz', 'Zenless Zone Zero', 'HoYoverse'), 'ww': ('wuwa', 'Wuthering Waves', 'Kuro Games'),
    'r99': ('r99', 'Reverse: 1999', 'Bluepoch'), 'nte': ('nte', 'Neverness to Everness', 'Hotta Studio'),
    'p5x': ('p5x', 'Persona 5: The Phantom X', 'Perfect World / SEGA'), 'ss': ('starsavior', 'Star Savior', ''),
}
E = html.escape
today = datetime.date.today().isoformat()


def load(p, d):
    try:
        return json.load(open(ROOT / p, encoding='utf-8'))
    except Exception:
        return d


def app_url(g, c):
    slug = GAMES[g][0]
    return f"{SITE}/#/perso/{c['id'].replace('hsr-', '', 1)}" if g == 'hsr' else f"{SITE}/#/{slug}/perso/{c['id']}"


def page(title, desc, canon, body, img=None, jsonld=None, depth=2):
    up = '../' * depth
    og = f"{SITE}/{img}" if img else f"{SITE}/og.png"
    ld = f'<script type="application/ld+json">{json.dumps(jsonld, ensure_ascii=False)}</script>' if jsonld else ''
    return f'''<!DOCTYPE html>
<html lang="fr" data-theme="dark"><head><meta charset="utf-8"><title>{E(title)}</title>
<meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="{E(desc)}">
<link rel="canonical" href="{canon}"><meta name="robots" content="index,follow">
<meta property="og:type" content="website"><meta property="og:site_name" content="Astrolabe"><meta property="og:title" content="{E(title)}"><meta property="og:description" content="{E(desc)}"><meta property="og:url" content="{canon}"><meta property="og:image" content="{og}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="{E(title)}"><meta name="twitter:description" content="{E(desc)}"><meta name="twitter:image" content="{og}">
<link rel="icon" href="{up}favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="{up}style.css">
<style>body{{background:var(--bg,#0b0d17);color:var(--tx,#eee);font-family:Jost,system-ui,sans-serif;margin:0}}.fx{{max-width:880px;margin:0 auto;padding:20px 16px 60px}}.fx a{{color:var(--ac,#e0b050)}}
.fx header{{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:22px;flex-wrap:wrap}}.fx header b{{letter-spacing:.2em}}
.fx h1{{font-size:clamp(28px,6vw,44px);margin:6px 0}}.fx .row{{display:flex;gap:22px;flex-wrap:wrap;align-items:flex-start}}.fx .row img{{width:220px;max-width:100%;border-radius:14px;border:1px solid var(--bd,#333)}}
.fx table{{border-collapse:collapse}}.fx td,.fx th{{padding:6px 14px 6px 0;text-align:left;vertical-align:top}}.fx th{{color:var(--mu,#aaa);font-weight:600}}
.fx .cta{{display:inline-block;margin:18px 0;padding:12px 20px;border-radius:12px;background:var(--ac,#e0b050);color:#111;font-weight:700;text-decoration:none}}
.fx ul.l{{columns:2;list-style:none;padding:0}}.fx footer{{margin-top:40px;color:var(--mu,#aaa);font-size:12px}}</style>{ld}</head>
<body><div class="fx"><header><a href="{SITE}/"><b>ASTROLABE</b></a><nav><a href="{up}fiche/">Tous les jeux</a></nav></header>{body}
<footer>Site de fans non officiel, sans affiliation avec les éditeurs des jeux. Les noms et images appartiennent à leurs ayants droit. · <a href="{SITE}/#/legal">Mentions légales</a></footer></div></body></html>'''


def main():
    cards = load('data/cards.json', {}).get('cards', [])
    extra = load('data/gg_extra.json', {})
    for L in extra.values():
        cards += [c for c in L if c.get('g')]
    tiers = load('data/gg_tiers.json', {})
    out = ROOT / 'fiche'
    if out.exists():
        shutil.rmtree(out)
    urls = [(SITE + '/', '1.0'), (SITE + '/fiche/', '0.8')]
    by = {}
    for c in cards:
        if c.get('g') in GAMES:
            by.setdefault(c['g'], {}).setdefault(c['id'], c)
    hub = ''
    for g, d in by.items():
        slug, gname, pub = GAMES[g]
        cs = sorted(d.values(), key=lambda c: (c.get('q') or 0) * -1, reverse=False)
        TD = (tiers.get(g) or {}).get('tiers', {})
        def tier(c):
            return TD.get(c['n']) or c.get('tl') or ''
        order = {'SS': 0, 'S': 1, 'A': 2, 'B': 3, 'C': 4, 'D': 5}
        cs = sorted(d.values(), key=lambda c: (order.get(tier(c), 9), c['n']))
        (out / slug).mkdir(parents=True, exist_ok=True)
        li = '\n'.join(f'<li><a href="{c["id"]}.html">{E(c["n"])}</a>{" · " + E(tier(c)) if tier(c) else ""}</li>' for c in cs)
        gp = f"{SITE}/fiche/{slug}/"
        (out / slug / 'index.html').write_text(page(f'{gname} : personnages et tier list | Astrolabe', f'Tous les personnages de {gname} ({len(cs)}), avec leur tier, leur élément et leur fiche. Tier list mise à jour chaque lundi.', gp,
            f'<h1>{E(gname)} : personnages et tier list</h1><p>{len(cs)} personnages, classés du meilleur au moins bon d\'après la tier list du site (mise à jour chaque lundi).</p><a class="cta" href="{SITE}/#/{slug}">Ouvrir le guide {E(gname)} →</a><ul class="l">{li}</ul>', depth=2), 'utf-8')
        urls.append((gp, '0.8'))
        hub += f'<li><a href="{slug}/">{E(gname)}</a> · {len(cs)} personnages</li>'
        for c in cs:
            t = tier(c); img = c.get('img') if c.get('img') and (ROOT / c['img']).exists() else None
            desc_fr = (c.get('d') or '').strip()
            facts = [('Jeu', gname), ('Rareté', f"{c.get('st') or c.get('r')}★" if (c.get('st') or c.get('r')) else ''), ('Élément / type', c.get('e', '')), ('Tier', t)]
            rows = ''.join(f'<tr><th>{k}</th><td>{E(str(v))}</td></tr>' for k, v in facts if v)
            same = [x for x in cs if x['id'] != c['id'] and x.get('e') == c.get('e')][:8]
            sl = ''.join(f'<li><a href="{x["id"]}.html">{E(x["n"])}</a></li>' for x in same)
            title = f"{c['n']} ({gname}) : tier {t}, fiche | Astrolabe" if t else f"{c['n']} ({gname}) : fiche et guide | Astrolabe"
            desc = (desc_fr[:150] + ('…' if len(desc_fr) > 150 else '')) if desc_fr else f"{c['n']} dans {gname} : élément, rareté{', tier ' + t if t else ''} et lien vers le guide complet."
            cp = f"{SITE}/fiche/{slug}/{c['id']}.html"
            body = f'<p><a href="../{slug}/">← {E(gname)}</a></p><h1>{E(c["n"])}</h1><div class="row">{f"<img src=\"../../{img}\" alt=\"{E(c[chr(110)])}\">" if img else ""}<div><table>{rows}</table><p>{E(desc_fr)}</p></div></div><a class="cta" href="{app_url(g, c)}">Voir la fiche complète dans le guide →</a>{"<h2>Même élément / type</h2><ul class=l>" + sl + "</ul>" if sl else ""}'
            ld = {'@context': 'https://schema.org', '@type': 'BreadcrumbList', 'itemListElement': [{'@type': 'ListItem', 'position': 1, 'name': 'Astrolabe', 'item': SITE + '/'}, {'@type': 'ListItem', 'position': 2, 'name': gname, 'item': gp}, {'@type': 'ListItem', 'position': 3, 'name': c['n'], 'item': cp}]}
            (out / slug / f"{c['id']}.html").write_text(page(title, desc, cp, body, img, ld, 2), 'utf-8')
            urls.append((cp, '0.6'))
    (out / 'index.html').write_text(page('Tous les guides gacha | Astrolabe', 'Guides, tier lists et fiches de personnages pour Honkai: Star Rail, Genshin Impact, Zenless Zone Zero, Wuthering Waves, Reverse: 1999 et plus. Mis à jour chaque lundi.', SITE + '/fiche/',
        f'<h1>Guides gacha</h1><p>Tier lists et fiches de personnages, mises à jour chaque lundi.</p><ul class="l" style="columns:1">{hub}</ul><a class="cta" href="{SITE}/">Ouvrir Astrolabe →</a>', depth=1), 'utf-8')
    sm = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + ''.join(f'<url><loc>{E(u)}</loc><lastmod>{today}</lastmod><priority>{p}</priority></url>\n' for u, p in urls) + '</urlset>\n'
    (ROOT / 'sitemap.xml').write_text(sm, 'utf-8')
    (ROOT / 'robots.txt').write_text(f'User-agent: *\nAllow: /\n\nSitemap: {SITE}/sitemap.xml\n', 'utf-8')
    print('pages :', len(urls), 'dont fiches :', len(urls) - 2 - len(by))


main()
