---
name: iterative-revision-collaboration
description: Collaborate on iterative sentence-level revisions when the user gives short directional guidance, expects multiple candidate options, retains direct edit rights, and enforces a team-lead/teammate rubric workflow. Use when the user is iterating on a piece of prose (abstract, intro, sentence rewrites) one unit at a time, particularly when they pivot framing repeatedly, demand noun-level accuracy, or escalate the rubric every round.
---

# Iterative Revision Collaboration

## Overview

This skill captures how to operate as a team-lead on iterative prose revisions where the user drives direction with short directives, expects you to surface candidate options for them to pick from, and retains the right to direct-edit between rounds. The skill is content-agnostic — apply it to any prose iteration that follows the pattern below, not only research papers.

## When to use

Recognize the pattern by these signals:

- The user issues short directional instructions ("이 방향으로 가자", "고민해봐", "두루뭉실하다", "다시 검사해봐") rather than fully specified rewrites.
- They iterate one sentence or one concept per round and reject bulk rewrites.
- They directly edit the file between rounds and expect you to re-read before acting.
- They explicitly invoke a team-lead/teammate workflow (rubrics, parallel teammates, closeout files).
- They reject framings that read smoothly but have noun-level inaccuracy, vague hedging, or paper-internal jargon at the opening.
- They want you to *show* candidates and let them *pick*, not to deliver one final version.

## Core operating principles

### 1. Generate options, do not decide

When the user gives a directive, produce two to four candidate framings with a brief comparison table. Recommend one. Apply only after the user picks. Do not collapse to a single final version on your own.

### 2. Granularity discipline

One sentence or one concept per round. If you see a downstream sentence that also needs adjustment, *flag it* in the closeout file rather than fixing it in the same round. The user controls scope.

### 3. Identify hidden constraints proactively

A short directive carries one explicit instruction plus two to three implicit constraints (length, vocabulary level, tone, vocabulary precedence). Restate the implicit constraints in your round prompt to teammates, and check your candidates against them.

### 4. Noun-level accuracy is a hard constraint

For every load-bearing claim, verify that the noun-of-claim matches the noun that actually carries the property. If the prose says "the distribution lacks a closed form" when only its *shift* does, that is a critical regression even if the sentence reads smoothly. Flag and propose a fix.

### 5. Reader-context constraint at openings and transitions

Openings and transition sentences cannot rely on later context. If a name (`bridge`, `readout`, `energy-based`, `Fisher excess`) only makes sense after Section 3, do not introduce it at the abstract opening without a same-sentence gloss. Paper-coined terms get italics plus a role-statement clause.

### 6. Reject vague phrasing

Words like "reliably", "regime structure" (without antecedent), "local X analysis", "shed light on" are red flags. They feel like content but do not name a concrete object or role. Replace with the actual operation, the actual object, the actual outcome.

### 7. Honest framing

Do not over-claim. Do not dress paper-internal interpretation as standard categories. If a regime label like "productive" or "overthinking-like" is the paper's own coinage, do not sell it at the abstract closing as the substantive payoff; instead surface what was *directly observed* (e.g., "tokens that prolong the chain without changing the next-token distribution").

### 8. Spawn parallel teammates for substantive rounds

For non-trivial framing pivots, spawn two to three teammates in parallel with explicit framing variants (e.g., proxy-first vs correspondence-first vs question-first). Present a side-by-side comparison. Reserve direct candidate proposal for mechanical edits or small word swaps where teammate spawning is overhead.

### 9. Document each round

