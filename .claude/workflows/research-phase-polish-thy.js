export const meta = {
  name: 'research-phase-polish-thy',
  description:
    'Adversarially audit a theory-heavy research paper for proof gaps, false or overclaimed statements, novelty preemption, and internal inconsistency, then repair, verify, apply, and run a full paragraph-level consistency pass. Pass the target paper .tex path as a string, or {tex, results, team, bib} as args.',
  phases: [
    { title: 'Map' },
    { title: 'Audit proofs and claims' },
    { title: 'Confirm gaps' },
    { title: 'Novelty preemption' },
    { title: 'Repair' },
    { title: 'Verify repairs' },
    { title: 'Apply and compile' },
    { title: 'Consistency review' },
    { title: 'Synthesize' },
  ],
}

// ---------------------------------------------------------------------------
// Generalized from a session that audited and repaired an ICLR theory paper.
// The pattern: map -> adversarially audit (proofs + claim-evidence) -> confirm
// genuine gaps -> check novelty vs prior art -> repair (rigorous OR honest
// weakening, two approaches compared) -> adversarially verify the repairs ->
// apply through ONE sequential editor that recompiles -> paragraph-level
// per-section consistency audit writing to a shared team ledger -> cross-section
// synthesis -> apply the consolidated fixes -> final compile.
// Every claim is checked against a CANONICAL_FACTS ledger of verified numbers,
// and the paper must always recompile cleanly (EXIT 0, no undefined refs).
// ---------------------------------------------------------------------------

const cfg = (typeof args === 'string') ? { tex: args } : (args || {})
const TEX = cfg.tex
if (!TEX) {
  throw new Error('Provide the paper .tex path as args (a string), or {tex, results, team, bib}.')
}
const DIR = TEX.replace(/[^/\\]*$/, '')
const RESULTS = cfg.results || (DIR + 'experiments/results')
const TEAM = cfg.team || (DIR + 'team/review')
const BIB = cfg.bib || TEX.replace(/\.tex$/, '.bib')

log('Target paper: ' + TEX)
log('Result JSONs: ' + RESULTS)
log('Shared ledger folder: ' + TEAM)

// ===================== schemas ============================================
const MAP_SCHEMA = {
  type: 'object',
  required: ['results', 'contributions', 'headline_numbers', 'sections', 'compile_cmd'],
  properties: {
    results: {
      type: 'array',
      description: 'Every numbered theorem/lemma/proposition/corollary.',
      items: {
        type: 'object',
        required: ['name', 'label', 'statement_lines', 'proof_lines'],
        properties: {
          name: { type: 'string' },
          label: { type: 'string' },
          statement_lines: { type: 'string', description: 'e.g. 435-450' },
          proof_lines: { type: 'string', description: 'appendix proof line range, or "none"' },
          one_line: { type: 'string', description: 'what it claims, in one sentence' },
        },
      },
    },
    contributions: { type: 'array', items: { type: 'string' } },
    headline_numbers: {
      type: 'array',
      description: 'Every quantitative claim in abstract/intro and its source result file if known.',
      items: {
        type: 'object',
        required: ['claim', 'location'],
        properties: {
          claim: { type: 'string' },
          location: { type: 'string' },
          source_file: { type: 'string' },
        },
      },
    },
    sections: {
      type: 'array',
      description: 'Coherent chunks for the per-section consistency pass.',
      items: {
        type: 'object',
        required: ['name', 'lines'],
        properties: { name: { type: 'string' }, lines: { type: 'string' } },
      },
    },
    result_files: { type: 'array', items: { type: 'string' } },
    compile_cmd: { type: 'string', description: 'the exact command that builds the PDF (e.g. tectonic <tex>, latexmk -pdf <tex>)' },
  },
}

