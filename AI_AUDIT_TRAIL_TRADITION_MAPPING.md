# AI-Use Audit Trail: Tradition Mapping of the Proposal Reference List

**Date of Log**: 2026-08-07
**Researcher / Author**: Micah J. Miner (assisted by Claude Opus 5, Claude Code)
**Project Context**: Qualitative-dominant convergent mixed-methods study on *Pedagogical Friction in the Age of Generative AI* (Ed.D., National Louis University).
**Audit Purpose**: Record how each reference transcribed from the July 2026 proposal was assigned to an intellectual tradition, so the classification is reviewable rather than opaque.

---

## 1. Executive Summary

| Item | Details |
| :--- | :--- |
| **Files Modified** | `data/references.json`, `data/traditions.json`, and the public literature-map copy and renderer |
| **Sources Affected** | 104 of 151 references previously carried an empty `tradition` field |
| **Result** | All 151 references are now assigned. Of the 104 newly classified references, 77 mapped onto the existing 14 groups and 27 mapped onto 4 new groups. Two were reassigned on 2026-08-07 (see section 4) |
| **Current Taxonomy** | 19 navigation groups, each labeled by kind so intellectual lineages are not conflated with methods, software, datasets, or practice resources |
| **Also Filled** | The `title` field on the same 104 records, recovered from their APA `citation` strings |
| **Downstream** | `diss-proposal-defense` regenerated via `tools/build-intellectual-history.mjs`; its Proposal Bibliography bucket is now empty |

## 2. What a navigation-group assignment claims, and what it does not

A navigation-group assignment is a **classification for navigation**: it places a source with the lineage, research tradition, framework, research infrastructure, or evidence context that best explains its role in this project. The `kind` field makes those categories explicit. An assignment is **not** a claim that every author identifies with an intellectual tradition, and it is not a citation, quotation, or finding. No citation text, year, DOI, or author string was altered by this change.

Assignments are editorial and revisable. To move a source, change its `tradition` field in `data/references.json` and regenerate the sibling repo; the `refs` arrays in `data/traditions.json` are derived from that field.

## 3. The four groups added in the original mapping

These were added because 27 sources had no defensible home among the existing 14 groups.

| Group | n | Why it was needed |
| :--- | :--- | :--- |
| **Tertiary Orality Scholarship** (2009 to present) | 6 | Heyd, Mayer, Turner and Allen, Ryu, Soffer, and Cordón-García and Muñoz-Rico form the existing scholarly attempt to name what follows secondary orality. This is the conversation *tertiary algorithmicity* enters, so leaving it unnamed made the dissertation's central move look like a coinage rather than an intervention. |
| **Educational Sensemaking** (2001 to present) | 5 | Weick, Maitlis and Christianson, Coburn (2001, 2005), and Spillane et al. supply the sensemaking construct the research questions ask about by name. |
| **Research Design, Analysis, and Software** (2005 to present) | 14 | Design, instrument, analysis, and software sources. This is labeled research infrastructure because mixed-methods design, psychometrics, R, and jamovi are not one intellectual lineage or one constructivist commitment. |
| **Disability, Access, and Exclusionary Difficulty** (2013 to present) | 2 | Annamma et al. (DisCrit) and Dolmage discipline the productive versus exclusionary distinction so that preserving friction is not read as a defense of exclusion. |

## 4. One judgment call, since resolved by the researcher

**Constructivist Qualitative Inquiry was split along paradigm and procedure.** Crotty, Lincoln and Guba, Guba and Lincoln, Phillips, von Glasersfeld, and Richardson stayed, as the interpretive stance. Saldaña, Patton, and Malterud et al. moved to Research Design, Analysis, and Software, as procedure.

As first applied, Braun and Clarke (2006, 2021) moved to Research Design, Analysis, and Software with the other procedural sources. This was flagged here as contestable because reflexive thematic analysis can be used coherently within a constructivist or constructionist stance and treats the researcher as an active participant in interpretation.

**Resolved 2026-08-07 (researcher decision): Braun and Clarke return to Constructivist Qualitative Inquiry.** This is a study-specific placement: the proposed study uses reflexive thematic analysis within a constructivist qualitative stance. It is not a claim that reflexive thematic analysis is inherently constructivist; Braun and Clarke describe it as theoretically flexible. Saldaña, Patton, and Malterud remain with research infrastructure. Counts are now 8 and 14.

## 5. Taxonomy refinement, 2026-08-09

* Every navigation group now carries a `kind`: intellectual lineage, research tradition, conceptual framework, methodological framework, research infrastructure, or evidence and practice context.
* **Phenomenology and the Lifeworld** is now **Phenomenology, Hermeneutics, and the Lifeworld**, which names Gadamer's philosophical hermeneutics directly.
* Frankfurt's *On Bullshit* moved from that group to **Truth, Language, and Epistemic Integrity**. The work analyzes truth, communication, and indifference to truth rather than belonging to phenomenology.
* **Generative AI in Education: Evidence and Practice Context** now identifies its mixture of empirical studies, national indicators, policy resources, and practice guidance instead of presenting the cluster as a single intellectual lineage.
* The source total remains 151. The taxonomy now contains 19 groups.

## 6. Method

* **Tool Used**: Node script (`map-traditions.mjs`, run once, not committed), applying an explicit id-to-tradition table.
* **Task Performed**: Reviewed the APA citation string for each of the 104 unassigned references, classified each, added the four original navigation groups, recovered empty titles, and rebuilt every `refs` array from the `tradition` field so the two files cannot drift.
* **Guards**: The script fails loudly on an unknown reference id, a source assigned twice, a source that already had a tradition, a title it cannot recover, or any reference left unassigned. All guards passed.
* **Titles**: Recovered from the APA `citation` strings. The parser recovered 92 titles directly. Twelve cases required explicit overrides, including titles ending in a question mark, translator credits, and Postman's `(1998, March 28)` full date. All 104 recovered titles were checked against their citation strings rather than spot-checked.
* **Verification**: JSON validated on both files. Local server click-through of the Traditions and Research Infrastructure section and Reference Library: 19 groups render, the works lists populate, the group filter offers 20 options including All groups, and 151 of 151 sources show. No console errors. No em dashes introduced in user-facing copy. `private/` confirmed untracked before commit.

## 7. Related corrections completed after the original mapping

* The doubled punctuation in the works list was corrected on 2026-08-07. The renderer now adds author and title separators only when they are missing.
* The stale case-study wording in `AI_AUDIT_TRAIL.md` was corrected on 2026-08-07. Its dated correction note remains as part of the audit history.
