# CCTT — Thinktank Project Rules

## 저장소 사용법 안내 (사용자가 사용법을 물을 때)

이 저장소를 clone한 사용자가 "어떻게 쓰냐", "사용법", "뭐부터 하냐", "이 harness로 뭘 할 수 있냐" 등 사용 방법을 물으면, 먼저 `./HOW-TO-USE.md`를 읽고 그 내용을 바탕으로 안내한다. HOW-TO-USE.md는 clone 직후 준비, 제공되는 skill set 소개, 대표 작업 흐름(새 주제 부트스트랩 · 질문 풀 기반 피드백/수정 · 적대적 리뷰 방어 · main 압축 · 문장 다듬기), 질문 풀 관리 방법, 완결 기준을 담는다. 새 기능이 추가되면 HOW-TO-USE.md도 함께 갱신한다.

## Project Structure

이 저장소의 루트 자체가 하나의 연구 주제 workspace이다. 별도의 `workspace/{topic}/` 하위 폴더를 두지 않고, 이 공간 안에서 해당 주제의 모든 작업(실험, 이론, writing)을 관리한다.

- **LaTeX용 폴더** — writing을 관리하는 전용 LaTeX 폴더이다. 케이스마다 폴더 이름과 파일 구성이 다르므로 특정 이름에 의존하지 않고, 주어진 폴더의 기존 구조를 파악해서 그 안의 소스에 결과를 정리한다.
- **GitHub용 폴더** — 실험 코드를 관리하는 폴더이다. 보통 별도의 git 저장소로 관리되며, 여기서 실험을 실행하고 산출물(결과·figure)을 생성한다.
- `./team/` — agent team 협업 시 의사소통, rubric, 피드백 자료를 정리하는 폴더.
- `./writing_examples/` — 논문 writing 스타일 참고 예시.

각 폴더가 구체적으로 어느 것인지, 그리고 그 안의 내용과 역할은 사용자로부터 전달받아 이해한다. 어느 폴더가 LaTeX용이고 어느 폴더가 GitHub용인지 확인되지 않으면 임의로 추측해서 작업하지 말고, **항상 사용자에게 물어보고 확인받은 뒤 폴더를 구분**한다.

## Workspace 관리

이 저장소 = 현재 연구 주제이므로, 하나의 주제에 필요한 실험 폴더(GitHub용)와 writing 폴더(LaTeX용)가 이 루트 아래 공존한다. 실험 산출물과 writing 산출물의 역할을 뒤섞지 않고, 각자 주어진 폴더 안에서 관리한다. 폴더 구분이 불확실하면 진행하기 전에 사용자에게 확인한다.

## Workflow

1. 작업은 이 저장소 루트를 연구 주제 workspace로 삼아 진행한다. 새 workspace 하위 폴더를 만들지 않는다.
2. 각 task마다 **여러 teammate를 병렬로 spawn**하여 작업을 진행한다. 한 task에 단일 teammate로 끝내지 않고, 서로 다른 관점·접근의 산출물을 비교·통합하여 품질을 끌어올린다.
3. Writing 단계에서는 이 케이스에 주어진 LaTeX용 폴더 안의 소스에 결과를 정리한다. 템플릿을 새로 복사하지 않고 이미 주어진 폴더의 구조를 그대로 사용한다. 어느 폴더가 LaTeX용인지 확실하지 않으면 사용자에게 확인한다. 컴파일 방법은 아래 "LaTeX Compilation"을 따른다.
4. Writing 시 `research-paper-writing` skill을 활용한다.
5. 최종 판정 기준은 **사용자(team-lead 위의 user)의 요구사항과 수정 방향**이다. Rubric 점수나 teammate 합의가 아니라, 사용자의 의도와 부합하는지가 완결의 기준이다.

## Writing Rules

1. **문장 위주 서술.** `()`, `;`, `:`, `-` 같은 기호를 구조적 연결자로 사용하지 않는다. 완전한 문장으로 글을 작성한다.
2. **Section 구조.** Introduction → Related Work → Formulation → (Theoretical Results) → Experimental Results → Conclusion.
3. **Experimental Results 패턴.** figure/table 언급 → 의미 설명 → 결과 서술 → "This result shows/demonstrates/indicates/suggests …"로 마무리.
4. **Theoretical Results 패턴.** 핵심 lemma, theorem을 main body에서 서사 흐름에 맞게 제시한다. 상세 증명과 유도는 appendix에서 서술한다.
5. **스타일 참고.** `writing_examples/*.tex` 파일을 gold-standard 스타일로 따른다.

## LaTeX Compilation

