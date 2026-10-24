(() => {
const CFG = window.CFG || {};
const im = (k, id) => (window.__IMG__ && window.__IMG__[k + '/' + id]) || `img/${k}/${id}.webp`;
const $ = s => document.querySelector(s), app = $('#app');
const TN = ['SS', 'S+', 'S', 'A', 'B', 'C', '?'], TV = { 'SS': '--SS', 'S+': '--Sp', 'S': '--S', 'A': '--A', 'B': '--B', 'C': '--C', '?': '--C' };
let D, C, byId, LC, RS, user = null, sb = null;
let S = { q: '', e: '', p: '', r: '', mode: 'moc' };
const store = { get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} } };
let fav = store.get('astro_fav', { char: [], build: [] });

// ---------------------------------------------------------------- favoris (local + compte)
async function toggleFav(kind, id) {
  const a = fav[kind], on = a.includes(id);
  fav[kind] = on ? a.filter(x => x !== id) : [...a, id];
  store.set('astro_fav', fav);
  if (sb && user) {
    if (on) await sb.from('favorites').delete().match({ user_id: user.id, kind, item_id: id });
    else await sb.from('favorites').upsert({ user_id: user.id, kind, item_id: id });
  }
  render();
}
async function pullFavs() {
  if (!sb || !user) return;
  const { data } = await sb.from('favorites').select('kind,item_id');
  const cloud = { char: [], build: [] };
  (data || []).forEach(r => cloud[r.kind] && cloud[r.kind].push(r.item_id));
  const rows = [];
  ['char', 'build'].forEach(k => fav[k].forEach(id => { if (!cloud[k].includes(id)) { rows.push({ user_id: user.id, kind: k, item_id: id }); cloud[k].push(id); } }));
  if (rows.length) await sb.from('favorites').upsert(rows);
  fav = cloud; store.set('astro_fav', fav); render();
}
function acct() {
  const el = $('#acct');
  if (!sb) { el.innerHTML = ''; return; }
  el.innerHTML = user ? `<span class="sub2">${user.email}</span> <button class="btn" id="out">Déconnexion</button>` : `<button class="btn" id="login">Connexion</button>`;
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
  sb.auth.getSession().then(({ data }) => { user = data.session ? data.session.user : null; acct(); pullFavs(); });
  sb.auth.onAuthStateChange((_e, s) => { user = s ? s.user : null; acct(); pullFavs(); });
}

// ---------------------------------------------------------------- composants
const uni = (c, t) => `<a class="u r${c.r}" href="#/perso/${c.id}"><img src="${im('c', c.id)}" alt="" loading="lazy"><span>${c.n}</span>${t ? `<i>${c.e} · ${c.p}</i>` : ''}</a>`;
const uniq = (a, k) => [...new Set(a.map(x => x[k]))].sort();
const chips = (arr, v, k, l) => `<div class="fl"><span class="lab">${l}</span><button class="chip ${v === '' ? 'on' : ''}" data-f="${k}" data-v="">Tous</button>` + arr.map(x => `<button class="chip ${v == x ? 'on' : ''}" data-f="${k}" data-v="${x}">${x}${k === 'r' ? '★' : ''}</button>`).join('') + '</div>';
const sbox = ph => `<input type="search" id="q" placeholder="${ph}" value="${S.q}">`;
const has = (n) => n.toLowerCase().includes(S.q.toLowerCase());
const row = (img, n, t) => `<div class="row"><img src="${img}" alt=""><div><b>${n}</b><p>${t}</p></div></div>`;
const filtC = () => C.filter(c => (!S.e || c.e === S.e) && (!S.p || c.p === S.p) && (!S.r || c.r == S.r) && has(c.n));
const cbar = () => sbox('Rechercher un personnage…') + chips(uniq(C, 'e'), S.e, 'e', 'Élément') + chips(uniq(C, 'p'), S.p, 'p', 'Voie') + chips([5, 4], S.r, 'r', 'Rareté');
const star = (kind, id, lab) => { const on = fav[kind].includes(id); return `<button class="btn fv ${on ? 'on' : ''}" data-fav="${kind}:${id}">${on ? '★' : '☆'} ${lab}</button>`; };

