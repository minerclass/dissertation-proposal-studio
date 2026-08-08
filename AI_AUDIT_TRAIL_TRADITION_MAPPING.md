# AI-Use Audit Trail: Tradition Mapping of the Proposal Reference List

**Date of Log**: 2026-08-07
**Researcher / Author**: Micah J. Miner (assisted by Claude Opus 5, Claude Code)
**Project Context**: Qualitative-dominant convergent mixed-methods study on *Pedagogical Friction in the Age of Generative AI* (Ed.D., National Louis University).
**Audit Purpose**: Record how each reference transcribed from the July 2026 proposal was assigned to an intellectual tradition, so the classification is reviewable rather than opaque.

---

## 1. Executive Summary

| Item | Details |
| :--- | :--- |
| **Files Modified** | `data/references.json`, `data/traditions.json` |
| **Sources Affected** | 104 of 151 references previously carried an empty `tradition` field |
| **Result** | All 151 references are now assigned. 80 mapped onto the existing 14 traditions; 24 required 4 new traditions. Two were reassigned on 2026-08-07 (see section 4) |
| **Also Filled** | The `title` field on the same 104 records, recovered from their APA `citation` strings |
| **Downstream** | `diss-proposal-defense` regenerated via `tools/build-intellectual-history.mjs`; its Proposal Bibliography bucket is now empty |

## 2. What a tradition assignment claims, and what it does not

A tradition assignment is a **classification for navigation**: it groups a source with the intellectual lineage it most closely belongs to, so the Traditions section and Reference Library filters are usable. It is **not** a claim that the author of the source identifies with that tradition, and it is not a citation, quotation, or finding. No citation text, year, DOI, or author string was altered by this change.

Assignments are editorial and revisable. To move a source, change its `tradition` field in `data/references.json` and regenerate the sibling repo; the `refs` arrays in `data/traditions.json` are derived from that field.

## 3. The four new traditions

These were added because 24 sources had no defensible home among the existing 14.

| Tradition | n | Why it was needed |
| :--- | :--- | :--- |
| **Tertiary Orality Scholarship** (2009 to present) | 6 | Heyd, Mayer, Turner and Allen, Ryu, Soffer, and Cordón-García and Muñoz-Rico form the existing scholarly attempt to name what follows secondary orality. This is the conversation *tertiary algorithmicity* enters, so leaving it unnamed made the dissertation's central move look like a coinage rather than an intervention. |
| **Educational Sensemaking** (2001 to present) | 5 | Weick, Maitlis and Christianson, Coburn (2001, 2005), and Spillane et al. supply the sensemaking construct the research questions ask about by name. |
| **Research Methods and Analysis** (2005 to present) | 14 | Design, instrument, analysis, and software sources. Folding these into Constructivist Qualitative Inquiry would have misstated the paradigm, since mixed-methods design and psychometrics are not constructivist commitments. |
| **Disability, Access, and Exclusionary Difficulty** (2013 to present) | 2 | Annamma et al. (DisCrit) and Dolmage discipline the productive versus exclusionary distinction so that preserving friction is not read as a defense of exclusion. |

## 4. One judgment call, since resolved by the researcher

**Constructivist Qualitative Inquiry was split along paradigm and procedure.** Crotty, Lincoln and Guba, Guba and Lincoln, Phillips, von Glasersfeld, and Richardson stayed, as the interpretive stance. Saldaña, Patton, and Malterud et al. moved to Research Methods and Analysis, as procedure.

As first applied, Braun and Clarke (2006, 2021) moved to Research Methods and Analysis with the other procedural sources. This was flagged here as contestable, on the grounds that reflexive thematic analysis is explicitly constructivist-aligned.

**Resolved 2026-08-07 (researcher decision): Braun and Clarke return to Constructivist Qualitative Inquiry.** Reflexive thematic analysis treats the researcher as an instrument, which is an epistemological commitment rather than a procedural step, so it belongs with the paradigm sources. Saldaña, Patton, and Malterud remain with procedure. Counts are now 8 and 14.

## 5. Method

* **Tool Used**: Node script (`map-traditions.mjs`, run once, not committed), applying an explicit id-to-tradition table.
* **Task Performed**: Read all 104 unassigned references in full, classify each, add the four new traditions, recover empty titles, and rebuild every `refs` array from the `tradition` field so the two files cannot drift.
* **Guards**: The script fails loudly on an unknown reference id, a source assigned twice, a source that already had a tradition, a title it cannot recover, or any reference left unassigned. All guards passed.
* **Titles**: Recovered by parsing the APA `citation` string. Twelve cases the parser cannot resolve on its own, including titles ending in a question mark, translator credits, and Postman's `(1998, March 28)` full date, use an explicit override table. All 104 outputs were read against their citation strings rather than spot-checked.
* **Verification**: JSON validated on both files. Local server click-through of the Traditions section and Reference Library: 18 traditions render, the new works lists populate, the tradition filter offers 19 options, and 151 of 151 sources show. No console errors. No em dashes introduced in user-facing copy. `private/` confirmed untracked before commit.

## 6. Known issues not addressed here

* The Traditions works list renders `Author.. Title` because `js/app.js` appends a period to an author string that already ends in one. Pre-existing and visible on untouched traditions such as Canadian Media Theory, but more prominent now that works lists are longer. Not changed, since it is unrelated to this mapping.
* `AI_AUDIT_TRAIL.md` still describes the design as a "case study" in two places. The controlling draft dropped the case-study framing. Flagged, not edited.
