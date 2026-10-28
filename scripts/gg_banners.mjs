// Bannières et événements en cours (Genshin, ZZZ, Wuthering Waves, Reverse: 1999, Neverness to Everness).
// S'appuie sur le paquet open source « gacha-calendar-core » (licence MIT, https://github.com/EastMG/dsh-gacha-calendar) qui lit les annonces officielles
// et wikis chinois. Les textes sortent donc en chinois : le site les affiche tels quels, avec la mention de la source.
// Lancé par le workflow du lundi (npm i gacha-calendar-core --no-save). Si quelque chose échoue, l'ancien fichier est conservé.
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const MAP = { genshin: 'gi', zzz: 'zzz', wuwa: 'ww', r1999: 'r99', nte: 'nte' };
const OUT = new URL('../data/gg_banners.json', import.meta.url);
let mod;
try { mod = await import(process.env.GCC_PATH ? pathToFileURL(process.env.GCC_PATH).href : 'gacha-calendar-core'); }
catch (e) { console.log('paquet indisponible :', e.message); process.exit(0); }

const mem = { shown: Object.keys(MAP), hidden: [] };
async function http(url, opts = {}) {
  const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 30000);
  try {
    return await fetch(url, { ...opts, headers: { 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) Chrome/124', ...(opts.headers || {}) }, signal: ctl.signal });
  } finally { clearTimeout(t); }
}
const engine = mod.createEngine({
  transport: {
    fetchRaw: (url, opts) => http(url, opts),
    fetchViaProxy: async (url, { referer, headers, body } = {}) => {
      const r = await http(url, { method: body ? 'POST' : 'GET', body, headers: { ...(referer ? { Referer: referer } : {}), ...(headers || {}) } });
      return await r.text();
    }
  },
  storage: { get: async k => mem[k], set: async (k, v) => { mem[k] = v; } },
  now: () => Date.now()
});

try {
  const res = await engine.refresh();
  const out = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : {};
  let n = 0;
  for (const [src, id] of Object.entries(MAP)) {
    const g = res && res.games && res.games[src];
    if (!g) continue;
    const ok = !!(g.banner || g.event);
    if (!ok) { if (out[id]) out[id].status = 'source illisible cette semaine, anciennes données conservées'; continue; }
    out[id] = { name: g.name, banner: g.banner || '', bannerDates: g.bannerDates || '', roles: g.roles || '', bannerHover: g.bannerHover || '', event: g.event || '', eventDates: g.eventDates || '', eventHover: g.eventHover || '', fail: g.gachaFail ? 'bannières' : g.eventFail ? 'événements' : '', checked: new Date().toISOString().slice(0, 10), status: g.gachaFail || g.eventFail ? 'partiel' : 'ok' };
    n++;
  }
  writeFileSync(OUT, JSON.stringify(out));
  console.log('Bannières mises à jour pour', n, 'jeux');
} catch (e) { console.log('échec :', e.message); }
