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
const IC = { home: 'M3 11l9-8 9 8M5 10v10h14V10', users: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M2 20c0-3.5 3-5.5 7-5.5s7 2 7 5.5M17 4.5a3.5 3.5 0 0 1 0 6.5M18 15c2.5.5 4 2.3 4 5', cone: 'M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5', box: 'M12 2l9 5v10l-9 5-9-5V7l9-5zM12 12l9-5M12 12v10M12 12L3 7', tier: 'M4 20V10M10 20V4M16 20v-8M22 20H2', end: 'M12 3a9 9 0 1 0 9 9M12 7.5a4.5 4.5 0 1 0 4.5 4.5M12 12h.01', cmp: 'M8 3L4 7l4 4M4 7h16M16 21l4-4-4-4M20 17H4', cal: 'M4 5h16v16H4zM4 10h16M9 3v4M15 3v4', book: 'M4 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4zM20 4h-6M20 4v14h-8', user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M4 21c0-4 4-6 8-6s8 2 8 6', star: 'M12 3l2.7 5.8 6.3.8-4.6 4.4 1.2 6.3L12 17.3 6.4 20.3l1.2-6.3L3 9.6l6.3-.8z', info: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M12 11v5M12 8h.01', calc: 'M5 3h14v18H5zM8 7h8M8 12h2M14 12h2M8 16h2M14 16h2', dice: 'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM8 8h.01M16 8h.01M12 12h.01M8 16h.01M16 16h.01', chart: 'M3 3v18h18M7 15l4-4 3 3 5-6', team: 'M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4z', shield: 'M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4zM9 12l2 2 4-4', search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14M21 21l-5-5', flag: 'M5 21V4h11l-1.5 4L16 12H5', globe: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18', sun: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5', menu: 'M4 6h16M4 12h16M4 18h16', clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M12 7v5l3 2', share: 'M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6M6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6M18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6M8.6 13.5l6.8 4M15.4 6.5l-6.8 4', trophy: 'M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4zM17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3', bell: 'M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8M10 20a2 2 0 0 0 4 0', skull: 'M12 3a8 8 0 0 0-8 8c0 3 1.5 5 3 6v3h10v-3c1.5-1 3-3 3-6a8 8 0 0 0-8-8zM9 12h.01M15 12h.01', train: 'M5 16V6a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v10M3 16h18l-1.5 3h-15zM8 8h8M8 12h8', cog: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z', plus: 'M12 5v14M5 12h14' };
const ico = (n, c = '') => `<svg class="ic ${c}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="${IC[n] || ''}"/></svg>`;

