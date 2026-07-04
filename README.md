# Pedagogical Friction Studio

An interactive, two-tier companion for Micah J. Miner's dissertation proposal,
*Pedagogical Friction in the Age of Generative AI and Tertiary Algorithmicity*
(Ed.D. in Curriculum, Advocacy & Policy, National Louis University).

It does two jobs:

1. **Public intellectual history** (`index.html`): an interactive map of the argument and the
   intellectual lineages behind it, from Walter Ong's media ecology through critical algorithm
   studies and the current generative-AI scholarship. Walk the five-stage arc, explore the
   traditions, study the friction framework, and search the reference library.
2. **Private defense prep** (`private/`, local only): a Defense Studio with claims and evidence,
   the methodology walkthrough, mock committee Q&A, a rubric self-check, and IRB talking points.

## Structure

```
index.html              Public single-page experience
css/styles.css          Styles
js/app.js               Loads data/*.json and renders the four public views
data/ideas.json         Conceptual model: stages, framework, RQs, design
data/traditions.json    Intellectual-history lineage nodes + links to friction and Drive folders
data/references.json    Citation-level references (from the compiled annotated bibliography)
private/                LOCAL ONLY, gitignored: defense.html + defense.json + README-private.md
```

## Run locally

Browsers block `fetch()` from `file://`, so use a tiny local server:

```bash
python -m http.server 8000
```

- Public site: <http://localhost:8000/>
- Private studio: <http://localhost:8000/private/defense.html>

## Privacy model

This repo is meant to be **public** (GitHub Pages free tier serves public repos). The entire
`private/` directory is gitignored and never committed, so committee names and candid
self-assessment stay on your machine. Before pushing, confirm:

```bash
git status                              # private/ must not appear
git check-ignore private/defense.json   # must print the path
```

The public pages present scholarly orientation only. They do not report dissertation findings, and
citations should be verified against originals before quoting.

## Deploy to GitHub Pages (when you are ready)

1. Create a new **public** repo under `minerclass` (suggested name: `pedagogical-friction-studio`).
2. From this folder: `git init && git add -A && git commit -m "Initial studio"` (the `private/`
   folder is excluded automatically).
3. `git branch -M main && git remote add origin <repo-url> && git push -u origin main`.
4. In the repo settings, enable Pages: Deploy from a branch, `main`, `/ (root)`.
5. Visit `https://minerclass.github.io/<repo-name>/` and click through every view.

## Data sources

- `data/ideas.json` is the evolved conceptual model originally built in `micah_dissertation_explorer`.
- `data/references.json` is drawn from the compiled annotated bibliography in Google Drive
  (`annotated_bibliography_merged_tagged`) and the AECT annotated-bib document. Entries marked
  `verified: false` need a citation check.
- `private/defense.json` draws on the Chapter 1-3 draft and the ESR 616 mixed-methods materials.

## Writing convention

User-facing copy avoids em dashes by author preference. Use commas, colons, or restructured
sentences. En dashes in ranges (K-12) are fine.

## License

This repository is dual-licensed to separate code from scholarship:

- **Code** (HTML, CSS, JavaScript, config): [MIT License](LICENSE).
- **Written and scholarly content** (framework descriptions, prose, figures): [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), reuse and adapt with attribution to Micah J. Miner.

The Pedagogical Friction framework and its terminology are the author's scholarly work; please cite the dissertation and related publications when building on them.
