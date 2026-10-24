(() => {
const CFG = window.CFG || {};
const im = (k, id) => (window.__IMG__ && window.__IMG__[k + '/' + id]) || `img/${k}/${id}.webp`;
const $ = s => document.querySelector(s), app = $('#app');
const EC = { Feu: '#ef5b3f', Glace: '#58c4ee', Foudre: '#b46cf5', Vent: '#3ed3a8', Physique: '#a7adbb', Quantique: '#6f7cf5', Imaginaire: '#f0c53a' };
const TIERS = ['SS', 'S+', 'S', 'A', 'B', 'C'], TV = { 'SS': '--SS', 'S+': '--Sp', 'S': '--S', 'A': '--A', 'B': '--B', 'C': '--C', '?': '--C' };
const IC = { home: 'M3 11l9-8 9 8M5 10v10h14V10', users: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M2 20c0-3.5 3-5.5 7-5.5s7 2 7 5.5M17 4.5a3.5 3.5 0 0 1 0 6.5M18 15c2.5.5 4 2.3 4 5', cone: 'M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5', box: 'M12 2l9 5v10l-9 5-9-5V7l9-5zM12 12l9-5M12 12v10M12 12L3 7', tier: 'M4 20V10M10 20V4M16 20v-8M22 20H2', end: 'M12 3a9 9 0 1 0 9 9M12 7.5a4.5 4.5 0 1 0 4.5 4.5M12 12h.01', cmp: 'M8 3L4 7l4 4M4 7h16M16 21l4-4-4-4M20 17H4', cal: 'M4 5h16v16H4zM4 10h16M9 3v4M15 3v4', book: 'M4 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4zM20 4h-6M20 4v14h-8', user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M4 21c0-4 4-6 8-6s8 2 8 6', star: 'M12 3l2.7 5.8 6.3.8-4.6 4.4 1.2 6.3L12 17.3 6.4 20.3l1.2-6.3L3 9.6l6.3-.8z', info: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M12 11v5M12 8h.01', calc: 'M5 3h14v18H5zM8 7h8M8 12h2M14 12h2M8 16h2M14 16h2' };
const ico = (n, c = '') => `<svg class="ic ${c}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="${IC[n]}"/></svg>`;
const NAV = [['', [['#/home', 'home', 'Accueil']]], ['Base de données', [['#/perso', 'users', 'Personnages'], ['#/lc', 'cone', 'Cônes de lumière'], ['#/rel', 'box', 'Reliques']]], ['Classements', [['#/tier', 'tier', 'Tier list'], ['#/banners', 'star', 'Bannières']]],
  ['End game', [['#/end/moc', 'end', 'Memory of Chaos'], ['#/end/pf', 'end', 'Pure Fiction'], ['#/end/as', 'end', 'Apocalyptic Shadow'], ['#/end/aa', 'end', 'Anomaly Arbitration']]],
  ['Outils', [['#/compare', 'cmp', 'Comparateur'], ['#/plan', 'calc', 'Planificateur']]], ['Guides', [['#/events', 'cal', 'Événements'], ['#/aide', 'book', 'Aides']]], ['Communauté', [['#/community', 'users', 'Joueurs']]], ['Compte', [['#/profil', 'user', 'Mon profil'], ['#/profil/fav', 'star', 'Favoris']]]];
let D, C, byId, LC, RS, user = null, sb = null, TM = 'ov';
let S = { q: '', e: '', p: '', r: '', own: '' };
const store = { get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} } };
let fav = store.get('astro_fav', { char: [], build: [] }), prof = Object.assign({ name: '', avatar: '', col: {}, handle: '', bio: '', pub: false, show: [] }, store.get('astro_prof', {}));
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmtD = d => new Date(d).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' });
const cdTxt = ms => { if (ms <= 0) return 'terminé'; const m = Math.floor(ms / 60000), d = Math.floor(m / 1440), h = Math.floor(m % 1440 / 60); return (d ? d + ' j ' : '') + h + ' h ' + (m % 60) + ' min'; };
function tick() { document.querySelectorAll('[data-cd]').forEach(e => e.textContent = (e.dataset.pre || '') + cdTxt(new Date(e.dataset.cd) - Date.now())); document.querySelectorAll('[data-cdd]').forEach(e => e.textContent = Math.max(0, Math.ceil((new Date(e.dataset.cdd) - Date.now()) / 864e5))); }
setInterval(tick, 30000);
let viewed = null, pmsg = '';

// ------------------------------------------------------------ compte, favoris, profil
const myStats = () => { const o = Object.keys(prof.col).filter(i => byId[i]); return { n: o.length, n5: o.filter(i => byId[i].r === 5).length, e: o.reduce((s, i) => s + prof.col[i], 0) }; };
const saveProf = async () => {
  store.set('astro_prof', prof); pmsg = '';
  if (!(sb && user)) return;
  const base = { user_id: user.id, display_name: prof.name, avatar: prof.avatar, updated_at: new Date().toISOString() };
  const full = { ...base, handle: prof.handle || null, bio: prof.bio, is_public: !!prof.pub && !!prof.handle, showcase: prof.show.filter(s => s.c), stats: myStats() };
  let { error } = await sb.from('profiles').upsert(full);
  if (error && /handle|unique|duplicate/i.test(error.message)) { pmsg = 'Ce nom d’utilisateur est déjà pris ou invalide (3 à 20 caractères : a-z, 0-9, - et _).'; ({ error } = await sb.from('profiles').upsert(base)); }
  else if (error) { pmsg = 'Profil public indisponible : exécutez supabase/schema_v3.sql. (' + error.message + ')'; ({ error } = await sb.from('profiles').upsert(base)); }
  else pmsg = 'Profil enregistré.';
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
  const [f, p, c] = await Promise.all([sb.from('favorites').select('kind,item_id'), sb.from('profiles').select('*').maybeSingle(), sb.from('collection').select('char_id,eidolon')]);
  const cloud = { char: [], build: [] }; (f.data || []).forEach(r => cloud[r.kind] && cloud[r.kind].push(r.item_id));
  const rows = []; ['char', 'build'].forEach(k => fav[k].forEach(id => { if (!cloud[k].includes(id)) { rows.push({ user_id: user.id, kind: k, item_id: id }); cloud[k].push(id); } }));
  if (rows.length) await sb.from('favorites').upsert(rows); fav = cloud; store.set('astro_fav', fav);
  if (!p.error) { if (p.data) { prof.name = p.data.display_name || prof.name; prof.avatar = p.data.avatar || prof.avatar; prof.handle = p.data.handle || prof.handle; prof.bio = p.data.bio ?? prof.bio; prof.pub = p.data.is_public ?? prof.pub; if (Array.isArray(p.data.showcase) && p.data.showcase.length) prof.show = p.data.showcase; } else if (prof.name || prof.avatar) saveProf(); }
  if (!c.error) {
    const cc = {}; (c.data || []).forEach(r => cc[r.char_id] = r.eidolon); const cr = [];
    Object.keys(prof.col).forEach(id => { if (!(id in cc)) { cr.push({ user_id: user.id, char_id: id, eidolon: prof.col[id] }); cc[id] = prof.col[id]; } });
    if (cr.length) await sb.from('collection').upsert(cr); prof.col = cc;
  }
  store.set('astro_prof', prof); render();
}
function acct() {
  const el = $('#acct'); if (!el) return;
  el.innerHTML = !sb ? '' : user ? `<button class="btn" id="out">Déconnexion</button>` : `<button class="btn" id="login">Connexion</button>`;
  const o = $('#out'); if (o) o.onclick = () => sb.auth.signOut();
  const l = $('#login'); if (l) l.onclick = () => { $('#msg').textContent = ''; $('#dlg').showModal(); };
}
function initAuth() {
  if (!CFG.SUPABASE_URL || !window.supabase) return acct();
  sb = window.supabase.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY);
  const msg = t => $('#msg').textContent = t, cred = () => ({ email: $('#em').value.trim(), password: $('#pw').value });
  $('#bin').onclick = async () => { const { error } = await sb.auth.signInWithPassword(cred()); if (error) msg(error.message); else $('#dlg').close(); };
  $('#bup').onclick = async () => { const { data, error } = await sb.auth.signUp(cred()); if (error) msg(error.message); else if (!data.session) msg('Compte créé. Vérifiez votre e-mail pour confirmer.'); else $('#dlg').close(); };
  $('#bfg').onclick = async () => { const { error } = await sb.auth.resetPasswordForEmail($('#em').value.trim(), { redirectTo: location.href.split('#')[0] }); msg(error ? error.message : 'E-mail de réinitialisation envoyé.'); };
  $('#bcl').onclick = () => $('#dlg').close();
  sb.auth.getSession().then(({ data }) => { user = data.session ? data.session.user : null; acct(); pullAll(); });
  sb.auth.onAuthStateChange((_e, s) => { user = s ? s.user : null; acct(); pullAll(); });
}

