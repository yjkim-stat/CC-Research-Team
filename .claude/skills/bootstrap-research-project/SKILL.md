---
name: bootstrap-research-project
description: Scaffold a fresh research-topic harness inside this repo when the user starts exploring or studying a new technical topic. Use when the user says they want to explore/study a new research topic, set up an adversarial self-improving multi-agent loop, create the `.claude` folder with minimal agents plus a wiki-update and a question skill and a PreCompact handoff hook, or stand up the `wiki/`, `team/`, `docs/handoff/`, and `docs/resources/` folder structure and register the paths in CLAUDE.md. Triggers on "새로운 연구 주제 탐색/공부", "이 프로젝트 셋업", "harness 만들어줘".
---

# Bootstrap Research Project

## Overview

This skill stands up a self-contained research-topic harness in the current repository root, following the cctt principle that the repo root itself is one research-topic workspace. The goal of the topic is exploration and study of a new, mostly technical, development subject, driven by an adversarial feedback loop where the team-lead spawns multiple teammates in parallel, cross-examines their output, and lets the topic self-improve round over round. This skill only builds the scaffolding. It does not itself run the research loop.

## When to use

Recognize the pattern by these signals.

- The user announces a new research topic to explore or study, and wants the collaboration harness stood up before any research begins.
- The user asks to create the `.claude` folder and add agents, skills, and a hook for this topic.
- The user names a knowledge-accumulation goal, such as a project wiki, session handoff, and a resource dump, rather than a paper-writing goal.
- The user emphasizes an adversarial, multi-agent, self-improving loop as the core mechanism.

## What it sets up

Build exactly this layout. Confirm any folder whose role is ambiguous with the user before writing, per CLAUDE.md.

```
<repo root>/
├── CLAUDE.md              # topic rules + a short paths section (this skill writes/extends it)
├── .claude/
│   ├── agents/            # MINIMAL agent set for a technical dev project
│   ├── skills/
│   │   ├── wiki-dream-update/   # consolidate project progress into the wiki (dream mode)
│   │   └── ask-project/         # answer questions against the wiki + project state
│   └── hooks/
│       └── handoff.py          # PreCompact hook → docs/handoff/ per-session markdown
├── wiki/                  # project description + one document per subtopic
├── team/                  # agent-team communication, rubrics, feedback (gitignored)
├── docs/
│   ├── handoff/           # prior-session summaries, one markdown file per session
│   └── resources/         # user-provided markdown and web-search findings
```

## Procedure

1. **Confirm scope and folder roles.** State the layout above back to the user and confirm the topic name and any folder whose purpose is not obvious. Do not guess folder roles.
2. **Keep the agent set minimal.** Because this is a technical development project, create only the agents the adversarial loop actually needs. Start with a `team-lead` posture handled by the main agent, and add at most a small number of teammate roles such as a builder or explorer and a skeptic or critic. Do not clone the full writing-oriented roster unless the user asks. Prefer spawning several instances of a few roles in parallel over defining many roles.
3. **Create the wiki-update skill (`wiki-dream-update`).** This skill consolidates accumulated session work into `wiki/` in what the user calls dream mode, meaning a proactive and generative consolidation pass that connects new findings to existing wiki pages and grows the knowledge base, rather than a literal transcript dump. Confirm the exact dream-mode semantics with the user if unclear, then encode them so future runs are reproducible.
4. **Create the question skill (`ask-project`).** This skill answers a user question by reading `wiki/`, `docs/`, and `team/`, citing the source pages, and updating or flagging the wiki when it finds a gap.
5. **Install the PreCompact handoff hook.** Reuse the existing `.claude/hooks/handoff.py` pattern in this repo, which already writes session file-change summaries into `docs/handoff/`. Wire it so that on PreCompact the whole session is organized into `docs/handoff/` as individual markdown files, one per session. Verify the hook is registered in settings and that it runs on Python standard library only.
6. **Route resources.** Any markdown the user provides or anything found by web search goes into `docs/resources/`, one file per source, with a short provenance header.
7. **Write the paths section in CLAUDE.md.** Add a short section that names each folder and its role in one line each, so any teammate can orient without reading this skill. Keep it brief.
8. **Verify.** Confirm the folders exist, the two skills load, the hook is registered, and CLAUDE.md documents the paths. Report the tree back to the user.

## Folder roles, one line each (for the CLAUDE.md paths section)

- `wiki/` — project description and per-subtopic documents, the durable knowledge base.
- `team/` — agent-team communication, rubrics, and feedback logs, gitignored.
- `docs/handoff/` — prior-session summaries, one markdown file per session, written by the PreCompact hook.
- `docs/resources/` — user-provided markdown and web-search findings, one file per source.

## Anti-patterns to avoid

- Creating a large agent roster for a technical project. Keep it minimal and lean on parallel instances.
- Writing folders whose role the user has not confirmed.
- Making the wiki-update skill a literal transcript dump instead of a consolidating dream-mode pass.
- Committing `team/` snapshots or logs, which are gitignored on purpose.
- Recording anything in `TOOL.md`, which only accepts user-approved tool entries per its own rules.

## Handoff

After scaffolding, tell the user which agents and skills were created, confirm the hook is live, and hand back so the user can start the adversarial research loop. Once the topic has a draft under review, the `adversarial-review-loop` skill takes over the reviewer-versus-defender hardening.
