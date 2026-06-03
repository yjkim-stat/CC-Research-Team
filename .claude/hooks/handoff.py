#!/usr/bin/env python3
"""Handoff hook for PreCompact / PostCompact / Stop / SessionEnd events.

Reads the hook payload from stdin, scans the transcript for files written
during the session, then appends a templated handoff entry to
`docs/handoff/HANDOFF.md`. Replaces the prior bash+jq implementation so the
hook works without `jq` installed (uses only the Python stdlib).
"""

from __future__ import annotations

import datetime
import json
import os
import pathlib
import sys

WRITE_TOOLS = {"Write", "Edit", "MultiEdit", "NotebookEdit"}


def _get(d, *keys, default=None):
    cur = d
    for k in keys:
        if not isinstance(cur, dict):
            return default
        cur = cur.get(k)
        if cur is None:
            return default
    return cur


def _scan_for_writes(obj, out: set) -> None:
    """Recursively collect file paths from nested tool_use blocks."""
    if isinstance(obj, dict):
        ttype = obj.get("type")
        name = obj.get("name") or obj.get("tool_name")
        if ttype == "tool_use" and name in WRITE_TOOLS:
            inp = obj.get("input") or obj.get("tool_input") or {}
            if isinstance(inp, dict):
                fp = inp.get("file_path") or inp.get("path") or inp.get("notebook_path")
                if fp:
                    out.add(str(fp))
        for v in obj.values():
            _scan_for_writes(v, out)
    elif isinstance(obj, list):
        for v in obj:
            _scan_for_writes(v, out)


def main() -> int:
    try:
        data = json.load(sys.stdin)
    except Exception:
        data = {}

    session_id = data.get("session_id") or "unknown"
    cwd = data.get("cwd") or os.environ.get("CLAUDE_PROJECT_DIR") or os.getcwd()
    transcript_path = data.get("transcript_path") or ""
    trigger = data.get("trigger") or "unknown"
    hook_event = data.get("hook_event_name") or "unknown"
    compact_summary = data.get("compact_summary") or ""

    now = datetime.datetime.now()
    timestamp = now.strftime("%Y-%m-%d %H:%M:%S")
    date_slug = now.strftime("%Y%m%d_%H%M%S")

    project_dir = pathlib.Path(os.environ.get("CLAUDE_PROJECT_DIR") or cwd)
    project_name = project_dir.name

    handoff_dir = project_dir / "docs" / "handoff"
    handoff_file = handoff_dir / "HANDOFF.md"
    template_file = project_dir / ".claude" / "templates" / "handoff-format.md"
    archive_dir = handoff_dir / "archive"

    handoff_dir.mkdir(parents=True, exist_ok=True)
    archive_dir.mkdir(parents=True, exist_ok=True)

    modified: set = set()
    if transcript_path and os.path.isfile(transcript_path):
        try:
            with open(transcript_path, "r", encoding="utf-8", errors="ignore") as f:
                for line in f:
                    line = line.strip()
                    if not line:
                        continue
                    try:
                        _scan_for_writes(json.loads(line), modified)
                    except Exception:
                        continue
        except Exception:
            pass

    if modified:
        modified_files = "\n".join(f"- {p}" for p in sorted(modified))
    else:
        modified_files = "- (정보 없음 — Claude가 채워야 함)"

    status_map = {
        "PreCompact": f"compacting (trigger: {trigger})",
        "PostCompact": "compacted",
        "Stop": "completed",
        "SessionEnd": "session_ended",
    }
    status = status_map.get(hook_event, "in_progress")

    if handoff_file.is_file():
        try:
            with open(handoff_file, "r", encoding="utf-8", errors="ignore") as f:
                line_count = sum(1 for _ in f)
            if line_count > 500:
                handoff_file.rename(archive_dir / f"HANDOFF_{date_slug}.md")
        except Exception:
            pass

    context_value = compact_summary if compact_summary else "<!-- TODO: Claude가 작성 -->"

    mapping = {
        "{{TIMESTAMP}}": timestamp,
        "{{SESSION_ID}}": session_id,
        "{{PROJECT_NAME}}": project_name,
        "{{STATUS}}": status,
        "{{MODIFIED_FILES}}": modified_files,
        "{{SUMMARY}}": "<!-- TODO: Claude가 작성 -->",
        "{{COMPLETED}}": "<!-- TODO: Claude가 작성 -->",
        "{{DECISIONS}}": "<!-- TODO: Claude가 작성 -->",
        "{{NEXT_STEPS}}": "<!-- TODO: Claude가 작성 -->",
        "{{ISSUES}}": "<!-- TODO: Claude가 작성 -->",
        "{{CONTEXT}}": context_value,
    }

    if template_file.is_file():
        text = template_file.read_text(encoding="utf-8")
        for k, v in mapping.items():
            text = text.replace(k, v)
    else:
        text = (
            f"\n---\n## Handoff: {timestamp}\n"
            f"Session: {session_id} | Project: {project_name} | Status: {status}\n\n"
            f"### 수정된 파일\n{modified_files}\n\n"
            f"### 상태 요약\n<!-- TODO: Claude가 작성 -->\n\n"
            f"### 다음 단계\n<!-- TODO: Claude가 작성 -->\n"
        )

    with open(handoff_file, "a", encoding="utf-8") as f:
        f.write("\n" + text.rstrip() + "\n")

    print(
        json.dumps(
            {
                "message": (
                    f"핸드오프 템플릿이 {handoff_file} 에 생성되었습니다. "
                    "TODO 항목을 모두 채워주세요. "
                    f"템플릿 위치: {template_file}"
                )
            },
            ensure_ascii=False,
        )
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