// ------------------------------------------------------------ état
const TN = { 'SS': 'T0', 'S+': 'T0.5', 'S': 'T1', 'A': 'T2', 'B': 'T3', 'C': 'T4' }, TBR = { 'SS': ['Apex', 'Apex'], 'S+': ['Meta', 'Meta'], 'S': ['Meta', 'Meta'], 'A': ['Jouable', 'Playable'], 'B': ['Hors méta', 'Off-meta'], 'C': ['Hors méta', 'Off-meta'] };
const TIERS = ['SS', 'S+', 'S', 'A', 'B', 'C'], TV = { 'SS': '--SS', 'S+': '--Sp', 'S': '--S', 'A': '--A', 'B': '--B', 'C': '--C', '?': '--C' };
let D, DE = null, C, byId, LC, RS, CALC = null, user = null, sb = null, isAdmin = false, TM = 'ov', TE = store.get('astro_te', 'base'), TS = store.get('astro_ts', 'l');
let S = { q: '', e: '', p: '', r: '', own: '' };
let fav = store.get('astro_fav', { char: [], build: [] }), prof = Object.assign({ name: '', avatar: '', col: {}, handle: '', bio: '', pub: false, show: [] }, store.get('astro_prof', {}));
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
const saveProf = async () => {
  store.set('astro_prof', prof); pmsg = '';
  if (!(sb && user)) return;
  const base = { user_id: user.id, display_name: prof.name, avatar: prof.avatar, updated_at: new Date().toISOString() };
  const full = { ...base, handle: prof.handle || null, bio: prof.bio, is_public: !!prof.pub && !!prof.handle, showcase: prof.show.filter(s => s.c), stats: myStats() };
  let { error } = await sb.from('profiles').upsert(full);
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
  if (!p.error) { if (p.data) { prof.name = p.data.display_name || prof.name; prof.avatar = p.data.avatar || prof.avatar; prof.handle = p.data.handle || prof.handle; prof.bio = p.data.bio ?? prof.bio; prof.pub = p.data.is_public ?? prof.pub; if (Array.isArray(p.data.showcase) && p.data.showcase.length) prof.show = p.data.showcase; } else if (prof.name || prof.avatar) saveProf(); }
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
function acct() {
  const el = $('#acct'); if (!el) return;
  el.innerHTML = !sb ? '' : user ? `<button class="btn" id="out">${L('Déconnexion', 'Log out')}</button>` : `<button class="btn pri" id="login">${L('Connexion', 'Log in')}</button>`;
}
function initAuth() {
  if (!CFG.SUPABASE_URL || !window.supabase) return acct();
  sb = window.supabase.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY);
  sb.auth.getSession().then(async ({ data }) => { user = data.session ? data.session.user : null; acct(); if (user && await mfaGate()) return; pullAll(); });
  sb.auth.onAuthStateChange((_e, s) => { user = s ? s.user : null; if (!user) isAdmin = false; acct(); chrome(); setTimeout(async () => { if (user && await mfaGate()) return; pullAll(); }, 0); }); // setTimeout : ne jamais attendre Supabase directement dans ce rappel (sinon la déconnexion se bloque)
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
    return [`${tickerHtml()}<section class="hero2"><div class="hx"><span class="lab">${L('Bienvenue à bord, Trailblazer', 'Welcome aboard, Trailblazer')} · v${esc(D.version || '')}</span><h1 class="wordmark">ASTROLABE</h1><p class="greet">${L('Le Train Astral est prêt à partir. Où va-t-on aujourd’hui ?', 'The Astral Express is ready to depart. Where to today?')}</p><p class="lead">${L('Le guide Honkai: Star Rail qui regroupe les meilleures sources au même endroit. Données mises à jour le ' + D.updated + '.', 'The Honkai: Star Rail guide that brings the best sources together. Data updated on ' + D.updated + '.')}</p><div class="cta"><a class="btn pri" href="#/tier">${L('Voir la tier list', 'Open the tier list')}</a><a class="btn" href="#/perso">${L('Personnages', 'Characters')}</a><button class="btn" data-search="1">${ico('search')} ${L('Rechercher', 'Search')}</button><button class="btn" data-share="site">${ico('share')} ${L('Partager', 'Share')}</button></div></div><div class="hpw"><svg class="orb" viewBox="0 0 200 200" fill="none" aria-hidden="true"><g stroke="url(#og)" stroke-width=".7"><circle cx="100" cy="100" r="92" stroke-dasharray="2 5"/><circle cx="100" cy="100" r="72" opacity=".6"/><circle cx="100" cy="100" r="52" stroke-dasharray="1 4" opacity=".7"/></g><defs><linearGradient id="og" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f0c964"/><stop offset="1" stop-color="#b98cff"/></linearGradient></defs><circle cx="192" cy="100" r="3" fill="#ffe9a8"/><circle cx="28" cy="58" r="2.2" fill="#c79bff"/><circle cx="100" cy="28" r="2" fill="#7fe0f0"/></svg>${side.map((i, k) => `<img class="hp hs hs${k + 1}" src="${im('p', i)}" alt="">`).join('')}<img class="hp" src="${im('p', feat)}" alt=""></div></section>
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
  <div class="bigtabs"><a class="${adm.tab === 'fb' ? 'on' : ''}" href="#/admin/fb">${ico('flag')}${L('Retours & erreurs', 'Feedback & errors')}</a><a class="${adm.tab === 'rp' ? 'on' : ''}" href="#/admin/rp">${ico('shield')}${L('Signalements', 'Reports')}</a></div>
  <div class="opts"><div class="seg"><button class="${adm.f === 'open' ? 'on' : ''}" data-af="open">${L('À traiter', 'Open')}</button><button class="${adm.f === 'closed' ? 'on' : ''}" data-af="closed">${L('Traités', 'Done')}</button></div></div><div id="adm"><p class="sub">${L('Chargement…', 'Loading…')}</p></div>`, null, loadAdmin];
};
async function loadAdmin() {
  const el = $('#adm'); if (!el || !sb || !isAdmin) return;
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
    <p class="lab" style="margin-top:6px">Avatar</p><div class="grid" style="max-height:190px;overflow:auto;margin-bottom:12px">${C.map(c => `<button class="cd s ${prof.avatar === c.id ? 'on' : ''}" data-av="${c.id}" style="opacity:${prof.avatar === c.id ? 1 : .75}"><span class="pt" style="${prof.avatar === c.id ? 'border-color:var(--ac)' : ''}"><img src="${im('c', c.id)}" alt="" loading="lazy"></span></button>`).join('')}</div></div>
    <div class="card"><h2>${L('Profil public (communauté)', 'Public profile (community)')}</h2>${!sb || !user ? `<p class="sub">${L('Connectez-vous pour partager votre profil avec la communauté.', 'Log in to share your profile with the community.')}</p>` : `<label style="display:flex;gap:8px;align-items:center;margin-bottom:12px"><input type="checkbox" id="ppub" ${prof.pub ? 'checked' : ''} style="width:auto;margin:0"> ${L('Rendre mon profil public (désactivé par défaut)', 'Make my profile public (off by default)')}</label>
    <label class="lab">${L('Nom d’utilisateur (adresse du profil)', 'Username (profile address)')}</label><input type="text" id="phd" value="${esc(prof.handle)}" placeholder="${L('ex. mon-pseudo', 'e.g. my-name')}" maxlength="20">
    <label class="lab">${L('Présentation (200 caractères max.)', 'Bio (200 characters max.)')}</label><input type="text" id="pbio" value="${esc(prof.bio)}" maxlength="200" placeholder="${L('Une phrase sur vous', 'One sentence about you')}">
    <p class="lab" style="margin-top:8px">${L('Vitrine : jusqu’à 6 personnages à mettre en avant', 'Showcase: up to 6 characters to highlight')}</p>${shw.map((s, k) => `<div class="slot"><select id="sc${k}"><option value="">— ${L('Emplacement', 'Slot')} ${k + 1} —</option>${sorted.map(c => `<option value="${c.id}" ${s.c === c.id ? 'selected' : ''}>${esc(c.n)}</option>`).join('')}</select><input type="text" id="st${k}" value="${esc(s.t)}" maxlength="80" placeholder="${L('Commentaire court (80 caractères)', 'Short comment (80 characters)')}"></div>`).join('')}
    <p class="sub" style="font-size:12.5px">${L('Seuls le pseudo, l’avatar, la présentation, les chiffres de collection et la vitrine sont publics. Jamais votre e-mail ni votre collection complète.', 'Only the name, avatar, bio, collection figures and showcase are public. Never your e-mail or your full collection.')}</p>`}
    <button class="btn pri" id="psave">${L('Enregistrer', 'Save')}</button> ${prof.pub && prof.handle ? `<a href="#/community/${esc(prof.handle)}" style="margin-left:10px">${L('Voir mon profil public', 'See my public profile')}</a>` : ''}<p class="sub">${esc(pmsg)}</p></div>
    <div class="card"><h2>${L('Sécurité du compte', 'Account security')}</h2><div id="sec2fa"><p class="sub">…</p></div></div>
    ${sb && user ? `<div class="card dz"><h2>${L('Zone sensible', 'Danger zone')}</h2><p class="sub">${L('Supprimer votre profil public (le compte reste), ou supprimer entièrement votre compte et toutes vos données.', 'Delete your public profile (the account stays), or delete your whole account and all your data.')}</p><button class="btn" id="delprof">${L('Supprimer mon profil public', 'Delete my public profile')}</button> <button class="btn danger" id="delacc">${L('Supprimer mon compte', 'Delete my account')}</button></div>` : ''}
    <div class="card"><h2>${L('Données', 'Data')}</h2><p class="sub">${L('Les données de ce navigateur ' + (sb ? 'sont synchronisées avec votre compte quand vous êtes connecté.' : 'restent dans ce navigateur.'), 'The data in this browser ' + (sb ? 'is synced with your account when you are logged in.' : 'stays in this browser.'))}</p><button class="btn" id="preset">${L('Vider la collection', 'Clear collection')}</button></div>`;
}
pages.profil = tab => {
  if (tab === 'set' || tab === 'settings') return pages.settings();
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
  return [`<div class="ph">${prof.avatar && byId[prof.avatar] ? `<img class="av" src="${im('c', prof.avatar)}" alt="">` : `<div class="av">${esc(name[0].toUpperCase())}</div>`}<div><h1>${esc(name)}</h1><span class="sub">${since}</span></div></div>${banner}
  <div class="g3"><div class="stat"><span class="lab">${L('Personnages', 'Characters')}</span><b>${own.length} / ${C.length}</b></div><div class="stat"><span class="lab">${L('5★ possédés', '5★ owned')}</span><b>${n5}</b></div><div class="stat"><span class="lab">${L('Éidolons cumulés', 'Total eidolons')}</span><b>${eids}</b></div><div class="stat"><span class="lab">${L('Favoris', 'Favourites')}</span><b>${fav.char.length + fav.build.length}</b></div></div>
  ${badgesHtml(myBadgeStats())}<div class="bigtabs">${tabs.map(t => `<a class="${tab === t[0] ? 'on' : ''}" href="#/profil/${t[0]}">${ico(t[2])}${t[1]}</a>`).join('')}</div>${body}`, res, () => { if (tab === 'set') mfaDraw(); }];
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
const avOf = (p, cls = '') => p.avatar && byId[p.avatar] ? `<img class="av ${cls}" src="${im('c', p.avatar)}" alt="">` : `<div class="av ${cls}">${esc((p.display_name || p.handle || '?')[0].toUpperCase())}</div>`;
const cover = p => { const h = hue(p.handle); return `style="--h1:${h};--h2:${(h + 70) % 360}"`; };
pages.community = h => {
  if (!sb) return [`<h1>${L('Communauté', 'Community')}</h1><p class="lead">${L('La communauté nécessite les comptes (Supabase) : renseignez config.js.', 'The community needs accounts (Supabase): fill in config.js.')}</p>`];
  if (h) return [`<div id="cm"><p class="sub">${L('Chargement…', 'Loading…')}</p></div>`, null, () => loadProfile(h)];
  return [`<section class="soc"><div><span class="lab">${L('Réseau des joueurs', 'Player network')}</span><h1>${L('Communauté', 'Community')}</h1><p class="lead">${L('Découvrez les vitrines des autres Trailblazers, aimez leurs profils et partagez le vôtre. Rendez-le public dans Mon profil → Paramètres.', 'Discover other Trailblazers’ showcases, like their profiles and share yours. Make it public in My profile → Settings.')}</p></div><a class="btn pri" href="#/settings">${L('Créer mon profil public', 'Create my public profile')}</a></section>
  <div class="socbar"><input type="search" id="cmq" placeholder="${L('Rechercher un joueur…', 'Search a player…')}" autocomplete="off"><div class="seg"><button class="on" data-cms="new">${L('Récents', 'Recent')}</button><button data-cms="top">${L('Populaires', 'Popular')}</button></div></div>
  <div id="cm" class="feed"><p class="sub">${L('Chargement…', 'Loading…')}</p></div>`, null, async () => {
    const { data, error } = await sb.from('profiles').select('user_id,handle,display_name,avatar,stats,bio,showcase').eq('is_public', true).not('handle', 'is', null).order('updated_at', { ascending: false }).limit(48);
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
  el.innerHTML = `<a class="back" href="#/community" style="color:var(--ac)">← ${L('Communauté', 'Community')}</a><div class="pfx"><div class="pcov big" ${cover(p)}></div><div class="pfh">${avOf(p, 'lg')}<div class="pfn"><h1>${esc(p.display_name || p.handle)}</h1><span class="sub">@${esc(p.handle)}</span></div><div class="pfa">${user ? `<button class="btn ${liked ? 'on' : ''}" data-like="1">${liked ? '♥' : '♡'} ${L('J’aime', 'Like')}</button><button class="btn" data-report="1">${L('Signaler', 'Report')}</button>` : ''}</div></div>${p.bio ? `<p class="pfb">${esc(p.bio)}</p>` : ''}
  <div class="pfs"><div><b>${st.n ?? '—'}</b><span>${L('Personnages', 'Characters')}</span></div><div><b>${st.n5 ?? '—'}</b><span>5★</span></div><div><b>${st.e ?? '—'}</b><span>${L('Éidolons', 'Eidolons')}</span></div><div><b>♥ ${count || 0}</b><span>${L('J’aime', 'Likes')}</span></div></div>${isAdmin ? `<div style="padding:0 18px 14px"><button class="btn" data-adelp="${p.user_id}">${L('Supprimer le profil (admin)', 'Delete profile (admin)')}</button> <button class="btn danger" data-adelu="${p.user_id}">${L('Supprimer le compte (admin)', 'Delete account (admin)')}</button></div>` : ''}${user ? '' : `<p class="sub" style="padding:0 18px 14px">${L('Connectez-vous pour aimer ou signaler ce profil.', 'Log in to like or report this profile.')}</p>`}</div>
  ${badgesHtml({ n: st.n, n5: st.n5, e: st.e })}${sec(L('Vitrine', 'Showcase'))}<div class="posts">${sh.length ? sh.map(s => { const c = byId[s.c]; return `<article class="post"><a class="pimg" href="#/perso/${c.id}"><img src="${im('p', c.id)}" alt="" loading="lazy"></a><div class="ptx"><b>${esc(c.n)}</b><span class="sub">${eN(c.ei)} · ${pN(c.pi)}</span><p>${esc(s.t || '')}</p><a href="#/perso/${c.id}/build">${L('Voir le build recommandé', 'See the recommended build')} →</a></div></article>`; }).join('') : `<p class="sub">${L('Vitrine vide.', 'Empty showcase.')}</p>`}</div>`;
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
  prof.handle = ''; prof.bio = ''; prof.pub = false; prof.show = []; prof.name = ''; prof.avatar = ''; store.set('astro_prof', prof); pmsg = L('Profil public supprimé.', 'Public profile deleted.'); render();
}
async function delAccount() {
  if (!(sb && user)) return;
  const w = L('SUPPRIMER', 'DELETE');
  if ((prompt(L('Cette action est définitive : compte, profil, favoris, collection et équipes seront effacés. Tapez ' + w + ' pour confirmer.', 'This is permanent: account, profile, favourites, collection and teams will be erased. Type ' + w + ' to confirm.')) || '').trim() !== w) return;
  const { error } = await sb.rpc('delete_my_account');
  if (error) { pmsg = L('Échec : exécutez supabase/schema_v5.sql. (', 'Failed: run supabase/schema_v5.sql. (') + error.message + ')'; render(); return; }
  ['astro_prof', 'astro_fav', 'astro_teams'].forEach(k => localStorage.removeItem(k)); prof = { name: '', avatar: '', col: {}, handle: '', bio: '', pub: false, show: [] }; fav = { char: [], build: [] }; myTeams = [];
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
  ${seg('start', PREF.start, [['#/home', L('Accueil', 'Home')], ['#/tier', 'Tier list'], ['#/banners', L('Bannières', 'Banners')], ['#/profil', L('Mon profil', 'My profile')]], [L('Page d’ouverture', 'Start page'), L('Utilisée quand vous ouvrez le site sans adresse précise', 'Used when you open the site without a specific address')])}</div>
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
  const nm = b.chars.map(i => byId[i] ? byId[i].n : '').filter(Boolean).join(' + '), fm = t => new Date(t).toISOString().replace(/[-:]/g, '').replace(/\.\d+/, ''), end = new Date(b.end);
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Astrolabe//HSR//FR', 'BEGIN:VEVENT', 'UID:' + b.start + '-' + (b.chars || []).join('') + '@astrolabe', 'DTSTAMP:' + fm(Date.now()), 'DTSTART:' + fm(end), 'DTEND:' + fm(end.getTime() + 36e5), 'SUMMARY:' + L('Fin de la bannière : ', 'Banner ends: ') + nm, 'DESCRIPTION:Honkai: Star Rail', 'BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:' + L('La bannière se termine dans 24 h : ', 'Banner ends in 24h: ') + nm, 'TRIGGER:-P1D', 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'];
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([lines.join('\r\n')], { type: 'text/calendar' })); a.download = 'astrolabe-banniere.ics'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
function remAdd(b) {
  const id = b.start + '|' + b.chars.join(','), nm = b.chars.map(i => byId[i] ? byId[i].n : '').join(' + ');
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
  const art = c ? `<img class="nxart" src="${im('p', c.id)}" alt="">` : `<div class="nxmys"><span>?</span>${el ? eiImg(el) : ''}${pa ? piImg(pa) : ''}</div>`;
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
  <p>${L('Astrolabe est un site de fans non officiel, sans lien avec HoYoverse (COGNOSPHERE PTE. LTD.). Honkai: Star Rail, ses personnages, noms, images et textes sont la propriété de HoYoverse. Ils sont utilisés ici à titre informatif, sans but commercial. Si vous êtes titulaire de droits et souhaitez un retrait, contactez-nous via le bouton « Signaler » : le contenu concerné sera retiré rapidement.', 'Astrolabe is an unofficial fan site with no affiliation to HoYoverse (COGNOSPHERE PTE. LTD.). Honkai: Star Rail, its characters, names, images and texts are the property of HoYoverse. They are used here for information only, with no commercial purpose. If you are a rights holder and want something removed, contact us through the “Report” button: the content will be removed promptly.')}</p>
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
  <div class="card note2"><b>${L('Important', 'Important')}</b> ${L('Honkai: Star Rail et tout son contenu (personnages, noms, images, textes) appartiennent à HoYoverse. Astrolabe est un projet de fans, gratuit et sans publicité. Les classements restent la propriété de leurs auteurs : le site les présente de façon résumée et renvoie vers les sources. Les équipes « calculées », les scores de synergie et les estimations de tirages sont produits par le site lui-même.', 'Honkai: Star Rail and all its content (characters, names, images, texts) belong to HoYoverse. Astrolabe is a free, ad-free fan project. Rankings remain the property of their authors: the site presents them in summary form and links to the sources. “Calculated” teams, synergy scores and pull estimates are produced by the site itself.')}</div>
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
    if (sessionStorage.getItem('astro_wl')) return; sessionStorage.setItem('astro_wl', '1');
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
  const end = () => { if (!w.isConnected) return; w.classList.add('out'); setTimeout(() => w.remove(), 700); };
  w.onclick = end; setTimeout(end, 5200);
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
  return [`<h1>${esc(M[0])}</h1><p class="lead">${esc(M[1])}</p>${hero}${tl ? sec(L('Calendrier', 'Schedule')) + `<div class="tlh">${tl}</div>` : ''}${D.tiers[m] ? sec(L('Classement des personnages', 'Character ranking')) + tierOpts() + cbar() + `<div id="res">${res()}</div>` : ''}
  <p class="note">${L('Classement : Game8. Guides détaillés : ', 'Ranking: Game8. Detailed guides: ')}${D.manual.guides.map(g => `<a href="${g.u}" target="_blank" rel="noopener">${esc(LANG === 'en' && g.t_en || g.t)}</a>`).join(' · ')}</p>`, D.tiers[m] ? res : null];
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
  <dialog id="fdlg"><h2 class="dt">${L('Signaler un problème', 'Report a problem')}</h2><p class="sub" style="margin:0 0 12px;font-size:13px">${L('Un bug, une donnée fausse, une idée ? Votre message arrive directement à l’administrateur.', 'A bug, wrong data, an idea? Your message goes straight to the administrator.')}</p>
  <select id="fk"><option value="bug">${L('Un bug', 'A bug')}</option><option value="data">${L('Une donnée fausse', 'Wrong data')}</option><option value="idea">${L('Une idée', 'An idea')}</option><option value="other">${L('Autre', 'Other')}</option></select>
  <textarea id="ft" rows="5" maxlength="1000" placeholder="${L('Décrivez ce qui ne va pas (page concernée, ce que vous attendiez…)', 'Describe what is wrong (which page, what you expected…)')}"></textarea><div class="msg" id="fm"></div><div class="dact"><button class="btn pri" id="fsend">${L('Envoyer', 'Send')}</button><button class="btn" data-close="fdlg">${L('Fermer', 'Close')}</button></div></dialog>
  <dialog id="pdlg" class="wide"><input type="search" id="pq" placeholder="${L('Choisir un personnage…', 'Pick a character…')}" autocomplete="off"><div id="pg" class="grid pgrid"></div><div class="dact"><button class="btn" data-close="pdlg">${L('Fermer', 'Close')}</button></div></dialog>`;
}
function chrome() {
  const NAV = [['', [['#/home', 'home', L('Accueil', 'Home')]]], [L('Base de données', 'Database'), [['#/perso', 'users', L('Personnages', 'Characters')], ['#/lc', 'cone', L('Cônes de lumière', 'Light Cones')], ['#/rel', 'box', L('Reliques', 'Relics')]]], [L('Classements', 'Rankings'), [['#/tier', 'tier', 'Tier list'], ['#/teamtier', 'team', L('Tier list équipes', 'Team tier list')], ['#/gear/lc', 'cone', L('Tier list équipement', 'Gear tier list')], ['#/banners', 'star', L('Bannières', 'Banners')]]],
    [L('End game', 'End game'), [['#/end/moc', 'end', 'Memory of Chaos'], ['#/end/pf', 'end', 'Pure Fiction'], ['#/end/as', 'end', 'Apocalyptic Shadow'], ['#/end/aa', 'end', 'Anomaly Arbitration']]],
    [L('Outils', 'Tools'), [['#/compare', 'cmp', L('Comparateur', 'Compare')], ['#/calc', 'calc', L('Calculateur', 'Calculator')], ['#/plan', 'dice', L('Tirages', 'Pull planner')], ['#/teams', 'team', L('Équipes', 'Teams')]]], [L('Guides', 'Guides'), [['#/next', 'star', L('Prochaine version', 'Next version')], ['#/versions', 'book', L('Résumé de version', 'Version recap')], ['#/events', 'cal', L('Événements', 'Events')], ['#/aide', 'book', L('Aides', 'Help')]]],
    [L('Communauté', 'Community'), [['#/community', 'users', L('Joueurs', 'Players')], ['#/stats', 'chart', L('Statistiques', 'Statistics')]]], [L('Compte', 'Account'), [['#/profil', 'user', L('Mon profil', 'My profile')], ['#/profil/fav', 'star', L('Favoris', 'Favourites')], ['#/settings', 'cog', L('Paramètres', 'Settings')]]], ...(isAdmin ? [[L('Administration', 'Admin'), [['#/admin', 'shield', L('Retours & signalements', 'Feedback & reports')]]]] : [])];
  $('#side').innerHTML = `<a class="brand" href="#/home"><svg class="logo" viewBox="0 0 64 64" fill="none"><defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe9a8"/><stop offset=".55" stop-color="#e0b050"/><stop offset="1" stop-color="#b98cff"/></linearGradient></defs><g stroke="url(#lg)" stroke-width="1.8" stroke-linecap="round"><circle cx="32" cy="32" r="26" class="r1"/><circle cx="32" cy="32" r="17" stroke-dasharray="2 4" class="r2"/><path d="M32 3v58M3 32h58" opacity=".55"/><path d="M32 12l5 15 15 5-15 5-5 15-5-15-15-5 15-5z" fill="url(#lg)" fill-opacity=".22"/></g><circle cx="32" cy="32" r="3" fill="#fff"/></svg><div class="wm"><b>ASTROLABE</b><i>${L('Guide HSR', 'HSR guide')}</i><small>HSR v${esc(D.version || '')} · ${D.updated}</small></div></a>
  <nav class="nv">${NAV.map((g, gi) => (g[0] ? `<h4 style="--k:${[42, 262, 330, 190, 150, 20, 290, 215, 0][gi]}">${g[0]}</h4>` : '') + g[1].map(i => `<a href="${i[0]}" style="--k:${[42, 262, 330, 190, 150, 20, 290, 215, 0][gi]}">${ico(i[1])}${i[2]}</a>`).join('')).join('')}</nav><div class="sf"><small>${L('Site de fans non officiel. Images et noms © HoYoverse. Classements : Game8.', 'Unofficial fan site. Images and names © HoYoverse. Rankings: Game8.')} · site v8</small><small style="display:block;margin-top:6px"><a href="#/legal">${L('Mentions légales', 'Legal notice')}</a> · <a href="#/credits">${L('Crédits', 'Credits')}</a></small></div>`;
  $('#hd').innerHTML = `<button class="btn io" id="burger" aria-label="Menu">${ico('menu')}</button><button class="srch" data-search="1">${ico('search')}<span id="srph">${L('Rechercher…', 'Search…')}</span><kbd>Ctrl K</kbd></button><span class="sp"></span>
  <div class="seg lang"><button data-lang="fr" class="${LANG === 'fr' ? 'on' : ''}">FR</button><button data-lang="en" class="${LANG === 'en' ? 'on' : ''}">EN</button></div><button class="btn io" id="shareb" aria-label="${L('Partager le site', 'Share the site')}" title="${L('Partager', 'Share')}">${ico('share')}</button><button class="btn io" id="theme" aria-label="${L('Thème', 'Theme')}">${ico('sun')}</button>${sb ? `<button class="btn" id="fbk" title="${L('Signaler un problème', 'Report a problem')}">${ico('flag')}<span class="hs">${L('Signaler', 'Report')}</span></button>` : ''}<span id="acct"></span>`;
  $('#dlgs').innerHTML = dialogs(); acct();
}
function runSearch(q) {
  q = q.trim().toLowerCase(); const out = $('#sr'); if (!out) return;
  const PG = [['#/home', L('Accueil', 'Home')], ['#/tier', 'Tier list'], ['#/teamtier', L('Tier list des équipes', 'Team tier list')], ['#/banners', L('Bannières', 'Banners')], ['#/compare', L('Comparateur', 'Compare')], ['#/calc', L('Calculateur', 'Calculator')], ['#/plan', L('Planificateur de tirages', 'Pull planner')], ['#/teams', L('Équipes', 'Teams')], ['#/next', L('Prochaine version', 'Next version')], ['#/versions', L('Résumé de version', 'Version recap')], ['#/events', L('Événements', 'Events')], ['#/stats', L('Statistiques', 'Statistics')], ['#/community', L('Communauté', 'Community')], ['#/profil', L('Mon profil', 'My profile')], ['#/settings', L('Paramètres', 'Settings')], ['#/legal', L('Mentions légales', 'Legal notice')], ['#/credits', L('Crédits', 'Credits')], ['#/end/moc', 'Memory of Chaos'], ['#/end/pf', 'Pure Fiction'], ['#/end/as', 'Apocalyptic Shadow']];
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
function render() {
  if (!D) return;
  const [, page = 'home', a, b] = location.hash.split('/'), key = page;
  if (key !== cur) { S = { q: '', e: '', p: '', r: '', own: '' }; document.title = 'Astrolabe — Honkai: Star Rail'; cur = key; }
  const full = '#/' + page + (a ? '/' + a : ''), links = [...document.querySelectorAll('.nv a')], nav = page === 'team' ? '#/teams' : null;
  let hit = links.filter(x => x.getAttribute('href') === full); if (!hit.length) hit = links.filter(x => x.getAttribute('href') === (nav || '#/' + page));
  links.forEach(x => x.classList.toggle('on', hit.includes(x)));
  const out = page === 'perso' && a ? detail(a, b) : page === 'fav' ? pages.profil('fav') : page === 'notfound' ? pages.notfound() : (pages[page] || pages.notfound)(a, b);
  app.innerHTML = out[0]; app.firstElementChild && app.firstElementChild.classList.add('fade'); resFn = out[1]; if (out[2]) out[2]();
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
  else if (ds.av) { prof.avatar = ds.av; saveProf(); render(); }
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
  else if (b.id === 'psave') { prof.name = $('#pn').value.trim(); if ($('#phd')) { prof.pub = $('#ppub').checked; prof.handle = $('#phd').value.trim().toLowerCase(); prof.bio = $('#pbio').value.trim(); prof.show = [0, 1, 2, 3, 4, 5].map(k => ({ c: $('#sc' + k).value, t: $('#st' + k).value.trim() })).filter(s => s.c); if (prof.pub && !/^[a-z0-9_-]{3,20}$/.test(prof.handle)) { pmsg = L('Nom d’utilisateur invalide : 3 à 20 caractères (a-z, 0-9, - et _).', 'Invalid username: 3–20 characters (a-z, 0-9, - and _).'); render(); return; } } saveProf().then(render); }
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
