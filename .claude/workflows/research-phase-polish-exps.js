export const meta = {
  name: 'research-phase-polish-exps',
  description: 'Polish a research artifact whose storyline is already fixed, covering BOTH writing/figures AND the experiment phase. Maps structure/figures/claims/data, diagnoses against reusable improvement lenses (including experiment planning), adversarially verifies every proposal preserves numbers/cites/refs/hedges and never strengthens a claim, and emits a prioritized rubric-escalating feedback dossier plus an experiments-to-plan list. Does not change the thesis.',
  whenToUse: 'A paper or report storyline is settled and you want to iteratively improve prose conciseness, figures, surfaced and newly-planned evidence, and cross-artifact consistency without weakening any claim. Pass the artifact directory or .tex path as args.',
  phases: [
    { title: 'Map', detail: 'parallel readers map structure, figures, the claim/number/hedge ledger, the result data on disk, and the fixed storyline' },
    { title: 'Diagnose', detail: 'one critic per lens proposes surgical claim-neutral changes; an experiment-planning lens proposes data reuse and new runs that add a message' },
    { title: 'Verify', detail: 'adversarial check that each proposal preserves every number/cite/ref/hedge, never strengthens a claim, and (for experiments) earns its compute' },
    { title: 'Synthesize', detail: 'merge survivors into a prioritized feedback dossier, an experiments-to-plan list, and an escalated rubric, written to the team folder' },
  ],
}

// ---- args: a path string, or { path, teamDir, goldStyleGlob } ----
const PATH = (typeof args === 'string' ? args : (args && args.path)) || '.'
const TEAM_DIR = (args && args.teamDir) || (PATH.replace(/\/$/, '') + '/team')
const GOLD = (args && args.goldStyleGlob) || '../../writing_examples/*.tex'

