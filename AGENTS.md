# AGENTS.md

Guidance for any agent working in this repository.

## Purpose

A two-tier companion to Micah Miner's dissertation proposal: a **public** interactive intellectual
history of the references and argument, and a **private** defense-prep studio.

## Public / private boundary (load-bearing)

- The repo is public so GitHub Pages can serve it.
- The `private/` folder is gitignored and must **never** be committed or pushed. It holds committee
  names, candid rubric self-assessment, and IRB language.
- Before any commit: `git status` must not list `private/`. If it does, stop and fix `.gitignore`.
- Do not move sensitive content out of `private/` into any tracked file.

## Canonical terminology (keep consistent with sibling sites)

- Five media-ecology stages: primary orality, literacy, secondary orality, **algorithmic secondary
  orality**, **tertiary algorithmicity**.
- Three pressures of tertiary algorithmicity: **noetic displacement, rhetorical saturation,
  existential abstraction**.
- Framework: **Pedagogical Friction** with four dimensions (noetic/head, rhetorical/room,
  existential/world, infrastructural/system) and the **productive vs. exclusionary** distinction.
- Design: **qualitative-dominant convergent mixed methods**, collective instrumental case study.

## Data and privacy restrictions

- Do not fabricate citations, quotations, page numbers, or findings.
- Reference entries marked `verified: false` need a source check before they are quoted.
- No participant data, transcripts, district specifics, tokens, or raw unverified AI output in any
  tracked file.
- The public pages must not imply dissertation results before data collection and analysis.

## Editing model

- No build step. Vanilla HTML/CSS/JS plus JSON in `data/`. Edit JSON to change content; edit
  `js/app.js` and `css/styles.css` for behavior and presentation.
- User-facing copy avoids em dashes by author preference.

## Validation

```bash
python -m http.server 8000     # then click through every view at http://localhost:8000/
git status                      # confirm private/ is ignored
```

## Related repositories

Part of the `minerclass` dissertation ecosystem (see `dissertation-overview`,
`genAI-ML-the-technologizing-word-site`, `genAI-ML-pedagogy-of-friction-site`,
`dissertationquestionsbeta`). Check those for canonical wording before changing terminology here.
