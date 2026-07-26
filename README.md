# CCTT — Claude Code Thinktank

CCTT는 Claude Code 위에서 동작하는 **multi-agent 연구 협업 시스템**이다. 한 명의 사용자가 던진 연구 주제를 여러 AI teammate가 병렬로 파고들고, team-lead가 rubric으로 품질을 끌어올리며, 최종적으로 ICLR 형식의 논문 산출물까지 이어지도록 설계되었다. 이 저장소는 그 협업을 굴리기 위한 **규칙(`CLAUDE.md`), 역할 정의(agents), 작업 노하우(skills), 세션 인계 자동화(hook)** 를 담는다.

> 실제 연구 산출물(`workspace/`, `team/`, `template/`, `writing_examples/`)은 `.gitignore`로 추적에서 제외된다. 이 저장소에 커밋되는 것은 **협업을 굴리는 골격**뿐이다.

> **처음 사용하시나요?** clone 직후 무엇부터 어떻게 하면 되는지는 [`HOW-TO-USE.md`](./HOW-TO-USE.md)에 단계별로 정리되어 있다. 사용법을 물으면 agent도 이 파일을 참조해 안내한다.

---

## 설계 철학

CCTT의 핵심은 세 가지 원칙으로 요약된다.

1. **사용자가 최종 판정자다.** Rubric 점수나 teammate 합의가 완결의 기준이 아니다. 모든 산출물은 궁극적으로 사용자의 요구사항과 수정 방향에 정렬되어야 하며, rubric 점수가 높아도 사용자 의도와 어긋나면 rubric 자체를 재설계한다.
2. **단일 산출물에 의존하지 않는다.** 각 task마다 관점·접근이 다른 teammate를 **병렬로 여러 명 spawn**하여 산출물을 비교·통합한다. 차이 자체가 품질 향상의 재료가 된다.
3. **멈추지 않는 rubric.** 매 라운드 rubric을 의도적으로 고도화한다. "충분히 좋다"는 정지점을 만들지 않고, 새로운 평가 축을 추가하거나 기존 기준치를 상향한다.

---

## 팀 구조

```
        ┌─────────────┐
        │    User     │  최상위 판정자 — 요구사항·수정 방향이 완결 기준
        └──────┬──────┘
               │
        ┌──────▼──────┐
        │  Team-lead  │  main agent — rubric 설계/고도화, 피드백 제공
        │             │  (산출물을 직접 수정하지 않음)
        └──────┬──────┘
               │ 병렬 spawn
   ┌───────────┼───────────┬───────────┐
   ▼           ▼           ▼           ▼
Teammate    Teammate    Teammate    Teammate   rubric 기반 피드백을 받고
(실험)      (증명)      (writing)    (...)      반복적으로 개선
```

- **User** — 최상위 판정자. 모든 rubric과 산출물은 사용자 의도에 정렬된다.
- **Team-lead** (main agent) — topic마다 multi-aspect rubric을 만들고 매 라운드 고도화한다. 산출물을 직접 substantively 수정하지 않고, rubric과 서면 피드백으로 teammate가 고치도록 유도한다.
- **Teammates** (spawned agents) — task마다 여러 명을 병렬 spawn한다. `.claude/agents/`에 역할별 정의(`professor`, `critic`, `judge`, `writer`)를 둔다.

---

## Rubric 시스템

평가 rubric은 multi-aspect로 구성하며, 각 aspect는 반드시 다음 세 가지를 명시한다.

1. **평가 목적** — 해당 aspect가 무엇을 측정하며 왜 중요한지
2. **평가 기준** — 각 점수 수준에 대한 구체적 기준
3. **점수 체계** — 명확한 anchor가 있는 수치 척도

평가 축은 **실험적 완결성과 이론적 완결성**을 모두 포괄해야 한다. Rubric은 `./team/` 또는 해당 topic 폴더에 저장하여 모든 teammate가 참조한다.

---

## 워크플로우

```
새 주제 → workspace/{topic}/ 생성
   │
   ├─ team-lead가 초기 rubric 작성
   │
   ▼
┌─────────────────────────────────────────┐
│  반복 루프 (topic 완결까지)               │
│                                          │
│  1. teammate 병렬 spawn → 산출물 생산     │
│  2. team-lead가 rubric으로 평가 + 피드백  │
│  3. teammate가 피드백 반영하여 수정       │
│  4. rubric 고도화 (기준 상향/축 추가)     │
│  5. 사용자 의도 정렬 점검                 │
└─────────────────────────────────────────┘
   │
   ▼
Writing 단계: template/ 를 topic 폴더에 복사
   → iclr2026_conference.tex 에 정리
   → research-paper-writing skill 활용
```

완결 기준은 **실험 + 이론 + 사용자 의도 정렬**이 모두 충족되는 시점이다.

---

## 저장소 구조

```
.
├── CLAUDE.md                  # 프로젝트 규칙 (팀/rubric/writing 규칙의 단일 출처)
├── README.md                  # 이 문서
├── .gitignore                 # 연구 산출물·로컬 설정 제외
└── .claude/
    ├── agents/                # teammate 역할 정의 (professor, critic, judge, writer)
    ├── hooks/
    │   └── handoff.py         # 세션 인계 자동화 hook
    └── skills/                # 작업 노하우 (아래 참조)
        ├── research-paper-writing/
        ├── extend-experimental-results/
        └── iterative-revision-collaboration/
```