// ====================== schemas ======================
const STRUCTURE_SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['mainTex', 'appendixStartsAt', 'sections', 'verboseParagraphs', 'appendixCandidates'],
  properties: {
    mainTex: { type: 'string', description: 'absolute path to the primary .tex' },
    appendixStartsAt: { type: 'string', description: 'the \\appendix line marker / line number, or "none"' },
    sections: { type: 'array', items: { type: 'object', additionalProperties: false,
      required: ['name', 'role', 'approxWords'],
      properties: { name: { type: 'string' }, role: { type: 'string', description: 'main-body or appendix' }, approxWords: { type: 'number' } } } },
    verboseParagraphs: { type: 'array', description: 'main-body paragraphs that restate one idea, braid two messages, or run long', items: { type: 'object', additionalProperties: false,
      required: ['locator', 'problem'], properties: { locator: { type: 'string', description: 'unique verbatim 6-12 word snippet' }, problem: { type: 'string' } } } },
    appendixCandidates: { type: 'array', description: 'main-body detail that could move to appendix leaving a pointer', items: { type: 'string' } },
  },
}
const FIGURE_SCHEMA = {
  type: 'object', additionalProperties: false, required: ['figures', 'opportunities', 'fontEvalCmd'],
  properties: {
    figures: { type: 'array', items: { type: 'object', additionalProperties: false,
      required: ['label', 'imageFile', 'layout', 'captionIssue'],
      properties: { label: { type: 'string' }, imageFile: { type: 'string' }, layout: { type: 'string', description: 'e.g. 1x2 horizontal, 2-row stacked, single' }, captionIssue: { type: 'string', description: 'caption sentences that merely restate the body, or none' } } } },
    opportunities: { type: 'array', description: 'horizontal-alignment, font-parity, axis/encoding alternative, per-entity parameter exposure, figure merge, appendix->main promotion, duplicate-figure removal', items: { type: 'string' } },
    fontEvalCmd: { type: 'string', description: 'the figure font-parity eval command if a tool exists, else "none"' },
  },
}
const LEDGER_SCHEMA = {
  type: 'object', additionalProperties: false, required: ['numbers', 'cites', 'hedges', 'inconsistencies'],
  properties: {
    numbers: { type: 'array', description: 'every load-bearing numeric value and where it appears', items: { type: 'object', additionalProperties: false, required: ['value', 'where'], properties: { value: { type: 'string' }, where: { type: 'string' } } } },
    cites: { type: 'array', items: { type: 'string' } },
    hedges: { type: 'array', description: 'every honesty caveat that must survive verbatim in meaning', items: { type: 'string' } },
    inconsistencies: { type: 'array', description: 'same quantity with different values across figure/text/abstract/conclusion, or numbers from mismatched runs presented as one', items: { type: 'string' } },
  },
}
const DATA_SCHEMA = {
  type: 'object', additionalProperties: false, required: ['resultFiles', 'reusablePools', 'coverageGaps'],
  properties: {
    resultFiles: { type: 'array', description: 'result json files on disk and what each measures', items: { type: 'object', additionalProperties: false, required: ['file', 'measures'], properties: { file: { type: 'string' }, measures: { type: 'string' } } } },
    reusablePools: { type: 'array', description: 'cached sample pools / raw outputs that could be re-scored WITHOUT new generation, and whether full texts (not just answers) were saved', items: { type: 'string' } },
    coverageGaps: { type: 'array', description: 'claims or special cases in the paper that lack an experiment, or a ladder/axis that is only partly populated', items: { type: 'string' } },
  },
}
const STORYLINE_SCHEMA = {
  type: 'object', additionalProperties: false, required: ['thesis', 'pillars', 'doNotWeaken', 'goldStyleRefs'],
  properties: {
    thesis: { type: 'string', description: 'the central claim in one sentence' },
    pillars: { type: 'array', items: { type: 'string' } },
    doNotWeaken: { type: 'array', description: 'claims/structure that are fixed and must not be restructured or softened beyond existing hedges', items: { type: 'string' } },
    goldStyleRefs: { type: 'array', description: 'gold-standard style example files found, if any', items: { type: 'string' } },
  },
}
const PROPOSALS_SCHEMA = {
  type: 'object', additionalProperties: false, required: ['proposals'],
  properties: { proposals: { type: 'array', items: { type: 'object', additionalProperties: false,
    required: ['locator', 'issue', 'severity', 'proposedChange', 'rationale', 'preserves', 'userPattern'],
    properties: {
      locator: { type: 'string', description: 'unique verbatim snippet of the target text/caption/figure, or the claim/axis a proposed experiment targets' },
      issue: { type: 'string' },
      severity: { type: 'string', description: 'high / medium / low' },
      proposedChange: { type: 'string', description: 'the concrete surgical rewrite, figure edit, or experiment spec (what to run, on what data/model, expected message, GPU/cost note), drop-in ready' },
      rationale: { type: 'string' },
      preserves: { type: 'object', additionalProperties: false, required: ['numbers', 'cites', 'hedges'],
        properties: { numbers: { type: 'array', items: { type: 'string' } }, cites: { type: 'array', items: { type: 'string' } }, hedges: { type: 'array', items: { type: 'string' } } } },
      userPattern: { type: 'string', description: 'which reused user-instruction pattern this echoes' },
    } } } },
}
const VERDICT_SCHEMA = {
  type: 'object', additionalProperties: false, required: ['safe', 'preservesAll', 'strengthensClaim', 'earnsCompute', 'notes'],
  properties: {
    safe: { type: 'boolean', description: 'true only if it preserves everything, does not strengthen a claim, and (for an experiment) earns its compute by adding a new message' },
    preservesAll: { type: 'boolean' },
    strengthensClaim: { type: 'boolean' },
    earnsCompute: { type: 'boolean', description: 'for experiment proposals: true if it adds a NEW message rather than reinforcing/broadening what is already shown; true by default for non-experiment proposals' },
    notes: { type: 'string' },
  },
}

// ====================== Phase 1: Map ======================
phase('Map')
const readBase = `You are reading the research artifact under ${PATH}. Find the primary .tex (the one with \\begin{document} or the longest section body). The MAIN BODY runs from \\begin{abstract} to \\bibliography (everything before \\appendix); the APPENDIX is everything after \\appendix. Result data lives under ${PATH}/experiments/results or similar. Use Read/Grep/Bash(grep,ls) only. Do not edit anything.`