// ------------------------------------------------------------ composants
const tile = (c, o = {}) => `<a class="cd r${c.r}${o.s ? ' s' : ''}" href="#/perso/${c.id}" title="${c.n}"><span class="pt"><img src="${im('c', c.id)}" alt="" loading="lazy"><i class="el" style="background:${EC[c.e]}"></i></span><span class="nm">${c.n}</span>${o.sub ? `<em>${o.sub}</em>` : ''}</a>`;
const sec = t => `<div class="st">${t}</div>`;
const uniq = (a, k) => [...new Set(a.map(x => x[k]))].sort();
const chips = (arr, v, k, l, suf = '') => `<div class="fl"><span class="lab">${l}</span><button class="chip ${v === '' ? 'on' : ''}" data-f="${k}" data-v="">Tous</button>` + arr.map(x => `<button class="chip ${v == x ? 'on' : ''}" data-f="${k}" data-v="${x}">${x}${suf}</button>`).join('') + '</div>';
const sbox = ph => `<input type="search" id="q" placeholder="${ph}" value="${S.q}">`;
const has = n => n.toLowerCase().includes(S.q.toLowerCase());
const row = (img, n, t) => `<div class="row"><img src="${img}" alt=""><div><b>${n}</b><p>${t}</p></div></div>`;
const filtC = () => C.filter(c => (!S.e || c.e === S.e) && (!S.p || c.p === S.p) && (!S.r || c.r == S.r) && has(c.n));
const cbar = () => sbox('Rechercher un personnage…') + chips(uniq(C, 'e'), S.e, 'e', 'Élément') + chips(uniq(C, 'p'), S.p, 'p', 'Voie') + chips([5, 4], S.r, 'r', 'Rareté', '★');
const tchip = t => `<span class="tag tg" style="--tc:var(${TV[t]})">${t}</span>`;
const star = (kind, id, lab) => { const on = fav[kind].includes(id); return `<button class="btn ${on ? 'on' : ''}" data-fav="${kind}:${id}">${on ? '★' : '☆'} ${lab}</button>`; };
function board(cols) {
  const ok = new Set(filtC().map(c => c.id)), g = `grid-template-columns:78px repeat(${cols.length},minmax(0,1fr))`;
  return `<div class="bdp">${cols.length > 1 ? `<div class="bh" style="${g}"><span></span>${cols.map(c => `<span>${c[0]}</span>`).join('')}</div>` : ''}` + TIERS.map(t => `<div class="br" style="${g}"><div class="bl" style="--tc:var(${TV[t]})">${t}</div>${cols.map(c => `<div class="bc">${(c[1][t] || []).filter(i => ok.has(i) && byId[i]).map(i => tile(byId[i], { s: 1 })).join('')}</div>`).join('')}</div>`).join('') + '</div>';
}