// ---------------------------------------------------------------- pages
const pages = {
  tier() {
    const res = () => { const L = filtC(); return TN.map(t => { const l = L.filter(c => c.t === t); return l.length ? `<div class="tier"><div class="tl" style="color:var(${TV[t]})">${t}<small>${l.length}</small></div><div class="tr">${l.map(c => uni(c)).join('')}</div></div>` : ''; }).join(''); };
    return [`<h1>Tier list</h1><p class="sub">Classement général version ${D.version || ''}, d’après Game8 (personnages à E0 avec leur équipement idéal). « ? » = pas encore classé.</p>${cbar()}<div id="res">${res()}</div>`, res];
  },
  perso() {
    const res = () => `<div class="grid">${filtC().map(c => uni(c, 1)).join('')}</div>`;
    return [`<h1>Personnages</h1><p class="sub">${C.length} personnages. Cliquez pour les caractéristiques, le build, les cônes, les reliques et les équipes.</p>${cbar()}<div id="res">${res()}</div>`, res];
  },
  lc() {
    const res = () => `<div class="g">${LC.filter(l => (!S.p || l.p === S.p) && (!S.r || l.r == S.r) && has(l.n)).map(l => `<div class="card" style="margin:0">${row(im('l', l.id), l.n, `${l.r}★ · ${l.p}`)}<p style="margin:8px 0 0;font-size:13.5px"><b style="font-weight:500">${l.k}</b> — ${l.d}</p></div>`).join('')}</div>`;
    return [`<h1>Cônes de lumière</h1><p class="sub">${LC.length} cônes. Les valeurs vont du rang 1 au rang 5.</p>${sbox('Rechercher un cône…')}${chips(uniq(LC, 'p'), S.p, 'p', 'Voie')}${chips([5, 4, 3], S.r, 'r', 'Rareté')}<div id="res">${res()}</div>`, res];
  },
  rel() {
    const res = () => `<div class="g">${RS.filter(l => has(l.n)).map(l => `<div class="card" style="margin:0">${row(im('r', l.id), l.n, l.pl ? 'Ornement planaire' : 'Relique')}<p style="margin:8px 0 0;font-size:13.5px"><span class="lab">2 pièces</span> ${l.d[0]}</p>${l.d[1] ? `<p style="margin:6px 0 0;font-size:13.5px"><span class="lab">4 pièces</span> ${l.d[1]}</p>` : ''}</div>`).join('')}</div>`;
    return [`<h1>Reliques</h1><p class="sub">Ensembles de reliques (4 pièces) et ornements planaires (2 pièces).</p>${sbox('Rechercher un set…')}<div id="res">${res()}</div>`, res];
  },
  end() {
    const M = D.manual.modes, m = M[S.mode], eg = D.eg[S.mode] || {};
    const sec = t => eg[t] && eg[t].length ? `<div class="lab" style="margin:12px 0 8px">Tier ${t}</div><div class="grid">${eg[t].map(i => byId[i] ? uni(byId[i]) : '').join('')}</div>` : '';
    return [`<h1>End game</h1><p class="sub">Calendrier et meilleurs personnages par mode, version ${D.version || ''}. Classements Game8, ordre non significatif.</p>
    <div class="fl">${Object.keys(M).map(k => `<button class="chip ${k === S.mode ? 'on' : ''}" data-m="${k}">${M[k][0]}</button>`).join('')}</div>
    <div class="card"><h2>${m[0]}</h2><p style="margin:0">${m[1]}</p>${sec('SS')}${sec('S+')}</div>
    <div class="card"><h2>Calendrier</h2><div class="tw"><table><tr><th>Mode</th><th>Début</th><th>Fin</th></tr>${D.manual.schedule.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('')}</table></div></div>
    <p class="note">Sources et guides détaillés : ${D.manual.guides.map(g => `<a href="${g.u}" target="_blank" rel="noopener">${g.t}</a>`).join(' · ')}</p>`];
  },
  aide() {
    return [`<h1>Aides</h1><p class="sub">Tout pour progresser sans se perdre.</p>
    <div class="card"><h2>Planificateur de tirages</h2><div class="g"><label>Jade stellaire<input type="number" id="j" value="0" min="0"></label><label>Passes spéciaux<input type="number" id="t" value="0" min="0"></label><label>Pity actuel<input type="number" id="p" value="0" min="0" max="89"></label></div><p id="po" style="margin:0"></p></div>
    <div class="card"><h2>Stats principales des reliques</h2><div class="tw"><table><tr><th>Emplacement</th><th>Options</th></tr><tr><td>Corps</td><td>Taux/DGT crit, Soins, Taux d’effet, ATQ%, PV%, DÉF%</td></tr><tr><td>Bottes</td><td>VIT, ATQ%, PV%, DÉF%</td></tr><tr><td>Sphère</td><td>Dégâts élémentaires, ATQ%, PV%, DÉF%</td></tr><tr><td>Corde</td><td>Effet de rupture, Recharge d’énergie, ATQ%, PV%, DÉF%</td></tr></table></div></div>
    <div class="g"><div class="card"><h2>Débuter</h2><p class="sub" style="margin:0">Finissez l’histoire principale, puis construisez un DPS, un soutien et un soigneur.</p></div><div class="card"><h2>Farm efficace</h2><p class="sub" style="margin:0">Dépensez l’énergie sur les domaines de reliques de votre principal et verrouillez les bonnes pièces.</p></div><div class="card"><h2>Tirages</h2><p class="sub" style="margin:0">Gardez vos jades pour les personnages dont vous avez vraiment besoin.</p></div></div>
    <div class="card"><h2>Guides externes</h2>${D.manual.guides.map(g => `<p style="margin:4px 0"><a href="${g.u}" target="_blank" rel="noopener">${g.t}</a></p>`).join('')}</div>`, null, () => { const f = () => { const j = +$('#j').value || 0, t = +$('#t').value || 0, p = +$('#p').value || 0, n = Math.floor((j + t * 160) / 160); $('#po').innerHTML = `<b>${n}</b> tirages disponibles · garantie à 90 : encore <b>${Math.max(0, 90 - p - n)}</b> tirage(s) à trouver`; }; ['j', 't', 'p'].forEach(i => $('#' + i).oninput = f); f(); }];
  },
  fav() {
    const fc = C.filter(c => fav.char.includes(c.id)), fb = C.filter(c => fav.build.includes(c.id));
    const note = sb ? (user ? '' : '<p class="sub">Connectez-vous pour retrouver vos favoris sur tous vos appareils.</p>') : '<p class="sub">Vos favoris sont enregistrés dans ce navigateur.</p>';
    return [`<h1>Favoris</h1>${note}<h2>Personnages</h2>${fc.length ? `<div class="grid">${fc.map(c => uni(c, 1)).join('')}</div>` : '<p class="sub">Aucun pour l’instant. Ouvrez une fiche personnage et cliquez sur « Personnage favori ».</p>'}
    <h2 style="margin-top:26px">Builds</h2>${fb.length ? fb.map(c => `<div class="card"><a class="u" style="display:inline-block;width:auto" href="#/perso/${c.id}"><b>${c.n}</b></a> <span class="sub2">${c.b ? c.b.subs.slice(0, 4).join(' > ') : ''}</span></div>`).join('') : '<p class="sub">Aucun pour l’instant. Cliquez sur « Build favori » dans une fiche.</p>'}`];
  }
};
const slotName = { body: 'Corps', feet: 'Bottes', sphere: 'Sphère', rope: 'Corde' };
function buildView(c) {
  const b = c.b;
  if (!b) return '<p class="sub">Pas de build disponible pour ce personnage.</p>';
  const lc = b.lc && LC.find(l => l.id === b.lc);
  const setRow = (id, txt) => { const s = RS.find(x => x.id === id); return s ? row(im('r', id), s.n, txt(s)) : ''; };
  const relics = (b.rel || []).map(p => p[0] === p[1] ? `<div class="lab" style="margin-top:10px">Relique, 4 pièces</div>${setRow(p[0], s => s.d[s.d.length - 1])}` : `<div class="lab" style="margin-top:10px">Reliques, 2 + 2</div>${setRow(p[0], s => s.d[0])}${setRow(p[1], s => s.d[0])}`).join('');
  const orn = (b.orn || []).map(i => setRow(i, s => s.d[0])).join('');
  const teams = (b.teams || []).map(t => `<div class="team"><a class="u r${c.r}" href="#/perso/${c.id}"><img src="${im('c', c.id)}" alt=""><span>${c.n}</span></a>${t.filter(m => m.c !== c.id).map(m => { const x = byId[m.c], l = m.l && LC.find(z => z.id === m.l); return x ? `<a class="u r${x.r}" href="#/perso/${x.id}"><img src="${im('c', x.id)}" alt=""><span>${x.n}</span>${l ? `<i>${l.n}</i>` : ''}</a>` : ''; }).join('')}</div>`).join('');
  return `<div class="g"><div class="card"><h2>Build recommandé</h2>
   ${lc ? `<div class="lab">Cône de lumière</div>${row(im('l', lc.id), lc.n, `${lc.k} — ${lc.d}`)}` : ''}
   ${relics || '<p class="sub" style="margin:10px 0 0">Sets de reliques non renseignés dans la source pour l’instant.</p>'}
   ${orn ? `<div class="lab" style="margin-top:10px">Ornements planaires</div>${orn}` : ''}</div>
   <div class="card"><h2>Stats à viser</h2><div class="tw"><table><tr><th>Pièce</th><th>Stat principale (par priorité)</th></tr>${Object.keys(slotName).map(k => `<tr><td>${slotName[k]}</td><td>${(b.parts[k] || []).join(' / ') || '—'}</td></tr>`).join('')}</table></div>
   <p style="margin:12px 0 4px"><span class="lab">Sous-stats par priorité</span></p>${(b.subs || []).map((s, i) => `<span class="pill">${i + 1}. ${s}</span>`).join('')}</div></div>
   <div class="card"><h2>Équipes conseillées</h2>${teams || '<p class="sub" style="margin:0">Pas d’équipe renseignée pour l’instant.</p>'}</div>
   <p class="note" style="margin-top:0">${b.curated ? 'Build vérifié à la main' : 'Données communautaires HSR Optimizer'} : à adapter à vos pièces et à votre équipe.</p>`;
}
function detail(id) {
  const c = byId[id];
  if (!c) return ['<p class="sub">Personnage introuvable.</p>'];
  const s = c.st, f = (l, v) => `<div><dt>${l}</dt><dd>${v}</dd></div>`;
  document.title = c.n + ' — Astrolabe';
  return [`<a class="back" href="#/perso">← Retour</a><div class="hero"><img src="${im('p', c.id)}" alt="${c.n}"><div><h1 style="margin:0 0 8px">${c.n}</h1><span class="tag">${c.r}★</span><span class="tag">${c.e}</span><span class="tag">${c.p}</span><span class="tag" style="color:var(${TV[c.t]});border-color:var(${TV[c.t]})">Tier ${c.t}</span>
   <h2 style="margin-top:14px">Caractéristiques (niveau 80)</h2><dl>${f('PV', s.hp)}${f('ATQ', s.atk)}${f('DÉF', s.def)}${f('VIT', s.spd)}${f('Taux crit', s.cr + '%')}${f('DGT crit', s.cd + '%')}${f('Aggro', s.ta)}${f('Énergie', s.sp)}</dl>
   <div>${star('char', c.id, 'Personnage favori')}${star('build', c.id, 'Build favori')}</div></div></div>${buildView(c)}
   <div class="g"><div class="card"><h2>Compétences</h2>${c.s.map(k => `<div class="sk"><small>${k.t}</small><b>${k.n}</b><p>${k.d}</p></div>`).join('')}</div><div class="card"><h2>Éidolons</h2>${c.x.map((k, i) => `<div class="sk"><small>E${i + 1}</small><b>${k.n}</b><p>${k.d}</p></div>`).join('')}</div></div>`];
}

