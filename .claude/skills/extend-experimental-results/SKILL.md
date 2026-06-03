---
name: extend-experimental-results
description: Expand and strengthen the experimental section of a research paper without inflating results. Use when experiments produce nulls or borderline findings, when the user asks to "extend experiments," map a success regime, decompose a mechanism, tighten error bars, validate a proxy metric, decide what experiment to run next, sanity-check a suspiciously clean validation, reframe a claim that a faithful experiment keeps missing, build a fidelity ladder, or validate a scaling law's prefactor. Applies the user-approved playbook of probe-integrity checks, regime-of-success framing, claim-character reframing, seed-and-expand depth-first growth, mechanism ablation, honest statistical strengthening, and fidelity-ladder reporting.
---

# Extend Experimental Results

## Overview

Use this skill to grow an experimental section in a way the user endorses: characterize **when** a method succeeds rather than auditing whether a theory's point prediction holds everywhere, grow depth-first from one clean success, decompose the causal mechanism, and raise statistical confidence while keeping every result's direction honest. The governing principle is twofold: **depth-first over breadth-first**, and **fix the direction honestly, then raise only the confidence**. Two prerequisites guard it: trust no validation until the measurement object is known to be non-degenerate, and when a faithful experiment keeps missing a theory's point prediction, reframe what the claim asserts rather than collecting more data.

This is a paper-independent playbook. It encodes strategies the user explicitly approved, and it flags the moves the user has rejected so they are not re-proposed.

## When to Use

Reach for this skill when any of the following hold:

1. Experiments are returning nulls or saturating, and the instinct is to declare the theory wrong.
2. The user asks to "extend experiments," add experiments, or strengthen the experimental story.
3. A finding is borderline (for example p just above 0.05) and needs to be made trustworthy.
4. A headline effect is real but its cause is unattributed.
5. A proxy metric is doing the heavy lifting and its validity is unverified.
6. You must decide which experiment to run next and want a principled order.
7. A validation looks *too clean* (R² near 1, a perfect linear fit), and you need to rule out a degenerate probe before trusting it.
8. A high-fidelity experiment keeps missing a theory's point prediction, and you must decide whether to collect more data or reframe the claim.
9. A scaling or power law is claimed and you want to validate it beyond its slope.

## Core Workflow

Run the strategies in roughly this order. Earlier strategies decide *what to measure*; later ones decide *how much to trust it*.

1. Before trusting any validation, check the measurement object is not degenerate (Strategy 2).
2. Reframe from pass/fail to regime-of-success (Strategy 1); if a gap persists after the probe is sound, reframe the claim's character rather than collecting more data (Strategy 3).
3. Pick one clean success as the seed and sweep its controlling variable (Strategy 4).
4. Place honest negatives as the outside of the regime, never hidden (Strategy 5).
5. Decompose the cause with counterfactual ablations and controls (Strategies 6-7).
6. Raise confidence: more seeds, full statistics, proxy validation, cross-task replication (Strategies 8-11).
7. Arrange experiments as a fidelity ladder and state which object each law holds on; validate scaling laws at the prefactor, not only the exponent (Strategies 12-13).

## The Approved Strategies

### A. Framing — what to measure

**1. Regime-of-success framing.**
Do not verify a theory's prediction at a single operating point and report pass/fail. Point-checking mass-produces nulls and weakens the paper. Instead map the boundary of the region where the method *succeeds*. Ask "where and when does this win, and why," not "does the exact prediction hold here."

**2. Probe integrity — distrust a too-clean validation, fix the measurement object not the model.**
A suspiciously perfect result is a symptom, not a triumph. When a validation comes back near-perfect (R² ≈ 1, an exact linear fit, a knee that lands precisely), first suspect the target, probe, or metric has collapsed to a trivial case that the method cannot fail. Inspect the measurement object directly: confirm it actually exercises the regime you mean to test (for example that a "rank-r" target is not secretly rank-1). When it is degenerate, **redesign the measurement object, not the model**, and never tune the setup to force agreement. This strategy gates the others — a regime map drawn with a broken probe is worthless.

**3. Reframe the claim's character when a gap persists.**
If, after the probe is sound, the most faithful experiment still misses the theory's point prediction in a stable direction, the honest move is to re-characterize *what the theorem actually claims*, not to keep collecting data. A common reframe: the theorem is an **existence or upper-bound result** over co-designed components, while the trained model realizes only part of it (often it is *more* efficient than the bound). Report the result as the interpretation the data supports — for example "holds as an ordering / upper estimate" rather than "tight point predictor" — and state which object each reading applies to. This is a reframing of the claim, never a quiet weakening to dodge a null.