const [structure, figures, ledger, data, storyline] = await parallel([
  () => agent(`${readBase}
Map the document STRUCTURE. List sections with role (main-body vs appendix) and approximate word count. Flag MAIN-BODY paragraphs that (a) restate one idea more than once, (b) braid two messages, or (c) run as long multi-clause wind-up sentences. Separately list main-body content that is fine detail which could move to the appendix leaving a one-line pointer. Give each flagged paragraph a unique verbatim 6-12 word locator snippet.`,
    { schema: STRUCTURE_SCHEMA, phase: 'Map', label: 'map:structure' }),
  () => agent(`${readBase}
Map the FIGURES (main body first). For each figure record its label, included image file, panel layout (1xN horizontal, stacked rows, single), and any caption sentence that merely restates a body sentence. Then list improvement OPPORTUNITIES from this lens set: panels not horizontal; in-figure vs caption font-size parity; an axis/encoding alternative (a transformed scale that linearizes a law, or a familiar log scale); exposing a fitted parameter per series in the legend; merging two figures sharing an axis/thread; promoting a buried/appendix or schematic figure into a measured main-body figure; removing a figure duplicated across main and appendix and repointing refs. If a figure font-parity eval tool exists (e.g. tools/eval_figure_quality.py), report the exact command.`,
    { schema: FIGURE_SCHEMA, phase: 'Map', label: 'map:figures' }),
  () => agent(`${readBase}
Build the PRESERVE LEDGER. Extract every load-bearing numeric value (accuracies, slopes, R^2, p-values, CIs, percentage gains, sample sizes) with where it appears; every \\cite key; and every honesty hedge that must survive (directional-not-confirmed, point-estimate, CI-includes-zero, scoped-to-X, not-harmful-in-general, upper-bound-only, single-seed, etc.). Flag INCONSISTENCIES: the same quantity with different values across figure/text/abstract/conclusion, or numbers from different runs presented as one.`,
    { schema: LEDGER_SCHEMA, phase: 'Map', label: 'map:ledger' }),
  () => agent(`${readBase}
Map the EXPERIMENT DATA on disk. List the result json files under the results directory and what each measures. Identify cached sample pools or raw outputs that could be RE-SCORED without new generation, and for each note whether full solution/reasoning texts were saved or only extracted answers/scores (re-scoring a process model needs full texts). Finally list COVERAGE GAPS: claims or special cases asserted in the paper that have no experiment, or a comparison ladder/axis that is only partly populated.`,
    { schema: DATA_SCHEMA, phase: 'Map', label: 'map:data' }),
  () => agent(`${readBase}
Extract the fixed STORYLINE. State the thesis in one sentence, list the pillars, and list what must NOT be weakened or restructured (the storyline is set; downstream we polish, not re-argue). Locate gold-standard writing-style example files (look near the repo, e.g. ${GOLD}) to use as the cadence target.`,
    { schema: STORYLINE_SCHEMA, phase: 'Map', label: 'map:storyline' }),
])

const CTX = `\n\n=== MAP CONTEXT ===\nSTRUCTURE: ${JSON.stringify(structure)}\nFIGURES: ${JSON.stringify(figures)}\nLEDGER (preserve set): ${JSON.stringify(ledger)}\nDATA: ${JSON.stringify(data)}\nSTORYLINE (fixed): ${JSON.stringify(storyline)}\n`

