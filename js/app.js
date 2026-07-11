/* Pedagogical Friction Studio - public view loader and renderer */
(function () {
  "use strict";

  var state = { ideas: null, traditions: [], references: [], refById: {} };

  function $(sel, root) { return (root || document).querySelector(sel); }
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function showError(msg) {
    var b = $("#error-banner");
    b.hidden = false;
    b.textContent = msg;
  }

  function load(path) {
    return fetch(path).then(function (r) {
      if (!r.ok) throw new Error("Could not load " + path + " (" + r.status + ")");
      return r.json();
    });
  }

  /* ---------- HERO ---------- */
  function renderHero() {
    var o = state.ideas.overview || {};
    $("#hero-sub").textContent = o.abstract_short || "";
    var stats = [
      [state.ideas.stages.length, "media-ecology stages"],
      [state.traditions.length, "intellectual traditions"],
      [state.references.length, "sources mapped"],
      [state.ideas.framework_dimensions.length, "friction dimensions"]
    ];
    var dl = $("#hero-stats");
    dl.innerHTML = "";
    stats.forEach(function (s) {
      var d = el("div");
      d.appendChild(el("dt", null, String(s[0])));
      d.appendChild(el("dd", null, s[1]));
      dl.appendChild(d);
    });
  }

  /* ---------- THE ARC ---------- */
  function renderArc() {
    var rail = $("#stage-rail");
    rail.innerHTML = "";
    state.ideas.stages.forEach(function (stage, i) {
      var chip = el("button", "stage-chip");
      chip.type = "button";
      chip.setAttribute("role", "tab");
      chip.setAttribute("aria-selected", i === 0 ? "true" : "false");
      chip.innerHTML = '<span class="num">Stage ' + (i + 1) + '</span>' +
        '<span class="label">' + esc(stage.label) + "</span>";
      chip.addEventListener("click", function () { selectStage(i); });
      rail.appendChild(chip);
    });
    selectStage(0);
  }
  function selectStage(i) {
    var chips = document.querySelectorAll(".stage-chip");
    chips.forEach(function (c, idx) { c.setAttribute("aria-selected", idx === i ? "true" : "false"); });
    var s = state.ideas.stages[i];
    var d = $("#stage-detail");
    d.innerHTML = "";
    d.appendChild(el("h3", null, esc(s.label)));
    d.appendChild(el("p", "summary", esc(s.summary)));
    if (s.source_anchor) d.appendChild(el("p", "anchor", "&ldquo;" + esc(s.source_anchor) + "&rdquo;"));
  }

  /* ---------- TRADITIONS ---------- */
  function renderTraditions() {
    var list = $("#tradition-list");
    list.innerHTML = "";
    state.traditions.forEach(function (t, i) {
      var li = el("li");
      var b = el("button");
      b.type = "button";
      b.setAttribute("role", "tab");
      b.setAttribute("aria-selected", i === 0 ? "true" : "false");
      b.innerHTML = '<span class="t-name">' + esc(t.name) + '</span>' +
        '<span class="t-era">' + esc(t.era) + "</span>";
      b.addEventListener("click", function () { selectTradition(i); });
      li.appendChild(b);
      list.appendChild(li);
    });
    selectTradition(0);
  }
  function selectTradition(i) {
    var btns = document.querySelectorAll("#tradition-list button");
    btns.forEach(function (b, idx) { b.setAttribute("aria-selected", idx === i ? "true" : "false"); });
    var t = state.traditions[i];
    var d = $("#tradition-detail");
    d.innerHTML = "";
    d.appendChild(el("h3", null, esc(t.name)));
    d.appendChild(el("p", "t-thinkers", esc((t.thinkers || []).join(" · "))));
    d.appendChild(el("p", "t-contribution", esc(t.contribution)));

    var chips = el("div", "chip-row");
    (t.frictions || []).forEach(function (f) {
      chips.appendChild(el("span", "fchip " + f, esc(frictionLabel(f))));
    });
    d.appendChild(chips);

    var works = el("ul", "t-works");
    (t.refs || []).forEach(function (rid) {
      var r = state.refById[rid];
      if (!r) return;
      var li = el("li");
      li.innerHTML = '<span class="yr">' + esc(r.year) + "</span>" +
        esc(r.author) + ". <em>" + esc(r.title) + "</em>.";
      works.appendChild(li);
    });
    d.appendChild(works);

  }
  function frictionLabel(f) {
    return { noetic: "Noetic", rhetorical: "Rhetorical", existential: "Existential", infrastructural: "Infrastructural" }[f] || f;
  }

  /* ---------- FRAMEWORK ---------- */
  function renderFramework() {
    var grid = $("#framework-grid");
    grid.innerHTML = "";
    state.ideas.framework_dimensions.forEach(function (dim, i) {
      var card = el("button", "fw-card " + dim.id);
      card.type = "button";
      card.setAttribute("aria-selected", i === 0 ? "true" : "false");
      var parts = (dim.label.match(/\(([^)]+)\)/) || [null, dim.label])[1];
      var name = dim.label.replace(/\s*\([^)]*\)/, "");
      card.innerHTML = '<span class="fw-tag">' + esc(parts) + '</span>' +
        '<span class="fw-name">' + esc(name) + "</span>";
      card.addEventListener("click", function () { selectDimension(i); });
      grid.appendChild(card);
    });
    selectDimension(0);

    var pv = state.ideas.concepts.filter(function (c) { return c.id === "productive_vs_exclusionary"; })[0];
    var dist = $("#distinction");
    if (pv) {
      dist.innerHTML = "<h3>" + esc(pv.title) + "</h3><p>" + esc(pv.definition) + "</p>";
    }
  }
  function selectDimension(i) {
    var cards = document.querySelectorAll(".fw-card");
    cards.forEach(function (c, idx) { c.setAttribute("aria-selected", idx === i ? "true" : "false"); });
    var dim = state.ideas.framework_dimensions[i];
    var d = $("#framework-detail");
    d.innerHTML = "";
    d.appendChild(el("h3", null, esc(dim.label)));
    d.appendChild(el("p", null, esc(dim.definition)));
    if (dim.examples && dim.examples.length) {
      var ex = el("div", "examples");
      dim.examples.forEach(function (e) { ex.appendChild(el("span", null, esc(e))); });
      d.appendChild(ex);
    }
  }

  /* ---------- LIBRARY ---------- */
  function renderLibraryControls() {
    var sel = $("#ref-tradition");
    state.traditions.forEach(function (t) {
      var o = el("option");
      o.value = t.id; o.textContent = t.name;
      sel.appendChild(o);
    });
    $("#ref-search").addEventListener("input", renderRefList);
    $("#ref-tradition").addEventListener("change", renderRefList);
    $("#ref-friction").addEventListener("change", renderRefList);
    renderRefList();
  }
  function traditionName(id) {
    var t = state.traditions.filter(function (x) { return x.id === id; })[0];
    return t ? t.name : id;
  }
  function renderRefList() {
    var q = $("#ref-search").value.trim().toLowerCase();
    var trad = $("#ref-tradition").value;
    var fric = $("#ref-friction").value;
    var ul = $("#ref-list");
    ul.innerHTML = "";

    var matches = state.references.filter(function (r) {
      if (trad && r.tradition !== trad) return false;
      if (fric && (r.frictions || []).indexOf(fric) === -1) return false;
      if (q) {
        var hay = (r.author + " " + r.title + " " + r.venue + " " + r.annotation).toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    }).sort(function (a, b) { return a.author.localeCompare(b.author); });

    $("#ref-count").textContent = matches.length + " of " + state.references.length + " sources";

    matches.forEach(function (r) {
      var li = el("li", "ref-card");
      var doi = r.doi ? '<a class="doi" href="https://doi.org/' + esc(r.doi) + '" target="_blank" rel="noopener">DOI</a>' : "";
      var trd = state.traditions.filter(function (x) { return x.id === r.tradition; })[0];
      var flag = "";
      var frics = (r.frictions || []).map(function (f) {
        return '<span class="fchip ' + f + '">' + esc(frictionLabel(f)) + "</span>";
      }).join(" ");
      li.innerHTML =
        '<div class="ref-head">' +
          '<p class="ref-cite">' + esc(r.author) + ' <span class="yr">(' + esc(r.year) + ')</span>. ' + esc(r.title) + ".</p>" +
        "</div>" +
        '<p class="ref-venue">' + esc(r.venue) + "</p>" +
        '<p class="ref-annot">' + esc(r.annotation) + "</p>" +
        '<div class="ref-meta">' +
          '<span class="pill">' + esc(traditionName(r.tradition)) + "</span>" +
          frics + " " + flag + " " + doi +
        "</div>";
      ul.appendChild(li);
    });
  }

  /* ---------- BOOT ---------- */
  Promise.all([
    load("data/ideas.json"),
    load("data/traditions.json"),
    load("data/references.json")
  ]).then(function (res) {
    state.ideas = res[0];
    state.traditions = res[1].traditions || [];
    state.references = (res[2].references || []).filter(function (r) { return r.verified !== false; });
    state.references.forEach(function (r) { state.refById[r.id] = r; });

    renderHero();
    renderArc();
    renderTraditions();
    renderFramework();
    renderLibraryControls();
  }).catch(function (err) {
    showError(err.message + "  Tip: run a local server (python -m http.server) and open http://localhost:8000 rather than opening the file directly.");
    console.error(err);
  });
})();