// ------------------------------------------------------------ pages
const pages = {
  home() {
    const cards = [['#/tier', 'tier', 'Tier list', 'Par rôle et par mode end game'], ['#/perso', 'users', 'Personnages', 'Kit, build et équipes'], ['#/lc', 'cone', 'Cônes de lumière', 'Tous les cônes et leurs effets'], ['#/rel', 'box', 'Reliques', 'Sets et ornements planaires'], ['#/compare', 'cmp', 'Comparateur', 'Deux personnages côte à côte'], ['#/events', 'cal', 'Événements', 'Guides et calendrier']];
    return [`<h1>Astrolabe</h1><p class="lead">Le guide Honkai: Star Rail qui regroupe les meilleures sources au même endroit. Version ${D.version || ''}, données mises à jour le ${D.updated}.</p>
    <div class="g3">${cards.map(c => `<a class="sc" href="${c[0]}">${ico(c[1])}<b>${c[2]}</b><span>${c[3]}</span></a>`).join('')}</div>
    ${verBanner()}${sec('Bannières en ce moment')}${bannerCards(true)}${sec('Derniers personnages')}<div class="grid">${C.slice(0, 8).map(c => tile(c, { sub: c.e + ' · ' + c.p })).join('')}</div>
    ${sec('Calendrier end game')}<div class="card tw"><table><tr><th>Mode</th><th>Début</th><th>Fin</th></tr>${D.manual.schedule.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('')}</table></div>`];
  },
  tier() {
    const T = D.tiers, modes = [['ov', 'Vue d’ensemble', 'tier'], ['role', 'Par rôle', 'users'], ['moc', 'Memory of Chaos', 'end'], ['pf', 'Pure Fiction', 'end'], ['as', 'Apocalyptic Shadow', 'end']];
    const cols = TM === 'role' ? [['DPS', T.dps], ['Support', T.support], ['Sustain', T.sustain]] : [[null, T[TM]]], res = () => board(cols);
    return [`<h1>Tier list</h1><p class="lead">Version ${D.version || ''}, d’après Game8 : personnages à E0 avec leur équipement idéal. Un même personnage peut apparaître dans plusieurs rôles.</p>
    <div class="bigtabs">${modes.map(m => `<button class="${TM === m[0] ? 'on' : ''}" data-tm="${m[0]}">${ico(m[2])}${m[1]}</button>`).join('')}</div>${cbar()}<div id="res">${res()}</div>`, res];
  },
  perso() { const res = () => `<div class="grid">${filtC().map(c => tile(c, { sub: c.e + ' · ' + c.p })).join('')}</div>`; return [`<h1>Personnages</h1><p class="lead">${C.length} personnages. Cliquez sur l’un d’eux pour son kit, son build et ses équipes.</p>${cbar()}<div id="res">${res()}</div>`, res]; },
  lc() {
    const res = () => `<div class="g">${LC.filter(l => (!S.p || l.p === S.p) && (!S.r || l.r == S.r) && has(l.n)).map(l => `<div class="card" style="margin:0">${row(im('l', l.id), l.n, `${l.r}★ · ${l.p}`)}<p style="margin:8px 0 0;font-size:13.5px"><b>${l.k}</b> — ${l.d}</p></div>`).join('')}</div>`;
    return [`<h1>Cônes de lumière</h1><p class="lead">${LC.length} cônes. Les valeurs vont du rang 1 au rang 5.</p>${sbox('Rechercher un cône…')}${chips(uniq(LC, 'p'), S.p, 'p', 'Voie')}${chips([5, 4, 3], S.r, 'r', 'Rareté', '★')}<div id="res">${res()}</div>`, res];
  },
  rel() {
    const res = () => `<div class="g">${RS.filter(l => has(l.n)).map(l => `<div class="card" style="margin:0">${row(im('r', l.id), l.n, l.pl ? 'Ornement planaire' : 'Relique')}<p style="margin:8px 0 0;font-size:13.5px"><span class="lab">2 pièces</span> ${l.d[0]}</p>${l.d[1] ? `<p style="margin:6px 0 0;font-size:13.5px"><span class="lab">4 pièces</span> ${l.d[1]}</p>` : ''}</div>`).join('')}</div>`;
    return [`<h1>Reliques</h1><p class="lead">Ensembles de reliques (4 pièces) et ornements planaires (2 pièces).</p>${sbox('Rechercher un set…')}<div id="res">${res()}</div>`, res];
  },
  end(m) {
    m = m || 'moc'; const M = D.manual.modes[m] || ['Anomaly Arbitration', 'Mode de combat récurrent. Le classement par personnage n’est pas encore disponible sur le site.'], sch = D.manual.schedule.filter(r => r[0].includes(M[0]));
    const res = () => board([[null, D.tiers[m]]]);
    return [`<h1>${M[0]}</h1><p class="lead">${M[1]}</p>${sch.length ? `<div class="card tw"><table><tr><th>Phase</th><th>Début</th><th>Fin</th></tr>${sch.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('')}</table></div>` : ''}${D.tiers[m] ? sec('Classement des personnages') + cbar() + `<div id="res">${res()}</div>` : ''}
    <p class="note">Classement : Game8. Guides détaillés : ${D.manual.guides.map(g => `<a href="${g.u}" target="_blank" rel="noopener">${g.t}</a>`).join(' · ')}</p>`, D.tiers[m] ? res : null];
  },
  compare(a, b) {
    const opt = k => `<select data-cmp="${k}"><option value="">Choisir un personnage…</option>${[...C].sort((x, y) => x.n.localeCompare(y.n)).map(c => `<option value="${c.id}" ${c.id === (k === 'a' ? a : b) ? 'selected' : ''}>${c.n}</option>`).join('')}</select>`;
    const A = byId[a], B = byId[b]; let t = '<p class="sub">Choisissez deux personnages pour les comparer.</p>';
    if (A && B) {
      const nm = (arr, rs) => (arr || []).map(i => (rs.find(x => x.id === i) || {}).n).filter(Boolean).join(', ') || '—';
      const num = (l, f, suf = '') => { const x = f(A), y = f(B); return `<tr><td>${l}</td><td class="${x > y ? 'win' : ''}">${x}${suf}</td><td class="${y > x ? 'win' : ''}">${y}${suf}</td></tr>`; };
      const rk = (l, k) => { const x = A.tr[k], y = B.tr[k], ix = x ? TIERS.indexOf(x) : 9, iy = y ? TIERS.indexOf(y) : 9; return `<tr><td>${l}</td><td class="${ix < iy ? 'win' : ''}">${x || '—'}</td><td class="${iy < ix ? 'win' : ''}">${y || '—'}</td></tr>`; };
      const bb = (l, f) => `<tr><td>${l}</td><td>${f(A)}</td><td>${f(B)}</td></tr>`, lc = c => { const l = c.b && LC.find(x => x.id === c.b.lc); return l ? l.n : '—'; };
      const slots = { body: 'Corps', feet: 'Bottes', sphere: 'Sphère', rope: 'Corde' }, tm = c => ((c.b && c.b.teams[0]) || []).map(m => (byId[m.c] || {}).n).filter(n => n && n !== c.n).join(', ') || '—';
      t = `<div class="card tw"><table><tr><th></th><th>${tile(A, { s: 1 })}</th><th>${tile(B, { s: 1 })}</th></tr>
      ${rk('Tier général', 'ov')}${rk('Rôle DPS', 'dps')}${rk('Rôle Support', 'support')}${rk('Rôle Sustain', 'sustain')}${rk('Memory of Chaos', 'moc')}${rk('Pure Fiction', 'pf')}${rk('Apocalyptic Shadow', 'as')}
      ${num('PV', c => c.st.hp)}${num('ATQ', c => c.st.atk)}${num('DÉF', c => c.st.def)}${num('VIT', c => c.st.spd)}${num('Taux crit', c => c.st.cr, '%')}${num('DGT crit', c => c.st.cd, '%')}${num('Énergie', c => c.st.sp)}
      ${bb('Cône', lc)}${bb('Reliques', c => nm((c.b.rel || []).map(p => p[0]), RS))}${bb('Ornements', c => nm(c.b.orn, RS))}${Object.keys(slots).map(k => bb(slots[k], c => (c.b.parts[k] || []).join(' / ') || '—')).join('')}${bb('Sous-stats', c => (c.b.subs || []).slice(0, 4).join(' > '))}${bb('Équipe type', tm)}</table></div>`;
    }
    return [`<h1>Comparateur</h1><p class="lead">Deux personnages côte à côte : classements, stats, build et équipe. Le meilleur chiffre est mis en avant.</p><div class="g">${opt('a')}${opt('b')}</div>${t}`];
  },
  events() {
    const now = new Date().toISOString().slice(0, 10), ord = { 'En cours': 0, 'À venir': 1, '': 2, 'Terminé': 3 };
    const L = (D.events || []).filter(e => !e.hidden).map(e => ({ ...e, st: e.start && e.end ? (now < e.start ? 'À venir' : now > e.end ? 'Terminé' : 'En cours') : '' })).sort((a, b) => ord[a.st] - ord[b.st]);
    const ul = (t, a) => a && a.length ? `<div class="lab">${t}</div><ul>${a.map(x => `<li>${x}</li>`).join('')}</ul>` : '';
    return [`<h1>Événements et guides</h1><p class="lead">Un guide par événement et par mode end game. Le contenu se modifie dans le fichier <b>data/events.json</b>.</p>${L.map(e => `<details class="ev"><summary><b>${e.title}</b><span class="tag">${e.type || 'Guide'}</span>${e.st ? `<span class="tag ${e.st === 'En cours' ? 'tg' : ''}" style="--tc:var(--A)">${e.st}</span>` : ''}${e.start ? `<span class="sub">${e.start} → ${e.end}</span>` : ''}</summary><div><p>${e.summary || ''}</p>${ul('Étapes', e.steps)}${ul('Conseils', e.tips)}${ul('Récompenses', e.rewards)}${e.link ? `<a href="${e.link}" target="_blank" rel="noopener">Source</a>` : ''}</div></details>`).join('') || '<p class="sub">Aucun événement pour l’instant.</p>'}`];
  },
  plan() {
    return [`<h1>Planificateur de tirages</h1><p class="lead">Estimez vos tirages disponibles et la distance jusqu’à la garantie.</p><div class="card"><div class="g3"><label>Jade stellaire<input type="number" id="j" value="0" min="0"></label><label>Passes spéciaux<input type="number" id="t" value="0" min="0"></label><label>Pity actuel<input type="number" id="p" value="0" min="0" max="89"></label></div><p id="po" style="margin:0"></p></div>`, null, () => { const f = () => { const j = +$('#j').value || 0, t = +$('#t').value || 0, p = +$('#p').value || 0, n = Math.floor((j + t * 160) / 160); $('#po').innerHTML = `<b>${n}</b> tirages disponibles · garantie à 90 : encore <b>${Math.max(0, 90 - p - n)}</b> tirage(s) à trouver`; }; ['j', 't', 'p'].forEach(i => $('#' + i).oninput = f); f(); }];
  },
  aide() {
    return [`<h1>Aides</h1><p class="lead">Tout pour progresser sans se perdre.</p>
    <div class="card"><h2>Stats principales des reliques</h2><div class="tw"><table><tr><th>Emplacement</th><th>Options</th></tr><tr><td>Corps</td><td>Taux/DGT crit, Soins, Taux d’effet, ATQ%, PV%, DÉF%</td></tr><tr><td>Bottes</td><td>VIT, ATQ%, PV%, DÉF%</td></tr><tr><td>Sphère</td><td>Dégâts élémentaires, ATQ%, PV%, DÉF%</td></tr><tr><td>Corde</td><td>Effet de rupture, Recharge d’énergie, ATQ%, PV%, DÉF%</td></tr></table></div></div>
    <div class="g"><div class="card"><h2>Débuter</h2><p class="sub" style="margin:0">Finissez l’histoire principale, puis construisez un DPS, un soutien et un soigneur.</p></div><div class="card"><h2>Farm efficace</h2><p class="sub" style="margin:0">Dépensez l’énergie sur les domaines de reliques de votre principal et verrouillez les bonnes pièces.</p></div><div class="card"><h2>Tirages</h2><p class="sub" style="margin:0">Gardez vos jades pour les personnages dont vous avez vraiment besoin.</p></div></div>
    ${sec('Guides externes')}<div class="card">${D.manual.guides.map(g => `<p style="margin:4px 0"><a href="${g.u}" target="_blank" rel="noopener">${g.t}</a></p>`).join('')}</div>`];
  },
  profil(tab) {
    tab = tab || 'col'; const own = Object.keys(prof.col).filter(i => byId[i]), n5 = own.filter(i => byId[i].r === 5).length, eids = own.reduce((s, i) => s + prof.col[i], 0);
    const name = prof.name || (user ? user.email.split('@')[0] : 'Voyageur'), since = user ? `Membre depuis le ${new Date(user.created_at).toLocaleDateString('fr-FR')}` : 'Profil local, enregistré dans ce navigateur';
    const teams = new Map(); own.forEach(i => ((byId[i].b || {}).teams || []).forEach(t => { const ids = [...new Set([i, ...t.map(m => m.c)])]; if (ids.length >= 3 && ids.length <= 4 && ids.every(x => x in prof.col)) teams.set([...ids].sort().join('-'), ids); }));
    const banner = !sb ? '' : user ? '' : `<div class="card" style="display:flex;gap:14px;align-items:center;flex-wrap:wrap"><span>Connectez-vous pour retrouver votre collection et vos favoris sur tous vos appareils.</span><button class="btn" id="login2">Connexion</button></div>`;
    const tabs = [['col', 'Collection', 'users'], ['fav', 'Favoris', 'star'], ['teams', 'Équipes possibles', 'cmp'], ['set', 'Paramètres', 'info']];
    let body = '', res = null;
    if (tab === 'col') {
      res = () => `<div class="grid">${C.filter(c => (!S.e || c.e === S.e) && (!S.p || c.p === S.p) && (!S.r || c.r == S.r) && has(c.n) && (!S.own || (S.own === 'Possédés') === (c.id in prof.col))).map(c => { const on = c.id in prof.col; return `<div style="width:88px"><button class="cd own r${c.r}${on ? ' on' : ''}" data-own="${c.id}"><span class="pt"><img src="${im('c', c.id)}" alt="" loading="lazy"><i class="el" style="background:${EC[c.e]}"></i>${on ? `<b class="bd">E${prof.col[c.id]}</b>` : ''}</span><span class="nm">${c.n}</span></button>${on ? `<select data-eid="${c.id}" style="width:88px;padding:3px;margin:4px 0 0;font-size:12px">${[0, 1, 2, 3, 4, 5, 6].map(e => `<option value="${e}" ${prof.col[c.id] == e ? 'selected' : ''}>E${e}</option>`).join('')}</select>` : ''}</div>`; }).join('')}</div>`;
      body = `<p class="sub">Cliquez sur un personnage pour l’ajouter à votre collection, puis choisissez son éidolon.</p>${cbar()}${chips(['Possédés', 'Manquants'], S.own, 'own', 'Statut')}<div id="res">${res()}</div>`;
    } else if (tab === 'fav') {
      const fc = C.filter(c => fav.char.includes(c.id)), fb = C.filter(c => fav.build.includes(c.id));
      body = sec('Personnages favoris') + (fc.length ? `<div class="grid">${fc.map(c => tile(c, { sub: c.e + ' · ' + c.p })).join('')}</div>` : '<p class="sub">Aucun pour l’instant. Cliquez sur « Personnage favori » dans une fiche.</p>') + sec('Builds favoris') + (fb.length ? fb.map(c => `<div class="card" style="display:flex;gap:14px;align-items:center">${tile(c, { s: 1 })}<div><b>${c.n}</b><br><span class="sub">${c.b ? c.b.subs.slice(0, 4).join(' > ') : ''}</span><br><a href="#/perso/${c.id}/build">Voir le build</a></div></div>`).join('') : '<p class="sub">Aucun pour l’instant. Cliquez sur « Build favori » dans une fiche.</p>');
    } else if (tab === 'teams') {
      body = `<p class="sub">Équipes du site dont tous les membres sont dans votre collection.</p>` + ([...teams.values()].slice(0, 30).map(ids => `<div class="team">${ids.map(i => tile(byId[i], { s: 1 })).join('')}</div>`).join('') || '<p class="sub">Aucune équipe complète pour l’instant. Ajoutez des personnages dans l’onglet Collection.</p>');
    } else {
      const sorted = [...C].sort((x, y) => x.n.localeCompare(y.n)), shw = Array.from({ length: 6 }, (_, k) => prof.show[k] || { c: '', t: '' });
      body = `<div class="card"><h2>Profil</h2><label class="lab">Pseudo affiché</label><input type="text" id="pn" value="${esc(prof.name)}" placeholder="Votre pseudo" maxlength="24">
      <p class="lab" style="margin-top:6px">Avatar</p><div class="grid" style="max-height:190px;overflow:auto;margin-bottom:12px">${C.map(c => `<button class="cd s ${prof.avatar === c.id ? 'on' : ''}" data-av="${c.id}" style="opacity:${prof.avatar === c.id ? 1 : .75}"><span class="pt" style="${prof.avatar === c.id ? 'border-color:var(--ac)' : ''}"><img src="${im('c', c.id)}" alt="" loading="lazy"></span></button>`).join('')}</div></div>
      <div class="card"><h2>Profil public (communauté)</h2>${!sb || !user ? '<p class="sub">Connectez-vous pour partager votre profil avec la communauté.</p>' : `<label style="display:flex;gap:8px;align-items:center;margin-bottom:12px"><input type="checkbox" id="ppub" ${prof.pub ? 'checked' : ''} style="width:auto;margin:0"> Rendre mon profil public (désactivé par défaut)</label>
      <label class="lab">Nom d’utilisateur (adresse du profil)</label><input type="text" id="phd" value="${esc(prof.handle)}" placeholder="ex. mon-pseudo" maxlength="20">
      <label class="lab">Présentation (200 caractères max.)</label><input type="text" id="pbio" value="${esc(prof.bio)}" maxlength="200" placeholder="Une phrase sur vous">
      <p class="lab" style="margin-top:8px">Vitrine : jusqu’à 6 personnages à mettre en avant</p>${shw.map((s, k) => `<div class="slot"><select id="sc${k}"><option value="">— Emplacement ${k + 1} —</option>${sorted.map(c => `<option value="${c.id}" ${s.c === c.id ? 'selected' : ''}>${esc(c.n)}</option>`).join('')}</select><input type="text" id="st${k}" value="${esc(s.t)}" maxlength="80" placeholder="Commentaire court (80 caractères)"></div>`).join('')}
      <p class="sub" style="font-size:12.5px">Seuls le pseudo, l’avatar, la présentation, les chiffres de collection et la vitrine sont publics. Jamais votre e-mail ni votre collection complète.</p>`}
      <button class="btn" id="psave">Enregistrer</button> ${prof.pub && prof.handle ? `<a href="#/community/${esc(prof.handle)}" style="margin-left:10px">Voir mon profil public</a>` : ''}<p class="sub">${esc(pmsg)}</p></div>
      <div class="card"><h2>Données</h2><p class="sub">Les données de ce navigateur ${sb ? 'sont synchronisées avec votre compte quand vous êtes connecté.' : 'restent dans ce navigateur.'}</p><button class="btn" id="preset">Vider la collection</button></div>`;
    }
    return [`<div class="ph">${prof.avatar && byId[prof.avatar] ? `<img class="av" src="${im('c', prof.avatar)}" alt="">` : `<div class="av">${name[0].toUpperCase()}</div>`}<div><h1>${esc(name)}</h1><span class="sub">${since}</span></div></div>${banner}
    <div class="g3"><div class="stat"><span class="lab">Personnages</span><b>${own.length} / ${C.length}</b></div><div class="stat"><span class="lab">5★ possédés</span><b>${n5}</b></div><div class="stat"><span class="lab">Éidolons cumulés</span><b>${eids}</b></div><div class="stat"><span class="lab">Favoris</span><b>${fav.char.length + fav.build.length}</b></div></div>
    <div class="bigtabs">${tabs.map(t => `<a class="${tab === t[0] ? 'on' : ''}" href="#/profil/${t[0]}">${ico(t[2])}${t[1]}</a>`).join('')}</div>${body}`, res, () => { const l = $('#login2'); if (l) l.onclick = () => $('#dlg').showModal(); }];
  }
};
function verBanner() {
  const nx = D.banners && D.banners.next; if (!nx) return '';
  const d = Math.ceil((new Date(nx.date) - Date.now()) / 864e5);
  return `<a class="vs" href="#/banners"><div><span class="lab">Prochaine version</span><b>Version ${esc(nx.version)}</b><span class="sub">${esc(nx.headliner || '')}</span></div><div class="vn"><b data-cdd="${nx.date}">${Math.max(0, d)}</b><span>jours</span></div><div><span class="ct" data-cd="${nx.date}"></span><br><span class="sub">${nx.estimated ? 'Date estimée, à confirmer' : 'Date confirmée'}</span></div></a>`;
}
function bannerCards(short) {
  const B = (D.banners && D.banners.list) || [], now = Date.now();
  const L = B.filter(b => !b.end || new Date(b.end) > now).sort((x, y) => (x.end ? new Date(x.end) : 9e15) - (y.end ? new Date(y.end) : 9e15));
  if (!L.length) return '<p class="sub">Aucune bannière renseignée.</p>';
  return L.map(b => { const up = new Date(b.start) > now; return `<div class="card bn"><div class="bnimg">${b.chars.map(i => byId[i] ? `<a href="#/perso/${i}"><img src="${im('p', i)}" alt="${esc(byId[i].n)}"></a>` : '').join('')}</div><div><span class="tag tg" style="--tc:var(--ac)">${esc(b.kind)}</span><span class="tag">${up ? 'À venir' : 'En cours'}</span>
  <h2 style="margin:8px 0 4px">${b.chars.map(i => byId[i] ? esc(byId[i].n) : '').join(' + ')}</h2>
  ${b.lcs.map(i => { const l = LC.find(x => x.id === i); return l ? `<div class="row" style="padding:6px 0"><img src="${im('l', i)}" alt="" style="width:36px;height:36px"><div><b>${esc(l.n)}</b></div></div>` : ''; }).join('')}
  <p class="ct" style="margin:8px 0 2px" ${up ? `data-cd="${b.start}" data-pre="Démarre dans "` : b.end ? `data-cd="${b.end}" data-pre="Se termine dans "` : ''}>${b.end || up ? '' : 'Sans date de fin annoncée'}</p>
  <span class="sub" style="font-size:13px">${fmtD(b.start)} → ${b.end ? fmtD(b.end) : 'non annoncée'}</span></div></div>`; }).join('');
}
pages.banners = () => {
  const r = (D.banners && D.banners.rateup4) || [];
  return [`<h1>Bannières</h1><p class="lead">Les bannières en cours et à venir, avec le temps restant. Dates à l’heure de votre appareil, mises à jour par le site chaque semaine.</p>${verBanner()}${sec('En cours et à venir')}${bannerCards()}${r.length ? sec('Personnages 4★ à taux augmenté') + `<div class="grid">${r.map(i => byId[i] ? tile(byId[i]) : '').join('')}</div>` : ''}<p class="note">Les dates de bannières viennent de data/banners.json, mis à jour à chaque phase. Sources : Game8, Prydwen et HoYoverse.</p>`, null, tick];
};
pages.community = h => {
  if (!sb) return ['<h1>Communauté</h1><p class="lead">La communauté nécessite les comptes (Supabase) : renseignez config.js.</p>'];
  if (h) return [`<div id="cm"><p class="sub">Chargement…</p></div>`, null, () => loadProfile(h)];
  return [`<h1>Communauté</h1><p class="lead">Les profils que les joueurs ont choisi de rendre publics : pseudo, avatar, collection en chiffres et vitrine de personnages. Rendez le vôtre public dans Mon profil → Paramètres.</p><div id="cm" class="g3"><p class="sub">Chargement…</p></div>`, null, async () => {
    const { data, error } = await sb.from('profiles').select('handle,display_name,avatar,stats,bio').eq('is_public', true).not('handle', 'is', null).order('updated_at', { ascending: false }).limit(48);
    const el = $('#cm'); if (!el) return;
    el.innerHTML = error ? '<p class="sub">Communauté indisponible : exécutez supabase/schema_v3.sql.</p>' : (data || []).map(p => `<a class="sc" href="#/community/${esc(p.handle)}">${p.avatar && byId[p.avatar] ? `<img class="av" style="width:56px;height:56px;margin-bottom:8px" src="${im('c', p.avatar)}" alt="">` : ''}<b>${esc(p.display_name || p.handle)}</b><span>@${esc(p.handle)} · ${p.stats && p.stats.n != null ? p.stats.n + ' personnages' : ''}</span></a>`).join('') || '<p class="sub">Aucun profil public pour l’instant. Soyez le premier !</p>';
  }];
};
async function loadProfile(h) {
  const el = $('#cm'); if (!el) return;
  const { data: p } = await sb.from('profiles').select('*').eq('handle', h).eq('is_public', true).maybeSingle();
  if (!p) { el.innerHTML = '<h1>Profil introuvable</h1><p class="sub">Ce profil n’existe pas ou n’est pas public.</p>'; return; }
  viewed = p; const [{ count }, mine] = await Promise.all([sb.from('profile_likes').select('*', { count: 'exact', head: true }).eq('profile_id', p.user_id), user ? sb.from('profile_likes').select('profile_id').eq('profile_id', p.user_id).eq('user_id', user.id) : { data: [] }]);
  const liked = !!(mine.data && mine.data.length), st = p.stats || {};
  const sh = (Array.isArray(p.showcase) ? p.showcase : []).filter(s => byId[s.c]).slice(0, 6);
  el.innerHTML = `<a class="back" href="#/community" style="color:var(--ac)">← Communauté</a><div class="ph">${p.avatar && byId[p.avatar] ? `<img class="av" src="${im('c', p.avatar)}" alt="">` : `<div class="av">${esc((p.display_name || p.handle)[0].toUpperCase())}</div>`}<div><h1>${esc(p.display_name || p.handle)}</h1><span class="sub">@${esc(p.handle)}</span><p style="margin:8px 0 0">${esc(p.bio || '')}</p></div></div>
  <div class="g3"><div class="stat"><span class="lab">Personnages</span><b>${st.n ?? '—'}</b></div><div class="stat"><span class="lab">5★</span><b>${st.n5 ?? '—'}</b></div><div class="stat"><span class="lab">Éidolons cumulés</span><b>${st.e ?? '—'}</b></div><div class="stat"><span class="lab">J’aime</span><b>${count || 0}</b></div></div>
  <div style="display:flex;gap:8px;margin:14px 0;flex-wrap:wrap">${user ? `<button class="btn ${liked ? 'on' : ''}" data-like="1">${liked ? '♥ J’aime' : '♡ J’aime'}</button><button class="btn" data-report="1">Signaler</button>` : '<span class="sub">Connectez-vous pour aimer ou signaler ce profil.</span>'}</div>
  ${sec('Vitrine')}${sh.length ? sh.map(s => { const c = byId[s.c]; return `<div class="card" style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">${tile(c, { sub: c.e + ' · ' + c.p })}<div style="flex:1;min-width:200px"><p style="margin:0 0 6px">${esc(s.t || '')}</p><a href="#/perso/${c.id}/build">Voir le build recommandé</a></div></div>`; }).join('') : '<p class="sub">Vitrine vide.</p>'}`;
}
const slotName = { body: 'Corps', feet: 'Bottes', sphere: 'Sphère', rope: 'Corde' };
function buildView(c) {
  const b = c.b; if (!b) return '<p class="sub">Pas de build disponible.</p>';
  const lc = b.lc && LC.find(l => l.id === b.lc), setRow = (id, f) => { const s = RS.find(x => x.id === id); return s ? row(im('r', id), s.n, f(s)) : ''; };
  const rel = (b.rel || []).map(p => p[0] === p[1] ? setRow(p[0], s => '4 pièces : ' + s.d[s.d.length - 1]) : setRow(p[0], s => '2 pièces : ' + s.d[0]) + setRow(p[1], s => '2 pièces : ' + s.d[0])).join('');
  const orn = (b.orn || []).map(i => setRow(i, s => '2 pièces : ' + s.d[0])).join('');
  const teams = (b.teams || []).map(t => `<div class="team">${[{ c: c.id, l: b.lc }, ...t.filter(m => m.c !== c.id)].map(m => { const x = byId[m.c], l = m.l && LC.find(z => z.id === m.l); return x ? tile(x, { sub: l ? l.n : '' }) : ''; }).join('')}</div>`).join('');
  const src = b.curated ? 'Sets et équipes vérifiés à la main.' : b.fallback ? 'Sets indicatifs : les plus utilisés par les personnages de la même voie.' : 'Données communautaires HSR Optimizer.';
  return `<div class="g"><div class="card"><h2>Cône de lumière</h2>${lc ? row(im('l', lc.id), lc.n, `${lc.k} — ${lc.d}`) : '<p class="sub">Non renseigné.</p>'}<h2 style="margin-top:18px">Reliques</h2>${rel || '<p class="sub">Non renseigné.</p>'}<h2 style="margin-top:18px">Ornements planaires</h2>${orn || '<p class="sub">Non renseigné.</p>'}</div>
  <div class="card"><h2>Stats à viser</h2><div class="tw"><table><tr><th>Pièce</th><th>Stat principale</th></tr>${Object.keys(slotName).map(k => `<tr><td>${slotName[k]}</td><td>${(b.parts[k] || []).join(' / ') || '—'}</td></tr>`).join('')}</table></div><p class="lab" style="margin:14px 0 6px">Sous-stats par priorité</p>${(b.subs || []).map((s, i) => `<span class="pill">${i + 1}. ${s}</span>`).join('')}</div></div>
  ${sec('Équipes conseillées')}${teams || '<p class="sub">Pas d’équipe renseignée pour l’instant.</p>'}${b.teams_from_others ? '<p class="note" style="margin-top:0">Équipes tirées des builds d’autres personnages où celui-ci apparaît.</p>' : ''}<p class="note">${src} À adapter à vos pièces et à votre équipe.</p>`;
}
function detail(id, tab) {
  const c = byId[id]; if (!c) return ['<p class="sub">Personnage introuvable.</p>']; tab = tab || 'kit'; document.title = c.n + ' — Astrolabe';
  const f = (l, v) => `<div><dt>${l}</dt><dd>${v}</dd></div>`, s = c.st;
  const tabs = [['kit', 'Kit', 'info'], ['build', 'Build & équipes', 'cone'], ['rank', 'Classements', 'end'], ['eid', 'Éidolons', 'star']];
  const R = { ov: 'Vue d’ensemble', dps: 'Rôle DPS', support: 'Rôle Support', sustain: 'Rôle Sustain', moc: 'Memory of Chaos', pf: 'Pure Fiction', as: 'Apocalyptic Shadow' };
  let body = '';
  if (tab === 'kit') body = `${sec('Caractéristiques (niveau 80)')}<div class="card"><dl>${f('PV', s.hp)}${f('ATQ', s.atk)}${f('DÉF', s.def)}${f('VIT', s.spd)}${f('Taux crit', s.cr + '%')}${f('DGT crit', s.cd + '%')}${f('Aggro', s.ta)}${f('Énergie', s.sp)}</dl></div>${sec('Compétences')}<div class="card">${c.s.map(k => `<div class="sk"><small>${k.t}</small><b>${k.n}</b><p>${k.d}</p></div>`).join('')}</div>`;
  else if (tab === 'build') body = buildView(c);
  else if (tab === 'rank') body = `${sec('Classements (Game8)')}<div class="card tw"><table><tr><th>Classement</th><th>Tier</th></tr>${Object.keys(R).map(k => `<tr><td>${R[k]}</td><td>${c.tr[k] ? tchip(c.tr[k]) : '<span class="sub">—</span>'}</td></tr>`).join('')}</table></div>`;
  else body = `${sec('Éidolons')}<div class="card">${c.x.map((k, i) => `<div class="sk"><small>E${i + 1}</small><b>${k.n}</b><p>${k.d}</p></div>`).join('')}</div>`;
  return [`<div class="hero"><img src="${im('p', c.id)}" alt="${c.n}"><div><h1>${c.n}</h1><span class="tag">${'★'.repeat(c.r)}</span><span class="tag" style="color:${EC[c.e]};border-color:${EC[c.e]}">${c.e}</span><span class="tag">${c.p}</span>${tchip(c.t)}
  <p class="sub" style="max-width:520px">Tier ${c.t} en vue d’ensemble. ${c.tr.dps ? 'Rôle DPS : ' + c.tr.dps + '. ' : ''}${c.tr.support ? 'Rôle Support : ' + c.tr.support + '. ' : ''}${c.tr.sustain ? 'Rôle Sustain : ' + c.tr.sustain + '.' : ''}</p>
  <div style="display:flex;gap:8px;flex-wrap:wrap">${star('char', c.id, 'Personnage favori')}${star('build', c.id, 'Build favori')}<a class="btn" href="#/compare/${c.id}">Comparer</a></div></div></div>
  <div class="bigtabs">${tabs.map(t => `<a class="${tab === t[0] ? 'on' : ''}" href="#/perso/${id}/${t[0]}">${ico(t[2])}${t[1]}</a>`).join('')}</div><div class="fade">${body}</div>`];
}