// ====================== Phase 2+3: Diagnose -> Verify ======================
// Lenses = the generalized, reusable user-instruction patterns from prior polishing.
const LENSES = [
  { key: 'succinctness', prompt: `LENS = SUCCINCTNESS. The main body must be concise; the appendix may stay detailed. Propose surgical cuts of redundant restatement, sentence-level filler, repeated hedges within a section (keep each once), and long 3+-clause wind-up sentences (split them). Never delete a number, citation, or hedge to shorten. Compression must be claim-neutral or claim-weakening, never claim-strengthening.` },
  { key: 'main-vs-appendix', prompt: `LENS = MAIN-VS-APPENDIX DIVISION. Propose moving fine derivations, enumerations, or secondary diagnostics from the main body to the appendix, leaving a one-line pointer. Keep the main body to result + pointer. Preserve every cross-reference.` },
  { key: 'figure-layout-font', prompt: `LENS = FIGURE LAYOUT, FONT, ENCODING. Propose laying multi-panel figures in a single horizontal row; fixing in-figure vs caption font parity (cite the eval command if present); an axis/encoding alternative that strengthens the message (a transformed scale that linearizes a law, or a familiar log scale) with the honest tradeoff stated; exposing a fitted parameter per series in the legend; merging two figures sharing an axis/thread; promoting a schematic or buried figure into a measured main-body figure and removing duplicates while repointing refs; trimming caption sentences that restate the body.` },
  { key: 'evidence-surfacing', prompt: `LENS = EVIDENCE SURFACING (no new compute). From the DATA map, identify claims stated only schematically or buried in the appendix that ALREADY have measured data on disk and could be surfaced in the main body without running anything new. Require the honest firm-vs-hedged framing be preserved (a sign-change can be firm while a precise threshold with a CI including zero stays a point estimate).` },
  { key: 'experiment-planning', prompt: `LENS = EXPERIMENT PLANNING. Propose experiments that strengthen the FIXED storyline, applying these rules in order. (1) Prefer reusing cached pools / on-disk data by re-scoring before proposing any new generation; only propose generation when the needed inputs (e.g. full reasoning texts) were not saved. (2) Propose a NEW experiment only if it adds a NEW MESSAGE to the storyline (a new regime, a new special case completing a comparison ladder, a decisive control), not mere reinforcement or breadth. (3) Keep new comparisons apples-to-apples by reusing the same pool/run or by disclosing the run difference in the caption. (4) Specify implement-first-then-run, GPU-aware scheduling (one job at a time, run when the shared GPU is idle, save artifacts/pools for future re-scoring), and the expected honest outcome including the null/hedged case. For each proposal give the targeted claim/axis as the locator, the experiment spec as the proposedChange, and the new message it adds.` },
  { key: 'consistency-honesty', prompt: `LENS = CONSISTENCY AND HONESTY AUDIT. Using the ledger inconsistencies, propose fixes so a quantity carries ONE value everywhere (headline single-source), flag any figure/text drawn from mismatched runs and propose aligning the source or disclosing it in the caption, and flag any sentence that over-claims (universal, confirmed, sharp threshold) so it gets scoped or hedged. Never remove an existing hedge.` },
  { key: 'style-parity', prompt: `LENS = STYLE PARITY. Match the gold-standard examples and the project rules: one sentence per source line, complete sentences, no parentheses/semicolons/colons/hyphens as structural connectors, US English, figure->meaning->result->"This result shows/indicates/suggests" cadence in experimental prose.` },
]

const diagnosed = await pipeline(
  LENSES,
  (lens) => agent(`${readBase}
${lens.prompt}
Produce concrete, surgical proposals. Each must carry a unique verbatim locator, the proposed drop-in change (or experiment spec), the rationale, the preserve-checklist (numbers/cites/hedges it touches and confirms kept), and which reused user-instruction pattern it echoes. Be conservative: when a recap is load-bearing for standalone readability (abstract, conclusion) leave it; do not propose an experiment that only reinforces what is already shown. Quality over quantity.
${CTX}`,
    { schema: PROPOSALS_SCHEMA, phase: 'Diagnose', label: `diagnose:${lens.key}` }),
  (res, lens) => parallel(((res && res.proposals) || []).map((p) => () =>
    agent(`You are an adversarial reviewer. A polish proposal for ${PATH} is below. Mark safe=true ONLY if it preserves EVERY number, citation, cross-reference, and hedge it touches, does NOT strengthen any claim (claim-neutral or claim-weakening only), does not contradict the fixed storyline, and (if it is an experiment) earns its compute by adding a NEW message rather than reinforcing what is already shown. Default to safe=false when uncertain.
PROPOSAL: ${JSON.stringify(p)}
PRESERVE LEDGER: ${JSON.stringify(ledger)}
FIXED STORYLINE: ${JSON.stringify(storyline)}`,
      { schema: VERDICT_SCHEMA, phase: 'Verify', label: `verify:${lens.key}` })
      .then((v) => ({ ...p, dimension: lens.key, verdict: v }))
  ))
)