**4. Seed-and-expand (depth-first).**
Do not scatter experiments across unrelated tasks. Take the single cleanest successful result as a seed, sweep the variable that governs that success to draw the success curve, then add neighboring conditions and seeds at the winning point to make it robust. Grow the seed; do not broaden. When a large reframe or rebuild is on the table, gate it on one decisive high-fidelity experiment first, then decide scope from its result.

**5. Honest negatives as the regime boundary.**
Never hide a null or massage it into a positive. Report it as the *outside* of the success region. A clean null that defines where the method stops working strengthens the regime map rather than damaging it.

### B. Causal decomposition — why it works

**6. Mechanism ablation via counterfactuals.**
Split the effect into its candidate causes and remove one cause per condition. Build a counterfactual baseline for each hypothesized driver so you can name the active ingredient instead of asserting it. (Example shape: full method vs. each component disabled.) Before claiming a learned component matters, add the isolating control that turns only that component off — this single ablation is usually the strongest move available.

**7. Always carry a control.**
Keep a negative control (for example a no-update / no-intervention arm) in every comparison so an observed effect cannot be a drift or measurement artifact.

### C. Confidence — how much to trust it

**8. Tighten error bars by adding seeds — direction fixed, confidence raised.**
For borderline results, increase the number of seeds (for example 5 to 10). The hard rule: the point estimate is held and the variance shrinks. You are reducing the error bar, **not** selecting seeds that change the answer. Report honestly when added seeds *weaken* a borderline claim, too.

**9. Report the full statistical triple.**
Pair every headline comparison with a paired significance test, a bootstrap confidence interval, and an effect size (Cohen's d). Never rest on a single p-value.

**10. Validate proxies with an independent measure.**
If a surrogate metric carries the claim, confirm it tracks the real quantity using a separately-sourced instrument (for example an independent judge model kept distinct from the system under test).

**11. Cross-task replication.**
Show the ordering and effect reproduce on a held-out pool and on a different task domain, so the result is not pool-specific.

### D. Fidelity ladder and mechanism illustration

**12. Fidelity ladder — order experiments by closeness to the real object and report where each law holds.**
When a law is predicted by theory but the realistic setup is noisy or saturating, do not collapse the question to a single setup. Build a ladder of experiments from the idealized object that instantiates the proof's assumptions directly, through progressively more faithful versions, up to the real trained model (for example: idealized closed-form object → faithful gradient-descent model → ablation → scaling sweep). For **each** law, state explicitly the object on which it holds and how tightly (for example "exact on the idealized object, R² = 0.998; survives as an ordering on the real model, R² = 0.68"). Any idealized rung is permitted only when it is labeled as a mechanism illustration, not independent empirical evidence, and shown alongside the realistic rung.

**13. Validate scaling laws at the prefactor, not only the exponent.**
A power-law claim (for example error ∝ 1/m) is far stronger when the *coefficient*, not just the slope, is shown to behave as the theory predicts. After fitting the exponent, regress the fitted amplitude against the theoretical quantity it should scale with (for example amplitude A against the target's squared norm R²) and report that relationship, including an honest affine-versus-proportional distinction if a finite floor adds an intercept. This upgrades "slope ≈ −1" to "the prefactor tracks the predicted quantity."

## Hard Constraints (Do Not Cross)

These are moves the user has rejected. Do not propose or perform them.

1. **No breadth-first point-checking.** Do not audit many theory predictions across unrelated setups. This was explicitly rejected because "the theory will not always hold exactly."
2. **No result inflation.** Do not select favorable seeds, avoid saturating regimes just to report larger numbers, or otherwise change a result's direction. Honesty is a standing constraint: keep the direction, raise only the confidence.
3. **No silent truncation.** If coverage is bounded (top-N, dropped conditions, sampling), say so.

## Operating Notes

- This project spawns multiple teammates per task and escalates a rubric each round; when extending experiments, fan out parallel runs and feed differences back as rubric evidence rather than settling for one run.
- The team-lead does not substantively hand-edit results; it steers via rubric and feedback.
- When a borderline result and an honest null coexist, report both with their full statistics; the null bounds the regime that the positive establishes.
- Verify every reported number against its source artifact before it enters the paper. Subagents and shell output have fabricated or transcribed wrong figures here; read the committed `results/*.json` directly, and when capturing computed values route them to a file with a unique sentinel tag and read that file rather than trusting inline stdout.