const AUDIT_SCHEMA = {
  type: 'object',
  required: ['result', 'verdict', 'findings'],
  properties: {
    result: { type: 'string' },
    verdict: { type: 'string', enum: ['SOUND', 'SOUND-BUT-ASSUMPTIONS-UNREALISTIC', 'HAS-GAP', 'CIRCULAR', 'TRUE-BY-CONSTRUCTION', 'OVERCLAIM'] },
    findings: {
      type: 'array',
      items: {
        type: 'object',
        required: ['severity', 'location', 'problem'],
        properties: {
          severity: { type: 'string', enum: ['BLOCKER', 'SHOULD-FIX', 'NIT'] },
          location: { type: 'string' },
          problem: { type: 'string' },
          quoted_text: { type: 'string' },
        },
      },
    },
  },
}

const CONFIRM_SCHEMA = {
  type: 'object',
  required: ['confirmed_gaps'],
  properties: {
    confirmed_gaps: {
      type: 'array',
      items: {
        type: 'object',
        required: ['result', 'severity', 'location', 'problem', 'is_genuine'],
        properties: {
          result: { type: 'string' },
          severity: { type: 'string' },
          location: { type: 'string' },
          problem: { type: 'string' },
          is_genuine: { type: 'boolean', description: 'true = real gap, false = audit was too harsh' },
          rationale: { type: 'string' },
        },
      },
    },
  },
}

const NOVELTY_SCHEMA = {
  type: 'object',
  required: ['contribution', 'status', 'closest_prior', 'honest_delta'],
  properties: {
    contribution: { type: 'string' },
    status: { type: 'string', enum: ['NOVEL', 'NOVEL-ONLY-IN-INSTANTIATION', 'SUBSTANTIALLY-PREEMPTED', 'FOLKLORE'] },
    closest_prior: { type: 'array', items: { type: 'string' }, description: 'authors, year, title, what they did' },
    honest_delta: { type: 'string', description: 'the narrowest defensible delta, or "none"' },
    citations_to_add: { type: 'array', items: { type: 'string' } },
  },
}

const REPAIR_SCHEMA = {
  type: 'object',
  required: ['gap', 'approach', 'insertable_latex', 'new_assumptions', 'honesty_note'],
  properties: {
    gap: { type: 'string' },
    approach: { type: 'string', enum: ['RIGOROUS-REPAIR', 'HONEST-WEAKENING', 'BOTH'] },
    insertable_latex: { type: 'string' },
    new_assumptions: { type: 'array', items: { type: 'string' } },
    honesty_note: { type: 'string', description: 'what is now provable vs what was given up' },
    target_lines: { type: 'string' },
  },
}

const VERIFY_SCHEMA = {
  type: 'object',
  required: ['gap', 'verdict', 'residual'],
  properties: {
    gap: { type: 'string' },
    verdict: { type: 'string', enum: ['REPAIR-CLOSES-GAP', 'REPAIR-PARTIAL', 'REPAIR-FAILS'] },
    residual: { type: 'string', description: 'any remaining issue, or "none"' },
    strongest_honest_version: { type: 'string' },
  },
}

// ===================== PHASE 1: MAP =======================================
phase('Map')
const map = await agent(
  'You are mapping a theory-heavy research paper for an audit. Read ' + TEX + ' in full and, if present, list the experiment result files under ' + RESULTS + '. ' +
  'Return: every numbered theorem/lemma/proposition/corollary with its statement and appendix-proof line ranges and a one-line summary; the contributions list; every quantitative claim in the abstract and introduction with its location and (if identifiable) the result JSON it should come from; a division of the paper into coherent section chunks for a per-section consistency pass; the list of result files; and the exact shell command that compiles the PDF (inspect the repo for a Makefile/latexmk/tectonic, otherwise infer). Do not edit anything.',
  { schema: MAP_SCHEMA, label: 'map' }
)
log('Mapped ' + map.results.length + ' results, ' + map.contributions.length + ' contributions, ' + map.headline_numbers.length + ' headline numbers.')

