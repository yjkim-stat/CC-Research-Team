# research-phase-polish-exps

A multi-agent workflow that polishes a research artifact whose storyline is already fixed. It improves prose, figures, surfaced and newly-planned evidence, and cross-artifact consistency, without ever changing the thesis or weakening a claim. It does not edit the paper itself. It produces a prioritized, rubric-escalating feedback dossier that the author applies.

The workflow generalizes a recurring collaboration pattern. When the central story of a paper is settled, the remaining work is repeated rounds of the same kinds of feedback: make the main body concise while the appendix stays detailed, align and font-match figures, surface evidence that already exists, keep every number consistent across the paper, plan the next experiment only when it adds a new message, and never settle at "good enough." This workflow encodes those instruction patterns as reusable lenses.

## When to use

Use it when the storyline is fixed and you want to iterate on quality.

- The thesis and section structure are settled and you are polishing, not re-arguing.
- You want the main body trimmed while the appendix keeps the detail.
- You want figures aligned, font-matched, and their encodings reconsidered.
- You want to know what measured evidence is already on disk but not surfaced, and what new experiment would actually add a message.
- You want a consistency and honesty audit so a quantity carries one value everywhere and no claim is overstated.

Do not use it to draft a paper from scratch or to change the argument. It deliberately refuses any change that strengthens a claim.

## How to invoke

The workflow is registered under `.claude/workflows/research-phase-polish-exps.js`.

```text
Workflow({ name: "research-phase-polish-exps", args: { path: "/abs/path/to/paper-dir" } })
```

Or by script path during iteration:

```text
Workflow({ scriptPath: "/home/yjkim/cctt/.claude/workflows/research-phase-polish-exps.js",
           args: { path: "/abs/path/to/paper-dir" } })
```

It runs in the background and notifies you on completion. Watch live progress with `/workflows`.

### Arguments

`args` may be a bare path string or an object.

| field | required | meaning |
|---|---|---|
| `path` | yes | Absolute path to the artifact directory or a `.tex` file. The workflow finds the primary `.tex`, the `\appendix` boundary, and the results directory under it. |
| `teamDir` | no | Where the dossier and rubric are written. Defaults to `<path>/team`. |
| `goldStyleGlob` | no | Glob to the gold-standard writing-style examples used as the cadence target. Defaults to `../../writing_examples/*.tex`. |

A bare string is treated as `path`:

```text
Workflow({ name: "research-phase-polish-exps", args: "/home/yjkim/cctt/workspace/my-topic" })
```

## What it does, phase by phase

The workflow runs four phases. The first fans out readers, the middle two pipeline each lens through an adversarial check, and the last writes the dossier.

### 1. Map

Five readers run in parallel and return structured maps.

- Structure: sections with their role and word count, the main-body paragraphs that restate one idea or run long, and the detail that could move to the appendix.
- Figures: each figure's layout, caption-body duplication, and improvement opportunities, plus the figure font-parity eval command if a tool exists.
- Preserve ledger: every load-bearing number with where it appears, every citation, every honesty hedge, and any inconsistency where one quantity carries different values.
- Data: the result JSON files on disk, cached pools that could be re-scored without new generation, and coverage gaps where a claim or comparison ladder has no experiment.
- Storyline: the thesis in one sentence, the pillars, and what must not be weakened, plus the gold-standard style references.

### 2. Diagnose

One critic per lens proposes concrete, surgical changes. Each proposal carries a verbatim locator, the drop-in change, the rationale, a preserve-checklist, and the reused instruction pattern it echoes. The lenses are the reusable feedback patterns.

- Succinctness. Cut redundant restatement, filler, repeated hedges within a section, and long multi-clause sentences. Never delete a number, citation, or hedge to shorten.
- Main-versus-appendix division. Move fine detail to the appendix and leave a one-line pointer.
- Figure layout, font, encoding. Lay panels horizontally, fix in-figure versus caption font parity, reconsider the axis or encoding, expose a fitted parameter per series, merge figures that share a thread, promote a schematic figure into a measured one, and trim captions that restate the body.
- Evidence surfacing with no new compute. Surface measured data already on disk that is currently only schematic or buried, while preserving the firm-versus-hedged framing.
- Experiment planning. Reuse cached data before proposing new generation, propose a new run only when it adds a new message, keep comparisons apples-to-apples, and specify implement-first then run on an idle GPU one job at a time.
- Consistency and honesty audit. Make a quantity carry one value everywhere, disclose or align mismatched runs, and scope any overstatement.
- Style parity. Match the gold-standard cadence, one sentence per source line, no structural punctuation, US English.

### 3. Verify

Every proposal is checked by an independent adversarial reviewer. It passes only if it preserves every number, citation, cross-reference, and hedge it touches, does not strengthen any claim, does not contradict the fixed storyline, and, for an experiment, earns its compute by adding a new message. The reviewer defaults to rejecting when uncertain. Rejected proposals are recorded with the reason but not acted on.

### 4. Synthesize

The team-lead merges the surviving proposals into a prioritized dossier and writes it to the team folder. High-severity and consistency or honesty fixes come first. A dedicated experiments-to-plan section lists each proposed run with its target claim, run spec, the new message it adds, GPU-aware scheduling, and the expected honest outcome including the null case. The dossier ends with a verification checklist and a list of genuine forks that need a human decision. The rubric is then escalated by one aspect or one raised bar, with a changelog line, so the bar rises every round.

## Outputs

All outputs are written under `<path>/team` (or `teamDir`).

- `polish_feedback_round<N>.md`. The prioritized dossier for this round, grouped by lens, with an experiments-to-plan section, a verification checklist, and the open forks.
- `polish_rubric.md`. The active multi-aspect rubric with hard constraints. Created on the first run and escalated each round.
- The workflow's return value is a short summary with the round number, counts per lens, the top fixes, the planned experiments, and the open forks.

The hard constraints are always enforced. Numbers, citations, and hedges are preserved. No change ever strengthens a claim. Prose stays one sentence per source line.

## Verification checklist

After applying the dossier's edits, the author runs the checks the dossier lists.

```bash
tectonic <main.tex> --keep-intermediates --synctex=0          # compiles
grep -iE "Reference .* undefined|Citation .* undefined" <main.log>   # no broken refs
pdftotext <pdf> - | grep -c '??'                               # zero unresolved refs
python3 tools/eval_figure_quality.py --pdf <pdf>               # in-figure vs caption font parity
```

## Notes

- The workflow gives feedback. It does not edit substantive prose, matching the team-lead pattern where the author or teammates apply the changes.
- It is conservative. A recap that is load-bearing for standalone readability in the abstract or conclusion is left alone, and an experiment that only reinforces what is already shown is rejected.
- It is rerunnable. Each run reads the previous rubric and raises the bar, so repeated rounds keep improving the artifact rather than plateauing.