논문 소스는 LaTeX용 폴더에서 관리한다. 컴파일 엔진은 **`tectonic`** (self-contained XeTeX)이며, `pdflatex`/`latexmk`/`xelatex`는 이 환경의 PATH에 없다. LaTeX용 폴더로 이동한 뒤 다음과 같이 각 `.tex` 소스를 컴파일한다.

```bash
cd <LaTeX용 폴더>
tectonic -X compile <문서>.tex   # → <문서>.pdf
```

참고문헌 처리와 다중 패스는 tectonic이 자동으로 수행한다. 상세한 절차·경고 해석·엔진 위치·설치 방법은 `./TOOL.md`의 "LaTeX 컴파일" 항목을 참조한다.

## TOOL.md (사용자 승인 도구·기능 모음)

`./TOOL.md`는 이 저장소에서 반복적으로 쓰는 도구·기능(LaTeX 컴파일, PDF 페이지 이미지 캡쳐 등)의 설치·실행 방법을 모아둔 파일이다. 담기는 내용은 **사용자가 직접 지시하고 명시적으로 승인한 것만**으로 한정한다. Agent(team-lead 포함)는 사용자가 이 파일에 넣으라고 직접 지시한 항목만 추가·수정하며, 스스로 판단해서 임의로 기록하지 않는다. 기존 항목을 수정·삭제할 때도 반드시 사용자에게 먼저 확인받는다. 자세한 쓰기 규칙은 `TOOL.md` 상단에 명시되어 있다.

## Harness 기능 (자주 쓰는 프롬프트 → Skill · Agent)

자주 반복하는 작업 흐름을 재사용 가능한 skill과 agent로 박아두었다. 작업 지시가 들어오면 상황과 목적에 맞는 것을 tool search로 찾아 활용한다. 세부 절차는 각 파일에 있으므로 여기서는 짧게만 설명한다.

- **`bootstrap-research-project` (skill).** 새 연구 주제를 탐색·공부할 때 이 저장소 루트에 harness 골격을 세운다. 기술 개발 프로젝트를 전제로 agent를 최소한으로 만들고, wiki 업데이트 skill과 질문 skill을 추가하며, PreCompact hook으로 세션 내용을 `docs/handoff/`에 세션별 개별 markdown으로 정리하도록 배선하고, 아래 폴더 경로를 CLAUDE.md에 등록한다. 핵심은 여러 agent를 병렬 spawn하는 자기 개선형 adversarial feedback loop다.
- **`adversarial-review-loop` (skill).** 논문을 reviewer 대 defender 적대적 루프로 근본적으로 개선한다. Team-lead가 중재자로서 hostile `reviewer`와 `defender`를 병렬 spawn해, reviewer는 점수를 어떻게든 낮추고 defender는 모든 반박을 appendix까지 동원해 미리 방어하며 점수를 올린다. 매 상태를 tectonic 컴파일과 snapshot으로 확인하고, overclaim 없이 main 본문을 압축(문단 첫 문장에 결론, margin·figure 조정 포함)한다. 통신은 `team/`에서 한다.
- **`question-pool-review` (skill).** `eval/`의 사용자 소유 질문 풀로 현재 페이퍼를 여러 기준에서 점검하고, reviewer/defender를 spawn해 각 문항을 `pass`/`partial`/`fail`로 판정한다. 완결 게이트는 점수 평균이 아니라, 하나의 컴파일·스냅샷 상태에서 **모든 문항이 동시에 pass**가 되는 것이다. 새 지적사항은 agent가 풀을 직접 고치지 않고 `team/qpool-candidates.md`에 후보로 제안하며, 사용자가 승인해 풀에 편입한다.
- **Agent 역할.** `reviewer`(적대적 OpenReview 리뷰어), `defender`(반박·보강 담당)는 위 루프들에서 쓰인다. 기존 `writer`·`critic`·`professor`·`judge`와 함께 `.claude/agents/`에 있다.

### 폴더 경로 (bootstrap이 세우는 지식 축적 구조)

- `wiki/` — 프로젝트 설명과 subtopic별 문서. 지속되는 지식 베이스.
- `team/` — agent-team 통신·rubric·피드백 로그 (gitignore 대상).
- `docs/handoff/` — 이전 세션 요약. PreCompact hook이 세션마다 개별 markdown으로 기록.
- `docs/resources/` — 사용자가 제공한 markdown과 웹 검색 결과. 출처마다 파일 하나.
- `eval/` — 사용자 소유 평가 질문 풀. `criteria.md`(기준 인덱스), `questions/`(criterion별 문항), `CHANGELOG.md`(변경 이력). git 추적되며 agent는 직접 수정하지 않고 후보만 제안한다.

## Agent Team & Rubric