// Build a CANONICAL_FACTS ledger from the result files: the verified ground
// truth that every paper number must match.
const canonical = await agent(
  'Build a CANONICAL_FACTS ledger of verified ground truth for the paper at ' + TEX + '. ' +
  'Read the experiment result files (' + (map.result_files.join(', ') || RESULTS) + ') and extract the canonical value of every headline quantity (means, gaps, p-values, effect sizes, R^2, slopes, rates). ' +
  'Also list the canonical post-audit theorem statements and the full assumption set. ' +
  'Write this ledger to ' + TEAM + '/CANONICAL_FACTS.md (create the folder). Any paper number disagreeing with a result file is an ERROR you must record. ' +
  'Return as your final message a short confirmation plus the 10 most error-prone facts.',
  { label: 'canonical-ledger', phase: 'Map' }
)
log('Canonical ledger: ' + String(canonical).slice(0, 200))

// ===================== PHASE 2: AUDIT (parallel) ==========================
phase('Audit proofs and claims')
// One adversarial proof-checker per result, plus a claim-evidence checker.
const auditThunks = map.results.map((r) => () =>
  agent(
    'You are an UNCHARITABLE adversarial proof-checker. In ' + TEX + ', read the statement of "' + r.name + '" (lines ' + r.statement_lines + ') and its proof (lines ' + r.proof_lines + '). ' +
    'Decide, citing exact lines and quoting the actual proof text: is the chain valid GIVEN its assumptions, what assumptions are doing illegitimate work (hidden circularity, an inequality used in the wrong direction, a constant that hides the hard part, a result assumed-by-construction), and any gap or hand-wave. ' +
    'Be specific. Do not be charitable. Do not edit the file.',
    { schema: AUDIT_SCHEMA, label: 'audit:' + r.label, phase: 'Audit proofs and claims' }
  )
)
auditThunks.push(() =>
  agent(
    'You are a claim-evidence auditor. For the paper at ' + TEX + ', extract every quantitative claim in the abstract, introduction, and contributions, and verify each against the experiment result files (' + (map.result_files.join(', ') || RESULTS) + ') and the ledger at ' + TEAM + '/CANONICAL_FACTS.md. ' +
    'Flag every MISMATCH, UNSUPPORTED number, OVERCLAIM, or STALE figure with the exact line. Also check every "This result shows/demonstrates" closing sentence actually follows from its paragraph.',
    { schema: AUDIT_SCHEMA, label: 'audit:claim-evidence', phase: 'Audit proofs and claims' }
  )
)
const audits = (await parallel(auditThunks)).filter(Boolean)
const allFindings = audits.flatMap((a) => (a.findings || []).map((f) => ({ ...f, result: a.result, verdict: a.verdict })))
log('Audit raised ' + allFindings.length + ' findings across ' + audits.length + ' checks.')

// ===================== PHASE 3: CONFIRM GAPS ==============================
phase('Confirm gaps')
// Adversarial auditors are deliberately harsh; a second pass filters false positives.
const confirm = await agent(
  'You are adjudicating an adversarial audit that was deliberately uncharitable, so some findings may be overstated. ' +
  'Here are the raw findings as JSON:\n' + JSON.stringify(allFindings).slice(0, 12000) + '\n' +
  'For each finding, read the relevant part of ' + TEX + ' and decide whether it is a GENUINE gap or a false alarm, with a one-line rationale. Keep severities honest (a real false/contradictory claim is BLOCKER; a strong-but-stated assumption is SHOULD-FIX or NIT). Return only the adjudicated list.',
  { schema: CONFIRM_SCHEMA, label: 'confirm-gaps' }
)
const genuine = (confirm.confirmed_gaps || []).filter((g) => g.is_genuine)
log('Confirmed ' + genuine.length + ' genuine gaps (of ' + (confirm.confirmed_gaps || []).length + ' findings).')