// ---------------------------------------------------------------- routeur
let cur = { page: '', id: '' }, resFn = null;
function render() {
  if (!D) return;
  const [, page = 'tier', id] = location.hash.split('/');
  if (page !== cur.page) { S.q = S.e = S.p = S.r = ''; document.title = 'Astrolabe — Honkai: Star Rail'; }
  cur = { page, id };
  document.querySelectorAll('#nav a').forEach(a => a.classList.toggle('on', a.dataset.p === (page || 'tier')));
  const out = page === 'perso' && id ? detail(id) : (pages[page] || pages.tier)();
  app.innerHTML = out[0]; resFn = out[1]; if (out[2]) out[2]();
  const q = $('#q'); if (q && resFn) q.oninput = e => { S.q = e.target.value; $('#res').innerHTML = resFn(); };
}
document.addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  if (b.dataset.f) { S[b.dataset.f] = b.dataset.v; render(); }
  else if (b.dataset.m) { S.mode = b.dataset.m; render(); }
  else if (b.dataset.fav) { const [k, i] = b.dataset.fav.split(':'); toggleFav(k, i); }
});
window.addEventListener('hashchange', () => { render(); scrollTo(0, 0); });
(window.__DATA__ ? Promise.resolve(window.__DATA__) : fetch('data/data.json').then(r => r.json())).then(d => {
  D = d; C = d.chars; LC = d.lcs; RS = d.sets; byId = Object.fromEntries(C.map(c => [c.id, c]));
  $('#ver').textContent = `HSR · v${d.version || ''} · maj ${d.updated}`;
  render(); initAuth();
}).catch(() => { app.innerHTML = '<p class="sub">Impossible de charger les données.</p>'; });
})();
