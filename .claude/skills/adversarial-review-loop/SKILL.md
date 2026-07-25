---
name: adversarial-review-loop
description: Harden a research paper through a reviewer-versus-defender adversarial loop with the team-lead mediating. Use when the user wants an OpenReview-style hostile reviewer agent that tries to lower the score and a defender agent that pre-empts every objection to raise it, iterated round over round; when the user asks to fundamentally (not superficially) improve a paper, pack the main body compactly, adjust margins or figures to fit more into main, enforce conclusion-first compressed paragraphs, and verify each state by direct LaTeX compile plus snapshot without overclaiming. Triggers on "reviewer/defender loop", "점수 높이게 개선", "리뷰어 방어".
---

# Adversarial Review Loop

## Overview

This skill drives a paper toward a higher, defensible review score through an adversarial correction loop. The team-lead, held by the main agent, spawns a hostile `reviewer` and a `defender` in parallel, mediates their debate, and repeats the loop until the paper pre-empts every attack a real reviewer could mount. The core is adversarial feedback and correction, so always spawn multiple agents rather than reasoning alone, and route all communication through the `team/` folder. The improvement bar is fundamental, meaning changes to structure, evidence, and framing, not cosmetic wording that merely talks its way past an objection.

## When to use

Recognize the pattern by these signals.

- The user asks for an OpenReview-style reviewer that attacks the paper and a defender that answers every attack, iterated.
- The user wants the score raised through genuine hardening, and explicitly rejects surface-level talking-past.
- The user asks to compact the main body, adjust margins or figures to fit more in main, or enforce conclusion-first compressed paragraphs.
- The user wants each state verified by real LaTeX compilation and page snapshots.

## Roles

- **Reviewer** (`reviewer` agent). Plays a skeptical, even willfully uncharitable OpenReview reviewer who does not fully understand the paper and forces objections anyway, including borderline-unreasonable ones such as shallow analysis depth, thin novelty, missing baselines, or unclear scope. The reviewer's job is to drive the score down and to surface every attackable surface, and it writes its review into `team/`. Spawn several reviewers in parallel with different attack stances.
- **Defender** (`defender` agent). Answers every reviewer objection and, where the paper lacks the material to answer, specifies and drafts the exact content to add, in the appendix if needed, so the objection is pre-empted before it lands. The defender pushes the score up and hands the writer a concrete add-and-repair list with LaTeX-ready snippets in `team/`.
- **Team-lead** (main agent). Mediates the debate, keeps score, decides which reviewer objections are legitimate versus noise, escalates the rubric each round, and routes the agreed changes to the writer for application. The team-lead does not substantively edit the paper.

## The loop

1. **Compile and snapshot the current state.** Compile the paper with `tectonic` and capture page images with `team/snapshot.py`, so the debate is grounded in how the paper actually reads on the page, not only in the source. See CLAUDE.md and TOOL.md for the exact commands.
2. **Spawn reviewers and defenders in parallel.** Give reviewers distinct hostile stances and give defenders the reviewer output plus the current draft. Both write to `team/`.
3. **Debate.** Reviewer tries to lower the score, defender tries to raise it, each responding to the other. The team-lead mediates, separating legitimate weaknesses from noise, and records the exchange in `team/`.
4. **Build a fundamental improvement plan.** For each surviving objection, decide the real fix, meaning added evidence, an isolating control, a sharper formulation, a moved or redrawn figure, or a pre-emptive appendix, not a reworded sentence that dodges the point. Never overclaim to close a gap.
5. **Route to the writer and apply.** The writer applies the plan to the LaTeX source. Pack the main body compactly so that as much load-bearing content as possible lives in main, adjusting margins and figures where that buys space honestly. Make every paragraph state its conclusion in the first sentence and keep the prose compressed.
6. **Recompile, re-snapshot, verify.** Confirm EXIT 0, no undefined references, and that the page images show the intended layout with no overflow. Escalate the rubric for the next round.
7. **Repeat** until reviewers can no longer land a legitimate objection and the score converges, then hand back to the user, who is the final judge.

## Compaction rules for the main body

- Every paragraph opens with its conclusion, then compresses the support.
- Move secondary ablations, derivations, hyperparameters, and prompts to the appendix, leaving a one-line pointer.
- Adjust margins and figure sizing to fit more load-bearing content into main, but never at the cost of readability or of an overfull page.
- Cut hedges and restatement. Keep one roadmap sentence per section at most.
- Never inflate a claim to survive a review. A pre-empting appendix beats an overclaim.

## Verification discipline

Every state is checked by real compilation and page snapshots, never by reading the source alone. If a change is not visible and clean in the rendered PDF, it is not done.

## Anti-patterns to avoid

- Talking past an objection with reworded prose instead of fixing the underlying gap.
- Reasoning alone instead of spawning the reviewer and defender agents.
- Overclaiming to close a reviewer's gap.
- Declaring a round done without a fresh compile and snapshot.
- Letting the main body bloat instead of pushing secondary material to the appendix.
- Treating rubric convergence as completion. The user's intent is the final criterion.

## Recognizing common user directives

| User says | Action |
|---|---|
| "점수를 더 높이게 개선" | Run the loop for another round with an escalated rubric and a fundamental improvement plan. |
| "겉으로 말로 넘어가지 말고" | Reject reworded dodges. Require an evidence, control, or appendix fix for each objection. |
| "main에 최대한 담아" | Apply the compaction rules, adjusting margins and figures, and move only secondary material to the appendix. |
| "overclaim 하지마" | Audit every strengthened claim against its evidence and weaken any that outruns support. |
| "컴파일해서 확인" | Compile with tectonic and re-snapshot, then judge from the page images. |
