---
name: polish-thy-main
description: Restructure a research paper into a lean main body backed by a comprehensive appendix. Use when the user wants to trim the main text, move detailed, secondary, robustness, practicality, or caveated content to the appendix while keeping only the load-bearing narrative, condense the abstract, related work, or contributions, demote or summarize formulation and preliminaries, relocate a summary table or a non-core figure, or fix figure float placement after such moves. Encodes a keep-only-the-core rule with byte-exact relocation, cross-reference repair, and page-by-page PDF placement verification.
---

# Polish the Main Body (lean main, full appendix)

## Overview

This skill restructures an already-written paper so the **main body carries only the load-bearing narrative** and **everything else moves verbatim to a well-organized appendix**. It is a presentation and structure pass, not a results-changing pass. It applies to the **whole main body** (abstract, related work, formulation, theory, experiments, contributions, tables, figures), not only the experimental section.

The governing rule is one sentence: **identify what each element points to, and keep in the main only the elements whose pointed-to content lives in the main.** A theorem whose validating experiment is the paper's headline stays; a robustness check that supports an appendix-only claim moves; a caveated or mixed result is relocated with one honest pointer left behind.

This is a paper-independent playbook. Keep all topic-specific judgment with the user; the skill supplies the method and the mechanical discipline that keeps the document correct while large blocks move around.

## When to Use

Reach for this skill when the user asks, in any phrasing, to:

1. Make the main body, a section, or the abstract shorter, leaner, or more concise.
2. Move detail, proofs, secondary or robustness or practicality experiments, or a summary table to the appendix.
3. Keep only core, positive, high-impact, or theory-supporting results in the main.
4. Condense related work to a few paragraphs with the full version in an appendix.
5. Demote a formulation or preliminaries section to a summary, or fold a section into another.
6. Tighten the contributions list.
7. Fix figure or table placement (drift, white gaps, a float appearing in the wrong section) after content has moved.

## The Keep-vs-Move Decision

For each block, ask **what claim or content it points to**, then place it:

- **Keep in main** when it is a core claim or contribution, a core theorem or lemma statement, or a result that is *positive*, *high-impact*, and *directly validates something stated in the main*.
- **Move to appendix** when it is a proof or derivation, a definition or remark or secondary proposition, a parameter budget or setup detail, a summary table, detailed related work, a robustness or ablation or practicality experiment, or a *caveated / mixed / lower-confidence* result.

Two refinements that matter:

- **Caveated results are relocated, not deleted.** When a result is honest but not clean (a fit that misses a point prediction, an ordering that holds only loosely), move it to the appendix and leave **one truthful sentence** in the main that states the limitation and points to the appendix. Never hide it, and never inflate it to keep it in the main.
- **Core formal statements usually stay displayed.** When trimming theory, the default is to keep the central theorem and lemma *statements* visible in the main and move only their setup, proofs, and secondary companions. This is a high-impact choice, so confirm it with the user (see Asking First).

## Section-by-Section Moves

Apply only the ones the user asks for. Each leaves a short summary in the main and the full content in the appendix.

- **Abstract.** Compress to the venue's norm (commonly six to eight sentences). Match the example abstracts the project already follows. Keep every load-bearing claim; drop restatements and caveats that belong in the body.
- **Related work.** Three thematic paragraphs in the main, each ending by positioning the work; the detailed discussion with full citations becomes an appendix section organized under the same themes.
- **Formulation / preliminaries.** A short summary in the main that introduces only the notation the theorems need, plus a one-line statement of any structural property; the full definitions, parameter budgets, and proofs move to an appendix "details" section. Formulation can also be demoted to the first subsection of the analysis section.
- **Theory.** Keep the central theorem, lemma, and headline corollary statements in the main, each with a one-line plain summary; move remarks, secondary propositions, definitions (inline them into the theorem that needs them), and all proofs to the appendix.
- **Summary tables.** A table that summarizes results across the paper can move to the appendix together with the paragraph that introduces it; the section it left behind transitions directly to the next.
- **Experiments.** Keep only the core validations in the main; collect the rest under one "Additional Experiments" appendix section. When the main has too many large figures and little text after trimming, expect float-placement work (below).
- **Contributions.** One bold claim per bullet, one sentence of evidence, no restatement.
- **Figures.** Prefer single-row multi-panel layouts, match in-figure font size to the caption, and minimize in-figure text by moving condition keys and line meanings into the caption.