For each round, create two files under `./team/` (or the project's team folder):

- A *feedback* file when the round is reviewed (`feedback_<topic>_<artifact>_round<N>.md`).
- A *closeout* file when the round is closed (same name pattern, or a single combined file).

Each file lists scope, score, required revisions, and open issues for the next round. Update the rubric changelog every round.

### 10. Escalate the rubric every round

Add a new aspect, tighten an existing anchor, or raise the pass bar each round. Motivation: keep teammates from settling at "good enough" and keep the user's bar visible. Examples that surfaced in practice:

- Aspect: "noun-level accuracy is auto-0 if the noun-of-claim does not match the property carrier"
- Aspect: "abstract-context-opacity is auto-0 if a claim needs prior context the abstract has not introduced"
- Aspect: "transition-sentence substance requires naming the concrete object plus its role in the same sentence"
- Aspect: "abstract-reader vocabulary control restricts mechanism names without same-sentence gloss"

### 11. User retains direct edit rights

The user may edit the file between rounds. Always re-read the current state at the start of a turn before drafting. Do not assume your last edit is still canonical. When the user's direct edit creates a regression, flag it explicitly with the rubric reason rather than silently accommodating.

### 12. Speed when the variation space is small

When the user's directive is mechanical (e.g., "remove specific names", "replace AMC23 with mathematical reasoning dataset"), propose two or three candidates directly and skip the teammate spawn. Spawn only when the framing space is genuinely open.

## Workflow per round

1. **Re-read the current state** of the target file. The user may have direct-edited.
2. **Parse the user directive.** Extract the explicit instruction plus two to three likely implicit constraints (length, vocabulary, tone, alignment with prior rounds).
3. **Update the rubric changelog** with this round's scope, escalation, and pass bar.
4. **Spawn teammates in parallel** (two to three) with different framing variants, each carrying the full directive and constraints. Skip spawning only for mechanical edits.
5. **Score candidates** against the rubric. Flag noun-level regressions, vague phrasing, jargon-at-opening, over-claims.
6. **Present a comparison table** plus a single recommendation, with the trade-offs each candidate makes.
7. **Apply the user's pick** to the file. Use Edit, not Write, for surgical replacement.
8. **Write the closeout file** listing what changed, why, and the open issues for the next round.
9. **List next-round candidate targets** so the user can pick the next move.

## Recognizing common user directives

| User says | Action |
|---|---|
| "이 방향으로 가자" | The framing direction is approved; spawn teammates with this framing as the constraint. |
| "고민해봐" | Generate three or four candidates with a comparison; recommend one. |
| "두루뭉실하다" | The current prose has vague phrasing or unanchored referents. Identify the vague nouns and propose concrete replacements. |
| "다시 검사해봐" | Re-read the file (the user has edited) and report changes plus any regressions. |
| "수정사항들을 전부 반영" | Apply all the modifications previously flagged. Confirm length and vocabulary constraints. |
| "너무 길어지진 않게" | Keep the result within the current length envelope. Trim modifiers, not substance. |
| "기호 없이 말로 설명" | Demote math notation to supplementary; the bullet must parse as plain English. |
| "이 단어는 별로야" | Generate three to five alternative words with brief trade-off notes; recommend one. |

## Anti-patterns to avoid

- Producing one final version without options.
- Bulk-rewriting a paragraph when the user asked about one sentence.
- Applying substantive edits without an explicit user pick.
- Treating your last edit as canonical without re-reading the file.
- Closing a round as "final" without flagging open issues for the next round.
- Ignoring noun-level accuracy because the phrasing reads smoothly.
- Using Section-3 jargon at the opening because "the body explains it later".
- Spawning new teammates when the user's directive is mechanical and the variation space is closed.
- Letting a Korean directive go through without surfacing the inferred implicit constraints back to the user.

## Output contract per round

A user-facing report should contain:

1. A short re-statement of what the user asked for, with explicit + implicit constraints.
2. A comparison table of candidate framings (one row per teammate).
3. A single recommendation with the trade-offs it makes.
4. Self-flagged concerns (noun accuracy, jargon, length, open downstream issues).
5. The next-round candidate targets at the end.

When the user picks, apply with `Edit`, then write a closeout file under `./team/`.

## Persistence

Memory, rubric, and changelog live across rounds:

- `./team/<topic>_writing_rubric.md` — the active multi-aspect rubric.
- `./team/<topic>_writing_rubric_changelog.md` — the escalation history.
- `./team/feedback_<topic>_<artifact>_round<N>.md` — per-round feedback and closeout files.

Always update the changelog when you add or tighten a rubric aspect. The user reads these to verify that the team-lead is escalating in the right direction.

## Closing note

This skill exists because some users iterate prose at sentence granularity with very short directives, and direct-rewriting in that mode produces friction. The skill optimizes for *speed of candidate generation*, *fidelity to short directives*, and *traceable round-by-round escalation*. If the user pivots to a less iterative mode (e.g., "rewrite the whole abstract"), exit this skill and operate at the requested scale.
