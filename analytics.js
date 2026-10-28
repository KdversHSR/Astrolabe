// Compte les visites (GoatCounter, gratuit, sans cookies) si un code est renseigné dans stats-config.js.
(function () {
  var c = window.ASTRO_STATS && window.ASTRO_STATS.goatcounter; if (!c) return;
  window.goatcounter = { no_onload: true };
  var s = document.createElement('script'); s.async = true; s.src = 'https://gc.zgo.at/count.js';
  s.dataset.goatcounter = 'https://' + c + '.goatcounter.com/count';
  s.onload = function () { var go = function () { try { window.goatcounter.count({ path: location.pathname + location.hash }); } catch (e) { } }; go(); window.addEventListener('hashchange', go); };
  document.head.appendChild(s);
})();
