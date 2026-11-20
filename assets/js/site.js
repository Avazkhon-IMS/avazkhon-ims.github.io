/* Builds every page from content.js and i18n.js. You normally do not need to edit this file. */
(function () {
  "use strict";
  var LANGS = ["en", "uz", "ru"];
  var S = window.SITE, UI = window.UI;
  var page = document.body.getAttribute("data-page");
  var lang = "en";
  try {
    var saved = localStorage.getItem("lang");
    if (LANGS.indexOf(saved) >= 0) lang = saved;
    else {
      var nav = (navigator.language || "en").slice(0, 2).toLowerCase();
      if (LANGS.indexOf(nav) >= 0) lang = nav;
    }
  } catch (e) { /* storage unavailable: stay in English */ }

  var state = { topic: "all", query: "", first: true };

  function t(key) { var o = UI[key]; return o ? (o[lang] || o.en) : key; }
  function L(o) { return typeof o === "string" ? o : (o ? (o[lang] || o.en || "") : ""); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function fmtDate(iso) {
    if (!iso) return "";
    var d = new Date(iso + "T00:00:00");
    if (isNaN(d)) return iso;
    if (lang === "uz") {
      var m = ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"];
      return d.getFullYear() + "-yil " + d.getDate() + "-" + m[d.getMonth()];
    }
    var loc = { en: "en-GB", ru: "ru-RU" }[lang];
    try { return d.toLocaleDateString(loc, { year: "numeric", month: "long", day: "numeric" }); }
    catch (e) { return iso; }
  }
  function tags(list) {
    return '<ul class="tags">' + list.map(function (x) { return "<li>" + esc(L(x)) + "</li>"; }).join("") + "</ul>";
  }

  /* ---------- Icons ---------- */
  var ICONS = {
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    back: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    download: '<path d="M12 4v11M7 11l5 5 5-5M5 20h14"/>',
    code: '<path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 7l8.5 6 8.5-6"/>',
    pin: '<path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    ext: '<path d="M14 5h5v5M19 5l-8 8M11 7H6a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-5"/>',
    copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    play: '<path d="M8 5.5v13l11-6.5z"/>',
    flask: '<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3M7.5 15h9"/>',
    book: '<path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3zM5 17a3 3 0 0 1 3-3h11"/>',
    note: '<path d="M6 3h9l4 4v14H6zM9 12h7M9 16h7M9 8h3"/>',
    search: '<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.500-4.500"/>'
  };
  function icon(name) { return '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">' + ICONS[name] + "</svg>"; }
  /* Logo: a unit cell (a cube seen from its corner) with an atom on each corner. */
  var MARK = '<rect class="mark-bg" width="32" height="32" rx="8"/>' +
    '<path class="mark-fg" d="M16 5.5l9.1 5.25v10.5L16 26.5l-9.1-5.25v-10.5zM16 16l9.1-5.25M16 16l-9.1-5.25M16 16v10.5"/>' +
    '<g class="mark-dot"><circle cx="16" cy="16" r="2.4"/><circle cx="16" cy="5.5" r="1.5"/><circle cx="25.1" cy="10.75" r="1.5"/>' +
    '<circle cx="25.1" cy="21.25" r="1.5"/><circle cx="16" cy="26.5" r="1.5"/><circle cx="6.9" cy="21.25" r="1.5"/><circle cx="6.9" cy="10.75" r="1.5"/></g>';
  function mark() { return '<svg viewBox="0 0 32 32" aria-hidden="true">' + MARK + "</svg>"; }
  function siteName() { return S.siteName || L(S.name); }
  function wordmark() {
    var m = /^([A-Z][a-z]+)([A-Z].*)$/.exec(siteName());
    return '<span class="wordmark">' + (m ? esc(m[1]) + "<b>" + esc(m[2]) + "</b>" : esc(siteName())) + "</span>";
  }

  /* ---------- Header and footer ---------- */
  var NAV = [
    ["home", "index.html"], ["research", "research.html"], ["publications", "publications.html"],
    ["tutorials", "tutorials.html"], ["scripts", "scripts.html"], ["notes", "notes.html"], ["about", "about.html"]
  ];
  function isDark() {
    var attr = document.documentElement.getAttribute("data-theme");
    if (attr) return attr === "dark";
    return !!(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
  }
  function profileLinks() { return (S.contact.links || []).filter(function (l) { return l.url; }); }
  function header() {
    var links = NAV.map(function (n) {
      return '<a href="' + n[1] + '"' + (n[0] === page ? ' aria-current="page"' : "") + ">" + esc(t("nav." + n[0])) + "</a>";
    }).join("");
    var buttons = LANGS.map(function (l) {
      return '<button type="button" data-lang="' + l + '" aria-pressed="' + (l === lang) + '">' + l.toUpperCase() + "</button>";
    }).join("");
    return '<a class="skip" href="#content" data-skip>' + esc(t("ui.skip")) + "</a>" +
      '<div class="wrap bar"><a class="brand" href="index.html">' + mark() + wordmark() + "</a>" +
      '<nav class="nav" id="nav" aria-label="Main">' + links + "</nav>" +
      '<div class="tools"><div class="lang" role="group" aria-label="' + esc(t("lang.label")) + '">' + buttons + "</div>" +
      '<button type="button" class="icon-btn" id="theme-btn" aria-label="' + esc(t("ui.theme")) + '" title="' + esc(t("ui.theme")) + '">' + icon(isDark() ? "sun" : "moon") + "</button>" +
      '<button type="button" class="icon-btn menu-btn" id="menu-btn" aria-label="' + esc(t("ui.menu")) + '" aria-expanded="false" aria-controls="nav">' + icon("menu") + "</button>" +
      "</div></div>";
  }
  function footer() {
    var pages = NAV.map(function (n) { return '<li><a href="' + n[1] + '">' + esc(t("nav." + n[0])) + "</a></li>"; }).join("");
    var C = S.contact;
    var contact = '<li><a href="mailto:' + esc(C.email) + '">' + esc(C.email) + "</a></li><li>" + esc(L(C.location)) + "</li>" +
      profileLinks().map(function (l) { return '<li><a href="' + esc(l.url) + '" rel="noopener">' + esc(l.label) + "</a></li>"; }).join("");
    return '<div class="wrap foot"><div><a class="brand" href="index.html">' + mark() + wordmark() + "</a>" +
      "<p>" + esc(L(S.role)) + "</p></div>" +
      "<div><h2>" + esc(t("footer.pages")) + '</h2><ul class="cols">' + pages + "</ul></div>" +
      "<div><h2>" + esc(t("about.contact")) + "</h2><ul>" + contact + "</ul></div></div>" +
      '<div class="wrap legal"><span>© ' + new Date().getFullYear() + " " + esc(L(S.name)) + '<span class="gap"></span>' + esc(L(S.tagline)) + "</span>" +
      "<span>" + esc(t("footer.updated")) + ": " + esc(fmtDate(S.lastUpdated)) + "</span></div>";
  }

  /* ---------- Reusable pieces ---------- */
  function pubItem(p) {
    var links = [];
    if (p.doi) links.push('<a class="btn small" href="https://doi.org/' + esc(p.doi) + '" rel="noopener">' + icon("ext") + "DOI: " + esc(p.doi) + "</a>");
    if (p.pdf) links.push('<a class="btn small" href="' + esc(p.pdf) + '">' + icon("download") + esc(t("pubs.pdf")) + "</a>");
    return '<li class="entry card"><span class="tile">' + icon("book") + "</span>" +
      '<div class="entry-title">' + esc(L(p.title)) + "</div>" +
      '<div class="entry-meta"><span>' + esc(p.authors) + "</span><span><em>" + esc(p.venue) + "</em>" + (p.details ? " " + esc(p.details) : "") + " (" + esc(p.year) + ")</span></div>" +
      '<div class="entry-links"><span class="badge">' + esc(t("pubs." + p.type)) + "</span>" + links.join("") + "</div></li>";
  }
  function videoCard(v) {
    var frame;
    if (v.youtube) {
      frame = '<button type="button" class="video-frame" data-yt="' + esc(v.youtube) + '" aria-label="' + esc(t("tut.play")) + ": " + esc(L(v.title)) + '">' +
        '<img loading="lazy" alt="" src="https://i.ytimg.com/vi/' + esc(v.youtube) + '/hqdefault.jpg"><span class="play">' + icon("play") + "</span></button>";
    } else {
      frame = '<div class="video-frame"><span class="play ghost">' + icon("play") + "</span><span>" + esc(t("tut.soon")) + "</span></div>";
    }
    var topic = S.videoTopics[v.topic];
    return '<article class="video card">' + frame + '<div class="video-body">' +
      '<div class="entry-meta">' + (topic ? '<span class="badge">' + esc(L(topic)) + "</span>" : "") + "<span>" + esc(fmtDate(v.date)) + "</span></div>" +
      "<h3>" + esc(L(v.title)) + "</h3><p>" + esc(L(v.text)) + "</p></div></article>";
  }
  function noteItem(n) {
    return '<li class="entry card linked"><span class="when">' + esc(fmtDate(n.date)) + "</span>" +
      '<div class="entry-title"><a href="notes.html#' + esc(n.id) + '">' + esc(L(n.title)) + "</a></div>" +
      '<p class="entry-text">' + esc(L(n.summary)) + "</p>" +
      '<div class="entry-links"><a class="more" href="notes.html#' + esc(n.id) + '">' + esc(t("notes.read")) + icon("arrow") + "</a></div></li>";
  }
  function sectionHead(titleKey, href) {
    return '<div class="section-head"><h2>' + esc(t(titleKey)) + "</h2>" +
      (href ? '<a class="more" href="' + href + '">' + esc(t("home.all")) + icon("arrow") + "</a>" : "") + "</div>";
  }
  function pageHead(titleKey, introKey) {
    return '<div class="page-head"><h1>' + esc(t(titleKey)) + "</h1>" + (introKey ? "<p>" + esc(t(introKey)) + "</p>" : "") + "</div>";
  }
  function section(inner) { return '<section class="section">' + inner + "</section>"; }

  /* Home picture: a rotating 3D model of a Ti3C2O2 MXene sheet, drawn on a canvas.
     Layers from bottom to top: O / Ti / C / Ti / C / Ti / O. Heights are in angstroms. */
  function cellFigure() {
    var legend = [["ti", "Ti"], ["c", "C"], ["o", "O"]].map(function (l) {
      return '<li><i class="dot ' + l[0] + '"></i>' + l[1] + "</li>";
    }).join("");
    return '<figure class="figure"><canvas id="cell-canvas" role="img" aria-label="' + esc(t("home.figure")) + '"></canvas>' +
      '<ul class="legend">' + legend + "</ul><figcaption>" + esc(t("home.figure")) + "</figcaption></figure>";
  }
  function startFigure() {
    var canvas = document.getElementById("cell-canvas");
    if (!canvas || !canvas.getContext) return null;
    var ctx = canvas.getContext("2d");
    var a = 3.05, s3 = Math.sqrt(3), R = 2.7 * a;
    var site = { A: [0, 0], B: [a / 2, a / (2 * s3)], C: [a, a / s3] };
    var layers = [["o", "B", -3.35], ["ti", "A", -2.35], ["c", "C", -1.25], ["ti", "B", 0], ["c", "A", 1.25], ["ti", "C", 2.35], ["o", "B", 3.35]];
    var radius = { ti: 0.82, c: 0.48, o: 0.52 };
    var byLayer = layers.map(function (l) {
      var list = [];
      for (var i = -6; i <= 6; i++) {
        for (var j = -6; j <= 6; j++) {
          var x = i * a + j * a / 2 + site[l[1]][0] - site.B[0];
          var y = j * a * s3 / 2 + site[l[1]][1] - site.B[1];
          if (x * x + y * y < R * R) list.push({ x: x, y: y, z: l[2], el: l[0] });
        }
      }
      return list;
    });
    var atoms = [], bonds = [];
    byLayer.forEach(function (list, k) {
      atoms = atoms.concat(list);
      if (k === byLayer.length - 1) return;
      list.forEach(function (p) {
        byLayer[k + 1].forEach(function (q) {
          var dx = p.x - q.x, dy = p.y - q.y, dz = p.z - q.z;
          if (dx * dx + dy * dy + dz * dz < 6.25) bonds.push([p, q]);
        });
      });
    });

    var theta = 0.5, elev = 0.42, dragging = false, lastX = 0, lastY = 0, raf = 0, lastT = 0, w = 0, h = 0, colors = {};
    var still = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    function readColors() {
      var cs = getComputedStyle(document.documentElement);
      ["ti", "c", "o", "bond"].forEach(function (k) { colors[k] = cs.getPropertyValue("--atom-" + k).trim() || "#888888"; });
    }
    function draw() {
      if (!w || !h) return;
      ctx.clearRect(0, 0, w, h);
      var ct = Math.cos(theta), st = Math.sin(theta), ce = Math.cos(elev), se = Math.sin(elev);
      var scale = Math.min(w, h) / (2 * R + 3);
      atoms.forEach(function (p) {
        var x1 = p.x * ct - p.y * st, y1 = p.x * st + p.y * ct;
        p.near = -y1 * ce + p.z * se;
        p.k = 1 / (1 - p.near / 70);
        p.X = w / 2 + x1 * scale * p.k;
        p.Y = h / 2 + (-y1 * se - p.z * ce) * scale * p.k;
      });
      var items = atoms.map(function (p) { return { n: p.near, atom: p }; })
        .concat(bonds.map(function (b) { return { n: (b[0].near + b[1].near) / 2 - 0.01, bond: b }; }));
      items.sort(function (m, n) { return m.n - n.n; });
      ctx.lineCap = "round";
      items.forEach(function (it) {
        if (it.bond) {
          ctx.strokeStyle = colors.bond;
          ctx.lineWidth = 0.17 * scale;
          ctx.beginPath();
          ctx.moveTo(it.bond[0].X, it.bond[0].Y);
          ctx.lineTo(it.bond[1].X, it.bond[1].Y);
          ctx.stroke();
          return;
        }
        var p = it.atom, r = radius[p.el] * scale * p.k;
        ctx.beginPath();
        ctx.arc(p.X, p.Y, r, 0, Math.PI * 2);
        ctx.fillStyle = colors[p.el];
        ctx.fill();
        var g = ctx.createRadialGradient(p.X - r * 0.35, p.Y - r * 0.4, r * 0.05, p.X, p.Y, r);
        g.addColorStop(0, "rgba(255,255,255,0.55)");
        g.addColorStop(0.45, "rgba(255,255,255,0)");
        g.addColorStop(1, "rgba(0,0,0,0.28)");
        ctx.fillStyle = g;
        ctx.fill();
      });
    }
    function resize() {
      var box = canvas.getBoundingClientRect(), d = window.devicePixelRatio || 1;
      w = box.width; h = box.height;
      canvas.width = Math.max(1, Math.round(w * d));
      canvas.height = Math.max(1, Math.round(h * d));
      ctx.setTransform(d, 0, 0, d, 0, 0);
      draw();
    }
    function loop(now) {
      if (!dragging) theta += (lastT ? Math.min(now - lastT, 50) : 16) * 0.00022;
      lastT = now;
      draw();
      raf = requestAnimationFrame(loop);
    }
    canvas.addEventListener("pointerdown", function (e) {
      dragging = true; lastX = e.clientX; lastY = e.clientY;
      try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* not supported */ }
    });
    canvas.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      theta += (e.clientX - lastX) * 0.01;
      elev = Math.max(0.12, Math.min(1.15, elev + (e.clientY - lastY) * 0.006));
      lastX = e.clientX; lastY = e.clientY;
      if (still) draw();
    });
    function release() { dragging = false; }
    canvas.addEventListener("pointerup", release);
    canvas.addEventListener("pointercancel", release);

    var observer = null;
    if (window.ResizeObserver) { observer = new ResizeObserver(resize); observer.observe(canvas); }
    else window.addEventListener("resize", resize);
    readColors();
    resize();
    if (!still) raf = requestAnimationFrame(loop);
    return {
      stop: function () {
        cancelAnimationFrame(raf);
        if (observer) observer.disconnect(); else window.removeEventListener("resize", resize);
      },
      recolor: function () { readColors(); draw(); }
    };
  }
  var figure = null;

  /* ---------- Pages ---------- */
  var PAGES = {
    home: function () {
      var profiles = '<li><span>' + icon("pin") + esc(L(S.contact.location)) + "</span></li>" +
        profileLinks().map(function (l) { return '<li><a href="' + esc(l.url) + '" rel="noopener">' + icon("ext") + esc(l.label) + "</a></li>"; }).join("");
      var explore = [
        ["research", "research.html", "flask", S.projects.length, "research.intro"],
        ["tutorials", "tutorials.html", "play", S.videos.length, "tut.intro"],
        ["scripts", "scripts.html", "code", S.scripts.length, "scr.intro"],
        ["notes", "notes.html", "note", S.notes.length, "notes.intro"]
      ].map(function (x) {
        return '<a class="card" href="' + x[1] + '"><span class="top"><span class="tile">' + icon(x[2]) + '</span><span class="count">' + x[3] + "</span></span>" +
          "<h3>" + esc(t("nav." + x[0])) + "</h3><p>" + esc(t(x[4])) + "</p></a>";
      }).join("");
      var html = '<section class="hero"><div><p class="eyebrow">' + esc(L(S.tagline)) + "</p><h1>" + esc(L(S.name)) + "</h1>" +
        '<p class="role">' + esc(L(S.role)) + "</p>" +
        '<p class="lead">' + esc(L(S.lead)) + "</p>" +
        '<div class="actions"><a class="btn primary" href="research.html">' + esc(t("home.btnResearch")) + icon("arrow") + "</a>" +
        '<a class="btn" href="about.html">' + icon("mail") + esc(t("home.btnContact")) + "</a></div>" +
        '<ul class="profiles">' + profiles + "</ul></div>" + cellFigure() + "</section>" +
        section(sectionHead("home.interests") + '<ul class="interests">' + S.interests.map(function (x) { return "<li>" + esc(L(x)) + "</li>"; }).join("") + "</ul>") +
        section(sectionHead("home.explore") + '<div class="explore">' + explore + "</div>");
      if (S.publications.length) html += section(sectionHead("home.latestPubs", "publications.html") +
        '<ul class="entries">' + S.publications.slice(0, 3).map(pubItem).join("") + "</ul>");
      if (S.videos.length) html += section(sectionHead("home.latestVideos", "tutorials.html") +
        '<div class="grid">' + S.videos.slice(0, 3).map(videoCard).join("") + "</div>");
      if (S.notes.length) html += section(sectionHead("home.latestNotes", "notes.html") +
        '<ul class="entries">' + S.notes.slice(0, 3).map(noteItem).join("") + "</ul>");
      return html;
    },
    research: function () {
      var D = S.dissertation, thesis = "";
      if (D) {
        var dfig = D.image ? '<figure class="shot overview-fig"><a href="' + esc(D.image) + '" target="_blank" rel="noopener"><img src="' + esc(D.image) + '" alt="' + esc(L(D.caption)) + '"></a>' +
          "<figcaption>" + esc(L(D.caption)) + "</figcaption></figure>" : "";
        thesis = '<article class="overview card"><p class="eyebrow">' + esc(t("research.thesis")) + '<span class="gap"></span>' + esc(D.year) + "</p>" +
          "<h2>" + esc(L(D.title)) + '</h2><ul class="facts">' + D.facts.map(function (f) { return "<li>" + esc(L(f)) + "</li>"; }).join("") + "</ul>" +
          dfig + '<p class="summary">' + esc(L(D.summary)) + "</p>" +
          "<h3>" + esc(t("research.findings")) + '</h3><ul class="findings">' + D.findings.map(function (f) { return "<li>" + esc(L(f)) + "</li>"; }).join("") + "</ul>" +
          tags(D.tags || []) + "</article>";
      }
      return pageHead("research.title", "research.intro") + thesis +
        '<div class="section-head projects-head"><h2>' + esc(t("research.projects")) + '</h2></div><div class="projects">' + S.projects.map(function (p) {
        var fig = p.image ? '<figure class="shot"><a href="' + esc(p.image) + '" target="_blank" rel="noopener"><img loading="lazy" src="' + esc(p.image) + '" alt="' + esc(L(p.caption)) + '"></a>' +
          "<figcaption>" + esc(L(p.caption)) + "</figcaption></figure>" : "";
        return '<article class="project card">' + fig + '<div><span class="badge ' + esc(p.status) + '">' + esc(t("status." + p.status)) + "</span></div>" +
          "<h3>" + esc(L(p.title)) + "</h3><p>" + esc(L(p.text)) + "</p>" + tags(p.tags || []) + "</article>";
      }).join("") + "</div>";
    },
    publications: function () {
      var html = pageHead("pubs.title", "pubs.intro"), years = [];
      S.publications.forEach(function (p) { if (years.indexOf(p.year) < 0) years.push(p.year); });
      years.sort(function (a, b) { return b - a; }).forEach(function (y) {
        html += '<h2 class="year">' + esc(y) + '</h2><ul class="entries">' +
          S.publications.filter(function (p) { return p.year === y; }).map(pubItem).join("") + "</ul>";
      });
      return html;
    },
    tutorials: function () {
      var chips = '<button type="button" class="chip" data-topic="all" aria-pressed="' + (state.topic === "all") + '">' + esc(t("tut.all")) + "</button>";
      Object.keys(S.videoTopics).forEach(function (k) {
        chips += '<button type="button" class="chip" data-topic="' + esc(k) + '" aria-pressed="' + (state.topic === k) + '">' + esc(L(S.videoTopics[k])) + "</button>";
      });
      var list = S.videos.filter(function (v) { return state.topic === "all" || v.topic === state.topic; });
      return pageHead("tut.title", "tut.intro") + '<div class="filters">' + chips + "</div>" +
        '<div class="grid">' + list.map(videoCard).join("") + "</div>";
    },
    scripts: function () {
      return pageHead("scr.title", "scr.intro") +
        '<div class="search-box">' + icon("search") + '<input class="search" id="script-search" type="search" placeholder="' + esc(t("scr.search")) +
        '" aria-label="' + esc(t("scr.search")) + '" value="' + esc(state.query) + '"></div>' +
        '<div id="script-list">' + scriptList() + "</div>";
    },
    notes: function () {
      var id = location.hash.replace("#", "");
      var note = S.notes.filter(function (n) { return n.id === id; })[0];
      if (note) {
        return '<article class="article"><a class="back" href="notes.html">' + icon("back") + esc(t("notes.back").replace(/^←\s*/, "")) + "</a>" +
          '<div class="page-head"><h1>' + esc(L(note.title)) + "</h1><p>" + esc(fmtDate(note.date)) + "</p></div>" +
          '<div class="note-body">' + L(note.body) + "</div></article>";
      }
      return pageHead("notes.title", "notes.intro") + '<ul class="entries">' + S.notes.map(noteItem).join("") + "</ul>";
    },
    about: function () {
      var A = S.about, C = S.contact, name = L(S.name);
      function cv(list) {
        return '<dl class="cv">' + list.map(function (x) {
          return "<div><dt>" + esc(L(x.what)) + "</dt><dd>" + esc(L(x.where)) +
            (x.when ? '<span class="period">' + esc(x.when) + "</span>" : "") + "</dd></div>";
        }).join("") + "</dl>";
      }
      var contact = "<li>" + icon("mail") + '<div><span class="label">' + esc(t("about.email")) + '</span><a href="mailto:' + esc(C.email) + '">' + esc(C.email) + "</a></div>" +
        '<button type="button" class="copy" data-copy="' + esc(C.email) + '" aria-label="' + esc(t("ui.copy")) + '" title="' + esc(t("ui.copy")) + '">' + icon("copy") + "</button></li>" +
        "<li>" + icon("pin") + '<div><span class="label">' + esc(t("about.location")) + "</span>" + esc(L(C.location)) + "</div></li>" +
        profileLinks().map(function (l) {
          return "<li>" + icon("ext") + '<a href="' + esc(l.url) + '" rel="noopener">' + esc(l.label) + "</a></li>";
        }).join("");
      return pageHead("about.title") + '<div class="two-col"><div>' +
        '<div class="prose">' + (A.bio[lang] || A.bio.en).map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("") + "</div>" +
        section(sectionHead("about.positions") + cv(A.positions)) +
        section(sectionHead("about.education") + cv(A.education)) +
        section(sectionHead("about.skills") + tags(A.skills)) + "</div>" +
        '<aside class="contact-card card"><div class="avatar" aria-hidden="true">' + esc(name.charAt(0)) + "</div>" +
        "<h2>" + esc(name) + '</h2><p class="role">' + esc(L(S.role)) + "</p>" +
        '<ul class="contact-list">' + contact + "</ul></aside></div>";
    },
    notfound: function () {
      return '<div class="notfound"><p class="code-big">404</p><h1>' + esc(t("nf.title")) + "</h1><p>" + esc(t("nf.text")) + "</p>" +
        '<a class="btn primary" href="index.html">' + esc(t("nf.home")) + "</a></div>";
    }
  };

  function scriptList() {
    var q = state.query.trim().toLowerCase();
    var list = S.scripts.filter(function (s) {
      return !q || (s.name + " " + s.language + " " + L(s.text)).toLowerCase().indexOf(q) >= 0;
    });
    if (!list.length) return '<p class="empty">' + esc(t("scr.none")) + "</p>";
    return '<ul class="entries">' + list.map(function (s) {
      var links = [];
      if (s.file) links.push('<a class="btn small" href="' + esc(s.file) + '" download>' + icon("download") + esc(t("scr.download")) + "</a>");
      if (s.source) links.push('<a class="btn small" href="' + esc(s.source) + '" rel="noopener">' + icon("ext") + esc(t("scr.source")) + "</a>");
      if (!links.length) links.push('<span class="muted">' + esc(t("scr.soon")) + "</span>");
      return '<li class="entry card"><span class="tile">' + icon("code") + "</span>" +
        '<div class="entry-meta"><span class="entry-title mono">' + esc(s.name) + '</span><span class="badge">' + esc(s.language) + "</span></div>" +
        '<p class="entry-text">' + esc(L(s.text)) + "</p>" +
        '<div class="entry-links">' + links.join("") + "</div></li>";
    }).join("") + "</ul>";
  }

  /* ---------- Copy to clipboard ---------- */
  function copyText(text, btn) {
    function done() {
      btn.classList.add("done");
      btn.innerHTML = icon("check");
      btn.setAttribute("aria-label", t("ui.copied"));
      setTimeout(function () {
        btn.classList.remove("done");
        btn.innerHTML = icon("copy");
        btn.setAttribute("aria-label", t("ui.copy"));
      }, 1600);
    }
    function fallback() {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { if (document.execCommand("copy")) done(); } catch (e) { /* copying not available */ }
      document.body.removeChild(ta);
    }
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, fallback);
    else fallback();
  }
  function addCodeCopyButtons() {
    var blocks = document.querySelectorAll(".note-body pre");
    Array.prototype.forEach.call(blocks, function (pre) {
      var box = document.createElement("div");
      box.className = "code";
      pre.parentNode.insertBefore(box, pre);
      box.appendChild(pre);
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "copy";
      btn.setAttribute("data-copy-code", "");
      btn.setAttribute("aria-label", t("ui.copy"));
      btn.title = t("ui.copy");
      btn.innerHTML = icon("copy");
      box.appendChild(btn);
    });
  }

  /* ---------- Render and events ---------- */
  function render() {
    if (figure) { figure.stop(); figure = null; }
    document.documentElement.lang = lang;
    document.getElementById("site-header").innerHTML = header();
    document.getElementById("site-header").classList.remove("open");
    document.getElementById("site-footer").innerHTML = footer();
    var main = document.getElementById("content");
    main.innerHTML = PAGES[page] ? PAGES[page]() : "";
    main.className = "wrap" + (state.first ? " enter" : "");
    state.first = false;
    addCodeCopyButtons();
    figure = startFigure();
    var label = page === "home" ? L(S.tagline) : (page === "notfound" ? t("nf.title") : t("nav." + page));
    document.title = siteName() + " · " + label;
  }
  function refocus(selector) { var el = document.querySelector(selector); if (el) el.focus(); }

  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-lang]");
    if (b) {
      lang = b.getAttribute("data-lang");
      try { localStorage.setItem("lang", lang); } catch (err) { /* ignore */ }
      render();
      refocus('[data-lang="' + lang + '"]');
      return;
    }
    if (e.target.closest("[data-skip]")) {
      e.preventDefault();
      var target = document.getElementById("content");
      target.setAttribute("tabindex", "-1");
      target.focus();
      return;
    }
    if (e.target.closest("#theme-btn")) {
      var next = isDark() ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (err2) { /* ignore */ }
      document.getElementById("theme-btn").innerHTML = icon(next === "dark" ? "sun" : "moon");
      if (figure) figure.recolor();
      return;
    }
    var menu = e.target.closest("#menu-btn");
    if (menu) {
      var open = document.getElementById("site-header").classList.toggle("open");
      menu.setAttribute("aria-expanded", String(open));
      return;
    }
    var chip = e.target.closest("[data-topic]");
    if (chip) {
      state.topic = chip.getAttribute("data-topic");
      render();
      refocus('[data-topic="' + state.topic + '"]');
      return;
    }
    var copy = e.target.closest("[data-copy]");
    if (copy) { copyText(copy.getAttribute("data-copy"), copy); return; }
    var copyCode = e.target.closest("[data-copy-code]");
    if (copyCode) { copyText(copyCode.parentNode.querySelector("pre").textContent, copyCode); return; }
    var yt = e.target.closest("[data-yt]");
    if (yt) {
      var frame = document.createElement("div");
      frame.className = "video-frame";
      frame.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(yt.getAttribute("data-yt")) +
        '?autoplay=1" title="YouTube video" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>';
      yt.replaceWith(frame);
    }
  });
  document.addEventListener("input", function (e) {
    if (e.target.id === "script-search") {
      state.query = e.target.value;
      document.getElementById("script-list").innerHTML = scriptList();
    }
  });
  window.addEventListener("hashchange", function () { if (page === "notes") { render(); window.scrollTo(0, 0); } });

  render();
})();
