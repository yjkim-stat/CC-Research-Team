---
name: question-pool-review
description: Evaluate the current paper against the user-managed question pool in eval/ and run an adversarial feedback-and-correction loop until every applicable question is resolved at once. Use when the user wants to track a fixed set of review criteria over rounds, score the paper per question, and drive all flagged issues to pass simultaneously, verified by LaTeX compile plus snapshot. Triggers on "질문 풀로 평가", "지적사항 추적 루프", "전부 동시에 해결", "criteria 점검".
---

# Question-Pool Review Loop

## Overview

This skill evaluates the current paper against the durable, user-owned question pool in `eval/`, then runs an adversarial feedback-and-correction loop until every applicable question reaches `pass` in a single compiled state. The pool is the source of truth for what "good" means this round. The termination gate is not an average score but simultaneous resolution, because the user's requirement is that all flagged issues are fixed at the same time, not traded off against each other.

## When to use

- The user maintains a set of recurring review criteria in `eval/` and wants the paper scored against them every round.
- The user wants per-question verdicts with evidence, tracked across rounds by stable ID.
- The user wants all flagged issues driven to pass together, verified on the rendered PDF.

## Sources of truth

- **Question pool (read-only for agents):** `eval/criteria.md` plus `eval/questions/*.md`. Never edit these. Propose new questions only as candidates, see the write-back rule below.
- **Paper:** the topic's LaTeX source.
- **Run output:** `team/` only, never the pool.
- **Adversarial roles:** the `reviewer` and `defender` agents, shared with the `adversarial-review-loop` skill.

## The loop

1. **Load and filter.** Read `eval/criteria.md` and every `active` question. Filter by each question's `applies_when` against the current paper, so only relevant questions are in play. Log which questions were excluded and why.
2. **Compile and snapshot.** Compile with `tectonic` and capture page images with `team/snapshot.py`, so judgments about figures, layout, and self-containment reflect the rendered page, not only the source. See CLAUDE.md and TOOL.md.
3. **Adversarial scoring.** Spawn `reviewer` agents in parallel, each assigned a slice of the pool, to argue every applicable question toward `fail` with a cited weakness. Spawn `defender` agents to argue toward `pass` or to specify the exact fix. The team-lead adjudicates each question to `pass` / `partial` / `fail` with a line-or-figure citation, and never accepts a verdict without evidence.
4. **Write the scorecard.** Emit a per-question scorecard into `team/` that references question IDs, so rounds can be diffed.

   ```markdown
   # Question-Pool Scorecard — round <n> — snapshot <path>
   | ID | criterion | verdict | evidence (line/fig) | fix if not pass |
   |---|---|---|---|---|
   ...
   Green criteria: C? C? …   Open: C?-Q?? (fail), C?-Q?? (partial)
   ```
5. **Correction plan, all issues at once.** For every `partial` and `fail`, build one consolidated plan that resolves them together rather than one at a time, since fixes interact. Watch for cross-question conflicts, for example packing more into main (C2) while keeping acronyms defined per section (C1) and figures justified (C4). Never overclaim to close a question.
6. **Route to the writer and apply.** The writer applies the consolidated plan to the LaTeX source in surgical edits, keeping main self-contained and appendix references minimal.
7. **Recompile, re-snapshot, re-score.** Confirm EXIT 0 and no undefined references, then re-run the full pool on the new snapshot. A fix that breaks a previously green question is a regression and reopens it.
8. **Gate.** Terminate only when every `active` applicable question is `pass` in the same snapshot. If anything is still `partial` or `fail`, iterate. Then hand back to the user, who is the final judge.

## Write-back to the pool (candidates only)

When a round surfaces a weakness that no question captures, do not edit `eval/`. Append a candidate to `team/qpool-candidates.md` with a proposed ID, criterion, question text, why, and check, and surface it to the user. The user promotes approved candidates into the pool and records the change in `eval/CHANGELOG.md`. This keeps the pool user-owned, mirroring the TOOL.md approval discipline.

## Rubric escalation

Each round, propose to the user how to raise the bar, for example tightening a question's `check`, promoting a `partial` pass anchor, or adding a candidate question. Escalation is a proposal to the user, not a silent edit to the pool.

## Anti-patterns to avoid

- Editing `eval/` directly. Agents propose candidates only.
- Declaring done on an average score while a question is still `partial` or `fail`.
- Fixing one criterion in a way that regresses another. Plan the fixes together.
- Judging self-containment or figures from the source without the rendered snapshot.
- Overclaiming to make a question pass. A real fix or an honest scope statement only.

## Recognizing common user directives

| User says | Action |
|---|---|
| "전부 동시에 해결" | Keep looping until all applicable questions pass in one snapshot. Do not stop at a partial. |
| "이 지적도 추적해" | Draft a candidate question in `team/qpool-candidates.md` for the user to promote. |
| "점검해봐" | Run one scoring pass and emit the scorecard without editing the paper. |
| "기준 더 빡세게" | Propose tightened `check` text or a new candidate question, for the user to approve. |