const all = diagnosed.flat().filter(Boolean)
const verified = all.filter((p) => p.verdict && p.verdict.safe)
const rejected = all.filter((p) => !(p.verdict && p.verdict.safe))
const experiments = verified.filter((p) => p.dimension === 'experiment-planning')
log(`Diagnose+Verify: ${all.length} proposals, ${verified.length} verified safe (${experiments.length} experiments), ${rejected.length} rejected.`)

// ====================== Phase 4: Synthesize ======================
phase('Synthesize')
const synthSummary = await agent(`You are the team-lead synthesizing a polish feedback dossier for the research artifact under ${PATH}. You do NOT edit substantive prose yourself; you produce feedback the author applies, in the established iterative style.

INPUTS:
FIXED STORYLINE: ${JSON.stringify(storyline)}
VERIFIED PROPOSALS (safe, grouped by lens): ${JSON.stringify(verified)}
REJECTED (note briefly why, do not act): ${JSON.stringify(rejected.map((r) => ({ locator: r.locator, why: r.verdict && r.verdict.notes })))}
PRESERVE LEDGER: ${JSON.stringify(ledger)}
FIGURE FONT-EVAL COMMAND: ${(figures && figures.fontEvalCmd) || 'none'}

TASKS:
1. Read ${TEAM_DIR} (create it with Bash mkdir -p if missing). Find the highest existing polish_feedback_round<N>.md to compute the next round number N (start at 1).
2. Write ${TEAM_DIR}/polish_feedback_round<N>.md: a prioritized dossier grouped by lens (succinctness, main-vs-appendix, figure-layout-font, evidence-surfacing, consistency-honesty, style-parity). For each proposal give the locator, the issue, the drop-in change, and its preserve-checklist. Put high-severity and any consistency/honesty fixes first. Add a dedicated EXPERIMENTS-TO-PLAN section listing the experiment proposals, each with the targeted claim, the run spec, the new message it adds, GPU-aware scheduling, and the expected honest outcome including the null case. End with a VERIFICATION CHECKLIST to run after applying edits: compile (tectonic <main.tex> --keep-intermediates --synctex=0), grep the log for "Reference .* undefined|Citation .* undefined", pdftotext <pdf> - | grep -c '??', and the figure font-parity eval command above. Also list GENUINE FORKS needing a human decision (axis choice, which run to source a number from, whether to merge or promote a figure, whether an experiment earns its GPU time) as crisp either/or questions.
3. Escalate the rubric: read ${TEAM_DIR}/polish_rubric.md if present, else create it with aspects S1 redundancy, S2 cross-section duplication, S3 filler, S4 one-message-per-paragraph, S5 length-reduction, S6 style-parity, S7 sentence-economy, S8 caption-body-non-duplication, S9 headline-single-source, S10 figure-encoding-clarity, S11 experiment-earns-its-compute, plus hard constraints H1 preserve numbers, H2 preserve cites/refs, H3 preserve hedges, H4 never strengthen a claim, H5 one sentence per source line. THEN escalate this round by adding one new aspect OR raising one pass-bar, and append a changelog line. Never settle at "good enough".

Return a 6-10 line summary: round number, counts per lens, the top 3 highest-impact fixes, the planned experiments, and the open forks. Keep the detail in the written files.`,
  { phase: 'Synthesize', label: 'synthesize:dossier' })

return { artifact: PATH, teamDir: TEAM_DIR, verified: verified.length, experiments: experiments.length, rejected: rejected.length, summary: synthSummary }