// ===================== PHASE 4: NOVELTY (parallel) ========================
phase('Novelty preemption')
const novelty = (await parallel(
  map.contributions.map((c, i) => () =>
    agent(
      'You are an adversarial novelty auditor. The paper at ' + TEX + ' claims this contribution: "' + c + '". ' +
      'Use web search to find the STRONGEST prior art that preempts or weakens it. Be brutally honest. ' +
      'Decide whether it is genuinely novel, novel only in its instantiation/setting, substantially preempted, or folklore, and give the narrowest honestly-defensible delta plus the exact citations to add. ' +
      'When a result looks preempted, check the PRECISE form of the prior result (e.g. does the prior proof use the same object, the same assumptions, the same loss), because a near-miss on the precise form can leave a genuine gap.',
      { schema: NOVELTY_SCHEMA, label: 'novelty:' + (i + 1), phase: 'Novelty preemption' }
    )
  )
)).filter(Boolean)
const preempted = novelty.filter((n) => n.status === 'SUBSTANTIALLY-PREEMPTED' || n.status === 'FOLKLORE')
log('Novelty: ' + (novelty.length - preempted.length) + '/' + novelty.length + ' contributions defensible; ' + preempted.length + ' preempted.')

// ===================== PHASE 5+6: REPAIR -> VERIFY (pipeline) =============
// Each genuine gap is repaired (rigorous if possible, else honest weakening),
// then adversarially verified that the repair closes it without a new gap.
phase('Repair')
const repaired = await pipeline(
  genuine,
  (g) =>
    agent(
      'You are a proof-repair teammate for ' + TEX + '. Repair this gap honestly:\n' + JSON.stringify(g) + '\n' +
      'First attempt a RIGOROUS repair (add the minimal explicit assumption needed, fix the chain). If a fully rigorous repair is not possible with reasonable assumptions, produce the strongest HONESTLY-PROVABLE weakened statement instead. ' +
      'Return insertable LaTeX (statement and/or proof), the minimal new assumptions with a reasonableness judgment, the exact target line range, and an honesty note of what is now provable vs given up. Do not edit the file.',
      { schema: REPAIR_SCHEMA, label: 'repair:' + g.result, phase: 'Repair' }
    ),
  (rep, g) =>
    agent(
      'You are an UNCHARITABLE verifier. A teammate proposed this repair for a gap in ' + TEX + ':\n' + JSON.stringify(rep).slice(0, 8000) + '\n' +
      'Decide whether the repair actually closes the original gap WITHOUT introducing a new gap. Check that any "derivation" step is genuine and not assumed-by-construction, that added assumptions are honestly flagged (especially any that do not follow from existing ones), and that the claim is not silently re-strengthened. Give the strongest honestly-provable version.',
      { schema: VERIFY_SCHEMA, label: 'verify:' + g.result, phase: 'Verify repairs' }
    ).then((v) => ({ gap: g, repair: rep, verify: v }))
)
const adoptable = repaired.filter(Boolean).filter((r) => r.verify && r.verify.verdict !== 'REPAIR-FAILS')
log('Repairs: ' + adoptable.length + '/' + genuine.length + ' adoptable after verification.')

// ===================== PHASE 7: APPLY (single sequential editor) ==========
// All edits funnel through ONE agent so parallel writes never clash; it recompiles.
phase('Apply and compile')
let applyReport = 'no adoptable repairs to apply'
if (adoptable.length || preempted.length) {
  const plan = adoptable.map((r) => ({
    target_lines: r.repair.target_lines,
    insertable_latex: r.repair.insertable_latex,
    strongest_version: r.verify.strongest_honest_version,
    honesty_note: r.repair.honesty_note,
  }))
  const citePlan = novelty.flatMap((n) => n.citations_to_add || [])
  applyReport = await agent(
    'You are the single editor for ' + TEX + '. Apply these verified repairs and citation additions, preserving every \\label/\\ref and matching the paper writing style (one sentence per line, no structural-punctuation connectors). NEVER run git. ' +
    'Repairs to apply (use the strongest_honest_version where the verifier weakened the claim):\n' + JSON.stringify(plan).slice(0, 14000) + '\n' +
    'Citations the novelty pass says to add (insert honest differentiation and add bib entries to ' + BIB + ', verifying authors before inventing keys):\n' + JSON.stringify(citePlan).slice(0, 4000) + '\n' +
    'Also soften any contribution/abstract sentence that the novelty pass marked preempted so it claims only the honest delta. ' +
    'After editing, recompile with: ' + map.compile_cmd + ' . Confirm EXIT 0 with no undefined references or ?? and report the exact lines you changed and anything you could not apply cleanly.',
    { label: 'apply-repairs', phase: 'Apply and compile' }
  )
}
log('Apply: ' + String(applyReport).slice(0, 200))

