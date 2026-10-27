(() => {
'use strict';
const CFG = window.CFG || {};
const $ = s => document.querySelector(s), app = $('#app');
// Connexion Discord : mettre true pour la réactiver (voir README)
const USE_DISCORD = false;
const store = { get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} } };
const im = (k, id) => (window.__IMG__ && window.__IMG__[k + '/' + id]) || `img/${k}/${id}.webp`;
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// ------------------------------------------------------------ langue
let LANG = store.get('astro_lang', (navigator.language || 'fr').toLowerCase().startsWith('fr') ? 'fr' : 'en');
const L = (fr, en) => (LANG === 'fr' ? fr : en);
const LOC = () => (LANG === 'fr' ? 'fr-FR' : 'en-GB');
const ELE = { Fire: ['Feu', 'Fire', '#ef5b3f'], Ice: ['Glace', 'Ice', '#58c4ee'], Thunder: ['Foudre', 'Lightning', '#b46cf5'], Wind: ['Vent', 'Wind', '#3ed3a8'], Physical: ['Physique', 'Physical', '#a7adbb'], Quantum: ['Quantique', 'Quantum', '#6f7cf5'], Imaginary: ['Imaginaire', 'Imaginary', '#f0c53a'] };
const PTH = { Warrior: ['Destruction', 'Destruction'], Rogue: ['Chasse', 'The Hunt'], Mage: ['Érudition', 'Erudition'], Shaman: ['Harmonie', 'Harmony'], Warlock: ['Nihilité', 'Nihility'], Knight: ['Préservation', 'Preservation'], Priest: ['Abondance', 'Abundance'], Memory: ['Souvenir', 'Remembrance'], Elation: ['Allégresse', 'Elation'] };
const eN = id => (ELE[id] ? L(ELE[id][0], ELE[id][1]) : id), pN = id => (PTH[id] ? L(PTH[id][0], PTH[id][1]) : id), eC = id => (ELE[id] || [])[2] || '#888';
const SKT = { 'ATQ normale': 'Basic ATK', 'Attaque normale': 'Basic ATK', 'Compétence du mnémesprit': 'Memosprite Skill', 'Talent du mnémesprit': 'Memosprite Talent', 'Comicompétence': 'Elation Skill', 'Compétence de soutien': 'Support Skill', 'Compétence': 'Skill', 'Ultime': 'Ultimate', 'Talent': 'Talent', 'Technique': 'Technique' };
const STE = { 'ATQ': 'ATK', 'ATQ%': 'ATK%', 'PV': 'HP', 'PV%': 'HP%', 'DÉF': 'DEF', 'DÉF%': 'DEF%', 'VIT': 'SPD', 'Taux crit': 'CRIT Rate', 'DGT crit': 'CRIT DMG', 'Taux d’effet': 'Effect Hit Rate', 'Rés. d’effet': 'Effect RES', 'Effet de rupture': 'Break Effect', 'Recharge d’énergie': 'Energy Regen Rate', 'Soins': 'Outgoing Healing' };
const stx = s => { if (LANG === 'fr') return s; if (STE[s]) return STE[s]; const m = /^DGT (.+)$/.exec(s); if (m) { const e = Object.values(ELE).find(x => x[0] === m[1]); return (e ? e[1] : m[1]) + ' DMG'; } return s; };

// ------------------------------------------------------------ icônes
const IC = { crown: 'M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5L3 8z', swords: 'M4 4l10 10M4 4h5M4 4v5M20 4L10 14M20 4h-5M20 4v5M6 18l-2 2M18 18l2 2M9 15l-3 3M15 15l3 3', gem: 'M6 3h12l4 6-10 12L2 9l4-6zM2 9h20M9 3L7 9l5 12 5-12-2-6', spark: 'M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z', orbit: 'M12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4M3 12c0-3 4-5.5 9-5.5s9 2.5 9 5.5-4 5.5-9 5.5S3 15 3 12zM8 4.5c3.5-1.5 8 3 9.5 7.5', home: 'M3 11l9-8 9 8M5 10v10h14V10', users: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M2 20c0-3.5 3-5.5 7-5.5s7 2 7 5.5M17 4.5a3.5 3.5 0 0 1 0 6.5M18 15c2.5.5 4 2.3 4 5', cone: 'M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5', box: 'M12 2l9 5v10l-9 5-9-5V7l9-5zM12 12l9-5M12 12v10M12 12L3 7', tier: 'M4 20V10M10 20V4M16 20v-8M22 20H2', end: 'M12 3a9 9 0 1 0 9 9M12 7.5a4.5 4.5 0 1 0 4.5 4.5M12 12h.01', cmp: 'M8 3L4 7l4 4M4 7h16M16 21l4-4-4-4M20 17H4', cal: 'M4 5h16v16H4zM4 10h16M9 3v4M15 3v4', book: 'M4 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4zM20 4h-6M20 4v14h-8', user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M4 21c0-4 4-6 8-6s8 2 8 6', star: 'M12 3l2.7 5.8 6.3.8-4.6 4.4 1.2 6.3L12 17.3 6.4 20.3l1.2-6.3L3 9.6l6.3-.8z', info: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M12 11v5M12 8h.01', calc: 'M5 3h14v18H5zM8 7h8M8 12h2M14 12h2M8 16h2M14 16h2', dice: 'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM8 8h.01M16 8h.01M12 12h.01M8 16h.01M16 16h.01', chart: 'M3 3v18h18M7 15l4-4 3 3 5-6', team: 'M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4z', shield: 'M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4zM9 12l2 2 4-4', search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14M21 21l-5-5', flag: 'M5 21V4h11l-1.5 4L16 12H5', globe: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18', sun: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5', menu: 'M4 6h16M4 12h16M4 18h16', clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M12 7v5l3 2', share: 'M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6M6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6M18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6M8.6 13.5l6.8 4M15.4 6.5l-6.8 4', trophy: 'M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4zM17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3', bell: 'M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8M10 20a2 2 0 0 0 4 0', skull: 'M12 3a8 8 0 0 0-8 8c0 3 1.5 5 3 6v3h10v-3c1.5-1 3-3 3-6a8 8 0 0 0-8-8zM9 12h.01M15 12h.01', train: 'M5 16V6a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v10M3 16h18l-1.5 3h-15zM8 8h8M8 12h8', cog: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z', plus: 'M12 5v14M5 12h14' };
const ico = (n, c = '') => `<svg class="ic ${c}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="${IC[n] || ''}"/></svg>`;

// ------------------------------------------------------------ état
const TN = { 'SS': 'T0', 'S+': 'T0.5', 'S': 'T1', 'A': 'T2', 'B': 'T3', 'C': 'T4' }, TBR = { 'SS': ['Apex', 'Apex'], 'S+': ['Meta', 'Meta'], 'S': ['Meta', 'Meta'], 'A': ['Jouable', 'Playable'], 'B': ['Hors méta', 'Off-meta'], 'C': ['Hors méta', 'Off-meta'] };
const TIERS = ['SS', 'S+', 'S', 'A', 'B', 'C'], TV = { 'SS': '--SS', 'S+': '--Sp', 'S': '--S', 'A': '--A', 'B': '--B', 'C': '--C', '?': '--C' };
let D, DE = null, C, byId, LC, RS, CALC = null, user = null, sb = null, isAdmin = false, TM = 'ov', TE = store.get('astro_te', 'base'), TS = store.get('astro_ts', 'l');
let S = { q: '', e: '', p: '', r: '', own: '' };
let fav = store.get('astro_fav', { char: [], build: [] }), prof = Object.assign({ name: '', avatar: '', photo: '', col: {}, handle: '', bio: '', pub: false, show: [] }, store.get('astro_prof', {}));
let myTeams = store.get('astro_teams', []), plan = store.get('astro_plan', []), viewed = null, pmsg = '', cur = '', resFn = null;
const PD = { theme: store.get('astro_theme', 'dark'), accent: 'gold', fs: 'm', motion: 'on', compact: 'off', tz: 'auto', tl: 'T', start: '#/home' };
let PREF = Object.assign({}, PD, store.get('astro_pref', {}));
const TZ = { auto: undefined, eu: 'Etc/GMT-1', na: 'Etc/GMT+5', asia: 'Etc/GMT-8', utc: 'UTC' };
const TNT = { 'SS': 'T0', 'S+': 'T0.5', 'S': 'T1', 'A': 'T2', 'B': 'T3', 'C': 'T4' };
const fmtD = d => new Date(d).toLocaleString(LOC(), { dateStyle: 'medium', timeStyle: 'short', timeZone: TZ[PREF.tz] });
function applyPrefs() {
  const h = document.documentElement;
  h.dataset.theme = PREF.theme === 'auto' ? (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark') : PREF.theme;
  h.dataset.accent = PREF.accent; h.dataset.fs = PREF.fs; h.dataset.motion = PREF.motion; h.dataset.compact = PREF.compact;
  Object.assign(TN, PREF.tl === 'S' ? { 'SS': 'SS', 'S+': 'S+', 'S': 'S', 'A': 'A', 'B': 'B', 'C': 'C' } : TNT);
}
const cdTxt = ms => { if (ms <= 0) return L('terminé', 'ended'); const m = Math.floor(ms / 60000), d = Math.floor(m / 1440), h = Math.floor(m % 1440 / 60); return (d ? d + L(' j ', 'd ') : '') + h + ' h ' + (m % 60) + ' min'; };
function tick() { document.querySelectorAll('[data-cd]').forEach(e => e.textContent = (e.dataset.pre || '') + cdTxt(new Date(e.dataset.cd) - Date.now())); document.querySelectorAll('[data-cdd]').forEach(e => e.textContent = Math.max(0, Math.ceil((new Date(e.dataset.cdd) - Date.now()) / 864e5))); }
setInterval(tick, 30000);
const evx = e => (LANG === 'en' && e.en ? { ...e, ...e.en } : e);

// langue des données : superpose les textes anglais aux données françaises
function applyData() {
  const en = LANG === 'en' && DE;
  C = D.chars.map(c => { const x = en && DE.c[c.id]; return x ? { ...c, n: x.n, s: c.s.map((k, i) => ({ ...k, n: (x.s[i] || k).n, d: (x.s[i] || k).d, f: (x.s[i] || k).f })), x: c.x.map((k, i) => ({ n: (x.x[i] || k).n, d: (x.x[i] || k).d })) } : c; });
  LC = D.lcs.map(l => { const x = en && DE.l[l.id]; return x ? { ...l, ...x } : l; });
  RS = D.sets.map(s => { const x = en && DE.s[s.id]; return x ? { ...s, ...x } : s; });
  byId = Object.fromEntries(C.map(c => [c.id, c]));
}
async function setLang(l) {
  LANG = l; store.set('astro_lang', l); document.documentElement.lang = l;
  if (l === 'en' && !DE) { try { DE = await fetch('data/data_en.json').then(r => r.json()); } catch { DE = null; } }
  if (D) { applyData(); chrome(); render(); }
}

// ------------------------------------------------------------ compte, favoris, profil, équipes
const myStats = () => { const o = Object.keys(prof.col).filter(i => byId[i]); return { n: o.length, n5: o.filter(i => byId[i].r === 5).length, e: o.reduce((s, i) => s + prof.col[i], 0) }; };
const photoOk = s => typeof s === 'string' && s.length < 40000 && /^data:image\/jpeg;base64,[A-Za-z0-9+\/=]+$/.test(s);
async function addPhotos(rows) { try { const ids = (rows || []).map(r => r.user_id).filter(Boolean); if (!ids.length) return; const { data } = await sb.from('profiles').select('user_id,photo').in('user_id', ids); const m = Object.fromEntries((data || []).map(r => [r.user_id, r.photo])); rows.forEach(r => { if (photoOk(m[r.user_id])) r.photo = m[r.user_id]; }); } catch { } }
function photoFromFile(file, cb) { if (!file || !/^image\//.test(file.type)) return cb(null); const u = URL.createObjectURL(file), im = new Image(); im.onload = () => { const S = 160, c = document.createElement('canvas'); c.width = c.height = S; const x = c.getContext('2d'), m = Math.min(im.width, im.height); x.fillStyle = '#0b0e1f'; x.fillRect(0, 0, S, S); x.drawImage(im, (im.width - m) / 2, (im.height - m) / 2, m, m, 0, 0, S, S); URL.revokeObjectURL(u); cb(c.toDataURL('image/jpeg', 0.78)); }; im.onerror = () => cb(null); im.src = u; }
const saveProf = async () => {
  store.set('astro_prof', prof); pmsg = ''; acct();
  if (!(sb && user)) return;
  const base = { user_id: user.id, display_name: prof.name, avatar: prof.avatar, updated_at: new Date().toISOString() };
  const full = { ...base, handle: prof.handle || null, bio: prof.bio, is_public: !!prof.pub && !!prof.handle, showcase: prof.show.filter(s => s.c), stats: myStats() };
  let { error } = await sb.from('profiles').upsert(full);
  if (!error) sb.from('profiles').update({ photo: photoOk(prof.photo) ? prof.photo : null }).eq('user_id', user.id).then(() => { }, () => { });
  if (error && /handle|unique|duplicate/i.test(error.message)) { pmsg = L('Ce nom d’utilisateur est déjà pris ou invalide (3 à 20 caractères : a-z, 0-9, - et _).', 'This username is taken or invalid (3–20 characters: a-z, 0-9, - and _).'); ({ error } = await sb.from('profiles').upsert(base)); }
  else if (error) { pmsg = L('Profil public indisponible : exécutez supabase/schema_v3.sql. (', 'Public profile unavailable: run supabase/schema_v3.sql. (') + error.message + ')'; ({ error } = await sb.from('profiles').upsert(base)); }
  else pmsg = L('Profil enregistré.', 'Profile saved.');
};
async function toggleFav(kind, id) {
  const on = fav[kind].includes(id); fav[kind] = on ? fav[kind].filter(x => x !== id) : [...fav[kind], id]; store.set('astro_fav', fav);
  if (sb && user) { if (on) await sb.from('favorites').delete().match({ user_id: user.id, kind, item_id: id }); else await sb.from('favorites').upsert({ user_id: user.id, kind, item_id: id }); }
  render();
}
async function setOwn(id, eid) {
  if (eid === null) delete prof.col[id]; else prof.col[id] = eid; store.set('astro_prof', prof);
  if (sb && user) { if (eid === null) await sb.from('collection').delete().match({ user_id: user.id, char_id: id }); else await sb.from('collection').upsert({ user_id: user.id, char_id: id, eidolon: eid }); }
}
async function pullAll() {
  if (!sb || !user) return;
  const [f, p, c, tm, ad] = await Promise.all([sb.from('favorites').select('kind,item_id'), sb.from('profiles').select('*').eq('user_id', user.id).maybeSingle(), sb.from('collection').select('char_id,eidolon'), sb.from('teams').select('id,name,members'), sb.from('admins').select('user_id').maybeSingle()]);
  isAdmin = !!(ad && ad.data); chrome();
  const cloud = { char: [], build: [] }; (f.data || []).forEach(r => cloud[r.kind] && cloud[r.kind].push(r.item_id));
  const rows = []; ['char', 'build'].forEach(k => fav[k].forEach(id => { if (!cloud[k].includes(id)) { rows.push({ user_id: user.id, kind: k, item_id: id }); cloud[k].push(id); } }));
  if (rows.length) await sb.from('favorites').upsert(rows); fav = cloud; store.set('astro_fav', fav);
  if (!p.error) { if (p.data) { prof.name = p.data.display_name || prof.name; prof.avatar = p.data.avatar || prof.avatar; if (photoOk(p.data.photo)) prof.photo = p.data.photo; prof.handle = p.data.handle || prof.handle; prof.bio = p.data.bio ?? prof.bio; prof.pub = p.data.is_public ?? prof.pub; if (Array.isArray(p.data.showcase) && p.data.showcase.length) prof.show = p.data.showcase; } else if (prof.name || prof.avatar) saveProf(); }
  if (!c.error) {
    const cc = {}; (c.data || []).forEach(r => cc[r.char_id] = r.eidolon); const cr = [];
    Object.keys(prof.col).forEach(id => { if (!(id in cc)) { cr.push({ user_id: user.id, char_id: id, eidolon: prof.col[id] }); cc[id] = prof.col[id]; } });
    if (cr.length) await sb.from('collection').upsert(cr); prof.col = cc;
  }
  if (!tm.error) {
    const ids = new Set((tm.data || []).map(r => r.id)), up = myTeams.filter(t => !ids.has(t.id)).map(t => ({ id: t.id, user_id: user.id, name: t.name, members: t.m }));
    if (up.length) await sb.from('teams').upsert(up);
    myTeams = [...(tm.data || []).map(r => ({ id: r.id, name: r.name, m: r.members })), ...up.map(t => ({ id: t.id, name: t.name, m: t.members }))]; store.set('astro_teams', myTeams);
  }
  store.set('astro_prof', prof); render();
}
let authOk = false;
const GATED = ['cartes', 'profil', 'settings', 'fav', 'social'], needAuth = page => !!sb && !user && GATED.includes(page);
function acct() {
  const el = $('#acct'); if (!el) return;
  if (sb && !user) { el.innerHTML = `<button class="btn pri" id="login">${L('Se connecter', 'Log in')}</button>`; return; }
  const nm = prof.name || (user ? user.email.split('@')[0] : L('Voyageur', 'Traveler')), av = photoOk(prof.photo) ? `<img src="${prof.photo}" alt="">` : typeof byId !== 'undefined' && byId && prof.avatar && byId[prof.avatar] ? `<img src="${im('c', prof.avatar)}" alt="">` : `<span>${esc(nm[0].toUpperCase())}</span>`;
  el.innerHTML = `${user || !sb ? '' : `<button class="btn pri" id="login">${L('Connexion', 'Log in')}</button>`}<span class="pm"><button class="pmb" id="pmb" aria-haspopup="true" aria-label="${L('Mon profil', 'My profile')}"><i class="pav">${av}</i><b class="pnm">${esc(nm)}</b></button><div class="pmenu" id="pmenu" hidden><div class="pmh"><i class="pav big">${av}</i><div><b>${esc(nm)}</b><small>${user ? esc(user.email) : L('Profil local', 'Local profile')}</small></div></div><a href="#/profil">${ico('user')}${L('Mon profil', 'My profile')}</a><a href="#/profil/col">${ico('users')}${L('Ma collection', 'My collection')}</a><a href="#/profil/fav">${ico('star')}${L('Favoris', 'Favourites')}</a><a href="#/profil/goals">${ico('trophy')}${L('Objectifs', 'Goals')}</a><a href="#/settings">${ico('cog')}${L('Paramètres', 'Settings')}</a>${typeof isAdmin !== 'undefined' && isAdmin ? `<a href="#/admin">${ico('shield')}${L('Administration', 'Admin')}</a>` : ''}${!sb ? '' : user ? `<button id="out">${ico('flag')}${L('Déconnexion', 'Log out')}</button>` : `<button id="login">${ico('user')}${L('Connexion', 'Log in')}</button>`}</div></span>`;
}
function initAuth() {
  if (!CFG.SUPABASE_URL || !window.supabase) { authOk = true; return acct(); }
  sb = window.supabase.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY);
  sb.auth.getSession().then(async ({ data }) => { user = data.session ? data.session.user : null; authOk = true; acct(); try { HC.sync(); } catch { } if (GATED.includes((location.hash.split('/')[1] || 'home'))) render(); if (user && await mfaGate()) return; pullAll(); });
  sb.auth.onAuthStateChange((_e, s) => { const was = !!user; user = s ? s.user : null; authOk = true; if (!user) isAdmin = false; acct(); chrome(); if (was !== !!user && GATED.includes((location.hash.split('/')[1] || 'home'))) render(); setTimeout(async () => { if (user && await mfaGate()) return; pullAll(); }, 0); }); // setTimeout : ne jamais attendre Supabase directement dans ce rappel (sinon la déconnexion se bloque)
}
const authMsg = t => { const m = $('#msg'); if (m) m.textContent = t; };
const cred = () => ({ email: $('#em').value.trim(), password: $('#pw').value });
async function authClick(id) {
  if (id === 'bin') { const { error } = await sb.auth.signInWithPassword(cred()); if (error) authMsg(error.message); else if (await mfaGate()) return; else $('#dlg').close(); }
  else if (id === 'bup') { const { data, error } = await sb.auth.signUp(cred()); if (error) authMsg(error.message); else if (!data.session) authMsg(L('Compte créé. Vérifiez votre e-mail pour confirmer.', 'Account created. Check your e-mail to confirm.')); else $('#dlg').close(); }
  else if (id === 'bdc') { const { error } = await sb.auth.signInWithOAuth({ provider: 'discord', options: { redirectTo: location.href.split('#')[0] } }); if (error) authMsg(L('Discord n’est pas encore activé dans Supabase. ', 'Discord is not enabled in Supabase yet. ') + error.message); }
  else if (id === 'bfg') { const { error } = await sb.auth.resetPasswordForEmail($('#em').value.trim(), { redirectTo: location.href.split('#')[0] }); authMsg(error ? error.message : L('E-mail de réinitialisation envoyé.', 'Reset e-mail sent.')); }
}

// ------------------------------------------------------------ retours des visiteurs + erreurs automatiques
let errSent = 0; const errSeen = new Set();
async function sendFeedback(kind, message) {
  if (!sb) return false;
  const { error } = await sb.from('feedback').insert({ kind, message: String(message).slice(0, 1000), page: location.hash.slice(0, 200), agent: navigator.userAgent.slice(0, 200), ...(user ? { user_id: user.id } : {}) });
  return !error;
}
window.addEventListener('error', e => { const m = `${e.message} (${(e.filename || '').split('/').pop()}:${e.lineno})`; if (errSent >= 3 || errSeen.has(m) || !sb) return; errSeen.add(m); errSent++; sendFeedback('auto', m); });

// ------------------------------------------------------------ composants
const eiImg = id => `<img class="ei" src="${im('e', id)}" alt="${esc(eN(id))}" title="${esc(eN(id))}">`;
const piImg = id => `<img class="pi" src="${im('pa', id)}" alt="${esc(pN(id))}" title="${esc(pN(id))}">`;
const tile = (c, o = {}) => `<a class="cd r${c.r}${o.s ? ' s' : ''}" href="#/perso/${c.id}" title="${esc(c.n)}"><span class="pt"><img src="${im('c', c.id)}" alt="" loading="lazy">${eiImg(c.ei)}</span><span class="nm">${esc(c.n)}</span>${o.sub ? `<em>${o.sub}</em>` : ''}</a>`;
const sec = (t, r = '') => `<div class="st"><span>${t}</span>${r}</div>`;
const uniq = (a, k) => [...new Set(a.map(x => x[k]))].sort();
const chips = (arr, v, k, l, nm = x => x) => `<div class="fl"><span class="lab">${l}</span><button class="chip ${v === '' ? 'on' : ''}" data-f="${k}" data-v="">${L('Tous', 'All')}</button>` + arr.map(x => `<button class="chip ${v == x ? 'on' : ''}" data-f="${k}" data-v="${x}">${nm(x)}</button>`).join('') + '</div>';
const sbox = ph => `<input type="search" id="q" placeholder="${ph}" value="${esc(S.q)}">`;
const has = n => n.toLowerCase().includes(S.q.toLowerCase());
const row = (img, n, t) => `<div class="row"><img src="${img}" alt=""><div><b>${esc(n)}</b><p>${t}</p></div></div>`;
const filtC = () => C.filter(c => (!S.e || c.ei === S.e) && (!S.p || c.pi === S.p) && (!S.r || c.r == S.r) && has(c.n));
const cbar = () => sbox(L('Rechercher un personnage…', 'Search a character…')) + chips(uniq(C, 'ei'), S.e, 'e', L('Élément', 'Element'), eN) + chips(uniq(C, 'pi'), S.p, 'p', L('Voie', 'Path'), pN) + chips([5, 4], S.r, 'r', L('Rareté', 'Rarity'), x => x + '★');
const tchip = t => `<span class="tag tg" style="--tc:var(${TV[t]})">${TN[t] || t}</span>`;
const star = (kind, id, lab) => { const on = fav[kind].includes(id); return `<button class="btn ${on ? 'on' : ''}" data-fav="${kind}:${id}">${on ? '★' : '☆'} ${lab}</button>`; };
const lcOf = id => LC.find(l => l.id === id);

// ------------------------------------------------------------ tier list
const trendOf = (mode, id) => ((D.trend || {})[mode] || {})[id];
function ttile(c, mode) {
  const tr = trendOf(mode, c.id), note = (D.tnotes || {})[c.id], mine = TE === 'mine';
  const e = mine ? (c.id in prof.col ? 'E' + prof.col[c.id] : '') : (note || 'E0');
  const hi = e && e !== 'E0';
  const trh = tr ? `<i class="tr ${tr}" title="${tr === 'up' ? L('A gagné un rang', 'Moved up') : tr === 'down' ? L('A perdu un rang', 'Moved down') : L('Nouveau dans le classement', 'New in the ranking')}">${tr === 'up' ? '▲' : tr === 'down' ? '▼' : 'NEW'}</i>` : '';
  return `<a class="tc r${c.r}" href="#/perso/${c.id}" title="${esc(c.n)} · ${eN(c.ei)} · ${pN(c.pi)}"><span class="tp"><img src="${im('c', c.id)}" alt="" loading="lazy">${trh}${e ? `<b class="eb ${hi ? 'hi' : ''}">${esc(e)}</b>` : ''}<span class="tbadge">${eiImg(c.ei)}${piImg(c.pi)}</span></span><span class="nm">${esc(c.n)}</span></a>`;
}
function board(cols) {
  const ok = new Set(filtC().map(c => c.id)), g = `grid-template-columns:96px repeat(${cols.length},minmax(0,1fr));--n:${cols.length}`;
  return `<div class="tl2 ${TS}">${cols.length > 1 || cols[0][0] ? `<div class="th" style="${g}"><span></span>${cols.map(c => `<span>${c[0] || ''}</span>`).join('')}</div>` : ''}` + TIERS.map(t => {
    const n = cols.reduce((s, c) => s + (c[1][t] || []).filter(i => ok.has(i) && byId[i]).length, 0);
    return `<div class="trw" style="${g};--tc:var(${TV[t]})"><div class="tlb"><b>${TN[t]}</b><em>${L(TBR[t][0], TBR[t][1])}</em><small>${n}</small></div>${cols.map(c => `<div class="tcell">${(c[1][t] || []).filter(i => ok.has(i) && byId[i]).map(i => ttile(byId[i], c[2])).join('') || '<span class="empty">—</span>'}</div>`).join('')}</div>`;
  }).join('') + '</div>';
}
const tierOpts = () => `<div class="opts"><div class="seg" role="group"><span class="lab">${L('Éidolon affiché', 'Eidolon shown')}</span><button class="${TE === 'base' ? 'on' : ''}" data-te="base">${L('Base du classement', 'Ranking baseline')}</button><button class="${TE === 'mine' ? 'on' : ''}" data-te="mine">${L('Mes éidolons', 'My eidolons')}</button></div>
<div class="seg"><span class="lab">${L('Taille', 'Size')}</span><button class="${TS === 'l' ? 'on' : ''}" data-ts="l">${L('Grande', 'Large')}</button><button class="${TS === 's' ? 'on' : ''}" data-ts="s">${L('Compacte', 'Compact')}</button></div>
<div class="legend"><span><i class="tr up">▲</i> ${L('monte', 'up')}</span><span><i class="tr down">▼</i> ${L('baisse', 'down')}</span><span><i class="tr new">NEW</i> ${L('nouveau', 'new')}</span></div><div class="tleg"><b>${L('Échelle', 'Scale')}</b>${TIERS.map(t => `<span style="--tc:var(${TV[t]})"><i>${TN[t]}</i> ${L(TBR[t][0], TBR[t][1])}</span>`).join('')}<small>${L('Équivalences avec Game8 : SS = T0, S+ = T0.5, S = T1, A = T2, B = T3, C = T4. Ce n’est pas le classement de Prydwen.', 'Mapping from Game8: SS = T0, S+ = T0.5, S = T1, A = T2, B = T3, C = T4. This is not Prydwen’s own ranking.')}</small></div></div>`;

// ------------------------------------------------------------ pages
const pages = {
  home() {
    const cur_ = (D.banners.list || []).filter(b => !b.end || new Date(b.end) > Date.now()), feat = (cur_[0] && cur_[0].chars[0]) || C[0].id;
    const cards = [['#/tier', 'tier', L('Tier list', 'Tier list'), L('Par rôle et par mode end game', 'By role and end game mode')], ['#/perso', 'users', L('Personnages', 'Characters'), L('Kit, build et équipes', 'Kit, build and teams')], ['#/lc', 'cone', L('Cônes de lumière', 'Light Cones'), L('Tous les cônes et leurs effets', 'Every cone and its effect')], ['#/rel', 'box', L('Reliques', 'Relics'), L('Sets et ornements planaires', 'Sets and planar ornaments')],
      ['#/calc', 'calc', L('Calculateur', 'Calculator'), L('Matériaux d’ascension et de compétences', 'Ascension and skill materials')], ['#/plan', 'dice', L('Tirages', 'Pull planner'), L('Probabilité d’obtenir un personnage', 'Chance of getting a character')], ['#/teams', 'team', L('Équipes', 'Teams'), L('Composez et partagez vos équipes', 'Build and share your teams')], ['#/stats', 'chart', L('Statistiques', 'Statistics'), L('Ce que jouent les joueurs du site', 'What the site’s players use')]];
    const ss = (D.tiers.ov.SS || []).filter(i => byId[i]), side = cur_.flatMap(b => b.chars).filter(i => i !== feat && byId[i]).slice(0, 2);
    return [`${tickerHtml()}<section class="hero2"><div class="hx"><span class="lab">${L('Bienvenue à bord, Trailblazer', 'Welcome aboard, Trailblazer')} · v${esc(D.version || '')}</span><h1 class="wordmark">ASTROLABE</h1><p class="greet">${L('Le Train Astral est prêt à partir. Où va-t-on aujourd’hui ?', 'The Astral Express is ready to depart. Where to today?')}</p><p class="lead">${L('Le guide Honkai: Star Rail qui regroupe les meilleures sources au même endroit. Données mises à jour le ' + D.updated + '.', 'The Honkai: Star Rail guide that brings the best sources together. Data updated on ' + D.updated + '.')}</p><div class="cta"><a class="btn pri" href="#/tier">${L('Voir la tier list', 'Open the tier list')}</a><a class="btn" href="#/perso">${L('Personnages', 'Characters')}</a><button class="btn" data-search="1">${ico('search')} ${L('Rechercher', 'Search')}</button><button class="btn" data-share="site">${ico('share')} ${L('Partager', 'Share')}</button></div></div><div class="hpw"><svg class="orb" viewBox="0 0 200 200" fill="none" aria-hidden="true"><g stroke="url(#og)" stroke-width=".7"><circle cx="100" cy="100" r="92" stroke-dasharray="2 5"/><circle cx="100" cy="100" r="72" opacity=".6"/><circle cx="100" cy="100" r="52" stroke-dasharray="1 4" opacity=".7"/></g><defs><linearGradient id="og" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f0c964"/><stop offset="1" stop-color="#b98cff"/></linearGradient></defs><circle cx="192" cy="100" r="3" fill="#ffe9a8"/><circle cx="28" cy="58" r="2.2" fill="#c79bff"/><circle cx="100" cy="28" r="2" fill="#7fe0f0"/></svg>${side.map((i, k) => `<img class="hp hs hs${k + 1}" src="${im('p', i)}" alt="">`).join('')}<img class="hp" src="${im('p', feat)}" alt=""></div>${miniTrain()}</section>
    <div class="ribbon">${[[C.length, L('Personnages', 'Characters'), 'users'], [LC.length, L('Cônes de lumière', 'Light Cones'), 'cone'], [RS.length, L('Sets de reliques', 'Relic sets'), 'box'], [C.filter(c => c.b).length, L('Builds', 'Builds'), 'tier'], ['4.6'.replace('4.6', esc(D.version || '')), L('Version du jeu', 'Game version'), 'star']].map((s, i) => `<div style="animation-delay:${i * .08}s"><i>${ico(s[2])}</i><b>${s[0]}</b><span>${s[1]}</span></div>`).join('')}</div>
    <div class="route" aria-hidden="true"><span>✦</span><i></i><span>✦</span></div><div class="cols"><div class="mn">${dailyHtml()}<div class="g4">${cards.map((c, i) => `<a class="sc cc" style="--k:${[42, 262, 190, 330, 150, 20, 215, 290][i]}" href="${c[0]}"><i>${ico(c[1])}</i><b>${c[2]}</b><span>${c[3]}</span></a>`).join('')}</div>
    ${sec(L('Tier T0 en ce moment', 'Current T0 tier'), `<a href="#/tier">${L('Tout voir', 'See all')} →</a>`)}<div class="grid">${ss.map(i => ttile(byId[i], 'ov')).join('')}</div>
    <div id="hnew"></div>
    ${sec(L('Calendrier end game', 'End game schedule'))}<div class="card tw"><table><tr><th>${L('Mode', 'Mode')}</th><th>${L('Début', 'Start')}</th><th>${L('Fin', 'End')}</th></tr>${(LANG === 'en' && D.manual.schedule_en || D.manual.schedule).map(r => `<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td><td>${esc(r[2])}</td></tr>`).join('')}</table></div></div>
    <aside class="rail">${verBanner()}${sec(L('Bannières en ce moment', 'Current banners'))}${bannerCards(true)}</aside></div>`, null, homeAfter];
  },
  tier() {
    const T = D.tiers, modes = [['ov', L('Vue d’ensemble', 'Overview'), 'tier'], ['role', L('Par rôle', 'By role'), 'users'], ['moc', 'Memory of Chaos', 'end'], ['pf', 'Pure Fiction', 'end'], ['as', 'Apocalyptic Shadow', 'end']];
    const cols = TM === 'role' ? [['DPS', T.dps, 'dps'], ['Support', T.support, 'support'], [L('Sustain', 'Sustain'), T.sustain, 'sustain']] : [[null, T[TM], TM]], res = () => board(cols);
    const since = D.trend_since ? L(`Dernier changement détecté le ${D.trend_since}.`, `Last change detected on ${D.trend_since}.`) : L('Les flèches de tendance apparaîtront dès le premier changement de classement.', 'Trend arrows will appear after the first ranking change.');
    return [`<h1>${L('Tier list', 'Tier list')}</h1><p class="lead">${L('Version ' + (D.version || '') + ', d’après le classement Game8, présenté sur l’échelle T0 → T4. Le classement suppose des personnages à E0 avec leur équipement idéal. Un même personnage peut apparaître dans plusieurs rôles. ', 'Version ' + (D.version || '') + ', based on the Game8 ranking, shown on a T0 → T4 scale. The ranking assumes E0 characters with their ideal gear. A character can appear in several roles. ')}${since}</p>
    <div class="bigtabs">${modes.map(m => `<button class="${TM === m[0] ? 'on' : ''}" data-tm="${m[0]}">${ico(m[2])}${m[1]}</button>`).join('')}</div>${tierOpts()}${cbar()}<div id="res">${res()}</div>`, res];
  },
  perso() { const res = () => `<div class="grid">${filtC().map(c => tile(c, { sub: eN(c.ei) + ' · ' + pN(c.pi) })).join('')}</div>`; return [`<h1>${L('Personnages', 'Characters')}</h1><p class="lead">${L(C.length + ' personnages. Cliquez sur l’un d’eux pour son kit, son build et ses équipes.', C.length + ' characters. Click one for its kit, build and teams.')}</p>${cbar()}<div id="res">${res()}</div>`, res]; },
  lc() {
    const res = () => `<div class="g">${LC.filter(l => (!S.p || l.pi === S.p) && (!S.r || l.r == S.r) && has(l.n)).map(l => `<div class="card hov" style="margin:0">${row(im('l', l.id), l.n, `${l.r}★ · ${pN(l.pi)}`)}<p style="margin:8px 0 0;font-size:13.5px"><b>${esc(l.k)}</b> — ${esc(l.d)}</p></div>`).join('')}</div>`;
    return [`<h1>${L('Cônes de lumière', 'Light Cones')}</h1><p class="lead">${L(LC.length + ' cônes. Les valeurs vont du rang 1 au rang 5.', LC.length + ' cones. Values go from rank 1 to rank 5.')}</p>${sbox(L('Rechercher un cône…', 'Search a cone…'))}${chips(uniq(LC, 'pi'), S.p, 'p', L('Voie', 'Path'), pN)}${chips([5, 4, 3], S.r, 'r', L('Rareté', 'Rarity'), x => x + '★')}<div id="res">${res()}</div>`, res];
  },
  rel() {
    const res = () => `<div class="g">${RS.filter(l => has(l.n)).map(l => `<div class="card hov" style="margin:0">${row(im('r', l.id), l.n, l.pl ? L('Ornement planaire', 'Planar ornament') : L('Relique', 'Relic'))}<p style="margin:8px 0 0;font-size:13.5px"><span class="lab">${L('2 pièces', '2-piece')}</span> ${esc(l.d[0])}</p>${l.d[1] ? `<p style="margin:6px 0 0;font-size:13.5px"><span class="lab">${L('4 pièces', '4-piece')}</span> ${esc(l.d[1])}</p>` : ''}</div>`).join('')}</div>`;
    return [`<h1>${L('Reliques', 'Relics')}</h1><p class="lead">${L('Ensembles de reliques (4 pièces) et ornements planaires (2 pièces).', 'Relic sets (4 pieces) and planar ornaments (2 pieces).')}</p>${sbox(L('Rechercher un set…', 'Search a set…'))}<div id="res">${res()}</div>`, res];
  },
  end(m) {
    m = m || 'moc'; const MM = (LANG === 'en' && D.manual.modes_en) || D.manual.modes, M = MM[m] || ['Anomaly Arbitration', L('Mode de combat récurrent. Le classement par personnage n’est pas encore disponible sur le site.', 'Recurring combat mode. A per-character ranking is not available on the site yet.')];
    const SCH = (LANG === 'en' && D.manual.schedule_en) || D.manual.schedule, sch = SCH.filter(r => r[0].includes(M[0]));
    const res = () => board([[null, D.tiers[m], m]]);
    return [`<h1>${esc(M[0])}</h1><p class="lead">${esc(M[1])}</p>${sch.length ? `<div class="card tw"><table><tr><th>${L('Phase', 'Phase')}</th><th>${L('Début', 'Start')}</th><th>${L('Fin', 'End')}</th></tr>${sch.map(r => `<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td><td>${esc(r[2])}</td></tr>`).join('')}</table></div>` : ''}${D.tiers[m] ? sec(L('Classement des personnages', 'Character ranking')) + tierOpts() + cbar() + `<div id="res">${res()}</div>` : ''}
    <p class="note">${L('Classement : Game8. Guides détaillés : ', 'Ranking: Game8. Detailed guides: ')}${D.manual.guides.map(g => `<a href="${g.u}" target="_blank" rel="noopener">${esc(LANG === 'en' && g.t_en || g.t)}</a>`).join(' · ')}</p>`, D.tiers[m] ? res : null];
  },
  compare(a, b) {
    const opt = k => `<select data-cmp="${k}"><option value="">${L('Choisir un personnage…', 'Pick a character…')}</option>${[...C].sort((x, y) => x.n.localeCompare(y.n)).map(c => `<option value="${c.id}" ${c.id === (k === 'a' ? a : b) ? 'selected' : ''}>${esc(c.n)}</option>`).join('')}</select>`;
    const A = byId[a], B = byId[b]; let t = `<p class="sub">${L('Choisissez deux personnages pour les comparer.', 'Pick two characters to compare them.')}</p>`;
    if (A && B) {
      const nm = (arr, rs) => (arr || []).map(i => (rs.find(x => x.id === i) || {}).n).filter(Boolean).join(', ') || '—';
      const num = (l, f, suf = '') => { const x = f(A), y = f(B); return `<tr><td>${l}</td><td class="${x > y ? 'win' : ''}">${x}${suf}</td><td class="${y > x ? 'win' : ''}">${y}${suf}</td></tr>`; };
      const rk = (l, k) => { const x = A.tr[k], y = B.tr[k], ix = x ? TIERS.indexOf(x) : 9, iy = y ? TIERS.indexOf(y) : 9; return `<tr><td>${l}</td><td class="${ix < iy ? 'win' : ''}">${x ? TN[x] : '—'}</td><td class="${iy < ix ? 'win' : ''}">${y ? TN[y] : '—'}</td></tr>`; };
      const bb = (l, f) => `<tr><td>${l}</td><td>${f(A)}</td><td>${f(B)}</td></tr>`, lc = c => { const l = c.b && lcOf(c.b.lc); return l ? esc(l.n) : '—'; };
      const slots = { body: L('Corps', 'Body'), feet: L('Bottes', 'Feet'), sphere: L('Sphère', 'Sphere'), rope: L('Corde', 'Rope') }, tm = c => ((c.b && c.b.teams[0]) || []).map(m => (byId[m.c] || {}).n).filter(n => n && n !== c.n).join(', ') || '—';
      t = `<div class="card tw"><table><tr><th></th><th>${tile(A, { s: 1 })}</th><th>${tile(B, { s: 1 })}</th></tr>
      ${rk(L('Tier général', 'Overall tier'), 'ov')}${rk(L('Rôle DPS', 'DPS role'), 'dps')}${rk(L('Rôle Support', 'Support role'), 'support')}${rk(L('Rôle Sustain', 'Sustain role'), 'sustain')}${rk('Memory of Chaos', 'moc')}${rk('Pure Fiction', 'pf')}${rk('Apocalyptic Shadow', 'as')}
      ${num(L('PV', 'HP'), c => c.st.hp)}${num(L('ATQ', 'ATK'), c => c.st.atk)}${num(L('DÉF', 'DEF'), c => c.st.def)}${num(L('VIT', 'SPD'), c => c.st.spd)}${num(L('Taux crit', 'CRIT Rate'), c => c.st.cr, '%')}${num(L('DGT crit', 'CRIT DMG'), c => c.st.cd, '%')}${num(L('Énergie', 'Energy'), c => c.st.sp)}
      ${bb(L('Cône', 'Light Cone'), lc)}${bb(L('Reliques', 'Relics'), c => esc(nm((c.b.rel || []).map(p => p[0]), RS)))}${bb(L('Ornements', 'Ornaments'), c => esc(nm(c.b.orn, RS)))}${Object.keys(slots).map(k => bb(slots[k], c => esc((c.b.parts[k] || []).map(stx).join(' / ') || '—'))).join('')}${bb(L('Sous-stats', 'Substats'), c => esc((c.b.subs || []).slice(0, 4).map(stx).join(' > ')))}${bb(L('Équipe type', 'Typical team'), c => esc(tm(c)))}</table></div>`;
    }
    return [`<h1>${L('Comparateur', 'Compare')}</h1><p class="lead">${L('Deux personnages côte à côte : classements, stats, build et équipe. Le meilleur chiffre est mis en avant.', 'Two characters side by side: rankings, stats, build and team. The better value is highlighted.')}</p><div class="g">${opt('a')}${opt('b')}</div>${t}`];
  },
  events() {
    const now = new Date().toISOString().slice(0, 10), ord = { 'En cours': 0, 'À venir': 1, '': 2, 'Terminé': 3 }, stl = { 'En cours': L('En cours', 'Ongoing'), 'À venir': L('À venir', 'Upcoming'), 'Terminé': L('Terminé', 'Ended') };
    const Lst = (D.events || []).filter(e => !e.hidden).map(e => ({ ...evx(e), st: e.start && e.end ? (now < e.start ? 'À venir' : now > e.end ? 'Terminé' : 'En cours') : '' })).sort((a, b) => ord[a.st] - ord[b.st]);
    const ul = (t, a) => a && a.length ? `<div class="lab">${t}</div><ul>${a.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : '';
    return [`<h1>${L('Événements et guides', 'Events and guides')}</h1><p class="lead">${L('Un guide par événement et par mode end game. Le contenu se modifie dans le fichier ', 'One guide per event and end game mode. The content is edited in the file ')}<b>data/events.json</b>.</p>${Lst.map(e => `<details class="ev"><summary><b>${esc(e.title)}</b><span class="tag">${esc(e.type || 'Guide')}</span>${e.st ? `<span class="tag ${e.st === 'En cours' ? 'tg' : ''}" style="--tc:var(--A)">${stl[e.st]}</span>` : ''}${e.start ? `<span class="sub">${e.start} → ${e.end}</span>` : ''}</summary><div><p>${esc(e.summary || '')}</p>${ul(L('Étapes', 'Steps'), e.steps)}${ul(L('Conseils', 'Tips'), e.tips)}${ul(L('Récompenses', 'Rewards'), e.rewards)}${e.link ? `<a href="${esc(e.link)}" target="_blank" rel="noopener">Source</a>` : ''}</div></details>`).join('') || `<p class="sub">${L('Aucun événement pour l’instant.', 'No event right now.')}</p>`}`];
  },
  aide() {
    const tl = (h, ic, t, s) => `<a class="sc" href="${h}">${ico(ic)}<b>${t}</b><span>${s}</span></a>`;
    const ck = [L('Terminer le prologue et débloquer l’Univers Simulé', 'Finish the prologue and unlock the Simulated Universe'), L('Choisir un DPS principal et le monter niveau 70+ avec ses cônes et reliques', 'Pick a main DPS and level it to 70+ with its cone and relics'), L('Avoir un soutien et un soigneur ou bouclier', 'Get a support and a healer or shield'), L('Dépenser toute l’énergie (Trailblaze Power) chaque jour', 'Spend all your Trailblaze Power every day'), L('Faire les missions quotidiennes et l’assignation', 'Do the dailies and Assignments'), L('Verrouiller les bonnes reliques (bonne stat principale)', 'Lock relics with the right main stat'), L('Consulter les bannières avant de tirer', 'Check the banners before pulling')];
    const q = [[L('Quelle différence entre E0 et E6 ?', 'What is the difference between E0 and E6?'), L('E0 est le personnage sans éidolon, E6 en a six. La tier list se base sur E0 par défaut.', 'E0 is a character with no eidolons, E6 has all six. The tier list assumes E0 by default.')],
      [L('Que signifient T0, T1, T2 ?', 'What do T0, T1, T2 mean?'), L('Plus le chiffre est bas, plus le personnage est fort dans le mode choisi. T0 est le haut du classement.', 'The lower the number, the stronger the character in that mode. T0 is the top of the ranking.')],
      [L('Où se trouvent les données ?', 'Where does the data come from?'), L('Personnages, cônes et reliques viennent de StarRailRes, les builds de HSR Optimizer, le classement de Game8.', 'Characters, cones and relics come from StarRailRes, builds from HSR Optimizer, rankings from Game8.')],
      [L('Comment signaler une erreur ?', 'How do I report a mistake?'), L('Bouton « Signaler » en haut de chaque page.', 'Use the “Report” button at the top of any page.')],
      [L('Comment sauvegarder mes équipes ?', 'How do I save my teams?'), L('Créez un compte puis enregistrez-les dans Équipes ; chaque équipe a un lien partageable.', 'Create an account and save them in Teams; each team has a shareable link.')]];
    const ms = [[L('Corps', 'Body'), L('Taux/DGT crit, Soins, Taux d’effet, ATQ%, PV%, DÉF%', 'CRIT Rate/DMG, Outgoing Healing, Effect Hit Rate, ATK%, HP%, DEF%')], [L('Bottes', 'Feet'), L('VIT, ATQ%, PV%, DÉF%', 'SPD, ATK%, HP%, DEF%')], [L('Sphère', 'Sphere'), L('Dégâts élémentaires, ATQ%, PV%, DÉF%', 'Elemental DMG, ATK%, HP%, DEF%')], [L('Corde', 'Rope'), L('Effet de rupture, Recharge d’énergie, ATQ%, PV%, DÉF%', 'Break Effect, Energy Regen Rate, ATK%, HP%, DEF%')]];
    return [`<section class="hlp"><span class="lab">${L('Centre d’aide', 'Help center')}</span><h1>${L('Par où commencer ?', 'Where do I start?')}</h1><p class="lead">${L('Raccourcis vers les outils du site, une liste de départ, la FAQ et les guides externes.', 'Shortcuts to the site’s tools, a starter checklist, the FAQ and external guides.')}</p><button class="btn pri" data-search="1">${ico('search')} ${L('Rechercher un personnage ou un cône', 'Search a character or cone')}</button></section>
    ${sec(L('Outils du site', 'Site tools'))}<div class="g4">${tl('#/calc', 'calc', L('Calculateur', 'Calculator'), L('Matériaux à farmer pour monter un personnage', 'Materials needed to level a character'))}${tl('#/plan', 'dice', L('Tirages', 'Pull planner'), L('Vos chances d’obtenir un 5★', 'Your odds of getting a 5★'))}${tl('#/teams', 'team', L('Équipes', 'Teams'), L('Composez et partagez', 'Build and share'))}${tl('#/compare', 'cmp', L('Comparateur', 'Compare'), L('Deux personnages côte à côte', 'Two characters side by side'))}${tl('#/tier', 'tier', 'Tier list', L('Classement par mode', 'Ranking by mode'))}${tl('#/versions', 'book', L('Résumé de version', 'Version recap'), L('L’histoire, version par version', 'The story, version by version'))}${tl('#/banners', 'star', L('Bannières', 'Banners'), L('Qui est disponible maintenant', 'Who is available now'))}${tl('#/events', 'cal', L('Événements', 'Events'), L('Guides et récompenses', 'Guides and rewards'))}</div>
    <div class="cols2"><div class="card"><h2>${L('Liste de départ', 'Starter checklist')}</h2><ul class="ck">${ck.map((x, i) => `<li><label><input type="checkbox" data-ck="${i}" ${(store.get('astro_ck', [])).includes(i) ? 'checked' : ''}> <span>${x}</span></label></li>`).join('')}</ul></div>
    <div class="card"><h2>${L('Stats principales des reliques', 'Relic main stats')}</h2><div class="tw"><table><tr><th>${L('Emplacement', 'Slot')}</th><th>${L('Options', 'Options')}</th></tr>${ms.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join('')}</table></div></div></div>
    ${sec(L('Questions fréquentes', 'FAQ'))}${q.map(x => `<details class="ev"><summary><b>${x[0]}</b></summary><div><p>${x[1]}</p></div></details>`).join('')}
    ${sec(L('Guides externes', 'External guides'))}<div class="card">${D.manual.guides.map(g => `<p style="margin:4px 0"><a href="${g.u}" target="_blank" rel="noopener">${esc(LANG === 'en' && g.t_en || g.t)}</a></p>`).join('')}</div>`];
  },
  notfound() {
    return [`<div class="nf"><b>404</b><h1>${L('Page introuvable', 'Page not found')}</h1><p class="lead">${L('Cette page n’existe pas ou a été déplacée.', 'This page does not exist or has moved.')}</p><div class="cta"><a class="btn pri" href="#/home">${L('Retour à l’accueil', 'Back to home')}</a><button class="btn" data-search="1">${ico('search')} ${L('Rechercher', 'Search')}</button></div></div>`];
  }
};

// ------------------------------------------------------------ calculateur de ressources
let CE = store.get('astro_ce', { c: '', l1: 1, l2: 80, s: [[1, 6], [1, 10], [1, 10], [1, 10]] });
const SKMAX = [6, 10, 10, 10];
const loadCalc = async () => { if (!CALC) CALC = window.__CALC__ || await fetch('data/calc.json').then(r => r.json()).catch(() => ({ items: {}, c: {} })); return CALC; };
function costOf(e) {
  const d = CALC.c[e.c], out = {}; if (!d) return out;
  const add = a => { for (let i = 0; i < a.length; i += 2) out[a[i]] = (out[a[i]] || 0) + a[i + 1]; };
  for (let k = 0; k < 6; k++) { const cap = 20 + 10 * k; if (e.l1 <= cap && e.l2 > cap) add(d.a[k] || []); }
  e.s.forEach(([a, b], i) => { for (let j = a - 1; j < b - 1; j++) add((d.s[i] || [])[j] || []); });
  return out;
}
const itemGrid = tot => {
  const ids = Object.keys(tot).sort((a, b) => (a === '2' ? -1 : b === '2' ? 1 : (CALC.items[b] || {}).r - (CALC.items[a] || {}).r || a - b));
  if (!ids.length) return `<p class="sub">${L('Rien à dépenser avec ces niveaux.', 'Nothing to spend with these levels.')}</p>`;
  return `<div class="items">${ids.map(i => { const it = CALC.items[i] || { f: i, e: i, r: 1 }; return `<div class="it r${it.r}" title="${esc(L(it.f, it.e))}"><img src="${im('i', i)}" alt="" loading="lazy"><b>${tot[i].toLocaleString(LOC())}</b><span>${esc(L(it.f, it.e))}</span></div>`; }).join('')}</div>`;
};
function drawCalc() {
  const r = $('#cres'); if (!r || !CALC) return;
  r.innerHTML = CE.c ? itemGrid(costOf(CE)) : `<p class="sub">${L('Choisissez un personnage.', 'Pick a character.')}</p>`;
  const tot = {}; plan.forEach(e => { const c = costOf(e); Object.keys(c).forEach(k => tot[k] = (tot[k] || 0) + c[k]); });
  const pl = $('#clist'); if (pl) pl.innerHTML = plan.length ? plan.map((e, i) => `<div class="team">${byId[e.c] ? tile(byId[e.c], { s: 1 }) : ''}<div style="flex:1;min-width:150px"><b>${esc((byId[e.c] || {}).n || e.c)}</b><br><span class="sub">${L('Niv.', 'Lv.')} ${e.l1} → ${e.l2} · ${e.s.map(s => s[0] + '→' + s[1]).join(' / ')}</span></div><button class="btn" data-cdel="${i}">${L('Retirer', 'Remove')}</button></div>`).join('') + sec(L('Total de ma liste', 'Total of my list')) + itemGrid(tot) : `<p class="sub">${L('Votre liste est vide : réglez un personnage puis cliquez sur « Ajouter ».', 'Your list is empty: set up a character then click “Add”.')}</p>`;
}
function readCE() {
  if (!$('#ce_c')) return;
  CE.c = $('#ce_c').value; const n = (id, d, lo, hi) => Math.min(hi, Math.max(lo, parseInt($(id).value) || d));
  CE.l1 = n('#ce_l1', 1, 1, 80); CE.l2 = n('#ce_l2', 80, 1, 80); if (CE.l2 < CE.l1) CE.l2 = CE.l1;
  CE.s = SKMAX.map((m, i) => { let a = n('#ce_a' + i, 1, 1, m), b = n('#ce_b' + i, m, 1, m); if (b < a) b = a; return [a, b]; }); store.set('astro_ce', CE);
}
pages.calc = cid => {
  if (cid && byId[cid]) { CE.c = cid; store.set('astro_ce', CE); }
  const sk = [L('Attaque normale', 'Basic ATK'), L('Compétence', 'Skill'), L('Ultime', 'Ultimate'), L('Talent', 'Talent')];
  const sel = (id, max, v) => `<select id="${id}" data-ce="1" style="max-width:90px;margin:0">${Array.from({ length: max }, (_, k) => `<option ${k + 1 === v ? 'selected' : ''}>${k + 1}</option>`).join('')}</select>`;
  return [`<h1>${L('Calculateur de ressources', 'Resource calculator')}</h1><p class="lead">${L('Matériaux d’ascension et de montée des compétences d’un personnage, avec le total pour toute votre liste. Les points d’EXP de niveau et les traces mineures ne sont pas inclus.', 'Ascension and skill-upgrade materials for a character, with the total for your whole list. Level EXP and minor traces are not included.')}</p>
  <div class="card"><div class="g"><div><label class="lab">${L('Personnage', 'Character')}</label><select id="ce_c" data-ce="1"><option value="">${L('Choisir…', 'Pick…')}</option>${[...C].sort((a, b) => a.n.localeCompare(b.n)).map(c => `<option value="${c.id}" ${CE.c === c.id ? 'selected' : ''}>${esc(c.n)}</option>`).join('')}</select>
  <label class="lab">${L('Niveau actuel → visé (1 à 80)', 'Current → target level (1–80)')}</label><div class="rg"><input type="number" id="ce_l1" data-ce="1" min="1" max="80" value="${CE.l1}"><span>→</span><input type="number" id="ce_l2" data-ce="1" min="1" max="80" value="${CE.l2}"></div>
  <p class="sub" style="font-size:12.5px">${L('Aux niveaux 20, 30… 70 le personnage est supposé ne pas être encore ascensionné.', 'At levels 20, 30… 70 the character is assumed not to be ascended yet.')}</p></div>
  <div><span class="lab">${L('Compétences (niveau actuel → visé)', 'Skills (current → target level)')}</span>${sk.map((n, i) => `<div class="rg" style="margin:8px 0"><span style="width:130px">${n}</span>${sel('ce_a' + i, SKMAX[i], CE.s[i][0])}<span>→</span>${sel('ce_b' + i, SKMAX[i], CE.s[i][1])}</div>`).join('')}</div></div>
  <button class="btn pri" data-cadd="1">${ico('plus')} ${L('Ajouter à ma liste', 'Add to my list')}</button></div>
  ${sec(L('Matériaux pour cette sélection', 'Materials for this selection'))}<div id="cres"><p class="sub">${L('Chargement…', 'Loading…')}</p></div>${sec(L('Ma liste', 'My list'))}<div id="clist"></div>`, null, async () => { await loadCalc(); drawCalc(); }];
};

// ------------------------------------------------------------ planificateur de tirages
const BNR = { c: { base: .006, soft: 74, step: .06, hard: 90, up: .5 }, l: { base: .008, soft: 66, step: .07, hard: 80, up: .75 } };
let PL = store.get('astro_pl', { b: 'c', j: 0, t: 0, x: 0, p: 0, g: false, k: 1 });
function simulate(cfg, pity0, g0, nmax) {
  const K = 7, rate = m => (m >= cfg.hard ? 1 : m < cfg.soft ? cfg.base : Math.min(1, cfg.base + cfg.step * (m - cfg.soft + 1)));
  let cur_ = new Float64Array(cfg.hard * 2 * (K + 1)); const idx = (p, g, c) => (p * 2 + g) * (K + 1) + c;
  cur_[idx(Math.min(pity0, cfg.hard - 1), g0 ? 1 : 0, 0)] = 1;
  const cdf = Array.from({ length: K + 1 }, () => new Float64Array(nmax + 1)); // cdf[k][n] = P(au moins k exemplaires après n tirages)
  for (let n = 1; n <= nmax; n++) {
    const nx = new Float64Array(cur_.length);
    for (let p = 0; p < cfg.hard; p++) for (let g = 0; g < 2; g++) for (let c = 0; c <= K; c++) {
      const v = cur_[idx(p, g, c)]; if (!v) continue;
      if (c === K) { nx[idx(0, 0, K)] += v; continue; }
      const r = rate(p + 1);
      if (r < 1) nx[idx(p + 1, g, c)] += v * (1 - r);
      const win = g ? 1 : cfg.up;
      nx[idx(0, 0, c + 1)] += v * r * win; if (win < 1) nx[idx(0, 1, c)] += v * r * (1 - win);
    }
    cur_ = nx;
    const acc = new Float64Array(K + 1);
    for (let p = 0; p < cfg.hard; p++) for (let g = 0; g < 2; g++) { let s = 0; for (let c = K; c >= 1; c--) { s += cur_[idx(p, g, c)]; acc[c] += s; } }
    for (let k = 1; k <= K; k++) cdf[k][n] = acc[k];
  }
  return cdf;
}
function drawPlan() {
  const o = $('#po'); if (!o) return; const cfg = BNR[PL.b], N = Math.floor(PL.j / 160) + PL.t + Math.floor(PL.x / 160);
  const nmax = Math.min(1600, Math.max(N + 40, cfg.hard * 8)), cdf = simulate(cfg, Math.min(PL.p, cfg.hard - 1), PL.g, nmax), T = PL.k, pc = v => (v * 100 < 10 ? (v * 100).toFixed(1) : Math.round(v * 100)) + ' %';
  const need = q => { for (let n = 1; n <= nmax; n++) if (cdf[T][n] >= q) return n; return '> ' + nmax; };
  const W = 640, H = 220, X = n => 40 + (W - 60) * n / nmax, Y = v => H - 28 - (H - 48) * v, pts = []; for (let n = 0; n <= nmax; n += Math.max(1, Math.floor(nmax / 160))) pts.push(`${X(n).toFixed(1)},${Y(cdf[T][n] || 0).toFixed(1)}`);
  o.innerHTML = `<div class="g3"><div class="stat"><span class="lab">${L('Tirages disponibles', 'Pulls available')}</span><b>${N}</b></div><div class="stat"><span class="lab">${L('Chance d’obtenir', 'Chance to get')} E${T - 1}</span><b>${pc(cdf[T][Math.min(N, nmax)] || 0)}</b></div><div class="stat"><span class="lab">${L('Prochain 5★ garanti en', 'Next 5★ guaranteed in')}</span><b>${cfg.hard - Math.min(PL.p, cfg.hard - 1)} ${L('tirages max', 'pulls max')}</b></div></div>
  <div class="card" style="margin-top:14px"><svg viewBox="0 0 ${W} ${H}" class="chartsvg" role="img" aria-label="${L('Probabilité cumulée selon le nombre de tirages', 'Cumulative probability by number of pulls')}">${[0, .25, .5, .75, 1].map(v => `<line x1="40" x2="${W - 20}" y1="${Y(v)}" y2="${Y(v)}" class="gl"/><text x="34" y="${Y(v) + 4}" text-anchor="end" class="gt">${v * 100}%</text>`).join('')}
  <polyline points="${pts.join(' ')}" fill="none" stroke="var(--ac)" stroke-width="2.5"/><line x1="${X(Math.min(N, nmax))}" x2="${X(Math.min(N, nmax))}" y1="20" y2="${H - 28}" stroke="var(--SS)" stroke-dasharray="4 3"/><text x="${Math.min(X(Math.min(N, nmax)) + 6, W - 90)}" y="34" class="gt" fill="var(--SS)">${L('Vous : ', 'You: ')}${N}</text>
  ${[0, .25, .5, .75, 1].map(f => `<text x="${X(nmax * f)}" y="${H - 8}" text-anchor="middle" class="gt">${Math.round(nmax * f)}</text>`).join('')}</svg>
  <div class="tw"><table style="min-width:0"><tr><th>${L('Objectif', 'Goal')}: E${T - 1}</th>${[.5, .75, .9, .99].map(q => `<th>${q * 100}%</th>`).join('')}</tr><tr><td>${L('Tirages nécessaires', 'Pulls needed')}</td>${[.5, .75, .9, .99].map(q => `<td>${need(q)}</td>`).join('')}</tr></table></div></div>
  <div class="card"><div class="tw"><table style="min-width:0"><tr><th>${L('Avec vos ', 'With your ')}${N} ${L('tirages', 'pulls')}</th>${Array.from({ length: 7 }, (_, k) => `<th>E${k}</th>`).join('')}</tr><tr><td>${L('Chance d’obtenir au moins', 'Chance of at least')}</td>${Array.from({ length: 7 }, (_, k) => `<td>${pc(cdf[k + 1][Math.min(N, nmax)] || 0)}</td>`).join('')}</tr></table></div></div>`;
}
pages.plan = () => {
  const inp = (id, lab, v, mx = 99999999) => `<label>${lab}<input type="number" data-pl="${id}" min="0" max="${mx}" value="${v}"></label>`;
  return [`<h1>${L('Planificateur de tirages', 'Pull planner')}</h1><p class="lead">${L('Calcule vos chances d’obtenir un personnage (ou un cône) selon vos jades, vos passes, votre pity et la garantie du 50/50. Modèle simplifié basé sur les taux connus : à prendre comme une estimation.', 'Estimates your chances of getting a character (or cone) from your jades, passes, pity and 50/50 guarantee. Simplified model based on known rates: treat it as an estimate.')}</p>
  <div class="card"><div class="g3"><label>${L('Type de bannière', 'Banner type')}<select data-pl="b"><option value="c" ${PL.b === 'c' ? 'selected' : ''}>${L('Personnage (90, 50/50)', 'Character (90, 50/50)')}</option><option value="l" ${PL.b === 'l' ? 'selected' : ''}>${L('Cône de lumière (80, 75/25)', 'Light Cone (80, 75/25)')}</option></select></label>
  ${inp('j', L('Jade stellaire', 'Stellar Jade'), PL.j)}${inp('t', L('Passes spéciaux', 'Special Passes'), PL.t)}${inp('x', L('Jades à venir (événements…)', 'Upcoming jades (events…)'), PL.x)}${inp('p', L('Pity actuel', 'Current pity'), PL.p, 89)}
  <label>${L('Exemplaires visés', 'Copies targeted')}<select data-pl="k">${Array.from({ length: 7 }, (_, k) => `<option value="${k + 1}" ${PL.k === k + 1 ? 'selected' : ''}>E${k}${k ? '' : L(' (1 exemplaire)', ' (1 copy)')}</option>`).join('')}</select></label></div>
  <label style="display:flex;gap:8px;align-items:center;margin-top:8px"><input type="checkbox" data-pl="g" ${PL.g ? 'checked' : ''} style="width:auto;margin:0"> ${L('Le prochain 5★ est garanti (j’ai perdu mon dernier 50/50)', 'My next 5★ is guaranteed (I lost my last 50/50)')}</label></div><div id="po"></div>
  <p class="note">${L('160 jades = 1 tirage. Hypothèses : personnage 0,6 % (pity doux dès 74, garantie à 90) ; cône 0,8 % (dès 66, garantie à 80). Les taux réels du jeu peuvent légèrement différer.', '160 jades = 1 pull. Assumptions: character 0.6% (soft pity from 74, guarantee at 90); cone 0.8% (from 66, guarantee at 80). Real in-game rates may differ slightly.')}</p>`, null, drawPlan];
};

// ------------------------------------------------------------ statistiques de la communauté
pages.stats = () => [`<h1>${L('Statistiques', 'Statistics')}</h1><p class="lead">${L('Ce que possèdent et aiment les joueurs inscrits sur Astrolabe. Les chiffres sont anonymes : aucun nom, seulement des totaux.', 'What the players registered on Astrolabe own and like. Figures are anonymous: no names, only totals.')}</p><div id="stt"><p class="sub">${L('Chargement…', 'Loading…')}</p></div>`, null, async () => {
  const el = $('#stt'); if (!el) return;
  if (!sb) { el.innerHTML = `<p class="sub">${L('Les statistiques demandent les comptes (Supabase).', 'Statistics need accounts (Supabase).')}</p>`; return; }
  const { data, error } = await sb.rpc('site_stats'); if (!$('#stt')) return;
  if (error || !data) { el.innerHTML = `<p class="sub">${L('Statistiques indisponibles : exécutez supabase/schema_v4.sql.', 'Statistics unavailable: run supabase/schema_v4.sql.')}</p>`; return; }
  const players = data.players || 0, own = Object.entries(data.own || {}).filter(([i]) => byId[i]).sort((a, b) => b[1].n - a[1].n), fc = Object.entries(data.favc || {}).filter(([i]) => byId[i]).sort((a, b) => b[1] - a[1]), fb = Object.entries(data.favb || {}).filter(([i]) => byId[i]).sort((a, b) => b[1] - a[1]);
  const bars = (arr, f, sub) => arr.length ? arr.slice(0, 12).map(([i, v]) => `<a class="bar" href="#/perso/${i}"><img src="${im('c', i)}" alt=""><span class="bn2">${esc(byId[i].n)}</span><span class="bt"><i style="width:${Math.max(3, f(v))}%"></i></span><em>${sub(v)}</em></a>`).join('') : `<p class="sub">${L('Pas encore de données.', 'No data yet.')}</p>`;
  el.innerHTML = `<div class="g3"><div class="stat"><span class="lab">${L('Joueurs avec collection', 'Players with a collection')}</span><b>${players}</b></div><div class="stat"><span class="lab">${L('Personnages différents possédés', 'Different characters owned')}</span><b>${own.length}</b></div><div class="stat"><span class="lab">${L('Favoris enregistrés', 'Saved favourites')}</span><b>${fc.reduce((s, x) => s + x[1], 0) + fb.reduce((s, x) => s + x[1], 0)}</b></div></div>
  <div class="g" style="margin-top:14px"><div class="card"><h2>${L('Les plus possédés', 'Most owned')}</h2>${bars(own, v => players ? v.n / players * 100 : 0, v => (players ? Math.round(v.n / players * 100) : 0) + ' % · E' + v.e)}</div>
  <div class="card"><h2>${L('Personnages favoris', 'Favourite characters')}</h2>${bars(fc, v => v / (fc[0][1] || 1) * 100, v => '♥ ' + v)}</div>
  <div class="card"><h2>${L('Builds favoris', 'Favourite builds')}</h2>${bars(fb, v => v / (fb[0][1] || 1) * 100, v => '♥ ' + v)}</div></div>
  ${sec(L('Équipes les plus enregistrées', 'Most saved teams'))}${(data.teams || []).length ? data.teams.map(t => `<div class="team">${(t.m || []).filter(i => byId[i]).map(i => tile(byId[i], { s: 1 })).join('')}<span class="sub" style="margin-left:auto">${t.n}×</span></div>`).join('') : `<p class="sub">${L('Aucune équipe enregistrée pour l’instant.', 'No team saved yet.')}</p>`}`;
}];

// ------------------------------------------------------------ équipes
let TB = store.get('astro_tb', { name: '', m: [{ c: '', l: '' }, { c: '', l: '' }, { c: '', l: '' }, { c: '', l: '' }] }), pickSlot = 0;
const teamCode = m => m.filter(x => x.c).map(x => x.c + '-' + (x.l || '')).join('_');
const parseTeam = s => (s || '').split('_').map(p => p.split('-')).filter(p => byId[p[0]]).slice(0, 4).map(p => ({ c: p[0], l: lcOf(p[1]) ? p[1] : '' }));
const shareUrl = m => location.href.split('#')[0] + '#/team/' + teamCode(m);
function teamAnalysisOld(m) {
  const ms = m.filter(x => byId[x.c]).map(x => byId[x.c]); if (!ms.length) return '';
  const paths = ms.map(c => c.pi), tips = [];
  if (!paths.some(p => ['Priest', 'Knight'].includes(p)) && !ms.some(c => c.pi === 'Memory')) tips.push(L('Aucun soigneur ni protecteur : prévoyez des boucliers ou du soin.', 'No healer or protector: plan for shields or healing.'));
  if (!paths.some(p => ['Shaman', 'Warlock'].includes(p))) tips.push(L('Pas de soutien Harmonie/Nihilité : les dégâts risquent d’être limités.', 'No Harmony/Nihility support: damage may be limited.'));
  if (ms.length < 4) tips.push(L('Équipe incomplète : ajoutez ' + (4 - ms.length) + ' personnage(s).', 'Incomplete team: add ' + (4 - ms.length) + ' character(s).'));
  const sc = ms.map(c => c.t).filter(t => TIERS.includes(t));
  return `<div class="card"><div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">${ms.map(c => eiImg(c.ei) + piImg(c.pi)).join('')}${sc.length ? `<span class="sub" style="margin-left:8px">${L('Tiers : ', 'Tiers: ')}${ms.map(c => tchip(c.t)).join(' ')}</span>` : ''}</div>${tips.length ? `<ul class="tips">${tips.map(t => `<li>${t}</li>`).join('')}</ul>` : `<p class="sub" style="margin:8px 0 0">${L('Composition équilibrée sur le papier.', 'Balanced on paper.')}</p>`}</div>`;
}
const teamView = (m, o = {}) => `<div class="team big">${m.map(x => { const c = byId[x.c], l = x.l && lcOf(x.l); return c ? `<div class="tm">${tile(c)}<div class="lcm">${l ? `<img src="${im('l', l.id)}" alt=""><span>${esc(l.n)}</span>` : `<span class="sub">${L('Pas de cône', 'No cone')}</span>`}</div></div>` : ''; }).join('')}</div>`;
pages.teams = () => {
  const slots = TB.m.map((x, i) => { const c = byId[x.c]; const lcs = c ? LC.filter(l => l.pi === c.pi).sort((a, b) => b.r - a.r || a.n.localeCompare(b.n)) : []; return `<div class="slotb">${c ? tile(c) : `<button class="addslot" data-pick="${i}">${ico('plus')}</button>`}${c ? `<select data-tl="${i}"><option value="">${L('Cône de lumière…', 'Light Cone…')}</option>${lcs.map(l => `<option value="${l.id}" ${x.l === l.id ? 'selected' : ''}>${l.r}★ ${esc(l.n)}</option>`).join('')}</select><div style="display:flex;gap:6px"><button class="btn" data-pick="${i}">${L('Changer', 'Change')}</button><button class="btn" data-tclear="${i}">✕</button></div>` : `<span class="sub">${L('Emplacement', 'Slot')} ${i + 1}</span>`}</div>`; }).join('');
  const code = teamCode(TB.m);
  return [`<h1>${L('Équipes', 'Teams')}</h1><p class="lead">${L('Composez une équipe de 4 personnages avec leurs cônes, enregistrez-la et partagez-la avec un simple lien.', 'Build a 4-character team with their cones, save it and share it with a simple link.')}</p>
  <div class="slots">${slots}</div><div id="tan">${teamAnalysis(TB.m)}</div>
  <div class="card"><div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center"><input type="text" id="tname" placeholder="${L('Nom de l’équipe', 'Team name')}" maxlength="40" value="${esc(TB.name)}" style="max-width:280px;margin:0"><button class="btn pri" data-tsave="1">${L('Enregistrer', 'Save')}</button><button class="btn" data-tshare="1" ${code ? '' : 'disabled'}>${L('Copier le lien', 'Copy link')}</button><button class="btn" data-treset="1">${L('Vider', 'Clear')}</button></div>
  <input type="text" id="tlink" readonly value="${code ? esc(shareUrl(TB.m)) : ''}" placeholder="${L('Le lien de partage apparaît ici', 'The share link shows up here')}" style="max-width:none;margin:10px 0 0"><p class="sub" id="tmsg" style="margin:6px 0 0"></p></div>
  ${sec(L('Mes équipes', 'My teams'))}${myTeams.length ? myTeams.map(t => `<div class="card"><div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap"><b style="font:700 18px var(--se)">${esc(t.name)}</b><span style="margin-left:auto;display:flex;gap:6px"><button class="btn" data-tload="${t.id}">${L('Modifier', 'Edit')}</button><a class="btn" href="#/team/${teamCode(t.m)}">${L('Ouvrir', 'Open')}</a><button class="btn" data-tdel="${t.id}">${L('Supprimer', 'Delete')}</button></span></div>${teamView(t.m)}</div>`).join('') : `<p class="sub">${L('Aucune équipe enregistrée.' + (sb && !user ? ' Connectez-vous pour les retrouver partout.' : ''), 'No saved team.' + (sb && !user ? ' Log in to keep them everywhere.' : ''))}</p>`}`];
};
pages.team = code => {
  const m = parseTeam(code); if (!m.length) return pages.notfound();
  return [`<h1>${L('Équipe partagée', 'Shared team')}</h1><p class="lead">${L('Une équipe composée sur Astrolabe.', 'A team built on Astrolabe.')}</p>${teamView(m)}${teamAnalysis(m)}<div class="cta"><button class="btn pri" data-tcopy="${esc(code)}">${L('Modifier dans le constructeur', 'Edit in the builder')}</button><a class="btn" href="#/teams">${L('Mes équipes', 'My teams')}</a></div>`];
};

// ------------------------------------------------------------ administration
let adm = { tab: 'fb', f: 'open' };
pages.admin = tab => {
  if (!isAdmin) return [`<div class="nf"><b>🔒</b><h1>${L('Accès réservé', 'Restricted')}</h1><p class="lead">${L('Cette page est réservée à l’administrateur du site. Connectez-vous avec le compte administrateur.', 'This page is for the site administrator. Log in with the administrator account.')}</p></div>`];
  adm.tab = tab || adm.tab || 'fb';
  return [`<h1>${L('Administration', 'Administration')}</h1><p class="lead">${L('Retours des visiteurs, erreurs détectées automatiquement et signalements de profils.', 'Visitor feedback, automatically detected errors and profile reports.')}</p>
  <div class="bigtabs"><a class="${adm.tab === 'fb' ? 'on' : ''}" href="#/admin/fb">${ico('flag')}${L('Retours & erreurs', 'Feedback & errors')}</a><a class="${adm.tab === 'rp' ? 'on' : ''}" href="#/admin/rp">${ico('shield')}${L('Signalements', 'Reports')}</a><a class="${adm.tab === 'cr' ? 'on' : ''}" href="#/admin/cr">${ico('flag')}${L('Contenu signalé', 'Reported content')}</a></div>
  <div class="opts"><div class="seg"><button class="${adm.f === 'open' ? 'on' : ''}" data-af="open">${L('À traiter', 'Open')}</button><button class="${adm.f === 'closed' ? 'on' : ''}" data-af="closed">${L('Traités', 'Done')}</button></div></div><div id="adm"><p class="sub">${L('Chargement…', 'Loading…')}</p></div>`, null, loadAdmin];
};
document.addEventListener('click', async e => { const b = e.target.closest('[data-acr]'); if (!b || !sb || !isAdmin) return; const [a, k, t, id] = b.dataset.acr.split(':'); if (a === 'del') { if (!confirm(L('Supprimer définitivement ce contenu ?', 'Permanently delete this content?'))) return; await sb.from(k === 'msg' ? 'messages' : 'posts').delete().eq('id', k === 'msg' ? +t : t); } await sb.from('content_reports').delete().eq('id', +id); loadAdmin(); });
async function loadAdmin() {
  const el = $('#adm'); if (!el || !sb || !isAdmin) return;
  if (adm.tab === 'cr') { const { data: cr, error: ce } = await sb.from('content_reports').select('*').order('created_at', { ascending: false }).limit(100); if (!$('#adm')) return;
    if (ce) { el.innerHTML = `<p class="sub">${L('Erreur : exécutez supabase/schema_v9.sql. ', 'Error: run supabase/schema_v9.sql. ')}(${esc(ce.message)})</p>`; return; }
    el.innerHTML = (cr || []).map(r => `<div class="card fbk"><div class="fh"><span class="tag">${esc(r.kind)}</span><span class="sub">${fmtD(r.created_at)}</span></div><p>${esc(r.reason)}</p><small class="sub">id : ${esc(r.target)}</small><div class="acts"><button class="btn danger" data-acr="del:${esc(r.kind)}:${esc(r.target)}:${r.id}">${L('Supprimer le contenu', 'Delete content')}</button><button class="btn" data-acr="ign:${esc(r.kind)}:${esc(r.target)}:${r.id}">${L('Ignorer', 'Dismiss')}</button></div></div>`).join('') || `<div class="card"><p class="sub" style="margin:0">${L('Aucun contenu signalé 🎉', 'No reported content 🎉')}</p></div>`; return; }
  const tb = adm.tab === 'rp' ? 'reports' : 'feedback', { data, error } = await sb.from(tb).select('*').eq('status', adm.f).order('created_at', { ascending: false }).limit(200);
  if (!$('#adm')) return;
  if (error) { el.innerHTML = `<p class="sub">${L('Erreur : exécutez supabase/schema_v4.sql. ', 'Error: run supabase/schema_v4.sql. ')}(${esc(error.message)})</p>`; return; }
  if (!data.length) { el.innerHTML = `<div class="card"><p class="sub" style="margin:0">${L('Rien ici pour l’instant 🎉', 'Nothing here for now 🎉')}</p></div>`; return; }
  const act = (id, closed) => `<span class="acts">${closed ? `<button class="btn" data-aset="${tb}:${id}:open">${L('Rouvrir', 'Reopen')}</button>` : `<button class="btn pri" data-aset="${tb}:${id}:closed">${L('Marquer traité', 'Mark done')}</button>`}<button class="btn" data-adel="${tb}:${id}">${L('Supprimer', 'Delete')}</button></span>`;
  if (tb === 'feedback') { const K = { bug: L('Bug', 'Bug'), data: L('Donnée fausse', 'Wrong data'), idea: L('Idée', 'Idea'), other: L('Autre', 'Other'), auto: L('Erreur auto', 'Auto error') };
    el.innerHTML = data.map(f => `<div class="card fbk ${f.kind}"><div class="fh"><span class="tag ${f.kind === 'auto' || f.kind === 'bug' ? 'tg' : ''}" style="--tc:var(--SS)">${K[f.kind] || f.kind}</span><span class="sub">${fmtD(f.created_at)}</span>${f.page ? `<a href="${esc(f.page)}">${esc(f.page)}</a>` : ''}${act(f.id, adm.f === 'closed')}</div><p class="fmsg">${esc(f.message)}</p><small class="sub">${esc(f.agent || '')}${f.user_id ? ' · ' + L('utilisateur connecté', 'logged-in user') : ''}</small></div>`).join('');
  } else {
    const ids = [...new Set(data.map(r => r.profile_id))], { data: ps } = await sb.from('profiles').select('user_id,handle,display_name,is_public,bio').in('user_id', ids), pm = Object.fromEntries((ps || []).map(p => [p.user_id, p]));
    const cnt = {}; data.forEach(r => cnt[r.profile_id] = (cnt[r.profile_id] || 0) + 1);
    el.innerHTML = data.map(r => { const p = pm[r.profile_id]; return `<div class="card fbk"><div class="fh"><b>${p ? esc(p.display_name || p.handle || '—') : L('Profil supprimé', 'Deleted profile')}</b>${p && p.handle ? `<a href="#/community/${esc(p.handle)}">@${esc(p.handle)}</a>` : ''}<span class="tag ${p && p.is_public ? 'tg' : ''}" style="--tc:var(--A)">${p && p.is_public ? L('public', 'public') : L('masqué', 'hidden')}</span><span class="tag">${cnt[r.profile_id]}× ${L('signalé', 'reported')}</span><span class="sub">${fmtD(r.created_at)}</span>${act(r.id, adm.f === 'closed')}</div><p class="fmsg">${esc(r.reason)}</p>${p ? `<small class="sub">${esc(p.bio || '')}</small><div style="margin-top:8px"><button class="btn" data-ahide="${r.profile_id}:${p.is_public ? 0 : 1}">${p.is_public ? L('Masquer ce profil', 'Hide this profile') : L('Rendre public à nouveau', 'Make public again')}</button> <button class="btn" data-adelp="${r.profile_id}">${L('Supprimer le profil', 'Delete profile')}</button> <button class="btn danger" data-adelu="${r.profile_id}">${L('Supprimer le compte', 'Delete account')}</button></div>` : ''}</div>`; }).join('');
  }
}

// ------------------------------------------------------------ profil, bannières, communauté
function profSettingsHtml() {
    const sorted = [...C].sort((x, y) => x.n.localeCompare(y.n)), shw = Array.from({ length: 6 }, (_, k) => prof.show[k] || { c: '', t: '' });
    return `<div class="card"><h2>${L('Profil', 'Profile')}</h2><label class="lab">${L('Pseudo affiché', 'Display name')}</label><input type="text" id="pn" value="${esc(prof.name)}" placeholder="${L('Votre pseudo', 'Your name')}" maxlength="24">
    <p class="lab" style="margin-top:6px">${L('Photo de profil', 'Profile photo')}</p><div class="phrow">${photoOk(prof.photo) ? `<img class="av" src="${prof.photo}" alt="">` : ''}<label class="btn" style="cursor:pointer">${L('Importer une photo', 'Upload a photo')}<input type="file" id="pph" accept="image/*" hidden></label>${photoOk(prof.photo) ? `<button class="btn" data-phrm="1">${L('Retirer', 'Remove')}</button>` : ''}</div><p class="sub" style="font-size:12.5px;margin:6px 0 12px">${L('La photo est recadrée en carré et réduite (160 px) dans votre navigateur. Elle n’est visible des autres que si votre profil est public. N’importez que des images dont vous avez les droits et qui conviennent à tous.', 'The photo is cropped to a square and shrunk (160 px) in your browser. Others only see it if your profile is public. Only upload images you have the rights to and that suit everyone.')}</p><p class="lab">${L('Ou choisissez un avatar', 'Or pick an avatar')}</p><div class="grid" style="max-height:190px;overflow:auto;margin-bottom:12px">${C.map(c => `<button class="cd s ${prof.avatar === c.id ? 'on' : ''}" data-av="${c.id}" style="opacity:${prof.avatar === c.id ? 1 : .75}"><span class="pt" style="${prof.avatar === c.id ? 'border-color:var(--ac)' : ''}"><img src="${im('c', c.id)}" alt="" loading="lazy"></span></button>`).join('')}</div></div>
    <div class="card"><h2>${L('Profil public (communauté)', 'Public profile (community)')}</h2>${!sb || !user ? `<p class="sub">${L('Connectez-vous pour partager votre profil avec la communauté.', 'Log in to share your profile with the community.')}</p>` : `<label style="display:flex;gap:8px;align-items:center;margin-bottom:12px"><input type="checkbox" id="ppub" ${prof.pub ? 'checked' : ''} style="width:auto;margin:0"> ${L('Rendre mon profil public (désactivé par défaut)', 'Make my profile public (off by default)')}</label>
    <label class="lab">${L('Nom d’utilisateur (adresse du profil)', 'Username (profile address)')}</label><input type="text" id="phd" value="${esc(prof.handle)}" placeholder="${L('ex. mon-pseudo', 'e.g. my-name')}" maxlength="20">
    <label class="lab">${L('Présentation (200 caractères max.)', 'Bio (200 characters max.)')}</label><input type="text" id="pbio" value="${esc(prof.bio)}" maxlength="200" placeholder="${L('Une phrase sur vous', 'One sentence about you')}">
    <p class="sub" style="margin-top:10px">${L('Votre vitrine de cartes se règle dans ', 'Your card showcase is set in ')}<a href="#/profil/show">${L('Profil → Vitrine', 'Profile → Showcase')}</a>.</p>
    <p class="sub" style="font-size:12.5px">${L('Seuls le pseudo, l’avatar, la présentation, les chiffres de collection et la vitrine sont publics. Jamais votre e-mail ni votre collection complète.', 'Only the name, avatar, bio, collection figures and showcase are public. Never your e-mail or your full collection.')}</p>`}
    <button class="btn pri" id="psave">${L('Enregistrer', 'Save')}</button> ${prof.pub && prof.handle ? `<a href="#/community/${esc(prof.handle)}" style="margin-left:10px">${L('Voir mon profil public', 'See my public profile')}</a>` : ''}<p class="sub">${esc(pmsg)}</p></div>
    <div class="card"><h2>${L('Sécurité du compte', 'Account security')}</h2><div id="sec2fa"><p class="sub">…</p></div></div>
    ${sb && user ? `<div class="card dz"><h2>${L('Zone sensible', 'Danger zone')}</h2><p class="sub">${L('Supprimer votre profil public (le compte reste), ou supprimer entièrement votre compte et toutes vos données.', 'Delete your public profile (the account stays), or delete your whole account and all your data.')}</p><button class="btn" id="delprof">${L('Supprimer mon profil public', 'Delete my public profile')}</button> <button class="btn danger" id="delacc">${L('Supprimer mon compte', 'Delete my account')}</button></div>` : ''}
    <div class="card"><h2>${L('Données', 'Data')}</h2><p class="sub">${L('Les données de ce navigateur ' + (sb ? 'sont synchronisées avec votre compte quand vous êtes connecté.' : 'restent dans ce navigateur.'), 'The data in this browser ' + (sb ? 'is synced with your account when you are logged in.' : 'stays in this browser.'))}</p><button class="btn" id="preset">${L('Vider la collection', 'Clear collection')}</button></div>`;
}
const profOld = tab => {
  tab = tab || 'col'; const own = Object.keys(prof.col).filter(i => byId[i]), n5 = own.filter(i => byId[i].r === 5).length, eids = own.reduce((s, i) => s + prof.col[i], 0);
  const name = prof.name || (user ? user.email.split('@')[0] : L('Voyageur', 'Traveler')), since = user ? L('Membre depuis le ', 'Member since ') + new Date(user.created_at).toLocaleDateString(LOC()) : L('Profil local, enregistré dans ce navigateur', 'Local profile, saved in this browser');
  const teams = new Map(); own.forEach(i => ((byId[i].b || {}).teams || []).forEach(t => { const ids = [...new Set([i, ...t.map(m => m.c)])]; if (ids.length >= 3 && ids.length <= 4 && ids.every(x => x in prof.col)) teams.set([...ids].sort().join('-'), ids); }));
  const banner = !sb ? '' : user ? '' : `<div class="card" style="display:flex;gap:14px;align-items:center;flex-wrap:wrap"><span>${L('Connectez-vous pour retrouver votre collection et vos favoris sur tous vos appareils.', 'Log in to keep your collection and favourites on all your devices.')}</span><button class="btn pri" id="login">${L('Connexion', 'Log in')}</button></div>`;
  const tabs = [['col', L('Collection', 'Collection'), 'users'], ['fav', L('Favoris', 'Favourites'), 'star'], ['teams', L('Mes équipes possibles', 'My possible teams'), 'cmp']];
  let body = '', res = null;
  if (tab === 'col') {
    res = () => `<div class="grid">${C.filter(c => (!S.e || c.ei === S.e) && (!S.p || c.pi === S.p) && (!S.r || c.r == S.r) && has(c.n) && (!S.own || (S.own === 'own') === (c.id in prof.col))).map(c => { const on = c.id in prof.col; return `<div style="width:88px"><button class="cd own r${c.r}${on ? ' on' : ''}" data-own="${c.id}"><span class="pt"><img src="${im('c', c.id)}" alt="" loading="lazy">${eiImg(c.ei)}${on ? `<b class="bd">E${prof.col[c.id]}</b>` : ''}</span><span class="nm">${esc(c.n)}</span></button>${on ? `<select data-eid="${c.id}" style="width:88px;padding:3px;margin:4px 0 0;font-size:12px">${[0, 1, 2, 3, 4, 5, 6].map(e => `<option value="${e}" ${prof.col[c.id] == e ? 'selected' : ''}>E${e}</option>`).join('')}</select>` : ''}</div>`; }).join('')}</div>`;
    body = `<p class="sub">${L('Cliquez sur un personnage pour l’ajouter à votre collection, puis choisissez son éidolon.', 'Click a character to add it to your collection, then pick its eidolon.')}</p>${cbar()}<div class="fl"><span class="lab">${L('Statut', 'Status')}</span><button class="chip ${S.own === '' ? 'on' : ''}" data-f="own" data-v="">${L('Tous', 'All')}</button><button class="chip ${S.own === 'own' ? 'on' : ''}" data-f="own" data-v="own">${L('Possédés', 'Owned')}</button><button class="chip ${S.own === 'miss' ? 'on' : ''}" data-f="own" data-v="miss">${L('Manquants', 'Missing')}</button></div><div id="res">${res()}</div>`;
  } else if (tab === 'fav') {
    const fc = C.filter(c => fav.char.includes(c.id)), fb = C.filter(c => fav.build.includes(c.id));
    body = sec(L('Personnages favoris', 'Favourite characters')) + (fc.length ? `<div class="grid">${fc.map(c => tile(c, { sub: eN(c.ei) + ' · ' + pN(c.pi) })).join('')}</div>` : `<p class="sub">${L('Aucun pour l’instant. Cliquez sur « Personnage favori » dans une fiche.', 'None yet. Click “Favourite character” on a character page.')}</p>`) + sec(L('Builds favoris', 'Favourite builds')) + (fb.length ? fb.map(c => `<div class="card" style="display:flex;gap:14px;align-items:center">${tile(c, { s: 1 })}<div><b>${esc(c.n)}</b><br><span class="sub">${c.b ? esc(c.b.subs.slice(0, 4).map(stx).join(' > ')) : ''}</span><br><a href="#/perso/${c.id}/build">${L('Voir le build', 'See the build')}</a></div></div>`).join('') : `<p class="sub">${L('Aucun pour l’instant. Cliquez sur « Build favori » dans une fiche.', 'None yet. Click “Favourite build” on a character page.')}</p>`);
  } else if (tab === 'teams') {
    body = colTeamsHtml();
  } else {
    body = '';
  }
  return [body, res];
};
function verBannerOld() {
  const nx = D.banners && D.banners.next; if (!nx) return '';
  const d = Math.ceil((new Date(nx.date) - Date.now()) / 864e5);
  return `<a class="vs" href="#/banners"><div><span class="lab">${L('Prochaine version', 'Next version')}</span><b>${L('Version ', 'Version ')}${esc(nx.version)}</b><span class="sub">${esc(LANG === 'en' && nx.headliner_en || nx.headliner || '')}</span></div><div class="vn"><b data-cdd="${nx.date}">${Math.max(0, d)}</b><span>${L('jours', 'days')}</span></div><div><span class="ct" data-cd="${nx.date}"></span><br><span class="sub">${nx.estimated ? L('Date estimée, à confirmer', 'Estimated date, to be confirmed') : L('Date confirmée', 'Confirmed date')}</span></div></a>`;
}
function bannerCards() {
  const B = (D.banners && D.banners.list) || [], now = Date.now();
  const Lst = B.filter(b => !b.end || new Date(b.end) > now).sort((x, y) => (x.end ? new Date(x.end) : 9e15) - (y.end ? new Date(y.end) : 9e15));
  window.BNL = Lst;
  if (!Lst.length) return `<p class="sub">${L('Aucune bannière renseignée.', 'No banner listed.')}</p>`;
  return Lst.map((b, bi) => { const up = new Date(b.start) > now; return `<div class="card bn"><div class="bnimg">${b.chars.map(i => byId[i] ? `<a href="#/perso/${i}"><img src="${im('p', i)}" alt="${esc(byId[i].n)}"></a>` : '').join('')}</div><div><span class="tag tg" style="--tc:var(--ac)">${esc(LANG === 'en' && b.kind_en || b.kind)}</span><span class="tag">${up ? L('À venir', 'Upcoming') : L('En cours', 'Ongoing')}</span>
  <h2 style="margin:8px 0 4px">${b.chars.map(i => byId[i] ? esc(byId[i].n) : '').join(' + ')}</h2>
  ${b.lcs.map(i => { const l = lcOf(i); return l ? `<div class="row" style="padding:6px 0"><img src="${im('l', i)}" alt="" style="width:36px;height:36px"><div><b>${esc(l.n)}</b></div></div>` : ''; }).join('')}
  <p class="ct" style="margin:8px 0 2px" ${up ? `data-cd="${b.start}" data-pre="${L('Démarre dans ', 'Starts in ')}"` : b.end ? `data-cd="${b.end}" data-pre="${L('Se termine dans ', 'Ends in ')}"` : ''}>${b.end || up ? '' : L('Sans date de fin annoncée', 'No end date announced')}</p>
  <span class="sub" style="font-size:13px">${fmtD(b.start)} → ${b.end ? fmtD(b.end) : L('non annoncée', 'not announced')}</span>${b.end ? `<div style="margin-top:8px"><button class="btn" data-rem="${bi}">🔔 ${L('Me rappeler 24 h avant la fin', 'Remind me 24h before the end')}</button></div>` : ''}</div></div>`; }).join('');
}
pages.banners = () => {
  const r = (D.banners && D.banners.rateup4) || [];
  return [`<h1>${L('Bannières', 'Banners')}</h1><p class="lead">${L('Les bannières en cours et à venir, avec le temps restant. Heures affichées dans le fuseau de votre appareil.', 'Current and upcoming banners with the time left. Times are shown in your device’s time zone.')}</p>${verBanner()}${sec(L('En cours et à venir', 'Ongoing and upcoming'))}${bannerCards()}${r.length ? sec(L('Personnages 4★ à taux augmenté', 'Boosted 4★ characters')) + `<div class="grid">${r.map(i => byId[i] ? tile(byId[i]) : '').join('')}</div>` : ''}<p class="note">${L('Les dates de bannières viennent de data/banners.json, mis à jour à chaque phase. Sources : Game8, Prydwen et HoYoverse.', 'Banner dates come from data/banners.json, updated each phase. Sources: Game8, Prydwen and HoYoverse.')}</p>`, null, tick];
};
const hue = s => { let h = 0; for (const ch of String(s)) h = (h * 31 + ch.charCodeAt(0)) % 360; return h; };
const avOf = (p, cls = '') => photoOk(p.photo) ? `<img class="av ${cls}" src="${p.photo}" alt="">` : p.avatar && byId[p.avatar] ? `<img class="av ${cls}" src="${im('c', p.avatar)}" alt="">` : `<div class="av ${cls}">${esc((p.display_name || p.handle || '?')[0].toUpperCase())}</div>`;
const cover = p => { const h = hue(p.handle); return `style="--h1:${h};--h2:${(h + 70) % 360}"`; };
pages.community = h => {
  if (!sb) return [`<h1>${L('Communauté', 'Community')}</h1><p class="lead">${L('La communauté nécessite les comptes (Supabase) : renseignez config.js.', 'The community needs accounts (Supabase): fill in config.js.')}</p>`];
  if (h) return [`<div id="cm"><p class="sub">${L('Chargement…', 'Loading…')}</p></div>`, null, () => loadProfile(h)];
  return [`<section class="soc"><div><span class="lab">${L('Réseau des joueurs', 'Player network')}</span><h1>${L('Communauté', 'Community')}</h1><p class="lead">${L('Découvrez les vitrines des autres Trailblazers, aimez leurs profils et partagez le vôtre. Rendez-le public dans Mon profil → Paramètres.', 'Discover other Trailblazers’ showcases, like their profiles and share yours. Make it public in My profile → Settings.')}</p></div><a class="btn pri" href="#/settings">${L('Créer mon profil public', 'Create my public profile')}</a></section>
  <div class="socbar"><input type="search" id="cmq" placeholder="${L('Rechercher un joueur…', 'Search a player…')}" autocomplete="off"><div class="seg"><button class="on" data-cms="new">${L('Récents', 'Recent')}</button><button data-cms="top">${L('Populaires', 'Popular')}</button></div></div>
  <div id="cm" class="feed"><p class="sub">${L('Chargement…', 'Loading…')}</p></div>`, null, async () => {
    const { data, error } = await sb.from('profiles').select('user_id,handle,display_name,avatar,stats,bio,showcase').eq('is_public', true).not('handle', 'is', null).order('updated_at', { ascending: false }).limit(48); if (data) await addPhotos(data);
    const el = $('#cm'); if (!el) return;
    if (error) { el.innerHTML = `<p class="sub">${L('Communauté indisponible : exécutez supabase/schema_v3.sql.', 'Community unavailable: run supabase/schema_v3.sql.')}</p>`; return; }
    const list = data || [], lk = {};
    try { const r = await sb.from('profile_likes').select('profile_id').in('profile_id', list.map(p => p.user_id)); (r.data || []).forEach(x => { lk[x.profile_id] = (lk[x.profile_id] || 0) + 1; }); } catch { }
    let sort = 'new', qq = '';
    const draw = () => {
      let rows = list.filter(p => !qq || (p.handle + ' ' + (p.display_name || '')).toLowerCase().includes(qq));
      if (sort === 'top') rows = rows.slice().sort((a, b) => (lk[b.user_id] || 0) - (lk[a.user_id] || 0));
      el.innerHTML = rows.map(p => { const st = p.stats || {}, sh = (Array.isArray(p.showcase) ? p.showcase : []).filter(s => byId[s.c]).slice(0, 4);
        return `<a class="pcard" href="#/community/${esc(p.handle)}"><div class="pcov" ${cover(p)}></div>${avOf(p, 'pav')}<div class="pbody"><b>${esc(p.display_name || p.handle)}</b><span class="sub">@${esc(p.handle)}</span><p>${esc((p.bio || '').slice(0, 110))}</p>
        <div class="pst"><span>${st.n ?? '—'} ${L('persos', 'chars')}</span><span>${st.n5 ?? '—'} 5★</span><span class="lk">♥ ${lk[p.user_id] || 0}</span></div>
        ${sh.length ? `<div class="psh">${sh.map(s => `<img src="${im('c', s.c)}" alt="" loading="lazy">`).join('')}</div>` : ''}</div></a>`; }).join('') || `<p class="sub">${L('Aucun profil trouvé. Soyez le premier !', 'No profile found. Be the first!')}</p>`;
    };
    draw();
    const qi = $('#cmq'); if (qi) qi.oninput = e => { qq = e.target.value.trim().toLowerCase(); draw(); };
    document.querySelectorAll('[data-cms]').forEach(bt => bt.onclick = () => { sort = bt.dataset.cms; document.querySelectorAll('[data-cms]').forEach(x => x.classList.toggle('on', x === bt)); draw(); });
  }];
};
async function loadProfile(h) {
  const el = $('#cm'); if (!el) return;
  const { data: p } = await sb.from('profiles').select('*').eq('handle', h).eq('is_public', true).maybeSingle();
  if (!p) { el.innerHTML = `<h1>${L('Profil introuvable', 'Profile not found')}</h1><p class="sub">${L('Ce profil n’existe pas ou n’est pas public.', 'This profile does not exist or is not public.')}</p>`; return; }
  viewed = p; const [{ count }, mine] = await Promise.all([sb.from('profile_likes').select('*', { count: 'exact', head: true }).eq('profile_id', p.user_id), user ? sb.from('profile_likes').select('profile_id').eq('profile_id', p.user_id).eq('user_id', user.id) : { data: [] }]);
  const liked = !!(mine.data && mine.data.length), st = p.stats || {};
  const sh = (Array.isArray(p.showcase) ? p.showcase : []).filter(s => byId[s.c]).slice(0, 6);
  const shHtml = sh.length ? `${sec(L('Personnages mis en avant', 'Featured characters'))}<div class="posts">${sh.map(s => { const c = byId[s.c]; return `<article class="post"><a class="pimg" href="#/perso/${c.id}"><img src="${im('p', c.id)}" alt="" loading="lazy"></a><div class="ptx"><b>${esc(c.n)}</b><span class="sub">${eN(c.ei)} · ${pN(c.pi)}</span><p>${esc(s.t || '')}</p><a href="#/perso/${c.id}/build">${L('Voir le build recommandé', 'See the recommended build')} →</a></div></article>`; }).join('')}</div>` : '';
  el.innerHTML = `<a class="back" href="#/community" style="color:var(--ac)">← ${L('Communauté', 'Community')}</a>
  <section class="pp"><div class="pp-cov" ${cover(p)}></div><div class="pp-row">${avOf(p, 'lg')}<div class="pp-id"><h1>${esc(p.display_name || p.handle)}</h1><span class="hdl">@${esc(p.handle)}</span></div><div class="pp-act">${user ? `<button class="btn ${liked ? 'on' : ''}" data-like="1">${liked ? '♥' : '♡'} ${L('J’aime', 'Like')}</button>${p.user_id !== user.id ? `<button class="btn" data-sofr="${esc(p.handle)}">＋ ${L('Ami', 'Friend')}</button>` : ''}<button class="btn" data-report="1" title="${L('Signaler ce profil', 'Report this profile')}">⚑</button>` : `<span class="sub">${L('Connectez-vous pour aimer ce profil', 'Log in to like this profile')}</span>`}</div></div>
  ${p.bio ? `<p class="pp-bio">${esc(p.bio)}</p>` : ''}
  <div class="pp-st"><div><b>${st.n ?? '—'}</b><span>${L('Personnages', 'Characters')}</span></div><div><b>${st.n5 ?? '—'}</b><span>5★</span></div><div><b>${st.e ?? '—'}</b><span>${L('Éidolons', 'Eidolons')}</span></div><div><b>♥ ${count || 0}</b><span>${L('J’aime', 'Likes')}</span></div></div>
  ${isAdmin ? `<div class="pp-adm"><button class="btn" data-adelp="${p.user_id}">${L('Supprimer le profil (admin)', 'Delete profile (admin)')}</button> <button class="btn danger" data-adelu="${p.user_id}">${L('Supprimer le compte (admin)', 'Delete account (admin)')}</button></div>` : ''}</section>
  <div id="pcards"></div>${shHtml}${badgesHtml({ n: st.n, n5: st.n5, e: st.e })}`;
}

// ------------------------------------------------------------ résumé de version
let VER = null;
pages.versions = () => [`<section class="hlp vhero"><span class="lab">${L('Histoire du jeu', 'Game story')}</span><h1>${L('Résumé de version', 'Version recap')}</h1><p class="lead">${L('L’histoire de Honkai: Star Rail, version par version, de la 1.0 à la 4.7. Attention : spoilers.', 'The story of Honkai: Star Rail, version by version, from 1.0 to 4.7. Beware: spoilers.')}</p></section><div id="vr"><p class="sub">${L('Chargement…', 'Loading…')}</p></div>`, null, async () => {
  const el = $('#vr'); if (!el) return;
  if (!VER) { try { VER = await fetch('data/versions.json').then(r => r.json()); } catch { VER = null; } }
  if (!VER) { el.innerHTML = `<p class="sub">${L('Données indisponibles.', 'Data unavailable.')}</p>`; return; }
  let arc = '', spo = store.get('astro_spo', '1') === '1', rev = false;
  const A = Object.fromEntries(VER.arcs.map(a => [a.id, a])), cur = D.version || '';
  const fmt = d => { if (!d) return ''; const p = d.split('-'); return p.length === 3 ? new Date(+p[0], +p[1] - 1, +p[2]).toLocaleDateString(LOC(), { day: 'numeric', month: 'long', year: 'numeric' }) : new Date(+p[0], +p[1] - 1, 1).toLocaleDateString(LOC(), { month: 'long', year: 'numeric' }); };
  const draw = () => {
    const rows = VER.v.filter(v => !arc || v.arc === arc).slice(); if (rev) rows.reverse();
    el.innerHTML = `<div class="vctl"><div class="chips">${[['', L('Tous', 'All')], ...VER.arcs.map(a => [a.id, LANG === 'en' ? a.en : a.fr])].map(a => `<button class="chip ${arc === a[0] ? 'on' : ''}" data-va="${a[0]}">${esc(a[1])}</button>`).join('')}</div><div class="seg"><button class="${spo ? 'on' : ''}" data-vs="1">${L('Spoilers visibles', 'Spoilers shown')}</button><button class="${spo ? '' : 'on'}" data-vs="0">${L('Masqués', 'Hidden')}</button><button class="${rev ? 'on' : ''}" data-vo="1">${rev ? '↑' : '↓'} ${L('Ordre', 'Order')}</button></div></div>
    <p class="sub vnote">${esc(LANG === 'en' ? VER.note_en : VER.note_fr)}</p>
    <div class="vtl">${rows.map(v => { const a = A[v.arc], cp = parseFloat(cur) === parseFloat(v.v), pend = v.up || parseFloat(v.v) > parseFloat(cur), hero = v.hero && byId[v.hero], hid = !spo && !v.up;
      return `<article class="vc2 ${cp ? 'now' : ''}" style="--vc:${a.c}"><div class="vart">${hero ? `<img src="${im('p', v.hero)}" alt="" loading="lazy">` : `<div class="vq">?</div>`}<b class="vbig">${v.v}</b></div>
      <div class="vbody"><div class="vh"><div><span class="varc">${esc(LANG === 'en' ? a.en : a.fr)}</span><h3>${v.t ? esc(v.t) : L('Version ' + v.v, 'Version ' + v.v)}</h3><span class="sub">${L('Version', 'Version')} ${v.v}${v.d ? ' · ' + fmt(v.d) : ''}</span></div><div class="vtg">${cp ? `<span class="tag tg" style="--tc:var(--ac)">${L('Actuelle', 'Current')}</span>` : pend ? `<span class="tag">${L('À venir', 'Upcoming')}</span>` : ''}${v.ok < 2 && !v.up ? `<span class="tag" title="${L('Peu de sources vérifiées', 'Few verified sources')}">${L('approximatif', 'approx.')}</span>` : ''}</div></div>
      <p class="vt ${hid ? 'hid' : ''}">${esc(LANG === 'en' ? v.en : v.fr)}</p>${hid ? `<button class="btn vrv" data-vr="1">${L('Afficher (spoiler)', 'Reveal (spoiler)')}</button>` : ''}
      ${(v.chars && v.chars.length) || (v.cn && v.cn.length) ? `<div class="vch"><span class="lab">${L('Nouveaux personnages', 'New characters')}</span><div class="vtiles">${(v.chars || []).filter(i => byId[i]).map(i => `<a class="vt1" href="#/perso/${i}"><img src="${im('c', i)}" alt="" loading="lazy"><span>${esc(byId[i].n)}</span></a>`).join('')}${(v.cn || []).map(n => `<span class="vt1 nt"><span>${esc(n)}</span></span>`).join('')}</div></div>` : ''}
      ${(LANG === 'en' ? v.ne : v.nf) && (LANG === 'en' ? v.ne : v.nf).length ? `<ul class="vnf">${(LANG === 'en' ? v.ne : v.nf).map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}</div></article>`; }).join('')}</div>`;
    el.querySelectorAll('[data-va]').forEach(b => b.onclick = () => { arc = b.dataset.va; draw(); });
    el.querySelectorAll('[data-vs]').forEach(b => b.onclick = () => { spo = b.dataset.vs === '1'; store.set('astro_spo', spo ? '1' : '0'); draw(); });
    el.querySelectorAll('[data-vo]').forEach(b => b.onclick = () => { rev = !rev; draw(); });
    el.querySelectorAll('[data-vr]').forEach(b => b.onclick = () => { b.closest('.vbody').querySelector('.vt').classList.remove('hid'); b.remove(); });
  };
  draw();
}];

// ------------------------------------------------------------ fiche personnage
function buildView(c) {
  const b = c.b; if (!b) return `<p class="sub">${L('Pas de build disponible.', 'No build available.')}</p>`;
  const slotName = { body: L('Corps', 'Body'), feet: L('Bottes', 'Feet'), sphere: L('Sphère', 'Sphere'), rope: L('Corde', 'Rope') };
  const lc = b.lc && lcOf(b.lc), setRow = (id, f) => { const s = RS.find(x => x.id === id); return s ? row(im('r', id), s.n, esc(f(s))) : ''; };
  const p2 = L('2 pièces : ', '2-piece: '), p4 = L('4 pièces : ', '4-piece: ');
  const rel = (b.rel || []).map(p => p[0] === p[1] ? setRow(p[0], s => p4 + s.d[s.d.length - 1]) : setRow(p[0], s => p2 + s.d[0]) + setRow(p[1], s => p2 + s.d[0])).join('');
  const orn = (b.orn || []).map(i => setRow(i, s => p2 + s.d[0])).join('');
  const teams = (b.teams || []).map(t => { const cp = complete4([{ c: c.id, l: b.lc }, ...t.filter(m => m.c !== c.id)]), mem = cp.mem; return `<div class="team">${mem.map(m => { const x = byId[m.c], l = m.l && lcOf(m.l); return x ? (cp.sug.includes(m.c) ? `<span class="sugt" title="${L('Suggestion du site pour compléter l’équipe à 4', 'Site suggestion to complete the team to 4')}">${tile(x, { sub: L('suggestion', 'suggested') })}</span>` : tile(x, { sub: l ? esc(l.n) : '' })) : ''; }).join('')}${(() => { const e = teamsAll().by.get(mem.map(m => m.c).sort().join('-')); return e ? `<span class="tag tg" style="--tc:var(${TV[tkey(e, 'ov')]})" title="${L('Rang dans la tier list des équipes', 'Rank in the team tier list')}">${TN[tkey(e, 'ov')]} · #${e.rk.ov}</span>` : ''; })()}<a class="btn" style="margin-left:auto" href="#/team/${mem.map(m => m.c + '-' + (m.l || '')).join('_')}">${L('Ouvrir', 'Open')}</a></div>`; }).join('');
  const src = b.curated ? L('Sets et équipes vérifiés à la main.', 'Sets and teams checked by hand.') : b.fallback ? L('Sets indicatifs : les plus utilisés par les personnages de la même voie.', 'Indicative sets: the most used by characters of the same path.') : L('Données communautaires HSR Optimizer.', 'Community data from HSR Optimizer.');
  return `<div class="g">${gearHtml(c, b, lc)}
  <div class="card"><h2>${L('Stats à viser', 'Target stats')}</h2><div class="tw"><table><tr><th>${L('Pièce', 'Piece')}</th><th>${L('Stat principale', 'Main stat')}</th></tr>${Object.keys(slotName).map(k => `<tr><td>${slotName[k]}</td><td>${esc((b.parts[k] || []).map(stx).join(' / ') || '—')}</td></tr>`).join('')}</table></div><p class="lab" style="margin:14px 0 6px">${L('Sous-stats par priorité', 'Substats by priority')}</p>${(b.subs || []).map((s, i) => `<span class="pill">${i + 1}. ${esc(stx(s))}</span>`).join('')}</div></div>
  ${sec(L('Équipes conseillées', 'Recommended teams'))}${teams || `<p class="sub">${L('Pas d’équipe renseignée pour l’instant.', 'No team listed yet.')}</p>`}${calcTeamsHtml(c)}${b.teams_from_others ? `<p class="note" style="margin-top:0">${L('Équipes tirées des builds d’autres personnages où celui-ci apparaît.', 'Teams taken from other characters’ builds where this one appears.')}</p>` : ''}<p class="note">${src} ${L('À adapter à vos pièces et à votre équipe.', 'Adapt to your pieces and your team.')}</p>`;
}
function detail(id, tab) {
  const c = byId[id]; if (!c) return pages.notfound(); tab = tab || 'kit'; document.title = c.n + ' — Astrolabe';
  const f = (l, v) => `<div><dt>${l}</dt><dd>${v}</dd></div>`, s = c.st;
  const tabs = [['kit', L('Kit', 'Kit'), 'info'], ['stats', L('Stats', 'Stats'), 'chart'], ['build', L('Build', 'Build'), 'cone'], ['teams', L('Équipes classées', 'Ranked teams'), 'team'], ['dmg', L('Dégâts', 'Damage'), 'calc'], ['rank', L('Classements', 'Rankings'), 'end'], ['eid', L('Éidolons', 'Eidolons'), 'star']];
  const R = { ov: L('Vue d’ensemble', 'Overview'), dps: L('Rôle DPS', 'DPS role'), support: L('Rôle Support', 'Support role'), sustain: L('Rôle Sustain', 'Sustain role'), moc: 'Memory of Chaos', pf: 'Pure Fiction', as: 'Apocalyptic Shadow' };
  let body = '';
  if (tab === 'kit') body = `${sec(L('Compétences', 'Skills'))}<div class="card">${c.s.map((k, i) => { const n = (k.pa || []).length, dl = Math.min(n, k.t === 'ATQ normale' ? 6 : 10); return `<div class="sk"><small>${L(k.t, SKT[k.t] || k.t)}</small><b>${esc(k.n)}</b>${n > 1 ? `<div class="lvl"><label class="lab">${L('Niveau', 'Level')} <b id="sl${i}">${dl}</b></label><input type="range" data-skl="${i}" min="1" max="${n}" value="${dl}"></div>` : ''}<p id="st${i}">${skTxt(k, n > 1 ? dl : 1)}</p></div>`; }).join('')}</div>`;
  else if (tab === 'stats') body = statsTab(c);
  else if (tab === 'teams') body = charTeams(c);
  else if (tab === 'dmg') body = dmgTab(c);
  else if (tab === 'build') body = buildView(c);
  else if (tab === 'rank') body = `${sec(L('Classements (Game8)', 'Rankings (Game8)'))}<div class="card tw"><table><tr><th>${L('Classement', 'Ranking')}</th><th>Tier</th></tr>${Object.keys(R).map(k => `<tr><td>${R[k]}</td><td>${c.tr[k] ? tchip(c.tr[k]) : '<span class="sub">—</span>'}${trendOf(k, c.id) ? ` <i class="tr ${trendOf(k, c.id)}">${{ up: '▲', down: '▼', new: 'NEW' }[trendOf(k, c.id)]}</i>` : ''}</td></tr>`).join('')}</table></div>`;
  else body = `${sec(L('Éidolons', 'Eidolons'))}<div class="card">${c.x.map((k, i) => `<div class="sk"><small>E${i + 1}</small><b>${esc(k.n)}</b><p>${esc(k.d)}</p></div>`).join('')}</div>`;
  return [`<div class="hero"><img src="${im('p', c.id)}" alt="${esc(c.n)}"><div><h1>${esc(c.n)}</h1><span class="tag">${'★'.repeat(c.r)}</span><span class="tag etag" style="color:${eC(c.ei)};border-color:${eC(c.ei)}">${eiImg(c.ei)} ${eN(c.ei)}</span><span class="tag etag">${piImg(c.pi)} ${pN(c.pi)}</span>${tchip(c.t)}
  <p class="sub" style="max-width:560px">${L('Tier ' + c.t + ' en vue d’ensemble. ', 'Tier ' + c.t + ' overall. ')}${c.tr.dps ? L('Rôle DPS : ', 'DPS role: ') + c.tr.dps + '. ' : ''}${c.tr.support ? L('Rôle Support : ', 'Support role: ') + c.tr.support + '. ' : ''}${c.tr.sustain ? L('Rôle Sustain : ', 'Sustain role: ') + c.tr.sustain + '.' : ''}</p>
  <div style="display:flex;gap:8px;flex-wrap:wrap">${star('char', c.id, L('Personnage favori', 'Favourite character'))}${star('build', c.id, L('Build favori', 'Favourite build'))}<a class="btn" href="#/compare/${c.id}">${L('Comparer', 'Compare')}</a><a class="btn" href="#/calc/${c.id}">${L('Calculer les matériaux', 'Materials')}</a></div></div></div>
  <div class="bigtabs c7">${tabs.map(t => `<a class="${tab === t[0] ? 'on' : ''}" href="#/perso/${id}/${t[0]}">${ico(t[2])}${t[1]}</a>`).join('')}</div><div class="fade">${body}</div>`, null, () => hookDetail(c, tab)];
}

// ------------------------------------------------------------ sécurité du compte : Discord, double authentification, suppression
let M = { en: null, msg: '' };
async function mfaNeeded() {
  if (!sb || !user || !sb.auth.mfa) return false;
  try { const { data } = await sb.auth.mfa.getAuthenticatorAssuranceLevel(); return !!(data && data.nextLevel === 'aal2' && data.currentLevel !== 'aal2'); } catch { return false; }
}
function showMfa() { const d = $('#dlg'); if (!d) return; d.classList.add('mfa'); $('#mfab').hidden = false; $('#msg').textContent = ''; if (!d.open) d.showModal(); setTimeout(() => $('#mfc') && $('#mfc').focus(), 50); }
function endMfa() { const d = $('#dlg'); if (!d) return; d.classList.remove('mfa'); const b = $('#mfab'); if (b) b.hidden = true; }
async function mfaGate() { if (await mfaNeeded()) { showMfa(); return true; } return false; }
async function mfaVerify() {
  const code = ($('#mfc').value || '').replace(/\s/g, ''); if (code.length < 6) { authMsg(L('Entrez le code à 6 chiffres.', 'Enter the 6-digit code.')); return; }
  const f = await sb.auth.mfa.listFactors(), fac = f.data && f.data.totp && f.data.totp[0]; if (!fac) { authMsg(L('Aucun facteur trouvé.', 'No factor found.')); return; }
  const { error } = await sb.auth.mfa.challengeAndVerify({ factorId: fac.id, code });
  if (error) { authMsg(L('Code incorrect.', 'Wrong code.')); return; }
  $('#mfc').value = ''; endMfa(); $('#dlg').close(); pullAll();
}
async function mfaDraw() {
  const el = $('#sec2fa'); if (!el) return;
  if (!(sb && user && sb.auth.mfa)) { el.innerHTML = `<p class="sub">${L('Connectez-vous pour activer la double authentification.', 'Log in to enable two-factor authentication.')}</p>`; return; }
  const prov = (user.app_metadata && user.app_metadata.providers) || [user.app_metadata && user.app_metadata.provider || 'email'], hasD = prov.includes('discord');
  const acc = `<p><b>${L('Connexion', 'Sign-in')}</b> : ${prov.map(p => p === 'email' ? L('e-mail + mot de passe', 'e-mail + password') : p[0].toUpperCase() + p.slice(1)).join(', ')} ${hasD || !USE_DISCORD ? '' : `<button class="btn dsc2" id="lkdc">${L('Lier mon compte Discord', 'Link my Discord account')}</button>`} <button class="btn" id="out2">${L('Me déconnecter', 'Log out')}</button></p><p class="sub" id="lkmsg"></p><hr style="border:0;border-top:1px solid var(--bd);margin:12px 0">`;
  const r = await sb.auth.mfa.listFactors(), all = (r.data && r.data.all) || [], on = all.filter(x => x.status === 'verified' && x.factor_type === 'totp');
  el.innerHTML = acc + (on.length ? `<p>✅ ${L('Double authentification activée : un code vous sera demandé à chaque connexion.', 'Two-factor authentication is on: a code is asked at each login.')}</p><button class="btn" id="mfoff" data-fid="${on[0].id}">${L('Désactiver', 'Turn off')}</button>`
    : M.en ? `<p class="sub">${L('1. Scannez ce QR code avec une application (Google Authenticator, Authy, 2FAS…). 2. Entrez le code à 6 chiffres affiché.', '1. Scan this QR code with an app (Google Authenticator, Authy, 2FAS…). 2. Enter the 6-digit code shown.')}</p><img class="qr" src="${esc(M.en.qr)}" alt="QR" width="168" height="168"><p class="sub">${L('Ou saisissez cette clé : ', 'Or enter this key: ')}<code>${esc(M.en.secret)}</code></p><div style="display:flex;gap:8px;flex-wrap:wrap"><input id="mfe" inputmode="numeric" maxlength="6" placeholder="123456" style="max-width:160px;margin:0"><button class="btn pri" id="mfok">${L('Confirmer', 'Confirm')}</button><button class="btn" id="mfno">${L('Annuler', 'Cancel')}</button></div>`
      : `<p class="sub">${L('Ajoute une protection : en plus du mot de passe, un code à 6 chiffres temporaire est demandé.', 'Adds protection: on top of the password, a temporary 6-digit code is required.')}</p><button class="btn" id="mfon">${L('Activer la double authentification', 'Enable two-factor authentication')}</button>`);
  el.innerHTML += `<p class="sub" id="mfmsg">${esc(M.msg)}</p>`;
}
async function mfaClick(id, b) {
  M.msg = '';
  if (id === 'mfon') {
    const old = ((await sb.auth.mfa.listFactors()).data || {}).all || []; for (const x of old) if (x.status !== 'verified') await sb.auth.mfa.unenroll({ factorId: x.id });
    const { data, error } = await sb.auth.mfa.enroll({ factorType: 'totp', friendlyName: 'Astrolabe ' + Date.now() });
    if (error) M.msg = L('Impossible : activez la double authentification dans Supabase (Authentication → Multi-Factor). ', 'Not possible: enable MFA in Supabase (Authentication → Multi-Factor). ') + error.message; else M.en = { id: data.id, qr: data.totp.qr_code, secret: data.totp.secret };
  } else if (id === 'mfok') {
    const code = ($('#mfe').value || '').replace(/\s/g, ''), { error } = await sb.auth.mfa.challengeAndVerify({ factorId: M.en.id, code });
    if (error) M.msg = L('Code incorrect, réessayez.', 'Wrong code, try again.'); else { M.en = null; M.msg = L('Double authentification activée.', 'Two-factor authentication enabled.'); }
  } else if (id === 'mfno') { if (M.en) await sb.auth.mfa.unenroll({ factorId: M.en.id }); M.en = null; }
  else if (id === 'mfoff') { const { error } = await sb.auth.mfa.unenroll({ factorId: b.dataset.fid }); M.msg = error ? error.message : L('Double authentification désactivée.', 'Two-factor authentication turned off.'); }
  mfaDraw();
}
async function delProfile() {
  if (!(sb && user) || !confirm(L('Supprimer votre profil public (pseudo, bio, vitrine, J’aime) ? Votre compte et votre collection restent.', 'Delete your public profile (name, bio, showcase, likes)? Your account and collection stay.'))) return;
  const { error } = await sb.from('profiles').delete().eq('user_id', user.id);
  if (error) { pmsg = L('Échec : exécutez supabase/schema_v5.sql. (', 'Failed: run supabase/schema_v5.sql. (') + error.message + ')'; render(); return; }
  prof.handle = ''; prof.bio = ''; prof.pub = false; prof.show = []; prof.name = ''; prof.avatar = ''; prof.photo = ''; store.set('astro_prof', prof); pmsg = L('Profil public supprimé.', 'Public profile deleted.'); render();
}
async function delAccount() {
  if (!(sb && user)) return;
  const w = L('SUPPRIMER', 'DELETE');
  if ((prompt(L('Cette action est définitive : compte, profil, favoris, collection et équipes seront effacés. Tapez ' + w + ' pour confirmer.', 'This is permanent: account, profile, favourites, collection and teams will be erased. Type ' + w + ' to confirm.')) || '').trim() !== w) return;
  const { error } = await sb.rpc('delete_my_account');
  if (error) { pmsg = L('Échec : exécutez supabase/schema_v5.sql. (', 'Failed: run supabase/schema_v5.sql. (') + error.message + ')'; render(); return; }
  ['astro_prof', 'astro_fav', 'astro_teams'].forEach(k => localStorage.removeItem(k)); prof = { name: '', avatar: '', photo: '', col: {}, handle: '', bio: '', pub: false, show: [] }; fav = { char: [], build: [] }; myTeams = [];
  await sb.auth.signOut(); location.hash = '#/home'; alert(L('Votre compte a été supprimé.', 'Your account has been deleted.'));
}

async function linkDiscord() {
  const { error } = await sb.auth.linkIdentity({ provider: 'discord', options: { redirectTo: location.href.split('#')[0] } });
  const m = $('#lkmsg'); if (error && m) m.textContent = L('Impossible : activez Discord et « Manual linking » dans Supabase. ', 'Not possible: enable Discord and “Manual linking” in Supabase. ') + error.message;
}

// ------------------------------------------------------------ tier list des équipes (calculée) + outils de fiche personnage
let TT_C = null;
const tval = (c, m) => { const t = (c.tr && (c.tr[m] || c.tr.ov)) || c.t, i = TIERS.indexOf(t); return i < 0 ? 1 : 5 - i; };
const tkey = (e, m) => { const q = e.rk[m] / teamsAll().list.length; return q <= .1 ? 'SS' : q <= .3 ? 'S+' : q <= .6 ? 'S' : q <= .85 ? 'A' : 'B'; };
let RAW4 = null;
function complete4(mem) {
  const sug = [], ids = mem.map(m => m.c);
  if (ids.length >= 4) return { mem: mem.slice(0, 4), sug };
  if (!RAW4) { RAW4 = []; C.forEach(c => ((c.b || {}).teams || []).forEach(t => { const m = [c.id, ...t.map(x => x.c).filter(x => x !== c.id)]; if (m.length === 4) RAW4.push(m); })); }
  const sup = RAW4.find(m => ids.every(i => m.includes(i)));
  if (sup) sup.filter(i => !ids.includes(i)).forEach(i => { if (byId[i] && ids.length < 4) { ids.push(i); sug.push(i); } });
  ['sustain', 'support'].forEach(role => {
    while (ids.length < 4) {
      const cand = C.filter(c => !ids.includes(c.id) && c.tr && c.tr[role]).sort((a, b) => tval(b, role) - tval(a, role) || a.n.localeCompare(b.n))[0];
      if (!cand || (role === 'support' && false)) break; ids.push(cand.id); sug.push(cand.id);
      if (role === 'sustain') break;
    }
  });
  const out = ids.map(i => mem.find(m => m.c === i) || { c: i, l: '' });
  return { mem: out, sug };
}
function teamsAll() {
  if (TT_C) return TT_C;
  const map = new Map();
  C.forEach(c => ((c.b || {}).teams || []).forEach(t => {
    let mem = [{ c: c.id, l: c.b.lc }, ...t.filter(m => m.c !== c.id)]; if (mem.length < 2 || mem.length > 4 || mem.some(m => !byId[m.c])) return;
    const raw = mem.length, cp = complete4(mem); mem = cp.mem; if (mem.length < 4) return;
    const key = mem.map(m => m.c).sort().join('-'); let e = map.get(key);
    if (!e) { e = { key, ids: mem.map(m => m.c), lcs: {}, votes: new Set(), sug: cp.sug.slice(), raw }; map.set(key, e); }
    else { e.sug = e.sug.filter(i => cp.sug.includes(i)); e.raw = Math.max(e.raw, raw); }
    e.votes.add(c.id); mem.forEach(m => { if (m.l && !e.lcs[m.c]) e.lcs[m.c] = m.l; }); if (c.b.lc) e.lcs[c.id] = c.b.lc;
  }));
  C.forEach(c => calcTeams(c.id).slice(0, 2).forEach(o => { const ids = o.ms.map(m => m.id), key = [...ids].sort().join('-'); let e = map.get(key); if (e) { e.votes.add(c.id); return; } map.set(key, { key, ids, lcs: {}, votes: new Set([c.id]), sug: [], raw: 4, calc: true }); }));
  const list = [...map.values()].map(e => { e.v = e.votes.size; e.sc = {}; ['ov', 'moc', 'pf', 'as'].forEach(m => { const avg = e.ids.reduce((s, i) => s + tval(byId[i], m), 0) / e.ids.length; e.sc[m] = avg + 0.15 * (e.v - 1); }); return e; });
  const ranks = {}; ['ov', 'moc', 'pf', 'as'].forEach(m => { const o = [...list].sort((a, b) => b.sc[m] - a.sc[m] || b.v - a.v || a.key.localeCompare(b.key)); o.forEach((e, i) => { (e.rk = e.rk || {})[m] = i + 1; }); ranks[m] = o; });
  TT_C = { list, ranks, by: new Map(list.map(e => [e.key, e])) }; return TT_C;
}
const teamHref = e => '#/team/' + e.ids.map(i => i + '-' + (e.lcs[i] || '')).join('_');
function teamRow(e, m) {
  const k = tkey(e, m);
  return `<div class="team trk"><span class="rkn">#${e.rk[m]}</span>${e.calc && e.raw === 4 && !e.fromOpt ? `<span class="tag" title="${L('Équipe calculée par le site (synergie des kits)', 'Team calculated by the site (kit synergy)')}">${L('calculée', 'calc.')}</span>` : ''}<span class="tag tg" style="--tc:var(${TV[k]})">${TN[k]}</span>${e.ids.map(i => e.sug.includes(i) ? `<span class="sugt" title="${L('Suggestion du site', 'Site suggestion')}">${tile(byId[i], { s: 1 })}</span>` : tile(byId[i], { s: 1 })).join('')}<span class="trs"><b>${e.sc[m].toFixed(2)}</b><small>${L('Conseillée par ' + e.v + ' perso', 'Recommended by ' + e.v + ' char.')}</small></span><a class="btn" href="${teamHref(e)}">${L('Ouvrir', 'Open')}</a></div>`;
}
pages.teamtier = () => [`<section class="hlp"><span class="lab">${L('Classement calculé', 'Computed ranking')}</span><h1>${L('Tier list des équipes', 'Team tier list')}</h1><p class="lead">${L('Les équipes conseillées par HSR Optimizer, classées d’après la tier list Game8 de leurs membres dans le mode choisi, avec un petit bonus quand plusieurs personnages recommandent la même équipe.', 'Teams recommended by HSR Optimizer, ranked from their members’ Game8 tiers in the chosen mode, with a small bonus when several characters recommend the same team.')}</p></section>
  <div class="card note2"><b>${L('À savoir', 'Good to know')}</b> ${L('Ce classement est calculé par le site : ce n’est pas le « Top équipes » de Prydwen ni de Game8 (je n’ai pas accès à leurs classements d’équipes). Les équipes à moins de 4 persos chez HSR Optimizer sont complétées par une suggestion du site (case en pointillés). Il reflète la force des membres, pas la synergie réelle. Score = moyenne des tiers (T0 = 5 … T4 = 0) + 0,15 par recommandation supplémentaire. Le rang T est relatif : T0 = les 10 % meilleures équipes, T0.5 = les 20 % suivantes, T1 = 30 %, T2 = 25 %, T3 = le reste.', 'This ranking is computed by the site: it is not Prydwen’s or Game8’s “Top teams” (their team rankings are not accessible to me). Teams with fewer than 4 characters at HSR Optimizer are completed with a site suggestion (dashed tile). It reflects member strength, not real synergy. Score = average tier (T0 = 5 … T4 = 0) + 0.15 per extra recommendation. The T rank is relative: T0 = top 10% of teams, T0.5 = next 20%, T1 = 30%, T2 = 25%, T3 = the rest.')}</div>
  <div id="tt"></div>`, null, () => {
  const el = $('#tt'); if (!el) return; const T = teamsAll(), st = { m: 'ov', c: '', n: 30 }, sorted = [...C].sort((a, b) => a.n.localeCompare(b.n));
  const MD = [['ov', L('Vue d’ensemble', 'Overview')], ['moc', 'Memory of Chaos'], ['pf', 'Pure Fiction'], ['as', 'Apocalyptic Shadow']];
  const draw = () => {
    let rows = T.ranks[st.m].filter(e => !st.c || e.ids.includes(st.c)); const tot = rows.length; rows = rows.slice(0, st.n);
    el.innerHTML = `<div class="vctl"><div class="chips">${MD.map(x => `<button class="chip ${st.m === x[0] ? 'on' : ''}" data-ttm="${x[0]}">${x[1]}</button>`).join('')}</div><select id="ttc"><option value="">${L('Tous les personnages', 'All characters')}</option>${sorted.map(c => `<option value="${c.id}" ${st.c === c.id ? 'selected' : ''}>${esc(c.n)}</option>`).join('')}</select></div>
    <p class="sub">${tot} ${L('équipes', 'teams')}${st.c ? ' · ' + esc(byId[st.c].n) : ''}</p><div class="tlist">${rows.map(e => teamRow(e, st.m)).join('') || `<p class="sub">${L('Aucune équipe.', 'No team.')}</p>`}</div>${tot > st.n ? `<button class="btn" data-ttn="1">${L('Voir plus', 'Show more')}</button>` : ''}`;
    el.querySelectorAll('[data-ttm]').forEach(b => b.onclick = () => { st.m = b.dataset.ttm; st.n = 30; draw(); });
    const sc = $('#ttc'); sc.onchange = () => { st.c = sc.value; st.n = 30; draw(); };
    const mo = el.querySelector('[data-ttn]'); if (mo) mo.onclick = () => { st.n += 30; draw(); };
  };
  draw();
}];
function charTeams(c) {
  const T = teamsAll(), rows = T.list.filter(e => e.ids.includes(c.id)).sort((a, b) => a.rk.ov - b.rk.ov);
  if (!rows.length) return `<p class="sub">${L('Aucune équipe renseignée pour ce personnage.', 'No team listed for this character.')}</p>`;
  return `<p class="sub">${L('Équipes (conseillées par ce personnage ou par d’autres) où il apparaît, classées sur la vue d’ensemble. Le rang est sur ', 'Teams (recommended by this character or by others) where it appears, ranked on the overview. Rank is out of ')}${T.list.length}.</p><div class="tlist">${rows.map(e => `<div class="team trk"><span class="rkn">#${e.rk.ov}</span><span class="tag tg" style="--tc:var(${TV[tkey(e, 'ov')]})">${TN[tkey(e, 'ov')]}</span>${e.ids.map(i => e.sug.includes(i) ? `<span class="sugt" title="${L('Suggestion du site', 'Site suggestion')}">${tile(byId[i], { s: 1 })}</span>` : tile(byId[i], { s: 1 })).join('')}<span class="trs"><b>${e.sc.ov.toFixed(2)}</b><small>MoC ${TN[tkey(e, 'moc')]} · PF ${TN[tkey(e, 'pf')]} · AS ${TN[tkey(e, 'as')]}</small></span><a class="btn" href="${teamHref(e)}">${L('Ouvrir', 'Open')}</a></div>`).join('')}</div><p class="sub"><a href="#/teamtier">${L('Voir toute la tier list des équipes', 'See the full team tier list')} →</a></p>`;
}
// valeurs de compétence par niveau (données StarRailRes)
const pfmt = (v, pct) => pct ? '%g'.replace('%g', String(+(v * 100).toFixed(2))) + '%' : String(+v.toFixed(2));
function skTxt(k, lv) {
  const row = (k.pa || [])[Math.min(lv, (k.pa || []).length) - 1] || []; if (!k.f) return esc(k.d);
  return esc(k.f).replace(/#(\d)\[(?:i|f\d)\](%?)/g, (_, n, p) => row[n - 1] != null ? `<b class="v">${pfmt(row[n - 1], p)}</b>` : '?');
}
const pcts = k => { const o = []; (k.f || '').replace(/#(\d)\[(?:i|f\d)\]%/g, (m, n, off) => { if (!o.some(x => x.n === +n)) o.push({ n: +n, ctx: (k.f.slice(Math.max(0, off - 48), off).replace(/#\d\[[^\]]+\]%?/g, '…')).trim() }); return m; }); return o; };
const statAt = (c, L_, asc) => { const a = L_ <= 20 ? 0 : L_ <= 30 ? 1 : L_ <= 40 ? 2 : L_ <= 50 ? 3 : L_ <= 60 ? 4 : L_ <= 70 ? 5 : 6, b = Math.min(6, a + (asc && [20, 30, 40, 50, 60, 70].includes(L_) ? 1 : 0)), g = (j) => c.lv[b * 3 + j]; return [0, 1, 2].map(j => Math.round(g(j)[0] + g(j)[1] * (L_ - 1))); };
function statsTab(c) {
  const rk = (key, v) => { const arr = C.map(x => key === 'spd' ? x.st.spd : x.st[key]).sort((a, b) => b - a); return arr.indexOf(v) + 1; };
  const [h, a, d] = statAt(c, 80, true);
  return `${sec(L('Statistiques de base par niveau', 'Base stats by level'))}<div class="card"><div class="lvl"><label class="lab" for="slv">${L('Niveau', 'Level')} <b id="lvv">80</b></label><input type="range" id="slv" min="1" max="80" value="80"><label class="chk"><input type="checkbox" id="sasc" checked> ${L('Ascension faite (aux paliers 20, 30…)', 'Ascended (at 20, 30…)')}</label></div>
  <dl id="stl" class="stl"><div><dt>${L('PV', 'HP')}</dt><dd id="s0">${h}</dd></div><div><dt>${L('ATQ', 'ATK')}</dt><dd id="s1">${a}</dd></div><div><dt>${L('DÉF', 'DEF')}</dt><dd id="s2">${d}</dd></div><div><dt>${L('VIT', 'SPD')}</dt><dd>${c.st.spd}</dd></div><div><dt>${L('Taux crit', 'CRIT Rate')}</dt><dd>${c.st.cr}%</dd></div><div><dt>${L('DGT crit', 'CRIT DMG')}</dt><dd>${c.st.cd}%</dd></div><div><dt>Aggro</dt><dd>${c.st.ta}</dd></div><div><dt>${L('Énergie', 'Energy')}</dt><dd>${c.st.sp}</dd></div></dl>
  <p class="sub">${L('Valeurs de base du personnage seul : sans cône de lumière, reliques ni traces.', 'The character’s own base values: without light cone, relics or traces.')}</p></div>
  ${sec(L('Comparaison avec les autres personnages (niveau 80)', 'Compared with other characters (level 80)'))}<div class="card tw"><table><tr><th>${L('Stat', 'Stat')}</th><th>${L('Valeur', 'Value')}</th><th>${L('Rang', 'Rank')}</th></tr>${[['hp', L('PV', 'HP')], ['atk', L('ATQ', 'ATK')], ['def', L('DÉF', 'DEF')], ['spd', L('VIT', 'SPD')]].map(([k, l]) => `<tr><td>${l}</td><td>${c.st[k]}</td><td>#${rk(k, c.st[k])} / ${C.length}</td></tr>`).join('')}</table></div>`;
}
function dmgTab(c) {
  const sk = c.s.filter(k => (k.pa || []).length && pcts(k).length);
  if (!sk.length) return `<p class="sub">${L('Pas de multiplicateur exploitable pour ce personnage.', 'No usable multiplier for this character.')}</p>`;
  return `${sec(L('Simulateur de dégâts d’un coup', 'Single-hit damage calculator'))}<div class="card"><p class="sub" style="margin-top:0">${L('Choisissez une compétence, son niveau et la valeur à tester (multiplicateur de la description). Les chiffres viennent du jeu ; le reste, c’est vous qui le fixez. Estimation d’un coup, pas une simulation de combat complète.', 'Pick a skill, its level and the value to test (a multiplier from the description). Figures come from the game; the rest is up to you. A single-hit estimate, not a full combat simulation.')}</p>
  <div class="dgrid"><div><label class="lab">${L('Compétence', 'Skill')}</label><select id="dsk">${sk.map((k, i) => `<option value="${i}">${esc(k.n)} (${L(k.t, SKT[k.t] || k.t)})</option>`).join('')}</select></div><div><label class="lab">${L('Niveau', 'Level')} <b id="dlv">6</b></label><input type="range" id="dlr" min="1" max="10" value="6"></div><div class="dwide"><label class="lab">${L('Valeur à utiliser', 'Value to use')}</label><select id="dpm"></select></div>
  <div><label class="lab">${L('Multiplicateur (% de l’ATQ)', 'Multiplier (% of ATK)')}</label><input type="number" id="dmu" step="0.1"></div><div><label class="lab">${L('ATQ totale', 'Total ATK')}</label><input type="number" id="dat" value="${statAt(c, 80, true)[1] + 700}"></div><div><label class="lab">${L('Bonus de DGT %', 'DMG boost %')}</label><input type="number" id="dbo" value="40"></div><div><label class="lab">${L('Taux crit %', 'CRIT Rate %')}</label><input type="number" id="dcr" value="70"></div><div><label class="lab">${L('DGT crit %', 'CRIT DMG %')}</label><input type="number" id="dcd" value="150"></div><div><label class="lab">${L('Niveau ennemi', 'Enemy level')}</label><input type="number" id="del" value="95"></div><div><label class="lab">${L('Réduction DÉF %', 'DEF reduction %')}</label><input type="number" id="dde" value="0"></div><div><label class="lab">${L('RÉS ennemie %', 'Enemy RES %')}</label><input type="number" id="dre" value="20"></div><div><label class="lab">${L('Vulnérabilité %', 'Vulnerability %')}</label><input type="number" id="dvu" value="0"></div></div>
  <label class="chk"><input type="checkbox" id="dbr"> ${L('Ennemi en état de rupture (pas de réduction de 10 %)', 'Enemy broken (no 10% reduction)')}</label>
  <div class="dres"><div><span class="lab">${L('Coup sans crit', 'Non-crit hit')}</span><b id="r0">—</b></div><div><span class="lab">${L('Coup critique', 'Crit hit')}</span><b id="r1">—</b></div><div><span class="lab">${L('Moyenne', 'Average')}</span><b id="r2">—</b></div></div>
  <p class="sub">${L('Formule : ATQ × multiplicateur × (1 + bonus DGT) × (1 + vulnérabilité) × facteur DÉF × (1 − RÉS) × 0,9 si non brisé × (1 + DGT crit) en cas de crit. Facteur DÉF = (niveau perso + 20) / [(niveau ennemi + 20) × (1 − réduction) + niveau perso + 20], niveau perso = 80.', 'Formula: ATK × multiplier × (1 + DMG boost) × (1 + vulnerability) × DEF factor × (1 − RES) × 0.9 if not broken × (1 + CRIT DMG) on crit. DEF factor = (char level + 20) / [(enemy level + 20) × (1 − reduction) + char level + 20], char level = 80.')}</p></div>`;
}
function hookDetail(c, tab) {
  if (tab === 'kit') document.querySelectorAll('[data-skl]').forEach(r => r.oninput = () => { const k = c.s[+r.dataset.skl], lv = +r.value; $('#sl' + r.dataset.skl).textContent = lv; $('#st' + r.dataset.skl).innerHTML = skTxt(k, lv); });
  if (tab === 'stats') { const f = () => { const lv = +$('#slv').value, s = statAt(c, lv, $('#sasc').checked); $('#lvv').textContent = lv; [0, 1, 2].forEach(i => $('#s' + i).textContent = s[i]); }; $('#slv').oninput = f; $('#sasc').onchange = f; }
  if (tab === 'dmg') {
    const sk = c.s.filter(k => (k.pa || []).length && pcts(k).length); if (!sk.length) return;
    const g = i => +$('#' + i).value || 0, cur = () => sk[+$('#dsk').value];
    const calc = () => { const mu = g('dmu') / 100, base = g('dat') * mu * (1 + g('dbo') / 100) * (1 + g('dvu') / 100), df = 100 / ((g('del') + 20) * (1 - g('dde') / 100) + 100), rs = 1 - g('dre') / 100, br = $('#dbr').checked ? 1 : 0.9, nc = base * df * rs * br, cr = nc * (1 + g('dcd') / 100), av = nc * (1 + Math.min(1, g('dcr') / 100) * g('dcd') / 100), f = v => Math.round(v).toLocaleString(LOC()); $('#r0').textContent = f(nc); $('#r1').textContent = f(cr); $('#r2').textContent = f(av); };
    const setVal = () => { const k = cur(), p = pcts(k)[+$('#dpm').value || 0], row = k.pa[Math.min(+$('#dlr').value, k.pa.length) - 1]; $('#dmu').value = +(row[p.n - 1] * 100).toFixed(2); calc(); };
    const setSkill = () => { const k = cur(), mx = k.pa.length; const r = $('#dlr'); r.max = mx; r.value = Math.min(+r.value, mx); $('#dlv').textContent = r.value; $('#dpm').innerHTML = pcts(k).map((p, i) => `<option value="${i}">${esc(p.ctx.slice(-44))} #${p.n}</option>`).join(''); setVal(); };
    $('#dsk').onchange = () => { $('#dlr').value = cur().t === 'ATQ normale' ? 6 : 10; setSkill(); }; $('#dlr').oninput = () => { $('#dlv').textContent = $('#dlr').value; setVal(); }; $('#dpm').onchange = setVal;
    document.querySelectorAll('#app input[type=number],#dbr').forEach(i => i.oninput = calc); $('#dbr').onchange = calc; $('#dlr').value = cur().t === 'ATQ normale' ? 6 : 10; setSkill();
  }
}

// ------------------------------------------------------------ page Paramètres (préférences + compte)
function setPref(k, v) {
  if (k === 'lang') { setLang(v); return; }
  if (k === 'te') { TE = v; store.set('astro_te', v); render(); return; }
  if (k === 'ts') { TS = v; store.set('astro_ts', v); render(); return; }
  if (k === 'spo') { store.set('astro_spo', v); render(); return; }
  PREF[k] = v; store.set('astro_pref', PREF); applyPrefs(); if (k === 'tl' || k === 'tz') chrome(); render();
}
function exportData() {
  const o = {}; Object.keys(localStorage).filter(k => k.startsWith('astro_')).forEach(k => { try { o[k] = JSON.parse(localStorage.getItem(k)); } catch { o[k] = localStorage.getItem(k); } });
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(o, null, 1)], { type: 'application/json' })); a.download = 'astrolabe-donnees.json'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
function importData(file) {
  const r = new FileReader(); r.onload = () => { try { const o = JSON.parse(r.result); Object.keys(o).filter(k => k.startsWith('astro_')).forEach(k => store.set(k, o[k])); alert(L('Données importées. La page va se recharger.', 'Data imported. The page will reload.')); location.reload(); } catch { alert(L('Fichier invalide.', 'Invalid file.')); } }; r.readAsText(file);
}
pages.settings = () => {
  const seg = (k, cur, opts, lab) => `<div class="prow"><div><b>${lab[0]}</b>${lab[1] ? `<small>${lab[1]}</small>` : ''}</div><div class="seg">${opts.map(o => `<button class="${cur === o[0] ? 'on' : ''}" data-pref="${k}:${o[0]}">${o[1]}</button>`).join('')}</div></div>`;
  const AC = [['gold', '#e6b95e', L('Or', 'Gold')], ['violet', '#b98cff', L('Violet', 'Violet')], ['cyan', '#5fd0e8', L('Glace', 'Ice')], ['rose', '#f27aa5', L('Rose', 'Rose')], ['green', '#5fd39b', L('Vent', 'Wind')]];
  const spo = store.get('astro_spo', '1');
  return [`<section class="hlp"><span class="lab">${L('Préférences', 'Preferences')}</span><h1>${L('Paramètres', 'Settings')}</h1><p class="lead">${L('Réglez l’apparence et le comportement du site. Tout est enregistré sur cet appareil.', 'Adjust the site’s look and behaviour. Everything is saved on this device.')}</p></section>
  <div class="card"><h2>${L('Apparence', 'Appearance')}</h2>
  ${seg('theme', PREF.theme, [['dark', L('Sombre', 'Dark')], ['light', L('Clair', 'Light')], ['auto', L('Auto', 'Auto')]], [L('Thème', 'Theme'), L('« Auto » suit le réglage de votre appareil', '“Auto” follows your device')])}
  <div class="prow"><div><b>${L('Couleur d’accent', 'Accent colour')}</b></div><div class="swatches">${AC.map(a => `<button class="sw ${PREF.accent === a[0] ? 'on' : ''}" style="--c:${a[1]}" data-pref="accent:${a[0]}" title="${a[2]}" aria-label="${a[2]}"></button>`).join('')}</div></div>
  ${seg('fs', PREF.fs, [['s', 'S'], ['m', 'M'], ['l', 'L'], ['xl', 'XL']], [L('Taille du texte', 'Text size')])}
  ${seg('compact', PREF.compact, [['off', L('Confortable', 'Comfortable')], ['on', L('Compacte', 'Compact')]], [L('Densité', 'Density')])}
  ${seg('motion', PREF.motion, [['on', L('Activées', 'On')], ['off', L('Réduites', 'Reduced')]], [L('Animations', 'Animations'), L('Désactivez-les si le site est lent', 'Turn off if the site feels slow')])}</div>
  <div class="card"><h2>${L('Langue et région', 'Language and region')}</h2>
  ${seg('lang', LANG, [['fr', 'Français'], ['en', 'English']], [L('Langue', 'Language')])}
  ${seg('tz', PREF.tz, [['auto', L('Mon appareil', 'My device')], ['eu', L('Europe', 'Europe')], ['na', L('Amérique', 'America')], ['asia', L('Asie', 'Asia')], ['utc', 'UTC']], [L('Fuseau des dates', 'Date time zone'), L('Pour les bannières et les comptes à rebours', 'For banners and countdowns')])}</div>
  <div class="card"><h2>${L('Tier list', 'Tier list')}</h2>
  ${seg('tl', PREF.tl, [['T', 'T0 · T1 · T2'], ['S', 'SS · S · A']], [L('Échelle des rangs', 'Rank scale')])}
  ${seg('te', TE, [['base', L('Base du classement', 'Ranking baseline')], ['mine', L('Mes éidolons', 'My eidolons')]], [L('Éidolon affiché', 'Eidolon shown')])}
  ${seg('ts', TS, [['l', L('Grande', 'Large')], ['s', L('Compacte', 'Compact')]], [L('Taille des cases', 'Tile size')])}</div>
  <div class="card"><h2>${L('Contenu', 'Content')}</h2>
  ${seg('spo', spo, [['1', L('Visibles', 'Shown')], ['0', L('Masqués', 'Hidden')]], [L('Spoilers du résumé de version', 'Version recap spoilers')])}
  ${seg('start', PREF.start, [['#/home', L('Accueil', 'Home')], ['#/astrolabe', 'Astrolabe'], ['#/tier', 'Tier list'], ['#/banners', L('Bannières', 'Banners')], ['#/profil', L('Mon profil', 'My profile')]], [L('Page d’ouverture', 'Start page'), L('Utilisée quand vous ouvrez le site sans adresse précise', 'Used when you open the site without a specific address')])}</div>
  <h2 class="sech">${L('Mon compte', 'My account')}</h2>${profSettingsHtml()}
  <div class="card"><h2>${L('Mes données', 'My data')}</h2><p class="sub">${L('Exportez vos favoris, collection et équipes pour les sauvegarder ou les copier sur un autre appareil.', 'Export your favourites, collection and teams to back them up or copy them to another device.')}</p><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn" id="pexp">${L('Exporter', 'Export')}</button><label class="btn" style="cursor:pointer">${L('Importer', 'Import')}<input type="file" id="pimp" accept="application/json" hidden></label><button class="btn" id="prst">${L('Réinitialiser les préférences', 'Reset preferences')}</button></div></div>`, null, () => { mfaDraw(); const f = $('#pimp'); if (f) f.onchange = () => f.files[0] && importData(f.files[0]); }];
};


// ------------------------------------------------------------ v7 : statut, analyse de collection, succès, simulateur, rappels, synergie
// ---- statut des données (data/status.json écrit par le workflow du lundi)
let ST_P = null;
const getStatus = () => ST_P || (ST_P = fetch('data/status.json?' + Date.now()).then(r => r.json()).catch(() => null));
function statusHtml(S, adminMode) {
  if (!S) return `<div class="card note2"><b>${L('Statut des données', 'Data status')}</b> ${L('Information indisponible (le fichier status.json apparaît après la prochaine mise à jour automatique).', 'Not available yet (status.json appears after the next automatic update).')}</div>`;
  const age = Math.floor((Date.now() - new Date(S.updated)) / 864e5), stale = age > 9, pb = S.problems || [];
  const lab = { tiers: L('Tier list (Game8)', 'Tier list (Game8)'), banners: L('Bannières (API)', 'Banners (API)') };
  const row = (n, ok, d) => `<div class="strow ${ok ? 'ok' : 'ko'}"><i></i><b>${n}</b><span>${d}</span></div>`;
  const warn = stale || pb.length;
  return `<div class="card stat2 ${warn ? 'warn' : ''}"><div class="dh"><b>${L('Statut des données', 'Data status')}</b><span class="sub">${L('Dernière mise à jour automatique : ', 'Last automatic update: ')}${fmtD(S.updated)} (${age} ${L('j', 'd')})</span></div>
  ${row(L('Personnages, cônes, reliques', 'Characters, cones, relics'), true, `${S.chars} / ${S.lcs} / ${S.sets}`)}${row(L('Builds et équipes', 'Builds and teams'), S.builds > 0, S.builds + ' builds')}
  ${row(lab.tiers, S.tiers === 'game8', S.tiers === 'game8' ? L('mise à jour ce lundi', 'updated this Monday') : (S.tiers_checked ? L('Game8 bloque la mise à jour automatique : classement vérifié le ', 'Game8 blocks automatic updates: ranking checked on ') + fmtD(S.tiers_checked) : L('source indisponible : dernier classement connu conservé', 'source unavailable: last known ranking kept')))}${S.tiers_err && !adminMode ? '' : S.tiers_err ? `<p class="sub" style="margin:4px 0 0"><code>${esc(S.tiers_err)}</code></p>` : ''}
  ${row(lab.banners, S.banners === 'auto', S.banners === 'auto' ? L('récupérées automatiquement', 'fetched automatically') : L('API indisponible : fichier manuel utilisé', 'API unavailable: manual file used'))}
  ${row(L('Calendrier end game', 'End game schedule'), S.schedule === 'auto', S.schedule === 'auto' ? L('récupéré automatiquement', 'fetched automatically') : L('API indisponible : fichier manuel utilisé', 'API unavailable: manual file used'))}
  ${stale ? `<p class="sub" style="color:var(--SS)">${L('Les données ont plus de 9 jours : le workflow du lundi semble ne pas s’être exécuté.', 'Data is over 9 days old: the Monday workflow may not have run.')}</p>` : ''}${adminMode && warn ? `<p class="sub">${L('À faire : onglet Actions de GitHub → « Mise à jour hebdomadaire » → Run workflow, et regardez les erreurs en rouge.', 'To do: GitHub Actions tab → “Mise à jour hebdomadaire” → Run workflow, and check red errors.')}</p>` : ''}</div>`;
}
const withStatus = (name, adminMode) => { const f = pages[name]; pages[name] = (...a) => { const r = f(...a); if (!Array.isArray(r)) return r; const af = r[2]; return ['<div id="stbox"></div>' + r[0], r[1], () => { if (af) af(); getStatus().then(S => { const b = $('#stbox'); if (b) b.innerHTML = statusHtml(S, adminMode); }); }]; }; };
withStatus('aide', false); withStatus('admin', true);

// ---- succès / badges
function badgesOf(s) {
  const B = [], add = (k, ok, fr, en, dfr, den, g) => B.push({ k, ok, fr, en, dfr, den, g: g || 'c' });
  const n = s.n || 0, n5 = s.n5 || 0, e = s.e || 0, t = C.length;
  add('n1', n >= 1, 'Premier pas', 'First steps', 'Ajouter un personnage à sa collection', 'Add a character to your collection');
  add('n10', n >= 10, 'Équipe au complet', 'Full squad', '10 personnages', '10 characters');
  add('n25', n >= 25, 'Collectionneur', 'Collector', '25 personnages', '25 characters');
  add('n50', n >= 50, 'Grand collectionneur', 'Grand collector', '50 personnages', '50 characters');
  add('nall', t > 0 && n >= t, 'Complétiste', 'Completionist', 'Posséder tous les personnages du site', 'Own every character on the site');
  add('s5', n5 >= 10, 'Chanceux', 'Lucky', '10 personnages 5★', '10 5★ characters');
  add('s5b', n5 >= 25, 'Chouchou des étoiles', 'Star favourite', '25 personnages 5★', '25 5★ characters');
  add('e6', (s.e6 || 0) >= 1 || (!s.col && e >= 6 * 3), 'Éveil total', 'Fully awakened', 'Un personnage à E6', 'A character at E6');
  add('ee', e >= 25, 'Éidolons en pagaille', 'Eidolon hoarder', '25 éidolons cumulés', '25 total eidolons');
  if (s.col) {
    Object.keys(PTH).forEach(p => { const all = C.filter(c => c.pi === p); add('p' + p, all.length >= 3 && all.every(c => c.id in s.col), L('Voie : ', 'Path: ') + pN(p), 'Path: ' + pN(p), 'Posséder tous les personnages de cette voie', 'Own every character of this path', 'p'); });
    Object.keys(ELE).forEach(x => { const all = C.filter(c => c.ei === x); add('e' + x, all.length >= 3 && all.every(c => c.id in s.col), L('Élément : ', 'Element: ') + eN(x), 'Element: ' + eN(x), 'Posséder tous les personnages de cet élément', 'Own every character of this element', 'e'); });
  }
  add('f10', (s.f || 0) >= 10, 'Curateur', 'Curator', '10 favoris', '10 favourites', 'a');
  add('t3', (s.tm || 0) >= 3, 'Architecte', 'Architect', '3 équipes enregistrées', '3 saved teams', 'a');
  add('acc', !!s.acc, 'Voyageur enregistré', 'Registered traveler', 'Avoir un compte', 'Have an account', 'a');
  return B;
}
function badgesHtml(s) {
  const B = badgesOf(s), ok = B.filter(b => b.ok), ko = B.filter(b => !b.ok);
  const one = b => `<div class="bdg ${b.ok ? 'on' : ''}" title="${esc(L(b.dfr, b.den))}"><i>${b.ok ? '✦' : '·'}</i><b>${esc(L(b.fr, b.en))}</b><small>${esc(L(b.dfr, b.den))}</small></div>`;
  return `<div class="card"><div class="dh"><b>${L('Succès', 'Achievements')}</b><span class="sub">${ok.length} / ${B.length}</span></div><div class="bdgs">${ok.map(one).join('') || `<span class="sub">${L('Pas encore de succès : ajoutez des personnages à votre collection.', 'No achievements yet: add characters to your collection.')}</span>`}</div>${ko.length ? `<details><summary class="sub" style="cursor:pointer;margin-top:8px">${L('Voir les succès à débloquer', 'Show locked achievements')}</summary><div class="bdgs" style="margin-top:8px">${ko.map(one).join('')}</div></details>` : ''}</div>`;
}
const myBadgeStats = () => { const own = Object.keys(prof.col).filter(i => byId[i]); return { n: own.length, n5: own.filter(i => byId[i].r === 5).length, e: own.reduce((s, i) => s + prof.col[i], 0), e6: own.filter(i => prof.col[i] >= 6).length, col: prof.col, f: fav.char.length + fav.build.length, tm: myTeams.length, acc: !!user }; };

// ---- analyse de collection (onglet « équipes possibles » du profil)
function colTeamsHtml() {
  const own = new Set(Object.keys(prof.col).filter(i => byId[i]));
  if (own.size < 2) return `<p class="sub">${L('Ajoutez au moins quelques personnages dans l’onglet Collection : le site cherchera les meilleures équipes que vous pouvez composer.', 'Add a few characters in the Collection tab: the site will look for the best teams you can build.')}</p>`;
  const T = teamsAll().list, ok = [], one = [], miss = new Map();
  T.forEach(e => { const m = e.ids.filter(i => !own.has(i)); if (!m.length) ok.push(e); else if (m.length === 1) { one.push([e, m[0]]); miss.set(m[0], (miss.get(m[0]) || []).concat(e)); } });
  ok.sort((a, b) => a.rk.ov - b.rk.ov); one.sort((a, b) => a[0].rk.ov - b[0].rk.ov);
  const best = [...miss.entries()].map(([id, es]) => ({ id, es, sc: es.reduce((s, e) => s + (T.length - e.rk.ov + 1), 0) })).sort((a, b) => b.sc - a.sc).slice(0, 6);
  const row = (e, mi) => { const k = tkey(e, 'ov'); return `<div class="team trk"><span class="rkn">#${e.rk.ov}</span><span class="tag tg" style="--tc:var(${TV[k]})">${TN[k]}</span>${e.ids.map(i => `<span class="${e.sug.includes(i) ? 'sugt' : ''} ${i === mi ? 'missing' : ''}">${tile(byId[i], { s: 1, sub: i === mi ? L('à obtenir', 'missing') : '' })}</span>`).join('')}<a class="btn" style="margin-left:auto" href="${teamHref(e)}">${L('Ouvrir', 'Open')}</a></div>`; };
  return `<div class="g3"><div class="stat"><span class="lab">${L('Équipes complètes', 'Complete teams')}</span><b>${ok.length}</b></div><div class="stat"><span class="lab">${L('À 1 perso près', 'One character away')}</span><b>${one.length}</b></div><div class="stat"><span class="lab">${L('Meilleure équipe', 'Best team')}</span><b>${ok[0] ? '#' + ok[0].rk.ov : '—'}</b></div></div>
  ${best.length ? sec(L('À tirer en priorité', 'Pull priorities')) + `<p class="sub">${L('Les personnages qui débloqueraient les meilleures équipes (classées sur la tier list des équipes du site).', 'The characters that would unlock the best teams (ranked on the site’s team tier list).')}</p><div class="grid">${best.map(b => tile(byId[b.id], { sub: L(b.es.length + ' équipe(s)', b.es.length + ' team(s)') })).join('')}</div>` : ''}
  ${sec(L('Équipes que vous pouvez jouer', 'Teams you can play'))}${ok.slice(0, 20).map(e => row(e)).join('') || `<p class="sub">${L('Aucune équipe complète pour l’instant.', 'No complete team yet.')}</p>`}
  ${one.length ? sec(L('Presque prêtes', 'Almost ready')) + one.slice(0, 15).map(([e, m]) => row(e, m)).join('') : ''}<p class="note">${L('Les cases en pointillés sont des suggestions du site pour compléter une équipe à 4.', 'Dashed tiles are site suggestions to complete a team to 4.')}</p>`;
}

// ---- synergie d'équipe + alternatives
const roleOf = c => { const r = ['dps', 'support', 'sustain'].filter(k => c.tr && c.tr[k]).sort((a, b) => tval(c, b) - tval(c, a))[0]; if (r) return r; return ['Warrior', 'Rogue', 'Mage'].includes(c.pi) ? 'dps' : ['Shaman', 'Warlock', 'Elation'].includes(c.pi) ? 'support' : 'sustain'; };
function teamAnalysis(m) {
  const ms = m.filter(x => byId[x.c]).map(x => byId[x.c]); if (!ms.length) return '';
  const roles = ms.map(roleOf), nd = roles.filter(r => r === 'dps').length, ns = roles.filter(r => r === 'support').length, nh = roles.filter(r => r === 'sustain').length;
  const els = {}; ms.forEach(c => els[c.ei] = (els[c.ei] || 0) + 1);
  const avg = ms.reduce((s, c) => s + tval(c, 'ov'), 0) / ms.length, tips = [];
  let sc = (nd ? 30 : 0) + (ns ? 20 : 0) + (ns > 1 ? 8 : 0) + (nh ? 20 : 0) + avg / 5 * 17 + (Object.values(els).some(v => v >= 2) ? 5 : 0);
  if (ms.length < 4) { sc *= ms.length / 4; tips.push(L('Équipe incomplète : ajoutez ' + (4 - ms.length) + ' personnage(s).', 'Incomplete team: add ' + (4 - ms.length) + ' character(s).')); }
  if (!nd) tips.push(L('Aucun personnage de dégâts principal.', 'No main damage dealer.'));
  if (nd > 2) tips.push(L('Beaucoup de DPS : un second soutien serait plus efficace.', 'Many DPS: a second support would be more effective.'));
  if (!nh) tips.push(L('Aucun soigneur ni protecteur : prévoyez des boucliers ou du soin.', 'No healer or protector: plan for shields or healing.'));
  if (!ns) tips.push(L('Pas de soutien (Harmonie/Nihilité) : les dégâts risquent d’être limités.', 'No support (Harmony/Nihility): damage may be limited.'));
  sc = Math.max(0, Math.min(100, Math.round(sc)));
  const RL = { dps: 'DPS', support: 'Support', sustain: 'Sustain' }, alt = ms.map((c, i) => { const r = roles[i], a = C.filter(x => !ms.includes(x) && x.pi === c.pi && roleOf(x) === r).sort((x, y) => tval(y, 'ov') - tval(x, 'ov') || y.r - x.r).slice(0, 3); return a.length ? `<div class="altr"><span class="sub">${L('À la place de ', 'Instead of ')}<b>${esc(c.n)}</b></span>${a.map(x => tile(x, { s: 1 })).join('')}</div>` : ''; }).join('');
  return `<div class="card"><div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap"><div class="syn" style="--v:${sc}"><b>${sc}</b><span>/100</span></div><div style="flex:1;min-width:220px"><span class="lab">${L('Score de synergie (indicatif)', 'Synergy score (indicative)')}</span><div style="display:flex;gap:6px;flex-wrap:wrap;margin:6px 0">${ms.map((c, i) => `<span class="tag">${RL[roles[i]]}</span>`).join('')}</div><div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">${ms.map(c => eiImg(c.ei) + piImg(c.pi)).join('')}<span class="sub" style="margin-left:8px">${L('Tiers : ', 'Tiers: ')}${ms.map(c => tchip(c.t)).join(' ')}</span></div></div></div>${tips.length ? `<ul class="tips">${tips.map(t => `<li>${t}</li>`).join('')}</ul>` : `<p class="sub" style="margin:8px 0 0">${L('Composition équilibrée sur le papier : dégâts, soutien et survie sont couverts.', 'Balanced on paper: damage, support and survival are covered.')}</p>`}${alt ? `<details style="margin-top:10px"><summary class="sub" style="cursor:pointer">${L('Alternatives si un personnage vous manque', 'Alternatives if you are missing a character')}</summary>${alt}</details>` : ''}<p class="note" style="margin:8px 0 0">${L('Calcul simple : rôles couverts + niveau des personnages + résonance élémentaire. Ce n’est pas une simulation de combat.', 'Simple calculation: covered roles + character tiers + elemental resonance. Not a combat simulation.')}</p></div>`;
}

// ---- simulateur de tirages
let SIM = Object.assign({ c: { p: 0, g: 0 }, l: { p: 0, g: 0 }, n: 0, s5: 0, w: 0, h: [] }, store.get('astro_sim', {}));
function simPull() {
  const b = PL.b || 'c', cfg = BNR[b], st = SIM[b]; st.p++; SIM.n++;
  const m = st.p, r = m >= cfg.hard ? 1 : m < cfg.soft ? cfg.base : Math.min(1, cfg.base + cfg.step * (m - cfg.soft + 1));
  if (Math.random() < r) {
    const win = st.g ? true : Math.random() < cfg.up; st.g = win ? 0 : 1; const got = st.p; st.p = 0; SIM.s5++; if (win) SIM.w++;
    return { r: 5, win, p: got };
  }
  st.cnt4 = (st.cnt4 || 0) + 1; if (st.cnt4 >= 10 || Math.random() < .051) { st.cnt4 = 0; return { r: 4 }; }
  return { r: 3 };
}
function simHtml() {
  const b = PL.b || 'c', st = SIM[b], cur = ((D.banners && D.banners.list) || []).find(x => x.chars && x.chars.length), hist = SIM.h.slice(0, 20);
  const lastWin = hist.find(h => h.r === 5);
  return `<div class="card sim"><div class="dh"><b>${L('Simulateur de tirages', 'Pull simulator')}</b><span class="sub">${L('Pour s’amuser : tirages virtuels, aucun lien avec votre compte du jeu.', 'For fun: virtual pulls, unrelated to your game account.')}</span></div>
  <div class="g3"><div class="stat"><span class="lab">Pity</span><b>${st.p} / ${BNR[b].hard}</b></div><div class="stat"><span class="lab">${L('Prochain 5★', 'Next 5★')}</span><b>${st.g ? L('garanti', 'guaranteed') : '50/50'}</b></div><div class="stat"><span class="lab">${L('Total', 'Total')}</span><b>${SIM.n} · ${SIM.s5}×5★</b></div></div>
  <div class="cta" style="margin:12px 0"><button class="btn pri" data-sim="1">${L('Tirer ×1', 'Pull ×1')}</button><button class="btn pri" data-sim="10">${L('Tirer ×10', 'Pull ×10')}</button><button class="btn" data-sim="0">${L('Remettre à zéro', 'Reset')}</button></div>
  <div class="simres" id="simres">${hist.map(h => simTile(h)).join('')}</div>
  <p class="note">${L('Taux : 5★ 0,6 % (pity doux dès 74, garanti à 90), 4★ 5,1 % avec garantie au 10ᵉ. Le 5★ gagné ou perdu au 50/50 est tiré au hasard parmi les personnages du site.', 'Rates: 5★ 0.6% (soft pity from 74, hard at 90), 4★ 5.1% with a 10-pull guarantee. The 5★ won or lost at the 50/50 is drawn randomly among the site’s characters.')}</p></div>`;
}
function simTile(h) {
  if (h.r === 3) return `<span class="sx r3" title="3★">3★</span>`;
  const c = byId[h.c]; if (!c) return '';
  return `<span class="sx r${h.r} ${h.r === 5 ? (h.win ? 'win' : 'lose') : ''}" title="${esc(c.n)}"><img src="${im('c', c.id)}" alt=""><em>${h.r}★${h.r === 5 ? (h.win ? '' : ' ✗') : ''}</em></span>`;
}
{
  const _plan = pages.plan; pages.plan = () => { const r = _plan(); r[0] += `<div id="simbox">${simHtml()}</div>`; return r; };
}
function simRun(n) {
  if (n === 0) { SIM = { c: { p: 0, g: 0 }, l: { p: 0, g: 0 }, n: 0, s5: 0, w: 0, h: [] }; store.set('astro_sim', SIM); const b = $('#simbox'); if (b) b.innerHTML = simHtml(); return; }
  const b = PL.b || 'c', cur = ((D.banners && D.banners.list) || []).find(x => x.chars && x.chars.length), pool5 = C.filter(c => c.r === 5), pool4 = C.filter(c => c.r === 4), res = [];
  for (let i = 0; i < n; i++) {
    const x = simPull(); if (x.r === 5) { x.c = x.win && cur && b === 'c' ? cur.chars[0] : pool5[Math.floor(Math.random() * pool5.length)].id; if (b === 'l') x.c = pool5[Math.floor(Math.random() * pool5.length)].id; }
    else if (x.r === 4) x.c = pool4[Math.floor(Math.random() * pool4.length)].id; res.push(x);
  }
  SIM.h = [...res.reverse(), ...SIM.h].slice(0, 60); store.set('astro_sim', SIM);
  const box = $('#simbox'); if (!box) return; box.innerHTML = simHtml();
  const items = box.querySelectorAll('#simres .sx'); items.forEach((el, i) => { if (i < n) { el.classList.add('pop'); el.style.animationDelay = (i * 70) + 'ms'; } });
}

// ---- rappels de bannières (calendrier + notification)
let REM = store.get('astro_rem', []);
function remIcs(b) {
  const nm = b.label || b.chars.map(i => byId[i] ? byId[i].n : '').filter(Boolean).join(' + '), fm = t => new Date(t).toISOString().replace(/[-:]/g, '').replace(/\.\d+/, ''), end = new Date(b.end);
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Astrolabe//HSR//FR', 'BEGIN:VEVENT', 'UID:' + b.start + '-' + (b.chars || []).join('') + '@astrolabe', 'DTSTAMP:' + fm(Date.now()), 'DTSTART:' + fm(end), 'DTEND:' + fm(end.getTime() + 36e5), 'SUMMARY:' + L('Fin de la bannière : ', 'Banner ends: ') + nm, 'DESCRIPTION:Honkai: Star Rail', 'BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:' + L('La bannière se termine dans 24 h : ', 'Banner ends in 24h: ') + nm, 'TRIGGER:-P1D', 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'];
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([lines.join('\r\n')], { type: 'text/calendar' })); a.download = 'astrolabe-banniere.ics'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
function remAdd(b) {
  const id = b.start + '|' + b.chars.join(','), nm = b.label || b.chars.map(i => byId[i] ? byId[i].n : '').join(' + ');
  if (!REM.some(r => r.id === id)) { REM.push({ id, end: b.end, nm }); store.set('astro_rem', REM); }
  try { if ('Notification' in window && Notification.permission === 'default') Notification.requestPermission(); } catch { }
}
function remCheck() {
  try {
    if (!('Notification' in window) || Notification.permission !== 'granted') return; let ch = false; const now = Date.now();
    REM.forEach(r => { const e = new Date(r.end).getTime(); if (!r.done && now >= e - 864e5 && now < e) { new Notification(L('Astrolabe : bannière bientôt terminée', 'Astrolabe: banner ending soon'), { body: r.nm + ' · ' + L('fin dans moins de 24 h', 'ends in under 24h'), icon: 'img/icon-192.png' }); r.done = 1; ch = true; } });
    REM = REM.filter(r => new Date(r.end) > now - 864e5); if (ch) store.set('astro_rem', REM);
  } catch { }
}
setInterval(remCheck, 300000); setTimeout(remCheck, 4000);
document.addEventListener('click', e => {
  const s = e.target.closest('[data-sim]'); if (s) { simRun(+s.dataset.sim); return; }
  const r = e.target.closest('[data-rem]'); if (r) { const b = (window.BNL || [])[+r.dataset.rem]; if (b && b.end) { remAdd(b); remIcs(b); r.textContent = '✓ ' + L('Rappel ajouté', 'Reminder added'); } }
});

// ------------------------------------------------------------ moteur de synergie (calcul local, sans IA externe)
const TAGRX = { elation: /Allégresse|Elation|Banger|Punchline/gi, dot: /sur la durée|\bDoT\b|damage over time|Choc\b|Shock|Brûlure|\bBurn|Saignement|Bleed|Vent déchirant|Wind Shear/gi, brk: /Rupture|\bBreak/gi, fua: /de suivi|follow-up/gi, memo: /mémosprite|memosprite/gi };
let SYN = null;
function synData() {
  if (SYN) return SYN;
  const tags = {}, co = new Map();
  C.forEach(c => { const tx = (c.s || []).map(s => (s.d || '') + ' ' + (s.n || '')).join(' '), t = {}; Object.keys(TAGRX).forEach(k => { const n = (tx.match(TAGRX[k]) || []).length; if (n >= 2) t[k] = n >= 5 ? 2 : 1; }); if (c.pi === 'Elation') t.elation = 2; if (c.pi === 'Memory') t.memo = Math.max(t.memo || 0, 1); tags[c.id] = t; });
  C.forEach(c => ((c.b || {}).teams || []).forEach(t => { const ids = [c.id, ...t.map(m => m.c)].filter(i => byId[i]); for (let a = 0; a < ids.length; a++) for (let b = a + 1; b < ids.length; b++) { const k = [ids[a], ids[b]].sort().join('|'); co.set(k, (co.get(k) || new Set()).add(c.id)); } }));
  SYN = { tags, co, pair: new Map() }; return SYN;
}
function pairSyn(a, b) {
  const S = synData(), k = a.id < b.id ? a.id + '|' + b.id : b.id + '|' + a.id; if (S.pair.has(k)) return S.pair.get(k);
  const ta = S.tags[a.id], tb = S.tags[b.id], ra = roleOf(a), rb = roleOf(b); let s = 0;
  Object.keys(TAGRX).forEach(t => { if (ta[t] && tb[t]) s += 1 + Math.min(ta[t], tb[t]) * .5; });
  if (a.pi === 'Elation' && b.pi === 'Elation') s += 2.5;
  if ((a.pi === 'Elation' && b.pi === 'Shaman') || (b.pi === 'Elation' && a.pi === 'Shaman')) s += 1.2;
  const sup = (x, y) => { if (x.pi === 'Shaman' && roleOf(y) === 'dps') s += 1; if (x.pi === 'Warlock' && S.tags[y.id].dot && roleOf(y) === 'dps') s += 2; if (x.pi === 'Memory' && S.tags[y.id].memo) s += 1.5; if (['Knight', 'Priest'].includes(x.pi) && roleOf(y) === 'dps') s += .6; };
  sup(a, b); sup(b, a);
  if (a.ei === b.ei) s += .5;
  if (ra === 'dps' && rb === 'dps') s -= 1.2;
  const c = (S.co.get(a.id < b.id ? a.id + '|' + b.id : b.id + '|' + a.id) || new Set()).size; s += Math.min(3, c) * 1.2;
  S.pair.set(k, s); return s;
}
function teamSyn(ms) {
  let s = 0; for (let i = 0; i < ms.length; i++) for (let j = i + 1; j < ms.length; j++) s += pairSyn(ms[i], ms[j]);
  const r = ms.map(roleOf), nd = r.filter(x => x === 'dps').length, ns = r.filter(x => x === 'support').length, nh = r.filter(x => x === 'sustain').length;
  s += (nd ? 3 : -3) + (ns ? 2 : 0) + (nh ? 2 : -1) + (nd > 2 ? -3 : 0) + ms.reduce((t, c) => t + tval(c, 'ov'), 0) * .3;
  return s;
}
let CALC_T = null;
let USE = {};
function calcTeams(id) {
  if (!CALC_T) CALC_T = {}; if (CALC_T[id]) return CALC_T[id];
  const c = byId[id]; if (!c) return [];
  const pool = C.filter(x => x.id !== id && !/^80/.test(x.id)).map(x => ({ x, s: pairSyn(c, x) + tval(x, 'ov') * .15 })).sort((a, b) => b.s - a.s).slice(0, 22).map(o => o.x), out = [];
  for (let i = 0; i < pool.length; i++) for (let j = i + 1; j < pool.length; j++) for (let k = j + 1; k < pool.length; k++) { const ms = [c, pool[i], pool[j], pool[k]]; out.push({ ms, s: teamSyn(ms) }); }
  const pen = o => o.ms.slice(1).reduce((t, m) => t + Math.max(0, (USE[m.id] || 0) - 14) * .25, 0);
  out.forEach(o => { o.s2 = o.s - pen(o); }); out.sort((a, b) => b.s2 - a.s2); const res = [], used = [];
  for (const o of out) { const ids = o.ms.map(m => m.id); if (used.some(u => u.filter(x => ids.includes(x)).length >= 3)) continue; used.push(ids); res.push(o); o.ms.slice(1).forEach(m => USE[m.id] = (USE[m.id] || 0) + 1); if (res.length >= 3) break; }
  return (CALC_T[id] = res);
}
function calcTeamsHtml(c) {
  const T = calcTeams(c.id); if (!T.length) return '';
  return sec(L('Équipes calculées par le site', 'Teams calculated by the site')) + `<p class="sub">${L('Calcul de synergie entre les kits (éléments, voies, mots-clés des compétences comme Allégresse, DoT, Rupture, mémosprites) et les niveaux de tier. Ce n’est pas une IA en ligne ni une simulation de combat : une estimation qui complète les équipes de HSR Optimizer.', 'Synergy calculated from kits (elements, paths, skill keywords such as Elation, DoT, Break, memosprites) and tier levels. This is not an online AI or a combat simulation: an estimate that complements HSR Optimizer’s teams.')}</p>` +
    T.map(o => `<div class="team"><span class="tag tg" style="--tc:var(--ac)">${L('calculée', 'calculated')}</span>${o.ms.map(m => tile(m, { s: 1 })).join('')}<a class="btn" style="margin-left:auto" href="#/team/${o.ms.map(m => m.id + '-').join('_')}">${L('Ouvrir', 'Open')}</a></div>`).join('');
}

// ------------------------------------------------------------ prochaine version : teaser + page détaillée
const nxChar = () => { const nx = D.banners && D.banners.next; return nx && nx.char && byId[nx.char] ? byId[nx.char] : null; };
const nxName = nx => (LANG === 'en' && nx.name_en) || nx.name || '';
function nxTeaser(nx, big) {
  const c = nxChar(), el = nx.element, pa = nx.path;
  const art = c ? `<img class="nxart" src="${im('p', c.id)}" alt="">` : `<div class="nxmys"><span>?</span><img class="nxpic" src="${esc(nx.img || 'img/next/' + (nx.name || 'next').toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.webp')}" alt="" onload="this.parentNode.classList.add('has')" onerror="this.remove()">${el ? eiImg(el) : ''}${pa ? piImg(pa) : ''}</div>`;
  return `<div class="nxt ${big ? 'big' : ''}">${art}<div class="nxi"><span class="lab">${L('Prochain personnage', 'Next character')}</span><b class="nxn">${c ? esc(c.n) : esc(nxName(nx)) || '???'}</b><span class="sub">${nx.rarity ? nx.rarity + '★ · ' : ''}${el ? eN(el) + ' · ' : ''}${pa ? pN(pa) : ''}</span></div></div>`;
}
function verBanner() {
  const nx = D.banners && D.banners.next; if (!nx) return '';
  const d = Math.ceil((new Date(nx.date) - Date.now()) / 864e5);
  return `<a class="vs nxcard" href="#/next"><div><span class="lab">${L('Prochaine version', 'Next version')}</span><b>${L('Version ', 'Version ')}${esc(nx.version)}</b></div><div class="vn"><b data-cdd="${nx.date}">${Math.max(0, d)}</b><span>${L('jours', 'days')}</span></div>${nxTeaser(nx)}<div style="grid-column:1/-1"><span class="ct" data-cd="${nx.date}"></span> <span class="sub">${nx.estimated ? L('Date estimée', 'Estimated date') : L('Date confirmée', 'Confirmed date')} · <u>${L('En savoir plus', 'Learn more')} →</u></span></div></a>`;
}
pages.next = () => {
  const nx = D.banners && D.banners.next; if (!nx) return pages.notfound();
  const c = nxChar(), cf = nx.confirmed || {}, d = Math.max(0, Math.ceil((new Date(nx.date) - Date.now()) / 864e5));
  const row = (lab, val, ok) => val ? `<div class="strow ${ok ? 'ok' : 'ko'}"><i></i><b>${lab}</b><span>${val} · ${ok ? L('confirmé', 'confirmed') : L('à confirmer', 'to be confirmed')}</span></div>` : '';
  const st = (LANG === 'en' ? nx.story_en : nx.story_fr) || [], dn = (LANG === 'en' ? nx.date_note_en : nx.date_note_fr) || '';
  const kit = c ? sec(L('Kit du personnage', 'Character kit')) + `<div class="card">${(c.s || []).slice(0, 8).map(s => `<p style="margin:0 0 8px"><span class="lab">${esc(s.t)}</span> <b>${esc(s.n)}</b></p>`).join('')}<a class="btn pri" href="#/perso/${c.id}">${L('Voir la fiche complète', 'Open the full page')}</a></div>` : `<p class="note">${L('Le kit n’est pas encore disponible : la fiche complète apparaîtra automatiquement dès que le personnage est ajouté aux données du jeu (la mise à jour du lundi la détecte toute seule).', 'The kit is not available yet: the full page will appear automatically as soon as the character is added to the game data (the Monday update detects it on its own).')}</p>`;
  return [`<section class="hlp nxhero"><span class="lab">${L('Aperçu · version ', 'Preview · version ')}${esc(nx.version)}</span><h1>${c ? esc(c.n) : esc(nxName(nx)) || L('Personnage mystérieux', 'Mystery character')}</h1><p class="lead">${esc((LANG === 'en' ? nx.role_en : nx.role_fr) || '')}</p></section>
  <div class="cols"><div class="mn">${nxTeaser(nx, true)}
  ${sec(L('Ce que l’on sait', 'What we know'))}<div class="card stat2">${row(L('Personnage', 'Character'), esc(nxName(nx)), cf.char)}${row(L('Voie', 'Path'), nx.path ? pN(nx.path) : '', cf.path)}${row(L('Élément', 'Element'), nx.element ? eN(nx.element) : '', cf.element)}${row(L('Rareté', 'Rarity'), nx.rarity ? nx.rarity + '★' : '', cf.rarity)}${row(L('Date de sortie', 'Release date'), fmtD(nx.date), cf.date)}${dn ? `<p class="sub" style="margin:8px 0 0">${esc(dn)}</p>` : ''}</div>
  ${sec(L('Contexte et histoire', 'Context and story'))}<div class="card">${st.map(t => `<p style="margin:0 0 10px">${esc(t)}</p>`).join('')}<a href="#/versions">${L('Voir le résumé de toutes les versions', 'See every version recap')} →</a></div>${kit}
  <p class="note">${L('Sources : ', 'Sources: ')}${(nx.sources || []).map(s => `<a href="${s[1]}" target="_blank" rel="noopener">${esc(s[0])}</a>`).join(' · ')}. ${L('Informations avant sortie : elles peuvent changer. Cette page se met à jour toute seule chaque lundi (date, nom, fiche du personnage dès qu’ils sont disponibles).', 'Pre-release information: it may change. This page updates itself every Monday (date, name, character page as soon as available).')}</p></div>
  <aside class="rail"><div class="vs"><div><span class="lab">${L('Sortie dans', 'Releases in')}</span><b>${L('Version ', 'Version ')}${esc(nx.version)}</b></div><div class="vn"><b data-cdd="${nx.date}">${d}</b><span>${L('jours', 'days')}</span></div><div style="grid-column:1/-1"><span class="ct" data-cd="${nx.date}"></span></div></div></aside></div>`];
};

// ------------------------------------------------------------ mentions légales, confidentialité et crédits
function legalNav(cur) { return `<div class="bigtabs c2"><a class="${cur === 'legal' ? 'on' : ''}" href="#/legal">${ico('shield')}${L('Mentions légales', 'Legal notice')}</a><a class="${cur === 'credits' ? 'on' : ''}" href="#/credits">${ico('star')}${L('Crédits', 'Credits')}</a></div>`; }
pages.legal = () => {
  const lg = (D.manual && D.manual.legal) || {}, ed = lg.editor || L('un particulier, à titre non professionnel', 'a private individual, on a non-professional basis'), ct = lg.contact || '';
  return [`<section class="hlp"><span class="lab">${L('Informations', 'Information')}</span><h1>${L('Mentions légales et confidentialité', 'Legal notice and privacy')}</h1><p class="lead">${L('Astrolabe est un site de fans, gratuit, sans publicité et sans but lucratif.', 'Astrolabe is a free fan site with no ads and no profit motive.')}</p></section>${legalNav('legal')}
  <div class="card legal"><h2>${L('Éditeur du site', 'Site publisher')}</h2>
  <p>${L('Ce site est édité par ', 'This site is published by ')}<b>${esc(ed)}</b>.${ct ? ' ' + L('Contact : ', 'Contact: ') + `<b>${esc(ct)}</b>.` : ''} ${L('Pour toute question, demande de retrait ou signalement, utilisez le bouton « Signaler » en haut du site.', 'For any question, removal request or report, use the “Report” button at the top of the site.')}</p>
  <p class="sub">${L('Éditeur non professionnel : son identité a été communiquée à l’hébergeur, comme la loi le permet.', 'Non-professional publisher: their identity has been provided to the host, as the law allows.')}</p>
  <h2>${L('Hébergement', 'Hosting')}</h2>
  <p>${L('Le site est hébergé par GitHub Pages (GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, États-Unis). Les comptes et les données de profil sont stockés par Supabase (Supabase, Inc.).', 'The site is hosted by GitHub Pages (GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, USA). Accounts and profile data are stored by Supabase (Supabase, Inc.).')}</p>
  <h2>${L('Propriété intellectuelle', 'Intellectual property')}</h2>
  <p>${L('Astrolabe est un site de fans non officiel, sans lien avec HoYoverse (COGNOSPHERE PTE. LTD.). Honkai: Star Rail, ses personnages, noms, images et textes sont la propriété de HoYoverse. Ils sont utilisés ici à titre informatif, sans but commercial (aucune publicité, aucune vente ; un éventuel don facultatif sert seulement à remercier le temps passé). Si vous êtes titulaire de droits et souhaitez un retrait, contactez-nous via le bouton « Signaler » : le contenu concerné sera retiré rapidement.', 'Astrolabe is an unofficial fan site with no affiliation to HoYoverse (COGNOSPHERE PTE. LTD.). Honkai: Star Rail, its characters, names, images and texts are the property of HoYoverse. They are used here for information only, with no commercial purpose (no ads, nothing for sale; an optional donation is only a thank-you for the time spent). If you are a rights holder and want something removed, contact us through the “Report” button: the content will be removed promptly.')}</p>
  <p>${L('Les classements, équipes calculées, scores de synergie et estimations de tirages sont fournis à titre indicatif et peuvent contenir des erreurs. Ils ne constituent pas une information officielle.', 'Rankings, calculated teams, synergy scores and pull estimates are indicative and may contain errors. They are not official information.')}</p>
  <h2 id="priv">${L('Données personnelles', 'Personal data')}</h2>
  <p><b>${L('Sans compte', 'Without an account')}</b> : ${L('vos préférences, favoris, collection, équipes et routine du jour sont enregistrés uniquement dans votre navigateur (stockage local). Ils ne sont pas envoyés au site. Il n’y a ni publicité, ni outil de mesure d’audience, ni cookie de suivi.', 'your preferences, favourites, collection, teams and daily routine are saved only in your browser (local storage). They are not sent to the site. There are no ads, no analytics tools and no tracking cookies.')}</p>
  <p><b>${L('Avec un compte', 'With an account')}</b> : ${L('nous enregistrons votre adresse e-mail et votre mot de passe (chiffré, géré par Supabase), puis les données que vous choisissez de synchroniser : favoris, collection, équipes et, si vous le décidez, un profil public (pseudo, avatar, présentation, statistiques, vitrine), ainsi que les messages de retour ou signalements que vous envoyez. Si vous activez la double authentification, un facteur de vérification est enregistré.', 'we store your e-mail address and password (hashed, handled by Supabase), then the data you choose to sync: favourites, collection, teams and, if you decide so, a public profile (name, avatar, bio, stats, showcase), as well as feedback or reports you send. If you enable two-factor authentication, a verification factor is stored.')}</p>
  <p><b>${L('Finalités', 'Purposes')}</b> : ${L('faire fonctionner votre compte, synchroniser vos données entre appareils, afficher votre profil public si vous l’activez, traiter les signalements et protéger le site contre les abus. Base légale : votre consentement et l’exécution du service que vous demandez. Aucune donnée n’est vendue ni utilisée à des fins publicitaires.', 'running your account, syncing your data between devices, showing your public profile if you enable it, handling reports and protecting the site from abuse. Legal basis: your consent and the service you request. No data is sold or used for advertising.')}</p>
  <p><b>${L('Services tiers', 'Third-party services')}</b> : ${L('pour s’afficher, le site charge une bibliothèque (Supabase) depuis jsDelivr : ce service reçoit votre adresse IP, comme tout chargement de ressource externe. Les polices, images et données du jeu sont hébergées avec le site.', 'to display, the site loads a library (Supabase) from jsDelivr: this service receives your IP address, as with any external resource. Fonts, game images and data are hosted with the site.')}</p>
  <p><b>${L('Vos droits', 'Your rights')}</b> : ${L('vous pouvez à tout moment accéder à vos données, les corriger et les exporter (Paramètres → Mes données), supprimer votre profil public ou supprimer définitivement votre compte (Paramètres → Mon compte). La suppression du compte efface les données associées. Pour toute autre demande (RGPD), utilisez le bouton « Signaler ». Vous pouvez aussi saisir la CNIL (cnil.fr).', 'you can at any time access, correct and export your data (Settings → My data), delete your public profile or permanently delete your account (Settings → My account). Deleting the account erases the associated data. For any other request (GDPR), use the “Report” button. You may also contact your data protection authority (CNIL in France, cnil.fr).')}</p>
  <p><b>${L('Conservation', 'Retention')}</b> : ${L('vos données sont conservées tant que votre compte existe, puis supprimées avec lui. Les signalements traités sont supprimés régulièrement.', 'your data is kept as long as your account exists, then deleted with it. Handled reports are deleted regularly.')}</p>
  <p class="sub">${L('Ces mentions sont un texte d’information rédigé de bonne foi, pas un avis juridique.', 'This notice is an information text written in good faith, not legal advice.')}</p></div>`];
};
pages.credits = () => {
  const src = [
    ['StarRailRes (Mar-7th)', 'https://github.com/Mar-7th/StarRailRes', L('Données du jeu (personnages, cônes, reliques, compétences) et images, en français et en anglais.', 'Game data (characters, cones, relics, skills) and images, in French and English.')],
    ['HSR Optimizer (Fribbels)', 'https://github.com/fribbels/hsr-optimizer', L('Builds recommandés et équipes conseillées.', 'Recommended builds and teams.')],
    ['Game8', 'https://game8.co/games/Honkai-Star-Rail/archives/409604', L('Tier list (vue d’ensemble, rôles, Memory of Chaos, Pure Fiction, Apocalyptic Shadow), convertie sur l’échelle T0 → T4.', 'Tier list (overview, roles, Memory of Chaos, Pure Fiction, Apocalyptic Shadow), converted to the T0 → T4 scale.')],
    ['Ennead API', 'https://api.ennead.cc', L('Bannières et calendrier du end game.', 'Banners and end game schedule.')],
    ['Supabase', 'https://supabase.com', L('Comptes, synchronisation et profils.', 'Accounts, sync and profiles.')],
    ['Fontsource', 'https://fontsource.org', L('Polices Cinzel, Jost et Rajdhani (licence OFL), hébergées avec le site.', 'Cinzel, Jost and Rajdhani fonts (OFL license), hosted with the site.')],
    ['GitHub Pages & Actions', 'https://github.com', L('Hébergement et mise à jour automatique chaque lundi.', 'Hosting and automatic update every Monday.')]];
  return [`<section class="hlp"><span class="lab">${L('Remerciements', 'Thanks')}</span><h1>${L('Crédits', 'Credits')}</h1><p class="lead">${L('Astrolabe n’existerait pas sans ces projets et ces communautés. Merci à leurs auteurs.', 'Astrolabe would not exist without these projects and communities. Thanks to their authors.')}</p></section>${legalNav('credits')}
  <div class="card">${src.map(s => `<div class="strow ok" style="align-items:flex-start"><i style="margin-top:6px"></i><b style="min-width:190px"><a href="${s[1]}" target="_blank" rel="noopener">${esc(s[0])}</a></b><span style="text-align:left;margin-left:0">${s[2]}</span></div>`).join('')}</div>
  <div class="card note2"><b>${L('Important', 'Important')}</b> ${L('Honkai: Star Rail et tout son contenu (personnages, noms, images, textes) appartiennent à HoYoverse. Dans Foilvault, les personnages, noms et images des autres jeux (Genshin Impact, Zenless Zone Zero, Wuthering Waves, Reverse: 1999, Umamusume, Bleach: Brave Souls, Persona 5: The Phantom X, Bleach: Mirrors High, Arknights: Endfield, Fate/Grand Order, NIKKE, Neverness to Everness, One Piece Bounty Rush…) appartiennent à leurs éditeurs et ayants droit respectifs. Astrolabe est un projet de fans, gratuit et sans publicité. Les classements restent la propriété de leurs auteurs : le site les présente de façon résumée et renvoie vers les sources. Les équipes « calculées », les scores de synergie et les estimations de tirages sont produits par le site lui-même.', 'Honkai: Star Rail and all its content (characters, names, images, texts) belong to HoYoverse. In Foilvault, the characters, names and images of the other games (Genshin Impact, Zenless Zone Zero, Wuthering Waves, Reverse: 1999, Umamusume, Bleach: Brave Souls, Dokkan Battle, Arknights: Endfield, Fate/Grand Order, NIKKE, Neverness to Everness, One Piece Bounty Rush…) belong to their respective publishers and rights holders. Astrolabe is a free, ad-free fan project. Rankings remain the property of their authors: the site presents them in summary form and links to the sources. “Calculated” teams, synergy scores and pull estimates are produced by the site itself.')}</div>
  <p class="note">${L('Une source manque ou une information est incorrecte ? Utilisez le bouton « Signaler ».', 'A source is missing or something is wrong? Use the “Report” button.')} <a href="#/legal">${L('Mentions légales', 'Legal notice')}</a></p>`];
};
document.addEventListener('click', e => { const a = e.target.closest('dialog a[href^="#/"]'); if (a) { const d = a.closest('dialog'); if (d && d.close) d.close(); } });

// ------------------------------------------------------------ v8 : partage, recherche clavier, bienvenue, bandeau, routine
function toast(msg) { let t = $('#toast'); if (!t) { t = document.createElement('div'); t.id = 'toast'; document.body.appendChild(t); } t.textContent = msg; t.className = 'show'; clearTimeout(toast.h); toast.h = setTimeout(() => { t.className = ''; }, 2600); }
async function shareSite(url) {
  const data = { title: 'Astrolabe — Honkai: Star Rail', text: L('Le guide Honkai: Star Rail gratuit : tier list, builds, équipes, bannières et outils.', 'The free Honkai: Star Rail guide: tier list, builds, teams, banners and tools.'), url: url || location.href };
  try { if (navigator.share) { await navigator.share(data); return; } } catch (e) { if (e && e.name === 'AbortError') return; }
  try { await navigator.clipboard.writeText(data.url); } catch { const ta = document.createElement('textarea'); ta.value = data.url; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch { } ta.remove(); }
  toast(L('Lien copié ! Collez-le où vous voulez.', 'Link copied! Paste it anywhere.'));
}
const siteRoot = () => location.origin + location.pathname;

// ---- recherche : clavier, récents, placeholder tournant
document.addEventListener('keydown', e => {
  const d = $('#sdlg'); if (!d || !d.open) return; const items = [...d.querySelectorAll('.sit')]; if (!items.length) return;
  let i = items.findIndex(x => x.classList.contains('kb'));
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); items.forEach(x => x.classList.remove('kb')); i = e.key === 'ArrowDown' ? (i + 1) % items.length : (i - 1 + items.length) % items.length; items[i].classList.add('kb'); items[i].scrollIntoView({ block: 'nearest' }); }
  else if (e.key === 'Enter') { const t = items[i >= 0 ? i : 0]; if (t) { e.preventDefault(); t.click(); } }
});
let SPH = 0;
setInterval(() => { const el = $('#srph'); if (!el || PREF.motion === 'off' || !D) return; const s = [L('Rechercher…', 'Search…'), L('Essayez « Perle »', 'Try “Pearl”'), L('Essayez « Nuit sur la Voie lactée »', 'Try “Night on the Milky Way”'), L('Essayez « tier list »', 'Try “tier list”'), L('Essayez « bannières »', 'Try “banners”')]; SPH = (SPH + 1) % s.length; el.style.opacity = 0; setTimeout(() => { el.textContent = s[SPH]; el.style.opacity = 1; }, 220); }, 3800);
document.addEventListener('click', e => {
  const r = e.target.closest('.sit[data-rec]'); if (r) { const rec = store.get('astro_recent', []).filter(x => x !== r.dataset.rec); rec.unshift(r.dataset.rec); store.set('astro_recent', rec.slice(0, 5)); const d = $('#sdlg'); if (d && d.open) setTimeout(() => d.close(), 0); }
  else if (e.target.closest('#sdlg a[href^="#/"]')) { const d = $('#sdlg'); if (d && d.open) setTimeout(() => d.close(), 0); }
  if (e.target.closest('#shareb')) shareSite();
  const sh = e.target.closest('[data-share]'); if (sh) shareSite(sh.dataset.share === 'site' ? siteRoot() : location.href);
});

// ---- animation de bienvenue : le train passe
function welcome() {
  try {
    if (sessionStorage.getItem('astro_wl')) return; sessionStorage.setItem('astro_wl', '1'); const lw = +localStorage.getItem('astro_wl_t') || 0; if (Date.now() - lw < 6 * 3600e3) return; localStorage.setItem('astro_wl_t', String(Date.now()));
    if (PREF.motion === 'off' || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) return;
    if (location.hash && location.hash !== '#/home' && location.hash !== '#/') return;
  } catch { return; }
  const w = document.createElement('div'); w.id = 'welcome';
  const win = n => Array.from({ length: n }, (_, i) => `<rect x="${14 + i * 30}" y="26" width="18" height="22" rx="5" fill="url(#wg)"/>`).join('');
  w.innerHTML = `<div class="wstars"></div><div class="wtxt"><span>${L('Bienvenue à bord', 'Welcome aboard')}</span><b>Trailblazer</b><small>${L('Astrolabe · le guide du Train Astral', 'Astrolabe · the Astral Express guide')}</small></div>
  <div class="wrail"><div class="wtrain"><svg viewBox="0 0 980 150" width="980" height="150" aria-hidden="true"><defs><linearGradient id="wb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a4577"/><stop offset="1" stop-color="#1c1d3a"/></linearGradient><linearGradient id="wg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff2c4"/><stop offset="1" stop-color="#e6b95e"/></linearGradient><linearGradient id="wl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffe9a8" stop-opacity=".9"/><stop offset="1" stop-color="#ffe9a8" stop-opacity="0"/></linearGradient></defs>
  ${[0, 1, 2].map(k => `<g transform="translate(${20 + k * 230} 40)"><rect width="215" height="70" rx="14" fill="url(#wb)" stroke="#e6b95e" stroke-opacity=".55"/><rect y="52" width="215" height="6" fill="#e6b95e" opacity=".85"/>${win(6).replace(/x="(\d+)"/g, (m, x) => `x="${+x + 10}"`)}<circle cx="40" cy="74" r="10" fill="#14162b" stroke="#e6b95e"/><circle cx="175" cy="74" r="10" fill="#14162b" stroke="#e6b95e"/></g>`).join('')}
  <g transform="translate(710 30)"><path d="M0 12a12 12 0 0 1 12-12h150c46 0 90 30 100 80H0z" fill="url(#wb)" stroke="#e6b95e" stroke-opacity=".7"/><path d="M20 20h120c28 0 58 20 70 42H20z" fill="#0f1126" opacity=".7"/>${win(4)}<rect y="52" width="262" height="8" fill="#e6b95e" opacity=".9"/><circle cx="58" cy="84" r="13" fill="#14162b" stroke="#e6b95e" stroke-width="2"/><circle cx="130" cy="84" r="13" fill="#14162b" stroke="#e6b95e" stroke-width="2"/><circle cx="210" cy="84" r="13" fill="#14162b" stroke="#e6b95e" stroke-width="2"/><path d="M262 70L980 110V30z" fill="url(#wl)" opacity=".5"/><path d="M110 -4l7-14 7 14z" fill="#e6b95e"/></g>
  </svg></div><i class="wline"></i></div><button class="btn wskip">${L('Passer', 'Skip')}</button>`;
  document.body.appendChild(w);
  const end = () => { if (!w.isConnected) return; w.classList.add('out'); setTimeout(() => w.remove(), 500); };
  w.onclick = end; setTimeout(end, 2600);
}
setTimeout(welcome, 50);

// ---- bandeau défilant
function tickerItems() {
  const it = [], nx = D.banners && D.banners.next, now = Date.now(), dd = t => Math.max(0, Math.ceil((new Date(t) - now) / 864e5));
  if (nx) it.push({ i: 'train', h: '#/next', t: L(`Version ${nx.version} dans ${dd(nx.date)} jours : ${nxName(nx)}`, `Version ${nx.version} in ${dd(nx.date)} days: ${nxName(nx)}`) });
  ((D.banners && D.banners.list) || []).filter(b => b.end && new Date(b.end) > now && new Date(b.start) < now).forEach(b => it.push({ i: 'star', h: '#/banners', t: L(`Bannière en cours : ${b.chars.map(i => byId[i] ? byId[i].n : '').filter(Boolean).join(' + ')}, fin dans ${dd(b.end)} jours`, `Current banner: ${b.chars.map(i => byId[i] ? byId[i].n : '').filter(Boolean).join(' + ')}, ends in ${dd(b.end)} days`) }));
  const tr = (D.trend || {}).ov || {}, mv = Object.keys(tr).filter(i => byId[i]).slice(0, 4);
  mv.forEach(i => it.push({ i: tr[i] === 'down' ? 'chart' : 'trophy', h: '#/perso/' + i, t: L(`Tier list : ${byId[i].n} ${tr[i] === 'down' ? 'recule' : tr[i] === 'new' ? 'fait son entrée' : 'monte'}`, `Tier list: ${byId[i].n} ${tr[i] === 'down' ? 'drops' : tr[i] === 'new' ? 'enters the list' : 'moves up'}`) }));
  const SCH = (LANG === 'en' && D.manual.schedule_en) || D.manual.schedule || [];
  SCH.slice(0, 5).forEach(r => it.push({ i: 'end', h: '#/end/' + (/Chaos/.test(r[0]) ? 'moc' : /Fiction/.test(r[0]) ? 'pf' : /Shadow/.test(r[0]) ? 'as' : 'aa'), t: L(`${r[0]} : du ${r[1]} au ${r[2]}`, `${r[0]}: ${r[1]} to ${r[2]}`) }));
  ((D.manual && D.manual.news) || []).forEach(n => it.push({ i: 'bell', h: n.h || '#/aide', t: LANG === 'en' ? n.en : n.fr }));
  return it;
}
function tickerHtml() {
  const it = tickerItems(); if (!it.length) return '';
  const one = it.map(x => `<a href="${x.h}"><span>${ico(x.i)}</span>${esc(x.t)}</a>`).join('<i>✦</i>');
  return `<div class="ticker" role="marquee" aria-label="${L('Dernières nouveautés', 'Latest news')}"><b>${ico('bell')}${L('NOUVEAUTÉS', 'NEWS')}</b><div class="tk"><div class="tkr">${one}<i>✦</i>${one}<i>✦</i></div></div></div>`;
}

// ---- routine du jour (jour + semaine, anneau de progression, série)
const DAILY = [['Ordres quotidiens', 'Daily Training', 'Terminer les missions d’entraînement', 'Complete the Daily Training missions', 'cal'], ['Énergie de Trailblaze', 'Trailblaze Power', 'Dépenser les 240 points d’énergie', 'Spend your 240 Trailblaze Power', 'tier'], ['Assignations', 'Assignments', 'Envoyer et récolter les expéditions', 'Send out and collect expeditions', 'users'], ['Énergie de réserve', 'Reserve Power', 'Récupérer l’énergie de la Réserve', 'Claim your Reserve Power', 'box'], ['Magasin du jour', 'Daily shop', 'Récupérer les offres gratuites', 'Claim free offers', 'star']];
const WEEKLY = [['Écho de guerre', 'Echo of War', 'Battre les 3 boss hebdomadaires', 'Beat the 3 weekly bosses', 'end'], ['Univers simulé', 'Simulated Universe', 'Points hebdomadaires de récompenses', 'Weekly reward points', 'cone'], ['Memory of Chaos', 'Memory of Chaos', 'Étoiles de l’étage de la phase', 'Stars from the current phase', 'end'], ['Pure Fiction / Shadow', 'Pure Fiction / Shadow', 'Les deux autres modes end game', 'The other two end game modes', 'end'], ['Anomaly Arbitration', 'Anomaly Arbitration', 'Combats de la phase en cours', 'Battles of the current phase', 'end']];
const dayKey = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
const weekKey = () => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
let DTAB = 'd';
function dailyState() {
  const s = store.get('astro_daily2', {}), dk = dayKey(), wk = weekKey();
  if (s.day !== dk) { const y = new Date(); y.setDate(y.getDate() - 1); const full = s.d && s.d.length >= DAILY.length; s.streak = s.day && full && s.day === (y.getFullYear() + '-' + String(y.getMonth() + 1).padStart(2, '0') + '-' + String(y.getDate()).padStart(2, '0')) ? (s.streak || 0) : (s.day && full ? 0 : 0); s.day = dk; s.d = []; s.counted = false; }
  if (s.wk !== wk) { s.wk = wk; s.w = []; }
  return s;
}
function dailyHtml() {
  const s = dailyState(), list = DTAB === 'd' ? DAILY : WEEKLY, cur = (DTAB === 'd' ? s.d : s.w) || [], pct = Math.round(cur.length / list.length * 100), C2 = 2 * Math.PI * 34;
  return `<div class="card daily2"><div class="d2h"><div class="ring" style="--p:${pct}"><svg viewBox="0 0 80 80"><circle cx="40" cy="40" r="34" class="rb"/><circle cx="40" cy="40" r="34" class="rf" stroke-dasharray="${C2.toFixed(1)}" stroke-dashoffset="${(C2 * (1 - pct / 100)).toFixed(1)}"/></svg><b>${cur.length}/${list.length}</b></div>
  <div class="d2t"><b>${L('Ma routine', 'My routine')}</b><span class="sub">${pct === 100 ? L('Tout est fait, beau travail, Trailblazer ! ✦', 'All done, nice work, Trailblazer! ✦') : DTAB === 'd' ? L('Se remet à zéro chaque jour', 'Resets every day') : L('Se remet à zéro chaque lundi', 'Resets every Monday')}</span>${s.streak ? `<span class="streak">🔥 ${L(s.streak + ' jour(s) d’affilée', s.streak + '-day streak')}</span>` : ''}</div>
  <div class="seg"><button class="${DTAB === 'd' ? 'on' : ''}" data-dtab="d">${L('Jour', 'Day')}</button><button class="${DTAB === 'w' ? 'on' : ''}" data-dtab="w">${L('Semaine', 'Week')}</button></div></div>
  <div class="d2l">${list.map((t, i) => `<button class="d2i ${cur.includes(i) ? 'on' : ''}" data-dchk="${i}"><i>${ico(t[4])}</i><span><b>${L(t[0], t[1])}</b><small>${L(t[2], t[3])}</small></span><em>${cur.includes(i) ? '✓' : ''}</em></button>`).join('')}</div></div>`;
}
document.addEventListener('click', e => {
  const t = e.target.closest('[data-dtab]'); if (t) { DTAB = t.dataset.dtab; const c = t.closest('.daily2'); if (c) c.outerHTML = dailyHtml(); return; }
  const k = e.target.closest('[data-dchk]'); if (!k) return;
  const s = dailyState(), key = DTAB === 'd' ? 'd' : 'w', i = +k.dataset.dchk; s[key] = s[key] || [];
  s[key] = s[key].includes(i) ? s[key].filter(x => x !== i) : [...s[key], i];
  if (DTAB === 'd' && s.d.length >= DAILY.length && !s.counted) { s.streak = (s.streak || 0) + 1; s.counted = true; }
  store.set('astro_daily2', s); const c = k.closest('.daily2'); if (c) { c.outerHTML = dailyHtml(); if (s[key].length === (DTAB === 'd' ? DAILY : WEEKLY).length) { const n = $('.daily2'); if (n) n.classList.add('done'); } }
});

// ---- accueil : « Au programme de la version »
function homeAfter() {
  const el = $('#hnew'); if (!el) return;
  fetch('data/versions.json').then(r => r.json()).then(V => {
    const e = V.v.find(x => String(x.v) === String(D.version)), ids = ((e && e.chars) || []).filter(i => byId[i]), nf = (LANG === 'en' ? e && e.ne : e && e.nf) || [];
    const head = ((D.banners && D.banners.list) || []).flatMap(b => b.chars).filter(i => byId[i] && !ids.includes(i)).slice(0, 2);
    if (!e && !head.length) return;
    el.innerHTML = sec(L('Au programme de la version ' + D.version, 'In version ' + D.version), `<a href="#/versions">${L('Résumé complet', 'Full recap')} →</a>`) + `<div class="newv">${ids.length ? `<div class="grid">${ids.map(i => tile(byId[i], { sub: L('Nouveau', 'New') })).join('')}</div>` : ''}${nf.length ? `<ul class="nfl">${nf.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}</div>${head.length ? `<p class="sub" style="margin:10px 0 6px">${L('Aussi à l’affiche : ', 'Also featured: ')}${head.map(i => `<a href="#/perso/${i}">${esc(byId[i].n)}</a>`).join(', ')}</p>` : ''}`;
  }).catch(() => { });
}
// ------------------------------------------------------------ v8 : équipement recommandé, tier lists cônes/reliques, survol, end game
let _GS; const gearStat = () => _GS || (_GS = (() => {
  const lc = {}, st = {}, byPathLc = {}, byPathSt = {};
  const bump = (m, id, c) => { const o = m[id] || (m[id] = { id, w: 0, u: [] }); if (!o.u.includes(c.id)) { o.u.push(c.id); o.w += tval(c, 'ov'); } };
  C.forEach(c => { const b = c.b; if (!b) return;
    if (b.lc) { bump(lc, b.lc, c); bump(byPathLc[c.pi] = byPathLc[c.pi] || {}, b.lc, c); }
    new Set([...(b.rel || []).flat(), ...(b.orn || [])]).forEach(i => { bump(st, i, c); bump(byPathSt[c.pi] = byPathSt[c.pi] || {}, i, c); }); });
  return { lc, st, byPathLc, byPathSt };
})());
const gTier = (map, id) => { const arr = Object.values(map).sort((a, b) => b.w - a.w), i = arr.findIndex(x => x.id === id); if (i < 0) return null; const q = i / arr.length; return q <= .08 ? 'SS' : q <= .25 ? 'S+' : q <= .5 ? 'S' : q <= .75 ? 'A' : 'B'; };
const lcAlt = c => { const used = (gearStat().byPathLc[c.pi] || {}), cur = c.b && c.b.lc;
  const rank = LC.filter(l => l.pi === c.pi && l.id !== cur).sort((a, b) => ((used[b.id] || {}).w || 0) - ((used[a.id] || {}).w || 0) || b.r - a.r || a.n.localeCompare(b.n));
  return rank.slice(0, 3); };
const stAlt = (c, pl, have) => { const used = gearStat().byPathSt[c.pi] || {};
  return Object.values(used).filter(o => { const s = RS.find(x => x.id === o.id); return s && !!s.pl === pl && !have.includes(o.id); }).sort((a, b) => b.w - a.w).slice(0, 2).map(o => RS.find(x => x.id === o.id)); };
function gearHtml(c, b, lc) {
  const p2 = L('2 pièces : ', '2-piece: '), p4 = L('4 pièces : ', '4-piece: ');
  const rec = (inner) => `<div class="rec"><span class="recb">★ ${L('Recommandé', 'Recommended')}</span>${inner}</div>`;
  const opt = (arr, mk) => arr.length ? `<div class="optb"><span class="lab">${L('Facultatif · si vous n’avez pas le meilleur', 'Optional · if you lack the best')}</span>${arr.map(mk).join('')}</div>` : '';
  const sRow = (s, f) => row(im('r', s.id), s.n, esc(f(s)));
  const relRow = p => p[0] === p[1] ? sRow(RS.find(x => x.id === p[0]) || { id: p[0], n: '?', d: [''] }, s => p4 + s.d[s.d.length - 1]) : [p[0], p[1]].map(i => { const s = RS.find(x => x.id === i); return s ? sRow(s, s => p2 + s.d[0]) : ''; }).join('');
  const rels = b.rel || [], orns = b.orn || [];
  const haveR = rels.flat(), haveO = orns;
  const relAlt = rels.slice(1).map(relRow), ornAlt = orns.slice(1).map(i => RS.find(x => x.id === i)).filter(Boolean);
  const extraR = relAlt.length ? [] : stAlt(c, false, haveR), extraO = ornAlt.length ? [] : stAlt(c, true, haveO);
  const lcA = lcAlt(c), none = `<p class="sub">${L('Non renseigné.', 'Not provided.')}</p>`;
  const lcRow = l => row(im('l', l.id), l.n, `${l.r}★ · ${esc(l.k)} — ${esc(l.d)}`);
  const tg = (map, id) => { const t = gTier(map, id); return t ? ` ${tchip(t)}` : ''; };
  return `<div class="card"><h2>${L('Cône de lumière', 'Light Cone')}${lc ? tg(gearStat().lc, lc.id) : ''}</h2>${lc ? rec(lcRow(lc)) : none}${opt(lcA, l => `<div class="alt">${lcRow(l)}</div>`)}
  <h2 style="margin-top:18px">${L('Reliques', 'Relics')}</h2>${rels.length ? rec(relRow(rels[0])) : none}${opt([...relAlt.map(h => ({ h })), ...extraR.map(s => ({ h: sRow(s, s => p4 + s.d[s.d.length - 1]) }))], o => `<div class="alt">${o.h}</div>`)}
  <h2 style="margin-top:18px">${L('Ornements planaires', 'Planar ornaments')}</h2>${orns.length ? rec((() => { const s = RS.find(x => x.id === orns[0]); return s ? sRow(s, s => p2 + s.d[0]) : ''; })()) : none}${opt([...ornAlt, ...extraO], s => `<div class="alt">${sRow(s, s => p2 + s.d[0])}</div>`)}
  <p class="note" style="margin:12px 0 0">${L('Les options facultatives viennent des builds des personnages de la même voie : elles marchent, mais restent un cran en dessous.', 'Optional picks come from the builds of characters on the same path: they work, one notch below.')}</p></div>`;
}

// tier list cônes / reliques
let GP = '', GT = 'lc';
pages.gear = tab => {
  GT = ['lc', 'rel', 'orn'].includes(tab) ? tab : GT;
  const items = () => { const m = gearStat()[GT === 'lc' ? 'lc' : 'st'], src = GT === 'lc' ? LC : RS.filter(s => GT === 'orn' ? s.pl : !s.pl);
    const base = GP && GT === 'lc' ? gearStat().byPathLc[GP] || {} : m;
    const all = Object.values(m).filter(o => src.some(s => s.id === o.id)).sort((a, b) => b.w - a.w);
    return all.filter(o => { if (GT !== 'lc' || !GP) return true; return (lcOf(o.id) || {}).pi === GP; }).map(o => ({ ...o, t: gTier(Object.fromEntries(all.map(x => [x.id, x])), o.id) })); };
  const res = () => { const it = items(), n = (GT === 'lc' ? LC : RS.filter(s => GT === 'orn' ? s.pl : !s.pl)).length;
    const obj = o => GT === 'lc' ? lcOf(o.id) : RS.find(x => x.id === o.id);
    const cell = o => { const x = obj(o); if (!x) return ''; const us = o.u.slice(0, 3).map(i => byId[i]).filter(Boolean);
      return `<div class="gi" title="${esc(x.n)}"><img src="${im(GT === 'lc' ? 'l' : 'r', x.id)}" alt="" loading="lazy"><b>${esc(x.n)}</b><small>${L('Utilisé par ', 'Used by ')}${o.u.length}</small><span class="gu">${us.map(u => `<a href="#/perso/${u.id}" title="${esc(u.n)}"><img src="${im('c', u.id)}" alt=""></a>`).join('')}</span></div>`; };
    return `<div class="tl2 s">${TIERS.map(t => { const r = it.filter(o => o.t === t); return `<div class="trw" style="grid-template-columns:96px minmax(0,1fr);--tc:var(${TV[t]})"><div class="tlb"><b>${TN[t]}</b><em>${L(TBR[t][0], TBR[t][1])}</em><small>${r.length}</small></div><div class="tcell gcell">${r.map(cell).join('') || '<span class="empty">—</span>'}</div></div>`; }).join('')}</div><p class="note">${L(`${it.length} sur ${n} affichés : seuls ceux recommandés dans au moins un build sont classés.`, `${it.length} of ${n} shown: only items recommended in at least one build are ranked.`)}</p>`; };
  const tabs = [['lc', L('Cônes de lumière', 'Light Cones'), 'cone'], ['rel', L('Sets de reliques', 'Relic sets'), 'box'], ['orn', L('Ornements planaires', 'Planar ornaments'), 'box']];
  return [`<h1>${L('Tier list équipement', 'Gear tier list')}</h1><p class="lead">${L('Calculée par le site : un cône ou un set monte quand il est recommandé aux personnages les mieux classés. Ce n’est pas un classement officiel ni celui d’un autre site.', 'Computed by the site: a cone or set rises when it is recommended for the highest-ranked characters. It is not an official ranking nor another site’s.')}</p>
  <div class="bigtabs">${tabs.map(t => `<button class="${GT === t[0] ? 'on' : ''}" data-gt="${t[0]}">${ico(t[2])}${t[1]}</button>`).join('')}</div>
  ${GT === 'lc' ? `<div class="fl"><span class="lab">${L('Voie', 'Path')}</span><button class="chip ${GP === '' ? 'on' : ''}" data-gp="">${L('Toutes', 'All')}</button>${uniq(LC, 'pi').map(x => `<button class="chip ${GP === x ? 'on' : ''}" data-gp="${x}">${pN(x)}</button>`).join('')}</div>` : ''}<div id="gres">${res()}</div>`, null, () => { const el = document.getElementById('gres').parentElement;
    const re = () => { const g = $('#gres'); if (g) g.innerHTML = res(); };
    el.querySelectorAll('[data-gt]').forEach(b => b.onclick = () => { location.hash = '#/gear/' + b.dataset.gt; });
    el.querySelectorAll('[data-gp]').forEach(b => b.onclick = () => { GP = b.dataset.gp; el.querySelectorAll('[data-gp]').forEach(x => x.classList.toggle('on', x === b)); re(); });
  }];
};

// carte de survol : tiers par mode
(() => {
  let tip; const ensure = () => tip || (tip = Object.assign(document.createElement('div'), { id: 'htip' }), document.body.appendChild(tip), tip);
  const show = (a) => { const m = /#\/perso\/(\w+)/.exec(a.getAttribute('href') || ''), c = m && byId[m[1]]; if (!c || !c.tr) return hide();
    const t = ensure(), ch = (k, l) => `<span><em>${l}</em>${c.tr[k] ? tchip(c.tr[k]) : '<i class="na">—</i>'}</span>`;
    t.innerHTML = `<img src="${im('c', c.id)}" alt=""><div><b>${esc(c.n)}</b><small>${eN(c.ei)} · ${pN(c.pi)}</small><div class="hrow">${ch('ov', L('Global', 'Overall'))}${ch('moc', 'MoC')}${ch('pf', 'PF')}${ch('as', 'AS')}</div></div>`;
    const r = a.getBoundingClientRect(), w = 270; let x = Math.min(innerWidth - w - 10, Math.max(10, r.left + r.width / 2 - w / 2)), y = r.top - 92; if (y < 8) y = r.bottom + 8;
    t.style.cssText = `left:${x}px;top:${y}px`; t.classList.add('on'); };
  const hide = () => tip && tip.classList.remove('on');
  document.addEventListener('mouseover', e => { if (matchMedia('(hover:none)').matches) return; const a = e.target.closest && e.target.closest('a.cd,a.tc'); a ? show(a) : hide(); });
  document.addEventListener('scroll', hide, true); window.addEventListener('hashchange', hide);
})();

// End game : refonte
const EG_EL = { Quantum: '#8a7cf0', Imaginary: '#e8d34a', Fire: '#f06a4a', Ice: '#6ad0f0', Lightning: '#c07cf0', Wind: '#4ad0a0', Physical: '#c8c8c8' };
pages.end = m => {
  m = m || 'moc'; const MM = (LANG === 'en' && D.manual.modes_en) || D.manual.modes, M = MM[m] || ['Anomaly Arbitration', L('Mode de combat récurrent.', 'Recurring combat mode.')];
  const eg = ((D.manual.endgame || {}).modes || {})[m], note = (D.manual.endgame || {})['note_' + (LANG === 'en' ? 'en' : 'fr')] || '';
  const SCH = (LANG === 'en' && D.manual.schedule_en) || D.manual.schedule, sch = SCH.filter(r => r[0].includes(M[0]));
  const res = () => board([[null, D.tiers[m], m]]);
  const col = (eg && EG_EL[eg.el]) || '#c9a24a';
  const tl = sch.map((r, i) => `<div class="tlp ${i === 0 ? 'now' : ''}"><i></i><b>${esc(r[0].replace(M[0], '').trim() || L('Phase en cours', 'Current phase'))}</b><span>${esc(r[1])} → ${esc(r[2])}</span></div>`).join('');
  const hero = eg ? `<section class="egh" style="--ec:${col}"><div class="egi" aria-hidden="true"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" stroke-width="1.2" stroke-dasharray="3 5"/><circle cx="60" cy="60" r="34" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M60 22 68 52 98 60 68 68 60 98 52 68 22 60 52 52Z" fill="currentColor" opacity=".85"/></svg></div><div><span class="lab">${L('Phase en cours', 'Current phase')}</span><h2>« ${esc(eg.phase)} »</h2><p>${L('Jusqu’au ', 'Until ')}${esc(LANG === 'en' ? eg.until_en : eg.until)}</p></div></section>
  ${sec(L('Les boss à battre', 'Bosses to beat'))}<div class="bossg">${eg.bosses.map(x => `<div class="boss" style="--ec:${col}">${x.img ? `<img src="${esc(x.img)}" alt="">` : `<div class="bph" aria-hidden="true">☠</div>`}<span class="lab">${esc(LANG === 'en' ? x.ef : x.f)}</span><b>${esc(LANG === 'en' ? x.e : x.n)}</b></div>`).join('')}</div>
  ${sec(L('Comment les battre', 'How to beat them'))}<div class="card"><ul class="tipl">${(eg['tips_' + (LANG === 'en' ? 'en' : 'fr')] || []).map(t => `<li>${esc(t)}</li>`).join('')}</ul></div><p class="note">${esc(note)}</p>` : '';
  const tm = ['moc', 'pf', 'as'].includes(m) ? m : 'ov', TT = teamsAll(), best = ((TT.ranks || {})[tm] || []).slice(0, 6);
  const teamsSec = best.length ? sec(L('Équipes conseillées pour cet event', 'Recommended teams for this event')) + `<p class="sub">${L('Les mieux classées pour ce mode. Pour Memory of Chaos et Anomaly Arbitration, il faut deux équipes sans personnage en commun : choisissez-en deux qui ne se chevauchent pas.', 'Best ranked for this mode. Memory of Chaos and Anomaly Arbitration need two teams with no shared character: pick two that do not overlap.')}</p><div class="tlist">${best.map(e => teamRow(e, tm)).join('')}</div><p class="note"><a href="#/teamtier">${L('Voir toute la tier list des équipes', 'See the full team tier list')} →</a></p>` : '';
  return [`<h1>${esc(M[0])}</h1><p class="lead">${esc(M[1])}</p>${hero}${teamsSec}${tl ? sec(L('Calendrier', 'Schedule')) + `<div class="tlh">${tl}</div>` : ''}${D.tiers[m] ? sec(L('Classement des personnages', 'Character ranking')) + tierOpts() + cbar() + `<div id="res">${res()}</div>` : ''}
  <p class="note">${L('Classement : Game8. Guides détaillés : ', 'Ranking: Game8. Detailed guides: ')}${D.manual.guides.map(g => `<a href="${g.u}" target="_blank" rel="noopener">${esc(LANG === 'en' && g.t_en || g.t)}</a>`).join(' · ')}</p>`, D.tiers[m] ? res : null];
};

// ------------------------------------------------------------ profil v2
const ELC = { Fire: '#f06a4a', Ice: '#6ad0f0', Thunder: '#c07cf0', Wind: '#4ad0a0', Quantum: '#8a7cf0', Imaginary: '#e8d34a', Physical: '#c8c8c8' };
const WISH = { get: () => store.get('astro_wish', []).filter(i => byId[i]), set: a => store.set('astro_wish', a) };
const RANKS = [[0, 'Passager', 'Passenger'], [25, 'Voyageur', 'Traveler'], [70, 'Explorateur', 'Explorer'], [140, 'Navigateur', 'Navigator'], [240, 'Trailblazer', 'Trailblazer'], [380, 'Légende du Train', 'Express Legend']];
document.addEventListener('click', e => {
  const m = $('#pmenu'); if (!m) return;
  if (e.target.closest('#pmb')) { m.hidden = !m.hidden; return; }
  if (!e.target.closest('#pmenu') || e.target.closest('#pmenu a, #pmenu button')) m.hidden = true;
});
window.addEventListener('hashchange', () => { const m = $('#pmenu'); if (m) m.hidden = true; });
document.addEventListener('keydown', e => { if (e.key === 'Escape') { const m = $('#pmenu'); if (m) m.hidden = true; } });
pages.profil = tab => {
  if (tab === 'set' || tab === 'settings') return pages.settings();
  tab = tab || 'ov';
  const own = Object.keys(prof.col).filter(i => byId[i]), n5 = own.filter(i => byId[i].r === 5).length, eids = own.reduce((s, i) => s + prof.col[i], 0), bs = badgesOf(myBadgeStats()), bok = bs.filter(b => b.ok);
  const pts = own.length + n5 * 3 + eids + bok.length * 5, ri = RANKS.reduce((r, x, i) => pts >= x[0] ? i : r, 0), nx = RANKS[ri + 1], rk = RANKS[ri];
  const name = prof.name || (user ? user.email.split('@')[0] : L('Voyageur', 'Traveler')), since = user ? L('Membre depuis le ', 'Member since ') + new Date(user.created_at).toLocaleDateString(LOC()) : L('Profil local, enregistré dans ce navigateur', 'Local profile, saved in this browser');
  const elCount = {}; own.forEach(i => elCount[byId[i].ei] = (elCount[byId[i].ei] || 0) + 1);
  const topEl = Object.keys(elCount).sort((a, b) => elCount[b] - elCount[a])[0], av = prof.avatar && byId[prof.avatar], col = ELC[(av && av.ei) || topEl] || '#d8b25a';
  const streak = (store.get('astro_daily2', {}) || {}).streak || 0, wish = WISH.get();
  const avatarHtml = photoOk(prof.photo) ? `<img class="av" src="${prof.photo}" alt="">` : av ? `<img class="av" src="${im('c', av.id)}" alt="">` : `<div class="av">${esc(name[0].toUpperCase())}</div>`;
  const tabs = [['ov', L('Aperçu', 'Overview'), 'user'], ['col', L('Collection', 'Collection'), 'users'], ['fav', L('Favoris', 'Favourites'), 'star'], ['teams', L('Mes équipes possibles', 'My possible teams'), 'cmp'], ['goals', L('Objectifs', 'Goals'), 'trophy']];
  const pubUrl = prof.pub && prof.handle ? location.href.split('#')[0] + '#/community/' + prof.handle : '';
  const hero = `<section class="pfh" style="--pc:${col}"><div class="pfa"><button class="pfav" data-pavt="1" title="${L('Changer d’avatar', 'Change avatar')}">${avatarHtml}<span>✎</span></button></div><div class="pfi"><span class="rkc">✦ ${esc(L(rk[1], rk[2]))}</span><h1>${esc(name)}</h1>${prof.handle ? `<small class="hdl">@${esc(prof.handle)}</small>` : ''}<p class="pbio">${esc(prof.bio || L('Ajoutez une présentation dans les paramètres.', 'Add a bio in the settings.'))}</p><span class="sub">${since}</span>
    <div class="xpb" title="${pts} pts"><i style="width:${nx ? Math.round((pts - rk[0]) / (nx[0] - rk[0]) * 100) : 100}%"></i></div><small class="sub">${nx ? L(`${nx[0] - pts} pts avant « ${nx[1]} »`, `${nx[0] - pts} pts to “${nx[2]}”`) : L('Rang maximum atteint', 'Max rank reached')} · ${L('1 pt par personnage, 3 par 5★, 1 par éidolon, 5 par succès', '1 pt per character, 3 per 5★, 1 per eidolon, 5 per achievement')}</small></div>
    <div class="pfx"><a class="btn" href="#/settings">${ico('cog')} ${L('Modifier', 'Edit')}</a><button class="btn" data-pshare="1">${ico('share')} ${L('Partager', 'Share')}</button>${pubUrl ? `<a class="btn" href="#/community/${esc(prof.handle)}">${L('Page publique', 'Public page')}</a>` : ''}</div></section>
    <div class="card" id="pavp" hidden><b>${L('Choisissez votre avatar', 'Pick your avatar')}</b><div class="grid" style="max-height:230px;overflow:auto;margin-top:10px">${C.map(c => `<button class="cd s ${prof.avatar === c.id ? 'on' : ''}" data-av="${c.id}"><span class="pt"><img src="${im('c', c.id)}" alt="" loading="lazy"></span></button>`).join('')}</div></div>
    ${!sb || user ? '' : `<div class="card" style="display:flex;gap:14px;align-items:center;flex-wrap:wrap"><span>${L('Connectez-vous pour retrouver votre collection et vos favoris sur tous vos appareils.', 'Log in to keep your collection and favourites on all your devices.')}</span><button class="btn pri" id="login">${L('Connexion', 'Log in')}</button></div>`}
    <div class="bigtabs">${tabs.map(t => `<a class="${tab === t[0] ? 'on' : ''}" href="#/profil/${t[0] === 'ov' ? '' : t[0]}">${ico(t[2])}${t[1]}</a>`).join('')}</div>`;
  let body = '', res = null;
  if (tab === 'ov') {
    const pct = Math.round(own.length / C.length * 100), st = (l, v, sub = '') => `<div class="stat"><span class="lab">${l}</span><b>${v}</b>${sub ? `<small class="sub">${sub}</small>` : ''}</div>`;
    const els = Object.keys(ELC), bar = (label, n, tot, c) => `<div class="pbar"><span>${label}</span><div><i style="width:${tot ? Math.round(n / tot * 100) : 0}%;background:${c}"></i></div><em>${n}/${tot}</em></div>`;
    const paths = uniq(C, 'pi'), top = own.map(i => byId[i]).sort((a, b) => tval(b, 'ov') - tval(a, 'ov') || b.r - a.r).slice(0, 6);
    const shw = (prof.show || []).filter(s => s && byId[s.c]);
    body = `<div class="g3 pst">${st(L('Collection', 'Collection'), own.length + ' / ' + C.length, pct + ' %')}${st(L('5★ possédés', '5★ owned'), n5)}${st(L('Éidolons cumulés', 'Total eidolons'), eids)}${st(L('Éidolon 6', 'E6'), own.filter(i => prof.col[i] >= 6).length)}${st(L('Favoris', 'Favourites'), fav.char.length + fav.build.length)}${st(L('Série de routine', 'Routine streak'), streak + ' ' + L('j', 'd'))}</div>
    <div class="g"><div class="card"><h2>${L('Par élément', 'By element')}</h2>${els.map(e => bar(eN(e), own.filter(i => byId[i].ei === e).length, C.filter(c => c.ei === e).length, ELC[e])).join('')}</div>
    <div class="card"><h2>${L('Par voie', 'By path')}</h2>${paths.map(p => bar(pN(p), own.filter(i => byId[i].pi === p).length, C.filter(c => c.pi === p).length, col)).join('')}</div></div>
    ${sec(L('Mes meilleurs personnages', 'My best characters'))}${top.length ? `<div class="grid">${top.map(c => tile(c, { sub: 'E' + prof.col[c.id] + ' · ' + TN[(c.tr && c.tr.ov) || c.t] })).join('')}</div>` : `<p class="sub">${L('Ajoutez des personnages dans « Collection ».', 'Add characters in “Collection”.')}</p>`}
    ${sec(L('Ma vitrine', 'My showcase'), `<a href="#/settings">${L('Modifier', 'Edit')} →</a>`)}${shw.length ? `<div class="grid">${shw.map(s => tile(byId[s.c], { sub: esc(s.t || '') })).join('')}</div>` : `<p class="sub">${L('Choisissez jusqu’à 6 personnages à mettre en avant dans les paramètres.', 'Choose up to 6 characters to highlight in the settings.')}</p>`}
    ${badgesHtml(myBadgeStats())}`;
  } else if (tab === 'goals') {
    const miss = C.filter(c => !(c.id in prof.col) && c.r === 5).sort((a, b) => tval(b, 'ov') - tval(a, 'ov')).slice(0, 6), nxt = badgesOf(myBadgeStats()).filter(b => !b.ok).slice(0, 4), nb = typeof nxChar === 'function' ? nxChar() : null;
    body = `${sec(L('Liste de souhaits', 'Wish list'))}<div class="card"><div style="display:flex;gap:8px;flex-wrap:wrap"><select id="wsel"><option value="">${L('Ajouter un personnage…', 'Add a character…')}</option>${[...C].sort((a, b) => a.n.localeCompare(b.n)).filter(c => !wish.includes(c.id)).map(c => `<option value="${c.id}">${esc(c.n)}</option>`).join('')}</select><button class="btn pri" data-wadd="1">${L('Ajouter', 'Add')}</button></div>${wish.length ? `<div class="grid" style="margin-top:12px">${wish.map(i => `<div style="width:88px">${tile(byId[i], { s: 1 })}<button class="btn" data-wdel="${i}" style="width:100%;margin-top:4px;padding:3px">✕</button></div>`).join('')}</div><p class="note">${L('Gardée dans ce navigateur. Utilisez le planificateur de tirages pour estimer vos chances.', 'Kept in this browser. Use the pull planner to estimate your odds.')} <a href="#/plan">${L('Tirages', 'Pull planner')} →</a></p>` : `<p class="sub">${L('Vide pour l’instant.', 'Empty for now.')}</p>`}</div>
    ${sec(L('Les mieux classés qui vous manquent (5★)', 'Top-ranked 5★ you are missing'))}${miss.length ? `<div class="grid">${miss.map(c => tile(c, { sub: TN[(c.tr && c.tr.ov) || c.t] })).join('')}</div><p class="note">${L('D’après la tier list. Pensez à vérifier les bannières à venir avant de dépenser.', 'Based on the tier list. Check upcoming banners before spending.')} <a href="#/banners">${L('Bannières', 'Banners')} →</a></p>` : `<p class="sub">${L('Vous avez tous les 5★ !', 'You own every 5★!')}</p>`}
    ${sec(L('Prochains succès', 'Next achievements'))}<div class="bdgs">${nxt.map(b => `<div class="bdg"><i>·</i><b>${esc(L(b.fr, b.en))}</b><small>${esc(L(b.dfr, b.den))}</small></div>`).join('') || `<span class="sub">${L('Tout est débloqué !', 'All unlocked!')}</span>`}</div>`;
  } else { const r = profOld(tab); body = r[0]; res = r[1]; }
  return [hero + body, res, () => { if (tab === 'teams') { } }];
};
document.addEventListener('click', e => {
  if (e.target.closest('[data-pavt]')) { const p = $('#pavp'); if (p) p.hidden = !p.hidden; }
  if (e.target.closest('[data-pshare]')) { const u = prof.pub && prof.handle ? location.href.split('#')[0] + '#/community/' + prof.handle : location.href.split('#')[0]; shareSite(u); }
  if (e.target.closest('[data-wadd]')) { const v = $('#wsel') && $('#wsel').value; if (v) { const w = WISH.get(); if (!w.includes(v)) w.push(v); WISH.set(w); render(); } }
  const d = e.target.closest('[data-wdel]'); if (d) { WISH.set(WISH.get().filter(i => i !== d.dataset.wdel)); render(); }
});
// ------------------------------------------------------------ v9 : rappels, évaluateur de reliques, image de build, compte à rebours, mobile, train
// --- rappels génériques (End game, événements)
function remGen(id, label, endIso) { const b = { start: id, chars: [], end: endIso, label }; remAdd(b); remIcs(b); }
document.addEventListener('click', e => {
  const g = e.target.closest('[data-remg]'); if (g) { const m = ((D.manual.endgame || {}).modes || {})[g.dataset.remg]; if (m && m.until_iso) { remGen('eg-' + g.dataset.remg + '-' + m.until_iso, m.phase + ' (' + g.dataset.nm + ')', m.until_iso); g.textContent = '✓ ' + L('Rappel ajouté', 'Reminder added'); } }
  const v = e.target.closest('[data-reme]'); if (v) { const ev = (D.events || []).find(x => x.id === v.dataset.reme); if (ev && ev.end) { remGen('ev-' + ev.id, ev.title, ev.end + 'T03:00:00Z'); v.textContent = '✓ ' + L('Rappel ajouté', 'Reminder added'); } }
});
{ const _ev = pages.events; pages.events = (...a) => { const r = _ev(...a); return [r[0], r[1], () => { if (r[2]) r[2](); document.querySelectorAll('details.ev').forEach(d => { const t = d.querySelector('summary b'), ev = (D.events || []).find(x => x.title === (t && t.textContent)); if (ev && ev.end && ev.end >= new Date().toISOString().slice(0, 10) && !d.querySelector('[data-reme]')) d.querySelector('div').insertAdjacentHTML('beforeend', `<p><button class="btn" data-reme="${esc(ev.id)}">🔔 ${L('Me rappeler 24 h avant la fin', 'Remind me 24h before the end')}</button></p>`); }); }]; }; }
{ const _end = pages.end; pages.end = (m, ...a) => { const r = _end(m, ...a), eg = (((D.manual.endgame || {}).modes || {})[m || 'moc']); if (!eg || !eg.until_iso || new Date(eg.until_iso) < Date.now()) return r; return [r[0].replace('</section>', `<button class="btn" style="margin-left:auto" data-remg="${m || 'moc'}" data-nm="${esc(((LANG === 'en' && D.manual.modes_en) || D.manual.modes)[m || 'moc'] ? ((LANG === 'en' && D.manual.modes_en) || D.manual.modes)[m || 'moc'][0] : 'End game')}">🔔 ${L('Me rappeler 24 h avant la fin', 'Remind me 24h before the end')}</button></section>`), r[1], r[2]]; }; }

// --- évaluateur de reliques
const RSUB = ['PV', 'PV%', 'ATQ', 'ATQ%', 'DÉF', 'DÉF%', 'VIT', 'Taux crit', 'DGT crit', 'Taux d’effet', 'Rés. d’effet', 'Effet de rupture'];
const RMAIN = { head: ['PV'], hands: ['ATQ'], body: ['PV%', 'ATQ%', 'DÉF%', 'Taux crit', 'DGT crit', 'Soins', 'Taux d’effet'], feet: ['PV%', 'ATQ%', 'DÉF%', 'VIT'], sphere: ['PV%', 'ATQ%', 'DÉF%', 'DGT Feu', 'DGT Glace', 'DGT Foudre', 'DGT Vent', 'DGT Physique', 'DGT Quantique', 'DGT Imaginaire'], rope: ['PV%', 'ATQ%', 'DÉF%', 'Effet de rupture', 'Recharge d’énergie'] };
let RE = { c: '', slot: 'body', main: '', set: '', subs: [{ s: '', u: 0 }, { s: '', u: 0 }, { s: '', u: 0 }, { s: '', u: 0 }] };
const slotL = () => ({ head: L('Tête', 'Head'), hands: L('Mains', 'Hands'), body: L('Corps', 'Body'), feet: L('Bottes', 'Feet'), sphere: L('Sphère', 'Sphere'), rope: L('Corde', 'Rope') });
function relEval() {
  const c = byId[RE.c], b = c && c.b; if (!b) return `<p class="sub">${L('Choisissez un personnage qui a un build.', 'Pick a character that has a build.')}</p>`;
  const W = [1, .8, .6, .45, .3], wt = s => { const i = b.subs.indexOf(s); if (i >= 0) return W[Math.min(i, 4)]; const flat = { 'ATQ': 'ATQ%', 'PV': 'PV%', 'DÉF': 'DÉF%' }[s]; return flat && b.subs.includes(flat) ? .12 : 0; };
  const rows = RE.subs.filter(x => x.s && x.s !== RE.main), top = [...RSUB].filter(s => s !== RE.main).map(wt).sort((a, z) => z - a);
  if (!rows.length) return `<p class="sub">${L('Ajoutez au moins une sous-statistique.', 'Add at least one substat.')}</p>`;
  const got = rows.reduce((t, x) => t + wt(x.s) * (1 + (+x.u || 0)), 0), ideal = top.slice(0, 4).reduce((t, v) => t + v, 0) + 5 * top[0];
  let pct = Math.max(0, Math.min(100, Math.round(got / ideal * 100)));
  const slotOk = !RMAIN[RE.slot] || RE.slot === 'head' || RE.slot === 'hands' ? true : (b.parts[RE.slot] || []).includes(RE.main) || !(b.parts[RE.slot] || []).length;
  const setOk = !RE.set || (RE.slot === 'sphere' || RE.slot === 'rope' ? (b.orn || []).includes(RE.set) : (b.rel || []).flat().includes(RE.set));
  if (!slotOk) pct = Math.min(pct, 35);
  const v = pct >= 75 ? [L('Excellente : à garder et à monter', 'Excellent: keep and level it'), '--SS'] : pct >= 55 ? [L('Bonne : à monter sans hésiter', 'Good: worth levelling'), '--A'] : pct >= 35 ? [L('Correcte : une pièce de transition', 'Decent: a stopgap piece'), '--S'] : pct >= 18 ? [L('Faible : à remplacer dès que possible', 'Weak: replace when you can'), '--Sp'] : [L('À remplacer', 'Replace it'), '--C'];
  return `<div class="rv" style="--tc:var(${v[1]})"><div class="rvs"><b>${pct}<small>%</small></b><span>${L('adéquation', 'fit')}</span></div><div class="rvt"><b>${v[0]}</b><div class="xpb"><i style="width:${pct}%;background:var(${v[1]})"></i></div>
  <ul class="tipl"><li>${slotOk ? L('Statistique principale adaptée.', 'Main stat fits.') : L('Statistique principale non recommandée pour ce personnage : ', 'Main stat not recommended for this character: ') + esc(stx((b.parts[RE.slot] || []).join(' / ')))}</li>
  ${RE.set ? `<li>${setOk ? L('Le set fait partie du build conseillé.', 'The set is part of the recommended build.') : L('Le set n’est pas dans le build conseillé (voir les options facultatives).', 'The set is not in the recommended build (see optional picks).')}</li>` : ''}
  ${rows.map(x => `<li>${esc(stx(x.s))}${+x.u ? ' +' + x.u : ''} : ${wt(x.s) >= .8 ? L('très utile', 'very useful') : wt(x.s) >= .45 ? L('utile', 'useful') : wt(x.s) > .12 ? L('secondaire', 'minor') : wt(x.s) > 0 ? L('peu utile (valeur fixe)', 'low value (flat)') : L('inutile pour ce personnage', 'useless for this character')}</li>`).join('')}</ul>
  <p class="note">${L('Sous-stats qui comptent pour ' + c.n + ' : ', 'Substats that matter for ' + c.n + ': ')}${esc(b.subs.slice(0, 4).map(stx).join(' > '))}. ${L('Estimation selon le build du site, pas un calcul de dégâts.', 'Estimate based on the site’s build, not a damage calculation.')}</p></div></div>`;
}
pages.relic = () => {
  if (!RE.c) RE.c = (C.find(c => c.b && fav.char.includes(c.id)) || C.find(c => c.b) || {}).id;
  const draw = () => { const c = byId[RE.c], b = c && c.b, mains = RMAIN[RE.slot]; if (!mains.includes(RE.main)) RE.main = (b && (b.parts[RE.slot] || [])[0] && mains.includes(b.parts[RE.slot][0]) ? b.parts[RE.slot][0] : mains[0]);
    const sets = RS.filter(s => !!s.pl === (RE.slot === 'sphere' || RE.slot === 'rope')), rec = b ? ((RE.slot === 'sphere' || RE.slot === 'rope') ? b.orn || [] : (b.rel || []).flat()) : [];
    const sl = slotL();
    $('#rform').innerHTML = `<div class="g"><div><label class="lab">${L('Personnage', 'Character')}</label><select id="rc">${C.filter(x => x.b).sort((a, z) => a.n.localeCompare(z.n)).map(x => `<option value="${x.id}" ${x.id === RE.c ? 'selected' : ''}>${esc(x.n)}</option>`).join('')}</select>
      <label class="lab">${L('Pièce', 'Piece')}</label><select id="rsl">${Object.keys(sl).map(k => `<option value="${k}" ${k === RE.slot ? 'selected' : ''}>${sl[k]}</option>`).join('')}</select>
      <label class="lab">${L('Statistique principale', 'Main stat')}</label><select id="rm">${mains.map(m => `<option value="${m}" ${m === RE.main ? 'selected' : ''}>${esc(stx(m))}</option>`).join('')}</select>
      <label class="lab">${L('Set de la pièce (facultatif)', 'Piece set (optional)')}</label><select id="rset"><option value="">—</option>${[...sets].sort((a, z) => (rec.includes(z.id) ? 1 : 0) - (rec.includes(a.id) ? 1 : 0) || a.n.localeCompare(z.n)).map(s => `<option value="${s.id}" ${s.id === RE.set ? 'selected' : ''}>${rec.includes(s.id) ? '★ ' : ''}${esc(s.n)}</option>`).join('')}</select></div>
    <div><label class="lab">${L('Sous-statistiques et nombre de montées (+)', 'Substats and number of upgrades (+)')}</label>${RE.subs.map((x, i) => `<div class="slot"><select data-rs="${i}"><option value="">—</option>${RSUB.filter(s => s !== RE.main).map(s => `<option value="${s}" ${s === x.s ? 'selected' : ''}>${esc(stx(s))}</option>`).join('')}</select><select data-ru="${i}" style="max-width:80px">${[0, 1, 2, 3, 4, 5].map(n => `<option value="${n}" ${+x.u === n ? 'selected' : ''}>+${n}</option>`).join('')}</select></div>`).join('')}</div></div>`;
    $('#rres').innerHTML = relEval();
    $('#rc').onchange = e => { RE.c = e.target.value; RE.set = ''; draw(); }; $('#rsl').onchange = e => { RE.slot = e.target.value; RE.set = ''; draw(); };
    $('#rm').onchange = e => { RE.main = e.target.value; draw(); }; $('#rset').onchange = e => { RE.set = e.target.value; $('#rres').innerHTML = relEval(); };
    document.querySelectorAll('[data-rs]').forEach(el => el.onchange = e => { RE.subs[+el.dataset.rs].s = e.target.value; $('#rres').innerHTML = relEval(); });
    document.querySelectorAll('[data-ru]').forEach(el => el.onchange = e => { RE.subs[+el.dataset.ru].u = +e.target.value; $('#rres').innerHTML = relEval(); });
  };
  return [`<h1>${L('Évaluateur de reliques', 'Relic checker')}</h1><p class="lead">${L('Choisissez un personnage, saisissez une relique et le site dit si elle vaut la peine d’être montée.', 'Pick a character, enter a relic and the site tells you if it is worth levelling.')}</p><div class="card" id="rform"></div><div class="card" id="rres"></div>`, null, draw];
};

// --- image de build à partager
async function buildImage(c) {
  const b = c.b, W = 1200, H = 675, cv = document.createElement('canvas'); cv.width = W; cv.height = H; const g = cv.getContext('2d');
  const load = src => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = src; });
  try { await Promise.all([document.fonts.load('700 40px Rajdhani'), document.fonts.load('400 20px Jost'), document.fonts.load('600 20px Jost')]); } catch { }
  const fit = (t, w) => { let o = t; while (g.measureText(t).width > w && t.length > 4) t = t.slice(0, -1); return t === o ? t : t.trim() + '…'; };
  const bg = g.createLinearGradient(0, 0, W, H); bg.addColorStop(0, '#0e1226'); bg.addColorStop(1, '#241a3f'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
  g.strokeStyle = 'rgba(230,185,94,.28)'; g.lineWidth = 2; g.strokeRect(14, 14, W - 28, H - 28);
  const [pimg, lcImg] = await Promise.all([load(im('p', c.id)), b.lc ? load(im('l', b.lc)) : null]);
  if (pimg) { const h = H - 40, w = pimg.width * h / pimg.height; g.save(); g.beginPath(); g.rect(20, 20, 420, H - 40); g.clip(); g.drawImage(pimg, 20 + (420 - w) / 2, 20, w, h); g.restore(); const fd = g.createLinearGradient(300, 0, 440, 0); fd.addColorStop(0, 'rgba(14,18,38,0)'); fd.addColorStop(1, '#0e1226'); g.fillStyle = fd; g.fillRect(300, 20, 140, H - 40); }
  const X = 470; g.fillStyle = '#f3d48f'; g.font = '700 54px Rajdhani, sans-serif'; g.fillText(c.n, X, 82);
  g.fillStyle = '#b9bfd6'; g.font = '500 22px Jost, sans-serif'; g.fillText(eN(c.ei) + ' · ' + pN(c.pi) + ' · ' + (c.r) + '★ · ' + (TN[(c.tr && c.tr.ov) || c.t] || ''), X, 118);
  const sect = (t, y) => { g.fillStyle = '#e6b95e'; g.font = '700 20px Rajdhani, sans-serif'; g.fillText(t.toUpperCase(), X, y); };
  sect(L('Cône de lumière', 'Light Cone'), 168); const lc = lcOf(b.lc);
  if (lcImg) g.drawImage(lcImg, X, 180, 64, 64); g.fillStyle = '#fff'; g.font = '600 24px Jost, sans-serif'; if (lc) g.fillText(fit(lc.n, 380), X + 78, 220);
  sect(L('Reliques', 'Relics'), 282); let y = 300; const items = [...(b.rel || []).slice(0, 1).flat().filter((v, i, a) => a.indexOf(v) === i), ...(b.orn || []).slice(0, 1)];
  const imgs = await Promise.all(items.map(i => load(im('r', i)))); items.forEach((id, k) => { const s = RS.find(x => x.id === id); if (!s) return; const rel4 = (b.rel || [])[0] && b.rel[0][0] === b.rel[0][1]; if (imgs[k]) g.drawImage(imgs[k], X, y, 56, 56); g.fillStyle = '#fff'; g.font = '600 22px Jost, sans-serif'; g.fillText(fit(s.n, 380), X + 70, y + 36); y += 64; });
  sect(L('Statistiques', 'Stats'), y + 22); g.fillStyle = '#dfe3f2'; g.font = '500 20px Jost, sans-serif';
  const sl = { body: L('Corps', 'Body'), feet: L('Bottes', 'Feet'), sphere: L('Sphère', 'Sphere'), rope: L('Corde', 'Rope') }; let yy = y + 50;
  Object.keys(sl).forEach(k => { g.fillStyle = '#8f99bd'; g.fillText(sl[k], X, yy); g.fillStyle = '#fff'; g.fillText((b.parts[k] || []).map(stx).join(' / ') || '—', X + 110, yy); yy += 28; });
  g.fillStyle = '#8f99bd'; g.fillText(L('Sous-stats', 'Substats'), X, yy + 6); g.fillStyle = '#fff'; g.fillText(b.subs.slice(0, 4).map(stx).join(' > '), X + 110, yy + 6);
  const t0 = (b.teams || [])[0]; if (t0) { const ids = [c.id, ...t0.map(m => m.c).filter(i => i !== c.id)].slice(0, 4), fi = await Promise.all(ids.map(i => load(im('c', i)))); fi.forEach((im_, k) => { if (im_) g.drawImage(im_, 880 + (k % 2) * 140, 120 + Math.floor(k / 2) * 150 - 0, 130, 130); }); g.fillStyle = '#e6b95e'; g.font = '700 20px Rajdhani, sans-serif'; g.fillText(L('ÉQUIPE CONSEILLÉE', 'RECOMMENDED TEAM'), 880, 100); }
  g.fillStyle = '#8f99bd'; g.font = '500 18px Jost, sans-serif'; g.fillText('Astrolabe · ' + L('guide non officiel Honkai: Star Rail · ', 'unofficial Honkai: Star Rail guide · ') + location.host + location.pathname.replace(/\/$/, ''), X, H - 36);
  return new Promise(r => cv.toBlob(r, 'image/png'));
}
document.addEventListener('click', async e => {
  const t = e.target.closest('[data-bimg]'); if (!t) return; const c = byId[t.dataset.bimg]; if (!c || !c.b) return; const old = t.textContent; t.textContent = '…';
  try { const blob = await buildImage(c), f = new File([blob], 'astrolabe-' + c.id + '.png', { type: 'image/png' });
    if (navigator.canShare && navigator.canShare({ files: [f] }) && matchMedia('(hover:none)').matches) await navigator.share({ files: [f], title: c.n + ' · Astrolabe' }).catch(() => { });
    else { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = f.name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 3000); toast(L('Image téléchargée', 'Image downloaded')); }
  } catch { toast(L('Impossible de créer l’image', 'Could not create the image')); }
  t.textContent = old;
});
{ const _bv = buildView; buildView = function (c) { const h = _bv(c); return c.b ? h + `<p style="margin-top:14px"><button class="btn" data-bimg="${c.id}">${ico('share')} ${L('Créer une image du build à partager', 'Create a shareable build image')}</button></p>` : h; }; }

// --- compte à rebours des bannières
pages.calendar = () => {
  const now = Date.now(), B = ((D.banners && D.banners.list) || []).filter(b => !b.end || new Date(b.end) > now).sort((x, y) => new Date(x.start) - new Date(y.start)), nx = D.banners && D.banners.next;
  const big = (iso, pre) => `<div class="cdb"><span class="lab">${pre}</span><b data-cds="${iso}">—</b></div>`;
  const cards = B.map(b => { const up = new Date(b.start) > now, iso = up ? b.start : b.end; return `<div class="card cdc"><div class="bnimg">${b.chars.map(i => byId[i] ? `<a href="#/perso/${i}"><img src="${im('p', i)}" alt="${esc(byId[i].n)}"></a>` : '').join('')}</div><div><span class="tag">${up ? L('À venir', 'Upcoming') : L('En cours', 'Live')}</span><h2>${b.chars.map(i => byId[i] ? esc(byId[i].n) : '').join(' + ')}</h2>${iso ? big(iso, up ? L('Démarre dans', 'Starts in') : L('Se termine dans', 'Ends in')) : `<p class="sub">${L('Date de fin non annoncée', 'End date not announced')}</p>`}${b.end && !up ? `<button class="btn" data-rem="${B.indexOf(b)}">🔔 ${L('Me rappeler 24 h avant la fin', 'Remind me 24h before the end')}</button>` : ''}</div></div>`; }).join('');
  window.BNL = B;
  const nxh = nx && nx.date ? `<div class="card cdc nxc"><div><span class="tag">${L('Prochaine version', 'Next version')}</span><h2>${L('Version ', 'Version ')}${esc(nx.version)}${nx.name ? ' · ' + esc(nx.name) : ''}</h2>${big(nx.date, L('Sortie dans', 'Releases in'))}<p class="sub">${nx.estimated ? L('Date estimée : elle sera confirmée à l’annonce officielle.', 'Estimated date: it will be confirmed at the official announcement.') : L('Date annoncée.', 'Announced date.')} <a href="#/next">${L('Voir le teaser', 'See the teaser')} →</a></p></div></div>` : '';
  return [`<h1>${L('Compte à rebours', 'Countdown')}</h1><p class="lead">${L('Le temps qu’il reste sur chaque bannière et avant la prochaine version. Heures affichées dans le fuseau de votre appareil.', 'The time left on each banner and until the next version. Times use your device’s time zone.')}</p><div id="cdv"></div>${nxh}${sec(L('Bannières', 'Banners'))}${cards || `<p class="sub">${L('Aucune bannière renseignée.', 'No banner listed.')}</p>`}
  <div id="rer"></div>`, null, async () => {
    const draw = () => document.querySelectorAll('[data-cds]').forEach(e => { let ms = new Date(e.dataset.cds) - Date.now(); if (ms <= 0) { e.textContent = L('terminé', 'ended'); return; } const s = Math.floor(ms / 1000), d = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600), m = Math.floor(s % 3600 / 60), sec_ = s % 60; e.textContent = (d ? d + L(' j ', 'd ') : '') + String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0') + ':' + String(sec_).padStart(2, '0'); });
    draw(); const iv = setInterval(() => { if (!document.querySelector('[data-cds]')) return clearInterval(iv); draw(); }, 1000);
    if (!VER) { try { VER = await fetch('data/versions.json').then(r => r.json()); } catch { } } if (!VER || !$('#rer')) return;
    const last = {}, vs = VER.v.map(v => v.v); VER.v.forEach((v, i) => (v.chars || []).forEach(id => last[id] = i)); const total = VER.v.length, cur = new Set(B.flatMap(b => b.chars));
    const lst = Object.keys(last).filter(id => byId[id] && byId[id].r === 5 && !cur.has(id)).map(id => ({ id, ago: total - 1 - last[id], v: vs[last[id]] })).sort((a, z) => z.ago - a.ago).slice(0, 12);
    $('#rer').innerHTML = sec(L('Absents depuis le plus longtemps', 'Longest without a banner')) + `<p class="sub">${L('Calculé d’après l’historique des versions du site. Ce n’est pas une annonce : seule HoYoverse confirme les rediffusions.', 'Calculated from the site’s version history. It is not an announcement: only HoYoverse confirms reruns.')}</p><div class="grid">${lst.map(x => tile(byId[x.id], { sub: L('v' + x.v + ' · il y a ' + x.ago + ' versions', 'v' + x.v + ' · ' + x.ago + ' versions ago') })).join('')}</div>`;
  }];
};

// --- train animé sur l'accueil
function miniTrain() {
  if (PREF.motion === 'off') return '';
  const car = x => `<g transform="translate(${x} 20)"><rect width="150" height="46" rx="9" fill="#2a2850" stroke="#e6b95e" stroke-opacity=".5"/><rect y="34" width="150" height="4" fill="#e6b95e" opacity=".8"/>${[0, 1, 2, 3, 4].map(i => `<rect x="${10 + i * 27}" y="10" width="16" height="15" rx="3" fill="#f3d48f" opacity=".9"/>`).join('')}<circle cx="28" cy="50" r="6" fill="#14162b" stroke="#e6b95e"/><circle cx="122" cy="50" r="6" fill="#14162b" stroke="#e6b95e"/></g>`;
  return `<div class="htrain" aria-hidden="true"><svg viewBox="0 0 700 80" height="46">${car(0)}${car(158)}${car(316)}<g transform="translate(474 14)"><path d="M0 8a8 8 0 0 1 8-8h110c32 0 62 22 70 58H0z" fill="#332f63" stroke="#e6b95e" stroke-opacity=".7"/><rect x="14" y="12" width="60" height="22" rx="4" fill="#0f1126" opacity=".7"/><circle cx="40" cy="62" r="8" fill="#14162b" stroke="#e6b95e"/><circle cx="100" cy="62" r="8" fill="#14162b" stroke="#e6b95e"/><circle cx="154" cy="62" r="8" fill="#14162b" stroke="#e6b95e"/></g></svg></div>`;
}

// --- barre de navigation mobile
// ------------------------------------------------------------ v28 : barre du bas « application » (propre à chaque univers) + feuille « Plus »
function sectOf(h) { return /^#\/cartes/.test(h) ? 'fv' : /^#\/bleach/.test(h) ? 'bl' : (h === '' || h === '#/' || h === '#/home') ? 'hub' : 'as'; }
const TBAR = {
  hub: () => [['#/home', 'home', L('Accueil', 'Home')], ['#/astrolabe', 'star', 'Astrolabe'], ['#/cartes', 'spark', 'Foilvault'], ['#/bleach', 'swords', 'Bleach'], ['#/profil', 'user', L('Profil', 'Profile')]],
  as: () => [['#/astrolabe', 'star', 'Astrolabe'], ['#/perso', 'users', L('Persos', 'Chars')], ['#/tier', 'crown', 'Tier list'], ['#/calendar', 'clock', L('Bannières', 'Banners')]],
  fv: () => [['#/cartes', 'spark', 'Boosters'], ['#/cartes/mine', 'box', L('Collection', 'Collection')], ['#/cartes/shop', 'gem', L('Boutique', 'Shop')], ['#/cartes/market', 'share', L('Marché', 'Market')]],
  bl: () => [['#/bleach', 'swords', L('Arcs', 'Arcs')], ['#/bleach/tier', 'crown', 'Tier list'], ['#/bleach/persos', 'users', L('Persos', 'Chars')], ['#/bleach/events', 'clock', L('Événements', 'Events')]]
};
const TMORE = {
  fv: () => [['#/cartes/all', L('Catalogue', 'Catalogue')], ['#/cartes/ach', L('Succès', 'Achievements')], ['#/cartes/fight', L('Combats', 'Battles')], ['#/cartes/rank', L('Classement', 'Ranking')]],
  bl: () => [['#/bleach/apercu', L('Aperçu', 'Overview')], ['#/bleach/systeme', L('Système de jeu', 'Game systems')], ['#/bleach/plan', L('Calculateur d’invocations', 'Summon planner')]]
};
const TCOL = { hub: '#0b0d17', as: '#0b0d17', fv: '#04070b', bl: '#0a0a0e' };
function sheetClose() { const m = $('#msheet'); if (m) { m.classList.remove('on'); setTimeout(() => { m.hidden = true; }, 220); } document.body.classList.remove('ms-open'); }
function sheetOpen() {
  const h = location.hash || '#/home', sc = sectOf(h); let m = $('#msheet'); if (!m) { m = document.createElement('div'); m.id = 'msheet'; document.body.appendChild(m); }
  const U = [['#/home', L('Accueil', 'Home'), 'hub'], ['#/astrolabe', 'Astrolabe', 'as'], ['#/cartes', 'Foilvault', 'fv'], ['#/bleach', 'Bleach', 'bl']];
  let links = '';
  if (sc === 'as') { const nav = (window.__NAV || []).slice(1); links = nav.map(g => `<h4>${g[0]}</h4>` + g[1].map(i => `<a href="${i[0]}">${ico(i[1])}<span>${i[2]}</span></a>`).join('')).join(''); }
  else if (TMORE[sc]) links = TMORE[sc]().map(i => `<a href="${i[0]}"><span>${i[1]}</span></a>`).join('');
  links += `<h4>${L('Outils', 'Tools')}</h4><button data-search="1" class="ms-b">${ico('search')}<span>${L('Rechercher', 'Search')}</span></button><a href="#/profil">${ico('user')}<span>${L('Profil et réglages', 'Profile and settings')}</span></a>`;
  m.innerHTML = `<div class="ms-bd" data-msx="1"></div><div class="ms-p" role="dialog" aria-modal="true"><i class="ms-grab"></i><div class="ms-u">${U.map(u => `<a href="${u[0]}" class="${u[2] === sc ? 'on' : ''} u-${u[2]}">${u[1]}</a>`).join('')}</div><div class="ms-l">${links}</div></div>`;
  m.hidden = false; requestAnimationFrame(() => m.classList.add('on')); document.body.classList.add('ms-open');
}
function tabbar() {
  let t = $('#tabbar'); if (!t) { t = document.createElement('nav'); t.id = 'tabbar'; t.setAttribute('aria-label', 'Navigation'); document.body.appendChild(t); }
  const h = location.hash || '#/home', sc = sectOf(h), is = p => h === p || h.startsWith(p + '/');
  const act = i => { const p = i[0]; if (sc === 'hub') return p === '#/home' && (h === '#/home' || h === '#/' || h === '#/home/') || (p !== '#/home' && is(p)); if (p === '#/cartes') return h === '#/cartes' || h === '#/cartes/' || h === '#/cartes/open'; if (p === '#/bleach') return h === '#/bleach' || h === '#/bleach/' || h === '#/bleach/arcs'; if (sc === 'as' && p === '#/tier') return is('#/tier') || is('#/teamtier') || is('#/gear'); if (sc === 'as' && p === '#/calendar') return is('#/calendar') || is('#/banners'); return is(p); };
  const items = TBAR[sc](); const anyOn = items.some(act);
  t.dataset.s = sc;
  t.innerHTML = items.map(i => `<a href="${i[0]}" class="${act(i) ? 'on' : ''}">${ico(i[1])}<span>${i[2]}</span></a>`).join('') + (sc === 'hub' ? '' : `<button data-ms="1" class="${anyOn ? '' : 'on'}" aria-haspopup="dialog">${ico('menu')}<span>${L('Plus', 'More')}</span></button>`);
  const mt = document.querySelector('meta[name="theme-color"]'); if (mt) mt.setAttribute('content', (sc === 'as' || sc === 'hub') ? (getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || TCOL[sc]) : TCOL[sc]);
  sheetClose();
}
document.addEventListener('click', e => { if (e.target.closest('[data-ms]')) { e.preventDefault(); const m = $('#msheet'); if (m && !m.hidden) sheetClose(); else sheetOpen(); } else if (e.target.closest('[data-msx]') || e.target.closest('#msheet a,#msheet .ms-b')) setTimeout(sheetClose, 30); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') sheetClose(); });
try { const st = (matchMedia('(display-mode: standalone)').matches || navigator.standalone === true); document.documentElement.classList.toggle('standalone', st); document.documentElement.classList.toggle('ios', /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)); } catch (e) { }
window.addEventListener('hashchange', tabbar); setTimeout(tabbar, 0); document.addEventListener('click', e => { if (e.target.closest('[data-lang]')) setTimeout(tabbar, 50); });
// ------------------------------------------------------------ v10 : résumé de version, événements, aide, communauté
const VS = { i: -1, spo: store.get('astro_spo', '1') === '1', play: null, q: '' };
const vfmt = d => { if (!d) return ''; const p = d.split('-'); return p.length === 3 ? new Date(+p[0], +p[1] - 1, +p[2]).toLocaleDateString(LOC(), { day: 'numeric', month: 'long', year: 'numeric' }) : new Date(+p[0], +p[1] - 1, 1).toLocaleDateString(LOC(), { month: 'long', year: 'numeric' }); };
pages.versions = arg => [`<section class="hlp vhero"><span class="lab">${L('Histoire du jeu', 'Game story')}</span><h1>${L('Résumé de version', 'Version recap')}</h1><p class="lead">${L('Parcourez l’histoire de Honkai: Star Rail version par version : faites glisser la frise, lancez la lecture ou utilisez les flèches du clavier. Attention : spoilers.', 'Browse the story of Honkai: Star Rail version by version: drag the timeline, press play or use the arrow keys. Beware: spoilers.')}</p></section><div id="vr"><p class="sub">${L('Chargement…', 'Loading…')}</p></div>`, null, async () => {
  const el = $('#vr'); if (!el) return;
  if (!VER) { try { VER = await fetch('data/versions.json').then(r => r.json()); } catch { VER = null; } }
  if (!VER) { el.innerHTML = `<p class="sub">${L('Données indisponibles.', 'Data unavailable.')}</p>`; return; }
  const V = VER.v, A = Object.fromEntries(VER.arcs.map(a => [a.id, a])), cur = parseFloat(D.version || '0'), curI = Math.max(0, V.findIndex(v => parseFloat(v.v) === cur));
  VS.i = arg ? Math.max(0, V.findIndex(v => v.v === arg)) : (VS.i >= 0 && VS.i < V.length ? VS.i : curI);
  const tx = v => LANG === 'en' ? v.en : v.fr, nt = v => (LANG === 'en' ? v.ne : v.nf) || [];
  const match = v => !VS.q || (v.v + ' ' + (v.t || '') + ' ' + tx(v)).toLowerCase().includes(VS.q.toLowerCase());
  const stage = () => { const v = V[VS.i], a = A[v.arc], hero = v.hero && byId[v.hero], pend = v.up || parseFloat(v.v) > cur, hid = !VS.spo && !v.up, newc = (v.chars || []).filter(i => byId[i]);
    return `<article class="vst" style="--vc:${a.c}"><div class="vsart">${hero ? `<img src="${im('p', v.hero)}" alt="">` : `<div class="vq">?</div>`}<b class="vbig">${v.v}</b></div>
    <div class="vsb"><div class="vh"><div><span class="varc">${esc(LANG === 'en' ? a.en : a.fr)}</span><h2>${v.t ? esc(v.t) : L('Version ' + v.v, 'Version ' + v.v)}</h2><span class="sub">${L('Version', 'Version')} ${v.v}${v.d ? ' · ' + vfmt(v.d) : ''}</span></div><div class="vtg">${parseFloat(v.v) === cur ? `<span class="tag tg" style="--tc:var(--ac)">${L('Actuelle', 'Current')}</span>` : pend ? `<span class="tag">${L('À venir', 'Upcoming')}</span>` : ''}${v.ok < 2 && !v.up ? `<span class="tag" title="${L('Peu de sources vérifiées', 'Few verified sources')}">${L('approximatif', 'approx.')}</span>` : ''}</div></div>
    <p class="vt ${hid ? 'hid' : ''}">${esc(tx(v))}</p>${hid ? `<button class="btn" data-vrv="1">${L('Afficher (spoiler)', 'Reveal (spoiler)')}</button>` : ''}
    ${newc.length || (v.cn || []).length ? `<div class="vch"><span class="lab">${L('Nouveaux personnages', 'New characters')}</span><div class="vtiles">${newc.map(i => `<a class="vt1" href="#/perso/${i}"><img src="${im('c', i)}" alt="" loading="lazy"><span>${esc(byId[i].n)}</span></a>`).join('')}${(v.cn || []).map(n => `<span class="vt1 nt"><span>${esc(n)}</span></span>`).join('')}</div></div>` : ''}
    ${nt(v).length ? `<ul class="vnf">${nt(v).map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}</div></article>`; };
  const ctl = () => { const v = V[VS.i];
    return `<div class="vnav"><button class="btn io" data-vp="-1" aria-label="${L('Précédente', 'Previous')}">‹</button><div class="vscr"><input type="range" id="vrg" min="0" max="${V.length - 1}" value="${VS.i}" aria-label="${L('Version', 'Version')}"><div class="varcs">${VER.arcs.map(a => { const n = V.filter(x => x.arc === a.id).length; return `<span style="flex:${n};--vc:${a.c}" title="${esc(LANG === 'en' ? a.en : a.fr)}"></span>`; }).join('')}</div></div><button class="btn io" data-vp="1" aria-label="${L('Suivante', 'Next')}">›</button><button class="btn" data-vplay="1">${VS.play ? '❚❚ ' + L('Pause', 'Pause') : '▶ ' + L('Lecture', 'Play')}</button></div>
    <div class="vctl"><input type="search" id="vq" placeholder="${L('Chercher un mot : Kafka, Penacony…', 'Search a word: Kafka, Penacony…')}" value="${esc(VS.q)}"><div class="seg"><button class="${VS.spo ? 'on' : ''}" data-vs="1">${L('Spoilers visibles', 'Spoilers shown')}</button><button class="${VS.spo ? '' : 'on'}" data-vs="0">${L('Masqués', 'Hidden')}</button></div></div>
    <div class="vchips">${V.map((x, i) => `<button class="vchip ${i === VS.i ? 'on' : ''} ${match(x) ? '' : 'dim'} ${parseFloat(x.v) > cur ? 'fut' : ''}" style="--vc:${A[x.arc].c}" data-vi="${i}" title="${esc(x.t || '')}">${x.v}</button>`).join('')}</div>`; };
  const draw = (keepCtl) => { if (!keepCtl) el.innerHTML = `<div id="vctl">${ctl()}</div><div id="vstage" class="fade">${stage()}</div>`; else { $('#vstage').innerHTML = stage(); $('#vstage').classList.remove('fade'); void $('#vstage').offsetWidth; $('#vstage').classList.add('fade'); document.querySelectorAll('.vchip').forEach((b, i) => b.classList.toggle('on', i === VS.i)); $('#vrg').value = VS.i; const act = document.querySelector('.vchip.on'); if (act && act.scrollIntoView) act.scrollIntoView({ block: 'nearest', inline: 'center' }); }
    bind(); };
  const go = i => { VS.i = Math.max(0, Math.min(V.length - 1, i)); history.replaceState(null, '', '#/versions/' + V[VS.i].v); draw(true); };
  const stop = () => { if (VS.play) { clearInterval(VS.play); VS.play = null; } const b = el.querySelector('[data-vplay]'); if (b) b.textContent = '▶ ' + L('Lecture', 'Play'); };
  const bind = () => {
    el.querySelectorAll('[data-vp]').forEach(b => b.onclick = () => { stop(); go(VS.i + +b.dataset.vp); });
    el.querySelectorAll('[data-vi]').forEach(b => b.onclick = () => { stop(); go(+b.dataset.vi); });
    const rg = $('#vrg'); if (rg) rg.oninput = e => { stop(); go(+e.target.value); };
    el.querySelectorAll('[data-vs]').forEach(b => b.onclick = () => { VS.spo = b.dataset.vs === '1'; store.set('astro_spo', VS.spo ? '1' : '0'); el.querySelectorAll('[data-vs]').forEach(x => x.classList.toggle('on', (x.dataset.vs === '1') === VS.spo)); $('#vstage').innerHTML = stage(); bind(); });
    el.querySelectorAll('[data-vrv]').forEach(b => b.onclick = () => { b.closest('.vsb').querySelector('.vt').classList.remove('hid'); b.remove(); });
    const q = $('#vq'); if (q) q.oninput = e => { VS.q = e.target.value; const m = V.findIndex(match); document.querySelectorAll('.vchip').forEach((b, i) => b.classList.toggle('dim', !match(V[i]))); if (VS.q && m >= 0 && !match(V[VS.i])) go(m); };
    const pl = el.querySelector('[data-vplay]'); if (pl) pl.onclick = () => { if (VS.play) return stop(); pl.textContent = '❚❚ ' + L('Pause', 'Pause'); if (VS.i >= V.length - 1) go(0); VS.play = setInterval(() => { if (!$('#vr')) return stop(); if (VS.i >= V.length - 1) return stop(); go(VS.i + 1); }, 6500); };
  };
  document.onkeydown = e => { if (!$('#vr') || /INPUT|TEXTAREA|SELECT/.test((e.target.tagName || ''))) return; if (e.key === 'ArrowRight') { stop(); go(VS.i + 1); } else if (e.key === 'ArrowLeft') { stop(); go(VS.i - 1); } };
  window.addEventListener('hashchange', () => { stop(); document.onkeydown = null; }, { once: true });
  draw(false);
}];

// ------------------------------------------------------------ événements
let EVF = 'all';
pages.events = () => {
  const today = new Date().toISOString().slice(0, 10), st = e => !e.start || !e.end ? 'guide' : today < e.start ? 'soon' : today > e.end ? 'done' : 'live';
  const all = (D.events || []).filter(e => !e.hidden).map(e => ({ ...evx(e), id: e.id, start: e.start, end: e.end, s: st(e) }));
  const ord = { live: 0, soon: 1, guide: 2, done: 3 }, lst = () => all.filter(e => EVF === 'all' || e.s === EVF).sort((a, b) => ord[a.s] - ord[b.s] || (a.end || '9').localeCompare(b.end || '9'));
  const SL = { live: L('En cours', 'Live'), soon: L('À venir', 'Upcoming'), done: L('Terminé', 'Ended'), guide: L('Guide', 'Guide') }, SC = { live: '--A', soon: '--B', done: '--C', guide: '--S' };
  const dated = all.filter(e => e.start && e.end && e.s !== 'done'), t0 = dated.length ? Math.min(...dated.map(e => +new Date(e.start))) : 0, t1 = dated.length ? Math.max(...dated.map(e => +new Date(e.end))) : 1, now = Date.now(), span = Math.max(1, t1 - t0);
  const gantt = dated.length ? `<div class="gnt">${dated.sort((a, b) => a.start.localeCompare(b.start)).map((e, k) => `<div class="gr"><span class="gl">${esc(e.title)}</span><div class="gb"><u class="gtd" style="left:${Math.min(100, Math.max(0, (now - t0) / span * 100))}%">${k === 0 ? `<i>${L('Aujourd’hui', 'Today')}</i>` : ''}</u><i style="left:${(new Date(e.start) - t0) / span * 100}%;width:${Math.max(2, (new Date(e.end) - new Date(e.start)) / span * 100)}%;background:var(${SC[e.s]})" title="${esc(e.start + ' → ' + e.end)}"></i></div></div>`).join('')}</div>` : '';
  const ul = (t, a) => a && a.length ? `<div class="lab">${t}</div><ul>${a.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : '';
  const card = e => { const p = e.start && e.end ? Math.min(100, Math.max(0, (now - new Date(e.start)) / (new Date(e.end) - new Date(e.start)) * 100)) : 0;
    return `<details class="evc ${e.s}" style="--tc:var(${SC[e.s]})"><summary><div class="evt"><span class="tag tg" style="--tc:var(${SC[e.s]})">${SL[e.s]}</span><span class="tag">${esc(e.type || 'Guide')}</span></div><b>${esc(e.title)}</b><p class="sub">${esc(e.summary || '')}</p>
    ${e.start ? `<div class="evp"><i style="width:${p}%"></i></div><div class="evd"><span>${esc(e.start)}</span>${e.s === 'live' ? `<b data-cd="${e.end}T15:59:00Z" data-pre="${L('Fin dans ', 'Ends in ')}"></b>` : e.s === 'soon' ? `<b data-cd="${e.start}T03:00:00Z" data-pre="${L('Début dans ', 'Starts in ')}"></b>` : ''}<span>${esc(e.end)}</span></div>` : ''}
    ${e.rewards && e.rewards.length ? `<div class="evr">${e.rewards.slice(0, 3).map(r => `<span class="chip">🎁 ${esc(r)}</span>`).join('')}</div>` : ''}</summary>
    <div class="evx">${ul(L('Étapes', 'Steps'), e.steps)}${ul(L('Conseils', 'Tips'), e.tips)}${e.rewards && e.rewards.length > 3 ? ul(L('Récompenses', 'Rewards'), e.rewards) : ''}${e.s === 'live' || e.s === 'soon' ? `<p><button class="btn" data-reme="${esc(e.id)}">🔔 ${L('Me rappeler 24 h avant la fin', 'Remind me 24h before the end')}</button></p>` : ''}${e.link ? `<a href="${esc(e.link)}" target="_blank" rel="noopener">Source</a>` : ''}</div></details>`; };
  const n = k => all.filter(e => e.s === k).length;
  return [`<h1>${L('Événements et guides', 'Events and guides')}</h1><p class="lead">${L('Tout ce qui se passe dans la version, avec le temps restant et les récompenses.', 'Everything happening in the version, with time left and rewards.')}</p>
  <div class="evs"><div><b>${n('live')}</b><span>${L('en cours', 'live')}</span></div><div><b>${n('soon')}</b><span>${L('à venir', 'upcoming')}</span></div><div><b>${n('done')}</b><span>${L('terminés', 'ended')}</span></div><div><b>${n('guide')}</b><span>${L('guides', 'guides')}</span></div></div>
  ${gantt ? sec(L('Calendrier de la version', 'Version calendar')) + gantt : ''}<div class="fl"><span class="lab">${L('Afficher', 'Show')}</span>${[['all', L('Tout', 'All')], ['live', SL.live], ['soon', SL.soon], ['guide', SL.guide], ['done', SL.done]].map(c => `<button class="chip ${EVF === c[0] ? 'on' : ''}" data-evf="${c[0]}">${c[1]}</button>`).join('')}</div>
  <div class="evg" id="evg">${lst().map(card).join('') || `<p class="sub">${L('Rien à afficher ici.', 'Nothing to show here.')}</p>`}</div>`, null, () => { tick(); document.querySelectorAll('[data-evf]').forEach(b => b.onclick = () => { EVF = b.dataset.evf; document.querySelectorAll('[data-evf]').forEach(x => x.classList.toggle('on', x === b)); $('#evg').innerHTML = lst().map(card).join('') || `<p class="sub">${L('Rien à afficher ici.', 'Nothing to show here.')}</p>`; tick(); }); }];
};

// ------------------------------------------------------------ aide
const HELP_PATHS = () => ({
  new: [L('Nouveau joueur', 'New player'), [[L('Terminer le prologue et débloquer l’Univers Simulé', 'Finish the prologue and unlock the Simulated Universe'), '#/aide'], [L('Choisir un DPS principal et le monter niveau 70+', 'Pick a main DPS and level it to 70+'), '#/tier'], [L('Avoir un soutien et un soigneur ou bouclier', 'Get a support and a healer or shield'), '#/teamtier'], [L('Dépenser toute l’énergie (Trailblaze Power) chaque jour', 'Spend all your Trailblaze Power every day'), '#/home'], [L('Verrouiller les reliques avec la bonne stat principale', 'Lock relics with the right main stat'), '#/relic'], [L('Consulter les bannières avant de tirer', 'Check the banners before pulling'), '#/calendar']]],
  mid: [L('Joueur régulier', 'Regular player'), [[L('Équiper chaque DPS de son cône et de son set recommandés', 'Give every DPS its recommended cone and set'), '#/perso'], [L('Comparer deux personnages avant de dépenser des ressources', 'Compare two characters before spending resources'), '#/compare'], [L('Calculer les matériaux avant de farmer', 'Compute materials before farming'), '#/calc'], [L('Planifier vos tirages', 'Plan your pulls'), '#/plan'], [L('Évaluer vos reliques avant de les monter', 'Rate your relics before levelling them'), '#/relic'], [L('Composer deux équipes sans personnage commun pour Memory of Chaos', 'Build two teams with no shared character for Memory of Chaos'), '#/end/moc']]],
  end: [L('End game', 'End game'), [[L('Lire les boss de la phase en cours', 'Read the current phase bosses'), '#/end/moc'], [L('Choisir des équipes d’après la tier list du mode', 'Pick teams from the mode’s tier list'), '#/tier'], [L('Vérifier les faiblesses élémentaires avant de choisir', 'Check elemental weaknesses before picking'), '#/end/as'], [L('Régler un rappel avant la fin de la phase', 'Set a reminder before the phase ends'), '#/end/pf'], [L('Optimiser la vitesse et les sous-stats utiles', 'Optimise speed and useful substats'), '#/relic']]],
});
const FAQ = () => [
  [L('Le site', 'The site'), L('Comment signaler une erreur ?', 'How do I report a mistake?'), L('Cliquez sur l’icône drapeau en haut à droite et écrivez quelques mots.', 'Click the flag icon at the top right and write a few words.')],
  [L('Le site', 'The site'), L('D’où viennent les données ?', 'Where does the data come from?'), L('Personnages, cônes et reliques viennent de StarRailRes, les builds de HSR Optimizer, le classement de Game8. Voir la page Crédits.', 'Characters, cones and relics come from StarRailRes, builds from HSR Optimizer, rankings from Game8. See the Credits page.')],
  [L('Le site', 'The site'), L('Le site est-il officiel ?', 'Is the site official?'), L('Non. C’est un site de fans gratuit, sans publicité, non affilié à HoYoverse.', 'No. It is a free, ad-free fan site, not affiliated with HoYoverse.')],
  [L('Le site', 'The site'), L('À quelle fréquence est-il mis à jour ?', 'How often is it updated?'), L('Les données sont actualisées chaque lundi. La tier list de Game8 est mise à jour à la demande.', 'Data refreshes every Monday. The Game8 tier list is refreshed on request.')],
  [L('Classements', 'Rankings'), L('Que signifient T0, T1, T2 ?', 'What do T0, T1, T2 mean?'), L('Plus le chiffre est bas, plus le personnage est fort dans le mode choisi. T0 est le haut du classement.', 'The lower the number, the stronger the character in that mode. T0 is the top of the ranking.')],
  [L('Classements', 'Rankings'), L('Pourquoi la tier list équipement est-elle différente des autres sites ?', 'Why is the gear tier list different from other sites?'), L('Elle est calculée par le site à partir des builds des personnages les mieux classés. Ce n’est pas un classement officiel.', 'It is computed by the site from the builds of top-ranked characters. It is not an official ranking.')],
  [L('Classements', 'Rankings'), L('Quelle différence entre E0 et E6 ?', 'What is the difference between E0 and E6?'), L('E0 est le personnage sans éidolon, E6 en a six. La tier list se base sur E0 par défaut.', 'E0 is a character with no eidolons, E6 has all six. The tier list assumes E0 by default.')],
  [L('Tirages', 'Pulls'), L('Comment fonctionne la pitié ?', 'How does pity work?'), L('Le 5★ est garanti au plus tard au 90e tirage de la bannière personnage (80e pour le cône). Après un 5★ perdu au 50/50, le suivant est garanti. Utilisez la page Tirages pour estimer vos chances.', 'A 5★ is guaranteed by pull 90 on the character banner (80 on the cone banner). After losing a 50/50, the next 5★ is guaranteed. Use the Pull planner to estimate your odds.')],
  [L('Compte', 'Account'), L('À quoi sert un compte ?', 'What is an account for?'), L('À retrouver collection, favoris et équipes sur tous vos appareils, et à partager un profil public si vous le souhaitez.', 'To keep your collection, favourites and teams on all your devices, and to share a public profile if you wish.')],
  [L('Compte', 'Account'), L('Mes données sont-elles publiques ?', 'Is my data public?'), L('Non, sauf si vous rendez votre profil public. Seuls le pseudo, l’avatar, la présentation, les chiffres de collection et la vitrine sont visibles, jamais votre e-mail.', 'No, unless you make your profile public. Only the name, avatar, bio, collection figures and showcase are visible, never your e-mail.')],
  [L('Reliques', 'Relics'), L('Quelle stat principale choisir ?', 'Which main stat should I pick?'), L('Consultez l’onglet Build du personnage, ou utilisez l’évaluateur de reliques pour juger une pièce que vous possédez.', 'Check the character’s Build tab, or use the relic checker to rate a piece you own.')],
];
const GLOSS = () => [['E0–E6', L('Éidolons : déblocages d’un personnage. E0 = aucun, E6 = tous.', 'Eidolons: a character’s unlocks. E0 = none, E6 = all.')], [L('VIT', 'SPD'), L('Vitesse : détermine l’ordre et le nombre de tours.', 'Speed: decides turn order and number of turns.')], [L('DoT', 'DoT'), L('Dégâts sur la durée (brûlure, saignement, choc, vent tranchant).', 'Damage over time (burn, bleed, shock, wind shear).')], [L('Rupture', 'Break'), L('Briser la résistance d’un ennemi pour infliger des effets et des dégâts de rupture.', 'Breaking an enemy’s toughness to deal break effects and damage.')], [L('Poursuite', 'Follow-up'), L('Attaque supplémentaire déclenchée par un événement, sans consommer de tour.', 'An extra attack triggered by an event, without using a turn.')], [L('Sustain', 'Sustain'), L('Personnage de soin, bouclier ou protection.', 'A healing, shield or protection character.')], [L('Pitié', 'Pity'), L('Compteur de tirages qui garantit un 5★ passé un certain seuil.', 'Pull counter that guarantees a 5★ past a threshold.')], [L('50/50', '50/50'), L('Chance de 50 % d’obtenir le personnage mis en avant sur la bannière.', '50% chance to get the featured character on the banner.')], [L('Sous-stats', 'Substats'), L('Statistiques secondaires d’une relique, qui augmentent quand on la monte.', 'A relic’s secondary stats, which grow as you level it.')]];
let HP = store.get('astro_hp', 'new'), HQ = '';
pages.aide = () => { const P = HELP_PATHS(), chk = store.get('astro_hchk', {});
  const prog = k => { const n = P[k][1].length, d = P[k][1].filter((_, i) => chk[k + i]).length; return [d, n]; };
  const paths = () => { const [d, n] = prog(HP); return `<div class="hpt"><div class="seg">${Object.keys(P).map(k => `<button class="${HP === k ? 'on' : ''}" data-hp="${k}">${P[k][0]}</button>`).join('')}</div><div class="hpb"><div class="xpb"><i style="width:${Math.round(d / n * 100)}%"></i></div><span class="sub">${d} / ${n}</span></div>
    ${P[HP][1].map((s, i) => `<label class="hck ${chk[HP + i] ? 'done' : ''}"><input type="checkbox" data-hc="${HP + i}" ${chk[HP + i] ? 'checked' : ''}><span>${esc(s[0])}</span><a href="${s[1]}">${L('Ouvrir', 'Open')} →</a></label>`).join('')}</div>`; };
  const faq = () => { const q = HQ.toLowerCase(), rows = FAQ().filter(r => !q || (r[1] + ' ' + r[2]).toLowerCase().includes(q)), cats = [...new Set(rows.map(r => r[0]))];
    return cats.map(c => `<h3 class="hcat">${c}</h3>` + rows.filter(r => r[0] === c).map(r => `<details class="hq"><summary>${esc(r[1])}</summary><p>${esc(r[2])}</p></details>`).join('')).join('') || `<p class="sub">${L('Aucune réponse : essayez un autre mot, ou écrivez-nous avec le bouton drapeau.', 'No answer: try another word, or write to us with the flag button.')}</p>`; };
  const g = GLOSS(), tl = (h, ic, t, s) => `<a class="sc" href="${h}">${ico(ic)}<b>${t}</b><span>${s}</span></a>`;
  return [`<section class="hlp"><span class="lab">${L('Centre d’aide', 'Help center')}</span><h1>${L('Par où commencer ?', 'Where do I start?')}</h1><p class="lead">${L('Choisissez votre situation : le site vous propose des étapes, et vous pouvez les cocher.', 'Pick your situation: the site suggests steps, and you can tick them off.')}</p></section>
  <div class="card" id="hpa">${paths()}</div>
  ${sec(L('Outils du site', 'Site tools'))}<div class="g4">${tl('#/relic', 'shield', L('Évaluateur de reliques', 'Relic checker'), L('Cette relique vaut-elle la peine ?', 'Is this relic worth it?'))}${tl('#/calendar', 'clock', L('Compte à rebours', 'Countdown'), L('Bannières et prochaine version', 'Banners and next version'))}${tl('#/calc', 'calc', L('Calculateur', 'Calculator'), L('Matériaux à farmer', 'Materials to farm'))}${tl('#/plan', 'dice', L('Tirages', 'Pull planner'), L('Vos chances d’obtenir un 5★', 'Your odds of getting a 5★'))}${tl('#/compare', 'cmp', L('Comparateur', 'Compare'), L('Deux personnages côte à côte', 'Two characters side by side'))}${tl('#/gear/lc', 'gem', L('Tier list équipement', 'Gear tier list'), L('Cônes, reliques, ornements', 'Cones, relics, ornaments'))}${tl('#/versions', 'book', L('Résumé de version', 'Version recap'), L('L’histoire, version par version', 'The story, version by version'))}${tl('#/events', 'cal', L('Événements', 'Events'), L('Récompenses et temps restant', 'Rewards and time left'))}</div>
  ${sec(L('Questions fréquentes', 'FAQ'))}<input type="search" id="hq" placeholder="${L('Chercher dans l’aide…', 'Search the help…')}" value="${esc(HQ)}"><div id="hqs">${faq()}</div>
  ${sec(L('Glossaire', 'Glossary'))}<div class="hgl">${g.map(x => `<div class="card"><b>${esc(x[0])}</b><p class="sub" style="margin:4px 0 0">${esc(x[1])}</p></div>`).join('')}</div>
  ${sec(L('Astuces', 'Tips'))}<div class="card"><ul class="tipl"><li>${L('Ctrl + K ouvre la recherche depuis n’importe quelle page.', 'Ctrl + K opens search from any page.')}</li><li>${L('Passez la souris sur un personnage pour voir son rang dans chaque mode.', 'Hover a character to see its rank in each mode.')}</li><li>${L('Dans Résumé de version, utilisez les flèches du clavier pour avancer ou reculer.', 'In Version recap, use the arrow keys to go forward or back.')}</li><li>${L('Sur téléphone, la barre en bas de l’écran donne accès aux pages principales.', 'On a phone, the bar at the bottom of the screen opens the main pages.')}</li></ul></div>
  <p class="note">${L('Une erreur ou une idée ? Le bouton drapeau en haut à droite arrive directement à l’administrateur. ', 'A mistake or an idea? The flag button at the top right goes straight to the administrator. ')}<a href="#/legal">${L('Mentions légales', 'Legal notice')}</a> · <a href="#/credits">${L('Crédits', 'Credits')}</a></p>`, null, () => {
    const bindP = () => { document.querySelectorAll('[data-hp]').forEach(b => b.onclick = () => { HP = b.dataset.hp; store.set('astro_hp', HP); $('#hpa').innerHTML = paths(); bindP(); }); document.querySelectorAll('[data-hc]').forEach(c => c.onchange = () => { const s = store.get('astro_hchk', {}); s[c.dataset.hc] = c.checked ? 1 : 0; store.set('astro_hchk', s); chk[c.dataset.hc] = c.checked ? 1 : 0; $('#hpa').innerHTML = paths(); bindP(); }); };
    bindP(); const q = $('#hq'); if (q) q.oninput = e => { HQ = e.target.value; $('#hqs').innerHTML = faq(); };
  }];
};

// ------------------------------------------------------------ communauté
const _com = pages.community;
pages.community = h => {
  const sbx = () => window.__ASTRO_MOCK || sb;
  if (h || !sbx()) return _com(h);
  return [`<section class="soc"><div><span class="lab">${L('Réseau des joueurs', 'Player network')}</span><h1>${L('Communauté', 'Community')}</h1><p class="lead">${L('Découvrez les vitrines des autres Trailblazers, aimez leurs profils et partagez le vôtre.', 'Discover other Trailblazers’ showcases, like their profiles and share yours.')}</p></div><a class="btn pri" href="#/settings">${L('Rendre mon profil public', 'Make my profile public')}</a></section>
  <div id="cmh"></div><div class="socbar"><input type="search" id="cmq" placeholder="${L('Rechercher un joueur…', 'Search a player…')}" autocomplete="off"><div class="seg" id="cms"><button class="on" data-cms="new">${L('Récents', 'Recent')}</button><button data-cms="top">${L('Populaires', 'Popular')}</button><button data-cms="col">${L('Collection', 'Collection')}</button><button data-cms="n5">5★</button></div></div>
  <div class="cmcols"><div id="cm" class="feed"><p class="sub">${L('Chargement…', 'Loading…')}</p></div><aside id="cmr"></aside></div>`, null, async () => {
    const db = sbx(), { data, error } = await db.from('profiles').select('user_id,handle,display_name,avatar,stats,bio,showcase').eq('is_public', true).not('handle', 'is', null).order('updated_at', { ascending: false }).limit(60); if (data) await addPhotos(data);
    const el = $('#cm'); if (!el) return;
    if (error) { el.innerHTML = `<p class="sub">${L('Communauté indisponible : exécutez supabase/schema_v3.sql.', 'Community unavailable: run supabase/schema_v3.sql.')}</p>`; return; }
    const list = data || [], lk = {};
    try { const r = await db.from('profile_likes').select('profile_id').in('profile_id', list.map(p => p.user_id)); (r.data || []).forEach(x => { lk[x.profile_id] = (lk[x.profile_id] || 0) + 1; }); } catch { }
    const pts = p => { const s = p.stats || {}; return (s.n || 0) + (s.n5 || 0) * 3 + (s.e || 0); }, rank = p => { const v = pts(p); return RANKS.reduce((r, x) => v >= x[0] ? x : r, RANKS[0]); };
    let sort = 'new', qq = '';
    const card = (p, big) => { const st = p.stats || {}, sh = (Array.isArray(p.showcase) ? p.showcase : []).filter(s => byId[s.c]).slice(0, 4), rk = rank(p);
      return `<a class="pcard ${big ? 'big' : ''}" href="#/community/${esc(p.handle)}"><div class="pcov" ${cover(p)}></div>${avOf(p, 'pav')}<div class="pbody"><b>${esc(p.display_name || p.handle)}</b><span class="sub">@${esc(p.handle)} · <em class="rkm">${esc(L(rk[1], rk[2]))}</em></span><p>${esc((p.bio || '').slice(0, 110))}</p>
      <div class="pst"><span>${st.n ?? '—'} ${L('persos', 'chars')}</span><span>${st.n5 ?? '—'} 5★</span><span class="lk">♥ ${lk[p.user_id] || 0}</span></div>${sh.length ? `<div class="psh">${sh.map(s => `<img src="${im('c', s.c)}" alt="" loading="lazy">`).join('')}</div>` : ''}</div></a>`; };
    const draw = () => { let rows = list.filter(p => !qq || (p.handle + ' ' + (p.display_name || '')).toLowerCase().includes(qq));
      if (sort === 'top') rows.sort((a, b) => (lk[b.user_id] || 0) - (lk[a.user_id] || 0)); else if (sort === 'col') rows.sort((a, b) => ((b.stats || {}).n || 0) - ((a.stats || {}).n || 0)); else if (sort === 'n5') rows.sort((a, b) => ((b.stats || {}).n5 || 0) - ((a.stats || {}).n5 || 0));
      el.innerHTML = rows.map(p => card(p)).join('') || `<div class="card"><b>${L('Aucun profil trouvé', 'No profile found')}</b><p class="sub">${L('Soyez le premier : rendez votre profil public dans les paramètres.', 'Be the first: make your profile public in the settings.')}</p><a class="btn pri" href="#/settings">${L('Ouvrir les paramètres', 'Open settings')}</a></div>`; };
    const top = [...list].sort((a, b) => (lk[b.user_id] || 0) - (lk[a.user_id] || 0))[0], tot = list.reduce((s, p) => s + ((p.stats || {}).n || 0), 0), likes = Object.values(lk).reduce((s, n) => s + n, 0);
    $('#cmh').innerHTML = `<div class="evs"><div><b>${list.length}</b><span>${L('joueurs', 'players')}</span></div><div><b>${tot}</b><span>${L('personnages cumulés', 'characters combined')}</span></div><div><b>${likes}</b><span>${L('J’aime donnés', 'likes given')}</span></div></div>${top && (lk[top.user_id] || 0) > 0 ? sec(L('Profil du moment', 'Profile of the moment')) + card(top, true) : ''}`;
    const lb = (t, f) => `<div class="card"><h2 style="font-size:17px">${t}</h2>${[...list].sort((a, b) => f(b) - f(a)).slice(0, 5).filter(p => f(p) > 0).map((p, i) => `<a class="lbr" href="#/community/${esc(p.handle)}"><i>${i + 1}</i>${avOf(p, 'sm')}<span>${esc(p.display_name || p.handle)}</span><b>${f(p)}</b></a>`).join('') || `<p class="sub">—</p>`}</div>`;
    $('#cmr').innerHTML = lb(L('Plus de personnages', 'Most characters'), p => (p.stats || {}).n || 0) + lb(L('Plus de 5★', 'Most 5★'), p => (p.stats || {}).n5 || 0) + lb(L('Les plus aimés', 'Most liked'), p => lk[p.user_id] || 0);
    draw(); const qi = $('#cmq'); if (qi) qi.oninput = e => { qq = e.target.value.trim().toLowerCase(); draw(); };
    document.querySelectorAll('[data-cms]').forEach(bt => bt.onclick = () => { sort = bt.dataset.cms; document.querySelectorAll('[data-cms]').forEach(x => x.classList.toggle('on', x === bt)); draw(); });
  }];
};

// ------------------------------------------------------------ Foilvault : un mini-site de cartes à collectionner (tous les jeux HoYoverse)
const HC = (() => {
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const KEY = 'astro_cards', MAXB = 10, REGEN = 600000, PRICE = { gen: 120, hsr: 200, gi: 200, zzz: 200, hi3: 200, ww: 200, r99: 200, uma: 200, bb: 200, ef: 200, fgo: 200, nk: 200, nte: 200, op: 200, p5x: 200, bmh: 200, prem: 450 };
  const GAMES = { hsr: ['Honkai: Star Rail', 'HSR', '#e0b050'], gi: ['Genshin Impact', 'GI', '#5be3b0'], zzz: ['Zenless Zone Zero', 'ZZZ', '#ff7a3d'], hi3: ['Honkai Impact 3rd', 'HI3', '#7fb2ff'], tot: ['Tears of Themis', 'ToT', '#ff8ab5'], ww: ['Wuthering Waves', 'WuWa', '#6fd6ff'], r99: ['Reverse: 1999', 'R1999', '#d6536b'], uma: ['Umamusume', 'Uma', '#ff9ac8'], bb: ['Bleach: Brave Souls', 'BBS', '#b48cff'], ef: ['Arknights: Endfield', 'Endfield', '#c8ff3a'], fgo: ['Fate/Grand Order', 'FGO', '#4aa3ff'], nk: ['Goddess of Victory: Nikke', 'Nikke', '#ff3d6e'], nte: ['Neverness to Everness', 'NTE', '#3dffd0'], op: ['One Piece: Bounty Rush', 'OPBR', '#ff7043'], p5x: ['Persona 5: The Phantom X', 'P5X', '#ff2a3d'], bmh: ['Bleach: Mirrors High', 'BMH', '#ff8a1f'] };
  const PACKS = { gen: { fr: 'Booster général', en: 'General booster', g: null, c: '#e0b050' }, hsr: { fr: 'Booster Star Rail', en: 'Star Rail booster', g: ['hsr'], c: GAMES.hsr[2] }, gi: { fr: 'Booster Genshin', en: 'Genshin booster', g: ['gi'], c: GAMES.gi[2] }, zzz: { fr: 'Booster Zenless', en: 'Zenless booster', g: ['zzz'], c: GAMES.zzz[2] }, hi3: { fr: 'Booster Honkai 3rd', en: 'Honkai 3rd booster', g: ['hi3', 'tot'], c: GAMES.hi3[2] }, ww: { fr: 'Booster Wuthering Waves', en: 'Wuthering Waves booster', g: ['ww'], c: GAMES.ww[2] }, r99: { fr: 'Booster Reverse: 1999', en: 'Reverse: 1999 booster', g: ['r99'], c: GAMES.r99[2] }, uma: { fr: 'Booster Umamusume', en: 'Umamusume booster', g: ['uma'], c: GAMES.uma[2] }, bb: { fr: 'Booster Bleach', en: 'Bleach booster', g: ['bb'], c: GAMES.bb[2] }, ef: { fr: 'Booster Endfield', en: 'Endfield booster', g: ['ef'], c: GAMES.ef[2] }, fgo: { fr: 'Booster Fate/Grand Order', en: 'Fate/Grand Order booster', g: ['fgo'], c: GAMES.fgo[2] }, nk: { fr: 'Booster Nikke', en: 'Nikke booster', g: ['nk'], c: GAMES.nk[2] }, nte: { fr: 'Booster Neverness to Everness', en: 'Neverness to Everness booster', g: ['nte'], c: GAMES.nte[2] }, op: { fr: 'Booster One Piece', en: 'One Piece booster', g: ['op'], c: GAMES.op[2] }, p5x: { fr: 'Booster Phantom X', en: 'Phantom X booster', g: ['p5x'], c: GAMES.p5x[2] }, bmh: { fr: 'Booster Mirrors High', en: 'Mirrors High booster', g: ['bmh'], c: GAMES.bmh[2] }, prem: { fr: 'Booster Prestige', en: 'Prestige booster', g: null, c: '#ff5fb0' } };
  const ELC = { fire: '#ff6a3d', ice: '#7fd7ff', elec: '#b784ff', wind: '#5be3b0', water: '#3d8bff', rock: '#e0b050', grass: '#8ad84a', phys: '#c9ccd6', quantum: '#7a6bff', imag: '#ffd86b', ether: '#ff4fa3', lumen: '#fff2b0', valk: '#ff8ab5', spectro: '#f2e46b', havoc: '#e0457b', mineral: '#d9b27c', intellect: '#8fb8ff', plant: '#7fdc8a', star: '#ffe48a', beast: '#ff9a5c', spirit: '#c9a6ff', unk: '#c9ccd6', uma: '#ff9ac8', saber: '#6fa8ff', archer: '#ff7a7a', lancer: '#7ad1ff', rider: '#ffd27a', caster: '#b784ff', assassin: '#8a8aaa', berserker: '#ff5a5a', ruler: '#ffe27a', avenger: '#c0407a', mooncancer: '#cfa6ff', alterego: '#ff9ad0', foreigner: '#8affd9', pretender: '#9a8aff', shielder: '#7ad0ff', beast: '#ff8a3d', saiyan: '#ffb43d', god: '#c87aff', fusion: '#7ad1ff', frieza: '#c9a6ff', android: '#8affc9', buu: '#ff9ad0', namek: '#7edc6a', human: '#ffd0a0', demon: '#ff5a7a', universe: '#7ae0ff', shinigami: '#e8e8ff', quincy: '#7ab8ff', arrancar: '#ff9a9a', attacker: '#ff7a5a', defender: '#5aa8ff', runner: '#7aff9a', supporter: '#ffd05a', chaos: '#b06aff', anima: '#6aff9a', cosmos: '#6ab8ff', incantation: '#ff9a6a', lakshana: '#ffd06a', curse: '#a24bff', bless: '#ffe9a0', nuke: '#8aff5a', psy: '#ff7ad9', almighty: '#fff2d0', gun: '#c9ccd6', combo: '#ff6a3d', crush: '#ffb43d', chain: '#5ad0ff', shadow: '#9a7aff', tank: '#5aff9a' };
  const ELN = { fire: ['Feu', 'Fire'], ice: ['Glace', 'Ice'], elec: ['Foudre', 'Lightning'], wind: ['Vent', 'Wind'], water: ['Eau', 'Water'], rock: ['Roche', 'Geo'], grass: ['Plante', 'Dendro'], phys: ['Physique', 'Physical'], quantum: ['Quantique', 'Quantum'], imag: ['Imaginaire', 'Imaginary'], ether: ['Éther', 'Ether'], lumen: ['Lumière', 'Lumen'], valk: ['Valkyrie', 'Valkyrie'], spectro: ['Spectro', 'Spectro'], havoc: ['Havoc', 'Havoc'], mineral: ['Minéral', 'Mineral'], intellect: ['Intellect', 'Intellect'], plant: ['Plante', 'Plant'], star: ['Étoile', 'Star'], beast: ['Bête', 'Beast'], spirit: ['Esprit', 'Spirit'], unk: ['Arcaniste', 'Arcanist'], uma: ['Course', 'Racer'], mooncancer: ['Moon Cancer', 'Moon Cancer'], alterego: ['Alter Ego', 'Alter Ego'], god: ['Dieu', 'God'], universe: ['Univers', 'Universe'], demon: ['Démon', 'Demon'], human: ['Humain', 'Human'], shinigami: ['Shinigami', 'Shinigami'], attacker: ['Attaquant', 'Attacker'], defender: ['Défenseur', 'Defender'], runner: ['Coureur', 'Runner'], supporter: ['Soutien', 'Support'], incantation: ['Incantation', 'Incantation'], cosmos: ['Cosmos', 'Cosmos'], curse: ['Malédiction', 'Curse'], bless: ['Bénédiction', 'Bless'], nuke: ['Nucléaire', 'Nuclear'], psy: ['Psy', 'Psychokinesis'], almighty: ['Tout-puissant', 'Almighty'], gun: ['Arme à feu', 'Gun'], combo: ['Combo', 'Combo'], crush: ['Crush', 'Crush'], chain: ['Chain', 'Chain'], shadow: ['Shadow', 'Shadow'], tank: ['Tank', 'Tank'] };
  const elN = e => ELN[e] || [e ? e[0].toUpperCase() + e.slice(1) : '—', e ? e[0].toUpperCase() + e.slice(1) : '—'];
  const elX = c => c.e === 'unk' && GN[c.g] ? [GN[c.g][0], GN[c.g][0]] : elN(c.e);
  const RAR = [{ fr: 'Commune', en: 'Common', c: '#4fd37a', v: 2 }, { fr: 'Peu commune', en: 'Uncommon', c: '#2fd0c4', v: 4 }, { fr: 'Rare', en: 'Rare', c: '#5aa8ff', v: 8 }, { fr: 'Épique', en: 'Epic', c: '#b784ff', v: 20 }, { fr: 'Légendaire', en: 'Legendary', c: '#ffcf5a', v: 50 }];
  const FIN = [{ fr: 'Normale', en: 'Normal', m: 1 }, { fr: 'Holo', en: 'Holo', m: 1.5 }, { fr: 'Shiny', en: 'Shiny', m: 2.5 }, { fr: 'Dorée', en: 'Gold', m: 5 }];
  const CLS = ['n', 'h', 's', 'g'], FC = ['#cfd6ea', '#5fe6ff', '#ff7ad9', '#ffcf5a'], GN = { hsr: ['Star Rail', 'Honkai: Star Rail'], gi: ['Genshin', 'Genshin Impact'], zzz: ['Zenless', 'Zenless Zone Zero'], hi3: ['Honkai 3rd', 'Honkai Impact 3rd'], tot: ['Themis', 'Tears of Themis'], ww: ['WuWa', 'Wuthering Waves'], r99: ['R1999', 'Reverse: 1999'], uma: ['Uma', 'Umamusume'], bb: ['Bleach', 'Bleach: Brave Souls'], ef: ['Endfield', 'Arknights: Endfield'], fgo: ['FGO', 'Fate/Grand Order'], nk: ['Nikke', 'Goddess of Victory: Nikke'], nte: ['NTE', 'Neverness to Everness'], op: ['One Piece', 'One Piece: Bounty Rush'] , p5x: ['Phantom X', 'Persona 5: The Phantom X'], bmh: ['Mirrors High', 'Bleach: Mirrors High']};
  const ROLE = { dps: ['Dégâts', 'Damage'], support: ['Soutien', 'Support'], sustain: ['Survie', 'Sustain'] };
  function sumOf(c) { const dsc = LANG === 'en' ? c.de : c.d; if (dsc) return dsc; const tl = c.tl ? L(` Classé ${c.tl} dans la tier list actuelle.`, ` Ranked ${c.tl} in the current tier list.`) : ''; const el = L(elX(c)[0], elX(c)[1]);
    if (c.g === 'hsr') { const r = ROLE[c.ro]; return L(`Voie de ${c.pa || '—'}, ${el}${r ? ' · ' + r[0] : ''}.`, `Path of ${c.pe || '—'}, ${el}${r ? ' · ' + r[1] : ''}.`) + tl; }
    if (c.g === 'hi3') { const [a, b] = (nm(c) || '').split(' · '); return L(`Valkyrie ${a}, tenue « ${b || a} ».`, `Valkyrie ${a}, battlesuit “${b || a}”.`) + tl; }
    if (c.g === 'tot') return L('Personnage de Tears of Themis.', 'Character from Tears of Themis.');
    return L(`Personnage ${c.r}★ de ${GN[c.g][1]}, ${el}.`, `${c.r}★ character from ${GN[c.g][1]}, ${el}.`) + tl; }
  const LV = [[0, 'Novice', 'Novice'], [30, 'Apprenti', 'Apprentice'], [100, 'Collectionneur', 'Collector'], [250, 'Chasseur d’étoiles', 'Star hunter'], [500, 'Expert', 'Expert'], [900, 'Maître', 'Master'], [1500, 'Grand maître', 'Grand master'], [2500, 'Archiviste', 'Archivist'], [4000, 'Légende', 'Legend'], [6500, 'Mythe', 'Myth']];
  const hs = s => { let h = 2166136261; for (const c of String(s)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
  let CD = null, byC = {}, pools = {}, loadP = null, G = null, tab = 'open', AF = { g: '', r: '', o: '', q: '', s: 'rar', n: 60, f: '', d: '' }, SELL = { cap: 3, keep: 1, conf: 0 }, AFL = { c: '', st: '' }, timer = null, pushT = null;
  const today = () => new Date().toISOString().slice(0, 10);
  const weekK = () => { const d = new Date(); d.setUTCHours(0, 0, 0, 0); d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7)); return d.toISOString().slice(0, 10); };
  const FMAX = 5, FREW = { 0.8: 1, 0.9: 2, 1: 4 }, fLeft = () => Math.max(0, FMAX - (G.fw && G.fw.k === today() ? G.fw.n : 0));
  const dflt = () => ({ v: 2, st: MAXB, t: Date.now(), coins: 100, inv: { gen: 0, hsr: 0, gi: 0, zzz: 0, hi3: 0, ww: 0, r99: 0, uma: 0, bb: 0, ef: 0, fgo: 0, nk: 0, nte: 0, op: 0, p5x: 0, bmh: 0, prem: 0 }, col: {}, open: 0, pity: 0, w: 0, l: 0, rw: { d: '', n: 0 }, show: [], day: { d: '', q: [], p: {}, c: {} }, lg: { d: '', n: 0, c: false }, ach: {}, es: 0, ss: 0, sold: 0, snd: true, last: [] });
  const load = () => { const s = store.get(KEY, {}); G = Object.assign(dflt(), s); G.inv = Object.assign(dflt().inv, s.inv || {}); G.day = Object.assign(dflt().day, s.day || {}); G.lg = Object.assign(dflt().lg, s.lg || {}); G.ach = s.ach || {}; regen(); daily(); return G; };
  const save = () => { store.set(KEY, G); clearTimeout(pushT); pushT = setTimeout(push, 3000); };
  const nm = c => LANG === 'en' ? c.ne : c.n, red = () => PREF.motion === 'off' || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  const rarOf = c => { if (typeof c.q === 'number') return c.q; const h = hs(c.id) % 100; return c.r === 5 ? (h < 55 ? 2 : h < 85 ? 3 : 4) : (h < 62 ? 0 : 1); };
  const stats = (c, fin = 0) => { const h = hs(c.id + 's'), b = [30, 45, 60, 75, 90][rarOf(c)], bonus = [0, 3, 6, 10][fin]; return { atk: b + h % 15 + bonus, def: b - 5 + (h >> 4) % 15 + bonus, hp: 100 + b * 2 + (h >> 8) % 30 }; };
  function regen() { const now = Date.now(); if (G.t > now) G.t = now; if (G.st >= MAXB) { G.st = MAXB; G.t = now; return; } const k = Math.floor((now - G.t) / REGEN); if (k > 0) { G.st = Math.min(MAXB, G.st + k); G.t = G.st >= MAXB ? now : G.t + k * REGEN; } }
  // jeux retirés (Dokkan Battle, v26) : les cartes et boosters déjà obtenus sont remboursés en éclats
  function purge() { load(); let n = 0, rf = 0; Object.keys(G.col).forEach(id => { if (!byC[id] && /^dk-/.test(id)) { const e = G.col[id]; n += e.n || 0; rf += 10 * (e.n || 0); delete G.col[id]; } });
    if (G.inv && G.inv.dk) { rf += 200 * G.inv.dk; n++; delete G.inv.dk; } if (!n && !rf) return; G.show = (G.show || []).filter(s => byC[s.split(':')[0]]); G.last = (G.last || []).filter(x => byC[x.id]); credit(rf); save(); setTimeout(() => toast(L(`Dokkan Battle a été retiré : ${rf} ✦ remboursés pour vos cartes et boosters.`, `Dokkan Battle was removed: ${rf} ✦ refunded for your cards and boosters.`)), 800); }
  async function data() { if (CD) return CD; if (!loadP) loadP = fetch('data/cards.json').then(r => r.json()).then(d => { CD = d.cards; CD.forEach((c, i) => { byC[c.id] = c; c.R = rarOf(c); c.i = i + 1; }); purge(); return CD; }); return loadP; }
  const poolOf = (pk, r) => { const k = pk + r; if (!pools[k]) { const gs = PACKS[pk].g; pools[k] = CD.filter(c => c.R === r && (!gs || gs.includes(c.g))); } return pools[k]; };
  const pick = a => a[Math.floor(Math.random() * a.length)];
  function wpick(w) { let t = w.reduce((s, x) => s + x, 0), r = Math.random() * t; for (let i = 0; i < w.length; i++) { if ((r -= w[i]) < 0) return i; } return w.length - 1; }
  const near = (pk, r) => { for (let d = 0; d < 5; d++) for (const x of [r - d, r + d]) if (x >= 0 && x <= 4 && poolOf(pk, x).length) return x; return r; };
  function draw(pk) { const out = [], prem = pk === 'prem', forced = G.pity >= 29;
    for (let s = 0; s < 5; s++) { const last = s === 4, pre = prem && s >= 3;
      let w = last || pre ? (prem ? [0, 0, 45, 38, 17] : [0, 0, 78, 18, 4]) : prem ? [30, 30, 22, 14, 4] : [52, 28, 13.8, 5, 1.2]; let r = wpick(w); if (last && forced) r = 4;
      r = near(pk, r); let c = pick(poolOf(pk, r)); if (r === 4) { const f = feat(); if (f && Math.random() < 0.3 && poolOf(pk, 4).includes(f)) c = f; } let f = wpick(prem ? [62, 24, 10, 4] : [80, 15, 4, 1]); if (r === 4 && f === 0) f = 1; out.push({ id: c.id, f, alt: r === 4 && Math.random() < (prem ? 0.2 : 0.1), r }); }
    G.pity = out.some(x => x.r === 4) ? 0 : G.pity + 1; return out; }
  const sellVal = (c, fin) => Math.round(RAR[c.R].v * FIN[fin].m);
  function add(x) { const e = G.col[x.id] || (G.col[x.id] = { n: 0, f: [0, 0, 0, 0], x: 0 }); const isNew = e.n === 0, newFin = !e.f[x.f]; e.n++; e.f[x.f]++; if (x.alt) e.x++; return { isNew, newFin, dup: !isNew && !newFin, val: sellVal(byC[x.id], x.f) }; }
  const best = e => { for (let i = 3; i >= 0; i--) if (e.f[i]) return i; return 0; };
  const own = () => Object.keys(G.col).filter(i => byC[i] && G.col[i].n > 0);
  const pts = () => own().reduce((s, i) => { const e = G.col[i], b = [1, 2, 4, 8, 16][byC[i].R]; return s + b * (1 + (e.f[1] ? 1 : 0) + (e.f[2] ? 2 : 0) + (e.f[3] ? 5 : 0) + (e.x ? 3 : 0)); }, 0);
  const lvOf = p => LV.reduce((r, x, i) => p >= x[0] ? i : r, 0);
  const summary = () => { const o = own(), p = pts(); return { u: o.length, t: CD ? CD.length : 0, l: o.filter(i => byC[i].R === 4).length, g: o.filter(i => G.col[i].f[3]).length, s: o.filter(i => G.col[i].f[2]).length, h: o.filter(i => G.col[i].f[1]).length, x: o.filter(i => G.col[i].x).length, tot: o.reduce((s, i) => s + G.col[i].n, 0), p, lv: lvOf(p) }; };
  const gamePct = k => { const t = CD.filter(c => c.g === k).length; return t ? own().filter(i => byC[i].g === k).length / t : 0; };
  const mmss = ms => { const s = Math.max(0, Math.ceil(ms / 1000)); return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); };
  // ----- sons (synthétisés, aucun fichier)
  const SFX = (() => { let ac = null, mg = null; const ctx = () => { if (!G || !G.snd) return null; try { if (!ac) { ac = new (window.AudioContext || window.webkitAudioContext)(); mg = ac.createGain(); mg.gain.value = 0.22; mg.connect(ac.destination); } if (ac.state === 'suspended') ac.resume(); return ac; } catch { return null; } };
    const tone = (f, t0, d, type = 'sine', v = 0.5, f2) => { const a = ctx(); if (!a) return; const o = a.createOscillator(), g = a.createGain(), t = a.currentTime + t0; o.type = type; o.frequency.setValueAtTime(f, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + d); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, t + d); o.connect(g); g.connect(mg); o.start(t); o.stop(t + d + 0.05); };
    const noise = (t0, d, f1, f2, v = 0.4) => { const a = ctx(); if (!a) return; const n = a.sampleRate * d, b = a.createBuffer(1, n, a.sampleRate), x = b.getChannelData(0); for (let i = 0; i < n; i++) x[i] = Math.random() * 2 - 1; const s = a.createBufferSource(), fl = a.createBiquadFilter(), g = a.createGain(), t = a.currentTime + t0; s.buffer = b; fl.type = 'bandpass'; fl.frequency.setValueAtTime(f1, t); fl.frequency.exponentialRampToValueAtTime(f2, t + d); g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0001, t + d); s.connect(fl); fl.connect(g); g.connect(mg); s.start(t); };
    const N = { C5: 523, E5: 659, G5: 784, C6: 1047, E6: 1319, G6: 1568, C4: 262, G4: 392 };
    return { tear() { noise(0, 0.5, 400, 5000, 0.5); tone(90, 0.45, 0.25, 'sine', 0.5, 40); }, flip() { noise(0, 0.18, 1200, 5200, 0.25); },
      reveal(r, f) { try { if (G && G.snd && navigator.vibrate) navigator.vibrate(r >= 4 || f >= 3 ? [40, 50, 90] : r >= 3 ? [30] : r >= 2 ? [15] : 0); } catch (e) { } if (r === 0) tone(N.C5, 0, 0.25, 'sine', 0.35); else if (r === 1) { tone(N.C5, 0, 0.2, 'triangle', 0.4); tone(N.E5, 0.1, 0.3, 'triangle', 0.4); } else if (r === 2) { [N.C5, N.E5, N.G5].forEach((x, i) => tone(x, i * 0.09, 0.4, 'triangle', 0.45)); noise(0.25, 0.3, 4000, 9000, 0.12); }
        else if (r === 3) { [N.C5, N.E5, N.G5, N.C6].forEach((x, i) => tone(x, i * 0.09, 0.7, 'triangle', 0.45)); [N.C5, N.G5].forEach(x => tone(x, 0.3, 0.9, 'sine', 0.3)); noise(0.3, 0.6, 5000, 11000, 0.15); }
        else { tone(70, 0, 0.7, 'sine', 0.8, 35); [N.C5, N.E5, N.G5, N.C6, N.E6, N.G6].forEach((x, i) => tone(x, 0.12 + i * 0.1, 1.2, 'sawtooth', 0.22)); [N.C4, N.G4, N.C5, N.E5].forEach(x => tone(x, 0.7, 1.5, 'triangle', 0.3)); noise(0.5, 1, 4000, 12000, 0.18); }
        if (f >= 1) { tone(N.G6, 0.35, 0.35, 'sine', 0.2); tone(N.C6 * 2, 0.45, 0.4, 'sine', 0.18); } if (f === 3) [0, 1, 2, 3].forEach(i => tone(N.C6 * (1 + i * 0.25), 0.5 + i * 0.07, 0.9, 'triangle', 0.22)); },
      coin() { tone(988, 0, 0.1, 'square', 0.18); tone(1319, 0.08, 0.35, 'square', 0.18); }, ach() { [N.C5, N.E5, N.G5, N.C6].forEach((x, i) => tone(x, i * 0.1, 0.5, 'triangle', 0.4)); }, click() { tone(660, 0, 0.06, 'triangle', 0.25); }, win() { [N.C5, N.E5, N.G5, N.C6].forEach((x, i) => tone(x, i * 0.12, 0.5, 'square', 0.18)); }, lose() { tone(300, 0, 0.5, 'sawtooth', 0.2, 120); } }; })();
  // ----- éléments visuels
  const stars = c => '★'.repeat(c.st || (c.r === 5 ? 5 : 4));
  // ----- visuel de secours (cartes sans illustration) : silhouette originale + glyphe de l'univers + monogramme
  const GLY = { hsr: 'M50 8l9 33 33 9-33 9-9 33-9-33-33-9 33-9z', gi: 'M50 6l22 44-22 44-22-44z M6 50l44-14 44 14-44 14z', zzz: 'M50 6l38 22v44L50 94 12 72V28z', hi3: 'M50 10c10 18 28 24 40 22-6 14-14 22-24 26l-16 32-16-32c-10-4-18-12-24-26 12 2 30-4 40-22z', bb: 'M50 6L58 38 92 50 58 62 50 94 42 62 8 50 42 38z', ef: 'M50 6l38 22v44L50 94 12 72V28zm0 16L26 36v28l24 14 24-14V36z', fgo: 'M50 6a44 44 0 1 0 0 88 44 44 0 0 0 0-88zm0 12l26 44H24z', nk: 'M50 8L88 30V70L50 92 12 70V30zm0 22L30 42v16l20 12 20-12V42z', nte: 'M50 6a44 44 0 1 0 0 88 44 44 0 0 0 0-88zm0 16a28 28 0 1 1 0 56 28 28 0 0 1 0-56z', op: 'M10 60L50 10 90 60 50 90z', p5x: 'M6 30L50 8l44 22-10 14-34-14-34 14zM20 56l30-12 30 12v10L50 92 20 66z', bmh: 'M50 6l10 34 34 10-34 10-10 34-10-34L6 50l34-10z M50 30l6 14 14 6-14 6-6 14-6-14-14-6 14-6z', ww: 'M50 6c8 20 20 32 44 44-24 12-36 24-44 44-8-20-20-32-44-44 24-12 36-24 44-44z', r99: 'M50 8a42 42 0 1 0 0 84 42 42 0 0 0 0-84zm0 14v28l22 14', uma: 'M20 70l8-34 18 10 4-22 14 24 16-12 0 34-10 8-18-6-14 10z', tot: 'M50 88C14 62 8 38 26 24c12-8 22-2 24 8 2-10 12-16 24-8 18 14 12 38-24 64z' };
  function artSvg(c, ec) { const h = hs(c.id), ini = esc((nm(c).match(/[A-Za-zÀ-ÿ0-9]/) || ['?'])[0].toUpperCase()), hue = h % 360, sx = 28 + h % 24, hr = 14 + (h >> 3) % 6;
    return `<svg class="hc-flt" viewBox="0 0 100 140" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><radialGradient id="fg${h}" cx="50%" cy="34%" r="75%"><stop offset="0" stop-color="${ec}" stop-opacity=".85"/><stop offset=".6" stop-color="hsl(${hue} 45% 22%)"/><stop offset="1" stop-color="#0b0e1f"/></radialGradient></defs><rect width="100" height="140" fill="url(#fg${h})"/>${[0, 1, 2, 3, 4, 5].map(i => `<path d="M50 62L${50 + Math.cos(i * 1.05 + h % 7) * 120} ${62 + Math.sin(i * 1.05 + h % 7) * 120}" stroke="#fff" stroke-opacity=".07" stroke-width="10"/>`).join('')}<g transform="translate(16 18) scale(.68)" fill="${ec}" fill-opacity=".22" stroke="#fff" stroke-opacity=".25" stroke-width="1"><path d="${GLY[c.g] || GLY.hsr}"/></g><g fill="#0b0e1f" fill-opacity=".62"><circle cx="50" cy="${52 - hr / 3}" r="${hr}"/><path d="M${50 - sx} 140C${50 - sx} 96 ${50 - sx / 2} 76 50 76s${sx / 2} 20 ${sx} 64z"/></g><text x="50" y="62" text-anchor="middle" font-size="30" font-weight="800" fill="#fff" fill-opacity=".9" font-family="Georgia,serif">${ini}</text></svg>`; }
  window.__hcArt = id => { const c = byC[id]; return c ? '<div class="hc-art" style="position:absolute;inset:0">' + artSvg(c, ELC[c.e] || '#c9ccd6') + '</div>' : ''; };
  function cardHtml(c, o = {}) { const { fin = 0, alt = false, cls = '', lock = false, cnt = 0, d = '', dim = false } = o, r = c.R, g = GAMES[c.g] || GAMES.hsr, ec = ELC[c.e] || '#c9ccd6', sx = stats(c, fin);
    const art = c.img ? `<img src="${esc(c.img)}" alt="" loading="lazy" draggable="false" onerror="this.outerHTML=window.__hcArt&&window.__hcArt('${esc(c.id)}')">` : artSvg(c, ec);
    const lay = alt ? 'x' : fin === 3 && r >= 3 ? 's' : r >= 3 ? 'f' : r === 2 || fin >= 2 ? 'e' : 'c';
    return `<div class="hc lay-${lay} r${r} f-${CLS[fin]} g-${c.g} ${alt ? 'alt' : ''} ${lock ? 'lock' : ''} ${dim ? 'dim' : ''} ${cls}" style="--rc:${RAR[r].c};--ec:${ec};--gc:${g[2]}" data-hcid="${esc(c.id)}" ${d}><div class="hc-in"><div class="hc-art">${art}</div><i class="hc-orn o1"></i><i class="hc-orn o2"></i><i class="hc-orn o3"></i><i class="hc-orn o4"></i><div class="hc-top"><span class="hc-g" title="${esc(GN[c.g] ? GN[c.g][1] : '')}"><i></i>${GN[c.g] ? GN[c.g][0] : g[1]}</span><span class="hc-r" title="${RAR[r][LANG === 'en' ? 'en' : 'fr']}"><i></i><em>${RAR[r][LANG === 'en' ? 'en' : 'fr']}</em></span></div>${fin ? `<span class="hc-fn" style="--fc:${FC[fin]}">${L(FIN[fin].fr, FIN[fin].en)}</span>` : ''}<div class="hc-nm"><b>${esc(nm(c))}</b><small>${esc(L(elX(c)[0], elX(c)[1]))} · ${stars(c)}</small><p class="hc-sm">${esc(sumOf(c))}</p></div>${lock ? '' : `<div class="hc-st"><span>ATK <b>${sx.atk}</b></span><span>DEF <b>${sx.def}</b></span></div>`}${lay === 's' || lay === 'x' ? `<span class="hc-sec">${lay === 'x' ? L('ÉCLIPSE · SECRÈTE', 'ECLIPSE · SECRET') : L('CARTE SECRÈTE', 'SECRET CARD')}</span>` : ''}<span class="hc-no">№ ${String(c.i || 0).padStart(3, '0')}</span><span class="hc-sh"></span>${cnt > 1 ? `<i class="hc-cnt">×${cnt}</i>` : ''}${alt ? `<i class="hc-alt">${L('ÉCLIPSE', 'ECLIPSE')}</i>` : ''}</div></div>`; }
  const pips = (e, c) => `<div class="hc-pips" title="${L('Normale · Holo · Shiny · Dorée · Éclipse', 'Normal · Holo · Shiny · Gold · Eclipse')}">${[0, 1, 2, 3].map(i => `<i class="${e && e.f[i] ? 'on p' + i : ''}"></i>`).join('')}${c.R === 4 ? `<i class="${e && e.x ? 'on px' : ''}"></i>` : ''}</div>`;
  // ----- boosters : un visuel propre à chaque univers (formes et motifs originaux, aucun logo officiel)
  const PKT = {
    gen: ['linear-gradient(165deg,#fff3c0,#e8b94a 42%,#8a5412)', '#fff6d0', '#fff', 'GÉNÉRAL'], prem: ['linear-gradient(165deg,#ff9bd8,#7a2aa8 45%,#12041f)', '#ffd7f0', '#fff', 'PRESTIGE'],
    hsr: ['linear-gradient(165deg,#e8c36a,#3a3f8e 45%,#080b24)', '#ffe9a8', '#fff', 'STAR RAIL'], gi: ['linear-gradient(165deg,#f6f1c0,#5be3b0 42%,#0b4a44)', '#eafff6', '#fff', 'GENSHIN'],
    zzz: ['linear-gradient(165deg,#ffb04a,#242424 40%,#050505)', '#ffd23d', '#fff', 'ZENLESS'], hi3: ['linear-gradient(165deg,#ffe0f0,#7fb2ff 45%,#26327a)', '#fff', '#fff', 'HONKAI 3RD'],
    ww: ['linear-gradient(165deg,#bff3ff,#2a9ac8 42%,#04141f)', '#e6fbff', '#fff', 'WUTHERING WAVES'], r99: ['linear-gradient(165deg,#e8b87a,#9a2a3e 45%,#25090f)', '#ffe3b0', '#fff2dc', 'REVERSE 1999'],
    uma: ['linear-gradient(165deg,#fff,#ff9ac8 45%,#7a4ae0)', '#fff', '#fff', 'UMAMUSUME'], bb: ['linear-gradient(165deg,#e8dcff,#6a3ad0 42%,#0a0a16)', '#fff', '#fff', 'BLEACH'],
    ef: ['linear-gradient(165deg,#e8ff9a,#6a8a1a 45%,#10140a)', '#e6ff7a', '#fff', 'ENDFIELD'],
    fgo: ['linear-gradient(165deg,#fff0b8,#2a6ad8 42%,#050f2e)', '#ffe9a0', '#fff', 'FATE / GO'], nk: ['linear-gradient(165deg,#ff9ab8,#c01848 42%,#170308)', '#fff', '#fff', 'NIKKE'],
    nte: ['linear-gradient(165deg,#9affea,#6a2ac8 45%,#07041f)', '#aaffee', '#fff', 'NEVERNESS'], op: ['linear-gradient(165deg,#fbefc8,#cfa45a 45%,#6a3a12)', '#7a1a10', '#fff', 'BOUNTY RUSH'], p5x: ['linear-gradient(165deg,#ff4a5a,#b0001a 45%,#120006)', '#fff', '#fff', 'PHANTOM X'], bmh: ['linear-gradient(165deg,#fff4e0,#ff8a1f 40%,#0b0b0f)', '#fff', '#fff', 'MIRRORS HIGH']
  };
  const rays = (n, ac, o = .25) => `<g stroke="${ac}" stroke-opacity="${o}" stroke-width="3">${Array.from({ length: n }, (_, i) => { const a = i / n * 6.283; return `<path d="M95 125L${(95 + Math.cos(a) * 260).toFixed(0)} ${(125 + Math.sin(a) * 260).toFixed(0)}"/>`; }).join('')}</g>`;
  const dots = (n, ac, seed = 3) => Array.from({ length: n }, (_, i) => { const h = Math.abs(hs('d' + seed + i)); return `<circle cx="${h % 190}" cy="${(h >>> 8) % 270}" r="${.6 + (h >>> 4) % 3 * .5}" fill="${ac}" fill-opacity="${.3 + (h % 7) / 10}"/>`; }).join('');
  const star4 = (x, y, r, ac, o = 1) => `<path transform="translate(${x} ${y})" d="M0 ${-r}L${r * .22} ${-r * .22}L${r} 0L${r * .22} ${r * .22}L0 ${r}L${-r * .22} ${r * .22}L${-r} 0L${-r * .22} ${-r * .22}Z" fill="${ac}" fill-opacity="${o}"/>`;
  const ring = (r, ac, w = 1.5, d = '', o = .6) => `<circle cx="95" cy="118" r="${r}" fill="none" stroke="${ac}" stroke-width="${w}" stroke-opacity="${o}" ${d ? `stroke-dasharray="${d}"` : ''}/>`;
  const PKART = {
    gen: ac => rays(28, ac, .3) + ring(66, ac, 2) + ring(52, ac, 1, '2 5') + star4(95, 118, 60, ac, .55) + star4(95, 118, 30, '#fff', .8) + dots(26, '#fff'),
    prem: ac => `<g fill="none" stroke="${ac}" stroke-opacity=".25">${Array.from({ length: 9 }, (_, i) => `<path d="M${i * 24 - 30} 0L${i * 24 + 90} 270M${i * 24 + 90} 0L${i * 24 - 30} 270"/>`).join('')}</g>` + `<path d="M55 150l12-40 28 24 28-24 12 40z" fill="${ac}" fill-opacity=".85"/><circle cx="67" cy="106" r="5" fill="#fff"/><circle cx="95" cy="92" r="6" fill="#fff"/><circle cx="123" cy="106" r="5" fill="#fff"/>` + dots(30, '#fff', 9),
    hsr: ac => dots(60, '#fff', 1) + `<g fill="none" stroke="${ac}" stroke-opacity=".5" stroke-width="2"><path d="M-10 230C60 190 130 190 200 150"/><path d="M-10 250C60 210 130 210 200 170"/></g>` + ring(58, ac, 1.5, '3 6') + star4(95, 112, 50, ac, .85) + star4(95, 112, 20, '#fff'),
    gi: ac => `<g fill="none" stroke="${ac}" stroke-width="3" stroke-opacity=".55" stroke-linecap="round"><path d="M-10 90C40 60 70 120 120 90S180 60 210 80"/><path d="M-10 130C40 100 70 160 120 130S180 100 210 120"/><path d="M-10 170C40 140 70 200 120 170S180 140 210 160"/></g>` + `<path d="M95 62l34 56-34 56-34-56z" fill="${ac}" fill-opacity=".5"/>` + ring(70, '#fff', 1.5, '2 6') + dots(20, '#fff', 4),
    zzz: ac => `<g>${Array.from({ length: 8 }, (_, i) => `<rect x="${-30 + i * 34}" y="0" width="16" height="270" fill="${ac}" fill-opacity=".14" transform="skewX(-18)"/>`).join('')}</g><rect x="0" y="198" width="190" height="14" fill="${ac}"/><rect x="0" y="216" width="190" height="6" fill="#fff" fill-opacity=".7"/>` + `<rect x="30" y="70" width="130" height="92" rx="12" fill="#000" stroke="${ac}" stroke-width="4"/><rect x="38" y="78" width="114" height="76" rx="6" fill="${ac}" fill-opacity=".18"/><g fill="${ac}"><rect x="46" y="98" width="70" height="6"/><rect x="60" y="112" width="84" height="6"/><rect x="46" y="126" width="50" height="6"/></g>`,
    hi3: ac => `<g fill="${ac}" fill-opacity=".55"><path d="M95 120C60 60 20 70 8 100c26-6 40 6 50 26-20-4-34 4-44 20 22-4 36 4 44 18z"/><path d="M95 120c35-60 75-50 87-20-26-6-40 6-50 26 20-4 34 4 44 20-22-4-36 4-44 18z"/></g>` + star4(95, 120, 30, '#fff') + ring(44, '#fff', 1.5, '2 5') + dots(22, '#fff', 6),
    ww: ac => `<g fill="none" stroke="${ac}" stroke-linecap="round" stroke-width="2.5">${[0, 1, 2, 3, 4, 5].map(i => `<path d="M-10 ${80 + i * 22}c25-28 45 28 70 0s45 28 70 0 45 28 70 0" stroke-opacity="${.75 - i * .1}"/>`).join('')}</g>` + ring(26, '#fff', 3, '', .9) + ring(40, ac, 1.5, '2 5') + ring(58, ac, 1, '', .4) + dots(18, '#fff', 8),
    r99: ac => `<g stroke="${ac}" stroke-opacity=".35">${Array.from({ length: 34 }, (_, i) => `<path d="M${i * 6} ${(i * 37) % 120}l-4 28"/>`).join('')}</g>` + ring(62, ac, 3) + ring(54, ac, 1, '2 4') + Array.from({ length: 12 }, (_, i) => { const a = i / 12 * 6.283; return `<path d="M${(95 + Math.cos(a) * 50).toFixed(1)} ${(118 + Math.sin(a) * 50).toFixed(1)}L${(95 + Math.cos(a) * 44).toFixed(1)} ${(118 + Math.sin(a) * 44).toFixed(1)}" stroke="${ac}" stroke-width="2"/>`; }).join('') + `<path d="M95 118V84M95 118l22 10" stroke="${ac}" stroke-width="3" stroke-linecap="round"/><circle cx="95" cy="118" r="4" fill="${ac}"/>`,
    uma: ac => `<g>${Array.from({ length: 7 }, (_, i) => `<rect x="-20" y="${20 + i * 38}" width="230" height="14" fill="${ac}" fill-opacity="${i % 2 ? .25 : .5}" transform="rotate(-12 95 135)"/>`).join('')}</g>` + `<path d="M64 150c-16-30-8-62 20-72 10 4 16 16 12 30-12 6-14 20-6 34l6 6-14 4z" fill="#fff" fill-opacity=".9"/><path d="M128 150c16-30 8-62-20-72" fill="none" stroke="#fff" stroke-width="8" stroke-opacity=".9" stroke-linecap="round"/>` + star4(95, 58, 14, '#ffe14a') + dots(14, '#fff', 2),
    bb: ac => `<g stroke="${ac}" stroke-linecap="round"><path d="M-10 250L200 20" stroke-width="10" stroke-opacity=".9"/><path d="M10 270L200 70" stroke-width="3" stroke-opacity=".6"/><path d="M-10 200L170 0" stroke-width="3" stroke-opacity=".6"/></g>` + ring(60, ac, 2, '2 6') + ring(46, ac, 1, '', .5) + dots(24, '#fff', 12),
    ef: ac => `<g fill="none" stroke="${ac}" stroke-opacity=".3">${Array.from({ length: 6 }, (_, r) => Array.from({ length: 5 }, (_, c) => { const x = c * 40 + (r % 2) * 20, y = r * 36; return `<path d="M${x} ${y + 10}l17 -10 17 10v20l-17 10 -17 -10z"/>`; }).join('')).join('')}</g>` + `<path d="M95 62l44 26v52l-44 26-44-26V88z" fill="none" stroke="${ac}" stroke-width="5"/><path d="M95 84l24 14v28l-24 14-24-14V98z" fill="${ac}" fill-opacity=".8"/>` + `<g fill="${ac}"><path d="M0 232l12 0 12 14-12 0z"/><path d="M24 232l12 0 12 14-12 0z"/><path d="M48 232l12 0 12 14-12 0z"/><path d="M72 232l12 0 12 14-12 0z"/><path d="M96 232l12 0 12 14-12 0z"/><path d="M120 232l12 0 12 14-12 0z"/><path d="M144 232l12 0 12 14-12 0z"/><path d="M168 232l12 0 12 14-12 0z"/></g>`,
    fgo: ac => ring(70, ac, 3) + ring(62, ac, 1) + ring(36, ac, 2) + `<g fill="none" stroke="${ac}" stroke-width="2"><path d="M95 52L148 143H42z"/><path d="M95 184L42 93H148z"/></g>` + Array.from({ length: 24 }, (_, i) => { const a = i / 24 * 6.283; return `<path d="M${(95 + Math.cos(a) * 62).toFixed(1)} ${(118 + Math.sin(a) * 62).toFixed(1)}L${(95 + Math.cos(a) * 70).toFixed(1)} ${(118 + Math.sin(a) * 70).toFixed(1)}" stroke="${ac}" stroke-width="2"/>`; }).join('') + dots(24, '#fff', 5),
    nk: ac => `<g fill="none" stroke="${ac}" stroke-opacity=".5">${Array.from({ length: 10 }, (_, i) => `<path d="M0 ${i * 28}H190"/>`).join('')}</g>` + `<path d="M95 52l50 26v52c0 28-22 44-50 56-28-12-50-28-50-56V78z" fill="${ac}" fill-opacity=".22" stroke="${ac}" stroke-width="3"/>` + `<g stroke="#fff" stroke-width="3"><circle cx="95" cy="118" r="22" fill="none"/><path d="M95 80v20M95 136v20M57 118h20M113 118h20"/></g>`,
    nte: ac => `<g fill="${ac}" fill-opacity=".35">${[[8, 190, 20, 80], [34, 170, 18, 100], [58, 200, 22, 70], [86, 160, 20, 110], [114, 190, 18, 80], [138, 176, 22, 94], [164, 196, 20, 74]].map(([x, y, w, h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}"/>`).join('')}</g>` + ring(52, ac, 3, '', .9) + ring(64, '#ff6ad8', 2, '', .8) + ring(76, ac, 1, '3 6', .6) + dots(26, '#fff', 14),
    op: ac => `<g stroke="${ac}" stroke-opacity=".3" fill="none" stroke-width="2"><path d="M-10 200c30-20 60 20 90 0s60 20 90 0 60 20 90 0"/><path d="M-10 222c30-20 60 20 90 0s60 20 90 0 60 20 90 0"/></g>` + `<circle cx="95" cy="112" r="56" fill="none" stroke="${ac}" stroke-width="4"/><circle cx="95" cy="112" r="46" fill="none" stroke="${ac}" stroke-width="1" stroke-dasharray="3 4"/>` + `<path d="M95 52l8 52 40 8-40 8-8 52-8-52-40-8 40-8z" fill="${ac}" fill-opacity=".85"/><path d="M30 82l130 60M160 82L30 142" stroke="${ac}" stroke-opacity=".35" stroke-width="6"/>`,
    p5x: ac => `<g fill="${ac}" fill-opacity=".22"><path d="M-10 60L95 20l105 40v40L95 70-10 100z"/><path d="M-10 190L95 150l105 40v40L95 200-10 230z"/></g><path d="M95 70l16 40 40 4-30 28 10 40-36-22-36 22 10-40-30-28 40-4z" fill="none" stroke="${ac}" stroke-width="3" stroke-opacity=".7"/>`,
    bmh: ac => `<g fill="${ac}" fill-opacity=".16"><path d="M-10 40L60 0l30 90-100 30z"/><path d="M200 120l-70 40 20 100 60-20z"/></g><circle cx="95" cy="128" r="58" fill="none" stroke="${ac}" stroke-width="4" stroke-opacity=".55"/><path d="M95 70v116M40 128h110" stroke="${ac}" stroke-width="2" stroke-opacity=".5"/>`
  };
  const packHtml = (pk = 'gen', cls = '') => { const p = PACKS[pk], t = PKT[pk] || PKT.gen, art = (PKART[pk] || PKART.gen)(t[1]), g0 = p.g && p.g[0], gl = GLY[g0] || (pk === 'prem' ? 'M12 78l8-44 24 22 6-30 6 30 24-22 8 44z' : 'M50 4l8 38 38 8-38 8-8 38-8-38-38-8 38-8z');
    return `<div class="hc-pack pk-${pk} ${cls}" style="--pc:${p.c};--pbg:${t[0]};--pac:${t[1]};--pink:${t[2]}"><svg class="pk-art" viewBox="0 0 190 270" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${art}</svg><span class="pk-brand">FOILVAULT</span><span class="pk-emb"><svg viewBox="0 0 100 100" aria-hidden="true"><path d="${gl}"/></svg></span><h4 class="pk-gt">${t[3]}</h4><small>${L('5 cartes', '5 cards')}${pk === 'prem' ? ' · ' + L('2 Rare+', '2 Rare+') : ''}</small><em class="pk-foil"></em></div>`; };
  const coinI = '<span class="hc-coin">✦</span>';
  // ----- quêtes, connexion, succès
  const QPOOL = [['open3', 3, 'Ouvrir 3 boosters', 'Open 3 boosters', 25], ['holo1', 1, 'Obtenir une carte Holo ou mieux', 'Get a Holo or better card', 30], ['rare2', 2, 'Obtenir 2 cartes Rare ou mieux', 'Get 2 Rare or better cards', 30], ['new3', 3, 'Découvrir 3 nouvelles cartes', 'Discover 3 new cards', 25], ['sell3', 3, 'Vendre 3 doublons', 'Sell 3 duplicates', 20], ['game1', 1, 'Ouvrir un booster de jeu', 'Open a game booster', 30]];
  const lgReward = n => 20 + 10 * Math.min(n - 1, 6) + (n % 7 === 0 ? 100 : 0), QBONUS = 30;
  function daily() { const d = today(); if (G.day.d !== d || G.day.q.some(k => !QPOOL.find(x => x[0] === k))) { const h = hs(d), qs = QPOOL.map(q => q[0]).sort((a, b) => hs(d + a) - hs(d + b)).slice(0, 3); G.day = { d, q: qs, p: {}, c: {} }; }
    if (G.lg.d !== d) { const y = new Date(Date.now() - 864e5).toISOString().slice(0, 10); G.lg = { d, n: G.lg.d === y ? G.lg.n + 1 : 1, c: false }; } }
  const bump = (k, n = 1) => { G.day.p[k] = (G.day.p[k] || 0) + n; };
  const credit = n => { G.coins += n; G.es += n; };
  const ACH = () => { const s = summary(), nE = own().filter(i => byC[i].R === 3).length, nR = own().filter(i => byC[i].R === 2).length, GK = Object.keys(GAMES).filter(k => k !== 'tot'), ng = GK.filter(k => own().some(i => byC[i].g === k)).length, A = (id, fr, en, dfr, den, cur, max, rew) => ({ id, fr, en, dfr, den, cur: Math.min(cur, max), max, rew: Math.max(10, Math.round(rew * 0.4)) });
    const L_ = [A('o1', 'Premier booster', 'First booster', 'Ouvrir 1 booster', 'Open 1 booster', G.open, 1, 30), A('o2', 'Déchireur de paquets', 'Pack ripper', 'Ouvrir 25 boosters', 'Open 25 boosters', G.open, 25, 100), A('o3', 'Accro aux boosters', 'Booster addict', 'Ouvrir 100 boosters', 'Open 100 boosters', G.open, 100, 250), A('o4', 'Machine à cartes', 'Card machine', 'Ouvrir 500 boosters', 'Open 500 boosters', G.open, 500, 800),
      A('u1', 'Première collection', 'First collection', '10 cartes différentes', '10 different cards', s.u, 10, 50), A('u2', 'Petit album', 'Small album', '50 cartes différentes', '50 different cards', s.u, 50, 150), A('u3', 'Gros album', 'Big album', '150 cartes différentes', '150 different cards', s.u, 150, 400), A('u4', 'Archiviste', 'Archivist', '300 cartes différentes', '300 different cards', s.u, 300, 800), A('u5', 'Collection complète', 'Complete collection', 'Toutes les cartes', 'Every card', s.u, s.t || 999, 3000),
      A('l1', 'Étoile filante', 'Shooting star', 'Obtenir une Légendaire', 'Get a Legendary', s.l, 1, 100), A('l2', 'Chasseur de légendes', 'Legend hunter', '5 Légendaires', '5 Legendaries', s.l, 5, 300), A('l3', 'Panthéon', 'Pantheon', '15 Légendaires', '15 Legendaries', s.l, 15, 900),
      A('f1', 'Ça brille', 'Shiny stuff', 'Obtenir une carte Holo', 'Get a Holo card', s.h, 1, 40), A('f2', 'Éclat pur', 'Pure sparkle', 'Obtenir une carte Shiny', 'Get a Shiny card', s.s, 1, 120), A('f3', 'L’or des étoiles', 'Star gold', 'Obtenir une carte Dorée', 'Get a Gold card', s.g, 1, 400), A('f4', 'Éclipse totale', 'Total eclipse', 'Obtenir une carte Éclipse', 'Get an Eclipse card', s.x, 1, 400), A('f5', 'Orfèvre', 'Goldsmith', '5 cartes Dorées', '5 Gold cards', s.g, 5, 1200),
      A('w1', 'Premier sang', 'First blood', 'Gagner 1 combat', 'Win 1 battle', G.w, 1, 30), A('w2', 'Duelliste', 'Duelist', 'Gagner 6 combats', 'Win 6 battles', G.w, 6, 150), A('w3', 'Champion', 'Champion', 'Gagner 20 combats', 'Win 20 battles', G.w, 20, 500),
      A('s1', 'Fidèle', 'Loyal', 'Se connecter 3 jours de suite', 'Log in 3 days in a row', G.lg.n, 3, 80), A('s2', 'Assidu', 'Dedicated', 'Se connecter 7 jours de suite', 'Log in 7 days in a row', G.lg.n, 7, 250), A('s3', 'Inébranlable', 'Unshakable', '30 jours de suite', '30 days in a row', G.lg.n, 30, 1200),
      A('e1', 'Petit commerçant', 'Small trader', 'Vendre 10 doublons', 'Sell 10 duplicates', G.sold, 10, 60), A('e2', 'Marchand', 'Merchant', 'Vendre 100 doublons', 'Sell 100 duplicates', G.sold, 100, 300), A('e3', 'Magnat', 'Tycoon', 'Vendre 500 doublons', 'Sell 500 duplicates', G.sold, 500, 900),
      A('o5', 'Légende des boosters', 'Booster legend', 'Ouvrir 1 000 boosters', 'Open 1,000 boosters', G.open, 1000, 2000), A('l4', 'Dieux du gacha', 'Gacha gods', '40 Légendaires', '40 Legendaries', s.l, 40, 2000), A('f6', 'Roi Midas', 'King Midas', '15 cartes Dorées', '15 Gold cards', s.g, 15, 2500), A('f7', 'Chasseur d’éclipses', 'Eclipse hunter', '5 cartes Éclipse', '5 Eclipse cards', s.x, 5, 1500), A('w4', 'Légende de l’arène', 'Arena legend', 'Gagner 50 combats', 'Win 50 battles', G.w, 50, 1500),
      A('u6', 'Bibliothécaire', 'Librarian', '500 cartes différentes', '500 different cards', s.u, 500, 1500), A('u7', 'Encyclopédiste', 'Encyclopedist', '750 cartes différentes', '750 different cards', s.u, 750, 2500), A('u8', 'Presque tout', 'Almost everything', '900 cartes différentes', '900 different cards', s.u, 900, 4000),
      A('r1', 'Premier Épique', 'First Epic', 'Obtenir une carte Épique', 'Get an Epic card', nE, 1, 60), A('r2', 'Cercle des Épiques', 'Epic circle', '10 cartes Épiques', '10 Epic cards', nE, 10, 250), A('r3', 'Armée violette', 'Purple army', '50 cartes Épiques', '50 Epic cards', nE, 50, 1000), A('r4', 'Sur le fil', 'Rare finds', '25 cartes Rares', '25 Rare cards', nR, 25, 300),
      A('f8', 'Éclat par éclat', 'Shard by shard', '10 cartes Shiny', '10 Shiny cards', s.s, 10, 500), A('f9', 'Holo à gogo', 'Holo galore', '50 cartes Holo', '50 Holo cards', s.h, 50, 700), A('f10', 'Pluie d’étoiles', 'Eclipse rain', '10 cartes Éclipse', '10 Eclipse cards', s.x, 10, 3000),
      A('o0', 'Échauffement', 'Warm-up', 'Ouvrir 5 boosters', 'Open 5 boosters', G.open, 5, 40), A('o6', 'Collectionneur compulsif', 'Compulsive collector', 'Ouvrir 2 500 boosters', 'Open 2,500 boosters', G.open, 2500, 3500),
      A('w6', 'Centurion', 'Centurion', 'Gagner 100 combats', 'Win 100 battles', G.w, 100, 2500), A('w7', 'Invaincu', 'Undefeated', 'Gagner 200 combats', 'Win 200 battles', G.w, 200, 5000), A('w0', 'Combattant', 'Fighter', 'Gagner 3 combats', 'Win 3 battles', G.w, 3, 60),
      A('s4', 'Marathon', 'Marathon', '60 jours de suite', '60 days in a row', G.lg.n, 60, 2500), A('s5', 'Centenaire', 'Centennial', '100 jours de suite', '100 days in a row', G.lg.n, 100, 5000),
      A('e0', 'Première vente', 'First sale', 'Vendre 1 doublon', 'Sell 1 duplicate', G.sold, 1, 15), A('e4', 'Brocanteur', 'Flea market', 'Vendre 1 000 doublons', 'Sell 1,000 duplicates', G.sold, 1000, 2000),
      A('m1', 'Premier échange', 'First trade', '1 échange sur le marché', '1 market trade', G.tr || 0, 1, 60), A('m2', 'Négociant', 'Dealer', '10 échanges sur le marché', '10 market trades', G.tr || 0, 10, 400), A('m3', 'Roi du marché', 'Market king', '50 échanges sur le marché', '50 market trades', G.tr || 0, 50, 2000),
      A('q1', 'Journée remplie', 'Full day', 'Terminer les 3 défis d’un jour', 'Finish all 3 challenges in a day', G.qa || 0, 1, 60), A('q2', 'Routine', 'Routine', '10 jours de défis complets', '10 days of full challenges', G.qa || 0, 10, 400), A('q3', 'Infatigable', 'Tireless', '50 jours de défis complets', '50 days of full challenges', G.qa || 0, 50, 2500),
      A('x3', 'Explorateur', 'Explorer', 'Avoir des cartes de 12 jeux différents', 'Own cards from 12 different games', ng, 12, 800),
      A('x1', 'Globe-trotter', 'Globetrotter', 'Avoir des cartes de 8 jeux différents', 'Own cards from 8 different games', ng, 8, 400), A('x2', 'Multivers', 'Multiverse', 'Avoir des cartes de tous les jeux', 'Own cards from every game', ng, GK.length, 1500)];
    Object.keys(GAMES).filter(k => k !== 'tot').forEach(k => { const n = CD.filter(c => c.g === k).length, h = own().filter(i => byC[i].g === k).length; L_.push(A('g' + k + '1', GAMES[k][1] + ' · 50 %', GAMES[k][1] + ' · 50%', `Collecter la moitié des cartes ${GAMES[k][1]}`, `Collect half of ${GAMES[k][1]} cards`, h, Math.ceil(n / 2), 300), A('g' + k + '2', GAMES[k][1] + ' · 100 %', GAMES[k][1] + ' · 100%', `Toutes les cartes ${GAMES[k][1]}`, `Every ${GAMES[k][1]} card`, h, n, 1000), A('g' + k + '3', GAMES[k][1] + ' · Légendes', GAMES[k][1] + ' · Legends', `Toutes les Légendaires ${GAMES[k][1]}`, `Every ${GAMES[k][1]} Legendary`, own().filter(i => byC[i].g === k && byC[i].R === 4).length, Math.max(1, CD.filter(c => c.g === k && c.R === 4).length), 600)); });
    return L_; };
  function checkAch() { if (!CD) return; ACH().forEach(a => { if (a.cur >= a.max && !G.ach[a.id]) { G.ach[a.id] = Date.now(); credit(a.rew); setTimeout(() => { toast('🏆 ' + L(a.fr, a.en) + ' · +' + a.rew + ' ✦'); SFX.ach(); }, 200); } }); }
  // ----- structure de la page : un mini-site
  // ----- installer comme application (PWA)
  let DIP = null; window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); DIP = e; });
  const standalone = () => (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;
  const instStrip = () => standalone() ? '' : `<div class="hc-inst"><span class="hc-ii">📱</span><div><b>${L('Astrolabe sur votre téléphone, comme une vraie application', 'Astrolabe on your phone, like a real app')}</b><span class="sub">${L('Gratuit, sans store : une icône sur l’écran d’accueil, plein écran, et vos cartes restent disponibles même sans réseau.', 'Free, no store: a home-screen icon, full screen, and your cards stay available even offline.')}</span></div><button class="btn pri" data-hcinst="1">${L('Voir comment', 'Show me how')}</button></div>`;
  function instDlg(os) { let d = $('#hcinst'); if (!d) { d = document.createElement('dialog'); d.id = 'hcinst'; document.body.appendChild(d); d.addEventListener('click', ev => { if (ev.target === d) d.close(); }); }
    os = os || (/iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) ? 'ios' : /android/i.test(navigator.userAgent) ? 'and' : 'pc');
    const ST = { ios: [[L('Ouvrez le site dans Safari', 'Open the site in Safari'), L('Pas dans Chrome, Instagram ou Discord : seul Safari propose l’installation sur iPhone et iPad.', 'Not in Chrome, Instagram or Discord: only Safari offers installation on iPhone and iPad.')], [L('Touchez le bouton Partager', 'Tap the Share button'), L('Le carré avec une flèche vers le haut, en bas de l’écran (en haut sur iPad).', 'The square with an arrow pointing up, at the bottom of the screen (top on iPad).')], [L('« Sur l’écran d’accueil »', '“Add to Home Screen”'), L('Faites défiler la liste des actions vers le bas, puis touchez cette ligne.', 'Scroll the action list down, then tap this line.')], [L('Touchez « Ajouter »', 'Tap “Add”'), L('L’icône Astrolabe apparaît sur votre écran d’accueil. Ouvrez-la : le site s’affiche en plein écran.', 'The Astrolabe icon appears on your home screen. Open it: the site shows full screen.')]],
      and: [[L('Ouvrez le site dans Chrome', 'Open the site in Chrome'), L('Samsung Internet et Firefox fonctionnent aussi, avec un menu très proche.', 'Samsung Internet and Firefox work too, with a very similar menu.')], [L('Touchez le menu ⋮', 'Tap the ⋮ menu'), L('Les trois points en haut à droite.', 'The three dots at the top right.')], [L('« Installer l’application »', '“Install app”'), L('Sur certains téléphones : « Ajouter à l’écran d’accueil ».', 'On some phones: “Add to Home screen”.')], [L('Confirmez', 'Confirm'), L('L’icône Astrolabe arrive sur votre écran d’accueil et dans votre liste d’applications.', 'The Astrolabe icon arrives on your home screen and in your app list.')]],
      pc: [[L('Ouvrez le site dans Chrome ou Edge', 'Open the site in Chrome or Edge'), L('Firefox et Safari de bureau ne proposent pas l’installation.', 'Desktop Firefox and Safari do not offer installation.')], [L('Cliquez sur l’icône d’installation', 'Click the install icon'), L('À droite de la barre d’adresse (un écran avec une flèche), ou menu ⋮ → « Installer Astrolabe ».', 'At the right of the address bar (a screen with an arrow), or ⋮ menu → “Install Astrolabe”.')], [L('Confirmez', 'Confirm'), L('Astrolabe s’ouvre dans sa propre fenêtre, comme un logiciel.', 'Astrolabe opens in its own window, like software.')]] };
    d.innerHTML = `<h2>${L('Installer Astrolabe', 'Install Astrolabe')}</h2><div class="hc-fins">${[['ios', 'iPhone / iPad'], ['and', 'Android'], ['pc', L('Ordinateur', 'Computer')]].map(x => `<button class="chip ${os === x[0] ? 'on' : ''}" data-hcinst="${x[0]}">${x[1]}</button>`).join('')}</div><ol class="hc-steps">${ST[os].map((x, i) => `<li><b>${x[0]}</b><span>${x[1]}</span></li>`).join('')}</ol>${DIP && os !== 'ios' ? `<button class="btn pri" data-hcinst="go">${L('Installer maintenant', 'Install now')}</button> ` : ''}<button class="btn" data-hcinst="x">${L('Fermer', 'Close')}</button><p class="sub" style="font-size:12.5px;margin-top:12px">${L('Astrolabe est une application web : rien à télécharger depuis un store, et les mises à jour se font toutes seules.', 'Astrolabe is a web app: nothing to download from a store, and updates happen on their own.')}</p>`; if (!d.open) d.showModal(); }
  const TABS = () => [['open', L('Boosters', 'Boosters')], ['shop', L('Boutique', 'Shop')], ['mine', L('Ma collection', 'My collection')], ['all', L('Catalogue', 'Catalogue')], ['ach', L('Succès', 'Achievements')], ['fight', L('Combat', 'Battle')], ['market', L('Marché', 'Market')], ['rank', L('Classement', 'Ranking')]];
  function page(t) { document.body.classList.add('hcsite'); if (t === 'market') MK.rows = null; tab = TABS().some(x => x[0] === t) ? t : 'open'; load();
    return [`<div class="hcs"><header class="hcs-h"><a class="hcs-back" href="#/home">← ${L('Accueil', 'Home')}</a><div class="hcs-brand"><b><svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 2l15 9v18l-15 9-15-9V11z" fill="none" stroke="#7fe9ff" stroke-width="2.4"/><circle cx="20" cy="20" r="6.5" fill="none" stroke="#ff7ad9" stroke-width="2.4"/><path d="M20 8v5.5M20 26.5V32M8 20h5.5M26.5 20H32" stroke="#ffd36b" stroke-width="2"/></svg>FOILVAULT</b><small>${L('Le wiki-jeu des cartes gacha à collectionner', 'The wiki-game of collectible gacha cards')}</small></div><div class="hcs-r"><span class="hcs-lv" id="hclv"></span><span class="hcs-co hcs-st" id="hcst" title="${L('Boosters gratuits en réserve et prochain dans…', 'Free boosters in stock and next one in…')}"></span><span class="hcs-co" id="hcco" title="${L('Éclats', 'Shards')}"></span><button class="btn io hc-sy" data-hc="sync" id="hcsy">☁</button><button class="btn io" data-hc="snd" id="hcsnd" aria-label="${L('Son', 'Sound')}"></button></div></header>
      <nav class="hcs-t">${TABS().map(x => `<a class="${tab === x[0] ? 'on' : ''}" href="#/cartes/${x[0] === 'open' ? '' : x[0]}">${x[1]}</a>`).join('')}</nav><div id="hcr"><p class="sub">${L('Chargement des cartes…', 'Loading cards…')}</p></div></div>`, null, async () => { try { await data(); } catch { const r = $('#hcr'); if (r) r.innerHTML = `<p class="sub">${L('Cartes indisponibles : data/cards.json est introuvable.', 'Cards unavailable: data/cards.json is missing.')}</p>`; return; } try { await sync(); } catch { } mount(); syShow(); }]; }
  const chip = () => { const e = $('#hcst'); if (!e || !G) return; e.innerHTML = `🎴 <b>${G.st}/${MAXB}</b>${G.st >= MAXB ? '' : ' · <small>' + mmss(REGEN - (Date.now() - G.t)) + '</small>'}`; };
  const week = () => Math.floor(Date.now() / 604800000);
  const feat = () => { if (!CD) return null; const l = CD.filter(c => c.R === 4); return l.length ? l.slice().sort((a, b) => hs(a.id + 'w' + week()) - hs(b.id + 'w' + week()))[0] : null; };
  function head() { const s = summary(), lv = LV[s.lv], nx = LV[s.lv + 1]; const a = $('#hclv'), b = $('#hcco'), c = $('#hcsnd'); if (a) a.innerHTML = `<b>${L(lv[1], lv[2])}</b><i style="--w:${nx ? Math.round((s.p - lv[0]) / (nx[0] - lv[0]) * 100) : 100}%"></i>`; if (b) b.innerHTML = `${coinI} <b>${G.coins}</b>`; chip(); if (c) c.textContent = G.snd ? '🔊' : '🔇'; }
  function mount() { const r = $('#hcr'); if (!r) return; clearInterval(timer); regen(); checkAch(); save(); head();
    r.innerHTML = { open: openView, shop: shopView, mine: () => albumView(true), all: () => albumView(false), ach: achView, fight: fightView, market: marketView, rank: rankView }[tab]();
    if (tab === 'shop') supFill(); if (tab === 'rank') loadRank(); { timer = setInterval(() => { if (!$('#hcr')) return clearInterval(timer); const b = G.st; regen(); if (b !== G.st) return mount(); chip(); const nx = $('#hcnext'); if (nx) nx.textContent = G.st >= MAXB ? L('Réserve pleine', 'Stock full') : L('Prochain gratuit dans ', 'Next free one in ') + mmss(REGEN - (Date.now() - G.t)); }, 1000); } autoMore(); }
  let moreIO = null;
  function autoMore() { if (moreIO) moreIO.disconnect(); const b = $('[data-hc="more"]'); if (!b || !('IntersectionObserver' in window)) return; moreIO = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { moreIO.disconnect(); const y = scrollY; AF.n += 60; mount(); scrollTo(0, y); } }, { rootMargin: '700px' }); moreIO.observe(b); }
  const stockOf = pk => pk === 'gen' ? G.st + G.inv.gen : G.inv[pk] || 0;
  function heroFan(n = 5) { const o = own().filter(i => byC[i].img && byC[i].R >= 2).sort((a, b) => hs(a + today()) - hs(b + today())).slice(0, n), fill = CD.filter(c => c.img && c.R >= 3).sort((a, b) => hs(a.id + today()) - hs(b.id + today())), ids = o.concat(fill.map(c => c.id).filter(i => !o.includes(i))).slice(0, n); return `<div class="hc-fan" aria-hidden="true">${ids.map((i, k) => `<div style="--k:${k - (n - 1) / 2}">${cardHtml(byC[i], { fin: k === 2 ? 3 : k % 2 ? 2 : 1, cls: 'tilt' })}</div>`).join('')}</div>`; }
  function openView() { const s = summary(); const d = G.day, lgv = lgReward(G.lg.n);
    const tiles = Object.keys(PACKS).map(pk => { const n = stockOf(pk), p = PACKS[pk]; return `<div class="hc-pt ${n ? '' : 'off'}">${packHtml(pk, n ? 'ready' : 'empty')}<b>${L(p.fr, p.en)}</b><span class="sub">${pk === 'gen' ? `${G.st}/${MAXB} ${L('gratuits', 'free')}${G.inv.gen ? ' + ' + G.inv.gen : ''}` : n + ' ' + L('en réserve', 'in stock')}</span><button class="btn ${n ? 'pri' : ''}" data-hc="open" data-pk="${pk}" ${n ? '' : 'disabled'}>${n ? L('Ouvrir', 'Open') : pk === 'gen' ? L('Patientez…', 'Wait…') : L('Boutique', 'Shop')}</button></div>`; }).join('');
    const qs = d.q.map(id => { const q = QPOOL.find(x => x[0] === id), p = Math.min(d.p[id] || 0, q[1]), ok = p >= q[1], cl = d.c[id]; return `<div class="hc-q ${cl ? 'done' : ''}"><div><b>${L(q[2], q[3])}</b><div class="pbar"><div><i style="width:${p / q[1] * 100}%"></i></div><em>${p}/${q[1]}</em></div></div><button class="btn ${ok && !cl ? 'pri' : ''}" data-hcq="${id}" ${ok && !cl ? '' : 'disabled'}>${cl ? '✓' : `+${q[4]} ✦`}</button></div>`; }).join('');
    const gp = Object.keys(GAMES).map(k => { const tot = CD.filter(c => c.g === k).length, n = own().filter(i => byC[i].g === k).length; return `<div class="pbar"><span>${GAMES[k][1]}</span><div><i style="width:${Math.round(n / tot * 100)}%;background:${GAMES[k][2]}"></i></div><em>${n}/${tot}</em></div>`; }).join('');
    const last = G.last && G.last.length ? `${sec(L('Dernier booster', 'Last booster'))}<div class="hc-row">${G.last.filter(x => byC[x.id]).map(x => cardHtml(byC[x.id], { fin: x.f, alt: x.alt, cls: 'sm tilt', d: 'data-hcz="1"' })).join('')}</div>` : '';
    const fan = heroFan();
    return `<div class="hc-hero2"><div><span class="lab">${L('Bienvenue, collectionneur', 'Welcome, collector')}</span><h2>${L('Ouvrez. Collectionnez. Brillez.', 'Open. Collect. Shine.')}</h2><p>${L('Des centaines de personnages de gacha (HoYoverse, Persona 5 X, Bleach, Wuthering Waves, Nikke et plus), en Holo, Shiny et Dorée. Un booster gratuit toutes les 10 minutes.', 'Hundreds of gacha characters (HoYoverse, Persona 5 X, Bleach, Wuthering Waves, Nikke and more), in Holo, Shiny and Gold. A free booster every 10 minutes.')}</p></div>${fan}</div><div class="hc-top3"><div class="card hc-lg"><h2>${L('Récompense du jour', 'Daily reward')}</h2><p class="sub">${L('Série de connexion : ', 'Login streak: ')}<b>${G.lg.n}</b> ${L('jour(s)', 'day(s)')}</p><button class="btn ${G.lg.c ? '' : 'pri'}" data-hc="login" ${G.lg.c ? 'disabled' : ''}>${G.lg.c ? '✓ ' + L('Récupérée', 'Claimed') : L('Récupérer', 'Claim') + ' +' + lgv + ' ✦'}</button></div><div class="card hc-qs"><h2>${L('Défis du jour', 'Daily challenges')}</h2>${qs}</div></div>
    ${(() => { const f = feat(); return f ? `<div class="card hc-feat"><div>${cardHtml(f, { fin: 1, cls: 'sm tilt', d: 'data-hcz="1"' })}</div><div><span class="lab">${L('Carte de la semaine', 'Card of the week')}</span><h2>${esc(nm(f))}</h2><p class="sub">${esc(GAMES[f.g][0])} · ${L('Légendaire — environ 30 % de chances en plus quand une Légendaire sort dans un booster compatible. Change chaque lundi.', 'Legendary — about 30% extra chance whenever a Legendary comes out of a compatible booster. Changes every Monday.')}</p></div></div>` : ''; })()}<div class="hc-packs">${tiles}</div><p class="note" id="hcnext">${G.st >= MAXB ? L('Réserve pleine', 'Stock full') : L('Prochain gratuit dans ', 'Next free one in ') + mmss(REGEN - (Date.now() - G.t))} · ${L('1 booster général gratuit toutes les 10 minutes, 10 en réserve au maximum. Le dernier tirage est toujours Rare ou mieux ; une Légendaire est garantie au plus tard au 30e booster.', '1 free general booster every 10 minutes, 10 stored at most. The last card is always Rare or better; a Legendary is guaranteed by the 30th booster.')}</p>
    <div class="evs hc-sum"><div><b>${s.u}<small> / ${s.t}</small></b><span>${L('cartes différentes', 'different cards')}</span></div><div><b>${s.l}</b><span>${L('légendaires', 'legendaries')}</span></div><div><b>${s.g}</b><span>${L('dorées', 'gold')}</span></div><div><b>${G.open}</b><span>${L('boosters ouverts', 'boosters opened')}</span></div></div>
    <div class="card"><h2>${L('Progression par jeu', 'Progress by game')}</h2>${gp}</div>${last}
    <div class="card"><h2>${L('Raretés et finitions', 'Rarities and finishes')}</h2><p class="sub">${RAR.map(x => `<b style="color:${x.c}">${L(x.fr, x.en)}</b>`).join(' · ')}. ${L('La rareté d’un personnage suit sa place dans la tier list actuelle de son jeu (tier la plus haute = Légendaire, tier la plus basse = Commune), mais chaque carte peut sortir en Normale, Holo (≈15 %), Shiny (≈4 %) ou Dorée (≈1 %), et les Légendaires ont environ 1 chance sur 10 d’être en version « Éclipse ». Chaque finition est une variante à collectionner : avec ' + (CD.length) + ' cartes, ça fait plus de ' + (CD.length * 4) + ' variantes à trouver.', 'A character’s rarity follows its place in its game’s current tier list (top tier = Legendary, bottom tier = Common), but each card can come as Normal, Holo (≈15%), Shiny (≈4%) or Gold (≈1%), and Legendaries have about a 1 in 10 chance of an “Eclipse” version. Every finish is a variant to collect: with ' + CD.length + ' cards that is over ' + (CD.length * 4) + ' variants to find.')}</p></div>
    ${instStrip()}
    <div class="card"><h2>${L('Sauvegarde', 'Backup')}</h2><p class="sub">${L('Vos cartes sont enregistrées dans ce navigateur. Exportez-les pour les garder ou changer d’appareil.', 'Your cards are saved in this browser. Export them to keep them or switch device.')}</p><button class="btn" data-hc="exp">${L('Exporter', 'Export')}</button> <label class="btn" style="cursor:pointer">${L('Importer', 'Import')}<input type="file" id="hcimp" accept="application/json" hidden></label> <button class="btn" data-hc="reset">${L('Tout effacer', 'Erase all')}</button></div>`; }
  function shopView() { const tile = pk => { const p = PACKS[pk], pr = PRICE[pk], can = G.coins >= pr; return `<div class="hc-pt">${packHtml(pk, 'ready')}<b>${L(p.fr, p.en)}</b><span class="sub">${pk === 'prem' ? L('2 dernières cartes Rare+, bien plus de chances Épique/Légendaire', 'Last 2 cards Rare+, much better Epic/Legendary odds') : pk === 'gen' ? L('Tous les jeux', 'All games') : GAMES[p.g[0]][0] + (pk === 'hi3' ? ' + Tears of Themis' : '')}</span><span class="hc-pr">${coinI} ${pr}</span><div class="dact" style="justify-content:center"><button class="btn ${can ? 'pri' : ''}" data-hcbuy="${pk}:1" ${can ? '' : 'disabled'}>×1</button><button class="btn" data-hcbuy="${pk}:5" ${G.coins >= pr * 5 ? '' : 'disabled'}>×5</button><button class="btn" data-hcbuy="${pk}:10" ${G.coins >= pr * 10 ? '' : 'disabled'}>×10</button></div><span class="sub">${L('En réserve : ', 'In stock: ')}${G.inv[pk]}</span></div>`; }, grp = (t, ks) => `<h3 class="hc-gh">${t}</h3><div class="hc-packs">${ks.map(tile).join('')}</div>`, ks0 = Object.keys(PACKS);
    const tiles = grp(L('Boosters spéciaux', 'Special boosters'), ks0.filter(k => k === 'gen' || k === 'prem')) + grp(L('Boosters par jeu', 'Game boosters'), ks0.filter(k => k !== 'gen' && k !== 'prem'));
    return `<div class="evs hc-sum"><div><b>${coinI} ${G.coins}</b><span>${L('éclats disponibles', 'shards available')}</span></div><div><b>${G.es}</b><span>${L('éclats gagnés au total', 'shards earned in total')}</span></div><div><b>${G.sold}</b><span>${L('doublons vendus', 'duplicates sold')}</span></div></div>
    ${tiles}<div class="card"><h2>${L('Comment gagner des éclats (100 % gratuit)', 'How to earn shards (100% free)')}</h2><ul class="hc-ul"><li>${L('Connexion quotidienne : 20 ✦, +10 ✦ par jour de série (jusqu’à 80 ✦), et +100 ✦ le 7e jour', 'Daily login: 20 ✦, +10 ✦ per streak day (up to 80 ✦), and +100 ✦ on day 7')}</li><li>${L('3 défis par jour : 20 à 30 ✦ chacun, +30 ✦ si vous les terminez tous', '3 daily challenges: 20 to 30 ✦ each, +30 ✦ if you finish them all')}</li><li>${L('Combats : 5 par jour, 1 à 4 ✦ par victoire', 'Battles: 5 a day, 1 to 4 ✦ per win')}</li><li>${L('Vente des doublons : de 2 ✦ (Commune) à 250 ✦ (Légendaire Dorée)', 'Selling duplicates: from 2 ✦ (Common) to 250 ✦ (Gold Legendary)')}</li><li>${L('Succès : de 10 à 5 000 ✦, une seule fois', 'Achievements: from 10 to 5,000 ✦, once each')}</li></ul><p class="sub">${L('Un joueur qui revient chaque jour gagne environ 150 ✦ par jour, soit un booster de jeu tous les un jour et demi, plus les combats du jour. Les boosters généraux gratuits continuent d’arriver toutes les 10 minutes. Rien ne s’achète avec de l’argent réel.', 'A player who comes back every day earns about 150 ✦ a day, roughly one game booster every day and a half, plus the daily battles. Free general boosters keep arriving every 10 minutes. Nothing can be bought with real money.')}</p></div><div id="hcsup"></div>`; }
  let FBO = false;
  function filterBar(mine, o) { const gk = Object.keys(GAMES).filter(k => CD.some(c => c.g === k)), act = (AF.r !== '' ? 1 : 0) + (AF.f !== '' ? 1 : 0) + (!mine && AF.o ? 1 : 0) + (mine && AF.d ? 1 : 0) + (AF.q ? 1 : 0);
    const gp = (k, lab, n, h, col) => `<button class="hc-gp2 ${AF.g === k ? 'on' : ''}" data-hcf="g" data-v="${k}" style="--gc:${col}"><i></i><b>${lab}</b><em>${h}/${n}</em></button>`;
    const sg = (key, v, lab, col) => `<button class="${AF[key] === v ? 'on' : ''}" data-hcf="${key}" data-v="${v}" ${col ? `style="--sc:${col}"` : ''}>${col ? '<i></i>' : ''}${lab}</button>`;
    const FC_ = ['#cfd6ee', '#7fe3ff', '#ff9fe8', '#ffd24a'];
    const sorts = [['rar', L('Rareté', 'Rarity')], ['name', L('Nom (A-Z)', 'Name (A-Z)')], ['game', L('Jeu', 'Game')]].concat(mine ? [['cnt', L('Exemplaires', 'Copies')], ['pow', L('Puissance', 'Power')]] : []);
    return `<div class="hc-flt"><div class="hc-flt-top"><label class="hc-sr"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg><input type="search" id="hcq" placeholder="${L('Rechercher un personnage…', 'Search a character…')}" value="${esc(AF.q)}"></label>
      <label class="hc-sel"><span>${L('Trier par', 'Sort by')}</span><select data-hcsel="s">${sorts.map(x => `<option value="${x[0]}" ${AF.s === x[0] ? 'selected' : ''}>${x[1]}</option>`).join('')}</select></label>
      <button class="btn hc-fbt ${FBO ? 'on' : ''}" data-hc="fbtoggle">${L('Filtres', 'Filters')}${act ? ` <b>${act}</b>` : ''}</button></div>
      <div class="hc-gscroll" role="tablist">${gp('', L('Tous', 'All'), CD.length, o.length, '#e0b050')}${gk.map(k => gp(k, GAMES[k][1], CD.filter(c => c.g === k).length, o.filter(i => byC[i].g === k).length, GAMES[k][2])).join('')}</div>
      <div class="hc-fpan ${FBO ? 'open' : ''}"><div class="hc-fg"><span class="lab">${L('Rareté', 'Rarity')}</span><div class="hc-seg">${sg('r', '', L('Toutes', 'All'))}${RAR.map((x, i) => sg('r', String(i), L(x.fr, x.en), x.c)).join('')}</div></div>
      <div class="hc-fg"><span class="lab">${L('Finition', 'Finish')}</span><div class="hc-seg">${sg('f', '', L('Toutes', 'All'))}${FIN.map((x, i) => sg('f', String(i), L(x.fr, x.en), FC_[i])).join('')}${sg('f', 'x', L('Éclipse', 'Eclipse'), '#c9a8ff')}</div></div>
      ${mine ? `<div class="hc-fg"><span class="lab">${L('Doublons', 'Duplicates')}</span><div class="hc-seg">${sg('d', '', L('Tous', 'All'))}${sg('d', '1', L('Doublons seulement', 'Duplicates only'))}</div></div>` : `<div class="hc-fg"><span class="lab">${L('Statut', 'Status')}</span><div class="hc-seg">${sg('o', '', L('Tous', 'All'))}${sg('o', 'own', L('Possédées', 'Owned'))}${sg('o', 'miss', L('Manquantes', 'Missing'))}</div></div>`}
      ${act || AF.g ? `<button class="hc-reset" data-hc="freset">↺ ${L('Réinitialiser', 'Reset')}</button>` : ''}</div></div>`; }
  function sellPlan() { const o = own(); let v = 0, n = 0; o.forEach(i => { const c = byC[i]; if (c.R > SELL.cap) return; [0, 1, 2, 3].forEach(f => { if (SELL.keep && f >= 2) return; const k = Math.max(0, G.col[i].f[f] - 1); n += k; v += k * sellVal(c, f); }); }); return { v, n }; }
  function sellPanel(dv) { const caps = RAR.map((x, i) => `<button class="chip ${SELL.cap === i ? 'on' : ''}" data-hcsc="${i}">${i === 0 ? '' : '≤ '}${L(x.fr, x.en)}</button>`).join('');
    return `<div class="card hc-dup"><div class="hc-dup1"><h2>${L('Vendre mes doublons', 'Sell my duplicates')}</h2><div class="chips"><span class="lab">${L('Jusqu’à la rareté', 'Up to rarity')}</span>${caps}</div><div class="chips"><button class="chip ${SELL.keep ? 'on' : ''}" data-hcsk="1">🛡 ${L('Garder les Shiny, Dorées et Éclipse en double', 'Keep duplicate Shiny, Gold and Eclipse')}</button></div><p class="sub">${L('On garde toujours 1 exemplaire de chaque variante. ', 'You always keep 1 copy of each variant. ')}<b>${dv.n}</b> ${L('carte(s) à vendre', 'card(s) to sell')} · <b>${coinI} ${dv.v}</b></p></div><button class="btn ${SELL.conf ? 'pri' : ''}" data-hc="sellall" ${dv.n ? '' : 'disabled'}>${SELL.conf ? L('Confirmer : vendre ', 'Confirm: sell ') + dv.n + ' → +' + dv.v + ' ✦' : L('Vendre', 'Sell')}</button></div>`; }
  function albumView(mine) { const o = own(), q = AF.q.toLowerCase(), s = summary();
    let list = CD.filter(c => (!AF.g || c.g === AF.g) && (AF.r === '' || c.R === +AF.r) && (mine ? o.includes(c.id) : (!AF.o || (AF.o === 'own') === o.includes(c.id))) && (!q || (c.n + ' ' + c.ne).toLowerCase().includes(q)) && (AF.f === '' || (G.col[c.id] && (AF.f === 'x' ? G.col[c.id].x > 0 : G.col[c.id].f[+AF.f] > 0))) && (!mine || AF.d !== '1' || (G.col[c.id] && G.col[c.id].n > 1)));
    list.sort((a, b) => AF.s === 'pow' ? power2(b) - power2(a) : AF.s === 'game' ? Object.keys(GAMES).indexOf(a.g) - Object.keys(GAMES).indexOf(b.g) || b.R - a.R : AF.s === 'name' ? nm(a).localeCompare(nm(b)) : AF.s === 'cnt' ? ((G.col[b.id] || { n: 0 }).n - (G.col[a.id] || { n: 0 }).n) : b.R - a.R || nm(a).localeCompare(nm(b)));
    const power2 = c => { const e = G.col[c.id]; if (!e || !e.n) return -1; const t = stats(c, best(e)); return t.atk + t.def; };
    const chip = (k, v, l) => `<button class="chip ${AF[k] === v ? 'on' : ''}" data-hcf="${k}" data-v="${v}">${l}</button>`;
    const dv = sellPlan(); const dupV = dv.v;
    return `<div class="evs hc-sum"><div><b>${s.u}<small> / ${s.t}</small></b><span>${mine ? L('cartes possédées', 'cards owned') : L('dans le catalogue', 'in the catalogue')}</span></div><div><b>${s.t ? Math.round(s.u / s.t * 100) : 0} %</b><span>${L('complété', 'complete')}</span></div><div><b>${s.tot}</b><span>${L('exemplaires', 'copies')}</span></div></div>
    ${mine ? sellPanel(dv)  : `<p class="note">${L('Voici toutes les cartes qui existent. Celles que vous n’avez pas encore sont grisées ; les petits points montrent les finitions déjà trouvées (Normale, Holo, Shiny, Dorée, Éclipse).', 'Here is every card that exists. The ones you do not own yet are greyed out; the little dots show the finishes found so far (Normal, Holo, Shiny, Gold, Eclipse).')}</p>`}
    ${filterBar(mine, o)}
    <p class="sub">${list.length} ${L('cartes', 'cards')}</p><div class="hc-grid">${list.slice(0, AF.n).map(c => { const e = G.col[c.id], has = e && e.n > 0; return `<div class="hc-w">${cardHtml(c, { fin: has ? best(e) : 0, alt: has && e.x > 0, dim: !has, cnt: has ? e.n : 0, cls: 'sm' + (has ? ' tilt' : ''), d: 'data-hcz="1"' })}${pips(e, c)}</div>`; }).join('')}</div>${list.length > AF.n ? `<p style="text-align:center"><button class="btn" data-hc="more">${L('Afficher plus', 'Show more')}</button></p>` : ''}`; }
  const achCat = a => /^o/.test(a.id) ? 'o' : /^[ulfr]\d/.test(a.id) ? 'c' : /^w/.test(a.id) ? 'w' : /^[sq]\d/.test(a.id) ? 's' : /^[em]\d/.test(a.id) ? 'e' : 'g';
  function achView() { const A0 = ACH(), A = A0.filter(a => (!AFL.c || achCat(a) === AFL.c) && (!AFL.st || (AFL.st === 'ok') === !!G.ach[a.id])), got = A0.filter(a => G.ach[a.id]).length, tot = A0.reduce((s, a) => s + a.rew, 0), rc = A0.filter(a => G.ach[a.id]).reduce((s, a) => s + a.rew, 0);
    return `<div class="evs hc-sum"><div><b>${got}<small> / ${A0.length}</small></b><span>${L('succès débloqués', 'achievements unlocked')}</span></div><div><b>${coinI} ${rc}</b><span>${L('éclats reçus', 'shards received')}</span></div><div><b>${tot - rc}</b><span>${L('éclats à gagner', 'shards left to earn')}</span></div></div><p class="note">${L('Les récompenses sont ajoutées automatiquement dès que le succès est atteint.', 'Rewards are added automatically as soon as the achievement is reached.')}</p>
    ${(() => { const ch = (k, v, l) => `<button class="chip ${AFL[k] === v ? 'on' : ''}" data-hcaf="${k}" data-v="${v}">${l}</button>`; return `<div class="chips"><span class="lab">${L('Catégorie', 'Category')}</span>${ch('c', '', L('Tous', 'All'))}${ch('c', 'o', L('Boosters', 'Boosters'))}${ch('c', 'c', L('Collection', 'Collection'))}${ch('c', 'w', L('Combats', 'Battles'))}${ch('c', 's', L('Séries', 'Streaks'))}${ch('c', 'e', L('Commerce', 'Trade'))}${ch('c', 'g', L('Jeux', 'Games'))}<span class="lab" style="margin-left:10px">${L('État', 'State')}</span>${ch('st', '', L('Tous', 'All'))}${ch('st', 'todo', L('En cours', 'In progress'))}${ch('st', 'ok', L('Débloqués', 'Unlocked'))}</div>`; })()}
    <div class="hc-ach">${A.sort((a, b) => !!G.ach[a.id] - !!G.ach[b.id] || (b.cur / b.max) - (a.cur / a.max)).map(a => `<div class="hc-a ${G.ach[a.id] ? 'ok' : ''}"><i>${G.ach[a.id] ? '🏆' : '🔒'}</i><div><b>${L(a.fr, a.en)}</b><small>${L(a.dfr, a.den)}</small><div class="pbar"><div><i style="width:${a.cur / a.max * 100}%"></i></div><em>${a.cur}/${a.max}</em></div></div><span class="hc-ar">+${a.rew} ✦</span></div>`).join('')}</div>`; }
  // ----- ouverture d'un booster
  let cur = { pk: 'gen', res: [] };
  // ----- scènes d'ouverture par univers (illustrations originales, pas de personnages officiels)
  const SCN = {
    hsr: () => `<svg class="sc-train" viewBox="0 0 360 100"><g fill="#e9eefc"><rect x="6" y="30" width="230" height="40" rx="10"/><path d="M236 30h40c34 0 60 22 74 40H236z" fill="#cfd8f6"/><rect x="250" y="38" width="40" height="14" rx="6" fill="#7fd6ff"/></g><g fill="#7fd6ff">${[0, 1, 2, 3, 4, 5].map(i => `<rect x="${22 + i * 34}" y="40" width="22" height="14" rx="4"/>`).join('')}</g><rect x="6" y="58" width="230" height="5" fill="#ffcf5a"/><g fill="#1b2144" stroke="#e9eefc" stroke-width="3">${[40, 90, 160, 230, 300].map(x => `<circle cx="${x}" cy="76" r="9"/>`).join('')}</g></svg><i class="sc-rail"></i>${Array.from({ length: 14 }, (_, i) => `<b class="sc-str" style="top:${8 + i * 6.3}%;animation-delay:${(i % 5) * .12}s"></b>`).join('')}`,
    gi: () => `<svg class="sc-fairy" viewBox="0 0 120 120"><g fill="none" stroke="#bff3ff" stroke-width="3" stroke-linecap="round"><path d="M44 58C20 44 14 22 34 18c14-2 18 14 8 22"/><path d="M76 58c24-14 30-36 10-40-14-2-18 14-8 22"/></g><circle cx="60" cy="62" r="20" fill="#fff6d6"/><path d="M60 82c-16 0-22 14-22 26h44c0-12-6-26-22-26z" fill="#7fd6ff"/><path d="M60 24l4 9 10 1-8 6 3 10-9-6-9 6 3-10-8-6 10-1z" fill="#ffcf5a"/><circle cx="53" cy="62" r="2.6" fill="#1b2144"/><circle cx="67" cy="62" r="2.6" fill="#1b2144"/></svg>${Array.from({ length: 16 }, (_, i) => `<b class="sc-leaf" style="left:${(i * 37) % 100}%;animation-delay:${(i % 6) * .18}s"></b>`).join('')}<i class="sc-wind"></i>`,
    zzz: () => `<div class="sc-crt"><i></i><b>NOW LOADING</b></div>${Array.from({ length: 10 }, (_, i) => `<b class="sc-glt" style="top:${8 + i * 9}%;animation-delay:${(i % 4) * .1}s"></b>`).join('')}`,
    hi3: () => `<svg class="sc-crest" viewBox="0 0 120 120"><g fill="none" stroke="#ffd1e6" stroke-width="3"><circle cx="60" cy="60" r="34"/><circle cx="60" cy="60" r="46" stroke-dasharray="3 7"/><path d="M60 22l8 24 26 2-20 16 7 25-21-14-21 14 7-25-20-16 26-2z" fill="#ffd1e6" fill-opacity=".25"/></g></svg>${Array.from({ length: 18 }, (_, i) => `<b class="sc-fea" style="left:${(i * 29) % 100}%;animation-delay:${(i % 7) * .16}s"></b>`).join('')}`,
    ww: () => `<svg class="sc-wave" viewBox="0 0 160 100"><g fill="none" stroke="#6fd6ff" stroke-width="3" stroke-linecap="round">${[0, 1, 2, 3].map(i => `<path d="M${6 + i * 3} ${50 - i * 8}c20-30 40 30 60 0s40 30 60 0s24 14 28 0" opacity="${1 - i * .2}"/>`).join('')}</g><circle cx="80" cy="50" r="7" fill="#fff"/></svg>${Array.from({ length: 16 }, (_, i) => `<b class="sc-ech" style="left:${(i * 41) % 100}%;top:${(i * 23) % 90}%;animation-delay:${(i % 6) * .15}s"></b>`).join('')}`,
    r99: () => `<svg class="sc-clock" viewBox="0 0 120 120"><circle cx="60" cy="60" r="48" fill="none" stroke="#d9b27c" stroke-width="3"/><circle cx="60" cy="60" r="40" fill="none" stroke="#d9b27c" stroke-width="1" stroke-dasharray="2 5"/><path class="sc-hand" d="M60 60V26" stroke="#ffe3b0" stroke-width="3" stroke-linecap="round"/><path class="sc-hand2" d="M60 60h22" stroke="#ffe3b0" stroke-width="4" stroke-linecap="round"/></svg>${Array.from({ length: 16 }, (_, i) => `<b class="sc-rain" style="left:${(i * 37) % 100}%;animation-delay:${(i % 7) * .14}s"></b>`).join('')}`,
    uma: () => `<svg class="sc-shoe" viewBox="0 0 120 80"><path d="M14 56c0-22 14-34 30-34 8 0 12 6 22 6 12 0 24 6 24 28v6H14z" fill="#ffe0ef"/><path d="M14 62h96" stroke="#ff9ac8" stroke-width="5"/></svg><i class="sc-trk"></i>${Array.from({ length: 14 }, (_, i) => `<b class="sc-pet" style="left:${(i * 33) % 100}%;animation-delay:${(i % 6) * .17}s"></b>`).join('')}`,
    tot: () => `<svg class="sc-env" viewBox="0 0 120 90"><rect x="8" y="14" width="104" height="66" rx="8" fill="#fff4f1"/><path d="M8 20l52 36 52-36" fill="none" stroke="#d98ba0" stroke-width="3"/><path d="M60 64C42 52 40 42 48 38c6-3 10 0 12 4 2-4 6-7 12-4 8 4 6 14-12 26z" fill="#e5557a"/></svg>${Array.from({ length: 14 }, (_, i) => `<b class="sc-hrt" style="left:${(i * 31) % 100}%;animation-delay:${(i % 6) * .18}s"></b>`).join('')}`
  };
  SCN.__g = g => `<svg class="sc-gl" viewBox="0 0 100 100" aria-hidden="true"><path d="${GLY[g] || GLY.hsr}"/></svg><i class="sc-gr"></i><i class="sc-gr b"></i>${Array.from({ length: 22 }, (_, i) => `<b class="sc-gp" style="left:${(i * 37) % 100}%;animation-delay:${(i % 8) * .15}s;--s:${6 + (i * 5) % 9}px"></b>`).join('')}`;
  const backHtml = () => `<span class="hc-bk"><svg viewBox="0 0 100 140" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="bkg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe9a8"/><stop offset=".5" stop-color="#e0b050"/><stop offset="1" stop-color="#8a5a14"/></linearGradient></defs><rect width="100" height="140" fill="#0d1230"/><g stroke="#e0b050" stroke-opacity=".13" stroke-width=".5">${Array.from({ length: 16 }, (_, i) => `<path d="M${i * 8 - 20} 0L${i * 8 + 60} 140M${i * 8 + 60} 0L${i * 8 - 20} 140"/>`).join('')}</g><rect x="4" y="4" width="92" height="132" rx="7" fill="none" stroke="url(#bkg)" stroke-width="1.6"/><rect x="8" y="8" width="84" height="124" rx="5" fill="none" stroke="#e0b050" stroke-opacity=".45" stroke-width=".6"/><g transform="translate(50 62)" fill="none" stroke="url(#bkg)"><circle r="27" stroke-width="1.4"/><circle r="21" stroke-width=".6" stroke-dasharray="1.2 2.4"/><circle r="12" stroke-width=".8"/>${Array.from({ length: 24 }, (_, i) => `<path d="M0 -27v${i % 6 ? 2.5 : 5}" stroke-width=".9" transform="rotate(${i * 15})"/>`).join('')}<path d="M0 -17L3.4 -3.4 17 0 3.4 3.4 0 17 -3.4 3.4 -17 0 -3.4 -3.4z" fill="url(#bkg)" stroke="none"/><path d="M-30 0h60M0 -30v60" stroke-width=".4" opacity=".6"/></g><text x="50" y="108" text-anchor="middle" font-family="Cinzel,Georgia,serif" font-weight="700" font-size="9.5" letter-spacing="2.4" fill="url(#bkg)">FOILVAULT</text><text x="50" y="119" text-anchor="middle" font-family="Cinzel,Georgia,serif" font-weight="600" font-size="5.2" letter-spacing="3.4" fill="#e0b050" fill-opacity=".85">CARDS</text></svg></span>`;
  const zig = (rev) => { const p = []; for (let i = 0; i <= 14; i++) p.push(`${(i / 14 * 100).toFixed(1)}% ${i % 2 ? 15 : 19}%`); return rev ? p.reverse() : p; };
  const tagHtml = x => x.isNew ? `<em class="hc-new">${L('NOUVEAU', 'NEW')}</em>` : x.newFin ? `<em class="hc-new f">${L('NOUVELLE FINITION', 'NEW FINISH')}</em>` : `<em class="hc-new d">${L('DOUBLON', 'DUPLICATE')} +${x.val} ✦</em>`;
  const fx = x => { const t = x.alt ? 4 : Math.max(x.r, x.f >= 3 ? 4 : x.f >= 2 ? 3 : 0), c = x.alt ? '#c9a8ff' : x.f >= 3 ? '#ffd24a' : RAR[x.r].c, lab = x.alt ? L('ÉCLIPSE', 'ECLIPSE') : x.f >= 3 ? L('DORÉE', 'GOLD') : x.r === 4 ? L('LÉGENDAIRE', 'LEGENDARY') : x.f === 2 ? 'SHINY' : x.r === 3 ? L('ÉPIQUE', 'EPIC') : x.r === 2 ? L('RARE', 'RARE') : ''; return { t, c, lab }; };
  function sparks(el, col, n) { if (red()) return; const r = el.getBoundingClientRect(), ov = $('#hcov'); if (!ov) return; for (let k = 0; k < n; k++) { const i = document.createElement('i'); i.className = 'hc-sp'; const a = Math.random() * 6.283, d = 70 + Math.random() * 150; i.style.cssText = `left:${r.left + r.width / 2}px;top:${r.top + r.height / 2}px;--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d}px;background:${col};animation-delay:${Math.random() * 0.15}s`; ov.appendChild(i); setTimeout(() => i.remove(), 1300); } }
  function openPack(pk) { load(); if (!CD || stockOf(pk) < 1) return; try { document.body.classList.toggle('hc-lite', (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 4 || matchMedia('(pointer:coarse)').matches); } catch (e) { } if (pk === 'gen') { if (G.st > 0) { G.st--; if (G.st === MAXB - 1) G.t = Date.now(); } else G.inv.gen--; } else G.inv[pk]--;
    const got = draw(pk); G.open++; G.pr = G.pr || [0, 0, 0, 0, 0]; G.pn = G.pn || [0, 0, 0, 0]; got.forEach(x => { G.pr[x.r]++; G.pn[x.f]++; }); bump('open3'); if (pk !== 'gen') bump('game1'); const res = got.map(x => { const a = add(x); if (x.f >= 1) bump('holo1'); if (x.r >= 2) bump('rare2'); if (a.isNew) bump('new3'); return { ...x, ...a }; }); G.last = got.map(x => ({ id: x.id, f: x.f, alt: x.alt })); checkAch(); save();
    const dv = res.filter(x => x.dup).reduce((s, x) => s + x.val, 0); cur = { pk, res, i: 0, dv };
    
    buildRitual(); }
  // ===== v27 : nouvelle ouverture « Rituel du coffre » : on découpe le booster du doigt, les cartes se déploient face cachée (leur halo trahit les plus rares), puis on les révèle une à une ou d’un coup ; les cartes épiques et plus ont droit à leur plan large.
  function buildRitual() {
    const res = cur.res, pk = cur.pk, m = Math.max(...res.map(x => x.r)), top = res.filter(x => x.r === m)[0], topC = fx(res.reduce((a, x) => fx(x).t > fx(a).t ? x : a, res[0])).c;
    const ov = document.createElement('div'); ov.id = 'hcov'; ov.className = 'rt b' + m; ov.style.setProperty('--best', RAR[m].c); ov.style.setProperty('--tc', topC); ov.style.setProperty('--gc', (GAMES[byC[top.id].g] || GAMES.hsr)[2]); ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true');
    ov.innerHTML = `<div class="rt-bg" aria-hidden="true"><i class="rt-hex"></i><i class="rt-glow"></i></div><button class="rt-x" data-hc="close" aria-label="${L('Fermer', 'Close')}">✕</button>
    <section class="rt-s1"><div class="rt-pw"><div class="rt-pack" tabindex="0" role="button" aria-label="${L('Découper le booster', 'Cut the booster open')}"><div class="rt-pk">${packHtml(pk, 'tear')}</div><i class="rt-sheen"></i><i class="rt-line"></i><b class="rt-flare"></b></div></div>
      <p class="rt-hint"><span>${L('Glissez sur le booster pour le découper', 'Swipe across the booster to cut it open')}</span><small>${L('ou touchez-le', 'or just tap it')}</small></p><div class="rt-meter"><i></i></div></section>
    <section class="rt-s2" hidden><h2 class="rt-title"></h2><div class="rt-row">${res.map((x, i) => { const e = fx(x); return `<div class="rt-slot" style="--i:${i}"><button class="rt-card ${e.t >= 3 ? 'hot' : ''}" data-rti="${i}" style="--rc:${e.c}" aria-label="${L('Carte', 'Card')} ${i + 1}"><span class="rt-back">${backHtml()}</span><span class="rt-front">${cardHtml(byC[x.id], { fin: x.f, alt: x.alt, cls: 'tilt' })}</span></button><span class="rt-tag"></span></div>`; }).join('')}</div>
      <p class="rt-hint2">${L('Touchez une carte pour la révéler', 'Tap a card to reveal it')}</p><div class="rt-act"><button class="btn pri" data-hc="all" id="rtall">${L('Tout révéler', 'Reveal all')}</button></div></section><div class="rt-spot" hidden></div>`;
    document.body.appendChild(ov); document.body.classList.add('hc-lock'); head();
    const R = { s1: $('.rt-s1', ov), s2: $('.rt-s2', ov), spot: $('.rt-spot', ov), done: new Set(), busy: false, cut: false }; cur.R = R;
    const pack = $('.rt-pack', ov), meter = $('.rt-meter i', ov); let p = 0, sx = 0, down = false, t0 = 0, moved = 0, raf = 0;
    const paint = v => { p = v; pack.style.setProperty('--p', v.toFixed(3)); meter.style.width = (v * 100) + '%'; };
    const rip = () => { if (R.cut) return; R.cut = true; paint(1); SFX.tear(); pack.classList.add('rip'); ov.classList.add('cut'); setTimeout(deal, red() ? 0 : 520); };
    pack.addEventListener('pointerdown', e => { if (R.cut) return; down = true; sx = e.clientX; t0 = Date.now(); moved = 0; try { pack.setPointerCapture(e.pointerId); } catch (_) { } cancelAnimationFrame(raf); pack.classList.add('drag'); });
    pack.addEventListener('pointermove', e => { if (!down || R.cut) return; moved = Math.max(moved, Math.abs(e.clientX - sx)); const w = pack.getBoundingClientRect().width; const v = Math.min(1, moved / (w * .72)); paint(v); if (v >= 1) { down = false; rip(); } });
    const up = () => { if (!down) return; down = false; pack.classList.remove('drag'); if (R.cut) return; if (moved < 10 && Date.now() - t0 < 500) { rip(); return; } const back = () => { if (R.cut) return; paint(Math.max(0, p - .06)); if (p > 0) raf = requestAnimationFrame(back); }; back(); };
    pack.addEventListener('pointerup', up); pack.addEventListener('pointercancel', up); pack.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); rip(); } });
    function deal() { R.s1.hidden = true; R.s2.hidden = false; ov.classList.add('dealt'); const cnt = res.length; $('.rt-title', ov).textContent = L(`${cnt} cartes`, `${cnt} cards`); const c0 = $$('.rt-card', ov); c0.forEach((c, i) => setTimeout(() => { c.classList.add('in'); if (i === cnt - 1) SFX.click(); }, red() ? 0 : 90 * i)); const tp = $('.rt-title', ov); tp.classList.add('in'); }
  }
  const rtDelay = ms => new Promise(r => setTimeout(r, ms));
  async function rtReveal(i, auto) {
    const ov = $('#hcov'); if (!ov || !cur || !cur.R) return; const C = cur, R = cur.R; if (R.done.has(i) || R.busy) return; R.done.add(i);
    const x = cur.res[i], e = fx(x), btn = $(`.rt-card[data-rti="${i}"]`, ov); if (!btn) return; const slot = btn.parentNode, quick = red();
    btn.classList.add('open'); SFX.flip(); setTimeout(() => SFX.reveal(x.r, x.f), 160); $('.rt-tag', slot).innerHTML = tagHtml(x); slot.classList.add('shown');
    $('.rt-hint2', ov).textContent = '';
    if (!quick) { await rtDelay(260); if (cur !== C) return; const st = $('.rt-row', ov); ov.style.setProperty('--rc', e.c);
      if (e.t >= 3) { await rtSpot(x, e, auto); if (cur !== C) return; } else if (e.t >= 2) { sparks(btn, e.c, 14); btn.classList.add('wow'); setTimeout(() => btn.classList.remove('wow'), 900); } }
    if (cur === C && R.done.size >= cur.res.length) rtFinish(); }
  function rtSpot(x, e, auto) { return new Promise(res => { const ov = $('#hcov'), C = cur, R = cur && cur.R; if (!ov || !R) return res(); const sp = R.spot; R.busy = true; const long = e.t >= 4;
    sp.style.setProperty('--rc', e.c); sp.className = 'rt-spot t' + e.t; sp.innerHTML = `<i class="rt-rays"></i><i class="rt-ring"></i><div class="rt-sc">${cardHtml(byC[x.id], { fin: x.f, alt: x.alt, cls: 'tilt big' })}</div><b class="rt-ban">${esc(e.lab || '')}</b><p class="rt-nm">${esc(nm(byC[x.id]))}</p>${tagHtml(x)}<small class="rt-tap">${L('Touchez pour continuer', 'Tap to continue')}</small>`; sp.hidden = false;
    ov.classList.add('spot'); if (long) { ov.classList.add('flash'); setTimeout(() => ov.classList.remove('flash'), 700); }
    setTimeout(() => sparks($('.rt-sc', sp) || sp, e.c, long ? 46 : 24), 250); let fin = false; const end = () => { if (fin) return; fin = true; clearTimeout(tm); sp.removeEventListener('click', end); sp.classList.add('out'); setTimeout(() => { sp.hidden = true; sp.innerHTML = ''; sp.className = 'rt-spot'; if (ov.isConnected) ov.classList.remove('spot'); R.busy = false; res(); }, 260); };
    const tm = setTimeout(end, auto ? (long ? 2300 : 1500) : (long ? 5000 : 3500)); setTimeout(() => sp.addEventListener('click', end), 450); }); }
  function rtFinish() { const ov = $('#hcov'); if (!ov || !cur || cur.R.fin) return; cur.R.fin = true; const res = cur.res, pk = cur.pk, nw = res.filter(x => x.isNew).length, dp = res.filter(x => x.dup).length, m = Math.max(...res.map(x => x.r));
    $('.rt-title', ov).innerHTML = `${L('Votre tirage', 'Your pull')} <small>${nw ? nw + ' ' + L(nw > 1 ? 'nouvelles' : 'nouvelle', 'new') : ''}${nw && dp ? ' · ' : ''}${dp ? dp + ' ' + L(dp > 1 ? 'doublons' : 'doublon', dp > 1 ? 'duplicates' : 'duplicate') : ''} · ${L(RAR[m].fr, RAR[m].en)}</small>`;
    $('.rt-hint2', ov).textContent = L('Touchez une carte pour la voir en grand', 'Tap a card to see it up close');
    $('.rt-act', ov).innerHTML = `${cur.dv ? `<button class="btn" data-hc="selldup" id="hcsd">${L('Vendre les doublons', 'Sell duplicates')} (+${cur.dv} ✦)</button>` : ''}<button class="btn pri" data-hc="again" ${stockOf(pk) ? '' : 'disabled'}>${L('Ouvrir un autre', 'Open another')} (${stockOf(pk)})</button><button class="btn" data-hc="close">${L('Fermer', 'Close')}</button>`;
    const bm = res.reduce((a, x) => x.r > a.r || (x.r === a.r && x.f > a.f) ? x : a, res[0]); if (m >= 3) sparks($('.rt-row', ov), RAR[m].c, 20); }
  async function skipAll() { const ov = $('#hcov'); if (!ov || !cur || !cur.R) return; const C = cur, R = cur.R; if (!R.cut) { R.skipAfter = 1; const pk = $('.rt-pack', ov); if (pk) pk.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' })); await rtDelay(red() ? 40 : 900); }
    if (R.all) return; R.all = true; const btn = $('#rtall', ov); if (btn) btn.disabled = true; for (let i = 0; i < C.res.length; i++) { while (R.busy && cur === C) await rtDelay(80); if (cur !== C) return; await rtReveal(i, true); if (cur !== C) return; await rtDelay(C.res[i].r >= 3 ? 150 : 300); } }
  function cardClick() { }
  const closeOv = () => { const ov = $('#hcov'); if (ov) ov.remove(); document.body.classList.remove('hc-lock'); cur = null; if ($('#hcr')) mount(); };

  // ----- fiche détaillée
  function zoom(id) { const c = byC[id]; if (!c) return; load(); const e = G.col[id], has = e && e.n > 0; let fin = has ? best(e) : 0, alt = has && e.x > 0;
    let d = $('#hczd'); if (!d) { d = document.createElement('dialog'); d.id = 'hczd'; document.body.appendChild(d); d.addEventListener('click', ev => { if (ev.target === d) d.close(); }); }
    const draw_ = () => { const e = G.col[id], sx = stats(c, fin), r = c.R, shown = G.show.some(s => s.split(':')[0] === id), hsrId = c.g === 'hsr' ? id.replace('hsr-', '') : '', link = hsrId && byId[hsrId] ? `<a class="btn" href="#/perso/${hsrId}" data-close="hczd">${L('Fiche Astrolabe', 'Astrolabe guide')}</a>` : '';
      d.innerHTML = `<div class="hc-zoom">${cardHtml(c, { fin, alt, cls: 'tilt big' })}<div class="hc-zi"><h2>${esc(nm(c))}</h2><p class="sub">${esc(GAMES[c.g] ? GAMES[c.g][0] : '')} · ${esc(L(elX(c)[0], elX(c)[1]))} · <b style="color:${RAR[r].c}">${L(RAR[r].fr, RAR[r].en)}</b></p>
      <p class="hc-desc">${esc(sumOf(c))}</p>${c.tl ? `<p class="sub">${L('Classement actuel', 'Current ranking')} : <b>${esc(c.tl)}</b> ${L('dans la tier list de son jeu', 'in its game’s tier list')}</p>` : ''}<div class="hc-fins">${FIN.map((f, i) => `<button class="chip ${fin === i ? 'on' : ''}" data-hcfin="${i}">${L(f.fr, f.en)} ${e ? '×' + e.f[i] : ''}</button>`).join('')}${c.R === 4 ? `<button class="chip ${alt ? 'on' : ''}" data-hcalt="1">${L('Éclipse', 'Eclipse')} ${e ? '×' + e.x : ''}</button>` : ''}</div>
      <div class="hc-bars"><div class="pbar"><span>ATK</span><div><i style="width:${Math.min(100, sx.atk)}%;background:#ff6a3d"></i></div><em>${sx.atk}</em></div><div class="pbar"><span>DEF</span><div><i style="width:${Math.min(100, sx.def)}%;background:#5aa8ff"></i></div><em>${sx.def}</em></div><div class="pbar"><span>PV</span><div><i style="width:${Math.min(100, sx.hp / 3)}%;background:#5fd08a"></i></div><em>${sx.hp}</em></div></div>
      ${has ? '' : `<p class="sub">${L('Vous ne possédez pas encore cette carte. Aperçu des finitions possibles.', 'You do not own this card yet. Preview of the possible finishes.')}</p>`}
      <div class="dact" style="justify-content:flex-start">${has && e.f[fin] ? `<button class="btn ${shown ? 'on' : ''}" data-hcshow="${esc(id)}:${fin}:${alt ? 1 : 0}">${shown ? '★ ' + L('En vitrine', 'In showcase') : '☆ ' + L('Mettre en vitrine', 'Add to showcase')}</button>` : ''}${has && e.f[fin] > 1 ? `<button class="btn" data-hcsell="${esc(id)}:${fin}">${L('Vendre 1 doublon', 'Sell 1 duplicate')} +${sellVal(c, fin)} ✦</button>` : ''}${has ? link : ''}<button class="btn" data-close="hczd">${L('Fermer', 'Close')}</button></div></div></div>`; };
    d.__redraw = draw_; d.__set = (k, v) => { if (k === 'fin') fin = v; else alt = !alt; draw_(); }; draw_(); if (!d.open) d.showModal(); }
  // ----- combat (résolu automatiquement, cartes ATK/DEF/PV déterministes)
  const FS = { team: [], diff: 0.9, log: [], res: '' };
  const power = id => { const s = stats(byC[id], best(G.col[id])); return s.atk + s.def; };
  function fightView() { const o = own().sort((a, b) => power(b) - power(a)), sel = FS.team.filter(i => o.includes(i));
    if (o.length < 3) return `<div class="card"><h2>${L('Pas encore assez de cartes', 'Not enough cards yet')}</h2><p class="sub">${L('Il faut au moins 3 cartes différentes pour former une équipe.', 'You need at least 3 different cards to form a team.')}</p><a class="btn pri" href="#/cartes">${L('Aller aux boosters', 'Go to boosters')}</a></div>`;
    const left = fLeft();
    return `<div class="evs hc-sum"><div><b>${G.w}</b><span>${L('victoires', 'wins')}</span></div><div><b>${G.l}</b><span>${L('défaites', 'losses')}</span></div><div><b>${left}</b><span>${L('combats restants aujourd’hui (retour à minuit)', 'battles left today (back at midnight)')}</span></div></div>
    <div class="card"><h2>${L('Votre équipe', 'Your team')} (${sel.length}/3)</h2><div class="hc-row">${[0, 1, 2].map(i => sel[i] ? cardHtml(byC[sel[i]], { fin: best(G.col[sel[i]]), cls: 'sm', d: `data-hcteam="${esc(sel[i])}"` }) : `<div class="hc sm empty"><span>+</span></div>`).join('')}</div>
    <div class="chips"><span class="lab">${L('Difficulté', 'Difficulty')}</span>${[[0.8, L('Facile', 'Easy'), 1], [0.9, L('Normal', 'Normal'), 2], [1, L('Difficile', 'Hard'), 4]].map(x => `<button class="chip ${FS.diff === x[0] ? 'on' : ''}" data-hcd="${x[0]}">${x[1]} · +${x[2]} ✦</button>`).join('')}</div>
    <div class="dact" style="justify-content:flex-start"><button class="btn" data-hc="auto">${L('Meilleure équipe', 'Best team')}</button><button class="btn pri" data-hc="fight" ${sel.length === 3 && left > 0 ? '' : 'disabled'}>${L('Combattre', 'Fight')}</button></div><p class="note">${L('Le combat se joue tout seul : vos 3 cartes et 3 adversaires s’attaquent à tour de rôle, les dégâts dépendent de l’ATK et de la DEF (avec un peu de hasard et des critiques). Une victoire rapporte 1, 2 ou 4 ✦ selon la difficulté (volontairement peu : les combats sont un bonus, pas la façon principale de gagner des éclats). Vous avez 5 combats par jour.', 'The battle plays itself: your 3 cards and 3 opponents attack in turns, damage depends on ATK and DEF (with a little luck and crits). A win earns 1, 2 or 4 ✦ depending on difficulty (on purpose: battles are a bonus, not the main way to earn shards). You get 5 battles a day.')}</p></div>
    <div id="hcfl">${FS.log.length ? `<div class="card hc-log"><h2>${FS.res === 'w' ? L('Victoire !', 'Victory!') : L('Défaite…', 'Defeat…')}</h2>${FS.log.map(x => `<p>${x}</p>`).join('')}</div>` : ''}</div>
    ${sec(L('Choisir mes cartes', 'Choose my cards'))}<div class="hc-grid">${o.map(i => cardHtml(byC[i], { fin: best(G.col[i]), cls: 'sm' + (sel.includes(i) ? ' picked' : ''), d: `data-hcteam="${esc(i)}"` })).join('')}</div>`; }
  function fight() { const o = own(), sel = FS.team.filter(i => o.includes(i)); if (sel.length !== 3) return; load(); if (!fLeft()) return; if (!G.fw || G.fw.k !== today()) G.fw = { k: today(), n: 0 }; G.fw.n++;
    const avg = sel.reduce((s, i) => s + byC[i].R, 0) / 3; const mk = (id, f, mul) => { const c = byC[id], s = stats(c, f); return { id, n: nm(c), atk: s.atk * mul, def: s.def * mul, hp: s.hp * mul, mx: s.hp * mul }; };
    const A = sel.map(i => mk(i, best(G.col[i]), 1)), B = [0, 1, 2].map(() => { const r = Math.max(0, Math.min(4, Math.round(avg + (Math.random() * 2 - 1.2)))); const pl = CD.filter(c => c.R === r); return mk(pick(pl.length ? pl : CD).id, 0, FS.diff * (0.92 + Math.random() * 0.16)); });
    const log = [`${L('Adversaires', 'Opponents')} : ${B.map(x => esc(x.n)).join(', ')}`], ev = []; let turn = 0; const alive = t => t.filter(x => x.hp > 0);
    while (alive(A).length && alive(B).length && turn < 80) { const att = turn % 2 ? B : A, def = turn % 2 ? A : B, al = alive(att), who = al[Math.floor(turn / 2) % al.length], tg = alive(def).sort((x, y) => x.hp - y.hp)[0];
      const dmg = Math.max(6, Math.round(who.atk * (0.85 + Math.random() * 0.3) - tg.def * 0.5)), crit = Math.random() < 0.12, tot = crit ? Math.round(dmg * 1.5) : dmg; tg.hp = Math.max(0, tg.hp - tot); ev.push({ s: turn % 2, i: att.indexOf(who), t: def.indexOf(tg), d: tot, c: crit, hp: tg.hp });
      log.push(`<b>${esc(who.n)}</b> → ${esc(tg.n)} : <b>${tot}</b>${crit ? ' ✦ ' + L('critique !', 'crit!') : ''}${tg.hp ? '' : ' · ' + L('K.O.', 'K.O.')}`); turn++; }
    const win = alive(A).length > 0 && !alive(B).length; FS.res = win ? 'w' : 'l'; FS.log = log.slice(0, 1).concat(log.slice(-12));
    if (win) { G.w++; const rw = FREW[FS.diff] || 4; credit(rw); FS.log.push('🎁 +' + rw + ' ✦'); } else { G.l++; }
    const rwd = win ? (FREW[FS.diff] || 4) : 0; checkAch(); save(); head(); FS.busy = 1; playFight(sel, B.map(x => x.id), A.map(x => x.mx), B.map(x => x.mx), ev, win, rwd); }
  // animation du duel (5 à 8 s)
  function playFight(ids, oid, mxA, mxB, ev, win, rw) { const old = $('.hc-arena'); if (old) old.remove(); const reduced = red(); const ov = document.createElement('div'); ov.className = 'hc-arena'; const hp = [mxA.slice(), mxB.slice()];
    const side = (arr, mx, k) => `<div class="ar-side s${k}">${arr.map((id, j) => `<div class="ar-f" data-s="${k}" data-i="${j}">${cardHtml(byC[id], { fin: k ? 0 : best(G.col[id]), cls: 'sm' })}<div class="ar-hp"><i style="width:100%"></i></div><b class="ar-n"></b></div>`).join('')}</div>`;
    ov.innerHTML = `<div class="ar-box"><div class="ar-top"><b>${L('Duel automatique', 'Auto duel')}</b><button class="btn" data-arskip>${L('Passer ▸▸', 'Skip ▸▸')}</button></div>${side(ids, mxA, 0)}<div class="ar-vs">VS</div>${side(oid, mxB, 1)}<div class="ar-res"></div></div>`; document.body.appendChild(ov);
    const fin = () => { if (ov.__d) return; ov.__d = 1; clearTimeout(ov.__t); hp.forEach((h, k) => h.forEach((v, j) => { }));
      const r = $('.ar-res', ov); r.innerHTML = `<h2>${win ? L('Victoire !', 'Victory!') : L('Défaite…', 'Defeat…')}</h2>${win ? `<p>🎁 +${rw} ✦</p>` : `<p>${L('Retentez votre chance avec une autre équipe.', 'Try again with another team.')}</p>`}<button class="btn pri" data-arclose>OK</button>`; r.className = 'ar-res show ' + (win ? 'w' : 'l'); if (win) SFX.win(); else SFX.lose(); };
    const close = () => { ov.remove(); FS.busy = 0; mount(); };
    ov.addEventListener('click', e => { if (e.target.closest('[data-arskip]')) { ov.__sk = 1; hp[0] = mxA.map(() => 0); ov.querySelectorAll('.ar-f').forEach(f => f.classList.remove('hit', 'atk')); ev.forEach(x => { hp[x.s ? 0 : 1][x.t] = x.hp; }); ov.querySelectorAll('.ar-f').forEach(f => { const k = +f.dataset.s, j = +f.dataset.i, v = hp[k][j], m = (k ? mxB : mxA)[j]; $('.ar-hp i', f).style.width = Math.max(0, v / m * 100) + '%'; f.classList.toggle('ko', v <= 0); }); fin(); } else if (e.target.closest('[data-arclose]')) close(); });
    const step = Math.max(180, Math.min(650, 6200 / Math.max(1, ev.length))); let n = 0;
    const play = () => { if (ov.__d) return; if (n >= ev.length) { ov.__t = setTimeout(fin, 500); return; } const x = ev[n++], ta = $(`.ar-f[data-s="${x.s}"][data-i="${x.i}"]`, ov), tt = $(`.ar-f[data-s="${x.s ? 0 : 1}"][data-i="${x.t}"]`, ov); if (ta && tt) { ta.classList.add('atk'); tt.classList.add('hit'); const mx = (x.s ? mxA : mxB)[x.t]; $('.ar-hp i', tt).style.width = Math.max(0, x.hp / mx * 100) + '%'; const nb = $('.ar-n', tt); nb.textContent = '-' + x.d + (x.c ? '!' : ''); nb.className = 'ar-n pop' + (x.c ? ' crit' : ''); if (x.hp <= 0) tt.classList.add('ko'); SFX.click(); setTimeout(() => { ta.classList.remove('atk'); tt.classList.remove('hit'); nb.className = 'ar-n'; }, step * 0.8); } ov.__t = setTimeout(play, step); };
    ov.__t = setTimeout(play, reduced ? 0 : 700); }
  // ----- classement
  const sc = () => pts();
  async function push() { if (!(sb && user) || !CD || !G) return; if (!SY.done) { sync(); return; } const s = summary(); if (store.get(KEY + '_u', null) === user.id) { upsertSave(G); } try { const { error } = await sb.from('profiles').update({ cards: { u: s.u, t: s.t, l: s.l, g: s.g, o: G.open, w: G.w, p: s.p, a: Object.keys(G.ach).length, pr: G.pr || [0, 0, 0, 0, 0], pn: G.pn || [0, 0, 0, 0], s: G.show.slice(0, 6) } }).eq('user_id', user.id); if (error && !push.w) { push.w = 1; console.warn('cards:', error.message); } } catch { } }
  const RK = { s: 'p', list: null, err: '' };
  const RKS = () => [['p', L('Points', 'Points'), x => x.p], ['u', L('Cartes différentes', 'Different cards'), x => x.u], ['l', L('Légendaires', 'Legendaries'), x => x.l], ['g', L('Dorées', 'Gold'), x => x.g || 0], ['w', L('Victoires', 'Wins'), x => x.w || 0]];
  function rankView() { const s = summary(), lv = LV[s.lv], nx = LV[s.lv + 1], pc = nx ? Math.round((s.p - lv[0]) / (nx[0] - lv[0]) * 100) : 100;
    return `<div class="rk-hero"><div class="rk-badge" style="--p:${pc}"><span>${s.lv + 1}</span></div><div class="rk-info"><span class="lab">${L('Votre rang de collectionneur', 'Your collector rank')}</span><h2>${L(lv[1], lv[2])}</h2><div class="pbar"><div><i style="width:${pc}%"></i></div><em>${s.p} pts${nx ? ' · ' + (nx[0] - s.p) + ' → ' + L(nx[1], nx[2]) : ' · MAX'}</em></div>
      <div class="rk-mini"><span><b>${s.u}</b> ${L('cartes', 'cards')}</span><span><b>${s.l}</b> ${L('légendaires', 'legendaries')}</span><span><b>${s.g}</b> ${L('dorées', 'gold')}</span><span><b>${Object.keys(G.ach).length}</b> ${L('succès', 'achievements')}</span></div></div></div>
    <div class="rk-ladder">${LV.map((x, i) => `<div class="${i === s.lv ? 'cur' : i < s.lv ? 'done' : ''}"><i>${i < s.lv ? '✓' : i + 1}</i><b>${L(x[1], x[2])}</b><small>${x[0]} pts</small></div>`).join('')}</div>
    <p class="note">${L('Les points viennent de la rareté de chaque carte et de ses finitions (Holo ×2, Shiny ×3, Dorée ×6, Éclipse +3).', 'Points come from each card’s rarity and finishes (Holo ×2, Shiny ×3, Gold ×6, Eclipse +3).')}</p>
    <div id="hcrk" class="rk-board"><p class="sub">${L('Chargement…', 'Loading…')}</p></div>`; }
  function rkDraw() { const el = $('#hcrk'); if (!el) return; const me = user && user.id, S = RKS().find(x => x[0] === RK.s) || RKS()[0];
    if (RK.err) { el.innerHTML = `<h2>${L('Meilleurs collectionneurs', 'Top collectors')}</h2><p class="sub">${RK.err}</p>`; return; }
    const list = (RK.list || []).filter(p => S[2](p.cards) > 0).sort((a, b) => S[2](b.cards) - S[2](a.cards) || b.cards.p - a.cards.p).slice(0, 25), pos = list.findIndex(p => p.user_id === me);
    const av = p => esc((p.display_name || p.handle || '?').trim().charAt(0).toUpperCase()), nmp = p => esc(p.display_name || p.handle), tag = p => { const l = LV[lvOf(p.cards.p)]; return L(l[1], l[2]); };
    const pod = list.slice(0, 3), order = [1, 0, 2].filter(i => pod[i]);
    el.innerHTML = `<div class="rk-top"><h2>${L('Meilleurs collectionneurs', 'Top collectors')}</h2>${pos >= 0 ? `<span class="rk-pos">${L('Votre place', 'Your place')} : <b>#${pos + 1}</b></span>` : ''}</div>
      <div class="hc-seg rk-tabs">${RKS().map(x => `<button class="${RK.s === x[0] ? 'on' : ''}" data-hcrk="${x[0]}">${x[1]}</button>`).join('')}</div>
      ${list.length ? `<div class="rk-pod">${order.map(i => { const p = pod[i]; return `<a class="rk-pd p${i + 1} ${p.user_id === me ? 'me' : ''}" href="#/community/${esc(p.handle)}"><i class="cr">${i === 0 ? '👑' : ''}</i><span class="av">${av(p)}</span><b>${nmp(p)}</b><small>${tag(p)}</small><strong>${S[2](p.cards)}</strong><em>${i + 1}</em></a>`; }).join('')}</div>
      <div class="rk-rows">${list.slice(3).map((p, i) => `<a class="lbr rk-r ${p.user_id === me ? 'me' : ''}" href="#/community/${esc(p.handle)}"><i>${i + 4}</i><span class="av">${av(p)}</span><span class="rk-n">${nmp(p)}<small class="sub"> · ${tag(p)}</small></span><b>${S[2](p.cards)}</b><small class="sub">${p.cards.u}/${p.cards.t || '?'}</small></a>`).join('')}</div>` : `<p class="sub">${L('Personne pour l’instant : rendez votre profil public (Paramètres) pour apparaître ici.', 'Nobody yet: make your profile public (Settings) to appear here.')}</p>`}
      <p class="note">${L('Seuls les profils publics apparaissent. Les scores sont envoyés par le navigateur de chaque joueur, sans vérification : c’est un jeu entre amis.', 'Only public profiles appear. Scores are sent by each player’s browser without verification: it is a game among friends.')}</p>`; }
  async function loadRank() { const el = $('#hcrk'); const d = window.__ASTRO_MOCK || sb; if (!d) { RK.err = L('Le classement entre joueurs demande les comptes (Supabase), qui ne sont pas activés sur ce site. Votre rang personnel ci-dessus fonctionne quand même.', 'The player ranking needs accounts (Supabase), which are not enabled on this site. Your personal rank above still works.'); return rkDraw(); }
    try { const { data, error } = await d.from('profiles').select('user_id,handle,display_name,cards').eq('is_public', true).not('handle', 'is', null).limit(200); if (error) throw error; RK.list = (data || []).filter(p => p.cards && p.cards.p > 0); RK.err = ''; } catch { RK.err = L('Classement indisponible : exécutez supabase/schema_v6.sql.', 'Ranking unavailable: run supabase/schema_v6.sql.'); }
    rkDraw(); }
  // ----- vitrine de profil
  const showList = () => G.show.map(s => { const [id, f, a] = s.split(':'); return { id, f: +f, a: +a }; }).filter(x => byC[x.id]);
  function section() { load(); const s = summary(), sh = showList(), lv = LV[s.lv];
    return `<div id="hcpf"><div class="evs hc-sum"><div><b>${L(lv[1], lv[2])}</b><span>${s.p} pts</span></div><div><b>${s.u}<small> / ${s.t || '…'}</small></b><span>${L('cartes différentes', 'different cards')}</span></div><div><b>${s.l}</b><span>${L('légendaires', 'legendaries')}</span></div><div><b>${Object.keys(G.ach).length}</b><span>${L('succès', 'achievements')}</span></div></div>
    <div class="hc-lnk"><a class="btn pri" href="#/cartes">${L('Ouvrir des boosters', 'Open boosters')}</a><a class="btn" href="#/cartes/market">${L('Marché & échanges', 'Market & trades')}</a><a class="btn" href="#/profil/show">${L('Ma vitrine', 'My showcase')} (${sh.length}/6)</a></div><p class="note">${L('Votre vitrine (6 cartes) se règle dans l’onglet « Vitrine » du profil.', 'Your showcase (6 cards) is set in the “Showcase” tab of your profile.')}</div>`; }
  async function showcaseImage() { await data(); load(); const W = 1200, H = 630, cv = document.createElement('canvas'); cv.width = W; cv.height = H; const g = cv.getContext('2d'); const bgp = g.createLinearGradient(0, 0, W, H); bgp.addColorStop(0, '#0b0e1c'); bgp.addColorStop(1, '#1d1535'); g.fillStyle = bgp; g.fillRect(0, 0, W, H);
    const s = summary(), sh = showList().slice(0, 6); g.fillStyle = '#e0b050'; g.font = '700 22px sans-serif'; g.fillText('FOILVAULT · ASTROLABE', 48, 56); g.fillStyle = '#fff'; g.font = '800 46px sans-serif'; g.fillText((prof.name || L('Mon album', 'My album')), 48, 112); g.fillStyle = '#aab3d6'; g.font = '500 24px sans-serif'; g.fillText(`${L(LV[s.lv][1], LV[s.lv][2])} · ${s.u}/${s.t} ${L('cartes', 'cards')} · ${s.l} ${L('légendaires', 'legendary')} · ${s.g} ${L('dorées', 'gold')}`, 48, 150);
    const loadImg = src => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = src; });
    const cw = 170, ch = 250, gap = 20, x0 = (W - (sh.length * cw + (sh.length - 1) * gap)) / 2;
    for (let i = 0; i < sh.length; i++) { const c = byC[sh[i].id], r = c.R, x = x0 + i * (cw + gap), y = 230, col = RAR[r].c; g.fillStyle = '#12162b'; g.fillRect(x, y, cw, ch); const im_ = c.img ? await loadImg(c.img) : null;
      if (im_) { g.save(); g.beginPath(); g.rect(x, y, cw, ch); g.clip(); const k = Math.max(cw / im_.width, ch / im_.height); g.drawImage(im_, x + (cw - im_.width * k) / 2, y, im_.width * k, im_.height * k); g.restore(); } else { g.fillStyle = (GAMES[c.g] || GAMES.hsr)[2] + '55'; g.fillRect(x, y, cw, ch); g.fillStyle = '#ffffff55'; g.font = '800 110px sans-serif'; g.textAlign = 'center'; g.fillText(nm(c)[0], x + cw / 2, y + 150); g.textAlign = 'left'; }
      const gr = g.createLinearGradient(0, y + ch - 80, 0, y + ch); gr.addColorStop(0, 'transparent'); gr.addColorStop(1, '#000000cc'); g.fillStyle = gr; g.fillRect(x, y + ch - 80, cw, 80); g.strokeStyle = col; g.lineWidth = 5; g.strokeRect(x, y, cw, ch); g.fillStyle = '#fff'; g.font = '700 17px sans-serif'; g.fillText(nm(c).slice(0, 18), x + 10, y + ch - 28); g.fillStyle = col; g.font = '600 14px sans-serif'; g.fillText(L(RAR[r].fr, RAR[r].en) + (sh[i].f ? ' · ' + L(FIN[sh[i].f].fr, FIN[sh[i].f].en) : ''), x + 10, y + ch - 10); }
    g.fillStyle = '#7f89b0'; g.font = '500 20px sans-serif'; g.fillText(L('Site de fans non officiel · images et noms © HoYoverse', 'Unofficial fan site · images and names © HoYoverse'), 48, H - 28);
    const blob = await new Promise(r => cv.toBlob(r, 'image/png')), f = new File([blob], 'foilvault.png', { type: 'image/png' }); if (navigator.canShare && navigator.canShare({ files: [f] }) && matchMedia('(hover:none)').matches) await navigator.share({ files: [f] }).catch(() => { }); else { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = f.name; a.click(); toast(L('Image téléchargée', 'Image downloaded')); } }


  // ----- sauvegarde dans le compte (v18) : même collection sur tous les appareils
  const scoreOf = x => (x.es || 0) + (x.open || 0) * 10 + Object.keys(x.col || {}).length * 5;
  let syncing = false; const SY = { s: 'off', m: '', done: false };
  const syShow = () => { const e = $('#hcsy'); if (!e) return; e.className = 'btn io hc-sy ' + SY.s; e.title = SY.s === 'ok' ? L('Cartes sauvegardées dans votre compte', 'Cards saved to your account') : SY.s === 'err' ? L('Sauvegarde impossible : ', 'Save failed: ') + SY.m : L('Cliquez pour synchroniser', 'Click to sync'); e.textContent = SY.s === 'ok' ? '☁✓' : SY.s === 'err' ? '☁!' : '☁'; };
  async function upsertSave(x) { const { error } = await sb.from('card_saves').upsert({ user_id: user.id, data: x, score: scoreOf(x), updated_at: new Date().toISOString() }); SY.s = error ? 'err' : 'ok'; SY.m = error ? (error.message || '') : ''; syShow(); return !error; }
  async function sync(manual) { if (!(sb && user) || syncing) return; syncing = true;
    try { const raw = store.get(KEY, null), own_ = store.get(KEY + '_u', null), mineLocal = raw && (!own_ || own_ === user.id) ? raw : null;
      const { data, error } = await sb.from('card_saves').select('data,score').eq('user_id', user.id).maybeSingle(); if (error) { SY.s = 'err'; SY.m = error.message || ''; syShow(); return; }
      const ls = mineLocal ? scoreOf(mineLocal) : 0;
      if (data && data.data && (data.score > ls || !mineLocal)) { SY.s = 'ok'; syShow(); store.set(KEY, data.data); store.set(KEY + '_u', user.id); SY.done = true; clearTimeout(pushT); if (G) { load(); if (CD && $('#hcr')) mount(); } }
      else if (mineLocal && (!data || ls > data.score)) { if (await upsertSave(mineLocal)) { store.set(KEY + '_u', user.id); SY.done = true; } }
      else { store.set(KEY + '_u', user.id); SY.done = true; } }
    finally { syncing = false; } }
  document.addEventListener('visibilitychange', () => { if (!document.hidden && $('#hcr') && !$('#hcov')) sync(); });
  // ----- vitrine (v15) : choix des cartes directement dans le site
  const VT = { q: '', g: 'all' };
  const bestF = id => { const f = G.col[id].f; for (let k = 3; k >= 0; k--) if (f[k] > 0) return k; return 0; };
  function vitrineInner() { const sh = showList();
    return `<div class="hc-vgrid">${Array.from({ length: 6 }, (_, i) => { const x = sh[i]; return x ? `<div class="hc-vs">${cardHtml(byC[x.id], { fin: x.f, alt: !!x.a, cls: 'tilt', d: 'data-hcz="1"' })}<button class="btn" data-hcvt="rm:${i}">${L('Retirer', 'Remove')}</button></div>` : `<button class="hc-vs hc-vem" data-hcvt="open"><b>+</b><span>${L('Ajouter une carte', 'Add a card')}</span></button>`; }).join('')}</div>`; }
  function vitrine() { load(); const sh = showList();
    return `<div class="card hc-vhead"><div><h2>${L('Ma vitrine', 'My showcase')}</h2><p class="sub">${L('Choisissez jusqu’à 6 cartes de votre collection à exposer. Elles apparaissent sur votre page publique si votre profil est public.', 'Pick up to 6 cards from your collection to display. They appear on your public page if your profile is public.')}</p></div><div class="hc-lnk"><button class="btn pri" data-hcvt="open">${L('Choisir mes cartes', 'Choose my cards')} (${sh.length}/6)</button><button class="btn" data-hcvt="img">${L('Télécharger en image', 'Download as image')}</button></div></div><div id="hcvit">${vitrineInner()}</div>`; }
  function vtPicker() { load(); let d = $('#hcvp'); if (!d) { d = document.createElement('dialog'); d.id = 'hcvp'; document.body.appendChild(d); d.addEventListener('click', ev => { if (ev.target === d) d.close(); }); d.addEventListener('input', ev => { if (ev.target.id === 'hcvq') { VT.q = ev.target.value; vtList(); } }); }
    d.innerHTML = `<div class="hc-vpt"><h2>${L('Choisir mes cartes', 'Choose my cards')}</h2><b id="hcvn"></b></div><input type="search" id="hcvq" placeholder="${L('Rechercher un nom…', 'Search a name…')}" value="${esc(VT.q)}"><div class="hc-vch">${[['all', L('Tous', 'All')], ...Object.keys(GAMES).map(k => [k, GAMES[k][1]])].map(([k, t]) => `<button class="chip ${VT.g === k ? 'on' : ''}" data-hcvt="g:${k}">${t}</button>`).join('')}</div><div class="hc-vpl" id="hcvl"></div><div class="dact"><button class="btn pri" data-hcvt="close">${L('Terminé', 'Done')}</button></div>`;
    vtList(); if (!d.open) d.showModal(); }
  function vtList() { const l = $('#hcvl'); if (!l) return; const q = VT.q.trim().toLowerCase(), sel = new Set(G.show.map(s => s.split(':')[0]));
    const ids = own().filter(i => (VT.g === 'all' || byC[i].g === VT.g) && (!q || nm(byC[i]).toLowerCase().includes(q))).sort((a, b) => byC[b].R - byC[a].R || bestF(b) - bestF(a)); const n = $('#hcvn'); if (n) n.textContent = G.show.length + ' / 6';
    l.innerHTML = ids.length ? ids.slice(0, 150).map(i => `<button class="hc-vpi ${sel.has(i) ? 'on' : ''}" data-hcvt="t:${i}">${cardHtml(byC[i], { fin: bestF(i) })}<i>${sel.has(i) ? '✓' : '+'}</i></button>`).join('') : `<p class="sub">${L('Aucune carte ne correspond. Ouvrez des boosters pour en gagner !', 'No matching card. Open boosters to get some!')}</p>`; }
  function vtRefresh() { const w = $('#hcvit'); if (w) w.innerHTML = vitrineInner(); const h = $('.hc-vhead .btn.pri'); if (h) h.textContent = L('Choisir mes cartes', 'Choose my cards') + ' (' + G.show.length + '/6)'; vtList(); push(); }
  function vtClick(b) { const [a, x] = b.dataset.hcvt.split(':');
    if (a === 'open') vtPicker(); else if (a === 'close') { const d = $('#hcvp'); if (d) d.close(); } else if (a === 'img') showcaseImage(); else if (a === 'g') { VT.g = x; vtPicker(); }
    else if (a === 'rm') { G.show.splice(+x, 1); save(); vtRefresh(); }
    else if (a === 't') { const i = G.show.findIndex(s => s.split(':')[0] === x); if (i >= 0) G.show.splice(i, 1); else if (G.show.length >= 6) { toast(L('6 cartes maximum en vitrine.', '6 cards maximum in the showcase.')); return; } else G.show.push(x + ':' + bestF(x) + ':0'); save(); vtRefresh(); } }

  // ----- marché & échanges entre joueurs (v15)
  const MK = { rows: null, q: '', g: 'all', sub: 'offers', f: { c: '', k: 'coins', p: 0, w: '', wf: 0 }, msg: '', busy: false };
  const mkDb = () => window.__ASTRO_MOCK || sb, mkMe = () => (user && user.id) || window.__ASTRO_USER || null, MKMAX = 5, MKFEE = 10;
  const mkNet = p => Math.max(1, p - Math.floor(p * MKFEE / 100));
  const dupsOf = () => { const o = []; own().forEach(i => [0, 1, 2, 3].forEach(f => { if (G.col[i].f[f] >= 2) o.push({ id: i, f, n: G.col[i].f[f] - 1 }); })); return o.sort((a, b) => byC[b.id].R - byC[a.id].R || b.f - a.f); };
  const takeOne = (id, f) => { const e = G.col[id]; if (!e || e.f[f] < 2) return false; e.f[f]--; e.n--; return true; };
  const mkErr = e => { const m = (e && e.message) || ''; return /limit/i.test(m) ? L('Vous avez déjà ' + MKMAX + ' offres ouvertes.', 'You already have ' + MKMAX + ' open offers.') : /gone|unavail/i.test(m) ? L('Offre déjà prise ou retirée.', 'Offer already taken or withdrawn.') : L('Action impossible pour le moment.', 'Action not possible right now.'); };
  async function mkLoad() { const d = mkDb(); if (!d || !mkMe()) { MK.rows = []; return; } try { const { data: r, error } = await d.from('trades').select('*').order('created_at', { ascending: false }).limit(150); if (error) throw error; MK.rows = r || []; await mkSettle(); } catch (e) { MK.rows = []; MK.msg = L('Marché indisponible (la table « trades » n’est pas installée : voir docs).', 'Market unavailable (the “trades” table is not installed: see docs).'); } }
  // règle les échanges terminés : on récupère d'abord le droit (atomique côté serveur), puis on applique
  async function mkSettle() { const d = mkDb(), me = mkMe(); if (!d || !me) return; let got = 0, coins = 0;
    for (const r of MK.rows.filter(x => (x.seller === me && x.status !== 'open' && !x.claimed) || (x.buyer === me && x.status === 'done' && !x.buyer_claimed))) {
      const asBuyer = r.buyer === me && r.seller !== me; const { data: ok } = await d.rpc(asBuyer ? 'trade_claim_buyer' : 'trade_claim', { tid: r.id }); if (!ok) continue;
      if (asBuyer) { add({ id: r.card, f: r.fin }); got++; r.buyer_claimed = true; } else if (r.status === 'cancelled') { add({ id: r.card, f: r.fin }); got++; r.claimed = true; } else if (r.kind === 'coins') { credit(mkNet(r.price)); coins += mkNet(r.price); r.claimed = true; } else { add({ id: r.want, f: r.want_fin || 0 }); got++; r.claimed = true; } }
    if (got || coins) { G.tr = (G.tr || 0) + (coins ? 1 : 0); save(); head(); checkAch(); toast(L('Marché : ', 'Market: ') + (got ? got + ' ' + L('carte(s) reçue(s)', 'card(s) received') : '') + (coins ? ' +' + coins + ' ✦' : '')); } }
  const mkCard = (id, f, o = {}) => byC[id] ? cardHtml(byC[id], { fin: f, cls: 'sm', ...o }) : '';
  function marketView() { const me = mkMe();
    if (!mkDb() || !me) return `<div class="card hc-mkoff"><h2>${L('Marché des joueurs', 'Player market')}</h2><p class="sub">${L('Le marché permet d’échanger ou de vendre vos doublons à d’autres joueurs. Il demande un compte (connexion) : connectez-vous depuis Astrolabe pour y accéder. En attendant, vous pouvez revendre vos doublons à la boutique.', 'The market lets you trade or sell your duplicates to other players. It needs an account (log in) from Astrolabe. Meanwhile you can sell duplicates to the shop.')}</p><a class="btn pri" href="#/cartes/mine">${L('Voir mes doublons', 'See my duplicates')}</a></div>`;
    if (MK.rows === null) { mkLoad().then(() => { if (tab === 'market' && $('#hcr')) $('#hcr').innerHTML = marketView(); }); return `<p class="sub">${L('Chargement du marché…', 'Loading the market…')}</p>`; }
    const mine = MK.rows.filter(r => r.seller === me && r.status === 'open'), q = MK.q.trim().toLowerCase(), dups = dupsOf();
    const offers = MK.rows.filter(r => r.status === 'open' && r.seller !== me && byC[r.card] && (MK.g === 'all' || byC[r.card].g === MK.g) && (!q || (byC[r.card].n + ' ' + byC[r.card].ne).toLowerCase().includes(q)));
    const want = r => r.kind === 'coins' ? `<b class="hc-mkp">${coinI} ${r.price}</b>` : (byC[r.want] ? `<span class="hc-mkw">${L('contre', 'for')} <b>${esc(nm(byC[r.want]))}</b> · ${L(FIN[r.want_fin || 0].fr, FIN[r.want_fin || 0].en)}</span>` : '');
    const can = r => r.kind === 'coins' ? G.coins >= r.price : !!(G.col[r.want] && G.col[r.want].f[r.want_fin || 0] >= 2);
    const f = MK.f, sel = f.c ? f.c.split(':') : null, selOk = sel && G.col[sel[0]] && G.col[sel[0]].f[+sel[1]] >= 2;
    const sellForm = `<div class="card hc-mkf"><h2>${L('Proposer un doublon', 'Offer a duplicate')}</h2>${dups.length ? `<label class="lab">${L('Votre doublon', 'Your duplicate')}</label><select data-hcmk="c"><option value="">— ${L('Choisir', 'Choose')} —</option>${dups.map(x => `<option value="${esc(x.id)}:${x.f}" ${f.c === x.id + ':' + x.f ? 'selected' : ''}>${esc(nm(byC[x.id]))} · ${L(FIN[x.f].fr, FIN[x.f].en)} · ${L(RAR[byC[x.id].R].fr, RAR[byC[x.id].R].en)} (×${x.n})</option>`).join('')}</select>
      <label class="lab" style="margin-top:10px">${L('Je veux en échange', 'In exchange I want')}</label><div class="chips"><button class="chip ${f.k === 'coins' ? 'on' : ''}" data-hcmk="k:coins">${coinI} ${L('Des éclats', 'Shards')}</button><button class="chip ${f.k === 'card' ? 'on' : ''}" data-hcmk="k:card">🎴 ${L('Une autre carte', 'Another card')}</button></div>
      ${f.k === 'coins' ? `<label class="lab">${L('Prix en éclats', 'Price in shards')}${selOk ? ` · ${L('conseillé', 'suggested')} ≈ ${sellVal(byC[sel[0]], +sel[1]) * 3}` : ''}</label><input type="number" min="1" max="5000" data-hcmk="p" value="${f.p || ''}" placeholder="${selOk ? sellVal(byC[sel[0]], +sel[1]) * 3 : ''}"><p class="note">${L('Commission du marché : ' + MKFEE + ' % (elle retire des éclats du jeu pour garder une économie saine).', 'Market fee: ' + MKFEE + '% (it removes shards from the game to keep the economy healthy).')}</p>`
      : `<label class="lab">${L('Carte recherchée', 'Wanted card')}</label><select data-hcmk="w"><option value="">— ${L('Choisir', 'Choose')} —</option>${CD.filter(c => !selOk || c.id !== sel[0]).sort((a, b) => b.R - a.R || nm(a).localeCompare(nm(b))).map(c => `<option value="${esc(c.id)}" ${f.w === c.id ? 'selected' : ''}>${esc(nm(c))} · ${L(RAR[c.R].fr, RAR[c.R].en)} · ${GAMES[c.g][1]}</option>`).join('')}</select><label class="lab">${L('Finition voulue', 'Wanted finish')}</label><select data-hcmk="wf">${FIN.map((x, k) => `<option value="${k}" ${+f.wf === k ? 'selected' : ''}>${L(x.fr, x.en)}</option>`).join('')}</select><p class="note">${L('Le preneur doit avoir cette carte en double.', 'The taker must own that card as a duplicate.')}</p>`}
      <button class="btn pri" data-hcmk="sell" ${MK.busy ? 'disabled' : ''}>${L('Mettre sur le marché', 'List on the market')}</button> <small class="sub">${mine.length}/${MKMAX} ${L('offres ouvertes', 'open offers')}</small>` : `<p class="sub">${L('Vous n’avez aucun doublon pour l’instant : ouvrez des boosters ! (Seuls les doublons peuvent être échangés : on garde toujours un exemplaire.)', 'You have no duplicates yet: open boosters! (Only duplicates can be traded: you always keep one copy.)')}</p>`}</div>`;
    const tile = (r, own) => { const c = byC[r.card], ok = !own && can(r); return `<div class="mk-t ${own ? 'own' : ''}"><div class="mk-cd" data-hcz-id="${esc(r.card)}">${mkCard(r.card, r.fin)}</div><div class="mk-i"><b>${esc(nm(c || { n: r.card, ne: r.card }))}</b><small>${own ? L('Votre offre', 'Your offer') : L('par', 'by') + ' ' + esc(r.seller_name || '—')} · ${c ? L(RAR[c.R].fr, RAR[c.R].en) : ''} · ${L(FIN[r.fin].fr, FIN[r.fin].en)}</small><div class="mk-pr">${r.kind === 'coins' ? `${coinI} <b>${r.price}</b>` : `<span>⇄</span> ${byC[r.want] ? esc(nm(byC[r.want])) + ' · ' + L(FIN[r.want_fin || 0].fr, FIN[r.want_fin || 0].en) : ''}`}</div>${own ? `<button class="btn" data-hcmk="cancel:${r.id}">${L('Retirer l’offre', 'Withdraw')}</button>` : `<button class="btn ${ok ? 'pri' : ''}" data-hcmk="buy:${r.id}" ${ok ? '' : 'disabled'}>${r.kind === 'coins' ? L('Acheter', 'Buy') : L('Échanger', 'Trade')}</button>${ok ? '' : `<small class="sub">${r.kind === 'coins' ? L('Pas assez d’éclats', 'Not enough shards') : L('Il vous faut cette carte en double', 'You need that card as a duplicate')}</small>`}`}</div></div>`; };
    const sub = MK.sub === 'sell' || MK.sub === 'mine' ? MK.sub : 'offers', so = MK.so || 'new', aff = !!MK.aff;
    let list = offers.filter(r => !aff || can(r)); if (so === 'pri') list = list.slice().sort((x, y) => (x.kind === 'coins' ? x.price : 1e9) - (y.kind === 'coins' ? y.price : 1e9)); else if (so === 'rar') list = list.slice().sort((x, y) => byC[y.card].R - byC[x.card].R || y.fin - x.fin);
    const gks = Object.keys(GAMES).filter(k => offers.some(r => byC[r.card].g === k) || MK.g === k), hist = MK.rows.filter(r => r.status === 'done' && (r.seller === me || r.buyer === me)).slice(0, 8);
    const subtabs = `<div class="hc-seg mk-sub">${[['offers', L('Explorer les offres', 'Browse offers')], ['sell', L('Vendre / échanger', 'Sell / trade')], ['mine', L('Mes offres', 'My offers') + ' (' + mine.length + ')']].map(([k, t]) => `<button class="${sub === k ? 'on' : ''}" data-hcmk="sub:${k}">${t}</button>`).join('')}</div>`;
    const explore = `<div class="hc-flt"><div class="hc-flt-top"><label class="hc-sr"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg><input type="search" data-hcmk="q" placeholder="${L('Chercher une carte…', 'Search a card…')}" value="${esc(MK.q)}"></label><label class="hc-sel"><span>${L('Trier par', 'Sort by')}</span><select data-hcmk="so"><option value="new" ${so === 'new' ? 'selected' : ''}>${L('Récentes', 'Newest')}</option><option value="pri" ${so === 'pri' ? 'selected' : ''}>${L('Prix croissant', 'Price: low to high')}</option><option value="rar" ${so === 'rar' ? 'selected' : ''}>${L('Rareté', 'Rarity')}</option></select></label><button class="btn ${aff ? 'pri' : ''}" data-hcmk="aff:1" style="min-height:44px">${L('Seulement ce que je peux prendre', 'Only what I can take')}</button></div>
      <div class="hc-gscroll"><button class="hc-gp2 ${MK.g === 'all' ? 'on' : ''}" data-hcmk="g:all" style="--gc:#e0b050"><i></i><b>${L('Tous', 'All')}</b><em>${offers.length}</em></button>${gks.map(k => `<button class="hc-gp2 ${MK.g === k ? 'on' : ''}" data-hcmk="g:${k}" style="--gc:${GAMES[k][2]}"><i></i><b>${GAMES[k][1]}</b></button>`).join('')}</div></div>
      <p class="sub">${list.length} ${L('offre(s)', 'offer(s)')}</p>${list.length ? `<div class="mk-grid">${list.slice(0, 60).map(r => tile(r, false)).join('')}</div>` : `<div class="card"><p class="sub">${L('Aucune offre ne correspond. Soyez le premier à proposer un doublon !', 'No offer matches. Be the first to list a duplicate!')}</p><button class="btn pri" data-hcmk="sub:sell">${L('Proposer un doublon', 'Offer a duplicate')}</button></div>`}`;
    const prev = selOk ? `<div class="mk-prev">${mkCard(sel[0], +sel[1])}</div>` : `<div class="mk-prev empty"><span>🎴</span><small>${L('Choisissez un doublon', 'Pick a duplicate')}</small></div>`;
    const mineTab = `${mine.length ? `<div class="mk-grid">${mine.map(r => tile(r, true)).join('')}</div>` : `<div class="card"><p class="sub">${L('Vous n’avez aucune offre en cours.', 'You have no open offers.')}</p></div>`}${hist.length ? `<h3 class="hc-h3">${L('Derniers échanges', 'Recent trades')}</h3><div class="mk-hist">${hist.map(r => `<span>${r.seller === me ? '💰 ' + L('Vendu', 'Sold') : '🎁 ' + L('Acquis', 'Got')} · <b>${esc(nm(byC[r.card] || { n: r.card, ne: r.card }))}</b></span>`).join('')}</div>` : ''}`;
    return `<div class="mk-hero"><div><h2>${L('Marché des joueurs', 'Player market')}</h2><p class="sub">${L('Échangez ou vendez vos doublons. La carte proposée est mise de côté jusqu’à la vente (ou jusqu’au retrait de l’offre).', 'Trade or sell your duplicates. A listed card is set aside until it sells (or you withdraw it).')}</p></div><div class="mk-stats"><div><b>${offers.length}</b><span>${L('offres', 'offers')}</span></div><div><b>${mine.length}/${MKMAX}</b><span>${L('mes offres', 'my offers')}</span></div><div><b>${MKFEE}%</b><span>${L('commission', 'fee')}</span></div></div></div>
    ${MK.msg ? `<p class="note mk-msg">${esc(MK.msg)}</p>` : ''}${subtabs}${sub === 'offers' ? explore : sub === 'sell' ? `<div class="mk-sellw">${prev}${sellForm}</div>` : mineTab}
    <p class="note">${L('Les cartes de ce jeu sont enregistrées dans chaque navigateur : le marché repose sur la bonne foi des joueurs (jeu entre amis, sans valeur réelle).', 'Cards are stored in each browser: the market relies on players’ good faith (a friendly game with no real value).')}</p>`; }
  const mkRedraw = () => { const r = $('#hcr'); if (r && tab === 'market') r.innerHTML = marketView(); };
  async function mkAction(el) { const [a, x, y] = (el.dataset.hcmk || '').split(':'), d = mkDb(), me = mkMe(), f = MK.f;
    if (a === 'sub') { MK.sub = x; return mkRedraw(); } if (a === 'aff') { MK.aff = !MK.aff; return mkRedraw(); }
    if (a === 'g') { MK.g = x; return mkRedraw(); } if (a === 'k') { f.k = x; return mkRedraw(); }
    if (a === 'sell') { const sel = f.c.split(':'); if (!f.c || !takeOneCheck(sel)) { MK.msg = L('Choisissez un doublon.', 'Choose a duplicate.'); return mkRedraw(); }
      if (f.k === 'coins' && !(+f.p >= 1 && +f.p <= 5000)) { MK.msg = L('Indiquez un prix entre 1 et 5000.', 'Enter a price between 1 and 5000.'); return mkRedraw(); } if (f.k === 'card' && !byC[f.w]) { MK.msg = L('Choisissez la carte recherchée.', 'Choose the wanted card.'); return mkRedraw(); }
      MK.busy = true; MK.msg = ''; takeOne(sel[0], +sel[1]); save(); head();
      const { error } = await d.rpc('trade_create', { p_card: sel[0], p_fin: +sel[1], p_kind: f.k, p_price: f.k === 'coins' ? Math.round(+f.p) : null, p_want: f.k === 'card' ? f.w : null, p_want_fin: f.k === 'card' ? +f.wf : 0, p_name: (prof.name || prof.handle || '').slice(0, 24) });
      MK.busy = false; if (error) { add({ id: sel[0], f: +sel[1] }); save(); head(); MK.msg = mkErr(error); } else { SFX.coin(); toast(L('Offre publiée !', 'Offer listed!')); f.c = ''; f.p = 0; f.w = ''; await mkLoad(); } return mkRedraw(); }
    if (a === 'cancel') { const { error } = await d.rpc('trade_cancel', { tid: x }); MK.msg = error ? mkErr(error) : ''; await mkLoad(); return mkRedraw(); }
    if (a === 'buy') { const r = MK.rows.find(z => z.id === x); if (!r || r.seller === me) return; if (r.kind === 'coins') { if (G.coins < r.price) return; G.coins -= r.price; } else { if (!takeOneCheck([r.want, r.want_fin || 0])) return; takeOne(r.want, r.want_fin || 0); }
      save(); head(); const { error } = await d.rpc('trade_accept', { tid: x });
      if (error) { if (r.kind === 'coins') G.coins += r.price; else add({ id: r.want, f: r.want_fin || 0 }); save(); head(); MK.msg = mkErr(error); } else { G.tr = (G.tr || 0) + 1; checkAch(); save(); SFX.coin(); MK.msg = ''; toast(L('Échange réussi !', 'Trade done!')); }
      await mkLoad(); return mkRedraw(); } }
  const takeOneCheck = s => { const e = G.col[s[0]]; return !!(e && e.f[+s[1]] >= 2); };

  // ----- probabilités (v15) : théoriques et observées chez les joueurs publics
  const OD = { std: { n: 4, a: [52, 28, 13.8, 5, 1.2], ns: 1, l: [0, 0, 78, 18, 4], f: [80, 15, 4, 1] }, prem: { n: 3, a: [30, 30, 22, 14, 4], ns: 2, l: [0, 0, 45, 38, 17], f: [62, 24, 10, 4] } };
  const pc = (v, d = 1) => (v >= 10 ? v.toFixed(0) : v.toFixed(d)).replace('.', LANG === 'en' ? '.' : ',') + ' %';
  function oddsHtml(rows) { const tot = x => x.reduce((a, b) => a + b, 0), nrm = a => a.map(v => v / tot(a) * 100);
    const one = (k, title) => { const o = OD[k], a = nrm(o.a), l = nrm(o.l), f = nrm(o.f); return `<div class="card"><h2>${title}</h2><div class="hc-odt">${RAR.map((r, i) => { const p1 = 1 - Math.pow(1 - a[i] / 100, o.n) * Math.pow(1 - l[i] / 100, o.ns); return `<div class="hc-odr"><i style="--c:${r.c}"></i><span>${L(r.fr, r.en)}</span><div class="hc-odb"><b style="width:${Math.max(1.5, a[i])}%;background:${r.c}"></b></div><em>${pc(a[i])}</em><small>${L('≥1 par booster', '≥1 per booster')} : ${pc(p1 * 100)}</small></div>`; }).join('')}</div>
      <p class="note">${L('Finitions : ', 'Finishes: ')}${FIN.map((x, i) => `${L(x.fr, x.en)} ${pc(f[i])}`).join(' · ')}. ${L('Un légendaire est toujours au moins Holo.', 'A legendary is always at least Holo.')}</p></div>`; };
    let obs = ''; const ps = (rows || []).map(r => r.cards).filter(c => c && Array.isArray(c.pr));
    if (ps.length) { const R = [0, 0, 0, 0, 0], F = [0, 0, 0, 0]; ps.forEach(c => { c.pr.forEach((v, i) => R[i] += +v || 0); (c.pn || []).forEach((v, i) => F[i] += +v || 0); }); const T = tot(R);
      obs = T >= 20 ? `<div class="card"><h2>${L('Ce qu’ont réellement obtenu les joueurs', 'What players actually pulled')}</h2><p class="sub">${ps.length} ${L('joueurs publics', 'public players')} · ${T} ${L('cartes tirées', 'cards pulled')}</p><div class="hc-odt">${RAR.map((r, i) => `<div class="hc-odr"><i style="--c:${r.c}"></i><span>${L(r.fr, r.en)}</span><div class="hc-odb"><b style="width:${Math.max(1.5, R[i] / T * 100)}%;background:${r.c}"></b></div><em>${pc(R[i] / T * 100)}</em><small>${R[i]}</small></div>`).join('')}</div>${tot(F) ? `<p class="note">${L('Finitions : ', 'Finishes: ')}${FIN.map((x, i) => `${L(x.fr, x.en)} ${pc(F[i] / tot(F) * 100)}`).join(' · ')}</p>` : ''}</div>` : '';
      const withC = (rows || []).map(r => r.cards).filter(c => c && c.u > 0), n = withC.length;
      if (n) { const has = k => Math.round(withC.filter(c => c[k] > 0).length / n * 100); obs += `<div class="card"><h2>${L('Chez les joueurs : qui possède quoi ?', 'Among players: who owns what?')}</h2><div class="g3 pst"><div class="stat"><span class="lab">${L('Au moins 1 légendaire', 'At least 1 legendary')}</span><b>${has('l')} %</b></div><div class="stat"><span class="lab">${L('Au moins 1 Dorée', 'At least 1 Gold')}</span><b>${has('g')} %</b></div><div class="stat"><span class="lab">${L('Cartes différentes (moyenne)', 'Different cards (average)')}</span><b>${Math.round(withC.reduce((a, c) => a + c.u, 0) / n)}</b></div></div><p class="note">${n} ${L('profils publics. Chiffres envoyés par chaque navigateur, sans vérification.', 'public profiles. Figures sent by each browser, unverified.')}</p></div>`; } }
    return `${sec(L('Probabilités des cartes Foilvault', 'Foilvault drop odds'))}<div class="g">${one('std', L('Booster standard (5 cartes)', 'Standard booster (5 cards)'))}${one('prem', L('Booster Premium (5 cartes)', 'Premium booster (5 cards)'))}</div><p class="note">${L('Probabilité par carte tirée (hors dernier emplacement, qui est meilleur). Garantie : un légendaire au plus tard tous les 30 boosters.', 'Chance per card drawn (the last slot is better). Guarantee: a legendary at least every 30 boosters.')}</p>${obs}`; }
  // ----- actions
  function sellDup(id, f) { const e = G.col[id], c = byC[id]; if (!e || e.f[f] < 2) return 0; e.f[f]--; e.n--; const v = sellVal(c, f); credit(v); G.sold++; bump('sell3'); return v; }
  document.addEventListener('change', e => { const t = e.target; if (!t.dataset || t.dataset.hcmk === undefined) return; const k = t.dataset.hcmk; if (k === 'c') MK.f.c = t.value; else if (k === 'w') MK.f.w = t.value; else if (k === 'wf') MK.f.wf = +t.value; else if (k === 'p') MK.f.p = +t.value; else if (k === 'so') MK.so = t.value; if (k === 'c' || k === 'w' || k === 'so') mkRedraw(); });
  document.addEventListener('input', e => { const t = e.target; if (t.dataset && t.dataset.hcmk === 'q') { MK.q = t.value; const p = t.selectionStart; mkRedraw(); const n = $('[data-hcmk="q"]'); if (n) { n.focus(); n.setSelectionRange(p, p); } } else if (t.dataset && t.dataset.hcmk === 'p') MK.f.p = +t.value; });
  document.addEventListener('click', async e => {
    const t = e.target; let b;
    if (t.closest('[data-hc],[data-hcflip],[data-hcbuy],[data-hcq],[data-hcsell],[data-hcsc],[data-hcsk],[data-hcaf]')) { if (G) SFX.click(); }
    if ((b = t.closest('[data-hc]'))) { const k = b.dataset.hc;
      if (k === 'open' || k === 'again') { await data().catch(() => { }); if (!CD) return; const pk = k === 'again' ? cur.pk : b.dataset.pk; if (k === 'again') closeOv(); if (pk === 'gen' || G.inv[pk] > 0 || true) openPack(pk); }
      else if (k === 'close') closeOv(); else if (k === 'all') skipAll();
      else if (k === 'more') { AF.n += 60; mount(); } else if (k === 'fbtoggle') { FBO = !FBO; mount(); } else if (k === 'freset') { AF.g = AF.r = AF.f = AF.o = AF.d = AF.q = ''; AF.n = 60; mount(); } else if (k === 'auto') { FS.team = own().sort((a, c) => power(c) - power(a)).slice(0, 3); mount(); } else if (k === 'fight') fight();
      else if (k === 'sync') { const r = await sync(true); syShow(); toast(SY.s === 'ok' ? L('Cartes synchronisées ✓', 'Cards synced ✓') : L('Synchronisation impossible : ', 'Sync failed: ') + (SY.m || L('SQL v10 installé ?', 'is the v10 SQL installed?'))); }
      else if (k === 'snd') { G.snd = !G.snd; save(); head(); if (G.snd) SFX.click(); }
      else if (k === 'login') { if (!G.lg.c) { G.lg.c = true; credit(lgReward(G.lg.n)); SFX.coin(); checkAch(); save(); mount(); } }
      else if (k === 'selldup') { let tot = 0; cur.res.forEach(x => { if (x.dup) tot += sellDup(x.id, x.f); }); if (tot) { SFX.coin(); toast('+' + tot + ' ✦'); } checkAch(); save(); head(); b.remove(); }
      else if (k === 'sellall') { if (!SELL.conf) { SELL.conf = 1; clearTimeout(SELL.t); SELL.t = setTimeout(() => { SELL.conf = 0; if ($('#hcr')) mount(); }, 5000); return mount(); } SELL.conf = 0; let tot = 0; own().forEach(i => { if (byC[i].R > SELL.cap) return; [0, 1, 2, 3].forEach(f => { if (SELL.keep && f >= 2) return; while (G.col[i].f[f] > 1) tot += sellDup(i, f); }); }); if (tot) { SFX.coin(); toast(L('Doublons vendus : +', 'Duplicates sold: +') + tot + ' ✦'); } checkAch(); save(); mount(); }
      else if (k === 'exp') { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(G)], { type: 'application/json' })); a.download = 'foilvault.json'; a.click(); }
      else if (k === 'reset') { if (confirm(L('Effacer toutes vos cartes, éclats et succès ?', 'Erase all your cards, shards and achievements?'))) { G = dflt(); daily(); save(); mount(); } }
      else if (k === 'img') showcaseImage(); return; }
    if ((b = t.closest('[data-rti]'))) { const i = +b.dataset.rti; if (cur && cur.R && cur.R.fin) return zoom(cur.res[i].id); return rtReveal(i); }
    if ((b = t.closest('[data-hcflip]'))) return cardClick();
    if (t.closest('.hc-seq') && !t.closest('button,a,.btn')) return cardClick();
    if ((b = t.closest('[data-hcbuy]'))) { const [pk, n] = b.dataset.hcbuy.split(':'), cost = PRICE[pk] * +n; if (G.coins < cost) return; G.coins -= cost; G.ss += cost; G.inv[pk] = Math.min(99, G.inv[pk] + +n); SFX.coin(); save(); return mount(); }
    if ((b = t.closest('[data-hcq]'))) { const q = QPOOL.find(x => x[0] === b.dataset.hcq); if (q && (G.day.p[q[0]] || 0) >= q[1] && !G.day.c[q[0]]) { G.day.c[q[0]] = true; credit(q[4]); if (G.day.q.every(k => G.day.c[k])) { G.qa = (G.qa || 0) + 1; credit(QBONUS); toast('🎯 ' + L('Tous les défis du jour : +', 'All daily challenges: +') + QBONUS + ' ✦'); } SFX.coin(); save(); mount(); } return; }
    if ((b = t.closest('[data-hcsell]'))) { const [id, f] = b.dataset.hcsell.split(':'); const v = sellDup(id, +f); if (v) { SFX.coin(); toast('+' + v + ' ✦'); checkAch(); save(); head(); const d = $('#hczd'); if (d) d.__redraw(); if ($('#hcr')) mount(); } return; }
    if ((b = t.closest('[data-hcrk]'))) { RK.s = b.dataset.hcrk; return rkDraw(); }
    if ((b = t.closest('[data-hcsc]'))) { SELL.cap = +b.dataset.hcsc; SELL.conf = 0; return mount(); }
    if ((b = t.closest('[data-hcsk]'))) { SELL.keep = SELL.keep ? 0 : 1; SELL.conf = 0; return mount(); }
    if ((b = t.closest('[data-hcaf]'))) { AFL[b.dataset.hcaf] = b.dataset.v; return mount(); }
    if ((b = t.closest('[data-hcf]'))) { AF[b.dataset.hcf] = b.dataset.v; AF.n = 60; return mount(); }
    if ((b = t.closest('[data-hcd]'))) { FS.diff = +b.dataset.hcd; return mount(); }
    if ((b = t.closest('[data-hcteam]'))) { const id = b.dataset.hcteam, i = FS.team.indexOf(id); if (i >= 0) FS.team.splice(i, 1); else if (FS.team.length < 3) FS.team.push(id); return mount(); }
    if ((b = t.closest('[data-hcfin]'))) { const d = $('#hczd'); if (d) d.__set('fin', +b.dataset.hcfin); return; }
    if ((b = t.closest('[data-hcalt]'))) { const d = $('#hczd'); if (d) d.__set('alt'); return; }
    if ((b = t.closest('[data-hcmk]')) && b.tagName !== 'SELECT' && b.tagName !== 'INPUT') { mkAction(b); return; }
    if ((b = t.closest('[data-hcvt]'))) { vtClick(b); return; }
    if ((b = t.closest('[data-hcshow]'))) { const [id, f, a] = b.dataset.hcshow.split(':'); const i = G.show.findIndex(s => s.split(':')[0] === id); if (i >= 0) G.show.splice(i, 1); else if (G.show.length >= 6) toast(L('6 cartes maximum en vitrine.', '6 cards maximum in the showcase.')); else G.show.push(id + ':' + f + ':' + a); save(); const d = $('#hczd'); if (d) d.__redraw(); const w = $('#hcpf'); if (w) w.parentElement.innerHTML = section(); return; }
    if ((b = t.closest('[data-hcinst]'))) { const v = b.dataset.hcinst; if (v === 'x') $('#hcinst').close(); else if (v === 'go') { if (DIP) { DIP.prompt(); DIP = null; $('#hcinst').close(); } } else instDlg(v === '1' ? '' : v); return; }
    if ((b = t.closest('[data-hcz]'))) { const c = b.closest('.hc'); if (c && c.dataset.hcid && !t.closest('#hcov')) return zoom(c.dataset.hcid); }
  });
  document.addEventListener('change', e => { if (e.target.id === 'hcimp') { const f = e.target.files[0]; if (!f) return; f.text().then(x => { try { const d = JSON.parse(x); if (!d || typeof d.col !== 'object') throw 0; G = Object.assign(dflt(), d); regen(); daily(); save(); mount(); toast(L('Cartes importées', 'Cards imported')); } catch { toast(L('Fichier invalide', 'Invalid file')); } }); } });
  document.addEventListener('change', e => { const t = e.target; if (t.dataset && t.dataset.hcsel) { AF[t.dataset.hcsel] = t.value; AF.n = 60; mount(); } });
  document.addEventListener('input', e => { if (e.target.id === 'hcq') { AF.q = e.target.value; AF.n = 60; const pos = e.target.selectionStart; mount(); const q = $('#hcq'); if (q) { q.focus(); q.setSelectionRange(pos, pos); } } });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('#hcov')) closeOv(); });
  window.addEventListener('hashchange', () => { if (!/^#\/cartes/.test(location.hash)) document.body.classList.remove('hcsite'); });
  document.addEventListener('pointermove', e => { const c = e.target.closest && e.target.closest('.hc.tilt'); if (!c || red()) return; const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height; c.style.setProperty('--mx', (x * 100).toFixed(1) + '%'); c.style.setProperty('--my', (y * 100).toFixed(1) + '%'); c.style.setProperty('--rx', ((0.5 - y) * 14).toFixed(1) + 'deg'); c.style.setProperty('--ry', ((x - 0.5) * 16).toFixed(1) + 'deg'); });
  document.addEventListener('pointerout', e => { const c = e.target.closest && e.target.closest('.hc.tilt'); if (c && !c.contains(e.relatedTarget)) { ['--rx', '--ry'].forEach(p => c.style.setProperty(p, '0deg')); } });
  const publicCards = c => { if (!c || typeof c !== 'object') return ''; const sh = (Array.isArray(c.s) ? c.s : []).map(s => { const [id, f, a] = String(s).split(':'); return { id, f: +f || 0, a: +a || 0 }; }).filter(x => byC[x.id]), lv = LV[lvOf(+c.p || 0)];
    return `<section class="pp-hc">${sec(L('Foilvault', 'Foilvault'), `<span class="rkc">✦ ${L(lv[1], lv[2])}</span>`)}<div class="pp-st"><div><b>${+c.p || 0}</b><span>${L('points', 'points')}</span></div><div><b>${+c.u || 0}<small>/${+c.t || '?'}</small></b><span>${L('cartes', 'cards')}</span></div><div><b>${+c.l || 0}</b><span>${L('légendaires', 'legendaries')}</span></div><div><b>${+c.a || 0}</b><span>${L('succès', 'achievements')}</span></div></div>${sh.length ? `<div class="hc-row pp-sh">${sh.map(x => cardHtml(byC[x.id], { fin: x.f, alt: !!x.a, cls: 'tilt', d: 'data-hcz="1"' })).join('')}</div>` : `<p class="sub">${L('Vitrine vide.', 'Empty showcase.')}</p>`}</section>`; };
  // ----- bannière de l'accueil Astrolabe (v22)
  const MEGA_GAMES = ['hsr', 'gi', 'zzz', 'hi3', 'ww', 'r99', 'uma', 'bb', 'ef', 'fgo', 'nk', 'nte', 'op', 'p5x', 'bmh'];
  const mega = (n, co) => `<section class="hc-mega hcm2"><div class="hcm-bg" aria-hidden="true"><i class="a1"></i><i class="a2"></i><i class="a3"></i>${Array.from({ length: 34 }, (_, i) => `<b style="left:${(i * 29) % 100}%;top:${(i * 53) % 100}%;animation-delay:${(i % 9) * .35}s"></b>`).join('')}</div>
    <div class="hc-mg-l"><span class="hc-mg-tag">${L('✦ Le wiki-jeu des cartes gacha à collectionner', '✦ The wiki-game of collectible gacha cards')}</span><h2 class="hcm-t">Foilvault</h2>
    <p>${L('Tous vos personnages gacha préférés, en <b>cartes à collectionner</b>. Ouvrez des boosters gratuits, complétez l’encyclopédie carte par carte (Holo, Shiny, Dorée, <b>Secrètes</b> plein cadre, <b>Éclipses</b>) et échangez vos doublons avec la communauté : Honkai, Genshin, Zenless, Wuthering Waves, Reverse: 1999, Bleach, Persona 5: The Phantom X, Bleach: Mirrors High, Fate/GO, Nikke, One Piece…', 'All your favourite gacha characters as <b>collectible cards</b>. Open free boosters, complete the encyclopedia card by card (Holo, Shiny, Gold, full-art <b>Secrets</b>, <b>Eclipses</b>) and trade duplicates with the community: Honkai, Genshin, Zenless, Wuthering Waves, Reverse: 1999, Bleach, Persona 5 X, Fate/GO, Nikke, One Piece…')}</p>
    <div class="hc-mg-st"><span><b class="hcm-cnt" data-to="${CD ? CD.length : 937}">0</b> ${L('cartes', 'cards')}</span><span><b class="hcm-cnt" data-to="${Object.keys(GAMES).length}">0</b> ${L('jeux', 'games')}</span><span><b>5</b> ${L('finitions', 'finishes')}</span><span><b>100 %</b> ${L('gratuit', 'free')}</span></div>
    <div class="hcm-act"><a class="btn pri hc-mg-btn" href="#/cartes">${L('Ouvrir mes boosters', 'Open my boosters')} · ${n} 🎴 · ${co} ✦</a><a class="btn" href="#/cartes/all">${L('Voir le catalogue', 'Browse the catalogue')}</a></div></div>
    <div class="hc-mg-r" id="hcmgf"></div>
    <div class="hcm-games"><span class="lab">${L('Choisissez votre univers', 'Pick your universe')}</span>${MEGA_GAMES.map(k => `<a href="#/cartes/all" data-hcgame="${k}" style="--gc:${GAMES[k][2]}"><i></i>${GAMES[k][1]}<em data-hcn="${k}"></em></a>`).join('')}</div></section>`;
  // soutien (dons) : affiché seulement si data/support.json contient une adresse https:// (voir docs)
  let SUP = null;
  const supLoad = () => SUP ? Promise.resolve(SUP) : fetch('data/support.json', { cache: 'no-cache' }).then(r => r.json()).catch(() => ({})).then(x => (SUP = x || {}));
  async function supFill() { const el = $('#hcsup'); if (!el) return; const s = await supLoad(); if (!s.url || !/^https:\/\//.test(s.url)) { el.innerHTML = ''; return; }
    el.innerHTML = `<div class="hc-sup"><div><b>💛 ${L('Soutenir le projet', 'Support the project')}</b><p class="sub">${L('Astrolabe et Foilvault sont gratuits, sans publicité, et le resteront. Si le site vous plaît, vous pouvez offrir un petit café pour le temps passé dessus. C’est un simple merci : aucun avantage en échange, rien ne s’achète dans le jeu.', 'Astrolabe and Foilvault are free, ad-free and will stay that way. If you enjoy the site you can buy a small coffee for the time spent on it. It is a simple thank-you: no perks in return, nothing in the game can be bought.')}</p></div><a class="btn pri" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">☕ ${esc(s.label || L('Faire un don', 'Donate'))}</a></div>`; }
  const community = () => `<section class="hc-comm"><div class="hcc-h"><div><h3>${L('Communauté Foilvault', 'Foilvault community')}</h3><p class="sub">${L('Échangez vos doublons, complétez vos collections ensemble et grimpez au classement.', 'Trade duplicates, finish your collections together and climb the ranking.')}</p></div><div class="hcc-act"><a class="btn pri" href="#/cartes/market">⇄ ${L('Aller au marché', 'Go to the market')}</a><a class="btn" href="#/cartes/rank">🏆 ${L('Classement', 'Ranking')}</a></div></div>
    <div class="hcc-grid"><div class="hcc-box"><span class="lab">${L('Dernières offres du marché', 'Latest market offers')}</span><div id="hccm" class="hcc-offers"><p class="sub">…</p></div></div><div class="hcc-box"><span class="lab">${L('Meilleurs collectionneurs', 'Top collectors')}</span><div id="hccr" class="hcc-top"><p class="sub">…</p></div></div></div></section>`;
  async function communityFill() { const d = mkDb(), m = $('#hccm'), r = $('#hccr'); if (!m || !r) return; const join = L('Connectez-vous pour voir les offres et échanger vos doublons avec les autres joueurs.', 'Log in to see offers and trade duplicates with other players.');
    if (!d) { m.innerHTML = `<p class="sub">${join}</p>`; r.innerHTML = `<p class="sub">${L('Le classement arrive avec les comptes joueurs.', 'The ranking comes with player accounts.')}</p>`; return; }
    try { await data(); const me = mkMe();
      if (me) { const { data: rows } = await d.from('trades').select('*').order('created_at', { ascending: false }).limit(40); const o = (rows || []).filter(x => x.status === 'open' && x.seller !== me && byC[x.card]).slice(0, 4); m.innerHTML = o.length ? o.map(x => `<a class="hcc-o" href="#/cartes/market">${cardHtml(byC[x.card], { fin: x.fin, cls: 'sm' })}<b>${x.kind === 'coins' ? coinI + ' ' + x.price : '⇄'}</b></a>`).join('') : `<p class="sub">${L('Aucune offre pour l’instant : proposez un doublon, soyez le premier !', 'No offers yet: list a duplicate and be the first!')}</p>`; } else m.innerHTML = `<p class="sub">${join}</p>`;
      const { data: pr } = await d.from('profiles').select('user_id,handle,display_name,cards').eq('is_public', true).not('handle', 'is', null).limit(200); const l = (pr || []).filter(p => p.cards && p.cards.p > 0).sort((a, b) => b.cards.p - a.cards.p).slice(0, 3);
      r.innerHTML = l.length ? l.map((p, i) => `<a class="hcc-t" href="#/community/${esc(p.handle)}"><i>${['🥇', '🥈', '🥉'][i]}</i><span>${esc(p.display_name || p.handle)}</span><b>${p.cards.p} pts</b></a>`).join('') : `<p class="sub">${L('Rendez votre profil public pour apparaître ici.', 'Make your profile public to appear here.')}</p>`;
    } catch { m.innerHTML = `<p class="sub">${join}</p>`; r.innerHTML = ''; } }
  const megaFx = () => { if (red()) { $$('.hcm-cnt').forEach(e => e.textContent = e.dataset.to); } else $$('.hcm-cnt').forEach(e => { const to = +e.dataset.to, t0 = performance.now(); const f = t => { const p = Math.min(1, (t - t0) / 1400); e.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(f); }; requestAnimationFrame(f); });
    if (CD) $$('[data-hcn]').forEach(e => { e.textContent = CD.filter(c => c.g === e.dataset.hcn).length; }); };
  document.addEventListener('click', e => { const a = e.target.closest && e.target.closest('[data-hcgame]'); if (a) { AF.g = a.dataset.hcgame; AF.n = 60; } });
  return { community, communityFill, supFill, mega, megaFx, page, section, sync, today: () => { load(); const q = G.day.q || [], cl = G.day.c || {}, done = q.filter(id => { const d = QPOOL.find(z => z[0] === id); return d && (G.day.p[id] || 0) >= d[1]; }).length; return { st: G.st, claim: G.lg.d === today() && !G.lg.c, streak: G.lg.n, qd: done, qt: q.length, qc: q.filter(id => cl[id]).length }; }, showCards: () => { load(); return showList().map(x => cardHtml(byC[x.id], { fin: x.f, alt: !!x.a, cls: 'tilt', d: 'data-hcz="1"' })).join(''); }, mini: async () => { await data(); load(); const s = summary(), lv = LV[s.lv]; return { s, lv: L(lv[1], lv[2]), coins: G.coins, st: G.st, sh: showList().length }; }, oddsHtml, vitrine, vitrineInner, data2: 0, heroFan: () => { load(); return heroFan(); }, count: () => CD ? CD.length : 0, inst: instStrip, data, load, packHtml, publicCards, MAXB, byC: () => byC, home: () => { load(); const n = G.st + Object.values(G.inv).reduce((s, x) => s + x, 0); return [n, G.coins]; } };
})();
pages.cartes = HC.page;
// accueil : grande bannière
pages.astrolabe = pages.home;   // v27 : l'ancienne page d'accueil devient la page « Astrolabe » ; la nouvelle accueil (3 portes) est dans p17.js
// profil : onglet Cartes
{ const _p = pages.profil; pages.profil = tab => { const r = _p(tab === 'cartes' ? 'ov' : tab); let h = r[0]; const b0 = h.indexOf('<div class="bigtabs">'); if (b0 < 0) return r; const b1 = h.indexOf('</div>', b0), seg = h.slice(b0, b1), tl = `<a class="${tab === 'cartes' ? 'on' : ''}" href="#/profil/cartes">${ico('spark')}${L('Cartes', 'Cards')}</a>`;
  const seg2 = (tab === 'cartes' ? seg.replace(/class="on"/g, 'class=""') : seg) + tl; const head = h.slice(0, b0) + seg2 + '</div>';
  if (tab === 'cartes') { HC.data().then(() => { const x = $('#hcmount'); if (x) x.innerHTML = HC.section(); }).catch(() => { }); return [head + '<div id="hcmount"><p class="sub">…</p></div>', null, null]; }
  return [head + h.slice(b1 + 6), r[1], r[2]]; }; }
// communauté : vitrines de cartes
{ const _c = pages.community; pages.community = h => { const r = _c(h), db = () => window.__ASTRO_MOCK || sb;
  if (h) { const af = r[2]; r[2] = async () => { if (af) await af(); const d = db(); if (!d) return; try { await HC.data(); const { data } = await d.from('profiles').select('cards').eq('handle', h).maybeSingle(); const el = $('#pcards'); if (el && data && data.cards) el.innerHTML = HC.publicCards(data.cards); } catch { } }; }
  else { const af = r[2]; r[2] = async () => { if (af) await af(); const d = db(); if (!d) return; try { const { data, error } = await d.from('profiles').select('handle,display_name,cards').eq('is_public', true).not('handle', 'is', null).limit(100); if (error || !data) return; const top = data.filter(p => p.cards && p.cards.p).sort((a, b) => b.cards.p - a.cards.p).slice(0, 5), el = $('#cmr'); if (el && top.length) el.insertAdjacentHTML('beforeend', `<div class="card"><h2 style="font-size:17px">${L('Collectionneurs de cartes', 'Card collectors')}</h2>${top.map((p, i) => `<a class="lbr" href="#/community/${esc(p.handle)}"><i>${i + 1}</i><span>${esc(p.display_name || p.handle)}</span><b>${p.cards.p}</b></a>`).join('')}<p class="note"><a href="#/cartes/rank">${L('Voir le classement complet', 'See the full ranking')} →</a></p></div>`); } catch { } }; }
  return r; }; }
// bouton flottant Foilvault (rappel du stock de boosters, caché sur le site Foilvault lui-même)
{ let fab = null; const upd = () => { const on = !/^#\/cartes/.test(location.hash) && !/^(#\/home|#\/?)$/.test(location.hash) && !(sb && !user); if (!on) { if (fab) fab.hidden = true; return; } try { const [n] = HC.home(); if (!fab) { fab = document.createElement('a'); fab.className = 'hc-fab'; fab.href = '#/cartes'; document.body.appendChild(fab); } fab.hidden = false; fab.classList.toggle('has', n > 0); fab.innerHTML = `<span>🎴</span><b>${n}</b><em>Foilvault</em>`; fab.setAttribute('aria-label', 'Foilvault : ' + n + ' boosters'); } catch { } };
  window.addEventListener('hashchange', () => setTimeout(upd, 50)); setInterval(upd, 20000); setTimeout(upd, 1200); }

// ------------------------------------------------------------ v15 : profil repensé, vitrine de cartes, probabilités
{
  const _old = pages.profil;
  const PTABS = () => [['ov', L('Aperçu', 'Overview'), 'user'], ['show', L('Vitrine', 'Showcase'), 'star'], ['col', L('Star Rail', 'Star Rail'), 'users'], ['cartes', L('Cartes', 'Cards'), 'spark'], ['goals', L('Objectifs', 'Goals'), 'trophy']];
  const SUBT = () => [['col', L('Personnages', 'Characters')], ['fav', L('Favoris', 'Favourites')], ['teams', L('Équipes possibles', 'Possible teams')]];
  pages.profil = tab => {
    if (tab === 'set' || tab === 'settings') return pages.settings();
    tab = tab || 'ov'; if (['fav', 'teams'].includes(tab)) { /* sous-onglets de Star Rail */ }
    const own = Object.keys(prof.col).filter(i => byId[i]), n5 = own.filter(i => byId[i].r === 5).length, eids = own.reduce((s, i) => s + prof.col[i], 0), bs = badgesOf(myBadgeStats()), bok = bs.filter(b => b.ok);
    const pts = own.length + n5 * 3 + eids + bok.length * 5, ri = RANKS.reduce((r, x, i) => pts >= x[0] ? i : r, 0), nx = RANKS[ri + 1], rk = RANKS[ri];
    const name = prof.name || (user ? user.email.split('@')[0] : L('Voyageur', 'Traveler')), av = prof.avatar && byId[prof.avatar];
    const elCount = {}; own.forEach(i => elCount[byId[i].ei] = (elCount[byId[i].ei] || 0) + 1);
    const topEl = Object.keys(elCount).sort((a, b) => elCount[b] - elCount[a])[0], col = ELC[(av && av.ei) || topEl] || '#d8b25a';
    const avatarHtml = photoOk(prof.photo) ? `<img class="av" src="${prof.photo}" alt="">` : av ? `<img class="av" src="${im('c', av.id)}" alt="">` : `<div class="av">${esc(name[0].toUpperCase())}</div>`;
    const streak = (store.get('astro_daily2', {}) || {}).streak || 0, pct = C.length ? Math.round(own.length / C.length * 100) : 0;
    const stripe = `<div class="pf2s"><div><b>${own.length}<small>/${C.length}</small></b><span>${L('Personnages', 'Characters')}</span></div><div><b>${n5}</b><span>5★</span></div><div><b id="pf2hc">…</b><span>${L('Cartes Hoyo', 'Foilvault')}</span></div><div><b>${streak}<small> ${L('j', 'd')}</small></b><span>${L('Série', 'Streak')}</span></div></div>`;
    const hero = `<section class="pf2h" style="--pc:${col}"><div class="pf2a"><button class="pfav" data-pavt="1" title="${L('Changer d’avatar', 'Change avatar')}">${avatarHtml}<span>✎</span></button></div><div class="pf2i"><span class="rkc">✦ ${esc(L(rk[1], rk[2]))}</span><h1>${esc(name)}</h1>${prof.handle ? `<small class="hdl">@${esc(prof.handle)}</small>` : ''}${prof.bio ? `<p class="pbio">${esc(prof.bio)}</p>` : ''}
      <div class="xpb" title="${pts} pts · ${L('1 pt par personnage, 3 par 5★, 1 par éidolon, 5 par succès', '1 pt per character, 3 per 5★, 1 per eidolon, 5 per achievement')}"><i style="width:${nx ? Math.round((pts - rk[0]) / (nx[0] - rk[0]) * 100) : 100}%"></i></div><small class="sub">${nx ? L(`${nx[0] - pts} pts avant « ${nx[1]} »`, `${nx[0] - pts} pts to “${nx[2]}”`) : L('Rang maximum atteint', 'Max rank reached')}</small></div>
      <div class="pf2b"><a class="btn" href="#/settings">${ico('cog')} ${L('Modifier le profil', 'Edit profile')}</a><button class="btn" data-pshare="1">${ico('share')} ${L('Partager', 'Share')}</button>${prof.pub && prof.handle ? `<a class="btn" href="#/community/${esc(prof.handle)}">${L('Page publique', 'Public page')}</a>` : ''}</div>${stripe}</section>`;
    const pav = `<div class="card" id="pavp" hidden><b>${L('Choisissez votre avatar', 'Pick your avatar')}</b><div class="grid" style="max-height:230px;overflow:auto;margin-top:10px">${C.map(c => `<button class="cd s ${prof.avatar === c.id ? 'on' : ''}" data-av="${c.id}"><span class="pt"><img src="${im('c', c.id)}" alt="" loading="lazy"></span></button>`).join('')}</div></div>`;
    const banner = !sb || user ? '' : `<div class="card pf2n"><span>${L('Connectez-vous pour retrouver votre collection et vos favoris sur tous vos appareils.', 'Log in to keep your collection and favourites on all your devices.')}</span><button class="btn pri" id="login">${L('Connexion', 'Log in')}</button></div>`;
    const inSR = ['col', 'fav', 'teams'].includes(tab), cur = inSR ? 'col' : tab;
    const tabsH = `<nav class="pf2t" aria-label="${L('Sections du profil', 'Profile sections')}">${PTABS().map(t => `<a class="${cur === t[0] ? 'on' : ''}" href="#/profil/${t[0] === 'ov' ? '' : t[0]}">${ico(t[2])}<span>${t[1]}</span></a>`).join('')}</nav>`;
    const head = hero + pav + banner + tabsH;
    const mount = (id, fn) => [head + `<div id="${id}"><p class="sub">…</p></div>`, null, () => { HC.data().then(() => { const x = $('#' + id); if (x) x.innerHTML = fn(); }).catch(() => { }); }];
    let out;
    if (tab === 'show') out = mount('pf2m', () => HC.vitrine());
    else if (tab === 'cartes') out = mount('pf2m', () => HC.section());
    else if (inSR || tab === 'goals') {
      const r = _old(tab), h = r[0], b0 = h.indexOf('<div class="bigtabs">'), b1 = h.indexOf('</div>', b0), body = b0 < 0 ? '' : h.slice(b1 + 6);
      const sub = inSR ? `<div class="pf2p">${SUBT().map(t => `<a class="${tab === t[0] ? 'on' : ''}" href="#/profil/${t[0] === 'col' ? 'col' : t[0]}">${t[1]}</a>`).join('')}</div>` : '';
      out = [head + sub + body, r[1], r[2]];
    } else {
      const top = own.map(i => byId[i]).sort((a, b) => tval(b, 'ov') - tval(a, 'ov') || b.r - a.r).slice(0, 6), els = Object.keys(ELC), paths = uniq(C, 'pi');
      const bar = (label, n, tot, c) => `<div class="pbar"><span>${label}</span><div><i style="width:${tot ? Math.round(n / tot * 100) : 0}%;background:${c}"></i></div><em>${n}/${tot}</em></div>`;
      const nxt = bs.filter(b => !b.ok).slice(0, 3);
      const body = `<div class="pf2g"><div class="card pf2c"><span class="lab">Honkai: Star Rail</span><h2>${pct} %</h2><div class="pbar"><div><i style="width:${pct}%"></i></div></div><p class="sub">${own.length} / ${C.length} ${L('personnages', 'characters')} · ${eids} ${L('éidolons', 'eidolons')}</p><a class="btn" href="#/profil/col">${L('Gérer ma collection', 'Manage my collection')} →</a></div>
        <div class="card pf2c" id="pf2hcc"><span class="lab">Foilvault</span><h2>…</h2><p class="sub">…</p></div></div>
      ${sec(L('Ma vitrine', 'My showcase'), `<a href="#/profil/show">${L('Modifier', 'Edit')} →</a>`)}<div id="pf2sv" class="hc-row"><p class="sub">…</p></div>
      ${top.length ? `${sec(L('Mes meilleurs personnages', 'My best characters'))}<div class="grid">${top.map(c => tile(c, { sub: 'E' + prof.col[c.id] })).join('')}</div>` : ''}
      <details class="pf2d"><summary>${L('Détail par élément et par voie', 'Breakdown by element and path')}</summary><div class="g"><div class="card"><h2>${L('Par élément', 'By element')}</h2>${els.map(e => bar(eN(e), own.filter(i => byId[i].ei === e).length, C.filter(c => c.ei === e).length, ELC[e])).join('')}</div><div class="card"><h2>${L('Par voie', 'By path')}</h2>${paths.map(p => bar(pN(p), own.filter(i => byId[i].pi === p).length, C.filter(c => c.pi === p).length, col)).join('')}</div></div></details>
      <details class="pf2d"><summary>${L('Succès', 'Achievements')} (${bok.length}/${bs.length})</summary>${badgesHtml(myBadgeStats())}</details>`;
      out = [head + body, null, () => { HC.mini().then(m => { const a = $('#pf2hc'); if (a) a.innerHTML = m.s.u + '<small>/' + m.s.t + '</small>'; const c = $('#pf2hcc'); if (c) c.innerHTML = `<span class="lab">Foilvault</span><h2>${m.s.t ? Math.round(m.s.u / m.s.t * 100) : 0} %</h2><div class="pbar"><div><i style="width:${m.s.t ? Math.round(m.s.u / m.s.t * 100) : 0}%"></i></div></div><p class="sub">${m.lv} · ${m.s.u}/${m.s.t} ${L('cartes', 'cards')} · ✦ ${m.coins} · 🎴 ${m.st}</p><a class="btn pri" href="#/cartes">${L('Ouvrir des boosters', 'Open boosters')} →</a>`; const v = $('#pf2sv'); if (v) v.innerHTML = m.sh ? HC.showCards() : `<p class="sub">${L('Votre vitrine est vide.', 'Your showcase is empty.')} <a href="#/profil/show">${L('Choisir mes cartes', 'Choose my cards')} →</a></p>`; }).catch(() => { }); }];
    }
    const f0 = out[2]; out[2] = () => { if (f0) f0(); HC.mini().then(m => { const a = $('#pf2hc'); if (a) a.innerHTML = m.s.u + '<small>/' + m.s.t + '</small>'; }).catch(() => { }); };
    return out;
  };
  // statistiques : probabilités
  const _st = pages.stats;
  pages.stats = () => { const r = _st(), af = r[2]; r[0] += '<div id="hcodds"></div>'; r[2] = async () => { if (af) await af(); let rows = []; try { const d = window.__ASTRO_MOCK || sb; if (d) { const q = await d.from('profiles').select('cards').eq('is_public', true).limit(500); rows = q.data || []; } await HC.data(); } catch { } const x = $('#hcodds'); if (x) x.innerHTML = HC.oddsHtml(rows); }; return r; };
}

// ------------------------------------------------------------ v17 : réseau social (publications, amis, chat) + joueurs en ligne
{
  const SO = { tab: 'feed', kind: 'all', posts: [], end: false, lk: {}, cc: {}, fr: null, conv: null, msgs: [], timer: null, note: '', img: null, busy: false };
  const KINDS = () => [['image', L('Image', 'Image')], ['build', 'Build'], ['guide', 'Guide'], ['bug', 'Bug'], ['question', L('Question', 'Question')], ['other', L('Autre', 'Other')]];
  const GAMES_ = () => [['hsr', 'Star Rail'], ['gi', 'Genshin'], ['zzz', 'ZZZ'], ['hi3', 'Honkai 3rd'], ['tot', 'Tears of Themis'], ['ww', 'Wuthering Waves'], ['r99', 'Reverse: 1999'], ['uma', 'Umamusume'], ['bb', 'Bleach'], ['ef', 'Endfield'], ['fgo', 'FGO'], ['nk', 'Nikke'], ['nte', 'NTE'], ['op', 'One Piece'], ['p5x', 'Persona 5 X'], ['bmh', 'Bleach MH'], ['site', L('Le site', 'The site')]];
  const me = () => (user && user.id) || window.__ASTRO_USER || null, db = () => window.__ASTRO_MOCK || sb;
  const ago = t => { const s = Math.max(0, (Date.now() - new Date(t)) / 1000); return s < 60 ? L('à l’instant', 'just now') : s < 3600 ? Math.floor(s / 60) + ' min' : s < 86400 ? Math.floor(s / 3600) + ' h' : Math.floor(s / 86400) + ' j'; };
  const rich = t => esc(t || '').replace(/\n/g, '<br>');
  const sAv = (n, h) => `<i class="so-av" style="background:hsl(${hue(h || n || '?')} 45% 34%)">${esc((n || '?')[0].toUpperCase())}</i>`;
  const who = (n, h) => h ? `<a href="#/community/${esc(h)}">${esc(n || h)}</a>` : `<span>${esc(n || '—')}</span>`;
  const ERR = e => { const m = (e && e.message) || ''; return /limit/i.test(m) ? L('Limite atteinte, réessayez plus tard.', 'Limit reached, try again later.') : /slow/i.test(m) ? L('Doucement : un message toutes les 2 secondes.', 'Slow down: one message every 2 seconds.') : /notfriend/i.test(m) ? L('Vous n’êtes pas amis.', 'You are not friends.') : /unknown/i.test(m) ? L('Aucun joueur avec ce nom d’utilisateur.', 'No player with that username.') : /self/i.test(m) ? L('C’est vous !', 'That is you!') : L('Action impossible (le SQL v9 est-il installé ?).', 'Action failed (is the v9 SQL installed?).'); };
  const compress = f => new Promise(res => { if (!f || !/^image\//.test(f.type)) return res(null); const u = URL.createObjectURL(f), im = new Image(); im.onload = () => { const k = Math.min(1, 900 / Math.max(im.width, im.height)), c = document.createElement('canvas'); c.width = Math.round(im.width * k); c.height = Math.round(im.height * k); c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); URL.revokeObjectURL(u); let q = .74, d = c.toDataURL('image/jpeg', q); while (d.length > 200000 && q > .3) { q -= .1; d = c.toDataURL('image/jpeg', q); } res(d.length <= 225000 ? d : null); }; im.onerror = () => res(null); im.src = u; });
  const nReq = () => SO.fr ? SO.fr.filter(f => f.status === 'pending' && f.b === me()).length : 0;
  const TABS = () => [['feed', L('Fil', 'Feed')], ['friends', L('Amis', 'Friends') + (nReq() ? ' (' + nReq() + ')' : '')], ['chat', 'Chat'], ['players', L('Joueurs', 'Players')]];
  pages.social = t => { SO.tab = ['feed', 'friends', 'chat'].includes(t) ? t : 'feed'; clearInterval(SO.timer);
    return [`<section class="soc"><div><span class="lab">${L('Réseau des joueurs', 'Player network')}</span><h1>${L('Communauté', 'Community')}</h1><p class="lead">${L('Partagez vos images, builds et guides, signalez un bug, ajoutez des amis et discutez.', 'Share images, builds and guides, report a bug, add friends and chat.')}</p></div></section>
    <nav class="pf2t" id="sotabs">${TABS().map(x => x[0] === 'players' ? `<a href="#/community"><span>${x[1]}</span></a>` : `<a class="${SO.tab === x[0] ? 'on' : ''}" href="#/social/${x[0] === 'feed' ? '' : x[0]}"><span>${x[1]}</span></a>`).join('')}</nav><div id="sob"><p class="sub">${L('Chargement…', 'Loading…')}</p></div>`, null, async () => { if (!db()) return; await loadFr(); const n = $('#sotabs a[href="#/social/friends"] span'); if (n) n.textContent = TABS()[1][1]; ({ feed: feedInit, friends: friendsView, chat: chatInit })[SO.tab](); }]; };
  const box = h => { const b = $('#sob'); if (b) b.innerHTML = h; };
  const noSql = () => box(`<div class="card"><p class="sub">${L('Réseau social indisponible : exécutez supabase/schema_v9.sql dans Supabase.', 'Social features unavailable: run supabase/schema_v9.sql in Supabase.')}</p></div>`);
  // ---------- fil de publications
  async function loadPosts(more) { const d = db(); let q = d.from('posts').select('*').order('created_at', { ascending: false }).limit(12); if (SO.kind !== 'all') q = q.eq('kind', SO.kind); if (more && SO.posts.length) q = q.lt('created_at', SO.posts[SO.posts.length - 1].created_at);
    const { data, error } = await q; if (error) return false; const rows = data || []; SO.end = rows.length < 12; SO.posts = more ? SO.posts.concat(rows) : rows; const ids = rows.map(r => r.id);
    if (ids.length) { const [l, c] = await Promise.all([d.from('post_likes').select('post_id,user_id').in('post_id', ids), d.from('post_comments').select('post_id').in('post_id', ids)]);
      ids.forEach(i => { SO.lk[i] = { n: 0, me: false }; SO.cc[i] = 0; }); (l.data || []).forEach(x => { SO.lk[x.post_id].n++; if (x.user_id === me()) SO.lk[x.post_id].me = true; }); (c.data || []).forEach(x => { SO.cc[x.post_id]++; }); }
    return true; }
  const postHtml = p => { const lk = SO.lk[p.id] || { n: 0 }, mine = p.author === me(); return `<article class="card so-p" id="p-${p.id}"><header>${sAv(p.author_name, p.author_handle)}<div><b>${who(p.author_name, p.author_handle)}</b><small class="sub">${ago(p.created_at)} · ${esc((GAMES_().find(g => g[0] === p.game) || [0, p.game])[1])}</small></div><span class="so-k so-k-${esc(p.kind)}">${esc((KINDS().find(k => k[0] === p.kind) || [0, p.kind])[1])}</span></header><h3>${esc(p.title)}</h3>${p.body ? `<p>${rich(p.body)}</p>` : ''}${/^data:image\/jpeg;base64,/.test(p.image || '') ? `<img class="so-img" src="${p.image}" alt="" data-so="zoom">` : ''}
    <footer><button class="btn ${lk.me ? 'on' : ''}" data-so="like:${p.id}">${lk.me ? '♥' : '♡'} ${lk.n}</button><button class="btn" data-so="cm:${p.id}">💬 ${SO.cc[p.id] || 0}</button>${mine || isAdmin ? `<button class="btn" data-so="del:${p.id}" title="${L('Supprimer', 'Delete')}">🗑</button>` : ''}${mine ? '' : `<button class="btn" data-so="rep:post:${p.id}" title="${L('Signaler', 'Report')}">⚑</button>`}</footer><div class="so-cm" id="cm-${p.id}" hidden></div></article>`; };
  const drawPosts = () => { const el = $('#sopl'); if (!el) return; el.innerHTML = (SO.posts.map(postHtml).join('') || `<p class="sub">${L('Rien ici pour l’instant. Soyez le premier à publier !', 'Nothing here yet. Be the first to post!')}</p>`) + (SO.end ? '' : `<button class="btn" data-so="more">${L('Voir plus', 'Load more')}</button>`); };
  async function feedInit() { box(`<details class="card so-new" id="sonew"><summary>＋ ${L('Nouvelle publication', 'New post')}</summary><div class="so-f"><div class="so-r"><select id="sok">${KINDS().map(k => `<option value="${k[0]}">${k[1]}</option>`).join('')}</select><select id="sog">${GAMES_().map(k => `<option value="${k[0]}">${k[1]}</option>`).join('')}</select></div><input type="text" id="sot" maxlength="80" placeholder="${L('Titre (3 à 80 caractères)', 'Title (3–80 characters)')}"><textarea id="sobd" maxlength="1500" rows="4" placeholder="${L('Votre texte : build, explication, description du bug…', 'Your text: build, explanation, bug description…')}"></textarea><div class="so-r"><label class="btn" style="cursor:pointer">🖼 ${L('Ajouter une image', 'Add an image')}<input type="file" id="soimg" accept="image/*" hidden></label><span class="sub" id="soprev"></span></div><div class="so-r"><button class="btn pri" data-so="post">${L('Publier', 'Publish')}</button><span class="sub" id="sonote"></span></div><p class="note">${L('Pas de contenu offensant ni d’informations personnelles. 5 publications par jour. Les contenus signalés sont examinés.', 'No offensive content or personal info. 5 posts per day. Reported content is reviewed.')}</p></div></details>
    <div class="chips so-fl"><span class="lab">${L('Type', 'Type')}</span><button class="chip ${SO.kind === 'all' ? 'on' : ''}" data-so="k:all">${L('Tout', 'All')}</button>${KINDS().map(k => `<button class="chip ${SO.kind === k[0] ? 'on' : ''}" data-so="k:${k[0]}">${k[1]}</button>`).join('')}</div><div id="sopl" class="so-list"><p class="sub">…</p></div>`);
    if (!(await loadPosts(false))) return noSql(); drawPosts(); }
  // ---------- amis
  async function loadFr() { const d = db(); if (!d || !me()) return; const { data, error } = await d.from('friendships').select('*'); SO.fr = error ? null : (data || []).map(f => ({ ...f })); }
  const other = f => f.a === me() ? { id: f.b, n: f.b_name, h: f.b_handle } : { id: f.a, n: f.a_name, h: f.a_handle };
  function friendsView() { if (!SO.fr) return noSql(); const m = me(), req = SO.fr.filter(f => f.status === 'pending' && f.b === m), sent = SO.fr.filter(f => f.status === 'pending' && f.a === m), fr = SO.fr.filter(f => f.status === 'accepted');
    const row = (f, acts) => { const o = other(f); return `<div class="so-fr">${sAv(o.n, o.h)}<div>${who(o.n, o.h)}${o.h ? `<small class="sub"> @${esc(o.h)}</small>` : ''}</div><div class="so-fa">${acts}</div></div>`; };
    box(`<div class="card"><h2>${L('Ajouter un ami', 'Add a friend')}</h2><div class="so-r"><input type="text" id="sofh" maxlength="20" placeholder="${L('Nom d’utilisateur de votre ami (ex. mon-pseudo)', 'Your friend’s username (e.g. my-name)')}"><button class="btn pri" data-so="fadd">${L('Envoyer la demande', 'Send request')}</button></div><p class="sub" id="sonote">${esc(SO.note)}</p><p class="note">${L('Le nom d’utilisateur est celui de la page publique du joueur (Paramètres → Profil public).', 'The username is the one on the player’s public page (Settings → Public profile).')}</p></div>
    ${req.length ? `<div class="card"><h2>${L('Demandes reçues', 'Requests received')}</h2>${req.map(f => row(f, `<button class="btn pri" data-so="fok:${f.id}">${L('Accepter', 'Accept')}</button><button class="btn" data-so="fno:${f.id}">${L('Refuser', 'Decline')}</button>`)).join('')}</div>` : ''}
    <div class="card"><h2>${L('Mes amis', 'My friends')} (${fr.length})</h2>${fr.map(f => row(f, `<button class="btn" data-so="dm:${other(f).id}">💬 Chat</button><button class="btn" data-so="fno:${f.id}" title="${L('Retirer', 'Remove')}">✕</button>`)).join('') || `<p class="sub">${L('Pas encore d’amis : envoyez une demande ci-dessus.', 'No friends yet: send a request above.')}</p>`}</div>
    ${sent.length ? `<div class="card"><h2>${L('Demandes envoyées', 'Requests sent')}</h2>${sent.map(f => row(f, `<button class="btn" data-so="fno:${f.id}">${L('Annuler', 'Cancel')}</button>`)).join('')}</div>` : ''}`); }
  // ---------- chat
  const convFriends = () => (SO.fr || []).filter(f => f.status === 'accepted').map(other);
  async function fetchMsgs() { const d = db(), m = me(); if (!d || !m) return; let r;
    if (!SO.conv) r = await d.from('messages').select('*').is('recipient', null).order('created_at', { ascending: false }).limit(80);
    else { r = await d.from('messages').select('*').not('recipient', 'is', null).order('created_at', { ascending: false }).limit(200); if (r.data) r.data = r.data.filter(x => (x.sender === m && x.recipient === SO.conv.id) || (x.sender === SO.conv.id && x.recipient === m)).slice(0, 80); }
    if (r.error) return; const rows = (r.data || []).slice().reverse(), sig = rows.map(x => x.id).join(','); if (sig === SO.sig) return; SO.sig = sig; SO.msgs = rows; drawMsgs(); }
  function drawMsgs() { const el = $('#somsg'); if (!el) return; const st = el.scrollHeight - el.scrollTop - el.clientHeight < 60; const m = me();
    el.innerHTML = SO.msgs.map(x => `<div class="so-m ${x.sender === m ? 'me' : ''}"><small class="sub">${x.sender === m ? '' : esc(x.sender_name || '—') + ' · '}${ago(x.created_at)}${!SO.conv && x.sender !== m ? ` <a href="#" data-so="rep:msg:${x.id}" title="${L('Signaler', 'Report')}">⚑</a>` : ''}${isAdmin ? ` <a href="#" data-so="dmsg:${x.id}">✕</a>` : ''}</small><p>${rich(x.body)}</p></div>`).join('') || `<p class="sub">${L('Aucun message. Dites bonjour !', 'No messages. Say hi!')}</p>`; if (st || SO.first) { el.scrollTop = el.scrollHeight; SO.first = false; } }
  async function chatInit() { if (!SO.fr) await loadFr(); const fl = convFriends();
    box(`<div class="so-chat"><aside class="card"><button class="so-c ${!SO.conv ? 'on' : ''}" data-so="conv:">🌐 ${L('Salon général', 'General room')}</button>${fl.map(f => `<button class="so-c ${SO.conv && SO.conv.id === f.id ? 'on' : ''}" data-so="conv:${f.id}">${sAv(f.n, f.h)} ${esc(f.n || f.h)}</button>`).join('') || `<p class="note">${L('Ajoutez des amis pour discuter en privé.', 'Add friends to chat privately.')}</p>`}</aside>
    <section class="card so-cp"><h2>${SO.conv ? esc(SO.conv.n || '—') : L('Salon général', 'General room')}</h2><div class="so-msgs" id="somsg"><p class="sub">…</p></div><div class="so-r"><input type="text" id="somi" maxlength="400" placeholder="${L('Votre message…', 'Your message…')}" autocomplete="off"><button class="btn pri" data-so="send">${L('Envoyer', 'Send')}</button></div><p class="note" id="sonote">${SO.conv ? '' : L('Salon public : restez courtois. Tout message peut être signalé.', 'Public room: be polite. Any message can be reported.')}</p></section></div>`);
    SO.sig = ''; SO.first = true; await fetchMsgs(); clearInterval(SO.timer); SO.timer = setInterval(() => { if (!$('#somsg')) return clearInterval(SO.timer); if (!document.hidden) fetchMsgs(); }, 4000); }
  // ---------- actions
  document.addEventListener('change', async e => { if (e.target.id !== 'soimg') return; const f = e.target.files[0], pv = $('#soprev'); SO.img = null; if (!f) { pv.textContent = ''; return; } pv.textContent = '…'; SO.img = await compress(f); pv.textContent = SO.img ? '✓ ' + Math.round(SO.img.length / 1024) + ' Ko' : L('Image refusée.', 'Image rejected.'); });
  document.addEventListener('keydown', e => { if (e.key !== 'Enter') return; if (e.target.id === 'somi') { e.preventDefault(); act({ dataset: { so: 'send' } }); } else if (e.target.id === 'sofh') act({ dataset: { so: 'fadd' } }); else if (e.target.dataset && e.target.dataset.socm) act({ dataset: { so: 'cmsend:' + e.target.dataset.socm } }); });
  document.addEventListener('click', e => { const b = e.target.closest('[data-so]'); if (!b) return; if (b.tagName === 'A') e.preventDefault(); act(b); });
  document.addEventListener('click', async e => { const b = e.target.closest('[data-sofr]'); if (!b || !db()) return; const { data, error } = await db().rpc('friend_request', { p_handle: b.dataset.sofr }); toast(error ? ERR(error) : data === 'accepted' ? L('Vous êtes amis !', 'You are friends!') : L('Demande envoyée.', 'Request sent.')); });
  const note = t => { const n = $('#sonote'); if (n) n.textContent = t; SO.note = t; };
  async function act(b) { const d = db(), m = me(); if (!d || !m) return; const [a, x, y] = b.dataset.so.split(':');
    if (a === 'zoom') { const dl = document.createElement('dialog'); dl.className = 'so-zoom'; dl.innerHTML = `<img src="${b.src}" alt="">`; dl.onclick = () => { dl.close(); dl.remove(); }; document.body.appendChild(dl); dl.showModal(); return; }
    if (a === 'k') { SO.kind = x; return feedInit(); } if (a === 'more') { await loadPosts(true); return drawPosts(); }
    if (a === 'post') { const t = ($('#sot').value || '').trim(); if (t.length < 3) return note(L('Titre trop court.', 'Title too short.')); if (SO.busy) return; SO.busy = true; note('…');
      const { error } = await d.rpc('post_create', { p_kind: $('#sok').value, p_game: $('#sog').value, p_title: t, p_body: ($('#sobd').value || '').trim(), p_image: SO.img || '' }); SO.busy = false; if (error) return note(ERR(error)); SO.img = null; toast(L('Publié !', 'Posted!')); return feedInit(); }
    if (a === 'like') { const { data, error } = await d.rpc('post_like', { p_post: x }); if (error) return; const l = SO.lk[x] || (SO.lk[x] = { n: 0, me: false }); l.me = !!data; l.n += data ? 1 : -1; const p = SO.posts.find(z => z.id === x), el = $('#p-' + x); if (p && el) el.outerHTML = postHtml(p); return; }
    if (a === 'del') { if (!confirm(L('Supprimer cette publication ?', 'Delete this post?'))) return; const { error } = await d.from('posts').delete().eq('id', x); if (!error) { SO.posts = SO.posts.filter(z => z.id !== x); drawPosts(); } return; }
    if (a === 'rep') { const r = prompt(L('Pourquoi signaler ce contenu ?', 'Why report this content?')); if (!r) return; const { error } = await d.from('content_reports').insert({ kind: x, target: y, reason: r.slice(0, 300) }); toast(error ? ERR(error) : L('Merci, signalement envoyé.', 'Thanks, report sent.')); return; }
    if (a === 'dmsg') { await d.from('messages').delete().eq('id', +x); SO.sig = ''; return fetchMsgs(); }
    if (a === 'cm') { const el = $('#cm-' + x); if (!el) return; if (!el.hidden && !y) { el.hidden = true; return; } el.hidden = false; el.innerHTML = '…'; const { data } = await d.from('post_comments').select('*').eq('post_id', x).order('created_at', { ascending: true }).limit(100); const cs = data || [];
      el.innerHTML = cs.map(c => `<div class="so-c2">${sAv(c.author_name, c.author_handle)}<div><b>${who(c.author_name, c.author_handle)}</b> <small class="sub">${ago(c.created_at)}</small><p>${rich(c.body)}</p></div>${c.author === m || isAdmin ? `<button class="btn" data-so="cdel:${c.id}:${x}">✕</button>` : ''}</div>`).join('') + `<div class="so-r"><input type="text" maxlength="400" data-socm="${x}" placeholder="${L('Votre commentaire…', 'Your comment…')}"><button class="btn pri" data-so="cmsend:${x}">${L('Envoyer', 'Send')}</button></div>`; return; }
    if (a === 'cmsend') { const i = document.querySelector(`[data-socm="${x}"]`), v = i && i.value.trim(); if (!v) return; const { error } = await d.rpc('comment_create', { p_post: x, p_body: v }); if (error) return toast(ERR(error)); SO.cc[x] = (SO.cc[x] || 0) + 1; const p = SO.posts.find(z => z.id === x); if (p) $('#p-' + x).outerHTML = postHtml(p); return act({ dataset: { so: 'cm:' + x + ':1' } }); }
    if (a === 'cdel') { await d.from('post_comments').delete().eq('id', x); SO.cc[y] = Math.max(0, (SO.cc[y] || 1) - 1); const p = SO.posts.find(z => z.id === y); if (p) $('#p-' + y).outerHTML = postHtml(p); return act({ dataset: { so: 'cm:' + y + ':1' } }); }
    if (a === 'fadd') { const h = ($('#sofh').value || '').trim().toLowerCase(); if (!h) return; const { data, error } = await d.rpc('friend_request', { p_handle: h }); if (error) return note(ERR(error)); await loadFr(); SO.note = data === 'accepted' ? L('Vous êtes maintenant amis !', 'You are now friends!') : data === 'pending' ? L('Demande envoyée.', 'Request sent.') : L('Déjà amis ou demande en cours.', 'Already friends or request pending.'); return friendsView(); }
    if (a === 'fok' || a === 'fno') { await d.rpc('friend_respond', { p_id: x, p_accept: a === 'fok' }); SO.note = ''; await loadFr(); return friendsView(); }
    if (a === 'dm') { const f = convFriends().find(z => z.id === x); SO.conv = f || null; if (location.hash === '#/social/chat') return chatInit(); location.hash = '#/social/chat'; return; }
    if (a === 'conv') { SO.conv = x ? convFriends().find(z => z.id === x) || null : null; return chatInit(); }
    if (a === 'send') { const i = $('#somi'), v = i && i.value.trim(); if (!v) return; const { error } = await d.rpc('send_message', { p_to: SO.conv ? SO.conv.id : null, p_body: v }); if (error) return note(ERR(error)); i.value = ''; SO.sig = ''; SO.first = true; return fetchMsgs(); } }
  // ---------- joueurs en ligne (Realtime Presence : aucune table, aucun SQL)
  let ch = null, chKey = null;
  const onl = n => { let e = $('#onl'); if (!e) { const a = $('#acct'); if (!a || !a.parentNode) return; e = document.createElement('span'); e.id = 'onl'; e.className = 'onl'; a.parentNode.insertBefore(e, a); } e.innerHTML = `<i></i><b>${n}</b> <span>${L('en ligne', 'online')}</span>`; e.title = L('Personnes actuellement sur le site', 'People currently on the site'); };
  const rnd = (crypto.randomUUID ? crypto.randomUUID() : String(Math.random())).slice(0, 12);
  const tryOnline = () => { const d = window.__ASTRO_MOCK_RT || sb; if (!d || !d.channel || !authOk) return; const key = (user && user.id) || rnd; if (ch && chKey === key) return;
    try { if (ch) { try { d.removeChannel(ch); } catch { } ch = null; } chKey = key; const c = ch = d.channel('astro-online', { config: { presence: { key } } }); c.on('presence', { event: 'sync' }, () => onl(Object.keys(c.presenceState()).length)); c.subscribe(async s => { if (s === 'SUBSCRIBED') await c.track({ t: Date.now() }); }); } catch { ch = null; } };
  setInterval(tryOnline, 2000);
}
// ------------------------------------------------------------ Bleach : Mirrors High (page dédiée côté Astrolabe, direction artistique « manga noir & blanc »)
const BMH = (() => {
  const TABS = () => [['', L('L’animé par arcs', 'Anime by arc')], ['apercu', L('Aperçu', 'Overview')], ['tier', L('Tier list prévisionnelle', 'Forecast tier list')], ['persos', L('Personnages', 'Characters')], ['systeme', L('Système de jeu', 'Game systems')], ['events', L('Événements et aides', 'Events and aid')], ['plan', L('Calculateur d’invocations', 'Summon planner')]];
  const mkRoles = () => ({ combo: ['Combo', L('Enchaîne les cartes pour de gros dégâts directs', 'Chains cards for big direct damage'), '#ff6a3d'], crush: ['Crush', L('Brise la garde et les défenses ennemies', 'Breaks enemy guard and defenses'), '#ffb43d'], chain: ['Chain', L('Prolonge les chaînes et déclenche les Link Attacks', 'Extends chains and triggers Link Attacks'), '#2fb8ff'], shadow: ['Shadow', L('Esquive, vitesse et attaques en embuscade', 'Evasion, speed and ambush strikes'), '#8a6aff'], tank: ['Tank', L('Encaisse et protège l’équipe', 'Soaks damage and protects the team'), '#2fcf80'] });
  let ROLES = mkRoles();
  const OFF = new Set(['Ichigo Kurosaki', 'Byakuya Kuchiki', 'Grimmjow Jaegerjaquez', 'Toshiro Hitsugaya', 'Yoruichi Shihoin', 'Bambietta Basterbine', 'Renji Abarai', 'Uryu Ishida', 'Orihime Inoue', 'Yasutora Sado (Chad)', 'Rangiku Matsumoto', 'Mayuri Kurotsuchi', 'Rukia Kuchiki', 'Shirin Migishima', 'Shirane Sanari', 'Naru Jurinna', 'Giro Hando', 'Maiko Tokishima']);
  const ORI = new Set(['Shirin Migishima', 'Shirane Sanari', 'Naru Jurinna', 'Giro Hando', 'Maiko Tokishima', 'Kuon Hoshimura', 'Kanuka Sanakura', 'Ibuki Kajimaru', 'Hachirota Rohbe', 'Daikaku Sohaji', 'Tasuku Nimura', 'Tamesu Gocho', 'Soyogi Sukenaga', 'Seishiro Ginza', 'Mizuki Gandera']);
  const st = n => OFF.has(n) ? ['ok', L('Roster de lancement', 'Launch roster')] : ORI.has(n) ? ['an', L('Annoncé (diffusion de lancement)', 'Announced (launch broadcast)')] : ['rm', L('À confirmer (bande-annonce / rumeur)', 'To confirm (trailer / rumor)')];
  let cards = null, bmData = null, tab = '';
  const gh = () => `<div class="bm-nav">${TABS().map(t => `<a class="${tab === t[0] ? 'on' : ''}" href="#/bleach${t[0] ? '/' + t[0] : ''}">${t[1]}</a>`).join('')}</div>`;
  const por = c => c.img ? `<img src="${c.img}" alt="" loading="lazy">` : `<span class="bm-ini">${esc(c.n.split(/[ (]/)[0].slice(0, 2))}</span>`;
  const chip = c => `<a class="bm-chip" href="#/cartes" title="${esc(c.n)}"><i class="bm-pt">${por(c)}</i><b>${esc(c.n.replace(/ \(Chad\)/, ''))}</b><small style="color:${ROLES[c.e] ? ROLES[c.e][2] : '#999'}">${ROLES[c.e] ? ROLES[c.e][0] : ''} · ${c.st}★</small></a>`;
  // ---- illustrations originales (SVG dessinés dans le code)
  const defs = `<defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b0f2e"/><stop offset="1" stop-color="#05050a"/></linearGradient><linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffb066"/><stop offset=".55" stop-color="#ff5a2a"/><stop offset="1" stop-color="#2a0a10"/></linearGradient><linearGradient id="g3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a1a3a"/><stop offset="1" stop-color="#1c0a24"/></linearGradient><radialGradient id="gl" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".4" stop-color="#ffd9a8" stop-opacity=".35"/><stop offset="1" stop-color="#ff7a1a" stop-opacity="0"/></radialGradient></defs>`;
  const ART = {
    sub: `<rect width="800" height="320" fill="url(#g1)"/><circle cx="560" cy="120" r="230" fill="url(#gl)"/><circle cx="560" cy="120" r="86" fill="#fff"/><path d="M80 330 640 20l14 16L120 336z" fill="#f4f4f6"/><path d="M80 330 640 20l5 6L96 336z" fill="#ff7a1a"/><path d="M70 322l50 14-8 12-52-14z" fill="#0b0b0f"/><path d="M0 270l60-36 54 24 70-46 72 40 90-34 100 36 90-28 80 30 84-26V320H0z" fill="#07070b"/><g fill="#ffd9a8" opacity=".8"><rect x="120" y="262" width="5" height="7"/><rect x="300" y="250" width="5" height="7"/><rect x="520" y="262" width="5" height="7"/><rect x="690" y="256" width="5" height="7"/></g>`,
    ss: `<rect width="800" height="320" fill="url(#g2)"/><circle cx="600" cy="90" r="120" fill="url(#gl)"/><circle cx="600" cy="90" r="46" fill="#fff4dc"/><path d="M0 250l80-30 40 20 90-50 70 40 80-60 100 70 90-40 110 50 140-30v100H0z" fill="#3a0e18" opacity=".8"/><path d="M180 320V150h40v170zM580 320V150h40v170z" fill="#0b0b0f"/><path d="M120 156c80-40 130-50 280-92 150 42 200 52 280 92l-24 24H144z" fill="#0b0b0f"/><path d="M250 320v-100h300v100z" fill="#ff7a1a"/><path d="M400 220v100M250 262h300" stroke="#0b0b0f" stroke-width="8"/><path d="M0 306h800v14H0z" fill="#0b0b0f"/>`,
    hm: `<rect width="800" height="320" fill="#05060c"/><circle cx="560" cy="110" r="190" fill="url(#gl)" opacity=".6"/><path d="M560 40a76 76 0 1 0 64 118 62 62 0 1 1-64-118z" fill="#fff"/><g fill="#fff" opacity=".7"><circle cx="90" cy="50" r="1.6"/><circle cx="230" cy="90" r="1.4"/><circle cx="360" cy="40" r="1.8"/><circle cx="700" cy="60" r="1.4"/><circle cx="150" cy="150" r="1.2"/></g><path d="M0 230c110-50 200-50 310 0s220 50 300-20 140-20 190 0v110H0z" fill="#e9e2d2"/><path d="M0 270c140-34 230-20 360 14s300 14 440-20v56H0z" fill="#ff7a1a"/><path d="M0 296c180-26 300-6 440 8s250 0 360-14v30H0z" fill="#0b0b0f"/><path d="M90 250c0-70 76-70 76 0M200 250c0-52 54-52 54 0" stroke="#0b0b0f" stroke-width="9" fill="none"/>`,
    fk: `<rect width="800" height="320" fill="url(#g3)"/><circle cx="400" cy="140" r="180" fill="url(#gl)" opacity=".55"/><path d="M0 230h40v-60h40v60h30v-110h44v110h36v-80h34v80h44v-140h46v140h34v-90h40v90h40v-120h46v120h44v-70h36v70h50v-100h40v100h36v-60h52v60h28V320H0z" fill="#07070b"/><path d="M410 0l-36 80 56 34-50 90 64 36-30 80" stroke="#ff7a1a" stroke-width="14" fill="none"/><path d="M410 0l-36 80 56 34-50 90 64 36-30 80" stroke="#fff" stroke-width="3" fill="none"/><g fill="#ffd9a8" opacity=".7"><rect x="130" y="190" width="6" height="8"/><rect x="330" y="170" width="6" height="8"/><rect x="560" y="200" width="6" height="8"/></g>`,
    lost: `<rect width="800" height="320" fill="#05050a"/><circle cx="400" cy="160" r="260" fill="url(#gl)" opacity=".35"/><g fill="none" stroke="#fff"><circle cx="400" cy="160" r="58" stroke-width="10"/><circle cx="400" cy="160" r="108" stroke-width="4" stroke-dasharray="40 22"/><circle cx="400" cy="160" r="156" stroke-width="3" stroke-dasharray="10 18"/><circle cx="400" cy="160" r="210" stroke-width="2" stroke-dasharray="4 14" opacity=".6"/></g><path d="M400 0v320M120 160h560" stroke="#ff7a1a" stroke-width="4" opacity=".8"/><path d="M300 40l200 240M500 40L300 280" stroke="#fff" stroke-width="2" opacity=".3"/><circle cx="400" cy="160" r="22" fill="#ff7a1a"/>`,
    tybw: `<rect width="800" height="320" fill="#000"/><g stroke="#fff" opacity=".85">${Array.from({ length: 44 }, (_, i) => { const a = i / 44 * Math.PI * 2, w = i % 3 ? 1.2 : 2.6; return `<path stroke-width="${w}" d="M400 160L${(400 + Math.cos(a) * 600).toFixed(1)} ${(160 + Math.sin(a) * 600).toFixed(1)}"/>`; }).join('')}</g><circle cx="400" cy="160" r="96" fill="#000"/><circle cx="400" cy="160" r="96" fill="none" stroke="#ff7a1a" stroke-width="10"/><circle cx="400" cy="160" r="62" fill="#fff"/><path d="M400 98v124M338 160h124" stroke="#000" stroke-width="9"/><path d="M0 300l80-30 60 20 80-40 70 30 90-30 80 34 90-30 100 36 150-28v68H0z" fill="#000"/>`
  };
  const art = k => `<svg viewBox="0 0 800 320" class="bm-art" role="img" aria-hidden="true" preserveAspectRatio="xMidYMid slice">${defs}${ART[k]}</svg><img class="bm-ph" src="img/bleach/${k}.webp" alt="" loading="lazy" onerror="this.remove()">`;
  const mkArcx = () => ARCXF();
  const mkArcs = () => [
    ['sub', 'Agent of the Shinigami', L('Arc du Shinigami remplaçant', 'Substitute Shinigami arc'), '2004-2005 · ép. 1-20', L('Ichigo Kurosaki, lycéen qui voit les fantômes, reçoit les pouvoirs de la Shinigami Rukia Kuchiki pour sauver sa famille d’un Hollow. Rukia étant affaiblie, il devient Shinigami remplaçant et protège Karakura contre les Hollows, âmes corrompues. On y rencontre Orihime, Chad et Uryu, et on découvre le monde des âmes.', 'Ichigo Kurosaki, a teen who sees ghosts, receives the powers of Shinigami Rukia Kuchiki to save his family from a Hollow. With Rukia weakened, he becomes the Substitute Soul Reaper and defends Karakura against Hollows, corrupted souls. We meet Orihime, Chad and Uryu and discover the world of souls.'), L('Dans Mirror High : le décor de départ, Karakura Town, et le duo d’ouverture Ichigo / Rukia offert en précommande.', 'In Mirrors High: the starting setting, Karakura Town, and the opening duo Ichigo / Rukia given as pre-registration rewards.')],
    ['ss', 'Soul Society', L('Arc de la Soul Society', 'Soul Society arc'), '2005-2006 · ép. 21-63', L('Rukia est arrêtée pour avoir transféré ses pouvoirs à un humain et condamnée à mort. Ichigo et ses amis envahissent la Soul Society, affrontent les capitaines du Gotei 13 (Byakuya, Kenpachi, Toshiro…) et découvrent la trahison de Sosuke Aizen, qui manipulait tout pour s’emparer du Hōgyoku.', 'Rukia is arrested for passing her powers to a human and sentenced to death. Ichigo and friends invade the Soul Society, face Gotei 13 captains (Byakuya, Kenpachi, Toshiro…) and uncover Sosuke Aizen’s betrayal: he orchestrated everything to seize the Hōgyoku.'), L('Dans Mirror High : Byakuya, Renji, Toshiro, Rangiku, Mayuri et Rukia font partie des personnages annoncés.', 'In Mirrors High: Byakuya, Renji, Toshiro, Rangiku, Mayuri and Rukia are among the announced characters.')],
    ['hm', 'Arrancar / Hueco Mundo', L('Arc Arrancar et Hueco Mundo', 'Arrancar & Hueco Mundo arc'), '2006-2009 · ép. 64-167', L('Aizen, Gin et Tosen font défection et créent une armée d’Arrancar, des Hollows à forme humaine, dirigée par les Espada. Orihime est enlevée et emmenée à Hueco Mundo, le désert des Hollows : Ichigo et ses amis partent la sauver. Combats marquants contre Grimmjow et Ulquiorra, et révélation du Hollow intérieur d’Ichigo.', 'Aizen, Gin and Tosen defect and build an army of Arrancar, humanoid Hollows led by the Espada. Orihime is taken to Hueco Mundo, the Hollow desert; Ichigo and friends go to rescue her. Key fights against Grimmjow and Ulquiorra, and the reveal of Ichigo’s inner Hollow.'), L('Dans Mirror High : Grimmjow Jaegerjaquez (ex-Espada n°6) est l’un des visages du lancement.', 'In Mirrors High: Grimmjow Jaegerjaquez (former Espada #6) is one of the launch faces.')],
    ['fk', 'Fake Karakura Town', L('Bataille de la fausse Karakura', 'Fake Karakura Town battle'), '2009-2010 · ép. 168-366', L('Aizen vise Karakura Town, dont la clé de la Soul Society est cachée. Les capitaines et lieutenants affrontent les Espada dans une réplique de la ville. Aizen, fusionné avec le Hōgyoku, devient presque invincible ; Ichigo apprend le Getsuga Tenshō final, au prix de ses pouvoirs de Shinigami.', 'Aizen targets Karakura Town. Captains and lieutenants fight the Espada in a replica of the city. Aizen, fused with the Hōgyoku, becomes nearly unbeatable; Ichigo masters the Final Getsuga Tenshō at the cost of his Soul Reaper powers.'), L('Dans Mirror High : Aizen apparaît en jouable dans une bande-annonce ; Yoruichi et Urahara sont aussi du casting.', 'In Mirrors High: Aizen shows up as playable in a trailer; Yoruichi and Urahara are also in the cast.')],
    ['lost', 'Lost Agent / Fullbring', L('Arc du Shinigami perdu', 'Lost Agent arc'), '2012 (manga) · ép. 317-342 de la série originale', L('Ichigo, sans pouvoirs, rencontre Xcution, un groupe d’humains dotés de Fullbring. Kugo Ginjo promet de lui rendre sa force mais cache un plan lié à Tsukishima. Ichigo retrouve finalement ses pouvoirs de Shinigami grâce à ses amis et à la Soul Society.', 'Powerless Ichigo meets Xcution, humans wielding Fullbring. Kugo Ginjo promises to restore his strength but hides a plan involving Tsukishima. Ichigo finally regains his Soul Reaper powers thanks to his friends and the Soul Society.'), L('Dans Mirror High : le thème « âme et reflet » du titre rappelle cet arc, mais aucune donnée officielle ne le relie au jeu.', 'In Mirrors High: the "soul and reflection" theme in the title echoes this arc, but nothing official links it to the game.')],
    ['tybw', 'Thousand-Year Blood War', L('Guerre de Sang des Mille Ans', 'Thousand-Year Blood War'), 'manga 2012-2016 · anime 2022-2024', L('Yhwach, roi des Quincy, déclare la guerre à la Soul Society avec la Wandenreich et ses Schrift. Le Gotei 13 subit de lourdes pertes, Ichigo découvre ses origines (Quincy, Shinigami et Hollow), la vérité sur Zangetsu, et la guerre se termine par la défaite de Yhwach, avec l’aide d’Aizen.', 'Yhwach, king of the Quincy, declares war on the Soul Society with the Wandenreich and its Schrift. The Gotei 13 suffers heavy losses, Ichigo learns his origins (Quincy, Shinigami and Hollow) and the truth about Zangetsu, and the war ends with Yhwach’s defeat, with Aizen’s help.'), L('Dans Mirror High : l’histoire originale se déroule APRÈS cette guerre ; Uryu et Bambietta (Schrift « E ») sont jouables.', 'In Mirrors High: the original story takes place AFTER this war; Uryu and Bambietta (Schrift "E") are playable.')]
  ];
  const ARCXF = () => ({ sub: [L('Grand Fisher', 'Grand Fisher'), ['Ichigo Kurosaki', 'Rukia Kuchiki', 'Orihime Inoue', 'Yasutora Sado (Chad)', 'Uryu Ishida'], [L('Ichigo ne voit pas que des fantômes : il devient Shinigami en quelques minutes.', 'Ichigo does not just see ghosts: he becomes a Soul Reaper in minutes.'), L('Les Hollows sont des âmes corrompues qui dévorent les vivants.', 'Hollows are corrupted souls that devour the living.'), L('Orihime, Chad et Uryu éveillent leurs propres pouvoirs.', 'Orihime, Chad and Uryu awaken their own powers.')]],
    ss: [L('Sosuke Aizen (caché)', 'Sosuke Aizen (hidden)'), ['Byakuya Kuchiki', 'Renji Abarai', 'Toshiro Hitsugaya', 'Rangiku Matsumoto', 'Mayuri Kurotsuchi', 'Yoruichi Shihoin', 'Kisuke Urahara'], [L('Le Gotei 13 : 13 escouades dirigées par des capitaines.', 'The Gotei 13: 13 squads led by captains.'), L('Ichigo bat Byakuya après un entraînement éclair.', 'Ichigo beats Byakuya after crash training.'), L('Aizen simule sa mort : tout n’était qu’un plan.', 'Aizen fakes his death: it was all a plan.')]],
    hm: [L('Les Espada', 'The Espada'), ['Grimmjow Jaegerjaquez', 'Orihime Inoue', 'Ichigo Kurosaki'], [L('Les Arrancar sont des Hollows ayant retiré leur masque.', 'Arrancar are Hollows who removed their masks.'), L('Hueco Mundo : un désert sans fin sous une lune éternelle.', 'Hueco Mundo: an endless desert under an eternal moon.'), L('Le Hollow intérieur d’Ichigo prend le dessus.', 'Ichigo’s inner Hollow takes over.')]],
    fk: [L('Sosuke Aizen', 'Sosuke Aizen'), ['Sosuke Aizen', 'Toshiro Hitsugaya', 'Rangiku Matsumoto', 'Yoruichi Shihoin', 'Kisuke Urahara', 'Byakuya Kuchiki'], [L('Une réplique de la ville sert de champ de bataille.', 'A replica of the town serves as the battlefield.'), L('Aizen fusionne avec le Hōgyoku et devient presque divin.', 'Aizen fuses with the Hōgyoku and becomes nearly divine.'), L('Le Getsuga Tenshō final coûte ses pouvoirs à Ichigo.', 'The Final Getsuga Tenshō costs Ichigo his powers.')]],
    lost: [L('Tsukishima', 'Tsukishima'), ['Yasutora Sado (Chad)', 'Orihime Inoue'], [L('Fullbring : transformer un objet cher en arme.', 'Fullbring: turning a cherished object into a weapon.'), L('Xcution, un groupe d’humains aux pouvoirs singuliers.', 'Xcution, a group of humans with unusual powers.'), L('Ichigo retrouve ses pouvoirs grâce à ses amis.', 'Ichigo recovers his powers thanks to his friends.')]],
    tybw: [L('Yhwach', 'Yhwach'), ['Uryu Ishida', 'Bambietta Basterbine', 'Ichigo Kurosaki', 'Byakuya Kuchiki', 'Renji Abarai', 'Sosuke Aizen'], [L('La Wandenreich et ses Schrift attaquent la Soul Society.', 'The Wandenreich and its Schrift attack the Soul Society.'), L('Ichigo découvre sa triple origine : Quincy, Shinigami, Hollow.', 'Ichigo learns his triple origin: Quincy, Shinigami, Hollow.'), L('L’histoire de Mirrors High commence après cette guerre.', 'Mirrors High’s story begins after this war.')]] });
  const sec = (t, h) => `<section class="bm-sec"><h2><span>${t}</span></h2>${h}</section>`;
  const days = () => Math.ceil((new Date('2026-10-28T00:00:00+01:00') - Date.now()) / 864e5);
  const hero = () => { const d = days(), st = d > 1 ? L(`Sortie dans ${d} jours`, `Out in ${d} days`) : d === 1 ? L('Sortie demain', 'Out tomorrow') : L('Disponible', 'Out now'); return `<header class="bm-hero"><div class="bm-mos" aria-hidden="true"><span style="--k:0">${art('tybw')}</span><span style="--k:1">${art('ss')}</span><span style="--k:2">${art('sub')}</span></div><div class="bm-hx"><div class="bm-pills"><i class="live">${st}</i><i>iOS · Android</i><i>${L('Gratuit', 'Free-to-play')}</i></div><small class="bm-kick">BLEACH</small><h1>Mirrors<br>High</h1><p>${L('Le nouveau jeu d’action à cartes de Bandai Namco : une histoire originale après la Guerre de Sang des Mille Ans, des personnages dessinés par Tite Kubo et le casting vocal d’origine.', 'Bandai Namco’s new card-action game: an original story after the Thousand-Year Blood War, characters designed by Tite Kubo and the original voice cast.')}</p><div class="bm-cta"><a href="#/bleach/tier">${L('Tier list prévisionnelle', 'Forecast tier list')}</a><a href="#/bleach/plan" class="alt">${L('Calculateur d’invocations', 'Summon planner')}</a></div></div></header>`; };
  const view = () => {
    if (tab === 'tier') return tierView();
    if (tab === 'persos') return persosView();
    if (tab === 'arcs') return arcsView();
    if (tab === 'systeme') return sysView();
    if (tab === 'events') return evView();
    if (tab === 'plan') return planView();
    if (tab === 'apercu') return overview();
    return arcsView();
  };
  const overview = () => {
    const f = [[L('Sortie', 'Release'), '28 oct. 2026'], [L('Plateformes', 'Platforms'), 'iOS · Android'], [L('Prix', 'Price'), L('Gratuit (achats intégrés)', 'Free (in-app purchases)')], [L('Équipe', 'Team'), L('3 personnages', '3 characters')], [L('Éditeur', 'Publisher'), 'Bandai Namco'], [L('Monnaie premium', 'Premium currency'), 'Mirror Gems']];
    return sec(L('En bref', 'At a glance'), `<div class="bm-facts">${f.map(x => `<div><small>${x[0]}</small><b>${x[1]}</b></div>`).join('')}</div>`) +
      sec(L('Ce qu’on sait vraiment', 'What we really know'), `<div class="bm-two"><div class="bm-box"><h3>${L('Histoire', 'Story')}</h3><p>${L('Une histoire originale qui suit la Guerre de Sang des Mille Ans. Vous incarnez une âme qui s’éveille à Karakura Town, devenue Shinigami remplaçant. Tite Kubo a dessiné les personnages originaux, le scénario et le logo ; l’animation d’ouverture est signée Pierrot ; le thème « CRITICAL » est de suisoh.', 'An original story that follows the Thousand-Year Blood War. You play a soul who awakens in Karakura Town and becomes a Substitute Soul Reaper. Tite Kubo designed the original characters, the scenario and the logo; the opening animation is by Pierrot; the theme "CRITICAL" is by suisoh.')}</p></div><div class="bm-box"><h3>${L('Combat', 'Combat')}</h3><p>${L('Combats en temps réel par équipes de trois. On joue des cartes d’action (Action Cards) pour enchaîner les attaques, déclencher des Chain Attacks puis des Link Attacks, placer des Mortal Blows et finir avec le « SOUL DRIVE », une attaque d’équipe.', 'Real-time battles in teams of three. You play Action Cards to chain attacks, trigger Chain Attacks then Link Attacks, land Mortal Blows and finish with "SOUL DRIVE", a team-up attack.')}</p></div><div class="bm-box"><h3>${L('Personnalisation', 'Customization')}</h3><p>${L('Créez votre avatar (cheveux, visage, corps, yeux…) et forgez votre Zanpakutō : lame, garde, poignée, décorations et effets.', 'Create your avatar (hair, face, body, eyes…) and forge your Zanpakutō: blade, guard, hilt, decorations and effects.')}</p></div><div class="bm-box"><h3>${L('Pré-inscriptions', 'Pre-registration')}</h3><p>${L('Palier de 1 million atteint : 9 000 Mirror Gems (≈ 30 invocations), Ichigo ★3, Rukia ★3 et 5 tickets ★3+ garantis, pour tous au lancement.', '1M milestone reached: 9,000 Mirror Gems (≈ 30 summons), 3★ Ichigo, 3★ Rukia and 5 guaranteed 3★+ tickets for everyone at launch.')}</p></div></div>`) +
      sec(L('Ce qu’on ne sait pas encore', 'What we do not know yet'), `<div class="bm-warn"><ul><li>${L('Les taux d’invocation et la pitié officiels ne sont pas publiés.', 'Official summon rates and pity are not published.')}</li><li>${L('Il n’existe aucune tier list officielle : la nôtre est une estimation (voir l’onglet dédié).', 'There is no official tier list: ours is an estimate (see the dedicated tab).')}</li><li>${L('Le calendrier d’événements n’est pas annoncé : nous séparons ce qui est confirmé de ce qui est probable.', 'The event schedule is not announced: we separate what is confirmed from what is probable.')}</li></ul></div>`) +
      sec(L('Aller plus loin', 'Go further'), `<div class="bm-go">${TABS().filter(t => t[0] && t[0] !== 'apercu').map(t => `<a href="#/bleach/${t[0]}"><b>${t[1]}</b></a>`).join('')}</div>`);
  };
  const tierView = () => {
    if (!cards) return sec('Tier list', `<p class="sub">${L('Chargement…', 'Loading…')}</p>`);
    const rows = [['S', 4, '#ff3d3d'], ['A', 3, '#ff8a1f'], ['B', 2, '#f2c230'], ['C', 1, '#8aa0b0']];
    return `<div class="bm-warn big"><b>${L('Estimation, pas un classement officiel.', 'An estimate, not an official ranking.')}</b> ${L('Le jeu sort demain : personne ne peut encore savoir qui est le meilleur. Notre classement vient (1) de la rareté probable des personnages (4★ en tête), (2) de leur rôle vu dans la bêta, (3) de leur poids dans l’histoire. Il sera revu dès que les premiers vrais tests existeront.', 'The game launches tomorrow: nobody can know who is best yet. Our ranking comes from (1) probable rarity (4★ first), (2) role seen in the beta, (3) story weight. It will be revised once real tests exist.')}</div>` +
      rows.map(([t, q, col]) => { const l = cards.filter(c => c.g === 'bmh' && (q === 1 ? c.q <= 1 : c.q === q)); return `<div class="bm-tier" style="--tc:${col}"><div class="bm-tl">${t}</div><div class="bm-tr">${l.map(chip).join('')}</div></div>`; }).join('') +
      `<p class="sub bm-note">${L('Astuce : le rôle Chain/Combo est plus polyvalent pour débuter. Vous obtiendrez Ichigo et Rukia gratuitement.', 'Tip: Chain/Combo roles are more versatile early on. You get Ichigo and Rukia for free.')}</p>`;
  };
  const persosView = () => {
    if (!cards) return sec(L('Personnages', 'Characters'), `<p class="sub">${L('Chargement…', 'Loading…')}</p>`);
    const l = cards.filter(c => c.g === 'bmh');
    return sec(L('Roles', 'Roles'), `<div class="bm-roles">${Object.entries(ROLES).map(([k, v]) => `<div style="--rc:${v[2]}"><b>${v[0]}</b><small>${v[1]}</small></div>`).join('')}</div>`) +
      sec(`${L('Tous les personnages', 'All characters')} (${l.length})`, `<div class="bm-grid">${l.map(c => { const s = st(c.n); return `<div class="bm-pc"><i class="bm-pt big">${por(c)}</i><b>${esc(c.n)}</b><small style="color:${ROLES[c.e] ? ROLES[c.e][2] : '#999'}">${ROLES[c.e] ? ROLES[c.e][0] : ''} · ${c.st}★ · ${c.tl}</small><em class="${s[0]}">${s[1]}</em></div>`; }).join('')}</div><p class="sub bm-note">${L('Les rôles viennent de la bêta fermée et peuvent changer. Les images apparaissent après la mise à jour automatique des cartes.', 'Roles come from the closed beta and may change. Images appear after the automatic card update.')}</p>`);
  };
  const arcsView = () => { const A = mkArcs(), X = mkArcx(); return `<div class="bm-lead"><h2>${L('L’animé par arcs', 'The anime, arc by arc')}</h2><p>${L('Six grands arcs pour comprendre d’où vient Mirrors High. Chaque arc indique les personnages jouables liés à cette époque.', 'Six major arcs to understand where Mirrors High comes from. Each arc lists the playable characters tied to that era.')}</p><div class="bm-warn">${L('⚠ Spoilers sur toute la série.', '⚠ Spoilers for the whole series.')}</div></div><nav class="bm-tl" aria-label="Arcs">${A.map((a, i) => `<button data-bmgo="${i}"><b>${String(i + 1).padStart(2, '0')}</b><span>${a[2]}</span></button>`).join('')}</nav><div class="bm-arcs">${A.map((a, i) => { const x = X[a[0]]; return `<article class="bm-arc" id="arc${i}" style="--i:${i}"><div class="bm-av">${art(a[0])}<div class="bm-sh"></div><span class="bm-num">${String(i + 1).padStart(2, '0')}</span><div class="bm-ti"><small>${a[3]}</small><h3>${a[2]}</h3><em>${a[1]}</em></div></div><div class="bm-ab"><div class="bm-tx"><p>${a[4]}</p><p class="bm-mh"><b>MIRRORS HIGH</b>${a[5]}</p></div><div class="bm-sd"><div class="bm-vi"><small>${L('Adversaire principal', 'Main antagonist')}</small><b>${x[0]}</b></div><ul>${x[2].map(t => `<li>${t}</li>`).join('')}</ul>${cards ? `<div class="bm-pl"><small>${L('Jouables dans le jeu', 'Playable in game')}</small><div>${x[1].map(n => { const c = cards.find(k => k.g === 'bmh' && k.n === n); return c ? `<a href="#/bleach/persos" class="bm-mini" title="${esc(c.n)}"><i>${por(c)}</i>${esc(c.n.split(' ')[0].replace(/[()]/g, ''))}</a>` : ''; }).join('')}</div></div>` : ''}</div></div></article>`; }).join('')}</div><p class="sub bm-note">${L('Les images viennent des wikis Bleach quand elles sont disponibles (mise à jour automatique), sinon ce sont des illustrations dessinées pour ce site.', 'Images come from the Bleach wikis when available (automatic update); otherwise they are illustrations drawn for this site.')}</p>`; };
  const sysView = () => sec(L('Le combat de A à Z', 'Combat from A to Z'), `<div class="bm-steps">${[[L('Équipe de 3', 'Team of 3'), L('Vous gérez trois personnages ; leur placement et le moment des attaques comptent.', 'You manage three characters; positioning and attack timing matter.')], [L('Cartes d’action', 'Action Cards'), L('Choisissez et combinez des cartes pour lancer attaques normales et compétences.', 'Pick and combine cards to launch normal attacks and skills.')], [L('Chain → Link', 'Chain → Link'), L('Coordonner les persos fait monter le compteur de coups, brise les défenses et déclenche les Link Attacks.', 'Coordinating characters raises the hit counter, breaks defenses and triggers Link Attacks.')], [L('Mortal Blow', 'Mortal Blow'), L('Coup fatal à placer au bon moment (nom officiel vu dans la bêta).', 'Finishing blow to land at the right time (official name seen in the beta).')], [L('SOUL DRIVE', 'SOUL DRIVE'), L('Énergie d’équipe accumulée qui libère une attaque ultime collective.', 'Built-up team energy that unleashes a collective ultimate.')]].map((s, i) => `<div><span>${i + 1}</span><h4>${s[0]}</h4><p>${s[1]}</p></div>`).join('')}</div>`) +
    sec(L('Rôles et couleurs vus dans la bêta', 'Roles and colors seen in the beta'), `<div class="bm-roles">${Object.entries(ROLES).map(([k, v]) => `<div style="--rc:${v[2]}"><b>${v[0]}</b><small>${v[1]}</small></div>`).join('')}</div><p class="bm-note sub">${L('Couleurs testées : rouge, vert, orange, violet, jaune, bleu, cyan. Styles de combat : Zanjutsu, Hakuda, Kidō. Le rôle d’un personnage peut être revu entre la bêta et le lancement.', 'Tested colors: red, green, orange, violet, yellow, blue, cyan. Combat styles: Zanjutsu, Hakuda, Kidō. A character’s role may change between beta and launch.')}</p>`) +
    sec(L('Argent du jeu', 'Currency'), `<div class="bm-box"><p>${L('Les Mirror Gems servent aux « Soul Summons ». D’après les récompenses annoncées : 9 000 gemmes = 30 invocations, donc 300 gemmes par invocation. Raretés connues : ★3 et ★4.', 'Mirror Gems are used for "Soul Summons". From announced rewards: 9,000 gems = 30 summons, so 300 gems per summon. Known rarities: 3★ and 4★.')}</p></div>`);
  const evView = () => {
    const ev = (bmData && bmData.events) || [];
    const tag = s => s === 'confirmed' ? [L('Confirmé', 'Confirmed'), 'ok'] : [L('Probable · non confirmé', 'Likely · unconfirmed'), 'rm'];
    return `<div class="bm-warn big">${L('Seul ce qui est étiqueté « Confirmé » vient d’une annonce officielle. Le reste est notre hypothèse, d’après les habitudes des jeux mobiles de ce type. Le fichier ', 'Only items tagged "Confirmed" come from an official announcement. The rest is our guess, based on habits of similar mobile games. The file ')}<code>data/bmh.json</code>${L(' se modifie facilement.', ' is easy to edit.')}</div><div class="bm-ev">${ev.map(e => { const t = tag(e.s); return `<article class="${t[1]}"><span class="bm-d">${esc(e.d)}</span><div><b>${esc(LANG === 'en' ? e.en : e.fr)}</b><p>${esc(LANG === 'en' ? e.den : e.dfr)}</p></div><em>${t[0]}</em></article>`; }).join('') || `<p class="sub">${L('Chargement…', 'Loading…')}</p>`}</div>`;
  };
  const planView = () => `<div class="bm-box"><h3>${L('Combien d’invocations ?', 'How many summons?')}</h3><p>${L('300 gemmes = 1 invocation (calculé d’après les récompenses annoncées : 9 000 gemmes = 30). Les taux officiels n’étant pas publiés, aucune probabilité n’est affichée.', '300 gems = 1 summon (computed from announced rewards: 9,000 gems = 30). Official rates not published, so no probabilities shown.')}</p><div class="bm-calc"><label>${L('Mes gemmes', 'My gems')}<input id="bmg" type="number" min="0" value="9000" inputmode="numeric"></label><label>${L('Tickets ★3+', '3★+ tickets')}<input id="bmt" type="number" min="0" value="5" inputmode="numeric"></label><div class="bm-res" id="bmres"></div></div></div>`;
  const planFill = () => { const g = $('#bmg'), t = $('#bmt'), r = $('#bmres'); if (!g || !r) return; const up = () => { const n = Math.floor((+g.value || 0) / 300), tk = +t.value || 0; r.innerHTML = `<b>${n + tk}</b><small>${L('invocations au total', 'summons in total')}</small><span>${n} ${L('avec gemmes', 'with gems')} + ${tk} ${L('avec tickets', 'with tickets')}</span>`; }; g.oninput = t.oninput = up; up(); };
  function page(t) {
    document.body.classList.add('bmhsite'); ROLES = mkRoles(); tab = TABS().some(x => x[0] === (t || '')) ? (t || '') : ''; document.title = 'Bleach : Mirrors High — Astrolabe';
    const fetchP = () => { if (!cards && HC && HC.data) HC.data().then(d => { cards = d; if (tab === 'tier' || tab === 'persos' || tab === '') redraw(); }).catch(() => { }); if (!bmData) fetch('data/bmh.json').then(r => r.json()).then(d => { bmData = d; if (tab === 'events') redraw(); }).catch(() => { }); };
    const redraw = () => { const b = $('#bmbody'); if (b && /^#\/bleach/.test(location.hash)) { b.innerHTML = view(); planFill(); } };
    return [`<div class="bm">${hero()}${gh()}<div id="bmbody">${view()}</div><p class="sub bm-fine">${L('Site de fans non officiel. BLEACH © Tite Kubo / Shueisha, TV TOKYO, dentsu, Pierrot. Bleach: Mirrors High © Bandai Namco Entertainment. Aucun lien avec les ayants droit.', 'Unofficial fan site. BLEACH © Tite Kubo / Shueisha, TV TOKYO, dentsu, Pierrot. Bleach: Mirrors High © Bandai Namco Entertainment. Not affiliated with the rights holders.')}</p></div>`, null, () => { fetchP(); planFill(); }];
  }
  document.addEventListener('click', e => { const b = e.target.closest && e.target.closest('[data-bmgo]'); if (b) { const t = document.getElementById('arc' + b.dataset.bmgo); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' }); } });
  window.addEventListener('hashchange', () => { if (!/^#\/bleach/.test(location.hash)) document.body.classList.remove('bmhsite'); });
  return { page, art, days };
})();
pages.bleach = BMH.page;

// ------------------------------------------------------------ Nouvelle page d'accueil : trois portes (Astrolabe · Foilvault · Bleach)
pages.home = () => {
  const d = BMH.days(), st = d > 1 ? L(`Sortie dans ${d} jours`, `Out in ${d} days`) : d === 1 ? L('Sortie demain', 'Out tomorrow') : L('Disponible', 'Out now');
  const t = HC.today(), ver = (D && D.version) || '', nC = (typeof C !== 'undefined' && C.length) || '';
  const mark = `<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 2l15 9v18l-15 9-15-9V11z" fill="none" stroke="#7fe9ff" stroke-width="2.4"/><circle cx="20" cy="20" r="6.5" fill="none" stroke="#ff7ad9" stroke-width="2.4"/><path d="M20 8v5.5M20 26.5V32M8 20h5.5M26.5 20H32" stroke="#ffd36b" stroke-width="2"/></svg>`;
  const html = `<section class="hub"><header class="hub-h"><span class="lab">${L('Bienvenue', 'Welcome')}</span><h1>${L('Trois univers, un seul endroit.', 'Three universes, one place.')}</h1><p>${L('Un guide Honkai: Star Rail mis à jour chaque lundi, un jeu de cartes gacha à collectionner, et le centre d’information du nouveau Bleach : Mirrors High.', 'A Honkai: Star Rail guide updated every Monday, a collectible gacha card game, and the info hub for the new Bleach: Mirrors High.')}</p></header>
  <div class="hub-doors">
   <a class="hub-door d-ast" href="#/astrolabe"><div class="hub-bg"><i></i><i></i><i></i></div><span class="hub-tag">${L('Le guide', 'The guide')}</span><h2>Astrolabe</h2><p class="hub-sub">Honkai: Star Rail</p><ul><li>${L('Tier lists, builds, équipes', 'Tier lists, builds, teams')}</li><li>${L('Bannières et compte à rebours', 'Banners and countdown')}</li><li>${L('Calculateurs et guides end game', 'Calculators and end game guides')}</li></ul><div class="hub-st"><b>${esc(String(nC))}</b><small>${L('personnages', 'characters')}</small><b>${esc(ver)}</b><small>${L('version', 'version')}</small></div><span class="hub-go">${L('Ouvrir le guide', 'Open the guide')} →</span></a>
   <a class="hub-door d-fv" href="#/cartes"><div class="hub-bg"><i></i><i></i></div><span class="hub-tag">${L('Le jeu de cartes', 'The card game')}</span><h2>${mark}Foilvault</h2><p class="hub-sub">${L('Collectionnez les personnages gacha', 'Collect gacha characters')}</p><ul><li>${L('Boosters gratuits toutes les 10 minutes', 'Free boosters every 10 minutes')}</li><li>${L('Holo, Shiny, Doré, Éclipse', 'Holo, Shiny, Gold, Eclipse')}</li><li>${L('Échanges, combats et classement', 'Trades, battles and ranking')}</li></ul><div class="hub-st"><b id="hubn">…</b><small>${L('cartes', 'cards')}</small><b>${t.st}</b><small>${L('boosters prêts', 'boosters ready')}</small></div><span class="hub-go">${L('Ouvrir des boosters', 'Open boosters')} →</span></a>
   <a class="hub-door d-bl" href="#/bleach"><div class="hub-bg">${BMH.art('ss')}</div><span class="hub-tag live">${st}</span><h2>Bleach<small>Mirrors High</small></h2><p class="hub-sub">${L('Le nouveau jeu de Bandai Namco', 'Bandai Namco’s new game')}</p><ul><li>${L('Résumé de l’animé par arcs', 'Anime summary by arc')}</li><li>${L('Tier list prévisionnelle', 'Forecast tier list')}</li><li>${L('Système, événements, invocations', 'Systems, events, summons')}</li></ul><div class="hub-st"><b>30</b><small>${L('personnages', 'characters')}</small><b>3★ 4★</b><small>${L('raretés', 'rarities')}</small></div><span class="hub-go">${L('Découvrir', 'Discover')} →</span></a>
  </div>
  <div class="hub-q"><span>${L('Accès rapide', 'Quick links')}</span><a href="#/tier">Tier list HSR</a><a href="#/banners">${L('Bannières', 'Banners')}</a><a href="#/calendar">${L('Compte à rebours', 'Countdown')}</a><a href="#/cartes/shop">${L('Boutique', 'Shop')}</a><a href="#/cartes/market">${L('Marché', 'Market')}</a><a href="#/bleach/tier">${L('Tier list Bleach', 'Bleach tier list')}</a></div>
  <div class="hc-today"><a href="#/cartes" class="${t.st ? 'go' : ''}"><b>🎴 ${t.st}</b><span>${L('boosters prêts', 'boosters ready')}</span></a><a href="#/cartes" class="${t.claim ? 'go' : ''}"><b>${t.claim ? '🎁' : '✓'} ${t.claim ? L('À récupérer', 'To claim') : L('Récupérée', 'Claimed')}</b><span>${L('récompense du jour', 'daily reward')} · ${L('série', 'streak')} ${t.streak}</span></a><a href="#/cartes" class="${t.qd > t.qc ? 'go' : ''}"><b>🎯 ${t.qd}/${t.qt}</b><span>${L('défis du jour', 'daily challenges')}</span></a></div>
  ${HC.community()}${HC.inst()}<div id="hcsup"></div></section>`;
  return [html, null, () => { HC.data().then(cd => { const e = document.getElementById('hubn'); if (e) e.textContent = cd.length; HC.communityFill(); HC.supFill(); }).catch(() => { }); }];
};

// ------------------------------------------------------------ cadre du site : menu, en-tête, fenêtres
function dialogs() {
  return `<dialog id="dlg"><h2 class="dt">${L('Compte', 'Account')}</h2><p class="sub" style="margin:0 0 12px;font-size:13px">${L('Pour retrouver vos favoris et votre collection sur tous vos appareils.', 'To keep your favourites and collection on all your devices.')}</p>
  <div class="cred"><input type="text" id="em" placeholder="E-mail" autocomplete="email"><input type="password" id="pw" placeholder="${L('Mot de passe (8 caractères min.)', 'Password (8 characters min.)')}" autocomplete="current-password"></div>
  <div id="mfab" hidden><p class="sub">${L('Double authentification : entrez le code à 6 chiffres de votre application.', 'Two-factor authentication: enter the 6-digit code from your app.')}</p><input type="text" id="mfc" inputmode="numeric" maxlength="6" placeholder="123456" autocomplete="one-time-code"><div class="dact"><button class="btn pri" id="mfv">${L('Valider', 'Verify')}</button></div></div>
  <p class="sub cred" style="font-size:12px;margin:8px 0 0">${L('En créant un compte, vous acceptez le traitement décrit dans les ', 'By creating an account you accept the processing described in the ')}<a href="#/legal" data-close="dlg">${L('mentions légales', 'legal notice')}</a>.</p><div class="msg" id="msg"></div><div class="dact cred"><button class="btn pri" id="bin">${L('Se connecter', 'Log in')}</button><button class="btn" id="bup">${L('Créer un compte', 'Create account')}</button><button class="btn" id="bfg">${L('Mot de passe oublié', 'Forgot password')}</button></div>
  <div class="cred oauth"><span>${L('ou', 'or')}</span><button class="btn dsc" id="bdc"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 5h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-6l-4 3v-3H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"/><circle cx="9" cy="11.5" r="1" fill="currentColor"/><circle cx="15" cy="11.5" r="1" fill="currentColor"/></svg> ${L('Continuer avec Discord', 'Continue with Discord')}</button></div>
  <div class="dact"><button class="btn" data-close="dlg">${L('Fermer', 'Close')}</button></div>
  </dialog>
  <dialog id="sdlg" class="wide"><div class="sbar">${ico('search')}<input type="search" id="sq" placeholder="${L('Rechercher un personnage, un cône, un set, une page…', 'Search a character, cone, set or page…')}" autocomplete="off"><kbd>Esc</kbd></div><div id="sr" class="sres"></div><div class="dact"><span class="sub" style="font-size:12px"><kbd>↑</kbd> <kbd>↓</kbd> ${L('naviguer', 'navigate')} · <kbd>Entrée</kbd> ${L('ouvrir', 'open')}</span><button class="btn" data-close="sdlg">${L('Fermer', 'Close')}</button></div></dialog>
  <dialog id="fdlg"><h2 class="dt">${L('Signaler un problème', 'Report a problem')}</h2><input type="hidden" id="fk" value="other">
  <textarea id="ft" rows="3" maxlength="1000" placeholder="${L('Un bug, une erreur, une idée ? Dites-le en quelques mots.', 'A bug, a mistake, an idea? Tell us in a few words.')}"></textarea><div class="msg" id="fm"></div><div class="dact"><button class="btn pri" id="fsend">${L('Envoyer', 'Send')}</button><button class="btn" data-close="fdlg">${L('Fermer', 'Close')}</button></div></dialog>
  <dialog id="pdlg" class="wide"><input type="search" id="pq" placeholder="${L('Choisir un personnage…', 'Pick a character…')}" autocomplete="off"><div id="pg" class="grid pgrid"></div><div class="dact"><button class="btn" data-close="pdlg">${L('Fermer', 'Close')}</button></div></dialog>`;
}
function chrome() {
  const NAV = [['', [['#/home', 'home', L('Accueil', 'Home')], ['#/astrolabe', 'star', 'Astrolabe'], ['#/cartes', 'spark', 'Foilvault'], ['#/bleach', 'swords', 'Bleach : Mirrors High']]], [L('Base de données', 'Database'), [['#/perso', 'users', L('Personnages', 'Characters')], ['#/lc', 'cone', L('Cônes de lumière', 'Light Cones')], ['#/rel', 'gem', L('Reliques', 'Relics')]]], [L('Classements', 'Rankings'), [['#/tier', 'crown', 'Tier list'], ['#/teamtier', 'swords', L('Tier list équipes', 'Team tier list')], ['#/gear/lc', 'gem', L('Tier list équipement', 'Gear tier list')], ['#/calendar', 'clock', L('Compte à rebours', 'Countdown')], ['#/banners', 'spark', L('Bannières', 'Banners')]]],
    [L('End game', 'End game'), [['#/end/moc', 'orbit', 'Memory of Chaos'], ['#/end/pf', 'orbit', 'Pure Fiction'], ['#/end/as', 'orbit', 'Apocalyptic Shadow'], ['#/end/aa', 'orbit', 'Anomaly Arbitration']]],
    [L('Outils', 'Tools'), [['#/relic', 'shield', L('Évaluateur de reliques', 'Relic checker')], ['#/compare', 'cmp', L('Comparateur', 'Compare')], ['#/calc', 'calc', L('Calculateur', 'Calculator')], ['#/plan', 'dice', L('Tirages', 'Pull planner')], ['#/teams', 'team', L('Équipes', 'Teams')]]], [L('Guides', 'Guides'), [['#/next', 'star', L('Prochaine version', 'Next version')], ['#/versions', 'book', L('Résumé de version', 'Version recap')], ['#/events', 'cal', L('Événements', 'Events')], ['#/aide', 'book', L('Aides', 'Help')]]],
    [L('Communauté', 'Community'), [['#/social', 'share', L('Réseau social', 'Social')], ['#/community', 'users', L('Joueurs', 'Players')], ['#/stats', 'chart', L('Statistiques', 'Statistics')]]], ...(isAdmin ? [[L('Administration', 'Admin'), [['#/admin', 'shield', L('Retours & signalements', 'Feedback & reports')]]]] : [])];
  window.__NAV = NAV;
  $('#side').innerHTML = `<a class="brand" href="#/home"><svg class="logo" viewBox="0 0 64 64" fill="none"><defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe9a8"/><stop offset=".55" stop-color="#e0b050"/><stop offset="1" stop-color="#b98cff"/></linearGradient></defs><g stroke="url(#lg)" stroke-width="1.8" stroke-linecap="round"><circle cx="32" cy="32" r="26" class="r1"/><circle cx="32" cy="32" r="17" stroke-dasharray="2 4" class="r2"/><path d="M32 3v58M3 32h58" opacity=".55"/><path d="M32 12l5 15 15 5-15 5-5 15-5-15-15-5 15-5z" fill="url(#lg)" fill-opacity=".22"/></g><circle cx="32" cy="32" r="3" fill="#fff"/></svg><div class="wm"><b>ASTROLABE</b><i>${L('Guide HSR', 'HSR guide')}</i><small>HSR v${esc(D.version || '')} · ${D.updated}</small></div></a>
  <nav class="nv">${NAV.map((g, gi) => (g[0] ? `<h4 style="--k:${[42, 262, 330, 190, 150, 20, 215, 0][gi]}">${g[0]}</h4>` : '') + g[1].map(i => `<a href="${i[0]}" style="--k:${[42, 262, 330, 190, 150, 20, 215, 0][gi]}">${ico(i[1])}${i[2]}</a>`).join('')).join('')}</nav><div class="sf"><small>${L('Site de fans non officiel. Images et noms © HoYoverse. Classements : Game8.', 'Unofficial fan site. Images and names © HoYoverse. Rankings: Game8.')} · site v9</small><small style="display:block;margin-top:6px"><a href="#/legal">${L('Mentions légales', 'Legal notice')}</a> · <a href="#/credits">${L('Crédits', 'Credits')}</a></small></div>`;
  $('#hd').innerHTML = `<button class="btn io" id="burger" aria-label="Menu">${ico('menu')}</button><button class="srch" data-search="1">${ico('search')}<span id="srph">${L('Rechercher…', 'Search…')}</span><kbd>Ctrl K</kbd></button><span class="sp"></span>
  <div class="seg lang"><button data-lang="fr" class="${LANG === 'fr' ? 'on' : ''}">FR</button><button data-lang="en" class="${LANG === 'en' ? 'on' : ''}">EN</button></div><button class="btn io" id="shareb" aria-label="${L('Partager le site', 'Share the site')}" title="${L('Partager', 'Share')}">${ico('share')}</button><button class="btn io" id="theme" aria-label="${L('Thème', 'Theme')}">${ico('sun')}</button>${sb ? `<button class="btn io" id="fbk" aria-label="${L('Signaler un problème', 'Report a problem')}" title="${L('Signaler un problème', 'Report a problem')}">${ico('flag')}</button>` : ''}<span id="acct"></span>`;
  $('#dlgs').innerHTML = dialogs(); acct();
}
function runSearch(q) {
  q = q.trim().toLowerCase(); const out = $('#sr'); if (!out) return;
  const PG = [['#/home', L('Accueil', 'Home')], ['#/astrolabe', 'Astrolabe · Honkai: Star Rail'], ['#/bleach', 'Bleach : Mirrors High'], ['#/tier', 'Tier list'], ['#/teamtier', L('Tier list des équipes', 'Team tier list')], ['#/banners', L('Bannières', 'Banners')], ['#/compare', L('Comparateur', 'Compare')], ['#/calc', L('Calculateur', 'Calculator')], ['#/plan', L('Planificateur de tirages', 'Pull planner')], ['#/teams', L('Équipes', 'Teams')], ['#/next', L('Prochaine version', 'Next version')], ['#/versions', L('Résumé de version', 'Version recap')], ['#/events', L('Événements', 'Events')], ['#/stats', L('Statistiques', 'Statistics')], ['#/community', L('Communauté', 'Community')], ['#/profil', L('Mon profil', 'My profile')], ['#/settings', L('Paramètres', 'Settings')], ['#/legal', L('Mentions légales', 'Legal notice')], ['#/credits', L('Crédits', 'Credits')], ['#/end/moc', 'Memory of Chaos'], ['#/end/pf', 'Pure Fiction'], ['#/end/as', 'Apocalyptic Shadow']];
  const nz = x => x.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''), qq = nz(q), m = n => nz(n).includes(qq);
  const hl = t => { if (!qq) return esc(t); const i = nz(t).indexOf(qq); return i < 0 ? esc(t) : esc(t.slice(0, i)) + '<mark>' + esc(t.slice(i, i + qq.length)) + '</mark>' + esc(t.slice(i + qq.length)); };
  const ch = q ? C.filter(c => m(c.n)).slice(0, 8) : [], lc = q ? LC.filter(l => m(l.n)).slice(0, 5) : [], rs = q ? RS.filter(r => m(r.n)).slice(0, 5) : [], pg = q ? PG.filter(p => m(p[1])).slice(0, 6) : [];
  const it = (h, img, t, s, tag) => `<a class="sit" href="${h}" data-rec="${esc(t)}|${h}">${img ? `<img src="${img}" alt="">` : '<span class="pgi">→</span>'}<b>${hl(t)}</b><em>${esc(s || '')}</em>${tag || ''}</a>`;
  const hd = (ic, t, n) => `<h5>${ico(ic)}${t}<i>${n}</i></h5>`;
  if (!q) {
    const rec = store.get('astro_recent', []);
    out.innerHTML = (rec.length ? `<h5>${ico('clock')}${L('Récents', 'Recent')}</h5>` + rec.map(r => { const [t, h] = r.split('|'); return it(h, '', t, ''); }).join('') : '') + `<h5>${ico('star')}${L('Accès rapide', 'Quick links')}</h5><div class="qk">${PG.slice(0, 12).map(p => `<a class="chip" href="${p[0]}">${esc(p[1])}</a>`).join('')}</div><h5>${ico('users')}${L('Personnages populaires', 'Popular characters')}</h5>` + C.filter(c => c.t === 'SS').slice(0, 5).map(c => it('#/perso/' + c.id, im('c', c.id), c.n, eN(c.ei) + ' · ' + pN(c.pi), tchip(c.t))).join('');
    return;
  }
  out.innerHTML = (ch.length ? hd('users', L('Personnages', 'Characters'), ch.length) + ch.map(c => it('#/perso/' + c.id, im('c', c.id), c.n, eN(c.ei) + ' · ' + pN(c.pi), tchip(c.t))).join('') : '') + (lc.length ? hd('cone', L('Cônes de lumière', 'Light Cones'), lc.length) + lc.map(l => it('#/lc', im('l', l.id), l.n, l.r + '★ · ' + pN(l.pi))).join('') : '') + (rs.length ? hd('box', L('Reliques', 'Relics'), rs.length) + rs.map(r => it('#/rel', im('r', r.id), r.n, r.pl ? L('Ornement', 'Ornament') : L('Relique', 'Relic'))).join('') : '') + (pg.length ? hd('book', 'Pages', pg.length) + pg.map(p => it(p[0], '', p[1], '')).join('') : '') || `<p class="sub" style="padding:14px">${L('Aucun résultat. Essayez un autre nom.', 'No result. Try another name.')}</p>`;
}
function openSearch() { const d = $('#sdlg'); if (!d || d.open) return; d.showModal(); $('#sq').value = ''; runSearch(''); $('#sq').focus(); }
function openPick(i) { pickSlot = i; const d = $('#pdlg'); $('#pq').value = ''; fillPick(''); d.showModal(); $('#pq').focus(); }
function fillPick(q) { q = q.toLowerCase(); $('#pg').innerHTML = C.filter(c => c.n.toLowerCase().includes(q)).map(c => `<button class="cd s r${c.r}" data-pg="${c.id}" title="${esc(c.n)}"><span class="pt"><img src="${im('c', c.id)}" alt="" loading="lazy">${eiImg(c.ei)}</span><span class="nm">${esc(c.n)}</span></button>`).join(''); }
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => { const r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 3 | 8)).toString(16); }));
const padTeam = m => { const a = m.map(x => ({ c: x.c, l: x.l || '' })); while (a.length < 4) a.push({ c: '', l: '' }); return a; };

// ------------------------------------------------------------ routeur
let foldOpen = false;
function foldFilters() {
  if (innerWidth > 700 || !app) return; const rows = [...app.children].filter(e => e.classList && e.classList.contains('fl')); if (rows.length < 2 || rows[0].parentElement.querySelector('details.flfold')) return;
  const d = document.createElement('details'); d.className = 'flfold'; d.open = foldOpen; const act = rows.reduce((n, r) => n + r.querySelectorAll('.on').length - 1, 0);
  d.innerHTML = `<summary>${L('Filtres', 'Filters')}${act > 0 ? ' <b>' + act + '</b>' : ''}</summary>`; rows[0].before(d); rows.forEach(r => d.appendChild(r)); d.addEventListener('toggle', () => { foldOpen = d.open; });
}
function needLoginPage() {
  if (!authOk) return [`<p class="sub">${L('Chargement…', 'Loading…')}</p>`, null, null];
  return [`<section class="card pf2n" style="flex-direction:column;align-items:flex-start;max-width:640px;margin:40px auto"><span class="lab">${L('Compte requis', 'Account required')}</span><h1 style="margin:4px 0">${L('Connectez-vous pour continuer', 'Log in to continue')}</h1><p class="sub">${L('Foilvault, le profil et les récompenses sont réservés aux joueurs ayant un compte gratuit. Créez un compte ou connectez-vous pour y accéder.', 'Foilvault, the profile and rewards are for players with a free account. Create an account or log in to access them.')}</p><button class="btn pri" id="login">${L('Se connecter / créer un compte', 'Log in / create an account')}</button></section>`, null, null];
}
function render() {
  if (!D) return;
  const [, page = 'home', a, b] = location.hash.split('/'), key = page;
  if (key !== cur) { S = { q: '', e: '', p: '', r: '', own: '' }; document.title = 'Astrolabe — Honkai: Star Rail'; cur = key; }
  const full = '#/' + page + (a ? '/' + a : ''), links = [...document.querySelectorAll('.nv a')], nav = page === 'team' ? '#/teams' : null;
  let hit = links.filter(x => x.getAttribute('href') === full); if (!hit.length) hit = links.filter(x => x.getAttribute('href') === (nav || '#/' + page));
  links.forEach(x => x.classList.toggle('on', hit.includes(x)));
  const out = needAuth(page) ? needLoginPage() : page === 'perso' && a ? detail(a, b) : page === 'fav' ? pages.profil('fav') : page === 'notfound' ? pages.notfound() : (pages[page] || pages.notfound)(a, b);
  app.innerHTML = out[0]; app.firstElementChild && app.firstElementChild.classList.add('fade'); resFn = out[1]; foldFilters(); app.querySelectorAll('img:not([loading])').forEach(i => { i.loading = 'lazy'; i.decoding = 'async'; }); if (out[2]) out[2]();
  tick(); const q = $('#q'); if (q && resFn) q.oninput = e => { S.q = e.target.value; $('#res').innerHTML = resFn(); };
}
document.addEventListener('click', e => {
  const a = e.target.closest('a'); if (a && a.closest('dialog')) { const d = a.closest('dialog'); if (d.open) d.close(); }
  const b = e.target.closest('button'); if (!b) return; const ds = b.dataset;
  if (ds.f !== undefined) { S[ds.f] = ds.v; render(); }
  else if (ds.tm) { TM = ds.tm; render(); }
  else if (ds.te) { TE = ds.te; store.set('astro_te', TE); render(); }
  else if (ds.ts) { TS = ds.ts; store.set('astro_ts', TS); render(); }
  else if (ds.fav) { const [k, i] = ds.fav.split(':'); toggleFav(k, i); }
  else if (ds.own) { const i = ds.own; setOwn(i, i in prof.col ? null : 0); render(); }
  else if (ds.av) { prof.avatar = ds.av; prof.photo = ''; saveProf(); render(); }
  else if (ds.phrm) { prof.photo = ''; saveProf(); render(); }
  else if (ds.lang) setLang(ds.lang);
  else if (ds.search) openSearch();
  else if (ds.close) $('#' + ds.close).close();
  else if (ds.pick !== undefined) openPick(+ds.pick);
  else if (ds.pg) { const c = byId[ds.pg], old = TB.m[pickSlot]; TB.m[pickSlot] = { c: c.id, l: old && old.c === c.id ? old.l : (c.b && c.b.lc) || '' }; store.set('astro_tb', TB); $('#pdlg').close(); render(); }
  else if (ds.tclear !== undefined) { TB.m[+ds.tclear] = { c: '', l: '' }; store.set('astro_tb', TB); render(); }
  else if (ds.treset) { TB = { name: '', m: padTeam([]) }; store.set('astro_tb', TB); render(); }
  else if (ds.tsave) {
    const m = TB.m.filter(x => x.c); if (!m.length) { $('#tmsg').textContent = L('Ajoutez au moins un personnage.', 'Add at least one character.'); return; }
    const name = ($('#tname').value.trim() || L('Mon équipe', 'My team')).slice(0, 40), id = TB.id || uid(), t = { id, name, m }, i = myTeams.findIndex(x => x.id === id);
    if (i >= 0) myTeams[i] = t; else myTeams.push(t); TB.id = id; TB.name = name; store.set('astro_tb', TB); store.set('astro_teams', myTeams);
    if (sb && user) sb.from('teams').upsert({ id, user_id: user.id, name, members: m }).then(r => { if (r.error) console.warn(r.error.message); });
    render(); const tm = $('#tmsg'); if (tm) tm.textContent = L('Équipe enregistrée.', 'Team saved.');
  }
  else if (ds.tshare) { const u = shareUrl(TB.m); (navigator.clipboard ? navigator.clipboard.writeText(u) : Promise.reject()).then(() => $('#tmsg').textContent = L('Lien copié !', 'Link copied!')).catch(() => { $('#tlink').select(); $('#tmsg').textContent = L('Copiez le lien ci-dessus (Ctrl+C).', 'Copy the link above (Ctrl+C).'); }); }
  else if (ds.tload) { const t = myTeams.find(x => x.id === ds.tload); if (t) { TB = { id: t.id, name: t.name, m: padTeam(t.m) }; store.set('astro_tb', TB); render(); scrollTo(0, 0); } }
  else if (ds.tdel) { if (confirm(L('Supprimer cette équipe ?', 'Delete this team?'))) { myTeams = myTeams.filter(x => x.id !== ds.tdel); store.set('astro_teams', myTeams); if (sb && user) sb.from('teams').delete().eq('id', ds.tdel).then(() => {}); render(); } }
  else if (ds.tcopy) { TB = { name: '', m: padTeam(parseTeam(ds.tcopy)) }; store.set('astro_tb', TB); location.hash = '#/teams'; }
  else if (ds.cadd) { readCE(); if (!CE.c) return; plan.push(JSON.parse(JSON.stringify(CE))); store.set('astro_plan', plan); drawCalc(); }
  else if (ds.cdel !== undefined) { plan.splice(+ds.cdel, 1); store.set('astro_plan', plan); drawCalc(); }
  else if (ds.af) { adm.f = ds.af; render(); }
  else if (ds.aset) { const [tb, id, st] = ds.aset.split(':'); sb.from(tb).update({ status: st }).eq('id', id).then(loadAdmin); }
  else if (ds.adel) { const [tb, id] = ds.adel.split(':'); if (confirm(L('Supprimer définitivement ?', 'Delete permanently?'))) sb.from(tb).delete().eq('id', id).then(loadAdmin); }
  else if (ds.adelu) { if (confirm(L('Supprimer ce compte ET toutes ses données ? Action définitive.', 'Delete this account AND all its data? This is permanent.'))) sb.rpc('admin_delete_user', { target: ds.adelu }).then(r => { if (r.error) alert(r.error.message); else { alert(L('Compte supprimé.', 'Account deleted.')); if (location.hash.startsWith('#/admin')) loadAdmin(); else location.hash = '#/community'; } }); }
  else if (ds.adelp) { if (confirm(L('Supprimer ce profil public ?', 'Delete this public profile?'))) sb.from('profiles').delete().eq('user_id', ds.adelp).then(r => { if (r.error) alert(r.error.message); else loadAdmin(); }); }
  else if (ds.ahide) { const [u, v] = ds.ahide.split(':'); sb.from('profiles').update({ is_public: v === '1' }).eq('user_id', u).then(loadAdmin); }
  else if (b.id === 'psave') { prof.name = $('#pn').value.trim(); if ($('#phd')) { prof.pub = $('#ppub').checked; prof.handle = $('#phd').value.trim().toLowerCase(); prof.bio = $('#pbio').value.trim();  if (prof.pub && !/^[a-z0-9_-]{3,20}$/.test(prof.handle)) { pmsg = L('Nom d’utilisateur invalide : 3 à 20 caractères (a-z, 0-9, - et _).', 'Invalid username: 3–20 characters (a-z, 0-9, - and _).'); render(); return; } } saveProf().then(render); }
  else if (ds.like) { const p = viewed; sb.from('profile_likes').select('profile_id').eq('profile_id', p.user_id).eq('user_id', user.id).then(async r => { if (r.data && r.data.length) await sb.from('profile_likes').delete().match({ profile_id: p.user_id, user_id: user.id }); else await sb.from('profile_likes').insert({ profile_id: p.user_id, user_id: user.id }); loadProfile(p.handle); }); }
  else if (ds.report) { const r = prompt(L('Pourquoi signalez-vous ce profil ?', 'Why are you reporting this profile?')); if (r && r.trim()) sb.from('reports').insert({ profile_id: viewed.user_id, reason: r.trim().slice(0, 300) }).then(x => alert(x.error ? L('Échec du signalement.', 'Report failed.') : L('Merci, le signalement a été envoyé.', 'Thanks, your report was sent.'))); }
  else if (b.id === 'preset') { if (confirm(L('Vider toute la collection ?', 'Clear the whole collection?'))) { Object.keys(prof.col).forEach(i => setOwn(i, null)); render(); } }
  else if (b.id === 'burger') $('#side').classList.toggle('open');
  else if (b.id === 'theme') { PREF.theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; store.set('astro_pref', PREF); applyPrefs(); if (location.hash.startsWith('#/settings')) render(); }
  else if (ds.pref) { const [k, v] = ds.pref.split(':'); setPref(k, v); }
  else if (b.id === 'pexp') exportData();
  else if (b.id === 'prst') { if (confirm(L('Réinitialiser toutes les préférences d’affichage ?', 'Reset all display preferences?'))) { PREF = { ...PD, theme: 'dark' }; store.set('astro_pref', PREF); applyPrefs(); chrome(); render(); } }
  else if (b.id === 'login') { authMsg(''); $('#dlg').showModal(); }
  else if (b.id === 'out' || b.id === 'out2') sb.auth.signOut().then(() => { user = null; isAdmin = false; acct(); chrome(); render(); });
  else if (b.id === 'lkdc') linkDiscord();
  else if (['bin', 'bup', 'bfg', 'bdc'].includes(b.id)) authClick(b.id);
  else if (b.id === 'mfv') mfaVerify();
  else if (['mfon', 'mfok', 'mfno', 'mfoff'].includes(b.id)) mfaClick(b.id, b);
  else if (b.id === 'delprof') delProfile();
  else if (b.id === 'delacc') delAccount();
  else if (b.id === 'fbk') { $('#fm').textContent = ''; $('#fdlg').showModal(); }
  else if (b.id === 'fsend') { const t = $('#ft').value.trim(); if (t.length < 3) { $('#fm').textContent = L('Écrivez au moins quelques mots.', 'Please write a few words.'); return; } sendFeedback($('#fk').value, t).then(ok => { $('#fm').textContent = ok ? L('Merci ! Votre message a été envoyé.', 'Thank you! Your message was sent.') : L('Envoi impossible pour le moment.', 'Could not send right now.'); if (ok) $('#ft').value = ''; }); }
});
document.addEventListener('change', e => {
  const t = e.target, ds = t.dataset;
  if (ds.ck !== undefined) { const s = new Set(store.get('astro_ck', [])); t.checked ? s.add(+ds.ck) : s.delete(+ds.ck); store.set('astro_ck', [...s]); }
  else if (t.id === 'pph') photoFromFile(t.files[0], d => { if (d && photoOk(d)) { prof.photo = d; saveProf(); render(); } else alert(L('Image non valide.', 'Invalid image.')); });
  else if (ds.eid) setOwn(ds.eid, +t.value).then(render);
  else if (ds.cmp) { const [, , a, b] = location.hash.split('/'), v = t.value, na = ds.cmp === 'a' ? v : a || '', nb = ds.cmp === 'b' ? v : b || ''; location.hash = `#/compare/${na}/${nb}`; }
  else if (ds.tl !== undefined) { TB.m[+ds.tl].l = t.value; store.set('astro_tb', TB); const el = $('#tlink'); if (el) el.value = shareUrl(TB.m); }
});
document.addEventListener('input', e => {
  const t = e.target, ds = t.dataset;
  if (ds.ce) { readCE(); drawCalc(); }
  else if (ds.pl) { PL[ds.pl] = t.type === 'checkbox' ? t.checked : (ds.pl === 'b' ? t.value : Math.max(0, +t.value || 0)); if (ds.pl === 'k') PL.k = Math.min(7, Math.max(1, PL.k)); store.set('astro_pl', PL); drawPlan(); }
  else if (t.id === 'tname') { TB.name = t.value; store.set('astro_tb', TB); }
  else if (t.id === 'sq') runSearch(t.value);
  else if (t.id === 'pq') fillPick(t.value);
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') { const d = document.querySelector('dialog[open]'); if (d) { e.preventDefault(); d.close(); } return; } if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openSearch(); } else if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test((document.activeElement || {}).tagName || '') && !document.querySelector('dialog[open]')) { e.preventDefault(); openSearch(); } });
document.addEventListener('close', e => { if (e.target.id === 'dlg' && e.target.classList.contains('mfa')) { endMfa(); sb && sb.auth.signOut(); } }, true);
window.addEventListener('hashchange', () => { $('#side').classList.remove('open'); render(); scrollTo(0, 0); });

// ------------------------------------------------------------ démarrage
try { if ('serviceWorker' in navigator && /^https?:/.test(location.protocol)) navigator.serviceWorker.register('sw.js'); } catch { }
try {
  const q = new URLSearchParams(location.search), er = q.get('error_description') || q.get('error');
  if (er) {
    history.replaceState(null, '', location.pathname + (location.hash || '#/home'));
    const d = document.createElement('div'); d.className = 'authbar';
    const ex = /exchange external code/i.test(er);
    d.innerHTML = '<b>' + (LANG === 'fr' ? 'Connexion impossible' : 'Sign-in failed') + '</b> ' + (ex ? (LANG === 'fr' ? 'Discord a refusé l’échange avec Supabase. Vérifiez le Client Secret et l’adresse de redirection (Callback URL) dans le portail Discord.' : 'Discord refused the exchange with Supabase. Check the Client Secret and the redirect (Callback URL) in the Discord portal.') : er.replace(/\+/g, ' ')) + '<button aria-label="Fermer">×</button>';
    d.querySelector('button').onclick = () => d.remove(); document.body.appendChild(d);
  }
} catch { }
document.documentElement.dataset.discord = USE_DISCORD ? 'on' : 'off';
applyPrefs(); document.documentElement.lang = LANG; if (!location.hash && PREF.start && PREF.start !== '#/home') location.hash = PREF.start;
if (!TB.m || TB.m.length !== 4) TB = { name: '', m: padTeam(TB.m || []) };
Promise.all([window.__DATA__ ? Promise.resolve(window.__DATA__) : fetch('data/data.json').then(r => r.json()), LANG === 'en' ? (window.__DATA_EN__ ? Promise.resolve(window.__DATA_EN__) : fetch('data/data_en.json').then(r => r.json()).catch(() => null)) : Promise.resolve(null)]).then(([d, en]) => {
  D = d; DE = en || window.__DATA_EN__ || null; applyData(); chrome(); render(); initAuth();
}).catch(err => { console.error(err); app.innerHTML = '<p class="sub">Impossible de charger les données / Could not load the data.</p>'; });
})();
