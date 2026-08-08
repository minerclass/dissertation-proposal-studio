/* Pedagogical Friction Studio - public view loader and renderer */
(function () {
  "use strict";

  var state = { ideas: null, traditions: [], references: [], refById: {} };
  var DATA_VERSION = "20260804c";

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

  function asArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function load(path) {
    var separator = path.indexOf("?") === -1 ? "?" : "&";
    return fetch(path + separator + "v=" + DATA_VERSION).then(function (r) {
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
      [asArray(state.ideas.research_questions && state.ideas.research_questions.dissertation).length, "dissertation RQs"],
      [state.ideas.framework_dimensions.length, "friction dimensions"],
      [state.references.length, "sources mapped"]
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
      // Author strings usually already end in a period ("Ong, W. J.") and some
      // titles end in a question mark, so only add the separators that are
      // actually missing.
      var author = String(r.author || "");
      var title = String(r.title || "");
      var afterAuthor = /[.?!]$/.test(author) ? " " : ". ";
      var afterTitle = /[.?!]$/.test(title) ? "" : ".";
      li.innerHTML = '<span class="yr">' + esc(r.year) + "</span>" +
        esc(author) + afterAuthor + "<em>" + esc(title) + "</em>" + afterTitle;
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

  /* ---------- RESEARCH QUESTIONS ---------- */
  var currentRqSet = "dissertation";
  var selectedRqIndex = 0;

  function renderResearchQuestions() {
    var tabDiss = $("#tab-rq-dissertation");
    var tabQp = $("#tab-rq-qp");
    var roleFilter = $("#rq-role-filter");
    var frictionFilter = $("#rq-friction-filter");

    if (!tabDiss || !tabQp) return;

    tabDiss.addEventListener("click", function () {
      currentRqSet = "dissertation";
      selectedRqIndex = 0;
      tabDiss.classList.add("active");
      tabDiss.setAttribute("aria-selected", "true");
      tabQp.classList.remove("active");
      tabQp.setAttribute("aria-selected", "false");
      if (roleFilter) roleFilter.style.display = "";
      updateRqList();
    });

    tabQp.addEventListener("click", function () {
      currentRqSet = "qualifying_paper";
      selectedRqIndex = 0;
      tabQp.classList.add("active");
      tabQp.setAttribute("aria-selected", "true");
      tabDiss.classList.remove("active");
      tabDiss.setAttribute("aria-selected", "false");
      if (roleFilter) roleFilter.style.display = "none";
      updateRqList();
    });

    if (roleFilter) roleFilter.addEventListener("change", function () { selectedRqIndex = 0; updateRqList(); });
    if (frictionFilter) frictionFilter.addEventListener("change", function () { selectedRqIndex = 0; updateRqList(); });

    updateRqList();
  }

  function updateRqList() {
    var items = asArray(state.ideas.research_questions && state.ideas.research_questions[currentRqSet]);
    var roleVal = $("#rq-role-filter") ? $("#rq-role-filter").value : "";
    var fricVal = $("#rq-friction-filter") ? $("#rq-friction-filter").value : "";

    var filtered = items.filter(function (rq) {
      if (currentRqSet === "dissertation" && roleVal) {
        if (!rq.role_groups || rq.role_groups.indexOf(roleVal) === -1) return false;
      }
      if (fricVal) {
        if (!rq.frictions || rq.frictions.indexOf(fricVal) === -1) return false;
      }
      return true;
    });

    var container = $("#rq-cards-container");
    if (!container) return;
    container.innerHTML = "";

    if (filtered.length === 0) {
      container.appendChild(el("p", "empty-msg", "No research questions match the selected filters."));
      var dView = $("#rq-detail-view");
      if (dView) dView.innerHTML = "";
      return;
    }

    if (selectedRqIndex >= filtered.length) selectedRqIndex = 0;

    filtered.forEach(function (rq, idx) {
      var card = el("div", "rq-card" + (idx === selectedRqIndex ? " active" : ""));
      card.setAttribute("tabindex", "0");
      card.setAttribute("role", "button");

      var roleTagsHtml = (rq.role_groups || []).map(function (rg) {
        var shortRole = rg.split(" ")[0];
        return '<span class="rq-role-tag">' + esc(shortRole) + '</span>';
      }).join(" ");

      var fricChipsHtml = (rq.frictions || []).map(function (f) {
        return '<span class="fchip ' + f + '">' + esc(frictionLabel(f)) + '</span>';
      }).join(" ");

      card.innerHTML =
        '<div class="rq-card-header">' +
          '<span class="rq-badge">' + esc(rq.id) + '</span>' +
          '<h3 class="rq-card-title">' + esc(rq.title || "Research Question") + '</h3>' +
        '</div>' +
        '<blockquote class="rq-question-text">&ldquo;' + esc(rq.question) + '&rdquo;</blockquote>' +
        '<div class="rq-card-meta">' +
          '<div class="rq-meta-roles">' + roleTagsHtml + '</div>' +
          '<div class="rq-meta-frictions">' + fricChipsHtml + '</div>' +
        '</div>';

      card.addEventListener("click", function () {
        selectedRqIndex = idx;
        renderRqCards(filtered);
        renderRqDetail(rq);
      });

      container.appendChild(card);
    });

    renderRqDetail(filtered[selectedRqIndex]);
  }

  function renderRqCards(filtered) {
    var cards = document.querySelectorAll(".rq-card");
    cards.forEach(function (c, idx) {
      if (idx === selectedRqIndex) c.classList.add("active");
      else c.classList.remove("active");
    });
  }

  function renderRqDetail(rq) {
    var d = $("#rq-detail-view");
    if (!d || !rq) { if (d) d.innerHTML = ""; return; }

    var isDiss = currentRqSet === "dissertation";

    var roleChips = (rq.role_groups || []).map(function (r) {
      return '<span class="role-pill"><i class="fa-solid fa-user-gear"></i> ' + esc(r) + '</span>';
    }).join(" ");

    var fricChips = (rq.frictions || []).map(function (f) {
      return '<span class="fchip ' + f + '">' + esc(frictionLabel(f)) + '</span>';
    }).join(" ");

    var primEv = (rq.primary_evidence || []).map(function (e) {
      return '<li><i class="fa-solid fa-check-circle" style="color:var(--accent);"></i> ' + esc(e) + '</li>';
    }).join("");

    var contEv = (rq.contextual_evidence || []).map(function (e) {
      return '<li><i class="fa-solid fa-database" style="color:var(--accent-2);"></i> ' + esc(e) + '</li>';
    }).join("");

    var methodSec = isDiss ? (
      '<div class="rq-method-grid">' +
        '<div class="rq-method-box">' +
          '<h4><i class="fa-solid fa-clipboard-user"></i> Primary Bounded-Case Evidence (QUAL)</h4>' +
          '<ul>' + primEv + '</ul>' +
        '</div>' +
        '<div class="rq-method-box">' +
          '<h4><i class="fa-solid fa-chart-line"></i> Contextual & Structural Support (quan)</h4>' +
          '<ul>' + contEv + '</ul>' +
        '</div>' +
      '</div>' +
      '<div class="rq-target-box">' +
        '<h4><i class="fa-solid fa-diagram-project"></i> Methodological Joint Display & Integration Target</h4>' +
        '<p>' + esc(rq.integration_target || "") + '</p>' +
      '</div>'
    ) : "";

    d.innerHTML =
      '<div class="rq-detail-head">' +
        '<span class="rq-detail-badge">' + esc(rq.id) + '</span>' +
        '<h3>' + esc(rq.title) + '</h3>' +
      '</div>' +
      '<blockquote class="rq-detail-question">&ldquo;' + esc(rq.question) + '&rdquo;</blockquote>' +
      (rq.focus ? '<p class="rq-focus"><strong>Analytical Focus:</strong> ' + esc(rq.focus) + '</p>' : '') +
      '<div class="rq-detail-tags-row">' +
        '<div><strong>Framework Alignment:</strong> ' + fricChips + '</div>' +
        (roleChips ? '<div style="margin-top:0.4rem;"><strong>Role Perspectives:</strong> ' + roleChips + '</div>' : '') +
      '</div>' +
      methodSec;
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
        var hay = [r.citation, r.author, r.title, r.venue, r.annotation]
          .filter(Boolean).join(" ").toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    }).sort(function (a, b) {
      return (a.author || a.citation || "").localeCompare(b.author || b.citation || "");
    });

    $("#ref-count").textContent = matches.length + " of " + state.references.length + " sources";

    matches.forEach(function (r) {
      var li = el("li", "ref-card");
      var sourceUrl = r.doi ? "https://doi.org/" + r.doi : r.url;
      var sourceLabel = r.doi ? "DOI" : "Source";
      var source = sourceUrl ? '<a class="doi" href="' + esc(sourceUrl) + '" target="_blank" rel="noopener">' + sourceLabel + "</a>" : "";
      var trd = state.traditions.filter(function (x) { return x.id === r.tradition; })[0];
      var drive = trd && trd.driveUrl ? '<a class="drive" href="' + esc(trd.driveUrl) + '" target="_blank" rel="noopener">Drive folder</a>' : "";
      var citation = r.citation || (r.author + " (" + r.year + "). " + r.title + ".");
      var venue = r.citation || !r.venue ? "" : '<p class="ref-venue">' + esc(r.venue) + "</p>";
      var annotation = r.annotation ? '<p class="ref-annot">' + esc(r.annotation) + "</p>" : "";
      var tradition = r.tradition ? '<span class="pill">' + esc(traditionName(r.tradition)) + "</span>" : "";
      var frics = (r.frictions || []).map(function (f) {
        return '<span class="fchip ' + f + '">' + esc(frictionLabel(f)) + "</span>";
      }).join(" ");
      li.innerHTML =
        '<div class="ref-head">' +
          '<p class="ref-cite">' + esc(citation) + "</p>" +
        "</div>" +
        venue +
        annotation +
        '<div class="ref-meta">' +
          tradition + " " + frics + " " + source + (drive ? " " + drive : "") +
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
    renderResearchQuestions();
    renderLibraryControls();
  }).catch(function (err) {
    showError(err.message + "  Tip: run a local server (python -m http.server) and open http://localhost:8000 rather than opening the file directly.");
  });
})();