// ===================== PHASE 8: CONSISTENCY (parallel + synth) ============
// Per-section paragraph audits write findings to the shared ledger folder,
// then a cross-section synthesizer resolves every cross-reference flag.
phase('Consistency review')
await parallel(
  map.sections.map((s, i) => () =>
    agent(
      'You are a paragraph-level consistency auditor. Read ' + TEAM + '/CANONICAL_FACTS.md, then audit lines ' + s.lines + ' of ' + TEX + ' (section "' + s.name + '") paragraph by paragraph. ' +
      'Check every claim/number/theorem-reference against CANONICAL_FACTS and for internal errors (math, typos, undefined terms, broken logic, wrong \\ref, overclaim, any retracted claim residue). ' +
      'Write your findings to ' + TEAM + '/findings_S' + (i + 1) + '.md with sections CLAIMS DECLARED, DEPENDENCIES (what you rely on from elsewhere), CROSS-SECTION FLAGS (for the synthesizer to verify), INTRA-SECTION ERRORS, VERDICT. Quote exact lines. Do not edit the .tex.',
      { label: 'consistency:S' + (i + 1), phase: 'Consistency review' }
    )
  )
)
log('Per-section consistency findings written to ' + TEAM)

phase('Synthesize')
const consistency = await agent(
  'You are the cross-consistency synthesizer. Read every ' + TEAM + '/findings_S*.md plus ' + TEAM + '/CANONICAL_FACTS.md, and open ' + TEX + ' to verify each CROSS-SECTION FLAG by reading both sides. ' +
  'Produce one consolidated, de-duplicated, prioritized report at ' + TEAM + '/CONSISTENCY_REPORT.md with three sections BLOCKER / SHOULD-FIX / NIT, each item = exact line(s) + problem + precise fix, most important first, every item either a concrete fix or "false alarm, no action". ' +
  'Return as your final message the BLOCKER and SHOULD-FIX list with line numbers and fixes.',
  { label: 'consistency-synthesis', phase: 'Synthesize' }
)

// Apply the consolidated consistency fixes through the single editor, then final compile.
const finalApply = await agent(
  'You are the single editor for ' + TEX + '. Apply the BLOCKER and SHOULD-FIX items from the consolidated report:\n' + String(consistency).slice(0, 12000) + '\n' +
  'Preserve every \\label/\\ref, match the writing style, never run git. After editing, recompile with: ' + map.compile_cmd + ' . Confirm EXIT 0, no undefined references or ??, and report exact lines changed.',
  { label: 'apply-consistency', phase: 'Synthesize' }
)

return {
  paper: TEX,
  audit_findings: allFindings.length,
  genuine_gaps: genuine.length,
  repairs_adopted: adoptable.length,
  novelty: novelty.map((n) => ({ contribution: n.contribution.slice(0, 80), status: n.status })),
  preempted_count: preempted.length,
  consistency_report: TEAM + '/CONSISTENCY_REPORT.md',
  apply_repairs: String(applyReport).slice(0, 400),
  apply_consistency: String(finalApply).slice(0, 400),
  consistency_summary: String(consistency).slice(0, 1200),
}
