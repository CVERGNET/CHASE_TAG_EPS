/* CHASE TAG — EPS · Parkour chasse tag
   Appli du professeur : équipes, manches chronométrées, points, stats individuelles (attaque / défense).
   Aucune donnée envoyée sur Internet. Liaison avec Mes Apps EPS via eps-core.js. */
(function () {
  'use strict';

  var APP = 'chase_tag';
  var CLE = 'chase_tag_etat_v1';
  var COUL = ['#ffb020', '#35d0c4']; // couleurs des équipes A et B

  var $ = function (s) { return document.querySelector(s); };
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  var pad = function (n) { return String(n).padStart(2, '0'); };
  var ymd = function (d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); };
  var hms = function (d) { return pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds()); };
  var fmt = function (x, d) {
    if (x == null || isNaN(x)) return '–';
    return x.toFixed(d == null ? 1 : d).replace('.', ',');
  };
  var r1 = function (x) { return Math.round(x * 10) / 10; };

  /* ---------- État ---------- */
  var defaut = function () {
    return { dur: 20, son: true, noms: ['Équipe A', 'Équipe B'], joueurs: [], depart: 0, manches: [] };
  };
  var S = defaut();          // état enregistré sur l'appareil
  var eleves = [];           // liste Mes Apps EPS
  var filtreClasse = '', recherche = '';
  var vueCourante = 'equipes';
  var run = null;            // manche en cours
  var apres = null;          // dernière manche terminée (résumé affiché)
  var pend = null;           // touche en attente du choix du chat
  var timerI = null, timerF = null, msgT = null, wl = null, ac = null;

  function charger() {
    try {
      var j = localStorage.getItem(CLE);
      if (j) S = Object.assign(defaut(), JSON.parse(j));
    } catch (e) {}
  }
  function sauver() {
    try { localStorage.setItem(CLE, JSON.stringify(S)); } catch (e) {}
  }

  var nomEq = function (i) { return (S.noms[i] || '').trim() || ('Équipe ' + 'AB'[i]); };
  var lbl = function (j) { return j.nom ? j.prenom + ' ' + j.nom.charAt(0).toUpperCase() + '.' : j.prenom; };
  var complet = function (j) { return j.nom ? j.nom.toUpperCase() + ' ' + j.prenom : j.prenom; };
  var prochainChat = function () {
    return S.manches.length ? 1 - S.manches[S.manches.length - 1].chat : S.depart;
  };

  function msg(t, c) {
    var s = $('#statut');
    clearTimeout(msgT);
    s.textContent = t || '';
    s.className = c || '';
    s.hidden = !t;
    if (t) { try { s.scrollIntoView({ block: 'nearest' }); } catch (e) {} }
    if (t && c === 'ok') msgT = setTimeout(function () { s.hidden = true; }, 8000);
  }

  /* ---------- Son ---------- */
  function audioInit() {
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      if (ac.state === 'suspended') ac.resume();
    } catch (e) {}
  }
  function bip(f, d, t0) {
    try {
      var o = ac.createOscillator(), g = ac.createGain();
      o.type = 'square'; o.frequency.value = f;
      g.gain.setValueAtTime(0.35, t0);
      g.gain.setValueAtTime(0.0001, t0 + d);
      o.connect(g); g.connect(ac.destination);
      o.start(t0); o.stop(t0 + d + 0.02);
    } catch (e) {}
  }
  function sonFin() {
    if (!S.son) return;
    audioInit();
    if (ac) { var t = ac.currentTime; bip(880, 0.25, t); bip(880, 0.25, t + 0.35); bip(1320, 0.8, t + 0.7); }
    try { if (navigator.vibrate) navigator.vibrate([300, 100, 300]); } catch (e) {}
  }
  async function veille(on) {
    try {
      if (on && navigator.wakeLock) wl = await navigator.wakeLock.request('screen');
      else if (!on && wl) { await wl.release(); wl = null; }
    } catch (e) {}
  }

  /* ---------- Navigation ---------- */
  function vue(n) {
    vueCourante = n;
    ['equipes', 'jeu', 'res'].forEach(function (x) {
      $('#v-' + x).hidden = x !== n;
      $('#t-' + x).setAttribute('aria-selected', x === n ? 'true' : 'false');
    });
    render();
    window.scrollTo(0, 0);
  }
  function render() {
    if (vueCourante === 'equipes') rEquipes();
    else if (vueCourante === 'jeu') rJeu();
    else rRes();
  }

  /* ---------- Vue Équipes ---------- */
  function rEquipes() {
    var v = $('#v-equipes');
    var classes = Array.from(new Set(eleves.map(function (e) { return e.classe; }).filter(Boolean)))
      .sort(function (a, b) { return a.localeCompare(b, 'fr', { numeric: true }); });
    var depart = prochainChat();

    v.innerHTML =
      '<section class="carte"><h2>👥 Équipes</h2><div class="equipes">' +
      [0, 1].map(function (i) {
        return '<div class="eq" style="--c:' + COUL[i] + '">' +
          '<label>Nom de l\'équipe ' + 'AB'[i] + '<input class="nomeq" data-i="' + i + '" value="' + esc(S.noms[i]) + '" maxlength="20"></label>' +
          '<div class="compte" id="cpt' + i + '"></div><div class="puces" id="puces' + i + '"></div></div>';
      }).join('') +
      '</div></section>' +

      '<section class="carte"><h2>🧑‍🎓 Élèves</h2>' +
      (eleves.length
        ? '<div class="rang"><select id="fcl" aria-label="Classe"><option value="">Toutes les classes</option>' +
          classes.map(function (c) { return '<option' + (c === filtreClasse ? ' selected' : '') + ' value="' + esc(c) + '">' + esc(c) + '</option>'; }).join('') +
          '</select></div>' +
          '<input id="rech" type="search" placeholder="🔍 Rechercher un élève" value="' + esc(recherche) + '">' +
          '<div class="liste" id="liste"></div>'
        : '<p class="vide">Aucune liste d\'élèves sur cet appareil.</p>' +
          '<button class="btn accent pleine" data-act="charger">📂 Charger la liste</button>' +
          '<p class="petit">Fichier .xlsx de Mes Apps EPS ou .csv Pronote. Vous pouvez aussi saisir les prénoms ci-dessous.</p>') +
      '<h3>✍ Ajouter un prénom à la main</h3>' +
      '<input id="man" placeholder="Prénom du joueur" maxlength="30">' +
      '<div class="rang"><button class="btn" style="border-color:' + COUL[0] + '" data-act="add" data-eq="0">+ Équipe A</button>' +
      '<button class="btn" style="border-color:' + COUL[1] + '" data-act="add" data-eq="1">+ Équipe B</button></div>' +
      '<p class="petit">Les joueurs saisis à la main figurent dans les résultats mais ne sont pas enregistrés dans Mes Apps EPS.</p>' +
      '</section>' +

      '<section class="carte"><h2>⚙ Réglages</h2>' +
      '<label>Durée d\'une manche</label>' +
      '<div class="duree"><button class="btn" data-act="dur" data-d="-5">−5</button><button class="btn" data-act="dur" data-d="-1">−1</button>' +
      '<b id="durv">' + S.dur + ' s</b>' +
      '<button class="btn" data-act="dur" data-d="1">+1</button><button class="btn" data-act="dur" data-d="5">+5</button></div>' +
      '<div class="rang"><button class="btn pleine" id="bson" data-act="son" aria-pressed="' + S.son + '">' + (S.son ? '🔊 Bip de fin : activé' : '🔇 Bip de fin : coupé') + '</button></div>' +
      (S.manches.length
        ? '<p class="petit">Les rôles s\'inversent à chaque manche.</p>'
        : '<label>Quelle équipe est chat en premier ?</label><div class="rang">' +
          [0, 1].map(function (i) {
            return '<button class="btn" data-act="depart" data-eq="' + i + '" aria-pressed="' + (depart === i) + '">🐱 ' + esc(nomEq(i)) + '</button>';
          }).join('') + '</div>') +
      '</section>' +
      '<button class="btn gros accent" data-act="vue" data-v="jeu">▶ Aller au jeu</button>';

    majListe();
    majPuces();
  }

  function majListe() {
    var box = $('#liste');
    if (!box) return;
    var q = EPS.norm(recherche);
    var l = eleves.filter(function (e) {
      return (!filtreClasse || e.classe === filtreClasse) && (!q || EPS.norm(e.nom + e.prenom).indexOf(q) >= 0);
    }).sort(function (a, b) {
      return (a.nom + a.prenom).localeCompare(b.nom + b.prenom, 'fr');
    });
    if (!l.length) { box.innerHTML = '<p class="vide">Aucun élève trouvé.</p>'; return; }
    box.innerHTML = l.map(function (e) {
      var j = S.joueurs.find(function (x) { return x.k === e.id; });
      return '<div class="ligne"><span class="nom"><b>' + esc(e.nom.toUpperCase()) + '</b> ' + esc(e.prenom) +
        (e.classe ? ' <small>' + esc(e.classe) + '</small>' : '') + '</span>' +
        [0, 1].map(function (i) {
          return '<button class="aff" style="--c:' + COUL[i] + '" data-act="aff" data-k="' + esc(e.id) + '" data-eq="' + i + '" aria-pressed="' + !!(j && j.eq === i) + '" aria-label="Équipe ' + 'AB'[i] + '">' + 'AB'[i] + '</button>';
        }).join('') + '</div>';
    }).join('');
  }

  function majPuces() {
    [0, 1].forEach(function (i) {
      var m = S.joueurs.filter(function (j) { return j.eq === i; });
      var c = $('#cpt' + i), p = $('#puces' + i);
      if (c) c.textContent = m.length + ' joueur' + (m.length > 1 ? 's' : '');
      if (p) p.innerHTML = m.map(function (j) {
        return '<button class="puce" style="--c:' + COUL[i] + '" data-act="retire" data-k="' + esc(j.k) + '" title="Retirer">' + esc(lbl(j)) + ' ✕</button>';
      }).join('');
    });
  }

  /* ---------- Vue Jeu ---------- */
  function rJeu() {
    var v = $('#v-jeu');
    if (run) rRun(v);
    else if (apres) rApres(v);
    else rPret(v);
  }

  function rPret(v) {
    var chat = prochainChat(), sou = 1 - chat, n = S.manches.length + 1;
    var ch = S.joueurs.filter(function (j) { return j.eq === chat; });
    var so = S.joueurs.filter(function (j) { return j.eq === sou; });
    var ok = ch.length && so.length;
    v.innerHTML =
      '<section class="carte"><h2>Manche ' + n + '</h2><div class="roles">' +
      '<div class="role" style="--c:' + COUL[chat] + '"><h3>🐱 Chats : ' + esc(nomEq(chat)) + '</h3><p>' + (ch.map(lbl).map(esc).join(', ') || 'Aucun joueur') + '</p></div>' +
      '<div class="role" style="--c:' + COUL[sou] + '"><h3>🐭 Souris : ' + esc(nomEq(sou)) + '</h3><p>' + (so.map(lbl).map(esc).join(', ') || 'Aucun joueur') + '</p></div>' +
      '</div><p class="petit">Durée : ' + S.dur + ' s' + (S.manches.length ? ' · rôles inversés par rapport à la manche précédente' : '') + '</p>' +
      (S.manches.length ? '' : '<button class="btn pleine" data-act="inv">⇄ Inverser les rôles</button>') +
      '</section>' +
      (ok
        ? '<button class="btn gros accent" data-act="go">▶ DÉPART</button>'
        : '<p class="vide">Il faut au moins un élève dans chaque équipe.</p><button class="btn accent pleine" data-act="vue" data-v="equipes">👥 Composer les équipes</button>');
  }

  function rRun(v) {
    var tot = S.joueurs.filter(function (j) { return j.eq === run.souris; }).length;
    v.innerHTML =
      '<section class="carte"><p class="petit" style="text-align:center">Manche ' + run.n + ' · 🐱 ' + esc(nomEq(run.chat)) + ' poursuit · 🐭 ' + esc(nomEq(run.souris)) + ' fuit</p>' +
      '<div class="chrono" id="chrono">' + fmt(run.dur) + '</div><div class="piste"><i id="barre"></i></div>' +
      '<p class="petit" id="nbt" style="text-align:center;margin:8px 0 0">0 / ' + tot + ' touchées</p></section>' +
      '<section class="carte"><h3 style="margin-top:0">Touche la souris dès qu\'elle est touchée :</h3><div class="grille" id="grille"></div></section>' +
      '<div class="rang"><button class="btn" data-act="undo">↩ Annuler la dernière touche</button>' +
      '<button class="btn danger" data-act="annmanche">✖ Annuler la manche</button></div>';
    rGrille();
    majChrono();
  }

  function rGrille() {
    var g = $('#grille');
    if (!g || !run) return;
    var so = S.joueurs.filter(function (j) { return j.eq === run.souris; });
    var tk = new Map(run.touches.map(function (x) { return [x.mouse, x]; }));
    g.innerHTML = so.map(function (j) {
      var x = tk.get(j.k);
      return x
        ? '<button class="btn souris pris" disabled>✓ ' + esc(lbl(j)) + '<small>' + fmt(x.t) + ' s</small></button>'
        : '<button class="btn souris" style="--c:' + COUL[run.souris] + '" data-act="toucher" data-k="' + esc(j.k) + '">🐭 ' + esc(lbl(j)) + '</button>';
    }).join('');
    var n = $('#nbt');
    if (n) n.textContent = run.touches.length + ' / ' + so.length + ' touchées';
  }

  function rApres(v) {
    var m = apres, r = resume(m);
    var sCh = m.touches.length, sSo = r.surv.length;
    var jn = function (k) { var j = m.j.find(function (x) { return x.k === k; }); return j ? lbl(j) : '?'; };
    var pair = (m.n % 2 === 0);
    v.innerHTML =
      '<section class="carte"><h2>✅ Manche ' + m.n + ' terminée</h2>' +
      '<div class="score"><span style="color:' + COUL[m.chat] + '">🐱 ' + esc(m.noms[m.chat]) + ' : ' + sCh + ' pt' + (sCh > 1 ? 's' : '') + '</span>' +
      '<span style="color:' + COUL[1 - m.chat] + '">🐭 ' + esc(m.noms[1 - m.chat]) + ' : ' + sSo + ' pt' + (sSo > 1 ? 's' : '') + '</span></div>' +
      '<h3>Souris touchées (point pour le chat et son équipe)</h3>' +
      (m.touches.length
        ? '<ul class="resume">' + m.touches.map(function (x) {
          return '<li>' + esc(jn(x.mouse)) + ' · ' + fmt(x.t) + ' s · par ' + (x.chat ? esc(jn(x.chat)) : '<i>chat non précisé</i>') + '</li>';
        }).join('') + '</ul>'
        : '<p class="vide">Aucune.</p>') +
      '<h3>Souris pas touchées (point pour la souris et son équipe)</h3>' +
      (r.surv.length ? '<p>' + r.surv.map(function (j) { return esc(lbl(j)); }).join(', ') + '</p>' : '<p class="vide">Aucune.</p>') +
      '</section>' +
      (pair
        ? '<button class="btn gros accent" data-act="vue" data-v="res">📊 Voir les résultats</button><div class="rang"><button class="btn" data-act="suite">▶ Manche suivante</button></div>'
        : '<button class="btn gros accent" data-act="suite">▶ Manche suivante (rôles inversés)</button><div class="rang"><button class="btn" data-act="vue" data-v="res">📊 Résultats</button></div>');
  }

  function elapsed() { return (performance.now() - run.t0) / 1000; }

  function majChrono() {
    if (!run) return;
    var e = Math.min(elapsed(), run.dur), r = Math.max(run.dur - e, 0);
    var c = $('#chrono');
    if (c) { c.textContent = fmt(r); c.classList.toggle('urgent', r <= 5); }
    var b = $('#barre');
    if (b) b.style.width = (100 * e / run.dur) + '%';
    var d = $('#d-chrono');
    if (d) d.textContent = fmt(r) + ' s';
  }

  function go() {
    var chat = prochainChat(), sou = 1 - chat;
    var ch = S.joueurs.filter(function (j) { return j.eq === chat; });
    var so = S.joueurs.filter(function (j) { return j.eq === sou; });
    if (!ch.length || !so.length) { msg('⚠ Il faut au moins un élève dans chaque équipe.', 'err'); return; }
    audioInit(); // le navigateur exige un clic pour autoriser le son
    msg('');
    apres = null;
    run = { n: S.manches.length + 1, chat: chat, souris: sou, dur: S.dur, t0: performance.now(), touches: [], fin: false };
    timerI = setInterval(majChrono, 100);
    timerF = setTimeout(function () { finir('temps'); }, run.dur * 1000);
    veille(true);
    rJeu();
  }

  function toucher(k) {
    if (!run || run.fin || pend) return;
    var t = elapsed();
    if (t >= run.dur) { finir('temps'); return; }
    if (run.touches.some(function (x) { return x.mouse === k; })) return;
    var chats = S.joueurs.filter(function (j) { return j.eq === run.chat; });
    if (chats.length === 1) { ajoutTouche(k, chats[0].k, t); return; }
    var j = S.joueurs.find(function (x) { return x.k === k; });
    pend = { k: k, t: t };
    $('#d-corps').innerHTML =
      '<p class="q">🐭 <b>' + esc(lbl(j)) + '</b> touchée à <b>' + fmt(t) + ' s</b></p>' +
      '<h3>Touchée par quel chat ?</h3><div class="grille">' +
      chats.map(function (c) {
        return '<button class="btn chatbtn" style="--c:' + COUL[run.chat] + '" data-act="chat" data-k="' + esc(c.k) + '">🐱 ' + esc(lbl(c)) + '</button>';
      }).join('') + '</div>' +
      '<div class="d-actions"><button class="btn sec" data-act="chat">Je ne sais pas</button>' +
      '<button class="btn sec" data-act="chatann">↩ Annuler</button></div>';
    majChrono();
    $('#d-chat').showModal();
  }

  function ajoutTouche(mouse, chat, t) {
    if (!run || run.fin) return;
    run.touches.push({ mouse: mouse, chat: chat || null, t: r1(Math.min(t, run.dur)) });
    rGrille();
    var tot = S.joueurs.filter(function (j) { return j.eq === run.souris; }).length;
    if (run.touches.length >= tot) finir('tous');
  }

  function finir() {
    if (!run || run.fin) return;
    run.fin = true;
    clearInterval(timerI); clearTimeout(timerF);
    if (pend) { run.touches.push({ mouse: pend.k, chat: null, t: r1(pend.t) }); pend = null; }
    var dlg = $('#d-chat');
    if (dlg.open) dlg.close();
    var d = new Date();
    var m = {
      n: S.manches.length + 1, date: ymd(d), heure: hms(d), dur: run.dur, chat: run.chat,
      noms: [nomEq(0), nomEq(1)],
      j: S.joueurs.map(function (j) { return { k: j.k, id: j.id, nom: j.nom, prenom: j.prenom, eq: j.eq }; }),
      touches: run.touches
    };
    S.manches.push(m);
    sauver();
    apres = m; run = null;
    veille(false);
    sonFin();
    if (vueCourante === 'jeu') rJeu();
  }

  function resume(m) {
    var ch = m.j.filter(function (j) { return j.eq === m.chat; });
    var so = m.j.filter(function (j) { return j.eq !== m.chat; });
    var tk = new Map(m.touches.map(function (x) { return [x.mouse, x]; }));
    return { ch: ch, so: so, tk: tk, surv: so.filter(function (j) { return !tk.has(j.k); }) };
  }

  /* ---------- Statistiques ---------- */
  function stats() {
    var P = new Map();
    var T = [0, 1].map(function () { return { pts: 0, pc: 0, ps: 0, nt: 0, st: 0, nd: 0, sd: 0 }; });
    var inconnus = 0;
    S.manches.forEach(function (m) {
      var r = resume(m), cT = T[m.chat], sT = T[1 - m.chat];
      m.j.forEach(function (j) {
        if (!P.has(j.k)) P.set(j.k, { j: j, pts: 0, nA: 0, touches: 0, sumA: 0, nD: 0, surv: 0, sumD: 0 });
        else P.get(j.k).j = j;
      });
      r.ch.forEach(function (j) { P.get(j.k).nA++; });
      m.touches.forEach(function (x) {
        cT.pts++; cT.pc++; cT.nt++; cT.st += x.t;
        if (x.chat && P.has(x.chat)) { var c = P.get(x.chat); c.pts++; c.touches++; c.sumA += x.t; } else inconnus++;
        var s = P.get(x.mouse); s.nD++; s.sumD += x.t;
        sT.nd++; sT.sd += x.t;
      });
      r.surv.forEach(function (j) {
        var p = P.get(j.k); p.pts++; p.surv++; p.nD++; p.sumD += m.dur;
        sT.pts++; sT.ps++; sT.nd++; sT.sd += m.dur;
      });
    });
    return { P: P, T: T, inconnus: inconnus };
  }

  /* ---------- Vue Résultats ---------- */
  function rRes() {
    var v = $('#v-res');
    if (!S.manches.length) {
      v.innerHTML = '<section class="carte"><p class="vide">Aucune manche jouée pour l\'instant. Les résultats par équipe et les stats individuelles apparaîtront ici.</p>' +
        '<button class="btn accent pleine" data-act="vue" data-v="jeu">⏱ Aller au jeu</button></section>';
      return;
    }
    var st = stats(), T = st.T;
    var gagn = T[0].pts === T[1].pts ? '🤝 Égalité' : '🏆 ' + esc(nomEq(T[0].pts > T[1].pts ? 0 : 1));
    var moy = function (s, n) { return n ? s / n : null; };

    var lignesEq = [0, 1].map(function (i) {
      var t = T[i];
      return '<tr><td><span class="pastille" style="--c:' + COUL[i] + '"></span>' + esc(nomEq(i)) + '</td>' +
        '<td class="pts">' + t.pts + '</td><td>' + t.pc + '</td><td>' + t.ps + '</td>' +
        '<td>' + fmt(moy(t.st, t.nt)) + '</td><td>' + fmt(moy(t.sd, t.nd)) + '</td></tr>';
    }).join('');

    var joueurs = Array.from(st.P.values()).sort(function (a, b) {
      return b.pts - a.pts || b.touches - a.touches || lbl(a.j).localeCompare(lbl(b.j), 'fr');
    });
    var lignesJ = joueurs.map(function (p) {
      return '<tr><td><span class="pastille" style="--c:' + COUL[p.j.eq] + '"></span>' + esc(lbl(p.j)) + '</td>' +
        '<td class="pts">' + p.pts + '</td>' +
        '<td>' + (p.nA ? p.touches : '–') + '</td><td>' + fmt(p.touches ? p.sumA / p.touches : null) + '</td>' +
        '<td>' + (p.nD ? p.surv + '/' + p.nD : '–') + '</td><td>' + fmt(p.nD ? p.sumD / p.nD : null) + '</td></tr>';
    }).join('');

    var hist = S.manches.map(function (m, i) {
      var r = resume(m);
      return '<div class="hist"><span>M' + m.n + ' · ' + esc(m.heure.slice(0, 5)) + ' · 🐱 ' + esc(m.noms[m.chat]) + ' ' + m.touches.length +
        ' – ' + r.surv.length + ' ' + esc(m.noms[1 - m.chat]) + ' 🐭</span>' +
        '<button class="btn" data-act="supm" data-i="' + i + '" aria-label="Supprimer la manche ' + m.n + '">🗑</button></div>';
    }).join('');

    v.innerHTML =
      '<section class="carte"><h2>📊 Résultats par équipe</h2><div class="gagnant">' + gagn + '</div>' +
      '<div class="defil"><table><thead><tr><th>Équipe</th><th>Points</th><th>🐱 Pts attaque</th><th>🐭 Pts défense</th><th>⏱ moy. pour toucher (s)</th><th>⏱ moy. tenu (s)</th></tr></thead><tbody>' + lignesEq + '</tbody></table></div></section>' +

      '<section class="carte"><h2>🧑‍🎓 Stats individuelles</h2><div class="defil"><table><thead><tr><th>Élève</th><th>Points</th><th>🐱 Touches</th><th>⏱ moy. pour toucher (s)</th><th>🐭 Survies</th><th>⏱ moy. tenu (s)</th></tr></thead><tbody>' + lignesJ + '</tbody></table></div>' +
      '<p class="petit">Temps pour toucher : temps écoulé depuis le départ au moment de la touche. Temps tenu : temps avant d\'être touché (durée complète si la souris n\'est pas touchée).' +
      (st.inconnus ? ' ' + st.inconnus + ' touche(s) sans chat précisé : comptée(s) pour l\'équipe seulement.' : '') + '</p></section>' +

      '<section class="carte"><h2>🗂 Manches jouées</h2>' + hist + '</section>' +

      '<section class="carte"><h2>Enregistrer</h2>' +
      '<div class="rang"><button class="btn accent pleine" data-act="save">💾 Enregistrer dans Mes Apps EPS</button>' +
      '<button class="btn pleine" data-act="export">⬇ Exporter (.xlsx)</button></div></section>' +

      '<div class="rang"><button class="btn" data-act="suite2">▶ Manche suivante</button>' +
      '<button class="btn danger" data-act="nouv">🔄 Nouvelle séance</button></div>';
  }

  /* ---------- Mes Apps EPS ---------- */
  async function enregistrer() {
    if (!S.manches.length) { msg('⚠ Aucune manche à enregistrer.', 'err'); return; }
    try {
      var lignes = 0, manques = 0, ok = new Set(), saisis = new Set();
      for (var a = 0; a < S.manches.length; a++) {
        var m = S.manches[a];
        var tk = new Map(m.touches.map(function (x) { return [x.mouse, x]; }));
        for (var b = 0; b < m.j.length; b++) {
          var j = m.j[b];
          if (!j.id) { saisis.add(j.k); continue; }
          var chat = j.eq === m.chat;
          var base = { 'Date': m.date, 'Heure': m.heure, 'Manche': m.n, 'Équipe': m.noms[j.eq], 'Rôle': chat ? 'Chat' : 'Souris', 'Durée manche (s)': m.dur };
          var ligne;
          if (chat) {
            var mine = m.touches.filter(function (x) { return x.chat === j.k; });
            var moy = mine.length ? r1(mine.reduce(function (s, x) { return s + x.t; }, 0) / mine.length) : '';
            ligne = Object.assign({}, base, { 'Touches': mine.length, 'Temps moyen pour toucher (s)': moy, 'Touché': '', 'Temps tenu (s)': '', 'Points': mine.length });
          } else {
            var x = tk.get(j.k);
            ligne = Object.assign({}, base, { 'Touches': '', 'Temps moyen pour toucher (s)': '', 'Touché': x ? 'Oui' : 'Non', 'Temps tenu (s)': x ? x.t : m.dur, 'Points': x ? 0 : 1 });
          }
          try { await EPS.addLigne(APP, j.id, ligne); lignes++; ok.add(j.id); }
          catch (e) { manques++; }
        }
      }
      if (!lignes && manques) {
        msg('⚠ Aucun élève trouvé dans Mes Apps EPS : chargez la liste (onglet Équipes) puis réessayez.', 'err');
        return;
      }
      var t = '✅ Enregistré dans Mes Apps EPS : ' + lignes + ' ligne(s) pour ' + ok.size + ' élève(s).';
      if (saisis.size) t += ' ⚠ ' + saisis.size + ' joueur(s) saisi(s) à la main non enregistré(s).';
      if (manques) t += ' ⚠ ' + manques + ' ligne(s) ignorée(s) (élève absent de la liste).';
      msg(t, (saisis.size || manques) ? 'err' : 'ok');
    } catch (e) {
      msg('⚠ Erreur d\'enregistrement : ' + (e && e.message ? e.message : e), 'err');
    }
  }

  async function exporter() {
    try {
      var b = await EPS.exportXLSX({ apps: [APP] });
      EPS.downloadXLSX(b, 'CHASETAG_' + ymd(new Date()) + '.xlsx');
      msg('✅ Fichier exporté.', 'ok');
    } catch (e) {
      var t = e && e.message ? e.message : String(e);
      msg(/Aucune donn/.test(t) ? '⚠ Rien à exporter : enregistrez d\'abord les manches dans Mes Apps EPS.' : '⚠ Export impossible : ' + t, 'err');
    }
  }

  async function chargerEleves() {
    try { eleves = await EPS.all(); } catch (e) { eleves = []; }
  }

  async function importer(f) {
    if (!f) return;
    try {
      await EPS.importFile(f);
      await chargerEleves();
      msg('✅ Liste chargée : ' + eleves.length + ' élève(s).', 'ok');
      render();
    } catch (e) {
      msg('⚠ ' + (e && e.message ? e.message : e), 'err');
    }
  }

  async function effacer() {
    if (!confirm('Effacer toutes les données de CHASE TAG sur cet appareil (équipes, manches et données CHASE TAG de Mes Apps EPS) ? Cette action est définitive.')) return;
    try {
      var l = await EPS.all();
      for (var i = 0; i < l.length; i++) {
        if (l[i].ext && l[i].ext[APP]) await EPS.setExt(APP, l[i].id, { lignes: [] });
      }
    } catch (e) {}
    clearInterval(timerI); clearTimeout(timerF);
    run = null; apres = null; pend = null; veille(false);
    try { localStorage.removeItem(CLE); } catch (e) {}
    S = defaut();
    var d = $('#d-conf'); if (d.open) d.close();
    msg('✅ Données de l\'appli effacées.', 'ok');
    vue('equipes');
  }

  /* ---------- Actions (clics) ---------- */
  var actions = {
    vue: function (d) { vue(d.v); },
    conf: function () { $('#d-conf').showModal(); },
    fermer: function () { $('#d-conf').close(); },
    effacer: function () { effacer(); },
    charger: function () { $('#fichier').click(); },

    aff: function (d) {
      var eq = +d.eq, j = S.joueurs.find(function (x) { return x.k === d.k; });
      if (j) {
        if (j.eq === eq) S.joueurs = S.joueurs.filter(function (x) { return x !== j; });
        else j.eq = eq;
      } else {
        var e = eleves.find(function (x) { return x.id === d.k; });
        if (e) S.joueurs.push({ k: e.id, id: e.id, nom: e.nom, prenom: e.prenom, classe: e.classe || '', eq: eq });
      }
      sauver(); majListe(); majPuces();
    },
    add: function (d) {
      var inp = $('#man'), p = (inp.value || '').trim();
      if (!p) { msg('⚠ Saisissez un prénom.', 'err'); inp.focus(); return; }
      msg('');
      S.joueurs.push({ k: 'x' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), id: null, nom: '', prenom: p, classe: '', eq: +d.eq });
      inp.value = ''; sauver(); majPuces();
    },
    retire: function (d) {
      S.joueurs = S.joueurs.filter(function (x) { return x.k !== d.k; });
      sauver(); majListe(); majPuces();
    },
    dur: function (d) {
      S.dur = Math.max(5, Math.min(180, S.dur + (+d.d)));
      sauver(); $('#durv').textContent = S.dur + ' s';
    },
    son: function () {
      S.son = !S.son; sauver();
      var b = $('#bson'); b.setAttribute('aria-pressed', S.son);
      b.textContent = S.son ? '🔊 Bip de fin : activé' : '🔇 Bip de fin : coupé';
      if (S.son) { audioInit(); if (ac) bip(880, 0.2, ac.currentTime); }
    },
    depart: function (d) { S.depart = +d.eq; sauver(); rEquipes(); },
    inv: function () { S.depart = 1 - S.depart; sauver(); rJeu(); },

    go: function () { go(); },
    toucher: function (d) { toucher(d.k); },
    chat: function (d) {
      if (!pend) return;
      var p = pend; pend = null;
      $('#d-chat').close();
      ajoutTouche(p.k, d.k || null, p.t);
    },
    chatann: function () { pend = null; $('#d-chat').close(); },
    undo: function () {
      if (!run || !run.touches.length) return;
      run.touches.pop(); rGrille();
    },
    annmanche: function () {
      if (!run) return;
      if (!confirm('Annuler cette manche ? Rien ne sera enregistré.')) return;
      clearInterval(timerI); clearTimeout(timerF);
      run = null; pend = null; veille(false);
      rJeu();
    },
    suite: function () { apres = null; rJeu(); },
    suite2: function () { apres = null; vue('jeu'); },

    supm: function (d) {
      var i = +d.i, m = S.manches[i];
      if (!m) return;
      if (!confirm('Supprimer la manche ' + m.n + ' ? Les points correspondants seront retirés des résultats.')) return;
      S.manches.splice(i, 1); apres = null; sauver(); rRes();
    },
    nouv: function () {
      if (!confirm('Commencer une nouvelle séance ? Les manches jouées seront effacées de l\'appli (les équipes sont conservées). Pensez à enregistrer d\'abord.')) return;
      S.manches = []; apres = null; sauver(); vue('jeu');
    },
    save: function () { enregistrer(); },
    export: function () { exporter(); }
  };

  document.addEventListener('click', function (ev) {
    var b = ev.target.closest('[data-act]');
    if (!b || b.disabled) return;
    var f = actions[b.dataset.act];
    if (f) f(b.dataset, b);
  });
  document.addEventListener('input', function (ev) {
    var t = ev.target;
    if (t.classList && t.classList.contains('nomeq')) { S.noms[+t.dataset.i] = t.value; sauver(); }
    else if (t.id === 'rech') { recherche = t.value; majListe(); }
  });
  document.addEventListener('change', function (ev) {
    var t = ev.target;
    if (t.id === 'fcl') { filtreClasse = t.value; majListe(); }
    else if (t.id === 'fichier') { importer(t.files[0]); t.value = ''; }
  });
  $('#d-chat').addEventListener('close', function () { pend = null; });

  /* ---------- Démarrage ---------- */
  (async function init() {
    charger();
    await chargerEleves();
    vue(S.joueurs.length ? 'jeu' : 'equipes');
  })();
})();
