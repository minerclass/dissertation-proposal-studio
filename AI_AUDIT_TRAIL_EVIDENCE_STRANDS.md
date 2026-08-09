# AI-Use Audit Trail: Evidence Strand Mapping and Case-Study Terminology Removal

**Date of Log**: 2026-08-09
**Researcher / Author**: Micah J. Miner (assisted by Claude Opus 5, Claude Code)
**Project Context**: Qualitative-dominant convergent mixed-methods study on *Pedagogical Friction in the Age of Generative AI* (Ed.D., National Louis University).
**Audit Purpose**: Record why the Research Questions section stopped presenting the educator survey as qualitative evidence, and record the removal of the last case-study wording from the shipped site.

---

## 1. Executive Summary

| Item | Details |
| :--- | :--- |
| **Files Modified** | `data/ideas.json`, `js/app.js`, `css/styles.css`, `index.html` |
| **Trigger** | The `#rqs` evidence map displayed the educator survey under a heading reading "Primary Bounded-Case Evidence (QUAL)", contradicting `design.quantitative.sources` in the same data file, which lists the instrument as quantitative |
| **Root Cause** | Two different distinctions had been collapsed into one. The data fields encoded primary versus contextual; the rendered headings asserted QUAL versus quan |
| **Result** | Evidence is now carried as a single `evidence` array in which every item declares its own `strand` and `role`. The renderer groups by those fields and no longer asserts a strand anywhere in markup |
| **Also Corrected** | `design.approach` and the `#rqs` section intro, which still described the study as a case study |

## 2. The defect

`renderRqDetail()` in `js/app.js` built a two-column evidence map with hardcoded headings:

* "Primary Bounded-Case Evidence (QUAL)", populated from `primary_evidence`
* "Contextual & Structural Support (quan)", populated from `contextual_evidence`

The two underlying arrays sort evidence by **role in the design**, meaning collected from participants versus drawn from elsewhere. The two headings assert **methodological strand**. Those axes are not the same axis, so any item whose role and strand disagreed was mislabeled.

Three items disagreed:

| Item | Displayed as | Actually |
| :--- | :--- | :--- |
| Educator survey items (RQ1, RQ2, RQ3) | QUAL | quan |
| University-student retrospective accounts (RQ1) | quan | QUAL |
| Synthesized joint display meta-inferences (RQ3) | quan | mixed, and an integration product rather than a data source |

The survey mislabel was the visible one because the survey appears in all three research questions. The inverse error on the university-student accounts confirms that the columns were never sorting by strand.

This was a presentation defect. No research question wording, no instrument, and no analysis plan changed. `AGENTS.md` has stated since before this change that "role-based practitioner interviews and the educator survey form the analytic core," and `design.quantitative.sources` has listed the "Original teacher survey instrument" throughout. The site's own data was already correct; only the `#rqs` rendering disagreed with it.

## 3. The schema change

`primary_evidence` and `contextual_evidence` were replaced by one `evidence` array. Each entry is self-describing:

```json
{ "source": "Educator survey items (policy clarity, PD access, leadership support, tool access)",
  "strand": "quan",
  "role": "core" }
```

`strand` takes `qual`, `quan`, or `mixed`. `role` takes `core` or `supplementary`. The renderer derives three columns from these fields:

| Column | Filter |
| :--- | :--- |
| Analytic Core (QUAL) | `role: core`, `strand: qual` |
| Analytic Core (quan) | `role: core`, `strand: quan` |
| Supplementary & Contextual | `role: supplementary`, any strand, each item chipped with its own strand |

Because strand now travels with the item rather than with the column, the class of error described in section 2 cannot recur through re-bucketing.

## 4. Two judgment calls

**The third column is not labeled "quan".** The obvious three-column reading of the design would be QUAL core, quan core, quan contextual. That holds for RQ2, where the supplementary evidence is the NCES School Pulse Panel and the RAND American Educator Panel. It fails for RQ1, whose supplementary evidence is university-student retrospective accounts, qualitative per `AGENTS.md`, and for RQ3, whose supplementary entry is a mixed-methods integration product. Naming the column "quan" would have reproduced the original defect at a new location, so the column is named for role and each item carries a visible strand chip.

**RQ3's survey entry is tagged `quan`, and this is contestable.** "Educator survey policy & design recommendations" is tagged quantitative for consistency with `design.quantitative.sources`. If those items are open-response rather than closed-form, they are qualitative and the entry belongs in the first column. Flagged for researcher decision; not resolved here.

## 5. Terminology correction

The 2026-08-07 note in `AI_AUDIT_TRAIL.md` corrected four passages that described the design as a Merriam-aligned case study. Two further instances survived in files that note did not cover, both of them user-facing:

| Location | Was | Now |
| :--- | :--- | :--- |
| `data/ideas.json`, `design.approach` | "Qualitative-dominant convergent mixed methods case study (QUAL + quan) aligned with Merriam's interpretive tradition." | "Qualitative-dominant convergent mixed methods (QUAL + quan) grounded in constructivist qualitative inquiry." |
| `index.html`, `#rqs` section intro | "three primary research questions defining a single bounded case of K–12 educator and institutional sensemaking" | "three primary research questions on K–12 educator and institutional sensemaking, investigated through qualitative-dominant convergent mixed methods grounded in constructivist qualitative inquiry" |

Both replacements use the canonical wording in `AGENTS.md`. The phrase "Primary Bounded-Case Evidence" was removed as part of the section 3 rewrite. No case-study or bounded-case wording remains in `index.html`, `js/`, `css/`, or `data/ideas.json`.

## 6. Method and verification

* **Tools Used**: Read, Edit, and Grep for source changes; local `python -m http.server` with browser inspection for verification.
* **Cache Version**: `DATA_VERSION` and the two `?v=` query strings in `index.html` were bumped from `20260804c` to `20260809a`. Without this, a returning visitor would have received the new `js/app.js` alongside a cached `data/ideas.json` carrying the removed field names, and every evidence column would have rendered empty.
* **Verification**: `data/ideas.json` validated with `json.load`. All three research questions were opened in the browser and their rendered evidence maps read back in full. The survey appears under Analytic Core (quan) in all three; the university-student accounts appear under Supplementary with a QUAL chip; the RQ3 meta-inferences entry appears with a mixed chip. No console errors. Grid confirmed to collapse from three columns to two at 1000px and to one at 375px with no horizontal overflow. Grep confirmed no remaining reader of `primary_evidence` or `contextual_evidence`, and no remaining case-study wording in shipped files. No em dashes introduced in user-facing copy. `private/` confirmed untracked before commit.
* **Guardrails**: No participant data, no findings, and no citation text were introduced or altered. The change is confined to how existing, researcher-authored evidence labels are grouped and displayed.

## 7. Known issues not addressed here

* Sibling repositories still carry the dropped case-study framing: `dissertationquestionsbeta` (23 matches) and `dissertation-overview` (3 matches) as of this date. `AGENTS.md` asks that terminology stay consistent across the ecosystem, so those pages will contradict this one until they are revised. Flagged, not edited.
* The empty-column placeholder reads "Not drawn on for this question." No current research question triggers it, since all three draw on both strands.