추적에서 제외되는 작업 폴더(런타임에 생성):

- `workspace/{topic}/` — 연구 주제별 독립 workspace. **topic 간 엄격히 격리**되며 서로의 폴더에 접근하지 않는다.
- `team/` — agent 협업의 의사소통, rubric, 피드백 자료.
- `template/` — ICLR 2026 LaTeX 템플릿 원본. writing 시 topic 폴더로 복사하여 사용.
- `writing_examples/` — 논문 writing 스타일 참고 예시 (ex1: CCG, ex2: VSGD).

---

## Skills

`.claude/skills/`에는 반복되는 작업의 노하우가 재사용 가능한 형태로 정리되어 있다. 작업을 지시하면 team-lead가 상황에 맞는 것을 tool search로 찾아 쓴다. 각 skill의 언제·어떻게는 [`HOW-TO-USE.md`](./HOW-TO-USE.md)에 recipe로 정리되어 있다.

**Harness 운영 skill**

| Skill | 역할 |
|-------|------|
| **bootstrap-research-project** | 새 연구 주제를 세팅. `.claude` 골격 + wiki/team/docs/handoff/docs/resources 구조를 세우고, 최소 agent와 자기 개선형 adversarial loop를 배선한다. |
| **question-pool-review** | `eval/`의 사용자 소유 질문 풀로 페이퍼를 점검하고, reviewer/defender로 각 문항을 채점해 **모든 문항이 한 스냅샷에서 동시에 pass될 때까지** 피드백·수정을 반복한다. |
| **adversarial-review-loop** | hostile `reviewer`와 `defender`를 병렬로 세워 점수를 두고 debate하고, team-lead가 중재하며 overclaim 없이 근본 개선(근거·appendix 선제 방어·main 압축)을 반복한다. |

**Writing skill**

| Skill | 역할 |
|-------|------|
| **research-paper-writing** | ML/CV/NLP 논문을 reviewer-friendly 하게 작성·개선. Abstract/Introduction/Related Work/Method/Experiments/Conclusion의 구조·흐름·근거 정렬을 다룬다. |
| **extend-experimental-results** | 결과를 부풀리지 않으면서 실험 섹션을 확장·강화. probe 무결성 점검, success regime 규정, depth-first 확장, mechanism ablation, 정직한 통계 강화, fidelity-ladder 보고를 적용한다. |
| **polish-thy-main** | main을 load-bearing 핵심만 남기고, 부차·robustness·상세 유도를 appendix로 byte 단위 재배치하며 cross-reference와 figure 배치를 복구한다. |
| **iterative-revision-collaboration** | 사용자가 짧은 방향 지시를 주고 여러 후보안을 기대하며 직접 수정권을 유지하는, team-lead/teammate rubric 기반의 문장 단위 반복 수정 협업. |

대형 fan-out 자동화가 필요하면 `.claude/workflows/`의 `research-phase-polish-thy`(이론 감사·수리), `research-phase-polish-exps`(실험·figure·서술 개선)를 쓴다.

### 평가 질문 풀 (`eval/`)

`eval/`은 사용자가 지정한 평가 기준을 문항 단위로 쌓아 매 라운드 같은 기준으로 추적하는 **사용자 소유** 질문 은행이다. `criteria.md`(기준 인덱스), `questions/C*.md`(criterion별 문항), `CHANGELOG.md`(이력)로 구성되며 git으로 추적된다. agent는 풀을 직접 수정하지 않고 `team/qpool-candidates.md`에 후보만 제안하고, 사용자가 승인해 편입한다. `question-pool-review` skill이 이 풀을 소비한다. 관리 규칙은 [`eval/README.md`](./eval/README.md)를 본다.

---

## Writing 규칙

논문 작성 시 다음을 따른다.

1. **문장 위주 서술.** `()`, `;`, `:`, `-` 같은 기호를 구조적 연결자로 쓰지 않고 완전한 문장으로 쓴다.
2. **섹션 구조.** Introduction → Related Work → Formulation → (Theoretical Results) → Experimental Results → Conclusion.
3. **Experimental Results 패턴.** figure/table 언급 → 의미 설명 → 결과 서술 → "This result shows/demonstrates/indicates/suggests …" 로 마무리.
4. **Theoretical Results 패턴.** 핵심 lemma·theorem은 main body에 서사 흐름에 맞게 제시하고, 상세 증명·유도는 appendix에 둔다.
5. **스타일 참고.** `writing_examples/*.tex` 를 gold-standard 스타일로 따른다.

---

## 세션 인계 (Handoff Hook)

`.claude/hooks/handoff.py`는 `PreCompact` / `PostCompact` / `Stop` / `SessionEnd` 이벤트에서 동작한다. 세션 transcript를 스캔하여 그동안 수정된 파일 목록을 모으고, `docs/handoff/HANDOFF.md`에 템플릿화된 인계 항목을 추가한다. Python 표준 라이브러리만 사용하므로 `jq` 같은 외부 의존성이 없으며, `HANDOFF.md`가 500줄을 넘으면 `docs/handoff/archive/`로 자동 보관한다. 이를 통해 세션이 바뀌어도 작업 맥락이 끊기지 않고 이어진다.