## Operating Discipline (how to move without breaking the document)

This is the part that makes the difference between a clean restructure and a corrupted file.

1. **Move blocks byte-exact, never retype.** Use a small script that finds a block by unique start and end markers (or by figure filename / table label), cuts it verbatim, and re-inserts it under the appendix anchor. Retyping prose risks transcribing a number wrong; subagents and inline shell output have fabricated figures before, so the moved bytes must be the original bytes.
2. **Keep every `\label` with its block.** A moved figure, table, theorem, or section keeps its label, so existing `\ref`s resolve to the new location automatically. Only delete a label when nothing references it.
3. **Repair what the move strips.** After cutting, fix dangling cross-references (a `\ref` that pointed at the moved block from text that stayed), rewrite section roadmap sentences that listed the moved subsections, rename or remove a subsection header that is now empty, and inline any definition a kept theorem still needs.
4. **Verify references in the rendered PDF.** Compile, then programmatically search every page of the output for `??`. Zero unresolved references is the bar. Grep the source for the labels you touched to confirm each is defined exactly once and still referenced.
5. **Check placement page by page.** Render the compiled PDF to images and look. Confirm no float landed after the section that owns it (a figure after the conclusion, a figure mixed into the next subsection), and that the trim did not open large white gaps.
6. **Fix drift with barriers and placement, not by shrinking figures.** Use `\FloatBarrier` (placeins) before a section that must not absorb the previous section's floats, allow bottom and page placement with `[tbp]` or `[htbp]`, and loosen float-packing parameters (`\topfraction`, `\textfraction`, `\floatpagefraction`). **Do not reduce `\includegraphics` width to fill a gap**, because that breaks in-figure vs caption font parity; if a thin section's lone figure keeps drifting, prefer flattening the section, combining related figures into one float, or moving one more figure to the appendix.
7. **Keep a backup before each scripted move** and report the byte delta and per-block sizes so an extraction that grabbed the wrong span is caught immediately.

## Asking First

Some moves change the paper enough that the user, not the skill, owns the decision. Ask before acting when:

- The split would remove a core theorem statement, a headline result, or the only real-task evidence from the main.
- "Core" or "high-impact" is ambiguous and the boundary determines a large amount of restructuring. Offer two or three concrete keep-sets and let the user choose.

Do not ask about reversible, conventional choices (where in the appendix a block lands, how to phrase a one-line pointer); pick the sensible default and proceed.

## Hard Constraints (Do Not Cross)

1. **Do not move the paper's core claims or contributions out of the main.** The main must still stand on its own as the argument.
2. **Do not hide a caveated result.** Relocate it and leave an honest one-line pointer.
3. **Do not retype moved content.** Byte-exact relocation only.
4. **Do not break font parity by resizing figures** to win back vertical space.
5. **Do not declare done without compiling and confirming zero `??` and clean placement.**

## Typical Loop

1. Read the target section and map each block to what it points to.
2. Confirm the keep-set with the user if the boundary is high-impact or ambiguous.
3. Script the byte-exact cut and re-insert under an appendix section, keeping labels.
4. Repair roadmaps, dangling refs, emptied headers, inlined definitions.
5. Compile, grep the PDF for `??`, render pages, check placement.
6. Fix any drift or gap with barriers and placement parameters.
7. Send the rebuilt PDF and state the page count and reference status plainly.