### Team 구조
- **User**가 최상위 판정자이며, 모든 rubric과 산출물은 궁극적으로 user의 요구사항·수정 방향에 정렬되어야 한다.
- **Team-lead** (main agent)가 이 연구 주제에 대해 multi-aspect rubric을 생성하고 매 라운드마다 의도적으로 고도화한다. Team-lead가 산출물을 직접 substantively 수정하지 않으며, rubric과 피드백을 통해 teammate가 고치도록 유도한다.
- **Teammates** (spawned agents)는 task마다 여러 명을 병렬 spawn하며, rubric 기반 피드백을 받고 반복적으로 개선한다.
- Rubric은 `./team/`에 저장하여 모든 teammate가 참조할 수 있도록 한다.

### Rubric 구조 (multi-aspect)
각 평가 aspect는 반드시 다음 세 가지를 명시한다:
1. **평가 목적** — 해당 aspect가 무엇을 측정하며 왜 중요한지
2. **평가 기준** — 각 점수 수준에 대한 구체적 기준
3. **점수 체계** — 명확한 anchor가 있는 수치 척도

평가 aspect는 실험적 완결성과 이론적 완결성을 모두 포괄해야 한다.

### Team 운영 흐름
1. 연구 주제 시작 시 team-lead가 초기 rubric을 작성한다.
2. 한 task마다 **여러 teammate를 병렬 spawn**하여 산출물(실험, 증명, writing)을 생산한다.
3. Team-lead가 rubric에 따라 각 산출물을 평가하고 서면 피드백을 제공한다. 비교 가능한 다중 산출물의 차이도 피드백 자료로 활용한다.
4. Teammates가 피드백을 반영하여 수정한다.
5. **매 라운드 rubric을 의도적으로 고도화한다.** Teammate가 현재 기준을 충족했다고 안주하지 않도록, 새로운 평가 축을 추가하거나 기존 anchor의 기준치를 상향한다. "충분히 좋다"는 정지점을 만들지 않는다.
6. 산출물이 사용자(user)의 요구사항·수정 방향과 부합하는지를 매 라운드 점검한다. Rubric 점수가 높아도 user 의도와 어긋나면 rubric 자체를 재설계한다.
7. 연구 주제가 완결(실험 + 이론 + user 의도 정렬 모두 충족)될 때까지 이 루프를 반복한다.

### 피드백 방식 — Adversarial Feedback & PDF Snapshot

피드백은 teammate들이 서로에게 **adversarial feedback**을 주고받는 절차로 진행한다. 각 teammate는 자기 산출물을 내놓는 데 그치지 않고, 다른 teammate의 산출물을 회의적·비판적 관점에서 공격적으로 검토하여 약점을 드러낸다. 병렬로 spawn된 teammate들이 서로의 결과를 교차 검토하고, 이렇게 드러난 반박·허점을 근거로 서로를 보완·개선하여 품질을 끌어올린다. 목표는 합의가 아니라, 반박을 견뎌내며 강해진 산출물이다.

writing에 대한 adversarial feedback은 **항상 렌더링된 PDF를 근거로** 수행한다. LaTeX 소스만 보고 판단하지 않고, 다음 절차로 시각적 결과물까지 함께 검토한다.

1. 먼저 LaTeX 파일을 PDF로 컴파일한다 (위 "LaTeX Compilation" 참조).
2. 컴파일한 PDF의 각 페이지를 이미지로 캡쳐하여 `./team/snapshot/<세션 이름>/<문서 이름>/page_NN.png`에 저장한다. 하위 폴더는 **현재 대화 세션 이름**으로 구분하여, 세션마다 스냅샷이 섞이지 않게 한다.
3. teammate는 이 이미지 파일들을 지속적으로 열어, 글에 **어떤 내용이 담겨 있는지**와 그것이 지면에 **어떻게 보여지는지**(레이아웃, figure/table 배치, 넘침, 여백, 페이지 분할)를 함께 파악하고 피드백에 반영한다.
4. 산출물이 수정되면 다시 컴파일·캡쳐하여 스냅샷을 갱신하고, 갱신된 이미지를 근거로 다음 라운드 피드백을 이어간다.

컴파일과 캡쳐는 `./team/snapshot.py` 헬퍼로 한 번에 수행할 수 있다.

```bash
python team/snapshot.py --session <세션 이름> --latex-dir <LaTeX용 폴더>
```

이 스크립트는 LaTeX용 폴더의 최상위 문서(`\documentclass` 포함 `.tex`)를 tectonic으로 컴파일한 뒤 각 페이지를 PNG로 캡쳐하여 위 경로에 저장한다. `./team/`은 추적에서 제외되므로 스냅샷 이미지는 저장소에 커밋되지 않는다. 캡쳐 엔진·설치·직접 실행 코드는 `./TOOL.md`의 "PDF 페이지 이미지 캡쳐" 항목을 참조한다.
