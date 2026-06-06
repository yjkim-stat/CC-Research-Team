# research-phase-polish-thy — Usage Guide

A reusable multi-agent **Workflow** that audits and repairs a theory-heavy research paper end
to end. It was generalized from a real session that audited, repaired, and hardened an ICLR
theory paper. Pass the target paper path as `args`.

- **Script:** `.claude/workflows/research-phase-polish-thy.js`
- **Invoke:** `Workflow({ name: 'research-phase-polish-thy', args: '/path/to/paper.tex' })`

---

## What it does

Given a paper `.tex` (and, if present, its experiment result files), the workflow runs nine
phases that mirror a rigorous human audit:

1. **Map** the paper structure and build a `CANONICAL_FACTS` ledger of verified numbers from the
   result JSONs. This ledger is the ground truth that every paper number is checked against.
2. **Audit** every theorem/lemma proof with an uncharitable adversarial checker in parallel, plus
   a claim-evidence checker that verifies abstract/intro numbers against the result files.
3. **Confirm gaps** by adjudicating the deliberately harsh findings and dropping false positives.
4. **Novelty** check each contribution against prior art with web search, comparing the *precise
   form* of the closest prior result so a near-miss does not hide a genuine gap.
5. **Repair → Verify** each genuine gap in a pipeline. Each gap gets a rigorous repair or, if that
   is impossible, the strongest honestly-weakened statement, then an adversarial verifier confirms
   the repair closes the gap without introducing a new one.
6. **Apply** the verified repairs and citation additions through a single sequential editor that
   recompiles and confirms a clean build.
7. **Consistency** review the whole paper paragraph by paragraph, one auditor per section, each
   writing findings to a shared team folder.
8. **Synthesize** the per-section findings into one prioritized consistency report, resolving every
   cross-section flag.
9. Apply the consolidated `BLOCKER`/`SHOULD-FIX` items through the single editor and do a final
   compile.

---

## Invocation and arguments

The simplest form passes the `.tex` path as a string.

```
Workflow({ name: 'research-phase-polish-thy', args: '/home/me/paper/main.tex' })
```

For full control, pass an object. Only `tex` is required; the rest are inferred from it.

```
Workflow({
  name: 'research-phase-polish-thy',
  args: {
    tex:     '/home/me/paper/main.tex',          // required
    results: '/home/me/paper/experiments/results', // default: <dir>/experiments/results
    team:    '/home/me/paper/team/review',         // default: <dir>/team/review (ledger + findings)
    bib:     '/home/me/paper/main.bib'             // default: main.tex -> main.bib
  }
})
```

| arg | meaning | default |
|-----|---------|---------|
| `tex` | the paper source to audit | required |
| `results` | folder of experiment result JSONs used to build the canonical ledger | `<dir>/experiments/results` |
| `team` | folder where the canonical ledger, per-section findings, and the consistency report are written | `<dir>/team/review` |
| `bib` | bibliography file for citation additions | `<tex with .bib>` |

---

## Phases at a glance

| Phase | Agents | Output |
|-------|--------|--------|
| Map | 1 + 1 ledger | structure map, `CANONICAL_FACTS.md` |
| Audit proofs and claims | one per theorem + claim-evidence (parallel) | findings with severities |
| Confirm gaps | 1 adjudicator | genuine gaps only |
| Novelty preemption | one per contribution (parallel, web) | preempted vs defensible + citations |
| Repair | one per gap (pipeline) | insertable LaTeX + new assumptions + honesty note |
| Verify repairs | one per repair (pipeline) | closes / partial / fails + strongest honest version |
| Apply and compile | 1 sequential editor | edited `.tex`, clean recompile |
| Consistency review | one per section (parallel) | `findings_S*.md` in the team folder |
| Synthesize | 1 synthesizer + 1 editor | `CONSISTENCY_REPORT.md`, final clean compile |

---

## Design principles baked in

These are the lessons that make the workflow trustworthy rather than just busy.

- **A canonical-facts ledger is the single source of truth.** Numbers are checked against the
  result files, not against the paper's own prose, so stale or aspirational figures are caught.
- **Adversarial audits are deliberately uncharitable, then adjudicated.** Harsh first, filtered
  second. This finds real gaps without acting on overstatements.
- **Novelty checks compare the precise form of prior results.** A claim can look preempted yet hold
  a genuine gap, for example "ICL equals an InfoNCE step *with negatives*" versus a prior
  "positive-pair similarity *without* negatives." The workflow looks for exactly this.
- **Every file edit funnels through one sequential editor.** Parallel writes to a single `.tex`
  would clash, so all application is serialized, and the editor always recompiles to a clean build.
- **Repairs prefer rigor, then honest weakening.** If a gap cannot be closed cleanly, the workflow
  states the strongest provable weaker claim rather than papering over it.
- **Everything is written to a team folder for traceability.** The ledger, per-section findings, and
  the consolidated report remain on disk as an audit trail.

---

## Output

The workflow returns a structured summary and leaves artifacts on disk.

- Return value: counts of audit findings, genuine gaps, adopted repairs, the novelty status of each
  contribution, the path to the consistency report, and short summaries of both apply steps.
- On disk in the `team` folder: `CANONICAL_FACTS.md`, `findings_S1.md` … `findings_SN.md`,
  `CONSISTENCY_REPORT.md`.
- The `.tex` (and `.bib`) are edited in place and recompiled.

---

## Examples

Audit a paper with the defaults.

```
Workflow({ name: 'research-phase-polish-thy', args: 'workspace/RWM/iclr2026.tex' })
```

Audit a paper whose results and bibliography live in non-default places.

```
Workflow({
  name: 'research-phase-polish-thy',
  args: {
    tex: 'workspace/RWM/iclr2026.tex',
    results: 'workspace/RWM/runs',
    bib: 'workspace/RWM/refs.bib'
  }
})
```

---

## Customizing and extending

- The script is plain JavaScript at `.claude/workflows/research-phase-polish-thy.js`. Edit it and
  re-invoke with `Workflow({ scriptPath: '.claude/workflows/research-phase-polish-thy.js', args })`.
- To run only part of the pipeline, comment out later phases and `return` early.
- To scale depth, the audit, novelty, and consistency phases already fan out one agent per
  result/contribution/section, so larger papers automatically spawn more checkers.
- Schemas at the top of the script (`AUDIT_SCHEMA`, `NOVELTY_SCHEMA`, `REPAIR_SCHEMA`,
  `VERIFY_SCHEMA`) define the structured returns; tighten them to enforce stricter outputs.

---

## Cost and cautions

- This is a large fan-out. A full run can spawn dozens of agents (one per theorem, per
  contribution, per section, plus repair and verify pipelines), so it consumes a substantial token
  budget. Run it when a thorough pass is wanted, not for a quick check.
- The apply phases edit the `.tex` and `.bib` in place. Keep the paper under version control or a
  backup. The workflow never runs git itself.
- The workflow requires the paper to compile at the start; the editor confirms a clean rebuild
  (`EXIT 0`, no undefined references) after each apply step.
- Web access is used in the novelty phase. Findings there should be spot-checked before citing.