// ------------------------------------------------------------ routeur
let cur = '', resFn = null;
function render() {
  if (!D) return;
  const [, page = 'home', a, b] = location.hash.split('/'), key = page;
  if (key !== cur) { S = { q: '', e: '', p: '', r: '', own: '' }; document.title = 'Astrolabe — Honkai: Star Rail'; cur = key; }
  const full = '#/' + page + (a ? '/' + a : '');
  document.querySelectorAll('.nv a').forEach(x => x.classList.toggle('on', x.getAttribute('href') === full || (!a && x.getAttribute('href') === '#/' + page) || (page === 'perso' && x.getAttribute('href') === '#/perso')));
  const out = page === 'perso' && a ? detail(a, b) : page === 'fav' ? pages.profil('fav') : (pages[page] || pages.home)(a, b);
  app.innerHTML = out[0]; app.firstElementChild && app.firstElementChild.classList.add('fade'); resFn = out[1]; if (out[2]) out[2]();
  tick(); const q = $('#q'); if (q && resFn) q.oninput = e => { S.q = e.target.value; $('#res').innerHTML = resFn(); };
}
document.addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  if (b.dataset.f) { S[b.dataset.f] = b.dataset.v; render(); }
  else if (b.dataset.tm) { TM = b.dataset.tm; render(); }
  else if (b.dataset.fav) { const [k, i] = b.dataset.fav.split(':'); toggleFav(k, i); }
  else if (b.dataset.own) { const i = b.dataset.own; setOwn(i, i in prof.col ? null : 0); const q = $('#q'); render(); }
  else if (b.dataset.av) { prof.avatar = b.dataset.av; saveProf(); render(); }
  else if (b.id === 'psave') { prof.name = $('#pn').value.trim(); if ($('#phd')) { prof.pub = $('#ppub').checked; prof.handle = $('#phd').value.trim().toLowerCase(); prof.bio = $('#pbio').value.trim(); prof.show = [0, 1, 2, 3, 4, 5].map(k => ({ c: $('#sc' + k).value, t: $('#st' + k).value.trim() })).filter(s => s.c); if (prof.pub && !/^[a-z0-9_-]{3,20}$/.test(prof.handle)) { pmsg = 'Nom d’utilisateur invalide : 3 à 20 caractères (a-z, 0-9, - et _).'; render(); return; } } saveProf().then(render); }
  else if (b.dataset.like) { const p = viewed; sb.from('profile_likes').select('profile_id').eq('profile_id', p.user_id).eq('user_id', user.id).then(async r => { if (r.data && r.data.length) await sb.from('profile_likes').delete().match({ profile_id: p.user_id, user_id: user.id }); else await sb.from('profile_likes').insert({ profile_id: p.user_id, user_id: user.id }); loadProfile(p.handle); }); }
  else if (b.dataset.report) { const r = prompt('Pourquoi signalez-vous ce profil ?'); if (r && r.trim()) sb.from('reports').insert({ profile_id: viewed.user_id, reason: r.trim().slice(0, 300) }).then(x => alert(x.error ? 'Échec du signalement.' : 'Merci, le signalement a été envoyé.')); }
  else if (b.id === 'preset') { if (confirm('Vider toute la collection ?')) { Object.keys(prof.col).forEach(i => setOwn(i, null)); render(); } }
  else if (b.id === 'burger') $('#side').classList.toggle('open');
  else if (b.id === 'theme') { const t = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; document.documentElement.dataset.theme = t; store.set('astro_theme', t); }
});
document.addEventListener('change', e => {
  const t = e.target; if (t.dataset.eid) setOwn(t.dataset.eid, +t.value).then(render);
  else if (t.dataset.cmp) { const [, , a, b] = location.hash.split('/'), v = t.value, na = t.dataset.cmp === 'a' ? v : a || '', nb = t.dataset.cmp === 'b' ? v : b || ''; location.hash = `#/compare/${na}/${nb}`; }
});
window.addEventListener('hashchange', () => { $('#side').classList.remove('open'); render(); scrollTo(0, 0); });
document.documentElement.dataset.theme = store.get('astro_theme', 'dark');
$('#side').innerHTML = `<a class="brand" href="#/home" style="color:var(--tx)"><svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="20" cy="20" r="16"/><circle cx="20" cy="20" r="9"/><path d="M20 4v32M4 20h32M9 9l22 22M31 9L9 31" opacity=".5"/></svg><div><b>Astrolabe</b><small id="ver"></small></div></a>
<nav class="nv">${NAV.map(g => (g[0] ? `<h4>${g[0]}</h4>` : '') + g[1].map(i => `<a href="${i[0]}">${ico(i[1])}${i[2]}</a>`).join('')).join('')}</nav><div class="sf"><button class="btn" id="theme">Thème</button><span id="acct"></span></div>`;
(window.__DATA__ ? Promise.resolve(window.__DATA__) : fetch('data/data.json').then(r => r.json())).then(d => {
  D = d; C = d.chars; LC = d.lcs; RS = d.sets; byId = Object.fromEntries(C.map(c => [c.id, c])); $('#ver').textContent = `HSR v${d.version || ''} · ${d.updated}`;
  render(); initAuth();
}).catch(() => { app.innerHTML = '<p class="sub">Impossible de charger les données.</p>'; });
})();
